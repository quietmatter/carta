# The logbook

*The trail register of Carta's fourth turn, kept by the outfitter
(`.claude/skills/outfitter/`). Append-only; newest entry first. A few lines
per entry: what shipped or moved, decisions, parked items, anything for
Lotmark's desk. Old entries are never rewritten.*

---

## 2026-08-27 — Phase 31, the ask at the front door, part one (v7.39.0)

- **The commission.** Claude Design handoff `Ask Carta at the Front Door`:
  take the ask off its three screens of its own and put it on the door's
  furniture — compose on a leaf over the plate, wait on the plate itself,
  land as a leaf. Eight specified frames (`1d`–`1i`, `2a`–`2d`), high
  fidelity, every number measured off the file, plus one production-ready
  new element (`carta-city.js`).
- **Two of the four screens shipped; two are held for a founder call.** The
  wait and the rung are decision-free — they redraw what the app already
  holds, on furniture it already has, and violate nothing. The composer leaf
  and the answer-on-the-plate each turn out to need a call the handoff does
  not make. Guessing on five founder-level questions and building five
  screens on the guesses is how a design lands twice. They are written up
  below instead.

### What shipped

- **The wait is the plate.** `vAsking` was a padded page with a 200 px pin
  box at its foot — the map was the last thing on the screen and the first
  thing the answer needed. It is full bleed now, `main.fixed` like the door.
  The belt stands while nothing is placed and reframes to `<carta-plot>` on
  the first confirmed address, in place, so the plot is mounted once and
  every pin after it is one `setAttribute` rather than a reprojection.
- **The ember budget held to two.** The rule's fill and its breathing tip,
  and nothing else on the screen; the live line's mark drops to ink. Counted
  in the harness rather than asserted in prose — the same count
  `verify-door.js` already makes on every door state.
- **03b, and the ask stops interrupting.** `runAsk` used to open the answer
  page itself the moment the last name landed. It lands on the door now and
  the answer waits there, as a rung between the waiting brew and the resting
  bag. `Not now` is written down (`setAsideAt`) rather than held for the
  session, and the reasoning is in `ARCHITECTURE.md` §4: a brew put down is
  nearly gone by the next open; an answer put down and re-offered every open
  for the life of the record is a nag.
- **One migration that would have been a bug report, twice over.** The rung's
  rule is "no `openedAt` means unread", and no ask on any keeper's record has
  one. Without the back-fill in `load()`, upgrading would have declared every
  keeper's whole ask history unread and put the newest one on the door over
  whatever was actually waiting there. Stamped from `createdAt`, so the
  record never claims a read at a time it could not have happened. **And the
  first version of that back-fill ran on every load**, which is not a
  migration but a rule — and the rule reads "every ask is read", so an
  answer that arrived and was left unopened would have lost its rung to the
  next reload and never come back. Caught by re-reading the diff rather than
  by a test; the test that would have caught it exists now.
- **`ask.read` was very nearly the collision.** It has been the *model's own
  read of the ground* since Phase 14. The obvious field name for an unread
  flag is the one already in use for something else.

### Two fixes the design surfaced rather than asked for

- **`<carta-plot>` labels overprinted.** Every label was drawn above its dot
  unconditionally. Nothing in the app had asked for `labels="on"` on a real
  city until this design did, and a plot fits its points to its box — four
  names in one quarter is a smear. Labels now place against what is already
  on the plate, drop what will not fit, and carry the layer's own halo.
- **The boot guard was checking three siblings of four.** `carta-map.js`
  published no version constant, so the comment reading "five files means
  five chances for a cached one to disagree" had been enforcing three since
  v7.34.0. Found on this branch and, independently, on the second split's —
  two readings of the same guard, a few hours apart, both landing on the
  sibling the sentence above it had always claimed was covered. The merge
  kept the split's wording; `MAP_VERSION` is published and checked.

### For the founder's desk — five calls, and what hangs on each

1. **The composer's *read-as* line.** Frame `1d` replaces the six kind chips
   with one stated line: "Read as a city, nothing on the record there yet ·
   *read it as*". Carta has no destination parser. `askScopeOf` only matches
   a city or a country the record already names, and anything stronger is
   either a network call at compose time — against *the ask is the one
   sanctioned outbound question* — or a guess stated as a fact.
   **Recommendation:** derive it from the record alone and never claim a
   lookup. A fold-match against `knownCities()` reads "a city, four cafés on
   the record"; a match against `landKey` reads "a country"; anything else
   reads "a city" with the *read it as* button one tap away. Honest,
   keyless, and it degrades to exactly the chips that exist now.
2. **Where the kind chips and the free-text question go.** The designed leaf
   has neither, and both are live capability: four of the six kinds (`near`,
   `country`, `route`, `friend`) are only reachable through the chips, and
   `askPromptText` takes the question. **Recommendation:** the *read it as*
   button opens a sheet carrying both — the six kinds and "Anything else" —
   so the leaf stays as drawn and nothing is silently removed.
3. **Where `<carta-city>` lives — and the second split changed the answer.**
   Three things need settling before it ships whatever is decided here: it
   carries a **hardcoded thirteen-entry quarter table for Los Angeles**,
   which is invented data on a record that refuses invented data everywhere
   else; it keys `CITY_ARCS` through its own weak `toLowerCase().trim()`
   rather than the app's `cityKey`, so any city with an accent or an
   apostrophe misses; and its `data-id` falls back to the row number, so a
   tap on a mark cannot resolve to a finding. The quarter table should be
   the record's own placed cafés and their confirmed neighborhoods,
   `cityKey` should key the coast, and `data-id` should be the finding's id
   and nothing else.

   *Where* it goes was, when this was first written, a question about a
   sixth file and the `ARCHITECTURE.md` §1 argument the count owes. The
   split made it a seventh — and, more usefully, gave it a better home.
   **Recommendation, revised: fold it into `carta-map.js` as the fourth
   custom element**, beside the other three and beside the
   `CITY_ARCS`/`CITY_RINGS` tables it actually reads. No new file, so no §1
   argument is owed at all, and the element sits next to its own data. The
   cost is that `carta-map.js` is already the largest file at 148 KB; a
   seventh file with the argument written is the alternative if that matters
   more than the count.

   Worth knowing before deciding either way: **`CITY_ARCS` holds one key
   today — Los Angeles**, and `CITY_RINGS` one, Līhuʻe. Every other city
   draws a coastless grid with rings, which is honest but is not the "six
   names land on ground" the design is arguing for. A third option is
   therefore live: **don't build it**, and let the answer page use
   `carta-plot`, which since v7.39.0 measures its own box and draws legibly
   at plate scale.
4. **The distance anchor.** Frame `2a`'s rows read "Arts District · 0.9 km"
   under a header that says "distance from Downtown". Carta has no anchor
   for an ask and no quarter table to name one from. **Recommendation:** the
   mean pin of the ask's own confirmed findings, labelled for what it
   actually is ("distance from the centre of what Carta found"), rather than
   naming a neighbourhood the record cannot defend.
5. **The one that matters most: the answer page has nowhere for its
   reasons.** Frame `2a` is a headline and six numbered rows. Today's
   `vAskResult` carries the verdict, the travel note, the rotates-warning,
   the `why`, the fit figures that open the very cups they were read from,
   what to order, the been/booked/skip marks, the near-misses and the plan.
   The design has a home for none of it. **A recommendation never travels
   without its reasons** is an invariant, not a preference.
   **Recommendation:** the six rows become the index and frame `2c` — one
   mark, on the streets — becomes where a finding's whole argument is read,
   with the plan and the near-misses under the answer page's own pull. That
   is a bigger change than the handoff describes and should be agreed before
   it is built, not after.

### Merged behind the second split

- **Cut from the same base, and the base moved underneath it.** The second
  split (v7.38.0, entry below) took `vAtlas`, the door's five leaves and the
  four walks out of `index.html` into `carta-atlas.js` — the very file this
  phase adds a rung to. Git merged the rung into `index.html` without a
  conflict on those lines while the function it wires into had moved, which
  is the quiet half of this class of merge: the loud half was six conflicted
  files, and the half that would have shipped broken was the clean one.
  `unreadAnswer`, `markAnswerRead`, `setAsideAnswer`, `doorAnswerLeafHTML`,
  `answerPinsJSON` and `answerPad` are in `carta-atlas.js` now, beside the
  door; the two rooms of CSS and the router's two stamps stayed in
  `index.html`, where the token layer and the router already were.
- **Renumbered 7.38.0 → 7.39.0**, the same cost the split's own entry
  describes paying four times over: one `APP_VERSION`, five `?v=` tags and
  five published `*_VERSION` constants. `verify-static.js` — which arrived
  with the split — checks all eleven, so this is now caught before merge
  rather than at a keeper's next load.
- **`verify-ask.js` reads its Chromium through `test/browser.js`** rather
  than the dev container's hard-coded path, and runs in CI beside the other
  five.

### Verification

- `model.test.js`: 139. `verify-door.js`: 59. `verify-v7.35.js`: 40.
- **`test/verify-ask.js` is new: 82 checks.** The wait's geometry read off
  the live DOM rather than off the template, the reframe, the ember count at
  both stages, cancel writing nothing on a real aborted run, the failure's
  three doors still tappable inside a `pointer-events:none` scrim, the
  ladder at all four rungs, the migration, *Not now* and its undo, an answer
  that placed nothing, an answer with nothing to stand behind, the plot's
  label placement, and dusk / reduced motion / 390×667 / 320px.
- The ask runs end to end against the fixture's own canned Anthropic and
  Nominatim doors, so the wait is tested as it actually runs rather than by
  driving `askSay` by hand.

## 2026-08-27 — the harnesses run themselves now (CI)

- **Asked for directly** after the Phase 31 PR opened against a repo with no
  `.github/` at all: the four harnesses (139 + 59 + 40 checks, plus the new
  12) had only ever run when somebody remembered to run them, which held fine
  at one contributor and stops holding the moment a change lands without
  them. `.github/workflows/tests.yml` now runs all of them on every push and
  pull request to `main`.
- **It is not a build step, and §1 says so in its own words rather than
  leaving it to be inferred.** Nothing here touches what a keeper downloads:
  no `package.json`, no lockfile, no bundler, no generated artifact, and not
  one byte of difference to the six files on the host. The Playwright install
  is on the runner, with `--no-save`, and is the same one `test/README.md`
  has always told a contributor to run by hand. The law is *nothing between
  the source and the host*; a robot running the tests you would run yourself
  is not between them.
- **A fifth harness, `test/verify-static.js` (19 checks, zero deps).** All six
  files parse; `APP_VERSION`, all five `?v=` tags and all five published
  `*_VERSION` constants agree; the boot guard covers every sibling; the
  `<head>` and the directory agree on which siblings exist. Every one of
  those is a failure this project has actually shipped or nearly shipped —
  v7.31.1's stale sibling, the four-way renumber of v7.37.4–.7, and the
  `MAP_VERSION` gap Phase 31 found. It fails cleanly on each, checked by
  breaking each one deliberately and watching only the right check go red.
- **The band is reported, never gated.** `verify-static.js` prints
  `index.html` against 5,000 lines / 500 KB and raises a PR annotation when
  over — and always exits 0. Gating would fight this project's own
  governance: Phases 18, 20 and 29 all landed over the band by an explicit
  founder call. What the record actually asks for is that a crossing is never
  *silent*, and four versions crossed silently before Phase 31. This makes
  silence impossible without making the call for anybody.
- **One real bug found by building it, not by reading.** `verify-v7.35.js`
  hard-coded `/opt/pw-browsers/chromium` with no override — it could only
  ever have run in this project's dev container, and would have failed
  outright on a runner. The other two honoured `CHROME` but defaulted to the
  same container path. All three now resolve through `test/browser.js`.
- **And one subtlety worth writing down.** The obvious fix — ask Playwright
  for `chromium.executablePath()` — is wrong on its own: that call *predicts*
  a path for the installed `playwright-core` version rather than checking a
  browser is there. Tried here it returned a confident path to nothing
  (`chromium-1234`, against a container holding `chromium-1194`) and the
  launch died with "executable doesn't exist" instead of falling through. So
  `browser.js` uses its answer only when the file really exists. Found by
  running the CI command sequence locally before pushing it, which is the
  only reason it isn't a red first run.
- **No version bump, no CHANGELOG entry.** Nothing user-visible changed and
  no app file was touched — the six files are byte-identical to the split
  commit. Nothing parked, nothing for Lotmark's desk.

---

## 2026-08-27 — Phase 31, the second split (v7.38.0)

- **The debt is paid.** `index.html` went into this phase at **5,956 / 5,000**
  — 891 of that carried out of Phase 30, and four more versions' worth on top
  (v7.37.4–.7, all small keeper-reported fixes landing in a file with no
  headroom left to land in). It comes out at **4,853 / 346.8 KB**, inside the
  band with real room and within two lines of where Phase 19's split left it.
  Nothing was cut: the app total moved 9,591 → 9,689 lines, which is a move
  plus a file header, its seam and its harness.
