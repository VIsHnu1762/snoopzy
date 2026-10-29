Snoopzy — MVP Scope: What Is Necessary




  Snoopzy — MVP Scope: What Is Necessary
    Oct 29, 2026        · ​@vishnu


  The test for "necessary"
  A feature is necessary only if, without it, six friends in a park cannot play one fun, fair
  round of Hide & Seek. Everything else waits.

  The MVP in one line: an Android app where friends join a room with a code, play one Hide
  & Seek round on a live map with radar, pings, hold-to-tag and Revive Shields, stay safe, and
  see a recap.

  Three questions every feature must pass:

   1. Does a round break or feel unfair without it?
   2. Is there a simpler way to get most of the value (a circle instead of a drawn shape, a tap
      instead of a sensor)?
   3. Would the first 30 testers notice it missing in the first match?

  If the answers are no, no, no — it is cut.


  Must have in version 1

     Area                 Necessary feature         Why it is needed           Simplest way

     Join                 Nickname, room code,      Friends must get into      Guest login, 6-
                          QR or link                the same game fast         character code

     Lobby                See who joined, host      Everyone must start        Simple list, host-only
                          taps Start, Ready taps    together                   Start

     Rules                Play area, head start,    Without an area there is   Pin + radius circle only
     (host)               round length, number of   no game                    (no polygon drawing)
                          seekers, tag distance                                and 5 settings

     Roles                Hider or seeker (random   Core of the game           Random with a re-roll
                          or host picks)                                       button




                                                                                                    Page 1 of 7
Snoopzy — MVP Scope: What Is Necessary




     Area                 Necessary feature           Why it is needed          Simplest way

     Live map             Your dot, play-area         Players must know         One map screen
                          circle, timer               where they can go and
                                                      how long is left

     Hiding               Radar pulse and timed       This is what makes        Computed from
     info                 pings, never exact dots     seeking fair and tense    positions (see Smallest
                                                                                tech)

     Tagging              Seeker holds Tag for 5 s    Core of the game          GPS-only hold-to-tag,
                          while within 8–10 m;                                  accuracy-aware
                          server checks

     Locked               Tagged hiders freeze        Makes tags matter         A lock screen
     state                and wait                    without removing
                                                      players

     Revive               2 per hider; hold phones    Your signature rescue     Same GPS hold rule as
     Shields              together 5 s to free a      moment                    a tag
                          friend

     Squeeze              Area shrinks once at        Ends the stalemate;       One shrink, 60 s
                          halfway (the first step     sets up the full zone     warning
                          toward the Royale zone)

     Safety               Safety card, SOS (hold 2    Real-world risk; Play     Static card + one
                          s), pause, location only    Store requirement         button
                          during a match, delete
                          after

     Ready                Permissions, GPS            Stops the biggest cause   One checklist screen
     Check                accuracy, battery, brand    of broken matches
                          battery tips

     Recap                Winner, 3 simple stats, 2   The reason friends play   One result screen +
                          awards, a share image       again                     image

     Account              Delete account, privacy     Required to publish       Settings page
     basics               policy, age gate (18+)


  Not in version 1 but built right after: Starter roles (Ghost, Medic, Tracker) and the Mole
  come with the full shrinking zone in the Royale release, as you decided.




                                                                                                      Page 2 of 7
Snoopzy — MVP Scope: What Is Necessary




  Not needed yet
  These are good ideas from the other docs, cut from version 1 so the first game can ship.
  Each has a trigger for when it comes back.


     Cut for now                         Why it can wait                 Comes back when

     Bluetooth token proof,              GPS hold-to-tag works for       Tag disputes or fake-GPS
     UWB, Channel Sounding               friends; adds 10–15 working     cheating show up in real
                                         days                            games

     QR fallback tags                    Only useful with Bluetooth      Same as above
                                         proof

     Private views and the match         v1 uses friends-trust mode      Open lobbies, or any
     ticker server                       (see next section)              cheating

     Polygon area drawing and            A circle is enough for a park   Players ask for odd-shaped
     no-go polygons                                                      venues

     Squads, yearbook, seasons,          Needs players first; recap      After ~10 squads play weekly
     ladders                             and share card carry the
                                         first loop

     Voice chat                          Heavy to build; players         After the Royale release
                                         already call each other

     Power-ups, role abilities,          The Royale release              After classic Hide & Seek is
     Mole, Crowd Boost                                                   fun

     Battle Royale, Zombie Tag,          Same engine, later              After the Royale
     Capture the Flag

     Open Nearby lobbies                 Strangers need extra safety     Much later
                                         work

     Route replay                        Needs saved position            After recap proves popular
                                         history and consent flows

     Multiple languages beyond           Slows every screen              Tamil right after the first
     English                                                             Coimbatore beta

     Cosmetics, monetization             No players yet                  After retention is proven




                                                                                                       Page 3 of 7
