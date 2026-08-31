# ENV.md — Cara Mendapatkan Environment Variables Flowdoro

Semua env dibaca **hanya** di `apps/api/src/config/env.ts:3-23` via `dotenv/config` dari **satu file di root** `.env` (disalin dari `.env.example`). Frontend baca `import.meta.env.VITE_API_URL` dari `apps/web/src/lib/api/client.ts:1` (build-time) & proxy `apps/web/vite.config.ts:19-20` (`loadEnv API_URL`).

> Semua perintah wajib `bun` (jangan `npm/node`) — sesuai `AGENTS.md`.

---

## 1. Ringkas — Tabel Env

| Variable | Wajib? | Default (local) | Dipakai di | Cara dapat |
|---|---|---|---|---|
| `DATABASE_URL` | **Wajib** | `postgresql://flowdoro:flowdoro@localhost:5432/flowdoro` | `env.ts:6` `postgres` driver | Lihat §2 |
| `DATABASE_SSL` | Opsional | `false` | `env.ts:7` | `true` jika DB external butuh SSL |
| `JWT_SECRET` | **Wajib prod** | `dev-secret-change-me` | `jose` sign JWT `auth.ts` | §3 |
| `JWT_EXPIRES_IN` | Opsional | `7d` | `env.ts:9` | isi `7d`/`30d` |
| `COOKIE_SECURE` | **Wajib prod** | `false` | `env.ts:10` | `false` local, `true` di Render |
| `BCRYPT_ROUNDS` | Opsional | `12` | `env.ts:11` | `12` (jangan ubah) |
| `CORS_ORIGIN` | **Wajib** | `http://localhost:5173` | `env.ts:12` cors `app.ts` | §4 |
| `APP_URL` / `API_URL` / `FRONTEND_URL` | Opsional | `http://localhost:*` | `env.ts:13-14` | §4 |
| `VITE_API_URL` | **Wajib prod web** | `""` (relative) | `client.ts:1` `VITE_API_URL` | §4 |
| `REST_RATIO_DEFAULT` | Opsional | `5` | `env.ts:15` | `5` (1/5) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Opsional* | `""` | `schema.ts:14` `users.googleId` | §5 |
| `RESEND_API_KEY` | Opsional* | `""` | `env.ts:16` | §6 |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` / `R2_PUBLIC_URL` | Opsional* | `""` / `flowdoro-avatars` | `env.ts:17-21` | §7 |
| `SENTRY_DSN` | Opsional | `""` | `env.ts` future | §8 |
| `LOG_LEVEL` | Opsional | `info` | `env.ts:22` | `info`/`debug` |
| `NODE_ENV` | Wajib prod | `development` | `env.ts:4` | `production` di Render |
| `PORT` | Opsional | `3000` | `env.ts:5` | `3000` |

`*` fitur belum aktif di V1 (Google OAuth, email reset, avatar upload) — kosongkan tidak masalah, tapi siapkan env kosong agar `render.yaml` tidak error.

`GOOGLE_*`, `RESEND_*`, `R2_*` masih kosong di `apps/api/src/config/env.ts` (fallback `""`) — belum dipakai kode aktif, tapi sudah didaftarkan di `.env.example:8-16` untuk V2.

---

## 2. DATABASE_URL

### A. Local (Docker — paling gampang, recommended dev)

Tidak perlu cari — pakai Postgres Docker bawaan `docker-compose.yml:3-18`.

```bash
# 1. nyalakan DB
docker compose up -d
docker compose ps  # harus (healthy)
# 2. pakai URL bawaan
DATABASE_URL=postgresql://flowdoro:flowdoro@localhost:5432/flowdoro
DATABASE_SSL=false

