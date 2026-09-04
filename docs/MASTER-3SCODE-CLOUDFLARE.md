# MASTER — 3scode.my.id + Subdomain x Cloudflare (Anti-DDoS) — Vercel + Exabytes + Cloudflare

> **Tujuan lu:** 1 domain utama `3scode.my.id` + **subdomain per proyek** (`flowdoro.3scode.my.id`, `proyek2.3scode.my.id`, dst) — semua **terintegrasi Cloudflare** buat keamanan & anti-DDoS, tapi hosting tetep bisa **Vercel** (portofolio & proyek lama), **Cloudflare Pages** (Flowdoro web), **Cloudflare Workers** (Flowdoro API), bahkan **Exabytes** kalau perlu.
>
> **Status sekarang (dari investigasi):**
> - Domain `3scode.my.id` terdaftar via **Exabytes.co.id** (registrar), DNS Manager di Exabytes aktif.
> - Cloudflare → `Domains → 3scode.my.id → Invalid nameservers` — artinya lu udah **Add domain** di Cloudflare tapi **NS di Exabytes belum diganti** ke `arushi`/`corey`, jadi Cloudflare gak bisa kelola.
> - `dig` + `curl` nunjukin `3scode.my.id` `A 216.198.79.1` (Vercel IP) + `www CNAME 3scode.my.id` → portofolio Vercel masih di Vercel DNS/Exabytes.
>
> **Hasil akhir setelah guide ini:**
> - `3scode.my.id` + `www.3scode.my.id` → Vercel (portofolio) **tapi lewat Cloudflare proxy** (orange cloud) → DDoS + WAF aktif.
> - `flowdoro.3scode.my.id` → Cloudflare Pages, `api.flowdoro.3scode.my.id` → Cloudflare Workers, `proyek-lain.3scode.my.id` → Vercel/Cloudflare Pages/Workers — semua di Cloudflare, 1 dashboard.

---

## 0. Arsitektur Target (Master)

```
                    ┌─ Exabytes (Registrar) ─┐
                    │  NS → arushi/corey.ns.cloudflare.com  │
                    └──────────┬─────────────┘
                               │
               ┌───────────────▼────────────────┐
               │  Cloudflare DNS (3scode.my.id) │  ← Anti-DDoS, WAF, Cache, SSL
               │  Proxy: orange cloud ☁️        │
               └───────┬──────────┬──────┬──────┘
                       │          │      │
         ┌─────────────┘      ┌───▼──┐ ┌─▼─────────────────┐
         │                    │      │ │                   │
   3scode.my.id          flowdoro  api.flowdoro   proyek2.3scode.my.id
   www.3scode.my.id      (Pages)  (Workers)      (Vercel/Pages)
         │                    │      │             │
         ▼                    ▼      ▼             ▼
      Vercel              Pages  Workers        Vercel/Pages
   (portofolio)         (web)    (api)         (proyek lain)
```

**Tabel mapping (isi sesuai proyek lu, contoh):**

| Subdomain | Tujuan | Hosting | Cloudflare | Vercel Project | Catatan |
|-----------|--------|---------|------------|----------------|---------|
| `3scode.my.id` (root) | Portofolio | Vercel | `A 76.76.21.21` / `CNAME cname.vercel-dns.com` → Proxied | `3scode-portfolio` | Jangan hapus |
| `www.3scode.my.id` | Portofolio alias | Vercel | `CNAME cname.vercel-dns.com` → Proxied | `3scode-portfolio` | Redirect ke root |
| `flowdoro.3scode.my.id` | Flowdoro Web | **Cloudflare Pages** `flowdoro-web` | `CNAME flowdoro-web.pages.dev` → Proxied | — | Sudah deploy `fdd1106c` |
| `api.flowdoro.3scode.my.id` | Flowdoro API | **Cloudflare Workers** `flowdoro-api` | `CNAME workers.dev` / Custom Domain → Proxied | — | `e0f8f3e4...` D1 |
| `proyek2.3scode.my.id` | Proyek lain #2 | Vercel | `CNAME cname.vercel-dns.com` → Proxied | `nama-project-vercel` | Tambah per proyek |
| `proyek3.3scode.my.id` | Proyek lain #3 | Cloudflare Pages | `CNAME xxx.pages.dev` → Proxied | — | Opsional |

