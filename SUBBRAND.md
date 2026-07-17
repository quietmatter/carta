# CARTA is a sub-brand of Quiet Matter

Carta was cut from the Quiet Matter design system and remains part of its family.
This file is the charter for that relationship: what Carta **inherits** from
Quiet Matter, what it is **allowed to override**, and how the two stay in sync.

Anything not on the "sanctioned overrides" list below is **drift** — treat it as
a bug and either pull it back to the inherited value or bring it here for review.

## The relationship in one line

**Re-sync the architecture; fork the identity.** Carta inherits Quiet Matter's
token *structure* so upstream fixes stay pullable, and overrides Quiet Matter's
*values* where the product demands it — a tactile coffee ledger, not an austere
publication.

## What Carta inherits (tracked against Quiet Matter)

These match `quietmatter/quiet-matter → static/qm.css` and must stay matched.
When QM changes one, change it in Carta's token layer in the same pass.

- **Typefaces** — Spectral (interpretive/serif) + Libre Franklin (operational/sans).
- **Type roles** — serif carries interpretation and body; sans carries operation and labels.
- **Type scale** — `11 / 13 / 15 / 16 / 18` (rem), `--s11 … --s18`.
- **Label system** — 11px, uppercase, `0.12em` tracking, sans-medium, subtle ink.
- **Weights** — 400 / 500 / 600. No display weights.
- **Measures** — `37ch` body, `56ch` editorial. Touch minimum `44px`.
- **Token architecture** — primitives → semantic roles → theme remaps roles only.
- **Shape** — square by default (`--radius: 0`); flat; hairline rules; no shadows.
- **Links** — the word, underlined, is the interface.
- **Dual theme** — Paper by day, Dusk at night, via `html[data-theme="dusk"]`.
- **Footer-contrast discipline** — subtle ink ≥ 4.5:1 on paper (Carta `#776b60` ≈ QM `#6e6c6a`).
- **Voice** — the keeper of records: sentence case, terse, no emoji, honest sparsity (`VOICE.md`).

## Sanctioned overrides (Carta's identity — approved departures)

Each of these is a deliberate, reviewed break from Quiet Matter. They are the
reason Carta is a sub-brand and not a re-skin. Nothing else may diverge.

1. **Warm palette.** Roasted ink (`#241d18`) on warm stock (`#f2eee6`), where QM
   is neutral near-black on `#fafaf8`. Full ramps in the token layer.
2. **The ember signal.** One warm accent — `#a63f2b` day, `#e06b4f` dusk — for the
   current action and the cup's score. Quiet Matter admits **no** colour on
   customer surfaces; this is the deepest, most deliberate break. Used as a
   *signal*, never as decoration or fields of colour.
3. **Editorial display scale.** Serif to 34–42px with negative tracking, in heroes
   and the welcome, above QM's hard 18px customer ceiling. Reserved for arrival
   and hero moments — the operational body stays on the inherited scale.
4. **The per-café palette engine.** Carta derives a signature colour from a café's
   branding photo and themes that café's whole surface from it. An entire feature
   built on colour; impossible inside QM's law, core to Carta's product.
5. **Typographic glyphs.** A small set — `● ☕ ▤ ⚙ ∿ ≡ ★ ☆` — carried by type,
   never an icon font. QM uses no icons; Carta bends the rule but keeps its spirit.
6. **2px chip rounding** (`--chipr`) on chips and inline code. The one rounding QM
   does not have.

## How to stay in sync

- **Primitives are the contract.** The inherited primitives in the token layer
  (§1 at the top of `index.html`'s inline `<style>`) carry QM's values verbatim.
  Review them whenever QM's `qm.css` changes.
- **Rules consume roles, not primitives.** New CSS must reference the semantic
  roles (`--text-*`, `--surface-*`, `--border-*`, `--signal`), never raw ramp
  values — exactly as QM does. This is what makes a future sync mechanical.
- **Legacy aliases are temporary.** The old flat names (`--ink`, `--paper`,
  `--accent`…) are aliased onto the roles so existing rules keep working. Migrate
  rules onto the role names over time, then delete the alias block.
- **New divergence goes through this file.** If a change needs to leave the
  inherited values, add it to "Sanctioned overrides" with a one-line reason, or
  don't ship it.

## Provenance

- Parent: `quietmatter/quiet-matter` — `static/qm.css`, `DESIGN_FIDELITY_AUDIT.md`.
- This charter reconciles the two systems as read on 17 Jul 2026.
