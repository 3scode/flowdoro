# TECH-SPEC — Migrasi Flowdoro ke Better Auth + D1 (100% Free Unlimited)

**ID:** BETTER-AUTH-D1
**Tanggal:** 2026-09-04
**Status:** Approved — Eksekusi Build Mode
**Trigger:** User minta 100% free limit tinggi, pilih Better Auth + Cloudflare D1
**Stack delta:** Keep Hono 4 + Svelte 5 + Tailwind 4 + Vite 6 + Appwrite Cloud (DB app tetap), ganti Appwrite Users/session → Better Auth + D1 (free ♾️ MAU)
**Keputusan:** Self-host Better Auth di `flowdoro-api` Workers (D1 native), Appwrite tetap untuk `profiles/tasks/sessions/session_events/lists/google_tokens/avatars`

---

## 1. Latar Belakang & Tujuan

Flowdoro saat ini pakai Appwrite Users + session `a_session_<project>` (`apps/api-cloudflare/src/middleware/auth.ts:7`, `apps/api-cloudflare/src/routes/auth.ts:27`, `apps/api-cloudflare/src/lib/response.ts:34`) + `localStorage.flowdoro_token` (`apps/web/src/lib/stores/auth.ts:20`). Ada celah: `setSessionCookie` dead code (`apps/api-cloudflare/src/lib/response.ts:23`), token XSS-able, regex cookie buggy (`response.ts:36` `$` anchor), sosial login `Google/GitHub` di `DESIGN.md:433` belum ada.

User minta **100% free limit tinggi**. Better Auth (MIT) jalan di Workers+D1 free tier (Workers 100k req/hari, D1 5M read/hari) → ♾️ MAU tanpa cap 10k seperti Clerk/Stack. Satu-satunya yang docs-nya eksplisit `Hono + Cloudflare Workers + D1 native batch` (`better-auth/better-auth: betterAuth({database: env.DB})` tanpa adapter) dan vanilla `createAuthClient` untuk Svelte SPA (`apps/web/src/App.svelte:15` manual router, bukan SvelteKit).

Tujuan: Ganti auth jadi Better Auth + D1, Appwrite tetap untuk app data, cookie jadi `httpOnly Secure SameSite=Lax` 7 hari, tambah OAuth Google/GitHub, tetap free $0.

Non-tujuan: Tidak migrasi `tasks/sessions` dari Appwrite ke D1, tidak ganti storage avatar (tetap Appwrite bucket `avatars`), tidak ganti frontend ke SvelteKit.

---

## 2. Arsitektur Target

```
[Svelte 5 SPA apps/web] --fetch credentials:include--> [Hono apps/api-cloudflare/src/index.ts:23]
  |                                                        |
  |  createAuthClient()                                     |  betterAuth({database: env.DB}) D1
  |  signUp.email / signIn.social                           |  /api/auth/* handler
  |                                                        |
  +--------------------------------------------------------> [Cloudflare D1 better-auth DB]
  |                                                        |  tables: user, session, account, verification
  |
  +--authMiddleware: auth.api.getSession()--> [Appwrite Cloud sgp.cloud.appwrite.io/v1]
          c.set('user')                                     DB flowdoro: profiles/tasks/sessions/session_events/lists/google_tokens
                                                            Bucket avatars
```

Workers `compatibility_flags = ["nodejs_compat"]` (`wrangler.toml:4`) sudah ada untuk WebCrypto. Env baca `c.env` (`apps/api-cloudflare/src/lib/env.ts:7`).

---

## 3. Data Model

### D1 (baru, SQLite, Better Auth auto-migration)

