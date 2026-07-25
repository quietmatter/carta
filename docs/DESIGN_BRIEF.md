# CARTA — redesign brief

*A prompt for Claude Design. This is the commission for a comprehensive
redesign of CARTA's interface — every surface, every screen, every line of
copy — on top of the existing token layer. Read it whole before sketching.*

---

## The commission, in one paragraph

Redesign CARTA's entire interface to match what CARTA has become. The app
began as a personal brewing journal; it is now the reference record of
specialty coffee — one graph from the cherry on the branch to the reading in
the hand, and a personal instrument for keeping your place on it. The design
system underneath (tokens, typefaces, themes) is sound and stays. Everything
above it is open: layout, composition, navigation, motion, density, copy, and
the brand voice itself. The bar is not "a nice app." The bar is the most
beautiful object in specialty coffee — an interface the top of the market
recognises instantly as one of their own. Quiet luxury. Restraint and beauty.

## Who this is for

The high end of the coffee market — people who own a good grinder and know
why, who order the single lot over the blend, who can name their roaster's
sourcing trips. They buy from Sey and La Cabra, read Kinfolk and Monocle,
wear The Row's restraint even if not its labels. They are allergic to
gamification, to dashboards, to anything that smells like a fitness app.
They respect objects that respect them: a well-set book, a paper ledger, a
hand-thrown cup. CARTA must feel like it was made by the same hands.

This audience does not need to be sold coffee — CARTA never sells coffee —
they need an instrument worthy of the attention they already pay.

## What CARTA is (the concept the design must express)

CARTA has turned three times, and the interface must carry all three layers
at once:

1. **The record** — a personal coffee memory. One cup, two contexts (home
   and café), your taste the through-line. Logging is a ritual, done after
   the coffee, never during.
2. **The atlas** — the coffee at the centre. One green lot traced from farm
   through processing, import, roast, and pour; your readings a wash laid
   over the trace. "Same green, many hands."
3. **The ecosystem** — the road itself. Every hand a coffee passes through
   keeps its own page on one shared spine: producer, processor, importer,
   roaster, café, keeper, reader. CARTA is the chart the trade settles
   against — Lloyd's Register, the stud book, the appellation registry. It
   keeps the record every sale is made against; it never makes the sale.

The design metaphor that survives all three turns is **the ledger**: entries,
provenance, signatures, hairlines, tabular numbers, facts that accumulate and
are struck through but never erased. The interface should feel like the
finest possible edition of a working record — not a museum piece, a tool.

## The laws (non-negotiable, and design material)

These refusals are the product. The design should make them *felt*, not just
obeyed:

- **We do not sell coffee. We keep the record.** No commerce styling, no
  price-forward layouts, no "buy" energy anywhere.
- **Standing is never for sale.** Nothing promoted, nothing sponsored, no
  visual hierarchy that could be mistaken for placement.
- **Never print a number that lied to get there.** No invented precision.
  A sparse record rendered honestly beats a full one padded. Empty states
  are a first-class design surface — silence with dignity.
- **No feed, no streaks, no engagement mechanics.** No badges-as-rewards,
  no confetti, no red dots. The ritual serves the coffee.
- **A score never travels without its reasons.** Anywhere a match score or
  band appears, "why this" is one gesture away.
- **The record is the user's.** Offline-first, full export, no lock-in —
  the design should signal permanence and ownership, never cloud-tenancy.
- **Reach badges stay monochrome** (○ ◎ ◉ ●) — never the ember, never a
  fill. The ember is reserved for the current action and the cup's score.
- **Nothing may require attention while coffee is being made, except the
  timer.** The brew flow is designed for wet hands and seven in the morning.

## What is fixed (the floor you build on)

The token layer is trusted and stays — it is the sub-brand charter with
Quiet Matter (`SUBBRAND.md`, `design-system/assets/tokens.css`):

- **Typefaces:** Spectral (interpretive/serif) + Libre Franklin
  (operational/sans). Self-hosted, already subset.
- **Palette:** roasted ink `#241d18` on warm stock `#f2eee6`; the dusk theme
  as "paper at night" (`#171310`), not an inversion. Full ramps exist.
- **The ember** `#a63f2b` (dusk `#e06b4f`) — the one warm signal, for the
  current action and the score. Never decoration, never fields of colour.
- **Shape:** square by default, hairline rules, no shadows; the one
  sanctioned rounding is 2px on chips.
