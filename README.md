# CARTA Coffee Ledger

A personal memory of coffee at home and in cafés.

**One cup. Two contexts. Your taste is the through-line.**

CARTA gives equal weight to the cup you make and the cup you are served. Home is
measured, adjusted, and made again. Café is received, experienced, and returned to.
Both end in the same honest record of what was in the cup and whether it was worth
finding again.

> **Design lineage.** Carta is a **sub-brand of the Quiet Matter design system**
> (`quietmatter/quiet-matter`). It inherits Quiet Matter's typefaces, type scale,
> label system, token architecture and voice, and overrides its palette, adds an
> ember signal, an editorial display scale and a per-café colour engine. The full
> charter — what is inherited, what may be overridden, how the two stay in sync —
> is in [docs/SUBBRAND.md](docs/SUBBRAND.md).

CARTA keeps **three rooms, always on the bar** — **Atlas · Record · Desk** —
and one door, **＋ A coffee**, on the masthead of every screen. Home, Café and
Today became channels, not rooms: the coffee in your hands is the head of the
Atlas (its road, and the two things anyone ever does with it — open the green,
or brew it), and the cup out rides off a place's page. Find retired into the
**Atlas** too — search, the chart, the drawn plot, the places worth the walk.
The ladder (Reading → Remembering → Making → Keeping) survives as the record of
how deep you've stepped, read under **the Desk → Preferences**; nothing is ever
taken away.

- **Atlas** — the reading room: the coffee in your hands and its road; the
  chart at its altitude; the atlas cut into plates by country, process or
  variety; every green on it. One green traced through every hand.
- **Record** — your overlay: your plates, the greens your own record argues
  for (with their reasons), lately, the bookkeeping the matching writes, and
  every reading one fold down.
- **Desk** — everything that is not a cup: the shelf, your Setups, adding to
  the atlas, the export that leaves with you, what you've set down, the pen,
  sync, keepers, preferences, the manual. One row open at a time.

Every café, every green, every roaster is a **page**, not a popup — reached
from anywhere its name appears. A lot's page carries **the road** — six
stations, grown → processed → milled → roasted → poured → read, filled where
the record holds a station and hollow where it does not — its identity
columns, its standing, where it pours, every hand's roast, your own brew
corpus, and your overlay at the end of it. Every mark explains itself one tap
away — the primers.

**The door** is how a coffee comes in: one paste field. Paste the roaster's
page or the back of the bag; CARTA reads it on the device — no key, no
account, no network — shows what it found as facts you can strike, says how
finely the green resolves and whether two records could ever meet on it, and
binds it with one tap: on my shelf, poured at a bar, brewed just now, or just
noting it. The room shapes the bind — open the door from a bar's page and it
offers *Poured here*, the venue already bound; the café cup has no origin form
of its own, because everything about the coffee was settled here first. It
asks once for the roast date — the one fact a page never states and the rest
window can't do without — and never invents one. The typed form stays one tap
away, and every origin field carries a **rail** of what the record already
holds — counts, one tap to fill, narrowing to what you've already chosen on
the same screen. Never type a country twice.

**A plate** is the atlas, cut — a country, a process, a variety, read as one
page with the aggregate road: how many of the facet's greens reach each
station, and where those greens grew. Greens that leave the field unread are
counted, never quietly dropped. Find plates under **Atlas → Cut the atlas**.

**The terrace** is the atlas's second projection. The map is a plan — it
answers *where* a coffee came from, and it cannot answer how high. So a
green's page draws a **section**: contour rules, this green's height placed
against every other green the record holds one for, and the reading in words
— how many grew lower, how many higher, how many overlap this band. A stated
range draws as a band and a single figure as one line, because a lot sold as
1,800–1,900 m never said 1,850. Height is a growing condition, never a grade:
nothing sorts by it, no plate cuts by it, and it is never part of a coffee's
identity or a pin on a map. Two heights that disagree are **carried, not
resolved** — the first stands, the other is kept beside it with its author.
Heights arrive through the door, which has always read them off a paste.