- **`carta-atlas.js` — 1,196 lines / 70.6 KB.** The door and the four walks
  down from it: `vAtlas` with its plate, leaf and risen sheet, then
  `vCountryChapter` → `vRegionChapter` → `vProducerPage`, and `vCityChapter`.
  It is the layer directly above `carta-map.js` — the record read against
  geography, where the map layer is the ground itself.
- **A cut the record had named was not taken, and that is the decision worth
  logging.** `ARCHITECTURE.md` §1 named the room-sized views (`vJournal`,
  `vShelf`, `vRecord`) as the obvious split. Measuring beat reading: the
  Atlas is one contiguous 1,126-line slab under its own banner, the rooms are
  two scattered runs that together clear the band by less, and the Atlas sits
  on a seam Phase 19 already proved. Recorded as a change of mind in §1 and
  in the roadmap rather than made quietly — the failure this record exists to
  catch is a stated thing quietly stopping being true.
- **Two bare cross-file writes became a real seam.** `save()` was clearing
  `_cityLeadCache` and `render()` was clearing `_atlasSheetUp` by bare
  assignment into what is now another file. That works — classic scripts
  share one global lexical scope — and it is the opposite of a documented
  seam, so both became calls the owning file publishes (`clearCityLead`,
  `resetAtlasSheet`), the shape `carta-shot.js` already uses for
  `snoozeWaitingShot`. Five voice helpers (`words`, `capFirst`, `trimNum` and
  the two number tables) went the other way into the domain block: four files
  call them and they were under the Atlas banner by accident.
- **Half of every sibling's export list is documentation, and now the record
  says so.** A `function` declaration in a classic script attaches itself to
  `window`; a top-level `const` does not. Dropping `window.vCityChapter`
  changes nothing; dropping `window.originOf` breaks the app. Found by
  deliberately breaking each and watching only one fail —
  `test/verify-split.js` holds the distinction now.
- **A gap in the boot guard, found by extending it.** The guard's own comment
  said it covered every sibling. It checked three of four: `carta-map.js`,
  the largest file in the app, never had a `MAP_VERSION` to check, so it was
  the one file a keeper could silently run a stale copy of — the v7.31.1
  failure with no alarm on it. It has one now, and all five siblings are
  checked. Not this phase's feature; a thing the phase could not extend the
  guard without noticing.
- **Verification.** `model.test.js` 139/139, untouched — nothing in the moved
  slab was ever inside a pure block, so the harness still slices five files,
  not six. `verify-door.js` 59/59 and `verify-v7.35.js` 40/40, both
  unchanged. New: **`test/verify-split.js`** (12) opens all four chapter
  screens with the app's own openers — *nothing had ever opened three of them
  automatically*, which is precisely how a split breaks a screen quietly —
  and asserts the published seam, both new seam calls, and that all six files
  agree on one version at boot. A static pass over every bare call in the new
  file found no dangling reference.
- **Nothing parked, nothing for Lotmark's desk.** Pure debt service, and the
  band is the founder's number again rather than an overdraft.

---

## 2026-08-27 — Phase 30, the plate against a real phone (v7.37.7)

- **852 CSS px is a full screen with no browser chrome at all** — the
  iPhone 15 Pro's own dimensions, standalone. It is not what most
  keepers get: an ordinary browser tab is shorter, and a good many
  phones are too. The leaf holding **Write the cup →** / **Brew it →**
  was taking that shortfall directly — its own height was simply
  whatever `main.clientHeight` left over once the plate's fixed pixel
  count (352 / 450) was subtracted, so any viewport shorter than the
  reference came straight out of the one thing holding the action in
  hand. Below roughly 800px tall the leaf started needing its own
  internal scroll to reach the button at all, with no fixed clearance
  above the bar — reported directly, from real use, not found in
  a headless pass.
