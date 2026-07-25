# CARTA — can the lot be found twice?

*The identity spike. The whole model keys on the green lot; the load-bearing
claim is "the same green passes through more than one roaster's hands." That is
only a database fact if two roasters' offerings can be resolved to one lot. This
is the spike that tested whether they can — run before the spine becomes a
schema, because if lot identity is intractable it isn't a feature to weaken, it's
the reason the lot is the centre.*

Five independent research passes, each on **real, named lots** in a different
sourcing channel — importer offer lists, competition auctions, East African
washing-station aggregation, the Ethiopian traceability floor, and what a roaster
actually prints on the bag. Each was told to distrust marketing and report the
actual identifier format, not a generality. This is what they found, what it
costs to adjudicate, and what it forces in the model.

## The verdict

**Tractable — but the lot is a resolution, not a key.** "Same green" is a
confidence-tiered *merge*, never a foreign-key join. Build propose-and-confirm on
a fuzzy fingerprint; treat a printed lot code as a rare, strong *confirm* signal,
never a required key; carry the grain at which identity was actually established
as a first-class fact; and let the **processor × season** stand as a legitimate
terminal node, not a failure to reach the lot. A deterministic-key encyclopedia
keyed on the green lot would be un-populatable for the large majority of real
logs — and building one would have been the mistake this spike existed to catch.

The three numbers that decide the architecture — how often two offerings can be
resolved, from what a person can actually see on the bag:

- **~5–10% — deterministic.** Both records carry a shared *printed* hard ID (a
  Kenyan outturn, a Cup of Excellence lot, a Gesha Village auction code) and both
  keepers typed it. Real, strong, and confined to the auction / branded-estate /
  Kenya slice.
- **~50–60% — fuzzy propose-and-confirm.** The tuple *producer/station · variety ·
  process · crop-year* is enough to say "likely the same green — confirm?" This is
  the default, and it is where the keeper does the work the machine can't.
- **~30–40% — unresolvable below the processor.** Ethiopian station coffees marked
  only "region · G1 · heirloom," rebranded split lots, invented single-origin
  names. Here even an expert cannot bind the two labels to one green. Identity
  bottoms out at station-and-season, and that must read as a real node, never a
  blank.

**The single most consequential finding.** For a large fraction of specialty
coffee the finest *provable* identity is not the green lot — it is the
**processor in a given harvest**. This does not break the thesis; it sharpens it,
and it vindicates the QA's split of Producer · Processor · Aggregator. But it
means the node a keeper most often browses and the app most often has to draw is
the **washing-station × season**, with the green lot as an optional finer child
that instantiates only when the evidence reaches it. Design the centre to hold
both grains, or a third of the record has nowhere to live.

## Where a hard key exists — the clean minority

Four places in the trade mint an identifier stable and public enough that two
roasters can be adjudicated to *literally the same green*:

- **Kenya — the outturn number.** The closest thing in all of coffee to a true
  canonical green-lot key. Format `00AA0000` (week-of-season · dry-mill code ·
  batch — e.g. `17KF0001`, `20CK0115`), **sewn into every bag**, printed verbatim
  on the Nairobi Coffee Exchange sale catalogue (columns `OUTTURN · MARKS · MILL ·
  GRADE`), and it survives the channel — auction or direct "second window" both
  carry it. One outturn splits by screen into AA / AB / PB / C, each a separate
  export lot, so the correct key is **outturn + grade**: station-and-year
  over-merges (many outturns a season), grade alone over-splits (one cherry, many
  screens).
- **Competition auctions — the public dated archive.** Cup of Excellence keys a
  lot as *program · country · year · rank · split-suffix* (the top three ≥90 split
  into `#1a` / `#1b`), with rank · farm · score · buyer published back to 1999 and
  now a queryable Farm Directory. Best of Panama: *estate · variety · plot · lot# ·
  year*. Gesha Village: *lot# · block · variety · process* (a `GVA.` prefix some
  years). Buying **consortiums prove the thesis directly** — Colombia COE 2021's
  "La Siria" Geisha split across George Howell, Intelligentsia, Passenger, Bird
  Rock and Cometeer under one lot number; Gesha Village Lot 119 traveling intact
  across Rosso, R Ki, mazelab and Onyx.