**One page, every scope.** A country, a region, a grower, a green, a roaster,
a bar, a city, a Setup, a process, a variety — every one of them is the same
page pointed at a different slice of one record, answering the same five
questions in the same order: what is it, how far the record follows it (the
road), what it can prove (the readout), where it sits and what it holds (the
map, the terrace, the scopes above and below, the greens, the hands, the
bars), and what you found (your overlay). Every name anywhere is a row that
walks; the crumb above a page names the scopes over it; back always names the
page it returns to, and a room chosen from the bar clears the walk. **The map
has no zoom — the walk is the zoom**: two frames on every page, where it grew
and where it is carried, drawn from the record itself. A mark is never finer
than the grain it rests on, what cannot be placed lists rather than lies, and
one bar is never dressed up as a scene.

See [docs/NORTH_STAR.md](docs/NORTH_STAR.md) for the product thesis and restraint standard.

## First run

The first time you open CARTA it says what it is — the record of specialty
coffee, every lot traced, your taste a wash laid over the trace — and offers
three doors:

- **I read, mostly** — the Atlas opens; keep nothing, ever.
- **Someone else makes it** — a bar and one tap is a whole record.
- **I make my own** — the instrument opens; begin from the last cup.

The answer only sets where you land first — every room stays on the bar.
Replay the welcome any time from **the Desk → The manual → Replay the welcome**.

## Logging a brew

The first brew asks only for your grinder and brewer, in plain words — the Setup
writes itself. (The full Setup editor lives under **the Desk → Setups** for the day
you change a burr; a grind number is only comparable within one Setup.)

After that, the brew screen opens as your last brew — turn the one dial you actually changed. Each numeric dial can be driven three ways:

- **Tap − / +** for one step.
- **Press and hold** − or + to accelerate across a wide range (fly through a 0–2000 grinder, ease off for the fine end).
- **Tap the number** to type an exact value on the numeric keypad — time accepts `m:ss`.

Give each **Setup** its grinder's real **grind scale** (min / max / step — e.g. a Lido OG is 0–2000, step 5) and that Setup's grind dial moves the way the grinder does. Grind is only ever comparable within one Setup.

Temperature has a **°C / °F** switch right on the dial (whole-degree steps), remembered per user and stored canonically as °C so the record stays comparable.

If you time and weigh on your machine or a Bluetooth scale (e.g. the Argos app), hide CARTA's stopwatch in **the Desk → Preferences** and simply type the time and weight in. CARTA keeps the record; it doesn't need to be the timer.

A bag can read itself off the web. Give it the roaster's or the bag's **website**
and CARTA takes the roaster it states, a line, and the bag's own **colours** — the
palette then dresses the bag's page and its place on the shelf. It fills only
what's still blank; offline, or a silent site, you type it in by hand and it all
still saves. No photograph is captured or stored — a brand is its colours and its
words, kept small and offline.

When a bag is finished, **put it away** from the shelf (the Atlas → *or start from
the shelf*) — it waits under *Put away* with your best cup, and restores with
everything you learned when you buy it again.

## Correcting the record

Every record answers to the same two verbs, behind one door: **amend it**, or
**set it down**. Open any record — a cup, a brew, a coffee, a Setup, a café, an
authored roast — and the correction sheet states what it is, names every record
that will go with it if it goes, and offers both.

- **Amend** reopens the form the record was written in. Nothing new to learn.
- **Set it down** strikes it from the record. It leaves every reading, count,
  average, plot and export, and waits — whole — under **the Desk → What you set
  down**. One tap puts it back, with exactly the records that came down with it
  and no more. **Nothing is erased by an ordinary act.**
- **Put away / retire** is the third verb and a different thing: a finished bag,
  a grinder you sold. It leaves the working surfaces; the record stays whole and
  readable. A bag you *finished* is put away; a bag you typed by *mistake* is set
  down. Collapsing those into one "delete" would make the record lie either way.
- **Erase** is the only irreversible act in CARTA, and lives in one place — the
  bottom of that same desk row, on records you have already set down. It is the
  one thing wearing the red button.

A strike is itself a record: signed, dated, and carrying the withdrawn body
whole — struck rather than deleted, never erased by an ordinary act. It syncs like
one, so a record set down on one device leaves every device, and putting it back
puts it back everywhere, from either side, in any order.

Three things the correction reaches that nothing reached before: a **brew** (a
coffee's page lists every brew on it, including the ones whose impression you
skipped, which no path in the app could open before); a **coffee** (removable at
last, not merely put away); and a **café entry** on the Register (struck by the
hand that holds the pen, so a phantom minted by a typo is no longer permanent).

