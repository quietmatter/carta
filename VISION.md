# CARTA — the lot at the centre

*A draft restructuring. The cup-centric north star (`NORTH_STAR.md`) is the record
of where CARTA started. This is the record of where it turns.*

*Second draft — revised against an industry-consensus QA of its structural
assumptions (`MODEL_QA.md`): the lot re-drawn as a commercial offering that splits
and merges, the origin actors pulled apart, quality split from traceability, and
caliber re-based on the SCA's current standard.*

## The turn

CARTA began as a personal coffee memory: **one cup, two contexts, your taste the
through-line.** The through-line was *you*.

It turns here. The through-line becomes **the coffee itself** — a single green
lot, traced from the ground it grew in to the cup in your hand — and your taste
becomes a lens laid over that trace, not the spine of it.

CARTA is now **an encyclopedia of specialty coffee, drawn as a map, keyed on the
lot.** You keep a record the way you always did; the record feeds a shared,
traceable atlas that everyone reading it makes clearer.

## The centre: the lot

A **green coffee lot** is the unit coffee is actually traded and known by — one
harvest, one parcel of a place, offered to the trade under one identity. Next
season it is a different lot; the farm beside it is a different lot. No product has
ever made it the centre, and it is where *"the same green, many roasters"* becomes
sayable. That is the claim the atlas rests on, and the industry check confirmed it
holds.

What the trade taught us to stop pretending: a lot is **not a tidy atom.** It is a
*commercial offering, and it splits and merges.* One washing station's lot may
gather cherry from hundreds of smallholders; one delivery is graded into several
export lots; an importer re-cuts small lots into a community lot. Its variety can be
a whole set (*mixed heirloom* is the honest default in Ethiopia, not a defect); its
process can run in stages. So the lot stays the hero — but modelled as a node with
**lineage, many possible producers, and an identity that can be split or merged**,
never as one indivisible thing. A blend is not a lot but a *cluster* of them, named
by a roaster; it sits beside the single origins in the atlas (see *Blends*, below).

Everything else is a branch off the lot, or a leaf on a branch. A roaster is not
the atom; a roaster is *what happened to a lot*. A café is not the atom; a café
is *where a roast of a lot is poured*. Your cup is not the atom; your cup is *one
reading, taken at the last node of the chain*.

## The three branches — the three questions

A lot's page answers three questions, and nothing else has to be on it.

1. **Where can I find it.** Which roasters bought this lot and offer it; which
   cafés pour it; how it reaches a cup — direct from the roaster, at the
   roaster's own bar, at a multi-roaster café. Each pour is a first-class
   availability record — a roast seen at a venue, dated and signed — so the branch
   holds even for a roast nobody has yet logged a cup of. The *availability* branch.
   This is discovery.

2. **How is it roasted.** The same green, in more than one hand. Each roaster's
   profile on this lot — level, roast date, the notes they market it by, the
   offering name. **This is the view nothing else shows:** four roasters, one
   washing station, four readings of the same coffee. The *roast* branch.

3. **Who is brewing it, and how.** Every brew logged against a roast of this lot —
   home and café — with its exact equipment and its recipe. The *brew* branch,
   and the dialing-in corpus grows out of it.

## The overlay: taste

Hedonic **1–9**, descriptors, and a derived palette are not the spine. They are a
**wash laid over it** — a colour and a score that any node can carry, rolled up
from the readings taken beneath it. A lot glows warmer where it has been loved; a
roaster's page carries the shape of its readings; the map is tinted by taste
without being *about* taste.

The overlay is where the person still lives. Your readings are yours, and the
quiet question — *what do I love, and does it travel* — is answered by walking the
spine with your own overlay lit. But the spine stands without you. An unrated lot
is still a complete, legible record of a coffee.

## The two surfaces

**The map.** The graph, drawn geographically. Producers at origin, roasters in
their cities, cafés on their streets, lines running lot → roast → bar. The
existing street layer (OpenStreetMap, repainted to CARTA, keyless, offline-safe)
already renders this; it stops decorating search results and becomes the atlas.

**The encyclopedia.** Every node is a page, and every page drills into the next.
A lot opens onto its producer, its roasts, its brews, its overlay. A producer
opens onto its lots across seasons. A roaster opens onto every lot it has touched.
Nothing is a dead end; the pleasure is the drilling-in. Restrained on the surface,
deep underneath — the detail unveils only as far as you reach for it.

## The spine, as data

