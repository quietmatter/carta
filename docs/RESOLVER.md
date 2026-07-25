# CARTA — the resolver, as contracts

*The step-2 build spec. `VISION.md` put the lot at the centre; `LOT_IDENTITY.md`
spiked whether the lot can be found twice and found it tractable — *a resolution,
not a key*; `SCHEMA.md` turned the spine into storable shapes and left the
resolver's scoring, normalisation, propose-and-confirm and merge/split explicitly
open. This is where those open pieces become contracts: the whole identity ladder
designed on paper, strongest rung first, so the rest of step 2 can be built from it
without re-deciding its semantics.*

*What ships this session is only the **hard-ID rung** — the deterministic slice,
§1, shippable alone. §2–§7 are designed here and built next. The rule the whole
pass obeys, inherited from every prior doc: **invent no new machinery — extend the
sighting and compile.** The resolver reads columns and writes sightings; there is
no identity cell. Over-splitting is a correctable sighting; over-merging is the
failure this document exists to prevent, and every threshold below is tuned to
refuse it first.*

The ladder, walked strongest rung first, and the map of this document:

1. **A shared hard-ID** — deterministic, `{scheme,value}`, a match binds outright. **(built this session)**
2. **Normalisation** — fold transliteration, reconcile the naming tier, before any score.
3. **The fingerprint scorer** — a cluster of traceable facts; auto-bind · propose · fork.
4. **Propose-and-confirm** — the keeper adjudicates; a confirm writes a binding sighting, a reject forks.
5. **Merge & split** — re-parent downstream, preserve provenance, guard both directions.
6. **Grain & confidence in the UI** — evidence and grain on one tap; station-season a real terminal node.
7. **Coexistence & reversibility** — the resolver and the shipped `lotKeyOf`; every bind append-only.

The five calls SCHEMA left genuinely open are **settled** here — each marked
**▸ DECISION** inline where it bites, and gathered with its rationale at the end. Every
one is fixed toward the same bias: **refuse over-merge before you help.** Nothing
downstream is left hanging on a maybe; §3–§5 can be built straight from these.

---

## The write it all reduces to — the binding sighting

Before the rungs, the one shape they all write. `SCHEMA.md` gave the catalog
sighting its bones and `PLATFORM.md` its rungs; the resolver writes exactly one new
*kind* of sighting — a **binding**: a signed, dated line on a **lot** that says
*this record resolves here, at this confidence*.

```js
// a binding sighting — lives on lot.sightings[], compiled by compile(entry)
{
  id, by, at,                       // signed line — as every sighting
  bind: { ref, kind },              // the record bound: {ref:<bagId|cupId>, kind:'bag'|'cup'}
  rung: 'confirmed'|'derived',       // inferred binds only; 'documented' rides the hardIds[] column
  via:  'fingerprint'|'keeper'|'merge'|'split',   // never 'hard-id' — that is a column, not a sighting
  evidence: { score?, fields?[] },   // why it bound (shown on one tap)
  withdrawnAt?, supersededAt?        // struck, never removed — a wrong bind is corrected by a later line
}
```

- A **fingerprint auto-bind** writes `rung:'derived'`, `via:'fingerprint'`, `evidence:{score,fields}`.
- A **confirm** (the keeper says yes to a proposal) writes `rung:'confirmed'`, `via:'keeper'`.
- A **reject** writes nothing on the old lot and a fresh binding on the forked one.
- A **merge** / **split** writes `via:'merge'`/`'split'` (§5).

Two binds do **not** take this shape, by the decision below: a **hard-ID** match is a
`documented` fact carried as a set-union *column* (`hardIds[]`, §1), and the
`lotKeyOf` floor is a pure function of the record's own tokens — both re-derive
identically every boot, so neither is a judgement a sighting needs to preserve. Every
bind that *infers a cross-record claim* — auto-bind, confirm, merge, split — writes
the sighting above; the two deterministic collapses stay column-and-ref.

