# CARTA Sync Server

A tiny, zero-dependency Node.js server that lets multiple people sync their CARTA ledgers and view each other's records across devices. One file, JSON storage on disk, no database, no npm install.

```
node server/server.js
```

Node 18+ (no `npm install` — there are no dependencies). From `server/` you can also use `npm start` and `npm test`.

## Deploy

The server speaks plain HTTP; the [HTTPS requirement](#️-https-required-read-this-first) below means you either pick a host that terminates TLS for you (fly.io) or put a TLS proxy in front (Caddy/nginx). Pick one:

| Target | Files | Quickstart |
|---|---|---|
| **fly.io** (TLS included) | `fly.toml`, `Dockerfile` | `fly launch --no-deploy --copy-config` → `fly volumes create carta_data --size 1` → `fly deploy`. URL: `https://<app>.fly.dev` |
| **Mac laptop + Tailscale** | `com.carta.sync.plist.example` | Auto-start with launchd + `tailscale funnel` for HTTPS — see [below](#run-on-a-mac-laptop-tailscale). Great for a small, trusted group when you're OK with the server going offline while the laptop sleeps |
| **Docker / any VPS** | `Dockerfile`, `docker-compose.yml` | `docker compose up -d` (serves `:8787`; add a TLS proxy) |
| **Bare VPS + systemd** | `carta-sync.service.example`, `Caddyfile.example` | Install the unit + point Caddy at `localhost:8787` — steps are in each file's header |
| **Caddy proxy** | `Caddyfile.example` | `caddy reverse-proxy --from sync.example.com --to localhost:8787` |

Each config file's header comments carry the full step-by-step. Whichever you use, the data directory (`CARTA_DATA`) must be on **persistent storage** — a Docker/fly volume, or a real path on a VPS — or ledgers vanish on restart.

Once it's reachable over https, connect from the app: **Ledger → Sync → Connect to a sync server** and paste the URL.

## Run on a Mac laptop (Tailscale)

For a small, trusted group, you can host the server on your own Mac. The app is offline-first, so it's fine that the server disappears when the laptop sleeps — clients keep working locally and sync when it's back. [Tailscale](https://tailscale.com/) gives you the required HTTPS **and a stable hostname** that doesn't change when the laptop moves networks (don't use free ngrok — its URL changes every restart, and every device has to be reconfigured).

**1. Get the code and confirm Node 18+:**
```bash
git clone https://github.com/quietmatter/carta.git ~/carta
node --version        # need v18+; install with `brew install node` if missing
mkdir -p ~/carta-data # where ledgers + logs live — back this folder up
```

**2. Install Tailscale** ([download](https://tailscale.com/download/mac)), sign in, then expose the server over HTTPS:
```bash
tailscale funnel --bg 8787     # public HTTPS; --bg persists across reboots
tailscale funnel status        # shows your URL: https://<your-mac>.<tailnet>.ts.net
```
Prefer to keep it private to your own devices instead of the public internet? Use `tailscale serve --bg 8787` — but then every user's phone must also install Tailscale and join your tailnet.

Because `funnel` is public, gate sign-ups with a shared code so strangers who find the URL can't register — set `CARTA_REGISTER_CODE` (see [Gating sign-ups](#gating-sign-ups-with-a-registration-code)) and add it to the launchd plist's `EnvironmentVariables`.

**3. Auto-start the server with launchd** so it comes back after reboots and crashes:
```bash
cp ~/carta/server/com.carta.sync.plist.example ~/Library/LaunchAgents/com.carta.sync.plist
# Edit that copy: replace YOUR_USERNAME, and set the node path from `which node`
launchctl load ~/Library/LaunchAgents/com.carta.sync.plist
curl http://localhost:8787/health     # {"ok":true,...}
```
To stop it: `launchctl unload ~/Library/LaunchAgents/com.carta.sync.plist`. To apply edits, unload then load again. Logs: `tail -f ~/carta-data/server.log`.

**4. Connect the app:** paste your `https://<your-mac>.<tailnet>.ts.net` URL into **Ledger → Sync → Connect to a sync server**.

**Notes for laptop hosting**
- The server pauses whenever the Mac sleeps and resumes on wake — expected, and clients tolerate it. To keep serving while the lid is closed and on power, run it under `caffeinate -s` or adjust Energy Saver.
- Your data is `~/carta-data` — plain JSON. Copy it (or keep it in iCloud/Dropbox) for backups; a copy taken while idle is complete.
- No `fly.toml`, Docker, or port-forwarding needed for this path — Tailscale handles reachability and TLS.

## ⚠️ HTTPS required (read this first)

The CARTA app is served over **https** (e.g. GitHub Pages). Browsers block an https page from calling an `http://` server ("mixed content"), so **the sync server must be reachable over https** — put it behind any TLS proxy:

- [Caddy](https://caddyserver.com/) — `caddy reverse-proxy --from sync.example.com --to localhost:8787` (automatic certificates)
- nginx + Let's Encrypt
- [Tailscale Funnel / Serve](https://tailscale.com/kb/1223/funnel) — `tailscale funnel 8787`
- Hosts like fly.io or a VPS with the proxy of your choice

The one exception: `http://localhost` is allowed by browsers, so local development works without TLS.

## Configuration

| Env var | Default | Meaning |
|---|---|---|
| `PORT` | `8787` | Listen port |
| `CARTA_DATA` | `./data` | Data directory (created if missing) |
| `CARTA_MAX_BODY` | `20971520` (20 MB) | Max request body — ledgers embed photos as base64 |
| `CARTA_REGISTER_CODE` | _(unset)_ | If set, new sign-ups must supply this shared code. Unset = open registration. See [Auth model](#auth-model--trust-your-friends) |

## Data layout

```
data/
  users.json           accounts (scrypt-hashed passcodes) + session tokens
  ledgers/<id>.json    one file per user: {rev, updatedAt, ledger}
```

Everything is plain JSON. **Back up the data directory** — copying it while the server is idle is a complete backup. Writes are atomic (temp file + rename), so a crash never leaves a half-written ledger.

## Auth model — trust your friends

- Register with a **name + passcode** (passcodes are scrypt-hashed with per-user salts; login is timing-safe and rate-limited).
- Every authenticated user can **read** every ledger — seeing each other's records is the point.
- Only the owner can **write** their own ledger.
- Tokens don't expire. To revoke a device, delete its token from `users.json` (server restart not required for ledgers, but token changes are read from memory — restart after editing the file).

This is deliberately simple, built for a household or a group of friends — not a hardened public service. Don't run it on the open internet for strangers.

### Gating sign-ups with a registration code

By default anyone who can reach the server can create an account — fine on a private network, but a concern when the server is exposed publicly (e.g. Tailscale Funnel). Set `CARTA_REGISTER_CODE` to a shared secret and new sign-ups must enter it:

```
CARTA_REGISTER_CODE='our-shared-code' node server/server.js
```

The app shows an **Invite code** field on the sign-up screen; existing users' logins are unaffected. The code is checked before anything else, so a caller without it can't even probe which names are taken, and the comparison is constant-time. Hand the code to people out-of-band; change it any time by restarting with a new value.

## API

All bodies are JSON. Errors are `{error: "<code>", message}`. Authenticated endpoints take `Authorization: Bearer <token>`. CORS is open (`*`) — data is protected by auth, not origin.

| Method | Path | Auth | Body | Success | Errors |
|---|---|---|---|---|---|
| GET | `/health` | — | — | 200 `{ok, users, uptime}` — liveness probe | — |
| POST | `/api/register` | — | `{name, passcode, registerCode?}` | 201 `{token, userId, name}` | 400, 403 bad-register-code, 409 name-taken, 429 |
| POST | `/api/login` | — | `{name, passcode}` | 200 `{token, userId, name}` | 401, 429 |
| GET | `/api/users` | ✓ | — | 200 `{users:[{id, name, rev, updatedAt, counts}]}` | 401 |
| GET | `/api/ledgers/:id` | ✓ | — | 200 `{rev, updatedAt, ledger}` (rev 0, ledger null if never pushed) | 401, 404 |
| GET | `/api/ledgers/:id?meta=1` | ✓ | — | 200 `{rev, updatedAt}` — cheap change poll | 401, 404 |
| PUT | `/api/ledgers/:id` | owner | `{baseRev, ledger}` | 200 `{rev, updatedAt}` | 401, 403, 400, 409 conflict (carries current `{rev, updatedAt, ledger}`), 413 |

### Sync protocol

The client keeps the last server revision it saw. To sync it polls `?meta=1`; if the server rev is newer it pulls and merges (union by record id). To push it sends `PUT {baseRev, ledger}` — if `baseRev` doesn't match the server's current rev the push is rejected with **409** carrying the server's copy, the client merges and retries. Revisions only ever increment.

## Tests

```
node server/test.js
```

Zero-dependency test script — spawns the server on an ephemeral port with a temp data dir and exercises the full endpoint/authorization/conflict matrix.
