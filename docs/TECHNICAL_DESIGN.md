# Snoopzy — Technical Design Doc (Developer Notes)

Oct 29, 2026 · @vishnu

## Scope and goals

v1 is an Android app (Flutter, with native Kotlin where Bluetooth and location need it) that runs a full Hide & Seek match for 3 to 12 friends at one venue, with server-validated tags, Revive Shields, a recap and squads. Game rules are in the companion *Game Concept & Rulebook*; this doc is how to build it.

**In scope for v1 (MVP)**

- Guest and phone-number sign-in, player profile, squads.
- Private rooms with 6-character codes, QR and invite links; lobby with text chat.
- Venue check-in (GPS inside area + Bluetooth handshake with a checked-in player).
- Hide & Seek mode with rules engine, radar, pings, heartbeat haptics, area squeeze.
- Tags and revives proved by GPS + rotating Bluetooth tokens, validated server-side.
- Recap: awards, route replay, squad stats.

**Next (v1.1 to v1.3):** Battle Royale, Zombie Tag, Capture the Flag, voice chat, power-ups, UWB precision tags, spectator delay feed, Open Nearby lobbies.

**Non-goals for v1:** iOS, cross-venue or remote play, AR camera features, monetization, public matchmaking.

**Engineering targets**

| Metric | Target |
| --- | --- |
| Position update visible to other players | under 2 s end to end on 4G |
| Tag decision (tap to result) | under 1 s on 4G |
| Battery use, 20-minute match, screen mostly off | under 8% on a mid-range phone |
| Mobile data, 20-minute match, 8 players, no voice | under 5 MB |
| Crash-free sessions | above 99% |
| Cold start to Home screen | under 2 s on a mid-range phone |
| Minimum Android version | Android 10 (API 29); target the latest API Play requires |

## System architecture

Phones report what they sense (GPS fixes, Bluetooth tokens heard); the server turns that into game decisions and per-player views. No phone ever sees another player's raw position.

&#91;embedded content: system architecture · phones, Firebase, match ticker\]

The dashed line is the only phone-to-phone link: Bluetooth tokens that prove two players are physically close. Everything else goes through Firebase, with the match ticker and functions as the only writers of game state.

## Tech stack and key packages

Flutter for all UI and game logic; a thin native Kotlin layer for the parts Flutter plugins do poorly (foreground service, Bluetooth advertising with rotating payloads, UWB). Versions are pinned at project setup; check pub.dev for current releases.

| Area | Choice | Notes |
| --- | --- | --- |
| App framework | Flutter (stable), Dart 3 | Android first; iOS-ready structure |
| State management | Riverpod | Testable providers; match state as streams |
| Navigation | go\_router | Deep links for invite URLs (`<your-domain>/j/K7PX2M`) |
| Maps | Mapbox Maps SDK for Flutter (`mapbox_maps_flutter`) | Custom dark style, offline tile packs for venues |
| Location | Native Kotlin `FusedLocationProviderClient` in a foreground service, bridged by a platform channel | Flutter plugins (e.g. `geolocator`) fine for prototyping |
| BLE scan | `flutter_blue_plus` or native `BluetoothLeScanner` | Scans for the Snoopzy service UUID only |
| BLE advertise | Native `BluetoothLeAdvertiser` (Kotlin) | Flutter options exist (`flutter_ble_peripheral`), but rotating payloads every 5 s are simpler natively |
| UWB (v1.2) | `androidx.core.uwb` Jetpack library via platform channel | Only on UWB phones; BLE used to exchange session params |
| QR | `mobile_scanner` + `qr_flutter` | Room join and fallback tags |
| Haptics and sound | `HapticFeedback` + native `VibrationEffect` waveforms; `just_audio` | Heartbeat needs custom waveforms |
| Sensors | `sensors_plus` | Motion check for the phone-left-behind cheat |
| Auth | Firebase Auth (anonymous + phone OTP) | Upgrade guest to phone account later |
| Profiles, squads, history | Cloud Firestore | Queryable, durable data |
| Live match state | Firebase Realtime Database | Low-latency fan-out of positions and events |
| Server logic | Cloud Functions for Firebase (TypeScript, 2nd gen) | Tags, revives, zone, scoring, cleanup |
| Scheduled work | Cloud Tasks / scheduled functions | Zone shrinks, ping timers, match end |
| Push | Firebase Cloud Messaging | Squad invites, match start |
| Voice (v1.1) | LiveKit (Cloud or self-hosted), `livekit_client` | Token minted by a function per room/team |
| Crash and analytics | Firebase Crashlytics, Analytics | No location data in analytics events |
| Remote config | Firebase Remote Config | Tune tag radius, BLE thresholds without a release |

**Why Realtime Database for live play:** positions change every few seconds for every player. Realtime Database pushes small, frequent updates cheaply and keeps listeners simple. Firestore stores everything that must last (profiles, squads, match summaries).

**Scale escape hatch:** if a single venue ever needs 50+ players or Firebase cost grows, move the live match channel to a WebSocket server (e.g. Node or Go on Cloud Run) while keeping Firestore and Auth.

## Project structure

