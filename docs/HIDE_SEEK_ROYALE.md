# Snoopzy — Hide & Seek Royale: Modes, Zone and Roles

2026-10-29 · @vishnu

## The idea

**Keep Hide & Seek as the engine and add two things on top: a shrinking zone that squeezes everyone together, and a small set of roles that give each friend a secret job and a tough choice.** Hide & Seek stays the first game anyone learns; each step up adds one new idea.

The shrinking zone solves hide-and-seek's biggest weakness: a great hider who simply never moves. The zone forces movement, so every round ends in a tense scramble instead of a stalemate. Roles solve the other weakness: after a few rounds it feels the same. A new secret role each round makes every game different, and gives friends something to argue about afterwards.

### The ladder

Each step is a mode the host can pick. Players move up when their group is ready.

| Step | Mode                              | What's new                                                    | Rules to learn | Best for                 |
|------|-----------------------------------|---------------------------------------------------------------|----------------|--------------------------|
| 1    | **Classic Hide & Seek**           | Radar, pings, Revive Shields                                  | 3              | First game, any age      |
| 2    | **Squeeze Hide & Seek**           | Play area shrinks once at halfway                             | +1             | Adds a finish            |
| 3    | **Hide & Seek Royale** (flagship) | Zone shrinks in phases, the zone pushes hiders toward seekers | +2             | Regular squads           |
| 4    | **Royale + Roles**                | Every player gets a secret role card                          | +1 per role    | Squads who want drama    |
| 5    | **Team Royale**                   | Two squads race, roles per team, shared zone                  | +2             | Campus and office events |
| 6    | **Free-for-All Royale**           | Everyone hunts someone and is hunted by someone               | +2             | Big fest nights          |

**Golden rule:** a new player should be able to join a game in under a minute. Never add a role or rule that needs more than one sentence to explain.

## Flagship mode: Hide & Seek Royale

**In one sentence:** hiders try to outlast the seekers while a glowing zone keeps shrinking, so there is nowhere left to hide.

### How a round works

1.  **Roles dealt.** Seekers and hiders are chosen; in Royale + Roles everyone also gets a secret role card (see Role roster).

2.  **Scatter (3 min).** Hiders spread out inside the big starting zone. Seekers wait, screens dark.

3.  **Hunt begins.** Seekers get radar pulses. The zone is still big, so hiders can stay hidden.

4.  **Zone shrinks (every 4–5 min).** The map shows the next, smaller circle with a 60-second warning. Anyone outside it takes damage or is locked.

5.  **Hiders get squeezed.** As the zone closes, hiders can't stay still. They must move through the seekers' area, which is where the best chases happen.

6.  **Tagged hiders are locked,** not out. Friends can rescue them with Revive Shields while the zone keeps closing, so every rescue is a gamble.

7.  **Final circle.** Tiny zone, rapid pings, everyone close together: the loudest, funniest minute of the game.

8.  **Win.** Seekers win if every hider is locked at once. Hiders win if at least one is free when the timer ends.

### What makes it different from plain Hide & Seek

| Plain Hide & Seek                       | Hide & Seek Royale                                  |
|-----------------------------------------|-----------------------------------------------------|
| Best hider can sit still for 20 minutes | The zone forces everyone to move                    |
| Seekers wander and hope                 | Zone tells seekers roughly where hiders must end up |
| Caught = out                            | Caught = locked, rescue possible                    |
| Ends when someone gets bored            | Ends in a final circle with a clear climax          |
| Same every round                        | Different zone, different roles                     |

### Seeker fairness

A closing zone also helps seekers, so hiders get **compensation**: a head start, one free Ghost use, and the first pick of safe pockets (see zone twists). Tune the numbers in playtests so each side wins close to half the time.

## The shrinking zone

The zone is the clock of the game. Every few minutes the safe circle jumps to a smaller one that sits fully inside the last, and everyone outside it must get in.

<figure data-embed="node/fef570ac-67b1">

