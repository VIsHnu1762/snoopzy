# Snoopzy — Device, Permissions & Risk Guide

Oct 29, 2026 · @vishnu

## Summary

Snoopzy's biggest threat to a smooth match is not our code but the phone itself: Indian players mostly use Vivo, Samsung, Oppo and Xiaomi phones, whose battery managers can kill a background game, and Android versions from 10 to 16 behave differently for location and Bluetooth. Every match therefore starts with an automatic **Ready Check**, and v1 supports Android 10+ with 64-bit phones only.

**Top 6 risks and our answer**

| Risk                                                                   | What the player sees                  | Our answer                                                                                                                      |
|------------------------------------------------------------------------|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Phone maker kills the app mid-match                                    | Player "disappears", gets auto-locked | Foreground service + ongoing notification; per-brand battery setup guide in the Ready Check; server detects silent drop in 30 s |
| Player gives *approximate* or *while in use* only, or denies Bluetooth | Can't tag, can't be found             | Ask at check-in with a clear reason; block Ready until precise location + Nearby devices are granted                            |
| Weak GPS (trees, buildings, cheap chip)                                | Unfair tags, jumping dots             | Bluetooth proof for tags; accuracy shown on Ready Check; poor-accuracy players protected, not punished                          |
| Battery drains fast on low-end phones                                  | Players quit early                    | Adaptive GPS/BLE, dark UI, 30% battery minimum to Ready                                                                         |
| Play Store rejects location/foreground-service use                     | Can't launch                          | Declarations, demo video and in-app disclosure prepared from sprint 5                                                           |
| Under-18 players without parental consent (India DPDP)                 | Legal exposure                        | 18+ at launch, or a full verifiable-parental-consent flow before allowing teens                                                 |

The rest of this guide gives the detail behind each row: devices, Android versions, permissions, phone makers, hardware, lessons from other games, policy, and a playbook.

## Who our players use

Four Android brands, all with their own customised Android skins, cover most phones our first players will carry. We test on these brands first.

| Brand (India, Q2 2026 shipments)                          | Share | Android skin                   | What it means for Snoopzy                                                      |
|-----------------------------------------------------------|-------|--------------------------------|--------------------------------------------------------------------------------|
| Vivo (incl. iQOO)                                         | 18%   | Funtouch OS / OriginOS         | Largest group; aggressive background limits, needs "Allow background activity" |
| Samsung                                                   | 17%   | One UI                         | Sleeping/deep-sleeping apps lists; needs "Unrestricted" battery                |
| Oppo (and Realme, OnePlus on ColorOS-based skins)         | 14%   | ColorOS / Realme UI / OxygenOS | Auto-launch and battery optimisation can revert                                |
| Xiaomi (incl. Redmi, POCO)                                | 13%   | HyperOS (formerly MIUI)        | Known for killing background services; needs "No restrictions" + Autostart     |
| Apple                                                     | 10%   | iOS                            | Not supported in v1 — friends with iPhones can't play yet                      |
| Others (Motorola, Nothing, Google Pixel, Transsion, etc.) | 27%   | Mostly near-stock Android      | Generally kinder to foreground services                                        |

