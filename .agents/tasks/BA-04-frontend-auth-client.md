# BA-04: Frontend authClient + Stores

**ID:** BA-04
**Tech Spec:** §5, §6
**Prioritas:** 🔴 High
**Effort:** M
**Dep:** BA-03
**Status:** Pending

### Tujuan
Ganti `localStorage` + Bearer jadi cookie httpOnly via Better Auth client.

### File
- `apps/web/package.json:13`
- `apps/web/src/lib/auth-client.ts` (NEW)
- `apps/web/src/lib/stores/auth.ts:6`
- `apps/web/src/lib/api/client.ts:3`
- `apps/web/src/App.svelte:32`

### Checklist
- [ ] `bun add better-auth` di `apps/web` (client only, no Node dep)
- [ ] `auth-client.ts`: `import { createAuthClient } from "better-auth/svelte"; export const authClient = createAuthClient({ baseURL: import.meta.env.VITE_API_URL || "" })`
- [ ] `stores/auth.ts` ganti: `login` → `authClient.signIn.email({email,password})`, `register` → `authClient.signUp.email({name,email,password})`, `logout` → `authClient.signOut()`, `fetchMe` → `authClient.getSession()` atau `api.get('/api/auth/get-session')`, hapus `localStorage.flowdoro_token`
- [ ] `api/client.ts` hapus `getToken()` + `Authorization: Bearer`, jadi `fetch(..., {credentials:'include', headers: {'Content-Type':'application/json', ...opts.headers}})`
- [ ] `App.svelte` ganti `$effect localStorage.getItem('flowdoro_token')` → `authClient.useSession()` atau `auth.fetchMe()` via cookie
- [ ] `vite.config.ts:18` proxy keep `credentials include` untuk cookie
- [ ] `bun run --cwd apps/web build` lolos, cek bundle tidak bengkak

### Acceptance
- [ ] Register/Login via `authClient` set cookie HttpOnly (lihat DevTools Application Cookies)
- [ ] `GET /api/me` via `api.get` dengan `credentials:include` → 200 tanpa header Authorization
- [ ] Logout clear cookie + redirect `/`
- [ ] `App.svelte` render `user.name` dari session
