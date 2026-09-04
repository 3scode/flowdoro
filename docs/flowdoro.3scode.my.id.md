# Flowdoro — Custom Domain `flowdoro.3scode.my.id` — Step by Step

> **Tujuan:** Pindah dari `flowdoro-web.pages.dev` + `flowdoro-api.email-trisno-sanjaya.workers.dev` ke domain utama lu:
> - **Web (Pages):** `https://flowdoro.3scode.my.id`
> - **API (Workers):** `https://api.flowdoro.3scode.my.id`
>
> **Alternatif single-domain:** `flowdoro.3scode.my.id` (web) + `flowdoro.3scode.my.id/api/*` → proxy ke Workers (dibahas di Opsi B).
>
> **Stack:** Cloudflare Pages + Workers + D1 + Appwrite Cloud. Domain `3scode.my.id` sudah di Cloudflare NS (`arushi`/`corey` — cek `dig NS`) dan root `https://3scode.my.id` sekarang di Vercel (`216.198.79.*`, redirect ke `www`). Subdomain `flowdoro` akan kita arahkan ke Cloudflare (orange cloud) tanpa ganggu `www`.

---

## 0. Prasyarat & Info Saat Ini

| Item | Prod sekarang | Target |
|------|---------------|--------|
| Web | `https://flowdoro-web.pages.dev` (`fdd1106c...`) + `https://96f159ba...` | `https://flowdoro.3scode.my.id` |
| API | `https://flowdoro-api.email-trisno-sanjaya.workers.dev` (`ac8fb9c4`) | `https://api.flowdoro.3scode.my.id` |
| D1 | `flowdoro-auth` `e0f8f3e4-1755-48fe-9758-25e476ee5504` APAC | tetap |
| Cloudflare Account | `email.trisno.sanjaya@gmail.com` / `63f3dbee955a5ef0ad8a05c6cf15eba7` | sama |
| DNS 3scode.my.id | NS `arushi.ns.cloudflare.com` / `corey.ns.cloudflare.com` → Vercel `216.198.79.*` | tambah `flowdoro` + `api.flowdoro` (orange cloud) |

**File yang bakal diubah:**
- `apps/api-cloudflare/wrangler.toml:11` `[vars]` + `[[d1_databases]]` tetap, tambah `route` / `routes` untuk custom domain (opsional, bisa via Dashboard tanpa ubah file)
- `apps/web/vite.config.ts:6` tidak perlu (proxy dev), `deploy-web.sh:6` `VITE_API_URL` ganti
- `.env` / `.env.example` / `.dev.vars` + `wrangler secret` untuk prod vars
- Google Cloud Console OAuth redirect URIs
- Optional: `apps/api-cloudflare/src/lib/auth.ts:12` `trustedOrigins` (sudah include `flowdoro.3scode.my.id` kalau lu ikut step ini, tapi akan auto dari `CORS_ORIGIN`)

---

## 1. Ringkasan Arsitektur Target (Opsi A — Rekomendasi: 2 Subdomain)

```
Browser
  ├─ https://flowdoro.3scode.my.id  ──→  Cloudflare Pages (flowdoro-web, dist)
  │                                     VITE_API_URL=https://api.flowdoro.3scode.my.id
  │                                     fetch credentials:include → Set-Cookie SameSite=None; Secure (sudah fix ac8fb9c4)
  │
  └─ https://api.flowdoro.3scode.my.id/api/*  ──→  Cloudflare Workers (flowdoro-api)
                                                    D1 flowdoro-auth
                                                    → Appwrite Cloud sgp.cloud.appwrite.io/v1 (tasks/sessions/lists)
```