<figcaption>zone phases · 5 rings, to scale</figcaption>
</figure>

Rings are to scale for an 8-player match. The next ring's centre is random but always inside the current one, so nobody is cut off by a road or a lake.

### Zone rules (kept to three)

1.  **Next ring is shown early.** A 60 s warning with a buzz and a countdown on every phone.

2.  **Outside = burn.** After a 10 s grace, you are **locked** where you stand. Locked outside the zone means your rescuers must run out to you.

3.  **Rescued players get 15 s of safety** to run into the zone.

### Zone sizes by player count

| Players | Start radius | Final circle | Round length |
|---------|--------------|--------------|--------------|
| 4–6     | 100 m        | 10 m         | 15 min       |
| 7–10    | 150 m        | 12 m         | 20 min       |
| 11–16   | 200 m        | 15 m         | 25 min       |
| 17–20   | 250 m        | 20 m         | 30 min       |

The app checks the drawn play area and shrinks the start radius automatically if there is not enough open space, and never places a ring on a no-go zone.

### Zone twists (host can switch on)

| Twist            | What happens                                                                            | Why it's fun                                       | Complexity |
|------------------|-----------------------------------------------------------------------------------------|----------------------------------------------------|------------|
| **Safe pockets** | Two small bonus circles appear in the old zone for 60 s; standing in one gives immunity | A tempting detour that pulls hiders toward seekers | Low        |
| **Moving zone**  | The ring drifts slowly in one direction instead of jumping                              | Everyone shifts together; feels like a chase       | Medium     |
| **Hot zone**     | One random patch inside the zone pings everyone in it every 20 s                        | Risk vs reward: hot zones hold power-ups           | Medium     |
| **Split zone**   | Two circles at once; each player must pick one                                          | Splits friends, creates 2 mini-games               | Medium     |
| **Reverse zone** | The final circle is the *starting* place, then it grows                                 | Short games for small areas                        | Low        |
| **Night zone**   | Ring glows brighter; smaller map; short timers                                          | After-dark campus play                             | Low        |

## Role design rules

Roles are only fun if everyone understands them in seconds, and if other players can read them. Every role must pass these six tests before it ships.

| \#  | Rule                                                                                                                   | Why                                                               | Test                                                             |
|-----|------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|------------------------------------------------------------------|
| 1   | **One sentence.** The role is explained in a single line                                                               | Players learn from the lobby card, not a manual                   | A friend can repeat it back after one read                       |
| 2   | **One button.** One ability, with a cooldown, or one passive perk                                                      | Players are running; they have one thumb                          | The ability fits on one big button                               |
| 3   | **Never a knockout.** Roles change information, speed of rescue or positions; they never remove a player from the game | Nobody should be out because of a role                            | No role can lock someone by itself                               |
| 4   | **A visible tell.** Using an ability leaves a clue others can notice (a buzz, a blip, a sound)                         | The game stays readable; clever players can bluff and read bluffs | Each ability has an "others notice" cue                          |
| 5   | **A built-in counter.** Every role has a simple way to beat it                                                         | No role feels unfair; keeps outsmarting fun                       | The counter fits in one sentence too                             |
| 6   | **Safe by design.** No ability rewards running across roads, climbing, or entering no-go areas                         | Real-world safety comes first                                     | Abilities work by standing still, choosing, or using information |

**Roles are rules data, not code:** each role is a small record (name, side, button, cooldown, tell) in the rules file, so new roles can ship without an app update.

### The shape of a role card

Every role card shows the same five lines, so they are quick to read:

1.  **Name and side** (Hider, Seeker, Secret)

2.  **One line** ("Vanish for 20 seconds")

3.  **Button** (what it does and how long until you can use it again)

4.  **Others notice** (the tell)

5.  **Beaten by** (the counter)

## Role roster

Twelve roles in three groups. Hide & Seek Royale starts with a handful and adds more as players get comfortable (see Role deals).

### Hider-side roles

