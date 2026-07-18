# CARTA — design system (extraction)

This directory is CARTA's design system lifted **out** of `index.html` into
standalone specimen pages, ready to push to a Claude Design project at
[claude.ai/design](https://claude.ai/design).

`index.html` remains the single source of truth for the running app. This is a
mirror for reference and review — a place to see the tokens and components in
isolation, in both themes, without the app shell around them.

## What's here

```
assets/
  fonts.css        Spectral + Libre Franklin, latin subsets embedded as data URIs
  tokens.css       the token layer §1–5, copied verbatim from index.html
  components.css   the component rules, copied verbatim from index.html
  preview.css      specimen-only scaffolding (swatch grids, spec rows) — not app CSS
  preview.js       injects the Paper/Dusk theme toggle
foundations/
  color.html       paper + ink ramps, the ember, night ramp, semantic roles
  type.html        the two faces, the 11–18 scale, labels, editorial display
  space-shape.html radius, chip rounding, touch minimum, hairlines, glyphs
components/
  buttons.html            primary / graphite / quiet / danger, text actions, links
  chips-badges.html       rest-window chips, selectable lens chips, badges
  selection-controls.html segmented, hedonic 1–9, descriptors, verdict
  dials-timer.html        brew dials, °C/°F corner toggle, the timer
  forms.html              underline fields, labels, selects, textarea, photo zone
  cards-data.html         cards, key/value ledger, section heads, empty states, toast
  sheet.html              the bottom-sheet modal
  hero-loop.html          home hero, continuation card, best-line, empty hero
  cafe-surface.html       website-derived palette strip, per-café theming
_ds_manifest.json  card index compiled from the @dsCard markers
```

Each specimen is a self-contained HTML page. Its first line is a
`<!-- @dsCard group="…" name="…" -->` marker — the Design System pane builds its
card index from those (and `_ds_manifest.json` mirrors them).

## Relationship to the app

Everything here is **derived from `index.html`** and tracks it:

- `tokens.css` is the `:root` + `html[data-theme="dusk"]` blocks, verbatim.
- `components.css` is the component rules that follow them, verbatim — minus the
  app-shell `body` rule (fixed 480px column, `100dvh`, `overflow:hidden`), which
  `preview.css` replaces with a pane-friendly body.

When the app's token layer or components change, update the copies here in the
same pass. The design language, its inheritance from Quiet Matter, and the six
sanctioned overrides are governed by [`../SUBBRAND.md`](../SUBBRAND.md).

## Previewing locally

Open any file in a browser, or serve the repo statically and browse to it:

```bash
python3 -m http.server   # then visit /design-system/foundations/color.html
```

Use the Paper / Dusk toggle (top-right of each page) to check both themes.

## Pushing to Claude Design

This is what `/design-sync` (backed by the `DesignSync` tool) does — it syncs
this directory into a Claude Design project incrementally, one component at a
time, never as a wholesale replace:

1. It connects to your claude.ai login and adds design-system access
   (`/design-login` if the session has no claude.ai login).
2. Pick or create the target design-system project.
3. It diffs this directory against the project and shows a plan — the exact
   paths it will write, and this directory as the source.
4. On your approval it uploads the files; the `@dsCard` markers become cards in
   the Design System pane.