One Git repo (`VIsHnu1762/snoopzy`) with the Flutter app, the Cloud Functions and shared rule schemas. Feature-first folders so each game system can be built and tested alone.

```text
snoopzy/
├─ app/                      # Flutter app
│  ├─ lib/
│  │  ├─ main.dart
│  │  ├─ core/              # theme, router, env config, errors, logging
│  │  ├─ platform/          # Dart side of native bridges
│  │  │  ├─ location_bridge.dart
│  │  │  ├─ ble_bridge.dart
│  │  │  └─ uwb_bridge.dart
│  │  ├─ data/              # Firestore/RTDB repositories, DTOs
│  │  ├─ domain/            # pure Dart: rules, geometry, scoring, state machine
│  │  └─ features/
│  │     ├─ auth/
│  │     ├─ profile/
│  │     ├─ squads/
│  │     ├─ room/          # create, join, lobby, chat, rules editor
│  │     ├─ checkin/
│  │     ├─ match/         # live map, HUD, radar, tag, revive, haptics
│  │     ├─ recap/
│  │     └─ safety/        # safety card, SOS, no-go alerts
│  ├─ android/app/src/main/kotlin/.../
│  │  ├─ MatchForegroundService.kt   # location + BLE in one service
│  │  ├─ BleTokenAdvertiser.kt
│  │  ├─ BleTokenScanner.kt
│  │  └─ UwbRanging.kt               # v1.2
│  └─ test/ integration_test/
├─ functions/                # Cloud Functions (TypeScript)
│  ├─ src/rooms/ src/match/ src/tags/ src/zone/ src/recap/ src/cleanup/
│  └─ test/
├─ shared/
│  └─ rules.schema.json      # one rules schema used by app and functions
├─ firebase/
│  ├─ firestore.rules  database.rules.json  firestore.indexes.json
├─ tools/match-simulator/    # bots that walk GPS paths for testing
└─ docs/
```

**Layering rules**

- `domain/` is pure Dart with no Flutter or Firebase imports. Geometry (distance, point-in-polygon, zone math), rules validation and scoring live here and are unit-tested heavily.
- `features/` talk to `data/` through Riverpod providers, never to Firebase directly.
- Native code only does what Dart cannot: long-running service, radio access. It streams events to Dart over an `EventChannel` and takes commands over a `MethodChannel`.
- The **server is authoritative.** Client-side game logic is for display and prediction only; tags, revives, eliminations and scores are decided by functions.

## Data model

Two stores. **Firestore** holds durable data people come back to. **Realtime Database (RTDB)** holds the live match, which is deleted after the recap is written.

### Firestore collections

| Collection | Key fields | Written by |
| --- | --- | --- |
| `users/{uid}` | handle, avatarId, color, level, xp, createdAt, isGuest, ageConfirmed18 | Client (own doc, limited fields) |
| `users/{uid}/private/settings` | phone verified, guardian contact, roast mute, replay consent default | Client (own doc) |
| `squads/{squadId}` | name, crest, motto, memberIds\[\], ownerId, season | Client (owner) + functions |
| `squads/{squadId}/stats/{uid}` | matches, wins, tags, revives, survivalSec, distanceM, rankPoints | Functions only |
| `squads/{squadId}/headToHead/{uidA_uidB}` | tagsAonB, tagsBonA | Functions only |
| `rulePresets/{presetId}` | ownerId, name, rules (schema v), isPublic | Client (owner) |
| `matches/{matchId}` | squadId, mode, venue centroid (rounded), startedAt, endedAt, winnerSide, awards\[\], playerSummaries\[\] | Functions only |
| `matches/{matchId}/replay/track_{uid}` | downsampled path (1 point / 10 s) | Functions, only if all players consented |
| `reports/{reportId}` | reporter, target, reason, matchId | Client create, functions read |

### Realtime Database (live room)

```json
{
  "rooms": {
    "K7PX2M": {
      "meta": {
        "hostUid": "u_arjun", "mode": "hideSeek", "state": "lobby",
        "createdAt": 1761735600000, "expiresAt": 1761822000000,
        "squadId": "sq_123", "rulesVersion": 3
      },
      "rules": { "roundSec": 1200, "headStartSec": 180, "tagRadiusM": 5,
                 "pingEverySec": 180, "pingBlurM": 40, "shieldsPerPlayer": 2,
                 "area": { "type": "polygon", "points": [[12.9763, 77.5929], "..."] },
                 "noGo": [ { "type": "polygon", "points": ["..."] } ] },
      "members": {
        "u_riya": { "handle": "riya", "status": "atVenue", "ready": true,
                     "battery": 82, "role": "hider", "team": null }
      },
      "chat": { "-Nx1": { "uid": "u_dev", "text": "you're all cooked", "t": 1761735700000 } },
      "match": {
        "startedAt": 1761735900000, "phase": "hunt",
        "zone": { "center": [12.9761, 77.5931], "radiusM": 140, "nextShrinkAt": 1761736500000 },
        "players": {
          "u_riya": { "state": "alive", "shields": 2, "hp": 1, "lockedAt": null }
        },
        "events": { "-Ny9": { "type": "tag", "by": "u_sana", "on": "u_dev", "t": 1761736080000 } }
      }
    }
  },
  "positions": {
    "K7PX2M": {
      "u_riya": { "lat": 12.97612, "lng": 77.59305, "acc": 6, "spd": 0.4, "t": 1761736081000 }
    }
  },
  "views": {
    "K7PX2M": {
      "u_kabir": { "radar": [ { "slice": 3, "band": "close" } ],
                   "pings": [ { "center": [12.9763, 77.5932], "blurM": 40, "until": 1761736084000 } ] }
    }
  },
  "bleTokens": { "K7PX2M": { "u_riya": { "epoch": 352, "secretRef": "server-only" } } }
}
```

