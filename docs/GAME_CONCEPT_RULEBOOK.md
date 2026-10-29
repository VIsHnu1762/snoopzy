# Snoopzy IRL — Game Concept & Rulebook

2026-10-29 · @vishnu

## The concept in one minute

Snoopzy turns any park, campus or street into a game map. Your friends are the other players, your phone is the controller, and your legs do the rest.

- **Join in 10 seconds.** One friend creates a room and shares a 6-letter code. Everyone joins, picks a side, taps Ready.

- **The phone is the referee.** Live GPS knows where everyone is, but players only see what the rules allow: a vague radar pulse, a timed ping, a vibration that grows stronger as danger gets close.

- **Your legs are the gameplay.** You hide behind real trees, sprint across real lawns and sneak around real buildings. Nothing about the movement is simulated.

- **The squad is the point.** Every match feeds a shared squad history: awards, roasts, rivalries and a yearbook of where you played and who won.

**The feeling we want:** the pounding heart of childhood hide and seek, with the tension of a battle royale's closing circle, and the next-day banter of a friend group chat.

**Design pillars**

1.  **Real bodies, real places.** The app never replaces the physical game; it adds information, tension and fairness.

2.  **Uncertainty is fun.** Players get hints, never exact positions. Guessing and bluffing are the game.

3.  **Every match makes a story.** The recap should give the squad something to laugh about for a week.

4.  **Host is king.** Every number is a rule the host can change, with sensible defaults.

5.  **Safe by default.** Boundaries, no-go zones, speed checks and SOS are built in, not optional extras.

## A real match, minute by minute

Seven friends, a Saturday evening, a 400 m wide city park. Mode: Hide & Seek, preset *Classic Park*. This is what the game should feel like.

| Time      | What happens in the park                                                                               | What the phones do                                                                                                                                                             |
|-----------|--------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 5:20 pm   | Arjun opens Snoopzy at the park gate and taps Create.                                                  | Room code **K7PX2M** appears with a QR. He posts it in the squad chat.                                                                                                         |
| 5:22      | Six friends join. Meera arrives late and scans the QR from Arjun's screen.                             | Lobby fills with sticker avatars. Someone spams the 🐍 taunt.                                                                                                                  |
| 5:24      | Arjun draws the park boundary with his finger and marks the pond and main road as no-go.               | Everyone sees the map and the rules card: 2 seekers, 3 min head start, 20 min round.                                                                                           |
| 5:25      | All tap Ready. Roles are dealt: Kabir and Sana are seekers.                                            | Seekers' screens go dark with a countdown: *"Close your eyes. Count with us."*                                                                                                 |
| 5:25–5:28 | Five hiders scatter. Riya climbs into a bush near the fountain. Dev hides behind the cafe's back wall. | Hiders see a 3:00 timer and the boundary glow. Leaving the area buzzes the phone.                                                                                              |
| 5:28      | Seekers are released.                                                                                  | A siren sound. Seekers get radar: a pulse every 30 s showing direction bands, not dots.                                                                                        |
| 5:31      | First hider ping: every hider's approximate area flashes for 3 s, blurred by 40 m.                     | Kabir sprints toward the fountain blob. Riya's phone starts a slow heartbeat.                                                                                                  |
| 5:33      | Kabir is 8 m from Riya. She holds her breath.                                                          | Riya's heartbeat is fast. Kabir's radar shows *"Very close"*. He walks right past.                                                                                             |
| 5:36      | Sana spots Dev and taps Tag within 5 m.                                                                | Server confirms GPS plus the Bluetooth handshake between their phones. Dev's phone plays the *"You're cooked"* sound. Dev is locked where he stands until someone revives him. |
| 5:38      | Dev, now locked, watches the whole map and sends 🔥 reactions.                                         | Remaining hiders get a toast: *"Dev got snooped. 4 left."*                                                                                                                     |
| 5:40      | Halfway. The play area shrinks to 70%.                                                                 | Map shows the new boundary; hiders outside have 60 s to move.                                                                                                                  |
| 5:41      | Riya has to run. Kabir sees her move, the chase is on. She grabs an Armor power-up at the bandstand.   | Kabir's tag is blocked: *"Armor broke. Run, Riya!"*                                                                                                                            |
| 5:48      | Two hiders survive until the timer.                                                                    | Final siren. Hiders win the round.                                                                                                                                             |
| 5:49      | Everyone walks back to the gate, laughing.                                                             | Recap: route replay, awards (*Ghost of the Fountain: Riya*), squad stats updated. *Play again* is one tap.                                                                     |

