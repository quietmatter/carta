# Verifying the app

Six harnesses. Two need nothing but Node; four boot the real app in a
browser against the seeded record in `fixtures/env.js` (store keys remapped
from `carta7.design.*` to the app's own `carta7.*`). All of them fail on any
assertion, and the browser four also fail on any console error or page error.

```
# no browser, no network, seconds
node test/verify-static.js     # the six files parse and agree — 19 checks
node test/model.test.js        # the taste model and the brief — 139 cases

# the real app, in a real browser
npm i playwright-core --no-save
node test/verify-door.js       # the front door, all five states — 59 checks
node test/verify-ask.js        # the ask at the front door — 132 checks
node test/verify-v7.35.js      # the v7.35.0 fold — 41 checks
node test/verify-split.js      # the Phase 31 seam — 12 checks
```

**All six run in CI** on every push and pull request to `main`
(`.github/workflows/tests.yml`). The static pair runs first and the browser
four are gated behind it, so a syntax error never pays for a browser
download.

## Finding a browser

`browser.js` resolves one for all four browser harnesses, in this order:
`CHROME` if you set it, then whatever `npx playwright install chromium` put
down, then `/opt/pw-browsers/chromium` (this project's dev container).

The middle step is the subtle one, and it is why this is shared code rather
than a line repeated four times: playwright's `executablePath()` *predicts*
a path for the version of `playwright-core` installed — it does not check a
browser is there. On a machine whose installed build differs it returns a
confident path to nothing, and the launch dies with "executable doesn't
exist" instead of falling through. So its answer is used only when the file
really exists.

## `verify-static.js` — the six files, without a browser

- **everything parses** — CLAUDE.md's own advice is that a syntax check has
  caught something in nearly every phase; this runs it over all six rather
  than whichever file was being edited
- **one version everywhere** — `APP_VERSION`, all five `?v=` query strings,
  and all five published `*_VERSION` constants. This is the failure that
  shipped at v7.31.1 and read to the keeper as "your Visualizer account is
  empty"; the boot guard catches it at runtime, this catches it before merge
- **the boot guard covers every sibling** — `carta-map.js` sat unchecked from
  the day the guard was written until Phase 31, so the guard itself is now
  checked
- **the head and the directory agree** — a new sibling with no `<script src>`,
  or a tag left behind after one is removed
- **the band, reported and never gated** — `index.html`'s lines and bytes
  against `ARCHITECTURE.md` §1's 5,000 / 500 KB, printed always and annotated
  on the PR when over. The band is a founder call (Phases 18, 20 and 29 all
  landed over it deliberately), so this never fails the build — it only makes
  a *silent* crossing impossible, which is the thing §1 actually asks for

## `verify-split.js` — the seam (Phase 31)

The Atlas moved into `carta-atlas.js`. This walks what moved:

- **the four walks** — country, region, producer, city — each opened through
  the app's own opener and asserted to paint its own record, not its empty
  state. `verify-door.js` only ever taps into the country chapter, and
  nothing anywhere opened the other three, which is exactly how a split
  breaks a screen quietly
- **the published seam** — every name in `carta-atlas.js`'s export list is
  really on `window`. Worth knowing what this can and cannot catch: a
  `function` declaration in a classic script attaches itself to `window`
  either way, so its export line is documentation; the `const` arrows
  (`originOf`, `growerOf`, `regionOf`, `cityPlaces`, …) are the half that
  genuinely needs publishing, and dropping one fails here
- **the two seam calls** — `render()` → `resetAtlasSheet()` and `save()` →
  `clearCityLead()`, which replaced two bare cross-file writes into the
  moved file's own `let` bindings
- **the version guard** — all six files agree, the check that makes a
  forgotten `?v=` tag loud (`ARCHITECTURE.md` §1)

## `verify-ask.js` — the ask at the front door (Phase 31)

Runs the ask **end to end** against the fixture's own canned Anthropic and
Nominatim doors — the wait is tested as it actually runs, not by driving
`askSay` by hand — and then walks the rung the answer lands on:

- **the wait is a plate** — full bleed, no bar, the rule measured at `top:78`
  gutter to gutter off the live DOM rather than off the template, and the
  200 px pin box at the foot gone
- **the reframe** — the belt while nothing is placed, `<carta-plot>` from the
  first confirmed address, with pins actually on it
- **the ember budget on the wait** — exactly two elements painting `#a63f2b`
  (the rule's fill and its tip) at *both* stages, and the live line's mark
  computing to ink rather than the ember
- **cancel writes nothing** on a real aborted run, mid-grounding
- **the failure's three doors** are still tappable inside a
  `pointer-events:none` scrim — the thing a scrim is most likely to break
- **the ladder** — 03 > 03b > 04 > 02, each asserted at its own plate height
- **the migration** — an ask already on the record arrives read, stamped from
  `createdAt`, so upgrading does not hijack the door with the ask history
- **Not now**, its write, and the undo behind it
- **an answer that placed nothing** falls back to the passport rather than an
  empty box; **an answer with nothing to stand behind** says so plainly
- **the plot's labels** — no two overprint, a crowded name moves off its dot
  rather than stacking on it, and type over a plate carries the halo
- **the answer as an index** (part two) — the resting stop's two figures and
  the headline's own, one row per finding, quarter and distance off the
  record's own confirmed lookup, the pull's three sections and the
  de-duplication a café that is both a near miss and unplaced needs, and the
  low stop's plate growing to meet its leaf
- **one finding, whole** — an index row is a door, both stops, the verdict and
  the why, the marks writing with no confirm, and a dotted figure really
  opening the cups it was read from
- **no distance from a single point** — the anchor is the mean of what the ask
  itself placed, so one placed name draws a quarter and no kilometre
- dusk, reduced motion, 390×667 and 320px

## `verify-door.js` — the front door (Phase 30)

Walks all five states of the redesigned Atlas and holds the things that are
easy to break silently:

- **the ladder** — 03 outranks 04 outranks 02, and 01 is its own branch
- **the ember budget** — exactly one element painting `#a63f2b` above the
  fold, in every state. This is a *computed-style* count, not a source grep,
  so it catches the fill coming back through a cascade
- **one field, two doors** — a place opens the ask, a bag opens the door
  prefilled
- **the plate** reframes at its new box rather than reloading, and the
  `clientHeight` rule holds (a `getBoundingClientRect` measurement collapses
  it under any page transform)
- **a country on the plate opens its chapter** — clicked on the real painted
  shape via `elementFromPoint`, not the group's bounding box, which an
  irregular coastline can miss entirely
- **the pulled-up sheet closes behind every way of leaving the Atlas** — the
  tab bar and the ordinary `←`/back gesture both have to land on a closed door
- **"Not now" holds against the resume poll** — a dismissal has to survive the
  app re-asking Visualizer once you've been away from the screen a beat, not
  just the instant you tap it
- **a real phone, not the 852px reference** — fresh-loaded (not resized) at
  seven heights down to 500px; below ~800px the plate has to give up the map
  before the leaf gives up its own designed height and starts scrolling
- **offline** — it asserts that *nothing at all* was fetched off-origin, which
  is the passport's own law
- dusk, `prefers-reduced-motion`, and 320 px

## The seed

The seeded record, the offline posture and the canned network all come from the
design bundle's own mock, so the fold is checked against the record the proposal
was designed on. The harness looks in two places and uses whichever exists:

| Where | File |
|---|---|
| In the handoff bundle | `mock/env.js` — the spec, untouched |
| In the app repo | `test/fixtures/env.js` — vendored verbatim |

Both are present in the bundle, which is redundant there and correct in the app
repo, where `mock/` does not exist. `mock/` and the `.dc.html` prototypes are
the design handoff and are deliberately untouched by this branch.
