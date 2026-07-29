# CARTA — the reader, and the published atlas

*The spec for the person who keeps nothing. They open CARTA, read the atlas as
the founder published it, and never sign in. Everything that writes is not
hidden from them so much as absent — there is nothing on their device for it to
write to.*

*Built in 6.7.0 — all seven steps of §10. The prototype is
`redesign-concept/READER.html` — a working surface, real tokens, every screen in
this file drawn. Read it beside this, and see "As built" at the foot for the
handful of places the code decided something this document left open.*

---

## 1 · The name

**A reader.** The welcome already named them and we never noticed: the first
door is *"I read, mostly — the atlas opens. Keep nothing, ever."* and
`DEPTH_NAMES[0]` is *Reading*. There is no new vocabulary to invent and no
account tier to describe.

Not a *guest* — a guest is a visitor in someone's house, and implies a host who
could stop being hospitable. Not a *public user* — CARTA does not have users, it
has keepers and readers. The app never labels the person on screen at all; it
names **the copy** (*the published atlas*, *this copy*) and lets the reader
infer that they are the one reading it.

> A keeper keeps a record. A reader reads one. The only difference is whether
> anything is written down.

### What "keeps nothing" honestly means

It means **no record** — no cups, no brews, no bags, no Setups, no sightings.
It does not mean no state: a reader still gets a theme, a °C/°F choice and a
reach mark, because those are how the page is *drawn*, not what it *says*. The
distinction is already in the model — `D.prefs` is presentation, the collections
are the record — and the copy must not overclaim. *"Keep nothing, ever"* stays
true, because none of it is a record of coffee.

---

## 2 · The two halves

The ask is one sentence with two verbs in it: **the founder publishes; the
reader reads.**

```
      the founder's device                the server                the reader's device
   ┌────────────────────────┐      ┌────────────────────────┐   ┌──────────────────────┐
   │  D  (the ledger)       │      │                        │   │                      │
   │    cups brews bags ────┼──╳   │                        │   │  D = blank           │
   │    pours ──────────────┼──┐   │                        │   │                      │
   │                        │  │   │                        │   │                      │
   │  CAT (the catalog) ────┼──┼──▶│  /api/catalog/:kind    │   │                      │
   │  REG (the Register) ───┼──┼──▶│  /api/cafes            │   │                      │
   └────────────────────────┘  │   │        │ authenticated │   │                      │
                               │   │        ▼               │   │                      │
              POST /api/publish└──▶│  the snapshot ─────────┼──▶│  PUB  (read-only)    │
                    founder-only   │  GET /api/public       │   │   catalog + register │
                                   │        unauthenticated │   │   + pours            │
                                   └────────────────────────┘   └──────────────────────┘
```

Almost all of the work is already done, and by accident of good modelling: **the
shared documents are exactly the publishable set.** The catalog's eight kinds and
the café Register are already the part of CARTA that is common knowledge, already
single-pen, already merged by id. The ledger is already the part that is yours.
Publishing is not a new privacy boundary — it is the boundary the app has had
since the catalog was cut out of the ledger, finally pointed outward.

---

## 3 · The laws

**L1 · The published atlas is the shared documents, and nothing else.**
The catalog (`producers · processors · aggregators · lots · blends · roasters ·
roasts · gear`) and the Register. Never a ledger, never a user directory. There
is no endpoint that would carry a cup, so no read path can leak one by
forgetting a filter — the same reason a strike splices a record out of its live
collection rather than flagging it.

**L2 · A pour publishes; its cup never does.**
The one exception to L1, and it earns it. A pour is `{roastRef, roasterRef,
lotRef, venueRef, shop, at, by, cupRef}` — *this green was poured at this bar on
this date, attested by this hand.* That is a fact about the world, not a reading
of one, and it is the only ledger record of which that is true. Without it the
reader's road goes dark at **Poured**, which is the station that makes the atlas
worth carrying into a bar. It publishes **with `cupRef` cut** — the link to a
private reading is the private part. Nothing about how it tasted travels.

*Forward:* this is the third argument that pours want to be a catalog kind
(`SURFACES.md` already counts two — `pour.roastRef` was always null, and
`venues` is off-spine). When they move, L2 folds back into L1 and this clause
is deleted.

