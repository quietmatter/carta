# CARTA — the spine, as shapes

*The schema pass. `VISION.md` argues the lot belongs at the centre; `MODEL_QA.md`
tested that against the trade; `LOT_IDENTITY.md` spiked the hardest joint. This is
where the thesis becomes storable — the actual object shapes, the keys they live
under, and the honest read on whether they fit a single-file, `localStorage`-first,
offline PWA. Nothing here is committed to `index.html`; it is the map an
implementer builds from, and the place to break the model before code does.*

The rule the whole pass obeys: **invent no new machinery.** CARTA already keeps a
canonical, shared, provenance-carrying, sparse-merged, sync-as-one-document entity —
the Register (`carta.register.v1`). Its entry shape, its `regUpsert` sparse write,
its append-only `sightings`, its `mergeRegister` union-by-id — these are the pattern.
The restructure does not design a new database. It **extends the Register upstream**
from the café to the producer, the lot, the roaster, the roast, and adds two things
the reach never needed: a **confidence** on a sighting, and a **reference** from a
per-user record to a shared node.

## The two homes, unchanged

CARTA already splits storage exactly the way this model needs, and we keep the split:

- **Shared catalog** — knowledge common to every keeper on the device and, through
  sync, every keeper on the server. Today this is one document (`REG`). The
  restructure makes it a small **set** of documents, one per catalog entity type,
  each carrying the Register's envelope. This is the spine.
- **Per-user ledger** (`carta.v1.<userId>`) — one keeper's own records. Today: setups,
  bags, brews, cups, café profiles, prefs. After: the ledger **thins** — its records
  stop carrying flat origin text and start carrying **references** into the catalog.
  Readings and Brews stay here; they are yours.

The reason the split holds: the spine is *facts about coffee* (shared, moderated,
group-writable), the ledger is *your readings* (private, free, ungated). That is the
same line the Register already draws between "the café exists" and "your cup there."

## The storage map

```
carta.users                     user registry (unchanged)
carta.v1.<userId>               per-user ledger (thinned — see below)
carta.register.v1               VENUES — today's Register, kept as-is (café = Venue)
carta.catalog.producers.v1      \
carta.catalog.processors.v1      |
carta.catalog.aggregators.v1     |  new shared catalog documents,
carta.catalog.lots.v1            |  each a Register-shaped envelope
carta.catalog.blends.v1          |  (see "the envelope" below)
carta.catalog.roasters.v1        |
carta.catalog.roasts.v1          |
carta.catalog.gear.v1           /
```

Each catalog document is `{version, rev, dirty, entries, deleted}` — byte-for-byte
the Register's envelope, so `loadReg`/`saveReg`/`mergeRegister`/`schedulePush`
generalise to `loadDoc(kind)` with **no new sync logic**. The server side is already
built for it: `/api/cafes` is a group-writable rev/409 document, and adding
`/api/catalog/:kind` is the same handler with a different filename. One endpoint
shape, N documents.

**Why separate documents and not one big catalog?** Sync granularity and the
Cloudflare 2 MB chunk cap (`worker.mjs`). A keeper who logs a café cup dirties
`venues`, not `lots`; a lot correction pushes lots alone. Separate revs mean a busy
document doesn't force the quiet ones over the wire, and no single document
approaches the value cap. It also lets an old server 404 the catalog endpoints and
degrade exactly as the Register already does (device-local, no sync) — one entity at
a time.

## The envelope — every catalog entity

Every entry in every catalog document carries the Register entry's spine, and nothing
in the sync layer has to learn a new shape:

```js
{
  id,                    // uid(), stable opaque — the ONLY thing anything references
  kind,                  // 'lot' | 'producer' | 'roaster' | ...  (redundant with the
                         //   document, but travels with the entry through a merge)
  createdAt,
  firstBy, firstAt,      // provenance: who named it first, when  (backdatable, as today)
  by, updatedAt,         // provenance: who last touched it, when
  ...fields,             // the entity's own columns (below), written SPARSE by default
  sightings: [],         // append-only attestations — the reach pattern, generalised
  status: 'proposed'     // 'proposed' | 'stood'  — curation gate (VISION: the spine is
                         //   moderated). Overlay records never carry this; the spine does.
}
```

