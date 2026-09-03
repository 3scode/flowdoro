# TEST - RUN - BUILD — Flowdoro

Panduan step-by-step untuk menjalankan di local, mengetes, dan memastikan build siap deploy. Semua perintah **wajib pakai `bun`** (jangan `npm`/`node`).

> Stack: Svelte 5 + Vite 6 + Tailwind 4 (web) + Bun + Elysia 1.4 (api) + **Hono 4 + Appwrite Web SDK** (Cloudflare Workers API) + Appwrite Cloud (Auth + DB + Storage) + Docker + Hugging Face Spaces. Sejak T-APPW, tidak ada lagi PostgreSQL/Drizzle/JWT/R2.

---

## 1. Prasyarat

```bash
bun --version        # butuh >= 1.1 (teruji di 1.3.14)
git --version
npx wrangler --version  # untuk CF Workers deployment
```

Port yang dipakai:
- `3000` → API (Elysia/HF Spaces)
- `5173` → Web (Vite)
- `8787` → API Cloudflare Workers local dev (wrangler)

Pastikan port kosong:
```bash
lsof -i :3000 -i :5173 -i :8787 2>/dev/null || ss -tulpn | grep -E '3000|5173|8787'
```

---

## 2. Setup Awal (sekali per clone)

```bash
git clone <repo-url> flowdoro
cd flowdoro

# 2.1 Install dependencies — dari root (workspaces ke-hoist ke root node_modules)
bun install

# 2.2 Buat file env — satu file di root
cp .env.example .env
# Isi APPWRITE_PROJECT_ID + APPWRITE_API_KEY (lihat env.md §2)
```

> `apps/api/src/config/env.ts` membaca `.env` via `dotenv/config` untuk HF Spaces.
> `apps/api-cloudflare/src/lib/env.ts` membaca `process.env` langsung — Workers inject vars sendiri.

---

## 3. Siapkan Appwrite Cloud (sekali)

1. Konsol → https://cloud.appwrite.io → buat project (region **Singapore**).
2. Buat database `flowdoro` + 4 collections (`profiles`, `tasks`, `sessions`, `session_events`) + index — detail atribut di `env.md` §2.
3. Buat bucket `avatars` (Storage).
4. Buat API key (scope users/databases/storage/account read+write) → isi `APPWRITE_API_KEY`.
5. Isi `.env` dengan nilai tersebut.

**Seed demo** (user `demo@flowdoro.app` / `password123` + 5 tasks + 15 sessions):
```bash
bun run --cwd apps/api seed:dev
```

---

## 4. Jalankan di Local

### 4.1 Elysia API (HF Spaces) + Web

```bash
# API di :3000
bun run dev:api

# Web di :5173 (proxy /api → API_URL)
bun run dev:web
```

Verifikasi cepat:
```bash
curl http://localhost:3000/api/health
# → {"success":true,"data":{"status":"ok","service":"flowdoro-api",...}}
```

### 4.2 Cloudflare Workers API + Web

```bash
# API di :8787 (wrangler)
bun run dev:api:cf

# Web di :5173 (proxy /api → http://localhost:8787)
API_URL=http://localhost:8787 bun run dev:web
```

> Env `APPWRITE_*` sudah di-set di `wrangler.toml` → akan terbaca otomatis saat `wrangler dev`. Untuk override lokal, buat `.dev.vars`:
> ```bash
> cp .env.example .dev.vars
> # edit APPWRITE_* sesuai project kamu
> ```

Verifikasi:
```bash
curl http://localhost:8787/api/health
```

---

## 5. Verifikasi Build (WAJIB lolos sebelum handoff)

```bash
# Typecheck semua — API lama + Workers baru
bun run typecheck

# Build API bundle (Elysia/HF)
bun run --cwd apps/api build

# Build Workers bundle (dry-run, validasi wrangler)
bun run --cwd apps/api-cloudflare deploy --dry-run

# Build Web — wajib lolos (menangkap error alias $lib + Tailwind)
bun run --cwd apps/web build

# Docker build API (context apps/api)
docker build -f apps/api/Dockerfile apps/api -t flowdoro-api
```