**Key design decision: players never read each other's raw positions.** Each phone writes only its own `positions/{room}/{uid}`. A function reads all positions and writes each player a personal `views/{room}/{uid}` with exactly what the rules allow (radar slices, blurred pings, teammates). This makes "hacked client sees everyone" impossible.

The `bleTokens` node holds only an epoch counter; the per-player token secrets live in function memory or Secret Manager and are never readable by clients.

## Match state machine

A room moves through fixed states. Only two transitions are human (host Start, host Pause); every other one fires on a server deadline or an end condition checked by the match ticker.

&#91;embedded content: Hide & Seek match states · 9 states\]

Each box's small line is what triggers entry. *Play again* from Recap returns the room to Lobby with the same members and rules.

**Implementation notes**

- State lives in `rooms/{code}/match/phase` and is written only by the ticker or functions.
- Every phase change writes the next deadline (`phaseEndsAt`), so clients just count down to it.
- Pause stores `pausedAt`; resume adds `now - pausedAt` to every pending deadline.
- The same machine is reused by other modes with different phase lists (Battle Royale: Drop → Phase 1..4 → Final circle).

## Location pipeline

One native foreground service (`MatchForegroundService`) owns GPS and Bluetooth for the whole match, so the game keeps working with the screen off or the app in the background.

### Lifecycle

1. **Check-in screen:** request permissions (see Permissions), start the service with a visible notification *"Snoopzy match in progress"*.
2. **Match live:** service streams fixes to Dart and to RTDB, runs BLE advertise + scan.
3. **Eliminated / spectator:** location drops to low power; BLE advertising stops.
4. **Match end or leave room:** service stops itself; last position node is deleted by a function.

The service must never run outside a match. A watchdog function ends any room left `live` for more than 2 hours.

### Sampling

| Player state | Priority | Interval | Min displacement |
| --- | --- | --- | --- |
| Moving (speed over 0.8 m/s) | High accuracy | 2 s | 1 m |
| Still | High accuracy | 5 s | 3 m |
| Locked or spectating | Balanced | 15 s | 10 m |
| Lobby (checked in) | Balanced | 10 s | 5 m |

Use `LocationRequest.Builder` with `setMinUpdateIntervalMillis` and `setWaitForAccurateLocation(false)`. Switch profiles based on the last 10 s of speed (no activity-recognition permission needed).

### Filtering on the phone

1. **Drop junk:** accuracy worse than 50 m, timestamp older than 10 s, or a jump implying speed over 12 m/s.
2. **Smooth:** a simple Kalman filter (constant-velocity model) on lat/lng, weighted by reported accuracy. Smoothed position is what gets uploaded; raw accuracy is sent alongside.
3. **Snap-in:** points just outside the boundary (less than accuracy radius) are treated as inside, so GPS noise never triggers out-of-bounds penalties.

### Upload

- Write `positions/{room}/{uid}` = `{lat, lng, acc, spd, hdg, t}` with 5 decimal places (about 1 m).
- Coalesce: never more than one write per 2 s; skip writes when moved less than 1 m and under 10 s since last write.
- On reconnect, write only the latest fix, not a backlog.

### Clock sync

All game timers use **server time**. On room join, read `/.info/serverTimeOffset` from RTDB and compute `serverNow = Date.now() + offset`. Every timestamp the phone sends uses `serverNow`. Timers on screen count down to server-set deadlines (`nextShrinkAt`, `endsAt`), so every phone shows the same second.

### Geometry helpers (in `domain/`)

- Haversine distance; equirectangular approximation is fine for distances under 2 km and is faster.
- Point-in-polygon (ray casting) for the area and no-go zones.
- Bearing to 8-slice radar index: `slice = ((bearing + 22.5) % 360) ~/ 45`.
- Distance bands: far (over 40 m), close (15 to 40 m), very close (under 15 m).

## Proximity and tag protocol

**Update (Oct 29): version 1 uses GPS hold-to-tag, not this protocol.** The seeker holds Tag for 5 s while both phones stay within 8-10 m (accuracy-adjusted), checked by a cloud function; fake locations are flagged with `Location.isMock()`. This Bluetooth section is the **v1.2 upgrade**, to be built only if tag disputes or cheating appear. Version 1 also uses friends-trust mode (no private views or match ticker). See *Snoopzy: MVP Scope: What Is Necessary* for the full list.

A tag or revive is accepted only with **radio proof**: the tagger's phone must have heard the target's current Bluetooth token. GPS is a secondary sanity check. This is the core anti-cheat of the game.

