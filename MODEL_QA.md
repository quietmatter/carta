# CARTA — the model, under review

*An industry-consensus QA of the lot-centric model (`VISION.md`), run before the
spine becomes a schema. The rule: no structural assumption is trusted until the
trade — the standards bodies, the competitions, the technical literature — confirms
it. Not one roaster's marketing; the bodies that set the terms.*

Fourteen load-bearing assumptions were tested across six independent research
passes. This is the scorecard, the reasoning, and the changes it forced. `VISION.md`
has already been revised to absorb every finding here.

## The verdict

**5 confirmed · 4 qualified · 5 contradicted.**

The vision holds — the lot is the right centre, and *"the same green in more than one
hand"* is real and observable. But the data model needed real revision, and the
standard moved under caliber: the SCA retired the 2004 cupping form in November
2024. The most consequential single finding: **the industry itself separates a
coffee's quality from its traceability. So must the model.**

## The assumptions, judged

Verdicts are the reviewers' reading of the sources listed at the end. `CONFIRMED*`
means confirmed with a qualification folded into the revision.

### Origin & the atom — where the model was most exposed

- **A1 · the atom — CONTRADICTED.** Season-and-place uniqueness holds, but *"lot"*
  has no standard definition and is a fluid commercial grouping, not a physical atom:
  one Kenyan outturn is split by grade (AA/AB/PB) into several export lots; importers
  re-combine small lots into community lots. The estate ideal — and Cup of
  Excellence's strict single-farm rule — describes a minority of specialty volume.
  → *Model the lot as a splittable / mergeable commercial offering with lineage;
  keep per-season uniqueness, drop indivisibility.*
- **A2 · one producer per lot — CONTRADICTED.** In the dominant East African model a
  single lot aggregates cherry from hundreds to thousands of smallholders (Rwanda's
  Remera washing station: 3,000+ households). And a washing station is a *processor*,
  not a producer — the trade keeps grower, mill, cooperative/union and exporter
  distinct. → *Split into Producer · Processor · Aggregator; Lot → many Producers via
  a Processor, with a `scope`.*
- **A3 · one varietal, one process — CONTRADICTED.** *"Mixed heirloom"* is the
  default for Ethiopian coffee — a legitimate single lot of dozens of unmapped
  landraces; multi-variety plantings are common. Process is increasingly multi-stage.
  → *Variety as a set (incl. mixed-heirloom / unknown); process staged.*

### Green trade & traceability — the feature confirmed, the plumbing not

- **A10-split · same green, many roasters — CONFIRMED.** Real and routine. At the
  importer offer-list level it is the default (a lot is an inventory SKU sold in
  sub-portions to many roasters); at auction, consortiums split single lots across
  countries. → *Refine: model it as an allocation-level fact, with an
  exclusive / whole-lot state for the marquee case.*
- **A4 · provenance channels — CONTRADICTED.** *"Auction / direct trade / importer"*
  mixes a supply-chain role (importer) with two transaction types. Nearly all
  specialty green passes through an importer, and *"auction"* hides three different
  things (central-commodity vs competition vs private-estate) that differ precisely
  on traceability. → *Two orthogonal axes: sourcing channel × intermediary.*
- **A5 · traceability ladder — QUALIFIED.** Direction right, *"bind at the coarsest
  you can prove"* sound — but the rungs bundled orthogonal facets (process and season
  are separate axes, not spatial-specificity points). And traceability (how finely
  origin is known) is distinct from transparency (whether price is disclosed). →
  *One spatial-granularity ladder; process / variety / season as independent
  attributes; "promotable" is record enrichment, not the coffee mutating.*

### Grading, caliber & the gate — where the ground moved

- **A13 · the gate — CONTRADICTED.** The SCA's own 2021 definition splits intrinsic
  quality from extrinsic traceability; they diverge constantly. Fusing them into one
  admission bar is exactly the conflation the newer definition was written to end. →
  *Split the gate into two independent attributes; filter on either, equate never.*
  **This is the single most important correction.**
