# BA-06: Migrasi Data Appwrite → D1 + Seed

**ID:** BA-06
**Tech Spec:** §3, §9
**Prioritas:** 🟡 Mid
**Effort:** M
**Dep:** BA-02
**Status:** Pending

### Tujuan
Map `userId` lama (Appwrite `$id`) ke baru (Better Auth `user.id`) untuk `profiles/tasks/sessions/lists/google_tokens`.

### File
- `scripts/migrate-appwrite-to-better-auth.mjs` (NEW)
- `scripts/seed-better-auth.mjs` (NEW) atau update `scripts/seed.mjs:1`

### Checklist
- [ ] `seed-better-auth.mjs` pakai `betterFetch` atau `auth.api.signUpEmail` untuk buat `demo@flowdoro.app / password123`, jangan `node-appwrite Users.create`
- [ ] `migrate-*.mjs` list Appwrite `users` (via `node-appwrite Users.list`) + `profiles` + `tasks` + `sessions` + `lists` + `google_tokens`, untuk tiap user buat Better Auth user via `POST /api/auth/sign-up/email` atau D1 direct `INSERT INTO user`, build map `oldId→newId`, update semua collections via `dbUpdate` Appwrite patch `userId`
- [ ] `after` hook di `auth.ts` untuk user baru: `dbCreate` profiles otomatis (jadi migrate hanya untuk existing)
- [ ] Test di local D1 `--local` dulu sebelum remote
- [ ] Backup: `wrangler d1 export flowdoro-auth` sebelum run remote

### Acceptance
- [ ] `demo` user bisa login via email/pass baru
- [ ] `GET /api/tasks` return tasks dengan `userId` baru
- [ ] `GET /api/sessions` + `analytics` tetap hitung streak
- [ ] Tidak ada orphan `userId` lama di Appwrite
