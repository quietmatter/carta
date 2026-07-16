# CARTA Coffee Ledger

A personal memory of coffee at home and in cafés.

**One cup. Two contexts. Your taste is the through-line.**

CARTA gives equal weight to the cup you make and the cup you are served. Home is
measured, adjusted, and made again. Café is received, experienced, and returned to.
Both end in the same honest record of what was in the cup and whether it was worth
finding again.

The primary experience is deliberately only three places:

- **Home** — resume the coffee in hand from the last cup.
- **Café** — remember the last cup out and the places worth returning to.
- **Record** — see one preference across both contexts.

See [NORTH_STAR.md](NORTH_STAR.md) for the product thesis and restraint standard.

## Logging a brew

The brew screen opens as your last brew — turn the one dial you actually changed. Each numeric dial can be driven three ways:

- **Tap − / +** for one step.
- **Press and hold** − or + to accelerate across a wide range (fly through a 0–2000 grinder, ease off for the fine end).
- **Tap the number** to type an exact value on the numeric keypad — time accepts `m:ss`.

Give each **Setup** its grinder's real **grind scale** (min / max / step — e.g. a Lido OG is 0–2000, step 5) and that Setup's grind dial moves the way the grinder does. Grind is only ever comparable within one Setup.

Temperature has a **°C / °F** switch right on the dial (whole-degree steps), remembered per user and stored canonically as °C so the record stays comparable.

If you time and weigh on your machine or a Bluetooth scale (e.g. the Argos app), hide CARTA's stopwatch in **Ledger → Preferences** and simply type the time and weight in. CARTA keeps the record; it doesn't need to be the timer.

## Appearance

CARTA reads like a printed record: a serif for what you tasted, a sans for what you measured, and one ember-red signal for the current action and the cup’s score. Two themes — **Paper** and **Dusk** — switch under **More → Preferences**, remembered per user. The typefaces (Spectral and Libre Franklin) are served from the app's own `fonts/` directory, so nothing loads from a third party.

## Café cups

The **Cafés** tab is a passport of every shop you log — your average, visit count, usual order, and spend, favorites first. Logging stays fast by default: a shop and one tap on the scale is a whole record. Add as much as the cup deserves.

- **Each café gets its own page.** Photograph the branding — the sign, the cup, the storefront — and a colour read from that photo is kept with the record.
- **Pin it on the map.** Look up a café's address online and open it in Maps from its page. Typing the address by hand always works; the lookup is a convenience, not a requirement, and the app stays fully offline without it.
- **Traceability, aligned to your bags.** A café cup can carry the same fields a bag does — country, region, producer, variety, lot, process — tucked behind one optional tap. Bags gained a lot number too, so a café cup and the bag on your shelf finally line up.
- **Home vs café.** When you've had the same beans at home, the café cup says so — your average out against your average in. The shape of how a preference travels, not a verdict.

The café screen and the brew screen are deliberately the same shape: **Coffee → Preparation → Cup.** Both end in a hedonic 1–9 and what you found, so a cup out and a cup in are comparable.

## Multiple Users

CARTA supports multiple users on one device. Manage them from the **Ledger** tab:

- **Add a user** — each user keeps a fully separate ledger (setups, bags, brews, cups, cafés)
- **Switch** the active user — everything you log goes to the active user's ledger
- **View another user's ledger** — browse every tab of their record in a clearly-marked read-only mode; a banner offers "Back to mine"
- **Import as a new user** — a friend's exported ledger file can be imported as a new user, so you can browse their record beside your own without touching yours

Existing single-user data migrates automatically on first launch — nothing to do, nothing lost. Everything lives in this browser's local storage; syncing between devices is optional (below).

## Server Sync (optional)

CARTA can synchronize ledgers through a tiny self-hosted server, so your record follows you across devices and everyone on the server can **view** (never edit) each other's ledgers — live, from the Users list in the Ledger tab.

- Run the server: `node server/server.js` — one file, zero dependencies, JSON storage. See **[server/README.md](server/README.md)** for deployment, the HTTPS requirement, and the API.
- Connect from the app: Ledger tab → Sync → **Connect to a sync server** (server URL, name, passcode).
- Offline-first: with no server configured or reachable, nothing changes. Edits queue and sync when the app comes back to the foreground.
- Conflicts merge by record — logging on two devices keeps both entries; removed cups stay removed (tombstones).
- Viewed ledgers are cached locally, so a friend's record remains browsable while offline (marked as a cached copy).

## What's Included

- **index.html** — The complete app (self-contained, no build required)
- **fonts/** — Self-hosted typefaces (Spectral, Libre Franklin; woff2)
- **manifest.json** — PWA metadata for homescreen installation
- **icon-192.svg** & **icon-512.svg** — App icons
- **README.md** — This file
- **VOICE.md** — The brand voice standard the app's copy is held to

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

Everything is stored locally in your browser. **Export monthly** using the Ledger tab → Export button. Keep backups safe. Each user exports their own ledger (exports are stamped with the user's name).

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

- No external dependencies
- Runs entirely in the browser
- Uses localStorage for persistence
- 100% open source

---

Made with ☕ for people who actually like keeping records.
