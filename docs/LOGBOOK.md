# The logbook

*The trail register of Carta's fourth turn, kept by the outfitter
(`.claude/skills/outfitter/`). Append-only; newest entry first. A few lines
per entry: what shipped or moved, decisions, parked items, anything for
Lotmark's desk. Old entries are never rewritten.*

---

## 2026-08-22 — Phases 21 and 22 scoped: the coffee is the draft, then search on your own key

- **Not shipped — scoped only.** The founder described a real ingest upgrade:
  an AI model with search matching a photographed menu coffee against other
  roasters, importers, any site that might carry better origin facts, plus
  "correction" of coffees already on the shelf. Run through the four-question
  test: that fuller version is `docs/RESOLVER.md` by another name — a
  fingerprint scorer and corpus-wide correction across sources is tripwire 1
  (third-turn relapse), Lotmark's, not Carta's. Named once; the founder asked
  for the smaller cut scoped as a phase instead.
- **A second, sharper problem surfaced in the same conversation:** the actual
  workflow is see the menu, start the coffee entry while sipping, get pulled
  away before finishing, come back once there's time to research the rest —
  and a swipe-dismiss on the coffee form today discards everything typed,
  because `closeSheet()` wipes the sheet's DOM unconditionally and nothing
  persists before "Save." This is a data-loss bug wearing a feature request's
  clothes, and it's the more urgent of the two.
- **Phase 21 — the coffee is the draft.** No shadow draft object; the coffee
  record itself is minted the moment a roaster or name is typed (the same
  move the menu capture already makes) and every further keystroke autosaves
  into it. A swipe, a backdrop tap, the phone put away — whatever's typed
  stays on the Shelf, picked back up exactly where it was left. Scoped to the
  coffee form only, not a blanket autosave-every-sheet.
- **Phase 22 — search, on your own key.** The in-bounds cut of the founder's
  original ask: one BYO-key model call (the same `callModel`/`api.anthropic.com`
  channel the ask and menu OCR already use, asked to use its search tool),
  keeper-summoned per coffee via a "Search for more" button, filling only the
  blank origin fields as plain editable suggestions. Never a shelf-wide sweep,
  never a comparison between two of the keeper's own coffees, never a silent
  overwrite.
- **For Lotmark's desk:** the fuller version — matching a coffee's identity
  across roaster sites, importer lists, and other keepers' records, then
  reconciling and correcting a corpus from it — is exactly the resolver
  `docs/RESOLVER.md` already designed. If Lotmark ever wants an ingest
  assist built on real cross-source matching, that ladder is already spec'd;
  it doesn't belong here.
- Full phase write-ups (joy, risk, what it does, what it must not become,
  done-when) are in `ROADMAP.md`, Phases 21–22, scheduled but not yet built.

---

## 2026-08-22 — Phase 19: the split, paying down the debt Phase 20 deepened

- **Shipped — v7.22.0.** The map layer — the three custom elements
  (`<carta-belt>`, `<carta-plot>`, `<carta-streets>`), the vendored
  `d3-array` + `d3-geo`, and the ground data (`LANDS`, `LAND_TOPO`,
  `LAND_AKA`) with its decoders (`landRingsRaw`, `landTopoRaw`, `landKey`,
  `landAnchor`) — moved out of `index.html` into its own file,
  `carta-map.js`, loaded from the `<head>` with a plain `<script src>`.
  `index.html` is back to **4,854 lines / 321.5 KB**, comfortably inside the
  3–5,000-line band with real room again; `carta-map.js` holds **535 lines /
  108.4 KB**. No lines were cut, only moved — the app is the same size it
  was, just no longer one file.
- **The seam, exactly as designed.** `carta-map.js` owns the data, the
  decoders and the elements, and publishes the handful the app reads —
  `LANDS`, `landRingsRaw`, `landTopoRaw`, `landKey`, `landAnchor` — onto
  `window`, the same way `CARTA_LAND_NAMES` already flows the other way.
  The custom elements' own private `BELT`/`AKA`/`fold` (self-contained in
  their own closure, distinct from the app's ledger-facing `fold`) needed no
  change at all. No rewrite, no rename, no restyle — the diff is a move plus
  that seam, checked against the pure harness (still 74/74, sliced out of
  `index.html` exactly as before) and by loading the app in both paper and
  dusk: the passport, a seeded tasted country and its topo-contoured
  chapter all rendered unchanged.
