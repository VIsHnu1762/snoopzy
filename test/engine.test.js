import test from 'node:test';
import assert from 'node:assert/strict';
import { createRound, addPlayer, updatePosition, startRound, tick, setHold, zoneAt, viewFor, nextRound, distanceM } from '../src/engine.js';

const C = { lat: 11.0168, lng: 76.9558 };
// ~metres east of the centre
const east = (m) => ({ lat: C.lat, lng: C.lng + m / (111320 * Math.cos((C.lat * Math.PI) / 180)) });
const fix = (m, acc = 5, extra = {}) => ({ ...east(m), acc, ...extra });

function setup(n = 3, config = {}) {
  const r = createRound({ code: 'ABCD', hostId: 'p0', config, rng: () => 0 });
  for (let i = 0; i < n; i++) addPlayer(r, `p${i}`, `P${i}`);
  updatePosition(r, 'p0', fix(0), 0);
  startRound(r, 0);
  return r;
}
function toHunt(r) { tick(r, r.huntStartedAt); assert.equal(r.phase, 'hunt'); return r.huntStartedAt; }
function place(r, id, m, now, acc = 5, extra) { updatePosition(r, id, fix(m, acc, extra), now); }

test('distance helper is about right', () => {
  assert.ok(Math.abs(distanceM(C, east(100)) - 100) < 1);
});

test('start assigns one seeker, shields to hiders, rotates on rematch', () => {
  const r = setup(3);
  assert.equal(r.players.get('p0').role, 'seeker');
  assert.equal(r.players.get('p1').shields, 2);
  assert.equal(r.players.get('p0').shields, 0);
  r.phase = 'over';
  nextRound(r);
  updatePosition(r, 'p0', fix(0), 1);
  startRound(r, 1);
  assert.equal(r.players.get('p1').role, 'seeker');
});

test('needs two players and a host fix', () => {
  const r = createRound({ code: 'X', hostId: 'a' });
  addPlayer(r, 'a', 'A');
  assert.throws(() => startRound(r, 0), /at least 2/);
  addPlayer(r, 'b', 'B');
  assert.throws(() => startRound(r, 0), /GPS fix/);
});

test('seeker is blind and cannot tag during the hide phase', () => {
  const r = setup(2);
  place(r, 'p0', 0, 1000); place(r, 'p1', 2, 1000);
  setHold(r, 'p0', 'tag', 'p1', 1000);
  tick(r, 10_000);
  assert.equal(r.players.get('p1').status, 'alive');
  assert.equal(viewFor(r, 'p0', 1000).blind, true);
});

test('tag needs 5 s of valid proximity', () => {
  const r = setup(2);
  const t0 = toHunt(r);
  place(r, 'p0', 0, t0); place(r, 'p1', 6, t0);
  setHold(r, 'p0', 'tag', 'p1', t0);
  for (let s = 0; s < 5; s++) { // 0..4 s: still alive
    place(r, 'p0', 0, t0 + s * 1000); place(r, 'p1', 6, t0 + s * 1000);
    tick(r, t0 + s * 1000);
    assert.equal(r.players.get('p1').status, 'alive');
  }
  place(r, 'p0', 0, t0 + 5000); place(r, 'p1', 6, t0 + 5000);
  tick(r, t0 + 5000);
  assert.equal(r.players.get('p1').status, 'caught');
  assert.equal(r.phase, 'over');
  assert.equal(r.winner, 'seeker');
});