**Why this works:** every phone moment pushes a physical reaction: run, freeze, hide, chase, laugh. The phone is never the main thing to look at for long.

## Core loop

The match is the fun; the recap and yearbook are what bring the squad back. Every match should end with a reason to play the next one.

<figure data-embed="node/af748bbe-62a3">

<figcaption>core loop · 5 steps</figcaption>
</figure>

The recap is the hinge: if it makes the squad laugh and argue, the rematch or next week's invite follows on its own.

## Roles and abilities

Every player has one role per match. Each role gets one signature ability with a cooldown, so players make choices instead of spamming buttons.

| Role                  | Modes            | Sees                                       | Signature ability                                                                   | Cooldown           |
|-----------------------|------------------|--------------------------------------------|-------------------------------------------------------------------------------------|--------------------|
| Hider                 | Hide & Seek      | Boundary, own dot, teammates if teams on   | **Freeze:** go silent on radar for 20 s if standing still                           | 90 s               |
| Seeker                | Hide & Seek      | Radar pulse, timed hider pings             | **Sniff:** one extra ping of the nearest hider, blurred 25 m                        | 120 s              |
| Survivor              | Battle Royale    | Zone, own dot, radar of rivals within 60 m | **Dash ping:** fake movement trail for 15 s                                         | 120 s              |
| Captain               | Capture the Flag | Own team, own flag, rival flag zone        | **Rally:** show your position to your team for 10 s                                 | 60 s               |
| Runner                | Capture the Flag | Own team, rival flag zone                  | **Sprint window:** tag immunity for 10 s while carrying no flag                     | 150 s              |
| Zombie                | Zombie Tag       | Survivors as blurred blobs every 45 s      | **Groan:** survivors within 30 m get a scary vibration (reveals panic)              | 60 s               |
| Survivor (Zombie Tag) | Zombie Tag       | Zombies within 40 m on radar               | **Safe house:** stand in a safe spot for 30 s of immunity                           | Once per safe spot |
| Spectator             | All              | Everything, live                           | **Cheer / boo:** emoji reactions; host can allow one *Spotlight* ping per spectator | 60 s               |

**Role assignment:** random by default. The host can pick roles, use *Volunteer first*, or *Rotate* so the same friend is not always seeker.

**Balance rule of thumb:** the hunting side should be about 1 for every 3 to 4 hunted players. Fewer hunters feels hopeless; more feels unfair.

## Mode rulebook: Hide & Seek

The flagship mode and the MVP. Seekers hunt, hiders survive. A round lasts 10 to 30 minutes.

**Setup**

- Players: 3 to 12. Seekers: 1 per 3 to 4 hiders.

- Area: drawn boundary. Default 1 hectare for 6 players (about 100 m × 100 m).

- Head start: default 3 minutes. Seekers' screens are locked and dark.

**Phases**

1.  **Scatter (head start).** Hiders move freely. Boundary buzz if they cross it. Seekers wait at the start point.

2.  **Hunt.** Seekers released with a siren. Radar pulses every 30 s. All hiders are pinged every 3 minutes, blurred by 40 m.

3.  **Squeeze (halfway).** The area shrinks to 70% around a random point. Hiders outside have 60 s to get in.

4.  **Final minute.** Pings every 30 s and the heartbeat haptic is louder for everyone. Pure panic.

**Tagging:** a seeker taps Tag when within 5 m of a hider. The server checks both positions and accuracy. The tagged hider is locked in place until a friend revives them with a Revive Shield (see below), or becomes a seeker if *Infection* is on.

**Winning**

- Seekers win if all hiders are locked at the same time before the timer ends.

- Hiders win if at least one survives. Each survivor gets the *Unsnoopable* award.

**Scoring (for squad stats)**