- **Landed after Phase 20, not before it, and paying a larger debt than
  scheduled.** Phase 19 was written and scheduled first; Phase 20 collided
  with it on `main` and landed anyway, by the founder's own explicit call,
  knowingly deepening the line-band debt this phase exists to pay — from
  Phase 18's 5,043 to 5,380 (`ARCHITECTURE.md` §1, Phase 20's own logbook
  entry). This phase closes that debt at last: the founder's original
  schedule held even though the number it had to pay down grew twice in the
  meantime.
- Nothing for Lotmark's desk, nothing parked. This was pure debt service —
  the kind of phase that serves no joy directly and exists so the ones that
  do can keep landing in a file that's still readable whole.

---

## 2026-08-21 — Phase 20: Ask Carta, at the front door

- **Shipped — v7.21.0.** The ask moved off a button at the bottom of the
  Atlas — reachable only after scrolling past the passport, the cities and
  the tasted countries — onto the Atlas's own hero: one field standing on
  the passport's fade, one word to send it. What Carta has already found
  moved with it, from a scroll away to directly under the fold.
- **The composer states its own ledger before the key is spent** — the bar,
  the scores, what's excluded by name, the scope, each read live off the
  record, `unread` wherever it's silent — and the block is a door onto the
  brief itself for anyone who wants every character of it.
- **The wait is a screen of its own.** The one network call Carta makes used
  to run silently under the button that started it; it now narrates the
  record's own counted figures, the call, then each name landing on a plot
  as its address confirms, on one hairline allotted in advance so it never
  runs backwards. Cancel aborts the fetch and the grounding loop for real.
- **A real bug, caught by taking the invariant literally.** The draft this
  phase started from wrote the ask to the ledger *before* its last pacing
  beat, so a cancel in that final ~900ms window didn't actually prevent
  anything — the record was already written by the time cancel could stop
  it, quietly breaking "nothing is written down." Fixed by moving the write
  after that beat's own cancel check. Worth keeping in the record: a stated
  invariant is worth re-deriving against the actual code path, not just
  reading as prose.
- **Landed into a `main` that had moved twice.** This phase was built against
  the file before Phase 18 (the ground), Phase 19 (the split, scheduled), and
  a small v7.20.1 patch all existed — all three merged to `main` first,
  taking the version number (`7.20.0`), the phase number (18), and the
  line-band decision this phase had independently reached for itself (an
  amendment to 5,300). Collided on merge: renumbered to **Phase 20 /
  v7.21.0**, and the band question was reopened rather than assumed, because
  the answer on `main` had changed underneath it — see below.
