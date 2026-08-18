# CARTA — the fourth turn (a turn home)

*A brainstorm and a proposal, not yet a commitment. `NORTH_STAR.md` recorded
where Carta began — one cup, two contexts, your taste the through-line.
`VISION.md` recorded the turn toward the atlas. `ECOSYSTEM.md` recorded the
third turn — the ledger of the trade, the reference record every sale settles
against. This document records the fourth turn, and the fourth turn is a turn
home: the trade's record leaves for **Lotmark**, where it becomes a real
business, and Carta returns to the person holding the cup. Nothing here is
sacred; the whole architecture is on the table. What follows is the dream,
argued.*

---

## 1. Why turn

The third turn was intellectually right and personally wrong. It built
something genuinely new — the resolver, the grain ladder, the identity
machinery, the published atlas — and in building it, Carta stopped being fun
to open. Every surface became a proof. Every entry became testimony. The app
that began as "know the cup you love" now asks the keeper to think like an
archivist of a trade they don't work in, and 12,500 lines of one HTML file
exist mostly to keep a record honest at a standard nobody drinking a
Wednesday-morning pour-over asked for.

The machinery was never wasted. It found its market — it just isn't this one.
**Lotmark takes the trade's record.** The resolver, the lot ingester, the
hard-ID rungs, the standing, the catalog spine, the pen, the publishing — all
of it is B2B infrastructure, and it should be built as a business, with
customers who need proof because money moves on it.

What's left when the proof leaves is the part that was always the point:

- the cup at the bar that stops you mid-sentence,
- taking that coffee home and getting it right on your own grinder,
- the map of the world slowly inking itself in as your palate travels,
- reading a café's menu like a wine list and knowing what to order,
- and showing someone — beautifully — what you found.

That's the product. Personal, joyful, offline, gorgeous. **Carta stops
keeping the record of the trade and starts keeping the story of your taste.**

## 2. The one sentence

> **Every cup comes from somewhere. Carta is your map of where it took you.**

Or, kept closer to the original north star:

> **Know the cup you love — and follow it.** From the bar to your kitchen to
> the hillside it grew on. One journal, one shelf, one atlas: yours.

The unit is no longer *the record* and no longer *the lot*. The unit is
**the journey a coffee makes through your life**: seen on a menu → tasted at
a bar → taken home → dialled in → placed on the map → shared. Carta is the
instrument for that journey, and every surface should serve one of its
moments.

## 3. Who it's for

You. Not the trade, not the producer's desk, not the importer. The person who
orders the single origin, asks the barista what's on the second grinder,
carries a bag home in their tote, and wants their memory of all of it to be
as beautiful as the coffee was. The Kinfolk-and-Monocle audience from
`DESIGN_BRIEF.md` is unchanged — allergic to gamification, respectful of
objects that respect them — but Carta now meets them off-duty, not at a desk.

## 4. The six joys (the moments the app is built around)

Everything in the new Carta must serve one of these. A feature serving none
of them doesn't ship.

1. **The cup, caught.** At the bar, wet ring on the counter, you log a cup in
   under twenty seconds: the place, the coffee's name off the menu, a 1–9,
   one line. Everything else is optional forever. Logging is a small pleasure,
   not a form.
2. **Take it home.** The bridge — Carta's signature move, and the thing no
   other coffee app does. You loved the cup; one tap moves that coffee onto
   your shelf as a card. When you buy the bag, it's already waiting. Your
   home brews attach to the same card your café cup started. The circle
   closes: *found it out, made it mine.*
3. **The dial-in.** Home brewing kept exactly as the original north star had
   it: start from the last cup, change one thing, return to the best known
   cup. Grind comparable only within one Setup. This loop already works —
   keep it, polish it, never bury it.
4. **The map fills in.** The passport joy. Ethiopia inks itself the day you
   taste your first Yirgacheffe. Tap the country and its chapter opens — your
   cups from there, the regions you've met, the farms and producers whose
   names you've collected, told as story rows, not evidence rows. Quiet
   collection pleasure, no streaks, no badges — the filled map *is* the
   reward, the way a stamped passport is.
5. **The find.** Discovery, two ways. *The menu:* photograph or paste a
   café's menu and Carta lays it out as cards — what's on, where it's from,
   what you've had before, what's new to you. *The map:* the bars of the
   roasters you love, the cafés your taste suggests, in the city frame.
6. **The share.** Not a feed. An artifact. A single coffee's card, a café's
   page, your year in coffee, your passport map — each rendered as a
   self-contained, typographic, on-paper-stock page or image you can send to
   one person or post anywhere. Sharing is publishing a beautiful object, not
   feeding an algorithm.

## 5. The object model (radically smaller)

The current model carries ~15 collections and a shared-document catalog with
merge law. The new model is six things, all plain, all free text where a
human would use free text:

- **Cup** — the moment. `{at, kind: bar|home, placeRef?, coffeeRef?, score
  1–9, line, descriptors?}`. The atom of the journal.