# 3. verifikasi
docker exec -it flowdoro-postgres pg_isready -U flowdoro -d flowdoro
# → accepting connections
bun run --cwd apps/api db:migrate
```

`docker-compose.yml:8` `POSTGRES_USER: flowdoro`, `POSTGRES_PASSWORD: flowdoro`, `POSTGRES_DB: flowdoro`, port `5432:5432` (`docker-compose.yml:11`).

### B. Production — Render Postgres (via `render.yaml:14-17`)

Jika deploy via Blueprint (`render.yaml`):

1. Render auto-create `flowdoro-db` (`plan: starter`, `databaseName: flowdoro`, `user: flowdoro`).
2. Jangan isi manual — `render.yaml:14-17` sudah `fromDatabase: flowdoro-db property: connectionString key: DATABASE_URL` → Render inject otomatis ke `flowdoro-api`.
3. Lihat URL: Dashboard → `flowdoro-db` → **Connections** → **Internal Connection String** (untuk api di Render) & **External Connection String** (untuk `db:migrate` lokal).

Jika manual (tanpa Blueprint):
- Dashboard → **New +** → **PostgreSQL** → Name `flowdoro-db` → Region `Singapore` → Create → Copy **Internal Connection String** → paste ke `flowdoro-api` → **Environment** → `DATABASE_URL`.
- `DATABASE_SSL` = `true` jika pakai External string (Render Postgres butuh SSL eksternal), `false` jika Internal.

### C. Alternatif External (Neon / Supabase / Railway)

- **Neon** (https://neon.tech) → New Project → Copy `DATABASE_URL` `postgresql://user:pass@ep-xxx.neon.tech/flowdoro?sslmode=require` → set `DATABASE_SSL=true`.
- **Supabase** (https://supabase.com) → Project → **Database** → **Connection String** → URI mode → copy → `DATABASE_SSL=true`.
- Test koneksi lokal:
  ```bash
  DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" DATABASE_SSL=true bun run --cwd apps/api db:migrate
  ```

---

## 3. JWT_SECRET & JWT_EXPIRES_IN & BCRYPT_ROUNDS & COOKIE_SECURE

### JWT_SECRET (wajib ganti di prod)

Jangan pakai `change-me-...` di production — JWT bisa di-forge.

**Step 1 — Generate (pilih salah satu):**
```bash
# via openssl (recommended)
openssl rand -base64 48

# via bun / node
bun -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# via pwgen
pwgen -s 48 1
```

**Step 2 — Isi:**
- Local `.env`: `JWT_SECRET=<hasil openssl 48 char>`
- Render: `flowdoro-api` → **Environment** → `JWT_SECRET` → paste (karena `sync: false` di `render.yaml:18-19` harus isi manual). Min 32 char.

### JWT_EXPIRES_IN
- Default `7d` (7 hari). Opsional. Format `jose`: `7d`, `30d`, `12h`, `60m`. Biarkan `7d` jika tidak butuh.

### BCRYPT_ROUNDS
- Default `12` (`env.ts:11`). Jangan ubah kecuali benchmark — 12 sudah balance security/perf.

### COOKIE_SECURE
- `false` di local (`http://localhost`) — cookie `httpOnly` butuh `Secure=false` agar terkirim via http.
- `true` di production (`https://...onrender.com`) — `render.yaml:22-23` sudah `COOKIE_SECURE=true`. Jika masih `false` di prod, cookie tidak terkirim via https + browser block `SameSite`.

---

## 4. CORS_ORIGIN + APP_URL + API_URL + FRONTEND_URL + VITE_API_URL

Paling sering bikin `401` / `CORS blocked` jika salah.

### Local

```env
CORS_ORIGIN=http://localhost:5173
APP_URL=http://localhost:5173
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000   # atau kosongkan "" → pakai Vite proxy /api → localhost:3000
```

- `CORS_ORIGIN` (`env.ts:12`) harus exact match `Origin` header dari web (`http://localhost:5173` tanpa trailing slash).
- `VITE_API_URL` (`client.ts:1`) diisi `http://localhost:3000` agar `fetch(`${API_BASE}/api/...`)` langsung ke API. Jika kosong, `API_BASE=""` → request relative `/api/...` → Vite `vite.config.ts:19-20` proxy `loadEnv API_URL` ke `http://localhost:3000` (hanya dev).

### Production (Render)

Setelah deploy, buka dashboard → copy URL aktual:

- Misal Web: `https://flowdoro-web.onrender.com`, API: `https://flowdoro-api.onrender.com`

**Isi di `flowdoro-api` → Environment:**
```
CORS_ORIGIN=https://flowdoro-web.onrender.com
APP_URL=https://flowdoro-web.onrender.com
FRONTEND_URL=https://flowdoro-web.onrender.com
API_URL=https://flowdoro-api.onrender.com
NODE_ENV=production
```

**Isi di `flowdoro-web` → Environment (build-time):**
```
VITE_API_URL=https://flowdoro-api.onrender.com
```
> Penting: `VITE_API_URL` dibaca saat `vite build` (`buildCommand: bun install && bun run build` di `render.yaml:27`). Jika ubah env ini, **trigger redeploy** web agar rebuild dengan URL baru. Tanpa ini, web pakai relative `/api` → di Render static hosting tidak ada proxy → `404`.

Jika pakai custom domain (mis. `https://flowdoro.com`):
```
CORS_ORIGIN=https://flowdoro.com
VITE_API_URL=https://api.flowdoro.com
```

### Cek cepat

```bash
curl -s https://flowdoro-api.onrender.com/api/health | jq
curl -s https://flowdoro-web.onrender.com | head
```

---

## 5. Google OAuth — GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET

> Fitur V2 (schema `users.googleId` sudah ada `schema.ts:14`, tapi route login Google belum aktif). Boleh kosongkan `""` di `.env` untuk sekarang. Isi jika mau siapkan.

**Step-by-step:**

1. Buka https://console.cloud.google.com → Login Gmail.
2. **New Project** → Name `Flowdoro` → Create.
3. **APIs & Services** → **OAuth consent screen** → User Type `External` → Create:
   - App name: `Flowdoro`
   - Support email: email kamu
   - Authorized domains: `onrender.com` (jika prod) + `localhost` untuk dev
   - Scopes: `email`, `profile`
   - Save.
4. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID** → Application type `Web application` → Name `Flowdoro Web`:
   - **Authorized JavaScript origins:**
     ```
     http://localhost:5173
     https://flowdoro-web.onrender.com
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3000/api/auth/google/callback
     https://flowdoro-api.onrender.com/api/auth/google/callback
     ```
   - Create → Copy **Client ID** & **Client Secret**.
5. Isi `.env`:
   ```
   GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
   ```
   Di Render: `flowdoro-api` → Environment → tambah keduanya.

---

## 6. Resend — RESEND_API_KEY (Email reset password)

> V2 `POST /auth/forgot-password` (Resend). Kosongkan `""` jika belum pakai.

1. Buka https://resend.com → Sign Up → Verify email.
2. **API Keys** → **Create API Key** → Name `flowdoro-prod` → Permission `Full Access` → Copy `re_xxxxxxxx`.
3. (opsional) **Domains** → Add Domain `flowdoro.com` → verifikasi DNS `TXT` → agar `from` bisa `noreply@flowdoro.com` (jika belum verifikasi, pakai `onboarding@resend.dev` untuk test).
4. Isi:
   ```
   RESEND_API_KEY=re_xxxxxxxx
   ```
   Render: `flowdoro-api` → Environment → `RESEND_API_KEY`.

Test:
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password -d '{"email":"test@example.com"}'
```

---

## 7. Cloudflare R2 — R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL (Avatar upload)

> V2 avatar upload (`users.avatarUrl` `schema.ts:9`). Kosongkan jika belum pakai.

**Step-by-step:**

1. Buka https://dash.cloudflare.com → Login → **R2 Object Storage** (sidebar).
2. **Create Bucket** → Name `flowdoro-avatars` → Location `APAC` (Singapore) → Create.
3. **Manage R2 API Tokens** → **Create API Token** → Type `Admin Read & Write` atau Custom:
   - Permissions: `Object Read & Write`
   - Bucket: `flowdoro-avatars`
   - TTL: `Permanent` → Generate → Copy **Access Key ID** & **Secret Access Key** (hanya sekali muncul!).
4. Copy **Account ID**: Dashboard → R2 → URL `https://dash.cloudflare.com/<ACCOUNT_ID>/r2` → atau di **Overview** kanan atas.
5. **Settings** → **Public access** → **Custom Domains** atau **R2.dev subdomain**: Enable `https://pub-xxxx.r2.dev` → Copy sebagai `R2_PUBLIC_URL` (atau pakai custom `https://avatars.flowdoro.com` jika sudah connect domain).
6. Isi `.env`:
   ```
   R2_ACCOUNT_ID=abc123def456
   R2_ACCESS_KEY_ID=xxxx
   R2_SECRET_ACCESS_KEY=xxxx
   R2_BUCKET=flowdoro-avatars
   R2_PUBLIC_URL=https://pub-xxxx.r2.dev
   ```
   Render: `flowdoro-api` → Environment → isi 5 var tersebut.

Cost: R2 free tier 10GB storage, 10M reads — cukup untuk avatar.

---

## 8. Sentry — SENTRY_DSN (Error tracking)

Opsional.

1. https://sentry.io → Create Project → Platform `Node.js` (untuk api) + `React`/`Svelte` (untuk web) → Copy **DSN** `https://xxxx@o123.ingest.sentry.io/456`.
2. Isi:
   ```
   SENTRY_DSN=https://xxxx@o123.ingest.sentry.io/456
   ```
   Render: tambah di kedua service jika pakai. Jika kosong `""`, Sentry tidak aktif.

---

## 9. Misc — NODE_ENV, PORT, LOG_LEVEL, REST_RATIO_DEFAULT, SENTRY_DSN, DATABASE_SSL, FRONTEND_URL

- `NODE_ENV` (`env.ts:4`): `development` local, `production` di Render (`render.yaml:10`). Jangan set `test` kecuali test.
- `PORT` (`env.ts:5`): `3000` local & Render (`render.yaml:12-13`). Jangan random — health check Render pakai `PORT`.
- `LOG_LEVEL` (`env.ts:22`): `info` default, `debug` untuk dev verbose, `error` untuk prod silent.
- `REST_RATIO_DEFAULT` (`env.ts:15`): `5` → rest 1/5 dari focus (30m focus → 6m rest). Valid `3/4/5/6`.
- `DATABASE_SSL` (`env.ts:7`): `false` local Docker, `true` jika `DATABASE_URL` pakai `?sslmode=require` (Neon/Supabase/Render external).
- `FRONTEND_URL` (`env.ts` alias `APP_URL`): sama dengan `APP_URL`, untuk redirect email/link.

---

## 10. Cara Buat `.env` Lengkap (Copy-Paste)

### Local (sekali per clone)

```bash
cp .env.example .env

# generate JWT_SECRET
JWT=$(openssl rand -base64 48)
# atau
JWT=$(bun -e "console.log(require('crypto').randomBytes(32).toString('base64url'))")

# edit .env
# DATABASE_URL=postgresql://flowdoro:flowdoro@localhost:5432/flowdoro
# DATABASE_SSL=false
# JWT_SECRET=$JWT
# COOKIE_SECURE=false
# CORS_ORIGIN=http://localhost:5173
# APP_URL=http://localhost:5173
# API_URL=http://localhost:3000
# VITE_API_URL=http://localhost:3000
# (GOOGLE_*, RESEND_*, R2_* kosongkan dulu)

cat .env
```

### Production (Render Blueprint)

Setelah **Blueprint Apply** (`render.yaml`):

1. `flowdoro-api` → Environment:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=(auto dari flowdoro-db, jangan isi)
   JWT_SECRET=<paste openssl 48>
   JWT_EXPIRES_IN=7d
   COOKIE_SECURE=true
   CORS_ORIGIN=https://flowdoro-web.onrender.com
   APP_URL=https://flowdoro-web.onrender.com
   API_URL=https://flowdoro-api.onrender.com
   BCRYPT_ROUNDS=12
   REST_RATIO_DEFAULT=5
   LOG_LEVEL=info
   DATABASE_SSL=false
   RESEND_API_KEY=re_xxx (jika ada)
   R2_* (jika ada)
   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (jika ada)
   ```

2. `flowdoro-web` → Environment:
   ```
   VITE_API_URL=https://flowdoro-api.onrender.com
   ```

3. **Save** → Render auto redeploy → tunggu `healthCheckPath: /api/health` hijau → `bun run --cwd apps/api db:migrate` via Shell.

---

## 11. Verifikasi Env Sudah Benar

```bash
# 1. cek file .env ada & tidak commit
ls -la .env .env.example
git check-ignore .env && echo ".env ignored OK" || echo "WARNING: .env not ignored!"

# 2. cek api baca env
bun run --cwd apps/api dev
# log harus tanpa "JWT_SECRET missing" & "ECONNREFUSED" (jika DB jalan)

# 3. cek web VITE_API_URL
bun run --cwd apps/web build && grep -r "VITE_API_URL\|flowdoro-api" apps/web/dist/assets/*.js | head

# 4. prod health
curl http://localhost:3000/api/health | jq
# {"success":true,"data":{"status":"ok"}}

# 5. cek koneksi DB
docker exec -it flowdoro-postgres psql -U flowdoro -d flowdoro -c "SELECT count(*) FROM users;"
```

Jika `curl /api/health` 500 → cek `render.yaml` healthCheck `docker` vs `node` path.

---

## 12. Troubleshooting Env

| Gejala | Penyebab Env | Fix |
|---|---|---|
| `ECONNREFUSED 5432` / `db:migrate ECONNREFUSED` | `DATABASE_URL` salah / DB belum `healthy` | `docker compose up -d && docker compose ps` → tunggu `healthy`, pakai `postgresql://flowdoro:flowdoro@localhost:5432/flowdoro` |
| `JWT malformed` / login selalu `401` | `JWT_SECRET` beda antara api & token lama | Generate baru `openssl rand -base64 48` → set di api env → redeploy → login ulang (`curl -c cookies.txt`) |
| `CORS error` / `401 cookie not sent` | `CORS_ORIGIN` tidak exact match web URL | Set `CORS_ORIGIN=https://flowdoro-web.onrender.com` (tanpa `/`), `COOKIE_SECURE=true` di https |
| Web blank `mount is not available` | `apps/web/vite.config.ts` `conditions` hilang | Sudah fix `conditions: ['browser','svelte']` — rebuild web |
| Web fetch `404 /api/...` di prod | `VITE_API_URL` kosong di static hosting | Isi `VITE_API_URL=https://flowdoro-api.onrender.com` di web env → redeploy web |
| Avatar upload `403 R2` | `R2_SECRET_ACCESS_KEY` salah / bucket name salah | Regenerate R2 API Token → copy lagi, pastikan `R2_BUCKET` exact |
| Email tidak kekirim `RESEND 401` | `RESEND_API_KEY=re_xxx` salah / domain belum verify | Test dengan `onboarding@resend.dev` dulu, verifikasi domain di Resend Dashboard |
| `relation does not exist` | `DATABASE_URL` point ke DB kosong tanpa migrate | `bun run --cwd apps/api db:migrate` via Render Shell |

> Jangan commit `.env` ke Git! Sudah di `.gitignore`. Commit hanya `.env.example` (template). Jika `.env` ter-commit, rotate `JWT_SECRET` segera.

---

## 13. Referensi File

- `apps/api/src/config/env.ts:3-23` — satu-satunya reader env (`dotenv/config`, `process.env` tidak dipakai langsung di file lain — `AGENTS.md:41`)
- `.env.example:1-27` — template lengkap
- `render.yaml:9-23` — env production api (`DATABASE_URL` fromDatabase, `JWT_SECRET sync:false`, `CORS_ORIGIN`, `COOKIE_SECURE`)
- `apps/web/vite.config.ts:6-15` — `loadEnv` + `conditions: ['browser','svelte']` + alias `$lib`
- `apps/web/src/lib/api/client.ts:1` — `VITE_API_URL` build-time
- `docker-compose.yml:3-10` — local DB default `flowdoro:flowdoro@postgres:5432/flowdoro`
