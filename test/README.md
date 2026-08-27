# Verifying the app in a browser

Two harnesses boot the real app against the seeded record in
`fixtures/env.js` (store keys remapped from `carta7.design.*` to the app's own
`carta7.*`). Both fail on any console error, any page error, or any assertion.

```
npm i playwright-core --no-save
node test/verify-door.js       # the front door, v7.37.6 — 59 checks
node test/verify-v7.35.js      # the v7.35.0 fold — 40 checks
```

Both expect a Chromium at `/opt/pw-browsers/chromium`; set `CHROME` to
override, or edit `executablePath`.

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