- **Fixed by inverting the priority.** `mountAtlas()` now computes the
  leaf's own designed height first (`ATLAS_REF_MAIN - designRest +
  ATLAS_OVERLAP` — the height it was drawn at, 852 minus the bar) and
  gives the plate whatever is left, down to a 120px floor that still
  reads as a plate rather than a sliver. On any real phone down to
  iPhone SE size (390×667) the leaf now keeps its full designed height
  and never needs to scroll; only below that floor does it fall back to
  its existing `overflow-y:auto` as a last resort.
- **One arithmetic slip caught by the harness, not by eye.** The first
  version of this fix shrank the plate 18px past where it needed to —
  ATLAS_OVERLAP, the leaf's own overlap onto the plate's bottom edge,
  dropped out of the conversion between "the leaf's top position" and
  "the plate's own rendered height." It was invisible at a glance (the
  leaf simply got 18px MORE room than designed, never less) but wrong
  against the spec, and it slipped past the existing test because that
  test checked `data-rest` — the design literal baked into the markup —
  never `style.height`, the value `mountAtlas()` actually applies. Both
  are asserted now.
- **Verification.** Fresh-loaded (not resized) at seven heights from 852
  down to 500px to confirm the plate actually shrinks per-load, the way
  a phone actually arrives — a live resize doesn't retrigger
  `mountAtlas()` at all, matching the rest of the app, which has no
  resize handling anywhere. Four new cases in `test/verify-door.js`
  (52→56) fail cleanly before this fix and pass after. `model.test.js`:
  139. `verify-v7.35.js`: 40.
- **Renumbered 7.37.4 → 7.37.7 on merge, twice over.** Cut from the same
  base as the "Not now" resume-poll fix, independently, and both claimed
  7.37.4 — then the manifest-scope fix took that number first, the
  resume-poll fix took 7.37.5, and while this branch was resolving against
  those, the standalone bottom-edge fix (entry below) landed on 7.37.6.
  This takes 7.37.7. Nothing about any of the four fixes changed, only this
  one's version, its four `?v=` tags and the three sibling `*_VERSION`
  constants the boot guard checks against it — which is exactly the cost
  the guard exists to make cheap and loud rather than silent.
- **The plate no longer paints twice.** Folding this into `main` surfaced a
  race the branch had carried all along: `<carta-atlas>` measures its own box
  in `connectedCallback`, which runs while `innerHTML` is still being parsed —
  before `mountAtlas()` could have set anything — so the plate painted once at
  the element's own 480px fallback, then reached its real size only on the
  ResizeObserver's next tick. A visible flash, a wasted projection pass (the
  source itself puts one at a few hundred ms of synchronous main-thread work),
  and a genuinely flaky first frame: the country-tap check failed one run in
  four because it sampled a shape whose geometry was still the fallback's.
  `atlasPlateH()` is now one formula read by **both** `vAtlas` — which states
  the height and the leaf's top in the markup it emits — and `mountAtlas()`,
  which re-reads it on arrival and as the sheet travels. First paint is
  correct at every size checked; four consecutive full runs, no failures.
- **The gap has closed.** 7.37.5 was still unmerged when the paragraph
  above was written, and 7.37.6 not yet written; both have since landed, so
  their CHANGELOG lines and their own logbook entries arrive here through
  `main` rather than being written on their behalf, and the run reads
  7.37.7 → 7.37.6 → 7.37.5 → 7.37.4 unbroken. The one thing worth
  checking twice was whether the standalone fix and this one pull against
  each other, since both are about how tall the app thinks it is: they
  don't. `--app-h` sets the height of `body`; `atlasMainH()` reads
  `main.clientHeight`, which is derived from it. The plate follows the
  corrected height rather than fighting it.

---

## 2026-08-27 — the standalone install, off the bottom edge (v7.37.6)

- **The keeper's first real look at Carta as an installed app** (the manifest
  fix, v7.37.4, having just made that possible) found the whole app sitting
  short of the screen — a blank band between the tab bar and the home
  indicator on an iPhone. Carta's one full-height rule, `height:100vh;
  height:100dvh` on `body`, was hitting a live regression: iOS's current
  release leaves a gap at the bottom edge of a full-height standalone web app
  under `100dvh`, confirmed independently on Apple's own developer forums
  (thread 803987) — not a Carta-specific mistake, and invisible until now
  because no fresh install had ever reached standalone mode to show it.
- **Shipped:** `window.innerHeight` still reads the real, settled height once
  the app is open full-screen (no toolbar to hide or show there, so it can't
  be caught mid-animation the way a Safari tab's `vh` classically was) — a
  `setAppH()` call at boot writes it to a `--app-h` custom property, and
  `body`'s height reads that first, falling back to `100dvh` for the instant
  before the script runs and for anything that isn't hitting the iOS bug.
  Reapplied on `resize` for rotation and any future toolbar-less viewport
  change.
- **Also folded in:** the version-sync bug from v7.37.4 (`APP_VERSION`
  bumped without its sibling scripts) had already been caught and corrected
  to v7.37.5 by the time this landed — this entry's branch was restarted off
  that fixed point and renumbers cleanly to v7.37.6, all four version
  constants and all four `<script src>` query strings in step.
- **Verified:** `node test/model.test.js` at 139/139; the inline script and
  all three siblings parse; a plain-Chromium emulation shows no regression
  (Chromium doesn't carry the iOS bug, so `--app-h` and `100dvh` agree there
  either way). The fix itself needs a real iPhone to confirm closed — noted
  to the keeper rather than claimed.
- **For Lotmark's desk:** nothing new this entry.

---

## 2026-08-27 — Phase 30, a third fix (v7.37.5)

- **A dismissal that didn't hold.** "Not now" on the waiting-shot hero
  cleared `_vizWaiting`, but the app's own resume check
  (`vizCheckOnResume`, pre-existing, untouched by this phase) only guards
  on `_vizWaiting` being falsy — it does not know a dismissal happened,
  only that nothing is currently waiting. The very next time the check
  re-ran — which is any time the phone has been locked, or another app
  glanced at, for more than `VIZ_RESUME_GAP` (90 seconds) — it re-fetched
  the identical shot and put the dismissed hero straight back on the
  door, unprompted, with no `render()` call from the keeper anywhere in
  the chain. Ninety seconds is nothing on a phone; this was the common
  case, not an edge one.
- **Fixed with a second, session-only list beside the permanent one.**
  `_snoozedShotIds` (a `Set`, in-memory, cleared only by a real reload)
  sits beside `vizDismissed()` (the permanent, persisted "not mine"
  list) and is checked the same way, at the same point, in
  `vizCheckOnOpen`. `snoozeWaitingShot()` now records the id before
  clearing `_vizWaiting`. A genuinely different, later shot is
  unaffected — confirmed by mocking a second id through the same check
  and watching it surface normally while the dismissed one stays down.
- **Found auditing the merged door a third time**, this time against the
  handoff's own parenthetical — "(existing behaviour)" — next to Not
  now's spec line. There was no existing per-session dismiss anywhere in
  the app before this redesign; the phrase was aspirational, not a
  pointer to code that already worked this way, and the gap it was
  pointing past is exactly what surfaced.
- **Verification.** Reproduced by aging `_vizCheckedAt` past
  `VIZ_RESUME_GAP` and firing `vizCheckOnResume()` directly rather than
  waiting on the real clock. One new case in `test/verify-door.js`
  (48→51) fails cleanly before this fix and passes after.
  `model.test.js`: 139. `verify-v7.35.js`: 40.
- **Renumbered 7.37.4 → 7.37.5 on merge.** The manifest-scope fix
  (entry below) took 7.37.4 while this sat unmerged; both were cut
  from the same base and both claimed it. Nothing about either fix
  changed — only this one's version, its four `?v=` tags and the three
  sibling `*_VERSION` constants the boot guard checks against it.

---

## 2026-08-27 — manifest scope, corrected (v7.37.4)

- **A keeper reported a 404 on Add to Home Screen from Safari** — the site
  itself loads fine at `carta.quiet-matter.com`, but a fresh install opened
  to a 404. Cause: `manifest.json`'s `scope`/`start_url` were still `/carta/`,
  the path Carta 7 was served under before the custom domain (`CNAME` →
  `carta.quiet-matter.com`, added Phase 6's own day, PR #92) put it at the
  domain's root instead. Verified live: `carta.quiet-matter.com/` is 200,
  `carta.quiet-matter.com/carta/` is a genuine GitHub Pages 404. Safari reads
  `start_url` when it opens an installed icon, so every fresh install has
  been landing on that 404 since the domain moved.
- **This corrects the 2026-08-19 entry** (Phase 6 shipped) naming
  `/carta/` a "kept decision, not a leftover" — that call didn't hold up
  against the live site and `ARCHITECTURE.md` is amended accordingly, per
  this file's own rule that an unamended law that quietly stopped being true
  is the failure this record exists to catch. The keeper's older, already-
  installed icon still opens fine — it was very likely added before the
  custom domain moved the site, when `/carta/` was a real path, so its
  cached `start_url` still resolves; that's unrelated to whether Safari
  allows a second install of the same site (it does).
- **Shipped:** `manifest.json`'s `scope` and `start_url` (and the one
  `shortcuts` entry) now point at `/`. `README.md` and `ARCHITECTURE.md`'s
  PWA notes corrected to match. `APP_VERSION` bumped to `7.37.4` with a
  `CHANGELOG` entry, since a keeper who already has the app open will see
  What's New before the fix reaches their next fresh install.
- **Not touched:** nothing else changed about how the app is served or
  installed. No service worker exists to worry about a stale scope caching
  the wrong shell.
- **For Lotmark's desk:** nothing new this entry.

---

## 2026-08-27 — Phase 30, two more fixes (v7.37.3)

- **Two bugs found auditing the merged front door (PR 138) against its own
  mockup**, after PR 139 and PR 140 had already fixed two others in the same
  sweep. Both are the same class of mistake: a piece of the redesign's own
  furniture that looked complete in isolation but didn't survive contact with
  every path through the app.
- **The plate lost the passport's own tap.** `<carta-atlas>` shares its
  geometry with `<carta-belt>` — the outlines, the projection, the law that a
  tasted country is the mark — but not, it turns out, the tap behind it. When
  `<carta-atlas>` was folded into `carta-map.js` (this phase), nobody carried
  over `Belt`'s `g.mk`/`data-name`/click-listener pattern, so a country on the
  new front door drew as ink with nothing behind it: tapping your own tasted
  ground did nothing, where every other passport in the app has opened that
  country's chapter since Phase 3. Fixed by wiring `<carta-atlas>` the same
  way, including the cache-hit path — `PLATES[ck]` reuses a cached SVG string
  by replacing the DOM outright, so a listener attached during the paint that
  first built it is gone by the time a later plate reuses it, and the tap has
  to be rewired on every `host.innerHTML` assignment, not just the first.
- **v7.37.1's fix for the pulled-up sheet was half of one.** It reset
  `_atlasSheetUp` inside `go()`, which covers the tab bar — but not `goBack()`,
  which is the ordinary `←` on every screen and the phone's own back gesture.
  Pull the sheet up, drill into a city or a country chapter from it, then
  press back: the Atlas came back still pulled up. Moved the reset into
  `render()` itself, the one place every path through the screen actually
  passes — reset on arrival, keep it on a repaint of the same screen, the same
  rule `_lastScreenKey` already holds for scroll position. This also let the
  now-redundant reset in `go()` come back out.
- **Not fixed, and noted rather than chased:** the mockup's interaction table
  also promises "tap the plate (not a country) closes the sheet." The pull
  handle already does this fully, tapping a country is a *different* action
  that must keep working from state 05, and country-tap events bubble without
  `stopPropagation()` — so a plate-wide close handler risks firing alongside a
  country tap on every press. Left alone rather than adding a fragile
  target-check for a redundant affordance.
- **Verification.** Both bugs reproduced against the pre-fix code before being
  fixed (a country's own bounding-box centre often lands outside its actual
  painted shape on an irregular coastline — the confirming click has to land
  on the real geometry, found via `elementFromPoint`, not the box). Two new
  cases in `test/verify-door.js` (46→48) fail cleanly against the code before
  this fix and pass after. `model.test.js`: 139. `verify-v7.35.js`: 40.

---

## 2026-08-27 — Phase 30 (v7.37.0): the front door

- **What landed.** The Atlas redesign from the Claude Design handoff
  (`CARTA Front Door Redesign`), plus the app icon and favicon from the same
  project. The door was a sticky map with a question on it and ~2,270 px of
  card under it — asks, cities, a Visualizer pitch, a chip list and a share
  button, all present at once whatever the app was opened for. It is **the
  plate, one leaf and one pull** now, on a priority ladder of four branches:
  first open · nothing live · a brew waiting · a bag resting, with the record
  one pull below any of them. A brew expires and a bag does not, so a brew
  leads — the existing rule ("an unlogged cup outranks the next question")
  extended by one rung.
- **The blast radius was almost entirely `vAtlas`,** as the handoff promised.
  `welcomeHTML` and `homeShotHeroHTML` are deleted; `atHomeSlabHTML` moved to
  the Shelf, where the machine is; `asktrustHTML` moved into the ask composer,
  where the key is actually spent rather than one screen before it. `TABS`,
  `ROOM_OF`, `BARELESS`, the sheet plumbing, the door, the Journal and the
  Shelf's own rows are untouched.
- **The passport became a plate.** `<carta-atlas>` is a second element inside
  `carta-map.js` — not a sixth file, which would have meant a sixth
  cache-busting query string and the v7.31.1 failure again. It adds drafting,
  not decoration: a graticule at 30°/15°, the band between the tropics stated
  and labelled, leader rules, edge ticks. Behind it `WORLD` — 112 countries in
  11.7 KB, the rest of Natural Earth 1:110m through the same simplifier and
  the same varint, **encoded rather than fetched**. The board fetched
  `countries.geo.json`; the passport asks for nothing at all, by law.
- **The ember is now counted.** The rule the five states hold: *the ember
  marks the standing door, ink marks the action in hand.* The field's `→`, the
  two leaf actions and the waiting mark all went to the sanctioned ink fill
  (`.btn-graphite`, back-ported from the design system), so every state shows
  exactly one ember above the fold — the bar's own door. The v7.30.0 QC call
  on that door is untouched and was not reopened.
- **Three bugs found on the way, all pre-existing.** `--s10` was read three
  times in `index.html` and never declared, so the app's smallest labels were
  dropping the declaration and inheriting their parent's size; it is declared
  now, with `--s42`. The design board's own alias table pointed
  `timor leste → east timor` (and missed Natural Earth's "Republic of the
  Congo"), which drew both countries twice — once as a mark and once as
  context underneath; the encoder filters on the LANDS key instead.
  `<carta-belt>` reaches `LANDS` in its temporal dead zone on first paint and
  only survives by swallowing the throw and recovering on a later resize;
  `<carta-atlas>` waits on the exports block instead.
- **Decision — no bag weight was invented.** The handoff's state 04 selector
  asks for "a coffee that still has weight on file", and there is no such
  field: nothing in the ledger records what is left in a bag. The bag is
  chosen on what *is* on file (most recently brewed, still on the shelf, with
  a brew behind it) and its sub line carries no gram figure. Inventing one
  would be the guess the record refuses everywhere else.
- **Open — the line band.** `index.html` is **5,891 lines / 404 KB**. It
  entered this phase already at 5,584, over the 5,000-line band set at Phase
  17 and never amended since; this phase adds 307. **The byte ceiling — the
  one that has never moved and is the one that actually guards the
  drop-it-on-a-static-host promise — is fine at 404 of 500 KB.** Recorded as
  an overage for the founder's call, not amended here. Phase 17's own note
  said 5,000 is the point past which the one-file law, not the band, is what
  has come due; that call is still open and is now 891 lines overdue.
- **Verification.** `test/verify-door.js` is new — it boots the real app and
  walks all five states, counting the ember in each, and holds offline, dusk,
  `prefers-reduced-motion` and 320 px. 45 checks. `verify-v7.35.js` still
  passes all 40 (its first-open assertion was rewritten: that flow changed by
  design, so the test changed with it). `model.test.js` all 139.

---

## 2026-08-25 — Phase 29 (v7.36.0): ground for every listing

- **This release carries two bodies of work that were written in parallel and
  land together.** The turn-3a artboard audit (the two commits before this one)
  found five deviations between what PR 136 shipped and what the design board
  drew, and closed the two that needed a country the record never kept: the
  lookup that confirms a pin has been stating it all along, so `countryOf`
  keeps it, `settlePlace` carries it, and `backfillCountries` fills it in
  behind the keeper for every café already on file. Phase 29 is the map spec
  on top of that. They meet in one place and agree there: naming a country and
  drawing it are separate questions, `cityCountry` answers the first and the
  belt answers the second, and Phase A simply moves four countries from the
  first column into both. Where the audit's own comments used Denmark and
  Germany as the countries the belt would *never* carry, this phase corrected
  them — the reason survives the examples, since a record goes wherever the
  keeper does and the belt is a fixed list of shapes.
- **What landed.** The five shippable phases of `CARTA Map Spec.dc.html`, the
  production spec written out of the Carta listing redesign's own QC pass.
  **A** the belt reaches Denmark, Germany, Norway and Japan (+474 b) · **B**
  the seal spends `LAND_TOPO` above 64 px, one threshold, coarsest band first
  · **C** the city plate, on the closes-inside-the-window rule · **D** the
  city table, `CITY_RINGS`/`CITY_ARCS` at 0.005° (+76 b) · **E** Alaska split
  out of the USA entry (−1 b, the separator). **F** — elevation and true
  1:10m coastlines — is deferred, as the spec defers it: there is no source
  for it in the repo. Belt 7,272 → 7,745 b over seventy keys. `ROADMAP.md`
  Phase 29 has the full account.
- **The finding worth keeping is D's second test.** A city key is adopted
  only when it puts more vertices in the window *and* every point the record
  holds there still lands on land — not just the city's own coordinate.
  Honolulu is the proof and is why the rule is written that way: the finer
  source gains four vertices and loses the shore the city stands on, so the
  pin lands at sea and three of four cafés with it. No byte count and no
  vertex count would have shown it. It is rejected, and its strings are kept
  in the roadmap so the next source can be measured against the same failure.
- **Two decisions taken against the design, both stated.** The row falls back
  to the country seal where its window holds no ground, rather than dropping
  straight to the record's own points — otherwise Phase A's own promise
  (Copenhagen draws Denmark) and Phase E's (an Anchorage row draws Alaska)
  would both have been undone by Phase C the moment it landed. And a
  two-point `CITY_ARCS['lihue']` fragment 127 km from the city was dropped
  rather than shipped: it fails the plate's own ≥ 4-vertices rule, which is
  enforcement rather than deviation, and it is why D costs 76 b and not 86.
- **The harness has a fifth file.** `carta-map.js` carries a
  `/* ==== pure ==== */` block now, sliced first because that is the
  browser's own `<head>` order. Every "done when" clause in the spec is a
  case in `test/model.test.js` rather than a sentiment — round-trip through
  the app's own `landPts`, the bbox assertion on every drawn ring, both
  adoption tests measured against real café coordinates, and the two US
  frames. **139/139 passing**, up from 123.
- **For the founder's desk: the line band.** `index.html` crossed 5,000 at
  **v7.35.0** — 5,364 lines — with no argument, amendment or acknowledged
  debt written into `ARCHITECTURE.md` §1, which is the exact failure that
  section exists to prevent. This phase found it and recorded it. With the
  audit's own 92 lines and Phase 29's 128 on top, the file lands at
  **5,584 / 387.1 KB**. Bytes are comfortable (the ceiling that has never
  moved, at 77 % of it); lines are 584 over. Not amended here —
  both prior overages were founder calls and so is this one, with the extra
  question of whether the silent crossing means the next split is due rather
  than another look at the band.
- **Parked, not absorbed.** `landLabel` title-cases a raw `LANDS` key, so a
  city row falling back to it reads *United States Of America* over two lines,
  or *Hawai*. The audit's `cityCountry` fixes this wherever a café has actually
  been looked up — Nominatim states *United States*, and the stated name wins —
  so what is left is the case where nothing has been placed yet, or the belt
  answered for free and nobody read the address. It wants a display-name table
  beside `LAND_AKA`, which is its own small decision and not this phase's.

## 2026-08-24 — v7.34.2: a Setup, matched by what it actually is

- **A keeper's own account surfaced two real bugs behind the same root
  cause.** "A Setup from Visualizer" was reporting no new candidates even
  though their pour-over shots had never had a Setup of their own — and
  separately, those same pour-overs were minting straight onto their legacy
  espresso Setup, silently, with no way back once the cup was written.
  Both traced to `matchSetupByGrinder` (Phase 25): it joined a shot to a
  Setup on an exact fold match against the Setup's `grinder` field *alone*.
  A grinder that feeds two brewers — an espresso machine and a pour-over
  dripper sharing a burr, an entirely ordinary kitchen — collided every
  time: `setupCandidatesFromShots` excluded every shot on that grinder as
  "already have one" regardless of which brewer it named, and
  `resolveOrMintSetupForShot` silently minted every one of them onto
  whichever Setup happened to already carry that grinder.
- **The fix widens the match, not the guess.** `matchSetupByGrinder` now
  requires the grinder *and* the brewer to both fold-match before it joins
  silently. A Setup that has never named a brewer still joins on the
  grinder alone, exactly as before — this only ever refuses a join it
  would previously have made wrongly, it never invents a new one. Every
  call site carries the brewer through now: `setupCandidatesFromShots`,
  `resolveOrMintSetupForShot`, and the pre-write Setup line on a shot's own
  screen (`vShot`).
- **Reconciling what already went wrong needed a second door.** A brew's
  `setupId` was only ever editable through `openBrewFlow`'s edit mode, and
  the only path into that mode was "Correct something before it is
  written" — no use to a cup already on the record. `vCup` now offers
  "Wrong Setup? Correct it →" straight into that same form, whenever more
  than one Setup exists to choose from. Fixing the underlying legacy Setup
  itself (naming its brewer, or adding the missing one via "＋ A new
  Setup") is what makes future pulls land right automatically; this is the
  door back for brews that already landed wrong.
- **Tests: 123**, extended rather than grown — new assertions inside the
  existing `matchSetupByGrinder`/`setupCandidatesFromShots` cases cover the
  grinder-alone Setup (unchanged), the grinder+brewer exact match (still
  silent), and the grinder-shared/brewer-different case that was the actual
  bug (now correctly refused/offered). `node --check` clean on both changed
  files.
- Version stamped at all six points: `APP_VERSION`, four `?v=` tags, and
  the three sibling `*_VERSION` constants.

---

## 2026-08-24 — v7.34.1: three blocks, put back where they belong

- **Follow-up to v7.34.0**, called directly: *"clean up those three misfiled
  blocks."* The split moved the argument and the Visualizer read into their
  own files and, in doing so, cut three unrelated blocks clean out of the
  middle of "setups + the dial-in loop" and left them stranded there — the
  backup system, the sharing plumbing every card and the brief lean on, and
  the café-placing lookup the ask itself calls into. All three had been
  sitting between the dial-in screen and the map surfaces, nowhere near any
  of their actual callers.
- **Moved to their real neighborhoods, not just out of the way:** the
  durability/backup block (`weeksSince`, `exportedLine`, `exportLedgerJSON`,
  `maybeAutoExport`, `storageUsedBytes`, `lowStorageNoteHTML`) now sits
  immediately before `vRecord`, the page that reads every one of them. The
  share plumbing (`downloadBlob`, `shareOrDownload`, `downloadBriefPage`,
  `copyPlainText`) now sits immediately before the cards section, its main
  caller. The Nominatim helpers (`lookupPlace`, `geocodeCafe`,
  `reverseGeocode`) now sit immediately before `geocodeCityPlaces`, which was
  already carrying a comment naming `geocodeCafe` as its sibling caller before
  today — the intended neighborhood was legible even while the code sat
  somewhere else.
- **A pure reorder, checked as one.** `diff <(sort before) <(sort after)`
  comes back empty — not one character added, removed, or changed, only
  moved. Every function still defined exactly once.
- **The cross-file call was the thing worth actually testing**, not just
  reading: `carta-ask.js`'s own `groundNamed` calls `geocodeCafe` at runtime,
  a global function now living in a different neighborhood of a different
  file than when that call was written. Verified end to end — the ask still
  grounds a real finding (`grounded: true`) with Nominatim stubbed, after the
  move.
- **Tests: 123**, unchanged. Verified in headless Chromium: backup/export
  (download fires, `exportedAt` pref sets), café placement through
  `geocodeCityPlaces`/`lookupPlace` (a café lands its coordinates), the ask's
  own grounding through `geocodeCafe`, and the full prior regression suite.
  `index.html` unchanged in size (4,753 lines / 333.6 KB) — a reorder costs
  nothing the band cares about.
- Version stamped at all six points: `APP_VERSION`, four `?v=` tags, and the
  three sibling `*_VERSION` constants — bumped even though only `index.html`
  changed, per the stack law's own rule that a cached sibling must never be
  left to disagree.

## 2026-08-24 — v7.34.0: the file, split again — five now

- **The founder's call, made directly:** *"split index.html — it's way past the
  line band."* It was: **6,483 lines against a 5,000-line ceiling unmoved since
  Phase 17** — the largest overage the project has ever carried, and larger
  than the 945 the v7.31.1 note last recorded, since v7.32.0's Setup import and
  v7.33.0's durable shot store both landed on top of it.
- **One fact had changed, and it is what made this urgent rather than untidy.**
  Every overage note in `ARCHITECTURE.md` §1 above this one says some version
  of *"bytes remain comfortable."* At **438.3 of 500 KB** that had stopped
  being true — 87.7% of the ceiling that has never moved across all four line-
  band amendments, and the only one actually guarding the drop-it-on-a-static-
  host promise. Recent phases run 150–800 lines and 10–50 KB apiece; that
  ceiling was two to four phases out. A line band can be argued about. That one
  cannot, and it is the one the brand rests on.
- **Two files out, chosen by the Phase 19 test** — the largest things in
  `index.html` that are *not the record itself*:
  - **`carta-ask.js`** (995 lines) — the argument, which `CLAUDE.md` already
    named as one walk long before it was one file: `vTaste` → `vBrief` →
    `vAsk` → `vAsking` → `vAskResult`. With it goes the keyed channel it goes
    out on, `callModel`, and the reply-reading helpers the menu's *Read it for
    me* and a coffee's *Search for more* share with it — which is not a smear:
    §7 already listed all three as one row, one channel out.
  - **`carta-shot.js`** (872 lines) — the Visualizer read whole: the account,
    the calls, both pickers, the shot the Atlas offers unasked, and a shot's
    own four screens. It loads after `carta-plate.js`, because
    `parseVisualizerShot` reads a curve through the plate's own `shotCurve`.
- **Two files rather than one, deliberately.** One file holding both would have
  needed a name true of neither — the exact failure the v7.31.0 note refused
  when it declined to append the plate to `carta-map.js`. Five honestly-named
  files beat four with one lying.
- **What the count costs, said plainly:** four more things to remember to
  upload, up from one. Which is why the boot guard widened in the same pass —
  it checks **all three** sibling versions against `APP_VERSION` now, not just
  the plate's. Five files is five chances for a cached one to disagree, and
  v7.31.1 already shipped what that reads like to a keeper: *"your Visualizer
  account is empty."*
- **Three blocks were found misfiled inside the extracted ranges and left where
  they belong** rather than dragged along: the backup block sitting between the
  brief and the ask, the share plumbing beside it, and the Nominatim helpers
  sitting inside the ask block though café-placing is their main caller. That
  they had drifted there at all is the clearest evidence the file had outgrown
  being read whole — which is the thing the band exists to protect.
- **`index.html` is back inside the band at 4,750 lines / 332.8 KB**, with 250
  lines and 167 KB of real headroom — close to where Phase 19 left it. The app
  total moved 7,534 → 7,668 lines: a move plus two file headers and their seam
  publishes, **not a cut**. Nothing was rewritten, renamed or restyled.
- **Tests: 123**, unchanged, now sliced from four pure blocks in the browser's
  own `<head>` order. Verified end to end in headless Chromium, paper and
  dusk: the whole argument walk (call, parse, grounding, the record write, and
  `matchFigure` still resolving a model-written figure back to the cups behind
  it *across the new file boundary*), the whole shot flow, and the full prior
  regression suite. The one real risk — `askDraft`, a `let` reassigned from
  `index.html`'s router and written by an inline handler on the Atlas — was
  tested in both directions and holds: classic scripts share one global
  lexical environment, so it is the same binding either way, and it is
  deliberately *not* published on `window`, where a copy would fork it.
- **The debt Phase 26 opened is closed.** The next phase to cross 5,000
  re-earns its argument from here, exactly as this one had to.

## 2026-08-23 — v7.33.0: the brew, reviewable

- **The keeper's own reading of the board, and it was right:** station 11 (the
  brew as a plate) and station 13 (the cup, written) had a one-way door between
  them. The plate was reachable only *en route* to writing the cup — tap
  through, score it, and the argument underneath the score closed behind you.
  The cup kept a hairline picture of the curve, but the reading of it (the
  scrub, the pours and their waits, the whole ledger of what the machine
  actually stated) was one-time.
- **The inversion:** writing the cup is what makes the plate *worth* keeping,
  not what spends it. The plate on a cup's own page is a door now — tap it and
  the brew reopens in full, as often as wanted.
- **A written shot stops pretending it is an invitation.** `vShot` used to
  offer three pre-write actions (write it · correct it before it is written ·
  not mine) whatever the record already held. All three are spent once a cup
  exists, so it names the cup it became and its reading instead. The duplicate
  guard in `shotIsTheCup` is still there underneath and still tested — the UI
  simply no longer walks the keeper up to a door it would refuse.
- **The real gap was that a shot lived only in memory.** `vShot` read
  `_vizCache`, emptied by every reload, so "reviewable later" was impossible
  no matter which button pointed at it. New store, `carta7.shotsread.v1`:
  the whole shot for a brew actually opened, written or not. `vizShotById`
  falls back to it and re-warms the session cache, which is why nothing
  downstream had to learn about it. A brew now reads after it falls off the
  account's recent eight, and reads with the network off.
- **Bounded by measuring, not by guessing** — the one part of this worth
  arguing about, given `docs/LOGBOOK.md`'s own entry on why photos were
  retired. Thirty entries at the record's 400 samples measured **459 KB**,
  which is the photo mistake again. It keeps **20 at 150 samples (~110 KB)**:
  a plate is ~350 px wide and scrubbed with a fingertip, so 150 is finer than
  the screen or the hand can resolve. Thinned *for reading*; the copy a
  written cup depends on (`carta7.shots.v1`, 400 samples) is untouched and is
  never what gets dropped.
- **It is a cache and says so.** Never exported, never counted in the ledger's
  figures, dropped on *Not mine*, and cleared whole by signing out of
  Visualizer — "the account is off this device" has to be true of what was
  read off it, not only of the password.
- **Tests: 123**, unchanged — every change here is DOM-coupled or a storage
  policy, so it is verified in the browser instead: the full loop (open the
  plate → write the cup → reopen the plate from the cup → back to the cup),
  offline after a reload, the cap at 45 reads, dismissal, and the full prior
  regression suite. `dupe.js` was updated rather than merely re-run, since the
  behaviour it asserted is the behaviour this deliberately changed.

## 2026-08-23 — v7.32.0: a Setup, from Visualizer

- **The keeper's direction, taken straight:** the primary way to add a Setup
  should now be through Visualizer integration, not a blank form. "＋ A new
  Setup" — both from the record's own door and from the Setups list itself —
  now opens onto the keeper's own recent shots first, wherever there's a
  Visualizer account already set. Read the grinder off a shot, pair it with
  whatever machine or brewer rode beside it, and one tap seeds the New Setup
  form with both instead of asking the keeper to type what the account
  already knew.
- **No new network surface.** The picker calls the exact same
  `fetchVisualizerShots(8)` the dial-in picker and the door pull already use.
  Adding a Setup from Visualizer costs nothing beyond what pulling a shot
  already cost.
- **Deduped, and honest about what it can't say.** `setupCandidatesFromShots`
  (pure, tested) folds a grinder-and-brewer pair before comparing, and never
  offers a Setup already exact-matched on the record — the same rule the
  silent door-pull join already keeps, so the deliberate picker and an
  unprompted pull can't disagree about what "already have one" means. And a
  shot file has never once stated a basket, papers, a water recipe or a grind
  scale — a picked candidate seeds only what a shot actually can, and the
  form says so, rather than leaving the keeper to wonder why the rest is
  still blank.
- **The typed door never closed.** "Type it in instead" sits at the bottom of
  the picker on every render — empty candidates, a fetch that failed, an
  account never set — and an unreachable Visualizer degrades to exactly the
  blank form that was always there. Verified: no account → straight to the
  blank form; account with no shots, or every grinder already on the record
  → the same fallback with a stated reason; a network failure → the error
  shown, the fallback still one tap away.
- **The quieter path came along for the same reason.** `resolveOrMintSetupForShot`
  — the silent mint behind a shot pulled at the door — used to mint with the
  grinder alone, dropping a stated machine or brewer on the floor. It now
  takes the whole shot and mints with both, so a Setup born from an unasked
  pull isn't a worse record than one a keeper deliberately picked.
- **Tests: 123**, two new pure cases (`brewerOf`, `setupCandidatesFromShots`),
  everything prior still green. Verified end to end in headless Chromium,
  paper and dusk, Visualizer stubbed — the full regression suite re-run
  clean since the change touches the shared door-pull mint every one of
  those scripts exercises.

## 2026-08-23 — v7.31.6: the date, settled — and a cup you can correct

- **The keeper handed over their own account** to settle the question v7.31.5
  left open, and it settled it in a direction no amount of reasoning would
  have: read-only against their seven shots, the list row carries `clock`,
  `id`, `updated_at` and nothing else, and the full record's **only** date is
  `start_time` — which is byte-identical to `clock` on all seven. There is no
  pour timestamp in Visualizer to find. v7.31.4's hunt is not wrong; it simply
  has nothing to catch on this account, and its fallback was already the right
  answer.
- **So the fix moved from reading to correcting.** If the instrument didn't say
  when, the keeper can. Tapping the eyebrow on a written cup opens *When was
  this cup?* — "Read off the instrument where one said so, and yours to correct
  where none did." The brew's `at` moves with it; `createdAt` never does; the
  toast carries Undo. A correction is a reading the record couldn't take, not a
  second opinion about one it could.
- **Which exposed a quieter bug: the Journal was ordering by the wrong field.**
  `byNew` sorts on `createdAt` — filing order. Any cup dated backwards would
  have sat in the wrong place the moment it was corrected, so the correction
  needed the sort fixed to be worth anything. `byWhen` reads `at` first and
  falls back to `createdAt`, and it now governs all nine cup lists (Journal,
  a coffee's cups, a café's, the continuation, the ask and menu refs, the year
  card). **Cups order by when they happened; everything else still orders by
  when it was filed** — written into `ARCHITECTURE.md` rather than left as a
  reading of the code.
- **The account also confirmed three `unread` rows are honest**, which is worth
  as much as a fix: no `machine`, `brewer`, `preinfusion` or `temperature`
  scalar exists on their records. Carta was not failing to read them. It was
  correctly saying so. `espresso_temperature_goal` *is* there (92 °C), and is
  read. The confirmed field inventory is now a table in `ARCHITECTURE.md` §7,
  so the next hunt starts from what was seen rather than what was assumed.
- **And it validated a threshold by nearly breaking it.** Their lever peaks at
  **4.9 bar**. `PRESSURE_MIN_BAR=2` files it as espresso correctly; a plausible
  5 would have misfiled every espresso they have ever pulled. The number was
  picked to separate *zero* from *some*, and that is why it held.
- **The thread through this whole run, now a rule and not four patches:** *a
  default standing in for a reading.* `espresso_pressure` existing taken for
  pressure applied; `method` guessed before its curve arrived; a cached sibling
  assumed current; a list row's timestamp assumed to be the brew's. Each shipped
  as a plausible default and each read to the keeper as a lie.
- **Tests: 121**, passing. The correction is DOM-coupled, so it is verified in
  the browser end to end — the eyebrow prefills local time, saving moves
  `cup.at` and `brew.at` while `createdAt` holds, and the Journal reorders.

## 2026-08-23 — v7.31.5: the plate, against a real brew

- **The keeper sent a real export**, and it was worth more than any amount of
  reasoning. Two files came: a `.tcl` first (a DE1 *profile* — every field
  empty, no curve, no date, and it could not have carried one, since a profile
  is a recipe rather than a record), then the CSV, which is the brew itself:
  2,107 sample rows and eleven meta rows.
- **It confirmed the v7.31.1 diagnosis outright.** `pressure` runs to 2,107
  samples and **every one of them is 0.00**. The key is present; nothing was
  ever applied through it. That is precisely the case that used to be filed as
  an espresso, and the peak-based reading handles it.
- **Their brew, parsed:** pour-over, 4 pours — bloom 44 g at 0:04, then 71 g,
  76 g, 61 g — ratio 1:16.9, drawdown 1:26, total 3:32. A real bloom-and-three
  Kalita recipe read back off nothing but the weight trace.
- **Three field names stopped being guesses**, taken from the export's own
  columns: `current_total_shot_weight` (what is on the scale),
  `flow_in`/`flow_out`, and `water_temperature_basket` /`_in` /`_boiler`. Added
  beside the ones already hunted rather than replacing them — the point of a
  hunt is that it covers more than one writer.
- **Two things only a real trace could have shown:**
  - **The gram grid was printing a scale's noise.** 251.3 g at the crest gave
    marks at 50 / 151 / 251. The gridlines round now (50 / 150 / 250); the
    *stated* figures under the plate keep the true reading, 14.9 → 251.3 g.
    Marks to read a shape against are a different job from figures to argue
    about, and they should not be rounded — or not rounded — together.
  - **`LOOM 44`.** Their timer ran before the water did, so the first pour
    starts at 0:04 and its band is a few pixels wide; the label centred over it
    hung off the left edge. Band labels now anchor to whichever edge they would
    otherwise cross. The width is estimated rather than measured, because
    measuring wants a DOM and `carta-plate.js` deliberately has none.
- **The date is still the one open question.** The export's meta carries
  `Date = 2026-08-23T16:49:35Z`, labelled *ISO8601 formatted date* — and
  `date` is already in `SHOT_TIME_KEYS`, ahead of `clock`. So if the JSON
  exposes it under that name or `start_time`, v7.31.4 already reads it. What a
  single sample cannot settle is whether Visualizer's own `Date` is the pour or
  the upload. Left as it stands rather than guessed at again; the fallback is
  the old behaviour, so nothing is worse meanwhile.
- **Tests: 121**, unchanged — every change here is either a name added to a
  hunt or a rendering rule, and the real brew is held as a fixture in the
  scratch harness rather than the pure suite.

## 2026-08-23 — v7.31.4: the date a brew was poured

- **Reported precisely, which made it quick:** "It's pulling the date that I
  uploaded it not the date it was created." Exactly right. The only timestamp
  Carta had was `clock` off the *list* row — the record's own — and for
  anything filed after the fact (most filter brews, since a scale syncs when
  it can) that is arrival, not pouring. Carta never once looked inside the
  brew for its own start.
- **`shotStartedAt` reads the payload**, preferring the pour's start over
  anything record-shaped, and `shotWhen` falls back to the list row where the
  file says nothing — so it is strictly better than what it replaced and never
  worse. I could not verify Visualizer's exact field name without the keeper's
  account, so it hunts the plausible ones the way every series already does;
  said plainly rather than presented as certain.
- **`tsToMs` is the gate**, and it is the part worth keeping: a shot file is
  full of bare numbers, and `200`, `27.4` and `18.2` are a duration, an
  elapsed second and a dose. Epoch seconds and milliseconds are told apart by
  magnitude; anything outside 2000 → now+2 days is refused. Without that a
  date hunt is a way to read a dose as a Tuesday.
- **`at` and `createdAt` stopped being the same fact.** Every cup used to be
  logged as it was drunk, so both were `now` and nothing noticed. Reading a
  brew off an instrument breaks that — you can pull Tuesday's brew on Friday —
  so a cup written from a shot takes the brew's own `at`, and the Journal,
  which orders by `at`, puts it where it belongs. `createdAt` still says when
  it was typed.
- **The shot screen names the day**, not just the hour. An hour on its own is
  only ever enough for something poured today, which is precisely the
  assumption this whole entry is about.
- **The waiting mark breathes under reduced motion now, and that is a
  deliberate reversal.** Reported twice as static; measured, and the cause was
  the keeper's own `prefers-reduced-motion`. Carta had been stilling it along
  with everything else. That was wrong: the preference is about **motion** —
  transforms, parallax, things that travel — and a 7px square changing opacity
  in place travels nowhere. A cross-fade is what platforms substitute *for*
  motion under that setting, not what they remove. Stilling it deleted the
  only signal the Atlas has that something is waiting and will expire, for
  exactly the keeper most likely to have the setting on. It now breathes
  slower and shallower there (3.2s to 55%, against 1.6s to 35%) — the
  accommodation rather than the removal. Everything that actually moves stays
  stilled.
- **Tests: 121** (+3), the date hunt and its refusals.

## 2026-08-23 — v7.31.3: the curve on the front page

- **Reported as a split, and the split was the diagnosis.** "The hero screen
  is having trouble pulling the curve data. It seems like it's there in
  journal but not in the hero." Those two surfaces read a shot by different
  routes, and that is the whole bug.
- **The watch reads a shot twice** — `?essentials=true` to know it is there,
  then `/download` in full for the curve. The first read has *no curve in
  front of it*, and the method is read off the curve. It defaulted to
  `'espresso'` and wrote that down; `'espresso'` is neither null nor empty, so
  `ensureShotCurve`'s fill-if-empty rule then declined to correct it when the
  real curve landed a moment later. A pour-over went through the espresso arm,
  which draws a pressure line a pour-over does not have: `d="null"`, an empty
  plate, peak `—`, and 3:20 stated as `200s`. The Journal never saw it,
  because its list fetches the whole file and parses the curve first time.
- **Two rules out of it**, both in `ARCHITECTURE.md` §7: a parse with no curve
  now leaves the method **blank** rather than guessing (the default moves to
  `shotMethod()`, where it is a reading rather than a record); and
  `ensureShotCurve` now separates `SHOT_FILLED` — what the *file* states, and
  is only ever filled into a blank — from `SHOT_DERIVED` — what the *curve*
  states, and is re-derived outright when the curve arrives.
- **The lesson under it is not about shots.** A two-call read has to say which
  fields the cheap call is entitled to have an opinion about. Getting that
  wrong is silent and surfaces three functions away from its cause. Second
  time in two days a *default standing in for a reading* has cost a visible
  bug — the first was `espresso_pressure` existing being taken for pressure
  having been applied.
- **The pulsing mark, checked rather than assumed.** Asked to bring it back, I
  measured it: present, 7×7, `#a63f2b`, square corners, `ca-breathe 1.6s`,
  opacity cycling 1 → 0.29. It was never gone — what was gone was the hero
  being worth looking at. One real difference from the board did turn up and
  is fixed: the trough was 25% where the board draws 35%. At 7px the deeper
  dip reads as a flicker rather than as something alive, which is the whole
  job of the one mark on the Atlas that expires. It stays still under
  `prefers-reduced-motion`, as everything does.
