# CARTA Coffee Ledger

A personal memory of coffee at home and in cafés.

**One cup. Two contexts. Your taste is the through-line.**

CARTA gives equal weight to the cup you make and the cup you are served. Home is
measured, adjusted, and made again. Café is received, experienced, and returned to.
Both end in the same honest record of what was in the cup and whether it was worth
finding again.

> **Design lineage.** Carta is a **sub-brand of the Quiet Matter design system**
> (`quietmatter/quiet-matter`). It inherits Quiet Matter's typefaces, type scale,
> label system, token architecture and voice, and overrides its palette, adds an
> ember signal, an editorial display scale and a per-café colour engine. The full
> charter — what is inherited, what may be overridden, how the two stay in sync —
> is in [SUBBRAND.md](SUBBRAND.md).

CARTA opens **a room at a time**. The ladder is Reading → Remembering → Making →
Keeping; each room's foot holds a door to the next, the ladder in **More** opens
any of them on request, and nothing is ever taken away. The rooms, fully open:

- **Find** (Reading) — other people's cups: the stream, the places worth the walk,
  whose taste matches yours; read only, always.
- **Café** (Remembering) — remember the last cup out and the places worth
  returning to.
- **Home** (Making) — resume the coffee in hand from the last cup.
- **Record** (Keeping) — see one preference across both contexts.

Every café is a **page**, not a popup — your cups, the circle's cups, the pin and
the provenance, one place per place, reached from anywhere its name appears.

See [NORTH_STAR.md](NORTH_STAR.md) for the product thesis and restraint standard.

## First run

The first time you open CARTA it says what it is before it asks anything of you —
one cup, two contexts, the record yours. Then it asks one question — *how do you
take your coffee?*

- **Someone else makes it** — you start in Find, reading; keeping nothing.
- **I want to remember mine** — Café opens too; a shop and one tap is a record.
- **I make my own** — Home opens as well; put a coffee on the shelf and brew.

The answer only sets how much of CARTA you see first — the rest opens whenever
you ask, from the doors at the foot of each room or the ladder under
**More → How deep you go**. Replay the welcome any time from
**More → The manual → Replay the welcome**.

## Logging a brew

The first brew asks only for your grinder and brewer, in plain words — the Setup
writes itself. (The full Setup editor lives under **More → The tools** for the day
you change a burr; a grind number is only comparable within one Setup.)

After that, the brew screen opens as your last brew — turn the one dial you actually changed. Each numeric dial can be driven three ways:

- **Tap − / +** for one step.
- **Press and hold** − or + to accelerate across a wide range (fly through a 0–2000 grinder, ease off for the fine end).
- **Tap the number** to type an exact value on the numeric keypad — time accepts `m:ss`.

Give each **Setup** its grinder's real **grind scale** (min / max / step — e.g. a Lido OG is 0–2000, step 5) and that Setup's grind dial moves the way the grinder does. Grind is only ever comparable within one Setup.

Temperature has a **°C / °F** switch right on the dial (whole-degree steps), remembered per user and stored canonically as °C so the record stays comparable.

If you time and weigh on your machine or a Bluetooth scale (e.g. the Argos app), hide CARTA's stopwatch in **More → Preferences** and simply type the time and weight in. CARTA keeps the record; it doesn't need to be the timer.

A bag can read itself off the web. Give it the roaster's or the bag's **website**
and CARTA takes the roaster it states, a line, and the bag's own **colours** — the
palette then dresses the bag's page and its place on the shelf. It fills only
what's still blank; offline, or a silent site, you type it in by hand and it all
still saves. No photograph is captured or stored — a brand is its colours and its
words, kept small and offline.

When a bag is finished, **put it away** from Home — it waits under *Put away*
with your best cup, and restores with everything you learned when you buy it
again.

## Appearance

CARTA reads like a printed record: a serif for what you tasted, a sans for what you measured, and one ember-red signal for the current action and the cup’s score. Two themes — **Paper** and **Dusk** — switch under **More → Preferences**, remembered per user. A third choice, **Auto**, follows the device's own light/dark setting (iOS Settings → Display & Brightness, etc.) and moves with it live, no reload needed. The typefaces (Spectral and Libre Franklin) are served from the app's own `fonts/` directory, so nothing loads from a third party.

## Today, and the matching

**Today** is the first tab — the day's surface. It holds the thread you left and
the next thing worth reading:

- **Pick up where you left off.** Leave the map mid-read and Today offers the
  same map, the same card, for a week. Left longer, the session lets go and the
  place steps back to a plain suggestion — the reading keeps, the ceremony
  doesn't.
- **Something new for you.** Three teasers, matched against your record, each
  carrying its reasons. "The full map" opens the whole reading.
- **The map, read for you.** Every place on the register you haven't kept,
  ranked by match — pins on a drawn map (real coordinates, never a tile), a card
  per pin, or the same reading as a list. Reached from Today or Find.

**The matching** reads three things, and says so: the *traits* of the places you
keep (their tags and reach facts, weighed heavier where you scored well); the
*distance*, only once you tap "Near you" — your location is held in memory,
never stored; and the *circle's cups* there, weighted toward the people whose
taste sits closest to yours. Every score opens into its signals on the café's
page — "Why this" — and no score is ever shown without them.

- **The early read.** Until you've kept three café cups the matching speaks in
  bands — *worth a look · promising · a strong read* — not numbers. New to the
  record entirely? Today asks for **three cafés you already love**; their traits
  become your signal, and a place the register doesn't know yet enters on its
  name alone. At your third kept cup, the numbers arrive.
- **Save** waits under **Want to go** — one list, a save from anywhere lands
  there. The Record orders it by match and, when a save sits unvisited a couple
  of weeks, asks once whether to let it go. Letting go is not a skip — no mark
  against the place.
- **Skip** steps a place back for two weeks, then fades on its own — never a
  veto. At the moment you skip, one question: the place, or its kind? "Fewer
  like it" tips the place's kind (its first tag) down on the same fading curve.
  Every standing skip and lean is visible on the Record, each with a "clear
  now".

## Café cups

The **Café** tab is a passport of every shop you log — your average, visit count, usual order, and spend, favorites first. Logging stays minimal by default: a shop, a style, and one tap on the scale is a whole record. Everything else — beans, price, the order-again verdict, traceability — waits behind one line, to add now or later.

- **Every cup is editable.** Open a cup from the record and revise it — fill in what you didn't have time for at the counter. It keeps its original place and hour; only the details change. Bags and brews edit the same way (correct a dose or a time, and the cup a brew carries stays put).
- **Each café wears its own colours.** Give a café its website and CARTA reads its colours straight from the brand — the logo and the palette around it — and builds a whole surface from that one signature colour: the café's page and every cup logged there take on the palette. A small design system, held in light and dusk alike. Only the palette is kept, never a hotlinked image, so the record stays offline and yours.
- **A banner drawn from that same colour.** The café's own page opens on a gradient built from its hue — a neutral roast tone while the café is still unbranded. Just the name, on its own colour; nothing fetched, nothing photographed.
- **One read fills the rest.** The same website read pulls more than colour — the site's own description becomes the café's line, the name it states is surfaced, and the map lookup opens on its address — so you retype nothing the site already knows. It fills only what's still blank, and offline you fill it in by hand.
- **Pin it on the map.** Look up a café's address online and open it in Maps from its page. Typing the address by hand always works; the lookup is a convenience, not a requirement, and the app stays fully offline without it.
- **The neighborhood, named.** The map lookup names a neighborhood along with the pin — filled in automatically when it knows one, blanks only, typed always wins. It rides next to the city everywhere a café is shown.
- **Tag a place your own way.** A short list of tags — however you'd describe it to a friend — rides on the café's page and joins the pooled search in Find, so "patio" or "quiet" turns up every place you've marked that way.
- **The beans, read from the roaster.** Give a café cup the roaster's website and CARTA reads its brand the same way a café or a bag does — the roaster it states and a line fill what's blank, and the cup carries the colours it read. Less to type at the counter.
- **Traceability, aligned to your bags.** A café cup can carry the same fields a bag does — country, region, producer, variety, lot, process — tucked behind one optional tap. Bags gained a lot number too, so a café cup and the bag on your shelf finally line up.
- **Home vs café.** When you've had the same beans at home, the café cup says so — your average out against your average in. The shape of how a preference travels, not a verdict.

The café screen and the brew screen are deliberately the same shape: **Coffee → Preparation → Cup.** Both end in a hedonic 1–9 and what you found, so a cup out and a cup in are comparable.

## The Register — one entry per café

Cafés get named by many people, on many devices. The **Register** keeps a single
canonical entry for each one — *Jane's Fighting Ships*, for cafés. It is the
single source of truth for a café's identity: name, city, neighborhood, website,
address and map pin, the palette derived from that website, a line for the
record, and the tags you've given it.