> **Aturan:** Semua subdomain yang mau lewat Cloudflare **harus `Proxied` (orange cloud)** biar DDoS + WAF aktif. Kalau `DNS only` (abu) → cuma DNS, gak ada proteksi.

---

## 1. Prasyarat

- [ ] Akun Cloudflare `email.trisno.sanjaya@gmail.com` (ID `63f3dbee...` — sudah login `wrangler whoami` ✅)
- [ ] Domain `3scode.my.id` di **Exabytes** → akses `DNS Manager` + `Manage Nameservers`
- [ ] Akun Vercel (portofolio + proyek lain) → akses `Settings → Domains`
- [ ] `flowdoro-web` (Pages) + `flowdoro-api` (Workers) sudah deploy ✅ (`ac8fb9c4`, `fdd1106c`)

---

## 2. Step 1 — Siapkan Cloudflare (Dapatkan NS yang Benar)

1. Login `https://dash.cloudflare.com` → pilih `3scode.my.id`.
2. Kalau `Status: Invalid nameservers` → klik `Check nameservers` atau `DNS` → liat **2 NS** yang diminta Cloudflare (biasanya `arushi.ns.cloudflare.com` + `corey.ns.cloudflare.com` — catat, **jangan pakai `ns1.vercel-dns.com`**).
3. **Jangan hapus domain** di Cloudflare, biarin `Invalid` dulu sampai step 3.

**Verifikasi:**
```bash
# di Cloudflare Dashboard → Overview → copy Nameservers
# atau via API (nanti)
dig 3scode.my.id NS +short
# sekarang masih ns1.vercel-dns.com → nanti harus jadi arushi/corey setelah step 3
```

---

## 3. Step 2 — Backup DNS Lama di Vercel/Exabytes (Wajib, Biar Gak Down)

Sebelum ganti NS, **capture dulu** semua record yang ada di **Vercel DNS** dan **Exabytes DNS Manager** biar bisa recreate 1:1 di Cloudflare.

**Di Vercel:**
1. `vercel.com` → pilih project `3scode-portfolio` (portofolio) → `Settings` → `Domains` → liat `3scode.my.id` + `www.3scode.my.id` → catat `A` `76.76.21.21` atau `CNAME cname.vercel-dns.com` yang Vercel minta.
2. `Vercel Dashboard → 3scode.my.id → DNS` (kalau pakai Vercel DNS) → screenshot semua `A`, `CNAME`, `MX`, `TXT`.

**Di Exabytes:**
1. `exabytes.co.id/members` → `Domain → 3scode.my.id → DNS Management` → screenshot semua `A`, `CNAME`, `MX`, `TXT`.
2. Contoh yang lu kirim:
   ```
   @ A 14400 216.198.79.1
   www CNAME 14400 3scode.my.id
   ```
   Catat juga `MX` buat email (kalau ada), `TXT` SPF/DKIM.

**Simpan di file** `docs/domains/backup-dns-3scode.my.id.txt` (buat rollback).

---

## 4. Step 3 — Ganti Nameservers di Exabytes (Registrar) ke Cloudflare

> **Ini step paling krusial.** Sekali ganti, semua DNS `3scode.my.id` bakal dikelola Cloudflare (bukan Exabytes/Vercel lagi). Butuh 5 menit - 24 jam propagasi.

1. **Exabytes → Domain → 3scode.my.id → Manage Nameservers** (atau `Update Nameservers` / `Custom Nameservers`):
   - Pilih `Custom Nameservers` / `Use Cloudflare Nameservers`.
   - Isi:
     - `NS1: arushi.ns.cloudflare.com`
     - `NS2: corey.ns.cloudflare.com`
   - *Hapus* `ns1.vercel-dns.com` + `ns2.vercel-dns.com` + `ns1.exabytes` kalau ada.
   - Save.

2. **Tunggu propagasi:**
```bash
# cek tiap 5 menit
dig 3scode.my.id NS +short
# harus jadi:
# arushi.ns.cloudflare.com.
# corey.ns.cloudflare.com.

# cek status Cloudflare
# dash.cloudflare.com → 3scode.my.id → Overview → Status harus dari Invalid → Active (hijau) dalam 10-60 menit
# atau via wrangler (cek manual di dashboard)
```

3. **Jangan panik kalau `3scode.my.id` sempat 521/404 5-10 menit** — itu DNS lagi propagasi. Selama lu udah backup step 2, bisa recreate.

---