The lot is normalised, not copied. Today origin lives as flat text duplicated onto
every bag and cup — which is exactly why "the same green, many roasters" is
currently impossible to express. The restructure makes each of these a canonical,
shared, provenance-carrying entity, and lets records *reference* them:

- **Producer** — the grower: farm, estate, or smallholder. Region, altitude,
  country. *Grows cherry.*
- **Processor** — the washing station, wet mill, or dry mill where cherry is
  processed and first aggregated. **Not the same as the producer** — one processor
  gathers cherry from many growers, which is why a single lot can carry hundreds of
  them.
- **Aggregator** — cooperative, union, or exporter: the org that pools and moves the
  green. (Producer · Processor · Aggregator are the three origin actors the trade
  keeps distinct; the old single "Producer" quietly conflated them.)
- **Lot** *(the hero)* — references a Processor and **one or more Producers**, with a
  `scope` (single-farm · multi-farm · washing-station · community · cooperative ·
  region). Variety *as a set* (incl. *mixed heirloom* / *unknown*); process *in
  stages* (fermentation → drying → finishing); harvest as crop · year · hemisphere.
  Carries a **sourcing channel** and, separately, an **intermediary** (see *Lot
  identity*); a recorded **traceability resolution**; split/merge **lineage**; and a
  stable opaque id — identity adjudicated, never keyed on the text.
- **Blend** — a roaster's named composite. References a **Roaster** and two or more
  Lots — a blend is a recipe *authored* at the roaster, so it belongs to one: two
  roasters combining the same lots make two blends, not one. Sits *beside* single-
  origin lots in the atlas; only as traceable as its vaguest component (see *Blends*,
  below). This asymmetry is deliberate — a single origin points at a shared atom, but
  a blend is authored, so it is owned.
- **Roaster** — references nothing; is referenced by roasts and blends.
- **Roast** — references a Roaster and either a **Blend** or **one or more Lots** at
  a stated origin granularity (a "single origin" is often a co-op or regional lot,
  not one farm). Roast level as a **free descriptor** the roaster used — never a
  normalised scale, because one roaster's *medium* is another's *dark* — plus roast
  date, offering name, and the roaster's own notes (a *reading*, not fact). The node
  that makes branch 2 possible.
- **Venue** — the café or bar. *This already exists* — it is the Register, the
  proof that CARTA can hold a canonical shared entity. Where a roast is poured or
  sold.
- **Gear** *(canonical)* — the exact grinder model and brewer model, as shared
  catalog entities. The key the brew corpus aggregates on. Distinct from a keeper's
  **Setup** — the per-user instance that references a canonical grinder + brewer and
  carries *their* grind scale (`grindMin`/`grindMax`/`grindStep`), kept exactly as
  today. Gear is what transfers; the Setup is how one keeper's dial moves.
- **Preparation** — the parent of every Reading, in one of two forms, so a reading
  always rolls up the same shape:
  - **Brew** *(home)* — your preparation. References a Roast, a Setup (its canonical
    Gear), and a purchase channel. The recipe. Enters the corpus only on an exact
    Gear match.
  - **Pour** *(café)* — the venue's preparation. References a Roast and a Venue. The
    **availability edge** of branch 1, dated and provenance-carried like a Register
    sighting; the recipe is unknown and never invented.
- **Reading (Cup)** — the overlay. Hedonic, descriptors, palette. Hangs off a
  **Preparation** — a Brew at home, a Pour at a café — so it always rolls up the same
  road, honestly sparse where the café's recipe isn't known.

The machinery for all of this is written. The Register already does canonical
identity, provenance, sparse merge (a sighting fills blanks, never erases), and
sync as a group document. The restructure extends that one proven pattern upstream
from the café to the producer, the lot, the roaster, the roast.

## Lot identity — how the lot stays singular

The whole atlas rests on one thing: two people entering the same green coffee
must land on the *same* lot node, and two genuinely different lots must never
collapse into one. This is the hardest problem in the product, and it cannot be
solved by a key, because **traceability degrades downstream.** A producer knows
the exact parcel; an importer mostly does; a roaster prints what it chooses; a
café bag may say only *Ethiopia*. You cannot demand a global lot number at the
point where most records are entered, because the record rarely carries one.

So identity is not a field. It is adjudicated, confidence-graded, and correctable:

- **A stable id, a fingerprint for matching.** Each lot carries an opaque id
  assigned once (as Register entries already do). Matching is done on a
  *fingerprint* of its traceable facts — producer · country/region · harvest ·
  varietal · process · lot designation · auction reference. No single field is
  identity; the cluster is. Correcting a typo never changes what a lot *is*.
