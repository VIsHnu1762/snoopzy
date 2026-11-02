// Snoopzy core round engine. Pure logic, no network and no clock of its own:
// every function that depends on time takes `now` (ms) so it can be tested.
//
// Trust model: this is "friends-trust mode". The server runs the rules from the
// positions clients report. It flags mock locations but cannot prove positions.

export const DEFAULT_CONFIG = {
  hideMs: 120_000, // hiders scatter, seeker locked
  huntMs: 780_000, // hunt length (hide + hunt = 15 min)
  startRadius: 150, // metres
  // Zone drops to `radius` at huntT = `atMs` (after a warning of `warnMs`)
  rings: [
    { atMs: 240_000, radius: 100 },
    { atMs: 420_000, radius: 60 },
    { atMs: 600_000, radius: 30 },
    { atMs: 720_000, radius: 12 },
  ],
  warnMs: 60_000,
  graceMs: 10_000, // outside the zone this long = out
  tagHoldMs: 5_000,
  reviveHoldMs: 5_000,
  tagRangeM: 10, // distance minus both accuracies must be <= this
  reviveRangeM: 8,
  maxAccuracyM: 20,
  maxFixAgeMs: 5_000,
  shieldsEach: 2,
  pingEveryMs: 180_000, // seeker gets a ping on a random hider
  pingShowMs: 15_000,
  minPlayers: 2,
  maxPlayers: 8,
  caughtCanBeRevived: true,
};