## 5. Step 4 — Recreate DNS di Cloudflare (Biar Portofolio & Proyek Lama Tetap Jalan)

Setelah `Status: Active`, **semua DNS sekarang di Cloudflare**, bukan di Vercel/Exabytes lagi. Lu harus recreate manual biar `3scode.my.id` + `www` + proyek lain tetep ke Vercel.

**Cloudflare → 3scode.my.id → DNS → Records → Add record:**

**A. Root & www (portofolio Vercel) — Wajib biar gak down:**
| Type | Name | Content | Proxy | TTL | Catatan |
|------|------|---------|-------|-----|---------|
| `A` | `@` | `76.76.21.21` | `Proxied` | Auto | Vercel `A` untuk root (cek di Vercel → Domains → `76.76.21.21` atau `76.223.126.88` — pakai yang Vercel kasih) |
| `A` | `@` | `76.223.126.88` | `Proxied` | Auto | Vercel butuh 2 A untuk root (kadang) |
| `CNAME` | `www` | `cname.vercel-dns.com` | `Proxied` | Auto | Vercel `www` |
| *Alternatif* | `CNAME` | `www` | `3scode.my.id` | `Proxied` | kalau Vercel minta `www → 3scode.my.id` |

> **Cek di Vercel:** `Vercel → 3scode-portfolio → Settings → Domains → 3scode.my.id` → Vercel bakal kasih instruksi `A 76.76.21.21` atau `CNAME`. Ikutin itu, tapi `Proxy: orange cloud` di Cloudflare.

**B. Flowdoro (Pages + Workers):**
| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| `CNAME` | `flowdoro` | `flowdoro-web.pages.dev` | `Proxied` | Auto |
| `CNAME` | `api.flowdoro` | `flowdoro-api.email-trisno-sanjaya.workers.dev` | `Proxied` | Auto |

*Atau lebih simpel:* **Jangan tambah manual** — biar Cloudflare Pages/Workers yang auto buat pas lu Add Custom Domain (step 5). Mereka bakal auto tambah `CNAME` + `Proxied`.

**C. Proyek lain di Vercel (contoh):**
| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| `CNAME` | `proyek2` | `cname.vercel-dns.com` | `Proxied` | Auto | → nanti di Vercel `proyek2.3scode.my.id` Add Domain |
| `CNAME` | `proyek3` | `cname.vercel-dns.com` | `Proxied` | Auto |

**D. Email & TXT (jangan lupa):**
- Kalau ada `MX` (`mail.3scode.my.id` / Google Workspace) → recreate `MX` + `TXT` SPF `v=spf1 ...` + `DKIM` di Cloudflare, biar email gak down.
- `TXT` verifikasi Vercel (`_vercel` / `vercel-domain-verification`) kalau diminta.

**Verifikasi DNS Cloudflare:**
```bash
dig flowdoro.3scode.my.id +short # → 104.21.x.x (Cloudflare)
dig api.flowdoro.3scode.my.id +short # → 104.21.x.x
dig 3scode.my.id +short # → 104.21.x.x (bukan 216.198.79.1 lagi, karena sekarang Proxied)
dig www.3scode.my.id +short
```

---

## 6. Step 5 — Hubungkan Vercel Proyek ke Subdomain Baru (Cloudflare DNS)

Untuk **setiap proyek Vercel** yang mau pakai `*.3scode.my.id`:

1. **Vercel → Project → Settings → Domains → Add** → ketik `proyek2.3scode.my.id` → `Add`.
2. Vercel bakal detect DNS sekarang di Cloudflare, suruh verifikasi `CNAME` / `TXT`. Karena lu udah tambah `CNAME proyek2 → cname.vercel-dns.com` di Cloudflare (step 4C), klik `Refresh` → `Valid Configuration` → `Active` (2-5 menit, SSL auto via Vercel + Cloudflare).
3. **Uji:** `https://proyek2.3scode.my.id` → harus `200` + `cf-ray` header (Cloudflare) + Vercel content.

**Untuk portofolio `3scode.my.id` + `www`:**
- Vercel → `3scode-portfolio` → `Domains` → `3scode.my.id` + `www.3scode.my.id` harus udah `Valid`. Kalau sebelumnya pakai Vercel DNS, setelah pindah NS ke Cloudflare, Vercel bakal minta re-verifikasi `A`/`CNAME` di Cloudflare — ikutin instruksi Vercel (biasanya `A 76.76.21.21`).

