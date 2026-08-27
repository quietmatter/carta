# CARTA 7 — the technical architecture

*The fourth turn's build, specified. `PIVOT.md` argued the what;
`ROADMAP.md` orders the when; this is the how. It was written to be enough
to start Phase 1 from this document and the classic file alone, and it is
kept current as the phases land — read through Phase 12. Where a section
describes what was planned and what was built, it says both; the plan is
part of the record.*

## 1. The stack laws (unchanged, and why)

Carta 7 is built exactly the way classic was, smaller:

- **Five files, not one — two since Phase 19, three since v7.31.0, five since v7.34.0.**
  `index.html`, all CSS and JS
  inline, self-contained, was the whole app through Phase 20. Target
  **3–5,000 lines / ≤ 500 KB** for it — a file one person can read whole.
  (Classic reached 12,480 lines; the size was the third turn's cost, not the
  stack's.) Phase 20 landed it at **5,380 lines / 429.5 KB — 380 over the
  ceiling**, an acknowledged debt against that ceiling (the run of amendments
  and overages is kept below as the record of how it got there). **Phase 19
  paid that debt down**, moving the map layer out into its own file,
  `carta-map.js`, loaded from `index.html`'s own `<head>` with a plain
  `<script src>` — no bundler, no build, still files you drop on a static
  host. `index.html` stood at **4,854 lines / 321.5 KB** after that split,
  comfortably inside the band with real room again; `carta-map.js` holds the
  map layer proper at **535 lines / 108.4 KB**. Combined, the app was the
  same size it was — the debt was paid by moving lines, not cutting them.
  **`carta-plate.js` is the third**, added at v7.31.0 for the same reason and
  by the same mechanism; the argument for it is at the foot of this section.

  *The line band's history: 3–4,000 through Phase 12, 3–4,500 through
  Phase 14, 3–4,800 through Phase 16, and amended here, at Phase 17, to
  **3–5,000**.* Each of the first three amendments was made with an argument
  written in at the time, the way this one is. What makes this one different
  is that both of the prior two named 5,000 specifically, and named it the
  same way: not as a number to negotiate but as the point past which "raise
  the band again" stops being the honest answer, and "the one-file law itself
  has come due" starts being it. Phase 17 reaches that number.

  **This is a reopened decision, not a fourth routine bump — recorded as one
  on purpose** (`ROADMAP.md`'s own rule: a decided thing stays decided until
  it is deliberately reopened, and reopening it is a logbook entry, not a
  mood). The founder chose to amend rather than split the phase or trim
  the file first, with the 5,000-line reading in front of them, not around
  it. The byte ceiling is the one that was never touched across all four
  amendments and is the one that actually guards the drop-it-on-a-static-host
  promise — still **500 KB**, with the file at 392 KB. If a future phase
  needs to go past 5,000 in turn, it does not get to treat this crossing as
  precedent for a fifth quiet one; it re-earns the argument from here, same
  as every phase before it had to.

  **That re-earning is now overdue, and this is the entry that says so.**
  `index.html` stands at **5,891 lines / 404 KB** after Phase 30 (v7.37.0,
  the front door). It entered that phase already at **5,584** — Phases 21–29
  carried it past 5,000 without any of them stopping to make the argument
  the paragraph above demanded, which is precisely the "fifth quiet one" it
  was written to forbid. Phase 30 added 307 more and is recorded here rather
  than quietly too. **The byte ceiling is untouched and comfortable at 404 of
  500 KB**, which is why nothing about the static-host promise is at risk and
  why this is a debt rather than an emergency.

  The band is therefore **overdrawn by 891 lines and deliberately not amended
  a fifth time.** Phase 17 named 5,000 as the number past which *the one-file
  law itself, not the band*, is what has come due; two phases before it named
  the same number. Three amendments pointing at one line and a further nine
  hundred lines walked past it is the argument making itself. The move when
  it is taken is a split, on Phase 19's own proven seam — a fifth sibling
  loaded from the `<head>` with a `?v=` tag, published through `window`
  globals — and the obvious cut is the room-sized views (`vJournal`,
  `vShelf`, `vRecord` and the screens under them), which touch the ledger and
  the DOM but nothing in the pure block. **That is a phase of its own and it
  is the founder's call to schedule, not a coding agent's to take mid-task.**

  **Phase 31 adds 209 lines to a band already 891 over, and does not amend
  it a fifth time either.** `index.html` stands at **6,100 lines / 422 KB**
  after v7.38.0 (the ask at the front door): the two new door helpers
  (`unreadAnswer`, `markAnswerRead`, `setAsideAnswer`, `doorAnswerLeafHTML`,
  `answerPinsJSON`), the rung's own wiring in `vAtlas`, the CSS for the two
  new rooms, and the `load()` back-fill. The byte ceiling is still the one
  that guards the promise and it is still comfortable at **422 of 500 KB**.
  The remedy named above — the fifth sibling, cut at the room-sized views —
  is unchanged, still the founder's call to schedule, and this phase is one
  more entry in the argument for scheduling it rather than a reason to take
  it mid-task. Recorded here rather than quietly, which is the whole of what
  this paragraph is for.

  Phase 17 itself shipped twice in one sitting, and both drafts are worth
  recording. The first spent its lines on tile-server citizenship — a live
  Leaflet map, gated to boot only while a thumbnail was actually on screen —
  for the one offline-first surface that never had it. It worked, and it
  still wasn't right: a moving map with individually tappable pins is more
  than a 44×60px row can read, whatever discipline governs how it's fetched.
  The correction dropped the live map and the network touch entirely — a
  city's thumbnail is a single soft shape now (§7), computed once from the
  same lat/lon already on the ledger, no fetch of any kind. It reads as the
  first draft's replacement, not a second amendment; the line count above is
  the corrected version's, and §7's geocode table no longer carries a
  thumbnail row, because there is nothing left there to be a citizen of.

  **Phase 18 is the first phase to land over the ceiling, and it says so
  rather than quietly sitting there.** It merges into a `main` that Phase 17's
  correction left at 4,824 and adds 219 lines of ground — contours, region
  marks, farm positions and the terrain surface — landing at **5,043 / 5,000**.
  The byte ceiling is untouched and comfortable, at 407 of 500 KB.

  Under the rule written directly above, that is not a fifth amendment to ask
  for: **it is the split coming due.** `index.html` + `carta-map.js` — the
  three custom elements, the vendored d3, `LANDS` and `LAND_TOPO`: roughly
  1,900 lines that are the map layer rather than the app. Two static files is
  still no build, no bundler, no npm, and still something you drop on a host;
  it is only no longer *one file*, which is a brand cost to pay in the open.
  Both of the last two amendments named 5,000 as the number where the
  one-file law comes due, and two independent sessions reached it on the same
  afternoon. **This overage is recorded here as an open debt, not a
  precedent**, and the line above states the true figure rather than a
  comfortable one.

  **The founder's call, made on this PR: land Phase 18 over the ceiling, and
  make the split its own next phase** — the alternative offered was splitting
  first and landing on top, and the reason not to was that the split is a
  change to the headline invariant and deserves its own PR rather than riding
  in on a feature's. So **Phase 19 is the split**, and it is written into
  `ROADMAP.md` as such rather than left to be rediscovered. Until it lands the
  band is *overdrawn, not amended*: 5,000 is still the number, 5,043 is still
  a debt against it, and **nothing new goes into `index.html` before the split
  does.** A phase that adds to this file in the meantime is not spending
  headroom — there is none — it is deepening a debt the project has already
  agreed to pay.

  **One exception was made, in the open, before the split landed.** A small
  fix (a missing correction box on an already-placed café, six lines) came due
  for merge the same week the rule above was written. Holding it would have
  meant a keeper living with a known bug until Phase 19 shipped, for a fix
  with nothing to do with the map layer the split is extracting. The founder's
  call: let it through, and say so here rather than let a quiet six lines look
  like a second precedent. That is what moved the count from 5,043 to
  **5,049 / 409 KB**. The rule stands for everything else — this is the one
  named exception, not a reopening of it.

  **Phase 20 landed anyway, before Phase 19 did — the debt deepened again, by
  an explicit call, not an accident.** It merged into this same rule,
  mid-flight: the ask redesign (a new front-door composer, a narrated wait
  screen, a settle-in animation) was already built against the pre-Phase-18
  file when Phase 18, this rule, and the patch above all landed on `main`
  first. Put to the founder directly rather than assumed — land the feature
  anyway, deepening the debt Phase 19 exists to pay, or hold it until the
  split ships — the call was to land it. `index.html` is now **5,380 lines
  against the still-unmoved 5,000**, up from 5,049; bytes remain comfortable
  at 429.5 of 500 KB. This is not a precedent for a phase after it to add
  more on the same reasoning — the rule stands exactly as Phase 18 wrote it,
  and Phase 19 is still the fix. What changed, twice now, is only that the
  debt it will pay is larger than when it was scheduled.

  **Phase 19 shipped, paying the debt down exactly as scheduled.** The three
  custom elements (`<carta-belt>`, `<carta-plot>`, `<carta-streets>`), the
  vendored `d3-array` + `d3-geo`, and the ground data (`LANDS`, `LAND_TOPO`,
  `LAND_AKA`) with its decoders (`landRingsRaw`, `landTopoRaw`, `landKey`,
  `landAnchor`) all moved into `carta-map.js` — the shape this section named
  in advance, unchanged. The one real design question was the seam: the app's
  own `passportSVG`, `tastedCountryMap`, `landKey` callers and the country/
  region/city chapters all read `LANDS` and the decoders as plain globals,
  the same way `CARTA_LAND_NAMES` already flows the other way (`carta-map.js`
  reads it off `window`, guarded, since it's ledger-derived and stays app-side).
  `carta-map.js` publishes its handful — `LANDS`, `landRingsRaw`,
  `landTopoRaw`, `landKey`, `landAnchor` — on `window` explicitly, as this
  section anticipated, even though classic scripts sharing one page already
  share a global scope; the explicit publish documents the seam rather than
  relying on that alone. Nothing else changed: no rewrite, no rename, no
  restyle — the diff is a move plus that seam, verified by loading the
  passport, a tasted country's contours and a city's drawn shape in both
  paper and dusk, and by the pure harness (still 74/74, sliced out of
  `index.html` exactly as before, since none of the tested functions lived in
  the moved region). `index.html` is back inside the band, per the figures
  above — the debt this section tracked since Phase 18 is closed.

  **Phase 29 widened the seam, deliberately and once.** The map spec's five
  shipped phases put three more kinds of thing behind it: two data tables
  (`CITY_RINGS`, `CITY_ARCS` — the city coastline at 0.005°, read by the
  belt's own decoder given a divisor), the window geometry the plate is drawn
  from (`cityWindow`, `ringsInWindow`, `arcsInWindow`, `plateGround`), and two
  small rules the app must not re-derive on its own (`sealBands`, the width
  ladder; `LAND_OFF_BELT`, the entries the belt carries for a café rather than
  for coffee). All of it publishes on `window` the same way, and all of it is
  geometry — no `D`, no `document`, no ledger. The ink stays in `index.html`,
  where `sealHTML` and `cityPlate` are the only two callers: the split is
  *what the ground is* on one side of the seam and *how it is drawn* on the
  other, which is why the plate can change its mind about a disc's width
  without the map layer knowing.

  **Phase 30 added a second element and a second ground table to the same
  file, on the same seam.** `<carta-atlas>` is the passport drawn as a plate —
  the graticule, the band between the tropics stated and labelled, leader
  rules, edge ticks — and it is a sibling to `<carta-belt>` rather than a file
  of its own **because it shares everything**: `LANDS`, `landRingsRaw`,
  `buildWorld`, `BELT_SET`, the vendored projection. A sixth static file would
  also have meant a sixth `?v=` query string to keep in step with
  `APP_VERSION`, which is the v7.31.1 failure and is not a shape worth
  re-earning for a component that needed none of it.

  Beside it, **`WORLD`** — the rest of Natural Earth 1:110m, 112 countries in
  11.7 KB, cut through the same simplifier and the same varint at the same
  twentieth of a degree, read by `worldRingsRaw` (`landPts`'s own decoder,
  given the same divisor). It is the palest tier behind the belt: context,
  unnamed, never tappable, and it exists because without it the plate read as
  a map with pieces missing rather than as a chart of the belt. **It is
  encoded, not fetched** — the design board fetched `countries.geo.json`, and
  that was right for a board and wrong for the app, which asks for nothing at
  all. Its filter runs at encode time against the LANDS keys, so no country is
  ever drawn in both tiers; two of Natural Earth's spellings ("East Timor" for
  `timor leste`, "Republic of the Congo" for `congo`) are easy to point the
  wrong way and draw twice.

  One thing about `<carta-atlas>` is not incidental and is written into the
  source: **it waits on the exports block before its first paint.** `LANDS`
  and `WORLD` are declared *below* the element IIFE, so an element upgraded at
  `define()` time reaches them in the temporal dead zone and throws.
  `<carta-belt>` hits the identical wall and survives only because its
  `paint()` swallows the throw and recovers on a later ResizeObserver pass —
  which works, and is why nobody noticed, but leaves the first frame blank.

  **`<carta-atlas>` did not, at first, carry `<carta-belt>`'s tap.** Sharing
  geometry does not share behaviour: a tasted country here drew with the same
  ink but no `g.mk`/`data-name`/click-listener behind it, so tapping it did
  nothing — a real regression against the rest of the app, where a tasted
  country has opened its chapter since Phase 3. Fixed at v7.37.3 the same way
  `<carta-belt>` does it, with one addition `<carta-belt>` doesn't need:
  `PLATES[ck]`'s cache-hit path replaces the DOM via `host.innerHTML` exactly
  as the cache-miss path does, so the tap has to be rewired on *every*
  assignment to it, not only the one that first built the cached string — a
  listener bound during that first paint is gone once a later plate reuses
  the cached markup.

  **`carta-map.js` gained a pure block at the same phase, and the harness
  gained a fifth file.** Everything from `LAND_A` to `LAND_OFF_BELT` sits
  inside `/* ==== pure ==== */` markers now, so `test/model.test.js` slices
  it first — the browser's own `<head>` order — and every "done when" clause
  in the map spec is a real assertion rather than a sentiment: strings
  round-trip through `landPts` to the counts they were written from, every
  drawn ring's bbox is inside its window, and a city key is only shipped if
  the record's own cafés still land on land under it. The one function the
  block does not own is `landAt`, which stays in `index.html` beside the
  callers that read the whole belt through it.

  **Phase 24 is the first small re-crossing since that debt closed.** The
  Visualizer picker (settings sheet, `callVisualizer`, `parseVisualizerShot`,
  `openVisualizerPicker`) added real lines, and a genuine bug was fixed in
  the same pass — a dead, fully-shadowed `openBrewFlow` from before Phase 13
  moved the brew flow into its own screen, still sitting in the file and
  silently overwritten by the real one, deleted on sight (42 lines, no
  behavior change: nothing could have called the dead one). Comments and
  code were tightened on the way in rather than left at their first draft's
  length. `index.html` still lands at **5,012 lines / 333.9 KB** — 12 over
  the line ceiling, bytes comfortable. Recorded here rather than silently
  crossed, per this section's own rule, and named for what it is: twelve
  lines, not the kind of debt Phase 18 or 20 left — a further trim was
  possible only by cutting into the feature itself or fighting the file's
  own established density, and twelve lines wasn't judged worth either.

  **Phase 25 crossed further, on real new surface, not a patch.** The
  door's own gentle-join for a pulled shot's roaster and coffee, its Setup
  resolution, and a shot-fetching helper now shared by both pickers all
  landed at once — a new entry path with its own matching logic, not one
  button on an existing screen. Two near-identical join sheets (roaster,
  coffee) were folded into one before this was accepted, the same
  discipline Phase 24 used, and comments were kept to what the WHY actually
  needed. `index.html` now stands at **5,141 lines / 341.0 KB** — 141 over
  the line ceiling, bytes still comfortable at 341.0 of 500 KB. Named
  plainly rather than minimized: this is a real overage, larger than Phase
  24's, and it is the founder's to decide whether a future phase should
  give it its own split the way Phase 19 did for Phase 18 and 20's debt, or
  whether the band itself is due another look — not a call made silently
  here.

  **Phase 26 crossed further still, and the founder's call was to land it
  inline rather than open a third file for it.** The plate — `platePaths`,
  `shotFigures`, `shotCurve`, `shotAt` (pure geometry over a shot's curve
  arrays, no `D`, no DOM) plus their string-templating callers `plateSVG`/
  `figsHTML` — was the named candidate to move into `carta-map.js`, the way
  the map layer itself moved at Phase 19. It did not move: the design
  handoff this phase built from carried only `index.html`, so there was no
  `carta-map.js` to append to and no way to verify the seam without one.
  Put to the founder directly rather than assumed, the call was to land
  inline, record the overage, and leave the ~135-line candidate named for
  whichever phase next touches `carta-map.js` to actually move it.
  `index.html` now stands at **5,800 lines / 383.4 KB** — 800 over the
  line ceiling, up from Phase 25's 141; bytes remain comfortable at 383.4
  of 500 KB, the ceiling that has never moved and the one that actually
  guards the drop-it-on-a-static-host promise. This is not a seventh
  amendment — the same rule Phase 18 wrote still stands — and it is a
  larger open debt than any phase has carried since Phase 19 closed the
  first one, named here rather than minimized.

  **The v7.30.0 QC pass against the Phase 26 design board took it to
  5,983 / 5,000 (400 KB of 500).** It is a patch, not a phase, and it did
  not go looking for room: the ~180 lines are the `.chk` control, the
  `.reading` block on the cup page, the widened coffee match with its
  join card, the resume check, and `shotTempGoal`. **The debt was then the
  single largest the project had carried**, and the plate was still the
  named candidate to move.

  **v7.31.0 made that move, and it is the third file.** Phase 26's second
  method (`SPEC-phase26-pourover.md` §8) forced the gate: *"Two plate arms
  rather than one deepens the estimate. The plate renderer moving out stops
  being the honest candidate and becomes the decision: make it at the phase
  gate, before the second arm is written."* Put to the founder with the
  three options priced, the call was **a new file rather than an append to
  `carta-map.js`** — a plate is not a map, and a file whose own name stops
  being true is the exact failure this document exists to prevent.

  So `carta-plate.js` now holds `shotCurve`, `shotPours`, `shotFigures`,
  `shotMethod`, `platePaths`, `shotAt`, `shotPhase` and `mmss` (all pure)
  plus `plateSVG`, `figsHTML`, `plateBoxHTML`, `scrubReadHTML` and
  `plateScrub` — **both** arms, espresso and pour-over. `index.html` came
  back to **5,945 / 5,000 (400 KB of 500)** having *gained* the whole
  second method: without the split it would have landed near 6,400.
  `carta-plate.js` is 428 lines / 24 KB. **v7.31.1** — the method fix,
  `shotPreinfusion` and the machine read — took them to **6,006 / 5,000 (404
  KB of 500)** and **489 lines / 28 KB**: a bugfix release, and the plate half
  of it landed in the file the split created rather than back in `index.html`,
  which is the split doing its job.

  **This amends the two-file law, and the amendment is the file count, not
  the build.** "Two files, no build" was never really about two: it was
  about *no bundler, no npm, no step between the source and the host*, and
  a third `<script src>` in the head costs none of that. What it does cost
  is one more thing to remember to upload, which is a real cost and is why
  this is written down rather than assumed. The band still governs
  `index.html` alone; the byte ceiling has still never moved. **The line
  debt stands at 945 over and is not closed** — the split paid for the
  second method rather than paying down what Phase 26 already owed.
  **The three Phase 26 flow-curve patches (v7.28.1–.3) and Phase 27
  (photos retired) were not individually tallied here** — a gap in this
  section's own upkeep, not a claim the debt closed. Phase 27's own edit
  was net negative (the removed photo machinery outweighed the new ground-
  drawing helpers), so it did not widen the debt; `index.html` stands at
  **5,837 lines / 387.0 KB** as of v7.29.0 — still comfortably inside the
  500 KB byte ceiling, still over the still-unmoved 5,000-line one. The
  next phase that touches this section should true up the tally properly.

  **v7.34.0 trues the tally up and pays the debt down — five files now, and
  this is the argument the rule above requires for the fourth and fifth.**
  Called by the founder directly ("split index.html — it's way past the line
  band"), so the reopening is theirs, not a drift.

  *The true figure it was called on:* **6,483 lines / 438.3 KB** — 1,483 over
  a ceiling unmoved since Phase 17, the largest overage the project has ever
  carried, and larger than the 945 the v7.31.1 note last recorded (v7.32.0's
  Setup import and v7.33.0's durable shot store had both landed on top of it).

  **One fact had changed, and it is the one that made this urgent rather than
  untidy.** Every overage note above this one says some version of "bytes
  remain comfortable." At 438.3 of 500 KB that had stopped being true: 87.7%
  of the ceiling that has *never* moved across all four line-band amendments,
  and the only one actually guarding the drop-it-on-a-static-host promise.
  Recent phases run 150–800 lines and 10–50 KB apiece. The byte ceiling was
  two to four phases out. A line band can be argued about; that one cannot.

  *What moved, and why these two.* The file was searched for the largest
  things in it that are **not the record itself** — the test this section has
  used since Phase 19, when the map layer was "the map rather than the app":

  - **`carta-ask.js` (995 lines / 60.3 KB)** — the argument, which
    `CLAUDE.md` already named as one walk long before it was one file:
    `vTaste` → `vBrief` → `vAsk` → `vAsking` → `vAskResult`. With it goes the
    channel it goes out on — `callModel` and the two halves of reading a
    model's reply back safely (`extractJSON`, `askStr`/`askList`). Those are
    shared with the menu's *Read it for me* and a coffee's *Search for more*,
    which is not a smear: §7 already listed all three as one row, one keyed
    channel out. The file owns the channel; three features use it.
  - **`carta-shot.js` (872 lines / 51.5 KB)** — the Visualizer read: the
    account, the calls, the pickers, the shot the Atlas offers unasked, and
    the four screens a shot has of its own. Its pure half is the file-reading
    itself, and it loads *after* `carta-plate.js` because
    `parseVisualizerShot` reads a curve through the plate's own `shotCurve`.

  *Two files rather than one, deliberately.* One file holding both would have
  needed a name true of neither — the exact failure the v7.31.0 note refused
  when it declined to append the plate to `carta-map.js`. Five honestly-named
  files beat four with one lying.

  *What the count costs, stated plainly.* The law was never the number — it is
  *no bundler, no npm, nothing between the source and the host*, and four
  `<script src>` tags in the head cost none of that. What it costs is four
  more things to remember to upload, up from one. That is why the boot guard
  widened at the same time: it now checks **all three** sibling versions
  against `APP_VERSION`, not just the plate's, because five files means five
  chances for a cached one to disagree, and v7.31.1 already shipped what that
  failure reads like to a keeper ("your Visualizer account is empty").

  *Three blocks were found misfiled inside the extracted ranges and left in
  `index.html`* rather than dragged into either new file: the durability/
  backup block sitting between the brief and the ask, the share plumbing
  (`downloadBlob`, `shareOrDownload`, `copyPlainText`) beside it, and the
  Nominatim helpers (`lookupPlace`, `geocodeCafe`, `reverseGeocode`) sitting
  inside the ask block though café-placing is their main caller. That they had
  drifted there at all is the clearest evidence the file had outgrown being
  read whole, which is the thing the band exists to protect. **v7.34.1** moved
  all three to their actual neighborhoods — durability beside `vRecord`, share
  plumbing beside the cards, Nominatim beside `geocodeCityPlaces` — a pure
  reorder (diff, sorted, is empty) verified against all three call sites,
  including `geocodeCafe`'s cross-file call from `carta-ask.js`'s own
  grounding.

  **`index.html` now stands at 4,750 lines / 332.8 KB** — inside the band with
  250 lines and 167 KB of real headroom, close to where Phase 19 left it
  (4,854 / 321.5 KB). The app total moved 7,534 → 7,668 lines: a move plus two
  file headers and their seam publishes, not a cut. **The debt Phase 26 opened
  is closed.** The next phase to cross 5,000 re-earns its argument from here,
  exactly as this one had to.

  **The crossing happened at v7.35.0 and was not recorded here, which is the
  failure this section exists to prevent.** The consolidation turn landed
  `index.html` at **5,364 lines / 371.8 KB** — 364 over a ceiling that has not
  moved since Phase 17 — without an argument, an amendment or an
  acknowledged debt written down. It is written down now, at the phase that
  found it rather than the phase that caused it. Two more bodies of work then
  landed on top: the turn-3a artboard audit took it to **5,456 lines /
  376.7 KB** (the country kept off a lookup, and backfilled), and **Phase 29
  added 128 more** (the seal's width ladder, the city plate and its ink),
  landing at **5,584 lines / 387.1 KB**. The byte ceiling, the one that has
  never moved and the one that actually guards the drop-it-on-a-static-host
  promise, is comfortable at 387.1 of 500 KB. `carta-map.js` moved 535 → 657
  lines / 108.3 → 115.7 KB, all of it data and the readers over it: +474 b of
  belt, 76 b of city table, the window geometry, and the pure block that makes
  the two testable.

  **This is not an amendment and Phase 29 does not claim one.** Both prior
  overages (Phase 18, Phase 20) were put to the founder directly and recorded
  as debts against a number that stayed 5,000; the same is true here, with the
  difference that a phase in between passed the line silently. Whether the
  band is due another look, or the next split is due, is the founder's call
  and is on the table — see the v7.34.0 entry above, which named 5,000 as the
  point past which the one-file law itself, not the band, is what's come due.
- **Zero dependencies, zero build.** Vanilla JS, global functions, inline
  `onclick` handlers, string-templating into `innerHTML`, `esc()`/`jsq()`
  discipline. No bundler, no framework, no npm for the app — the single
  droppable file is brand, not accident.
- **Vendored, exactly twice** *(amended at Phase 12 — `ROADMAP.md` tripwire
  2, moved in the open rather than slipped past)*. The passport's projection
  needs real spherical geometry, and freehanding one is the kind of "small"
  maths that is wrong in ways nobody sees. So `d3-array` 3.2.4 and `d3-geo`
  3.1.1 (ISC, Mike Bostock) are **pasted in verbatim from their dist builds**
  — 54 KB, the two modules `geoEquirectangular` / `geoPath`
  and their fit/bounds/centroid actually need; full d3 is 280 KB for three
  calls. This costs the law nothing it was protecting: no npm, no build, no
  lockfile, no fetch, no version resolution, and the file is still one file
  you can drop on a static host. Upgrading is re-pasting a dist file. Since
  Phase 19, both live in `carta-map.js` rather than `index.html` — the count
  is still two, unchanged by the move.
  What it *does* cost is auditability-by-reading, which is why the number is
  two and the bar for a third is a deliberate amendment here, not a
  judgement call in a PR.
- **Offline-first, localStorage.** The device is the source of truth. Every
  network touch is a progressive enhancement that degrades to nothing.
- **The terse house style.** Single quotes, dense one-line helpers, section
  banners `/* ============ name ============ */`. Comments explain *why*.
- **Carried over from classic wholesale:** the Quiet Matter token layer
  (`SUBBRAND.md` governs it), the fonts, paper/dusk themes, the tuck, the
  motion charter, the sheet plumbing, the dial component, °C canon,
  descriptors, the 1–9.

## 2. Repository layout after the turn

```
index.html            Carta 7 — the app
carta-map.js          the map layer, split out at Phase 19 (§1)
carta-plate.js        the plate — both arms, split out at v7.31.0 (§1)
CLAUDE.md             the working guide to this file (Carta 7)
test/model.test.js    the pure-block harness (§9)
classic/index.html    Carta 6.18.x, frozen whole (it is self-contained;
                      freezing it was one `git mv`)
classic/CLAUDE.md     the third turn's architecture map, kept for the record
classic/README.md     classic's own user documentation, travelled with it
fonts/  manifest.json  icon-*.svg  CNAME     as before
docs/                 the design record, both eras
server/               dormant — kept for the record and the horizon's
                      backup option; not part of 7.x, not deleted
```

PWA notes: `manifest.json` keeps scope `/` (corrected 2026-08-27 — see
`LOGBOOK.md`; the site is served at the custom domain's root, and `/carta/`
404s live, so a fresh Add to Home Screen installed with the old
`/carta/` start_url and 404'd on open); classic gets no manifest
of its own (it's a page, not an install target). It carries one `shortcuts`
entry (Phase 10) pointing at `?open=door`. Version identity restarted at
`APP_VERSION = '7.0.0'` with a fresh `CHANGELOG` whose first entry names the
turn; Phase 12 is `7.13.0`, Phase 13 is `7.14.0`.

## 3. Storage

- **`carta7.v1`** — the whole ledger, one key, one keeper. No per-user
  registry, no multi-user. `D` is the ledger; `load()`/`save()` as today.
- **Prefs live inside the ledger** (`D.prefs`) — no second key to sync or
  forget. Device-frills (tuck postures, ground toggle) may keep their own
  keys as classic did; they are furniture, not record.
- **Photos are retired** (Phase 27 — PIVOT.md decision #1, reopened). They
  were the one storage-budget risk from the start — compressed JPEG
  data-URIs in a separate key, `carta7.photos.v1` — and one keeper's coffee
  found the edge of it: storage nearly spent, a save refused. The key, the
  compression path (`compressPhoto`, still used by menu-photo OCR — that
  capture is never kept, so it never grew), the upload slots and `cup.photo`
  are all gone. `load()` clears a stale `carta7.photos.v1` and any lingering
  `cup.photo` the first time this version runs, reclaiming the space without
  a keeper having to do anything. Wherever a photo stood, the coffee's own
  ground now draws instead — see `coffeeGroundHTML`/`coffeeGroundPin` in §4.
- **`carta7.shots.v1`** (Phase 26) — `{shotId: {t,p,f,w}}`, the pressure/
  flow/weight-vs-elapsed curves a plate is drawn from. Kept out of the
  ledger for the same reason photos used to be: a shot's series are ~3 KB of
  numbers, and the ledger needs to stay light enough to read as text.
  Written only once, when a brew is minted from a pulled shot, and thinned
  to at most 400 samples (`thinCurve`) on the way in. A cup or brew that
  carries only its `vizShotId` and finds no matching entry here simply
  draws no plate — the score, the recipe and the rest of the record stand
  on their own regardless.
- **`carta7.shotsread.v1`** (v7.33.0) — `{shotId: {…shot, curve, readAt}}`,
  the whole shot for a brew the keeper has actually opened, written or not.
  Distinct from `carta7.shots.v1` above and the distinction is the point:
  that one holds a *curve* a written cup redraws as a picture; this one
  holds the *shot* — its figures, its ledger, its pours — so the plate can
  be read again in full. Before this, `vShot` read only `_vizCache`, an
  in-memory object emptied by every reload, so the one screen that states
  what a brew actually did was reachable only on the way to writing its
  cup; writing the cup closed the argument behind it. `vizShotById` now
  falls back here and re-warms the session cache, which is why no call site
  downstream had to learn about it.

  **Bounded twice, by measurement.** Thirty entries at the record's own 400
  samples measured 459 KB — the wrong order of magnitude for something no
  cup depends on, and the photo store's own mistake a second time. It keeps
  **20 entries thinned to 150 samples** (~110 KB worst case): a plate is
  drawn ~350 px wide and scrubbed with a fingertip, so 150 is finer than
  either the screen or the hand resolves. Oldest `readAt` falls off first.
  **This is a cache, not a record** — never exported, never counted in the
  ledger's own figures, dropped on `dismissShot` and cleared entirely by
  `clearVisualizerKey`, because "the account is off this device" has to be
  true of what was read off it and not only of the password. A cup already
  written keeps its own curve in `carta7.shots.v1` regardless, so nothing a
  cup depends on is ever what gets dropped.
- Classic's keys are never touched. Import reads them (or an export file);
  it never writes them.
- **Act Two, Phase 8 (durability):** the storage laws above don't change —
  still one key, still one device, still no sync. What Phase 8 adds sits
  entirely in front of them: a quota guard that warns before a write fails
  instead of after (`STORAGE_SOFT_LIMIT`, read on `vRecord` and once a save
  actually crosses it), and a factual "last exported" read stated on the
  Shelf. Neither is a new key, and neither is sync. Phase 27 retired the one
  thing the guard was originally written for — a photo save silently
  failing — but the guard itself stands: the ledger and the shot-curve key
  can still fill a device on their own, and the same soft limit still warns
  before either does.

## 4. The data model (seven objects, as shipped)

Every record: `id` (uid), `createdAt`; edits stamp `updatedAt`. Put-away is
`archived: true` + `archivedAt` — one flag, one filter helper (`live(coll)`),
undo is unsetting it. No strike bodies, no tombstone grammar: with one
device and no merge, deletion is honest again — but stays two-step
(put away → erase from one room) per the surviving law.

```
D = {
  cups:    [{ id, createdAt, at, kind:'bar'|'home',
              placeRef?, coffeeRef?, brewRef?,        // home cups carry brewRef
              score,                                   // 1–9
              line, descriptors?[],                    // photo?:true retired at Phase 27
              vizShotId? }],                           // Phase 26 — the shot this cup
                                                         // was read from (home cups only);
                                                         // curve body in carta7.shots.v1
  coffees: [{ id, createdAt, roaster,                  // display string
              roasterRef?, name,
              origin:{ country?, region?, farm?, producer?, variety?,
                       process?, altitude?, mill?,     // story fields, free text
                       lat?, lon?, geocoded? },        // Phase 18 — where the farm
                                                        // actually is. Stated only by a
                                                        // lookup that named the farm back
                                                        // or a pin the keeper pasted;
                                                        // `geocoded` means asked-once, not
                                                        // found. A REGION never gets one:
                                                        // it is the mean of its placed
                                                        // farms, recomputed on read
                                                        // altitude specified from the turn's
                                                        // start, first offered a field at
                                                        // Phase 13; mill added there, and the
                                                        // road's Milled station reads it
              roastLevel?,                            // Act Two, Phase 9 — light..dark,
                                                        // optional, same law as process/origin:
                                                        // never a rung, never required (§4 below)
              roastDate?, notes?, site?, palette?, archived? }],
  places:  [{ id, createdAt, name, aka?[], city?, lat?, lon?,
              country?,                           // Phase 28's audit — the same confirmed
                                                   //   lookup states it and Carta kept throwing
                                                   //   it away. A LABEL only: it never keys a
                                                   //   lookup, never joins a node, and a city row
                                                   //   uses it to NAME ground the belt may not be
                                                   //   able to draw. backfillCountries fills it in
                                                   //   behind the keeper, once per city, and only
                                                   //   where the belt cannot answer for free
              neighborhood?, geocoded?,           // both stated only by a real lookup;
                                                   //   Phase 15's patch also lets `city` itself
                                                   //   be corrected the same way — a café pasted
                                                   //   in with a street address in the City field
                                                   //   is not stuck under it forever
              branches?:[{ lat, lon, hood, city }],// Phase 15 — several of it in one city,
              roasterRefs?, notes?, site?,         //   unanswered until the keeper says which
              palette?, archived? }],              // Phase 16 settles the same way from a
                                                    //   pasted map link when search finds nothing
                                                    //   — no new field, same lat/lon/neighborhood
  roasters:[{ id, createdAt, name, aka?[], city?, story?, site?,
              palette?, archived? }],
  setups:  [{ ...classic's shape, unchanged }],
  brews:   [{ ...classic's shape minus roastRef/lotRef; keeps coffeeRef,
              at?,                                    // v7.31.4 — when the brew was poured,
                                                         // off the file rather than the list row's
                                                         // upload timestamp. The cup written from
                                                         // it takes this as its own `at`.
              vizShotId?,                             // Phase 26 — same shot ref as the
                                                         // cup's, so a re-brew can start from it
              method?,                                // v7.31.0 — 'espresso' | 'pourover',
                                                         // read off the file (a scale writes no
                                                         // pressure), stored once, never guessed
                                                         // from a brewer's name. Absent = espresso,
                                                         // which every brew before it was.
              pours?[{ at, ms, added, then }],        // v7.31.0 — what the staircase was made of;
                                                         // the last `then` is the drawdown
              brewer? }],                             // v7.31.0 — the brewer and its paper, which
                                                         // is half the recipe for a filter brew
  menus:   [{ id, createdAt, placeRef, at,
              items:[{ text,                           // the line as printed
                       roaster?, name?, roastLevel?,   // parsed, editable
                       coffeeRef? }] }],               // set when tasted/taken home
  asks:    [{ id, createdAt, kind, destination,        // Phase 7 — the ask's history
              question, reach, model, read,            // reach + read: Phase 14
              openedAt, setAsideAt,                    // Phase 31 — the door's 03b rung
              findings:[{ id, name, neighborhood, city, why,
                          verdict, fit:[], order,      // Phase 14 — what it's best FOR,
                          travel, stale,               //   read off the brief, and how far
                          lat, lon, grounded,          // grounded === a real place lookup confirmed it
                          status, placeRef }],         // status: been | booked | skip
              mentions:[{ ...same shape, instead }],   // named, and talked out of
              plan:{ move, routes:[{ if, order:[] }],  // what it would actually do
                     wildcard:{ ...same shape } } }],  // outside the ranking
  prefs:   { tempUnit, askKey, askModel,               // the key lives here and nowhere else
             exportedAt, autoExport,
             asksReadBackfill?,                        // Phase 31 — the one-off migration's flag
             vizWatch?, vizDismissed?[], ... }         // Phase 26 — vizWatch: false by
                                                         // default, set only in the shot's own
                                                         // settings row; vizDismissed: last 20
                                                         // shot ids the keeper said were not
                                                         // theirs, so *Not mine* survives a re-open
}
```

Fields the phases added after this section was first written, all optional,
none of them new objects: `coffees.roastLevel` (Phase 9), `coffees.home` +
`coffees.homeAt` (Phase 11 — stamped only by the café-to-shelf bridge, so
"taken home, not brewed yet" can never fire on a coffee that started at
home), `prefs.exportedAt` / `prefs.autoExport` (Phase 8), `origin.mill`
(Phase 13, read by the country road's Milled station), `origin.lat` /
`origin.lon` / `origin.geocoded` (Phase 18 — the same optional, never-required
law as every other origin field; a coffee without them is unplaced, which is
most coffees and is drawn as a fact rather than a gap). `asks` is the one
collection the original six missed; it is the record of what was asked and
what came back.

**Phase 31 added two more, and they are the only two on the record that are
about *reading* rather than about what happened.** `openedAt` is stamped when
the answer's own page is actually opened, and `setAsideAt` when the keeper
taps *Not now* on the door; an ask carrying neither is the door's `03b` rung.
Both are ISO stamps rather than booleans for the same reason every other
field here is — the record says when, not merely whether. Two consequences
worth stating out loud:

1. **`ask.read` is the model's prose, not a read receipt.** It has been the
   model's own read of the ground since Phase 14, and the temptation to hang
   an unread flag on a field already called `read` is exactly the collision
   this note exists to prevent.
2. **`load()` back-fills `openedAt` from `createdAt` for every ask already on
   the record, once.** Without the back-fill the rung's own rule — "no
   `openedAt` means unread" — would declare a keeper's entire ask history
   unread on the upgrade, and the newest of them would take the door out from
   under whatever was actually waiting there. Stamped from `createdAt` rather
   than from now, so the record never claims a read happened at a time it
   could not have.

   **And it is flagged (`prefs.asksReadBackfill`) rather than run on every
   load, which is the half that is easy to miss.** Unflagged it is not a
   migration at all but a rule, and the rule says "every ask is read" — so
   the answer that came back five minutes ago and has not been opened would
   be stamped read by the next reload, and the rung would appear once and
   never again. The flag rides in `prefs`, so the same `save()` that writes
   any ask writes the flag with it: an ask can never reach the disk unread
   while the flag is still absent from it.

**Phase 14 widened it and broke nothing:** every field it
added is optional, so an ask stored under the Phase 7 shape still opens and
still reads — the screen draws a part only where the model filled it. The
three places an ask can name a café — `findings`, `mentions`, `plan.wildcard`
— all carry the same `grounded`/`status`/`placeRef` trio, so a mention is as
markable, and as un-pinnable-when-unconfirmed, as a finding.

**The gentle join** (replaces the catalog, the resolver, and the fold):
roasters and places are the graph's nodes, so each carries `aka[]` — other
spellings folded into it. `findNode(coll, name)` matches on
name-or-aka with classic's `normPlace`-grade folding (case, diacritics,
punctuation — never doubled letters, never aliases). When a new entry's
name is *near* an existing node, the form offers "Same as Sey (from
March)?" — accept: the string joins `aka[]` and the ref points at the
node; decline: a new node. Undo a join = remove the alias, re-point its
refs to a fresh node — one small function, cheap because nothing merged
bodies. **Origin story fields never join** — Huila spelled three ways is
three strings on three cards, and only the atlas's *display* folds them
(`foldNames`-style, presentation only), stating what it folded.

**A Setup, from Visualizer (Phase 26 amendment, v7.32.0).** Adding a Setup
had one door, a blank form, whatever account was on the device. Now "＋ A
new Setup" opens `openSetupImport()` first wherever `visualizerAuthHeader()`
is set — the same `fetchVisualizerShots(8)` the dial-in and door pickers
already call, so this opens no network surface the app didn't already have.
`setupCandidatesFromShots(shots, setups)` (pure) reads each shot's grinder
paired with `brewerOf(shot)` (whichever of `brewer`/`machine` the file
actually filled in), dedupes by that pair folded, and excludes anything
`matchSetupByGrinder` already exact-matches on the record — the same rule
the silent join keeps, so a deliberate picker and an unprompted pull never
disagree about what counts as "already have one". Tapping a candidate seeds
`openSetupForm`'s Name/Grinder/Brewer fields; nothing else a Setup carries —
basket, papers, water, the grind scale — is in a shot file, and the form
says so rather than leaving the keeper to guess why the rest stayed blank.
"Type it in instead" reaches the unchanged blank form at every turn, and an
unreachable Visualizer degrades to exactly that — the fallback this always
was. `resolveOrMintSetupForShot`'s own silent mint (the door pull, Phase
25) was widened the same amendment: it used to mint with the grinder alone,
dropping a stated machine or brewer on the floor; it now takes the whole
shot and carries both, the same pairing the deliberate picker offers.

**Phase 25 reuses the matching, not the mechanism, twice more.** A coffee
pulled from Visualizer at the door is matched against that roaster's own
coffees (`matchNodes`, scoped to `coffees` filtered by `roasterRef`) with
the same exact-joins/near-asks/else-new shape — but a coffee never gains an
`aka[]` field the way a roaster or place does; a "yes" just re-points the
pulled shot's brew at the existing coffee's id, nothing is written back
onto the coffee record itself. A Setup gets a narrower version still:
`matchSetupByGrinder` joins only on an *exact* fold match against the
Setup's own `grinder` **and** `brewer` fields together, with no near-match
ask at all — a shot never says which Setup pulled it, so a wrong silent
guess would be worse than simply falling back to whichever Setup is
already current. Grinder alone was the original rule and it collided the
moment one grinder fed two brewers — an espresso machine and a pour-over
dripper sharing a burr are two different Setups by this app's own law
("the assembly, not the appliance"), but every shot off that grinder was
landing silently on whichever Setup came first (v7.34.2, a keeper's own
account: pour-overs pulled off a shared grinder were minting onto the
espresso Setup, and `setupCandidatesFromShots` was refusing to offer the
pour-over pairing as new for the same reason). A Setup that has never
named a brewer still joins on the grinder alone, exactly as it always
did — the widening only ever refuses a join it would otherwise have made
wrongly, it never invents one for less. The same amendment gave a written
cup's own page a way back: `vCup` offers "Wrong Setup? Correct it →"
whenever more than one Setup is on the record, straight into the same
edit form `openBrewFlow`'s Setup dropdown already had — there was
previously no door back onto a brew's `setupId` once its cup existed.

**Phase 26 reuses the Phase 25 chain verbatim, once a shot is offered
unprompted rather than pulled at the door.** `vizCheckOnOpen()` fetches at
most one shot on boot, and only when it finds one with no matching cup and
no matching `vizDismissed` entry does the gentle join fire at all — same
`matchNode`/`matchNodes`/`matchSetupByGrinder`, same exact-joins/
near-asks/else-new shape, no new matching logic written for the hero
surface. **The honesty gate widens, not the matching:** Visualizer's
essentials payload has no confirmed scalar for water temperature or
preinfusion time, so `parseVisualizerShot` reads both as stated-or-nothing
(`tempC`, `preinfusionSec`) rather than deriving either off the pressure
curve — the time pressure first crosses 4 bar is an interpretation, not a
reading, and the plate states `unread` there rather than guess. A shot's
`timeExact` (a tenth of a second, what the plate itself states) is kept
beside the existing whole-second `time` that fills a dial and a brew's
`timeSec`; a written cup's foot rule reads off the ledger's own
`timeSec`, so a cup can correctly read "27 s" under a plate that read
"27.4s" moments before — the cup states what the record holds, never a
figure sharper than what was actually written down.

## 5. The taste model and the brief

**`tasteModel()`** is a pure derivation over the ledger — computed, memoized
on write, **never stored** (classic's `reviewQueue` pattern: derived state
cannot corrupt). Shape:

```
{ bar:     { floor,                       // score below which a café isn't worth the walk
             anchors:[{roasterRef, avg, n}],   // houses scoring ≥8 with n≥2
             nines:[cupRefs] },           // what earns your 9s, as evidence
  vector:  { roast, processes[], origins[], descriptors[] },  // each with weight + n
  scope(place|city|country|route) -> { had:[...], knownRoasters:[...] } }
```

Every figure carries its `n` and its evidence refs — the model is
inspectable on a page of its own, because *a recommendation never travels
without its reasons* starts with the model itself. That page was the Scout
room; since Phase 12 it is **Your taste**, a screen off the Atlas (Scout is
not a room any more — what it argued is geography). `vector.roast` was an
empty slot until Phase 9 gave it a field to read; it now leads the vector.

**The brief** (`brief(scope)`) renders three forms from one derivation:

1. a page on Carta paper (Spectral display, the bar, the vector, the
   anchors, the evidence — shareable as the friend-brief with a taste cut);
2. an embedded machine block, **`carta.brief/v1`** — classic's
   ledger-export trick: JSON in a `<script type="application/json">`
   island, `</script>`-escaped;
3. a plain-text cut sized for a chat box (~1,500 chars), the highest-value
   ~dozen facts, scope exclusions inline ("already had: …").

The brief is **strictly offline** — no call, no key, no telemetry. It is
also the interchange format: stage two sends it; Lotmark may one day read
it; it changes by version, never silently.

## 6. The section map of the new file (in script order)

As built, after Phase 12 re-cut the rooms. `CLAUDE.md` is the working map
with the function names; this is the shape:

```
tokens/style     the QM-inherited layer + Carta overrides (ported)
                 + "the rooms" — the redesign's own furniture (.shdr,
                   .shead, .lrow, the three-room bar and the door)
                 + v7.30.0's control standard, taken off the Phase 26
                   design board and applied app-wide: .btn is 13px/500
                   uppercase on .08em tracking at 13px of padding (the
                   shape .timer .ctl already used), .chk is the drawn
                   permission box, and .reading is the cup's own score row
plate layer      carta-plate.js (v7.31.0) — the brew's own curve, both arms.
                 Espresso: one arc under pressure, flow beside it, the cup
                 underneath, argued by peak bar. Pour-over: a staircase of
                 water added in pulses, the cup lagging, the pours as bands
                 and the waits drawn by being left empty, argued by drawdown.
                 Pure geometry + string-templating renderers; no D, no DOM.
map layer        <carta-belt> · <carta-plot> · <carta-streets>, three light-DOM
                 custom elements above the app's own script, with d3-array +
                 d3-geo vendored beside them (§1). Leaflet injected at runtime.
                 belt: topo="on" (LAND_TOPO's contours) + marks="[…]" (the
                 regions, on their farms' ground); streets: terrain="on"
                 (the §7 tile row) + names="on" (a pin whose name is the point).
                 One SVG unit is one CSS pixel — the belt is drawn at the size
                 it is read at, which is what makes it legible on a phone.
store            load/save, carta7.v1, live(), put-away, shots key
domain           uid, dates, °C, rest window, ROAST_LEVELS, fold, matchNodes
                 — inside the /* ==== pure ==== */ markers (§9)
taste            tasteModel(), briefPlainText(), the pages — pure, then
                 tasteModelMemo() outside the markers, dirtied by save()
router           three rooms (atlas|journal|shelf) + one screen overlay:
                 go()/openScreen()/closePage(), SCREENS, ROOM_OF, the door
                 on the bar rather than a masthead
views            vAtlas (home: the passport + your cities), vJournal, vShelf,
                 vTaste, and the screens — the walk down from a country
                 (vCountryChapter → vRegionChapter → vProducerPage), the
                 places (vCityChapter, vCafe, vCup, vMenu), the argument
                 (vTaste → vBrief → vAsk → vAskResult), and what the keeper
                 owns (vRecord → vSetups → vSetup), plus vBrew
door             paste-or-type → card; no adjudication, no propose
menus            one screen (vMenu): the lines as printed, and the box to add
                 to them — a photo held up as reference, or read through the
                 ask's channel
cards            card renderer + carta.card/v1 embed; the exports; import back
ask              askPromptText/callModel/geocodeCafe grounding, the findings
sheets/dials     ported plumbing
boot             migrate-nothing boot; ?open=door; importer entry; welcome
```

Porting rule: **port craft, not law.** `LANDS`, `landTopo`, the dial, the
sheet plumbing, the token layer come over as code; the evidence gates,
`RUNG`, holds, lens machinery, and every `penGuard`/`readOnly` path do not
come with them. Classic's `plotSVG` was *not* ported in the end — it carried
exactly the law this rule excludes (rung gating, lens, scene clustering), so
Phase 3 wrote `passportSVG()` purpose-built instead. Phase 12 took the app's
own passport off it and onto `<carta-belt>`; `passportSVG()` stays, because a
**card** is a standalone page and cannot carry a custom element that needs
the app's script. Two drawings of one frame is deliberate: the interactive
one and the one that travels.

**Two drawings came off at v7.30.0, and a third was put back.** The app had
ruled itself twice — `body`'s own `1px` edge and a `body::before` inset at
5px, "the leaf, ruled twice" from Phase 12 — and neither appears on any of
the board's nine stations, which are drawn full bleed to the device edge.
Both are gone; a rule that only ever fenced the content in was reading as a
frame around the app rather than paper under it.

The third was the **ember on the bar's door**, and it stands. `＋ A cup` has
been an 118px-wide `--accent` slab since Phase 12; the board draws all four
items of the bar in one rhythm, so the QC pass took the ember off on the
strength of "the board is the truth" — the one change in that pass that was
not a stated gap. **Put to the founder, the call was to put it back.** The
board is the truth about the screens it draws; the bar is chrome the board
inherits rather than argues, and `SUBBRAND.md`'s reservation of the accent
for "the live action" reads to include the app's one standing invitation to
log a cup. Recorded here because the reasoning cuts both ways and the next
pass over the board will meet the same disagreement.

## 7. Network posture (the whole of it)

| Touch | When | Degrades to |
|---|---|---|
| Geocode (Nominatim) | placing a café; grounding an ask's answer; reading a pasted map link's real address (Phase 16) | typed city, drawn plot |
| Leaflet + tiles (unpkg, OpenStreetMap) | a street surface mounts | the drawn plot, one line, Retry |
| Leaflet + **terrain tiles** (OpenTopoMap, CC-BY-SA) | a region or a farm surface mounts (Phase 18) | the drawn plot, one line, Retry |
| **The ask** (BYO-key, `api.anthropic.com`) | the keeper taps "Ask" or "Read it for me" | **the brief, copied** |
| **Search for more** (BYO-key, same `api.anthropic.com` row, Anthropic's server-side web-search tool) | the keeper taps "Search for more" on one coffee (Phase 22) | the field stays blank, typed in by hand |
| **Pull from Visualizer** (BYO Basic Auth, `visualizer.coffee/api/shots`) | the keeper taps "Pull from Visualizer" on one brew (Phase 24), "Pull it from Visualizer" at the door (Phase 25), or opens "＋ A new Setup" with an account already set (Phase 26 amendment, v7.32.0 — the same `fetchVisualizerShots(8)` call, no new surface) | the dials, the door's paste/type step, or the blank Setup form stay exactly as manual as they always were |
| **Visualizer, on opening** (Phase 26; amended v7.30.0) | one `GET /api/shots?page=1&items=1`, then one `/download?essentials=true` for that shot, then — since v7.30.0 — one `/download` for it in full, because the hero states figures that only the curve carries. Once per app **open**, and only if `prefs.vizWatch === true` and an account is already set | the Atlas paints its ordinary hero and says nothing |
| **Visualizer, a shot read in full** (Phase 26 patch, v7.28.1) | one more `/download` (no `essentials`) for the one shot actually opened — station 04's own screen, or the one row picked at the door — and cached per shot id so the same shot is never fetched twice in a sitting | the shot's own figures still stand; the plate states "This shot came without its curve" |

**What "once per app open" means, amended at v7.30.0.** It had meant *once
per script run*, which is a different thing on the surface Carta actually
lives on: an installed PWA is resumed from the background far more often
than it is loaded cold, so a shot pulled between two visits was never looked
for at all — `_vizChecked` had been true since the first paint of the
install. A resume after `VIZ_RESUME_GAP` (90 s) away now counts as an open
and re-arms the check, guarded three ways: the gap itself, `_vizWaiting`
(a cup already waiting is never replaced), and `vizWatch` as before. It is
still one call per open and still **never a poll** — the gap is what holds
that, and nothing fires while the app is in the foreground.

**Visualizer's real field inventory, confirmed against a live account
(v7.31.6).** Read-only, at the keeper's explicit request, to settle what had
been three releases of inference. Recorded here so nobody has to guess again:

| | what is actually there |
|---|---|
| list row | `clock`, `id`, `updated_at` — *nothing else* |
| full record, scalars | `barista`, `bean_brand`, `bean_notes`, `bean_type`, `bean_weight`, `drink_ey`, `drink_tds`, `drink_weight`, `duration`, `espresso_enjoyment`, `espresso_notes`, `grinder_model`, `grinder_setting`, `id`, `profile_title`, `profile_url`, `roast_date`, `roast_level`, `start_time`, `updated_at`, `user_id` |
| series | `timeframe`, `tags`, and under `data`: `espresso_pressure`, `espresso_weight`, `espresso_flow` *or* `espresso_flow_weight`, `espresso_state_change`, `espresso_temperature_goal` |

Four things this settled that had been assumptions:

- **There is no `machine`, no `brewer`, no `preinfusion` and no `temperature`
  scalar.** Those `unread` rows are honest, and pre-infusion off the curve
  (v7.31.1) was not a nicety — it is the only source there is.
- **`espresso_temperature_goal` is real and present**, which is what makes the
  water read at all (92 °C on the account's own lever shot).
- **`PRESSURE_MIN_BAR = 2` is validated on real hardware.** The account's lever
  peaks at **4.9 bar**. A threshold of 5 would have misfiled every one of its
  espressos as a pour-over.
- **`start_time` == `clock`, on every shot.** Which is the next section.

**A brew has one timestamp, and it is the record's (v7.31.6).** `clock` on the
list row and `start_time` on the full record are the *same value* across every
shot on the account — and `updated_at` sits within seconds of both on a fresh
upload. For an uploader that files after the fact, that is when the record was
made. **There is no pour time in the data at all**, so v7.31.4's hunt (which
prefers `start_time`) reads the identical figure and gains nothing where the
uploader is a scale; it stays because it costs nothing and is right for a
writer that does state one.

So the pour time joins `agitation`: a fact no instrument in the room recorded,
and therefore the keeper's to state. `openCupWhen`/`saveCupWhen` make the
cup's own date correctable, and the brew it was read from moves with it so a
re-brew starts from the same morning. `createdAt` is untouched and still says
when it was written down.

**Cups order by `at`, everything else by `createdAt` (`byWhen` vs `byNew`).**
A cup is the one record whose own moment can differ from the moment it was
written — you can pull Tuesday's brew on Friday. The Journal had claimed
"newest first" and meant newest *typed*. For every cup logged as it was drunk
the two are the same value and nothing moves.

**A brew is dated by its pour, not by its upload (v7.31.4).** The only
timestamp Carta had was `clock` off the *list* row, which is the record's own.
For anything filed after the fact — which is most filter brews, since a scale
syncs when it can — that is when it reached Visualizer. A brew poured on
Tuesday read as today's, on the hero, on the shot screen, and on the cup
written from it. `shotStartedAt(d)` now hunts the payload for the pour's own
start (`start_time` first, `clock` and the rest after), and `shotWhen` prefers
it, falling back to the list row where the file says nothing — so this is
never worse than what it replaced. `tsToMs` is the gate: epoch seconds and
milliseconds are told apart by magnitude, strings by `Date.parse`, and
anything outside 2000 → now+2 days is refused, which is what stops a duration
(`200`), an elapsed second (`27.4`) or a dose (`18.2`) being read as a date.

**`at` and `createdAt` are different facts and now behave like it.** `at` is
when the cup happened; `createdAt` is when it was written down. They were the
same value on every path because every cup used to be logged as it was drunk.
Reading a brew off an instrument breaks that — you can pull Tuesday's brew on
Friday — so a cup written from a shot takes the brew's own `at`, and the
Journal (which orders by `at`) puts it where it belongs.

**A shot is read twice, and only the second read knows the method (v7.31.3).**
The watch's own shape (`?essentials=true`, then `/download` in full) means the
first parse has *no curve in front of it* — and the method is read off the
curve. That first parse used to default to `'espresso'` and write it down as a
fact; because `'espresso'` is neither null nor empty, the fill-in that follows
then refused to correct it when the real curve landed. The Atlas drew a
pour-over through the espresso arm — no pressure series to draw, so `d="null"`,
an empty plate, a peak of `—` and a three-minute brew stated as `200s`. The
Journal was right throughout, because its list fetches the whole file and its
parse saw the curve first time. **That asymmetry is exactly what the keeper
reported: "it's there in journal but not in the hero."**

Two rules came out of it:

- **A parse with no curve leaves the method blank**, not `'espresso'`.
  `shotMethod()` still answers espresso at the point of use, so nothing
  downstream changed — the default moved to where it is a *reading* rather
  than a *record*. A blank is correctable; a wrong default was not.
- **`ensureShotCurve` distinguishes what the FILE states from what the CURVE
  states.** `SHOT_FILLED` is filled only where the cheap call left a blank, so
  a figure already stated (or corrected at the door) is never reverted.
  `SHOT_DERIVED` — `method`, `pours`, `preinfusionSec`, `preinfusionBar`, and
  a filter brew's `water` — is **re-derived outright** the moment the curve
  arrives, because the cheap call could not have known any of it.

The general shape is worth keeping in view: **a two-call read needs to say
which of its fields the cheap call is entitled to have an opinion about.**
Getting that wrong is silent, and it presents as a rendering bug three
functions away from the cause.

**The sibling scripts are versioned, and this is a stack law now (v7.31.2).**
`index.html` is the navigation document and is revalidated on every visit; a
`<script src>` beside it is an ordinary subresource and is served from cache.
So a keeper can run a *new* `index.html` against an *old* `carta-map.js` or
`carta-plate.js` — and at v7.31.1 they did. `parseVisualizerShot` called
`shotPreinfusion`, which only the new plate had; it threw; the throw landed in
`fetchVisualizerShots`' own per-shot `catch`, which returned `null`; every shot
was filtered out; and the screen said **"No brews on your Visualizer account
yet."** A programming error, laundered into a calm and completely false
statement about the keeper's own account.

Three things came out of it, and all three are the rule now:

1. **The tags carry `?v=<APP_VERSION>`** and it is bumped with it. This is the
   fix; the rest is defence in depth. The split at Phase 19 created this
   exposure and it went unnoticed for eleven versions because no release until
   v7.31.1 had `index.html` newly *call into* a sibling.
2. **`PLATE_VERSION`** is published by `carta-plate.js` and checked against
   `APP_VERSION` at boot. A mismatch says so plainly, once. It exists because
   the failure mode is silent, not because the query string is unreliable.
   v7.34.0 widened the check to every sibling — and **for four versions it
   did not actually mean every sibling.** `carta-shot.js` and `carta-ask.js`
   were added to the list; `carta-map.js` was not, because it published no
   version constant to check against, so the comment above the guard said
   "five files means five chances" while the guard enforced three of four.
   **v7.38.0 publishes `MAP_VERSION` and adds it.** The map is the oldest
   sibling and holds the geometry every plate on the door is drawn from, so
   a stale copy of it is the v7.31.1 failure again with a different symptom
   — which makes it the last one that should have been the unguarded one.
3. **Reads across the seam are guarded** (`typeof shotPreinfusion==='function'`).
   The same posture §7 takes with the network, applied to the file boundary: a
   sibling that isn't what was expected costs one figure, never the screen.

The general lesson is worth stating separately, because it is not about
caching: **a `catch` that returns a neutral value turns a bug into a lie.**
That one swallowed a `ReferenceError` and produced an empty list
indistinguishable from an empty account. `fetchVisualizerShots` now counts
what it could not read and the screen says which of the two it means.

**What the file states, and what the curve states, amended at v7.31.1.**
Three readings changed, all in the same direction: *stop waiting for a field
the file may not carry, and read what it already said.*

- **The method was being read off the wrong thing.** The rule was "an
  `espresso_pressure` array exists, so a machine wrote this". It does not
  follow: Visualizer normalizes every upload into one DE1-shaped schema, so a
  brew logged from a scale arrives carrying that key with a series flat at
  zero. Reported from a live ledger — a 3:20 Kalita brew filed as an espresso
  with its water null. The reading is now the **peak**: under
  `PRESSURE_MIN_BAR` (2 bar) no pressure was applied and it is not an
  espresso, whatever keys the file happens to carry. Two bar clears a lever's
  gentlest pull several times over. A flat-zero pressure series is also
  dropped rather than inked along the axis. This is still read off the file
  rather than inferred from a brewer's name — it is read from what the numbers
  say instead of from which keys exist.
- **Pre-infusion is read off the pressure line** (`shotPreinfusion`, pure)
  where the file states no `preinfusion` scalar, and both halves are stated:
  how long it ran and what it held. The plateau is the first sample the
  pressure fails to beat for a sustained window, below 60% of peak; the
  reading then settles on that plateau's own crest. A profile that ramps
  straight to nine bar has no plateau and states **nothing** — `null`, not
  zero, because "no pre-infusion" and "the file forgot to say" are different
  facts and only one of them is one. Verified against the design board's own
  profile, which states 4.2 s at 2.9 bar; the curve alone says the same.
- **The machine is a field Visualizer states** and Carta was not reading.
  Hunted across the plausible names (`firstStr`), the way every series already
  is. The espresso ledger states it beside the profile it was pulled on; a
  filter brew takes it as its **brewer**, since some writers put "Kalita Wave
  185" there for want of another field. `profile_title` is the profile, not
  the machine, and is its own row.

**The shots list reads the whole file, amended at v7.30.0.**
`fetchVisualizerShots(n)` had asked for `?essentials=true` per shot, which
is the same summary the v7.28.1 patch already found carries no curve — so
every row in station 08 drew nothing, and the screen's own argument ("a shot
is recognisable by its shape before its label is read") was unmet. It asks
for the full file instead. **The call count is unchanged** — one per listed
shot either way — and the payload trade buys back a later fetch, since a
shot opened from that list, or picked at the door, arrives with its curve
already in hand and `ensureShotCurve` short-circuits. The same amendment is
what puts the grind and the water on a shot's ledger at all: neither
`grinder_setting` nor the temperature goal is in the `essentials` summary,
so both read `unread` on every shot until v7.30.0 regardless of what
Visualizer's own page showed. `ensureShotCurve` now fills any field the
cheap call left null from the full one, and **never overwrites a stated
figure** — which is what keeps a shot corrected at the door from being
quietly reverted by a fetch that lands after it.

**The Visualizer row's auth is the keeper's real account login, not a
scoped key — named plainly rather than softened, and worth recording why.**
Visualizer's own API docs recommend OAuth for "public applications,
distributed integrations, and any workflow exposed to other users" — which
this is, by Phase 25's own design — specifically to avoid third-party apps
collecting a keeper's password. Carta uses Basic Auth (email + password)
anyway, because OAuth's Authorization Code flow needs a fixed, pre-registered
redirect URL and, for a public client with no server, a way to complete the
exchange without a client secret (PKCE) that was never confirmed available.
A static file dropped on any host, or opened straight from `file://`, has
neither a fixed URL nor anywhere safe to hold a secret even if it did. Basic
Auth is the option that actually works from anywhere, at the cost of the
real account password living in `localStorage` rather than a revocable
scoped token — stated in `openVisualizerKey()`'s own copy, not euphemised,
and put to the founder directly before building against it (this doc
originally read "a separate secret token, not the account password," taken
from a search summary never checked against the primary source; the
correction is recorded here rather than quietly overwritten).

The geocode row is unchanged in posture and was sharpened at Phase 15: the
same one call now asks for five results with their address details instead of
one bare hit. A café the lookup knows exactly one of is placed silently and
keeps the neighborhood it was found in. Where it knows several, **Carta does
not choose** — the branches are held on the record and the café asks once,
with the real neighborhoods to pick from, because which branch the keeper sat
in is not a fact any lookup or model holds. Same grounding rule, one rung
more honest: a pin is drawn from a confirmed position or not at all, and now
it can also be taken back.

**Phase 17 tried a fourth touch here and took it back out the same day.**
The first draft gave the Atlas's city thumbnails their own gated Leaflet
mount — booted only while a row was on screen, torn down the moment it
scrolled off, capped and citizenship-minded about OSM's tile policy. It
worked exactly as designed and was still the wrong shape for a 44×60px row:
a live, individually-tappable street map is more than a glance can use, no
matter how carefully it's fetched. The correction — `ROADMAP.md`'s Phase 17
entry has the full account — removed the touch entirely rather than tuning
it: a thumbnail draws a shape now, computed once from the ledger's own
coordinates, nothing fetched. So this table is exactly as short as it
was through Phase 16; the fourth row was tried, and the honest outcome was
that it didn't belong here, not that it needed refining.

The terrain row is **the same row asked for a different picture**, added at
Phase 18 and written down rather than slipped in: the same Leaflet, injected
the same way, the same degrade to the drawn plot, one different tile URL. It
exists because the contours the file already carries are cut against whole
countries — 199 points for all of Colombia — which is honest at a country's
own frame and a lie at a region's. Where the file cannot draw real ground, it
asks for it or shows none; it does not draw a coarse thing and call it
terrain. The tiles are never inverted for dusk (an inverted hillshade reads as
valleys where the mountains are) and Leaflet's own emoji attribution prefix is
cleared, but OpenTopoMap's CC-BY-SA credit is not.

That was the whole list through Phase 21, and **Phase 14 deliberately kept
it that way** for the ask specifically. The obvious way to make the ask's
answers sharper is to let the model search — the chat transcript the phase
was tuned against owed its best lines to a live menu read. That would have
been a fourth row here, and it was declined: the ask stays on training
knowledge, and the prompt instead forbids stating any menu as fact and
makes the model mark every café whose fit depends on one that turns over.
What the screen shows is what Carta can stand behind. **That decision
stands, unreopened** — `callAskModel` still calls `callModel` with no
`tools` argument, so the ask itself still searches nothing.

**Phase 22 is search, wanted for a different reason, added as its own row
rather than a flag.** A coffee's origin story — region, process, altitude —
is a fact to verify, not a recommendation to argue; the honesty risk the
ask's decision was guarding against (stating a café's menu as settled when
it turns over weekly) doesn't apply to a roaster's own product page. So
when "Search for more" was built, it got its own named row above rather
than quietly flipping a flag on the shared `callModel` — exactly what this
section asked for the day it declined the ask's own case. The two calls
share nothing but the HTTP function: `callModel` gained an optional `tools`
argument, only `cfSearchMore`'s own call passes it, and the prompt itself
repeats the same honesty gate in its own words — no source, no value,
never a guess.

**Phase 26 adds the one row that fires with no tap at all, and guards it
the hardest for exactly that reason.** Every other row in this table waits
on the keeper; `vizCheckOnOpen()` runs on boot, after the first `render()`,
but only when `prefs.vizWatch === true` — off by default, set nowhere but
the shot screen's own settings row — and only once, guarded by
`_vizChecked` so a later `render()` in the same session can never re-fire
it. Watch off, or the call unreachable, and the Atlas draws the ordinary
Phase 20 hero and states nothing about it; a shot already logged, or
already dismissed via `prefs.vizDismissed`, is never re-offered.

**Correction, v7.28.1: the plate shipped drawing nothing, for everyone.**
Every call Phase 26 made for a shot's own data — the watch's own check, the
Shots list, the door's picker — used `?essentials=true`, and that flag was
already known, from Phase 24's own research (§8), to omit the curve arrays
entirely. Nothing in the shipped code ever fetched the one response that
actually carries them, so `shot.curve` was `null` on every path and the
plate degraded to its own "came without its curve" state regardless of what
Visualizer itself showed. The fix is the row directly above this note: the
cheap calls stay cheap, and the one shot actually opened, or picked at the
door, gets a second, real fetch before its plate draws or its curve is
persisted — the `essentials=true` request-response shape was never
diffed against a real payload before this phase shipped, only the field
names inside it. `docs/LOGBOOK.md`'s v7.28.1 entry has the full account.

**Correction, v7.28.2: the fetch was right; `shotCurve` was still looking
in the wrong place.** v7.28.1 fixed which call gets made; a keeper's own
backup file, sent in for debugging, showed the plate still empty on a real
shot. Diffed directly against a live `/download` response for that shot:
Visualizer splits the curve across two containers, not one — the
elapsed-seconds series (`timeframe`) sits at the top of the response,
while pressure, flow and weight sit nested under a `data` key. `shotCurve`
had only ever searched one container per call, an assumption baked in
since Phase 26 shipped and never actually verified against a live payload
— every fixture written for it, including the one added for v7.28.1, was a
flat shape that happened not to exercise the split. Fixed by hunting every
key across both containers; verified against the reporting keeper's own
shot (1,081 real samples, pressure and weight both reading correctly).
What read at the time as "no flow sensor on that particular shot" was
itself wrong — see the v7.28.3 correction directly below. `docs/LOGBOOK.md`'s
v7.28.2 entry has the full account, including how the live payload was
actually obtained.

**Correction, v7.28.3: there was flow data; it was reading it wrong that
made it look absent.** The same keeper reported flow ("the ml/s") still
missing after v7.28.2. Their shot's `data.espresso_flow` genuinely is
`null` — no direct flow-sensor reading — but `data.espresso_flow_weight`
carries real numbers, 24 samples shorter than the rest of the curve.
Integrating it against elapsed time reproduces the shot's own final cup
weight almost exactly (52.1 g computed against 52.2 g logged), confirming
it is Visualizer computing flow off the scale for a machine with no
dedicated flow meter — which is most of them. Two bugs compounded: `shotCurve`
never tried the `espresso_flow_weight` key at all, and its own length
guard would have rejected it anyway for running shorter than the clock,
on the assumption that a length mismatch meant garbage data rather than a
reading that simply stops a beat early. Fixed by adding the fallback key
and dropping the length rejection — `platePaths`' own `line()` already
maps over whichever series it's given, so a shorter one draws a shorter
line rather than needing to be padded or thrown away. `docs/LOGBOOK.md`'s
v7.28.3 entry has the full account.

Two notes on what the table no longer says:

- **The brand read (Microlink) was never built.** Carta 7 makes no call on
  saving a roaster or a place. Palettes exist on records only because the
  classic importer carries the ones classic already read. Building it would
  be a new row here, deliberately added.
- **MapLibre + OpenFreeMap left at Phase 12**, replaced by Leaflet over
  OpenStreetMap's own tiles. The posture is unchanged and is the point:
  Leaflet is injected at runtime, never bundled, and a surface that cannot
  reach it hides itself so the drawn plot underneath simply stands. The
  passport asks for nothing at all — its outlines are in the file and its
  projection is vendored (§1), so the app's *home screen* is now the one
  map surface with no network story to tell.

Everything else — the model, the brief, the passport, the cards — is offline
by construction. The ask is the **one sanctioned channel for an outbound
question**, and every other use of it — menu-photo OCR, and now Phase 22's
coffee search — goes through the same posture: keeper-initiated, keyed by
the keeper, the key on the device and nowhere else, degrading to a manual
path, never required. Grounding rule: a café named in an answer is drawn
only after a real place lookup confirms it exists — Carta never pins a
hallucination; what can't be confirmed is listed, not plotted. The same
honesty discipline governs Phase 22's own answers: a fact with no real
source is left out, not stated.

## 8. Migration (classic → 7)

One importer, reading classic's working-copy JSON export (or the live
classic keys on the same device):

| classic | Carta 7 |
|---|---|
| `cups` | `cups` (café → `kind:'bar'`; hedonic → `score`) |
| `bags` + `authored` | `coffees` (flat origin read back; catalog nodes flatten to story fields; palette kept) |
| `cafes` + Register entries | `places` (palette, site, lat/lon, notes kept) |
| catalog `roasters` | `roasters` (name, site, palette; `aka` seeded from the fold's gathered spellings) |
| `setups`, `brews` | as-is (spine refs dropped; `bagId` → `coffeeRef`) |
| `pours`, `holds`, `struck`, sightings, standing, hard-IDs | **not imported** — they are the trade's record; the export file still holds them, nothing is lost |

The importer is additive and re-runnable (id-stable), and reports what it
carried and what it left, in words, before it writes.

## 9. Testing (small, and honest about what it covers)

Classic's stance — no frontend harness — nearly holds, with one upgrade:
the taste model is the one piece of real *logic* whose wrongness would be
invisible (a bad brief just looks like a mediocre brief). So:

- Pure functions (`domain`, `taste`) live between `/* ==== pure ==== */`
  markers in the file. **`test/model.test.js`** — zero-dep, plain Node,
  the `server/test.js` pattern — slices those regions out and evaluates
  them against fixture ledgers. **Since v7.31.0 there are two such
  regions**, one in `carta-plate.js` and one in `index.html`, and they are
  evaluated in load order — the plate first, exactly as the browser loads
  it — because `parseVisualizerShot` reads `shotCurve`/`shotPours` across
  that seam the same way the app reads the map layer's globals. A marker
  missing from *either* file fails loudly and names the file. It asserts on
  fixture ledgers (the bar's floor, anchor
  ranking, scope exclusions, brief size bounds, join/undo round-trips, and
  from Phase 18 the ground helpers: `originPin`, `meanPin`, and `namesBack`,
  the gate that keeps a lookup's region-shaped answer from being pinned as a
  farm; from Phase 26 the plate's own geometry: `shotCurve`, `shotFigures`,
  `platePaths`, and `shotAt` — and from v7.31.0 their pour-over arms plus
  `shotPours`, `shotMethod` and `shotPhase`, including the two
  `SPEC-phase26-pourover.md` §8 names as the cases that would fail
  invisibly (a brew poured in one go, which has no bloom to state, and a
  file that ends mid-drawdown, which states the drawdown it recorded rather
  than one extrapolated for it) — all pure over a brew's arrays with no `D` and
  no DOM). **94 cases.**
- Everything painted stays verified by loading the page, as ever.

## 10. What is deliberately not built

No framework, no bundler, no TypeScript, no service worker beyond the PWA
basics classic has, no accounts, no server in 7.x (the dormant one returns
only as the horizon's dumb backup), no analytics of any kind, no OCR
dependency (the ask's own channel does that job, or nothing does), no
embedding/vector machinery in the taste model (counts and means with
evidence beat opaque similarity for a corpus of hundreds — and they can be
*read*). Each of these is a door we know the address of; not opening them is
the architecture.

**The one amendment so far**, recorded here because a list of refusals is
worth nothing if it quietly stops being true: Phase 12 vendored `d3-array`
and `d3-geo` inline (§1). That is not a bundler, a build step or an npm
dependency — it is two dist files pasted into the page — but it *is* 54 KB
of code nobody in this repo wrote, and pretending otherwise would be the
first crack. The count is two. A third needs an argument made here, in
writing, before it is made in a PR. **Phase 18 did not make it two and a
half:** region-scale relief could have been had by vendoring finer contour
data, and was not — it asks a tile server for it instead, on the row §7
already had, and draws nothing at all when it can't. Elevation data in the
file is still exactly `LAND_TOPO`, cut against whole countries.

**What Phase 18 also declined:** a `regions` collection. Regions are the
obvious place to hang a coordinate, and giving them one would mean matching
region names to nodes — the gentle join, applied to an origin story field,
which §4 says never happens. A region stands on the mean of its own placed
farms and stands nowhere when it has none.

**What Phase 26 declined:** a scalar temperature field — there is still no
confirmed reading for one, only a curve, and the dial stays exactly as
manual as it has always been; the drift a shot shows against your last cup
on the same coffee, or against every 8 you've ever scored; and any card,
share or export of a plate. All parked, not absorbed — the plate states
what one shot argued, nothing comparative yet.