const R = 6371000;
export function distanceM(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function createRound({ code, hostId, config = {}, rng = Math.random }) {
  return {
    code,
    hostId,
    rng,
    config: { ...DEFAULT_CONFIG, ...config },
    phase: 'lobby', // lobby | hide | hunt | over
    players: new Map(),
    order: [], // join order, used to rotate the seeker
    seekerIdx: 0,
    center: null,
    startedAt: null,
    huntStartedAt: null,
    endedAt: null,
    winner: null,
    holds: new Map(), // attackerId -> {kind, targetId, validSince}
    ping: null, // {targetId, until}
    nextPingAt: null,
    events: [], // full log for the recap
    roundNo: 0,
  };
}

function log(round, now, type, data = {}) {
  const e = { t: now, type, ...data };
  round.events.push(e);
  return e;
}

export function addPlayer(round, id, name) {
  if (round.phase !== 'lobby' && round.phase !== 'over') throw new Error('Round already started');
  if (!round.players.has(id) && round.players.size >= round.config.maxPlayers) throw new Error('Room is full');
  if (!round.players.has(id)) {
    round.players.set(id, {
      id, name: String(name || 'Player').slice(0, 16),
      role: null, status: 'lobby', shields: 0, fix: null, mockSeen: false,
      outsideSince: null, ready: false,
    });
    round.order.push(id);
  }
  return round.players.get(id);
}

export function removePlayer(round, id) {
  // During a round the player is kept (so scores/recap stay) but marked out.
  const p = round.players.get(id);
  if (!p) return;
  if (round.phase === 'lobby' || round.phase === 'over') {
    round.players.delete(id);
    round.order = round.order.filter((x) => x !== id);
    if (round.hostId === id) round.hostId = round.order[0] ?? null;
  }
}

export function updatePosition(round, id, fix, now) {
  const p = round.players.get(id);
  if (!p) return;
  const lat = Number(fix.lat), lng = Number(fix.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return;
  p.fix = { lat, lng, acc: Math.max(0, Number(fix.acc) || 0), at: now, mock: !!fix.mock };
  if (fix.mock) p.mockSeen = true;
}

export function startRound(round, now) {
  if (round.players.size < round.config.minPlayers) throw new Error(`Need at least ${round.config.minPlayers} players`);
  const host = round.players.get(round.hostId);
  if (!round.center) {
    const withFix = host?.fix ? host : [...round.players.values()].find((p) => p.fix);
    if (!withFix) throw new Error('Waiting for a GPS fix from the host');
    round.center = { lat: withFix.fix.lat, lng: withFix.fix.lng };
  }
  const ids = round.order.filter((id) => round.players.has(id));
  const seekerId = ids[round.seekerIdx % ids.length];
  for (const p of round.players.values()) {
    p.role = p.id === seekerId ? 'seeker' : 'hider';
    p.status = 'alive';
    p.shields = p.role === 'hider' ? round.config.shieldsEach : 0;
    p.outsideSince = null;
  }
  round.phase = 'hide';
  round.roundNo += 1;
  round.startedAt = now;
  round.huntStartedAt = now + round.config.hideMs;
  round.endedAt = null;
  round.winner = null;
  round.holds.clear();
  round.ping = null;
  round.events = [];
  round.nextPingAt = round.huntStartedAt + round.config.pingEveryMs;
  log(round, now, 'start', { seeker: seekerId, roundNo: round.roundNo });
}

export function nextRound(round) {
  // Rotate the seeker and go back to the lobby for a quick rematch.
  if (round.phase !== 'over') throw new Error('Round is not over');
  round.seekerIdx += 1;
  round.phase = 'lobby';
  for (const p of round.players.values()) { p.status = 'lobby'; p.role = null; p.shields = 0; }
}

// ---- zone ---------------------------------------------------------------

export function zoneAt(round, now) {
  const c = round.config;
  const huntT = now - round.huntStartedAt;
  let radius = c.startRadius;
  let next = null;
  for (const ring of c.rings) {
    if (huntT >= ring.atMs) radius = ring.radius;
    else { next = ring; break; }
  }
  const warning = !!next && huntT >= next.atMs - c.warnMs;
  return {
    center: round.center, radius,
    nextRadius: next ? next.radius : null,
    nextAtMs: next ? round.huntStartedAt + next.atMs : null,
    warning,
  };
}

// ---- holds (tag + revive) -----------------------------------------------

export function setHold(round, attackerId, kind, targetId, now) {
  const a = round.players.get(attackerId);
  if (!a) return;
  if (!kind) { round.holds.delete(attackerId); return; }
  if (round.phase !== 'hunt') return;
  if (kind === 'tag' && a.role !== 'seeker') return;
  if (kind === 'revive' && a.role !== 'hider') return;
  // targetId 'auto' (or empty) = whoever is nearest and eligible: a blind seeker cannot pick
  round.holds.set(attackerId, { kind, targetId: targetId || 'auto', validSince: null, resolved: null });
}

function holdValid(round, a, t, kind, now) {
  const c = round.config;
  if (!a || !t || a.status !== 'alive') return false;
  if (kind === 'tag' && (t.role !== 'hider' || t.status !== 'alive')) return false;
  if (kind === 'revive' && (t.role !== 'hider' || t.status !== 'caught' || a.shields < 1 || !c.caughtCanBeRevived)) return false;
  for (const p of [a, t]) {
    if (!p.fix) return false;
    if (now - p.fix.at >= c.maxFixAgeMs) return false;
    if (p.fix.acc > c.maxAccuracyM) return false;
    if (p.fix.mock) return false;
  }
  const d = distanceM(a.fix, t.fix) - a.fix.acc - t.fix.acc;
  return d <= (kind === 'tag' ? c.tagRangeM : c.reviveRangeM);
}

function nearestEligible(round, a, kind, now) {
  if (!a?.fix) return null;
  let best = null, bestD = Infinity;
  for (const p of round.players.values()) {
    if (p.id === a.id || p.role !== 'hider' || !p.fix) continue;
    if (kind === 'tag' && p.status !== 'alive') continue;
    if (kind === 'revive' && p.status !== 'caught') continue;
    const d = distanceM(a.fix, p.fix);
    if (d < bestD) { bestD = d; best = p; }
  }
  return best;
}

function resolveHolds(round, now, events) {
  const c = round.config;
  for (const [attackerId, h] of [...round.holds]) {
    const a = round.players.get(attackerId);
    let t = round.players.get(h.targetId);
    if (h.targetId === 'auto') {
      t = nearestEligible(round, a, h.kind, now);
      if (t?.id !== h.resolved) { h.validSince = null; h.resolved = t?.id ?? null; }
    }
    if (!holdValid(round, a, t, h.kind, now)) { h.validSince = null; continue; }
    if (h.validSince == null) h.validSince = now;
    const need = h.kind === 'tag' ? c.tagHoldMs : c.reviveHoldMs;
    if (now - h.validSince < need) continue;
    round.holds.delete(attackerId);
    if (h.kind === 'tag') {
      t.status = 'caught';
      t.outsideSince = null;
      events.push(log(round, now, 'tag', { by: a.id, target: t.id }));
    } else {
      a.shields -= 1;
      t.status = 'alive';
      t.outsideSince = null;
      events.push(log(round, now, 'revive', { by: a.id, target: t.id, shieldsLeft: a.shields }));
    }
  }
}

// ---- main tick ------------------------------------------------------------

export function tick(round, now) {
  const events = [];
  const c = round.config;
  if (round.phase === 'hide' && now >= round.huntStartedAt) {
    round.phase = 'hunt';
    events.push(log(round, now, 'hunt'));
  }
  if (round.phase !== 'hunt') return events;

  // zone: anyone outside for graceMs is out for good
  const z = zoneAt(round, now);
  for (const p of round.players.values()) {
    if (p.status !== 'alive' || !p.fix) continue;
    const outside = distanceM(p.fix, z.center) > z.radius;
    if (outside) {
      if (p.outsideSince == null) p.outsideSince = now;
      else if (now - p.outsideSince >= c.graceMs) {
        p.status = 'out';
        round.holds.delete(p.id);
        events.push(log(round, now, 'zone_out', { target: p.id }));
      }
    } else p.outsideSince = null;
  }

  resolveHolds(round, now, events);

  // seeker ping on a random living hider
  if (now >= round.nextPingAt) {
    const alive = [...round.players.values()].filter((p) => p.role === 'hider' && p.status === 'alive');
    if (alive.length) {
      const t = alive[Math.floor(round.rng() * alive.length)];
      round.ping = { targetId: t.id, until: now + c.pingShowMs };
      events.push(log(round, now, 'ping', { target: t.id }));
    }
    round.nextPingAt = now + c.pingEveryMs;
  }
  if (round.ping && now > round.ping.until) round.ping = null;

  // win checks
  const hiders = [...round.players.values()].filter((p) => p.role === 'hider');
  const alive = hiders.filter((p) => p.status === 'alive');
  const seeker = [...round.players.values()].find((p) => p.role === 'seeker');
  if (!alive.length) finish(round, now, 'seeker', events);
  else if (seeker && seeker.status === 'out') finish(round, now, 'hiders', events);
  else if (now >= round.huntStartedAt + c.huntMs) finish(round, now, 'hiders', events);
  return events;
}

function finish(round, now, winner, events) {
  round.phase = 'over';
  round.winner = winner;
  round.endedAt = now;
  round.holds.clear();
  events.push(log(round, now, 'end', { winner }));
}

// ---- views (what each player is allowed to see) ---------------------------

function band(d) {
  if (d < 15) return 'very close';
  if (d < 40) return 'close';
  if (d < 100) return 'near';
  return 'far';
}

export function viewFor(round, id, now) {
  const me = round.players.get(id);
  const spectator = me && (me.status === 'caught' || me.status === 'out' || round.phase === 'over');
  const players = [];
  for (const p of round.players.values()) {
    const entry = {
      id: p.id, name: p.name, status: p.status, shields: p.shields,
      role: round.phase === 'over' || p.id === id || spectator ? p.role : (me?.role === 'hider' && p.role === 'hider' ? 'hider' : null),
      mock: p.mockSeen,
    };
    let showPos = false;
    if (round.phase === 'lobby') showPos = false;
    else if (p.id === id || spectator) showPos = true;
    else if (me?.role === 'hider' && p.role === 'hider') showPos = true; // friends see each other
    else if (me?.role === 'seeker' && round.ping?.targetId === p.id && now <= round.ping.until) showPos = true;
    if (showPos && p.fix) entry.pos = { lat: p.fix.lat, lng: p.fix.lng, acc: p.fix.acc };
    players.push(entry);
  }
  const view = {
    code: round.code, phase: round.phase, host: round.hostId, roundNo: round.roundNo,
    you: id, role: me?.role ?? null, status: me?.status ?? null, shields: me?.shields ?? 0,
    now, players, winner: round.winner,
    config: { tagHoldMs: round.config.tagHoldMs, reviveHoldMs: round.config.reviveHoldMs },
  };
  if (round.phase === 'hide' || round.phase === 'hunt') {
    view.hideEndsAt = round.huntStartedAt;
    view.huntEndsAt = round.huntStartedAt + round.config.huntMs;
    view.zone = zoneAt(round, Math.max(now, round.huntStartedAt));
    if (round.phase === 'hide') view.zone.radius = round.config.startRadius;
    // Seeker is blind during the hide phase
    if (round.phase === 'hide' && me?.role === 'seeker') view.blind = true;
    // Hiders get a rough band for the seeker, never the exact position
    if (me?.role === 'hider' && round.phase === 'hunt' && me.fix) {
      const s = [...round.players.values()].find((p) => p.role === 'seeker');
      if (s?.fix) view.seekerBand = band(distanceM(me.fix, s.fix));
    }
    const h = round.holds.get(id);
    if (h) view.hold = { kind: h.kind, progress: h.validSince == null ? 0 : Math.min(1, (now - h.validSince) / (h.kind === 'tag' ? round.config.tagHoldMs : round.config.reviveHoldMs)) };
    // The seeker's own ping
    if (me?.role === 'seeker' && round.ping) view.pingUntil = round.ping.until;
  }
  if (round.phase === 'over') view.recap = recap(round);
  return view;
}

export function recap(round) {
  const name = (id) => round.players.get(id)?.name ?? '?';
  const lines = [];
  const stats = { tags: 0, revives: 0, zoneOuts: 0 };
  const saves = new Map();
  for (const e of round.events) {
    if (e.type === 'tag') { stats.tags++; lines.push({ t: e.t, text: `${name(e.by)} caught ${name(e.target)}` }); }
    if (e.type === 'revive') {
      stats.revives++;
      saves.set(e.by, (saves.get(e.by) ?? 0) + 1);
      lines.push({ t: e.t, text: `${name(e.by)} revived ${name(e.target)}` });
    }
    if (e.type === 'zone_out') { stats.zoneOuts++; lines.push({ t: e.t, text: `${name(e.target)} was caught outside the zone` }); }
  }
  let topSaver = null;
  for (const [id, n] of saves) if (!topSaver || n > topSaver.n) topSaver = { id, name: name(id), n };
  return {
    winner: round.winner,
    durationMs: (round.endedAt ?? 0) - (round.startedAt ?? 0),
    stats, topSaver, timeline: lines.map((l) => ({ ...l, t: l.t - round.startedAt })),
  };
}
