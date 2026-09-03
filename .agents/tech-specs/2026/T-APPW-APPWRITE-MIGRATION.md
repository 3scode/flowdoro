# TECH-SPEC — Migrasi Flowdoro ke Appwrite Cloud (Opsi A Full)

**ID:** T-APPW-APPWRITE-MIGRATION  
**Tanggal:** 2026-09-02  
**Status:** Approved — Eksekusi Build Mode  
**Stack:** Keep Elysia 1.4 + Bun + Svelte 5, ganti Postgres/Drizzle → Appwrite Cloud, R2 → Appwrite Storage, Fresh DB  
**Keputusan:** Appwrite Cloud (SG), fetch tetap ke Elysia (Elysia pakai `node-appwrite` server SDK), pindah storage, buat ulang.

---

## 1. Latar Belakang & Tujuan

Render minta CC, HF Spaces `7860` sudah jalan, tapi Neon/Supabase tetap butuh `DATABASE_URL`. User minta DB diganti Appwrite.io agar satu atap Auth+DB+Storage no-CC. Opsi A dipilih: **Full Appwrite Auth + DB + Storage**, Elysia tetap sebagai BFF (frontend tetap `fetch credentials:include` ke `VITE_API_URL`, bukan Web SDK langsung) untuk minim ubah `apps/web`.

Tujuan: Hapus `postgres` `drizzle-orm` `postgres.js` `jose` `bcryptjs` custom JWT, ganti dengan Appwrite Users + Databases + Storage, tetap di HF Spaces Docker, tanpa `docker-compose.yml` postgres.

Non-tujuan: Tidak migrasi data lama (fresh), tidak ganti Svelte/Tailwind, tidak pindah ke Appwrite Functions/Sites untuk API.

---

## 2. Arsitektur Target

```
[Svelte 5 apps/web] --fetch /api/* (VITE_API_URL)--> [Elysia apps/api src/app.ts:11]
  |                                                    |
  |                                            node-appwrite Client
  |                                            .setEndpoint(APPWRITE_ENDPOINT)
  |                                            .setProject(APPWRITE_PROJECT_ID)
  |                                            .setKey(APPWRITE_API_KEY)
  |                                                    |
  └------------------------------------------> [Appwrite Cloud https://<region>.cloud.appwrite.io/v1]
        1 Database `flowdoro` (3 collections) + 1 Bucket `avatars` + Users (Auth)
```

HF Spaces `Dockerfile:1` `oven/bun` `EXPOSE 7860` + `src/index.ts:5` `0.0.0.0:${PORT}` tetap. `docker-compose.yml` postgres service dihapus (keep `api` saja untuk lokal dev via Appwrite Cloud endpoint).

---

## 3. Data Model Appwrite

**Database:** `flowdoro` (`DATABASE_ID` env, 1 DB free tier cukup)

| Collection | Collection ID | Atribut | Index | Permission |
|---|---|---|---|---|
| `profiles` | `profiles` | `userId` string 36 required unique (Appwrite user $id), `email` string 255 unique, `name` string 120, `avatarUrl` string 500 (fileId atau URL Storage), `restRatio` integer 3-6 default 5, `theme` enum `system/light/dark` default `system`, `notificationsEnabled` boolean default false, `soundEnabled` boolean default false, `googleId` string 100 unique, `createdAt/updatedAt` datetime, `deletedAt` datetime nullable | `key` `userId`, `unique` `email`, `key` `googleId` | `read/update/delete` `userId` (document permission `user:<userId>`) |
| `tasks` | `tasks` | `userId` string required, `name` string 120, `createdAt` datetime | `key` `userId` | `userId` |
| `sessions` | `sessions` | `userId` string, `taskId` string nullable, `status` enum `active/completed/cancelled` default `active`, `durationSeconds` integer default 0, `restEarnedSeconds` integer, `restTakenSeconds` integer, `startedAt` datetime required, `endedAt` datetime nullable, `createdAt` datetime | `key` `userId`, `key` `userId+startedAt`, `key` `status` | `userId` |
| `session_events` | `session_events` | `sessionId` string required, `eventType` string 30, `timestamp` datetime, `payload` string 2000 (JSON) | `key` `sessionId` | `userId` via parent check |

