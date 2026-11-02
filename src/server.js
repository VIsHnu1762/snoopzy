// Snoopzy server: static web client + WebSocket rooms around the round engine.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import {
  createRound, addPlayer, removePlayer, updatePosition, startRound, nextRound,
  setHold, tick, viewFor,
} from './engine.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(here, '..', 'public');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

// Short timings so a group can try the whole loop in about 3 minutes.
export const PRACTICE = {
  hideMs: 15_000, huntMs: 150_000, startRadius: 60,
  rings: [{ atMs: 50_000, radius: 40 }, { atMs: 90_000, radius: 25 }, { atMs: 120_000, radius: 12 }],
  warnMs: 10_000, pingEveryMs: 40_000, allowDemo: true,
};

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newCode = (taken) => {
  for (;;) {
    let c = '';
    for (let i = 0; i < 4; i++) c += CODE_CHARS[crypto.randomInt(CODE_CHARS.length)];
    if (!taken.has(c)) return c;
  }
};

export function createGameServer({ port = 0, now = () => Date.now(), tickMs = 1000, maxMsgPerSec = 20 } = {}) {
  const rooms = new Map(); // code -> { round, sockets: Map<playerId, ws>, lastActive }
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/health') { res.end('ok'); return; }
    let file = path.normalize(path.join(PUBLIC, url.pathname === '/' ? 'index.html' : url.pathname));
    if (!file.startsWith(PUBLIC)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404).end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
      res.end(data);
    });
  });
  const wss = new WebSocketServer({ server, maxPayload: 4096 });

  const send = (ws, msg) => { if (ws.readyState === 1) ws.send(JSON.stringify(msg)); };
  const broadcast = (room) => {
    const t = now();
    for (const [id, ws] of room.sockets) send(ws, { t: 'state', state: viewFor(room.round, id, t) });
  };

  wss.on('connection', (ws) => {
    let room = null;
    let me = null;
    let lastMsg = 0, burst = 0;

    ws.on('message', (raw) => {
      // very small per-connection rate limit (default 20 messages per second)
      const t0 = Date.now();
      if (t0 - lastMsg > 1000) { lastMsg = t0; burst = 0; }
      if (++burst > maxMsgPerSec) return;
      let m;
      try { m = JSON.parse(raw); } catch { return; }
      const fail = (msg) => send(ws, { t: 'error', message: msg });
      try {
        if (m.t === 'create') {
          const code = newCode(rooms);
          const round = createRound({
            code, hostId: null, config: m.practice ? PRACTICE : {},
          });
          room = { round, sockets: new Map(), lastActive: t0 };
          rooms.set(code, room);
          me = crypto.randomUUID();
          round.hostId = me;
          addPlayer(round, me, m.name);
          room.sockets.set(me, ws);
          send(ws, { t: 'joined', code, id: me });
        } else if (m.t === 'join' || m.t === 'rejoin') {
          const r = rooms.get(String(m.code || '').toUpperCase());
          if (!r) return fail('Room not found');
          room = r;
          if (m.t === 'rejoin' && r.round.players.has(m.id)) me = m.id;
          else {
            me = crypto.randomUUID();
            addPlayer(r.round, me, m.name);
          }
          room.sockets.get(me)?.close();
          room.sockets.set(me, ws);
          send(ws, { t: 'joined', code: r.round.code, id: me });
        } else if (!room || !me) {
          return fail('Join a room first');
        } else if (m.t === 'pos') {
          if (m.demo && !room.round.config.allowDemo) return; // simulated GPS only in practice rooms
          updatePosition(room.round, me, { ...m, mock: m.demo ? false : !!m.mock }, now());
        } else if (m.t === 'start') {
          if (room.round.hostId !== me) return fail('Only the host can start');
          startRound(room.round, now());
        } else if (m.t === 'hold') {
          setHold(room.round, me, m.kind, null, now());
        } else if (m.t === 'release') {
          setHold(room.round, me, null, null, now());
        } else if (m.t === 'next') {
          if (room.round.hostId !== me) return fail('Only the host can start the next round');
          nextRound(room.round);
        }
        room.lastActive = t0;
        if (m.t !== 'pos') broadcast(room);
      } catch (e) {
        fail(e.message);
      }
    });

    ws.on('close', () => {
      if (!room || !me) return;
      if (room.sockets.get(me) === ws) {
        room.sockets.delete(me);
        removePlayer(room.round, me);
        if (room.round.hostId == null && room.sockets.size) room.round.hostId = [...room.sockets.keys()][0];
        broadcast(room);
      }
    });
  });

  const timer = setInterval(() => {
    const t = now();
    for (const [code, room] of rooms) {
      if (!room.sockets.size && Date.now() - room.lastActive > 30 * 60_000) { rooms.delete(code); continue; }
      tick(room.round, t);
      if (room.round.phase !== 'lobby') broadcast(room);
    }
  }, tickMs);

  return new Promise((resolve) => {
    server.listen(port, () => {
      resolve({
        port: server.address().port, rooms,
        close: () => new Promise((r) => { clearInterval(timer); wss.clients.forEach((c) => c.terminate()); wss.close(); server.close(r); }),
      });
    });
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 3000;
  createGameServer({ port }).then(() => console.log(`Snoopzy running on http://localhost:${port}`));
}