- **The debt, deepened rather than paid — an explicit call, not a silent
  one.** Phase 18 had already landed `index.html` over the 5,000-line
  ceiling (5,043), the founder had explicitly scheduled Phase 19 to pay it
  down by splitting the map layer out (writing directly into
  `ARCHITECTURE.md` §1: "nothing new goes into `index.html` before the split
  does"), and one small v7.20.1 patch had already been let through as a
  named exception, landing at 5,049. This phase adds to `index.html` anyway,
  ahead of the split, landing it at **5,380 / 5,000** (bytes fine, 429.5/500
  KB). Put to the founder directly rather than decided alone — hold the
  branch until Phase 19 ships, or land now and deepen the debt further — the
  call was to land. Recorded here and in `ARCHITECTURE.md` §1 as what it is:
  a third, larger debt against the same still-unpaid ceiling, not a fresh
  amendment and not a precedent for a phase after this one to do the same
  without asking.
- Two stray in-code comments from Phase 17's same-day correction had called
  that work "Phase 18," written before either this phase or the real Phase
  18 existed — a different session fixed them independently on `main`
  (`Phase 17, corrected` / `its same-day correction is this`); this phase's
  own attempt at the same fix was dropped in favor of `main`'s wording so
  the file doesn't carry two different corrections of the same comment.

---

## 2026-08-21 — Phase 16 patch (v7.20.1): the box that vanished on success

- **Why.** Reported directly: place a café by pasting a Google or Apple Maps
  link, and there was no way to correct it afterward. Confirmed in
  `placeBranchHTML` — the "Placed" state showed only "not right?", which
  reruns the plain *name* search (`replaceCafe`). For a café placed by hand
  precisely because the name search couldn't find it, tapping "not right?"
  only fails the exact same way again — the paste-a-link box itself, present
  in both other states (ambiguous branches, unplaced), was the one thing
  missing from "placed".
- **Shipped — v7.20.1.** The map-link box is on the page in every state now,
  placed included — one line added, matching the pattern the other two
  states already followed rather than inventing a new one. `pastePlaceLink`
  needed no change at all: it already reads whatever `was` the place
  currently holds before overwriting it, so re-pasting a corrected link on
  an already-placed café undoes back to the *first* placement, not to
  nothing.
- **No new tripwire.** Same posture as every correction path here: the
  keeper vouching for a coordinate, with a cheap undo — this just makes an
  existing affordance reachable from a state it had quietly stopped
  appearing in.
- **Merged after Phase 18/19 were already recorded.** This patch was in
  review while Phase 18 landed and Phase 19 (the split) got written up, so
  bringing it in meant resolving against a `main` that had already moved —
  no logic collision (Phase 18 never touched `placeBranchHTML` or its
  neighbors), only the version ledger to reconcile: this patch renumbers to
  v7.20.1, above Phase 18's v7.20.0. It also adds six lines to `index.html`
  at a moment §1 says nothing new should, until Phase 19 splits the file.
  The founder's call, asked directly: let it through anyway, recorded as the
  one named exception rather than a quiet second overage — §1 carries the
  full account, at **5,049 / 5,000, 409 KB**.

---

## 2026-08-21 — Phase 18: the ground, and what grew on it

- **Why.** The founder, reading the Atlas on a phone: the map is unreadable at
  that size, a country you tap into has no definition, a region is a list
  rather than a place, and a farm is a name with nowhere to stand. Four asks in
  one sentence, and the second one — *topography, because elevation is key to
  coffee quality* — turned out to be half-built already.
- **The find that shaped the phase.** `LAND_TOPO` has been in the file since
  Phase 3: contours at 1,000 / 2,000 / 3,000 m for 48 countries, cut from the
  public-domain Terrarium model, and drawn by **nothing but the printed
  passport card**. The country half of this phase needed no new data at all,
  only a `topo="on"` on `carta-belt`. Decoded and measured before designing
  anything: 199 points for the whole of Colombia — honest at a country's own
  frame, a lie at a region's. That number is what sent region relief to tiles
  instead of to a second vendoring.
- **Shipped — v7.18.0.** The passport drawn at the size it is read at (one SVG
  unit = one CSS pixel; the old fixed 1,000-unit box rendered an 11 px country
  name at ~4 px on a phone, which was the whole "unreadable"). A country inked
  with its own highlands, its regions standing on the ground their farms were
  placed on, tappable. A region on real terrain — OpenTopoMap over the Leaflet
  layer that already ships — with a pin per placed farm, and the same on a
  farm's page. `origin.lat`/`lon`/`geocoded`: two more optional story fields,
  placed by a lookup or a pasted pin, taken back with undo. 4,934 lines /
  402 KB, 69 pure tests.
- **Two founder calls, both put before any code** — the line band and the
  terrain tile row (§7). Worth recording honestly: this phase was built
  against `main` at 4,716 lines and asked the band question itself; **Phase 17
  was in flight at the same time and asked the same question, and got the same
  answer.** Two sessions arriving independently at the same ceiling on the same
  afternoon. The amendment stands once, as Phase 17's.
- **The founder's call on the overage, made on the PR: land over, split next.**
  The alternative offered was splitting first and landing Phase 18 on top; the
  reason not to was that a change to the headline invariant deserves its own PR
  rather than riding in on a feature's. So the band is **overdrawn, not amended**
  — 5,000 is still the number — and **Phase 19 is now written into `ROADMAP.md`
  as the split**, seam and all: the real work there is deciding which file owns
  `LANDS`/`LAND_TOPO` and their decoders, not moving the lines. Nothing new goes
  into `index.html` before it lands.
- **And then it went over.** Phase 17 shipped twice in a day — the live
  thumbnail, then its same-day correction to a drawn city shape — leaving
  `main` at 4,824 rather than 4,774. Phase 18's 219 lines of ground land on
  top of that at **5,043 / 5,000**. Recorded in §1 as an **open debt, not a
  precedent**: under the rule both amendments already wrote, the next move is
  the split (`index.html` + `carta-map.js`, ~1,900 lines of map layer that are
  not the app), which is the founder's to schedule. Bytes are untroubled at
  407 of 500 KB — as they have been through all four amendments, which is the
  point the byte ceiling was always making.
- **Merge notes, two of them.** Phase 17's first draft and this phase both
  edited `carta-streets`; its correction then took the whole `thumb="on"`
  machinery back out. The merged class is pre-Phase-17 plus this phase's
  `terrain="on"`/`names="on"` — verified by hand, not trusted to the
  auto-merge. And `main`'s city-shape code comments called themselves
  "Phase 18" (its branch was named that) while its own roadmap and logbook
  call it Phase 17 corrected; those two comments are aligned to the record
  here, so the file doesn't claim two different Phase 18s.
- **Tripwire 2 fired and was obeyed.** Region-scale relief could have been had
  by vendoring finer contour data. It wasn't: the count is still two, and where
  the file can't draw real ground it asks for it and draws nothing when it
  can't. Also declined: a `regions` collection — a coordinate on a region means
  matching region names to nodes, which is the gentle join applied to an origin
  story field, and origin fields never join. A region is the mean of its placed
  farms, recomputed on read, stored nowhere.
- **The honesty gate.** Nominatim answers *something* for nearly any query, and
  for a farm it has never heard of that something is the region around it —
  which would have pinned every unknown farm on the same spot and called it
  confirmed, Phase 15's bug reborn one level down. `namesBack` requires the
  lookup to name the farm back; everything else stays listed and unplaced,
  which is most smallholder farms and is written as a fact about the map rather
  than a gap in the record. Pure, and tested.
- **Parked.** Tapping the terrain to drop a farm pin by hand (Phase 16 parked
  the same thing for cafés; it is one surface, and it should be one phase for
  both). A region's own altitude band read off the terrain rather than off what
  the bags stated.
- **For Lotmark's desk.** Farm-level geography is the clearest case yet for the
  published atlas §7 already names: OSM knows washing stations and cooperatives
  far better than it knows farms, and the gap is exactly the trade-side record
  Lotmark would hold. Carta will keep asking the keeper instead.

---

## 2026-08-21 — Phase 17, corrected same day: the shape, not the map

- **The founder's verdict on v7.18.0, read within the hour:** *"I don't love
  what shipped... a city should be drawn with a shape, and that's it — we
  don't need pins on the thumbnail and the leaflet map, it's too much."*
  Draft one had done exactly what it set out to do — a live map, gated
  carefully to OSM's own tile policy — and the verdict was that the goal
  itself was wrong, not the execution. Worth keeping in the record plainly:
  good engineering in service of the wrong shape is still the wrong shape.
- **Shipped — v7.19.0.** The Leaflet-thumbnail machinery came back out
  whole: the `thumb="on"` mode, its `IntersectionObserver`, its concurrency
  cap, its attribution workaround — all of it, and the `Streets` class
  reads exactly as it did before Phase 17 touched it. In its place: every
  café's own lat/lon inflated into a small round territory, the convex hull
  of all those territories together, corners softened into one continuous
  curve. One café, two close together, two far apart, a tight cluster, a
  dead-straight row, a whole spread city — one pipeline, no special case for
  any of them, because inflating before hulling is what turns even a single
  point into a real 2D shape. Rendered as a plain `<svg>` in the same soft
  ink-wash the passport and the export cards already use. No network, no
  custom element, nothing to gate or tear down, because nothing runs.
- **`convexHull` and `roundedHullPath` are pure and tested** (Andrew's
  monotone chain; quadratic-Bezier corner cuts capped so they never eat more
  of an edge than exists) — fixture cases: duplicates, an interior point,
  a dead-straight row, a single café, a full spread city, an empty city
  (refuses to draw anything, which is correct — no cafés, no shape). 66→71
  pure tests.
- **The line band stayed reopened.** The 3–5,000 amendment from draft one
  wasn't contingent on Leaflet specifically — it was made on the project's
  trajectory — so it stands even though draft two, at 4,824 lines, needed
  more lines than draft one's own 4,774, not fewer as might be assumed from
  "simpler." (Removing a whole class + adding real, tested geometry plus
  its coverage nets out slightly larger, not smaller — worth recording since
  it's counterintuitive.)
- **`ARCHITECTURE.md` §7 lost the row it gained that morning.** A citizenship
  note for a touch that no longer exists is worse than no note at all — it
  reads as a rule for something the file doesn't do. Removed rather than
  left stale.
- **The general shape of the lesson, worth keeping:** the tripwire screening
  this session ran on draft one (OSM tile policy, concurrency, attribution)
  was real and correctly done — and none of it was the actual question. The
  actual question was scale-appropriateness: does a 44×60px row want a map
  at all, however well-behaved. Checking that a thing is built responsibly
  is not the same check as whether it should be built that way in the first
  place, and this phase is the record of catching the second only after
  shipping the first.

---

## 2026-08-21 — Phase 17: the thumbnail, alive when it's actually looked at

- **Why.** Asked directly: the city thumbnails on the Atlas showed bare pins
  in an empty box, never a shape. True by construction — `<carta-plot>` is
  documented as deliberately tile-less, and `plotThumbHTML` had simply never
  been wired to the street layer at all; every full-size map view already
  had it, thumbnails never did.
- **Checked before writing code.** Fetched OpenStreetMap's actual tile usage
  policy rather than work from memory. No hard rate number, but explicit
  language that "capacity is limited," usage that "degrades the service" can
  be blocked without notice, and tiles are for "the current viewport" a
  person is actually looking at — bulk/pre-seeded fetching is barred outright.
  That framing shaped the whole design: attention-gated, not presence-gated.
- **Shipped — v7.18.0.** `<carta-streets>` gains `thumb="on"`. A single
  shared `IntersectionObserver` (one instance for every thumbnail on the
  page, not one per row) boots Leaflet only once a row is actually on
  screen, and tears it down the moment it scrolls off — verified in the
  browser: max 6 concurrent live maps holding through a full scroll of ten
  cities (the cap), zero left live once scrolled away. A thumbnail that
  fails degrades in total silence; the "Streets unavailable · Retry" note
  is sized for a screen and has no home at 44×60px — the drawn plot
  underneath is already enough there.
- **Two real bugs the browser test caught, not the design.** (1) The
  element painted an opaque background the instant it mounted, hiding the
  drawn plot underneath for however long it took to scroll into view —
  fixed by deferring the background paint to `boot()` itself. (2) Once a
  thumbnail booted and later scrolled away, the background stayed opaque
  forever even after the live map tore down, permanently hiding the plot —
  fixed by clearing it on teardown. (3) Leaflet's attribution control,
  rendered at 44×60px, came out as illegible clipped text
  ("eaflet | © nStreetMap tributors") — disabled for thumbnails; the same
  city's own full map, one tap away via the same row, already carries it
  properly.
- **`unpkg.com` is unreachable at all from this session's sandbox** (a
  proxy-level connection reset, unrelated to the app). Verified the mount/
  cap/teardown logic by serving a locally vendored copy of the exact same
  Leaflet 1.9.4 release in place of the network fetch — proves the logic,
  not reachability to unpkg, which this phase didn't touch.
- **The line band, reopened rather than quietly bumped.** `main` stood at
  4,716/4,800 — 84 lines of headroom. Both of the prior two amendments
  (Phase 14, Phase 15) had explicitly named 5,000 as the number past which
  "raise the band again" stops being honest and "the one-file law has come
  due" starts being it. Asked the founder directly rather than deciding it
  myself; **amend to 5,000 now** was the answer. Recorded in
  `ARCHITECTURE.md` §1 as a reopened decision, per `ROADMAP.md`'s own rule
  that a decided thing stays decided until deliberately reopened — not a
  fourth routine bump. Landed at 4,774/5,000, byte ceiling untouched at
  388/500 KB.
- **No other tripwire.** Same Nominatim-adjacent posture extended to tiles:
  recorded as a new row in §7 rather than folded silently into the existing
  one, since it's a genuinely new class of touch (a live map inside a
  scrolling list, not a single open screen).

