// End-to-end: real server + real WebSocket clients ("bots") play a full practice round
// against a controllable clock. Proves the wire protocol, the views and the rules together.
import test from 'node:test';
import assert from 'node:assert/strict';
import WebSocket from 'ws';
import { createGameServer } from '../src/server.js';

const C = { lat: 11.0168, lng: 76.9558 };
const at = (e, n) => ({ lat: C.lat + n / 111320, lng: C.lng + e / (111320 * Math.cos((C.lat * Math.PI) / 180)) });

class Bot {
  constructor(port, name) { this.name = name; this.port = port; this.state = null; this.errors = []; this.pos = { e: 0, n: 0 }; }
  open(first) {
    return new Promise((resolve) => {
      this.ws = new WebSocket(`ws://localhost:${this.port}`);
      this.ws.on('open', () => this.ws.send(JSON.stringify(first)));
      this.ws.on('message', (raw) => {
        const m = JSON.parse(raw);
        if (m.t === 'joined') { this.id = m.id; this.code = m.code; resolve(); }
        if (m.t === 'state') this.state = m.state;
        if (m.t === 'error') this.errors.push(m.message);
      });
    });
  }
  send(m) { this.ws.send(JSON.stringify(m)); }
  move(e, n) { this.pos = { e, n }; }
  report() { this.send({ t: 'pos', ...at(this.pos.e, this.pos.n), acc: 4, demo: true }); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test('four bots play a full practice round over WebSockets', async () => {
  let clock = 1_000_000;
  const srv = await createGameServer({ port: 0, now: () => clock, tickMs: 15, maxMsgPerSec: 10_000 });
  const step = async (ms = 1000) => { clock += ms; bots.forEach((b) => b.report()); await sleep(40); };
  const [host, b, c, d] = ['Host', 'Bea', 'Cal', 'Dee'].map((n) => new Bot(srv.port, n));
  const bots = [host, b, c, d];
  try {
    await host.open({ t: 'create', name: 'Host', practice: true });
    for (const x of [b, c, d]) await x.open({ t: 'join', code: host.code, name: x.name });
    host.report(); await sleep(50);

    // a stranger cannot join a room that does not exist
    const lost = new Bot(srv.port, 'Lost'); lost.ws = new WebSocket(`ws://localhost:${srv.port}`);
    await new Promise((r) => lost.ws.on('open', r));
    lost.ws.on('message', (raw) => { const m = JSON.parse(raw); if (m.t === 'error') lost.errors.push(m.message); });
    lost.send({ t: 'join', code: 'ZZZZ', name: 'x' }); await sleep(50);
    assert.deepEqual(lost.errors, ['Room not found']);

    // only the host can start
    b.send({ t: 'start' }); await sleep(50);
    assert.match(b.errors.at(-1), /Only the host/);

    host.send({ t: 'start' }); await sleep(60);
    assert.equal(host.state.phase, 'hide');
    assert.equal(host.state.role, 'seeker');
    assert.equal(host.state.blind, true);
    assert.equal(b.state.role, 'hider');
    assert.equal(b.state.shields, 2);

    // hide phase (15 s): hiders spread out, seeker waits at the centre
    host.move(0, 0); b.move(20, 0); c.move(-20, 0); d.move(0, 25);
    for (let i = 0; i < 15; i++) await step();
    await step();
    assert.equal(host.state.phase, 'hunt');

    // the seeker's view must not contain any hider position (no ping yet)
    assert.equal(host.state.players.filter((p) => p.id !== host.id && p.pos).length, 0, 'seeker sees no hiders');
    // hiders see each other but never the seeker's exact position
    assert.ok(b.state.players.find((p) => p.name === 'Cal').pos);
    assert.equal(b.state.players.find((p) => p.name === 'Host').pos, undefined);
    assert.ok(['far', 'near', 'close', 'very close'].includes(b.state.seekerBand));

    // seeker walks to Bea and holds tag
    host.move(19, 0);
    host.send({ t: 'hold', kind: 'tag' });
    for (let i = 0; i < 4; i++) await step();
    assert.ok(host.state.hold.progress > 0 && host.state.hold.progress < 1, "tag progress shows mid-hold");
    for (let i = 0; i < 3; i++) await step();
    assert.equal(host.state.players.find((p) => p.name === 'Bea').status, 'caught');

    host.send({ t: 'release' });
    // Cal runs over and revives Bea using a shield
    c.move(22, 0);
    c.send({ t: 'hold', kind: 'revive' });
    host.move(-30, 10); // seeker wanders off
    for (let i = 0; i < 7; i++) await step();
    assert.equal(b.state.players.find((p) => p.name === 'Bea').status, 'alive');
    assert.equal(c.state.shields, 1);

    // Dee walks out of the zone and stays for 12 s
    d.move(0, 120);
    for (let i = 0; i < 12; i++) await step();
    assert.equal(d.state.status, 'out');

    // run out the clock: the surviving hiders win
    host.move(0, 8); b.move(3, 0); c.move(-3, 0); // everyone stays inside the final 12 m ring
    for (let i = 0; i < 160 && host.state.phase !== 'over'; i++) await step();
    assert.equal(host.state.phase, 'over');
    assert.equal(host.state.winner, 'hiders');
    const r = host.state.recap;
    assert.equal(r.stats.tags, 1);
    assert.equal(r.stats.revives, 1);
    assert.equal(r.stats.zoneOuts, 1);
    assert.equal(r.topSaver.name, 'Cal');

    // rematch rotates the seeker
    host.send({ t: 'next' }); await sleep(50);
    assert.equal(host.state.phase, 'lobby');
    host.report(); host.send({ t: 'start' }); await sleep(60);
    assert.equal(b.state.role, 'seeker');
  } finally {
    bots.forEach((x) => x.ws?.close());
    await srv.close();
  }
});

test('simulated GPS is refused in a normal (non-practice) room', async () => {
  let clock = 5_000_000;
  const srv = await createGameServer({ port: 0, now: () => clock, tickMs: 15, maxMsgPerSec: 10_000 });
  const h = new Bot(srv.port, 'H'), g = new Bot(srv.port, 'G');
  try {
    await h.open({ t: 'create', name: 'H', practice: false });
    await g.open({ t: 'join', code: h.code, name: 'G' });
    h.report(); g.report(); await sleep(50);
    h.send({ t: 'start' }); await sleep(60);
    assert.match(h.errors.at(-1), /GPS fix/); // the demo fix was ignored, so no fix at all
  } finally {
    h.ws.close(); g.ws.close(); await srv.close();
  }
});
