# The logbook

*The trail register of Carta's fourth turn, kept by the outfitter
(`.claude/skills/outfitter/`). Append-only; newest entry first. A few lines
per entry: what shipped or moved, decisions, parked items, anything for
Lotmark's desk. Old entries are never rewritten.*

---

## 2026-08-20 — the record caught up with the file

- **Why:** PR #98's own two follow-ups. `CLAUDE.md` still described classic
  — the Register, the catalog, the pen, the holds, the reader — as though it
  were the app being worked on, which it hasn't been since Phase 1; and
  `ROADMAP.md`/`ARCHITECTURE.md` had no Phase 12 in them at all. A design
  record that drifts out of step with the file is worse than none, because
  it is confidently wrong.
- **Shipped:** `CLAUDE.md` rewritten for Carta 7 — 1,272 lines of third-turn
  machinery down to 317 lines of the app that actually exists: three rooms
  and one door, the map layer's three custom elements, the seven
  collections, the invariants Carta 7 keeps (no proofs, no gamification, the
  ask grounded, the street layer never required, vendoring amended not
  assumed). The classic map wasn't deleted — it moved whole to
  `classic/CLAUDE.md` with a frozen banner and a note on reading its paths,
  which also means a session working in `classic/` still gets it and a
  session working on Carta 7 no longer does. `ROADMAP.md` records **Phase
  12 — the map in front** and stamps 8–11 shipped with their versions and
  PRs. `ARCHITECTURE.md` updated in §1, §2, §4, §5, §6, §7 and §10.
  `docs/README.md`'s two stale lines fixed in passing.
- **Decision, made because what shipped already made it:** the roadmap's
  Phase 12 was *the scout, tuned on real asks*; the redesign landed in that
  slot instead, and the code, the changelog and the README all say Phase 12
  means the redesign. So the scout-tuning phase is **Phase 13** and stays
  the open one. The route bent; nothing was dropped.
- **The one law that had quietly moved:** Phase 12 vendored `d3-array` +
  `d3-geo` inline (54 KB) and swapped MapLibre + OpenFreeMap for Leaflet +
  OpenStreetMap, and neither was written into `ARCHITECTURE.md`. Both are
  now — §1 as a named amendment with the count fixed at **two**, §10 as the
  first entry in a list of refusals that would otherwise have stopped being
  true. §7's network table also claimed a Microlink brand read that Carta 7
  has never made; it says so now. This is the tooling-creep tripwire's
  intended behaviour, one PR late.
- **Verified:** `node test/model.test.js` 49/49 (docs only, nothing in the
  file touched). Every claim in the new map read back against `index.html`
  rather than remembered — the router constants, the section order, the
  `blank` shape, `passportSVG`'s surviving use in the cards, the absence of
  a brand read.
- **Next:** Phase 13 — the scout, tuned on real asks, whenever there's
  enough ask history to tune against.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-20 — Phase 12 shipped: the map in front

*(Recorded a beat late, with the doc pass above — the phase merged as PR #98
without its entry.)*

- **Shipped:** the redesign commission (`DESIGN_BRIEF.md`, drawn in
  `docs/redesign-concept/`), and with it a phase the roadmap hadn't planned
  for. The **Atlas is home** — the passport full-bleed and sticky, tasted
  countries inked with the keeper's own spelling written across them, each
  tappable, cities underneath with their own drawn plots. **Four rooms
  became three** (Atlas · Journal · Shelf) with **＋ A cup** beside them:
  the app header is gone and the door is reachable from everywhere rather
  than the top of one screen. **Scout dissolved into the Atlas** as *Your
  taste* — everything it argued still argues, still with its reasons. A
  country, a city, a café, a cup, your taste and the dials became screens,
  not sheets. The door asks one question fewer. The Journal opens with the
  last cup you brewed. v7.13.0.
- **The map layer, re-cut:** MapLibre + OpenFreeMap out; `<carta-belt>`,
  `<carta-plot>` and `<carta-streets>` in, inline as light-DOM custom
  elements. The passport now needs **no network at all** — `LANDS` was
  already in the file and the projection came in with it.
- **The kit law that moved:** the handoff prototype wanted d3, topojson,
  Leaflet and a world atlas off CDNs, which would have ended the file's core
  property. Instead `d3-array` + `d3-geo` were **vendored verbatim** (54 KB,
  the two modules the projection actually uses) and Leaflet stayed a runtime
  injection. Right call, wrong bookkeeping: it went in without amending
  `ARCHITECTURE.md`. Fixed in the entry above, with the count held at two.