| Role                        | One line                         | Button                                                                                                                                               | Cooldown |
|-----------------------------|----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| **Ghost**                   | Vanish for 20 seconds            | Go dark on radar and pings. Works only while you stand still; moving breaks it                                                                       | 120 s    |
| **Medic**                   | Rescue faster, carry more        | Starts with 3 Revive Shields (others have 2); a revive takes 3 s of holding phones together instead of 5                                             | Passive  |
| **Trickster**               | Plant a fake you                 | Drops a decoy blip that shows up in the next ping, 40 m from your real spot                                                                          | 90 s     |
| **Scout**                   | See who's coming                 | For 5 s, see an arrow to each seeker (direction only, no distance)                                                                                   | 60 s     |
| **Bodyguard**               | Take a lock for a friend         | Pick a buddy at the start. Once per round, if your buddy would be locked while you are within 10 m, you are locked instead                           | Once     |
| **VIP** (the Birthday Boss) | Everyone knows you, protect them | Passive: the squad sees your blurred area all game (gold dot). If you are free at the end, hiders earn a bonus; seekers earn a bonus for locking you | Passive  |

### Seeker-side roles

| Role        | One line            | Button                                                                                                           | Cooldown    |
|-------------|---------------------|------------------------------------------------------------------------------------------------------------------|-------------|
| **Tracker** | Sniff out one hider | Reveal the nearest hider's area (blurred 25 m) once                                                              | 120 s       |
| **Trapper** | Set two snares      | Place a 10 m snare circle where you stand (max 2). Any hider who walks into one is pinged to all seekers for 5 s | 2 per round |
| **Siren**   | Make them move      | Wail: every hider within 40 m gets a loud alert and must show on the seekers' radar for 5 s                      | Once        |
| **Pouncer** | Bigger reach        | For 6 s your tag distance is 10 m instead of 5 m                                                                 | 120 s       |

### Secret and neutral roles

| Role         | One line                               | Button                                                                                                                    | Cooldown    |
|--------------|----------------------------------------|---------------------------------------------------------------------------------------------------------------------------|-------------|
| **Mole**     | A hider who secretly helps the seekers | Looks like a normal hider. Once per round, **Tip off**: send seekers one blurred ping of any hider. Wins with the seekers | Once        |
| **Wildcard** | Never the same twice                   | Every 3 minutes you get a random one-use ability from Ghost, Trickster or Scout                                           | Every 3 min |

### How others read each role

| Role      | Others notice (the tell)                                                               | Beaten by                                                                       | The moment it creates                                      |
|-----------|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|------------------------------------------------------------|
| Ghost     | Their dot flickers off the radar                                                       | Walk close: the heartbeat still works; or wait — 20 s is short                  | "I swear someone was right here!"                          |
| Medic     | Seekers see a Medic exists (role count shown)                                          | Lock the Medic first: fewer shields on the team                                 | Friends fight to protect the Medic                         |
| Trickster | A fake blip appears; real ones don't flash                                             | A Tracker's sniff marks fakes                                                   | Three seekers chase a fake while the real hider walks past |
| Scout     | The nearest seeker's phone buzzes once                                                 | Bait it: seekers can feint toward them                                          | A perfect, silent escape                                   |
| Bodyguard | Buddy link is visible to both of them only                                             | Tag when the Bodyguard is more than 10 m away                                   | A friend takes the hit for you                             |
| VIP       | Gold dot for the squad                                                                 | Hide in the crowd; seekers know a VIP exists                                    | Squad decides: protect the VIP or run                      |
| Tracker   | Hider's phone gets a soft "sniffed" buzz                                               | Move after the buzz                                                             | "Don't move! — No, MOVE!"                                  |
| Trapper   | Snares show as faint rings to **seekers only**; hiders feel a light buzz as they cross | A Scout's button also shows snare rings for 5 s, so hiders can walk around them | Stepping on one gets the loudest groan in the park         |
| Siren     | Everyone in range hears a wail                                                         | Stay more than 40 m away                                                        | A mass scramble                                            |
| Pouncer   | A short whoosh sound                                                                   | Stay more than 10 m away                                                        | A hider escapes from just out of reach                     |
| Mole      | Seekers get a tip; hiders see "A tip was sent" (not by whom)                           | **Expose** (see Friend-tension moments)                                         | "It was YOU!"                                              |
| Wildcard  | Whatever ability was drawn                                                             | Same counters as the drawn ability                                              | Pure chaos and laughter                                    |

