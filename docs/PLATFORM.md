# CARTA — the platform: the same machinery, grown up

*The platform pass. `SCHEMA.md` proved the spine fits the single-file PWA —
one envelope, one sparse write, one compile, one merge, the Register wearing
more hats. This document grows that machinery into the end-state the
ecosystem needs — signed pages, scoped authority, a hosted graph, desks,
instruments, an API — and then walks the bridge back, stage by stage, to the
`localStorage` app that exists today. The rule inherited from every prior
pass holds: invent no new machinery where proven machinery stretches, and
where something new in kind is required, say so out loud. Two things here
are new in kind: identity (keys and signatures) and moderation at scale.
Everything else is the Register pattern under load.*

## What survives untouched — the constitution

Five laws carry from the PWA into the platform unamended, and every layer
below is designed inside them:

1. **The envelope is universal.** Every shared entity, on every tier, is
   `{id, kind, provenance, fields, sightings[], status}` — compiled from
   append-only attestations, sparse-merged, never cell-overwritten.
2. **A sighting fills blanks, never erases.** Strike, supersede, backdate —
   nothing is deleted; silence is not denial.
3. **Identity is compiled, never keyed** (`LOT_IDENTITY.md`). The resolver
   reads columns and writes sightings; there is no identity cell.
4. **The ledger is the keeper's.** Readings and brews live on-device or on
   a server the keeper chose; full export always; the spine stands without
   the overlay.
5. **Offline is complete.** Every keeper-facing surface works with zero
   network; the network only ever adds.

## The confidence ladder, extended

`SCHEMA.md` gave sightings `stated | confirmed | derived`. The ecosystem
adds two rungs and a scope rule:

```
derived      < machine inference (resolver proposals, palette reads)
stated       < any keeper's attestation — the default, as today
confirmed    < a keeper adjudicating a proposal (the propose-and-confirm road)
first-party  < a signed page attesting facts WITHIN ITS OWN LINK — new
documented   < a line carrying a verifiable public instrument — new
```

- **First-party is scoped, not sovereign.** The rung applies only inside
  the signer's own link of the chain (the scope table below). A roaster
  attesting its own roast date writes `first-party`; the same roaster
  attesting the station's altitude writes `stated`, exactly like anyone
  else — it is repeating what it was told. Authority ends where your link
  does. This single rule is what keeps the desks from becoming a
  marketing pipeline into the record.
- **Documented outranks everyone,** including the subject: a Kenyan
  outturn certificate, a CoE archive entry, an ICO mark — `src` carries
  the instrument, and the line is checkable by any reader. A first party
  can *supply* documents; it cannot outvote one.
- **Compile order per field:** documented > first-party (in scope) >
  confirmed > stated > derived; newest-standing within a rung; struck
  lines keep their ink. `compile(entry)` grows a rung comparator and
  nothing else.
- **Disagreement is carried, not resolved.** Two standing lines may
  conflict — the roaster prints 1,950 masl, the station's record reads
  1,800–1,900. The page shows the stronger rung and holds the divergence
  one tap deep: *"the roaster states otherwise."* The record is honest
  about the trade's own disagreements; flattening them would be a quiet
  lie.

## Scoped authority — who may write what, first-party

| Signed page | First-party scope (their link) | Never first-party on |
|---|---|---|
| Producer | plots, varieties planted, altitude, harvest facts | how it roasted or read |
| Processor | intake, day-lots, processing stages, lot births & splits at the mill, producer rolls | downstream sales, quality |
| Aggregator/Importer | offers, splits & buyers, warehouse status, hard-ID transcription, intermediary chain | origin facts it didn't witness; roast facts |
| Roaster | roasts, blends & compositions, offering names, roast dates, its own doors, its buying confirms | origin facts (stated only), venue menus |
| Venue | menus/pours, counter facts, hours, pin, its own doors | the roast's provenance, other venues |
| Gear maker | its models, scales, variants, presets-as-proposals | the corpus's findings, keepers' setups |
| Keeper | their own ledger (absolute) | nothing shared above `confirmed` |

The table is enforced in the write path, not by moderation after the fact:
a desk physically cannot submit a first-party line outside its scope — the
API refuses it the way the brew form refuses a brew without a Setup.

## Identity — the first new machinery

Today `by` is a name string and trust is social (a household). Signed
pages need real identity, and the honest design is boring and standard:

- **Keys, not accounts-first.** A keeper or page holds an Ed25519 keypair;
  sightings gain an optional `sig` over their canonical bytes. Unsigned
  lines remain valid forever as today's rungs — the ladder already
  expresses "less certain" without insulting it.
- **A page is signed by a claim ceremony:** proof of control of the
  entity's own channel (the domain the graph already reads for palettes,
  or the documented instruments origin actors actually have — export
  licences, co-op registries, an importer's attestation for a station).
  Claims are themselves sightings on the page — provenance-carried,
  strikeable, revocable. Contested claims are a moderation case, not a
  race.
- **Delegation, because reality:** a page may authorise other keys (the
  station manager's phone, the roaster's two staff) with the same
  strike-to-revoke record.
- **No global real-name layer, ever.** Keepers stay pseudonymous keys;
  only *pages* — public commercial entities — carry public identity.

## The Archive — the hosted graph

The end-state topology, and the second place honesty costs something:

- **The Archive is CARTA-hosted upstream** — the shared catalog documents
  (`SCHEMA.md`'s `carta.catalog.*`) grown into per-entity collections
  behind the same merge law and the same rev/409 optimistic concurrency,
  sharded per entity rather than per document so a busy lot doesn't
  contend with a quiet one. The protocol stays the one the household
  server speaks; a bigger store, not a new language.
- **Reads are public.** The atlas is served from the Archive without
  login; pages are static-cacheable compiled views, cheap by
  construction.
- **Writes are proposals.** Everything arrives as sightings into a
  moderation lane per territory (below); desks' in-scope first-party
  lines fast-lane with post-hoc review; the resolver's timid-merge
  posture from the migration (`SCHEMA.md`) becomes the permanent posture
  at the gate: over-split and merge up by curation, never auto-merge
  down.
- **Federation, git-shaped.** A household server subscribes to the
  Archive: pulls the commons, pushes proposals, keeps its own local
  entities that never leave. The device app treats "household" and
  "Archive" as two remotes with the same document protocol. Nobody is
  forced upstream; the atlas is simply the remote most people want.
- **The ledger never moves by default.** Readings sync device ↔ household
  exactly as today. A keeper may opt their ledger into CARTA-hosted sync
  as a convenience — encrypted at rest, exportable, deletable — and the
  overlay rollups the Archive computes are floored (below) regardless of
  where ledgers live.

## Moderation — the second new machinery

The PWA's answer was "the moderator is you," and `VISION.md` was honest
that this is a launch posture, not a scaling one. The platform's answer:

- **Territories.** The graph partitions naturally — by chart (city) for
  venues and roasters, by origin region for the upstream spine. Each
  territory carries named curators with review authority; curators are
  appointed for provenance quality, not volume, and their acts are
  themselves signed sightings — the moderators stand in the record they
  moderate.
- **The queue is small by design.** The gate (`VISION.md`) bounds the
  catalog to specialty-and-traceable; scoped first-party fast-lanes the
  bulk of trade writes; the resolver automates the candidate-matching
  drudgery and only escalates genuine adjudications — the same division
  of labour the identity spike prescribed for keepers, applied to
  curators.
- **Every moderation act is reversible** because every act is a sighting.
  A bad curator's whole line of work can be struck without erasing a
  byte. This is the Register's deepest gift to governance: nothing done
  can't be undone in daylight.

## The pooling floor — privacy as arithmetic

One rule, stated once, applied everywhere the graph aggregates the
overlay or the corpus: **no rollup prints below `n=5` distinct keepers,**
and no combination of filters may be offered that reconstructs an
individual below it. A distribution with four readings reads *"too few to
pool"* — the same honest-sparsity glyph language the app already speaks.
Desks, the Circular, the Gear programme, and the public atlas all read
through this floor; the referral ledger (`COMMERCE.md`) lives in a
separate system the compile path cannot read, so ranking blindness to
money is architectural, not procedural.

## The API — the graph as a public instrument

- **Read, public, free:** compiled entities, pages, availability, the
  floored rollups — rate-limited civilly, attribution required
  ("records: CARTA"), because a reference that can't be cited isn't one.
- **Write, scoped, licensed:** desks and certified instruments only, each
  key bound to its page and its scope row. An instrument of record writes
  only what it measured — a scale writes mass and time; it cannot write a
  grind number it never knew (`CONSTITUENTS.md`).
- **The door callback:** the one commercial endpoint — a seller's
  checkout confirming a referred sale to the referral ledger. Outside the
  graph, by design.

## The bridge — from here to there, without a rewrite

The stages map onto `SEQUENCE.md`'s acts; each is shippable alone and none
strands the one before it:

1. **Now (built / building):** N catalog documents in `localStorage`,
   household sync, curator-seeded catalog. The envelope and merge already
   final — this is the load-bearing decision the whole bridge stands on.
2. **The Archive, read-only:** stand up the hosted store speaking the
   existing document protocol; publish the curated catalog through it;
   the atlas becomes a public website reading compiled views. The app
   gains "Archive" as a second remote. Storage seam: `loadDoc`/`saveDoc`
   swaps `localStorage` for IndexedDB on device when the atlas cache
   wants it — the seam `SCHEMA.md` already named.
3. **Proposals upstream:** the app and the ingestion pipeline push
   sightings to the Archive's moderation lane; territories and the first
   curators beyond the founder. The graph starts compounding from
   strangers.
4. **Signatures and pages:** keys on sightings (unsigned stays legal),
   the claim ceremony, the first signed roaster pages — initially just a
   badge and first-party rung on entities that already exist. The Roast
   Desk v1 is the roaster's own page made editable, nothing more.
5. **The desks proper, then the instruments, then the doors** — each a
   client of machinery the stages above already proved, arriving in the
   order the acts and gates dictate, commerce last.

At no stage does the single-file keeper's app stop working offline, stop
exporting, or stop being enough on its own. The platform grows around the
instrument; it never absorbs it.

## The honest read — what could break, and where it lands

- **Identity ceremony friction.** If claiming a page takes a lawyer, no
  one claims one; if it takes nothing, pages get hijacked. The
  domain-proof default is cheap and right for roasters/venues; origin
  claims lean on importer attestation and will be slower — accepted, and
  the fast-lane review posture compensates.
- **Moderation is the real scaling cost** — not storage, not sync. The
  gate, the territories, and first-party scoping are the three levers;
  if the queue still swamps, the catalog grows too slowly rather than
  wrongly. That trade is chosen deliberately and stated here so nobody
  re-litigates it in a growth panic.
- **The rung comparator changes compiled values** as pages sign — a page
  that looked one way under keeper sightings may read differently under
  first-party lines. Every flip is visible in the entry's own record
  (the lines are all there); the UI must make the *why* one tap deep,
  or trust erodes exactly where authority arrives.
- **The floor costs features.** Small-city venues and rare gear will
  read "too few to pool" for a long time. Correct; the alternative is a
  precision that is also a betrayal. The glyph language already knows
  how to say it.

*We do not sell coffee. We keep the record — and the record now knows who
is speaking, how far their word reaches, and what it costs to host the
truth.*
