# CARTA — the fourth turn (a turn home, and a hunt)

*Approved by the founder, 2026-08-18 — this is now the fourth turn's thesis,
head of a suite: `ROADMAP.md` (the route), `ARCHITECTURE.md` (the kit),
`MARKET.md` (the weather, play only), `LOGBOOK.md` (the trail), and the
outfitter (`.claude/skills/outfitter/`), which holds all of it in session.
`NORTH_STAR.md` recorded
where Carta began — one cup, two contexts, your taste the through-line.
`VISION.md` recorded the turn toward the atlas. `ECOSYSTEM.md` recorded the
third turn — the ledger of the trade, the reference record every sale settles
against. This document records the fourth turn: the trade's record leaves for
**Lotmark**, where it becomes a real business, and Carta returns to the
person holding the cup — with one correction to the first draft of this
document. The founding use case was never only memory. It was **discovery**:
in every new city, the same ritual — open an AI chat, describe your taste,
ask for the absolute best light roast in reach — and the corpus Carta keeps
was always meant to make that ask precise. The record is the fuel; the hunt
is the fire. This revision builds the product around both.*

---

## 1. Why turn

The third turn was intellectually right and personally wrong. It built
something genuinely new — the resolver, the grain ladder, the identity
machinery, the published atlas — and in building it, Carta stopped being fun
to open. Every surface became a proof. Every entry became testimony. The
machinery was never wasted: **Lotmark takes the trade's record** — the
resolver, the lot ingester, the hard-IDs, the standing, the catalog spine,
the pen, the publishing — and builds it as a business, for customers who
need proof because money moves on it.

What's left is the part that was always the point, and it has two halves
that feed each other:

- **The record** — the cup at the bar that stops you mid-sentence, the
  coffee taken home and dialled in, the map inking itself in as your palate
  travels, the beautiful object worth showing someone.
- **The hunt** — the reason the record exists. Every city, every
  neighborhood, every road trip begins with the same question: *where, here,
  is coffee at my bar — the world's best light roasts?* Today that question
  goes to a general-purpose AI that knows nothing about you. Carta holds the
  one thing that AI lacks: the corpus. Years of cups, scores, roasters,
  menus, places — your taste, stated with evidence.

**Carta stops keeping the record of the trade and starts keeping the story
of your taste — so the story can find its next chapter.**

## 2. The one sentence

> **The best cup you've ever had is a lead, not a memory.**
> Carta keeps your record so it can find your next one.

The unit is the journey a coffee makes through your life — seen on a menu →
tasted at a bar → taken home → dialled in → placed on the map → shared — but
the loop doesn't close there. It closes when the record turns around and
points forward: *given everything you've kept, here is where to walk next.*

## 3. Who it's for

You. The person who orders the single origin, asks the barista what's on the
second grinder, carries a bag home in their tote — and who, landing in a new
city, opens a chat window and types a paragraph about washed Ethiopians and
Nordic roast profiles, hoping the model guesses well. The
Kinfolk-and-Monocle audience from `DESIGN_BRIEF.md` is unchanged, but Carta
now meets them at the airport as much as at the kitchen scale.

## 4. The seven joys (the moments the app is built around)

Everything in the new Carta must serve one of these. A feature serving none
of them doesn't ship.

1. **The cup, caught.** At the bar, wet ring on the counter, you log a cup
   in under twenty seconds: place, coffee, a 1–9, one line. Everything else
   optional forever.
2. **The hunt.** You're in Lisbon for three days — or a neighborhood of
   Tokyo, or driving the coast, or answering a friend's text. Carta answers
   *where to go* with your own corpus behind the answer, always with its
   reasons. (Section 7 is the whole design.)
3. **Take it home.** Carta's signature move: love a café cup, one tap puts
   that coffee on your shelf as a card. When you buy the bag it's already
   waiting; your home brews attach to the card your café cup started.
4. **The dial-in.** Home brewing exactly as the original north star had it:
   start from the last cup, change one thing, return to the best known cup.
5. **The map fills in.** The passport joy. Ethiopia inks itself the day you
   taste your first Yirgacheffe; a second passport layer lists every city
   you've drunk coffee in. Quiet collection pleasure — the filled map is the
   reward, the way a stamped passport is.
6. **The menu.** Photograph or paste a café's menu; Carta lays it out as
   cards — what's on, where it's from, what you've had, what's new to you.
   Every menu you capture also teaches the hunt (section 7): it's the one
   record of *which roasters pour where*.