---

## 6. Deploy

### 6.1 Cloudflare Workers (Recommended)

Deploy API ke Cloudflare Workers — serverless, no CC, global CDN.

```bash
# 1. Login (sekali)
bunx wrangler login

# 2. Deploy
bun run deploy:cf
# atau: bash deploy-cf.sh
# atau manual: bun run --cwd apps/api-cloudflare deploy
```

Setelah deploy, API tersedia di:
```
https://flowdoro-api.<your-account>.workers.dev
```

**Setup ENV vars di Dashboard:**
Workers & Pages → flowdoro-api → Settings → Variables → Add:

| Variable | Contoh Nilai |
|---|---|
| `APPWRITE_ENDPOINT` | `https://sgp.cloud.appwrite.io/v1` |
| `APPWRITE_PROJECT_ID` | `<project-id>` |
| `APPWRITE_DATABASE_ID` | `<db-id>` |
| `APPWRITE_COLLECTION_PROFILES` | `profiles` |
| `APPWRITE_COLLECTION_TASKS` | `tasks` |
| `APPWRITE_COLLECTION_SESSIONS` | `sessions` |
| `APPWRITE_COLLECTION_EVENTS` | `session_events` |
| `APPWRITE_BUCKET_AVATARS` | `avatars` |
| `CORS_ORIGIN` | `https://<web-url>` |
| `NODE_ENV` | `production` |

**Secret** (tidak terlihat publik):
| Secret | Nilai |
|---|---|
| `APPWRITE_API_KEY` | Server API key (role users/databases/storage/account) |

### 6.2 Hugging Face Spaces (Fallback — Docker)

Flowdoro deploy ke HF Spaces gratis tanpa kartu kredit. **API** = Space Docker (port wajib **7860**), **DB/Auth/Storage** = Appwrite Cloud (no CC), **Web** = Space Static **atau** Cloudflare Pages / Netlify / Vercel (semuanya no CC).

#### 6.2.1 Space `flowdoro-api` (Docker)

1. hugginface.co → **New Space**:
   - Owner / Space name: `flowdoro-api`
   - License: MIT
   - **Docker** (bukan Gradio) → `Dockerfile` di root repo (sudah `EXPOSE 7860`)
2. Push repo → HF build Space dari `Dockerfile` root.
3. Set **Settings → Variables and secrets**:

   **Variables** (terlihat publik — jangan taruh rahasia):
   | Variable | Nilai |
   |---|---|
   | `PORT` | `7860` |
   | `NODE_ENV` | `production` |
   | `APPWRITE_ENDPOINT` | `https://cloud.appwrite.io/v1` |
   | `APPWRITE_PROJECT_ID` | `<project-id>` |
   | `APPWRITE_DATABASE_ID` | `flowdoro` |
   | `APPWRITE_COLLECTION_PROFILES` | `profiles` |
   | `APPWRITE_COLLECTION_TASKS` | `tasks` |
   | `APPWRITE_COLLECTION_SESSIONS` | `sessions` |
   | `APPWRITE_COLLECTION_EVENTS` | `session_events` |
   | `APPWRITE_BUCKET_AVATARS` | `avatars` |
   | `CORS_ORIGIN` | `https://<username>-flowdoro-web.hf.space` (atau URL web) |
   | `APP_URL` | URL web |
   | `API_URL` | `https://<username>-flowdoro-api.hf.space` |
   | `LOG_LEVEL` | `info` |

   **Secret** (wajib, tidak terlihat publik):
   | Secret | Nilai |
   |---|---|
   | `APPWRITE_API_KEY` | Server API key dari Console (role users/databases/storage/account) |

4. **Factory reboot** setelah set env.