`compile(entry)` (already in the app, waiting) folds it all: it reads the
column-carried binds as the floor and folds the inferred sightings on top; the lot's
bound records are the standing binds, its identity confidence the strongest standing
rung. This is the single mechanism §2–§5 all reduce to — **they differ only in what
evidence they gather before writing the same line.**

**▸ DECISION — the binding sighting's home: split by kind of write.** The hard-ID
rung keeps its append-only `hardIds[]` *column* (§1); the record→lot edge stays the
ledger's `lotRef`; the `bind` sighting is reserved for the **judged** binds only —
the confirm, reject, merge and split of §4–§5. The line is *mechanical vs
adjudicated*: a hard-ID or a `lotKeyOf` collapse is a deterministic function of the
record's own columns — a set-union on the lot, re-derivable idempotently every boot,
carrying no judgement to preserve — so a sighting would buy nothing and cost an O(n)
fold to read what a column reads in O(1). A confirm/reject/merge/split, by contrast,
*is* a judgement: it has an author, a moment, a why, and it must reverse. That is
exactly what a sighting is for, and `compile` folds precisely those. So: **column
for the deterministic, sighting for the judged.** This does not fork the machinery —
`compile` still reads the column-carried binds as the floor and folds the judged
sightings on top, strongest standing rung winning, one identity read.

The dividing line is precise: **a bind writes a column when it is a pure function of
the record's own tokens** (the hard-ID set-union, the `lotKeyOf` floor — matching is
not inference, the token is shared by construction, and re-derivation lands the same
place every boot); **a bind writes a sighting the moment it *infers a cross-record
identity claim*** — and that includes the fingerprint's `derived` auto-bind, not only
the keeper's `confirmed` one. An auto-bind is a machine saying *record A is lot B* on
weighed evidence that can be wrong; its `evidence:{score,fields}` must be on the
record, visible and strikeable, exactly as a hard-ID token is. So the write-path for
§3 onward is: **hard-ID and `lotKeyOf` stay column-and-ref; every fingerprint bind —
`derived`, `confirmed`, `merge`, `split` — is a `bind` sighting `compile` folds.**

---

## §1 — The hard-ID layer *(built this session)*

The clean minority. Four channels in the trade mint an identifier public and stable
enough that two roasters' offerings adjudicate to *literally the same green*
(`LOT_IDENTITY.md`). Where both records carry one, identity is deterministic — no
score, no proposal, no keeper decision. A shared token **binds outright, ahead of
any fingerprint fork.**

### The scheme registry

`hardIds` is a **namespaced, multi-valued** attribute: zero-or-many per lot, each a
`{scheme, value}` in a fixed registry. Never assume one; never assume any.

| scheme | what it names | format seen on the bag | keyed with |
|---|---|---|---|
| `kenya-outturn` | the closest thing to a true green-lot key | `00AA0000` — week · dry-mill · batch (`17KF0001`) | **its grade** — one outturn splits AA/AB/PB |
| `coe` | a Cup of Excellence auction lot | `program · country · year · rank` (`ETH 2024 #7`, `#1a/#1b` splits) | rank + year |
| `best-of-panama` | a BoP auction lot | `estate · variety · lot#` | lot# + year |
| `gesha-village` | a Gesha Village estate-auction lot | `lot#` (a `GVA.` prefix some years) | lot# |
| `ninety-plus` | a Ninety Plus branded lot | `Perci Lot 50`, `Gesha Lot 23188` | lot name/number |
| `esmeralda` | a Hacienda La Esmeralda Special lot | auction `lot#` | lot# + year |
| `ico` | the ICO mark on the export bag | `country/exporter/parcel` (`001/0001/00001`) | the full triple |

The registry is a closed list. A token whose channel is not one of these is **not a
hard-ID** — it stays flat origin text and is matched (if at all) by the fingerprint
(§3). Adding a scheme is a code change, deliberately, so the false-friend firewall
below can be written per-scheme and never widened by accident.

### The `{scheme, value}` normal form, per scheme

