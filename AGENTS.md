# AGENTS.md — Flowdoro

Monorepo khusus Bun. Jangan pakai `npm`/`node` — semua script wajib dijalankan dengan `bun`.

## Stack & Struktur

- **Frontend:** Svelte 5 (runes) + Vite 6 + Tailwind CSS 4 — `apps/web/` — SPA, tanpa SvelteKit. Alias `$lib` → `src/lib` (dikonfigurasi di `vite.config.ts` + `tsconfig.json` paths).
- **Backend:** Bun + ElysiaJS 1.4 — `apps/api/` — entry `src/index.ts` → `src/app.ts`. (HF Spaces deployment)
- **Backend (CF Workers):** Hono 4 + Appwrite Web SDK — `apps/api-cloudflare/` — entry `src/index.ts`. (serverless, production target)
- **DB/Auth/Storage:** Appwrite Cloud (sejak T-APPW, sudah replace PostgreSQL/Drizzle/R2). Backend pakai `node-appwrite` SDK — dan helper ada di `apps/api/src/lib/appwrite.ts` (`getDatabases/getUsers/getStorage/getAccount`, `appwrite` config, `getProfile`). Auth = Appwrite Users + session cookie. Collection: `profiles`, `tasks`, `sessions`, `session_events` + bucket `avatars`.
- **Infra:** `docker-compose.yml` (api saja, tanpa postgres), `Dockerfile` (root, untuk Hugging Face Spaces Docker SDK) + `apps/api/Dockerfile` (build konteks `apps/api`), HF Spaces `app_port: 7860` (lokal `3000` via `PORT` env). CF Workers via `apps/api-cloudflare/wrangler.toml`.
- **Spesifikasi:** `.agents/DESIGN.md`, `PRD.md`, `TECH-SPEC.md`, `TASKS.md` — sumber kebenaran untuk screen, endpoint, dan model data.

## Perintah

```bash
# install (dari root repo — workspaces ter-hoist ke root node_modules)
bun install

# dev — butuh Appwrite Cloud project dulu (console → buat DB `flowdoro` + collections + API key)
cp .env.example .env              # wajib; api baca env via dotenv/config
bun run dev:api                    # apps/api — bun --watch src/index.ts di :3000
bun run dev:web                    # apps/web — vite di :5173 (proxy /api → API_URL)

# atau keduanya (background): bun run dev

# verifikasi (jalankan sebelum handoff)
bun run --cwd apps/web build       # wajib lolos — menangkap error alias $lib + Tailwind
curl http://localhost:3000/api/health  # → {success:true, data:{status:"ok"}}

# seed (Appwrite Cloud — butuh APPWRITE_API_KEY terisi di .env)
bun run --cwd apps/api seed:dev      # user demo + task + session demo
```

Script di root `package.json`: `dev`, `dev:web`, `dev:api`, `dev:api:cf`, `build`, `lint`, `typecheck`. Script per-app ada di `apps/*/package.json`.

## Env

- Satu `.env` di root repo (disalin dari `.env.example`). `apps/api/src/config/env.ts` mengimpor `dotenv/config` dan satu-satunya pengakses env — jangan baca `process.env` di tempat lain.
- `APPWRITE_ENDPOINT` default `https://cloud.appwrite.io/v1`; butuh `APPWRITE_PROJECT_ID` + `APPWRITE_API_KEY` (API key server di Console). `APPWRITE_API_KEY` di HF Spaces wajib masuk **Secrets** (bukan Variables). Tidak ada `DATABASE_URL`/`JWT_SECRET`/`R2_*` lagi.
- `VITE_API_URL` / `API_URL` mengatur proxy Vite (`apps/web/vite.config.ts` membaca `API_URL` via `loadEnv`). Frontend `src/lib/api/client.ts` memakai `import.meta.env.VITE_API_URL`.
- `PORT=3000` lokal, `7860` di HF Spaces (wajib, di-set di Space → Settings → Variables). Cookie session (`token` = Appwrite session secret) `httpOnly`; `secure` aktif saat `NODE_ENV=production`.

## Konvensi & Jebakan

- **Wajib Bun** — semua script pakai `bun`; `apps/api` memakai `node-appwrite` SDK via runtime Bun.
- **Tailwind 4:** tidak ada `tailwind.config.js`. Plugin adalah `@tailwindcss/vite` di `vite.config.ts`; token berupa custom properties CSS di `apps/web/src/app.css` (diimpor via `@import 'tailwindcss'`). Gunakan `dark:` via class `.dark`, bukan `media`.
- **Svelte 5 runes:** state memakai `$state`/`$derived`/`$effect` — bukan stores. Komponen berupa `.svelte` dengan `<script lang="ts">`.
- **Bentuk respons API terstandardisasi** — selalu `{success, data, error:{code,message}, meta}` (lihat `src/app.ts` `onError`). Kode error: `VALIDATION_ERROR` 422, `UNAUTHORIZED` 401, `CONFLICT` 409, `NOT_FOUND` 404, `RATE_LIMITED` 429.
- **Auth:** Appwrite Users + session cookie `httpOnly` (`token` = Appwrite session secret), `authGuard` di `src/middleware/auth.ts` pakai `Account.get()` via `getSessionClient(secret)`. Query data pakai `databases.listDocuments/createDocument/updateDocument/deleteDocument` + `Query.*` (Appwrite tidak ada JOIN/FK cascade — cascade manual).
- **Belum ada test/CI** — script `lint`/`typecheck` ada tapi config ESLint minimal; `apps/web/dist/` adalah artefak build yang ter-commit (aset font) — jangan diedit.
- **Git:** branch `master`, tanpa workflow CI. Commit sejauh ini: `T-01` setup, `T-02` design system, `T-03` migrasi DB, `T-04..13` bulk API+frontend, `T-APPW` migrasi ke Appwrite Cloud.
- **MCP Playwright:** jangan gunakan tools `playwright_*` (browser automation) kecuali diperintahkan eksplisit oleh user.
