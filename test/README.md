# Verifying the v7.35.0 fold

`verify-v7.35.js` boots the real app — `project/index.html` and its four
siblings — against the seeded record in `mock/env.js`, with the store keys
remapped from `carta7.design.*` to the app's own `carta7.*`, and walks every
flow the ten recommendations touch. It fails on any console error, any page
error, or any assertion.

```
npm i playwright-core --no-save
node test/verify-v7.35.js
```

It expects a Chromium at `/opt/pw-browsers/chromium`; change `executablePath`
if yours is elsewhere. Font, icon and manifest 404s are filtered — the design
bundle carries source only, and those assets live in the app's own repo.

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