### Rotating tokens

- At match start, callable `getBleSecret(room)` returns that player's own 32-byte secret (and nobody else's).
- `epoch = floor(serverNow / 5000)` — a new token every 5 s.
- `token = first 8 bytes of HMAC-SHA256(secret, roomCode + ":" + epoch)`.
- Phones cannot compute anyone else's token, so the only way to know a rival's token is to be physically near enough to hear it.

### Advertising packet (fits a 31-byte legacy advertisement)

| Field | Bytes |
| --- | --- |
| Flags | 3 |
| Service Data, 128-bit UUID header | 2 + 16 |
| Payload: token (8) + epoch low byte (1) | 9 |
| **Total** | **30** |

```kotlin
val data = AdvertiseData.Builder()
    .addServiceData(ParcelUuid(SNOOPZY_UUID), token + byteArrayOf(epoch.toByte()))
    .setIncludeDeviceName(false)
    .build()
val settings = AdvertiseSettings.Builder()
    .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
    .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_MEDIUM)
    .setConnectable(false)
    .build()
// Every 5 s: stopAdvertising(cb); startAdvertising(settings, newData, cb)
```

**Scanning:** `ScanFilter` on the service-data UUID, `SCAN_MODE_LOW_LATENCY` while hunting, `SCAN_MODE_BALANCED` otherwise. Keep a 10-second ring buffer of `(token, epochLow, rssi, serverTime)` per token.

### Tag request

The seeker taps Tag. The app does not need to know who is near (tokens are opaque); it sends what it heard:

```json
// callable: tag
{
  "room": "K7PX2M",
  "at": 1761736080000,
  "pos": { "lat": 12.97611, "lng": 77.59301, "acc": 5 },
  "heard": [
    { "token": "9f3c1a7e0b22d415", "epochLow": 96, "rssiMedian": -63, "samples": 4, "spanMs": 2600 }
  ],
  "uwb": null
}
```

### Server validation (in order, inside an RTDB transaction on the match)

1. Room is `live`, phase allows tagging, tagger is alive, a hunter, and off cooldown.
2. For each heard token: recompute candidate tokens for every alive opponent for epochs `now-1..now`; find the owner.
3. Radio proof: `samples >= 2`, heard within the last 3 s, `rssiMedian >= tagRssiThreshold` (Remote Config, start at -70 dBm, tuned in field tests; per-device-model offsets later).
4. GPS sanity: `distance - accTagger - accTarget <= tagRadiusM + 10`. Loose on purpose; it only blocks absurd cases.
5. Target not immune (revive immunity, Armor), not in a safe house, not already locked.
6. Optional strict mode: the target's phone must also have heard the tagger in the last 5 s (both phones upload a compact "heard list" every 5 s while within close band).
7. Apply: set target `state: locked`, write event, start tagger cooldown, update scores. Return result to tagger; target gets it via their `views` node.

### Revive request

- Rescuer holds phones together. The app streams observations for 5 s and calls `revive` with the window.
- Accept if: rescuer is alive with `shields > 0`; the locked player is on the same side; at least 4 observations across 5 s or more; `rssiMedian >= reviveRssiThreshold` (stricter, start at -60 dBm); both directions heard; no tag landed on the rescuer during the window.
- Apply: `shields -= 1`, locked player `state: alive`, `immuneUntil = now + 15 s`.

### UWB upgrade (v1.2)

When both phones report UWB support, the server sends each a session config (session id, key, peer addresses) when they enter the *close* band. Phones range with `androidx.core.uwb` and include `uwb: {distanceM, peerToken}` in the tag request; the server accepts `distanceM <= tagRadiusM` as proof instead of RSSI. Channel Sounding can slot in the same way once phones support it.

### QR fallback

The locked/target screen can show a QR of `HMAC(secret, room + epoch)` that rotates every 5 s. Scanning it is accepted as proof. Used for disputed tags and phones with Bluetooth problems.

### Known limits

- RSSI varies by phone model, body blocking and pocket placement; thresholds must be field-tuned and stored in Remote Config.
- A relay attack (forwarding Bluetooth packets over the internet in real time) is theoretically possible; the 5 s epoch and GPS check make it impractical for a friends game. Not worth more effort in v1.

## Server logic

All authority lives in Cloud Functions (TypeScript). Player actions are **callable functions**; time-driven events run on a **match tick**.

### Callable functions

| Function | Called when | Does |
| --- | --- | --- |
| `createRoom` | Host taps Create | Generates a code (alphabet without 0/O/1/I/L), writes `rooms/{code}/meta`, sets 24 h expiry |
| `joinRoom` | Code entered / QR / link | Checks room exists, not full, not banned; adds member |
| `updateRules` | Host edits rules | Validates against `shared/rules.schema.json`, bumps `rulesVersion` |
| `checkIn` | Player taps Check in | Verifies point-in-area + at least one BLE observation of a checked-in player's token in the last 10 s (host is auto-checked-in) |
| `setReady` | Player taps Ready | Only if checked in and permissions OK |
| `startMatch` | Host taps Start | Assigns roles, writes rules snapshot, issues BLE secrets, schedules phases |
| `getBleSecret` | Match start | Returns the caller's own secret only |
| `tag` / `revive` | Player action | See Proximity and tag protocol |
| `useSos` | SOS held 2 s | Pauses match, reveals caller's position to all players, logs event |
| `pauseMatch` / `resumeMatch` | Host | Freezes timers by shifting deadlines |
| `leaveRoom` | Player leaves | Marks offline; host transfer if host leaves |