test('hider escaping the range resets the hold', () => {
  const r = setup(3);
  const t0 = toHunt(r);
  setHold(r, 'p0', 'tag', 'p1', t0);
  for (let s = 0; s < 4; s++) { place(r, 'p0', 0, t0 + s * 1000); place(r, 'p1', 5, t0 + s * 1000); place(r, 'p2', 40, t0 + s * 1000); tick(r, t0 + s * 1000); }
  place(r, 'p0', 0, t0 + 4000); place(r, 'p1', 60, t0 + 4000); place(r, 'p2', 40, t0 + 4000); tick(r, t0 + 4000); // escaped
  for (let s = 5; s < 9; s++) { place(r, 'p0', 0, t0 + s * 1000); place(r, 'p1', 5, t0 + s * 1000); place(r, 'p2', 40, t0 + s * 1000); tick(r, t0 + s * 1000); }
  assert.equal(r.players.get('p1').status, 'alive', 'timer restarted, only 4 s since return');
});

test('stale fix, poor accuracy and mock locations block a tag', () => {
  for (const [label, a, b] of [
    ['stale', { acc: 5 }, { acc: 5, stale: true }],
    ['inaccurate', { acc: 5 }, { acc: 30 }],
    ['mock', { acc: 5, mock: true }, { acc: 5 }],
  ]) {
    const r = setup(3);
    const t0 = toHunt(r);
    setHold(r, 'p0', 'tag', 'p1', t0);
    for (let s = 0; s <= 6; s++) {
      const now = t0 + s * 1000;
      place(r, 'p0', 0, now, a.acc, { mock: a.mock });
      if (!b.stale) place(r, 'p1', 3, now, b.acc); else if (s === 0) place(r, 'p1', 3, now, b.acc);
      place(r, 'p2', 40, now);
      tick(r, now);
    }
    assert.equal(r.players.get('p1').status, 'alive', label);
  }
});

test('accuracy is subtracted from distance (close enough with noisy GPS)', () => {
  const r = setup(3);
  const t0 = toHunt(r);
  setHold(r, 'p0', 'tag', 'p1', t0);
  for (let s = 0; s <= 5; s++) { const n = t0 + s * 1000; place(r, 'p0', 0, n, 8); place(r, 'p1', 24, n, 8); place(r, 'p2', 50, n); tick(r, n); }
  assert.equal(r.players.get('p1').status, 'caught'); // 24 - 8 - 8 = 8 <= 10
});

test('only the seeker can tag; only hiders revive', () => {
  const r = setup(3);
  const t0 = toHunt(r);
  setHold(r, 'p1', 'tag', 'p2', t0);
  assert.equal(r.holds.size, 0);
  setHold(r, 'p0', 'revive', 'p1', t0);
  assert.equal(r.holds.size, 0);
});

test('revive uses a shield and brings a caught hider back', () => {
  const r = setup(4);
  const t0 = toHunt(r);
  r.players.get('p1').status = 'caught';
  setHold(r, 'p2', 'revive', 'p1', t0);
  for (let s = 0; s <= 5; s++) { const n = t0 + s * 1000; place(r, 'p0', 100, n); place(r, 'p1', 0, n); place(r, 'p2', 3, n); place(r, 'p3', 20, n); tick(r, n); }
  assert.equal(r.players.get('p1').status, 'alive');
  assert.equal(r.players.get('p2').shields, 1);
  assert.equal(r.phase, 'hunt');
});

test('no shield, no revive', () => {
  const r = setup(4);
  const t0 = toHunt(r);
  r.players.get('p1').status = 'caught';
  r.players.get('p2').shields = 0;
  setHold(r, 'p2', 'revive', 'p1', t0);
  for (let s = 0; s <= 6; s++) { const n = t0 + s * 1000; place(r, 'p0', 100, n); place(r, 'p1', 0, n); place(r, 'p2', 3, n); place(r, 'p3', 20, n); tick(r, n); }
  assert.equal(r.players.get('p1').status, 'caught');
});

test('zone shrinks on schedule and warns 60 s before', () => {
  const r = setup(2);
  const t0 = toHunt(r);
  assert.equal(zoneAt(r, t0).radius, 150);
  assert.equal(zoneAt(r, t0 + 170_000).warning, false);
  assert.equal(zoneAt(r, t0 + 190_000).warning, true);
  assert.equal(zoneAt(r, t0 + 240_000).radius, 100);
  assert.equal(zoneAt(r, t0 + 720_000).radius, 12);
});

