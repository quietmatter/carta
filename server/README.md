# CARTA Sync Server

A tiny, zero-dependency Node.js server that lets multiple people sync their CARTA ledgers and view each other's records across devices. One file, JSON storage on disk, no database, no npm install.

```
node server/server.js
```

Node 18+ (no `npm install` — there are no dependencies). From `server/` you can also use `npm start` and `npm test`.

Prefer not to run a machine at all? The same server exists as a serverless port for Cloudflare's free plan — `worker.mjs`, one `npx wrangler deploy`, no hardware, no files, HTTPS included. See [Run on Cloudflare Workers](#run-on-cloudflare-workers-free-serverless).

## Deploy

The server speaks plain HTTP; the [HTTPS requirement](#️-https-required-read-this-first) below means you either pick a host that terminates TLS for you (fly.io) or put a TLS proxy in front (Caddy/nginx). Pick one:

| Target | Files | Quickstart |
|---|---|---|
| **Cloudflare Workers** (free, serverless, TLS included) | `worker.mjs`, `wrangler.toml` | `cd server && npx wrangler deploy` — see [below](#run-on-cloudflare-workers-free-serverless). URL: `https://carta-sync.<subdomain>.workers.dev` |
| **fly.io** (TLS included) | `fly.toml`, `Dockerfile` | `fly launch --no-deploy --copy-config` → `fly volumes create carta_data --size 1` → `fly deploy`. URL: `https://<app>.fly.dev` |
| **Mac laptop + Tailscale** | `com.carta.sync.plist.example` | Auto-start with launchd + `tailscale funnel` for HTTPS — see [below](#run-on-a-mac-laptop-tailscale). Great for a small, trusted group when you're OK with the server going offline while the laptop sleeps |
| **Docker / any VPS** | `Dockerfile`, `docker-compose.yml` | `docker compose up -d` (serves `:8787`; add a TLS proxy) |
| **Bare VPS + systemd** | `carta-sync.service.example`, `Caddyfile.example` | Install the unit + point Caddy at `localhost:8787` — steps are in each file's header |
| **Caddy proxy** | `Caddyfile.example` | `caddy reverse-proxy --from sync.example.com --to localhost:8787` |

Each config file's header comments carry the full step-by-step. Whichever you use, the data directory (`CARTA_DATA`) must be on **persistent storage** — a Docker/fly volume, or a real path on a VPS — or ledgers vanish on restart.

Once it's reachable over https, connect from the app: **Ledger → Sync → Connect to a sync server** and paste the URL.

## Run on Cloudflare Workers (free, serverless)

The lightest way to get the server off your own hardware. `server/worker.mjs` is a port of `server.js` — same API, same auth, same sync protocol — that runs as a Cloudflare Worker with all data in one strongly-consistent [Durable Object](https://developers.cloudflare.com/durable-objects/). Free plan, always on, HTTPS included, no machine to keep awake, no volume to provision, no OS to patch.

**1. Deploy** — needs Node 18+ and a free [Cloudflare account](https://dash.cloudflare.com/sign-up). Nothing is installed into the repo; `wrangler` runs via `npx`:

```bash
cd server
npx wrangler deploy        # first run opens a browser to sign in
```

The deploy prints your URL: `https://carta-sync.<your-subdomain>.workers.dev`.

**2. Gate sign-ups.** The URL is public, so set a registration code (stored as an encrypted secret, applied on the next request — no redeploy needed):

```bash
npx wrangler secret put CARTA_REGISTER_CODE
```

**3. Connect the app:** paste the URL into **Ledger → Sync → Connect to a sync server**. Hand the code to your people out-of-band; each registers a name + passcode as usual.

**Notes for the Workers deployment**

- **Storage** is a SQLite-backed Durable Object, not files — the free plan allows 1 GB for it, which holds a great many ledgers even with photos. There is no data directory; the "backup" is the app itself (offline-first — every device holds its user's full record, and **Ledger → Export** produces the canonical JSON).
- **Moving from another server** (the laptop, fly.io): connect each device to the new URL and register again. Local data is the source of truth, so the first sync pushes everything back up. Accounts and tokens don't carry over.
- **Config** maps from env vars to wrangler: `CARTA_REGISTER_CODE` is a secret (above); `CARTA_MAX_BODY` is a `[vars]` entry in `wrangler.toml`; `PORT` and `CARTA_DATA` don't apply.
- **Consistency** is preserved: the single Durable Object serializes every request, so the rev/409 protocol works exactly as it does on the Node server. Ledgers larger than the object store's 2 MB value cap are chunked transparently.
- To take it down: `npx wrangler delete`.

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

These apply to the Node server (`server.js`). For the Workers deployment, `CARTA_REGISTER_CODE` becomes a wrangler secret and `CARTA_MAX_BODY` a `[vars]` entry — see [above](#run-on-cloudflare-workers-free-serverless).

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
  register.json        the shared café Register: {rev, updatedAt, register}
```

Everything is plain JSON. **Back up the data directory** — copying it while the server is idle is a complete backup. Writes are atomic (temp file + rename), so a crash never leaves a half-written ledger.

## Auth model — trust your friends

- Register with a **name + passcode** (passcodes are scrypt-hashed with per-user salts; login is timing-safe and rate-limited).
- Every authenticated user can **read** every ledger — seeing each other's records is the point.
- Only the owner can **write** their own ledger.
- The **café Register** (`/api/cafes`) and the **catalog** (`/api/catalog/:kind` — the spine of producers, lots, roasters, roasts and the rest, upstream of the café) are the shared documents: every authenticated user can read *and* write them, so the group keeps a single record of each café and each node of the road. At this early stage all contributors are trusted to amend them.
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
| GET | `/api/cafes` | ✓ | — | 200 `{rev, updatedAt, register}` — the shared café Register (rev 0, register null if never pushed) | 401 |
| GET | `/api/cafes?meta=1` | ✓ | — | 200 `{rev, updatedAt}` — cheap change poll | 401 |
| PUT | `/api/cafes` | ✓ any user | `{baseRev, register}` (`register.entries` array required) | 200 `{rev, updatedAt}` | 401, 400, 409 conflict (carries current `{rev, updatedAt, register}`), 413 |
| GET | `/api/catalog/:kind` | ✓ | — | 200 `{rev, updatedAt, catalog}` — a shared spine document (rev 0, catalog null if never pushed) | 401, 404 unknown kind |
| GET | `/api/catalog/:kind?meta=1` | ✓ | — | 200 `{rev, updatedAt}` — cheap change poll | 401, 404 |
| PUT | `/api/catalog/:kind` | ✓ any user | `{baseRev, catalog}` (`catalog.entries` array required) | 200 `{rev, updatedAt}` | 401, 400, 409 conflict (carries current `{rev, updatedAt, catalog}`), 413 |

`:kind` is one of `producers`, `processors`, `aggregators`, `lots`, `blends`, `roasters`, `roasts`, `gear` — the entity spine upstream of the café. Each kind is an independent document with its own revision; any other kind is **404**.

### Sync protocol

The client keeps the last server revision it saw. To sync it polls `?meta=1`; if the server rev is newer it pulls and merges (union by record id). To push it sends `PUT {baseRev, ledger}` — if `baseRev` doesn't match the server's current rev the push is rejected with **409** carrying the server's copy, the client merges and retries. Revisions only ever increment.

The café Register (`/api/cafes`) follows the same protocol with one difference: it's a single shared document rather than per-user, and **any** authenticated user may PUT it. The client merges by entry id, collapses entries that name the same café from different devices, and keeps the earliest provenance (`firstBy`/`firstAt`). Servers older than this endpoint simply 404 it; clients skip it and keep the Register device-local.

The catalog (`/api/catalog/:kind`) is the same shared, group-writable protocol widened to the spine — one document per entity kind, each synced independently. The client merges by entry id and then collapses entries that share a `_key` (the deterministic dedup the client seeds with) but were born on different devices, keeping the earliest provenance. A ledger reference left dangling by a collapse re-points on the next boot through that same `_key`. Older servers 404 the route and every kind stays device-local, exactly as the Register degrades.

## Tests

```
node server/test.js           # the Node server
node server/test-worker.js    # the Workers port
```

Zero-dependency test scripts (`npm test` runs both). `test.js` spawns the server on an ephemeral port with a temp data dir and exercises the full endpoint/authorization/conflict matrix. `test-worker.js` runs the same matrix against `worker.mjs` in plain Node with an in-memory Durable Object storage mock — no wrangler required — plus cases for the chunked large-ledger storage. If you change the API, change both servers and keep both scripts passing.