- **Branded-estate programs — proprietary but stable.** Ninety Plus ("Perci Lot
  50," "Gesha Lot 23188") and Hacienda La Esmeralda's Special auction mint their
  own numbered lots and sell them to many roasters. Stable *per seller*; no
  neutral registry, so cross-checking leans on the seller's own archive staying
  up.
- **The ICO mark — standardized, and invisible.** `country / exporter / parcel`
  (e.g. `001/0001/00001`) is the only globally parcel-unique token. It lives on
  the certificate of origin and the export bag — and essentially never on the
  consumer bag. One ICO parcel fans out to many roasters, so even where it
  surfaces it names the shipment, not the offer.

**The false friends** — identifiers that look like keys and are not: the importer's
internal warehouse Ref/SKU (Royal Coffee's `38302-1 … SPOT RCWHSE`) is private,
season-scoped, and dropped when the roaster re-bags; the auction catalogue's own
`LOT` number is a per-sale seating position that resets every sale; a grade token
(G1, AA, SHB) is a quality class shared by thousands of lots. None may ever be the
identity key.

## Where it doesn't — the default case

- **Sub-portion and rebrand.** The routine shape: an importer lands one lot, sells
  a few boxes each to many roasters, and every roaster drops the importer's Ref
  and re-narrates the coffee in its own words. The green is shared; the printed
  string is not. The trade names this openly — "the same lot may be sold
  simultaneously… under different claims."
- **Rwanda / Burundi — the day-lot.** A station (Remera ≈ 700 farmers; Long Miles
  ≈ 5,700 across 11 hills) separates cherry by day and often by hill, then usually
  *recombines* day-lots into an export lot. The day-lot code is the real atom and
  is rarely printed, so "Rwanda Remera 2024" names the processor, not the lot.
- **Ethiopia — below the station, identity is destroyed at source.** A washing
  station blends thousands of smallholders' cherry into day-lots and 150-bag
  export lots that no consumer label distinguishes; variety collapses to "mixed
  heirloom." Post-2017 direct trade restored *station-level* traceability, but the
  ECX era (still the volume norm) floors identity at **woreda + grade** — no
  station, no lot, nothing finer to bind.

## The collisions — the taxonomy

Every naive key fails in one of two directions. A real design has to guard both;
most guard only the first.

**Over-merge — same string, different green (false positive):**

- Processor + year, where a season is dozens–hundreds of separable lots (any
  Ethiopian or Rwandan station; a Kenyan factory's many outturns).
- Farm + year for a prolific winner — Finca El Injerto has taken COE #1 roughly
  nine times; even *year* can hide a variety change (Bourbon one year, Pacamara
  the next).
- A co-op / union name that is a *superset* of several stations (Barichu FCS ⊃
  Gatomboya, Gaturiri, …) — merging on it silently unions distinct greens.
- Roaster-invented names whose components rotate under one label (Onyx "Geometry"
  re-blends every few months); a house single-origin or blend name reused crop
  after crop (Square Mile "Red Brick").
- The auction catalogue `LOT` position and the importer Ref, which name the sale
  slot or the warehouse position, not the coffee.

**Over-split — same green, different string (false negative):**

- The sub-portion-and-rebrand case above: one lot, many roaster-invented names.
- Transliteration — Yirgacheffe appears as Yirga Chefe / Yirgachefe / Yergacheffe
  and more; Gesha / Geisha. Amharic-to-Latin has no canonical romanization, so
  string equality fails on the same place.
- Tier mismatch — one roaster heads the record with the farm ("Las Flores"),
  another the producer ("Jhoan Vergara"), another the mill or region. Same green,
  three different head-strings.
- Split-lot suffix loss — `#1a` and `#1b` collapse to `#1`; the same green, two
  physical boxes and buyers.
- One green offered by two importers under two different Refs.

A Kenyan grade-split sits between the two: AA and PB of one outturn are the *same
cherry* but *different physical export lots*. They are neither one node nor
strangers — they are **siblings under one processing batch**, which the model has
to be able to say.

## The proposed key — a ladder, not a field

No single identifier works across channels. The lot's identity is a **ladder** the
resolver walks, strongest rung first:

1. **A namespaced hard-ID set** — channel-typed tokens, `{scheme, value}`:
   `kenya-outturn` · `coe` · `best-of-panama` · `gesha-village` · `ninety-plus` ·
   `ico` · … A match on any shared token is a deterministic merge. Zero or many
   per lot; never assume one.
2. **The fingerprint** — for the ~90% with no shared token: *producer/station ·
   variety (a set, admitting `unknown`) · process (compound, admitting
   `unspecified`) · crop-year · region · importer*. This is the entity-resolution
   tuple every pass independently named. It proposes; the keeper confirms.
3. **The resolution grain** — a first-class field on the lot recording the level
   at which identity was actually established: `green-lot` · `station-season` ·
   `region-grade`. A station-season node is a legitimate, terminal record, not a
   half-filled lot. The ECX floor (`region-grade`) is an honest state, not a blank
   to coerce into a fake station.
4. **The guards.** Never *same-string ⇒ same lot* (split lots, rotating names);
   never *different-string ⇒ different lot* (transliteration, rebrand). `unknown`
   and `unspecified` never *block* a candidate match — they only fail to confirm
   one. Every merge is append-only and reversible — a sighting that only ever
   accumulates and can be superseded, exactly the reach / Register posture already
   in the app — so a wrong merge is corrected by a new line, never by erasing the
   record.

## The adjudication read — honestly

Propose-and-confirm is the **default, not the exception**. The deterministic key
is printed for the consumer under ~10% of the time and only for the auction /
branded / Kenya slice, so the machine cannot carry identity alone. What it *can*
do is propose: surface the fuzzy-fingerprint candidates and let the keeper make
the call the labels can't — the same posture the app already takes with the reach,
where a person attests a fact and the reading is compiled from it. Budget for a
normalization layer that folds transliteration variants and reconciles the naming
tier (farm vs producer vs station vs region) before proposing, or the fuzzy tier
degrades to noise. And accept the ceiling out loud: roughly a third of real logs
will never resolve below the processor-season, and the record is honest only if it
says so rather than inventing a precision it doesn't have.

## What it forces in the model

None of this dislodges the v2 spine — it confirms the hardest part of it and makes
it concrete:

- **The lot is a confidence-tiered resolution node, not a keyed atom.** It carries
  the offerings merged into it as append-only sightings with provenance and a
  confidence, and its identity is a ladder (hard-ID → fingerprint → grain). This
  is the Register pattern — canonical shared entity, sparse merge, sightings that
  only accumulate — extended one level upstream. The spike vindicates that plan;
  propose-and-confirm *is* the Register's proof-and-confirm.
- **The resolution grain is first-class**, and `station-season` is a terminal node
  the centre must hold — often *the* node a keeper browses.
- **A processing-batch parent above the lot** carries grade-splits as siblings
  (Kenya's outturn → AA / AB / PB), which is the concrete shape of the split/merge
  lineage the QA already called for.
- **The hard-ID is an optional, namespaced, multi-valued attribute**, never the
  primary key.
- **The fingerprint fields must tolerate the unknown** — variety a set, process
  compound, the head-name normalized and tier-aware — and never block a match on
  absence.

The thesis survives contact with the ground truth. "The same green, in more than
one hand" is real, routine, and — for the auction, Kenya and branded slice —
observably verifiable to a public key; for the rest it is a keeper-confirmed
inference over a fingerprint, ceilinged honestly at the processor-season. What the
spike changes is not *whether* the lot is the centre but *what identity means*
there: a resolution the record earns and shows its evidence for, never a key it
pretends to hold.

## Method & limits

Five independent passes, each triangulating one channel across standards bodies,
importers, auction houses, technical educators and trade press, each instructed to
distrust any single company's marketing as "the standard." The session's egress
policy blocked direct fetches of several primary sites (the SCA, ACE/Cup of
Excellence, Best of Panama, and most roaster storefronts among them), so identifier
*formats* quoted from real listing titles are hard evidence, while the disclosure
percentages are calibrated estimates across the surveyed set, not an audited
census — read them as the shape of the distribution, not exact figures. The
one-lot-many-roasters consortium cases and the sub-portion-and-rebrand practice are
documented in the trade press, cited in the passes. Any single load-bearing figure
— the ~10% hard-ID disclosure rate, the outturn format — can be hardened by direct
verification before it is built on.

*We do not sell coffee. We keep the record — and we found out what it costs to know
a lot when we see it twice.*