test('standing outside the zone for 10 s puts you out; reentering resets', () => {
  const r = setup(3);
  const t0 = toHunt(r);
  place(r, 'p0', 0, t0);
  for (let s = 0; s < 9; s++) { place(r, 'p1', 200, t0 + s * 1000); place(r, 'p2', 5, t0 + s * 1000); tick(r, t0 + s * 1000); }
  place(r, 'p1', 50, t0 + 9000); tick(r, t0 + 9000); // back inside
  assert.equal(r.players.get('p1').status, 'alive');
  for (let s = 10; s <= 21; s++) { place(r, 'p1', 200, t0 + s * 1000); place(r, 'p2', 5, t0 + s * 1000); place(r, 'p0', 0, t0 + s * 1000); tick(r, t0 + s * 1000); }
  assert.equal(r.players.get('p1').status, 'out');
  assert.ok(r.events.some((e) => e.type === 'zone_out'));
});

test('hiders win when time runs out', () => {
  const r = setup(3);
  const t0 = toHunt(r);
  place(r, 'p0', 0, t0); place(r, 'p1', 5, t0); place(r, 'p2', 6, t0);
  const ev = tick(r, t0 + r.config.huntMs);
  assert.equal(r.phase, 'over');
  assert.equal(r.winner, 'hiders');
  assert.ok(ev.some((e) => e.type === 'end'));
});

test('seeker gets a ping on a hider every 3 minutes', () => {
  const r = setup(3);
  const t0 = toHunt(r);
  place(r, 'p0', 0, t0); place(r, 'p1', 5, t0); place(r, 'p2', 6, t0);
  tick(r, t0 + 180_000);
  assert.ok(r.ping);
  const v = viewFor(r, 'p0', t0 + 180_000);
  assert.equal(v.players.filter((p) => p.id !== 'p0' && p.pos).length, 1);
});

test('views never leak the seeker or hiders to the wrong people', () => {
  const r = setup(3);
  const t0 = toHunt(r);
  place(r, 'p0', 0, t0); place(r, 'p1', 30, t0); place(r, 'p2', 31, t0);
  const seekerView = viewFor(r, 'p0', t0);
  assert.equal(seekerView.players.find((p) => p.id === 'p1').pos, undefined);
  const hiderView = viewFor(r, 'p1', t0);
  assert.equal(hiderView.players.find((p) => p.id === 'p0').pos, undefined);
  assert.ok(hiderView.players.find((p) => p.id === 'p2').pos);
  assert.ok(['close', 'near'].includes(hiderView.seekerBand));
  assert.equal(hiderView.players.find((p) => p.id === 'p0').role, null);
});

test('recap lists catches and revives', () => {
  const r = setup(3);
  const t0 = toHunt(r);
  for (let s = 0; s <= 5; s++) { const n = t0 + s * 1000; place(r, 'p0', 0, n); place(r, 'p1', 3, n); place(r, 'p2', 80, n); if (s === 0) setHold(r, 'p0', 'tag', 'p1', n); tick(r, n); }
  tick(r, t0 + r.config.huntMs);
  const v = viewFor(r, 'p2', t0 + r.config.huntMs);
  assert.equal(v.recap.stats.tags, 1);
  assert.equal(v.recap.winner, 'hiders');
});

test('auto-target tag picks the nearest hider without the seeker choosing', () => {
  const r = setup(4);
  const t0 = toHunt(r);
  setHold(r, 'p0', 'tag', null, t0);
  for (let s = 0; s <= 5; s++) { const n = t0 + s * 1000; place(r, 'p0', 0, n); place(r, 'p1', 60, n); place(r, 'p2', 4, n); place(r, 'p3', 70, n); tick(r, n); }
  assert.equal(r.players.get('p2').status, 'caught');
  assert.equal(r.players.get('p1').status, 'alive');
});