Snoopzy — MVP Scope: What Is Necessary




     Cut for now                         Why it can wait                 Comes back when

     iOS app                             Android first (your             After the Android beta
                                         decision); iPhone friends
                                         can spectate via a link later

     Remote Config, field-log            Helpful, not required           Once testers report tuning
     export, simulator                                                   problems




  Smallest tech that works

  GPS hold-to-tag (replaces Bluetooth proof for v1)
   1. The seeker presses and holds Tag. A ring fills over 5 seconds.
   2. The app sends the seeker's and target's latest positions and accuracy to a function.
   3. The server accepts the tag only if: both fixes are under 5 s old; each reports accuracy
       better than about 20 m; the distance minus both accuracy values stays at or under 10
       m for the whole 5 s; the seeker is not on cooldown; the target is free.
   4. If it fails, the seeker sees "Too far or signal weak, move closer".

  A revive uses the same rule between a rescuer and a locked friend (5 s, within 8 m).

  Why 8–10 m and 5 s: GPS on phones is often off by 5–10 m, so a 5 m rule rejects real tags.
  Holding for 5 s filters out someone just walking past.

  Catching cheats without Bluetooth: Android reports when a fake-location app is used
  ( Location.isMock() ); flag the player and warn the host. Also flag impossible speed
  jumps.


  Friends-trust mode (honest trade-off)
  The earlier tech doc hid every player's position behind a server that computes radar and
  pings. That needs an always-on match server and is the largest chunk of backend work.

  For the friends-only beta, we skip it: positions are stored in the room, and each phone
  computes its own radar pulse and timed pings. Tags, revives, the zone and who is locked
  are still checked by cloud functions.

  The risk: a technical friend could read raw positions from the database and cheat.
  Acceptable for a closed beta with people you know; must be replaced (private views +
  match server) before open lobbies or public release.



                                                                                                  Page 4 of 7
Snoopzy — MVP Scope: What Is Necessary




  Minimum backend

     Piece                                 Use

     Firebase Auth (anonymous)             Guest login

     Realtime Database                     Rooms, members, positions, events

     Cloud Functions                       createRoom, joinRoom, startMatch, tag, revive,
                                           SOS, deleteAccount

     Server time offset                    Every timer counts to a server deadline, so phones
                                           agree

     Scheduled cleanup function            Delete positions and old rooms

     Firebase Crashlytics                  Crashes and phone-brand problems


  No Cloud Run ticker, no Firestore squads, no LiveKit, no Remote Config in version 1.


  Minimum app
  Flutter on Android; one native Kotlin foreground location service (so the game keeps
  running with the screen off); a map SDK (see Decisions); sounds and a simple heartbeat
  vibration.



  Timeline and definition of done
  Rough working-day estimates for one person building with me; they will move once real
  testing starts.


     Step                                What you get                                       Working
                                                                                            days

     1. Foundations                      App shell, guest login, rooms, join by code and    6–8
                                         QR, lobby

     2. Live location                    Foreground location service, positions in the      7–9
                                         database, live map, play-area circle

     3. The game loop                    Roles, timers, radar and pings, hold-to-tag,       10–13
                                         locked state, Revive Shields, squeeze




                                                                                                      Page 5 of 7
Snoopzy — MVP Scope: What Is Necessary




     Step                                What you get                                      Working
                                                                                           days

     4. Safety and Ready                 Safety card, SOS, pause, permissions flow,        4–6
     Check                               brand battery tips

     5. Recap and publish                Recap screen, share image, privacy policy, Play   5–7
                                         listing, closed test

     Total                               Classic Hide & Seek closed beta                   32–43


  Add about 12–18 days after that for the full Royale release (phased zone, Ghost / Medic /
  Tracker, Mole, role cards).


  Definition of done (before showing it to 30 testers)
       6 phones play a full 15–20 minute round with no crash
       At least 9 in 10 real tag attempts within 8 m succeed; no tag at more than 12 m
       Battery use under 10% for a 20-minute round on a mid-range phone
       Players still tracked when the screen turns off, on Samsung, Vivo and Xiaomi test
       phones
       SOS, pause and delete account all work
       A new player understands their role in one read
       At least half of testers say they'd play again this week



  Decisions needed from you
       Map provider: Mapbox (best custom dark game look; pricing by usage) or Google Maps
       / MapLibre with free tiles (cheaper, less polish). Recommendation: start with
       whichever has a free tier that covers a 30-tester beta, and keep the map behind one
       screen so it can be swapped.
       Web first or Android first? Android first stays the plan (foreground location service,
       vibration, screen-off tracking). A web version would need the screen on all match, and
       iPhones can't vibrate from a web page (general knowledge, to verify).
       Friends-trust mode for the closed beta: OK to skip private views and the match server
       until we open to strangers?
       Who tests first: which 6–8 friends, and which park, for the first field test?




                                                                                                     Page 6 of 7
Snoopzy — MVP Scope: What Is Necessary




       Account of record: who owns the Google Play developer account, Firebase project and
       domain? (Play developer registration has a one-time fee; check the current amount.)
       Name checks: trademark, domain and handle searches for "Snoopzy" before the Play
       listing goes live.




                                                                                     Page 7 of 7