| Table | Field | Type | Constraints | Cardinality |
|-------|-------|------|-------------|-------------|
| user | id | TEXT PK | NOT NULL | 1:N session, 1:N account, 1:N verification |
| | email | TEXT | UNIQUE NOT NULL | |
| | emailVerified | INTEGER | DEFAULT 0 | |
| | name | TEXT | NOT NULL | |
| | image | TEXT | NULLABLE | |
| | createdAt | INTEGER | NOT NULL | |
| | updatedAt | INTEGER | NOT NULL | |
| session | id | TEXT PK | NOT NULL | M:1 user |
| | userId | TEXT | FK→user.id CASCADE | |
| | token | TEXT | UNIQUE NOT NULL | |
| | expiresAt | INTEGER | NOT NULL | |
| | ipAddress | TEXT | NULLABLE | |
| | userAgent | TEXT | NULLABLE | |
| account | id | TEXT PK | NOT NULL | M:1 user |
| | userId | TEXT | FK | |
| | providerId | TEXT | `credential` / `google` / `github` | |
| | accountId | TEXT | provider user id | |
| | accessToken | TEXT | OAuth | |
| verification | id | TEXT PK | | |

Index: `session.userId`, `session.token`, `account.userId`, `user.email`.

Better Auth handle via `database: env.DB` tanpa `drizzleAdapter` (D1 native batch, Docs 1.5+). Migrasi via `getMigrations(auth.options)` + `runMigrations()` endpoint `POST /migrate` sementara (hapus di prod).

### Appwrite Cloud (tetap)

| Collection | ID | Atribut relevan | Catatan |
|------------|----|-----------------|---------|
| profiles | profiles | `userId` string 36 UNIQUE (re-map ke Better Auth user.id), `email`, `name`, `avatarUrl`, `restRatio` 3-6 default 5, `theme` system/light/dark, `notificationsEnabled`, `soundEnabled`, `createdAt/updatedAt` | Hook after signUp buat doc |
| tasks | tasks | `userId`, `name/title`, `listId`, `starred`, `parentId`, etc | Tetap |
| sessions | sessions | `userId`, `taskId`, `status active/completed`, `durationSeconds`, `restEarned`, `restTaken`, `startedAt/endedAt` | Tetap |
| session_events | session_events | `sessionId`, `eventType`, `timestamp`, `payload` | Tetap |
| lists | lists | `userId`, `name`, `sortOrder` | Tetap |
| google_tokens | google_tokens | `userId`, encrypted tokens | Tetap, Calendar OAuth tetap di `apps/api-cloudflare/src/lib/google.ts:1` bukan Better Auth |

Bucket `avatars` tetap Appwrite Storage.

Mapping: `Appwrite user.$id` → `Better Auth user.id` (migration script update `profiles.userId`, `tasks.userId`, `sessions.userId`, `lists.userId`, `google_tokens.userId`). `email` lowercased tetap.

---

## 4. Auth Flow Detail

### Sekarang (Appwrite)
- `POST /api/auth/register` → `fetch users` (`/users` with `x-appwrite-key`) → `dbCreate profiles` → `fetch /account/sessions/email` → `extractSecretFromCookie` (`apps/api-cloudflare/src/routes/auth.ts:19` regex `(.+?);`) → return `token` di body → frontend `localStorage` (`apps/web/src/lib/stores/auth.ts:20`).
- `authMiddleware` → `fetch /account` dengan `cookie: a_session_` (`apps/api-cloudflare/src/middleware/auth.ts:12`).

### Target (Better Auth)
- **Register:** `authClient.signUp.email({name,email,password,callbackURL:"/dashboard"})` → `POST /api/auth/sign-up/email` (Better Auth handler) → D1 `user+account(credential)` → `Set-Cookie: better-auth.session_token=...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/` → `after` hook `dbCreate` Appwrite `profiles` via `appwriteApiKey`.
- **Login:** `authClient.signIn.email` atau `authClient.signIn.social({provider:"google",callbackURL:"/dashboard"})` → D1 `session` → cookie. OAuth Google/GitHub redirect ke `better-auth` callback `https://flowdoro-api.email-trisno-sanjaya.workers.dev/api/auth/callback/google` (konfig `GOOGLE_REDIRECT_URI` update).
- **Logout:** `authClient.signOut()` → `POST /api/auth/sign-out` → clear cookie + D1 delete session.
- **getSession:** `authClient.useSession()` (Svelte) atau `GET /api/auth/get-session` → cookie auto.
- **Middleware:** `authMiddleware` → `const session = await auth(c.env).api.getSession({ headers: c.req.header() }); if (!session) 401; c.set('user', {id: session.user.id, email: session.user.email, name: session.user.name})`. Hapus `getSessionToken` (`apps/api-cloudflare/src/lib/response.ts:34`) fallback `Bearer` (opsional keep untuk compat tapi primary cookie).
- **Calendar Google:** Tetap `apps/api-cloudflare/src/lib/google.ts:1` PKCE flow untuk `calendar.events` scope, bukan auth. Tidak konflik dengan Better Auth Google social (beda scope). `/api/google/connect` tetap.