**L3 · Publishing is a copy, not a switch.**
Not "open the shared documents to unauthenticated GET" — that is one line in the
router and it is wrong. It would make every keystroke public the instant it was
written, with no act, no date, and no way to hold anything back. A snapshot has
a **revision** and a **published date**, so the reader's copy can state its own
age instead of impersonating a live feed. Nothing leaves CARTA without a
deliberate hand; this is that hand.

**L4 · The hold is additive and reversible.**
A green held back is not deleted and not hidden behind a flag — it is a dated,
signed entry shaped exactly like a strike (`{id:'hold:<ref>', ref, kind, at, by,
releasedAt?}`), subtracted from the snapshot at publish time. It merges by the
same monotone rule (`at > releasedAt`), so two founder devices converge without
an order. **Holding a green holds its roasts and its pours with it** — the same
cascade shape as `strikeDeps`, for the same reason: a green whose roasts are
public and whose identity is not is a broken road, not a redaction.

**L5 · Publishing names the hands.**
A sighting, a caliber score, an altitude band — each carries the keeper who
attested it, and the published copy keeps that. *Compiled, never picked; shown
with its reasons.* A claim without its keeper is exactly the anonymous claim the
record refuses. Today this is trivially safe: the pen is single, so the only
name in the shared documents is the founder's own, and publishing publishes
only their own hand. **When group curation returns, the publish act must ask
each keeper before it carries their name** — that is a hard obligation on
whoever lifts the pen, recorded here so it is not discovered later.

**L6 · The reader's copy is a read layer, never a write target.**
`PUB` is stored under its own keys and is never merged into `CAT`/`REG`. If it
merged, the day the reader started keeping, their own record and the founder's
would be indistinguishable, and their device would try to push a record it does
not hold the pen on. Kept separate, the layering falls out for free — see §8.

**L7 · The reader's road is five stations, not six.**
The sixth station is **Read**, and it is the reader's *own* cups. A reader has
none. That is not a gap in the record — the gap is the product, and this is not
a gap — it is an absent reader. So the reader's road draws five stations and
says nothing about the sixth. An empty *Read* rendered as unread would be the
record telling a quiet lie about itself.

**L8 · `GET /api/public` is the only unauthenticated data endpoint.**
`/api/users`, `/api/ledgers/:id`, `PUT /api/cafes`, `PUT /api/catalog/:kind` all
stay exactly as they are. Adding the reader must not loosen one byte of the
existing auth surface, and both test suites should assert that.

---

## 4 · The server

Three endpoints, in both `server.js` and `worker.mjs`, with both test suites
extended. No dependency, no build step.

| Method | Path | Auth | Answer |
|---|---|---|---|
| `GET` | `/api/public?meta=1` | **none** | `{rev, publishedAt, counts}` |
| `GET` | `/api/public` | **none** | `{rev, publishedAt, publishedBy, atlas}` |
| `POST` | `/api/publish` | founder | mints the snapshot; `{rev, publishedAt, counts, held}` |

```jsonc
// GET /api/public
{
  "rev": 15,
  "publishedAt": "2026-07-12T18:02:41.000Z",
  "publishedBy": "Ellis",
  "atlas": {
    "catalog": { "lots": {…}, "roasters": {…}, … },   // one doc per kind, as PUT stores them
    "register": {…},                                   // as PUT /api/cafes stores it
    "pours": [ {…} ]                                   // cupRef stripped (L2)
  }
}
```

- **`POST /api/publish` reads the shared documents server-side.** The founder's
  device sends only `{held:[…]}` — the hold list — not the atlas. The server
  already holds the canonical copy; shipping it back up would invite a
  publish that disagrees with the record.
- **A server with nothing published answers `404 not-published`.** Not an empty
  atlas — an empty atlas is a claim that the record is empty, and it is not.
- **`?meta=1` exists so the reader polls sixty bytes, not two megabytes.** The
  full body carries a strong `ETag` on the rev so a repeat read is a 304.
- **`publishedBy` is the founder's name**, so the reader can say whose copy this
  is. Consistent with L5.
- **Worker:** the snapshot chunks exactly as the shared documents already do
  under the 2 MB Durable Object value cap. No new storage shape.
- **Pours** are gathered from every ledger the server holds at publish time,
  `cupRef` cut. This is the only place the server reads a ledger for a purpose
  other than serving it to its owner, and it must read *nothing else from it*.

---

## 5 · The reader's client

### State

```js
const PUB_KEY='carta.public.v1';
// {url, rev, publishedAt, publishedBy, fetchedAt, atlas:{catalog,register,pours}}
let PUB = readJSONLS(PUB_KEY);
const reader = () => !!(PUB && !USERS_HAS_RECORD && !syncedHere());
```

