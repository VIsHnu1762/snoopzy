# Snoopzy — Core Concept (MVP Test Plan)

Nov 1, 2026

## The core

**Snoopzy's core is one 15-minute round of hide and seek among 4 to 8 friends, where a shrinking zone forces everyone together and a hold-to-tag moment decides who is out.** Nothing else ships until this one round is fun on its own. Modes, power-ups, voice and extra roles are layers we add only after friends ask for "one more round" without being told to.

The round has four parts: a short hide phase, a hunt phase, a zone that keeps shrinking, and a 5-second hold-to-tag that both players must stay inside for. Two revive shields per player and one secret twist give friends something to trust, bluff and argue about afterwards.

## What makes it engaging

The round must create five feelings. If a playtest misses one, we fix the core before adding anything.

| Feeling | Where it comes from | How we will see it |
| --- | --- | --- |
| Tension | Zone shrinks on a visible clock; 60 s warning before each ring | Hiders go quiet, players check the map more often |
| Trust and betrayal | Revive shields (2 each), one secret twist role | Arguments about who saved whom |
| Chase thrill | Hold-to-tag needs 5 s of staying within range, so escapes are possible | Real running, near misses |
| Fairness | Tag rules the server and both phones agree on | No "I never got tagged" disputes |
| Story to tell | End-of-round recap: who found whom, best escape, biggest betrayal | Friends retell it and ask for a rematch |

The thing that brings friends back is the rematch: rounds are short, the seeker rotates, and the recap gives something to settle next time.

## One round, minute by minute

A round for 6 players, about 15 minutes, in a park or campus the host has drawn on the map.

1. **Lobby (0 to 2 min).** Host shares a room code, everyone joins, one player is picked seeker, ready check confirms GPS and battery settings.
2. **Hide phase (2 to 4 min).** Hiders scatter inside the full zone. The seeker's phone is locked on a countdown and shows no map.
3. **Hunt (4 to 8 min).** Seeker starts. Hiders see a rough radar of the seeker; the seeker gets a ping on a random hider every 3 minutes.
4. **First shrink (8 min).** 60 s warning, then the zone drops a ring. Anyone outside after a 10 s grace is out.
5. **Tags and revives (any time).** Seeker holds Tag for 5 s within range to catch a hider. A caught hider can be revived once by a friend who holds phones with them for 5 s, using one of that friend's two shields.
6. **Final rings (8 to 15 min).** Zone shrinks to about 12 m, forcing the last hiders and the seeker into the same space.
7. **Recap (after).** Winner, who found whom, best escape, who used shields on whom, then a one-tap rematch with the next seeker.

## In the MVP, and what waits

The MVP holds only what the one round needs. Everything else is earned by playtest results.

| Piece | MVP | Later |
| --- | --- | --- |
| Mode | Hide and seek with shrinking zone | Zombie tag, capture the flag, other modes inspired by games like Manhunt and ShadowHunt |
| Players | 4 to 8, private room code, friends only | Open lobbies, strangers |
| Tagging | GPS hold-to-tag, 5 s, accuracy checks | Bluetooth or UWB proof if cheating or disputes appear |
| Roles | Seeker, hider, plus 1 secret twist role per round | Medic, Trickster, Scout and the rest of the role list |
| Shields | 2 revive shields per player | Shield power-ups, drops on the map |
| Social | Text chat in lobby, end-of-round recap | Voice chat, profiles, seasons |
| Platform | Android first | iOS, or a web prototype if we choose web-first |

"Sandrail" could not be identified from a search, so it is not planned yet. Add its idea to the table once we know what it is.

## How we test it

The core passes if most groups ask to play again without being prompted. We run it in three stages with friends before anyone outside the circle sees it.

1. **Paper round (no app).** Play the 15-minute round with phones only for a shared map and a stopwatch. Checks whether the rules are fun before we code them.
2. **Closed beta, 3 groups.** 4 to 8 friends each, 2 rounds per group, on real streets or a campus.
3. **Repeat with new groups.** Same test with friends-of-friends to see if it works without us explaining.

| Measure | Pass signal |
| --- | --- |
| Rematch rate | At least 2 of 3 groups play a second round unprompted |
| Round finishes | At least 80% of rounds reach the final ring |
| Tag disputes | Fewer than 1 per round |
| GPS and battery failures | Fewer than 1 dropout per round |
| "Would you play again?" (1 to 5) | Average 4 or more |
| Moments retold | Each group names at least one story from the round |

We also ask each player one question after every round: what was the best moment, and when were you bored? Boredom spots tell us which layer to add first.

## Open questions

- [ ] What happens to a caught hider: sit out, become a seeker, or become a helper? This changes tension the most, so test two versions in the paper round.
- [ ] Which one secret twist role goes in the MVP: Mole, Trickster or Medic?
- [ ] What is "Sandrail"? Share a link or a one-line description so it can be compared.
- [ ] Paper round first, or straight to the Android build?
- [ ] Web-first prototype before Android, as ShadowHunt did?
- [ ] Where is the first test: a park, a campus or a street block in Coimbatore?