---

## 2026-08-21 — Phase 16: the pin, in your own hand

- **Why.** The founder asked how to bridge the gap between OSM and the
  commercial map providers — Google/Apple have a café that OpenStreetMap's
  search hasn't caught up to yet. Researched before writing a line: Google's
  Places API allows a `place_id` cached forever but restricts coordinates to
  a 30-day cache and forbids storing an address without a live re-fetch;
  Foursquare's free tier carries the same shape (500 calls/month as of June
  2026). Both are wrong for a ledger that keeps a confirmed position forever,
  offline — adopting either would mean quietly breaking their terms or
  trading offline-first for a paid re-fetch on every render. **Declined**,
  before any code, on that finding.
- **Shipped — v7.17.0.** The same keyless Nominatim door, asked the other
  way: not "where is this name" (search, which can miss a new business) but
  "what's at this coordinate" (reverse, which almost never does, since
  streets are mapped far more completely than shops). Where a search has
  nothing to offer — unplaced, or none of the offered branches is real —
  Carta now reads a pasted map link. `parseMapLink` is pure and tested
  against the actual URL shapes Google, Apple and OSM produce, including
  preferring a Google Maps place URL's real `!3d…!4d…` marker over its
  `@lat,lon` viewport center, which drifts once you've panned. `reverseGeocode`
  fills the neighborhood and city the same way a forward search already does;
  `settlePlace` needed no change, since a reverse hit is the same shape as a
  forward one.