- **Propose, then confirm.** On entry, CARTA finds candidate lots by fingerprint
  overlap and asks the curator plainly — *"this looks like Nine's Gedeb, natural,
  2024 — the same lot?"* Confirm binds the roast to the existing node; reject
  forks a new one. The machine proposes; the keeper decides. It fits the
  moderation model already chosen.
- **Traceability resolution is recorded, not required.** Resolution is one *spatial*
  ladder — *country → region → washing-station → farm → lot → micro/nano* — and
  nothing else rides on it: process, variety and harvest are their own fields, not
  rungs. An under-specified roast (*"Ethiopia Guji, natural"* with no farm) binds at
  the **coarsest node it can actually prove.** What improves later is the **record**,
  not the coffee: when someone supplies the missing facts the entry is enriched,
  timestamped and signed — the coffee was always that traceable; we simply know more
  now. And **traceability** (how finely origin is *known*) stays distinct from
  **transparency** (whether price and relationship are *disclosed*) — the trade
  treats them as two things, so we do too. A vague claim never masquerades as a
  precise one.
- **Merge and split are first-class.** You *will* learn later that two lots were
  one, or one was two. Both operations re-point every downstream roast and
  preserve every contributor's provenance — the sparse-merge instinct the Register
  already has, extended with re-parenting. Nothing is lost in a correction.

Resolution feeds tiering (below): how legibly a coffee traces is one of the honest,
measurable axes a lot stands on.

## Blends — a cluster with its own name

A blend is not an atom, and pretending it is would break the spine. A single-origin
lot exists **at origin**, independent of any roaster; a blend exists **at the
roaster**, who chooses to combine lots. They are different in kind. But the reader
should still browse them side by side — a blend is a coffee you drink like any
other.

Both are true at once by separating two layers:

- **The green layer** keys on single-origin lots — the "same green, many roasters"
  view is a property of one lot.
- **The offering layer** is what you browse — a roaster's product, which is either a
  single-origin roast (one lot, or the several lots of one co-op or region) or a
  **Blend**: a named cluster of two or more lots, with ratios *when disclosed*,
  unknown when not. At this layer single origins and blends sit adjacent, exactly as
  they should.

- **A blend belongs to its roaster and references its component lots.** Identity is
  roaster + name + composition, so two roasters combining the same lots make two
  blends, not one. Every component drills back into the spine, and each single-origin
  lot's page carries the reverse edge — *also appears in these blends*, named by
  whom. Components disclosed only in prose (*"washed Latin American coffees"*) bind
  at coarse-resolution lot nodes or none — the blend stays browsable, just less
  traceable.
- **Composition is dated, and rotation is first-class.** A house blend's recipe
  moves season to season; a blend carries dated compositions the way a producer
  carries per-harvest lots, and a *seasonal / rotating* blend is a normal kind, not
  an anomaly. Same name, honest about change.
- **Blends reference lots, not other blends.** A blend of blends flattens to its
  component lots. No recursive composites — the lot stays the lot.

## The standing — tiering, compiled from facts

The old café *reach* had the right soul and the wrong subject. Its instinct —
*separate coffees by depth, compile the reading from evidence, never let anyone
just pick a badge* — belongs on the **coffee**, not the café. Reborn, it becomes a
coffee's **standing**: an honest read of its rarity and caliber, so a keeper can
feel the difference between an everyday lot and a rare, fully-traced, competition
coffee.

The danger is obvious and must be refused: standing must never become a laundered
taste verdict. A coffee's caliber is **not** whether you enjoyed it — that is the
overlay, and it stays yours. An 82-point daily lot you love outranks a 92-point
gesha *on your overlay*; standing only states what the coffee **is in the world**.
So the rule, inherited from the reach: **compiled from declared, sourced facts —
never picked, and always showing its evidence.**

Standing stands on three measurable axes, each a fact with provenance, each able to
read *unread* when the evidence isn't there yet:

- **Caliber** — a cup score, carried as a **record, never a bare number:**
  `{ score · protocol · cupper · event · date }`. The protocol matters now, because
  the SCA **retired the 2004 cupping form in November 2024** for the Coffee Value
  Assessment, whose scores spread wider and do not convert 1:1 — an untagged "90"
  silently mixes two scales. The new form sets *no* official specialty cutoff (80 is
  a carried-over convention, and contested), so 80 shows as a labelled convention,
  not a law. Admissible only if it can name its source (the ladder, below); sourced,
  or it reads *unread*. **Price is not caliber** — a record auction price is a rarity
  signal, and it never raises this axis.