- **A6 · caliber = SCA score — QUALIFIED (outdated as stated).** The 100-point scale
  is real but belongs to the 2004 form, which the SCA superseded in **November 2024**
  with the Coffee Value Assessment. CVA scores spread wider and are not directly
  comparable; the SCA set no official specialty cutoff (80 is a carried-over
  convention, some argue 84). → *Caliber as a record `{score, protocol, cupper,
  event, date}`; 80 as a labelled convention; price never sets caliber.*
- **A7 · the caliber ladder — CONFIRMED*.** The direction matches consensus —
  independently-juried competition results (Cup of Excellence, Best of Panama: blind,
  dual-jury, 87+ to win, public dated results) are the most trusted; an unattributed
  roaster number the least. Qualifications: price is not caliber; *"juried auction"*
  over-credits producer-run estate auctions; barista competitions aren't a coffee
  signal. → *Split rung 1 (independent vs estate auction); store auction price as a
  rarity axis; firewall WBC / Brewers Cup out; caliber carries event + protocol.*
- **A8 · the credential — QUALIFIED (terminology outdated).** Sound instinct, stale
  label: as of **October 2025 the SCA runs the Q program** (rebuilt on the CVA); CQI
  is no longer involved. Calibration is a property of the scoring *event*, not a
  badge. → *Broaden to {evolved-Q, legacy Q, Sensory Skills, competition jury};
  legitimacy attaches to a calibrated event.*

### Roasting & blends — largely sound