And a **sighting** — the line you signed on the shared record, and the model the
whole grammar was built from — now answers the same verbs. Its sheet states what
you saw, what the bar reads, and *what falls with it*: each fact the line carries,
named beside whatever stands in its place, or the plain sentence that nothing
does. A withdrawn sighting waits in the same room and stands back up with one
tap, for every keeper. It is the one thing there that can never be erased: every
keeper holds a copy, the merge is a union of lines, and a line deleted here would
simply return on the next sync. Struck is the strongest honest answer.

The full grammar and why it is shaped this way: [docs/CORRECTIONS.md](docs/CORRECTIONS.md).

## Appearance

CARTA reads like a printed record: a serif for what you tasted, a sans for what you measured, and one ember-red signal for the current action and the cup’s score. Two themes — **Paper** and **Dusk** — switch under **the Desk → Preferences**, remembered per user. A third choice, **Auto**, follows the device's own light/dark setting (iOS Settings → Display & Brightness, etc.) and moves with it live, no reload needed. The typefaces (Spectral and Libre Franklin) are served from the app's own `fonts/` directory, so nothing loads from a third party.

## The Atlas, and the matching

**The Atlas** opens on the coffee in your hands — its name, where it grew, the
hand that roasted it and how many days off, then **the road** it has travelled
so far, then two buttons: **Open the green**, or **Brew it**. That is all
Today ever was, and it is now a paragraph at the head of the reading room
rather than a room of its own.

Below it, the Atlas is the reading room, and the matching lives there now:

- **Read the season for me.** Ask, and the atlas composes the season once, in
  front of you — the pins settle and a line draws through them, ranked only by
  your own taste, shown with its reasons. Ask again and it composes again; it
  never plays on its own, and under the OS reduced-motion setting it lands
  composed instantly.
- **Worth the walk, for you.** Every place on the register you haven't kept,
  ranked by match, each with its reasons — plus the full map reading. Online,
  real streets draw themselves behind the pins — OpenStreetMap, repainted in
  CARTA's own paper and ink, keyless and untracked; offline the same pins
  stand on the drawn plot, exact as ever.
- **The season's lots, the hands, the stream.** Every anchored green with its
  standing worn as chips, the roasters and bars behind them, and the circle's
  cups.
- **Propose a sighting.** A bag on a shelf, a roast on a bar — the chart looks
  for it before it binds. A shared printed code binds outright; a fingerprint
  match asks; a same-name-different-process refuses to merge on the string.

**The matching** reads three things, and says so: the *traits* of the places you
keep (their tags, weighed heavier where you scored well); the
*distance*, only once you tap "Near you" — your location is held in memory,
never stored; and the *circle's cups* there, weighted toward the people whose
taste sits closest to yours. Every score opens into its signals on the café's
page — "Why this" — and no score is ever shown without them.

- **The early read.** Until you've kept three café cups the matching speaks in
  bands — *worth a look · promising · a strong read* — not numbers. New to the
  record entirely? The Atlas asks for **three cafés you already love**; their
  traits become your signal, and a place the register doesn't know yet enters
  on its name alone. At your third kept cup, the numbers arrive.
- **Save** waits under **Want to go** — one list, a save from anywhere lands
  there. The Record orders it by match and, when a save sits unvisited a couple
  of weeks, asks once whether to let it go. Letting go is not a skip — no mark
  against the place.
- **Skip** steps a place back for two weeks, then fades on its own — never a
  veto. At the moment you skip, one question: the place, or its kind? "Fewer
  like it" tips the place's kind (its first tag) down on the same fading curve.
  Every standing skip and lean is visible on the Record, each with a "clear
  now".

## Café cups

Your cafés live as pages off the Atlas — a passport of every shop you log — your average, visit count, usual order, and spend, favorites first. Logging stays minimal by default: a shop, a style, and one tap on the scale is a whole record. Everything else — beans, price, the order-again verdict, traceability — waits behind one line, to add now or later.

