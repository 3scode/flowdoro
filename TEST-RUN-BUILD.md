# TEST - RUN - BUILD — Flowdoro

Panduan step-by-step untuk menjalankan di local, mengetes, dan memastikan build siap deploy. Semua perintah **wajib pakai `bun`** (jangan `npm`/`node`).

> Stack: Svelte 5 + Vite 6 + Tailwind 4 (web) + Bun + Elysia 1.4 (api) + Drizzle + PostgreSQL 16 + Docker + Render

---

## 1. Prasyarat

```bash
bun --version        # butuh >= 1.1 (teruji di 1.3.14)
docker --version     # untuk postgres:16-alpine
docker compose version
git --version
```

Port yang dipakai:
- `5432` → PostgreSQL
- `3000` → API (Elysia)
- `5173` → Web (Vite)

Pastikan ketiga port kosong. Cek cepat:
```bash
lsof -i :3000 -i :5173 -i :5432 2>/dev/null || ss -tulpn | grep -E '3000|5173|5432'
```

---

## 2. Setup Awal (sekali per clone)

```bash
git clone <repo-url> flowdoro
cd flowdoro

# 2.1 Install dependencies — dari root (workspaces ke-hoist ke root node_modules)
bun install

# 2.2 Buat file env — satu file di root, dibaca oleh api via src/config/env.ts
cp .env.example .env
# Edit .env jika perlu. Default sudah jalan untuk local:
# DATABASE_URL=postgresql://flowdoro:flowdoro@localhost:5432/flowdoro
# JWT_SECRET=change-me-...  (ganti di production)
# API_URL=http://localhost:3000
# CORS_ORIGIN=http://localhost:5173
```

> `apps/api/src/config/env.ts` adalah **satu-satunya** tempat baca env (via `dotenv/config`). Jangan pakai `process.env` langsung di file lain.

---

## 3. Jalankan di Local

### 3.1 Nyalakan PostgreSQL

```bash
docker compose up -d
docker compose ps                    # postgres harus (healthy)
docker compose logs postgres --tail 20
```

Verifikasi koneksi:
```bash
docker exec -it flowdoro-postgres pg_isready -U flowdoro -d flowdoro
# → accepting connections
```

Matikan nanti:
```bash
docker compose down        # hentikan
docker compose down -v     # hentikan + hapus data (reset DB)
```

### 3.2 Migrasi & Seed (butuh DATABASE_URL terjangkau)

```bash
# generate sudah ada di src/db/migrations/0000_*.sql — jalankan ini jika ubah schema.ts
bun run --cwd apps/api db:generate

# apply migration ke DB
bun run --cwd apps/api db:migrate
# expected: [✓] migrations applied

# isi data demo (user demo@flowdoro.app / password123 + 5 task + 15 session)
bun run --cwd apps/api seed:dev
```

Jika `db:migrate` gagal `ECONNREFUSED`, pastikan `docker compose up -d` sudah healthy dan `DATABASE_URL` di `.env` benar.

### 3.3 Jalankan Dev Server

**Opsi A — dua terminal (recommended, log terpisah):**
```bash
# terminal 1
bun run dev:api
# → 🦊 Flowdoro API running on http://localhost:3000 (development)

# terminal 2
bun run dev:web
# → vite v6.x ready in xxx ms → Local: http://localhost:5173/
```

**Opsi B — satu perintah background:**
```bash
bun run dev
```

**Opsi C — via Docker (api saja, hot-reload via volume):**
```bash
docker compose up api -d
docker compose logs api -f
```

Buka browser:
- Web: `http://localhost:5173`
- API health: `http://localhost:3000/api/health`

Vite proxy sudah dikonfigurasi (`apps/web/vite.config.ts` baca `API_URL` via `loadEnv`) — request `/api/*` dari web otomatis diteruskan ke `http://localhost:3000`.

---

## 4. Cara Test

### 4.1 Verifikasi Cepat (wajib sebelum commit/handoff)

Jalankan berurutan — urutan penting karena build web akan menangkap error alias `$lib` & Tailwind:

```bash
# 1) Build web — harus lolos
bun run --cwd apps/web build
# expected: ✓ built in ~3s → dist/assets/index-*.js (~87KB) + index-*.css

# 2) Health check API — harus 200
curl http://localhost:3000/api/health
# expected: {"success":true,"data":{"status":"ok",...},"error":null,"meta":null}

# 3) Typecheck (opsional tapi disarankan)
bun run --cwd apps/api typecheck
bun run --cwd apps/web typecheck
```

Jika `build` web gagal dengan error `Expected ">" but found "lang"` atau `Cannot resolve $lib`, cek:
- `apps/web/vite.config.ts` ada alias `$lib → src/lib`
- `apps/web/tsconfig.json` ada `paths: { "$lib/*": ["src/lib/*"] }`
- `apps/web/src/app.css` baris pertama adalah `@import 'tailwindcss';` (Tailwind 4, tanpa `tailwind.config.js`)

### 4.2 Lint

```bash
bun run --cwd apps/api lint
bun run --cwd apps/web lint
# atau dari root:
bun run lint
```

> Config ESLint masih minimal — failure di sini biasanya bukan blocker, tapi `build` wajib lolos.

### 4.3 Test Manual Alur Utama (via curl + browser)

**API — Auth:**
```bash
# register
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}' | jq

# login (jika sudah register)
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"password123"}' | jq

# cek profil (butuh cookie)
curl -s http://localhost:3000/api/me -b cookies.txt | jq

# rate limit — 5x login gagal → 429
```

**API — Session (butuh login cookie):**
```bash
# buat session
curl -s -X POST http://localhost:3000/api/sessions -b cookies.txt \
  -H "Content-Type: application/json" -d '{}' | jq

# lihat active
curl -s http://localhost:3000/api/sessions/active -b cookies.txt | jq

# selesaikan session (ganti :id)
curl -s -X PATCH http://localhost:3000/api/sessions/:id -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"status":"completed","durationSeconds":1800}' | jq

# list history
curl -s "http://localhost:3000/api/sessions?page=1&limit=20" -b cookies.txt | jq

# analytics
curl -s http://localhost:3000/api/analytics/summary -b cookies.txt | jq
curl -s "http://localhost:3000/api/analytics/history?period=week" -b cookies.txt | jq
```

**Browser — Alur UI:**
1. Buka `http://localhost:5173` → Landing terlihat (hero + 3-step)
2. Klik `Sign Up` → isi form → redirect ke `/dashboard`
3. Klik `Start Focusing` → `/focus` → `Start Focus` → timer count-up jalan
4. `Pause` → `Resume` → `Stop & Rest` → overlay break countdown muncul → `Skip Break` → kembali idle
5. Kembali ke `/dashboard` → stat cards & recent sessions ter-update
6. Buka `/history` → list grouped by date → filter tanggal → `Load More`
7. Buka `/analytics` → toggle `day/week/month` → chart berubah
8. Buka `/settings` → ubah `Rest Ratio` & `Theme` → `Save` → toast `Saved!`

### 4.4 Belum Ada Test Otomatis

Repo ini belum punya unit/integration/E2E test. Jika menambah test nanti, struktur yang direncanakan (lihat `TECH-SPEC.md` Bagian 8):

```
tests/
├── unit/
├── integration/
└── e2e/           # Playwright
```

Perintah yang akan dipakai:
```bash
bun run test:unit
bun run test:integration
bun run test:e2e
```

---

## 5. Cara Build (Siap Deploy)

### 5.1 Build Lokal (verifikasi siap deploy)

```bash
# build web — output ke apps/web/dist/
bun run --cwd apps/web build

# cek output ada
ls -lh apps/web/dist/
# harus ada: index.html + assets/index-*.js + assets/index-*.css + favicon.svg + fonts

# build api — bun bundle
bun run --cwd apps/api build
# atau cek typecheck sebagai proxy build
bun run --cwd apps/api typecheck
```