Seekers always know the *number* of each hider-side role in the match (e.g. "1 Ghost, 1 Medic, 1 Mole") but never who holds them. Hiders know the seekers' roles.

## Friend-tension moments

The best stories in a friend group come from **tough choices and small betrayals**, not from the rules themselves. These are the dilemmas the roles and the zone are designed to create, plus the one-sentence rule behind each.

| Moment                    | The dilemma                                                                        | Rule behind it                                                                                                                                    | What friends say afterwards             |
|---------------------------|------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| **Rescue or run?**        | A friend is locked 40 m away, a seeker is closing in, and the zone shrinks in 30 s | A revive takes 3–5 s of holding phones together; the rescuer is vulnerable the whole time                                                         | "I came back for you!" / "You left me!" |
| **Who's the Mole?**       | Seekers keep finding spots only your squad knew                                    | Mole's one tip-off is announced ("A tip was sent"), never who sent it                                                                             | "I knew it was you"                     |
| **Expose**                | Accuse someone of being the Mole, and be right or wrong                            | Any free hider can spend one Revive Shield to *Expose* a suspect. Right: the Mole is revealed and locked for 30 s. Wrong: you are locked for 30 s | "You cost us the game!"                 |
| **The sacrifice**         | Your buddy is about to be locked; you can step in                                  | Bodyguard swaps the lock to themselves, once                                                                                                      | "You took one for the team"             |
| **Protect the VIP**       | The birthday friend is a walking target                                            | VIP is visible to the squad; seekers earn a bonus for locking them                                                                                | "We lost because we babysat"            |
| **The shield economy**    | Two Revive Shields: save a close friend now, or keep one for the final circle      | Shields can't be traded; unused shields score points                                                                                              | "You wasted it on HIM?"                 |
| **Zone gamble**           | A safe pocket is right next to a seeker                                            | Pocket gives 60 s immunity, appears in plain view                                                                                                 | "The pocket was a trap!"                |
| **Crowd Boost**           | Locked friends watching from the sidelines decide who gets help                    | Every 5 min, all locked players vote for one free hider who gets a free Ghost                                                                     | "You didn't vote for me!"               |
| **Final circle standoff** | Two hiders and one seeker, a 12 m circle, 40 seconds left                          | Pings every 20 s, heartbeat at max                                                                                                                | Everyone screaming                      |
| **The reveal**            | At the end every role is shown                                                     | Recap shows each role, each ability use and a *Plot Twist* award                                                                                  | "I had no idea!"                        |

### Rules for fair betrayal

Betrayal is fun only when it stays a game and doesn't hurt feelings.

- Roles are dealt **at random**, so nobody can claim someone was chosen to be "the bad one".

- The Mole's **win is shared with the seekers**, so it is a clear job, not a personal attack.

- Reveal screens **celebrate** the Mole ("Plot Twist!") rather than shame them.

- The host can turn off the Mole and Expose for groups that dislike social-deduction games.

- **Never** assign a secret role based on a real-life relationship or characteristic.

## Role deals by player count and balance

Players learn roles in **levels**, so no first match overwhelms anyone. The host picks a level; the default grows automatically as the squad plays more.

| Level             | Roles in play                                     | Who it's for                    |
|-------------------|---------------------------------------------------|---------------------------------|
| **0. Plain**      | No roles; Revive Shields only                     | First game, kids' table, guests |
| **1. Starter**    | Ghost, Medic (hiders); Tracker (seeker)           | After the first 2 matches       |
| **2. Mind games** | Starter + Trickster, Scout, Pouncer               | After 5 matches                 |
| **3. Drama**      | Everything above + Bodyguard, Trapper, Siren, VIP | Regular squads                  |
| **4. Full chaos** | Everything + **Mole** and Wildcard                | Squads who love secrets         |

