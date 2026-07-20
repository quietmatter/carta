# CARTA — the lot at the centre

*A draft restructuring. The cup-centric north star (`NORTH_STAR.md`) is the record
of where CARTA started. This is the record of where it turns.*

## The turn

CARTA began as a personal coffee memory: **one cup, two contexts, your taste the
through-line.** The through-line was *you*.

It turns here. The through-line becomes **the coffee itself** — a single green
lot, traced from the ground it grew in to the cup in your hand — and your taste
becomes a lens laid over that trace, not the spine of it.

CARTA is now **an encyclopedia of specialty coffee, drawn as a map, keyed on the
lot.** You keep a record the way you always did; the record feeds a shared,
traceable atlas that everyone reading it makes clearer.

## The atom: the lot

A **green coffee lot** is the smallest distinct, unrepeatable unit in coffee.
One producer, one harvest, one varietal, one process, one parcel offered to the
trade. Next season it is a different lot. The farm beside it is a different lot. It
is the thing that is *actually* singular — and the thing no product has ever made
the centre. A blend is not a lot but a *cluster* of them, named by a roaster; it
sits beside the single origins in the atlas (see *Blends*, below).

Everything else is a branch off the lot, or a leaf on a branch. A roaster is not
the atom; a roaster is *what happened to a lot*. A café is not the atom; a café
is *where a roast of a lot is poured*. Your cup is not the atom; your cup is *one
reading, taken at the last node of the chain*.

## The three branches — the three questions

A lot's page answers three questions, and nothing else has to be on it.

1. **Where can I find it.** Which roasters bought this lot and offer it; which
   cafés pour it; how it reaches a cup — direct from the roaster, at the
   roaster's own bar, at a multi-roaster café. The *availability* branch. This is
   discovery.

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

- **Producer** — farm · washing station · cooperative · grower. Region, altitude.
- **Lot** *(the atom)* — references a Producer. Varietal(s), process, harvest year,
  lot identifier, the green's provenance (auction, direct trade, importer), and a
  recorded **traceability resolution** — how specifically it is pinned (see *Lot
  identity*, below). A stable opaque id; identity adjudicated, never keyed on the
  text.
- **Blend** — a composite offering that references two or more Lots, defined at the
  roaster, not at origin. Sits *beside* single-origin lots in the atlas; only as
  traceable as its vaguest component (see *Blends*, below).
- **Roaster** — references nothing; is referenced by roasts.
- **Roast** — references a Lot *or* a Blend, and a Roaster. Level, roast date,
  offering name, the roaster's own notes. The node that makes branch 2 possible.
- **Venue** — the café or bar. *This already exists* — it is the Register, the
  proof that CARTA can hold a canonical shared entity. Where a roast is poured or
  sold.
- **Equipment** — grinder and brewer, by exact model. The key the brew corpus
  aggregates on.
- **Brew** — references a Roast, a purchase channel, and Equipment. The recipe.
- **Reading (Cup)** — the overlay. Hedonic, descriptors, palette. Hangs off a Brew
  (home) or a Roast-at-a-Venue (café).

The machinery for all of this is written. The Register already does canonical
identity, provenance, sparse merge (a sighting fills blanks, never erases), and
sync as a group document. The restructure extends that one proven pattern upstream
from the café to the producer, the lot, the roaster, the roast.

## Lot identity — how the atom stays singular

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
- **Traceability resolution is recorded, not required.** Every lot states how far
  it is pinned — *specific lot · producer + process · region + season · country
  only*. An under-specified roast (*"Ethiopia Guji, natural"* with no producer)
  binds at the **coarsest node it can actually prove** and is **promotable** later,
  when someone supplies the missing facts, without losing its history. A vague
  claim never masquerades as a precise one — the honesty principle, upstream.
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

- **The green layer** keys on single-origin lots. They are the atoms; the "same
  green, many roasters" view is a property of one lot.
- **The offering layer** is what you browse — a roaster's product, which is either
  a single-origin roast (one lot) or a **Blend**: a named cluster of two or more
  lots, with ratios *when disclosed*, unknown when not. At this layer single
  origins and blends sit adjacent, exactly as they should.

- **A blend references its component lots**, so every component drills back into
  the spine, and each single-origin lot's page carries the reverse edge — *also
  appears in these blends*. Components disclosed only in prose (*"washed Latin
  American coffees"*) bind at coarse-resolution lot nodes or none — the blend stays
  browsable, just less traceable.
- **Composition is dated.** A house blend's recipe moves season to season; a blend
  carries dated compositions the way a producer carries per-harvest lots. Same
  name, honest about change.
- **Blends reference lots, not other blends.** A blend of blends flattens to its
  component lots. No recursive composites — the atom stays the atom.

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

- **Caliber** — the SCA cupping score (80–100) or a competition result (Cup of
  Excellence, Best of Panama, a national placing), *with its source and cupper*.
  This is the industry's own instrument, and the SCA gate already means every
  coffee here is on this scale. Sourced, or it doesn't count.
- **Rarity** — how scarce the green is: lot size in kg/bags when disclosed, auction
  vs. commodity provenance, an inherently scarce varietal (gesha, sudan rume, pink
  bourbon), and **how narrowly it is carried** — a signal the atlas *measures
  itself*, since it knows how few roasters bought it and how few bars pour it.
- **Traceability** — the lot's recorded resolution (farm-lot → country-only). How
  legible the coffee's whole road is. The reach's original axis, now honest because
  it is a fact about disclosure, not a judgment of quality.

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

**Grind does not normalise across grinders — so it never will here.** A starting
point aggregates only across *exact equipment matches*: same grinder model, same
brewer. Two people on the same Comandante and the same V60 can share a number; a
number carried between two different grinders is a rumour, and CARTA will not
print it. Ratio, temperature, time, and method are comparable and shown as such;
grind is shown only within its exact match. Once a roast has enough exact-match
brews on it, the algorithm — and later an LLM over the corpus — can offer a first
dial-in without ever having lied about what transfers.

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

## The gate: SCA specialty, only

CARTA holds **Specialty-Coffee-Association-grade coffee only** — traceable, named
lots. This is not a limit that costs something; it is the decision that makes a
traceable atlas *possible*. A universe bounded to coffee that can actually be
traced is small enough for one keeper to seed and moderate, and clean enough for
discovery to mean something. The scarcity is the luxury.

## What this keeps, and what it demotes

**Kept, and made load-bearing:**

- The Register machinery — canonical entities, provenance, sparse merge, sync.
- The brew form and the per-Setup grind scale — dialing-in is now a first pillar,
  and "a grind is only comparable within one Setup" becomes the corpus's honesty.
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

1. **Normalise the spine.** Turn producer · lot · blend · roaster · roast into
   canonical entities; make bags and cups reference them; migrate existing flat
   origin text by de-duplicating it into nodes. Unlocks the "same green, many
   roasters" page.
2. **Lot identity.** The fingerprint match, propose-and-confirm entry, traceability
   resolution, and merge/split — the guardrails that keep the atom singular before
   the catalog grows.
3. **Curator ingestion, LLM-assisted.** Fill the atlas from existing off-app
   research, with moderation and identity-adjudication built in.
4. **The two surfaces.** The lot-keyed map and the encyclopedic pages over the
   normalised spine.
5. **The standing.** Tiering compiled from sourced caliber · rarity · traceability,
   each self-explaining, each able to read *unread*.
6. **The brew corpus.** Exact-match dial-in starting points on each roast.
7. **Discovery, over saturated data.** The algorithm and the LLM, once the overlay
   is dense enough to inform them.
