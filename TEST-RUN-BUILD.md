# TEST - RUN - BUILD — Flowdoro

Panduan step-by-step untuk menjalankan di local, mengetes, dan memastikan build siap deploy. Semua perintah **wajib pakai `bun`** (jangan `npm`/`node`).

> Stack: Svelte 5 + Vite 6 + Tailwind 4 (web) + **Hono 4 + Appwrite Web SDK** (Cloudflare Workers API) + Appwrite Cloud (Auth + DB + Storage). Collection: `profiles`, `tasks`, `sessions`, `session_events`, `lists` + bucket `avatars`. Tidak ada Docker/HF lagi — full Cloudflare.

---

## 1. Prasyarat

```bash
bun --version        # butuh >= 1.1 (teruji di 1.3.14)
git --version
npx wrangler --version  # untuk CF Workers deployment
```

Port yang dipakai:
- `8787` → API Cloudflare Workers local dev (wrangler)
- `5173` → Web (Vite)

Pastikan port kosong:
```bash
lsof -i :5173 -i :8787 2>/dev/null || ss -tulpn | grep -E '5173|8787'
```

---

## 2. Setup Awal (sekali per clone)

```bash
git clone <repo-url> flowdoro
cd flowdoro

# 2.1 Install dependencies — dari root (workspaces ke-hoist ke root node_modules)
bun install

# 2.2 Buat file env — satu file di root + .dev.vars untuk wrangler
cp .env.example .env
cp .env .dev.vars
# Isi APPWRITE_PROJECT_ID + APPWRITE_API_KEY (lihat env.md §2)
```

> `apps/api-cloudflare/src/lib/env.ts` membaca `c.env` (Workers vars). Local `wrangler dev` baca `.dev.vars`.

---

## 3. Siapkan Appwrite Cloud (sekali)

1. Konsol → https://cloud.appwrite.io → buat project (region **Singapore**).
2. Buat database `flowdoro` + 5 collections (`profiles`, `tasks`, `sessions`, `session_events`, `lists`) + index — detail atribut di `env.md` §2.
3. Buat bucket `avatars` (Storage).
4. Buat API key (scope users/databases/storage/account read+write) → isi `APPWRITE_API_KEY`.
5. Isi `.env` + `.dev.vars` dengan nilai tersebut.

**Seed demo** (user `demo@flowdoro.app` / `password123` + 5 tasks + 15 sessions):
```bash
bun run seed:dev   # scripts/seed.mjs
```

---

## 4. Jalankan di Local

```bash
# API di :8787 (wrangler)
bun run dev:api

# Web di :5173 (proxy /api → http://localhost:8787)
bun run dev:web

# atau keduanya:
bun run dev
```

Verifikasi:
```bash
curl http://localhost:8787/api/health
# → {"success":true,"data":{"status":"ok","service":"flowdoro-api",...}}
```

---

## 5. Verifikasi Build (WAJIB lolos sebelum handoff)

```bash
# Typecheck
bun run typecheck

# Build Workers bundle (dry-run, validasi wrangler)
bun run --cwd apps/api-cloudflare deploy --dry-run

# Build Web — wajib lolos (menangkap error alias $lib + Tailwind)
bun run --cwd apps/web build
```

---

## 6. Deploy

### Cloudflare Workers

```bash
# 1. Login (sekali)
bunx wrangler login

# 2. Set secret (sekali, jangan commit)
bunx wrangler --cwd apps/api-cloudflare secret put APPWRITE_API_KEY

# 3. Deploy
bun run deploy:cf
# atau: bash deploy-cf.sh
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
| `APPWRITE_COLLECTION_LISTS` | `lists` |
| `APPWRITE_BUCKET_AVATARS` | `avatars` |
| `CORS_ORIGIN` | `https://flowdoro-web.pages.dev` |
| `FRONTEND_URL` | `https://flowdoro-web.pages.dev` |
| `NODE_ENV` | `production` |

**Secret** (tidak terlihat publik):
| Secret | Nilai |
|---|---|
| `APPWRITE_API_KEY` | Server API key (role users/databases/storage/account) |

### Cloudflare Pages (Web)

```bash
bash deploy-web.sh
# → build dengan VITE_API_URL=https://flowdoro-api...workers.dev lalu wrangler pages deploy
```

### Seed data di production (opsional)

```bash
# dari lokal, pakai APPWRITE_* yang menunjuk ke project production
bun run seed:dev
```

---

## 7. Troubleshooting / FAQ

| Gejala | Penyebab | Solusi |
|---|---|---|
| `401` terus / `CORS error` | `CORS_ORIGIN` tidak exact match URL Web | Set `CORS_ORIGIN` = `https://flowdoro-web.pages.dev` exact |
| Login sukses tapi refresh jadi logout | Cookie `token` tidak terkirim | Pastikan `CORS_ORIGIN` benar + no 3rd-party cookie block |
| `/api/health` ok tapi `/api/me` 401 | Session expired / secret salah | Login ulang, cek `APPWRITE_API_KEY` secret |
| File avatar 4xx | Bucket `avatars` belum dibuat | Buat bucket + set `jpg,jpeg,png,webp` |
| Wrangler deploy gagal `missing APPWRITE_API_KEY` | Secret belum di-set | `wrangler secret put APPWRITE_API_KEY` |
| `APPWRITE_DATABASE_ID` not found | Typo di `.dev.vars`/`wrangler.toml` | Cek `6a97dd7e002e7e71c54c` (harus `e7e71`) |

---

## 8. Checklist Handoff

- [ ] `bun run typecheck` → EXIT 0
- [ ] `bun run --cwd apps/api-cloudflare deploy --dry-run` → sukses (validasi wrangler)
- [ ] `bun run --cwd apps/web build` → sukses
- [ ] `curl http://localhost:8787/api/health` → `{success:true,...}`
- [ ] E2E `curl`: register → login → `GET /api/me` → create task → create list → analytics
- [ ] Workers dashboard: `APPWRITE_API_KEY` = **Secret**, `CORS_ORIGIN` + `APPWRITE_*` = **Variables**

## Ringkasan Script Deploy

| Script | Tujuan |
|---|---|
| `bun run deploy:cf` / `bash deploy-cf.sh` | API → Cloudflare Workers |
| `bash deploy-web.sh` | Web → CF Pages (build dengan URL hardcoded Workers API) |
| `bun run seed:dev` | Seed Appwrite Cloud (`scripts/seed.mjs`) |