---

## 7. Step 6 — Hubungkan Cloudflare Pages & Workers ke Subdomain

**A. Pages `flowdoro-web` → `flowdoro.3scode.my.id`:**
1. `dash.cloudflare.com` → `Workers & Pages` → `flowdoro-web` → `Custom domains` → `Set up a custom domain` → `flowdoro.3scode.my.id` → `Continue` → `Activate`.
2. Tunggu `Initializing` → `Active` (1-3 menit, SSL auto `*.3scode.my.id`).
3. **Test:** `curl -I https://flowdoro.3scode.my.id` → `200` + `cf-ray`, `curl https://flowdoro.3scode.my.id | grep "<title>"` → `Flowdoro`.

**B. Workers `flowdoro-api` → `api.flowdoro.3scode.my.id`:**
1. `Workers & Pages` → `flowdoro-api` → `Settings` → `Triggers` → `Custom Domains` → `Add Custom Domain` → `api.flowdoro.3scode.my.id` → `Add`.
2. Tunggu `Active`.
3. **Test:** `curl https://api.flowdoro.3scode.my.id/api/health | jq` → `{"success":true}`.

**Alternatif via `wrangler.toml` (jika mau via code, bukan Dashboard):**
```toml
# apps/api-cloudflare/wrangler.toml (tambah di bawah [[d1_databases]])
[[routes]]
pattern = "api.flowdoro.3scode.my.id/*"
zone_name = "3scode.my.id"

# atau untuk single domain flowdoro.3scode.my.id/api/* (Opsi B)
# [[routes]]
# pattern = "flowdoro.3scode.my.id/api/*"
# zone_name = "3scode.my.id"
```
Lalu `bunx wrangler --cwd apps/api-cloudflare deploy src/index.ts` (Dashboard `Custom Domains` dan `routes` di file jangan dua-duanya, pilih salah satu).

---

## 8. Step 7 — Update Config Biar Domain Baru Kepake (Wajib Deploy Ulang)

**A. `apps/api-cloudflare/wrangler.toml` `[vars]`:**
```toml
APP_URL = "https://flowdoro.3scode.my.id"
CORS_ORIGIN = "https://flowdoro.3scode.my.id"
BETTER_AUTH_URL = "https://api.flowdoro.3scode.my.id"
GOOGLE_REDIRECT_URI = "https://api.flowdoro.3scode.my.id/api/google/callback"
# GOOGLE_CLIENT_ID tetap
```

**B. `deploy-web.sh` + `.env.example`:**
```bash
# deploy-web.sh:6
export VITE_API_URL=https://api.flowdoro.3scode.my.id

# .env.example
APP_URL=https://flowdoro.3scode.my.id
CORS_ORIGIN=https://flowdoro.3scode.my.id
BETTER_AUTH_URL=https://api.flowdoro.3scode.my.id
VITE_API_URL=https://api.flowdoro.3scode.my.id
GOOGLE_REDIRECT_URI=https://api.flowdoro.3scode.my.id/api/google/callback
```

**C. `apps/api-cloudflare/src/lib/auth.ts:12` `trustedOrigins`:**
```ts
trustedOrigins: [
  env.CORS_ORIGIN, // https://flowdoro.3scode.my.id
  "https://flowdoro.3scode.my.id",
  "https://api.flowdoro.3scode.my.id",
  "https://www.3scode.my.id",
  "https://3scode.my.id",
  "http://localhost:5173",
  baseURL,
].filter(Boolean)
```

**D. Deploy:**
```bash
bun run --cwd apps/api-cloudflare typecheck
bunx wrangler --cwd apps/api-cloudflare deploy src/index.ts
VITE_API_URL=https://api.flowdoro.3scode.my.id bash deploy-web.sh
# atau: VITE_API_URL=https://api.flowdoro.3scode.my.id bun run --cwd apps/web build && bunx wrangler pages deploy apps/web/dist --project-name=flowdoro-web
```

---

## 9. Step 8 — Update Google OAuth & Vercel Env

**Google Cloud Console** (`console.cloud.google.com` → project `15290290...`):
- `APIs & Services → Credentials → OAuth 2.0 Client ID` → `Authorized JavaScript origins` tambah:
  - `https://flowdoro.3scode.my.id`
  - `https://api.flowdoro.3scode.my.id`