- **Tests: 118** (+1, guarding the blank method and that `shotMethod` still
  answers espresso at the point of use). The bug itself lives in the gap
  between two fetches, so it is held by a scripted hero harness that serves a
  curveless essentials payload and then the full file — the shape the pure
  harness cannot express.

## 2026-08-23 — v7.31.2: the brews come back, and the door reads a bag

- **A regression report, and it was mine.** "The last PR 125 broke the
  visualizer connection. No longer sees the brews." Reproduced in ten minutes
  by serving the new `index.html` beside the *previous* `carta-plate.js`:
  `parseVisualizerShot` called `shotPreinfusion`, which only the new plate
  had, threw a `ReferenceError`, and the throw landed inside
  `fetchVisualizerShots`' own per-shot `catch(e){return null}`. Every shot was
  filtered out and the screen said **"No brews on your Visualizer account
  yet."**
- **Two failures, and the second is the worse one.** The first is caching:
  `index.html` is the navigation document and gets revalidated; a
  `<script src>` beside it is an ordinary subresource and does not. Phase 19
  created that exposure and it slept for eleven versions, because no release
  until v7.31.1 had `index.html` newly *call into* a sibling. The second is
  that **a `catch` returning a neutral value turned a bug into a lie** — a
  programming error laundered into a calm, confident, false statement about
  the keeper's own account. The caching bug cost an afternoon; the swallowed
  error is what made it look like something else entirely.