### How many seekers and which roles

| Players | Seekers | Hiders | Starter set                                             | Full set (level 4)                                                            |
|---------|---------|--------|---------------------------------------------------------|-------------------------------------------------------------------------------|
| 4–6     | 1       | 3–5    | Seeker: Tracker. Hiders: Ghost, Medic                   | Seeker: Tracker. Hiders: Ghost, Medic, Mole                                   |
| 7–9     | 2       | 5–7    | Tracker + Pouncer. Ghost, Medic, Trickster              | Tracker + Trapper. Ghost, Medic, Trickster, Scout, Mole                       |
| 10–13   | 3       | 7–10   | Tracker, Pouncer, Siren. Ghost, Medic, Trickster, Scout | Tracker, Trapper, Siren. Ghost, Medic, Trickster, Scout, Bodyguard, VIP, Mole |
| 14–20   | 4–5     | 9–15   | As above plus a second Medic                            | As above plus a second Ghost, Wildcard, second Mole                           |

**Role rules of thumb:** at most one of each secret role per 8 players; never two Moles on the same small squad; always at least one Medic when there are 6 or more hiders; the host can ban any role.

### Balance knobs

| Knob               | Where it lives | Starting value            |
|--------------------|----------------|---------------------------|
| Cooldowns          | Role record    | As in the roster          |
| Ghost duration     | Role record    | 20 s                      |
| Trapper snare size | Role record    | 10 m                      |
| Siren range        | Role record    | 40 m                      |
| Hider head start   | Rules          | 3 min                     |
| Zone speed         | Rules          | Table in the zone section |
| Revive time        | Rules          | 5 s (Medic 3 s)           |
| Expose penalty     | Rules          | 30 s lock                 |

Track **win rate by role and by side** in analytics. Aim for hiders winning 45–55% of rounds; any single role present in winning rounds more than 65% of the time needs a nerf, and one under 35% needs a buff. These are starting targets to check with real data.

## Winning, scoring and secret goals

There are **two scoreboards**: the team result (who won the round) and the personal score (who played best). Even losing players can win a personal award, so nobody sits out feeling useless.

### Team result

| Side      | Wins when                                                                                             |
|-----------|-------------------------------------------------------------------------------------------------------|
| Hiders    | At least one hider is free when the timer ends **or** the final circle closes with a hider still free |
| Seekers   | Every hider is locked at the same moment                                                              |
| Mole      | Wins with the seekers                                                                                 |
| VIP bonus | Hiders earn +20 squad points if the VIP is free at the end; seekers earn +20 for locking the VIP      |

### Personal points

| Action                                       | Points   |
|----------------------------------------------|----------|
| Survive each full minute free (hider)        | +1       |
| Free at the end (hider)                      | +10      |
| Lock a hider (seeker)                        | +8       |
| Revive a friend                              | +10      |
| Revive a friend who then survives to the end | +5 bonus |
| Unused Revive Shield at the end              | +3 each  |
| Successful Expose                            | +8       |
| Wrong Expose                                 | −3       |
| Mole: each hider locked after your tip-off   | +4       |
| Complete your secret goal                    | +10      |

### Secret goals (one per role, shown only to the player)

A secret goal gives every role something to chase even when the team is losing.

| Role      | Secret goal                                         |
|-----------|-----------------------------------------------------|
| Ghost     | Stay free for 10 minutes                            |
| Medic     | Revive two different friends                        |
| Trickster | Fool 3 seekers with a decoy                         |
| Scout     | Warn a friend using your arrow *(tell them aloud!)* |
| Bodyguard | Your buddy survives to the end                      |
| VIP       | Be free when the final circle opens                 |
| Tracker   | Lock 3 hiders                                       |
| Trapper   | Catch 2 hiders in snares                            |
| Siren     | Your Wail leads to a lock within 20 s               |
| Pouncer   | Lock a hider with a pounce                          |
| Mole      | Stay hidden as the Mole until the final circle      |
| Wildcard  | Use all three kinds of ability in one round         |