---

## 5. API Rewrite per File

**`wrangler.toml:1`:** Tambah
```toml
[[d1_databases]]
binding = "DB"
database_name = "flowdoro-auth"
database_id = "xxx" # wrangler d1 create
```
Keep `compatibility_flags = ["nodejs_compat"]`. Vars tetap, tambah `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET` via `wrangler secret put` (jangan vars).

**`apps/api-cloudflare/src/lib/env.ts:7`:** Tambah `betterAuthSecret: e.BETTER_AUTH_SECRET ?? ''`, `betterAuthUrl: e.BETTER_AUTH_URL ?? e.APP_URL`, `githubClientId/Secret`, `db: e.DB` passthrough.

**`apps/api-cloudflare/src/lib/auth.ts` (NEW):**
```ts
import { betterAuth } from "better-auth"
export const createAuth = (env: any) => betterAuth({
  database: env.DB,
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
    github: { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET },
  },
  trustedOrigins: [env.CORS_ORIGIN, env.APP_URL, "http://localhost:5173"],
  session: { expiresIn: 604800, updateAge: 86400, cookieCache: { enabled: true, maxAge: 300 } },
  advanced: {
    useSecureCookies: env.NODE_ENV === "production",
    defaultCookieAttributes: { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: "lax" as const },
  },
  rateLimit: { enabled: true, window: 10, max: 100 },
})
```

**`apps/api-cloudflare/src/index.ts:23`:** `.route('/api/auth', authRoutes)` → `app.on(["POST","GET"], "/api/auth/*", (c) => createAuth(c.get('env')).handler(c.req.raw))` + keep CORS `Allow-Credentials true` + `Access-Control-Allow-Headers: Content-Type,Authorization`.

**`apps/api-cloudflare/src/middleware/auth.ts:7`:** Ganti `fetch Appwrite /account` → `createAuth(e).api.getSession`. Hapus `getSessionToken` import.

**`apps/api-cloudflare/src/routes/auth.ts:27`:** Hapus atau jadi shim deprecated 410 + redirect ke handler. Hapus `extractSecretFromCookie`, `serializeProfile` tetap di `profiles.ts`.

**`apps/api-cloudflare/src/routes/profiles.ts`:** `ensureProfile` tetap, tapi `user.id` dari Better Auth.

**Frontend:**
- `apps/web/package.json:13` tambah `better-auth`.
- `apps/web/src/lib/auth-client.ts` NEW `createAuthClient({ baseURL: import.meta.env.VITE_API_URL })`.
- `apps/web/src/lib/stores/auth.ts:6` ganti `api.post('/api/auth/login')` + `localStorage` → `authClient.signUp.email / signIn.email / signOut / useSession`.
- `apps/web/src/lib/api/client.ts:3` hapus `getToken()` + `Authorization: Bearer`, jadi `credentials:'include'` only (cookie httpOnly).
- `apps/web/vite.config.ts:18` proxy keep `cookieDomainRewrite` untuk D1 cookie.
- `apps/web/src/lib/pages/Login.svelte:1`, `Register.svelte` tambah `<button on:click={() => authClient.signIn.social({provider:'google', callbackURL:'/dashboard'})}>Google</button>` + github.

---

## 6. Frontend Minim Ubah

