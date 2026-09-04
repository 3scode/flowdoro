# BA-03: Replace authMiddleware + Cutover Handler

**ID:** BA-03
**Tech Spec:** §4, §5
**Prioritas:** 🔴 High
**Effort:** M
**Dep:** BA-02
**Status:** Pending

### Tujuan
Ganti verifikasi Appwrite session jadi Better Auth session + mount handler.

### File
- `apps/api-cloudflare/src/middleware/auth.ts:7`
- `apps/api-cloudflare/src/index.ts:23`
- `apps/api-cloudflare/src/routes/auth.ts:27`

### Checklist
- [ ] `middleware/auth.ts` ganti `fetch Appwrite /account` → `const auth = createAuth(c.get('env')); const session = await auth.api.getSession({ headers: c.req.header() }); if (!session) 401; c.set('user', {id: session.user.id, email: session.user.email, name: session.user.name, profile:null})`
- [ ] `index.ts` ganti `.route('/api/auth', authRoutes)` → `.on(["POST","GET"], "/api/auth/*", (c) => createAuth(c.get('env')).handler(c.req.raw))` + keep CORS `Allow-Credentials true`
- [ ] `routes/auth.ts` jadi shim deprecated: return 410 `Moved to /api/auth/sign-*` atau hapus file + update imports
- [ ] `profiles.ts ensureProfile` tetap, tapi cek `userId` dari Better Auth (string)
- [ ] Hapus `getSessionToken` fallback `Bearer` jika mau, atau keep untuk compat tapi primary cookie
- [ ] `bun run --cwd apps/api-cloudflare typecheck` + `curl /api/health` tetap 200

### Acceptance
- [ ] `GET /api/me` tanpa cookie → 401
- [ ] `POST /api/auth/sign-up/email` → Set-Cookie `better-auth.session_token` HttpOnly
- [ ] `GET /api/auth/get-session` dengan cookie → 200 + user
- [ ] Semua protected routes (`/api/tasks`, `/api/sessions`, etc) 401 jika tanpa session, 200 jika ada