- **Shared, not per-user.** Every user of the device reads the same Register,
  and a sync server extends it to every keeper on the server (`/api/cafes`). A
  café looks the same from user to user — same colours, same pin.
- **Compiled from sightings.** Naming a shop on any café cup enters it into the
  Register; a sighting fills blanks and never erases, so a fast log can't strip
  a rich entry. Everything already on the device's ledgers is seeded in
  automatically.
- **Anyone can amend, provenance is kept.** At this early stage every
  contributor may edit an entry ("Amend the entry" on the café's page). The
  entry remembers who entered it first and who amended it last.
- **Lookup and discovery.** The café cup form looks the shop up against the
  Register as you type — "A known place — Halfpence, Portland, first entered by
  Jane." Find surfaces Register entries you haven't been to, ranked as
  recommendations (below). In search of better cups, the consistent record of
  the place is the map.

Cups stay personal, per ledger. Only the place is common knowledge.

### The reach — four depths, no ladder

Every café can be read for **depth**: how much of a coffee's road — farm, roast,
grind — is legible from the customer's side of the counter. Four marks, carried
by type, never colour: **○ Counter · ◎ House · ◉ Roastery · ● Origin**. A
description of the café, never a score — the 1–9 stays yours, and no depth
outranks another.

- **Keepers attest facts, never depths.** The marks never appear as a picker.
  You say what you saw — the bag unnamed / roaster / lot / farm named; roasts
  in-house, more than one method, answers at the counter, the story freely
  told — and the reading follows from the record: the deepest fact standing.
- **Two doors.** A sighting rides the café cup form (collapsed behind "What did
  the counter show?", three taps at most, one save) or the deliberate door on
  the café's page. Each is signed and dated, and joins the Register.
- **Per fact, the newest sighting carries.** Older lines keep their ink. Amend
  your own line (a new dated line; the old one struck *superseded*) or withdraw
  it (struck, the fact falls to the next line standing). Nothing erases —
  sightings merge in sync as a union by id, deterministic by construction.
- **Unread is a state, never a depth.** Where no one has read a café the badge
  says *unread*, dashed — never a default to the shallow end. The row itself is
  the door to reading it.
- **A lens, never a sort.** In Find, depth filters *Worth the walk* to a mood;
  the unread wait in a counted tail, one tap from joining ghosted. Ranking
  stays by taste.
- **Every badge explains itself.** One tap opens the primer — *How to read the
  reach* — with the tapped café's depth lit and one line of why. The record of
  the reach (every sighting, signed) opens from the Register line on the café's
  page. A mark preference in More writes badges as glyph + word, word, or glyph
  alone; state chips keep their words and dashes in every mode.

Not everyone wants to keep a record. Some people just want to know where to go
and what to order. The **Find** tab is for them — the room every record starts
in, and it requires logging nothing, ever. It pools every record the active user
can read — other keepers on this device, everyone on a connected sync server —
plus the shared Register, and turns them into a discovery loop: *search → near
you → whose taste matches yours → worth the walk → save it → go.*

- **Search** — one field over the whole pooled record. Type a café, a city, a
  roaster, an origin, a descriptor, a tag or a note and matching **places**,
  **beans** and **cups** surface at once. Pinned results also plot on a small
  map alongside the list — a filled dot for a place you keep, a dashed one for
  a place you haven't yet. It's drawn from the record's own coordinates, not
  fetched — no tiles, no street names, nothing loaded from a map provider.
- **Near you** — say where you are (optional; asked only when you tap it, and
  kept on the device — never stored or synced) and the pinned cafés your people
  kept sort by distance, closest first, each showing how far.
- **Worth the walk, for you** — cafés you haven't kept, ranked by your circle's
  scores and weighted toward the people whose taste runs closest to yours; the
  card says who rated it and why. A city filter or the "near you" lens re-scopes
  the list.
- **Whose taste matches yours** — on the cafés you've both scored, how close your
  scores land on the 1–9 scale. The shape of an agreement, not a verdict —
  read the people who walk your streets.
- **The stream** — every café cup your people have logged, newest first (scoped
  to the active city lens): who, where, what they ordered, the score, their
  words, and the beans' colours when they read them. Tap a cup for the full card,
  including the address and an Open in Maps link when someone has pinned it.
- **Beans worth chasing** — the roasters and origins your circle scored, best
  average first.
- **Want to go** — save any place from anyone's record to a shortlist that waits
  under Find and on the Café tab, and steps aside once you've logged a cup
  there. (The one thing Find writes to your own ledger; it syncs like the
  rest.)
- **How to read a cup** — a plain-words primer that decodes the hedonic 1–9
  scale, the again/pass verdict, and the descriptors for readers who don't keep
  a ledger of their own.

The stream refreshes quietly from the server when the tab is open and falls back
to cached copies offline. Discovery is read-only — look, don't touch — and any
cup links through to the friend's whole record via the existing read-only view.

## Multiple Users

CARTA supports multiple keepers on one device. Manage them under **More → Your circle**:

- **Add a keeper** — each keeps a fully separate ledger (setups, bags, brews, cups, cafés)
- **Switch** the active keeper — everything you log goes to the active ledger
- **Read another keeper's record** — browse every room in a clearly-marked read-only mode; a banner offers "Back to mine"
- **Import as a new keeper** — a friend's exported ledger file can be imported beside your own without touching yours

Existing single-user data migrates automatically on first launch — nothing to do, nothing lost. Everything lives in this browser's local storage; syncing between devices is optional (below).

## Server Sync (optional)

CARTA can synchronize ledgers through a tiny self-hosted server, so your record follows you across devices and everyone on the server can **view** (never edit) each other's ledgers — live, from **More → Your circle**.

- Run the server: `node server/server.js` — one file, zero dependencies, JSON storage. Or skip the hardware entirely: the same server deploys serverless to Cloudflare's free plan with one command. See **[server/README.md](server/README.md)** for deployment, the HTTPS requirement, and the API.
- Connect from the app: **More → Sync → Connect to a sync server** (server URL, name, passcode).
- Offline-first: with no server configured or reachable, nothing changes. Edits queue and sync when the app comes back to the foreground.
- Conflicts merge by record — logging on two devices keeps both entries; removed cups stay removed (tombstones).
- Viewed ledgers are cached locally, so a friend's record remains browsable while offline (marked as a cached copy).

## What's Included

- **index.html** — The complete app (self-contained, no build required)
- **fonts/** — Self-hosted typefaces (Spectral, Libre Franklin; woff2)
- **manifest.json** — PWA metadata for homescreen installation
- **icon-192.svg** & **icon-512.svg** — App icons
- **README.md** — This file
- **VOICE.md** — The brand voice standard the app's copy is held to

## Hosted on GitHub Pages

This app is deployed at:
```
https://YOUR-USERNAME.github.io/carta/
```

Replace `YOUR-USERNAME` with your actual GitHub username.

## Installation on iPhone

1. Open Safari on your iPhone
2. Navigate to the URL above
3. Tap the Share button (↗️ in bottom toolbar)
4. Select **Add to Home Screen**
5. Choose a name (CARTA is fine) and tap Add

The app now appears as an icon on your home screen. Tap it to open in fullscreen.

## Export Your Data (IMPORTANT)

Everything is stored locally in your browser. **Export monthly** using **More → Save a copy**. Keep backups safe. Each keeper exports their own ledger (exports are stamped with the keeper's name).

If you clear browser data or Safari storage fills up, your ledger is gone — there is no server.

## Files Explained

| File | Purpose |
|------|---------|
| index.html | The app itself. All CSS and JavaScript included. |
| manifest.json | Tells iOS this is a standalone app. Enables homescreen install. |
| icon-192.svg, icon-512.svg | App icons shown on homescreen and in settings. |
| README.md | Documentation (this file). |

## Customization

- **Change the app name**: Edit `"short_name"` in manifest.json (max 12 characters for homescreen)
- **Change the icon**: Replace icon-192.svg and icon-512.svg with your own images
- **Change the theme color**: Edit `"theme_color"` in manifest.json

## Troubleshooting

**Icon doesn't appear on homescreen?**
- Make sure you're using HTTPS (GitHub Pages is always HTTPS)
- Try waiting 30 seconds after adding
- Refresh the page and try again

**Data disappeared?**
- Check if you accidentally opened in a Private window (data is separate)
- If you cleared Safari data, check if you have a backup from an earlier export

**Changes not showing?**
- Reload the page with Cmd+R (or force reload: Cmd+Shift+R on desktop)
- On iPhone, swipe down and release to refresh

## Technical

- No external dependencies
- Runs entirely in the browser
- Uses localStorage for persistence
- 100% open source

---

Made with ☕ for people who actually like keeping records.
