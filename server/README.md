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
| **Docker / any VPS** | `Dockerfile`, `docker-compose.yml` | `docker compose up -d` (serves `:8787`; add a TLS proxy) |
| **Bare VPS + systemd** | `carta-sync.service.example`, `Caddyfile.example` | Install the unit + point Caddy at `localhost:8787` — steps are in each file's header |
| **Caddy proxy** | `Caddyfile.example` | `caddy reverse-proxy --from sync.example.com --to localhost:8787` |

Each config file's header comments carry the full step-by-step. Whichever you use, the data directory (`CARTA_DATA`) must be on **persistent storage** — a Docker/fly volume, or a real path on a VPS — or ledgers vanish on restart.

Once it's reachable over https, connect from the app: **Ledger → Sync → Connect to a sync server** and paste the URL.

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

## API

All bodies are JSON. Errors are `{error: "<code>", message}`. Authenticated endpoints take `Authorization: Bearer <token>`. CORS is open (`*`) — data is protected by auth, not origin.

| Method | Path | Auth | Body | Success | Errors |
|---|---|---|---|---|---|
| GET | `/health` | — | — | 200 `{ok, users, uptime}` — liveness probe | — |
| POST | `/api/register` | — | `{name, passcode}` | 201 `{token, userId, name}` | 400, 409 name-taken, 429 |
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