- **Rarity** — how scarce the green is: lot size in kg/bags when disclosed, auction
  vs. commodity provenance, **auction clearing price** (a demand signal, kept here
  and never in caliber), an inherently scarce varietal (gesha, sudan rume, pink
  bourbon), and **how narrowly it is carried** — a signal the atlas *measures
  itself*, since it knows how few roasters bought it and how few bars pour it.
- **Traceability** — the lot's recorded resolution on the spatial ladder (country →
  farm-lot → micro). How legible the coffee's road is — a fact about disclosure, not
  quality, and **independent of caliber**: a superb coffee can be thinly traced, a
  fully-traced one merely good. The two never infer each other.

### Caliber admits a score only if it names its source

Caliber is where authenticity is won or lost, because the number a roaster prints
on a bag is a marketing instrument, not a cupping. So caliber admits scores by a
**source ladder**, and only the grounded tiers set the standing:

1a. **Independently-juried competition** *(strongest)* — Cup of Excellence, a
   national CoE, Best of Panama: blind, dual-jury, published, dated, verifiable
   against a public record that persists. Carried as placing/score + event + year +
   protocol.
1b. **Producer- or estate-run auction** — Gesha Village, Pride of Gesha and the
   like. Real and published, but scored by the estate or an invited panel, not an
   independent jury — above a seller's own number only for being on the record.