- **Every cup is editable.** Open a cup from the record and revise it — fill in what you didn't have time for at the counter. It keeps its original place and hour; only the details change. Bags and brews edit the same way (correct a dose or a time, and the cup a brew carries stays put), and any of them can be set down instead — see *Correcting the record* above.
- **Each café wears its own colours.** Give a café its website and CARTA reads its colours straight from the brand — the logo and the palette around it — and builds a whole surface from that one signature colour: the café's page and every cup logged there take on the palette. A small design system, held in light and dusk alike. Only the palette is kept, never a hotlinked image, so the record stays offline and yours.
- **A banner drawn from that same colour.** The café's own page opens on a gradient built from its hue — a neutral roast tone while the café is still unbranded. Just the name, on its own colour; nothing fetched, nothing photographed.
- **One read fills the rest.** The same website read pulls more than colour — the site's own description becomes the café's line, the name it states is surfaced, and the map lookup opens on its address — so you retype nothing the site already knows. It fills only what's still blank, and offline you fill it in by hand.
- **Pin it on the map.** Look up a café's address online and open it in Maps from its page. Typing the address by hand always works; the lookup is a convenience, not a requirement, and the app stays fully offline without it.
- **A locator on the page.** A pinned café's page carries a small street map of where it stands. Only the pin wears the café's colour — the streets around it stay neutral, and a café with no colour worth borrowing keeps the ember. Offline the pin holds the frame alone.
- **The neighborhood, named.** The map lookup names a neighborhood along with the pin — filled in automatically when it knows one, blanks only, typed always wins. It rides next to the city everywhere a café is shown.
- **Tag a place your own way.** A short list of tags — however you'd describe it to a friend — rides on the café's page and joins the pooled search in Find, so "patio" or "quiet" turns up every place you've marked that way.
- **The beans, read from the roaster.** Give a café cup the roaster's website and CARTA reads its brand the same way a café or a bag does — the roaster it states and a line fill what's blank, and the cup carries the colours it read. Less to type at the counter.
- **Traceability, aligned to your bags.** A café cup can carry the same fields a bag does — country, region, producer, variety, lot, process — tucked behind one optional tap. Bags gained a lot number too, so a café cup and the bag on your shelf finally line up. The loose origin line — the quick "Ethiopia / blend" you jot when there's no lot to spell out — rests on the green behind the cup as well, so a café cup reads its origin from one place, exactly as typed.
- **A printed lot code, when there is one.** A bag or a café cup can also carry a hard identifier some coffees print — a Kenya outturn, a competition-auction lot, an ICO mark. When two records carry the same code, they land on one green outright, even where the words alone read a little differently — the surest way to say "the same green, in another hand." A code that isn't an identity — a bare grade, a warehouse reference, a per-sale lot number — is turned away with a word on why, and whatever you enter only ever adds to the green, never erased.
- **Joined or set apart by hand.** A green's page can be corrected. Two greens you've learned are one — join them, and every roast, pour and record on both follows onto the kept green, nothing lost. A conflation you've learned is two — split it back apart, and both greens stand. A string that merely reads alike never joins on its own; a join needs a shared code or a matching origin, and every correction can be undone.
- **Kenya's outturn, as it works.** One cherry, graded into sibling export lots: AA and AB of a single outturn stand as siblings under one processing batch. A bag that names only the outturn rests on the batch until its grade surfaces, then splits to its sibling — without re-entering the code.
- **Charting the atlas by hand.** Under **the Desk → Add to the atlas → The chart** you can author the record directly — a roaster, a green and a roast onto the atlas without logging a cup you had. Every green you author runs the same resolver a bag does, so sure ones fold onto a green already charted and look-alikes land in a quiet **review queue** — never a nag, empty when there's nothing to settle. Work each with one tap: confirm the one that's truly the same green, and the rest stay honestly apart, or keep them all apart, the safe call. The chart shows its own progress, and the page nothing else can render: one washing station, more than one roaster's reading of it.
- **Every node a page, drilling into the next.** A green's page is no longer a dead end past its roasts. Its grower, each of its roasters, and every venue that pours it are taps now — walk from a green to the washing station behind it, to a roaster and every other green that hand has touched, to a café and what else it pours. A grower opens onto the greens traced to it — a washing station reads as the terminal node it is, its greens each their own lot, never one blurred farm. A roaster opens onto every green it's touched, with the offering and level it gave each. Nothing is a dead end, and a stranger can walk **the Desk → Add to the atlas** read-only, without the pen. Each page still says how far its green resolves and how sure its identity is — a lens, never a rank.
- **The atlas, drawn in two frames.** One projection cannot hold a front door and a country, so the map no longer tries. The **chart frame** is the ground you can walk — roasters and bars, streets behind, the road drawn between them. **Where the green came from** keeps its own frame: origins at region or country grain, drawn hollow and dashed for coarse, joined to the chart in words — *Yirgacheffe, Ethiopia, four hands in Los Angeles* — never a line across the sea. A **scene** is a cluster of roasters and bars close enough for one outing, derived from the pins; a **chart** is one or more scenes under a name you give it, and both correct themselves the moment a pin does. Tap a scene mark to walk in; lenses narrow by scene or kind and always say what they hid. Every mark taps into its page, a stranger reads the whole scene read-only, and coordinates stay honest: a venue at its real point, a roaster at its city, a green at its region — never a farm-precise pin invented, and a node with no coordinate lists by name rather than lies. The streets are an enhancement: the drawn plot renders first from saved positions and stands alone offline, the whole scene working — pins, taps, lines — with no tiles at all. Author a roast online and its city and origin place themselves; a wrong pin is no longer forever — correct it from the roaster's or grower's page, candidates offered, never guessed between.
- **The standing.** A green's page can now carry its rarity and its caliber — how scarce it is, how it has cupped — read beside how far its identity traces. Three independent facts, never merged into a verdict: none of this is your taste, which stays yours on your own cup. A cup score counts only once it names where it came from — a competition, an auction, a named cupper or lab, or your own signed cupping — and an unnamed score still saves, honestly, as a claim: "roaster-stated 92 — unverified," never printed as the read. Rarity reads the same way: a disclosed lot size, an auction price, a scarce varietal, how few hands carry it — sourced facts, never a guess. An unrated, ordinary lot still reads as a complete record; the standing is there to find, never a rank forced onto every green.
- **How far a green traces, told truly.** Every green states how finely its origin is proven, on one ladder of five: **country · region · washing station · farm · green lot**. A green rests on the coarsest rung its record can actually prove and no finer — a washing station reads as a washing station, not as a lot; a name CARTA can't tell from a mill buys no rung at all, because guessing is the same lie as inventing. The name is still on the page; it simply doesn't claim a parcel it can't. The harvest is its own fact beside the ladder, not a rung on it — and it's what keeps one crop year from folding into the next.
- **Home vs café.** When you've had the same beans at home, the café cup says so — your average out against your average in. The shape of how a preference travels, not a verdict.