- **Coffee** — the card. `{roaster, name, origin: {country, region, farm,
  producer, variety, process, altitude?}, roastDate?, notes}`. Origin fields
  are **story fields, never proof**: they hold what the bag or menu said, as
  it said it. No grain, no rungs, no fingerprint, no hard-IDs.
- **Place** — the bar. `{name, city, lat/lon?, roasters[], notes}`. The
  per-café palette engine survives — it's pure delight.
- **Roaster** — the house. `{name, city, story, site, palette}`. Its page
  tells its story and lists its bars and its coffees you've met.
- **Brew** + **Setup** — unchanged in spirit from today. The dial-in loop's
  instruments.
- **Menu** — new. `{placeRef, at, items[]}` — a dated reading of what a bar
  had on. Each item is a lightweight coffee reference; ordering from a menu
  births a Cup, loving one births a Coffee on the shelf.

**Identity becomes gentle.** No resolver. Your own history autocompletes
(type "Hui…" and Huila offers itself because *you've* written it before).
When two entries look like the same coffee or place, Carta may *ask* — "Same
coffee as the one from March?" — one tap to join, one to keep apart, never a
block, never a ceremony, wrong answers cheap to undo. The fold folds your own
spelling drift and nothing more. Two people's ledgers never need to agree,
because there is no shared page to agree on.

**What survives from the current laws** (they were always the good ones):
temperature canonically in °C; a brew requires a Setup; grind never compared
across Setups; nothing erased by an ordinary act (put away + undo — but the
full strike grammar with carried bodies and merge liveness goes); no
`confirm()`; red spent only on true destruction; the ember spent once per
screen.

## 6. The atlas, inverted

Today the map is evidence-gated: a mark may never claim finer than the record
proves. Beautiful law — for a reference record. Lotmark keeps it. Carta's
atlas answers a warmer question: **where has your taste been?**

Three frames, all in the existing ink (the drawn-SVG style is a crown jewel —
keep every bit of its craft):

- **The passport** (world frame). The `LANDS` country outlines and highland
  contours — already built, already gorgeous, under 30 KB, fully offline —
  become the hero surface. Countries you've tasted take a wash; the count
  sits beside the name; untasted coffee countries stay as hairline outlines,
  which makes the empty map an invitation instead of a void. This is the
  app's most shareable single image.
- **The chapter** (country/region frame). Tap Ethiopia: the outline, its
  highlands, your regions marked, and below the map the chapter as
  typography — big serif display name, your cups from there, the farms and
  producers you've collected as story rows. Distinction between country →
  region → farm → producer is the *narrative structure* of the chapter, not
  a proof ladder: each level is a heading you've earned by tasting something
  from it.
- **The city** (street frame). MapLibre streets stay, café scope only, in
  the themed ink — your bars, your roasters' bars, the find. The camera and
  pins as today, minus every law about what a mark may claim.

The old refusals relax because the claim changed: a pin on your passport
doesn't assert where a lot verifiably originated — it remembers where a bag
*said* it was from, which is honest at the level a memory needs to be. One
line of copy in the atlas footer can own this plainly: *"The map remembers
what the bags said."*

## 7. Typography as the brand (kept, warmed)

The Quiet Matter inheritance stands: Spectral + Libre Franklin, the token
architecture, paper and dusk, hairlines, square shapes, the ember. The
sub-brand charter (`SUBBRAND.md`) barely changes — Carta was always the warm
one in the family. What changes is the **persona**: the keeper of the trade's
records retires; in their place, something like *the field notebook of a
well-traveled palate*. Still terse, still sentence case, still no emoji in
the app, still typographic glyphs — but the dryness warms from severe to
companionable. Fewer refusals, more invitations.

- Retired motifs: "the record the trade settles against", "the pen",
  "unread is a state", "carried, not resolved", the grain, the standing.
- New motifs: **"where a cup takes you"** · **"take it home"** · **"the
  shelf"** · **"the passport"** · **"the chapter"**.
- The seal changes. *"We do not sell coffee. We keep the record"* was the
  third turn's oath. The fourth turn's might be: **"We do not sell coffee.
  We remember it."**

Display typography gets *more* room, not less: country chapters, roaster
stories, and share cards are editorial surfaces, and the serif display scale
is where the brand lives. The most beautiful object in specialty coffee —
that bar from the design brief — is still the bar. It just stopped being a
filing cabinet.

## 8. Sharing (artifacts, never a feed)

The current ledger export — a self-contained HTML page on Carta paper stock —
is the seed of the whole sharing story. Generalize it into **cards**:

- a Coffee card (the bag, its origin story, your best cup of it),
- a Place card (the bar, its palette, your cups there),
- the Passport (the world map, inked),
- the Year (a composed annual page: cups, countries, the coffee of the year).

Each is a static, self-contained, beautiful object — rendered as HTML for
sending and as an image for posting. No accounts, no feed, no comments, no
network required to make one. If a friend taps a shared card, the card can
carry its own data (as the ledger export already embeds `carta.ledger/v1`) so
"add this coffee to my Carta" is one tap — sharing becomes seeding, and
Carta spreads the way a good bag recommendation does: hand to hand.

## 9. What leaves (the honest cut list)

Moves to Lotmark (it was built for this): the resolver and its ladder, lot
identity, fingerprints, hard-IDs and their schemes, the grain, the standing
(caliber/rarity/traceability), the catalog spine and `mergeCatalog`, the pen
and founder, the Register as a shared document, publish/holds/the reader, the
curator ingestion, the review queue, Chart No. 1, the place resolver's
confirmation machinery and the tidy sweep.

Retired outright: multi-user on one device, the sync server's shared
documents and 409 protocol as a core feature, the full strike grammar (a
lighter put-away + undo remains), `LEGACY_ON` and everything behind it, the
propose-a-sighting ceremony, the claim ceremony.

Kept and promoted: the dial-in loop, the shelf, the per-café and per-bag
palette engine, the drawn maps (`LANDS`, contours, the ink), the street
layer, the door (simplified — paste in, card out, no adjudication), the
export-as-beautiful-page, offline-first localStorage, the token layer, the
tuck, the motion charter, °C canon, the descriptors and the 1–9.

## 10. Architecture (the full rethink, and the recommendation)

Three honest options:

- **A. Carve the current file down.** Delete the trade machinery from
  `index.html` in place. Safest for data, but the third turn's assumptions
  are load-bearing everywhere (every write path threads `catOwn`/layered
  reads); carving means understanding all of it forever. Not recommended.
- **B. Re-platform.** Vite + Svelte/Preact, components, a real test rig.
  Buys tooling comfort at the cost of the thing that makes Carta *Carta*:
  one file you can read whole, drop on Pages, own outright. The no-build
  single-file property is brand, not accident. Not recommended.
- **C. Rewrite small.** ✳ Recommended. A **new `index.html`, started clean**
  from the six-object model — same stack (vanilla JS, inline everything,
  localStorage, zero deps, zero build), same token layer copied over, same
  fonts, aiming for ~3–4,000 lines. The current app is frozen whole as
  `classic/index.html` (it keeps working forever — it's self-contained, that
  was the point). Migration is an *import*: the existing JSON export maps
  cleanly (cups→Cups, bags→Coffees, cafes+Register→Places, setups/brews
  as-is; catalog nodes flatten back to story fields — the flat origin text
  the catalog retired is still recoverable from the nodes themselves).

Sync: **defer**. Offline-first localStorage plus the working-copy JSON export
covers one person on one device honestly. If multi-device returns, the
existing tiny server is a fine dumb backup (one ledger, one owner, no shared
documents) — but it should have to earn its way back in.

Lotmark: **the enrichment read, later.** Carta never needs Lotmark — but if
Lotmark publishes a public atlas, Carta can ask it, keylessly and optionally,
"do you know this coffee?" and let a card get richer (the farm's story, the
verified road) the way `readBrand` fetches a palette today: a progressive
enhancement that degrades to nothing offline. Carta becomes Lotmark's
consumer-grade showcase without carrying a gram of its machinery. The two
products cite each other; neither depends on the other.

## 11. Open decisions (each with a lean)

1. **Photos.** The current app deliberately retired them. For a fun,
   shareable Carta the case reopens: one photo per cup, optional, never
   required, stored small. *Lean: yes* — it's the single biggest lever for
   "fun to share," and restraint can govern presentation instead of
   existence. This is the deepest break with current law, so it deserves a
   deliberate yes.
2. **The score.** Keep the 1–9 (it's brand, and it's honest) or soften to a
   three-state (again / good / not for me)? *Lean: keep 1–9*, offer the
   three-state as the fast path that maps onto it.
3. **Menus.** Personal-only in v1 (you capture, you read). Community menus —
   many keepers, one bar's live menu — are a server, moderation, and a
   product of their own. *Lean: personal v1; community only if Lotmark's
   infrastructure makes it nearly free later.*
4. **The rooms.** Proposal: three tabs — **Journal** (the cup stream, home
   and café interleaved) · **Atlas** (passport, chapters, city) · **Shelf**
   (coffees + Setups) — and the one door, **＋ a cup**, on every masthead.
   Desk shrinks to a corner (export, import, preferences).
5. **The name of the turn.** Internally this is Carta 7.0 — the version
   number should announce the turn.

## 12. A sequence (how the dream lands)

1. **Agree the thesis.** This document argued into a new `NORTH_STAR`; the
   cut list signed off; the open decisions decided.
2. **The skeleton.** New `index.html`: tokens, the six objects, the Journal
   stream, the door, the shelf. The app is usable for logging in week one.
3. **The atlas.** Passport frame, chapters, city frame — porting the drawn-map
   craft from classic.
4. **The bridge.** Take-it-home, the simplified door, menu capture.
5. **The cards.** Share artifacts: coffee card, passport, the year.
6. **Migration.** The classic importer; `classic/` frozen and linked.
7. **Later, maybe.** Sync-as-backup; the Lotmark enrichment read; community
   menus.

---

*The third turn asked: what does the trade need? Lotmark now answers that.
The fourth turn asks the question Carta was born from, with everything the
detour taught it about maps, typography, and restraint: what does the person
holding the cup actually want to remember? — Everything. Beautifully. With
no homework.*
