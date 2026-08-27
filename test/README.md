# Verifying the app in a browser

Three harnesses boot the real app against the seeded record in
`fixtures/env.js` (store keys remapped from `carta7.design.*` to the app's own
`carta7.*`). All fail on any console error, any page error, or any assertion.

```
npm i playwright-core --no-save
node test/verify-door.js       # the front door, v7.37.7 — 59 checks
node test/verify-ask.js        # the ask at the front door, v7.38.0 — 82 checks
node test/verify-v7.35.js      # the v7.35.0 fold — 40 checks
```

All expect a Chromium at `/opt/pw-browsers/chromium`; set `CHROME` to
override, or edit `executablePath`.

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