- **Overture Maps, parked for Lotmark.** The one place-data source actually
  license-compatible with "store it forever" (CDLA Permissive 2.0, no caching
  restriction) — but it's a bulk dataset, not a live API, and standing up a
  query service is a server, which isn't Carta's to build. It's a plausible
  source for the "published atlas" `ARCHITECTURE.md` §7 already names as
  Lotmark's future interchange. Logged for that desk.
- **No tripwire, no amendment.** Same Nominatim touch asked differently — a
  refinement to §7's existing row, not a new one. Not a resolver: a pasted
  coordinate is the keeper vouching for a position, at least as trustworthy
  as typing an address, since it's copied from a map that already confirmed
  the place exists. Budgeted ~90 lines against ~157 free; landed inside
  4,800 without touching the band.
- **Explicitly not in it:** map-tap/drag-pin UI (real surface for a small
  phase); storing the raw pasted text (only the parsed coordinate survives);
  following a shortened share link's redirect (a network request this phase
  never asked for — Carta says so instead of guessing). This door doesn't
  touch the ask's own grounding, which still only confirms via its own
  forward search.

---

## 2026-08-21 — Phase 15 patch (v7.16.1): the city, one field over

- **Why.** Phase 15 fixed a mis-pinned café; it left the same bug standing in
  the field next to it. A café first added by pasting a street address into
  the City field (rather than a real city) stayed filed under that address
  forever, because `settlePlace` only ever corrected `lat`/`lon`/
  `neighborhood` — never `city` — and the Atlas groups everything by
  whatever `p.city` literally holds.