The café screen and the brew screen are deliberately the same shape: **Coffee → Preparation → Cup.** Both end in a hedonic 1–9 and what you found, so a cup out and a cup in are comparable.

## The Register — one entry per café

Cafés get named by many people, on many devices. The **Register** keeps a single
canonical entry for each one — *Jane's Fighting Ships*, for cafés. It is the
single source of truth for a café's identity: name, city, neighborhood, website,
address and map pin, the palette derived from that website, a line for the
record, and the tags you've given it.

- **Shared, not per-user.** Every user of the device reads the same Register,
  and a sync server extends it to every keeper on the server (`/api/cafes`). A
  café looks the same from user to user — same colours, same pin.
- **Compiled from sightings.** Naming a shop on any café cup enters it into the
  Register; a sighting fills blanks and never erases, so a fast log can't strip
  a rich entry. Everything already on the device's ledgers is seeded in
  automatically.
- **Anyone can amend, provenance is kept.** At this early stage every
  contributor may edit an entry ("Amend the entry" on the café's page). The
  entry remembers who entered it first and who amended it last.
- **An entry can be struck, never deleted.** "Correct the Register entry" on a
  café's page withdraws it from the shared record — the fix for a phantom café a
  typo'd shop name minted. The entry keeps its provenance and every sighting on
  it, waits under **the Desk → What you set down**, and any hand holding the pen
  can stand it back up. Your own cups there stay on your own record either way:
  a cup is yours, the entry is everyone's.
- **Lookup and discovery.** The café cup form looks the shop up against the
  Register as you type — "A known place — Halfpence, Portland, first entered by
  Jane." Find surfaces Register entries you haven't been to, ranked as
  recommendations (below). In search of better cups, the consistent record of
  the place is the map.

Cups stay personal, per ledger. Only the place is common knowledge.

### The reach, set down

Older versions carried a second classification of café depth — ○ Counter ·
◎ House · ◉ Roastery · ● Origin, compiled from signed sightings. It is set
down: it applied to one kind of page, was attested rather than read from the
record, and the road now answers the same question everywhere — the Roasted
station names the hand, the Grown station names the grower, and a road that
runs short says so. **The sightings themselves are not gone**: every line a
keeper signed stays on its Register entry, signed and dated, carried through
sync — unread and unrendered for now, never erased.

Not everyone wants to keep a record. Some people just want to know where to go
and what to order. The **Find** tab is for them — the room every record starts
in, and it requires logging nothing, ever. It pools every record the active user
can read — other keepers on this device, everyone on a connected sync server —
plus the shared Register, and turns them into a discovery loop: *search → near
you → whose taste matches yours → worth the walk → save it → go.*

- **Search** — one field over the whole pooled record. Type a café, a city, a
  roaster, an origin, a descriptor, a tag or a note and matching **places**,
  **beans** and **cups** surface at once. Pinned results also plot on a small
  map alongside the list — a filled dot for a place you keep, a dashed one for
  a place you haven't yet. Online, the plot gains real streets behind the dots
  (OpenStreetMap, restyled to CARTA — no key, no tracking); offline it stays
  the drawn plot from the record's own coordinates, and nothing is missed but
  the street names.
- **Near you** — say where you are (optional; asked only when you tap it, and
  kept on the device — never stored or synced) and the pinned cafés your people
  kept sort by distance, closest first, each showing how far.
- **Worth the walk, for you** — cafés you haven't kept, ranked by your circle's
  scores and weighted toward the people whose taste runs closest to yours; the
  card says who rated it and why. A city filter or the "near you" lens re-scopes
  the list.
- **Whose taste matches yours** — on the cafés you've both scored, how close your
  scores land on the 1–9 scale. The shape of an agreement, not a verdict —
  read the people who walk your streets.
- **The stream** — every café cup your people have logged, newest first (scoped
  to the active city lens): who, where, what they ordered, the score, their
  words, and the beans' colours when they read them. Tap a cup for the full card,
  including the address and an Open in Maps link when someone has pinned it.
- **Beans worth chasing** — the roasters and origins your circle scored, best
  average first.
- **Want to go** — save any place from anyone's record to a shortlist that waits
  under Find and on the Café tab, and steps aside once you've logged a cup
  there. (The one thing Find writes to your own ledger; it syncs like the
  rest.)
- **How to read a cup** — a plain-words primer that decodes the hedonic 1–9
  scale, the again/pass verdict, and the descriptors for readers who don't keep
  a ledger of their own.

The stream refreshes quietly from the server when the tab is open and falls back
to cached copies offline. Discovery is read-only — look, don't touch — and any
cup links through to the friend's whole record via the existing read-only view.

## Multiple Users

CARTA supports multiple keepers on one device. Manage them under **the Desk → Keepers on this device**:

- **Add a keeper** — each keeps a fully separate ledger (setups, bags, brews, cups, cafés)
- **Switch** the active keeper — everything you log goes to the active ledger
- **Read another keeper's record** — browse every room in a clearly-marked read-only mode; a banner offers "Back to mine"
- **Import as a new keeper** — a friend's exported ledger file can be imported beside your own without touching yours

Existing single-user data migrates automatically on first launch — nothing to do, nothing lost. Everything lives in this browser's local storage; syncing between devices is optional (below).

## The founder's pen (temporary)

While the atlas settles, the **shared** record — the atlas (roasters, greens,
roasts) and the café Register — is written by one hand: the founder's. What
this means in practice:

- **Everyone reads everything.** The chart, every page, the Register — all of
  it stays open to every keeper.
- **Everyone writes their own ledger, always.** Bags, brews, cups, setups,
  cafés you've been to, your preferences — none of that is gated.
- **Only the founder writes the shared page.** On a sync server, the first
  account registered holds the pen and the server refuses any other. On a
  single device, the pen is taken up once under **the Desk → The pen**.
- **The founder's desk** (the Desk → The pen → Open the founder's desk) is the one
  door for entering shared facts cleanly: add a roaster, author a roast, enter
  a café's canonical entry, propose a sighting, settle the review queue.

