# CARTA Sync Server

A tiny, zero-dependency Node.js server that lets multiple people sync their CARTA ledgers and view each other's records across devices. One file, JSON storage on disk, no database, no npm install.

```
node server/server.js
```

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