**Checklist sebelum deploy — semua harus ✅:**
- [ ] `bun run --cwd apps/web build` lolos tanpa error
- [ ] `curl http://localhost:3000/api/health` → 200
- [ ] `bun run --cwd apps/api db:migrate` sudah dijalankan di DB target (atau akan dijalankan saat deploy via startup script)
- [ ] `.env.example` berisi semua var yang ada di `render.yaml` (DATABASE_URL, JWT_SECRET, CORS_ORIGIN, R2_*, RESEND_*)
- [ ] `docker compose up --build` lolos lokal (opsional tapi disarankan)

### 5.2 Build Docker Lokal (mirip production)

```bash
# build image api
docker build -t flowdoro-api -f apps/api/Dockerfile apps/api

# atau full compose build
docker compose up --build -d
docker compose ps
curl http://localhost:3000/api/health
```

Jika build Docker gagal `bun.lockb` not found — itu normal, Dockerfile sudah handle fallback `|| bun install`.

### 5.3 Deploy ke Render (sesuai render.yaml)

`render.yaml` di root sudah mendefinisikan 3 service:
- `flowdoro-api` → `type: web` `env: docker` (`apps/api/Dockerfile`, `healthCheckPath: /api/health`, `plan: starter`)
- `flowdoro-web` → `type: web` `env: static` (`buildCommand: bun install && bun run build`, `staticPublishPath: ./apps/web/dist`, `routes: /* → /index.html` SPA rewrite)
- `flowdoro-db` → `type: pserv` PostgreSQL (`plan: starter`, `databaseName: flowdoro`, `user: flowdoro`)

> **Catatan:** `apps/web/src/lib/api/client.ts:1` pakai `import.meta.env.VITE_API_URL` (kosong = relative `/api/*`). Di local, Vite proxy (`apps/web/vite.config.ts:19-20` `loadEnv API_URL`) meneruskan ke `http://localhost:3000`. Di production Render, **wajib set `VITE_API_URL` saat build** agar fetch langsung ke API, bukan relative.

#### 5.3.1 Prasyarat

```bash
git status                          # pastikan di branch master & clean
git remote -v                       # pastikan origin point ke GitHub repo
bun run --cwd apps/web build        # harus lolos lokal dulu
```