`regUpsert`'s law is unchanged and now load-bearing everywhere: **a sighting fills
blanks, never erases**; `{full:true}` (an editor) overwrites; provenance backdates so
the earliest record to name a node holds `firstBy`. That single function, renamed
`catUpsert(kind, …)`, writes every catalog entity. The invariant the whole atlas
leans on — *a sparse write must never strip a rich entry* — is already proven in the
café.

### The sighting, generalised

The reach sighting is `{id, by, at, bag?, seen?[], withdrawnAt?, supersededAt?}` —
append-only, signed, struck-not-deleted, unioned by id in sync. The catalog sighting
keeps every one of those bones and adds two facts the reach didn't need:

```js
{
  id, by, at,                    // signed line — as today
  fields: { ... },               // the facts this line attests (sparse)
  src:   { kind, ref, url? },    // where it came from: 'roast-offering' | 'auction-record'
                                 //   | 'keeper' | 'ingest' — provenance of the CLAIM
  confidence: 'stated'|'confirmed'|'derived',   // NEW — how sure this line is
  withdrawnAt, supersededAt      // struck, never removed — as today
}
```

The entity's visible fields are **compiled** from its standing sightings, exactly as
`reachCompile` compiles a depth: newest standing line per field carries, a struck
line keeps its ink, silence is not denial. `reachCompile` becomes `compile(entry)` —
the same fold, over `fields` instead of `bag`/`seen`. This is the mechanism that lets
identity be *compiled, never keyed* — the value on the lot is a reading over
attestations, correctable by a new line, never a cell someone overwrote.

## The entities — fields, in spine order

Only the **new or changed** columns are spelled out; every entity also carries the
envelope above. Types are informal (all JSON).

### Producer — *grows cherry*
```
name, kind:'farm'|'estate'|'smallholder'|'group',
country, region, locality, altitudeMasl:[min,max], lat, lon
```

### Processor — *washes / dries / first-aggregates* — **not the producer**
```
name, kind:'washing-station'|'wet-mill'|'dry-mill'|'natural-yard',
country, region, lat, lon, operator   // one processor gathers many producers'
                                       //   cherry — the reason a lot has many growers
```

### Aggregator — *pools and moves the green*
```
name, kind:'cooperative'|'union'|'exporter'|'importer', country
```

### Lot — *the hero* — its own section below.

### Roaster — *what happened to a lot* — references nothing
```
name, city, country, lat, lon, site, palette   // palette read from the site, as bags do today
```

### Roast — *the same green, one hand* — the node branch 2 stands on
```
roasterRef,                       // -> roaster.id
of: { lotRefs:[…] } | { blendRef },   // one-or-more lots at a stated grain, OR a blend
originGrain,                      // the granularity the roaster SOLD it at (may be
                                  //   coarser than the lot's own resolution grain)
offeringName,                     // the roaster's product name for it
level,                            // FREE text descriptor the roaster used — never a
                                  //   normalised scale (one roaster's medium ≠ another's)
roastDate, notes,                 // the roaster's own words — a reading, not a fact
site, palette
```

### Blend — *a cluster with its own name*, authored at a roaster
```
roasterRef, name,
compositions: [                   // DATED — rotation is first-class
  { at, components: [ { lotRef, ratio? } ], note? }
],
// identity = roasterRef + name + composition; two roasters, same lots => two blends.
// references LOTS only — a blend of blends flattens to component lots.
```

### Venue — *where a roast is poured* — **this is today's Register**, unchanged
```
name, city, neighborhood, address, lat, lon, palette, notes, tags[]
```

### Gear *(canonical)* — the key the brew corpus aggregates on
```
kind:'grinder'|'brewer', maker, model,
methodClass: 'immersion'|'conical'|'flat-bottom'|'hybrid'|'pressure'   // brewers only
// Gear is what TRANSFERS. A keeper's Setup (per-user, below) references a grinder.id
// + brewer.id and carries THEIR grindMin/grindMax/grindStep — kept exactly as today.
```