- **The ledger is untouched:** same store, same keys, no migration, no
  schema change. 3,420 lines / 295 KB — inside §1's own band.
- **Next:** the doc pass above; then Phase 13.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-20 — Phase 11 shipped: the return loop, without gamification

- **Shipped:** the roadmap's own fifth tripwire, tested against a real
  feature for the first time — does a surface state a fact, or does it
  score one? Two quiet surfaces. First, `newGroundToast()`: the moment a
  country or city first lands on the passport, one dry sentence plus an
  offer to share the passport card right then. Bootstraps silently
  against whatever's already tasted — a pre-existing record, and a
  brand-new keeper's own first flurry of cups, both stay quiet, since
  either would read as the onboarding-reward pattern this phase exists
  to refuse; a bulk classic import never calls it at all. `toast()` grew
  an optional action-label param so this reuses the app's own existing
  "fact + one action" shape (undo) rather than a second UI paradigm.
  Second: a shelf coffee genuinely taken home (the café-to-shelf bridge,
  never a coffee that started home) with no home brew a week on gets one
  line — "taken home, not brewed yet." `takeItHome()` now stamps a
  dedicated `homeAt`. PR #96.
- **Explicitly not in it:** a streak, a badge, a push notification, a
  percent-complete anything — checked against every string before it
  shipped.
- **Verified:** by hand in a real browser — first-ever saves bootstrap
  silently, a repeat country/city stays silent, a genuinely new one
  announces with a working Share action that opens the real passport
  preview; the taken-home note fires at 10 days with no brew, stays
  silent inside the 7-day grace period, silent for a coffee never
  explicitly taken home, and silent once any brew exists. `node
  test/model.test.js` 49/49, unaffected (DOM/localStorage-coupled code,
  outside the pure block). A self-inflicted duplicate `function vShelf(){`
  from a stray edit-tool overlap was caught by the syntax check before
  any browser testing — worth naming since it's the same first-line
  check that's caught something in nearly every phase this session.
- **Next:** Phase 12 — the scout, tuned on real asks.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-20 — Phase 10 shipped: quick capture, a shortcut to the door

- **Shipped:** the smallest possible cut at the biggest source of friction
  in the most-used loop. `manifest.json` gains a standard `shortcuts`
  entry ("A cup") — zero dependency, zero new surface — and the boot
  sequence reads `?open=door` to open the door directly, cleaning the
  query string from the address bar so an ordinary reload doesn't reopen
  it. PR #94.
- **A gap raised before building, not after:** `manifest.json`'s
  `shortcuts` array has no iOS Safari implementation at all — home-screen
  PWAs on iPhone/iPad get no long-press quick-action menu, full stop,
  Android/ChromeOS/desktop Chrome only. The phase's own "Done when" bar
  (a long-press on the home screen) can't be met on the founder's own
  test device with this mechanism, and the phase explicitly rules out
  anything needing a native shell — the only route to a real iOS
  long-press action. Asked the founder before writing any code; the
  answer was build it anyway (correct, genuinely useful for Android/
  desktop users of the app) and name the gap honestly rather than let it
  read as solved everywhere. Done, in the changelog and here.
- **Verified:** by hand in a real browser — an ordinary load never
  auto-opens the door, `?open=door` opens it and clears the query string,
  a reload of the cleaned URL doesn't reopen it, and the door's own flow
  works normally once opened this way. `node test/model.test.js` 49/49,
  unaffected (boot/DOM-coupled code and static manifest JSON, no
  pure-block change).
- **Next:** Phase 11 — the return loop, without gamification.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-19 — Phase 9 shipped: roast joins the taste model