| Event                                 | Points              |
|---------------------------------------|---------------------|
| Survive each minute as hider          | +1                  |
| Survive to the end                    | +10                 |
| Tag a hider                           | +8                  |
| Tag within 60 s of a ping             | +2 bonus            |
| Block a tag with Armor                | +3                  |
| Leave the boundary for more than 60 s | −10 and auto-tagged |

**Edge cases**

- **Two people tag each other at once:** the first server-confirmed tag wins.

- **GPS poor (accuracy worse than 25 m):** that player cannot be tagged or tag for 20 s; their dot shows a *weak signal* icon to everyone.

- **Hider goes indoors:** allowed only if the host enables *Indoor hiding*. Otherwise the boundary excludes buildings.

- **Phone dies:** the player is marked *offline*. After 2 minutes offline they are auto-tagged so nobody can hide by switching off.

## Mode rulebook: Battle Royale

Everyone against everyone, inside a circle that keeps shrinking. The last player standing in the zone wins.

**Setup**

- Players: 4 to 20, solo or teams of 2 to 3.

- Starting zone: a circle sized at about 50 m radius per 4 players (200 m radius for 16).

- Drop: each player gets a random start point at least 40 m from others and has 2 minutes to reach it before combat opens.

**Zone schedule (default for 8 players, 20 minutes)**

| Phase        | Starts at | Zone radius | Warning before shrink | Out-of-zone damage |
|--------------|-----------|-------------|-----------------------|--------------------|
| Drop         | 0:00      | 150 m       | n/a                   | none               |
| Phase 1      | 4:00      | 100 m       | 60 s                  | 1 HP / 10 s        |
| Phase 2      | 9:00      | 60 m        | 45 s                  | 1 HP / 5 s         |
| Phase 3      | 14:00     | 30 m        | 30 s                  | 1 HP / 3 s         |
| Final circle | 18:00     | 12 m        | 20 s                  | 1 HP / s           |

The next zone centre is always random but fully inside the current zone, so nobody is cut off by a wall or a road.

**Health and eliminations**

- Every player starts with 3 HP.

- A **tag** (tap Tag within 5 m, server-confirmed) removes 1 HP from the target. A 10 s tag cooldown prevents spam.

- At 0 HP you are out and become a spectator.

- **Duel rule:** if two players tag each other within 2 s, both lose 1 HP. Keeps it fair when you meet face to face.

**Radar:** every player sees rivals within 60 m as a direction arrow and a distance band (60 m, 30 m, 10 m). No map dots, ever.

**Winning:** last player (or team) with HP above 0. If the final circle closes and several are left, the player with most HP wins; ties go to most tags.

**Scoring:** +10 per elimination, +2 per tag, +5 per zone phase survived, +25 for the win.

## Mode rulebook: Capture the Flag and Zombie Tag

### Capture the Flag

Two teams, two virtual flags at real GPS points. Steal theirs, protect yours.

- **Players:** 6 to 16, two equal teams. Each team has one Captain; the rest are Runners.

- **Map:** the area is split into two halves by a line the host draws. Each flag sits in a 10 m circle near the back of its half.

- **Grab:** stand inside the rival flag circle for 5 s (a progress ring fills on screen). Your dot is then revealed to everyone every 20 s while you carry it.

- **Score:** bring the flag back across the middle line into your half. +1 capture; the flag resets.

- **Defending:** in your own half you can tag intruders. A tagged intruder drops the flag (it returns home after 30 s) and must walk back to their own flag circle to respawn.

- **Win:** first to 3 captures, or most captures after 25 minutes.

- **Anti-camping:** defenders cannot stand inside their own flag circle for more than 20 s at a time.

### Zombie Tag

One zombie becomes many. Survive the outbreak.

- **Players:** 5 to 20. One random Zombie at the start (two if 12 or more players).

- **Infect:** a zombie tags a survivor within 5 m; the survivor turns into a zombie on the spot, with a full-screen glitch effect and a groan.

- **Safe houses:** 2 to 4 host-placed GPS spots. Standing in one gives 30 s of immunity, then that spot is used up for that player.

- **Zombie vision:** zombies see survivors as blurred blobs every 45 s. As more zombies join, pings come faster (every 30 s once half the players are infected).

