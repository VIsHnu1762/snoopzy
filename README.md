# Snoopzy: Hide & Seek IRL

Real-world multiplayer hide and seek and battle royale, played with friends using live phone GPS. Join a room with a code, set your own rules, and play in your actual neighbourhood.

- **Modes:** Hide & Seek, Battle Royale, Capture the Flag, Zombie Tag
- **Platform:** Android first (Flutter), iOS later
- **Backend:** Firebase (Realtime Database, Auth, Cloud Functions, FCM), Mapbox maps

## Docs

- [Product plan](docs/PRODUCT_PLAN.md): vision, modes, rules engine, screens, architecture, data model, safety, roadmap and risks
- [Core concept and MVP test plan](docs/CORE_CONCEPT.md): the one round that must be fun, and how we test it
- [Competitor notes](docs/COMPETITORS.md): ShadowHunt and Manhunt compared
- [Game concept and rulebook](docs/GAME_CONCEPT_RULEBOOK.md)
- [Hide & Seek Royale: modes, zone and roles](docs/HIDE_SEEK_ROYALE.md)
- [MVP scope: what is necessary](docs/MVP_SCOPE.md)
- [Complete feature list](docs/FEATURE_LIST.md)
- [Technical design doc](docs/TECHNICAL_DESIGN.md)
- [Device, permissions and risk guide](docs/DEVICE_PERMISSIONS_RISK.md)
- [Games for every audience and region](docs/AUDIENCE_REGION.md)
- [Coimbatore launch map analysis](docs/COIMBATORE_LAUNCH.md)
- [Brand identity ideas](docs/BRAND_IDENTITY.md)

Note: the feature list, audience, Coimbatore and MVP docs were exported as plain text, so their tables are less tidy than the others. Embedded diagrams are not included.

## Try it

Requires Node 22 or newer.

```
npm install
npm start          # http://localhost:3000
npm test           # 20 tests: rules engine + a full round over WebSockets
```

Open the page on each friend's phone (same network, or host it somewhere with HTTPS, because phone browsers only share GPS on secure pages). One person creates a room and shares the 4-letter code. A **practice room** shortens the round to about 3 minutes and allows simulated GPS (arrow keys or on-screen buttons), so you can try the whole loop at a desk.

## What is built (web prototype of the core round)

- Room codes, lobby, host starts, seeker rotates each rematch.
- Hide phase with the seeker blind, then a hunt with a shrinking zone (60 s warning, 10 s grace, then out).
- Hold-to-tag: seeker holds the button 5 s while within range of a hider. The timer resets if either player moves out of range or a GPS fix is stale (5 s or older), inaccurate (over 20 m) or flagged as mocked.
- Revive: a hider with a shield holds near a caught friend for 5 s. Two shields each.
- Seeker gets a ping on a random hider every 3 minutes; hiders see only a distance band for the seeker.
- End-of-round recap and one-tap rematch.

Code: `src/engine.js` (rules, no network), `src/server.js` (rooms and WebSockets), `public/index.html` (client).

## What is not built or not proven

- **Not tested outdoors.** The rules are tested with simulated positions. Real GPS drift, phone battery saving and browser background limits are unproven; run the paper round and a real beta before trusting the numbers.
- **Browser only.** No Android app yet (Flutter and the native location service are not set up). A browser stops sharing location when the screen locks, so players must keep the page open.
- **Friends-trust mode.** The server runs the rules but cannot prove a phone is honest. Fine for friends, not for strangers.
- No accounts, no persistence (rooms live in memory), no voice, no secret twist role, no map tiles (the map is a simple zone diagram).
- Caught hiders sit out and can be revived; the other options (become a seeker or helper) are open questions in the core concept doc.

## Status

Playable web prototype of the core round. Next: run the paper round and a real outdoor test, then decide on the Android build.