`reader()` is true when the device holds a published atlas, holds no record of
its own, and is not signed in. Signing in ends it. Keeping a first cup ends it.
Nothing else does, and nothing about it is a mode the reader has to manage.

### Predicates that must learn about it

| Function | Change |
|---|---|
| `depth()` | returns **1** in reader mode (today `readOnly()` returns 4 — the opposite case) |
| `tabsFor(d)` | returns **Atlas · Desk** for a reader; today it ignores `d` entirely |
| `isAdmin()` | `if(reader())return false` — explicit, even though no path could reach true |
| `save()` | no-op except `prefs` (§1) |
| `needsWelcome()` | false when the device arrived by an `#atlas=` link |
| `TAB_ALIAS` | `trace:'atlas'` under reader mode, so a saved link to the Record still lands |
| `readerGuard()` | **new**, fronting every write the way `guard()`/`penGuard()` do |

`readerGuard()` should never fire — no affordance that calls a write is rendered
for a reader — and it exists for exactly that reason. It is the belt beside the
braces, and it says: *"You're reading a published copy — start keeping to make a
record of your own."*

### How the copy arrives

1. **`#atlas=https://sync.example.com`** in the URL. This is how a founder shares
   the atlas: one link, no account, no install. Lands straight in reader mode,
   skipping the welcome.
2. **A build constant** — `PUBLIC_ATLAS`, empty in the repo and set for the
   deployed build. With it set, *"I read, mostly"* on the welcome just works.
3. **Named by hand** on the Desk, if neither of the above.

If none answers, the reader lands on the device's own (empty) atlas with an
honest empty state and both doors offered. **Offline-first is unchanged**: the
stored copy stands whole with the network off, the fetch is never blocking, and
there is never a spinner in front of the record.

### The heartbeat

The same three moments as sync — boot, `online`, `visibilitychange` to visible —
one unauthenticated `?meta=1` read, and a full pull only when the rev moved. A
reader who never reconnects reads the copy they have, forever, and the Desk says
how old it is.

---

## 6 · What the reader sees, surface by surface

The rule underneath all of it: **a reading stands; a write is absent.** Not
greyed out, not behind a lock, not a nag to sign up — absent, because there is
nothing for it to write to.

### The bar

**Atlas · Desk.** Two rooms.

**Record is gone.** The Record is the reader's overlay over the atlas — their
cups, their plates, their leans. For a reader it is empty by definition, and a
room whose entire content is *"you have nothing"* is a nag with a tab of its
own. The offer to start keeping belongs on the Desk, once, as a door.

**The masthead's `＋ A coffee` is gone.** `render()` already hides it under
`readOnly()||doorOn`; the reader joins that clause.

### R1 · The Atlas

| | keeper | reader |
|---|---|---|
| the coffee in hand (`inHandHTML`) | the head of the room | **replaced** — see below |
| search over lots/roasters/growers/Register | ✓ | ✓ |
| the chart hero, two frames, lenses | ✓ | ✓ |
| the interlude — *"Read the season for me"* | ✓ | **gone** — taste-ranked, and there is no taste |
| the season's lots, standing chips | ✓ | ✓ |
| the hands | ✓ | ✓ |
| Cut the atlas → the plates | ✓ | ✓ |
| *Propose a sighting* | ✓ | **gone** — a write |
| the Chart No. 1 curator door | ✓ | **gone** — a write |
| worth-the-walk / the matching | behind `LEGACY_ON` | **gone** — argued from a record |

The head becomes the copy stating itself:

> **The published atlas** *(eyebrow)*
> **Los Angeles, in thirty-four greens.** *(display)*
> Published 12 July 2026 by Ellis. A copy, not a feed — it changes when the
> keeper publishes again. *(lede)*

That lede is the whole honesty of the design in one sentence: it refuses to
impersonate a live service, and it names the hand. It is also the only place on
the Atlas the reader is told anything about their own situation.

### R2 · A green (the lot page)

The lot page is the one place CARTA is allowed to be long, and for a reader it
loses almost nothing — this is the page they came for.

**Stands:** the road (five stations, L7) · identity columns and their primers ·
the grain and its gloss · the standing (caliber, rarity, traceability), each
axis unread until its own evidence stands · the height and the terrace ·
availability (the pours, L2) · the roasts by hand · the hard-ID rung named when
one is bound · the origin plot and the street layer.