- **Shipped — v7.16.1.** The confirmed lookup that places the pin now
  corrects `city` too, the same way it already corrects `neighborhood`:
  silent where a single match settles quietly, named in the toast only where
  it actually changed something (so the common case — the city was already
  right — stays quiet). `cityOf` is `hoodOf`'s twin, reading `city`/`town`/
  `village`; a rural hit with only a county leaves the field alone rather
  than guessing one level too coarse. `dedupeHits` now keys on city as well
  as neighborhood, since a garbage-city query can genuinely pull candidates
  from more than one real city.
- **One regression caught before shipping, not after.** Correcting `city`
  live means a keeper standing on the very chapter they opened — still
  titled the garbage address — would watch its one café quietly vanish from
  the list as it renamed itself away underneath them. Testing the fix
  end-to-end (not just the pure functions) is what surfaced this; the
  chapter now follows the correction to the real city instead of leaving a
  stale title over an empty list.
- **No new tripwire.** Same posture as Phase 15 proper: a confirmed fact
  correcting one field on one record, not a merge between two.

---
## 2026-08-21 — Phase 15: the pin, corrected

- **Why.** The founder noticed hand-typed cafés were mis-pinned and proposed
  letting the ask reconcile the corpus while it was already spending tokens.
  Reading the code found a worse bug than the one reported: `geocodeCafe`
  asked Nominatim for `limit=1`, so a café with several branches in one city
  got whichever the lookup ranked first — and `p.geocoded` was stamped
  whether or not it worked, never retried, with no surface in the app that
  could edit a pin. **A wrong pin was permanent and silent.** Meanwhile
  `places` already had a `neighborhood` field, already displayed on the café
  page and in list rows, that only the classic importer ever filled.
- **Shipped — v7.16.0.** The same one call now asks for five results with
  `addressdetails`. One match → placed silently, keeping the neighborhood it
  was found in. Several → **Carta does not choose**: the branches are held on
  the record and the café asks once, with the real neighborhoods as chips,
  one tap and an undo. Any café can be looked up again. `hoodOf` and
  `dedupeHits` are pure and tested against the verbatim addresses Nominatim
  returns for "Blue Bottle Coffee, Los Angeles" — OSM files the area under
  four inconsistent keys at inconsistent grain, so the council-district
  wording is trimmed and the finer name wins (Arts District, not Downtown).
- **The proposal, half declined, and why it's the interesting half.** Most of
  it needed no model: the lookup already knew the branches and Carta was
  throwing them away. The rest of it *couldn't* work — **the model knows which
  branches exist, not which one the keeper sat in.** A model guess rendered as
  a pin is Carta pinning a hallucination, which is the one thing the ask was
  built not to do. So the question goes to the only party holding the answer.
  Worth keeping as a general shape: *when a feature wants inference, first ask
  whether the datum is missing or merely discarded.* Here it was discarded.
- **Tripwires, named out loud before building.** Auto-reconcile as proposed is
  a silent merge, against the stated *"the gentle join offers, never merges"*;
  it ships as an offer with a cheap undo, the same posture a name join has.
  Not a resolver: nothing adjudicates whether two records are the same café —
  it fills one empty field on one record from a confirmed lookup.
- **The band moved, on schedule.** §1 amended 3–4,500 → **3–4,800**, at
  4,601 lines / 376 KB. Phase 14 predicted this exactly: it declined the
  amendment it had been given, stopped fourteen lines short, and wrote down
  that the next surface of any size would have to make the argument. §1 now
  also says 4,800 is a ceiling, not an allowance, and that a phase needing
  5,000 means the one-file law has come due rather than the band — which is
  two hundred lines away and should be a real question at Phase 16.