7. **The share.** Not a feed — artifacts. A coffee's card, a café's page,
   your passport, your year, and **a brief cut for a friend** (their taste
   isn't yours; the recommendation says whose palate it came from). Each a
   self-contained, typographic, on-paper-stock page or image.

## 5. The object model (small, but shaped for the hunt)

Six things, all plain:

- **Cup** — the moment. `{at, kind: bar|home, placeRef?, coffeeRef?, score
  1–9, line, descriptors?}`.
- **Coffee** — the card. `{roaster, name, origin: {country, region, farm,
  producer, variety, process, altitude?}, roastDate?, notes}`. Origin fields
  are story fields — they hold what the bag or menu said, as it said it.
- **Place** — the bar. `{name, city, lat/lon?, roasters[], notes}`. The
  per-café palette engine survives.
- **Roaster** — the house. `{name, city, story, site, palette}`.
- **Brew** + **Setup** — the dial-in's instruments, unchanged in spirit.
- **Menu** — a dated reading of what a bar had on: `{placeRef, at,
  items[]}`. Ordering from a menu births a Cup; loving one births a Coffee.

One correction the hunt forces on the first draft's "everything free text":
**roasters and places are the graph's nodes**, so they get gentle
canonicalization — your own history autocompletes, and a one-tap "same
roaster as Sey from March?" join keeps the graph connected. Still no
resolver, no rungs, no proof — just enough sameness that "every café that
has ever poured Sey for you" is a computable set. Origin fields stay pure
story. Wrong joins stay one tap to undo.

**Laws that survive** (they were always the good ones): °C canon; a brew
requires a Setup; grind never compared across Setups; nothing erased by an
ordinary act (put away + undo); no `confirm()`; red only for true
destruction; the ember spent once per screen; **a recommendation never
travels without its reasons** — the third turn's best law, and now the
hunt's first law.

## 6. The atlas, inverted

The map stops proving and starts remembering — and inviting. Three frames,
all in the existing drawn ink (the `LANDS` outlines, the highland contours,
the monochrome-plus-ember style are a crown jewel; keep every bit of the
craft):

- **The passport** (world frame). Countries you've tasted take a wash;
  untasted coffee countries stay hairline outlines — the empty map is an
  invitation, not a void. Beside it, the city list: everywhere you've drunk
  coffee. The app's most shareable single image.
- **The chapter** (country/region frame). Tap Ethiopia: the outline, its
  highlands, your regions marked, and below the map the chapter as
  typography — the regions, farms, and producers you've collected as story
  rows. Country → region → farm → producer is the chapter's *narrative
  structure*, headings earned by tasting, never a proof ladder.
- **The city** (street frame). MapLibre streets in the themed ink — your
  bars, your roasters' bars, and the hunt's results drawn as pins with their
  reasons a tap away.

The old evidence law relaxes because the claim changed: a pin remembers what
a bag *said*, which is honest at the level a memory needs. One footer line
owns it: *"The map remembers what the bags said."*

## 7. The scout (the discovery engine — the founding use case, built)

This is the section the first draft under-dreamed. The ritual today: land
somewhere, open an AI chat, re-describe your palate from scratch, get a
generic answer seasoned with hallucinated cafés. The corpus in Carta is
exactly what that conversation is missing. The scout is that ritual made
into a product, in three stages that each stand alone.

### 7.1 The taste model (what the corpus compiles into)

Derived from your record, recompiled as it grows, always inspectable —
never a black box. Two parts, because "the absolute best light roast in the
world" is really two claims:

- **The bar** — your caliber threshold. You don't want *similar to* your
  taste; you want *at or above* it. The model states it plainly: the
  roasters you score 8+, the style of cup that earns your 9s, the floor
  below which a café isn't worth the walk.
- **The vector** — your style. Roast profile, process leanings, origin
  leanings, descriptor patterns, and above all your **anchor roasters** —
  the houses whose bags you keep coming back to. Anchors are worth more
  than adjectives: "pours Sey and La Cabra" locates a café's caliber more
  precisely than any tasting-note prose.

The DNA already exists in the codebase: `matchOf` and its law that a score
never travels without its `signals`, the skip that fades instead of
vetoing, the leans. That machinery was built for café matching and then
shuttered — it was the right idea waiting for this pivot. The scout is
`matchOf` grown up.

### 7.2 The ask (every scope you actually use)

One surface, one question — *where should I drink?* — scoped the way life
scopes it:

- **A city.** "Lisbon, three days." The classic ask.
- **A neighborhood.** "Walking distance from this hotel."
- **A country / a state.** "Worth a detour anywhere in Portugal?"
- **A route.** The road trip: a corridor query — the stops along the way
  that clear your bar, ordered by detour cost. Nobody builds this; it's a
  map product and Carta is a map product.
- **A friend.** Recommendation mode: your corpus, cut to their stated
  taste ("she likes what I like but darker"), exported as a brief with
  your name on it.

Every answer carries its reasons — which anchors, which menus, which past
cups argued for it — and every result is one tap from becoming a plan, a
visit, a cup, and therefore more corpus. Hits and misses (the 1–9 you give
what it found) recalibrate the model. That's the "algorithm of sorts":
a loop, not a formula.

### 7.3 Stage one — the brief (ships first, zero infrastructure)

Carta composes your palate into a **brief**: a compact, beautiful,
typographic artifact — human-readable on Carta paper, machine-readable
underneath (the ledger-export trick, `carta.brief/v1`) — stating the bar,
the vector, the anchors, the evidence, and what you've already had *in the
place you're asking about*. Scoped automatically: "Brief — Lisbon, August
2026" excludes the cafés you've done and flags the roasters you already
know.

You paste it into any AI chat — the ritual you already trust — and the
generic paragraph you used to type from memory becomes a precise,
evidence-backed dossier. **Carta doesn't replace your AI ritual in v1; it
arms it.** This costs nothing to run, works offline, keeps the app
keyless and accountless, and is honestly the biggest single upgrade to the
founding use case — the corpus, weaponized, this quarter.

### 7.4 Stage two — the built-in scout (the ask, answered in-app)

Carta asks on your behalf: the brief plus the scope goes to a model, the
answer comes back as pins on the city frame with reasons attached, and
"been / booked / skip" feeds the loop. This needs a key, so it's the first
deliberate break with keyless-forever — options: bring-your-own-key (most
on-brand: your key, your record, your calls), or a small paid concierge
tier (the first honest revenue Carta has ever had a shape for). Grounding
discipline: the model proposes, but every named café is checked against a
real place lookup before it's drawn — Carta never pins a hallucination.

### 7.5 Stage three — the Lotmark loop (the two products complete each other)

The general model's real weakness isn't taste — it's *facts on the
ground*: which roasters a café pours this month, which bars a roaster
runs, what's on the menu today. That is exactly the atlas Lotmark is in
business to keep. When Lotmark publishes a readable atlas of roasters,
bars, and menus, the scout's answer becomes **corpus × atlas × freshness**:
your taste (Carta's side) joined to the world's verified supply (Lotmark's
side). The roaster graph gets real: the cafés that pour your anchors, the
cafés that pour your anchors' *peers* — houses that co-occur with them on
multi-roaster menus — ranked by your bar. Carta becomes Lotmark's consumer
flywheel (every menu a traveler captures is a lead for the atlas), and
Lotmark makes Carta's hunt precise. Neither depends on the other; each
makes the other sharper.

## 8. Typography as the brand (kept, warmed)

The Quiet Matter inheritance stands: Spectral + Libre Franklin, the token
architecture, paper and dusk, hairlines, square shapes, the ember. The
persona warms from keeper-of-the-trade's-records to *the field notebook of a
well-traveled palate* — still terse, sentence case, no emoji, typographic
glyphs, but fewer refusals, more invitations.

- Retired motifs: "the record the trade settles against", "the pen",
  "unread is a state", the grain, the standing.
- New motifs: **"where a cup takes you"** · **"take it home"** · **"the
  shelf"** · **"the passport"** · **"the chapter"** · **"the brief"** ·
  **"worth the walk"** (revived from the shuttered matching — it was
  always the hunt's phrase).
- The seal: *"We do not sell coffee. We remember it — and we know where to
  find more."* (Or keep it clean: *"We do not sell coffee. We remember
  it."* and let the scout speak for itself.)

## 9. Sharing (artifacts, never a feed)

The ledger export generalizes into **cards**: a Coffee card, a Place card,
the Passport, the Year — and the **Brief**, which is both a tool (7.3) and
a gift (the friend-scoped cut). Each is static, self-contained, beautiful;
shared cards embed their own data so "add this to my Carta" is one tap.
Carta spreads hand to hand, like a good bag recommendation.

## 10. What leaves (the honest cut list)

Moves to Lotmark: the resolver and its ladder, lot identity, fingerprints,
hard-IDs, the grain, the standing (caliber/rarity/traceability), the catalog
spine and `mergeCatalog`, the pen and founder, the Register as a shared
document, publish/holds/the reader, curator ingestion, the review queue,
Chart No. 1, the place-confirmation machinery and the tidy sweep.

Retired outright: multi-user on one device, the sync server's shared
documents and 409 protocol as a core feature, the full strike grammar (a
lighter put-away + undo remains), `LEGACY_ON` and everything behind it, the
claim and sighting ceremonies.

Kept and promoted: the dial-in loop, the shelf, the palette engines, the
drawn maps and street layer, the door (simplified — paste in, card out), the
export-as-beautiful-page, offline-first localStorage, the token layer, the
tuck, the motion charter, the descriptors and the 1–9 — and, **un-shuttered
and promoted to the core**, the matching DNA: `matchOf`, signals-required,
skips-that-fade, worth-the-walk. The scout is its second life.

## 11. Architecture (the full rethink, and the recommendation)

Three options; the recommendation is unchanged from the first draft, with
the scout's needs folded in:

- **A. Carve the current file down.** The third turn's assumptions are
  load-bearing everywhere. Not recommended.
- **B. Re-platform** (Vite + framework). Buys tooling at the cost of the
  thing that makes Carta *Carta* — one readable file, no build, dropped on
  Pages, owned outright. Not recommended.
- **C. Rewrite small.** ✳ A **new `index.html`, started clean** from the
  six-object model — same stack (vanilla, inline, localStorage, zero deps,
  zero build), same token layer, ~3–4,000 lines. The current app freezes
  whole as `classic/index.html`; migration is an import of the existing
  JSON export (cups→Cups, bags→Coffees, cafes+Register→Places,
  setups/brews as-is; catalog nodes flatten back to story fields).

Scout-specific notes: the taste model and the brief are pure client-side —
no server, no key, no network. Stage two introduces the first sanctioned
network *ask* (BYO-key or concierge), engineered like every other Carta
enhancement: optional, degrading to the brief offline. Stage three is a
keyless read of Lotmark's published atlas, `readBrand`-style. Sync stays
deferred; if multi-device returns, the tiny server comes back as a dumb
one-owner backup only.

## 12. Open decisions (each with a lean)

1. **Photos.** Deliberately retired in the current app; the case reopens
   for a fun, shareable Carta. *Lean: yes* — one optional photo per cup,
   presentation governed by restraint. The deepest break with current law;
   deserves a deliberate yes.
2. **The score.** *Lean: keep the 1–9* — it's brand, it's honest, and the
   scout's bar is computed from it; offer a three-state fast path that maps
   onto it.
3. **The AI posture.** Brief-only v1 (paste into your own chat) →
   BYO-key v2 → concierge tier as the first revenue. *Lean: exactly that
   order* — the brief alone already transforms the founding ritual.
4. **How much structure the corpus needs.** Free text everywhere except
   roaster and place identity, which get the gentle join. *Lean: that
   line, held firmly* — the graph needs nodes; the story needs freedom.
5. **Menus.** Personal capture v1; community menus only if Lotmark's
   infrastructure makes them nearly free. *Lean: personal v1.*
6. **The rooms.** *Lean:* four — **Journal** (the cup stream) · **Scout**
   (the ask, the brief, the finds) · **Atlas** (passport, chapters, city) ·
   **Shelf** (coffees + Setups) — one door, **＋ a cup**, on every
   masthead. The hunt earned a room; the first draft's three-room plan
   buried the founding use case, which is how it got lost the first time.
7. **The version.** Ship as Carta 7.0; the number announces the turn.

## 13. A sequence (how the dream lands)

1. **Agree the thesis** — this document into a new `NORTH_STAR`; the cut
   list signed; the open decisions decided.
2. **The skeleton** — new `index.html`: tokens, six objects, the Journal,
   the door, the Shelf. Usable for logging in week one.
3. **The brief** — the taste model compiled and exportable. Early on
   purpose: it's cheap, it's client-side, and it's the founding use case —
   the corpus starts paying rent before the atlas is even drawn.
4. **The atlas** — passport, chapters, city frame, ported drawn-map craft.
5. **The bridge** — take-it-home, the simplified door, menu capture.
6. **The cards** — coffee card, passport, the year, the friend-brief.
7. **The scout, stage two** — the in-app ask (BYO-key), pins with reasons,
   the learning loop.
8. **Migration** — the classic importer; `classic/` frozen and linked.
9. **Later** — sync-as-backup; the Lotmark atlas read; community menus.

---

*The third turn asked: what does the trade need? Lotmark now answers that.
The fourth turn asks two questions the same record answers: what do I want
to remember, and — the question that started all of this, typed into a chat
box in every new city — where do I go next? Carta keeps the first so it can
answer the second. Everything. Beautifully. With no homework — and with
directions.*
