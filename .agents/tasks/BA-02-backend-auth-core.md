# BA-02: Backend Better Auth Core

**ID:** BA-02
**Tech Spec:** §5
**Prioritas:** 🔴 High
**Effort:** M
**Dep:** BA-01
**Status:** Pending

### Tujuan
Pasang Better Auth instance D1 native.

### File
- `apps/api-cloudflare/package.json:11`
- `apps/api-cloudflare/src/lib/auth.ts` (NEW)

### Checklist
- [ ] `bun add better-auth` di `apps/api-cloudflare` (cek `bun-types` kompatibel)
- [ ] Buat `src/lib/auth.ts` `createAuth(env)` seperti spec §5 (D1 native, trustedOrigins, socialProviders Google/GitHub, session 7d, rateLimit 100/10s)
- [ ] `trustedOrigins: [env.CORS_ORIGIN, env.APP_URL, "http://localhost:5173"]`
- [ ] `advanced.defaultCookieAttributes: {httpOnly:true, secure: prod, sameSite:"lax"}` + `cookieCache`
- [ ] Tambah endpoint `POST /migrate` sementara `getMigrations` + `runMigrations()` (hapus prod nanti)
- [ ] `bun run --cwd apps/api-cloudflare typecheck` lolos

### Acceptance
- [ ] `better-auth` import tanpa error `nodejs_compat`
- [ ] `createAuth` ter-export, bisa `auth.handler(request)` di Workers
- [ ] `wrangler d1 execute` lihat tables `user,session,account,verification` setelah migrate

### Catatan
- Jangan pakai `drizzleAdapter` — D1 native batch lebih efisien.
