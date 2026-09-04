# ENV.md — Cara Mendapatkan Environment Variables Flowdoro

Semua env untuk **Workers** dibaca di `apps/api-cloudflare/src/lib/env.ts` via `c.env` (Wrangler). Local dev pakai `.dev.vars` (copy dari `.env`). Frontend baca `import.meta.env.VITE_API_URL` dari `apps/web/src/lib/api/client.ts` (build-time) & proxy `apps/web/vite.config.ts` (`loadEnv API_URL`).

> Semua perintah wajib `bun` (jangan `npm/node`) — sesuai `AGENTS.md`.

Sejak **T-APPW** + **BETTER-AUTH-D1**, backend sudah migrasi ke **Appwrite Cloud** (DB+Storage) + **Better Auth + D1** (Auth, 100% free). Tidak ada lagi `DATABASE_URL`/`JWT_SECRET`/`R2_*`/`BCRYPT_ROUNDS`, tapi `GOOGLE_*` + `BETTER_AUTH_*` + `GITHUB_*` **masih dipakai** (Better Auth social + Calendar).

---

## 1. Ringkas — Tabel Env

| Variable | Wajib? | Default (local) | Dipakai di | Cara dapat |
|---|---|---|---|---|
| `APPWRITE_ENDPOINT` | — | `https://sgp.cloud.appwrite.io/v1` | `env.ts` | §2 |
| `APPWRITE_PROJECT_ID` | **Wajib** | `""` | `env.ts` | §2 |
| `APPWRITE_API_KEY` | **Wajib** | `""` | `env.ts` (server key) | §2 — **wajib Secret** (`wrangler secret put`) |
| `APPWRITE_DATABASE_ID` | Opsional | `flowdoro` | `env.ts` | §2 |
| `APPWRITE_COLLECTION_PROFILES` / `_TASKS` / `_SESSIONS` / `_EVENTS` / `_LISTS` | Opsional | `profiles` / `tasks` / `sessions` / `session_events` / `lists` | `env.ts` | §2 |
| `APPWRITE_BUCKET_AVATARS` | Opsional | `avatars` | `env.ts` | §3 |
| `CORS_ORIGIN` | **Wajib** | `http://localhost:5173` | `env.ts` CORS | §4 |
| `APP_URL` / `API_URL` / `FRONTEND_URL` | Opsional | `http://localhost:*` | `env.ts` | §4 |
| `VITE_API_URL` | **Wajib prod web** | `""` (relative) | `client.ts` `VITE_API_URL` | §4 — `http://localhost:8787` lokal, `https://api.flowdoro.3scode.my.id` prod (build via `deploy-web.sh`) |
| `BETTER_AUTH_URL` | **Wajib** | `http://localhost:8787` | `env.ts` `betterAuthUrl` | **Wajib** `https://api.flowdoro.3scode.my.id` prod (`wrangler.toml`) — Better Auth `redirect_uri = BETTER_AUTH_URL + /api/auth/callback/google` |
| `BETTER_AUTH_SECRET` | **Wajib** | `ba11aaa...` dummy | `env.ts` | `openssl rand -hex 32` — **wajib secret** (`wrangler secret put`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | **Wajib** social | `""` | `env.ts`/`auth.ts` | Google Console `152902907428-q1ema…` + `GOCSPX-...` — 1 Client ID dipakai **2 flow** (social + calendar) |
| `GOOGLE_REDIRECT_URI` | **Wajib** calendar | `http://localhost:8787/api/google/callback` | `env.ts`/`google.ts` | `https://api.flowdoro.3scode.my.id/api/google/callback` prod — **beda** dari Better Auth `/api/auth/callback/google` |
| `GOOGLE_TOKEN_ENCRYPTION_KEY` | **Wajib** calendar | `0000…` fallback | `env.ts` | `openssl rand -hex 32` — **wajib secret** |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Opsional | `""` | `auth.ts` | Kosongkan jika tidak pakai GitHub |
| `RESEND_API_KEY` | Opsional* | `""` | `env.ts` | §5 |
| `REST_RATIO_DEFAULT` | Opsional | `5` | `env.ts` | `5` (1/5) |
| `RESEND_API_KEY` | Opsional* | `""` | `env.ts` | §5 |
| `SENTRY_DSN` | Opsional | `""` | `env.ts` future | §6 |
| `LOG_LEVEL` | Opsional | `info` | `env.ts` | `info`/`debug` |
| `NODE_ENV` | Wajib prod | `development` | `env.ts` | `production` di Workers |

`*` fitur belum aktif di V1 (email reset via Resend) — kosongkan tidak masalah.

---

## 2. Appwrite Cloud — Auth + DB + Storage

Appwrite Cloud free tier: 75K MAU, 2GB storage, 750K executions, 5GB bandwidth, **1 database + 1 bucket per project**, *pause setelah 1 minggu idle*.

### Setup satu kali (console)

1. Daftar/masuk → **cloud.appwrite.io** → buat project (mis. `flowdoro`), region **Singapore** (`sg`).
2. **Databases** → buat database `flowdoro` → buat 5 collections:

**Collection `profiles`** — atribut: `userId` string(36) required, `email` string(255), `name` string(120), `avatarUrl` string(500), `restRatio` integer (3-6, default 5), `theme` enum(`system`,`light`,`dark`), `notificationsEnabled` boolean, `soundEnabled` boolean, `createdAt` datetime, `updatedAt` datetime. **Index**: `key` `userId`, `unique` `email`.

**Collection `tasks`** — atribut: `userId` string required, `name` string(120), `title` string(120), `starred` boolean, `listId` string(36), `createdAt` datetime. **Index**: `key` `userId`.

**Collection `sessions`** — atribut: `userId` string, `taskId` string, `status` enum(`active`,`completed`,`cancelled`), `durationSeconds` integer, `restEarnedSeconds` integer, `restTakenSeconds` integer, `startedAt` datetime, `endedAt` datetime, `createdAt` datetime. **Index**: `key` `userId`, `key` `userId`+`startedAt`, `key` `status`.

**Collection `session_events`** — atribut: `sessionId` string required, `eventType` string(30), `timestamp` datetime, `payload` string(2000). **Index**: `key` `sessionId`.

**Collection `lists`** — atribut: `userId` string required, `name` string(120), `sortOrder` integer, `createdAt` datetime. **Index**: `key` `userId`.

3. **Storage** → buat bucket `avatars` → **max file size 2MB**, **Allowed file extensions** `jpg`, `jpeg`, `png`, `webp`.

4. **API Keys** (kiri, gear) → **Add API key** → pilih scope:
   - `users.read`, `users.write`
   - `databases.read`, `databases.write`
   - `storage.read`, `storage.write`, `storage.delete`
   - `account.read`, `account.write`
   → salin **API key** → isi `APPWRITE_API_KEY`.

5. Isi `.env` + `.dev.vars` (untuk `wrangler dev`):

```bash
APPWRITE_ENDPOINT=https://sgp.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=<project-id>
APPWRITE_API_KEY=<api-key>
APPWRITE_DATABASE_ID=flowdoro
APPWRITE_COLLECTION_PROFILES=profiles
APPWRITE_COLLECTION_TASKS=tasks
APPWRITE_COLLECTION_SESSIONS=sessions
APPWRITE_COLLECTION_EVENTS=session_events
APPWRITE_COLLECTION_LISTS=lists
APPWRITE_BUCKET_AVATARS=avatars
```

> **Catatan Appwrite Cloud** — project *pause* setelah 1 minggu tanpa aktivitas. Mitigasi: cron harian `GET /api/health` untuk keep warm.

---

## 3. Appwrite Storage (Avatar)

- Bucket `avatars` menyimpan file profil. `profiles.avatarUrl` menyimpan URL view.
- Endpoint upload: `POST /api/me/avatar` (multipart `file`) di `apps/api-cloudflare/src/routes/profiles.ts`.

---

## 4. CORS & URL

- `CORS_ORIGIN` single origin yang diizinkan. Local `http://localhost:5173`. Prod `https://flowdoro.3scode.my.id` (set di `wrangler.toml` `[vars]` + Dashboard).
- `VITE_API_URL` (web, build-time) → default `http://localhost:8787` (local), prod `https://api.flowdoro.3scode.my.id` (set saat `deploy-web.sh`).

---

## 5. RESEND_API_KEY

- Opsional (fitur email reset belum aktif V1). Resend.com → API key. Jika dipakai, set via `wrangler secret put RESEND_API_KEY`.

---

## 6. SENTRY_DSN

- Opsional. Kosongkan jika tidak pakai Sentry.

---

## Deploy Cloudflare (ringkas)

- **API Workers:** `wrangler secret put APPWRITE_API_KEY` lalu `bash deploy-cf.sh` atau `bun run --cwd apps/api-cloudflare deploy`.
- **Web Pages:** `VITE_API_URL=https://api.flowdoro.3scode.my.id bun run --cwd apps/web build` lalu `wrangler pages deploy apps/web/dist --project-name=flowdoro-web` (atau `bash deploy-web.sh`).