- **Fixed three ways**: the tags carry `?v=<APP_VERSION>` (the actual fix, and
  now a stack law in `ARCHITECTURE.md` §1); `PLATE_VERSION` is checked at boot
  and says so plainly if the tag is ever forgotten; and reads across the seam
  are guarded with `typeof`, the same posture §7 takes with the network. With
  all three, the stale case now shows the brews *and* says to reload.
- **`fetchVisualizerShots` counts what it could not read.** A list where every
  shot failed no longer claims the account is empty — it says the account
  lists n brews and none could be read, which is true and points at Carta
  rather than at the keeper.
- **The door's paste parser, rewritten** (the other half of this version, and
  the thing actually asked for). It never looked at newlines — and a pasted
  bag is multi-line by definition. Their ledger has **four attempts at one
  coffee, three minutes apart**, each leaving a half-finished record: two of
  them named after the bag's own labels ("Country: Colombia", "Processing:
  Infused co-ferment"). It now reads lines; fills the origin fields the
  confirm step has always had and the parse could never populate; and stops
  treating a comma as a roaster divider, which had been filing "Ethiopia
  Gedeb, washed" under a roaster called *Ethiopia Gedeb*. The app's own
  placeholder states the convention it now follows: the dash divides, the
  comma belongs to the name. `doorParse` moved into the pure block and is
  tested — its wrongness was invisible, which is this project's whole standard
  for what gets a test.
- **One thing the report attributed to the parser that wasn't.** "Saint Frank
  Honduras DRD Geisha" as a roaster with an empty name came from the
  Visualizer pull, not the door: `bean_brand` held the whole string and
  `bean_type` was empty, and Carta copied both faithfully. Splitting it would
  be guessing, so it stands. Said plainly rather than quietly counted as
  fixed.
- **Tests: 117** (+5 for `doorParse`). The regression itself is covered by a
  scripted stale-sibling harness rather than a unit test — the failure only
  exists across two files at different versions, which is not a shape the pure
  harness can hold.

## 2026-08-23 — v7.31.1: the staircase, actually recognised

- **Reported with the ledger to prove it.** A pour-over was being filed as an
  espresso — the plate drew an arc, the figures argued peak bar, and the water
  came out blank. The keeper sent their own backup, which is what turned a
  guess into a diagnosis: a Kalita brew, 14.9 g, `timeSec: 200`, `waterG:
  null`, no `method`, no `pours`. Three brews and **two cups** off one pull.
- **The bug was reading the wrong thing.** v7.31.0's rule was *"an
  `espresso_pressure` array exists, so a machine wrote this."* It does not
  follow. Visualizer normalizes every upload into one DE1-shaped schema, so a
  brew logged from a scale arrives **carrying** that key with a series flat at
  zero. The key being present says nothing; whether pressure was ever
  **applied** says everything, and the series states it outright. The reading
  is the peak now — under 2 bar, not an espresso, whatever keys the file
  carries. Two bar clears this keeper's own lever ("Direct lever 5bar-2bar")
  several times over, which their ledger let me check rather than assume.
  A flat-zero pressure line is also dropped rather than inked along the axis.