### The match tick

Views (radar, pings), zone checks, out-of-bounds and anti-cheat need a regular loop per live room.

- **v1 approach:** a small **Cloud Run service** (`match-ticker`) that keeps one async loop per live room, running every 1 s. It subscribes to `positions/{room}`, and on each tick computes and writes every player's `views/{room}/{uid}`, applies zone damage, fires scheduled phase changes and checks end conditions.
- Rooms are assigned to a ticker instance by a lease in RTDB (`tickers/{room}: {instance, leaseUntil}`); if an instance dies, another picks the room up within 5 s.
- Why not pure function triggers: an RTDB `onWrite` per position would fire about 3 times per second per room and still not give a steady clock for timers.

### Per-tick work (Hide & Seek)

1. Load latest positions; mark players `offline` if no fix for 30 s, auto-lock after 120 s.
2. Radar: for each hunter, nearest hiders → slice + band (only every `radarPulseSec`).
3. Pings: at ping times, write blurred circles: center = true position + random offset of 15 to `pingBlurM` m.
4. Heartbeat: for each hider, distance to nearest hunter → bpm value in their view.
5. Area squeeze: at halfway, compute new polygon (scaled 70% toward a random interior point), set 60 s grace.
6. Out-of-bounds and no-go timers; anti-camp timers near locked players.
7. End check: all hiders locked → hunters win; timer done → hiders win.

### Anti-cheat checks (server)

| Check | Rule | Action |
| --- | --- | --- |
| Impossible speed | over 7 m/s sustained 5 s, or a jump over 12 m/s | Flag; freeze player's tagging for 30 s; host notified |
| Mock location | Client reports `isMock` from `Location.isMock()` (Android 12+; isFromMockProvider() below) | Flag badge visible to all; host can kick |
| Phone left behind | No accelerometer motion for 5 min while radio heard elsewhere / pings inconsistent | Flag |
| Token reuse | Same token heard from two far-apart GPS points | Reject tags; flag |
| Stale client | App version below minimum | Block join |

### Match end and recap

`finalizeMatch` (triggered when state becomes `ended`): computes awards from the event log and stats, writes `matches/{id}`, updates squad stats and head-to-head, writes replay tracks only if all players consented, then deletes `positions/{room}` and `views/{room}` within 10 minutes.

## Security rules and privacy

Rule of thumb: **clients write only their own small facts; the server writes everything that decides the game; nobody reads another player's raw position.**

### Realtime Database rules (sketch)

```json
{
  "rules": {
    "rooms": {
      "$code": {
        ".read": "auth != null && data.child('members').hasChild(auth.uid)",
        "meta":  { ".write": false },
        "rules": { ".write": false },
        "match": { ".write": false },
        "members": {
          "$uid": {
            ".write": "auth.uid === $uid",
            ".validate": "newData.hasChildren(['handle','status'])",
            "role": { ".validate": "newData.val() === data.val()" }
          }
        },
        "chat": {
          "$msg": {
            ".write": "!data.exists() && root.child('rooms/'+$code+'/members/'+auth.uid).exists()",
            ".validate": "newData.child('uid').val() === auth.uid && newData.child('text').isString() && newData.child('text').val().length <= 280"
          }
        }
      }
    },
    "positions": {
      "$code": { "$uid": { ".read": false, ".write": "auth.uid === $uid" } }
    },
    "views": {
      "$code": { "$uid": { ".read": "auth.uid === $uid", ".write": false } }
    },
    "bleTokens": { ".read": false, ".write": false }
  }
}
```

The server (Admin SDK) bypasses these rules. Note: `.read` on `rooms/$code` cascades, so keep secret data out of `rooms/` entirely (that is why `positions`, `views` and `bleTokens` are top-level).

### Firestore rules (principles)

- `users/{uid}`: owner can write only `handle`, `avatarId`, `color`; stats fields are function-only.
- `squads`: members read; owner edits name/crest/motto; membership changes via function (invite accept).
- `matches`, `stats`, `headToHead`: read by squad members, write by functions only.
- `reports`: create only, with reporter = auth uid.

### Privacy and retention

| Data | Kept for | Visible to |
| --- | --- | --- |
| Live positions | Match only; deleted within 10 min of end | Server only |
| Personal views (radar, pings) | Match only | That player |
| Replay tracks (downsampled) | Until squad deletes; only if all players opted in | Squad members |
| Match summary (no coordinates except a rounded venue point) | Indefinitely | Squad members |
| Phone number | Account lifetime | Never shown to other players |
| Chat | 24 h after room expiry | Room members |