This is a stage, not a law: when the proposed→stood moderation ceremony ships,
proposals stand for every keeper again. A few pre-redesign surfaces (the
matching's discover map and cold-start, the circle stream, taste affinity) are
shuttered for the same season — hidden, not removed.

## Server Sync (optional)

CARTA can synchronize ledgers through a tiny self-hosted server, so your record follows you across devices and everyone on the server can **view** (never edit) each other's ledgers — live, from **the Desk → Keepers on this device**.

- Run the server: `node server/server.js` — one file, zero dependencies, JSON storage. Or skip the hardware entirely: the same server deploys serverless to Cloudflare's free plan with one command. See **[server/README.md](server/README.md)** for deployment, the HTTPS requirement, and the API.
- Connect from the app: **the Desk → Sync → Connect to a sync server** (server URL, name, passcode).
- Offline-first: with no server configured or reachable, nothing changes. Edits queue and sync when the app comes back to the foreground.
- Conflicts merge by record — logging on two devices keeps both entries; a record set down on one device leaves every device, and putting it back puts it back everywhere (the strike and the restore are both dated additions, so the two sides converge in any order). Erased records stay erased (tombstones).
- Viewed ledgers are cached locally, so a friend's record remains browsable while offline (marked as a cached copy).

## What's Included

- **index.html** — The complete app (self-contained, no build required)
- **fonts/** — Self-hosted typefaces (Spectral, Libre Franklin; woff2)
- **manifest.json** — PWA metadata for homescreen installation
- **icon-192.svg** & **icon-512.svg** — App icons
- **README.md** — This file
- **docs/** — The design record: the voice standard (`VOICE.md`), the product
  thesis (`NORTH_STAR.md`), the atlas vision, the resolver and schema specs,
  the redesign prototype (`redesign-concept/`) and the design system copy

## Hosted on GitHub Pages

This app is deployed at:
```
https://YOUR-USERNAME.github.io/carta/
```

Replace `YOUR-USERNAME` with your actual GitHub username.

## Installation on iPhone

1. Open Safari on your iPhone
2. Navigate to the URL above
3. Tap the Share button (↗️ in bottom toolbar)
4. Select **Add to Home Screen**
5. Choose a name (CARTA is fine) and tap Add

The app now appears as an icon on your home screen. Tap it to open in fullscreen.

## Export Your Data (IMPORTANT)

Everything is stored locally in your browser. **Export monthly** from **the Desk →
The record leaves with you**. Two copies live there: **Export the ledger** — a
self-contained page on CARTA paper stock, your overlay only, with the
machine-readable record (`carta.ledger/v1`) embedded, which also **reads back
in** ("Bring a ledger back" — read to you, never merged); and **the working
copy** — JSON, everything, the one to keep as a backup. Keep backups safe. Each keeper exports their own ledger (exports are stamped with the keeper's name). A copy is self-contained: it carries the catalog alongside the ledger, so it reads every roaster, origin and roast in full even on a device that never synced. Bringing a copy back in folds that catalog into the device's own.

If you clear browser data or Safari storage fills up, your ledger is gone — there is no server.

## Files Explained

| File | Purpose |
|------|---------|
| index.html | The app itself. All CSS and JavaScript included. |
| manifest.json | Tells iOS this is a standalone app. Enables homescreen install. |
| icon-192.svg, icon-512.svg | App icons shown on homescreen and in settings. |
| README.md | Documentation (this file). |

## Customization

- **Change the app name**: Edit `"short_name"` in manifest.json (max 12 characters for homescreen)
- **Change the icon**: Replace icon-192.svg and icon-512.svg with your own images
- **Change the theme color**: Edit `"theme_color"` in manifest.json

## Troubleshooting

**Icon doesn't appear on homescreen?**
- Make sure you're using HTTPS (GitHub Pages is always HTTPS)
- Try waiting 30 seconds after adding
- Refresh the page and try again

**Data disappeared?**
- Check if you accidentally opened in a Private window (data is separate)
- If you cleared Safari data, check if you have a backup from an earlier export

**Changes not showing?**
- Reload the page with Cmd+R (or force reload: Cmd+Shift+R on desktop)
- On iPhone, swipe down and release to refresh

## Technical

- No build step, no bundled dependencies — one self-contained file
- Runs entirely in the browser
- Uses localStorage for persistence
- Street maps are an optional, keyless enhancement (MapLibre GL +
  OpenFreeMap / OpenStreetMap, loaded only when online); the app is complete
  without them
- 100% open source

---

Made with ☕ for people who actually like keeping records.