> Catatan: HF Spaces *pause* setelah 48h tanpa aktivitas; Appwrite Cloud juga pause setelah ~1 minggu idle. Untuk keep warm, set cron terjadwal `GET /api/health` (mis. GitHub Actions / UptimeRobot) setiap beberapa jam.

#### 6.2.2 Seed data di production (opsional)

```bash
# dari lokal, pakai APPWRITE_* yang menunjuk ke project production
bun run --cwd apps/api seed:dev
```

#### 6.2.3 Space Web / Static

Build `apps/web/dist` dengan `VITE_API_URL=https://<username>-flowdoro-api.hf.space`, lalu deploy sebagai HF **Static Space** atau Cloudflare Pages / Netlify / Vercel.

---

## 7. Troubleshooting / FAQ

| Gejala | Penyebab | Solusi |
|---|---|---|
| Container crash `APPWRITE_PROJECT_ID missing` | `APPWRITE_PROJECT_ID` belum di-set | Set di Space Variables → Factory reboot |
| API log `AppwriteException ... 401 Unauthorized` saat akses DB | `APPWRITE_API_KEY` salah/expired / scope kurang | Cek API key di Console, pastikan scope users/databases/storage/account read+write |
| Web `401` terus / `CORS error` | `CORS_ORIGIN` tidak exact match URL Web | Set `CORS_ORIGIN` = URL web persis → Factory reboot |
| Login sukses tapi refresh jadi logout | Cookie `token` (session secret) tidak terkirim | Pastikan `NODE_ENV=production` (cookie `secure`) + `CORS_ORIGIN` benar + no 3rd-party cookie block |
| `/api/health` ok tapi `/api/me` 401 | Session expired (7d) / cookie hilang | Login ulang |
| File avatar 4xx | Bucket `avatars` belum dibuat / file ekstensi tidak diizinkan | Buat bucket + set `jpg,jpeg,png,webp` |
| Sleep/cold start lambat (10-30s) | HF + Appwrite pause idle | Cron keep-warm `GET /api/health` |
| Wrangler deploy gagal `missing APPWRITE_API_KEY` | Secret belum di-set di Dashboard | Workers → flowdoro-api → Settings → Bindings → Add Secret |
| `setDevKey not a function` saat local dev | SDK appwrite v26 berubah API | Pastikan appwrite@^26.2.0 terinstall di `apps/api-cloudflare/node_modules` |

---

## 8. Checklist Handoff (diminta user)

- [ ] `bun run typecheck` → EXIT 0 (termasuk api-cloudflare)
- [ ] `bun run --cwd apps/api build` → sukses (bundle `dist/index.js`)
- [ ] `bun run --cwd apps/api-cloudflare deploy --dry-run` → sukses (validasi wrangler)
- [ ] `bun run --cwd apps/web build` → sukses
- [ ] `docker build -f apps/api/Dockerfile apps/api` → sukses
- [ ] `curl http://localhost:3000/api/health` (Elysia) → `{success:true,...}`
- [ ] `curl http://localhost:8787/api/health` (CF Workers local) → `{success:true,...}`
- [ ] E2E `curl`: register → login → `GET /api/me` → create task → create session → patch completed → analytics summary
- [ ] `.env.hf.api` sudah berisi `APPWRITE_*`; `APPWRITE_API_KEY` = **Secret** di Space
- [ ] Workers dashboard: `APPWRITE_API_KEY` = **Secret**, `CORS_ORIGIN` + `APPWRITE_*` = **Variables**

> Env HF diringkas di **Space → Settings → Variables and secrets**. Variabel **wajib Secret**: `APPWRITE_API_KEY`. File `render.yaml.deprecated` disimpan untuk referensi migrasi balik ke Render jika butuh. Fly config (`fly.toml`, `deploy-fly.sh`) sudah dihapus — migrasi penuh ke Cloudflare Workers.
