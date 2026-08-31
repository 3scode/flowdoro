# AGENTS.md — Flowdoro

Monorepo khusus Bun. Jangan pakai `npm`/`node` — semua script wajib dijalankan dengan `bun`.

## Stack & Struktur

- **Frontend:** Svelte 5 (runes) + Vite 6 + Tailwind CSS 4 — `apps/web/` — SPA, tanpa SvelteKit. Alias `$lib` → `src/lib` (dikonfigurasi di `vite.config.ts` + `tsconfig.json` paths).
- **Backend:** Bun + ElysiaJS 1.4 — `apps/api/` — entry `src/index.ts` → `src/app.ts`.
- **DB:** PostgreSQL 16 + Drizzle ORM + driver `postgres`. Schema di `apps/api/src/db/schema.ts` (4 tabel: `users`, `tasks`, `sessions`, `session_events`). Migrasi di `apps/api/src/db/migrations/`.
- **Infra:** `docker-compose.yml` (postgres + api), `apps/api/Dockerfile`, `render.yaml`.
- **Spesifikasi:** `.agents/DESIGN.md`, `PRD.md`, `TECH-SPEC.md`, `TASKS.md` — sumber kebenaran untuk screen, endpoint, dan model data.

## Perintah

```bash
# install (dari root repo — workspaces ter-hoist ke root node_modules)
bun install

# dev — butuh postgres dulu
docker compose up -d              # postgres:16-alpine di :5432 (healthcheck pg_isready)
cp .env.example .env              # wajib; api baca env via dotenv/config
bun run dev:api                    # apps/api — bun --watch src/index.ts di :3000
bun run dev:web                    # apps/web — vite di :5173 (proxy /api → API_URL)

# atau keduanya (background): bun run dev

# verifikasi (jalankan sebelum handoff)
bun run --cwd apps/web build       # wajib lolos — menangkap error alias $lib + Tailwind
curl http://localhost:3000/api/health  # → {success:true, data:{status:"ok"}}

# db
bun run --cwd apps/api db:generate   # drizzle-kit generate dari schema.ts
bun run --cwd apps/api db:migrate    # butuh DATABASE_URL yang terjangkau
bun run --cwd apps/api seed:dev      # user + task + session demo
```

Script di root `package.json`: `dev`, `dev:web`, `dev:api`, `build`, `lint`, `typecheck`. Script per-app ada di `apps/*/package.json`.

## Env

- Satu `.env` di root repo (disalin dari `.env.example`). `apps/api/src/config/env.ts` mengimpor `dotenv/config` dan satu-satunya pengakses env — jangan baca `process.env` di tempat lain.
- `DATABASE_URL` default `postgresql://flowdoro:flowdoro@localhost:5432/flowdoro`. `docker-compose.yml` juga mengaturnya untuk service `api` ke `postgres:5432`.
- `VITE_API_URL` / `API_URL` mengatur proxy Vite (`apps/web/vite.config.ts` membaca `API_URL` via `loadEnv`). Frontend `src/lib/api/client.ts` memakai `import.meta.env.VITE_API_URL`.
- `JWT_SECRET`, `COOKIE_SECURE=false` di dev (`true` di `render.yaml`).

## Konvensi & Jebakan

- **Wajib Bun** — `apps/api` memakai `postgres` + `jose` + `bcryptjs` via runtime Bun; `drizzle-kit` dijalankan dengan `bunx`.
- **Tailwind 4:** tidak ada `tailwind.config.js`. Plugin adalah `@tailwindcss/vite` di `vite.config.ts`; token berupa custom properties CSS di `apps/web/src/app.css` (diimpor via `@import 'tailwindcss'`). Gunakan `dark:` via class `.dark`, bukan `media`.
- **Svelte 5 runes:** state memakai `$state`/`$derived`/`$effect` — bukan stores. Komponen berupa `.svelte` dengan `<script lang="ts">`.
- **Bentuk respons API terstandardisasi** — selalu `{success, data, error:{code,message}, meta}` (lihat `src/app.ts` `onError`). Kode error: `VALIDATION_ERROR` 422, `UNAUTHORIZED` 401, `CONFLICT` 409, `NOT_FOUND` 404, `RATE_LIMITED` 429.
- **Auth:** JWT via `jose` di cookie `httpOnly` (`token`), `verifyToken` di `src/middleware/auth.ts`. Pola `getUserFromReq` (headers + cookie) diulang di tiap modul — pertahankan.
- **Belum ada test/CI** — script `lint`/`typecheck` ada tapi config ESLint minimal; `apps/web/dist/` adalah artefak build yang ter-commit (aset font) — jangan diedit.
- **Git:** branch `master`, tanpa workflow CI. Commit sejauh ini: `T-01` setup, `T-02` design system, `T-03` migrasi DB, `T-04..13` bulk API+frontend.
- **MCP Playwright:** jangan gunakan tools `playwright_*` (browser automation) kecuali diperintahkan eksplisit oleh user.