- **Parked, not refused:** the ask's ride-along, for the cafés a lookup cannot
  find at all, plus canonical naming ("ondo" → "Ondo Coffee Co"). Revisit with
  evidence of how many those actually are, the way Phase 14 was tuned rather
  than imagined.
- **For Lotmark's desk:** nothing new. This deliberately stopped short of the
  café-graph question — which branch is which across keepers — because that
  is a resolver and it is theirs.

---

## 2026-08-21 — Phase 14: the ask, tuned on a real ask

- **Why, and what the citation actually was.** Phase 14 was written to be
  built last, off real ask history rather than imagination. The evidence
  turned up in a form §0 didn't predict: the founder's working method was
  *leaving the app* — pasting `briefPlainText` into a chat with a frontier
  model, because what came back was better than what the ask returned. The
  transcript of one such ask, set beside the ask's own output, is the
  citation. One prompt, one answer — so every difference between them was a
  difference in what had been asked for, not in conversation.
- **The four gaps, in the order they mattered.** (1) The model: Haiku 4.5 at
  `max_tokens: 1024` — a small model, a thin prompt, a fifth of the room the
  answer needed. Generic in, generic out. (2) The shape: one free-text `why`
  per café, which is one generic sentence by construction. (3) The scope: the
  real ask started from a centroid ("Huntington Park") and Carta had no such
  kind, and no way to say how far the keeper would go. (4) The screen: one
  flat row with nowhere to put a verdict, an evidence line, or a plan.
- **Shipped — v7.15.0.** `claude-opus-5` at 8,000 tokens by default, the
  `askModel` pref untouched so it's one field back to Haiku. The answer is
  four parts: how the ground lies, the cafés **ranked with what each is best
  FOR**, the places that are close but **aren't** the pick and why, and what
  Carta would actually do — the strongest move, plus the order to walk them
  in depending on what you're after, plus one wildcard outside the ranking.
  Each finding carries the figures off your own brief it was argued from and
  what to ask for at the counter. Two new scope controls: **near a point**,
  and **how far you'll go**.
- **The founder's own correction, and it changed the build.** The first read
  of the transcript treated its prose as the target. It isn't: *"this should
  be intelligent suggestion similar to ChatGPT, but in Carta's native design
  language in the chips. It doesn't need to be a lot of free text."* So the
  judgement is the model's and the register is Carta's — a verdict is a chip,
  not a paragraph, every text field is capped to one sentence in the prompt
  *and* trimmed in the parse, and length is the failure mode rather than the
  goal. Prose was the thing being replaced, not added.