### Awards (recap)

Beyond the earlier awards (*Unsnoopable, Ghost of the \[place\], Cardio King/Queen, Close Call, Speedrun*), Hide & Seek Royale adds:

| Award                 | Trigger                                                 |
|-----------------------|---------------------------------------------------------|
| **Plot Twist**        | The Mole stayed hidden until the end                    |
| **Saviour**           | Most revives                                            |
| **Mastermind**        | Trickster's decoys fooled the most seekers              |
| **Crowd Favourite**   | Won the most Crowd Boost votes                          |
| **Last Dot Standing** | Last free hider in the final circle                     |
| **Betrayed!**         | Wrongly Exposed by a friend (always funny, always kind) |

## A sample match told as a story

**Setup:** 7 friends at a campus ground, Hide & Seek Royale at role level 4, on a short 12-minute round (zone shrinks at 4:00 and 9:00, final circle at 11:20). Seekers: Kabir (Tracker) and Sana (Pouncer). Hiders: Riya (Ghost), Meera (Medic), Dev (Trickster), Arjun (Bodyguard, buddy: Meera), Nila (Mole).

| Time      | What happens                                                                                                                         | The moment                                   |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|
| 0:00      | Roles are dealt. Hiders know the seekers' roles. Seekers see: "1 Ghost, 1 Medic, 1 Trickster, 1 Bodyguard, 1 Mole among the hiders." | Everyone checks who's looking at them        |
| 0:00–3:00 | Scatter. Riya wedges behind a pillar; Dev jogs to the far fence                                                                      | Silence on the ground                        |
| 3:10      | Seekers released. Kabir's first radar pulse shows a blob near the pillar                                                             | Kabir heads straight for it                  |
| 3:50      | Riya goes Ghost — vanishes from radar. Kabir walks within 6 m and finds nothing                                                      | "I held my breath!"                          |
| 4:00      | **Zone shrinks.** Ring 2 is shown; the far fence is outside it                                                                       | Dev must move toward the seekers             |
| 5:20      | Dev drops a decoy; it pings 40 m east. Sana charges at it                                                                            | Sana runs 80 m for nothing                   |
| 6:05      | A tip is sent: "A tip was sent." Seekers get a blurred ping on Meera                                                                 | Hiders look at each other                    |
| 6:30      | Sana pounces (10 m reach) and locks Meera                                                                                            | Meera is frozen by the water tank            |
| 6:45      | Arjun (Bodyguard) is 8 m from Meera, but the lock already happened; he must rescue instead                                           | He sprints; Kabir is 30 m away               |
| 7:10      | Arjun reaches Meera, holds phones together 5 s. Kabir arrives at 4 s and tags Arjun                                                  | Both locked. Groans                          |
| 8:00      | Locked friends vote Crowd Boost; Riya wins it, gets a free Ghost                                                                     | "Why Riya?!"                                 |
| 9:00      | Zone shrinks again; Nila (Mole) and Dev are the last hiders                                                                          | The tip came from one of them                |
| 10:30     | Dev suspects Nila, spends a shield to **Expose** her                                                                                 | Right! Nila is revealed and locked for 30 s  |
| 11:20     | Final circle. Dev and Riya (boosted Ghost) are free; 40 seconds left                                                                 | Heartbeats at maximum                        |
| 11:55     | Time. Dev and Riya are free: hiders win                                                                                              | Riya: Unsnoopable. Nila: Plot Twist (almost) |
| After     | Recap shows every role and every ability use                                                                                         | The group chat explodes                      |

**Why it works:** nobody is out for long, every ability had a clue others could read, and the zone gave every minute a reason to move.

## More ways to take the game forward