- `Authorized redirect URIs` tambah:
  - `https://api.flowdoro.3scode.my.id/api/auth/callback/google`
  - `https://api.flowdoro.3scode.my.id/api/auth/callback/github` (kalau pakai GitHub)
  - `https://api.flowdoro.3scode.my.id/api/google/callback` (Calendar)
- Keep yang lama `https://flowdoro-api...workers.dev/...` biar gak break fallback, Save (5 menit propagasi).

**Vercel Env (untuk proyek yang pakai API_URL):**
- Kalau ada proyek Vercel lain yang `fetch` ke `https://flowdoro-api...workers.dev`, ganti ke `https://api.flowdoro.3scode.my.id` di `Vercel → Project → Settings → Environment Variables`.

---

## 10. Step 9 — Aktifkan Keamanan Cloudflare (Anti-DDoS)

Setelah `Status: Active` dan `Proxied` orange:

**Cloudflare → 3scode.my.id → Overview → SSL/TLS:**
- `SSL/TLS mode: Full (strict)` (kalau origin Vercel/Pages support, kalau `Flexible` juga jalan tapi `Full` lebih aman)
- `Edge Certificates → Always Use HTTPS: On` + `Automatic HTTPS Rewrites: On` + `Universal SSL: Enabled` (auto `*.3scode.my.id`)

**Security → Overview:**
- `Security Level: Medium` (atau `High` kalau lagi diserang)
- `Bot Fight Mode: On` (gratis, block bot jahat)
- `DDoS → Network` + `HTTP DDoS` auto aktif kalau `Proxied` (Cloudflare L3/L7 protection, gak perlu setting)
- `WAF → Managed Rules: On` (OWASP + Cloudflare Managed, block SQLi/XSS)

**Security → WAF → Custom Rules (opsional, contoh):**
- `Rate Limiting: 100 req / 10s per IP` untuk `api.flowdoro.3scode.my.id/api/auth/*` → `Block` 1 jam (cegah brute force, mirip `rateLimit` di `auth.ts:119`)
- `Bot Fight Mode` + `DDoS` udah cukup buat portofolio.

**Speed → Caching:**
- `Caching Level: Standard`, `Browser Cache TTL: 4 hours`
- `Cache Rules` untuk `flowdoro.3scode.my.id/*` → `Cache static` (Pages udah cache, tapi Cloudflare cache tambahan)

**Network:**
- `HTTP/2`, `HTTP/3 (QUIC)`, `0-RTT`, `gRPC` → On (default)
- `WebSockets: On` (kalau Flowdoro pakai realtime nanti)

**Verifikasi proteksi:**
```bash
curl -I https://flowdoro.3scode.my.id | grep -i "cf-ray\|server: cloudflare"
curl -I https://api.flowdoro.3scode.my.id/api/health | grep -i "cf-ray"
# harus ada cf-ray, server: cloudflare → berarti lewat proxy, DDoS aktif
```

---

## 11. Checklist Verifikasi Akhir (Master)

- [ ] `dig 3scode.my.id NS +short` → `arushi.ns.cloudflare.com` + `corey.ns.cloudflare.com` (bukan `ns1.vercel-dns.com`) → Cloudflare `Status: Active` hijau
- [ ] `dig flowdoro.3scode.my.id +short` → `104.21.x.x` / `172.67.x.x` (Cloudflare) + `curl -I https://flowdoro.3scode.my.id` → `200` + `cf-ray` + `<title>Flowdoro`
- [ ] `dig api.flowdoro.3scode.my.id +short` → `104.21.x.x` + `curl https://api.flowdoro.3scode.my.id/api/health | jq` → `200`
- [ ] `https://3scode.my.id` + `https://www.3scode.my.id` (portofolio Vercel) → `200` via Cloudflare proxy (cek `cf-ray`)
- [ ] `https://proyek2.3scode.my.id` (Vercel lain) → `200` (kalau ada)
- [ ] `POST https://api.flowdoro.3scode.my.id/api/auth/sign-up/email` `Origin: https://flowdoro.3scode.my.id` → `200 + SameSite=None` + `GET /api/me` + cookie → `200` (sudah fix `ac8fb9c4`)
- [ ] `GET https://api.flowdoro.3scode.my.id/api/tasks` setelah `logout → login` → data `42` persist (bug kemarin)
- [ ] Google OAuth `https://flowdoro.3scode.my.id` login via Google → redirect `https://api.flowdoro.../api/auth/callback/google` → `200`
- [ ] Cloudflare `Security → Events` muncul log WAF/DDoS kalau ada serangan