- Account deletion (Play requires an in-app path): callable `deleteAccount` removes the user doc, removes them from squads, anonymises their entries in match summaries.
- Analytics events never include coordinates.
- Privacy policy must describe location use during matches, Bluetooth use and retention; same text appears in the in-app disclosure.

## Chat and voice

Text chat ships in v1; voice in v1.1. Both follow the game's information rules: nothing should leak positions to the wrong side.

### Text chat (v1)

- Stored under `rooms/{code}/chat`, last 200 messages, max 280 characters, sticker IDs as `{type: 'sticker', id}`.
- **Lobby and recap:** everyone can post.
- **During the match:** chat is read-only for alive players (no typing while running, no "she's at the fountain"). Spectators and locked players can post to a *spectator channel* that alive players do not see until the recap.
- Basic filter: a word list for slurs, rate limit of 1 message per second per user (enforced in rules via a `lastMsgAt` field on the member).

### Voice (v1.1) with LiveKit

| Room phase | Voice channels |
| --- | --- |
| Lobby | One channel, everyone |
| Match, team modes | One channel per team; hunters never hear hiders |
| Match, Hide & Seek | Hiders channel (optional, host rule); seekers channel |
| Spectators | Own channel with 30 s delayed map; cannot speak to alive players |
| Eye in the Sky (remote) | Joins their team channel, speak + listen |
| Recap | Everyone |

- Callable `getVoiceToken(room, channel)` checks role and phase, then mints a short-lived LiveKit access token with `canPublish` / `canSubscribe` set by role.
- On role change (locked, infected, team switch) the server revokes and the app reconnects with a new token.
- Push-to-talk by default (big button on the HUD, also volume-key binding); open mic optional. Saves battery and stops background noise giving away hiders.
- Audio routing: earbuds strongly recommended; the app warns hiders if audio is on the speaker (a seeker could hear it).

## Android permissions and Play Store policy

Location and Bluetooth are the riskiest part of Play review. Plan the permission flow and the store declarations from day one.

### Manifest

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.CAMERA" />            <!-- QR -->
<!-- Android 12+ Bluetooth ("Nearby devices") -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<!-- Android 11 and below -->
<uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30" />
<!-- v1.2 -->
<uses-permission android:name="android.permission.UWB_RANGING" />

<service
    android:name=".MatchForegroundService"
    android:foregroundServiceType="location"
    android:exported="false" />