2. **Attributable protocol score** — an SCA-protocol cupping from a named Q-grader
   or lab (stronger), or an importer offer-sheet score where the cupper is named
   (weaker, and often scored at the coffee's peak, never re-scored as it fades).
   Above rung 3 for *calibration and cross-checking*, not for being more disinterested.
3. **Credentialed keeper cupping** — a CARTA contributor with a recognised
   calibration (evolved-Q, legacy Q, SCA Sensory Skills, or competition-jury service)
   cups to protocol and signs it; a panel of signed cuppings weighs more than one. A
   non-credentialed estimate is welcome as a *reading* on the overlay — it never sets
   caliber.
4. **Roaster / retail claim** *(inadmissible)* — a number with no attributable
   cupper. **This never sets standing and never prints as the score.** Recorded only
   as a claim, shown as *"roaster-stated 92 — unverified."* This is the poison line.

Barista competitions (World Barista Championship, Brewers Cup) score the
*competitor*, not the coffee — they are **firewalled out** of caliber entirely, and
may only ever appear as usage provenance (*"this lot was poured at WBC"*).

Caliber reads **unread** until an admissible source exists — never a number pulled
from a bag. Every caliber badge names its tier and protocol on one tap —
*"90.1 · CoE Ethiopia 2024 · #7"* or *"89.5 · Q (CVA), [lab], 2025"* — so the reader
always knows the score, the standard behind it, and how far to trust it.

The tier is the **compiled reading across the three**, and — like every reach badge
before it — it **explains itself**: one tap opens the score and who cupped it, the
lot size and where that came from, the traceability resolution. No coffee is
declared *better*; a coffee is *rarer*, *higher-cupped*, *more fully traced* —
stated as facts, each striking *unread* when unproven rather than defaulting to the
low end. A blend's standing derives from its components, and is only as traceable as
its vaguest one. Marks stay monochrome; standing is a lens in discovery, never a
sort that outranks your own taste.

## The brew corpus — exact matches only

Others may log their home brews, and the value is a shared floor of starting
points: *given this roast and this exact grinder and brewer, here is where people
began.* It is never for commercial use, and it never pretends.

**Grind does not normalise across grinders — so it never will here.** A number
carried between two different grinders is a rumour; the corpus keys on canonical
**Gear** (the grinder model) so it never prints one. But the trade's own technicians
taught us the harder truth: even *one model* is only a whisper — burr alignment,
per-unit zero-point, drivetrain variants and burr seasoning all move the number. So
same-model grind is shown as a **distribution with a "calibrate to your own zero"
note**, never one authoritative figure, while each keeper's **Setup** still carries
the scale that makes their own dial move. What *does* transfer is shown with
confidence — ratio, temperature, time, agitation, water, method — and pools not just
on the exact brewer but up a **method cluster** (immersion · conical · flat-bottom ·
hybrid · pressure), where those variables legitimately carry. **Espresso is its own
corpus** — grind there depends on machine, basket and dose, so it is never folded in
with filter. Once a roast has enough exact-match brews, the algorithm — and later an
LLM over the corpus — can offer a first dial-in without ever having lied about what
transfers.

## Contribution and curation

The catalog is **moderated**, and at the start the moderator is you.

- **The spine is curated.** Producers, lots, roasters, roasts enter as proposals
  and stand once approved. This is what keeps the atlas trustworthy and the
  luxury quiet — a small, correct, beautiful dataset, not a crowd's mess.
- **The overlay is free.** Anyone keeps their own readings and brews; they roll up
  without a gate. Nobody needs permission to taste.
- **Ingestion is assisted.** A curator points CARTA at a roaster's offering page
  or an auction lot record, and it drafts the entity — producer, lot, roast — for
  approval. This is how the atlas fills from *your* research at speed, before a
  second contributor ever exists, and it is the same pipeline that later helps a
  traveller find a cup in a city they have never walked.

## The gate: specialty *and* traceable — two bars, not one

CARTA curates coffee that is both **specialty-grade** and **traceable** — but these
are **two independent facts, and the model never infers one from the other.** The
SCA's own 2021 definition splits them for a reason: quality is an intrinsic cup
property, traceability an extrinsic one about disclosure, and they diverge all the
time — an 84-point coffee can be thinly traced, a meticulously-traced lot can score
below the line. So each coffee carries a **quality** signal and a **traceability**
signal *separately*; the catalog can be filtered on either, and neither is ever read
off the other. Bounding the atlas to coffee that clears both bars is not a limit that
costs something — it is what keeps the universe small enough for one keeper to seed
and moderate, and clean enough for discovery to mean something. The scarcity is the
luxury.

## What this keeps, and what it demotes

**Kept, and made load-bearing:**

- The Register machinery — canonical entities, provenance, sparse merge, sync.
- The brew form and the per-Setup grind scale — dialing-in is now a first pillar,
  and "a grind is only comparable within one Setup" becomes the corpus's honesty. A
  Setup now names a canonical grinder + brewer (Gear), so the corpus can find its
  exact matches.
- The reading — hedonic 1–9, descriptors, the derived palette.
- Offline-first, single-file, self-hosted sync. Quiet by construction.

**Demoted or retired:**

- **"One cup, two contexts"** as the frame. Home and café stop being a matched
  pair and become two *channels* a lot reaches a cup through.
- The café **reach** (○ ◎ ◉ ●) as built — retired as a café measure, **reborn on
  the coffee** as *the standing* (above): rarity and caliber compiled from sourced
  facts, its self-explaining, compiled-never-picked soul kept intact.
- The **social stream / friends** — the atlas and its overlay replace the feed.
- The **matching engine** — kept, but as the discovery overlay on lots and venues,
  secondary to the encyclopedia, never the front door on its own.

## Restraint — the quiet luxury standard

- **The lot is the hero. Everything else earns its place around it.**
- **Surface calm, depth on demand.** A page shows little; it drills far.
- **The spine stands without the overlay.** Taste enriches; it is never required.
- **The catalog is correct before it is large.** Curated, not crowded.
- **Never print a number that lied to get there** — grind across grinders, a score
  without its readings, a precision the record does not have.
- **We do not sell coffee. We keep the record — and now, the atlas.**

## Sequence

1. **Normalise the spine.** Turn producer · processor · aggregator · lot · blend ·
   roaster · roast · gear into canonical entities; split a cup into a Reading over a
   Preparation (Brew or Pour); make bags and cups reference them; migrate existing
   flat origin text by de-duplicating it into nodes. Unlocks the "same green, many
   roasters" page.
2. **Lot identity.** The fingerprint match, propose-and-confirm entry, traceability
   resolution, and merge/split — the guardrails that keep the atom singular before
   the catalog grows.
3. **Curator ingestion, LLM-assisted.** Fill the atlas from existing off-app
   research, with moderation and identity-adjudication built in.
4. **The two surfaces.** The lot-keyed map and the encyclopedic pages over the
   normalised spine.
5. **The standing.** Tiering compiled from sourced caliber · rarity · traceability —
   caliber carried with its protocol and source, quality and traceability kept
   independent, each self-explaining, each able to read *unread*.
6. **The brew corpus.** Exact-match dial-in starting points on each roast.
7. **Discovery, over saturated data.** The algorithm and the LLM, once the overlay
   is dense enough to inform them.