`normHardId(scheme, raw) → {scheme, value} | null`. Normalisation is **conservative
and lossless of identity** — it folds only presentation noise (case, spacing,
separators), never structure:

- **Generic:** trim; collapse internal whitespace to one space; uppercase.
- **`kenya-outturn`:** strip all internal spaces (it is one token). If a grade is
  appended (`17KF0001 AA`, `17KF0001/AA`), split it onto `OUTTURN/GRADE` — the
  correct key is outturn **with** grade (station-and-year over-merges; grade alone
  over-splits). A bare outturn with no grade normalises to `OUTTURN` and matches
  only another bare `OUTTURN` — never a graded sibling, which is a *different
  physical export lot* under the same processing batch (§5).
- **`ico`:** strip spaces around slashes; keep the `country/exporter/parcel` triple
  intact. A partial ICO (two of three segments) is refused — it names the shipment,
  not the parcel.
- **`coe` / `best-of-panama` / `esmeralda`:** normalise the rank/lot token
  (`#7`, `LOT 7`, `7` → the canonical `#7`) and require the **year** to be present
  in the value, because rank repeats every year (§ firewall). Split suffixes
  (`#1a`, `#1b`) are preserved — they are *different physical boxes and buyers* of
  the same cherry (§5 siblings), never collapsed to `#1`.
- **`gesha-village` / `ninety-plus`:** normalise the lot token; keep any block /
  variety qualifier the channel prints as part of the lot's identity.

`value` is the whole normalised string. Matching is exact string equality on
`{scheme, value}` — after normalisation, that is the point of normalisation.

### The false-friend firewall — what is refused at entry

Three identifiers look like keys and are not (`LOT_IDENTITY.md`). None may ever
enter `hardIds`. `hardIdRefusal(scheme, raw) → reason | null` runs **at entry**,
before anything is stored, and returns a plain-language refusal the form shows:

1. **A bare grade token** (`AA`, `AB`, `PB`, `C`, `G1`, `SHB`, `peaberry`, …) under
   *any* scheme. A grade is a quality class shared by thousands of lots — it names
   the screen, never the coffee. *Refused: "A grade names a class of coffee, not the
   coffee itself — it can't be an identity."*
2. **A warehouse SKU / importer Ref** — private, season-scoped, dropped when the
   roaster re-bags (Royal's `38302-1 … SPOT RCWHSE`). Detected by SKU/warehouse
   marker words and the private double-number shape. *Refused: "That reads like a
   warehouse reference — it names the shipment, not the green."*
3. **A per-sale auction seat** — the auction catalogue's own `LOT n`, a seating
   position that resets every sale, distinct from the COE *rank*. A bare `LOT n` /
   `#n` is refused **under the non-lot-numbered schemes** (`kenya-outturn`, `ico`),
   where it can only be a warehouse/seat position; under `coe`/`best-of-panama`/
   `gesha-village` a lot number is the legitimate identity, so the scheme
   disambiguates. *Refused: "A bare lot number is a sale position, not this scheme's
   identity."*

The firewall is **the schema of refusal, written per-scheme** — it is why the
registry is a closed list. It fires only on a non-empty entry; an empty field is
simply *no hard-ID*, not a refusal.

### The deterministic bind — the write contract

Identity is compiled, never keyed, so even the hard-ID rung does not *key* the lot —
it **redirects the collapse** to the standing lot the token already lives on:

```
lotByHardId(hids)  → the standing lot bound to any token in hids, or null
                     (earliest firstAt wins if >1; role:'batch' parents skipped)
lotBindKey(r, id)  → lotByHardId(recHardIds(r))?._key   ?? lotKeyOf(r, id)
                     // strongest rung first: a shared hard-ID ahead of the fingerprint fork
lotAddHardIds(lot, hids, who, at)
                   → union hids onto lot.hardIds[], append-only, signed+dated,
                     struck-not-deleted; mergeCatalog unions the set across devices
```

- Each accumulated token is `{id, scheme, value, by, at, withdrawnAt?}` — the
  sighting law applied to the identity set: **append-only, provenance-carrying,
  struck-not-deleted.** A mistyped hard-ID is *withdrawn* (a dated strike), never
  erased; matching reads only standing (`!withdrawnAt`) tokens. This is the
  `documented` rung of `PLATFORM.md`'s ladder, recorded as an attestation.
- The bind fires everywhere a lot is written from a record: the boot sweep
  (`catSeed`), the save-path stamp (`catStampLot`), and the boot repoint's
  key-resolution (`catRefsFor`/`catRepoint`) — the same four seed sites step 1 wired,
  so re-derivation is idempotent and a dropped ref re-points next boot.
- **Multi-match ⇒ a merge, not a fork.** If a record's tokens match two different
  lots, those lots *should be one* (a hard-ID collision across nodes). This session
  binds stably to the earliest-provenance match and leaves both lots standing;
  reconciling them is §5's merge, adjudicated next session. Binding never *forks* on
  a hard-ID — the failure to prevent is over-merge, and a hard-ID match is the one
  place over-merge cannot happen (the token is public and shared by construction).

### What §1 demonstrably buys

Two roasters' bags of one Kenyan outturn, whose *fingerprints differ* (one prints
the station, the other only the region; one says "washed", the other is silent) —
the fingerprint alone forks them into two lots. With the outturn entered on both,
the second binds to the first outright: **one lot, two roasts, the "same green,
many hands" page the whole atlas exists for** — reached at a confidence the record
can defend, because the token is printed and public.

