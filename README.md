# Flowdoro — Smart Time Management with Proportional Rest (5:1)

Monorepo Bun: Svelte 5 + Vite 6 + Tailwind 4 (web) + Hono 4 + Appwrite Web SDK (Cloudflare Workers API) + Appwrite Cloud (Auth + DB + Storage).

## Deploy

**API:** `apps/api-cloudflare/` — Hono 4 + Appwrite REST via `fetch`. Deploy via `wrangler deploy`.

```bash
bun install
cp .env.example .env                  # isi APPWRITE_* di .env (untuk seed + local dev)
cp .env .dev.vars                     # wrangler dev baca .dev.vars
bun run dev:api                        # :8787 via wrangler (apps/api-cloudflare)
bun run dev:web                        # :5173 vite (proxy /api → :8787)
```

**Web:** Cloudflare Pages (`apps/web/dist`) — build `VITE_API_URL=https://api.flowdoro.3scode.my.id bun run --cwd apps/web build` lalu `wrangler pages deploy apps/web/dist` (atau `bash deploy-web.sh`). Local `VITE_API_URL=http://localhost:8787` (via `vite.config.ts` proxy `/api` → `:8787`).

Atau pakai script: `bash deploy-cf.sh` (API) + `bash deploy-web.sh` (Web).

**DB/Auth/Storage:** Appwrite Cloud (https://cloud.appwrite.io) — Auth = Appwrite Users, DB = database `flowdoro` (collections `profiles`/`tasks`/`sessions`/`session_events`/`lists`), Storage = bucket `avatars`.

Panduan lengkap: `env.md` + `AGENTS.md`.

## Quick Start (Local)

```bash
bun install
cp .env.example .env              # isi APPWRITE_PROJECT_ID + APPWRITE_API_KEY
cp .env .dev.vars                 # untuk wrangler dev
bun run seed:dev                  # demo user + task + session (scripts/seed.mjs)
bun run dev:api   # :8787 (wrangler)
bun run dev:web   # :5173 (proxy /api → :8787)
```

Verifikasi:
```bash
bun run --cwd apps/web build
curl http://localhost:8787/api/health
```

## Workers ENV (Wajib)

Cloudflare Dashboard → **Workers → flowdoro-api → Settings → Variables**:

- Variables: `CORS_ORIGIN=https://flowdoro.3scode.my.id`, `APP_URL=https://flowdoro.3scode.my.id`, `BETTER_AUTH_URL=https://api.flowdoro.3scode.my.id`, `GOOGLE_CLIENT_ID`, `GOOGLE_REDIRECT_URI=https://api.flowdoro.3scode.my.id/api/google/callback`, `APPWRITE_*`
- Secrets (encrypted): `APPWRITE_API_KEY`, `BETTER_AUTH_SECRET` (64-hex), `GOOGLE_CLIENT_SECRET`, `GOOGLE_TOKEN_ENCRYPTION_KEY` → `wrangler secret put <NAME>` atau Dashboard → Secrets — lihat `env.md` §1

## Docs

- `TEST-RUN-BUILD.md` — run, test, build, deploy (HF Spaces)
- `env.md` — semua env + cara dapat Appwrite Cloud
- `AGENTS.md` — aturan repo (wajib Bun, Svelte runes, Tailwind 4)