- **Win:** zombies win if everyone is infected. Survivors win if anyone is human when the 15-minute timer ends. *Last Human* gets a special award.

- **Comedy rule:** the first infected player of each match gets the *Patient Zero* badge in the squad yearbook. Forever.

## Core mechanics in detail

Five systems power every mode. Each is tuned so that information is partial, timing matters, and the phone stays in the pocket most of the time.

### Tagging

- Phone GPS is usually accurate to a few metres outdoors in open areas and worse near tall buildings and under tree cover, so tagging never relies on a single distance number.

- A tag counts when **distance minus both players' reported accuracy** is at most 5 m, both positions are less than 3 s old, and the tagger is not on cooldown. It must also pass the Bluetooth proof described in Proximity tech below.

- Optional **Tap + Confirm:** the tagged player gets a 5 s prompt to tap *"Got me"*. If they ignore it, the server decides. Good for honest friend groups.

- Optional **QR tag:** each player's lock screen shows a QR; the tagger scans it. Perfect accuracy, slower, great for kids or dense city areas.

### Radar and pings

- **Radar** shows direction in 8 slices and distance in 3 bands (far, close, very close). It updates every 5 s in a pulse animation, never continuously.

- **Pings** reveal a player's area on the map for 3 s, offset by a random 15 to 40 m. The reveal is a soft blob, never a dot.

- **Heartbeat haptic:** the hunted player's phone pulses faster as the nearest hunter closes in (60 bpm at 50 m, 120 bpm at 10 m). This lets players feel danger without looking.

### The zone

- Zones are circles or the host's polygon. Shrinks are announced with a countdown, a map animation and a long buzz.

- Outside the zone you lose HP (Royale) or get a 60 s warning then auto-tagged (Hide & Seek).

- The next zone is always reachable on foot in the warning time at a walking pace of 1.3 m/s.

### Power-ups

Power-ups spawn at GPS points (random or host-placed). Walk within 8 m to collect. One held at a time.

| Power-up     | Effect                                         | Duration              |
|--------------|------------------------------------------------|-----------------------|
| Armor        | Blocks one tag                                 | Until used, max 5 min |
| Ghost        | Invisible on radar and pings                   | 20 s                  |
| Decoy        | A fake blob appears 50 m away in the next ping | One ping              |
| Snoop        | Reveals the nearest rival's area once          | Instant               |
| Pulse jammer | Rivals within 30 m lose radar                  | 15 s                  |

### GPS fairness

- Every position is checked server-side for speed (over 7 m/s for more than 5 s is flagged as a vehicle or spoofing).

- Mock-location apps are detected on Android; a flagged player is shown with a warning badge.

- Players with poor accuracy are *protected*, not punished: no tags in or out until accuracy recovers.

### Revive Shields

Every player starts each match with **2 Revive Shields**. A Shield frees a locked friend, so getting tagged is no longer the end; it starts a rescue mission.

**How a revive works in real life**

1.  A tagged player is **locked** where they stand. Their phone shows a lock screen and they must stay within 5 m of that spot.

2.  Teammates see the locked player's exact position on their map (only teammates, never the hunters).

3.  A rescuer runs to the locked player and **holds their phone next to the locked phone for 5 seconds**. A ring fills on both screens. Bluetooth confirms the phones are really side by side (see Proximity tech below).

4.  One Shield is spent and the locked player is free, with **15 s of tag immunity** to escape.

**Rules**

- 2 Shields per player per match. Use them on the same friend twice or on two different friends.

- You cannot revive yourself, and Shields cannot be traded.

- If a hunter tags the rescuer during the 5 s revive, the revive fails, the rescuer is locked too, and no Shield is spent.

- **Anti-camping:** a hunter cannot stay within 10 m of a locked player for more than 20 s. After that, their radar goes dark for 30 s.

- Unused Shields at the end give +3 points each (rewards careful play), and every revive gives +10 (rewards bravery).

**By mode**