**Kenapa 2 subdomain?** Paling simpel, SSL auto, CORS 1 origin (`https://flowdoro.3scode.my.id`), `SameSite=None` tetap perlu karena `api.flowdoro` vs `flowdoro` masih cross-site (beda subdomain → dianggap cross-site untuk `SameSite=None`? Actually `flowdoro.3scode.my.id` vs `api.flowdoro.3scode.my.id` itu **same-site** (eTLD+1 `3scode.my.id` sama, beda subdomain → same-site, bukan cross-site). Jadi dengan 2 subdomain `flowdoro` + `api.flowdoro` keduanya `*.3scode.my.id` → **same-site**, bisa pakai `SameSite=Lax` lagi (lebih aman). Tapi kita sudah set `SameSite=None` untuk `workers.dev` vs `pages.dev` yang cross-site; setelah pindah ke `*.3scode.my.id` keduanya same-site, bisa balik ke `Lax` (opsional). Kode sekarang `baseURL.startsWith("https://") ? "none" : "lax"` akan tetap `None` untuk `https://api.flowdoro...` (karena `https`), jadi tetap `None` — aman untuk same-site juga (None lebih permissive). Bisa keep `None` atau ganti ke `Lax` biar lebih strict — gue set di step 4 biar Lax untuk same-site.

**Opsi B — Single domain `flowdoro.3scode.my.id` untuk web + api (`/api/*` proxy):**
- `flowdoro.3scode.my.id/*` → Pages
- `flowdoro.3scode.my.id/api/*` → Workers via Cloudflare Route `flowdoro.3scode.my.id/api/*` atau Pages `_redirects` proxy. Lebih clean (1 domain), tapi butuh Route + `VITE_API_URL=https://flowdoro.3scode.my.id` (tanpa `/api` prefix beda). Gue jelasin di §6.

**Pilih Opsi A dulu (paling gampang), Opsi B kalau mau 1 domain.**

---

## 2. Step 1 — Siapkan DNS di Cloudflare Dashboard (5 menit, tanpa downtime)

> Domain `3scode.my.id` sudah di Cloudflare (orange cloud), jadi cukup tambah DNS untuk subdomain. Gak ganggu `www.3scode.my.id` (Vercel).

1. Login `https://dash.cloudflare.com` → pilih `3scode.my.id` (Account `Email.trisno...`).
2. **DNS → Records → Add record:**
   - **Web:** `Type: CNAME`, `Name: flowdoro`, `Target: flowdoro-web.pages.dev`, `Proxy status: Proxied (orange cloud)`, `TTL: Auto` → Save.
     - *Catatan:* Jangan pakai `A` `216.198.79.*` (itu Vercel). Untuk Pages, Cloudflare akan auto buat CNAME ke `pages.dev` saat lu Add Custom Domain di Pages (step 3), jadi step ini opsional — tapi bikin manual juga gak masalah.
   - **API:** `Type: CNAME`, `Name: api.flowdoro`, `Target: flowdoro-api.email-trisno-sanjaya.workers.dev` **atau** biarkan Workers Custom Domain auto buat (step 4). Kalau bikin manual, `Target: workers.dev` hostname, `Proxied: orange cloud`.
3. **SSL/TLS → Overview:** Pastikan `SSL: Full (strict)` atau `Flexible` + `Edge Certificates` `Universal SSL: Enabled`. `flowdoro.3scode.my.id` dan `*.flowdoro.3scode.my.id` bakal auto cover via `*.3scode.my.id` wildcard atau `flowdoro.3scode.my.id` cert (Cloudflare auto issue 1-2 menit).

**Verifikasi DNS:**
```bash
dig flowdoro.3scode.my.id +short
# harus keluar 104.21.x.x / 172.67.x.x (Cloudflare) bukan 216.198.79.x (Vercel)
dig api.flowdoro.3scode.my.id +short
```

---

## 3. Step 2 — Hubungkan Web (Pages) ke `flowdoro.3scode.my.id`

**Via Dashboard (paling gampang, tanpa `wrangler`):**
1. `Workers & Pages` → `flowdoro-web` → `Custom domains` → `Set up a custom domain` → ketik `flowdoro.3scode.my.id` → `Continue` → `Activate domain`.
2. Cloudflare akan auto tambah DNS `CNAME flowdoro → flowdoro-web.pages.dev` (kalau step 2 belum, dia bikin). Tunggu `Initializing...` → `Active` (1-3 menit, SSL auto).
3. **Test:** `curl -I https://flowdoro.3scode.my.id` → `200` + `cf-ray`, `curl https://flowdoro.3scode.my.id | grep "<title>"` → `Flowdoro`.

**Via Wrangler (alternatif):**
```bash
bunx wrangler pages project list # cek flowdoro-web
# Tidak ada wrangler pages domain add via CLI stabil, jadi pakai Dashboard.
```

**Rollback Pages:** Kalau mau balik ke `pages.dev`, hapus Custom Domain di Dashboard → DNS `flowdoro` auto hapus atau ganti ke `Proxied: DNS only`.

---

## 4. Step 3 — Hubungkan API (Workers) ke `api.flowdoro.3scode.my.id`

**Via Dashboard:**
1. `Workers & Pages` → `flowdoro-api` → `Settings` → `Triggers` → `Custom Domains` → `Add Custom Domain` → `api.flowdoro.3scode.my.id` → `Add Custom Domain`.
2. Tunggu `Active` (auto buat DNS `CNAME api.flowdoro → workers.dev`, SSL auto).
3. **Test:** `curl https://api.flowdoro.3scode.my.id/api/health | jq` → `{"success":true,"data":{"status":"ok"}}` . Kalau `521` tunggu 2 menit.

**Via Wrangler (opsional, tambah di `wrangler.toml`):**
```toml
# apps/api-cloudflare/wrangler.toml
name = "flowdoro-api"
main = "src/index.ts"
compatibility_date = "2025-01-01"
compatibility_flags = ["nodejs_compat"]

[[d1_databases]]
binding = "DB"
database_name = "flowdoro-auth"
database_id = "e0f8f3e4-1755-48fe-9758-25e476ee5504"

# Untuk Custom Domain via Wrangler (opsional, bisa juga via Dashboard tanpa ini)
# route = { pattern = "api.flowdoro.3scode.my.id/*", zone_name = "3scode.my.id" }
# atau routes = [{ pattern = "api.flowdoro.3scode.my.id/*", zone_name = "3scode.my.id" }]

[vars]
NODE_ENV = "production"
APP_URL = "https://flowdoro.3scode.my.id"
CORS_ORIGIN = "https://flowdoro.3scode.my.id"
API_URL = ""
REST_RATIO_DEFAULT = "5"
LOG_LEVEL = "info"
APPWRITE_ENDPOINT = "https://sgp.cloud.appwrite.io/v1"
# ... Appwrite vars tetap
GOOGLE_CLIENT_ID = "152902907428-..."
GOOGLE_REDIRECT_URI = "https://api.flowdoro.3scode.my.id/api/google/callback"
BETTER_AUTH_URL = "https://api.flowdoro.3scode.my.id"
```

> **Catatan:** `route` di `wrangler.toml` butuh `zone_name` + `pattern`. Kalau lu pakai Dashboard Custom Domains, **gak perlu** tambah `route` di file — Dashboard yang atur. Pilih salah satu, jangan dua-duanya biar gak konflik.

**Verifikasi Workers:**
```bash
curl -s https://api.flowdoro.3scode.my.id/api/health | jq
# harus 200
```

---

## 5. Step 4 — Update Env & Config untuk Domain Baru

### 5.1 `apps/api-cloudflare/wrangler.toml` `[vars]`

Ganti:

```toml
APP_URL = "https://flowdoro.3scode.my.id"
CORS_ORIGIN = "https://flowdoro.3scode.my.id"
BETTER_AUTH_URL = "https://api.flowdoro.3scode.my.id"
GOOGLE_REDIRECT_URI = "https://api.flowdoro.3scode.my.id/api/google/callback"
# GOOGLE_CLIENT_ID tetap, tapi tambah redirect di Google Console (step 6)
```

*Kenapa `BETTER_AUTH_URL` jadi `api.flowdoro...` bukan `flowdoro...`?* Better Auth `baseURL` harus **API** (tempat `POST /api/auth/*` di-handle), bukan web. Web `VITE_API_URL` juga ke API.

*Optional same-site Lax:* Karena `flowdoro.3scode.my.id` dan `api.flowdoro.3scode.my.id` itu **same-site** (beda subdomain tapi `site` sama `3scode.my.id`), lu bisa ganti `apps/api-cloudflare/src/lib/auth.ts:66` `sameSite` balik ke `lax` biar lebih aman (karena sekarang gak cross-site kayak `workers.dev` vs `pages.dev`). Kode sekarang `baseURL https → None`, tetap jalan untuk same-site (None lebih longgar), tapi kalau mau strict: ganti `sameSite: "lax"` untuk `*.3scode.my.id`. Gue rekomen **keep `None` dulu biar gak risk**, nanti kalau mau strict baru ganti + test.

### 5.2 `.env` / `.env.example` / `.dev.vars`

Update untuk **prod** (jangan commit secret):

```bash
# .env.example (commit)
APP_URL=https://flowdoro.3scode.my.id
CORS_ORIGIN=https://flowdoro.3scode.my.id
BETTER_AUTH_URL=https://api.flowdoro.3scode.my.id
GOOGLE_REDIRECT_URI=https://api.flowdoro.3scode.my.id/api/google/callback
VITE_API_URL=https://api.flowdoro.3scode.my.id
```

Local dev tetap:

```bash
# .dev.vars (jangan commit, untuk wrangler dev)
APP_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173
BETTER_AUTH_URL=http://localhost:8787
VITE_API_URL=
```

### 5.3 `deploy-web.sh` + `apps/api-cloudflare/src/lib/auth.ts` `trustedOrigins`

`deploy-web.sh:6` ganti:

```bash
export VITE_API_URL=https://api.flowdoro.3scode.my.id
```

`auth.ts:12` `trustedOrigins` sudah include `baseURL` + `CORS_ORIGIN`, tapi tambah eksplisit biar aman:

```ts
trustedOrigins: [
  env.CORS_ORIGIN, // https://flowdoro.3scode.my.id
  "https://flowdoro.3scode.my.id",
  "https://api.flowdoro.3scode.my.id",
  "http://localhost:5173",
  "http://localhost:8787",
  baseURL,
].filter(Boolean)
```

`apps/api-cloudflare/src/lib/env.ts:7` sudah baca `BETTER_AUTH_URL`, `CORS_ORIGIN` via `getEnvFromContext`, jadi gak perlu ubah.

---

## 6. Step 5 — Update Google OAuth Redirect (wajib kalau pakai Google Calendar + Social Login)

1. Buka `https://console.cloud.google.com` → pilih project `152902907428-...` (yang ada di `GOOGLE_CLIENT_ID`).
2. **APIs & Services → Credentials → OAuth 2.0 Client IDs → Web application** (yang `152902907428-...`).
3. **Authorized JavaScript origins** tambah:
   - `https://flowdoro.3scode.my.id`
   - `https://api.flowdoro.3scode.my.id`
4. **Authorized redirect URIs** tambah (jangan hapus yang lama dulu biar gak break `workers.dev`):
   - `https://api.flowdoro.3scode.my.id/api/auth/callback/google` (Better Auth social)
   - `https://api.flowdoro.3scode.my.id/api/auth/callback/github` (kalau pakai GitHub)
   - `https://api.flowdoro.3scode.my.id/api/google/callback` (Calendar)
   - Keep juga `https://flowdoro-api.email-trisno-sanjaya.workers.dev/api/auth/callback/google` + `.../api/google/callback` buat fallback sampai DNS baru stabil.
5. Save → tunggu 5 menit.

**Test:** `https://api.flowdoro.3scode.my.id/api/auth/get-session` harus `200` tanpa `MISSING_OR_NULL_ORIGIN`.

---

## 7. Step 6 — Deploy Ulang dengan Domain Baru

```bash
# 1. Update wrangler.toml + .env.example + deploy-web.sh (sudah di step 5)
# 2. Typecheck + build (wajib sebelum deploy)
bun run --cwd apps/api-cloudflare typecheck
bun run --cwd apps/web build

# 3. Deploy API (akan pakai BETTER_AUTH_URL baru)
bunx wrangler --cwd apps/api-cloudflare deploy src/index.ts

# 4. Build & deploy web ke Pages (VITE_API_URL baru)
VITE_API_URL=https://api.flowdoro.3scode.my.id bash deploy-web.sh
# atau: VITE_API_URL=https://api.flowdoro.3scode.my.id bun run --cwd apps/web build && bunx wrangler pages deploy apps/web/dist --project-name=flowdoro-web

# 5. Verifikasi
curl -s https://api.flowdoro.3scode.my.id/api/health | jq
curl -s https://flowdoro.3scode.my.id | grep -o "<title>.*</title>"
curl -s -i -X POST https://api.flowdoro.3scode.my.id/api/auth/sign-up/email \
  -H "Content-Type: application/json" -H "Origin: https://flowdoro.3scode.my.id" \
  -d '{"name":"Test","email":"test@3scode.my.id","password":"password123"}' | grep -i SameSite
# harus SameSite=None atau Lax (tergantung baseURL https → None)
```

**Rollback:** Kalau `api.flowdoro...` 521, cek `Workers → Custom Domains` masih `Active`, `DNS` orange cloud, `SSL` ok, `wrangler.toml` `BETTER_AUTH_URL` bener. Kalau web `404`, cek `Pages → Custom Domains` `Active`.

---

## 8. Step 7 — Update CORS & Cookie untuk Same-Site (Opsional Hardening)

Sekarang `flowdoro.3scode.my.id` (web) dan `api.flowdoro.3scode.my.id` (api) itu **same-site** (beda subdomain tapi `site = 3scode.my.id` sama). Jadi `SameSite=Lax` sebenarnya cukup (lebih aman dari `None`). Kode sekarang pakai `None` untuk `https` (karena dulu `workers.dev` vs `pages.dev` cross-site).

**Opsi:**
- **Keep `None`** (paling aman buat cross-site, gak perlu ganti, tetap jalan untuk same-site juga).
- **Ganti ke `Lax` untuk same-site** (lebih strict, cegah CSRF cross-site): di `apps/api-cloudflare/src/lib/auth.ts:66` ganti `sameSite: "lax"` + redeploy API → test `POST /api/auth/sign-in/email` dari `https://flowdoro.3scode.my.id` harus tetap `200` + `Set-Cookie: SameSite=Lax` + `GET /api/me` `200`.

Gue rekomen **keep `None` dulu** sampai lu yakin gak ada client lain di `workers.dev` lama yang masih pakai `Lax`, baru ganti ke `Lax` + test.

---

## 9. Opsi B — Single Domain `flowdoro.3scode.my.id` untuk Web + API (`/api/*`)

Kalau lu mau **1 domain doang** (lebih clean, gak perlu `api.`):

- **Web:** `flowdoro.3scode.my.id/*` → Pages
- **API:** `flowdoro.3scode.my.id/api/*` → Workers

**Cara:**

1. **Pages Custom Domain:** `flowdoro.3scode.my.id` → Pages (step 3).
2. **Workers Route:** `Workers → flowdoro-api → Settings → Triggers → Add Route` → `Route: flowdoro.3scode.my.id/api/*` → `Zone: 3scode.my.id` → Save. Atau di `wrangler.toml`:
   ```toml
   [[routes]]
   pattern = "flowdoro.3scode.my.id/api/*"
   zone_name = "3scode.my.id"
   ```
3. **Env:** `VITE_API_URL=https://flowdoro.3scode.my.id` (tanpa `/api`? Front `api/client.ts` sudah pakai `/api/*` jadi `VITE_API_URL=""` atau `https://flowdoro.3scode.my.id` keduanya jalan karena `fetch(\`\${API_BASE}/api/me\`)` → kalau `API_BASE=""` jadi `/api/me` relative ke `flowdoro.3scode.my.id`, yang akan di-route ke Workers. Paling simpel: `VITE_API_URL=""` (relative) + Pages `_redirects` atau Workers Route. Atau `VITE_API_URL=https://flowdoro.3scode.my.id`.
4. **Google Redirect:** `https://flowdoro.3scode.my.id/api/auth/callback/google`
5. **CORS:** `CORS_ORIGIN=https://flowdoro.3scode.my.id` (same-origin, jadi CORS gak perlu `Allow-Credentials` cross-site, tapi keep `SameSite=Lax`).

**Tradeoff:** Opsi B lebih clean tapi butuh Route + test `fetch` relative. Opsi A (2 subdomain) lebih simpel dan udah proven di E2E `curl` + `SameSite=None`.

---

## 10. Checklist Verifikasi Akhir

- [ ] `dig flowdoro.3scode.my.id` → `104.21.x.x` (Cloudflare) ✅
- [ ] `dig api.flowdoro.3scode.my.id` → `104.21.x.x` ✅
- [ ] `https://flowdoro.3scode.my.id` → `200` + `Flowdoro` title ✅
- [ ] `https://api.flowdoro.3scode.my.id/api/health` → `{"success":true}` ✅
- [ ] `POST https://api.flowdoro.3scode.my.id/api/auth/sign-up/email` (Origin `https://flowdoro.3scode.my.id`) → `200` + `Set-Cookie: ... SameSite=None; Secure` ✅
- [ ] `GET https://api.flowdoro.3scode.my.id/api/me` + cookie → `200` ✅
- [ ] `POST https://api.flowdoro.3scode.my.id/api/tasks` → `POST /api/sessions` → `PATCH completed` → `GET /api/analytics/summary` ✅
- [ ] `Logout` → `Login` lagi → `GET /api/tasks` tetap ada (persist) ✅
- [ ] `www.3scode.my.id` (Vercel) masih jalan, gak keganggu ✅
- [ ] Google OAuth `https://flowdoro.3scode.my.id` login via Google/GitHub jalan (kalau sudah set Client ID) ✅

---

## 11. Rollback & Troubleshooting

| Masalah | Cek | Fix |
|---------|-----|-----|
| `521` / `530` di `api.flowdoro...` | `Workers → Custom Domains` `Active`? `DNS` orange? | Tunggu 2 menit SSL, cek `wrangler.toml` `BETTER_AUTH_URL` |
| `CORS 403` `MISSING_OR_NULL_ORIGIN` | `POST /api/auth/sign-in` `Origin` header | Tambah `Origin` ke `trustedOrigins` di `auth.ts:12` |
| `401` setelah login (cookie gak ke-kirim) | `DevTools → Application → Cookies` `SameSite` | Ganti `SameSite=None` untuk cross-site, atau `Lax` kalau same-site `*.3scode.my.id` |
| `404` di `flowdoro.3scode.my.id/api/*` (Opsi B) | `Workers Route` `flowdoro.3scode.my.id/api/*` ada? | Tambah Route di Dashboard atau `wrangler.toml` |
| `Vercel` root `3scode.my.id` keganggu | `DNS` `flowdoro` cuma `CNAME` subdomain, bukan `A` root | Jangan ubah `A` `216.198.79.*` untuk root, cuma `CNAME` subdomain |

**Rollback cepat:**
```bash
# Hapus custom domain, balik ke workers.dev/pages.dev
# Pages → Custom Domains → Remove flowdoro.3scode.my.id
# Workers → Custom Domains → Remove api.flowdoro.3scode.my.id
# DNS → hapus CNAME flowdoro / api.flowdoro
# wrangler.toml balik ke:
# APP_URL=https://flowdoro-web.pages.dev
# CORS_ORIGIN=https://flowdoro-web.pages.dev
# BETTER_AUTH_URL=https://flowdoro-api.email-trisno-sanjaya.workers.dev
# deploy ulang
```

---

## 12. Perintah Siap Copy-Paste

```bash
# 0. Cek domain & whoami
dig 3scode.my.id NS +short
bunx wrangler whoami

# 1. Update config (manual edit file, atau pakai sed)
# apps/api-cloudflare/wrangler.toml → APP_URL, CORS_ORIGIN, BETTER_AUTH_URL, GOOGLE_REDIRECT_URI
# deploy-web.sh → VITE_API_URL
# .env.example → APP_URL, CORS_ORIGIN, BETTER_AUTH_URL, VITE_API_URL, GOOGLE_REDIRECT_URI

# 2. Deploy API
bun run --cwd apps/api-cloudflare typecheck
bunx wrangler --cwd apps/api-cloudflare deploy src/index.ts

# 3. Deploy Web
VITE_API_URL=https://api.flowdoro.3scode.my.id bash deploy-web.sh
# atau
VITE_API_URL=https://api.flowdoro.3scode.my.id bun run --cwd apps/web build
bunx wrangler pages deploy apps/web/dist --project-name=flowdoro-web

# 4. Verifikasi
curl -s https://api.flowdoro.3scode.my.id/api/health | jq
curl -s https://flowdoro.3scode.my.id | grep -o "<title>.*</title>"
curl -s -i -X POST https://api.flowdoro.3scode.my.id/api/auth/sign-up/email \
  -H "Content-Type: application/json" -H "Origin: https://flowdoro.3scode.my.id" \
  -d '{"name":"Test","email":"test@3scode.my.id","password":"password123"}' | grep -i SameSite
```

---

**Selesai — file ini di `docs/flowdoro.3scode.my.id.md`.** Kalau lu mau, gue bisa langsung eksekusi step 2-4 sekarang (butuh lu `gass` lagi), atau lu jalanin manual ikut checklist di atas. Mau gue yang deploy sekarang?
