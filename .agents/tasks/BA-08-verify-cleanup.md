# BA-08: Verifikasi Build + Cleanup Dead Code

**ID:** BA-08
**Tech Spec:** §9
**Prioritas:** 🔴 High
**Effort:** S
**Dep:** BA-01..07
**Status:** Pending

### Tujuan
Pastikan tidak ada regresi + hapus code Appwrite auth lama.

### File
- `apps/api-cloudflare/src/routes/auth.ts:19` (hapus `extractSecretFromCookie`)
- `apps/api-cloudflare/src/lib/response.ts:23` (hapus `setSessionCookie/clearSessionCookie` jika tidak dipakai, atau keep untuk compat)
- `apps/api-cloudflare/src/lib/response.ts:34` `getSessionToken` dead code cleanup

### Checklist
- [ ] `bun run --cwd apps/web build` → sukses, cek alias `$lib` tidak error
- [ ] `bun run --cwd apps/api-cloudflare typecheck` → 0 error
- [ ] Hapus endpoint `POST /migrate` sementara sebelum prod deploy
- [ ] `curl http://localhost:8787/api/health` → `{success:true, data:{status:"ok"}}`
- [ ] E2E manual: Register → Logout → Login → `GET /api/me` → `POST /api/tasks` → `POST /api/sessions` → `PATCH completed` → `GET /api/analytics/summary` → verify `restEarned = floor(duration/5)` + streak
- [ ] Hapus `localStorage.flowdoro_token` references di `apps/web` (grep `flowdoro_token`)
- [ ] Update `README.md:9`, `TEST-RUN-BUILD.md`, `env.md` docs

### Acceptance
- [ ] `bun run build` lolos 2 apps
- [ ] `curl -i` lihat `Set-Cookie: better-auth.session_token=...; HttpOnly; Secure; SameSite=Lax`
- [ ] Tidak ada sisa `extractSecretFromCookie` atau `a_session_` di codebase kecuali docs
- [ ] Deploy prod `wrangler deploy` + `wrangler d1 migrations apply --remote` sukses