- **A9 · blend — CONFIRMED.** The trade treats blending as authorship; disclosure
  varies (the *"when disclosed"* hedge is right); seasonal recompositions are
  standard (Square Mile keeps a blend's name while changing components by harvest).
  → *Keep as modelled; add a seasonal / rotating flag; ratios nullable.*
- **A10 · roast node — CONFIRMED*.** Mirrors an actual specialty bag; tasting notes
  as the roaster's *reading*, not truth, is correct. Caveats: roast level can't be
  normalised across roasters (*"one company's medium is another's dark"*), and
  single-origin ≠ exactly one lot (many are a co-op or regional blend). → *Roast
  level a free descriptor; a single origin may reference one or more lots at a stated
  granularity.*

### Brewing, gear & grind — honest, and one honest overclaim

- **A12 · brewer key — CONFIRMED*.** Exact-model keying is never wrong (bed geometry
  matters), but conservative: educators and the Brewers Cup categorise by method
  family first, where ratio / temperature / time transfer. → *Keep exact model as the
  tightest key; add a method-cluster layer above it.*
- **A11 · grind — QUALIFIED.** Cross-model grind is genuinely a rumour (firm
  consensus). But same-model is itself a whisper: unit-to-unit burr alignment
  (~0.05 mm matters), per-unit zero-point, drivetrain variants and burr seasoning
  mean *"same number → same grind"* isn't guaranteed. → *Present model-level grind as
  a distribution with a "calibrate to your own zero" note; handle espresso as a
  separate corpus.*

## What must change before finalizing

The contradictions and qualifications collapse into a handful of structural
revisions. None dislodges the vision; each makes the schema honest to how coffee
actually moves. All are now in `VISION.md`.

1. **Split the gate — quality is not traceability.** Two independent signals: a
   quality signal (score + protocol + attribution) and a traceability signal (origin
   completeness). Filter on either; equate never. *(The one that matters most.)*
2. **The lot is an offering, not an indivisible atom.** Keep it as the centre and its
   per-season uniqueness; let it split and merge; separate Producer · Processor ·
   Aggregator; many producers per lot; variety a set; process staged.
3. **Caliber is a record, and the standard moved.** `{score, protocol 2004|CVA-1.0,
   cupper, event, date}`; 80 a labelled convention; credential broadened and
   event-based; price is a rarity axis, never caliber.
4. **Provenance is two axes.** Sourcing channel (incl. auction × central / competition
   / estate) × intermediary (importer / exporter / agent / none); traceability
   separated from transparency.
5. **Even one grinder model is a whisper.** Grind as a distribution + calibrate-to-zero;
   a method-cluster layer for what transfers; espresso as its own corpus.
6. **Canonical lot identity is what makes it verifiable.** *"Same green, many hands"*
   is only true if two offerings can be matched to one lot — this vindicates the
   fingerprint / propose-and-confirm plan already in the model; anchor it to an
   importer, auction, or producer-harvest key.

## What held

The revisions are real, but the thesis survived contact with the industry. These are
the load-bearing instincts the consensus confirmed:

- **The lot as the organizing centre.** No product has keyed on it; the trade agrees
  it is the meaningful unit even where it isn't a clean atom.
- **"The same green, in more than one hand."** Real, routine, observable — the default
  at the importer level, and a recognised transparency-era lens.
- **Standing, compiled from sourced facts.** Competition results are genuinely the
  industry's most-trusted quality signal; the *compiled, never picked, always shows
  its evidence* posture is right.
- **A blend is roaster-authored.** Confirmed outright.
- **Grind doesn't cross grinders.** The honesty principle is exactly right — it needed
  only to be extended: even one model is approximate.
- **Roaster tasting notes are a reading, not truth.** Confirmed — there is no objective
  fact of what notes are *present*.

## The unbiased basis — bodies & sources consulted

- **Specialty Coffee Association (SCA)** — the Coffee Value Assessment standards
  (SCA-102/103/104, Nov 2024); the 2021 white paper *"Towards a Definition of
  Specialty Coffee"*; Golden Cup / brewing-water standards; the Q-program transfer;
  roast-colour guidance. <https://sca.coffee>
- **Alliance for Coffee Excellence / Cup of Excellence** — competition rules &
  protocols; the public dated results & auction archive (since 1999).
  <https://cupofexcellence.org> · <https://allianceforcoffeeexcellence.org>
- **Coffee Quality Institute (CQI)** — the legacy Q Grader credential and its 2025
  transfer to the SCA.
- **Best of Panama / SCAP & Gesha Village** — competition + auction mechanics;
  record-price-vs-score evidence. <https://bestofpanama.org> · <https://geshavillage.com>
- **World Coffee Events** — Barista & Brewers Cup formats (establishing they measure
  the competitor, not the coffee). <https://wcc.coffee>
- **Technical educators** — Barista Hustle, James Hoffmann, Scott Rao, Coffee ad
  Astra, Honest Coffee Guide (burr geometry, alignment tolerance, particle-size
  distribution, per-unit zero, cup-score inflation).
- **Independent trade press** — Perfect Daily Grind, Daily Coffee News, Sprudge,
  Coffee Review, intelligence.coffee (lot definitions, the single-origin spectrum,
  green trade, auctions).
- **Green importers, as corroboration** — Nordic Approach, Mercanta, Café Imports,
  Royal Coffee, Raw Material, Sweet Maria's (washing-station aggregation, mixed
  heirloom, one-lot-to-many-roasters). Weighed for commercial bias.

## Method & limits

Six independent research passes, each triangulating a different assumption cluster
across authoritative bodies and educators, each instructed to distrust any single
company's marketing as *"consensus."* This is a strong triangulated read — not a
formal audit by the bodies themselves. Where a primary site blocked automated
fetches (SCA and ACE among them), its mechanics were triangulated from the source's
own indexed pages plus independent corroboration; exact numeric thresholds (CoE's
86/87/90, jury sizes, the SCA-104 formula constants) are reported as consensus
figures, not quoted rulebook lines. Any single finding can be hardened by direct
verification before it is built.

*We do not sell coffee. We keep the record — and we check it against the world before
we trust it.*