- **Type scale** 11/13/15/16/18 for operation; editorial serif display
  (34–42px, negative tracking) reserved for arrival and hero moments.
- **Per-café palettes:** a café or bag's surface may be themed from its own
  site-derived colour — the one place foreign colour enters, always derived,
  never picked.
- **Dual theme** (Paper / Dusk), both first-class.
- Touch minimum 44px; subtle ink holds ≥4.5:1; WCAG AA throughout.

You may propose extensions to the token layer (new spacing rhythm, motion
tokens, additional display sizes) — argued, not smuggled. Value changes to
the inherited primitives go through the sub-brand charter or not at all.

## What is open (the actual commission)

Everything above the tokens:

- **Information architecture and navigation.** Today · Home · Café · Find ·
  Record, opened a room at a time (the depth ladder). Keep the ladder's
  spirit — nothing is taken away, rooms open when earned — but the
  navigation's form, placement, and choreography are yours to redesign.
- **Every surface.** The Today landing and its matching; the brew flow and
  its dials; the bag shelf; the Setup pages; the café passport and per-café
  themed pages; Find's map and discover drawer; the Record (Trace) and its
  sightings; the lot page ("same green, many hands"); the Register and reach
  primer; sheets, forms, toasts, onboarding, What's New, export/import,
  sync, multi-user. Nothing is grandfathered.
- **Composition and density.** The current app is one 480px column. Propose
  the rhythm the content deserves — editorial where the record is read,
  instrument-dense where it is written.
- **Motion.** Currently minimal. Define a motion language: what moves, how
  slowly, and why. Reduced-motion is a first-class path, not a fallback.
- **The brand voice and every string.** `VOICE.md` is the current standard —
  the keeper of records: terse, sentence case, no emoji, honest. You may
  evolve the voice. What must survive is its spine: honesty over
  completeness, address the user not the market, refusals owned plainly.
  If you update the voice, rewrite `VOICE.md` to match — the gate must
  still exist, even if its lines change.
- **The glyph set** (● ☕ ▤ ⚙ ∿ ≡ ★ ☆) — typographic, never an icon font.
  You may redesign the set within that law.
- **Iconography of the reach** (○ ◎ ◉ ●) and all classification marks.
- **The app icon, the PWA presence, and the arrival** — first open,
  onboarding, the welcome. Arrival is the one place the editorial display
  scale spends freely.

## Design direction — quiet luxury, stated precisely

"Quiet luxury" is not a mood board word here; it is an operating principle
with named behaviours:

1. **Typography is the interface.** The two faces do the work colour and
   ornament would do elsewhere. Hierarchy through size, weight, case, and
   space — almost never through colour.
2. **Restraint as signal.** Wealth of space, poverty of elements. Every
   element earns its place or leaves. The confidence to leave a screen
   nearly empty is the luxury.
3. **Material honesty.** Paper and dusk are materials, not themes. Hairlines
   are printed rules, not borders. The dark theme is its own material —
   warm, low, like a room at night — never an inversion filter.
4. **Slow motion, or none.** Nothing bounces. Nothing pulses for attention.
   Transitions are few, brief, and physical (a sheet rises; a surface
   settles). The interlude is the exception that proves the rule — one
   considered moment, honouring reduced motion.
5. **Numbers set like a fine ledger.** Tabular figures, en-dash ranges,
   aligned columns, units held quietly. Data presented as typography, not
   as "data viz." Charts, where they exist, are drawn with the same pen as
   the text.
6. **Provenance as beauty.** The road — farm, process, import, roast, pour —
   is the most luxurious content in the app. Design it the way a fine
   watchmaker designs the caseback: the mechanism visible, labelled,
   celebrated without shouting.
7. **The one warm thing.** The ember stays scarce. Its scarcity is what
   makes the score and the current action feel alive. If a screen has two
   embers, the design is wrong.
8. **Depth on demand.** Surface calm, depth one gesture away. The fast path
   is always short; the deep path is always there.

## Research and references

The field was surveyed (2024–2026) before this brief was written: the
quiet-luxury digital canon, the specialty-coffee design landscape, and the
adjacent categories that keep records beautifully. What follows is the
distillation — study these before sketching. Site access was partial in
places; observations marked from secondary sources in the survey should be
checked against the live sites.

### The quiet-luxury digital canon

