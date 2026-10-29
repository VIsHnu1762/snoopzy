Snoopzy — Complete Feature List




  Snoopzy — Complete Feature List
    Oct 29, 2026         · ​@vishnu


  How to read this list
  This is every Snoopzy feature in one place, grouped by area. Each feature has a release
  stage and a priority. Details of rules live in the Game Concept & Rulebook; details of how
  to build live in the Technical Design Doc.


     Release stage                Meaning

     MVP                          In the first closed beta (Android, Hide & Seek)

     v1.1                         First update after beta: Battle Royale, voice, power-
                                  ups

     v1.2                         Zombie Tag, Capture the Flag, UWB precision tags

     Later                        After product-market fit: iOS, open lobbies,
                                  seasons, cosmetics



     Priority         Meaning

     P0               The game doesn't work without it

     P1               Strongly expected; ships in its stage unless
                      blocked

     P2               Nice to have; can slip a stage




  Account, profile and progression

     Feature                                 What it does                                 Stage   Priority

     Guest play                              Play instantly with a nickname, no sign-up   MVP     P0

     Phone-number sign-in                    Keeps history across phones; needed for      MVP     P0
     (OTP)                                   squads




                                                                                                         Page 1 of 11
Snoopzy — Complete Feature List




     Feature                        What it does                                  Stage        Priority

     Age gate (18+ at launch)       Confirms age before play; blocks under-       MVP          P0
                                    18 until parental consent exists

     Profile card                   Handle, avatar, colour, level, badges,        MVP          P1
                                    favourite mode

     Sticker avatars                Pick and customise a sticker-style            MVP          P1
                                    character

     Career stats                   Matches, wins per mode, tags, revives,        MVP          P1
                                    survival time, distance

     XP and levels                  Earn XP for playing, surviving, tagging,      v1.1         P2
                                    reviving

     Global achievements            Absolute milestones (e.g. 100 revives, 10     v1.1         P2
                                    km run)

     Snoopzy Rating                 Skill rating, counted only in Open lobbies    Later        P2

     Guest-to-account               Keep guest progress when signing in           MVP          P1
     upgrade

     Account deletion               Delete account and data from inside the       MVP          P0
                                    app

     Parental consent flow          Verify parent and record consent for          Later        P0 for
                                    under-18 players (India DPDP)                              teens




  Squads, friends and social

     Feature                      What it does                                           Stage      Priority

     Create a squad               Name, crest, colour, motto for a friend group          MVP        P1

     Invite to squad              Link, QR or code; members accept                       MVP        P1

     Multiple squads              Be in college, cousins and office squads at once       MVP        P2

     Start from squad             One tap starts a room and pushes an invite to          MVP        P1
                                  all members




                                                                                                         Page 2 of 11
Snoopzy — Complete Feature List




     Feature                      What it does                                    Stage   Priority

     Head-to-head records         Who tagged whom, how often, per pair of         MVP     P1
                                  friends

     Nemesis crown                Friend who tagged you most this month           v1.1    P2

     Revenge bonus                Extra points and sound for tagging your         v1.1    P2
                                  nemesis

     Squad ladder                 Ranking inside each squad for the season        v1.1    P1

     Weekly squad                 A shared goal each week, earns a squad badge    v1.1    P2
     challenge

     Friends list                 Add friends outside squads, see who's online    Later   P2

     Block and report             Block a player; report with reason              MVP     P0




  Rooms, lobby and rules editor

     Feature                      What it does                                    Stage   Priority

     Create room                  6-character code (no look-alike letters), QR,   MVP     P0
                                  invite link

     Join room                    Enter code, scan QR, or open link               MVP     P0

     Private lobby                Only people with the code can join              MVP     P0

     Squad lobby                  Squad members invited automatically             MVP     P1

     Open Nearby lobby            Discoverable near the venue, host approves      Later   P2
                                  each player, adults only

     Venue check-in               Must be inside the play area by GPS and         MVP     P0
                                  Bluetooth to Ready

     Lobby status                 At venue / On the way / Not coming (no live     MVP     P1
                                  location before match)

     Ready Check                  Green/yellow/red checks: permissions, GPS,      MVP     P0
                                  Bluetooth, battery, brand settings

     Host summary                 Host sees everyone's readiness before Start     MVP     P1



                                                                                               Page 3 of 11