- **What it refused: search.** The transcript's most vivid lines were live
  menu reads ("actively selling a Tropical Co-ferment from Finca
  Monteblanco"). Carta makes no search, so asking for that shape would have
  been asking for invention. Declined deliberately — `ARCHITECTURE.md` §7's
  table gained **no** row. The prompt asks for what keeps (a program, a
  posture, what to ask for) and makes the model mark any fit that depends on
  a menu that turns over; the row then reads *program rotates*. If search is
  ever wanted it is a row in that table first, not a flag in the request.
- **The band held, which is worth recording.** Budgeted at ~4,510 lines
  against §1's 4,500, and an amendment to 4,800 was approved in advance.
  It landed at **4,486** and the amendment was not taken. §1 says a ceiling
  is not an allowance; this is the first phase to approach one and stop.
- **One design call, made twice.** The plan had each finding's evidence
  rendered as `.fig` — the dotted-underlined figure that taps through to the
  cups it was read from. First pass said no: a `fit` string is written by the
  model, so there are no cups behind it, and a tap that goes nowhere is a
  fabricated affordance. That was right about the affordance and wrong about
  the string. **The brief is built from the taste model's own values**, so a
  `fit` string is an *echo* of one — `matchFigure(text, tm)` resolves it back
  to the item it came from, and only a figure that resolves becomes a door.
  It lands on the same `evidenceSheet` *Your taste* opens, with the same real
  cups. What doesn't resolve stays flat grey, and the difference is legible
  without being explained: a door is inked.
- **And the resolver turned out to be the honesty gate on the return leg.** A
  figure the record cannot produce — the model writing "your love of
  Guatemalan naturals" over a record with no Guatemala in it — simply never
  becomes a door, whatever was claimed. Carta doesn't argue with the model or
  flag it in red; it just doesn't open. `matchFigure` is pure and tested,
  matched on whole folded words, longest match winning, so "Anaerobic washed"
  is never flattened to "Washed" and "tea" is never found inside "cleaner".
- **Tripwires screened.** The rank is the model's own order, plain ink, never
  the ember — the ember is a score *you* gave a cup and nothing here has been
  drunk. No resolver, no rung, no gate, no streak. Every ask already on the
  record still opens: every Phase 14 field is optional and the screen draws a
  part only where one was filled.
- **Parked, not absorbed:** a follow-up round on a result ("closer", "less
  experimental", "what would you order") — the transcript turned out to be
  one-shot, so the case for conversation isn't made yet and the closing
  carries the conditional routes instead. Revisit when a real ask wants it.

---

## 2026-08-20 — Phase 13: the rest of the app

- **Why:** Phase 12 shipped the redesign, but the prototype it was drawn
  from only ever covered nine surfaces — Today, the Atlas, a lot, a roaster,
  a café, the cup log, the brew, the shelf, the record, the welcome. The
  shipped app has more than that, and everything the prototype missed was
  still speaking in the register the redesign had just replaced: the country
  chapter was a shape with a flat list under it, taste drew meters, and the
  brief, the ask, the menu and the record were sheets. The founder took the
  same commission back to Claude Design for the remainder; this is that
  handoff, built.
- **Shipped — v7.14.0, fourteen surfaces.** The **country** states how far
  the record follows its ground as six stations, dashed across the gaps,
  then opens downward into regions, growers, roasters and pours. **A region**
  and **a producer** are new pages, walked down to from the country and up
  from any coffee. **Taste** dropped its meters for prose whose every figure
  opens the cups it was read from. **The brief** became a screen that names
  its four parts before showing a character of raw text; **the ask** states
  its key and its degrade before the button; **what Carta found** is its own
  page on its own streets. **The menu** is one screen at the counter rather
  than two sheets that never met. **Your record** got a page — the ledger,
  the backup, what reads in, what sends out, the instrument, classic — and
  **a Setup** keeps the grind history that is only true on it. The city's
  sheet gained a third detent.
- **Decision, made the same way it was made last time:** this took Phase 13,
  and the scout-tuning phase moved to **Phase 14**. It is the second time
  that phase has been displaced by this commission, which is worth saying
  plainly rather than renumbering quietly: the route bends toward what is
  actually ready, and scout was always gated on ask history existing, which
  it still is. Nothing was dropped.
- **The one law that moved, and this time in the same PR as the code:** §1's
  line band, **3–4,000 → 3–4,500**. The file is 4,287 lines / 355 KB. The
  argument is written into §1 rather than assumed: the byte ceiling is the
  one that guards the drop-it-on-a-static-host promise, it has never moved,
  and the file sits at 71% of it; fourteen surfaces at ~60 lines each is what
  the house style costs, and compressing them to hold a round number would
  serve the letter of "a file one person can read whole" against its point.
  4,500 is a ceiling, not an allowance — and a phase that ever needs 5,000
  should read that as the one-file law coming due, not the band.
- **A field that was specified and never built:** `origin.altitude` has been
  in `ARCHITECTURE.md` §4 since the turn began and appeared in exactly zero
  places in `index.html`. It has a field now, and the region's altitude band
  is drawn from it — only where a bag actually states a height, never read
  across from a neighbouring lot. `origin.mill` is genuinely new, and is what
  the road's Milled station reads: hollow until a bag names one, which is the
  point that station makes.
- **Verified:** `node test/model.test.js` 49/49 — the pure block was not
  touched, but the brief's callers were, so it was run rather than assumed.
  Beyond it, every screen and sheet loaded in Chromium in **both themes,
  offline**, plus the same walk against an **empty ledger**, because a
  chapter that reads its own counts is exactly the kind of surface that
  divides by zero in an honest-looking way. Two things that pass fell out of
  it: the record ledger was printing `unread` for counts that were simply
  zero, and a café cup's Roasted line was stating the coffee's rest window
  *today* rather than how long it had rested when that cup was poured — a
  true number answering the wrong question.
- **Next:** Phase 14 — the scout, tuned on real asks, whenever there is
  enough ask history to tune against.
- **Parked (compliments, not scope):** region and producer rows would carry
  real map thumbnails if the record held coordinates for either; it holds
  free text, so the rows carry names and figures instead and no mark is
  invented. A brief scoped to *everywhere* still can't send an "already had"
  list without blowing its own character budget — the page says so rather
  than printing a count it wouldn't actually carry.
- **For Lotmark's desk:** the producer page is the closest Carta 7 has come
  to a constituent's own page, and it stays on the right side of the line
  only because it is compiled from your own bags and says so. The moment it
  wants to reconcile two keepers' facts about one farm — a merge law, a
  precedence rule, an evidence gate — that is the third-turn relapse
  tripwire, and it is Lotmark's.

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
