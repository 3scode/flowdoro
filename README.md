# Flowdoro — Smart Time Management with Proportional Rest (5:1)

Monorepo Bun: Svelte 5 + Vite 6 + Tailwind 4 (web) + Bun + Elysia 1.4 (api) + Hono 4 + Appwrite Web SDK (Cloudflare Workers API) + Appwrite Cloud (Auth + DB + Storage).

## Deploy Options

### Cloudflare Workers (Recommended — serverless, no CC)

**API:** `apps/api-cloudflare/` — Hono 4 + Appwrite Web SDK. Deploy via `wrangler`. Domain: `<name>.workers.dev` atau custom domain.

```bash
bun install
cp .env.example .env                  # isi APPWRITE_* di .env (untuk local dev)
bun run dev:api:cf                     # :8787 via wrangler
bun run deploy:api:cf                  # deploy ke Cloudflare
```

ENV vars di `wrangler.toml` → `cloudflare.toml` saat deploy, atau set via Dashboard → Workers → Variables.

**Web:** Cloudflare Pages (`apps/web/dist`) — build `bun run --cwd apps/web build` dengan `VITE_API_URL=https://flowdoro-api.email-trisno-sanjaya.workers.dev`.

---

### Hugging Face Spaces (Fallback — Docker)

> Render free sekarang minta CC. Flowdoro sudah migrasi ke **Hugging Face Spaces Docker** (port `7860`, no CC). Lihat `render.yaml.deprecated` untuk arsip Render.

**API:** `https://huggingface.co/spaces/<username>/flowdoro-api` — SDK `docker`, `app_port: 7860`, `Dockerfile` di root (`Dockerfile` `EXPOSE 7860`), listen `0.0.0.0:${PORT}` di `apps/api/src/index.ts`.

**DB/Auth/Storage:** Appwrite Cloud (https://cloud.appwrite.io) — free no CC. Auth = Appwrite Users, DB = database `flowdoro` (collections `profiles`/`tasks`/`sessions`/`session_events`), Storage = bucket `avatars`. Set `APPWRITE_*` di Space (lihat `env.md` §2-3).

**Web:** HF Spaces Static (`apps/web/dist`) **atau** Cloudflare Pages / Netlify / Vercel (semuanya no CC) — build `bun run --cwd apps/web build` dengan `VITE_API_URL=https://flowdoro-api.email-trisno-sanjaya.workers.dev`.

Panduan lengkap: `TEST-RUN-BUILD.md` §5.3 + `env.md` §2-4 + `AGENTS.md`.

## Quick Start (Local)

```bash
bun install
cp .env.example .env              # isi APPWRITE_PROJECT_ID + APPWRITE_API_KEY
bun run --cwd apps/api seed:dev   # demo user + task + session (butuh Appwrite setup dulu)
bun run dev:api   # :3000
bun run dev:web   # :5173 (proxy /api → :3000)
```

Verifikasi:
```bash
bun run --cwd apps/web build
curl http://localhost:3000/api/health
```

## HF Spaces ENV (Wajib)

Space API → **Settings → Variables and secrets**:

- Variables: `NODE_ENV=production`, `PORT=7860`, `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_DATABASE_ID`, `APPWRITE_COLLECTION_*`, `APPWRITE_BUCKET_AVATARS`, `CORS_ORIGIN=https://<web-url>`
- Secrets: `APPWRITE_API_KEY` (**Server API key** — wajib Secret, bukan Variable)

Lihat template siap pakai: `.env.hf.api`, `.env.hf.web`, `.env.hf` (combined).

## Docs

- `TEST-RUN-BUILD.md` — run, test, build, deploy (HF Spaces)
- `env.md` — semua env + cara dapat Appwrite Cloud
- `AGENTS.md` — aturan repo (wajib Bun, Svelte runes, Tailwind 4)