## The Lot, in full — the identity ladder as columns

The lot is the one entity where identity is the schema. Everything the spike found
becomes a field, and the four rungs of the ladder (`LOT_IDENTITY.md`) are four groups
of columns the resolver walks strongest-first.

```js
{
  // --- envelope: id, kind:'lot', provenance, sightings, status ---

  // --- references (the spine edges) ---
  processorRef,            // -> processor.id   (often the FINEST provable unit)
  producerRefs: [ … ],     // -> producer.id[]  — one-or-many; a station lot has hundreds
  aggregatorRefs: [ … ],   // -> aggregator.id[]

  // --- rung 3: resolution grain, FIRST-CLASS (recorded, never inferred) ---
  grain: 'green-lot' | 'station-season' | 'region-grade',
                           // the level identity was ACTUALLY established at.
                           // station-season is a legitimate TERMINAL node, not a
                           // half-filled lot. region-grade (the ECX floor) is an
                           // honest state, never a blank coerced into a fake station.
  scope: 'single-farm'|'multi-farm'|'washing-station'|'community'|'cooperative'|'region',

  // --- rung 1: the namespaced hard-ID SET (zero-or-many, never assume one) ---
  hardIds: [ { scheme, value } ],
                           // scheme ∈ kenya-outturn | coe | best-of-panama |
                           //   gesha-village | ninety-plus | esmeralda | ico
                           // a match on ANY shared token binds deterministically.
                           // kenya-outturn is keyed WITH grade (see processingBatch).
                           // NEVER holds a false friend: importer SKU, per-sale LOT
                           //   position, or a bare grade token (G1/AA).

  // --- rung 2: the fingerprint (the fuzzy majority; a CLUSTER, not one field) ---
  fingerprint: {
    headName,              // the record's head-string, NORMALISED + tier-tagged
    headTier: 'farm'|'producer'|'station'|'region',   // reconcile before proposing
    country, region,
    varieties: [ … ],      // a SET, admitting 'mixed-heirloom' / 'unknown'
    process: {             // COMPOUND + staged, admitting 'unspecified'
      family:'washed'|'natural'|'honey'|'anaerobic'|'experimental'|'unspecified',
      stages: [ … ]        // fermentation -> drying -> finishing, when disclosed
    },
    harvest: { crop, year, hemisphere },
    intermediary           // importer/exporter as a fingerprint field — SEPARATE from
                           //   sourcingChannel; a false-friend Ref never becomes a hardId
  },

  // --- rung 4: lineage — merge & split, both re-point downstream & keep provenance ---
  processingBatchRef,      // -> the PARENT above grade-split siblings (Kenya outturn ->
                           //   AA/AB/PB are siblings under one processing batch: same
                           //   cherry, different physical export lots)
  lineage: {
    mergedFrom: [ lotId ], // ids this lot absorbed (kept as tombstones, re-pointed)
    splitFrom:  lotId      // the parent this lot was cut from
  },

  // --- context ---
  sourcingChannel: 'competition-auction'|'branded-estate'|'direct-trade'|
                   'importer-spot'|'commodity',
  sizeKg, sizeBags,        // rarity inputs (VISION: the standing)

  // --- the standing, compiled from sourced facts (VISION) ---
  caliber:  [ { score, protocol, cupper, event, date, tier, src } ],  // records, never bare
  rarity:   { auctionPrice?, scarceVariety?, … },
  // traceability = grain, above. quality (caliber) and traceability stay INDEPENDENT.
}
```

The **processing-batch** entity is a light parent — its own tiny catalog *or* a
synthetic node in `lots` with `grain:'processing-batch'`; the schema prefers the
latter to avoid a ninth document, marking it with a `role:'batch'` flag so it never
shows as a browsable lot. It exists only to hold grade-split siblings together and
carry the Kenya outturn once, keyed with grade on each child.

### How identity gets resolved, in data terms

Resolution is a **function over the columns above**, not a stored verdict:

1. `resolve(candidate)` first hashes `hardIds` — any shared `{scheme,value}` is a
   deterministic merge (rung 1). This fires ~5–10% of the time.