---

## 12. Perintah Siap Copy-Paste (Master)

```bash
# 0. Cek NS sekarang
dig 3scode.my.id NS +short
dig 3scode.my.id A +short
dig www.3scode.my.id CNAME +short

# 1. Backup DNS lama (Vercel/Exabytes) sebelum ganti NS
# Simpan di docs/domains/backup-dns-3scode.my.id.txt

# 2. Ganti NS di Exabytes (registrar) → arushi/corey
# Exabytes → Domain → 3scode.my.id → Manage Nameservers → Custom → arushi.ns.cloudflare.com + corey.ns.cloudflare.com

# 3. Tunggu Active
# dash.cloudflare.com → 3scode.my.id → Overview → Status: Active
# atau: watch -n 30 'dig 3scode.my.id NS +short'

# 4. Recreate DNS di Cloudflare (biar Vercel portofolio gak down)
# Cloudflare → DNS → Add record:
# @ A 76.76.21.21 Proxied (Vercel)
# @ A 76.223.126.88 Proxied
# www CNAME cname.vercel-dns.com Proxied
# flowdoro CNAME flowdoro-web.pages.dev Proxied
# api.flowdoro CNAME flowdoro-api.email-trisno-sanjaya.workers.dev Proxied
# proyek2 CNAME cname.vercel-dns.com Proxied

# 5. Hubungkan Pages & Workers
# Pages: Workers & Pages → flowdoro-web → Custom domains → flowdoro.3scode.my.id
# Workers: Workers & Pages → flowdoro-api → Settings → Triggers → Custom Domains → api.flowdoro.3scode.my.id

# 6. Update config & deploy
# apps/api-cloudflare/wrangler.toml → APP_URL, CORS_ORIGIN, BETTER_AUTH_URL, GOOGLE_REDIRECT_URI
# deploy-web.sh → VITE_API_URL
bun run --cwd apps/api-cloudflare typecheck
bunx wrangler --cwd apps/api-cloudflare deploy src/index.ts
VITE_API_URL=https://api.flowdoro.3scode.my.id bash deploy-web.sh

# 7. Update Google OAuth
# console.cloud.google.com → Credentials → OAuth Client → Origins + Redirect URIs tambah flowdoro.3scode.my.id + api.flowdoro...

# 8. Verifikasi
curl -s https://api.flowdoro.3scode.my.id/api/health | jq
curl -s https://flowdoro.3scode.my.id | grep -o "<title>.*</title>"
dig flowdoro.3scode.my.id +short
dig api.flowdoro.3scode.my.id +short
curl -s -i -X POST https://api.flowdoro.3scode.my.id/api/auth/sign-up/email -H "Content-Type: application/json" -H "Origin: https://flowdoro.3scode.my.id" -d '{"name":"Test","email":"test@3scode.my.id","password":"password123"}' | grep -i SameSite

# 9. Rollback kalau perlu
# Exabytes → ganti NS balik ke ns1.vercel-dns.com
# atau Cloudflare → DNS → hapus CNAME flowdoro/api.flowdoro
```

---

## 13. Rollback Cepat

```bash
# Kalau flowdoro.3scode.my.id 521 atau portofolio down:
# 1. Cloudflare → DNS → hapus CNAME flowdoro / api.flowdoro
# 2. Exabytes → ganti NS balik ke ns1.vercel-dns.com / ns2.vercel-dns.com
# 3. wrangler.toml balik:
# APP_URL=https://flowdoro-web.pages.dev
# CORS_ORIGIN=https://flowdoro-web.pages.dev
# BETTER_AUTH_URL=https://flowdoro-api.email-trisno-sanjaya.workers.dev
# VITE_API_URL=https://flowdoro-api.email-trisno-sanjaya.workers.dev
# bunx wrangler deploy + bash deploy-web.sh
# 4. Google OAuth hapus redirect baru
```

---

**File ini di `docs/MASTER-3SCODE-CLOUDFLARE.md` (master) + `docs/flowdoro.3scode.my.id.md` (khusus Flowdoro, sudah ada).** Mau gue eksekusi **Step 3 Ganti NS** sekarang atau lu mau cek dulu di Exabytes `DNS Manager` + Vercel `Domains`? Bilang `gass master` kalau mau gue yang handle sampai `Active` + deploy.