- **Their case, reconstructed and now correct**: method `pourover`, water
  225 g (was `null`), four pours read off a noisy real scale trace, ratio
  **1:15.1** — against their own Setup note, *"1:15 92C"*. That corroboration
  is the reason to believe the pour reader on real data and not just on the
  board's synthetic curve.
- **Pre-infusion, off the curve.** Visualizer states a `preinfusion` field on
  some files and not others; the pressure line has always shown it — the fill
  holds low, levels off, then ramps. `shotPreinfusion` reads that plateau and
  states **both** halves, duration and the pressure it held. Verified against
  the design board's own profile: it states *4.2 s at 2.9 bar*, and the curve
  alone says exactly that. A profile that ramps straight to nine bar states
  **nothing** — `null`, not zero, because "no pre-infusion" and "the file
  forgot to say" are different facts and only one of them is one.
- **The machine.** A field Visualizer states and Carta was not reading.
  Hunted across plausible names (`firstStr`, the string half of the hunt
  `shotCurve` already does over series). The espresso ledger states it beside
  the profile it was pulled on; a filter brew takes it as its **brewer**,
  because some writers put "Kalita Wave 185" there for want of another field.
  `profile_title` is the profile, not the machine, and gets its own row.
- **The duplicate their ledger caught, fixed.** The same shot was written as a
  cup twice, three brews deep, because nothing between the shots list and
  *This is the cup* ever asked whether the record already had it — `cupOfShot`
  existed and only the hero consulted it. The door states the fact and opens
  the cup that exists rather than refusing: the keeper can still put that cup
  away and pull again, which is the honest way to redo one.
- **Tests: 112** (+5), including the flat-zero case as its own fixture, a
  lever at 5 bar (must stay an espresso), a trickle under 2 bar (must not),
  and the pre-infusion reader against the board's profile plus a straight ramp
  and a noisy one.
- **On using the backup:** it carries `visualizerPassword` and `askKey`. Read
  for record shapes only; neither was used, and no live call was made with
  them. Worth stating once, because a ledger export is the keeper's whole
  record and this is the first time one has been handed over for debugging.
- **For the founder's desk, seen in passing and not touched:** several
  coffees in that ledger have a whole pasted bag in the `roaster` field with
  an empty `name` ("Saint Frank Honduras DRD Geisha"), and two have label
  fragments as names ("Country: Colombia", "Processing: Infused co-ferment").
  That is the door's paste parser, not this phase, and it is a real gap —
  logged here rather than fixed mid-flight.

## 2026-08-23 — v7.31.0: a pour-over is a staircase

- **Phase 26's second method, from the design board's turn `2a`** (stations
  10–14, `SPEC-phase26-pourover.md`). Same account, same call, same road —
  a different drawing and different figures underneath it.
- **The gate was called before the arm was written, as the spec demanded.**
  §8: *"Two plate arms rather than one deepens the estimate. The plate
  renderer moving out stops being the honest candidate and becomes the
  decision: make it at the phase gate, before the second arm is written."*
  Put to the founder with three options priced — a new file, an append to
  `carta-map.js`, or landing inline again — **the call was the new file.**
  A plate is not a map, and a file whose own name stops being true is the
  exact failure `ARCHITECTURE.md` exists to prevent.
- **So the app is three files now, and that is a stack-law amendment.**
  `carta-plate.js` holds both arms — `shotCurve`, `shotPours`,
  `shotFigures`, `shotMethod`, `platePaths`, `shotAt`, `shotPhase`, `mmss`
  (pure) plus `plateSVG`/`figsHTML`/`plateBoxHTML`/`scrubReadHTML`/
  `plateScrub`. `index.html` came back to **5,945 / 5,000** *having gained
  the whole second method*; without the split it would have landed near
  6,400. **The line debt is not closed** — 945 over, and the split paid for
  the new work rather than the old. "Two files, no build" was never really
  about two: it is *no bundler, no npm, nothing between the source and the
  host*, and a third `<script src>` costs none of that. A fourth still needs
  the same argument written down.
- **What the second arm actually is.** The method is read off the file, never
  off a brewer's name: a machine writes pressure and a scale does not, so the
  *absence* states it. From the water-in series `shotPours` reads the pours
  back — a rise is a pour, a flat run is the wait after it, and the last
  wait is the drawdown because nothing was added after it. Everything on the
  screen follows from refusing to flatten that into one curve: the bands are
  the pours, the gaps are the bed letting go, the grid is grams off the water
  actually added rather than an invented scale, the ticks are minutes, and
  there is no flow line because for a pulsed pour it is a square wave that
  only restates the bands.
- **Two things the board got exactly right and the code now reproduces
  exactly:** the bloom is the *whole bloom phase* (first drop to second
  pour), not the pour that starts it — so it is null on a brew poured in one
  go rather than mislabelling its only wait; and every gap after the bloom
  reads *drawing down*, not only the last. The first draft invented a
  "waiting" phase for the gaps between pours; the board was right and it was
  removed. The bed is always draining.
- **`agitation: unread`** is the honesty gate landing harder than it ever has.
  The hand is half the recipe for a filter brew and no instrument records it.
- **Retired: "A pour-over leaves no shot file."** True of a machine's file,
  false of a scale's. Typed entry keeps everything and stays one door back in
  the Journal — it is the fallback for an *unconnected* brew now, not for a
  method.
- **Tests: 107** (+9), including both cases §8 named as the ones that would
  fail invisibly — a brew poured in one go, and a file that ends
  mid-drawdown. The harness now slices two pure blocks, plate first, because
  `parseVisualizerShot` reads across that seam.
- **One real bug caught only by walking the flow to a written cup:**
  `thinCurve` rebuilt the stored curve field by field and silently dropped
  `wIn` and `method`, so a pour-over's plate drew on the shot screen and then
  vanished from the cup it was written into. Fixed; it is exactly the class
  of thing the browser pass exists for and the unit tests could not see.