- **Anthropic (studio Geist)** — the clearest current warm-paper system in
  tech: ivory ground, slate ink, essentially no other colour; a text serif
  (Tiempos) doing real work at scale beside one quiet sans. Reads as "a
  research publication on parchment." CARTA's paper-and-roasted-ink tokens
  are the same species — the lesson is how far the discipline can be held.
- **The Row / Jil Sander / Aesop** — the fashion benchmark for silence:
  near-monochrome, sparse grids where the whitespace itself signals price;
  Jil Sander's one ornament is a bespoke typeface; Aesop protects a single
  personality element and reduces everything else. That last rule is
  CARTA's ember rule, stated by another house.
- **Linear (2025 refresh)** — the maturity tell: the redesign *removed*
  colour. Restraint as the upgrade path; addition reads as insecurity.
- **Endel / iA Writer** — the calm-instrument pole: an interface that
  recedes so the product (sound; text) is everything. iA's thesis — web
  design is 95% typography — is this brief's thesis.
- **Stripe Press / Kinfolk / Cereal / Monocle** — the editorial systems:
  print furniture (hairline rules, folios, captions, section numbering) as
  the whole interface. Monocle matters specifically because it proves a
  *dense* surface can stay premium — discipline, not emptiness, is the
  ingredient. That is the permission the Record tab needs.
- **Motion, by the numbers (Emil Kowalski; Rauno Freiberg)** — UI motion
  under 300ms; ease-out on anything entering or leaving; custom curves, the
  built-in easings are too weak; the more often a control is used, the less
  it should animate. Taste lives in sub-perceptual details. This is the
  motion charter — adopt it.
- **Maps** — the current branded-map practice is exactly CARTA's `smapStyle`
  approach: desaturate the base to the brand's tones, de-emphasise roads,
  let the pins be the only marked thing. The frontier is how muted the base
  gets, not how much it shows.
- **Dark theme as material** — the consolidated guidance matches Dusk:
  a warm dark that is its own material, elevation by lighter surface rather
  than shadow, accents re-tuned rather than reused. Never an inversion.

### The coffee field — and where it sits

The high end has two occupied poles. The **mute** pole (Sey, La Cabra,
% Arabica): white-on-white, small sans, lot essays, total material
coherence — La Cabra's stated aim, "a materiality that ages gracefully,
without referring to a time or style period," is the closest thing coffee
has to quiet luxury. The **loud** pole (Onyx, Ditta Artigianale, Friedhats):
colour-blocked drops, transparency-as-spectacle, punk irreverence. Both
poles are imitated to cliché — the field's own critics call it "designed by
algorithms trained on Pinterest boards."

The clichés to refuse outright: minimal sans on white/kraft; pastel
geometric per-lot labels; QR-code storytelling; transparency as an inert
FOB spreadsheet; big lowercase display type; and, in apps, stock platform
UI, radar charts, star ratings, badges, paywall chrome.

Two moves from the field are worth keeping close: **Coffee Collective sets
the farmer's name larger than its own** — provenance as hierarchy, not
footnote — and **Tim Wendelboe's annual transparency report** is a brand
built on a document. Both are the record's values, executed in packaging
and PDF. Neither has ever been executed as an interface.

### The apps — an open field

No coffee app currently occupies a design-led position at all; the
category's ceiling is "clean utility" (Beanconqueror is a lab notebook with
thirty parameters up front; Filtru's luxury ambitions die on upsell
chrome). The wine and whisky parallels (Vivino, Untappd, Distilld) define
the downmarket register — stars, badges, feeds, commerce pressure. The
instructive adjacents are elsewhere: **InVintory** renders a wine
collection as a *place* (the 3D cellar); **Chrono24** renders a watch
collection as a *curve* (the portfolio); **Artlogic and the art-collection
category** speak the vocabulary the record deserves — *provenance,
attestation, condition report, first recorded by*. **Hodinkee** proves
writing is the luxury surface. **Atomix and the fine-dining web** prove the
high end signals depth by withholding.

### The opening (why this redesign can win)

The register nobody in coffee holds is the **archival** one: the ledger,
the specimen catalog, the annual report, the estate record. CARTA owns it
natively — the data model is already archivally correct (append-only
sightings, strikes that date rather than delete, tombstones, provenance on
every entry). No competitor has the model, let alone the typography for
it. The specific opportunities the survey surfaced, each a design brief in
miniature:

1. **The entry as the object.** Design one cup's record like an auction
   catalog lot or a condition report: typeset provenance block, dated,
   signed, sparse. Nobody designs the kept page; everybody designs the form.
2. **Traceability as typography, not table.** The road — producer → lot →
   roast → this cup — as a set genealogy, the producer's name in the
   largest type. Out-design the roasters' PDFs on their own values.
3. **Serif authority in a sans-locked category.** Coffee digital design is
   uniformly sans; serif ownership sits with fine dining and horology.
   Spectral, already in hand, is one register above the field — spend it.
4. **The ledger palette.** The mute pole owns white; the loud pole owns
   colour-blocking. Bone ground, near-black ink, one reserved signal is
   unclaimed — CARTA's ember discipline has no equivalent in the field.
5. **Time as the collection view.** InVintory renders space; Chrono24
   renders value; nobody in any tasting category renders *time* — rest
   windows, the seasons of a shelf, a year in the ledger set like an
   annual report.
6. **Attestation, not gamification.** "First entered by —, 12 March 2026"
   makes the user a keeper, not a scorer. The signed sighting, surfaced as
   the luxury it is.
7. **The almost-empty first surface.** The Atomix pattern: the cup, the
   place, one line — instrumentation folded beneath. The opposite of every
   coffee app.
8. **Print-grade export.** Luxury categories end in paper. A lot page or
   year-book that exports as if from a letterpress annual turns the private
   ledger into the brand's only advertisement.

The survey's verdict on the existing foundations: warm paper + roasted ink,
the single rationed accent, the token-repainted basemap, dusk-as-material —
all already aligned with the state of the art. This redesign is a
refinement toward a standard the tokens already imply, not a correction.

## Scope of deliverables

Design the system end to end, in this order:

1. **Design principles** — a one-page charter naming the redesign's rules,
   testable enough to review against.
2. **The voice pass** — the updated `VOICE.md` (if the voice moves) and a
   rewritten copy deck for every recurring string class: navigation, empty
   states, refusals, confirmations, onboarding, the seal.
3. **Foundations** — spacing rhythm, layout grids per breakpoint, motion
   tokens, elevation-without-shadows strategy, any sanctioned token
   extensions.
4. **Core components, redesigned** — buttons, chips, forms, sheets, dials,
   segmented controls, hedonic scale, descriptors, cards, ledger rows,
   section heads, toasts, empty states, the timer.
5. **Key screens, composed** — Today (with matching), the brew flow end to
   end, a bag page, a café page (with derived palette), Find with the map,
   the Record, a lot page, onboarding/arrival. Both themes, both densities
   (phone-first; the 480px column may be kept or argued away).
6. **The signature moments** — arrival, the interlude, the What's New sheet,
   the export ("the record leaves with you").
7. **A migration note** — what changes in what order, so the single-file app
   can adopt the redesign incrementally without a rewrite flag-day.

## Constraints (engineering reality — design within them)

- The app is **one self-contained `index.html`** — inline CSS and JS, no
  build step, no external dependencies, no CDN fonts or icon sets. The
  redesign must be expressible in hand-written CSS on the existing token
  architecture (primitives → roles → theme remap).
- **Offline-first.** Every surface must stand with zero network. The street
  map, brand reads, and address lookups are progressive enhancements — the
  designed floor renders first and alone.
- **PWA on phones** is the primary context: one-handed use, thumb reach,
  `100dvh`, iOS quirks. Paper theme in daylight, dusk at night.
- Rendering is string-templating into `innerHTML`; interactions are plain
  handlers. Motion must be CSS-first and cheap.
- Accessibility floor: WCAG AA contrast, 44px touch targets, visible focus,
  reduced-motion honoured everywhere.
- The two fonts are the budget. No new typefaces without a charter change.

## How the work will be judged

Hold every screen to the project's own test, plus these:

- Would a Sey or Coffee Collective devotee, shown one screen cold, assume
  this app costs money and respects them?
- Does the screen still work at 7am with wet hands, in dusk, offline?
- Read the copy aloud — does it sound like the keeper of records told you a
  true thing in as few words as it took?
- Is the ember spent exactly once?
- Could the number shown defend how it got there?
- Is the empty state as designed as the full one?

*We do not sell coffee. We keep the record — and the record deserves to be
beautiful.*