Mapping `schema.ts:4-50`: `uuid gen_random_uuid()` → `ID.unique()` string, `varchar/text` → `string`, `timestamptz` → `datetime`, `jsonb payload` → `string` (JSON.stringify), `smallint/boolean/integer` → `integer/boolean`. FK cascade `users→tasks/sessions` + `sessions→events` `tasks→sessions set null` → manual di API (delete loop + Appwrite Function opsional).

Bucket `avatars` — `maxFileSize 2MB`, `allowedFileExtensions jpg/jpeg/png/webp`, `permissions` `user` only, `fileId` simpan di `profiles.avatarUrl` sebagai `storage.getFileView(bucket, fileId)`.

---

## 4. Auth Flow

**Sekarang:** `auth.routes.ts:20` `hash` + `insert users` + `signToken` (`jose` HS256 `JWT_SECRET` `JWT_EXPIRES_IN 7d`) + `cookie.token httpOnly lax secure` → `getUserFromReq` di 4 modul baca `cookie.token`/`Authorization Bearer` → `verifyToken`.

**Target:** Pakai Appwrite Users.

- `POST /api/auth/register` `{name,email,password}` → `users.create(ID.unique(), email, password, name)` (server SDK `Users`) → `databases.createDocument(profiles, ID.unique(), {userId: user.$id, email, name, restRatio:5, theme:'system', ...})` → `account.createEmailPasswordSession` via `Account` dengan `Client.setKey` tidak bisa; untuk server, buat session via `users.createSession` tidak ada — pakai `account.createEmailPasswordSession` dengan client yang pakai `setKey`? Solusi: tetap buat user via `Users`, lalu buat session via `Account` client yang pakai `API key` tidak support session creation untuk user lain. Pattern Appwrite server: buat user, lalu di response set `set-cookie` dari Appwrite session? Alternatif: tetap flow register → langsung `account.createEmailPasswordSession` dari server dengan `Client` tanpa key tapi dengan `setSession`? Simpler: di `register` panggil `users.create` lalu `databases.createDocument` profiles, lalu buat `account` client baru untuk login: `new Client().setEndpoint().setProject().setKey()` tidak bisa login user. Jadi server harus pakai `Account` dengan `createEmailPasswordSession` menggunakan endpoint+project tanpa key — Appwrite mengizinkan server membuat session via `users.createSession`? Cek SDK: `Users` punya `createSession(userId)` (create session for user). Gunakan itu untuk langsung dapat `session.secret` lalu set cookie `a_session_<projectId>`. Jika tidak ada, fallback: register response 201 tanpa auto-login, frontend panggil `login` terpisah.
- `POST /api/auth/login` `{email,password}` → `account.createEmailPasswordSession` (buat `Client` tanpa key, hanya endpoint+project, lalu `account.createEmailPasswordSession(email,password)` → `session.secret` → `cookie.set('a_session_'+PROJECT_ID, secret, {httpOnly:true, secure:env.cookieSecure, sameSite:'lax', maxAge: 7*24*3600, path:'/'})` + also set `token` cookie untuk compat atau ganti ke `a_session`. Hapus rate-limit `Map` `auth.routes.ts:9`.
- `POST /api/auth/logout` → `account.deleteSession('current')` (dengan session secret dari cookie) → `cookie.remove()`
- `GET /api/me` → `account.get()` (dengan session) → `databases.getDocument` profiles → return `{id, name, email, avatarUrl, restRatio, theme}` (strip `passwordHash` tidak ada lagi)
- `getUserFromReq` → `verifyAppwriteSession(headers,cookie)` → `Client.setEndpoint/setProject/setSession(secret)` → `account.get()` → `{id: user.$id, email: user.email}`. Satu helper `src/lib/appwrite.ts` + `src/middleware/auth.ts:20` `authGuard` dipakai semua route (hapus duplikasi di `tasks/session/analytics/profile`).

Fallback jika Appwrite Users session `secret` tidak bisa di-set dari server SDK dengan API key: pakai Appwrite `Users.createJWT(userId)` lalu buat custom cookie `token` seperti sekarang tapi payload dari Appwrite. Paling aman: tetap buat custom JWT `jose` setelah verifikasi via `users.get`? Tapi itu duplikat. Keputusan final saat implement: coba `users.createSession` dulu, jika tidak ada di SDK `node-appwrite@14`, pakai `account.createEmailPasswordSession` dengan client tanpa key (user password diketahui saat login).

---

## 5. API Rewrite Detail per File

**Env `config/env.ts:3-23`:** Hapus `databaseUrl/databaseSsl/jwtSecret/jwtExpiresIn/bcryptRounds/r2*` + tambah `appwriteEndpoint/appwriteProjectId/appwriteApiKey/appwriteDatabaseId/appwriteCollectionProfiles/Tasks/Sessions/Events/appwriteBucketAvatars`. Keep `nodeEnv/port/corsOrigin/appUrl/apiUrl/restRatioDefault/logLevel`.

**DB `db/index.ts:1`:** `import { drizzle } from 'drizzle-orm/postgres-js'` + `postgres` + `env.databaseUrl` → `import { Client, Databases, Users, Storage, Account, ID, Query } from 'node-appwrite'` + `export const client = new Client().setEndpoint(env.appwriteEndpoint).setProject(env.appwriteProjectId).setKey(env.appwriteApiKey)` + `export const databases = new Databases(client)` etc. `postgres`/`drizzle-orm` dihapus dari `apps/api/package.json:17`.

**Hapus:** `db/schema.ts` `pgTable/relations`, `drizzle.config.ts`, `db/migrations/*`, `db/seed.ts` (ganti `scripts/seed-appwrite.ts` fresh), `apps/api/.dockerignore` keep, `Dockerfile` tetap.

**Routes:**
- `auth.routes.ts:20` `POST /register` `findFirst email 409` → `databases.listDocuments(profiles, [Query.equal('email', email)])` cek `total>0` 409, `hash` → `users.create`, `insert returning` → `databases.createDocument`, `signToken` → Appwrite session, `cookie.set` → `a_session`.
- `auth.routes.ts:34` `POST /login` `compare` + `signToken` → `account.createEmailPasswordSession`, hapus `checkRateLimit`.
- `tasks/task.routes.ts` `GET /` `db.query.tasks.findMany where userId` → `databases.listDocuments(tasks, [Query.equal('userId', userId), Query.orderDesc('createdAt'), Query.limit(limit), Query.offset(offset)])`, `POST /` `insert returning` → `createDocument`, `PATCH/DELETE` cek ownership via `Query.equal('userId', userId)`.
- `session/session.routes.ts:17` `GET /active` `findFirst and(eq(userId),eq(status,'active'))` → `listDocuments(sessions, [Query.equal('userId',userId), Query.equal('status','active'), Query.limit(1)])`, `GET /` pagination `select limit/offset` + `totalRes.length` → `listDocuments` + `response.total`, `POST /` cek existing active 409, `PATCH /:id` `restEarned = floor(duration/restRatio)` ambil `profiles.restRatio` via `databases.getDocument`, `DELETE` → `databases.deleteDocument`.
- `analytics/analytics.routes.ts:25` `select where userId+status completed` → `listDocuments(sessions, [Query.equal('userId',userId), Query.equal('status','completed'), Query.limit(100)])` loop offset sampai `total`, lalu agregasi JS `todayFocus/totalFocus/avgFocus/longest/bestDay/streakDays` tetap.
- `profile/profile.routes.ts` `GET /api/me` + `PATCH /api/me` `update returning` → `databases.getDocument` + `updateDocument`, `POST /api/me/avatar` baru `storage.createFile(bucket, ID.unique(), InputFile.fromBuffer(file, name))` → `avatarUrl = storage.getFileView(bucket, fileId)`.
- `sessionEvents` `payload jsonb` → `payload: JSON.stringify(b.payload ?? {})`.

---

## 6. Frontend `apps/web` — Minim Ubah

Tetap `src/lib/api/client.ts:1` `fetch credentials:include` ke `VITE_API_URL`. Tidak ganti ke Appwrite Web SDK (sesuai pilihan 2). Hanya `stores/auth.ts` `login/register/fetchMe` tetap `api.post`. `settings` `restRatio/theme` tetap `PATCH /api/me`. Avatar upload `FormData` → `POST /api/me/avatar` (multipart). `VITE_APPWRITE_*` tidak perlu di web.

---

## 7. Infra & Env

- HF Spaces Docker `Dockerfile:22` `EXPOSE 7860` + `src/index.ts:5` `0.0.0.0:${PORT}` tetap (Appwrite endpoint external, tidak perlu `DATABASE_URL`).
- `docker-compose.yml` hapus `postgres` service + `depends_on healthy`, keep `api` saja untuk lokal dev (`API` tetap call Appwrite Cloud).
- `.env.example:1` ganti `DATABASE_URL/DATABASE_SSL/JWT_SECRET/R2_*` → `APPWRITE_ENDPOINT/PROJECT_ID/API_KEY/DATABASE_ID/COLLECTION_*/BUCKET_AVATARS` + `CORS_ORIGIN` tetap, `PORT 7860` HF.
- `.env.hf.api:10` template baru Appwrite, `.gitignore:7` sudah ` .env.hf*`.
- `AGENTS.md:41` `dotenv/config` single reader tetap `config/env.ts`, `TEST-RUN-BUILD.md:5.3` update HF Spaces + Appwrite Cloud steps, `env.md:2` tambah Appwrite collection/bucket setup, `README.md:9` update.

---

## 8. Seed & Data

Fresh DB: `scripts/seed-appwrite.ts` (`bun run src/db/seed-appwrite.ts`) → buat 1 Appwrite user `demo@flowdoro.app / password123` via `users.create` + `profiles` doc + 5 `tasks` + 15 `sessions` + `sessionEvents` (mirip `seed.ts:9-36` tapi pakai `databases.createDocument`). Tidak ada migrasi SQL lagi.

---

## 9. Testing & Verifikasi

- `bun --version` >=1.1, `bun install` (tambah `node-appwrite`), `bun run --cwd apps/api build` `1.11MB`, `bun run --cwd apps/api typecheck` `EXIT 0` (sudah fix `bun-types`+`@types/bcryptjs@2.4.6` kemarin), `bun run --cwd apps/web build` `96kB`, `docker build -f Dockerfile .` `EXPOSE 7860`.
- E2E `curl` (HF `7860`): `POST /api/auth/register` 200 → `Set-Cookie a_session`, `POST /api/auth/login` 401→200, `GET /api/me` 200, `POST /api/tasks` → `GET /api/tasks`, `POST /api/sessions` → `PATCH completed` cek `restEarnedSeconds`, `GET /api/analytics/summary` `streak`.
- Appwrite Console cek `databases.listDocuments` total + Storage bucket file view 200.

---

## 10. Risiko & Mitigasi

- **No JOIN/pagination limit 100** → loop `offset` + `total` check, sudah ada `totalRes.length` hack akan diganti `response.total`.
- **FK cascade manual** → helper `deleteUserCascade` + maybe Appwrite Function `on sessions.delete` clean `session_events`.
- **Appwrite Cloud pause 1 minggu** → cron `GET /api/health` harian + `GET /api/me` keep warm.
- **Password migrasi tidak mungkin** → fresh, komunikasikan reset.
- **Lock-in:** isolate `src/lib/appwrite.ts` wrapper, keep `schema.ts` di `render.yaml.deprecated` branch untuk rollback `git revert`.

---

## 11. Task Breakdown & Estimasi

`T-APPW-01` Appwrite Cloud project DB bucket API key (2h) — manual console
`T-APPW-02` env+client `node-appwrite` (1h)
`T-APPW-03` middleware auth (2h)
`T-APPW-04` auth routes (3h)
`T-APPW-05` tasks (2h)
`T-APPW-06` sessions+events (4h)
`T-APPW-07` analytics+profile (2h)
`T-APPW-08` storage avatar (2h)
`T-APPW-09` seed+hapus drizzle (1h)
`T-APPW-10` infra docs (2h)
`T-APPW-11` verifikasi (2h) — total ±3 hari

---

## 12. Keputusan Terbuka yang Sudah Locked

1. Cloud (bukan self-host) 2. Fetch tetap (bukan Web SDK) 3. Storage pindah Appwrite 4. Fresh DB — tidak perlu tanya lagi.