- **Shipped:** §0's first finding, closed. `roastLevel` on Coffee — a
  short fixed scale (Light / Medium-light / Medium / Medium-dark / Dark),
  optional everywhere, never required, never a rung or a ladder (the
  phase's own named tripwire). `parseRoastLevel` reads a level off a
  pasted bag or a menu line the same light-touch way the door already
  reads a roaster/name split, only firing adjacent to the word "roast"
  itself so a tasting note ("light, floral") is never mistaken for a
  roast level. `tasteModel()` grows a fourth vector bucket, `roast`,
  built the same way processes/origins already are; Scout's vector leads
  with it now. `briefPlainText()` gains one clause, ahead of Processes —
  and since the ask's prompt embeds that same brief text verbatim, it
  inherited the clause for free, no separate edit needed despite the
  phase naming "one clause each." PR #93.
- **Verified:** `node test/model.test.js` 49/49 (43 prior + 6 new — the
  roast bucket and its ranking, the brief's clause and its position ahead
  of Processes, parseRoastLevel's word-adjacency behavior including its
  deliberate refusals on bare tasting-note words). By hand in a real
  browser: the Coffee form's select saves and reopens pre-selected; a
  door paste stating "light roast" parses, pre-fills the still-editable
  select, and the minted coffee carries it; a menu line stating "Dark
  Roast" carries through "Log a cup"; Scout's Roast row and the brief's
  clause both render correctly.
- **Next:** Phase 10 — quick capture, a PWA shortcut to the door.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-19 — Phase 8 shipped: durability, without a server

- **Shipped:** the first phase of Act Two. `exportLedgerJSON()` — Carta 7's
  first way to back up its own record at all (only classic's export
  *format* existed before, and only as an import source). The Shelf now
  states how stale the last one is, same flat register as a bag's rest
  window ("Last backed up — n weeks ago" / "Never backed up yet."), with
  a button right there. `photoPicked` gets a proactive storage-quota
  check — a quiet note before a save is even attempted, not only
  `savePhotos()`'s existing after-the-fact catch. An opt-in, off-by-
  default fortnightly auto-export, checked on every tab switch so it's
  always inside a real user gesture (a bare timer-triggered download is
  liable to be silently blocked with no gesture behind it). PR #91.
- **Not in it, on purpose:** any server, account, or sync protocol — the
  horizon's "sync-as-backup" item stands unchanged; this is the floor
  under it, not a replacement.
- **Verified:** by hand in a real browser, not just the threshold math —
  a real download parsed back as valid JSON with the ledger's expected
  keys, the Shelf's readout updating immediately; a simulated stale
  timestamp actually crossing the 14-day line and firing a real second
  download with the toggle on, silent with it off; the photo guard wired
  through a genuine file-input change event, appearing only once
  simulated storage was actually near the ceiling. `node test/model.test.js`
  44/44 (unaffected — this phase's code is DOM/localStorage-coupled,
  outside the pure block).
- **Next:** Phase 9 — roast joins the taste model.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-19 — the city map, actually working (four PRs off a bug report)

- **Why:** the founder reported the map "not working as intended," then —
  after two rounds — "every city map crashes," attached their real classic
  export, and finally described the exact symptom ("opens with a pin or
  two, then collapses to a line"). Each report narrowed the diagnosis; none
  of the four bugs found were guesses shipped on faith.
- **Shipped, in the order found:**
  1. **The render storm** (PR #86) — `geocodeCityPlaces` re-rendered once
     per café as it resolved, and `render()` tears down and rebuilds every
     live map on repaint. A city with several un-placed cafés got the
     street layer rebuilt every ~1.1s instead of settling once. Debounced.
  2. **The importer's data loss** (PR #87) — `importClassicMap`'s
     `joinPlace()` never read classic's café Register at all, only a cup's
     own (sometimes blank) city text. Every classic café needed a fresh
     geocode after crossing over, even ones classic had already confirmed —
     compounding bug #1 for anyone arriving via the importer, which is
     everyone with a pre-Carta-7 record. Now carries position, city,
     neighborhood and palette across, blanks-only.
  3. **The actual crash** (PR #88) — not WebGL/GPU at all: `.plot-box` has
     no height of its own (it's sized by a child `<svg>` that the live
     layer deletes once it loads), and separately, MapLibre's own CSS wins
     a same-specificity tie against ours for the container's positioning,
     stripping it of the `position:absolute` it needs to fill anything.
     Both fixed; verified with real before/after pixel measurements against
     the exact pinned MapLibre build, not just "no thrown error."
  4. **Two more integrations** (PR #89) — a café's own sheet now draws a
     settled live pin of just that place; the ask's result pins get the
     same live layer the city chapter has. Building the second surfaced
     that sheets never had a map mount/teardown lifecycle at all
     (`smapMount`/`smapDestroy` only ever ran from the tab-level `render()`)
     — fixed with a scoped destroy so a sheet's map dies with the sheet
     without ever touching a map still alive on the screen underneath it.
- **Method worth keeping:** this sandbox's outbound network to unpkg/
  OpenFreeMap is proxy-blocked, which made the early "does it even boot"
  checks pass for the wrong reason (the degrade path is solid, but that's
  not the same as the live path working). Installed the exact pinned
  MapLibre GL version locally and routed the CDN URLs to it instead of
  trusting a synthetic pass — that's what actually caught bug #3, and
  caught a real regression (a string passed where bug #4's shared helper
  expected a function) before it shipped, not after.
- **Not touched, on purpose:** the country-chapter region-scale map named
  as a third enrichment option — bigger lift (no region-level coordinates
  captured anywhere yet), not asked for this round.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-19 — Act Two drafted: the roadmap, refined against a shipped app

- **Why now:** with Phases 1–7 shipped plus OCR (v7.8.1, 43/43 pure tests),
  the horizon list was the only forward-looking text left, and every item
  on it is gated on something outside Carta — Lotmark's atlas, felt
  multi-device pain, outside demand for a paid tier. Re-read the shipped
  code and the shipped market framing against each other instead of
  against the original brainstorm, and drafted a second act from what that
  turned up. `ROADMAP.md` rewritten: Act One condensed to a table (full
  prose stays in this file, unrepeated), a new §0 naming the findings, and
  Phases 8–12.
- **Two findings drove it:** (1) `tasteModel()`'s vector has no roast
  axis — no `roastLevel` field survived Phase 1's cut, and Phase 2 had
  explicitly declined to invent one — yet `MARKET.md` §3 states the app's
  own identity as *"the absolute best light roast in the world."* The
  model can't currently back up the sentence the market doc puts in its
  mouth. (2) `save()`'s only response to a full quota is an after-the-fact
  toast; there is no export reminder and no proactive quota guard, despite
  the whole journal living in one `localStorage` key on one device by
  design. Neither finding changes a joy or a law in `PIVOT.md`; both
  change what ships next.
- **Decision reopened, logged as the roadmap's own rule requires:** the old
  horizon item "sync-as-backup, gated on felt multi-device pain" conflated
  two problems. Split: **durability** (Phase 8 — an export reminder, a
  quota guard, zero infrastructure) no longer waits on multi-device pain
  being felt, because the risk it closes is present on day one, single
  device, no sync at all. **True multi-device sync** stays exactly as
  gated as before, on the horizon, unchanged.
- **New phases, in joy-per-effort-*and*-urgency order:** 8 durability
  (closes an irreversible risk first) · 9 roast joins the taste model
  (cheap, sharpens the founding claim) · 10 a PWA shortcut straight to the
  door (cheap, tightens the "under twenty seconds" bar) · 11 a return loop
  built from stated facts, not scores or streaks (the first phase to test
  `MARKET.md`'s no-gamification rule against a real feature, hence a new
  fifth tripwire) · 12 tuning the scout against real ask history,
  deliberately last because the data to tune against didn't exist before
  Phase 7 shipped.
- **Parked, unchanged:** the Lotmark loop, community menus, the concierge
  tier — all still gated on something outside Carta, all re-affirmed as-is.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-19 — off the horizon list: OCR for menus

- **Picked, and why:** with every scheduled phase shipped, the horizon
  list (`ROADMAP.md`) was the only unopened door. Four of its five items
  are gated on something Carta can't originate alone — the Lotmark loop and
  community menus need Lotmark's published atlas, which doesn't exist yet;
  the concierge tier needs outside demand and starts from revenue, which is
  the "business creep" tripwire by definition; sync-as-backup is gated on
  multi-device pain "felt in practice," not expressed. OCR for menus was
  the one actually ripe: self-contained, and the list named its own shape
  — "a BYO-key vision call through the same sanctioned channel as the
  scout's ask; one posture, two uses." Phase 4 had explicitly parked OCR
  rather than ruled it out ("no OCR dependency" was the v1 cut, not a law),
  and Phase 7 had since built exactly the door this needed.
- **Shipped:** **Read it for me** on the menu-capture sheet. A photo held
  up while typing can now be read by a model instead — the same
  BYO-key channel and the same key the ask already uses (`callModel`, now
  shared by both: a plain prompt for the ask, an image content block plus
  a prompt for this), one tap, never automatic, never required. The lines
  it finds land in the same textarea the manual path already fills,
  appended to anything already typed rather than overwriting it — checked
  and editable before anything saves, same as always. The photo itself
  still keeps the Phase 4 promise: it lives in memory for the sheet's
  lifetime only, travels to Anthropic exactly once if the keeper asks it
  to, and is never written to the ledger or `localStorage` either way.
  `extractJSON` is a new shared door both `parseAskJSON` and the new
  `parseMenuOCR` read a model's answer through — fenced or bare, prose
  around it or not, degrading to nothing rather than guessing at a menu
  line that was never there.
- **Verified:** `node test/model.test.js` at 43/43 (6 new cases: the OCR
  prompt asks for the same line shape the textarea already expects,
  `parseMenuOCR` reads clean and fenced JSON, drops blank/null entries,
  degrades to empty on a non-JSON answer, and `extractJSON` itself is
  covered as the shared door). A full Playwright run with the vision call
  mocked: no OCR button before a photo exists, the no-key state opens the
  key sheet rather than calling out, a set key changes the button's label,
  OCR appends to a manually-typed line rather than clobbering it, the
  saved menu carries every line, the outbound request actually carried an
  image block, and — checked directly against the ledger and
  `localStorage` — the photo itself never landed in either. Re-ran the
  Phase 7 ask suite and the street-layer suite as regression checks, since
  this touched shared machinery (`callAskModel` → `callModel`); both still
  green.
- **Next:** the horizon list's other four items, none earned yet by their
  own gates — nothing left to pick from without one of those gates opening
  first. `ROADMAP.md`'s scheduled phases and every horizon item that could
  ship alone are now both done.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-19 — Phase 3 finished: the city frame's street layer

- **Shipped:** the one thing Phase 3 left for later. A city chapter now
  draws its cafés on a real frame, not just a list: `cafePlotSVG` fits a box
  to whatever café positions are on file and draws each as a plain dot,
  tapping straight into the café's own sheet — the same "drawn plot" the
  ask's results already used, factored apart from it (`plotBox`) so both
  share one projection instead of two. Positions come from a new
  `geocodeCityPlaces`, which quietly confirms each un-placed café the first
  time its city chapter opens (reusing `geocodeCafe`, the exact keyless
  Nominatim door Phase 7 built to ground the ask's own suggestions — one
  door, two callers), fills blanks only, tries a café at most once ever, and
  paces itself past Nominatim's own usage policy. Real streets — MapLibre GL
  over OpenFreeMap's vector tiles, repainted in Carta's own tokens — fade in
  under those same pins where the network reaches them and TAKE OVER as
  live, pannable markers; where it can't, the drawn plot simply stands, says
  so once in one quiet line ("Streets unavailable — showing saved
  positions"), and offers Retry. No dialog, no dead end, no red — a network
  hiccup is not treated as a failure the keeper needs to be told off about.
  Ported craft from classic (the style, the loader, the mount/destroy
  lifecycle, the camera-floor math) minus its ground mode, its atlas edges
  layer and its lens — Carta 7 has one map surface, not classic's whole
  unified system. `render()` now destroys and remounts whatever map surface
  the current screen carries, the same lifecycle classic used; a theme
  toggle repaints a live map in place rather than leaving it stale.
- **Not touched, on purpose:** the passport (world frame) and its country
  chapters stay exactly as they were — this was always the city frame's own
  gap, not the passport's.
- **Verified:** `node test/model.test.js` at 37/37 (no pure-block changes —
  geocoding and the map are both network/DOM code and correctly live outside
  the markers); a real-browser Playwright run with Nominatim mocked: a
  logged café gets placed and drawn within the pacing window, the pin taps
  into the café sheet, a second visit shows it instantly from storage with
  no re-geocode. The live tile layer itself couldn't be exercised past its
  loader in this sandbox (`unpkg.com`/`tiles.openfreemap.org` are proxy-
  blocked here) — which turned out to be a faithful stand-in for "the CDN is
  unreachable," and confirmed the exact thing that mattered: the failure is
  silent and graceful, never a crash, never a dialog. Also re-ran the Phase
  5, 6 and 7 smoke suites in full as a regression check, since this touched
  shared machinery (`render()`, the ask's own pin plot) — all still green.
- **Next:** the horizon list (`ROADMAP.md`): the Lotmark loop, sync-as-
  backup, OCR for menus, community menus, the concierge tier — none earned
  yet.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-19 — Phase 7 shipped: the scout, stage two

- **Shipped:** the ask — Scout can now send the brief on the keeper's own
  behalf, scoped city/neighborhood/country/route/friend plus an optional
  question, to a model via BYO-key (Anthropic's Messages API, called direct
  from the browser, the key kept in prefs on-device only — the one
  sanctioned outbound call, per `ARCHITECTURE.md` §7). Degrades to the
  plain brief, copied, both with no key set and on a failed call. Every
  named café is checked against Nominatim before it's ever drawn as a pin;
  what can't be confirmed is listed, marked "not confirmed," never guessed
  onto the frame. Pins draw on a new small honest box (`cityPinsSVG`) fit
  to the handful of points one ask returns — monochrome, the passport's own
  law held here too. Been/Booked/Skip on a result feeds the loop: Been or
  Booked joins or mints a `places` record carrying the confirmed lat/lon,
  so the café is already known the next time it's typed into the door;
  Skip only sets the status, nothing written, matching the shuttered
  matching's "a skip fades, it's never a veto." Past asks live on Scout,
  reopenable. PR #81.
- **Pure and tested:** `askPromptText` (the prompt, asking for exactly one
  JSON shape) and `parseAskJSON` (fenced or bare, tolerant of prose around
  it, degrades to empty rather than throwing) — a model's wrongness here
  would be as invisible as a bad taste-model read, so it gets the same
  treatment. 7 new cases, 37/37 passing.
- **Not touched, on purpose:** the city chapter's own live street layer
  (Phase 3) — the ask's pin frame is a small thing of its own, not that.
  The concierge tier (`MARKET.md` §5) — BYO-key only, as the roadmap named.
- **Verified:** `node test/model.test.js` at 37/37; a full sweep for a
  stray `</script>` inside a comment; a real-browser Playwright run with
  both `api.anthropic.com` and Nominatim mocked — the no-key degrade,
  saving a key, a full ask round-trip (a grounded café with its pin and
  reason, an ungrounded one listed and marked not confirmed), Been minting
  a place record, and the ask's history and status both surviving a full
  page reload.
- **Next:** nothing left named on `ROADMAP.md`'s scheduled phases — next up
  is the horizon list (the Lotmark loop, sync-as-backup, OCR for menus,
  community menus, the concierge tier) or the rest of Phase 3's live street
  layer, whichever the founder would rather walk into.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-19 — Phase 6 shipped: the migration, and the handover

- **Shipped:** `importClassicMap(json, existing)` — classic's own JSON
  export, mapped onto Carta 7's ledger (roasters, places, setups, coffees,
  brews, cups), reading node-first with a flat-field fallback exactly as
  classic's own `bagRoaster`/`lotRead`/`roastRead` do, so nothing goes blank
  just because classic had already retired the flat text behind a catalog
  node. Additive and re-runnable — every minted record carries a `sourceId`
  back to its classic id, so reading the same export twice adds nothing the
  second time. Roaster and café names join through the existing gentle join,
  both against the standing record and within one import batch. The Shelf
  gets a Classic section: **Import from classic** (pick the file, see the
  new-record counts, add them) and **Open classic**, a plain link. `uid()`
  moved into the pure block, since `importClassicMap` needed an id generator
  and the block is evaluated standalone by the test harness. PR #80.
- **The other half of the phase — GitHub Pages at the root — needed nothing
  here:** Phase 1 already moved Carta 7's `index.html` to the repo root and
  classic to `classic/`, and `CNAME` already sits at root. That's been true
  since Phase 1 merged; this phase just confirmed it.
- **Not touched, on purpose:** `manifest.json`'s `scope`/`start_url` of
  `/carta/` — `ARCHITECTURE.md` names this a kept decision, not a leftover.
  `ROADMAP.md` said the classic link belongs on "the Desk corner"; Carta 7
  has no Desk room (four rooms only), so it landed on the Shelf instead, the
  closest analog as the utility/list room — a deliberate substitution, not a
  silent drop.
- **Verified:** `node test/model.test.js` at 30/30 (8 new cases for the
  importer); a full sweep for a stray `</script>` inside a comment (the
  Phase 5 lesson); and a real-browser Playwright run against a synthetic
  classic export — the preview's per-kind counts, the imported records
  reading back correctly across the Shelf/Journal/Atlas, and a second import
  of the same file landing on "Nothing new."
- **Next:** either the rest of Phase 3 (geocoding + the live street layer)
  or Phase 7, per `ROADMAP.md`.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-18 — Phase 5 shipped: the share

- **Shipped:** all five named card kinds — Coffee, Place, the Passport, the
  Year, and the friend-brief (already this shape since Phase 2) — through a
  new shared `exportPageHTML` shell factored out of `briefPageHTML`. Every
  card embeds `carta.card/v1`. `shareOrDownload()` tries the OS share sheet
  via `navigator.share`+`File` first (a friend's phone, not your own
  Downloads) and falls back to a download. The import door (Shelf → "Import
  a card") reads a coffee or café card back in — the passport and the year
  are readings over your own record, nothing to import. PR #79.
- **A real bug, caught by an actual browser, not by `node --check`:** a code
  comment containing the literal text `</script>` truncated the app's own
  inline script for any real browser parsing the HTML — the tokenizer
  doesn't parse JS, it just looks for that byte sequence. `node --check`
  never saw it because it only checks whatever a regex extraction hands it.
  Fixed, and swept the whole file for the same trap. Worth remembering: the
  syntax check is necessary, never sufficient — a real browser load is the
  only thing that actually proves the file boots.
- **Verified:** by hand, and by a full round trip — shared a coffee card,
  downloaded it (headless Chromium has no `navigator.share`, so this
  exercised the fallback), imported it back in, watched it land on the
  Shelf. Screenshotted the card preview and the standalone exported page.
- **Next:** either Phase 6 (the classic importer, and GitHub Pages serving
  Carta 7 at the root) or the rest of Phase 3 (geocoding + the live street
  layer).
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-18 — Phase 4 shipped: the bridge

- **Shipped:** take-it-home — coffees carry `home` (true the moment you brew
  one, since beans-in-hand is the definition; false for a café-only taste),
  the Shelf now filters to it, and **Take it home** on a cup or a coffee's
  own page is the one-tap bridge from a café pour to the shelf. Photos on
  cups (`PIVOT.md` decision #1) — one, optional forever, restrained: resized
  and recompressed to a JPEG data-URI on the device, kept outside the ledger
  in `carta7.photos.v1`. Menu capture with no OCR dependency — type a café's
  menu one line per coffee from its own new sheet (cafés are tappable from a
  city chapter now), optionally holding a photo up as reference while
  typing; the photo is genuinely never saved, confirmed directly against
  `localStorage`, not just documented. A menu line logs a cup on the spot
  (café already known, straight to the score step) or links to an existing
  shelf coffee. PR #78.
- **Verified:** by hand in a real browser (photo capture and thumbnails on
  both café and home cups, the take-it-home gate on the Shelf, the full
  menu-capture-to-logged-cup walk, "already got it" linking) and by
  inspecting `localStorage` after a menu capture to confirm the photo left
  no trace anywhere.
- **Next:** either the rest of Phase 3 (geocoding + the live street layer,
  now that a menu's own "at this café" context makes a place worth pinning),
  or Phase 5 — the cards.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-18 — Phase 3 shipped (in part): the passport and its chapters

- **Shipped:** the passport — a world frame drawn from `LANDS` (Natural
  Earth outlines, 65 countries, ~8KB) ported verbatim from classic, tasted
  countries washed and tappable, untasted ones a hairline invitation;
  highland contours (`LAND_TOPO`, 48 countries, ~20KB) ported and wired
  through classic's own `TOPO_KM` gate, honestly withheld at true world
  width rather than drawn illegibly — a faithful port of the rule, not a
  cut. Country and city chapters, as typography per `ROADMAP.md`'s own
  framing: a country's coffees by region, a city's cafés with their
  average score, reached via a new one-level page overlay (`pageView`) in
  the router. `passportSVG()` is new and purpose-built for a single
  always-on world frame, not a port of classic's general-purpose
  `plotSVG` (which carries lens laws, rung gating and scene clustering —
  the "law" `ARCHITECTURE.md` §1's porting rule excludes). Country lookup
  goes through `fold()` + a ported `LAND_AKA` alias table, not classic's
  `normPlace`/`genFold`. PR #77.
- **Not shipped, and not silently dropped:** the city frame's live street
  layer (MapLibre + OpenFreeMap) from `ARCHITECTURE.md`'s "maps" list.
  It needs place geocoding (lat/lon) to plot anything, and nothing in
  Carta 7 captures coordinates yet — building geocoding as a side effect
  of a map feature felt backwards. The city chapter ships as the
  spec's own sanctioned degrade (§7: "the drawn plot") in the meantime —
  a typographic reading of your cafés there, no map.
- **Verified:** by hand in a real browser and by decode-correctness
  checks against the ported data directly in Node (country/topo counts,
  a sample decode, the world bbox confirming the contour gate fires
  correctly) before any UI was wired to it. Screenshotted in both paper
  and dusk.
- **Next:** either the city frame's geocoding + live street layer (the
  rest of Phase 3), or Phase 4 — the bridge — depending which the
  founder would rather walk into next.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-18 — Phase 2 shipped: the brief

- **Shipped:** `tasteModel(ledger)` per `ARCHITECTURE.md` §5 — the bar (a
  floor, anchors at avg≥8/n≥2, your 9s as evidence) and the vector
  (processes/origins/descriptors, each bucketed with weight + n + evidence
  refs), plus `scope(place|city|country|route)` for exclusions. `brief()`
  renders a plain-text cut (~1,500 chars, bounded, "already had" inline) and
  a self-contained page embedding `carta.brief/v1`. Scout replaced its
  Phase 1 stub with the real room; café cups can now carry a city. The taste
  model, the brief, and the join/put-away primitives moved into a
  `/* ==== pure ==== */` block per §9, with `test/model.test.js` (22 cases,
  the `server/test.js` pattern) slicing it straight out of `index.html`.
  PR #76.
- **Verified:** by hand in a real browser — three café cups across two
  cities plus a home cup, Scout showing the right floor and anchor, a
  Portland-scoped brief correctly excluding the Seattle coffee, Copy landing
  on the clipboard, Download producing a page carrying the machine block.
- **Decision, not reopened, just made concrete:** `vector.roast` from
  §5's shape has no data source in the Phase 1 ledger (no roast-level
  field survived the cut from classic) — the vector ships as
  `{processes, origins, descriptors}` and stays that way until something
  in the record actually states a roast character. Not a reopening of
  the data model; just declining to invent a field to fill a slot.
- **Next:** Phase 3 — the atlas.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-18 — Phase 1 shipped: the skeleton stands

- **Shipped:** a new `index.html` built clean per `ARCHITECTURE.md` — the
  token layer (ported), the journal, the shelf, the door (paste-or-type → a
  coffee card, gentle join on roaster/place names, no adjudication), the
  dial-in loop (Setups + the dial component + a stopwatch, ported), put-away
  + undo. Scout and Atlas sit on the tab bar as named stubs. Classic (Carta
  6.18.x) moved whole to `classic/index.html` via `git mv` — untouched but
  for relative asset paths and dropping its own manifest link
  (`ARCHITECTURE.md` §2); its README travelled with it. Root `README.md`
  rewritten for Carta 7's current state. PR #75.
- **Verified:** the phase's done-when bar, by hand in a real browser — a
  café cup logged through the door in a few taps, a home brew through the
  dial-in loop (first Setup writing itself, a second brew reusing it
  silently and carrying the last grind forward), both reading back in the
  Journal, both coffees on the Shelf; put-away + undo on a coffee.
- **Scope cuts, noted for the record, not decisions:** no roaster/site brand
  read yet (no network calls at all in this phase — offline by construction,
  matches the "no maps" cut); the gentle-join near-match prompt only fires
  in the door and the café-cup flow, not the Shelf's direct "＋ Add a
  coffee" form (which joins on an exact fold match only, silently) — a
  reasonable frequency-based cut, not a law; no "What's New" sheet wired yet
  (APP_VERSION/CHANGELOG constants exist as data for the next bump).
- **Next:** Phase 2 — the taste model and the brief.
- **For Lotmark's desk:** nothing new this entry.

## 2026-08-18 — the boundary carried to Lotmark's side

- **Carried across:** the Phase 0 desk item — Lotmark's counterpart agent
  learning the mirror-image boundary — landed as lotmark PR #186:
  `docs/carta.md` (the charter), a `CLAUDE.md` Carta section, and the
  `/ceo-brief` skill's *Carta desk* (reads this logbook's "For Lotmark's
  desk" list every run; refers consumer/taste-side ideas back here as
  one-line `Carta-scope, referred` entries).
- **Protocol now live both ways:** items under "For Lotmark's desk" below
  are read by Lotmark's daily brief; Lotmark's briefs refer Carta-shaped
  ideas here for the outfitter to author.
- **For Lotmark's desk:** nothing new this entry (the standing items from
  Phase 0 remain: honor `carta.brief/v1`; the published atlas read).

## 2026-08-18 — the turn recorded; Phase 0 complete

- **Shipped:** the fourth-turn suite — `PIVOT.md` (approved by the founder,
  including the scout revision), `ROADMAP.md`, `ARCHITECTURE.md`,
  `MARKET.md`; the outfitter installed at `.claude/skills/outfitter/`; the
  third-turn `/goal` skill (`docs/SKILL.md`) superseded and kept for the
  record. PR #73.
- **Decisions adopted** (`ROADMAP.md`): photos return (one per cup,
  optional); the 1–9 stays; AI posture brief → BYO-key → concierge; gentle
  joins (`aka[]`) on roasters/places only; menus personal in v1; four rooms
  (Journal · Scout · Atlas · Shelf); ships as Carta 7.0.
- **Next:** Phase 1, the skeleton — new `index.html` per
  `ARCHITECTURE.md`, classic moved whole to `classic/`.
- **Parked:** OCR for menu photos (horizon, via the sanctioned ask
  channel); community menus; sync-as-backup; concierge tier.
- **For Lotmark's desk:** the trade-side machinery leaving Carta is
  Lotmark's inheritance — resolver/ladder, lot identity, hard-IDs,
  standing, catalog spine, pen/publishing (see `PIVOT.md` §10). Two
  interchange formats to honor from the Lotmark side eventually:
  `carta.brief/v1` (read) and a published atlas of roasters/bars/menus
  (write) — the corpus × atlas loop in `PIVOT.md` §7.5.
