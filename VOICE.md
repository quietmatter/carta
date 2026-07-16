# CARTA — Brand voice standard

The voice was never written down; it was set by the copy. This file states it so
every new string can be held to the same line. It is descriptive of what CARTA
already sounds like, and prescriptive for what comes next.

## What CARTA is (the one sentence)

**We do not sell coffee. We keep the record.**

CARTA is a coffee brewing journal that belongs to the person keeping it. It is
offline-first, single-file, and yours — full export, open schema, no lock-in.
The product is *the record*, and the voice is the voice of a keeper of records:
exact, unsentimental, quietly on your side.

## Brand goals

1. **Ownership.** The record is the user's, readable forever, with or without us.
   Copy never implies the app owns the data or the user's habit.
2. **Anti-friction at the moment of coffee.** *Nothing may require your
   attention while coffee is being made, except the timer. You log after.* If a
   flow feels like homework at 7am, the copy — and the app — is wrong, not the
   user.
3. **Honesty over completeness.** A recalled brew is a valid record; a recalled
   brew labelled *measured* is poison. The voice prizes a true sparse record over
   a full invented one. It never nags the user toward false precision.
4. **An opinion, shown as one.** Rest windows, the dial-in Trace, kill gates —
   these are heuristics with a point of view. State the opinion plainly and let
   the user overrule it ("brew it anyway, that's data").
5. **Resolution comes later.** Free text now, structure when it earns its place.
   Never block a fast log to demand a field.

## The persona

A meticulous archivist who also pulls excellent shots — dry, literate, a little
severe, never precious. Speaks to *you* in the second person; speaks for *us*
("we keep the record") sparingly, as a closing seal. Believes the ritual is the
point and says so without warming it into a slogan.

## Rules of the voice (the gate)

Screen every new user-facing string against these. If a line fails, rewrite it.

- **Sentence case** for body, buttons, empty states, labels. (`<h2>` headings are
  uppercased by CSS — write them in sentence case in source.)
- **Terse. Fragments welcome.** Prefer the em-dash and the full stop to the comma
  and the conjunction. "The assembly, not the appliance." beats a full sentence.
- **Imperative for actions.** "Name the Setup." "Log it after." Refusals are
  clipped and own the refusal: "Refused: a brew requires a Setup."
- **No emoji in the app.** Meaning is carried by geometric/typographic glyphs
  (● ☕ ▤ ⚙ ∿ ≡, ★/☆, ↓ →), never by 🎉.
- **Domain proper nouns are capitalised mid-sentence** where they are concepts,
  not objects: **Setup**, **Trace**, **Ledger**, **Field**. A grinder is not a
  Setup; the assembly is.
- **Numbers are typographic.** En-dash ranges (`1–9`), `m:ss`, `n=` counts, `°C /
  °F`. Tabular where they line up.
- **Never fabricate precision** — in copy or in defaults. Don't invent a date, a
  score, or a certainty the record doesn't have. This includes changelog dates:
  state the granularity you actually know.
- **Address the user, not the market.** No growth-speak, no "users love…", no
  exclamation-point enthusiasm. One dry aside is worth ten adjectives.
- **The tagline is a seal, not a garnish.** *"We do not sell coffee. We keep the
  record."* closes things. Don't scatter it.

## Recurring motifs (use deliberately, don't wear out)

- **"the record"** — the through-line. Cups, brews, cafés all join *the record*.
- **"a rumour"** — an un-scoped grind number; a grind compared across Setups is
  "a rumour with a chart."
- **"a node, not an enum"** — free-text fields that resist being boxed.
- **"the ritual is the point"** — logged after the coffee, never during.
- **poison / lying to yourself in six months** — the honesty stakes around
  instrumentation. Strong language, reserved for that one idea.

## Applying the gate to the café ↔ home alignment (this release)

The café screen and the brew screen are the same shape: **Coffee → Preparation →
Cup.** Copy should make that legible without over-claiming.

- A café cup and a brew both end in a **Cup**: hedonic 1–9 + what you found. Same
  words on both screens.
- Traceability on a café cup is *aspirational*, never required: "the same fields a
  bag carries," tucked behind one tap. The fast path stays a shop and a score.
- The home-vs-café comparison is **shape, not verdict**: "The shape of a
  preference, not a verdict." State the two averages; claim nothing causal. This
  mirrors the Trace's "read it for the shape of your hunting, not for truth."

## Quick test

Read the string aloud. If it sounds like a keeper of records told you a true
thing in as few words as it took — and would still sound right at 7am, mid-brew —
it passes. If it sounds like marketing, a nag, or a cheerful robot, it fails.