2. Else it scores `fingerprint` overlap against existing lots (rung 2) — after a
   **normalisation layer** folds transliteration (`Yirgacheffe|Yirgachefe|…`) and
   reconciles `headTier`. `unknown`/`unspecified` never *block* — they only fail to
   confirm. Above threshold, it **proposes**: *"this looks like Nine's Gedeb,
   natural, 2024 — the same lot?"*
3. The keeper's answer is written as a **sighting**, not a mutation: confirm appends a
   `confidence:'confirmed'` line binding the roast to the node; reject forks a new lot
   and records why. Every binding is append-only and reversible — a wrong merge is
   struck by a later line, never erased (`mergeRegister` already unions sightings and
   never drops one).
4. `grain` is stamped from where resolution actually landed. If it bottomed out at the
   processor, the node is a legitimate `station-season` lot and the browse surface
   draws it as one.

This is why the lot is *"identity compiled, never keyed on the text"* in one concrete
sentence: **the resolver reads columns and writes sightings; it never writes the
identity cell, because there is no identity cell.**

## The per-user ledger, thinned

The ledger keeps its arrays but its records shed flat text for references. The
`blank` shape grows a couple of arrays and loses nothing (migration below keeps old
data alive).

```
setups: [ { …today…, grinderRef, brewerRef } ]      // + refs to canonical Gear;
                                                     //   grindMin/Max/Step stay
brews:  [ { …today…, roastRef, setupRef, channel } ] // was bagId/setupId; now a Roast
                                                     //   ref + purchase channel
cups -> readings: [                                  // a Reading over a Preparation
  { id, prepKind:'brew'|'pour',
    brewRef?         // prepKind:'brew'  -> a Brew above (home)
    pourRef?         // prepKind:'pour'  -> a Pour (café availability edge)
    hedonic, descriptors[], palette, notes }
]
pours: [ { id, roastRef, venueRef, at, by } ]        // café availability edge — dated,
                                                     //   signed, recipe UNKNOWN & never
                                                     //   invented. Register-shaped sighting.
cafeFavs, cafeWants, deleted, prefs                  // unchanged
```

A Reading **always hangs off a Preparation**, so it rolls up the same road whether it
began at home or at a bar — honestly sparse where the café's recipe isn't known
(`pour` carries no grind, no dose, and the reading never pretends otherwise).

## The overlay rollup

Taste is a wash over the spine (`VISION`), and in data it is a **derived read, stored
nowhere on the spine**. Any node's overlay — a lot's warmth, a roaster's shape — is
computed from the readings beneath it at render time (the way `shopAgg`/`avgHedonic`
already roll café cups up today). The spine entities carry **no hedonic column**;
putting one there would let a shared, moderated fact absorb a private taste, which is
exactly the laundering `VISION` forbids. Readings stay in the ledger; the rollup is a
function, per viewer, over the readings that viewer can see.

## Migration — flat text becomes references

The invariant from `CLAUDE.md`: *existing single-user data migrates automatically;
don't break that path.* The restructure adds a second, one-time migration on top of
the per-user-key one:

1. **Seed the catalog from every readable ledger** — the exact move `regSeed` already
   makes for cafés, widened. Sweep every bag and cup; for each, `catUpsert` a roaster
   (from `roaster`), a lot-fingerprint (from the origin fields), a roast (bag → roast),
   chronologically so the earliest record holds provenance. Idempotent, blanks-only.
2. **Re-point the ledger** — replace each bag/cup's flat origin text with the `id` of
   the node it seeded, keeping the old text in a `legacy` sub-object for one version so
   nothing is lost and the migration is reversible.
3. **Leave inert legacy fields inert** — `photo` on old records is already dead weight
   (`CLAUDE.md`); flat `origin*` fields join it, read-only, until a later version drops
   them once the catalog is trusted.

Resolution during seeding is deliberately **timid**: it merges only on a hard-ID match
or a very high fingerprint score, and otherwise forks. Over-splitting is a correctable
sighting; over-merging silently unions two greens, which is the worse failure
(`LOT_IDENTITY.md`, the collision taxonomy). The catalog starts a little too granular
and is merged *up* by curation — never auto-merged down.