**Gone:** the corpus (own brews) · your overlay · the *Corrections & identity*
fold — binds, merge/split, the standing entry, the hold.

**Stays, changed:** `claimBlock()`. A reader who is a roaster is precisely the
person who should claim a page, and the offer is honest even with no account:

> This page is unsigned. If the roastery is yours — sign in and take the pen on
> your own facts.

It opens the sign-in door, not a form. This is the one place the app asks the
reader for anything, and it asks only of the person who has a right to answer.

### R3–R6 · The roaster, the grower, the bar, the plate

The same cut, mechanically: the reading at that scope stands whole — the
aggregate road, the origin plot, the terrace span, the hands, the pours — and
every write goes. On a café page (`vPlace`) that means the palette, the banner,
the locator map, the reach badge and its record all stand; *log a cup here* and
the sighting entry are absent. The reach primer stays: it is the manual.

### R7 · The Desk

Five rows, and no others:

| Row | Under it |
|---|---|
| **This copy** | where it came from, its revision, when it was published and when it was fetched · *Check for a newer copy* · *Download this atlas* |
| **Start keeping** | *Your own record, on this device. The atlas stays as it is; your cups lay over it.* |
| **Sign in** | *You have an account on this server. Your record comes down; the pen stays where it is.* |
| **Preferences** | theme, °C/°F, the reach mark |
| **The manual** | what the marks mean — the primers, gathered |

Gone: sync setup, the users room, the pen, *What you set down*, export/import,
the shelf, the tools, the ladder. `DESK_ROWS` is already filtered per state, so
this is a filter, not a fork.

### R8 · This copy

The provenance surface, and the one that keeps the app honest about staleness.

> **This copy** *(eyebrow)* · **The atlas, as it stood.** *(display)*
>
> | | |
> |---|---|
> | From | sync.example.com |
> | Revision | 15 |
> | Published | 12 July 2026, by Ellis |
> | Fetched | 3 hours ago |
> | Holds | 34 greens · 12 roasters · 9 bars |
>
> *Check for a newer copy* · *Download this atlas*
>
> A published copy is a copy. What the keeper has written since is not here, and
> nothing you do can change what is.

Offline, the action reads *"Offline — this copy stands."* and does not spin.

**Download this atlas** is not a nicety. Ownership is brand goal 1, and a reader
who can read but not carry away is being kept. It renders through the same
machinery as the ledger export — one self-contained HTML page on CARTA paper
stock, real token hexes inlined, the machine-readable copy embedded as
`carta.atlas/v1` — and it is the reader's, offline, forever.

### R9 · Start keeping

The door out. Sets depth 2 or 3, ends reader mode, and **leaves the published
copy exactly where it is** (L6, §8). One screen, the welcome's other two doors,
no account required and none mentioned.

---

## 7 · The founder's side

### F1 · Desk → The pen → Publish the atlas

> **The pen** *(eyebrow)* · **Publish the atlas.** *(display)*
>
> A copy of the shared record, readable by anyone with the address. No ledger
> travels — no cups, no brews, no bags. The hands that attested are named.
> *(lede)*
>
> **34** greens · **12** roasters · **9** bars · **61** sightings · **3** held
>
> `[ Publish ]`  ·  *What you're holding back →*
>
> *A copy, not a switch. What you publish stands until you publish again.*

After: *"Published. Revision 15."* and the address, ready to copy — that address
is the `#atlas=` link, which is the whole distribution story.

The counts are the consent: the founder sees exactly what leaves before it
leaves, in the same units the reader will see it in. No preview screen, no diff
— the atlas is the founder's own record and they know what is in it; the counts
are there to catch the surprise, not to review the content.

### F2 · What you're holding back

The held list, each row naming what rides with it (*"and its 3 roasts, and its 2
pours"*), each releasable with a tap. No confirm — nothing here erases (the
`CORRECTIONS.md` grammar, unchanged).

### F3 · Hold a green

From the lot page's *Corrections & identity* fold, beside amend and withdraw,
because it is the same grammar — a dated, signed, reversible entry:

> **Hold this green back**
> It leaves the published copy at the next publish. The record keeps it whole;
> readers simply never see it. Its roasts and its pours are held with it.

In ink, never in red — this is reversible, and red is spent once.

---

## 8 · When a reader starts keeping

The interesting case, and the one that decides whether L6 was worth it.

The published copy **stays**, read-only, underneath. Their own record lays over
it — the overlay motif, one layer down. Concretely:

- `catNode(kind,id)` reads **own first, published second**. One function, one
  fallback.
- `catUpsert` always writes **own**, never the published layer.
- If their record resolves onto a published node's id, their own document gets a
  thin node carrying that id. This is already a shape the model handles: the
  shared merge is a blanks-filling id-union, so when they later sign in, their
  thin node folds into the real one with no conflict and no duplicate green.

That is the whole migration, and it works because the merge law was written to
be order-free. Nothing new is invented to make the reader into a keeper — the
published copy simply stops being the only layer.

**The copy is never pushed.** A keeper who signs in pushes their own ledger and,
if they hold the pen, their own shared documents. The published copy is not
theirs and never enters a `PUT`.

---

## 9 · What this does not change

No new catalog kind. No dependency. No build step. No change to `lotKeyOf`, the
resolver, the thresholds, the grain ladder, the standing, the strike, or any
merge rule. The street map stays an enhancement with the drawn plot as its floor
— the reader gets both, or the floor, exactly as a keeper does. Every existing
record reads unchanged; the reader is a **subtraction** from a keeper's app plus
one endpoint, and the founder's side is one sheet and a list.

Every string above screens against `VOICE.md`: sentence case, terse, no emoji,
the refusals owned, the ember spent once (on *Publish*, and on the score), the
staleness stated rather than smoothed.

---

## 10 · Sequence

1. **`GET /api/public` + `POST /api/publish`**, both servers, both suites, with
   a case asserting the other endpoints stayed authenticated (L8).
2. **The snapshot and the hold** — the founder's sheet, the held list, the lot
   page's hold row.
3. **`reader()` and the predicates** — `depth`, `tabsFor`, `isAdmin`, `save`,
   `readerGuard`, the `#atlas=` link.
4. **The reader's Atlas head and the Desk's five rows.**
5. **The page cuts** — lot, roaster, grower, bar, plate.
6. **Download this atlas.**
7. **The underlay** (§8) — `catNode`'s fallback, and starting to keep.

Steps 1–4 are a readable atlas on a stranger's phone. 5–7 are what makes it a
record rather than a brochure.

---

## 11 · As built (6.7.0)

All seven steps landed. Where the code had to decide something this document
left open, it decided as follows.

**The hold lives in the ledger** (`D.holds`), merged by `mergeHolds` — the
`mergeStruck` construction, max `at` against max `releasedAt`, independently.
The pen is single, so the founder's ledger is the honest home for it; when group
curation returns it moves with the pen.

**The publish sheet does not print a pour count before it publishes.** Pours are
gathered server-side from every keeper's ledger, so the founder's device cannot
honestly know the number. The sheet says so in a line and the server states it
the moment you publish. A count the device guessed would be exactly the invented
precision this record refuses.

**The published layer is a read layer, in two doors, not one.** `catNode`'s
fallback (§8) is not enough on its own: the atlas is built by scanning entry
lists, not by looking up ids, so `catAll(kind)` and `regAll()` are the read
doors and every scan goes through them. Own first, published second. With no
copy on the device `catAll` returns the own array **itself**, not a copy, so
every existing mutation path keeps its object identity and a keeper's app does
not change by one byte. Two sites stay deliberately own-only: a repoint mutates,
and the publish counts must state what *this* pen sends.

**`catWritable(kind,id)` is the write door.** A node standing only underneath is
adopted as a thin own node carrying its id — §8's rule, made explicit — which is
what stops the two from reading as two greens before the reader signs in.

**Reader mode ends deliberately, not implicitly.** `prefs.keeping` is the flag
R9 sets, because `reader()` is defined as "keeps nothing" and a first cup cannot
be written while a prefs-only `save()` is in force. Signing in and an existing
record end it too.

**`counts` on the snapshot are `{greens, roasters, roasts, bars, pours, held}`.**
F1's sketch counted sightings; the reach was set down in 6.6.0 and its sightings
are deliberately unread, so counting them here would have re-rendered a reading
this record retired. The counts state what the atlas actually holds.

**One thing this document asked for that is deferred**: L5's obligation when
group curation returns — *the publish act must ask each keeper before it carries
their name*. The pen is single today, so publishing carries only the founder's
own hand and the obligation does not yet bind. It stays written here, as
intended, for whoever lifts the pen.

---

*The atlas is everyone's; the record is yours. Until now only one of those
sentences was true for someone who never signed in.*