Snoopzy — Complete Feature List




     Feature                          What it does                                        Stage   Priority

     Draw play area                   Draw polygon or pin + radius on the map             MVP     P0

     No-go zones                      Mark roads, water, private property                 MVP     P0

     Size suggestion                  Recommends area size for the number of              MVP     P2
                                      players

     Rules editor                     Cards per category with plain-language hints        MVP     P0

     Presets                          Classic Park, Campus Royale, Quick Blitz, Night     MVP     P1
                                      Mode

     Save and share                   Save your own rules; share by link                  v1.1    P2
     presets

     Role assignment                  Random, host-picked, volunteer, or rotate           MVP     P1

     Host transfer                    Host role moves if the host leaves or drops         MVP     P1

     Kick player                      Host can remove someone                             MVP     P1

     Play again                       Same room, same rules, optional role swap           MVP     P1




  Game modes

     Mode                         One-line pitch                                Players   Stage   Priority

     Hide & Seek                  Hiders hide, seekers hunt with radar and      3–12      MVP     P0
                                  pings; Revive Shields rescue friends

     Practice mode                Walk around and try radar, heartbeat and      1         MVP     P1
     (solo)                       HUD alone

     Battle Royale                Everyone vs everyone in a shrinking zone,     4–20      v1.1    P1
                                  3 HP each

     Zombie Tag                   One zombie infects others; survivors use      5–20      v1.2    P1
                                  safe houses and cures

     Capture the Flag             Two teams steal GPS flags across a centre     6–16      v1.2    P1
                                  line




                                                                                                       Page 4 of 11
Snoopzy — Complete Feature List




     Mode                         One-line pitch                                 Players       Stage       Priority

     Team Hide & Seek             Hiders and seekers in named teams with         6–12          v1.1        P2
                                  team voice

     Treasure Hunt                Race to hidden GPS drops with clues            2–20          Later       P2

     Assassin                     Each player has one secret target; tag         5–30          Later       P2
                                  yours, avoid your hunter

     Custom mode                  Mix rules freely from the rules engine         Any           Later       P2




  Live match

     Feature                         What it does                                       Stage         Priority

     Live map                        Dark custom map, your dot, teammates,              MVP           P0
                                     boundary, no-go zones

     HUD top bar                     Timer, players alive, phase, weak-signal chip      MVP           P0

     Countdown and siren             Synced start, seekers' screen locked during        MVP           P0
                                     head start

     Radar pulse                     8 direction slices × 3 distance bands, never       MVP           P0
                                     exact dots

     Timed pings                     Blurred area reveal of hiders on a schedule        MVP           P0

     Heartbeat haptics               Phone pulses faster as a hunter gets close         MVP           P1

     Area squeeze                    Play area shrinks to 70% at halfway                MVP           P1

     Shrinking zone                  Phased circle with damage outside (Battle          v1.1          P0 for
                                     Royale)                                                          Royale

     Tag button                      Big one-thumb button; result in under 1 s          MVP           P0

     Locked state                    Tagged players freeze in place, see map, wait      MVP           P0
                                     for rescue

     Revive Shields                  2 per player; hold phones together 5 s to          MVP           P1
                                     free a friend

     Anti-camping                    Hunters can't guard a locked player for long       MVP           P1



                                                                                                                 Page 5 of 11
