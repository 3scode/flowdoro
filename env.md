# ENV.md — Cara Mendapatkan Environment Variables Flowdoro

Semua env dibaca **hanya** di `apps/api/src/config/env.ts` via `dotenv/config` dari **satu file di root** `.env` (disalin dari `.env.example`). Frontend baca `import.meta.env.VITE_API_URL` dari `apps/web/src/lib/api/client.ts` (build-time) & proxy `apps/web/vite.config.ts` (`loadEnv API_URL`).

> Semua perintah wajib `bun` (jangan `npm/node`) — sesuai `AGENTS.md`.

Sejak **T-APPW**, backend sudah migrasi ke **Appwrite Cloud** (Auth + DB + Storage). Tidak ada lagi `DATABASE_URL`/`JWT_SECRET`/`R2_*`/`BCRYPT_ROUNDS`.

---

## 1. Ringkas — Tabel Env

| Variable | Wajib? | Default (local) | Dipakai di | Cara dapat |
|---|---|---|---|---|
| `APPWRITE_ENDPOINT` | — | `https://cloud.appwrite.io/v1` | `env.ts` `node-appwrite` client | §2 |
| `APPWRITE_PROJECT_ID` | **Wajib** | `""` | `env.ts` | §2 |
| `APPWRITE_API_KEY` | **Wajib** | `""` | `env.ts` (server key) | §2 — di HF Spaces wajib **Secret** |
| `APPWRITE_DATABASE_ID` | Opsional | `flowdoro` | `env.ts` | §2 |
| `APPWRITE_COLLECTION_PROFILES` / `_TASKS` / `_SESSIONS` / `_EVENTS` | Opsional | `profiles` / `tasks` / `sessions` / `session_events` | `env.ts` | §2 |
| `APPWRITE_BUCKET_AVATARS` | Opsional | `avatars` | `env.ts` | §3 |
| `CORS_ORIGIN` | **Wajib** | `http://localhost:5173` | `env.ts` cors `app.ts` | §4 |
| `APP_URL` / `API_URL` / `FRONTEND_URL` | Opsional | `http://localhost:*` | `env.ts` | §4 |
| `VITE_API_URL` | **Wajib prod web** | `""` (relative) | `client.ts` `VITE_API_URL` | §4 |
| `REST_RATIO_DEFAULT` | Opsional | `5` | `env.ts` | `5` (1/5) |
| `RESEND_API_KEY` | Opsional* | `""` | `env.ts` | §5 |
| `SENTRY_DSN` | Opsional | `""` | `env.ts` future | §6 |
| `LOG_LEVEL` | Opsional | `info` | `env.ts` | `info`/`debug` |
| `NODE_ENV` | Wajib prod | `development` | `env.ts` | `production` di HF Spaces |
| `PORT` | Opsional | `3000` | `env.ts` | `3000` local, `7860` di HF Spaces (wajib) |

`*` fitur belum aktif di V1 (email reset via Resend) — kosongkan tidak masalah.

---

## 2. Appwrite Cloud — Auth + DB + Storage

Appwrite Cloud free tier: 75K MAU, 2GB storage, 750K executions, 5GB bandwidth, **1 database + 1 bucket per project**, *pause setelah 1 minggu idle*.

### Setup satu kali (console)

1. Daftar/masuk → **cloud.appwrite.io** → buat project (mis. `flowdoro`), region **Singapore** (`sg`).
2. **Databases** → buat database `flowdoro` → buat 4 collections. Untuk tiap collection buat atribut + index:

**Collection `profiles`** — atribut: `userId` string(36) required, `email` string(255), `name` string(120), `avatarUrl` string(500), `restRatio` integer (3-6, default 5), `theme` enum(`system`,`light`,`dark`), `notificationsEnabled` boolean, `soundEnabled` boolean, `googleId` string(100), `createdAt` datetime, `updatedAt` datetime. **Index**: `key` `userId`, `unique` `email`, `key` `googleId`.

**Collection `tasks`** — atribut: `userId` string required, `name` string(120), `createdAt` datetime. **Index**: `key` `userId`.

**Collection `sessions`** — atribut: `userId` string, `taskId` string, `status` enum(`active`,`completed`,`cancelled`), `durationSeconds` integer, `restEarnedSeconds` integer, `restTakenSeconds` integer, `startedAt` datetime, `endedAt` datetime, `createdAt` datetime. **Index**: `key` `userId`, `key` `userId`+`startedAt`, `key` `status`.

**Collection `session_events`** — atribut: `sessionId` string required, `eventType` string(30), `timestamp` datetime, `payload` string(2000). **Index**: `key` `sessionId`.

3. **Storage** → buat bucket `avatars` → **max file size 2MB**, **Allowed file extensions** `jpg`, `jpeg`, `png`, `webp`, **Permissions** read/write untuk user pemilik.

4. **API Keys** (kiri, gear) → **Add API key** → pilih scope:
   - `users.read`, `users.write`
   - `databases.read`, `databases.write`
   - `storage.read`, `storage.write`, `storage.delete`
   - `account.read`, `account.write`
   → salin **API key** → isi `APPWRITE_API_KEY`.

5. Isi `.env`:

```bash
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=<project-id>
APPWRITE_API_KEY=<api-key>
APPWRITE_DATABASE_ID=flowdoro
APPWRITE_COLLECTION_PROFILES=profiles
APPWRITE_COLLECTION_TASKS=tasks
APPWRITE_COLLECTION_SESSIONS=sessions
APPWRITE_COLLECTION_EVENTS=session_events
APPWRITE_BUCKET_AVATARS=avatars
```

> **Catatan Appwrite Cloud** — project *pause* setelah 1 minggu tanpa aktivitas. Mitigasi: cron harian `GET /api/health` untuk keep warm.

---

## 3. Appwrite Storage (Avatar)

- Bucket `avatars` menyimpan file profil. `profiles.avatarUrl` menyimpan URL view: `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_BUCKET_AVATARS}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`.
- Endpoint upload: `POST /api/me/avatar` (multipart `file`) di `apps/api/src/modules/profile/profile.routes.ts`.
- Tidak ada R2 lagi — `R2_ACCOUNT_ID`/`R2_PUBLIC_URL` dihapus (T-APPW).

---

## 4. CORS & URL

- `CORS_ORIGIN` komma-separated list origin yang diizinkan. Local `http://localhost:5173`. Di HF Spaces API → set ke URL web.
- `VITE_API_URL` (web, build-time) → default relative (`""`), diisi URL API HF Spaces saat build web.
- Contoh HF Spaces:
  - `CORS_ORIGIN=https://huggingface.co/spaces/<username>/flowdoro-web` atau `https://<username>-flowdoro-web.hf.space`
  - `API_URL=https://<username>-flowdoro-api.hf.space`

---

## 5. RESEND_API_KEY

- Opsional (fitur email reset belum aktif V1). Resend.com → API key. Di HF Spaces masuk **Secrets** jika dipakai.

---

## 6. SENTRY_DSN

- Opsional. Kosongkan jika tidak pakai Sentry.

---

## Deploy HF Spaces (ringkas)

Lihat `TEST-RUN-BUILD.md` §5.3 untuk langkah penuh. Inti:
- Space **flowdoro-api** (Docker): env `PORT=7860`, `APPWRITE_*` — **`APPWRITE_API_KEY` sebagai Secret**, sisanya Variables.
- `NODE_ENV=production` → cookie session `secure` aktif; butuh `CORS_ORIGIN` yang tepat agar browser tidak blok `SameSite`.