- **Parked, not absorbed** (the spec's own §9, kept): **pour along** — the
  record read back as a recipe, counting you into each pour. It is the
  obvious next joy and it is a whole feature: a timer, a screen that stays
  awake, and a decision about what happens when you fall behind. A
  compliment. Also parked: bloom ratio as a stated figure (wants the taste
  model to have an opinion first) and kettle temperature as a curve (no file
  states it; inventing one is the exact thing `unread` exists to prevent).

## 2026-08-23 — v7.30.0: the design board, QC'd

- **A gap pass, not a phase.** The founder walked the Phase 26 design board
  (`Coffee at home — the shot comes to you.dc.html`, nine stations) against
  what PRs #118–#121 actually shipped and named eight gaps, station by
  station. This is the pass that closes them. **The board is the truth** was
  the standing instruction, and where the board and the file disagreed the
  board won.
- **Four were real defects, and three of the four were invisible from the
  code alone** — each needed the live shape of Visualizer's own file, or the
  live shape of an installed PWA, to see:
  - **The watch never re-fired (station 03).** "Once per app open" had been
    implemented as *once per script run*. An installed PWA resumes from the
    background far more often than it loads cold, so a shot pulled between
    two visits was never looked for — `_vizChecked` had been true since the
    install's first paint. A resume after 90 s away now counts as an open.
    Still one call per open, still never a poll; the gap is what holds that.
  - **Grind and water read `unread` on every shot ever opened (station
    04).** Both are absent from `?essentials=true`, and `fetchShotFull` —
    added by the v7.28.1 patch — was throwing away everything but the curve
    (`.then(shotCurve)`). It parses the whole file now and fills only what
    the cheap call left null, never overwriting a stated figure. The water
    also needed `shotTempGoal`: what Visualizer's page calls "basket temp
    goal" is a *series*, not the scalar `d.temperature` the parser was
    reading, and there is no such key. A flat goal is a stated setting, so
    taking it is not the inference the honesty gate forbids — a goal that
    ramps still reads `unread`.
  - **The gentle join never fired for a hand-typed coffee (station 05).**
    `doorPullResolveCoffee` scoped its search to the resolved roaster's own
    coffees, so two ordinary cases minted a duplicate silently: a shot whose
    file names no roaster (`bean_brand` is very often blank), and a shelf
    coffee typed by hand whose `roasterRef` was never resolved. It falls
    back to the whole shelf now — **and asks every time it matches outside
    the roaster's own scope, however exact the name**, because two roasters
    can both sell a Kirinyaga AB. The offer-never-merge law is what that
    second half is protecting.
  - **Station 08's rows drew no curve.** Same `essentials` discovery again:
    the list already spent one call per shot, so it asks for the whole file
    instead. Call count unchanged; it also buys back the later per-shot
    fetch. The *bounding box* the founder saw was a plain CSS collision —
    `class="plate thumb"` was inheriting `.thumb`'s photo-thumbnail border.
- **The design-system half.** `.btn` now speaks the board's one size
  (13px/500 uppercase, .08em, 13px padding — the shape `.timer .ctl` already
  used); `.chk` is a drawn permission box rather than the browser's control,
  on the pale card inset the board specifies; the cup page takes the board's
  header and its `.reading` score row. Both of the app's ruled borders came
  off — `body`'s edge and the `body::before` inset, "the leaf, ruled twice"
  from Phase 12 — since no station on the board is drawn inside a frame.
- **Two calls worth arguing with, both recorded rather than slipped in:**
  - **The ember came off the bar's door — and went straight back on.** `＋ A
    cup` had been an accent slab since Phase 12; the board draws all four bar
    items in one rhythm, so the pass took the ember off. This was **not** one
    of the eight stated gaps — it followed from "the board is the truth,"
    which is a weaker warrant, so it was named in `ARCHITECTURE.md` §6 to be
    argued with rather than discovered. It was, immediately: **the founder's
    call was to restore it.** The board is the truth about the screens it
    draws; the bar is chrome it inherits rather than argues, and the app's
    one standing invitation to log a cup counts as the live action
    `SUBBRAND.md` reserves the accent for. Reverted whole, comment amended to
    carry the decision. Worth logging as the pass's own lesson: "the board is
    the truth" does not extend past what the board actually draws.
  - **Phase 27's ground lost the cup page.** #122 merged mid-pass and put
    `coffeeGroundHTML` where the photo had been; the board's station 07 has
    no hero of any kind. The board won, but `coffeeGroundHTML` and
    `.hero`/`.slot` are left **unmounted rather than deleted** — putting the
    ground back is one line in `vCup`. It still draws on the coffee card and
    the list rows, which the board says nothing about and this pass did not
    touch.
- **Line band: 5,983 / 5,000 (400 KB of 500).** ~180 lines added to a debt
  that was already 800 over, making it the largest the project has carried.
  Named, not minimized (`ARCHITECTURE.md` §1). The plate is still the
  candidate to move into `carta-map.js` (~135 lines, pure geometry) and
  nothing here made that harder.
- **Tests: 98 passing**, +2 for `shotTempGoal` and its round trip through
  `parseVisualizerShot`. Verified in headless Chromium against a stubbed
  Visualizer, in paper and dusk, across stations 01–09; the resume gate and
  the duplicate-coffee case both have their own scripted checks.
- **For the founder's desk, not built:** the `.sub` on station 02 is longer
  than the board's, because the extra sentence is the disclosure that this
  is a real account password rather than a scoped key. Trimming it to match
  the board would cost a network-posture statement, so it was left.

## 2026-08-23 — Phase 27 (v7.29.0): photos retired, the ground instead

- **Shipped — v7.29.0.** Reported directly: a coffee couldn't save, storage
  might be full. The photo store (`carta7.photos.v1`) was the cause — it was
  always the one storage-budget risk (`ARCHITECTURE.md` §3 named it as such
  from the start) and this keeper's device had simply reached it.
- **Reopened decision, not a bugfix.** Photos were `PIVOT.md` §12's decision
  #1 — "the deepest break with current law," shipped deliberately at Phase
  4. Put to the founder directly (storage-full, get rid of photos
  completely), the call was to retire them a second time, for good, rather
  than raise the quota guard or trim compression further. `PIVOT.md` §12 and
  `ARCHITECTURE.md` §3/§4 both amended to record it.
- **What came out:** the separate photo store and its whole read/write path
  (`loadPhotos`/`savePhotos`/`setCupPhoto`/`getCupPhoto`/`deleteCupPhoto`),
  the upload slots on both cup-logging flows and the cup's own hero, the
  `cupHeroPicked` after-the-fact add, and `cup.photo` from the data model.
  `compressPhoto` stays — the menu-capture OCR reference photo still uses
  it, and that capture was never kept, so it never grew the ledger.
  `load()` now clears a stale `carta7.photos.v1` and any lingering
  `cup.photo` the first time this version runs, reclaiming the space
  without the keeper doing anything.
- **What went in instead, everywhere a photo used to stand:** the coffee's
  own ground, drawn as detailed as the record can defend
  (`coffeeGroundPin`/`coffeeGroundHTML`/`coffeeCardMapHTML`, reusing the map
  vocabulary the walk-down-a-country chapters already had — `farmPin`,
  `regionPin`, `streetsHTML`, `<carta-belt>`). A placed farm draws real
  terrain; failing that, the mean of the region's other placed farms;
  failing that, the country's own washed shape; failing that, an honest
  line that the bag names no origin yet. The Journal and a coffee's cup list
  carry the same ground as a soft silhouette (`plotThumbHTML`, reused
  outright rather than a live map — Phase 17 already learned that lesson
  for a café row). The shareable coffee card, which can't carry a custom
  element once it's standalone, gets the same shape drawn static.
- **Verified:** `node test/model.test.js` (96/96, untouched — none of this
  touches the pure block), a syntax check on the extracted script, and a
  headless run seeding coffees at farm/region/country/no-origin detail —
  every tier degrades the way it's meant to, no console errors, and a
  simulated stale `carta7.photos.v1` (~540 KB) is gone after one reload with
  no page error. The live `<carta-plot>`/`<carta-streets>` floor renders
  blank in this particular headless harness even on unmodified code
  (checked against the untouched producer page's own "its ground" panel) —
  a harness quirk, not a regression, and `<carta-belt>`'s country-level
  fallback renders correctly in the same harness.

---

## 2026-08-23 — Phase 26 patch (v7.28.3): flow, off the scale

- **Shipped — v7.28.3.** Same keeper, same shot, one more round: after
  v7.28.2 fixed pressure and weight, flow — the "ml/s" line and the scrub
  readout — was still blank. Reported directly, plainly: "the ml/s is also
  not reading from the visualizer."
- **The shot's own `espresso_flow` really is `null`** — this particular
  machine has no dedicated flow sensor, which turns out to be true of most
  of them. But the same live response already fetched for the v7.28.2 fix
  carried a second field nobody had looked at: `espresso_flow_weight`, 1,057
  samples where the rest of the curve has 1,081. Integrating it against
  elapsed time by hand reproduces the shot's own final weight almost
  exactly — 52.1 g computed against 52.2 g logged — which is about as
  direct a confirmation as this kind of reverse-engineering gets: Visualizer
  computes flow off the scale itself when there's no flow meter, under a
  name Carta never thought to try.
- **Two bugs, compounding.** `shotCurve` never had `espresso_flow_weight` in
  its list of flow keys at all. And even with the key added, its own length
  guard (`a.length>=n`) would have thrown the series out anyway — written
  for a payload shape where a length mismatch meant garbage data, not a
  reading that simply stops a beat before the rest of the clock does. Fixed
  both: `espresso_flow_weight` is now a fallback flow key, tried after the
  sensor-based one; and the length guard is gone, since `platePaths`' own
  `line()` already maps over whatever series it's handed — a shorter one
  just draws a shorter line, which is the honest shape of what the file
  actually states, not a crash or an invented stretch.
- **Verified against the same real shot, not another stub.** Direct
  integration by hand first (confirming the field means what it looks like
  it means before trusting it in the app), then a sandbox run of the
  updated `shotCurve` against the actual captured API response (flow now
  present, 1,057 samples, peak 5.47 ml/s), then headless Chromium with that
  same response stubbed into the fetch: the flow path draws, the scrub
  readout states a real "ml/s" figure instead of "—", 0 page errors. A new
  pure case locks in both the fallback key and the shorter-series behavior.
  96/96 pure tests passing.

---

## 2026-08-23 — Phase 26 patch (v7.28.2): the curve, actually there — for real

- **Shipped — v7.28.2.** v7.28.1 fixed which call Carta made for a shot's
  data; it turned out that wasn't the whole bug. The keeper who reported
  the original issue tried the fix and reported back that the plate was
  still empty — and sent a backup export in for debugging.
- **The backup alone couldn't answer it, so the live API did.** Curves
  keep out of the ledger by design (`carta7.shots.v1`, a separate key), so
  a JSON export can't show whether a curve was ever fetched or persisted.
  What it *could* show was a brew with a real `vizShotId` from that same
  day — proof the keeper had actually pulled a shot and hit the bug live,
  not a stale report. With that shot id in hand, the actual live
  `/download` response for that exact shot was fetched directly (through
  the same Basic Auth path the app itself uses) and diffed field by field.
- **The finding: Visualizer splits a shot's curve across two containers,
  not one.** The elapsed-seconds series (`timeframe`) sits at the top of
  the response; pressure, flow and weight sit nested under a `data` key.
  `shotCurve` had only ever searched a single container per call — an
  assumption baked in since Phase 26 shipped and never actually checked
  against a live payload. Every fixture written for it, including the new
  one added for v7.28.1's own fix, used a flat shape that happened not to
  exercise the split, so the pure harness stayed green through both bugs
  without ever catching either.
- **Fixed by hunting every key across both containers**, and verified
  against the keeper's own real shot rather than another invented stub:
  1,081 real samples, pressure and weight both reading correctly, no flow
  sensor on that particular shot (a legitimate absence, drawn as one). A
  new pure case locks in the split shape specifically, alongside the
  existing flat one. 95/95 pure tests passing.
- **A note on how this was debugged, for the record.** The keeper's backup
  file carries `visualizerEmail`/`visualizerPassword` in plain text inside
  `prefs` — by the same design `ARCHITECTURE.md` §7 already names and
  defends (Basic Auth, no scoped token available to a static app). Using
  it to make one direct, read-only diagnostic call against the live API
  was the fastest way to close this out correctly instead of guessing a
  third time; the password was never printed or logged anywhere in the
  process.

---

## 2026-08-23 — Phase 26 patch (v7.28.1): the curve, actually there

- **Shipped — v7.28.1.** Phase 26's plate was drawing empty for every
  keeper, from the first day it shipped. Every call the phase made for a
  shot's own data — the watch's own check on opening, the Shots list, the
  door's own picker — asked Visualizer for `?essentials=true`, and that
  flag was already known, and written down, from Phase 24's own research:
  it returns metadata **without the curve arrays**. Nothing in the shipped
  code ever made the other call, the one that actually carries pressure,
  flow and weight, so `shot.curve` was `null` on every single path and the
  plate always fell back to "This shot came without its curve" — no matter
  how plainly Visualizer's own app showed the same shot's curve.
- **Caught by a keeper, not by review.** Reported directly: "it's not
  showing up even though it's shown in Visualizer." Traced through the
  same chain the report named — the fetch, the parse, the cache, the draw —
  and confirmed against `ROADMAP.md`'s own Phase 24 research rather than
  guessed: the finding was already on the record, just never connected to
  the plate feature that shipped two phases later.
- **The fix keeps the shape Phase 26 already promised.** The Shots list's
  own copy already said "only the one you pick is read in full" — that
  promise just had no code behind it. `ensureShotCurve` is the code now:
  the cheap `essentials=true` calls stay exactly as light as they were
  (the list, the once-per-open watch check), and the one shot actually
  opened — station 04's own screen, or the row picked at the door — gets a
  second, real `/download` before its plate draws or its curve is ever
  persisted via `setShotCurve`. Cached per shot id, so the same shot is
  never fetched twice in one sitting, and the door's own picker (which
  never opens the shot screen) gets the same guarantee by awaiting the
  fetch at `doorPullPicked`, the one choke point both entry paths already
  shared.
- **What stays intentionally blank:** the Shots list's own row thumbnails,
  and the Atlas hero's hairline before the shot screen is opened once —
  both still read off the cheap essentials-only fetch, by the same design
  Phase 26 shipped with. Fetching all eight rows in full to populate every
  thumbnail would be the sweep the network posture already rules out;
  "only the one you pick is read in full" was always meant to describe
  that tradeoff, not a bug in it.
- No new pure functions — `ensureShotCurve`, `fetchShotFull` and the
  now-async `doorPullPicked` all reach the network or `pageView`, so none
  of them sit inside the test markers. 94/94 pure tests unaffected.

---

## 2026-08-23 — Phase 26: the shot comes to you

- **Shipped — v7.28.0.** Coffee measured at home, rebuilt around the shot
  file. Turn the watch on (opt-in, off by default) and Carta looks once per
  app open for the shot the keeper just pulled — no poll, no sweep. Found
  and unlogged, it takes the Atlas's own hero: the question the Atlas
  usually asks steps down one slab into the lift, and the shot waits as a
  stated fact with the cup already attached to it. Write the cup or say
  *Not mine* and both reverse. A shot draws as a **plate** now instead of a
  row of dials — pressure, flow, what landed in the cup, scrubbable by
  drag — at three sizes: full-bleed on the shot's own screen, a hairline
  once a cup is written, a 44px thumb on the new Shots list off the
  Journal. The gentle join is Phase 25's, reused verbatim — station 05
  appears only when it's owed.
- **The honesty gate widens with the surface.** Visualizer states no
  confirmed scalar for water temperature or preinfusion; both read
  `unread` on the plate rather than being derived off the pressure curve,
  which would be an interpretation Carta isn't willing to make.
- **A curve keeps out of the ledger.** ~3 KB of pressure/flow/weight
  samples per cup would stop a backup being a thing you can read as text —
  the same ruling `ARCHITECTURE.md` already made for photos. Curves live in
  their own key, `carta7.shots.v1`, thinned to ≤400 samples; the ledger
  itself moves exactly two fields and two prefs.
- **The line band, disclosed rather than crossed quietly — the largest
  overage yet.** `index.html` lands at 5,800 lines / 383.4 KB, 800 over the
  5,000-line ceiling Phase 19 closed the debt on (bytes comfortable). The
  plate's own pure geometry (~135 lines, no coupling to `D` or the DOM) was
  the named candidate to move into `carta-map.js` at this gate, the way the
  map layer itself moved at Phase 19 — it stayed inline instead, by the
  founder's call, because this phase's build had no `carta-map.js` to
  append to and no way to verify the seam without one. Named as debt, not
  amended; the candidate stands for whichever phase next touches that
  file. See `ARCHITECTURE.md` §1.
- Verified end to end in headless Chromium, paper and dusk, Visualizer
  stubbed, all nine stations with no page errors — plus the branches
  (*Not mine* surviving a re-open, Undo handing back what was typed, watch
  off making zero calls, a curveless shot, the curve surviving a reload
  with the network cut) and the regressions (Phase 25's door, Phase 24's
  dial-in picker, a typed brew's impression sheet). 94/94 pure tests,
  including new `shotCurve`/`shotFigures`/`platePaths`/`shotAt` coverage.

---

## 2026-08-22 — Phase 25: the pull, at the door

- **Shipped — v7.27.0.** `＋ A cup` gains a third way in beside pasting and
  typing: **Pull it from Visualizer.** A synced shot already carries two of
  the home path's three records (the coffee, the brew), so picking one
  skips straight to "What was in the cup?" — nothing typed but the taste.
  The roaster and the coffee each get one gentle-join question if Carta
  isn't sure (exact spelling joins silently, near asks once, else it's a
  new record); the Setup gets no question at all, matched silently on an
  exact grinder-name fold or left as whichever Setup is already current.
  Always a home brew — a synced shot is one by definition, so the button
  is hidden from a door opened at a café.
- **The manual dial-in screen keeps its own job.** A pull only replaces
  *recording* numbers a machine already wrote down; *planning* — "begin
  from the last cup, change one thing" — happens before any shot exists
  and no sync can take it over. Nothing about the typed path changed.
- **A finding, logged rather than folded into this phase.** While bumping
  `APP_VERSION` and writing this phase's own `CHANGELOG` entry, no code
  anywhere in `index.html` was found reading either constant back out —
  **the What's New sheet `CLAUDE.md` describes does not exist in the
  shipped file.** Every changelog entry since v7.0.0 has been written and
  shown to no one. Not fixed here — it's a real but separate gap, and
  building that sheet deserves its own small pass rather than riding along
  inside this phase's diff. For the founder to pick up.
- **The line band, disclosed rather than crossed quietly.** This phase's
  matching logic is real new surface — a new entry path with its own
  roaster/coffee/Setup resolution, not a patch. `index.html` lands at
  5,141 lines / 341.0 KB, 141 over the 5,000-line ceiling Phase 19 closed
  the debt on (bytes still comfortable). Larger than Phase 24's 12-line
  remainder because this is a bigger phase; whether it deserves its own
  future split, or whether the band itself is due another look, is put to
  the founder rather than decided here. See `ARCHITECTURE.md` §1.
- Verified directly: the button is absent at a café-context door; an exact
  roaster or coffee joins with no question, a near one asks once each, and
  declining still finishes the pull as its own new record; a Setup matches
  silently or falls back to the current one, and a fresh ledger with none
  at all mints one from the shot's own grinder name; a shot matching no
  Setup and naming none refuses the same way manual entry already does.
  85/85 pure tests, including extended `parseVisualizerShot` coverage and
  new `normalizeRoastLevel`/`matchSetupByGrinder` cases.

---

## 2026-08-22 — Phase 24: pulled, not typed

- **Shipped — v7.26.0.** A **Pull from Visualizer** button on `vBrew`
  fetches the keeper's own recent shots from `visualizer.coffee` and fills
  the dose/water/time/grind dials with a picked one's numbers, landing in
  the same editable dial state manual entry already writes to. Manual
  entry is unchanged and never gated behind having an account.
- **A correction, made before building, not after.** Scoping had said
  "auth is a separate secret token, not the account password," taken from
  a search summary never checked against the primary source. Fetching
  Visualizer's actual OpenAPI spec directly showed Basic Auth is genuinely
  the real email and password — and that Visualizer's own docs recommend
  OAuth instead, by name, for exactly this shape of integration, to avoid
  a third-party app collecting a keeper's password. Put to the founder
  directly with both options; the call was **Basic Auth now**, accepting
  the tradeoff. `openVisualizerKey()`'s own copy states this plainly
  rather than softening it, and `docs/ARCHITECTURE.md` §7 carries the
  correction and the full reasoning, named rather than quietly overwritten.
- **What the live API settled that scoping had guessed at:** the list
  endpoint takes `?page=&items=`, not `?limit=`; `?essentials=true` on a
  shot's detail route omits the curve arrays (confirmed by diffing against
  the full response); and — the one real surprise — **no scalar
  temperature field exists anywhere**, only curve arrays. The scoping
  guess that one "almost certainly" existed was wrong; the temp dial stays
  exactly as manual as it always was rather than inventing a number from a
  curve. Pourover is still confirmed-possible-not-confirmed-in-shape and
  stays unbuilt this pass.
- **No link out to Visualizer's own graph.** No confirmed public URL
  pattern for a shot's own page turned up during research; guessing one
  risked shipping a broken link, so it was left out rather than shipped
  wrong.
- **A bug found and fixed on the way in.** A second, fully-shadowed
  `openBrewFlow` — dead since Phase 13 moved the brew flow into its own
  screen, silently overwritten by the real one and unreachable — was still
  sitting in the file. Deleted (42 lines, no behavior change).
- **The line band, disclosed rather than crossed quietly.** `index.html`
  lands at 5,012 lines / 333.9 KB, 12 over the 5,000-line ceiling Phase 19
  closed the debt on. Comments and code were tightened before this was
  accepted; the remainder wasn't judged worth cutting into the feature
  for. See `ARCHITECTURE.md` §1.
- Verified directly: the button opens the account sheet first with no
  credentials set; a saved Basic Auth header reaches Visualizer and a
  picked shot's numbers land in the right dials; a wrong password's 401
  and an empty shot list both degrade to a stated message. 83/83 pure
  tests, including four new `parseVisualizerShot` cases.
- Phase 25 (moving the pull to the door) is still scoped and waiting,
  unbuilt.

---

## 2026-08-22 — Phase 23: the cup, compared

- **Shipped — v7.25.0.** A coffee's own page listed a bare cup count and
  nothing behind it; it now lists every cup, home and café both, newest
  first. A café cup states the place; a home brew states its Setup and
  technique. Each carries its own score, and a photo where the cup has
  one — the same lead the Journal's own rows already use.
- **No new door.** Tapping a row opens that cup's own screen, which
  already carries a café cup on to the café itself — the "tappable
  through to the place" the phase asked for needed nothing new, `vCup`
  already does it.
- **No average, no rank — the one thing the phase named as off-limits.**
  Every figure shown is one cup's own reading, never a figure computed
  across the coffee's cups.
- Verified with Playwright: a coffee with a home cup and a café cup lists
  both correctly, in both themes; tapping the café row lands on a screen
  naming the café; a coffee with no cups states "No cups yet" and renders
  no rows. 79/79 pure tests unaffected.
- Phases 24 and 25 (the Visualizer pull, and its home at the door) are
  still scoped and waiting, unbuilt.

---

## 2026-08-22 — The pull moves to the door: Phase 24 re-aimed, Phase 25 added

- **Not shipped — a design decision, taken before either phase was built.**
  The founder asked the right question about the scoping done earlier the
  same day: if a Visualizer pull becomes the *primary* way a home cup gets
  recorded, then a button inside the dial-in screen is the wrong home for
  it, and the manual logger — the app's own first idea — is no longer the
  main path. Where does the pull actually live?
- **The finding that settled it.** Read the live shot payload against
  Carta's own three-record home path (coffee → brew → cup): a synced shot
  carries **two of the three already filled in**. `bean_brand`/`bean_type`/
  `roast_date`/`roast_level` is the coffee; `bean_weight`/`drink_weight`/
  `duration`/`grinder_setting` is the brew. The only thing it cannot carry
  is Carta's own reading — so the pull doesn't fill a form, it **replaces
  the first two steps of the home path and lands on `openImpression`**.
- **So: the door, not "add a coffee."** `openCoffeeForm` is a shelf
  operation (a thing you own, no cup attached); a synced shot is an
  **event**, which is exactly what `＋ A cup` is for. And the door already
  does this work — `doorParse` reads a roaster and a coffee out of pasted
  text and offers the gentle join; a pull reads the same two facts out of
  JSON and offers the same join. One more branch on an existing screen,
  not a new subsystem.
- **Adopted, and written into `ROADMAP.md`:** Phase 24 stays the
  *connection*, built inside the brew flow where the coffee is already
  chosen and nothing must be matched — the smallest place to prove it end
  to end. **Phase 25 (new)** moves the entrance to the door. Sequenced
  that way on purpose: the risk lives in the connection (token, shot list,
  the still-unconfirmed pourover shape), not the navigation.
- **This un-parks the matching item parked this morning** — entering from
  the door, there is no coffee context, so Carta must decide which coffee a
  shot is. Recorded as still *not* a resolver: the roaster goes through the
  existing `matchNode`, the coffee name through the same pure `matchNodes`
  against that roaster's own coffees, exact joins silently, near asks once.
  Same law as the paste path, one more field. If it ever wants a score or a
  rung, it's Lotmark's.
- **`espresso_enjoyment` is deliberately never mapped to Carta's 1–9.** A
  converted figure couldn't state its reasons, and the taste model rests on
  figures that can. The keeper's reading stays typed, always.
- **The manual path is re-roled, not demoted.** The dial-in screen fuses
  *recording* (which a pull takes) with *planning* — "begin from the last
  cup, change one thing" — which happens before any shot exists and no
  sync can take. That's joy #4 and it survives untouched. Nothing about the
  typed path is removed, gated, or hidden behind having an account.
- **Newly parked:** a batch "sync all my shots" importer — one event at a
  time is the door's discipline, and a sweep would mass-mint coffees never
  tasted, the same shape Phase 22 refused for the shelf.

---

## 2026-08-22 — Phases 23 and 24 scoped: the cup, compared; pulled, not typed

- **Not shipped — scoped only.** The founder asked for a Visualizer
  integration on the dial-in screen: pull shot data from an Argos machine
  (via its own app) or a BOOKOO scale (via BOOKOO N), rather than retype
  dose/yield/time/grind by hand, with manual entry kept as the fallback —
  plus deeper linking between a home pull and the café cups of the same
  coffee, drawn from the Atlas. Explicitly framed as a general Visualizer
  integration, not gear-specific: any keeper with any Visualizer-synced
  equipment should get the same pull, which is exactly the shape scoped.
- **Researched before scoping, not assumed.** Confirmed directly against
  the live API: Visualizer (`visualizer.coffee`, an independent, actively
  run community service — `github.com/miharekar/visualizer`) has
  wide-open CORS (`access-control-allow-origin: *`), so a plain browser
  `fetch` reaches it with no server — the "no server" invariant holds. Its
  own docs show Bearer-token auth for exactly Carta's "personal script"
  shape, meaning keepers paste a separate secret token, not their real
  account password. A real shot record's fields were pulled and inspected
  directly, confirming a clean map onto Carta's own brew fields
  (`bean_weight`→dose, `drink_weight`→yield, `duration`→time,
  `grinder_setting`→grind, `bean_brand`/`bean_type`/`roast_date`/
  `roast_level`→a coffee's own identity fields).
- **Split into two phases, sequenced by dependency and risk:**
  - **Phase 23 — the cup, compared.** No Visualizer dependency at all,
    ships regardless: a coffee's own page currently states a bare cup
    count and shows none of them. Every cup — home and café both, each
    café one linked to its place — replaces that count. Pure UI on data
    Carta already carries.
  - **Phase 24 — pulled, not typed.** The actual integration: BYO
    Visualizer token, a "Pull from Visualizer" button inside the existing
    brew flow, filling the dial-in fields from a picked shot. Explicitly
    does not redraw Visualizer's own pressure/flow curve inside Carta —
    that's a charting engine, not a form field — a pulled shot links out
    to its own Visualizer page instead. Espresso's field shape is
    confirmed; pourover is confirmed *possible* (BOOKOO N does sync pours)
    but its exact field shape still needs inspecting against a real synced
    pour before that half is built — named as an open item, not guessed
    at.
- **Deliberately parked, not built into v1:** matching a pulled shot's
  `bean_brand`/`bean_type` against the keeper's own coffees to suggest a
  new coffee record — v1 only ever attaches a pull to the coffee already
  open in the brew flow. A real identity-matching pass across pulled
  shots is a good idea for a later phase, not this one.
- Full write-ups (joy, what's confirmed vs. still open, what it must not
  become, done-when) are in `ROADMAP.md`, Phases 23–24, scheduled but not
  yet built.

---

## 2026-08-22 — Phase 22: search, on your own key

- **Shipped — v7.24.0.** A "Search for more" button on the coffee form,
  beside Done, hidden until a roaster or name has minted the coffee
  (Phase 21's own gate). One BYO-key model call — `callModel` gained an
  optional `tools` argument so the same `api.anthropic.com` row already
  used by the ask and the menu OCR could be handed Anthropic's server-side
  web-search tool (`web_search_20260209`) — searches for the exact coffee
  and fills in only the origin fields still blank: country, region, farm,
  producer, variety, process, altitude, mill. Each fill names its source
  in one status line under the button; nothing already typed is ever
  touched, and a coffee with every field already filled never spends a
  call at all.
- **The tripwire named at scoping time held.** The fuller version — cross-
  source matching, corpus-wide correction — stayed exactly what it was
  flagged as: `docs/RESOLVER.md`'s own machinery, Lotmark's, not built here.
  This phase's own prompt states plainly that a field with no real source
  gets left out, never guessed.
- **One deviation from the scoped write-up, recorded honestly:** the design
  called for one attribution line under every individual field; it shipped
  as a single shared status line below the button instead — simpler to
  build, reads as one settled fact rather than eight fragmented notes, and
  still names the source per field. `ROADMAP.md`'s Phase 22 entry carries
  the full account.
- `cfSearchPrompt` and `parseCfSearch` are pure and now tested
  (`test/model.test.js`, 79/79) — the parser was checked directly against
  an adversarial case: a mock response volunteering a value for a field
  the keeper had already typed, which the parser correctly refused to
  pass through, since it only ever fills the keys it was told were blank.
- Verified with Playwright against a stubbed `fetch` (no real key spent):
  the request actually carries the search tool, the no-key path opens the
  key sheet instead of calling out, and the all-filled short-circuit never
  reaches the network.
- Both Phases 21 and 22 — the whole ingest-upgrade conversation — are
  closed out now. Nothing further parked from this thread.

---

## 2026-08-22 — Phase 21: the coffee is the draft

- **Shipped — v7.23.0.** The coffee form autosaves once it's named. Typing a
  roaster or a name mints the coffee into the real ledger right then — no
  shadow draft object, the same move the menu capture already makes for its
  own coffee — and every field after that writes straight into the record on
  each keystroke, with only the localStorage write itself debounced. A swipe,
  a backdrop tap, the phone put away mid-sip: whatever was typed is on the
  Shelf, not lost. `closeSheet()` now flushes and re-renders through a hook
  (`cfFlush`) that no-ops for every other sheet in the app — nothing else
  changed behavior.
- The gentle join still fires once, on the roaster field's blur — never
  mid-keystroke, matching the single call `saveCoffeeForm` used to make. Same
  for Phase 12's "new ground" toast, moved to the country field's blur.
- **Save became Done.** With saving continuous, the button's only job left
  was closing the sheet — relabeled honestly rather than left saying
  something it no longer quite did.
- Verified directly (Playwright): a fresh coffee minted via backdrop-tap
  close survives a full page reload; editing an existing coffee and closing
  the same way keeps the edit; an empty form swiped shut still mints
  nothing; roaster-resolution fires correctly on blur. 74/74 pure tests
  unaffected (nothing touched lived inside the tested region).
- Deliberately not done: autosave for any other sheet (café-cup, Setup) —
  scoped to the one form that actually lost work, per the phase's own
  written boundary.
- Phase 22 (search, on your own key) is still scoped and waiting, unbuilt.

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
