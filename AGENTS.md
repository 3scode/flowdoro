# AGENTS.md — Flowdoro

Monorepo khusus Bun. Jangan pakai `npm`/`node` — semua script wajib dijalankan dengan `bun`.

## Stack & Struktur

- **Frontend:** Svelte 5 (runes) + Vite 6 + Tailwind CSS 4 — `apps/web/` — SPA, tanpa SvelteKit. Alias `$lib` → `src/lib` (dikonfigurasi di `vite.config.ts` + `tsconfig.json` paths).
- **Backend:** Hono 4 + Appwrite Web SDK — `apps/api-cloudflare/` — entry `src/index.ts`. (Cloudflare Workers, production + local `wrangler dev` di :8787)
- **DB/Auth/Storage:** Appwrite Cloud (sejak T-APPW, sudah replace PostgreSQL/Drizzle/R2). Backend pakai Appwrite REST via `fetch` + `ID` SDK (`apps/api-cloudflare/src/lib/appwrite.ts`) — helper `dbList/dbCreate/dbUpdate/dbDelete/getProfile`. Auth = Appwrite Users + session token (`Authorization: Bearer` + cookie `a_session_<project>`). Collection: `profiles`, `tasks`, `sessions`, `session_events`, `lists` + bucket `avatars`.
- **Infra:** Cloudflare Workers (`apps/api-cloudflare/wrangler.toml`) + Cloudflare Pages (`apps/web/dist` via `deploy-web.sh`). Tidak ada Docker/HF/Fly/Render lagi (sudah dihapus).
- **Spesifikasi:** `.agents/DESIGN.md`, `PRD.md`, `TECH-SPEC.md`, `TASKS.md` — sumber kebenaran untuk screen, endpoint, dan model data.

## Perintah

```bash
# install (dari root repo — workspaces ter-hoist ke root node_modules)
bun install

# dev — butuh Appwrite Cloud project dulu (console → buat DB `flowdoro` + collections + API key)
cp .env.example .env              # wajib; untuk wrangler dev copy ke .dev.vars
bun run dev:api                    # apps/api-cloudflare — wrangler dev di :8787
bun run dev:web                    # apps/web — vite di :5173 (proxy /api → API_URL)

# atau keduanya (background): bun run dev

# verifikasi (jalankan sebelum handoff)
bun run --cwd apps/web build       # wajib lolos — menangkap error alias $lib + Tailwind
curl http://localhost:8787/api/health  # → {success:true, data:{status:"ok"}}

# seed (Appwrite Cloud — butuh APPWRITE_API_KEY terisi di .env)
bun run seed:dev      # user demo + task + session demo (scripts/seed.mjs)
```

Script di root `package.json`: `dev`, `dev:web`, `dev:api`, `dev:api:cf`, `build`, `lint`, `typecheck`. Script per-app ada di `apps/*/package.json`.

## Env

- Satu `.env` di root repo (disalin dari `.env.example`). `apps/api-cloudflare/src/lib/env.ts` baca dari `c.env` (wrangler), local dev via `.dev.vars`. Jangan baca `process.env` langsung di Workers.
- `APPWRITE_ENDPOINT` default `https://sgp.cloud.appwrite.io/v1`; butuh `APPWRITE_PROJECT_ID` + `APPWRITE_API_KEY` (API key server di Console). `APPWRITE_API_KEY` di Workers wajib via `wrangler secret put` (jangan di `[vars]`). Tidak ada `DATABASE_URL`/`JWT_SECRET`/`R2_*` lagi.
- `VITE_API_URL` / `API_URL` mengatur proxy Vite (`apps/web/vite.config.ts` membaca `API_URL` via `loadEnv`). Frontend `src/lib/api/client.ts` memakai `import.meta.env.VITE_API_URL`.
- `PORT=8787` lokal wrangler, `5173` web vite. Cookie session (`a_session_<project>` + `Authorization: Bearer`) `httpOnly`; `secure` aktif saat `NODE_ENV=production`.

## Konvensi & Jebakan

- **Wajib Bun** — semua script pakai `bun`; `scripts/seed.mjs` memakai `node-appwrite` SDK via runtime Bun.
- **Tailwind 4:** tidak ada `tailwind.config.js`. Plugin adalah `@tailwindcss/vite` di `vite.config.ts`; token berupa custom properties CSS di `apps/web/src/app.css` (diimpor via `@import 'tailwindcss'`). Gunakan `dark:` via class `.dark`, bukan `media`.
- **Svelte 5 runes:** state memakai `$state`/`$derived`/`$effect` — bukan stores. Komponen berupa `.svelte` dengan `<script lang="ts">`.
- **Bentuk respons API terstandardisasi** — selalu `{success, data, error:{code,message}, meta}` (lihat `src/app.ts` `onError`). Kode error: `VALIDATION_ERROR` 422, `UNAUTHORIZED` 401, `CONFLICT` 409, `NOT_FOUND` 404, `RATE_LIMITED` 429.
- **Auth:** Appwrite Users + session cookie `httpOnly` (`token` = Appwrite session secret), `authGuard` di `src/middleware/auth.ts` pakai `Account.get()` via `getSessionClient(secret)`. Query data pakai `databases.listDocuments/createDocument/updateDocument/deleteDocument` + `Query.*` (Appwrite tidak ada JOIN/FK cascade — cascade manual).
- **Belum ada test/CI** — script `lint`/`typecheck` ada tapi config ESLint minimal; `apps/web/dist/` adalah artefak build yang ter-commit (aset font) — jangan diedit.
- **Git:** branch `master`, tanpa workflow CI. Commit sejauh ini: `T-01` setup, `T-02` design system, `T-03` migrasi DB, `T-04..13` bulk API+frontend, `T-APPW` migrasi ke Appwrite Cloud.
- **MCP Playwright:** jangan gunakan tools `playwright_*` (browser automation) kecuali diperintahkan eksplisit oleh user.