- Akun Render (https://render.com) login via GitHub.
- Repo sudah push ke GitHub (`master` branch — Render Blueprint trigger dari `master`).
- Siapkan value env production:

```bash
# generate JWT_SECRET (jangan pakai default .env.example)
openssl rand -base64 48
# alternatif via bun
bun -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

#### 5.3.2 Deploy via Blueprint (paling cepat — 1 klik)

**Step 1 — Push repo terbaru:**
```bash
git add .
git commit -m "chore: ready for render deploy"
git push origin master
```

**Step 2 — Buat Blueprint di Render:**
1. Buka https://dashboard.render.com → **New +** → **Blueprint**.
2. Pilih repo `flowdoro` → Render otomatis detect `render.yaml` → klik **Apply**.
3. Render akan preview 3 service: `flowdoro-api`, `flowdoro-web`, `flowdoro-db` → klik **Apply** lagi.

**Step 3 — Isi env var yang `sync: false` (wajib manual):**
- Di form Blueprint, cari `flowdoro-api` → `JWT_SECRET` → isi hasil `openssl rand -base64 48`.
- Jangan isi `DATABASE_URL` (otomatis dari `fromDatabase: flowdoro-db` → `connectionString`).

**Step 4 — Tambah env tambahan untuk web (penting, belum ada di `render.yaml`):**
- Setelah Blueprint terbuat, buka **flowdoro-web** → **Environment** → **Add Environment Variable**:
  - `VITE_API_URL` = `https://flowdoro-api.onrender.com`  ← ganti dengan URL api aktual dari Render setelah deploy pertama (lihat URL di dashboard `flowdoro-api`). Jika api pakai custom domain, pakai itu.
  - `NODE_ENV` = `production` (opsional, sudah default)
- Buka **flowdoro-api** → **Environment** → pastikan:
  - `NODE_ENV` = `production`
  - `COOKIE_SECURE` = `true`
  - `CORS_ORIGIN` = `https://flowdoro-web.onrender.com` atau URL web aktual (atau `https://flowdoro.onrender.com` jika pakai default dari `render.yaml:21`). **Wajib sama persis dengan URL web**, tanpa trailing slash.
  - `DATABASE_URL` → sudah auto-inject dari DB, jangan ubah.
- Jika butuh `BCRYPT_ROUNDS`, `R2_*`, `RESEND_API_KEY` — tambah di sini.

**Step 5 — Tunggu build & deploy:**
- Render akan build secara paralel:
  - `flowdoro-db` → provisioning ~1-2 menit (status `available`)
  - `flowdoro-api` → Docker build: `oven/bun:latest` → `bun install` → `bun build src/index.ts --outdir dist` → `bun run dist/index.js` → health check `GET /api/health` harus 200. Cek log **Logs** tab. Estimasi 3-5 menit.
  - `flowdoro-web` → `bun install && bun run build` → publish `apps/web/dist` → static hosting. Estimasi 2-3 menit.

Jika web build gagal `Cannot resolve $lib` atau `tailwind.config.js not found` → cek `apps/web/vite.config.ts:11-14` alias `$lib` dan `apps/web/src/app.css:1` `@import 'tailwindcss'`.

#### 5.3.3 Deploy Manual (tanpa Blueprint — alternatif)

Jika tidak mau pakai `render.yaml`:

**A. Buat PostgreSQL:**
- Dashboard → **New +** → **PostgreSQL** → Name `flowdoro-db` → Region `Singapore` (terdekat) → Plan `Starter` → **Create Database** → copy **Internal Connection String** & **External Connection String**.

**B. Buat API (Docker):**
- **New +** → **Web Service** → Connect repo → Name `flowdoro-api` → Region sama dengan DB → Branch `master` → Runtime `Docker` → Dockerfile Path `./apps/api/Dockerfile` → Docker Context `./apps/api` → Plan `Starter` → **Add Environment Variable**:
  ```
  NODE_ENV=production
  PORT=3000
  DATABASE_URL=<paste External Connection String atau Internal jika pilih private network>
  JWT_SECRET=<openssl rand -base64 48>
  CORS_ORIGIN=https://<web-url-bakal-dibuat>
  COOKIE_SECURE=true
  ```
- Health Check Path: `/api/health` → **Create Web Service**.

**C. Buat Web (Static):**
- **New +** → **Static Site** → Connect repo → Name `flowdoro-web` → Branch `master` → Build Command `bun install && bun run build` → Publish Directory `apps/web/dist` → **Add Environment Variable** `VITE_API_URL=https://<api-url>` → **Add Redirect/Rewrite Rule**: `Source /*` `Destination /index.html` `Action Rewrite` (penting untuk SPA — tanpa ini refresh `/dashboard` → 404) → **Create Static Site**.

#### 5.3.4 Build Detail (apa yang terjadi di Render)

- **API Docker** (`apps/api/Dockerfile:1-16`):
  ```dockerfile
  FROM oven/bun:latest AS build
  WORKDIR /app
  COPY package.json bun.lockb* ./
  RUN bun install --frozen-lockfile || bun install
  COPY . .
  RUN bun build src/index.ts --outdir dist --target bun
  FROM oven/bun:latest
  COPY --from=build /app/dist ./dist
  COPY package.json bun.lockb* ./
  RUN bun install --production || bun install
  EXPOSE 3000
  CMD ["bun", "run", "dist/index.js"]
  ```
  Env `DATABASE_URL` & `JWT_SECRET` diinject saat runtime, bukan build time.

- **Web Static**:
  - `bun install` dari root workspaces (hoist ke `node_modules/.bun/`)
  - `vite build` pakai `apps/web/vite.config.ts:29` `target: es2022` + `@tailwindcss/vite` + `svelte()` → output `apps/web/dist/index.html` + `assets/index-*.js` (~95KB) + `assets/index-*.css` (~47KB). Pastikan `staticPublishPath` di `render.yaml:28` benar (`./apps/web/dist` relatif dari root).

#### 5.3.5 Migrasi Database di Production

`render.yaml` **tidak** menjalankan migrasi otomatis. Lakukan sekali setelah DB siap dan tiap ada `apps/api/src/db/migrations/*.sql` baru:

**Opsi A — via Render Shell (recommended):**
1. Buka `flowdoro-api` → **Shell** tab → **Launch Shell**.
2. Jalankan:
   ```bash
   bun run --cwd apps/api db:migrate
   # expected: [✓] migrations applied
   ```
3. (opsional) seed data demo — **jangan seed di production** kecuali butuh:
   ```bash
   bun run --cwd apps/api seed:dev
   # create demo@flowdoro.app / password123
   ```

**Opsi B — via local dengan DATABASE_URL production:**
```bash
# copy External Connection String dari Render DB dashboard
DATABASE_URL="postgresql://flowdoro:...@dpg-xxxx.singapore-postgres.render.com/flowdoro" bun run --cwd apps/api db:migrate
```

**Opsi C — tambahkan ke `startCommand` (jika mau auto):**
Edit `render.yaml` api:
```yaml
  - type: web
    name: flowdoro-api
    env: docker
    dockerCommand: "bun run --cwd apps/api db:migrate && bun run dist/index.js"
```
Lalu commit & push — Render rebuild.

#### 5.3.6 Verifikasi Pasca-Deploy

```bash
# ganti dengan URL aktual dari dashboard Render
API_URL=https://flowdoro-api.onrender.com
WEB_URL=https://flowdoro-web.onrender.com  # atau https://flowdoro.onrender.com

# 1. API health
curl -s $API_URL/api/health | jq
# expected: {"success":true,"data":{"status":"ok"},"error":null,"meta":null}

# 2. Web load (harus 200, bukan 404)
curl -s -o /dev/null -w "%{http_code}" $WEB_URL
# expected: 200
curl -s -o /dev/null -w "%{http_code}" $WEB_URL/dashboard
# expected: 200 (karena SPA rewrite /* → /index.html, tanpa rewrite akan 404)

# 3. CORS & cookie — test register via production
curl -s -X POST $API_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"name":"Prod Test","email":"prod@test.com","password":"password123"}' | jq
# expected: 200 success; jika 409 email exists → coba email lain
```

Di browser: buka `$WEB_URL` → Landing → Sign Up → Dashboard → Start Focusing → cek `Focus` timer → `History`/`Analytics`/`Settings`.

Cek log: Dashboard → `flowdoro-api` → **Logs** → tidak ada `ECONNREFUSED` atau `JWT_SECRET missing`. DB: `flowdoro-db` → **Metrics** → Connections naik.

#### 5.3.7 Update & Rollback

- **Update:** `git push origin master` → Render auto-deploy (jika **Auto-Deploy** ON di dashboard). Tunggu build baru → health check lolos → traffic switch. Tidak perlu manual redeploy.
- **Rollback:** Dashboard → `flowdoro-api` → **Deploys** tab → pilih deploy sebelumnya → **Rollback**.
- **Env update:** Ubah env var → Render otomatis redeploy service terkait.

#### 5.3.8 Troubleshooting Deploy Render

| Masalah | Log / Gejala | Solusi |
|---|---|---|
| `flowdoro-api` build failed `bun.lockb not found` | Docker log `frozen-lockfile` error | Normal — `Dockerfile:5` fallback `|| bun install` sudah handle. Jika tetap fail, pastikan `bun.lockb` atau `bun.lock` ada di `apps/api/` atau root. |
| `flowdoro-api` crash `DATABASE_URL missing` | Log `env validation failed` / `ECONNREFUSED` | `render.yaml` `fromDatabase` belum inject — pastikan DB `flowdoro-db` status `available` dulu. Jika manual deploy, isi `DATABASE_URL` manual dari DB dashboard. |
| `/api/health` 502 / health check timeout | `healthCheckPath: /api/health` fail 5x | Cek `PORT=3000` env benar, `apps/api/src/index.ts` listen `0.0.0.0:${PORT}` bukan `127.0.0.1`. Cek log `🦊 Flowdoro API running on http://...`. |
| Web `404` saat refresh `/dashboard` | `GET /dashboard 404` | Lupa SPA rewrite — di **Static Site** → **Redirects/Rewrites** tambah `/* → /index.html 200 Rewrite`. Jika pakai Blueprint, cek `render.yaml:29-32` `routes: rewrite`. |
| Web fetch `401` terus / `CORS error` | Browser console `CORS ... blocked` | `CORS_ORIGIN` di api harus exact match web URL (mis. `https://flowdoro-web.onrender.com`), bukan `localhost`. `COOKIE_SECURE=true` di production wajib `https`. |
| Web blank hitam `mount is not available on the server` | Console `lifecycle_function_unavailable` | `apps/web/vite.config.ts:14` harus ada `conditions: ['browser','svelte']` + rebuild web. Render web sudah pakai build terbaru jika `git push` terbaru. |
| DB `relation "users" does not exist` | API log `PostgresError: relation does not exist` | Belum `db:migrate` di production — jalankan via Shell `bun run --cwd apps/api db:migrate`. |
| `JWT_SECRET sync: false` tidak terisi | Blueprint form kosong | Isi manual di dashboard → redeploy. Generate via `openssl rand -base64 48`. |

**Checklist akhir sebelum anggap deploy selesai:**
- [ ] `curl $API_URL/api/health` → 200 di Render, bukan cuma lokal
- [ ] `curl $WEB_URL` & `curl $WEB_URL/dashboard` → 200 (SPA rewrite jalan)
- [ ] `flowdoro-db` status `available` & `db:migrate` sudah `applied`
- [ ] `VITE_API_URL` di web env = URL api Render, `CORS_ORIGIN` di api = URL web Render
- [ ] `bun run --cwd apps/web build` lolos lokal & file `apps/web/dist/index.html` ada

> Env production Render diringkas di Blueprint, tapi **2 var wajib atur manual post-deploy**: `JWT_SECRET` (api) & `VITE_API_URL` (web). Jika custom domain (mis. `flowdoro.com`), update `CORS_ORIGIN` ke domain tersebut & redeploy.

---

## 6. Troubleshooting

| Masalah | Penyebab | Solusi |
|---|---|---|
| `ECONNREFUSED 5432` saat `db:migrate` / register | Postgres belum jalan | `docker compose up -d` lalu tunggu `healthy` (`docker compose ps`) |
| `bun run --cwd apps/web build` gagal `Cannot resolve $lib` | Alias belum ke-load | Cek `vite.config.ts` ada `resolve.alias.$lib` dan `tsconfig.json` ada `paths` |
| `build` gagal `tailwind.config.js not found` | Salah pakai Tailwind 3 | Repo ini Tailwind 4 — plugin via `@tailwindcss/vite`, bukan config file. Cek `app.css` baris 1 `@import 'tailwindcss'` |
| `curl /api/health` 404 | API belum jalan atau port salah | `bun run dev:api` harus di :3000, cek `PORT` di `.env` |
| Login 401 terus | Cookie tidak kekirim | Pastikan `CORS_ORIGIN` = `http://localhost:5173` dan request pakai `credentials: include` + `curl -c/-b cookies.txt` |
| Timer tidak akurat setelah sleep | Pakai delta timestamp | Sudah ditangani via `requestAnimationFrame` + `Date.now()` delta — jika masih off, cek `src/lib/stores/timer.ts` |
| `apps/web/dist/` ter-commit | Artefak build | Jangan edit manual — akan ter-overwrite tiap `bun run --cwd apps/web build`. Sudah di `.gitignore` kecuali font yang memang sengaja ter-commit |

---

## 7. Ringkas — Perintah Harian

```bash
# mulai kerja
docker compose up -d
bun run dev:api   # terminal 1
bun run dev:web   # terminal 2

# sebelum commit
bun run --cwd apps/web build
curl http://localhost:3000/api/health

# sebelum deploy
bun run --cwd apps/api db:migrate
docker compose up --build -d && curl http://localhost:3000/api/health

# selesai kerja
docker compose down
```

---

> Sumber kebenaran tambahan: `AGENTS.md` (aturan repo), `.agents/DESIGN.md` (UI), `.agents/TECH-SPEC.md` (arsitektur & endpoint), `.agents/TASKS.md` (daftar task).