## The honest read — does this fit the PWA?

This is the section that could quietly betray the product, so it goes last and it
does not flinch. Four pressures, and where each lands:

- **`localStorage` size.** The whole thing is still text under a per-origin quota
  (5–10 MB typical). The spine is *small by design* — `VISION`'s whole luxury thesis
  is a curated, correct, deliberately-bounded atlas, not a crowd's mess. A few
  thousand lots with sightings is comfortably inside a megabyte or two; separate
  catalog documents keep any one from ballooning. **If** the atlas ever outgrew the
  quota, the migration path is IndexedDB behind the same `loadDoc`/`saveDoc` seam —
  but that is a scaling contingency, not a launch requirement, and nothing in the
  schema assumes it. The honest risk is not the spine; it is a keeper with thousands
  of readings, and readings already live per-user exactly as today.

- **Single file, no build.** Everything above is plain objects and pure functions over
  them — `catUpsert`, `compile`, `resolve`, `mergeCatalog` — the same terse, inline,
  ES-module-free style the app is written in. No entity here needs a class, a bundler,
  or a dependency. The schema is *more* code in `index.html`, not a new kind of code.
  This constraint holds.

- **Offline-first.** Every catalog document is `localStorage`-resident and works with
  zero network, exactly as `REG` does; `resolve` runs against local entries; sync is
  additive on top (boot / `online` / `visibilitychange`). The one online-only moment
  is **assisted ingestion** (curator points CARTA at an offering page) — and that is
  already an *optional enhancement* by `VISION`'s own rule, degrading to manual entry,
  never a dependency. This constraint holds.

- **Sync & merge.** The hardest real question, and the reason the schema reuses the
  Register verbatim. Union-by-id, newer-`updatedAt`-wins, sparse-fill, append-only
  sightings, rev/409 optimistic concurrency — all already implemented and tested in
  `server.js` *and* `worker.mjs`. The additions are: N documents instead of one (same
  handler), and a `confidence` field on sightings (opaque to the server, merged like
  any other). **An API change still lands in both servers with both test suites kept
  passing** (`CLAUDE.md`) — the catalog endpoint and its merge get cases in `test.js`
  and `test-worker.js`. No new protocol, one new route shape.

The verdict: **it fits, because it is the Register wearing more hats.** The single
genuine unknown is not storage or sync — it is whether propose-and-confirm resolution
feels good in the hand, and that is a UX question for the ingestion pass, not a schema
one. The schema's job is to make identity *correctable*, and it does: every binding is
a sighting a later line can supersede.

## What this pass deliberately leaves open

- **The resolver's scoring function** — the fingerprint-overlap threshold, the field
  weights, the normalisation dictionary. That is a tuning problem for the identity /
  ingestion pass (`VISION` sequence step 2), and it wants real records to tune against.
- **The standing's exact compilation** — the caliber source-ladder, the rarity inputs,
  how the three axes read together. `VISION` specifies the *facts*; the compile
  function is its own pass (sequence step 5).
- **The processing-batch decision** — synthetic-node-in-`lots` vs. its own document.
  Written here as the lighter former; revisit if grade-splits prove common enough to
  earn a table.
- **Whether Gear is one document or two** (grinder / brewer split). One with a `kind`
  column is written above; trivial to split if the corpus wants it.

None of these block the first move. `VISION` sequence step 1 — *normalise the spine* —
is fully specified by the entity tables, the envelope, and the migration above. The
schema is ready to build against; the open questions are all downstream of it.

## The shape of the thing, in one breath

One envelope, reused nine times. One sparse write (`catUpsert`), reused everywhere.
One compile (`compile`, née `reachCompile`), folding sightings into a reading. One
merge (`mergeCatalog`, née `mergeRegister`), unioning by id and losing no line. One
sync route shape, one per document. The lot is the only entity with a hard problem,
and its answer is columns the resolver reads plus sightings the resolver writes —
never an identity cell, because *the lot is a resolution, not a key.*

*We do not sell coffee. We keep the record — and now we know what shape the record
takes.*
