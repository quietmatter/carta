# CARTA — brand voice standard (redesign)

The voice was never written down; it was set by the copy. This file states it so
every new string can be held to the same line. It is descriptive of what CARTA
already sounds like, and prescriptive for what comes next.

It supersedes the journal-era standard. The app has turned from a personal
brewing journal into the reference record of a trade, and the voice turned with
it: *Setup · Trace · Ledger · Field* gave way to *the record · the atlas · the
road · the overlay · the pen*. The spine did not change — honesty over
completeness, address the user not the market, refusals owned plainly. Only the
persona and the motifs were re-cut to the keeper of records the app now is.

## What CARTA is (the one sentence)

**One green, many hands. The record the trade settles against — and your taste,
the wash laid over it.**

CARTA is the reference record of specialty coffee: one lot traced from the cherry
on the branch to the reading in the hand, every hand that carries it keeping its
own page on one shared spine. The atlas is everyone's; the record is yours. We
keep the record every sale is made against, and we never make the sale. The
product is *the record*, and the voice is the voice of its keeper — exact,
unsentimental, quietly on your side.

The shared page and the reader's overlay are a matched pair, never a public
product and a private feature. The page is compiled from sourced facts and stands
without you. Your scores, brews, and one honest line sit on top as a private
wash, visible only to you, and are never averaged into it.

## Brand goals

1. **Ownership.** The record is the user's — offline-first, full export, open
   schema, no lock-in. It reads whole on a device that never synced, and it
   leaves whenever the reader wants. Copy never implies CARTA owns the record,
   the taste, or the habit. Readings are never sold; only the trade's aggregate
   view of itself.
2. **Anti-friction at the moment of coffee.** *Nothing may require your attention
   while coffee is being made, except the timer. You log after.* If a flow feels
   like homework at 7am with wet hands, the copy — and the app — is wrong, not
   the user.
3. **Honesty over completeness.** A sparse record rendered honestly beats a full
   one padded. The voice prizes a true gap over an invented certainty, and it
   never nags toward false precision. *Unread* is a state, never a low default; a
   number never travels without the protocol and grader that earned it.
4. **Standing is shown, never sold.** Caliber, rarity, traceability, reach — all
   compiled from sourced facts, always showing their evidence, never bought and
   never picked. State the standing plainly and let the reader read its reasons.
5. **Resolution comes as it is.** Identity resolves as finely as the trade can
   prove and no finer — station-season, green-lot, region. State the grain; never
   round it up. Structure earns its place; free text holds until it does.

## The persona

A keeper of records of a trade — a meticulous archivist who also pulls excellent
shots. Dry, literate, a little severe, never precious. Speaks to *you* in the
second person; speaks for *us* ("we keep the record") sparingly, as a closing
seal. Believes the record is the point, and the road the most luxurious thing in
it, and says so without warming either into a slogan. When the record must refuse
— a number it can't stand behind, a claim outside its link — it refuses in the
open, names the reason, and offers the door.

## Rules of the voice (the gate)

Screen every new user-facing string against these. If a line fails, rewrite it.

- **Sentence case** for body, buttons, empty states, labels. (`<h2>` headings are
  uppercased by CSS — write them in sentence case in source.)
- **Terse. Fragments welcome.** Prefer the em-dash and the full stop to the comma
  and the conjunction. "Carried, not resolved." beats a full sentence.
- **Imperative for actions; own every refusal.** "Hold the pen." "Read the season
  for me." A refusal is clipped and carries its reason, never a bark: "A cup needs
  its reading — the 1–9 first." Guard rails stay in ink, never in red.
- **Address the user, not the market.** No growth-speak, no "users love…", no
  exclamation-point enthusiasm, no gamification — no streaks, badges-as-rewards,
  confetti, or red dots. One dry aside is worth ten adjectives.
- **Never fabricate precision** — in copy, in defaults, or in dates. Don't invent
  a score, a resolution, or a changelog day the record doesn't know. State the
  granularity you actually have ("July 2026", not a made-up date).
- **No emoji in the app.** Meaning is carried by geometric/typographic glyphs
  (● ○ ◎ ◉, → ↺), never by an icon font and never by 🎉.
- **Numbers are typographic.** En-dash ranges (`1–9`), `m:ss`, `n=` counts, `°C /
  °F`, tabular where they line up.
- **The reach marks stay monochrome** (○ ◎ ◉ ●). The ember is spent once per
  screen — the current action, or the score — and never on decoration.
- **Domain proper nouns are capitalised mid-sentence** where they are concepts,
  not objects: the **Setup**, the **Cup**, the **Atlas**, the **Record**. A
  grinder is not a Setup; the named assembly is.
- **The tagline is a seal, not a garnish.** *"We do not sell coffee. We keep the
  record."* closes things. Don't scatter it.

## Recurring motifs (use deliberately, don't wear out)

- **"the record" / "the atlas" / "the road"** — the through-line, the shared
  spine, and the path a coffee travels. Cups, brews, sightings all join *the
  record*.
- **"the overlay, not the shared page"** — the reader's private wash versus the
  compiled public page. The strongest honesty motif; reach for it wherever a
  personal number sits near a compiled one.
- **"one green, many hands"** — one lot, read differently by every roaster who
  buys it. The page nothing else can render.
- **"carried, not resolved"** — the trade's disagreements are shown, not
  flattened; the record would rather show its seams than tell a quiet lie.
- **"unread is a state"** — an absent score is a door, never a verdict, and never
  a default to the low end.
- **"the pen"** — signing your own link. Scoped, never sovereign: a first party
  holds the pen on its own facts and nowhere else.
- **"compiled, never picked" / "shown with its reasons"** — standing and rankings
  are built from sourced facts and carry their evidence; nothing is promoted.

Retired with the journal era: **Field** (the discovery drawer), the journal-only
**"a rumour"** frame for an un-scoped grind (the idea survives as *"grind is
comparable only within one Setup"*), and **"one cup, two contexts"** as the
headline — home and out are now two readings on one overlay, not the whole story.

## Applying the gate (this release): the two cups are one shape

The home cup and the café cup are the same shape: **Coffee → Preparation → Cup.**
Copy should make that legible without over-claiming.

- Both end in a **Cup**: hedonic 1–9 + descriptors + one honest line. The same
  words on both screens, so a cup in and a cup out read as one preference.
- Grind lives inside a **Setup** and never travels between grinders. Say so where
  the dial is: *"comparable only within one Setup — never across grinders."*
- Every kept cup joins the reader's **overlay**, never the coffee's shared page —
  and the copy says which, every time: *"your overlay, never the coffee's shared
  page."*
- The home-vs-out comparison is **shape, not verdict**: *"the shape of a
  preference, not a verdict."* State the two averages; claim nothing causal.

## Quick test

Read the string aloud. If it sounds like the keeper of a trade's record told you
a true thing in as few words as it took — and would still sound right at 7am,
mid-brew, in dusk, offline — it passes. If it sounds like marketing, a nag, or a
cheerful robot, it fails.
