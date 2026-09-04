# BA-07: CORS + Cookie + Vite Proxy Fix

**ID:** BA-07
**Tech Spec:** §5
**Prioritas:** 🟡 Mid
**Effort:** S
**Dep:** BA-03
**Status:** Pending

### Tujuan
Pastikan cookie httpOnly kekirim cross-origin prod (`pages.dev` → `workers.dev`).

### File
- `apps/api-cloudflare/src/index.ts:29`
- `apps/web/vite.config.ts:18`
- `apps/web/src/lib/api/client.ts:7`

### Checklist
- [ ] `index.ts` CORS `allowedOrigin = env.CORS_ORIGIN || "https://flowdoro-web.pages.dev"` + `Allow-Credentials true` + `Allow-Headers: Content-Type,Authorization` + `Vary: Origin` tetap, tapi `Access-Control-Allow-Origin` jangan `*`, harus exact origin
- [ ] Better Auth `trustedOrigins: [env.CORS_ORIGIN, env.APP_URL]` sudah set
- [ ] `client.ts` `credentials:'include'` only, hapus `Authorization`
- [ ] `vite.config.ts` proxy `/api` `cookieDomainRewrite` & `cookiePathRewrite` keep, forward `Authorization` hapus (tidak perlu)
- [ ] Prod test: `fetch` dari `https://flowdoro-web.pages.dev` ke `https://flowdoro-api.email-trisno-sanjaya.workers.dev/api/auth/get-session` dengan `credentials:include` → cookie terkirim

### Acceptance
- [ ] Local dev `5173 → 8787` cookie set + get-session 200
- [ ] Prod `pages.dev → workers.dev` cookie cross-site sukses (SameSite=Lax, Secure true, tidak blocked)
- [ ] Preflight OPTIONS 204 dengan headers benar