Once Hide & Seek Royale works, there are many directions. This map ranks them by effort and by how much extra fun each adds; positions are judgement calls, to be tested.

<figure data-embed="node/1d01d89d-05c9">

<figcaption>ways forward · effort vs impact · 11 ideas</figcaption>
</figure>

| Idea                          | What it is                                                                                                       | Why friends love it                                                              | Needs                                   |
|-------------------------------|------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|-----------------------------------------|
| **Pocket Round**              | A 5-minute round on a tiny area (30–60 m), one seeker, no roles                                                  | Fits a lunch break or a weekday evening; keeps squads playing between big nights | Small preset                            |
| **New role pack each season** | One new role every few weeks (e.g. "Magician swaps two blips")                                                   | Reason to come back; talk about it in the group chat                             | Roles are data, so very cheap           |
| **Birthday Boss mode**        | The birthday friend is the VIP; the whole squad protects or hunts them                                           | A ready-made party game; very shareable                                          | VIP role already planned                |
| **Crowd Boost votes**         | Locked players vote to help a free friend                                                                        | Keeps locked players involved                                                    | One vote screen                         |
| **Campus Cup**                | Inter-college tournament: squads from each college play rounds; a leaderboard and a final at a lakefront or fest | Rivalry between colleges; sponsors; press                                        | Brackets, scheduling, an organiser view |
| **Zombie Royale**             | Zombie Tag inside a shrinking zone; every infected player joins the zombies                                      | Pure chaos; works for big groups                                                 | Infection logic + zone                  |
| **Team Royale**               | Two squads in one zone; roles per team; shared final circle                                                      | Squad vs squad pride                                                             | Team logic, bigger areas                |
| **Safe-pocket zone twist**    | Small immunity circles appear during a shrink                                                                    | A tempting trap                                                                  | Zone feature                            |
| **Night Lantern**             | After-dark mode on lit campuses: each player has a lantern glow, shorter rounds                                  | Atmospheric; a hostel favourite                                                  | Lighting and safety rules               |
| **Chain Hunt**                | Free-for-all: everyone secretly hunts one friend and is hunted by another                                        | High tension, great for fests                                                    | Chain assignment, anti-cheat            |
| **Treasure Royale**           | Race to power-up drops while the zone shrinks                                                                    | Mixes exploration and racing                                                     | Drop placement                          |

**Suggested order:** (1) Hide & Seek Royale with Starter roles, (2) Pocket Round and Crowd Boost, (3) Birthday Boss and the Mole, (4) Campus Cup for the Coimbatore launch, (5) Team Royale and Zombie Royale.

## How players learn it in 60 seconds

The rule: **no one should read a manual.** Roles are taught by the card, by the countdown, and by doing.

### The role reveal (during the 10-second countdown)

1.  The screen goes dark and a card flips: big role icon, the name, and the one line (*"Ghost: vanish for 20 seconds"*).

2.  A 5-second looping animation shows the button in use.

3.  Two small lines: **Others notice** and **Beaten by**.

4.  A big *Got it* button; hold to peek again once during the match.

5.  Secret roles (Mole) get a calm card with no animation; the screen is angled-privacy dim so a friend can't read it over your shoulder.

### In the match

| Element        | Design                                                                                                                       |
|----------------|------------------------------------------------------------------------------------------------------------------------------|
| Ability button | One large round button bottom-right (mirrored for left-hand mode); a ring fills as the cooldown ends                         |
| Tells          | Each ability has a sound, a vibration pattern and a map effect for other players (e.g. a short double buzz for "Scout used") |
| Role badge     | Small icon in the top bar; tap to re-read the card                                                                           |
| Team view      | Hiders see which seeker roles are in play; seekers see counts of hider roles                                                 |
| Reveal         | At the end the recap shows every role card flipped, with ability timeline                                                    |

### Teaching aids

- **Level system:** roles are introduced in levels (see Role deals); the lobby shows only the roles in the current level.

- **Role of the match:** the lobby spotlights one new role with a 10-second demo.