Snoopzy — Complete Feature List




     Feature                      What it does                                    Stage    Priority

     Role abilities               Freeze, Sniff, Dash ping, Rally, Groan, Safe    v1.1     P2
                                  house

     Power-ups at GPS             Armor, Ghost, Decoy, Snoop, Pulse jammer        v1.1     P2
     drops

     Spectator view               Locked/eliminated players watch the full        MVP      P1
                                  map

     Spectator reactions          Emoji cheers shown in recap                     v1.1     P2

     Look-up mode                 Screen simplifies when moving fast              MVP      P1

     Battery-saver mode           Lower update rate, simpler map                  MVP      P1

     Sound pack                   Siren, tag sound, zone warning, "You're         MVP      P1
                                  cooked"

     Eye in the Sky               Remote friend sees team radar and talks on      Later    P2
                                  team voice




  Fair play and proximity tech

     Feature                         What it does                                Stage    Priority

     Server-decided tags             Phones request, server decides every        MVP      P0
                                     tag and revive

     Bluetooth token proof           Rotating 5-second tokens prove              v1.2     P2
                                     phones are physically close

     GPS hold-to-tag                 Seeker holds Tag 5 s while both phones      MVP      P0
                                     stay within 8–10 m; server checks
                                     accuracy-adjusted distance

     Poor-accuracy                   Players with bad GPS can't tag or be        MVP      P1
     protection                      tagged until it recovers

     QR fallback tag                 Scan a rotating QR when Bluetooth           v1.2     P2
                                     fails or a tag is disputed




                                                                                                      Page 6 of 11
Snoopzy — Complete Feature List




     Feature                       What it does                               Stage     Priority

     Mock-location detection       Flags fake-GPS apps; badge visible to      MVP       P1
                                   host

     Speed check                   Flags vehicle speed or teleport jumps      MVP       P1

     Phone-left-behind check       Motion sensors detect a phone              v1.1      P2
                                   dropped on a bench

     Private views                 No player can read others' raw             v1.1      P1
                                   positions

     UWB precision tag             Exact distance on phones that support      v1.2      P2
                                   UWB

     Channel Sounding              Same idea on new Bluetooth 6 phones        Later     P2
     precision tag

     Strike system (Open           Warnings and suspensions for repeat        Later     P1 for open
     lobbies)                      cheaters                                             play




  Safety and privacy features

     Feature                      What it does                                  Stage        Priority

     Safety card                  One-time swipe-through: roads, trespass,      MVP          P0
                                  look up, SOS

     House rules in lobby         Default rules plus host's own                 MVP          P1

     SOS button                   Hold 2 s: pauses match, shares exact          MVP          P0
                                  location with all players, opens dialer

     Pause / time-out             Host (or SOS) pauses timers for everyone      MVP          P0

     No-go alerts                 Buzz + voice line on entering a marked        MVP          P0
                                  area; auto-tag after 30 s

     Dusk warning                 Warns host if a match would end after         MVP          P2
                                  sunset

     Match-only location          Location shared only during a live match,     MVP          P0
                                  only with that room




                                                                                                    Page 7 of 11
Snoopzy — Complete Feature List




     Feature                      What it does                                  Stage   Priority

     Auto-delete positions        Live positions deleted within 10 min of       MVP     P0
                                  match end

     Replay opt-in                Route replays saved only if everyone          MVP     P1
                                  agrees

     Roast mute                   Turn off roast-style recap lines about        MVP     P2
                                  yourself

     Permission reason            Plain-language reason before each system      MVP     P0
     screens                      prompt

     Guardian view                Parent sees child's location during a match   Later   P1 for
                                  only                                                  teens




                                                                                                 Page 8 of 11
