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
One producer, one harvest, one varietal (or a named blend of them), one process,
one parcel offered to the trade. Next season it is a different lot. The farm
beside it is a different lot. It is the thing that is *actually* singular — and
the thing no product has ever made the centre.

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
  lot identifier, and the green's provenance (auction, direct trade, importer).
- **Roaster** — references nothing; is referenced by roasts.
- **Roast** — references a Lot and a Roaster. Level, roast date, offering name,
  the roaster's own notes. The node that makes branch 2 possible.
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
- The café **reach** (○ ◎ ◉ ●) as built — its instinct was right, but the depth
  that matters is the *lot's* traceability, not the café's. It may return as
  "how far up the chain is this coffee legible," keyed on the lot.
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

1. **Normalise the spine.** Turn producer · lot · roaster · roast into canonical
   entities; make bags and cups reference them; migrate existing flat origin text
   by de-duplicating it into nodes. Unlocks the "same green, many roasters" page.
2. **Curator ingestion, LLM-assisted.** Fill the atlas from existing off-app
   research, with moderation built in.
3. **The two surfaces.** The lot-keyed map and the encyclopedic pages over the
   normalised spine.
4. **The brew corpus.** Exact-match dial-in starting points on each roast.
5. **Discovery, over saturated data.** The algorithm and the LLM, once the overlay
   is dense enough to inform them.