| Mode             | Who can revive                      | Notes                                               |
|------------------|-------------------------------------|-----------------------------------------------------|
| Hide & Seek      | Any hider                           | Hunters win only when all hiders are locked at once |
| Battle Royale    | Teammates only (team mode)          | Revive restores 1 HP; solo mode has no revives      |
| Capture the Flag | Teammates                           | Replaces walking back to your flag to respawn       |
| Zombie Tag       | Survivors, within 60 s of infection | A *cure*: after 60 s the infection is permanent     |

**Why it is fun:** rescues create the best stories. A friend sprinting across the park to save you, with a seeker closing in, is the moment people talk about afterwards.

### Proximity tech: making every tag provably real

GPS alone can drift several metres and can be faked with mock-location apps. So a tag needs **two proofs**: GPS says you are close, and a short-range radio signal proves the two phones are physically next to each other. A fake GPS position cannot fake a radio signal heard in the park.

**Technology options**

| Tech                                     | Range and accuracy                                                                                                                                                              | Phones that have it                                                                                                                                                                                                    | Role in Snoopzy                                          |
|------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| GPS                                      | Metres, worse near buildings and trees                                                                                                                                          | Every phone                                                                                                                                                                                                            | Map, zone, radar, pings, venue check-in                  |
| Bluetooth LE tokens                      | Detects phones within roughly 10 m; signal strength is a rough distance guide, reliable only within a few metres ([study](https://ricerca.uniparthenope.it/handle/11367/86991)) | Every phone                                                                                                                                                                                                            | **Default tag proof.** Required for every tag and revive |
| UWB (ultra-wideband)                     | Precise distance and direction                                                                                                                                                  | Some flagships: Pixel Pro models, Galaxy S Plus/Ultra, Fold ([Android docs](https://developer.android.com/develop/connectivity/uwb))                                                                                   | **Precision tag** when both phones support it            |
| Bluetooth Channel Sounding (Bluetooth 6) | Precise distance over normal Bluetooth                                                                                                                                          | New: API since Android 16, first phone Pixel 10 ([Nordic](https://www.nordicsemi.com/Nordic-news/2025/10/Nordics-Android-app-and-nRF54L-Series-evaluate-Bluetooth-Channel-Sounding-using-the-Google-Pixel-10?lang=en)) | Future precision tag as more phones get it               |
| QR scan                                  | Exact, needs line of sight                                                                                                                                                      | Every phone (camera)                                                                                                                                                                                                   | Fallback when Bluetooth fails, and for disputed tags     |
| NFC tap                                  | Touch distance                                                                                                                                                                  | Most phones, but Android removed phone-to-phone NFC sharing                                                                                                                                                            | Not suitable for phone-to-phone tags                     |

**How a Bluetooth-proved tag works**

1.  During a match, every phone broadcasts a **rotating secret token** over Bluetooth LE. The server issues a new token every 5 s, so a token cannot be copied and replayed later.

2.  Each phone constantly logs which tokens it hears and how strong they are.

3.  When a seeker taps Tag, the phone sends the server: its GPS, and the target's token it just heard with signal strength.

4.  The server accepts the tag only if **the token is fresh (under 5 s old), the signal is strong enough for about 5 m, and GPS agrees roughly**.

5.  If the target has UWB or Channel Sounding and so does the seeker, the app uses that instead for an exact distance.

**What this fixes**

- **Fake GPS players** cannot tag or be immune, because they cannot produce a nearby radio token.

- **GPS drift** no longer causes unfair tags: if radio says you are next to each other, you are.

- **Bad network:** Bluetooth proof is captured offline and the tag syncs when the network returns, with the original timestamp.

- **Hiding the phone** (leaving it in one place and walking away): the app checks the phone is moving like a carried phone (motion sensors) and flags a phone that has not moved at all for 5+ minutes while its owner is pinged elsewhere.

**Honest limits:** Bluetooth signal strength is affected by bodies, pockets and walls, so the threshold must be tuned in playtests. Phones also need Bluetooth and location permissions on, which the lobby checks before Ready.

## Squads and the social layer

The match is 20 minutes; the squad is forever. This layer is what keeps a friend group coming back weekly, and what makes Snoopzy more than a one-time novelty.

### Squads

- A **squad** is a saved friend group: name, colour, crest (built from stickers) and a one-line motto.

- Rooms can be started *from a squad* with one tap; everyone in the squad gets a push: *"Kabir is starting a Snoopzy at Cubbon Park. You in?"*

- A player can be in several squads (college, cousins, office). Stats are tracked per squad.

### Rivalries

- **Head-to-head records** between every pair of friends: *"Sana has tagged you 7 times. You've tagged her twice."*

- **Nemesis:** the friend who tagged you most this month gets a crown on your profile.

- **Revenge bonus:** tagging your nemesis gives +5 points and a special sound.

### Awards and roasts

Every recap gives 3 to 5 awards built from real match data, written in a cheeky voice. Examples:

| Award                 | Trigger                                | Recap line                                        |
|-----------------------|----------------------------------------|---------------------------------------------------|
| Ghost of the Fountain | Survived without moving more than 10 m | *"Riya didn't move for 14 minutes. Is she okay?"* |
| Cardio King           | Most distance covered                  | *"Kabir ran 2.1 km and caught nobody."*           |
| Speedrun              | Tagged first                           | *"Dev lasted 3 minutes. A new record."*           |
| Close Call            | Hunter within 3 m and escaped          | *"Sana was RIGHT THERE. Meera stayed still."*     |
| Patient Zero          | First zombie                           | *"It started with Arjun. It always does."*        |

Roasts are always about the game, never about bodies, looks or anything personal. Players can mute roasts for themselves.

### The squad yearbook

- A scrollable history of every match: date, place, mode, winner, awards, and a mini map of the route replay.

- **Map of legends:** a map of every spot the squad has played, with pins like *"Where Dev hid in the dustbin shed"*.

- **Squad stats:** matches played, total distance, best hider, best seeker, longest survival.

- End-of-year **Snoopzy Wrapped**: a shareable recap story of the squad's year.

### Rituals and seasons

- **Weekly squad challenge:** e.g. *"Win one Zombie Tag as the last human"*. Completing it gives a squad badge.

- **Seasons** of 8 weeks with a squad ladder. Reset keeps the yearbook, refreshes the competition.

- **Rematch button:** in the recap, *"Rematch, same rules"* or *"Rematch, swap roles"*.

### Chat and sharing

- **Lobby text chat** with sticker taunts. Muted during the match except for spectators.

- **Voice chat** (after MVP): team-only during matches, everyone in the lobby and recap.

- **Share card:** a short route-replay clip and award image to post on WhatsApp or Instagram Stories, with an invite code built in.

### Player profiles and lobbies: the location logic

Online battle royales match random strangers from anywhere. Snoopzy is the opposite: everyone must be **in the same real place**, and most groups are **people who know each other**. So the lobby is built around a venue, not a server queue.

#### The IRL player profile

- **Public card:** handle, avatar, level, badges, favourite mode, and *Snoopzy Rating*. No real name, no home area, no exact play locations.

- **Career stats:** matches, wins per mode, tags, revives, survival time, distance run.

- **Squad view (friends only):** head-to-head records, nemesis, yearbook, map of legends.

- **Two kinds of ranking,** because most matches are between friends:

  - *Squad rank* (main): your position inside each squad's season ladder. This is meaningful because you play these people every week.

  - *Global achievements* (absolute, not vs. other players): e.g. *Survived 50 rounds*, *100 revives*, *10 km run*. Fair even if you only ever play with the same 5 friends.

  - A skill rating is only counted in Open lobbies (below), where you meet many different players.

#### Three lobby types

| Lobby           | Who can join                                                   | Discoverable                        | Default                    |
|-----------------|----------------------------------------------------------------|-------------------------------------|----------------------------|
| **Private**     | Anyone with the code, QR or invite link                        | No                                  | Yes, for everyone          |
| **Squad**       | Members of a saved squad get a push invite                     | Only to squad                       | One tap from a squad page  |
| **Open Nearby** | Verified players physically near the venue, with host approval | Yes, within about 1 km of the venue | Off; adults only at launch |

#### Venue check-in: you must actually be there

Every lobby is anchored to its **play area**. Joining and playing are separate steps:

1.  **Join from anywhere.** Friends at home or on the way can join the lobby early to chat and vote on rules.

2.  **Status in the lobby** shows only *At venue*, *On the way* or *Not coming*. No distances or live location before the match, so nobody's home is revealed.

3.  **Check in to play.** To tap Ready, a player must be inside the play area by GPS **and** be heard over Bluetooth by at least one checked-in player. A fake GPS position from home cannot pass this.

4.  **Host decides:** start now, or wait for *On the way* players (the host sees how many are pending, not where they are).

#### Friends who are not at the venue

Not being there should not mean being left out. Remote friends get roles that are fun but cannot ruin fairness:

- **Spectator:** watches the live match with a short delay (30 s), so they cannot call out positions in real time.

- **Eye in the Sky (optional role):** one remote friend per team sees the same radar as their team and can talk on team voice chat. Like a squad commander. Host can turn it off.

- **Commentator:** posts reactions and short voice clips into the recap.

#### Strangers in Open Nearby lobbies

Open play helps people find games, but meeting strangers in real life needs strong guardrails:

- Off by default. 18+ only at launch, with a verified phone number and an account at least 7 days old.

- Only **public venues** (parks, grounds, campuses that allow it), only in daylight hours.

- The lobby shows the venue and the host's public card, never players' locations before check-in.

- The host approves every join request and can remove anyone. Players can block and report; reports lower a player's trust score and can ban them from open lobbies.

- Private and Squad lobbies are never shown to strangers.

## Venues and setup

The best venue is open enough for GPS to work, has lots of cover to hide behind, and is closed to traffic.

### Venue ratings

| Venue                                               | Rating          | Why                                            |
|-----------------------------------------------------|-----------------|------------------------------------------------|
| City park with trees and paths                      | Excellent       | Cover, open sky, no cars                       |
| College or school campus (with permission)          | Excellent       | Buildings for cover, defined boundary          |
| Residential colony / gated society                  | Good            | Familiar, safe; GPS weaker between tall blocks |
| Beach                                               | Good for Royale | Wide and open; little cover for Hide & Seek    |
| Mall, market, busy streets                          | Avoid           | Crowds, traffic, weak GPS indoors              |
| Private property, railway areas, lakesides at night | Never           | Trespass and safety risk                       |

### Area size by player count

| Players  | Hide & Seek area | Battle Royale start radius |
|----------|------------------|----------------------------|
| 3 to 5   | 60 × 60 m        | 80 m                       |
| 6 to 8   | 100 × 100 m      | 150 m                      |
| 9 to 12  | 150 × 150 m      | 200 m                      |
| 13 to 20 | 200 × 200 m      | 250 m                      |

The app suggests the size automatically when the host draws the area and warns if it is too big or too small for the number of players.

### Host checklist (shown in the app before Start)

- Everyone's phone is above 30% battery (the lobby shows each player's battery).

- Location set to *Precise* and *Allow all the time* during the match.

- Boundary drawn; roads, water and private property marked no-go.

- Meeting point set (shown on everyone's map) for the end of the match.

- Match end time chosen, before dark if outdoors.

### What to bring

- Phone, charged. A power bank for 30+ minute sessions.

- Comfortable shoes and water.

- Optional: a small speaker at the meeting point for the recap sounds.

## Safety and house rules

People will be running in public with their eyes on a phone. Safety has to be built into the rules, not left to luck.

### Built into the app

- **First-match safety card** that every player must swipe through once: look up when moving, no roads, no trespassing, no climbing, respect other people in the park.

- **No-go zones** the host marks. Entering one sends a strong buzz and a voice line: *"Out of bounds. Head back."* Staying in for 30 s auto-tags the player.

- **Look-up mode:** when a player is moving faster than a jog, the screen dims to the essentials so they are not staring at the map while running.

- **Speed check:** sustained vehicle speed pauses that player and alerts the host.

- **SOS button** (hold for 2 s): pauses the match for everyone, shows that player's exact location to all players and opens the phone dialer. A real emergency beats any game.

- **Dusk warning:** the app warns the host when a match would end after sunset.

- **Private by design:** location is visible only to players in the room, only during the match; exact positions are deleted after the recap unless everyone opted in to replays.

### House rules (shown in the lobby, host can add their own)

1.  No running across roads. Ever.

2.  No hiding in places you could not get out of quickly.

3.  No physical tackling. A tag is a phone tap, not a push.

4.  If a stranger or guard asks you to stop, stop. The host can pause the match.

5.  Anyone can call a time-out by pressing Pause; the host decides when to resume.

### Younger players

- Players under 18 need the host to confirm a parent or guardian knows about the session.

- An optional **Guardian view** shares the child's location with a parent during the match only.

- Before launch, check Google Play's policies for apps used by children and teens, and India's data protection rules for children's data.

## Tuning table

These are the starting defaults. They are guesses to be corrected by playtests, and every one is a host-editable rule.

| Setting           | Hide & Seek                            | Battle Royale         | Capture the Flag        | Zombie Tag                        |
|-------------------|----------------------------------------|-----------------------|-------------------------|-----------------------------------|
| Players           | 3 to 12                                | 4 to 20               | 6 to 16                 | 5 to 20                           |
| Round length      | 20 min                                 | 20 min                | 25 min                  | 15 min                            |
| Head start / drop | 3 min                                  | 2 min                 | 1 min                   | 1 min                             |
| Hunter ratio      | 1 per 3 to 4                           | everyone              | equal teams             | 1 zombie (2 if 12+)               |
| Tag distance      | 5 m                                    | 5 m                   | 5 m                     | 5 m                               |
| Tag cooldown      | 10 s                                   | 10 s                  | 10 s                    | 5 s                               |
| Lives / HP        | 1                                      | 3 HP                  | respawn at own flag     | 1 (then zombie)                   |
| Radar pulse       | every 30 s                             | every 5 s, 60 m range | own half only           | 40 m, survivors only              |
| Map pings         | every 3 min, then 30 s in final minute | none                  | flag carrier every 20 s | every 45 s, 30 s at half infected |
| Ping blur         | 40 m                                   | n/a                   | 10 m                    | 30 m                              |
| Area shrink       | to 70% at halfway                      | 4 phases to 12 m      | none                    | none                              |
| Power-ups         | 3 on map                               | 5 on map              | none                    | 2 safe houses per 6 players       |

**Rules of thumb for hosts**

- Matches feel best between **12 and 25 minutes**. Shorter feels like a warm-up, longer and people get bored or tired.

- If hunters win in under 5 minutes twice in a row, increase the area or the head start.

- If nobody gets tagged in the first 10 minutes, shrink the area or ping more often.

- Play three short rounds and rotate roles rather than one long round.

## IRL playtest plan

Test the fun before building the polish. Each test is a real session with friends in a real park, and each answers one question.

| Test                 | Build needed                             | Question it answers                                | Pass if                                                     |
|----------------------|------------------------------------------|----------------------------------------------------|-------------------------------------------------------------|
| 1\. Dot test         | Live map with everyone's dot             | Is GPS accurate enough to tag fairly in your park? | Disputed tags under 1 in 5                                  |
| 2\. Radar test       | Radar + pings + heartbeat, no exact dots | Does partial information create tension?           | At least one *"they walked right past me"* moment per match |
| 3\. Full Hide & Seek | MVP: rooms, roles, tagging, recap        | Does a full 20-minute match hold attention?        | 6+ friends finish 3 rounds                                  |
| 4\. Recap test       | Awards, roasts, share card               | Does the recap make people laugh and share?        | Recap shared in the group chat without prompting            |
| 5\. Week-later test  | Squads + yearbook                        | Will they come back on their own?                  | Squad starts a match within 7 days                          |

### What to measure every session

- Rounds played per session and how many players stay for round 3.

- Time to first tag and share of matches won by each side (aim for close to 50/50).

- Disputed tags (players saying *"no way that counted"*).

- Battery used per 20-minute match.

- Laughs and quotes: write down the funniest moments; they become award ideas.

### After each session, ask three questions

1.  What was the most fun moment?

2.  When were you bored or confused?

3.  What rule would you change?

**Next step:** build the live map with everyone's dot (test 1) and try it in a real park with 4 friends. It shows how accurate GPS is where you actually play, before the rest of the game is built on top of it.