Snoopzy — Complete Feature List




  Recap, awards, yearbook and seasons

     Feature                      What it does                                         Stage   Priority

     Match recap                  Winner banner, key stats, timeline of tags and       MVP     P0
                                  revives

     Awards and roasts            3–5 funny awards from real match data                MVP     P1

     Route replay                 Animated paths of all players (if everyone opted     MVP     P1
                                  in)

     Share card                   Image or short clip for WhatsApp / Instagram with    MVP     P1
                                  invite code

     Squad stats                  Wins, tags, revives, survival per player per squad   MVP     P1
     update

     Squad yearbook               Scrollable history of every squad match              v1.1    P1

     Map of legends               Pins of memorable spots the squad played             v1.1    P2

     Seasons                      8-week squad ladders that reset                      Later   P2

     Snoopzy Wrapped              End-of-year shareable squad story                    Later   P2

     Cosmetics                    Skins, tag effects, zone colours unlocked by play    Later   P2
                                  (no pay-to-win)




  Chat, voice and notifications

     Feature                           What it does                                    Stage   Priority

     Lobby text chat                   Text and sticker taunts before and after        MVP     P1
                                       matches

     In-match chat lock                Alive players can't chat during a match (no     MVP     P1
                                       position leaks)

     Spectator channel                 Locked players chat among themselves;           v1.1    P2
                                       revealed in recap

     Voice chat — lobby                Everyone talks before the match                 v1.1    P1




                                                                                                    Page 9 of 11
Snoopzy — Complete Feature List




     Feature                      What it does                                    Stage   Priority

     Voice chat — team            Team-only voice during matches; push-to-        v1.1    P1
                                  talk default

     Speaker warning              Warns hiders when audio plays from the          v1.1    P2
                                  speaker

     Ongoing match                Required to keep the match running; shows       MVP     P0
     notification                 timer

     Squad invite push            "Kabir is starting a Snoopzy at the park. You   MVP     P1
                                  in?"

     "Lost you" push              Prompts a player whose phone stopped            MVP     P1
                                  sending

     Weekly challenge             Nudges squads about the weekly goal             v1.1    P2
     reminder




  Settings, accessibility and languages

     Feature                      What it does                                    Stage   Priority

     Permission centre            See and fix all permissions in one place        MVP     P1

     Brand battery setup          Step-by-step battery settings for your phone    MVP     P0
                                  brand, with a "Test it" button

     Haptics and sound            Adjust or mute each                             MVP     P1
     controls

     High-contrast mode           Stronger colours for bright sunlight            MVP     P1

     Colour-blind-safe teams      Team colours that work for common colour        MVP     P1
                                  blindness, plus shapes

     Text size                    Follows system font size                        MVP     P1

     Left-hand mode               Mirrors the action buttons                      v1.1    P2

     Languages                    English at launch; Tamil and Hindi next, then   v1.1    P1
                                  other Indian languages

     Units                        Metres (default)                                MVP     P2



                                                                                               Page 10 of 11
Snoopzy — Complete Feature List




     Feature                      What it does                                   Stage   Priority

     Data usage mode              Lower map detail on mobile data                v1.1    P2




  Ops and admin tools

     Feature                      What it does                                   Stage   Priority

     Remote Config                Tune tag radius, Bluetooth signal limits,      MVP     P0
     thresholds                   timings without an app update

     Minimum app version          Block outdated clients from joining rooms      MVP     P0

     Field log export             Export a match's sensor and decision log for   MVP     P1
                                  tuning

     Debug overlay                Hidden screen with raw GPS, Bluetooth,         MVP     P1
                                  server time (debug builds)

     Match simulator              Bots walk GPS paths to test rules              MVP     P1

     Crash and device             Crashes, service kills, GPS accuracy by        MVP     P0
     analytics                    brand/model

     Report review queue          Review player reports and flags                v1.1    P1

     Venue library                Curated good play areas per city with          Later   P2
                                  suggested boundaries

     Cost dashboard               Firebase and map cost per match                v1.1    P2


  MVP in one line: sign-in, squads, private rooms with check-in and Ready Check, Hide &
  Seek with radar, pings, heartbeat, Bluetooth-proved tags and Revive Shields, safety tools,
  and a recap that people want to share.




                                                                                              Page 11 of 11