Tetap SPA manual router `apps/web/src/App.svelte:15`. `auth.fetchMe()` → `authClient.getSession()` atau `api.get('/api/auth/get-session')`. Dashboard/Focus/History tetap fetch Appwrite data via `api` (tidak ubah `client.ts` selain auth header). `VITE_API_URL` tetap.

---

## 7. Infra & Env

- `bunx wrangler d1 create flowdoro-auth` → set `database_id` di `wrangler.toml`.
- `wrangler secret put BETTER_AUTH_SECRET` (32 hex, `openssl rand -hex 32`), `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID/SECRET`. `BETTER_AUTH_URL=https://flowdoro-api.email-trisno-sanjaya.workers.dev`.
- `GOOGLE_REDIRECT_URI` ganti ke `https://flowdoro-api.email-trisno-sanjaya.workers.dev/api/auth/callback/google` (Better Auth) vs lama `.../api/google/callback` (Calendar tetap di google route, jadi dua redirect berbeda).
- `.env.example:1` tambah `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GITHUB_CLIENT_ID/SECRET`, `D1_DATABASE_ID`.
- `deploy-cf.sh` tambah `wrangler d1 migrations apply` sebelum deploy.

---

## 8. Seed & Data

- `scripts/seed-better-auth.mjs` NEW: pakai `betterAuth` API atau D1 direct insert untuk demo user `demo@flowdoro.app / password123` + Appwrite `profiles/tasks/sessions` (reuse `scripts/seed.mjs:1` tapi ganti auth part).
- Old `scripts/seed.mjs` keep untuk Appwrite data.

---

## 9. Testing & Verifikasi

- `bun install && bun run --cwd apps/web build` wajib lolos (cek alias `$lib`).
- `bun run --cwd apps/api-cloudflare typecheck` wajib 0.
- `wrangler d1 execute flowdoro-auth --local --command "SELECT name FROM sqlite_master WHERE type='table'"` cek 4 tables.
- `curl -i -X POST http://localhost:8787/api/auth/sign-up/email -H "Content-Type: application/json" -d '{"name":"Test","email":"test@example.com","password":"password123"}'` → 200 + `Set-Cookie: better-auth.session_token`.
- `curl -b cookie.txt http://localhost:8787/api/me` → 200.
- `curl http://localhost:8787/api/health` → `{success:true}`.
- E2E: Register → Dashboard → Start Focus → Stop → History → Logout → Login.

---

## 10. Risiko & Mitigasi

- **D1 tidak support interactive transactions** → Better Auth pakai `batch()` atomic, sudah handle.
- **Dua Google OAuth (Better Auth social vs Calendar)** → beda redirect URI & scope (`social` scope `email profile`, Calendar `calendar.events`), tidak konflik.
- **FK cascade manual Appwrite tetap** → `profiles` `userId` re-map, delete user cascade manual di Appwrite via `BETTER_AUTH` hook `user.delete`.
- **Cloudflare free limit** → 100k req/hari cukup untuk <10k MAU, scale ke Paid $5 = 10M req.

---

## 11. Task Breakdown

1. BA-01 Infra D1 + Secrets (wrangler.toml, env.ts, .env.example)
2. BA-02 Backend Better Auth core (lib/auth.ts, deps)
3. BA-03 Middleware + handler cutover (middleware/auth.ts, index.ts, routes/auth.ts)
4. BA-04 Frontend authClient + stores (auth-client.ts, stores/auth.ts, api/client.ts, App.svelte)
5. BA-05 Sosial UI (Login.svelte, Register.svelte)
6. BA-06 Migrasi script + seed
7. BA-07 CORS/cookie/Vite proxy fix
8. BA-08 Verifikasi build + cleanup dead code

Estimasi 3-4 hari.

---

## 12. Keputusan Locked

1. D1 + Better Auth self-host (free ♾️) 2. Appwrite tetap untuk app data 3. Cookie httpOnly 4. Google+GitHub social 5. Calendar OAuth tetap terpisah