---

## §2 — The normalisation layer *(designed; built next)*

The fuzzy rungs degrade to noise without this, so it runs **before** any score
(`LOT_IDENTITY.md`: "budget for a normalisation layer, or the fuzzy tier degrades to
noise"). Two jobs, one pass, all offline and single-file — no dictionary fetched, no
key, no model:

### Transliteration folding

Amharic-to-Latin has no canonical romanisation, so string equality fails on the same
place: *Yirgacheffe / Yirgachefe / Yergacheffe*, *Gesha / Geisha*, *Guji / Gujji*.
`normPlace(s)` folds these to a canonical token before comparison.

- **Shape:** a small, inline **alias table** (`{canonical: [variants…]}`) for the
  handful of origin words that actually collide — the coffee-growing regions and the
  varietals — plus a generic fold (lowercase, strip diacritics, collapse doubled
  letters, drop punctuation). The table is *data in the file*, a few dozen entries,
  not a downloaded gazetteer.
- **Honest ceiling, stated out loud:** the table covers the known collisions of
  specialty's common origins; it will miss a novel transliteration of an obscure
  station. That is a *fail-to-confirm*, never a false merge — an unfolded variant
  simply scores lower and proposes rather than binds. The layer never *invents* a
  fold it isn't sure of.

### Naming-tier reconciliation

One roaster heads the record with the farm (*Las Flores*), another the producer
(*Jhoan Vergara*), another the mill or the region — same green, three head-strings
at three tiers (`LOT_IDENTITY.md`). Before scoring, the head-string is tagged with
its tier so the scorer compares like with like:

```
headTier ∈ 'farm' | 'producer' | 'station' | 'region'   // already a fingerprint column (SCHEMA)
```

- **Shape:** `reconcileTier(fp)` reads the head-string against the structured
  columns already present (`producer`, `region`, `country`) and the alias table's
  tier tags, and sets `headTier`. When the tier is genuinely ambiguous it reads
  `null` — never a guess. The scorer (§3) then weights a cross-tier match down, not
  out: *Las Flores (farm)* vs *Jhoan Vergara (producer)* can still be one green, so
  the tier mismatch lowers confidence toward *propose*, never forces a fork.

**▸ DECISION — normalisation stays conservative: closed table + tag-only.** (a) The
alias table ships as a **curated closed list** — a few dozen entries for the origin
words and varietals that actually collide, data in the file. No fuzzy string
distance. Edit-distance ≤ 2 on region tokens would fold *Kochere* into *Kochore*,
two real neighbouring washing stations, into one green — the precise over-merge this
whole document exists to refuse, and it would do it *silently, upstream of the
score*, where no threshold or keeper can catch it. A missed transliteration is a
fail-to-confirm (the variant scores lower and proposes); a wrong fold is a false
merge with no appeal. The asymmetry is total, so the fold never guesses. (b) Tier
reconciliation **only tags** (`headTier`), never rewrites the head-string. The
keeper's own words stand on the record; the tier is a comparison hint the scorer
reads, not an edit to what was typed — rewriting *Las Flores* to its producer would
destroy the very string a later reader needs to recognise the farm. Both settings
refuse over-merge first; loosening either waits for real records to prove the closed
table misses more than it protects, and even then the loosening is a new proposing
rung, never a new folding one.

---

## §3 — The fingerprint scorer *(designed; built next)*

The default road — ~50–60% of real records carry no shared token, so identity is a
**cluster of traceable facts**, no single field of which is identity
(`LOT_IDENTITY.md`). The scorer runs after normalisation, over the fingerprint
columns SCHEMA already defined.

### Cluster fields and per-field match semantics

`score(a, b) → 0..1` over the fingerprint of a candidate record `a` and an existing
lot `b`. Each field contributes a partial, weighted signal; the **cluster** is
identity, never one field:

| field | match semantics | weight *(posture)* |
|---|---|---|
| `headName` + `headTier` | normalised (§2); same-tier exact = full; cross-tier fold = partial | high |
| `country` | exact after fold; a mismatch is a **hard fail** (different countries are different greens) | gate |
| `region` | exact after fold = full; one side blank = neutral (no signal, not a fail) | high |
| `harvest.year` | exact = full; ±1 crop-year = partial (hemisphere-aware); mismatch = strong down | high |
| `varieties[]` | set overlap (Jaccard); `unknown`/`mixed-heirloom` on either side = **neutral, never a fail** | medium |
| `process.family` | exact = full; `unspecified` on either side = neutral; family mismatch = down | medium |
| `intermediary` | same importer = weak-up; different = **no signal** (one green flows through two importers) | low |

- **`country` is a gate, not a weight.** Two different countries never merge, whatever
  else matches — the one place the cluster yields to a single field, because it is
  the one field that is never ambiguous.
- **The "never block, only fail to confirm" rule.** `unknown` variety, `unspecified`
  process, a blank region — these **never lower the score below the fork line by
  themselves**; they are *absence of a signal*, not *evidence of difference*. A
  fingerprint of all-unknowns scores low and proposes-or-forks; it is never a false
  merge and never a hard fork on absence. This is the invariant that keeps the fuzzy
  tier honest (`LOT_IDENTITY.md`: "`unknown` and `unspecified` never block a match —
  they only fail to confirm one").

### The three postures — auto-bind · propose · fork

Two thresholds cut the score into three actions. They are **postures to tune against
real records, never fabricated precision** — the numbers below are the starting
stance, biased hard toward *propose over auto-bind* and *fork over merge*:

```
score ≥ τ_auto   (≈ 0.90, starting)  → auto-bind:  derived binding sighting, no keeper prompt
τ_prop ≤ score < τ_auto  (≈ 0.55…)   → propose:    surface the candidate, ask the keeper (§4)
score < τ_prop                        → fork:       a new lot; the record stands alone until evidence merges it
```

- **Over-merge is the failure; the thresholds refuse it first.** `τ_auto` sits high
  enough that an auto-bind is effectively "the same green in all but the noise";
  everything genuinely uncertain routes to *propose*, where the keeper — who can see
  what the labels can't — decides. When in doubt, **fork**: over-splitting is a
  correctable sighting (§5 merges it later), over-merging silently unions two greens.
- **The seed stays timid.** Migration (`SCHEMA.md`) already forks below a very high
  bar; the scorer *is* the general form of that bar, and at boot it runs at
  `τ_auto`-only (no interactive propose during a sweep) — the catalog starts granular
  and is merged **up** by curation, never auto-merged down.

**▸ DECISION — hold `τ_auto ≈ 0.90` / `τ_prop ≈ 0.55`; unknown-variety proposes on
strong place+year.** (a) The thresholds hold at their starting stance, and they are
*postures against real records, not fabricated precision* — the numbers earn their
keep only once there are enough resolved lots to measure a false-merge rate against,
and they move by evidence, never by feel. The bias is deliberate and asymmetric:
`τ_auto` high enough that an auto-bind is "the same green in all but the noise,"
`τ_prop` low enough to *ask* generously, the whole band between them routed to a
keeper who sees what the labels can't. When the two errors are unequal — and here
over-merge is unrecoverable while over-split is a §5 correction — the threshold sits
where the recoverable error lives. (b) A fingerprint whose variety and process are
both `unknown/unspecified` but whose **place and year match well** scores `≥ τ_prop`
and **proposes** — it never auto-binds (the evidence is too thin to move without a
human) and it never silently forks (a keeper can often confirm the green the label
merely omitted). This *is* the "never block, only fail to confirm" rule doing its
job: absence of a variety is absence of a signal, not evidence of difference, so it
lowers confidence toward *ask*, never toward *fork-and-hide*. The propose is the
honest middle — the machine says "these look like the same green; you'd know," and
the keeper answers. Noisy proposals are a tuning problem on `τ_prop`; a swallowed
match the keeper never saw is a lost truth. We choose to ask.

---

## §4 — Propose-and-confirm *(designed; built next)*

The default entry path, not an edge case (`LOT_IDENTITY.md`). The machine proposes;
the keeper decides the call the labels can't make.

**▸ DECISION — inline-at-save for a single strong candidate; a review queue for the
rest.** *Auto-bind* and *fork* never interrupt — they write and move on (a fork is
just "stands alone until evidence merges it"; an auto-bind is a `derived` sighting
the keeper can find and strike). A *propose* surfaces one of two ways, by how clean
the call is. **When exactly one candidate lands in the propose band, the sheet asks
inline, right after save** — the keeper is holding the record, the context is warm,
and one clear question ("the same green?") is a courtesy, not an interruption. **When
two or more candidates tie in the band, or the record arrives by ingestion sweep
rather than a single hand-logged save, the proposal drops into a review queue** the
keeper works when they choose — because ranking three near-ties or triaging a batch
is deliberate work, not a yes/no in passing, and interrupting a save with a
multiple-choice is exactly the friction that trains a keeper to dismiss without
reading. The queue is the same sheet contract (below), just deferred and batched;
inline is the queue with one item, shown now. This keeps the common case (one strong
candidate) a single warm tap and quarantines the hard case where it can be thought
about — over-split is the safe waiting state for anything unresolved, so nothing is
lost by deferring.

### The write contract

- **A confirm** appends a binding sighting `rung:'confirmed'`, `via:'keeper'` on the
  proposed lot, binding the record to it through `compile`. The flat text retires
  onto the node as it does today; the ref points at the confirmed lot.
- **A reject** forks: mint a new lot from the record's own fingerprint, bind the
  record there, and record *why* (a `via:'split'` note carrying the rejected
  candidate's id) so a later pass never re-proposes the same pair. Nothing is
  mutated on the rejected lot — the record simply never bound to it.
- **Reversible always.** A confirm is a sighting a later line supersedes; a wrong
  confirm is struck, not erased, and the record re-forks. `mergeCatalog` already
  unions sightings and drops none.

### The sheet contract

One proposal, one plain question, evidence on the face of it:

```
"This looks like Nine's Gedeb, natural, 2024 — the same green?"
  [ the same green ]   [ a different one ]   [ not sure — keep them apart ]
  ▸ why we think so:  station · year · process   (the matched fields, one tap)
```

- **"Not sure" forks** — the safe default, never a merge. Uncertainty routes to
  over-split, the correctable failure.
- **A match score never travels without its reasons** (the app's standing invariant):
  the matched fields are on the sheet, not behind a number.

### Offline degradation

`resolve` runs against **local catalog entries only** — no network. Offline, the
proposal is drawn from the lots already on the device; the candidate set is smaller,
never absent. Assisted ingestion (a curator pointing CARTA at an offering page) is
the one online moment, and it is already an *optional enhancement* by VISION's rule,
degrading to manual entry. Propose-and-confirm never requires a server.

---

## §5 — Merge & split *(designed; built next)*

You *will* learn later that two lots were one, or one was two — and a Kenyan outturn
is genuinely one cherry graded into sibling export lots (`LOT_IDENTITY.md`). Merge
and split are first-class, and both reduce to re-parenting plus append-only
sightings — no new machinery.

### The re-parenting protocol

```
mergeLots(keepId, absorbId, who)
  → every downstream roast/pour/record referencing absorbId re-points to keepId
    (a derived re-stamp, exactly as catRepoint re-points a ref)
  → absorbId becomes a tombstone carrying lineage.mergedInto = keepId
  → keep.lineage.mergedFrom .push(absorbId)   // append-only
  → keep.hardIds  ← union(keep.hardIds, absorb.hardIds)   // never lose a token
  → a binding sighting via:'merge' records who merged, when, and why
splitLot(parentId, {fingerprint, hardIds}, who)
  → mint child with lineage.splitFrom = parentId
  → move the named records' binds to the child (a re-stamp)
  → parent stands; child stands; both keep full provenance
```

- **Provenance preservation.** A merge keeps the earliest `firstBy/firstAt` across
  both lots (the collapse rule `mergeCatalog` already runs); every contributor's
  binding sighting survives on the kept node. Nothing is lost in a correction.
- **Both-direction guards** (`LOT_IDENTITY.md`'s taxonomy, enforced in the write
  path): never *same-string ⇒ same lot* (rebranded splits, rotating house names —
  a string match alone never triggers `mergeLots`; it must pass the scorer or a
  hard-ID); never *different-string ⇒ different lot* (transliteration, a lot resold
  under two importers' names — §2 folds these before they can fork). A merge is
  reversible: `splitLot` undoes it, and the tombstone's `mergedFrom` records the
  original boundary so the split can restore it exactly.

### The processing-batch parent

Kenya's outturn splits by screen into AA / AB / PB — *same cherry, different physical
export lots.* They are neither one node nor strangers: **siblings under one
processing batch.** The batch is a synthetic node in `lots` with `role:'batch'`,
`grain:'processing-batch'` (SCHEMA's lighter option, avoiding a ninth document):

```
lot (role:'batch')  // carries the kenya-outturn ONCE, never browsable
 ├─ lot AA  (hardIds: kenya-outturn/AA, processingBatchRef → batch)
 ├─ lot AB  (hardIds: kenya-outturn/AB, …)
 └─ lot PB  (hardIds: kenya-outturn/PB, …)
```

- The batch holds the bare outturn; each child carries `outturn/grade` (§1's keying).
  A bare-outturn record binds to the **batch** and can later be split to a graded
  child when the grade surfaces. `lotByHardId` skips `role:'batch'` parents for a
  *graded* token (a graded record binds to its sibling, not the parent) and matches
  the parent only for a bare-outturn token.
- Building the batch is §5 (next session); §1 ships the graded-token keying
  (`OUTTURN/GRADE`) so the batch can be introduced later **without re-keying** any
  token already entered.

---

## §6 — Grain & confidence in the UI *(designed; built next)*

Identity does not always reach the green lot, and the record is honest only when it
says so (`LOT_IDENTITY.md`). The grain and the confidence are one tap from any lot.

- **Grain is first-class and terminal where it lands.** `grain ∈ green-lot ·
  station-season · region-grade` reads on the lot page beside the name. A
  `station-season` node is a **legitimate terminal record** — often *the* node a
  keeper browses — drawn as a full node, never a half-filled lot or a blank coerced
  into false precision. `region-grade` (the ECX floor) is an honest state, labelled
  as such.
- **Confidence names its rung and its evidence.** The lot's identity confidence is
  the strongest standing bind: *documented* (a hard-ID — names the scheme:
  "Kenya outturn 17KF0001"), *confirmed* (a keeper adjudicated it), *derived* (the
  fingerprint proposed it). One tap opens the evidence — the token, or the matched
  fields — exactly as the reach badge explains itself today. **A confidence never
  shows without its reasons.**
- **Marks stay monochrome** — never the ember, never a fill; identity is a lens,
  never a sort that outranks taste (the standing invariant, carried from the reach).

---

## §7 — Coexistence & reversibility *(the law under all of it)*

- **`lotKeyOf` stays the offline floor.** The shipped timid fingerprint key
  (`fp:…` on ≥2 shared tokens, else `lot:<id>` fork) is not replaced — it is the
  **deterministic collapse the resolver falls through to** when no stronger rung
  fires (`lotBindKey` = hard-ID ahead of `lotKeyOf`). Every device, online or off,
  keys the same way it does today; the resolver only ever *redirects* the collapse to
  a stronger match. A device that never runs the scorer still lands every record on a
  lot.
- **Every bind is append-only and correctable.** Hard-ID tokens are struck, never
  erased; fingerprint binds are sightings a later line supersedes; merges split back;
  rejects fork. There is no destructive resolution step — the one irreversible act in
  the whole spine remains `catRetire` (the flat text retiring onto a stood node), and
  identity never rides on it.
- **Reversible and offline-first, end to end.** Every rung runs against local
  entries; the network only adds. The migration seeds timid, curation merges up, and
  no auto-merge ever runs downward. The atlas is granular-then-merged, never
  merged-then-regretted.

---

## The decisions, settled

The five calls SCHEMA left open are fixed here, each biased to refuse over-merge
before it helps. They are settled, not frozen — the two that carry numbers move by
evidence once real records exist to measure against; none is a matter of taste to
re-litigate.

1. **The binding sighting's home — split by kind of write.** Deterministic binds
   (hard-ID set-union, the `lotKeyOf` floor) stay **column-and-ref**, re-derivable
   O(1); every bind that *infers a cross-record claim* — the fingerprint's `derived`
   auto-bind included, not just the keeper's `confirmed` — writes a `bind` sighting
   `compile` folds. Column for the mechanical, sighting for the inferred. *(fixes the
   §3+ write-path)*
2. **Propose surfaces inline for one strong candidate, a review queue for the rest.**
   Auto-bind and fork never interrupt; a lone propose asks inline at save while the
   context is warm; ties and ingestion-sweep proposals batch into a queue worked
   deliberately. Over-split is the safe waiting state, so deferring loses nothing. *(§4)*
3. **Thresholds hold at `τ_auto ≈ 0.90` / `τ_prop ≈ 0.55`,** as postures to tune
   against real records, biased hard toward *propose over auto-bind* and *fork over
   merge* — the threshold sits where the recoverable error lives. *(§3)*
4. **Normalisation stays conservative: closed alias table, tag-only.** No fuzzy
   distance (it would fold neighbouring stations silently, upstream of any check); the
   tier is tagged, never rewritten (the keeper's words stand). A missed fold fails to
   confirm; a wrong fold is a false merge with no appeal. *(§2)*
5. **An unknown-variety fingerprint proposes on strong place+year — it does not
   fork.** Absence of a variety is absence of a signal, not evidence of difference; it
   routes to *ask*, never to fork-and-hide. A noisy proposal is a tuning problem; a
   swallowed match is a lost truth. We ask. *(§3)*

None of these block §1. The hard-ID rung is deterministic and ships this session; the
four downstream decisions above are what §2–§5 are built from next, no semantics left
to re-decide.

*We do not sell coffee. We keep the record — and the record now knows a green when it
sees the same one twice, and says how sure it is.*
