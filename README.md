# CARTA Coffee Ledger

A beautiful, minimal coffee brewing journal. Track your setups, bags, and brews over time.

## Multiple Users

CARTA supports multiple users on one device. Manage them from the **Ledger** tab:

- **Add a user** — each user keeps a fully separate ledger (setups, bags, brews, cups, cafés)
- **Switch** the active user — everything you log goes to the active user's ledger
- **View another user's ledger** — browse every tab of their record in a clearly-marked read-only mode; a banner offers "Back to mine"
- **Import as a new user** — a friend's exported ledger file can be imported as a new user, so you can browse their record beside your own without touching yours

Existing single-user data migrates automatically on first launch — nothing to do, nothing lost. Everything still lives in this browser's local storage; there is no server and no syncing between devices.

## What's Included

- **index.html** — The complete app (self-contained, no build required)
- **manifest.json** — PWA metadata for homescreen installation
- **icon-192.svg** & **icon-512.svg** — App icons
- **README.md** — This file

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