- **Practice mode:** a solo walk where you try your own role's button on a simulated rival, so the first real use is not under pressure.

- **Cheat sheet:** a one-page "all roles" screen with the same five lines, available in the lobby and as a share image.

- **Languages:** English first; Tamil and Hindi role names and one-liners next, written with native speakers (some roles may keep the English name as a nickname).

### Test for "easy to understand"

Show the role card to someone who has never played; after 10 seconds ask them to explain it. If they can't, rewrite the role or drop it.

## What to build and test first

### Build order

| Step | Build                                                                                                                       | Depends on                | Done when                                             |
|------|-----------------------------------------------------------------------------------------------------------------------------|---------------------------|-------------------------------------------------------|
| 1    | Zone engine for Hide & Seek: one squeeze, then phased shrink, 60 s warning, grace, burn = lock                              | Existing rooms and ticker | A squad plays a full round and ends in a final circle |
| 2    | Locked state and Revive Shields working with the zone (rescue outside the zone, 15 s safety)                                | Step 1                    | Rescues feel risky and fair                           |
| 3    | **Starter roles**: Ghost, Medic, Tracker, plus the opt-in Mole (Tip off and Expose), with role cards and the ability button | Step 1                    | Players explain each role after 10 s                  |
| 4    | Trickster, Scout, Pouncer + tells (sound, buzz, map effect)                                                                 | Step 3                    | Others can read abilities in the field                |
| 5    | Crowd Boost vote and the recap's role reveal                                                                                | Step 3                    | Recap gets shared                                     |
| 6    | Bodyguard; VIP; Mole balance changes from playtests                                                                         | Step 4                    | Groups argue happily, not angrily                     |
| 7    | Trapper, Siren, Wildcard, zone twists                                                                                       | Step 6                    | Balance within target win rates                       |
| 8    | Pocket Round, Birthday Boss, Campus Cup tools                                                                               | Step 5+                   | Used by a campus without us                           |

### What changes in the server and data

- **Roles as data:** a `roles` list in the rules file (side, button, cooldown, tell, counter text); one generic `useAbility(role)` function checks the cooldown and writes an event.

- **Zone as data:** a list of phases (time, radius, warning), generated for the player count; the match ticker applies grace and lock.

- **New callables:** `useAbility`, `expose`, `castCrowdVote`; new events: ability use, tip-off, expose, vote, zone phase.

- **Private views:** each player's `views` node includes their own role card, their cooldowns and any tells aimed at them (so no one reads other roles from the data).

- **Anti-leak:** role assignments live server-side only; the Mole's identity is never sent to any client except the Mole's.

### Playtest questions

1.  Can a new player explain their role in 10 seconds?

2.  After a round, can players correctly say what the other roles did? (Are tells readable?)

3.  Does the zone create chases, or just confusion and complaints?

4.  Do friends laugh and argue, or do they feel cheated? (Ask after each round.)

5.  Do hiders win 45–55% of rounds?

6.  How many seconds does the average locked player wait for a rescue? (Target under 90 s.)

7.  Do locked players stay engaged (Crowd Boost, spectating) or put their phone away?

### Open decisions

- **Flagship after classic Hide & Seek:** Hide & Seek Royale (decided)

- **Mole role:** included in the first Royale release, as an opt-in secret role the host can switch off (decided)

- **Roles a first-time squad sees:** 3 Starter roles (Ghost, Medic, Tracker); more are unlocked by level (decided). The Mole is the only extra role that can be switched on from the start

- Flagship name: *Hide & Seek Royale* or something punchier (e.g. *Last Hider Standing*)?

- Should seekers ever be lockable (in Team and Free-for-all Royale)?

- Is VIP / Birthday Boss a launch feature or a later add-on?

- Which two roles should be renamed or localised first in Tamil?

- Which fun extra goes first after the Royale (Pocket Round, Crowd Boost, Birthday Boss, Campus Cup)? (no preference yet; the map above suggests Pocket Round and Crowd Boost)