Shares from [Omdia via TelecomLead](https://telecomlead.com/smart-phone/top-smartphone-vendors-in-india-vivo-leads-as-omdia-reports-13-shipment-decline-in-q2-2026-126837); Counterpoint and IDC report the same top four in slightly different order ([Counterpoint](https://www.counterpointresearch.com/india-smartphone-share/), [IDC via TelecomLead](https://telecomlead.com/smart-phone/india-smartphone-shipments-fall-11-as-record-prices-crush-entry-level-demand-idc-127234)).

**Implications**

- **About 1 in 10 friends will have an iPhone** and can't play v1. Give them a role (spectator via web link later) and put iOS on the roadmap; this is the single biggest reach gap.

- **Prices are rising and entry-level shipments are falling.** IDC reports a record average selling price of \$315 in Q2 2026 and a sharp drop in entry-level phones, so new phones skew mid-range, but many players will still carry older budget phones bought in earlier years.

- **MediaTek chips are common in India** (47% share in Q2 2025 per [Counterpoint via GSMArena](https://m.gsmarena.com/counterpoint_indias_smartphone_market_boomed_in_q2_iphone_16_was_the_mostshipped_phone-news-68823.php)), so test GPS and Bluetooth on MediaTek as well as Qualcomm phones.

## Android version matrix

We support Android 10 and newer and must **target Android 16 (API 36)**, which Google Play requires for new apps and updates from August 31, 2026 ([AppsOnAir](https://www.appsonair.com/blogs/android-16-api-level-36-target-sdk-requirement-what-you-need-to-do-before-august-31)). Each version adds rules we must handle at runtime, because a phone runs its own version's rules no matter what we target.

| Android (API) | Share of Android phones worldwide | What changes for Snoopzy                                                                                                                                                                                                             | What we do                                                                                                   |
|---------------|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| 16 (36)       | 25.5%                             | Edge-to-edge can no longer be opted out of; predictive back on by default; new local-network permission ([Android 16 changes](https://developer.android.com/about/versions/16/behavior-changes-16))                                  | Design HUD for edge-to-edge; handle back gesture in match screen (confirm before leaving)                    |
| 15 (35)       | 17.2%                             | New foreground-service restrictions: dataSync timeouts, no starting some types from BOOT_COMPLETED, narrower background-start exemptions ([Android 15 changes](https://developer.android.com/about/versions/15/behavior-changes-15)) | Use only the location type; never start the service from boot or background                                  |
| 14 (34)       | 13.1%                             | Foreground service type + FOREGROUND_SERVICE_LOCATION mandatory; location permission must be granted before start                                                                                                                    | Start service only after permission, while app is visible                                                    |
| 13 (33)       | 14.8%                             | Notifications need runtime permission; users can stop foreground services from the quick-settings task manager                                                                                                                       | Ask for notifications at check-in; detect a stopped service and show *"Snoopzy was stopped — tap to rejoin"* |
| 12 (31)       | 10.1%                             | Users can pick *approximate* location; new *Nearby devices* Bluetooth permissions (scan / advertise / connect); stricter background service starts                                                                                   | Detect approximate and explain why precise is needed; request Nearby devices separately                      |
| 11 (30)       | 8.3%                              | *Only this time* location; a foreground service started from the background can't get location                                                                                                                                       | Re-check permission at every check-in; start service from the visible check-in screen                        |
| 10 (29)       | about 8% (Google, Dec 2025)       | Background location became a separate permission; foreground services that use location must declare the location type                                                                                                               | We avoid background location entirely; service declares location                                             |
| 9 and older   | small and shrinking               | Old Bluetooth and permission model                                                                                                                                                                                                   | Not supported in v1 (min SDK 29)                                                                             |

Shares: [StatCounter, worldwide, July 2026](https://gs.statcounter.com/android-version-market-share/mobile/); Android 10 from Google's December 2025 figures ([Android Headlines](https://www.androidheadlines.com/2026/01/android-version-distribution-numbers-2025-2026-market-share.html)). India-specific splits will differ; check Play Console's device catalog after the first beta.

**Coming next:** Play's location policy is adding minimum-scope rules for precise location for apps that target Android 17+ ([Play help](https://support.google.com/googleplay/android-developer/answer/17033915)). Review before moving the target to API 37.

## Permission catalogue

We ask for each permission **at the moment it is needed, with a one-screen reason first**, never in a wall at first launch. Location, Nearby devices and notifications are asked at venue check-in, because that is when the player understands why.

| Permission (user sees)                          | Why Snoopzy needs it                                                          | When we ask                                            | If denied                                                 | Can they still play?                                |
|-------------------------------------------------|-------------------------------------------------------------------------------|--------------------------------------------------------|-----------------------------------------------------------|-----------------------------------------------------|
| Location — precise, while using the app         | Live position, zone, check-in                                                 | Check-in                                               | Explain, retry; deep link to settings after 2 denials     | **No** — spectator only                             |
| Location — approximate only                     | (user choice on Android 12+)                                                  | Check-in                                               | Explain that tags need precise; offer *Change to precise* | **No** — spectator only                             |
| Nearby devices (Bluetooth scan + advertise)     | Tag and revive proof, check-in proof                                          | Check-in, right after location                         | Explain; retry                                            | **No** for Hide & Seek; QR-only mode if host allows |
| Notifications                                   | Ongoing match notification keeps the service alive and visible; squad invites | Check-in (match), or when joining a squad              | Match still works; invites won't arrive                   | Yes                                                 |
| Camera                                          | Scan room QR, QR fallback tags                                                | First time they tap Scan                               | Type code manually                                        | Yes                                                 |
| Battery optimisation exemption ("Unrestricted") | Stop phone maker killing the match                                            | Ready Check, only on brands known to kill apps         | Warn: *"Your phone may close Snoopzy mid-game"*           | Yes, at risk                                        |
| Microphone (v1.1)                               | Voice chat                                                                    | First time they tap Talk                               | Text only                                                 | Yes                                                 |
| UWB / Nearby devices (v1.2)                     | Precision tags on supported phones                                            | Automatically covered by Nearby devices on most phones | Fall back to Bluetooth tokens                             | Yes                                                 |
| Background location ("Allow all the time")      | **Not requested**                                                             | —                                                      | —                                                         | —                                                   |

**Rules for asking well**

- The reason screen comes before every system prompt and uses plain words: *"Snoopzy uses your location only during a match, only to run the game, and deletes it after."*

- If Android stops showing the prompt (after repeated denials), show a button that opens the app's settings page instead of asking again.

- Re-check all permissions at every check-in; users can revoke them between matches, and Android can auto-reset permissions of apps not used for months.

- Never block the whole app: profile, squads, yearbook and spectating work with zero permissions.

## Phone maker (OEM) matrix

Many Android brands add their own battery savers on top of Android, and these can close apps even when Android itself would keep them running. The developer community site [Don't Kill My App](https://dontkillmyapp.com/) tracks this per brand; Samsung, OnePlus, Xiaomi and Huawei have repeatedly ranked among the most aggressive ([Android Authority](https://www.androidauthority.com/dontkillmyapp-background-apps-943151), [Android Headlines](https://www.androidheadlines.com/?p=928080)). A visible foreground-service notification is the main protection; the per-brand settings below are the backup.

Settings paths change between OS versions; the Ready Check deep-links where possible and shows brand-specific pictures otherwise.

| Brand / skin                          | Typical problem                                                    | Setting to change (approximate path)                                         | Extra steps                                       |
|---------------------------------------|--------------------------------------------------------------------|------------------------------------------------------------------------------|---------------------------------------------------|
| Samsung (One UI)                      | Apps put in *Sleeping* / *Deep sleeping* lists; background limits  | App info → Battery → *Unrestricted*; remove Snoopzy from sleeping lists      | Avoid power-saving mode during matches            |
| Xiaomi / Redmi / POCO (HyperOS, MIUI) | Services killed even with a notification; Autostart off by default | App info → Battery saver → *No restrictions*; enable *Autostart*             | Lock Snoopzy in Recents (pull down on the card)   |
| Vivo / iQOO (Funtouch / OriginOS)     | High background power consumption limits                           | Settings → Battery → *High background power consumption* → allow Snoopzy     | Lock in Recents; avoid *Ultra battery saver*      |
| Oppo / Realme (ColorOS / Realme UI)   | Auto-launch and background freeze                                  | App info → Battery usage → *Allow background activity*; enable *Auto launch* | Lock in Recents                                   |
| OnePlus (OxygenOS)                    | Battery optimisation can revert to *Optimized*                     | App info → Battery → *Unrestricted*                                          | Re-check before each match (our Ready Check does) |
| Motorola, Nothing, Google Pixel       | Usually respect foreground services                                | App info → Battery → *Unrestricted* (optional)                               | None normally                                     |

Paths summarised from brand guides collected by app developers ([Biolovision help](https://help.biolovision.net/Keep_Background_Services_Alive_on_Android_(by_Brand)), [AppBlock](https://appblock.app/problems-with-specific-phone-brands/)).

**What we build because of this**

- Detect the brand (Build.MANUFACTURER) and show only the steps for that phone, once, with a *"Done"* check.

- Use PowerManager.isIgnoringBatteryOptimizations() to know if the exemption is set; show a yellow warning on the Ready Check if not.

- Server-side: if a player's position stops arriving for 30 s while others are fine, mark them *offline* and push a high-priority notification *"Snoopzy lost you — tap to rejoin"*.

- Collect anonymous "service killed" counts per brand and model in Crashlytics to see which phones need more help.

## Hardware tiers

Snoopzy should be fully playable on a typical budget phone; better hardware only adds precision. Tier prices are rough Indian street prices for guidance.

| Capability                                 | Budget (about ₹8k–15k)                                       | Mid-range (about ₹15k–35k)                          | Flagship (₹35k+)                                                                                                                | Snoopzy behaviour                                                                                                                    |
|--------------------------------------------|--------------------------------------------------------------|-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| GPS                                        | Single-band GPS common; drifts more near buildings and trees | Often dual-frequency (L1 + L5), noticeably steadier | Dual-frequency, best accuracy                                                                                                   | Accuracy shown on Ready Check; Bluetooth proof decides tags, not GPS alone                                                           |
| Bluetooth LE scanning                      | Supported                                                    | Supported                                           | Supported                                                                                                                       | Required                                                                                                                             |
| Bluetooth LE advertising (peripheral mode) | Usually supported, but some chipsets don't                   | Supported                                           | Supported                                                                                                                       | Check isMultipleAdvertisementSupported(); if missing, player can still be tagged via QR and can tag others                           |
| UWB                                        | No                                                           | Rare                                                | Some (e.g. Pixel Pro, Galaxy S Plus / Ultra, Fold) ([Android UWB docs](https://developer.android.com/develop/connectivity/uwb)) | Precision tag only when both phones have it                                                                                          |
| Bluetooth Channel Sounding                 | No                                                           | No                                                  | Newest models only                                                                                                              | Future precision upgrade                                                                                                             |
| Compass (magnetometer)                     | Sometimes missing or poorly calibrated                       | Present                                             | Present                                                                                                                         | Radar points relative to walking direction if no compass; prompt figure-8 calibration if noisy                                       |
| Vibration motor                            | Basic buzz                                                   | Better                                              | Precise haptics                                                                                                                 | Heartbeat uses simple on/off patterns that feel fine on cheap motors                                                                 |
| RAM                                        | 3–4 GB                                                       | 6–8 GB                                              | 8 GB+                                                                                                                           | Map + game must run in about 300 MB; test on a 4 GB phone                                                                            |
| CPU architecture                           | 64-bit (32-bit phones are now rare)                          | 64-bit                                              | 64-bit                                                                                                                          | 64-bit only, as Pokémon GO also requires ([Pokémon GO news](https://pokemongo.com/es/news/32-bit-android-discontinued-support-2025)) |
| Battery                                    | 5000 mAh common                                              | 5000 mAh common                                     | 4000–5500 mAh                                                                                                                   | 30% minimum to Ready; low-battery warning                                                                                            |

**Feature degradation, not exclusion:** a player whose phone lacks a capability still plays, with the closest fallback. The Ready Check lists what their phone supports in friendly words (*"Precision tags: not on this phone — you'll use Bluetooth tags"*).

## Lessons from other location games and apps

The established location games and friend-location apps have already met most of our problems. What they did, and what we copy or change:

| Product                                                    | What they do                                                                                                                                                                                                                         | Lesson for Snoopzy                                                                                                  |
|------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| Pokémon GO (Niantic)                                       | Requires GPS hardware and a 64-bit phone; rooted devices are not supported ([esports.gg](https://esports.gg/news/pokemon/pokemon-go-system-requirements/)); dropped 32-bit Android in 2025                                           | Publish a clear device floor (Android 10+, 64-bit, GPS, Bluetooth LE) on the store page and in the app              |
| Pokémon GO anti-cheat                                      | Three-strike policy for GPS spoofing: warning with reduced features for about 7 days, then a 30-day suspension, then a permanent ban ([The Star](https://thestar.com.my/tech/tech-news/2018/07/19/niantic-bring-out-the-ban-hammer)) | Friends' games: show flags to the host instead of banning. Open lobbies: adopt a similar strike ladder with appeals |
| Niantic games generally                                    | Location spoofing is the most common cheat and is named in the terms of service ([Dexerto](https://www.dexerto.com/pokemon/niantic-ban-pokemon-go-cheaters-606629/))                                                                 | Put "no fake location / no modified apps" in our terms; our Bluetooth proof makes spoofing useless for tags anyway  |
| Friend-location apps (e.g. Find My Friends-style features) | Play lists user-initiated location sharing as an intended use of the location foreground service ([Play help](https://support.google.com/googleplay/android-developer/answer/16965181))                                              | Frame Snoopzy's service the same way: started by the user, visible notification, only during a match                |
| Google Play location policy                                | Background location needs a declaration, a demo video and a prominent in-app disclosure ([Play help](https://support.google.com/googleplay/android-developer/answer/9799150))                                                        | Avoid background location entirely; still prepare the disclosure and video in case review asks                      |

**Patterns worth copying**

- **A device and permissions check before play** (all mature location games do some version of this): Snoopzy's Ready Check.

- **Graceful GPS failure:** show *"Weak GPS"* clearly instead of silently misbehaving.

- **Clear, public anti-cheat rules:** players accept enforcement better when the rules are written down.

- **Location only when it matters:** always-on location sharing is a privacy worry for many people, so Snoopzy shares location only during a match, with friends in that room.

## Store and legal

Three things can block or delay launch: Play's location and foreground-service review, the Data safety form, and India's rules for children's data. I'm not a lawyer; treat this as a checklist to take to one.

### Google Play

| Requirement                                | What Play asks                                                                                                                                                                      | Snoopzy plan                                                                 |
|--------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| Target API                                 | New apps and updates must target Android 16 (API 36) from August 31, 2026                                                                                                           | Target API 36 from the first release                                         |
| Foreground service declaration             | Declare each foreground-service type and its use case in Play Console ([Play help](https://support.google.com/googleplay/android-developer/answer/16965181))                        | Declare location: user-started live location sharing during a match          |
| Location that works like background access | Can be treated under background-location rules: declaration form, video, prominent disclosure ([Play help](https://support.google.com/googleplay/android-developer/answer/9799150)) | Prepare all three before the first closed test                               |
| Prominent disclosure                       | Must be in the app itself, before the permission prompt ([Sentiance guide](https://docs.sentiance.com/important-topics/playstore-location-access-review))                           | Our check-in reason screen is the disclosure                                 |
| Data safety form                           | Declare data collected, shared, retained                                                                                                                                            | Precise location (match only, deleted after), phone number, chat, crash data |
| Account deletion                           | In-app path and web link to delete account                                                                                                                                          | deleteAccount in Profile → Settings                                          |
| Target audience                            | If under-13s or teens are targeted, Families / child-safety policies apply                                                                                                          | Set audience 18+ at launch                                                   |

### India: DPDP Act and Rules

- The DPDP Act treats everyone **under 18 as a child**. Apps need **verifiable parental consent** before processing a child's personal data, and must not track or behaviourally monitor children ([MediaNama](https://www.medianama.com/2025/01/223-data-protection-rules-2025-children-data-india/)).

- The DPDP Rules were notified in November 2025 and require verifying both the user's age and the identity of the consenting parent; a simple "I am over 18" checkbox is not enough ([AVPA](https://avpassociation.com/india/), [KS&K](https://ksandk.com/data-protection-and-data-privacy/childrens-data-protection-under-indias-dpdp-rules/)).

- The final Rules include an exemption for real-time location tracking of a child only for that child's safety ([MediaNama](https://www.medianama.com/2025/11/223-dpdp-rules-real-time-child-tracking-without-consent/)); a game is unlikely to qualify.

- Obligations are being phased in; confirm the enforcement dates with a lawyer before launch.

**Recommendation:** launch as **18+ only** with an age gate, and build the parental-consent flow (parent verification, consent record, withdrawal) as a separate project before opening to teens. This removes the largest legal risk from the MVP.

### Everyone, everywhere

- Privacy policy covering location, Bluetooth, retention, deletion and contact details.

- Terms of service with the safety rules (no roads, no trespass) and anti-cheat rules.

- Breach plan: who is notified, how fast (DPDP requires prompt notice to users and the Data Protection Board).

## Risk map

Four risks are both likely and serious for v1; they get engineering time before the beta. Positions are judgement calls by quadrant, not measured scores.

<img src="media/image1.png" style="width:6in;height:3.84821in" alt="risk map · likelihood vs impact · 11 risks" />

risk map · likelihood vs impact · 11 risks

| Risk                             | Owner             | Mitigation                                                                     | Covered in               |
|----------------------------------|-------------------|--------------------------------------------------------------------------------|--------------------------|
| Phone maker kills the app        | Android dev       | Foreground service, brand setup steps, "Test it" button, server drop detection | OEM matrix, Playbook     |
| iPhone friends can't play v1     | Product           | Spectator link for iPhone friends; iOS spike after beta                        | Who our players use      |
| Weak GPS, unfair tags            | Android + backend | Bluetooth proof, accuracy gating, QR fallback                                  | Hardware tiers           |
| Battery drain on budget phones   | Android dev       | Adaptive GPS/BLE, dark UI, 30% minimum, profiling on a budget phone            | Hardware tiers, Playbook |
| Play Store rejection             | Founder           | Declarations, video, disclosure, internal-track submission by sprint 5         | Store and legal          |
| Teen data without parent consent | Founder + lawyer  | 18+ at launch; consent flow before teens                                       | Store and legal          |
| Player hurt while playing        | Product           | Safety card, no-go zones, speed warnings, SOS, daylight warnings               | Game rulebook            |
| Permission denied or approximate | Android dev       | Reason screens, settings deep link, Ready Check                                | Permission catalogue     |
| Weak network, laggy tags         | Backend           | Offline queue with Bluetooth proof, offline rules                              | Tech design doc          |
| Phone can't advertise Bluetooth  | Android dev       | Capability check, QR fallback                                                  | Hardware tiers           |
| Fake-GPS cheating                | Backend           | Mock detection, Bluetooth proof, host-visible flags                            | Lessons from other games |

## Smooth-experience playbook

Three things turn all the risks above into a calm first match: an automatic **Ready Check**, a short onboarding, and a real **device lab**.

### The Ready Check (runs at every check-in)

One screen of green / yellow / red rows. Red blocks Ready; yellow warns.

| Check                             | Green                       | Yellow                                              | Red                         |
|-----------------------------------|-----------------------------|-----------------------------------------------------|-----------------------------|
| Location permission               | Precise, granted            | —                                                   | Denied or approximate       |
| Location services                 | On                          | —                                                   | Off (button opens settings) |
| GPS accuracy now                  | Better than 10 m            | 10–25 m ("move to open sky")                        | Worse than 25 m for 30 s    |
| Bluetooth                         | On + Nearby devices granted | Advertising not supported (QR fallback)             | Off or denied               |
| Notifications                     | Allowed                     | Denied (match still works)                          | —                           |
| Battery                           | Above 50%                   | 30–50%                                              | Below 30%                   |
| Battery optimisation              | Exempt / Unrestricted       | Restricted on a risky brand (shows the brand steps) | —                           |
| Power-saving mode                 | Off                         | On                                                  | —                           |
| Mock location / developer options | Not detected                | Developer options on                                | Mock location app active    |
| App version                       | Latest protocol             | —                                                   | Below minAppVersion         |
| Network                           | Good                        | Weak ("tags may lag")                               | Offline                     |

The host sees a summary for everyone (*"6 ready, 1 yellow: Meera's battery 34%"*) before tapping Start.

### Onboarding flow

1.  **No permissions at first launch.** Nickname, avatar, a 20-second animated explainer of how a match works.

2.  **Safety card** (once): roads, trespass, look up, SOS.

3.  **Permissions at first check-in**, each with its reason screen.

4.  **Brand setup** (once per phone, only on risky brands): 2–3 illustrated steps, then a *"Test it"* button that runs the service for 60 s with the screen off and reports whether it survived.

5.  **Practice mode** (solo): walk around and watch your own radar and heartbeat, so the first real match isn't the first time seeing the HUD.

### Device lab (before beta)

Buy or borrow at least one phone per row; prioritise by market share.

| Brand                 | Example tier to test               | Android                            |
|-----------------------|------------------------------------|------------------------------------|
| Vivo                  | Budget Y-series                    | 14 or 15                           |
| Samsung               | Budget Galaxy A/M                  | 15 or 16                           |
| Oppo / Realme         | Budget to mid                      | 14 or 15                           |
| Xiaomi / Redmi / POCO | Budget Redmi                       | 14 or 15                           |
| OnePlus or Nothing    | Mid-range                          | 16                                 |
| Google Pixel          | Any recent                         | 16 (reference for stock behaviour) |
| Old phone             | Any 4 GB phone on Android 10 or 11 | 10 / 11                            |

For wider coverage, use **Firebase Test Lab** for install and UI smoke tests on many models, and Play Console **pre-launch reports**. Bluetooth, GPS and battery behaviour still need real phones in a real park.

### After launch

- Crashlytics and custom events per brand/model: service killed, GPS accuracy, tag disputes, battery drain per match.

- A weekly look at the worst 5 device models; add brand-specific fixes or guidance.

- In-app *"Report a problem"* that attaches the last field log (with consent).

## Sources

**Market and devices**

- [Omdia India Q2 2026 vendor shares (TelecomLead)](https://telecomlead.com/smart-phone/top-smartphone-vendors-in-india-vivo-leads-as-omdia-reports-13-shipment-decline-in-q2-2026-126837)

- [IDC India Q2 2026 (TelecomLead)](https://telecomlead.com/smart-phone/india-smartphone-shipments-fall-11-as-record-prices-crush-entry-level-demand-idc-127234)

- [Counterpoint India smartphone share](https://www.counterpointresearch.com/india-smartphone-share/)

- [Counterpoint Q2 2025 chipset share (GSMArena)](https://m.gsmarena.com/counterpoint_indias_smartphone_market_boomed_in_q2_iphone_16_was_the_mostshipped_phone-news-68823.php)

- [StatCounter Android version share, July 2026](https://gs.statcounter.com/android-version-market-share/mobile/)

- [Google Android distribution, Dec 2025 (Android Headlines)](https://www.androidheadlines.com/2026/01/android-version-distribution-numbers-2025-2026-market-share.html)

**Android platform**

- [Android 14 foreground service types](https://developer.android.com/about/versions/14/changes/fgs-types-required)

- [Android 15 behaviour changes](https://developer.android.com/about/versions/15/behavior-changes-15)

- [Android 16 behaviour changes](https://developer.android.com/about/versions/16/behavior-changes-16)

- [Foreground service changes overview](https://developer.android.com/develop/background-work/services/fgs/changes)

- [Android UWB guide](https://developer.android.com/develop/connectivity/uwb)

- [API 36 target requirement (AppsOnAir)](https://www.appsonair.com/blogs/android-16-api-level-36-target-sdk-requirement-what-you-need-to-do-before-august-31)

**Phone makers**

- [Don't Kill My App](https://dontkillmyapp.com/)

- [Android Authority on Don't Kill My App rankings](https://www.androidauthority.com/dontkillmyapp-background-apps-943151)

- [Android Headlines: Samsung ranked most aggressive](https://www.androidheadlines.com/?p=928080)

- [Biolovision: keep services alive by brand](https://help.biolovision.net/Keep_Background_Services_Alive_on_Android_(by_Brand))

- [AppBlock: brand-specific problems](https://appblock.app/problems-with-specific-phone-brands/)

**Other games and apps**

- [Pokémon GO system requirements (esports.gg)](https://esports.gg/news/pokemon/pokemon-go-system-requirements/)

- [Pokémon GO ends 32-bit Android support](https://pokemongo.com/es/news/32-bit-android-discontinued-support-2025)

- [Niantic three-strike policy (The Star)](https://thestar.com.my/tech/tech-news/2018/07/19/niantic-bring-out-the-ban-hammer)

- [Niantic anti-cheat update (Dexerto)](https://www.dexerto.com/pokemon/niantic-ban-pokemon-go-cheaters-606629/)

**Policy and law**

- [Play: foreground service requirements](https://support.google.com/googleplay/android-developer/answer/16965181)

- [Play: location in the background](https://support.google.com/googleplay/android-developer/answer/9799150)

- [Play: foreground location and minimum scope](https://support.google.com/googleplay/android-developer/answer/17033915)

- [Play location review guide (Sentiance)](https://docs.sentiance.com/important-topics/playstore-location-access-review)

- [DPDP children's data (MediaNama, Jan 2025)](https://www.medianama.com/2025/01/223-data-protection-rules-2025-children-data-india/)

- [DPDP final rules: child real-time location exemption (MediaNama, Nov 2025)](https://www.medianama.com/2025/11/223-dpdp-rules-real-time-child-tracking-without-consent/)

- [Children's data under DPDP Rules 2025 (KS&K)](https://ksandk.com/data-protection-and-data-privacy/childrens-data-protection-under-indias-dpdp-rules/)

- [Age verification in India (AVPA)](https://avpassociation.com/india/)