```

- Do **not** declare `neverForLocation` on `BLUETOOTH_SCAN`: scan results are used for proximity, which is location-derived.
- Do **not** request `ACCESS_BACKGROUND_LOCATION`. Start the foreground service while the app is visible (at check-in), which keeps location running with the screen off.
- On Android 14+, a `location` foreground service must declare `FOREGROUND_SERVICE_LOCATION`, and the user must have granted coarse or fine location before it starts ([Android docs](https://developer.android.com/about/versions/14/changes/fgs-types-required)). Start it with `ServiceCompat.startForeground(..., FOREGROUND_SERVICE_TYPE_LOCATION)`.

### Runtime permission flow (at check-in, not at first launch)

1. Explainer screen in Snoopzy's voice: why location and Bluetooth are needed, that they are used **only during a match**, and when data is deleted.
2. Request fine location (with "Precise" on). If the user picks approximate, explain that tags will not work and offer to retry.
3. Request Nearby devices (Bluetooth scan + advertise).
4. Request notifications (needed for the ongoing match notification).
5. Ask the user to turn off battery optimisation for Snoopzy only if the device is known to kill services (some OEM skins), with a deep link to settings.
6. Camera only when they first open the QR scanner.

### Play Console declarations

- **Foreground service declaration:** Play requires apps targeting Android 14+ to declare foreground service types and use them for allowed use cases; location sharing initiated by the user is listed as an example for `location` ([Play help](https://support.google.com/googleplay/android-developer/answer/16965181)).
- **Location policy:** Google says location used through a foreground service in a way equivalent to background access can be subject to the background-location requirements ([Play help](https://support.google.com/googleplay/android-developer/answer/9799150)). Be ready with the permissions declaration form, a video showing the in-match feature, and a prominent in-app disclosure.
- **Data safety form:** declare precise location (collected, shared with other players in the room as derived data, deleted after match), phone number, user content (chat), app activity.
- **Target audience:** if teens are a target audience, families and child-safety policies apply. Decide this before the first store submission; 18+ only at launch is the simplest path.
- Play's location policy is changing (newer guidance on minimum scope for precise location applies to apps targeting Android 17+). Re-check the policy pages before each target-SDK bump.

## Battery, performance and offline handling

The biggest battery costs are the screen, GPS at high accuracy, and continuous Bluetooth scanning. The design keeps the screen off most of the match and scales radios to the situation.

### Battery budget (20-minute match, mid-range phone)

| Consumer | Strategy |
| --- | --- |
| Screen | HUD designed for glances; auto-dim after 10 s; haptics and sound carry most information |
| GPS | Adaptive interval (2 s moving, 5 s still, 15 s locked) |
| BLE advertise | Medium TX power; stop when locked or spectating |
| BLE scan | Low-latency only when the server says a rival is within 60 m (`views.scanHot = true`); balanced otherwise |
| Network | Coalesced writes, one RTDB connection, no polling |
| Map rendering | Cap at 30 fps; pause map when screen is off; vector tiles cached offline for the venue |

Measure with Android Studio's Power Profiler and `adb shell dumpsys batterystats` on 3 reference phones (one low-end, one mid-range, one flagship). Release gate: under 8% for a 20-minute match on the mid-range phone.

### Performance

- Live map: render players with a single symbol layer (GeoJSON source updated in place), not widgets per player.
- Radar animation: `CustomPainter` with one `AnimationController`; no rebuilds of the whole HUD per tick.
- Riverpod `select` to rebuild only the widget whose value changed (timer, alive count, radar).
- Keep the main isolate free: Kalman filter and geometry run in Kotlin or a background isolate.

### Poor network and offline

| Situation | Behaviour |
| --- | --- |
| Short drop (under 30 s) | RTDB queues own writes; UI shows a *weak signal* chip; tags are queued with their Bluetooth proof and sent on reconnect |
| Long drop (30 to 120 s) | Player shown as offline to others; they cannot tag or be tagged |
| Over 120 s offline in a match | Auto-locked (Hide & Seek) so switching off data is never an advantage |
| Server ticker restart | Lease moves to another instance within 5 s; timers are deadlines, so no time is lost |
| Host loses connection | Host role moves to the longest-connected checked-in player after 60 s |

Queued tags are accepted only if the Bluetooth epochs they contain are within 30 s of the time the server receives them.

## Testing strategy

A real-world game cannot be tested only at a desk, but most bugs can be caught before anyone goes to the park. Four layers, cheapest first.

| Layer | What | Tools | Runs |
| --- | --- | --- | --- |
| Unit | Geometry, rules validation, scoring, state machine, token HMAC, radar slices | `flutter test`, Jest for functions | Every commit |
| Server integration | Callable functions + rules against emulators | Firebase Emulator Suite, `@firebase/rules-unit-testing` | Every PR |
| Simulated match | 8 bot players walk scripted GPS paths in the emulator; bots "hear" each other's tokens when within a simulated distance with noisy RSSI | `tools/match-simulator` (Node) | Nightly + before release |
| Field test | Real phones, real park | Debug overlay, field log export | Each sprint |

### Simulator details

- Paths from GeoJSON files recorded in the real venue, or random walks inside the area.
- RSSI model: `rssi = -59 - 10 * n * log10(d) + noise`, with `n` between 2 and 3 and Gaussian noise of 4 to 6 dB, plus random 10 dB body-block drops. Used to tune thresholds before field tests.
- Scenarios: tag at 4 m (accept), tag at 12 m with good GPS (reject), GPS drift of 20 m with Bluetooth close (accept), mock-location player (flag), phone left on a bench (flag), network drop mid-revive.

### On-device debugging

- Hidden debug overlay (tap the logo 7 times in debug builds): raw vs smoothed GPS, accuracy, heard tokens with RSSI, server time offset, ticker latency.
- **Field log:** one button exports a JSON of the last match (positions, BLE observations, tag requests and server decisions) for tuning thresholds.
- Mock location for indoor testing: use Android's developer *Select mock location app* setting with a GPX player; the server's mock flag is disabled in the dev environment.

### Field test protocol

1. Calibration walk: two phones, measure RSSI at 1, 3, 5, 8 and 12 m, in hand and in pocket. Record per phone model.
2. Tag accuracy: 20 tags at known distances; count false accepts and false rejects.
3. Full match with 6+ players; collect field logs from all phones.
4. Battery: note start and end battery for every phone.
5. Update Remote Config thresholds from the data, not from guesses.

## Build, environments and CI/CD

Three Firebase projects keep test data, tuning and real players apart.

| Environment | Firebase project | Used for | App flavor |
| --- | --- | --- | --- |
| local | Emulator Suite | Day-to-day development, simulator | `dev` |
| staging | `snoopzy-staging` | Field tests, internal testers | `staging` (separate app ID suffix `.staging`) |
| production | `snoopzy-prod` | Play Store users | `prod` |

- Flutter flavors + `--dart-define-from-file=env/<flavor>.json` for API keys (Mapbox public token, LiveKit URL). Secrets for functions in Secret Manager, never in the repo.
- Mapbox secret download token only in CI secrets and `~/.gradle/gradle.properties`.

### CI (GitHub Actions)

| Workflow | Trigger | Steps |
| --- | --- | --- |
| `ci.yml` | Every PR | `flutter analyze`, `dart format --set-exit-if-changed`, `flutter test`, functions lint + Jest, rules tests on emulators |
| `nightly-sim.yml` | Nightly | Spin up emulators, run 20 simulated matches, fail on rule regressions |
| `release-staging.yml` | Merge to `main` | Build signed AAB (staging), deploy functions + rules to staging, upload to Play **internal testing** track |
| `release-prod.yml` | Tag `v*` | Build prod AAB, deploy functions + rules to prod, upload to Play closed/open testing, then staged rollout |

- Version: `versionName` from the Git tag, `versionCode` from the CI run number.
- Server sets `minAppVersion` in Remote Config; old clients are blocked from joining rooms when the protocol changes.
- Branching: short-lived feature branches, PR review required, `main` always deployable to staging.

## MVP backlog

Six two-week sprints to a closed beta of Hide & Seek, matching the 12-week product roadmap. Each sprint ends with a demo on real phones; sprints 2 to 6 end with a field test.

### Sprint 1 — Foundations

- [ ] Flutter project, flavors, Riverpod, go\_router, theme tokens (dark + neon)
- [ ] Firebase projects (staging, prod), emulators, CI `ci.yml`
- [ ] Auth: anonymous + phone OTP, profile create/edit
- [ ] `domain/`: geometry helpers, rules schema + validation, unit tests
- [ ] Mapbox map screen with custom style and offline pack download

### Sprint 2 — Rooms and live location

- [ ] `createRoom`, `joinRoom`, QR + deep links, lobby UI with chat
- [ ] Rules editor (Hide & Seek rules only), draw area polygon + no-go zones
- [ ] Native `MatchForegroundService` with adaptive GPS + Kalman filter
- [ ] Position upload + debug map of all dots (staging only)
- [ ] **Field test:** 4 phones, GPS accuracy and battery baseline

### Sprint 3 — Bluetooth proof

- [ ] BLE token advertiser + scanner (Kotlin), event channel to Dart
- [ ] `getBleSecret`, token HMAC in functions, `checkIn` with BLE proof
- [ ] Field log export + debug overlay
- [ ] Match simulator v1 with RSSI model
- [ ] **Field test:** RSSI calibration walk on 3 phone models

### Sprint 4 — The game loop

- [ ] `startMatch`, roles, phases; `match-ticker` on Cloud Run with leases
- [ ] Views: radar slices, blurred pings, heartbeat bpm; HUD + radar UI + haptic waveforms
- [ ] `tag` with full validation; locked state; win conditions
- [ ] Area squeeze, out-of-bounds, no-go timers
- [ ] **Field test:** first full Hide & Seek match with 6 friends

### Sprint 5 — Revives, safety, recap

- [ ] Revive Shields: 5 s hold UI, `revive` validation, immunity, anti-camp
- [ ] Safety card, SOS, pause/resume, speed and mock-location flags
- [ ] `finalizeMatch`: awards, squad stats, head-to-head, recap screen + share card
- [ ] Squads: create, invite, squad push to start room
- [ ] **Field test:** 3 rounds back to back, measure retention within the session

### Sprint 6 — Hardening and beta

- [ ] Battery tuning to target; performance pass on low-end phone
- [ ] Offline/poor-network handling, host migration
- [ ] Security rules review + rules tests; privacy policy, data safety, FGS and location declarations
- [ ] Crashlytics, Remote Config thresholds, `minAppVersion`
- [ ] Play internal → closed testing release; **beta with 30 testers**

## Open technical questions and risks

| Risk / question | Why it matters | Plan |
| --- | --- | --- |
| BLE RSSI too noisy for a 5 m tag radius | False accepts or rejects ruin trust | Field calibration in sprint 3; per-model offsets; QR fallback; consider larger radius (7 m) |
| OEM battery killers stop the foreground service | Players silently drop out | Test on Xiaomi, Samsung, Vivo/Oppo, OnePlus; battery-optimisation prompt; heartbeat check from ticker |
| Play review of location foreground service | Release blocked | Prepare declaration, demo video and disclosure early; submit to internal track by sprint 5 |
| Under-18 players | Families policy, consent, safety obligations | Product decision needed: 18+ at launch, or guardian flow + family policy compliance |
| Firebase cost at scale | RTDB bandwidth and Cloud Run ticker time | Track cost per match from beta; WebSocket server path if needed |
| iOS later | Apple limits custom BLE advertising data | Spike before committing: test iOS service-data advertising or use GATT-based token exchange |
| Ticker as single point of failure | Matches freeze | Leases, health checks, at least 2 instances |
| Map costs | Mapbox pricing by monthly active users / tile loads | Offline packs per venue; review pricing before beta |

### Decisions needed before Sprint 1

- [ ] Final package name / app ID (e.g. `com.<org>.snoopzy`)
- [ ] Domain for invite links
- [ ] Age policy at launch (18+ or teens with guardian flow)
- [ ] Mapbox vs Google Maps (Mapbox recommended for custom game styling)
- [ ] Cloud region for Firebase and Cloud Run (closest to players, e.g. `asia-south1` for India)

### Sources

- [Android 14 foreground service types](https://developer.android.com/about/versions/14/changes/fgs-types-required)
- [Play: foreground service requirements](https://support.google.com/googleplay/android-developer/answer/16965181)
- [Play: location in the background permissions](https://support.google.com/googleplay/android-developer/answer/9799150)
- [Android UWB developer guide](https://developer.android.com/develop/connectivity/uwb)
- [flutter\_ble\_peripheral (Flutter Gems)](https://fluttergems.dev/packages/flutter_ble_peripheral/) and [notes on iOS advertising limits](https://dev.to/juliansteenbakker/advertising-custom-data-over-bluetooth-low-energy-github-graduation-2em4)
