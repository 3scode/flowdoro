# Flowdoro — Manual Setup Guide

> Panduan ini diperlukan setelah code selesai dibangun. Ikuti langkah-langkah berikut agar fitur Task + Google Calendar berjalan.

---

## 1. Appwrite Console — Update Collection `tasks`

✅ **Selesai via CLI** — semua kolom sudah dibuat:

**tasks table** (12 kolom):
- `title` (varchar 512) + data migrated dari `name`
- `description` (text)
- `status` (enum: pending,done)
- `dueDate`, `dueTime` (varchar 256)
- `priority` (integer, 0-3)
- `parentId` (varchar 256, untuk subtask)
- `sortOrder` (integer, untuk drag0026drop reorder)
- `completedAt` (datetime)
- `googleEventId` (varchar 512)

**google_tokens table** (7 kolom):
- `userId` (varchar 256, required)
- `encryptedAccessToken` (varchar 2048)
- `encryptedRefreshToken` (varchar 2048)
- `scope` (varchar 512)
- `calendarId` (varchar 256)
- `expiresAt` (datetime)
- `updatedAt` (datetime)

---

Buka Appwrite Console → Database `flowdoro` → Collection `tasks` → Attributes, tambahkan field berikut (jika belum ada):

| Field | Tipe | Default | Nullable |
|---|---|---|---|
| `title` | String | `""` | No |
| `description` | String | — | Yes |
| `status` | String | `"pending"` | No |
| `dueDate` | String | — | Yes |
| `dueTime` | String | — | Yes |
| `priority` | Integer | `0` | No |
| `parentId` | String | — | Yes |
| `sortOrder` | Integer | `0` | No |
| `completedAt` | String | — | Yes |
| `googleEventId` | String | — | Yes |

**Penting:** Rename field lama `name` → `title`. Migrasi data existing jika ada task lama.

### Buat Collection Baru: `google_tokens`

| Field | Tipe |
|---|---|
| `userId` | String |
| `encryptedAccessToken` | String |
| `encryptedRefreshToken` | String |
| `scope` | String |
| `calendarId` | String |
| `expiresAt` | String |
| `updatedAt` | String |

**Permissions:** Pastikan API key server (admin) punya akses `read` + `write` ke collection ini.

---

## 2. Google Cloud Console — Buat OAuth Client ID (Gratis)

1. Buka https://console.cloud.google.com
2. Buat project baru (gratis, **tanpa kartu kredit**)
3. **APIs & Services → Library** → cari dan aktifkan **Google Calendar API**
4. **APIs & Services → OAuth consent screen**
   - User type: **External**
   - Isi nama app = `Flowdoro`, email contact kamu
   - Add scope: `.../auth/calendar.events`
   - Add test user = email kamu (bisa tambah nanti)
   - Save & continue sampai selesai
5. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `Flowdoro (local)`
   - Authorized redirect URIs: `http://localhost:3000/api/google/callback`
   - Klik **Create** → copy **Client ID** dan **Client Secret**

---

## 3. Isi Environment Variables

```bash
cd /home/3scode/code/flowdoro
cp .env.example .env
```

Edit `.env` dan isi nilai asli:

```bash
# Appwrite — isi dari console.appwrite.io
APPWRITE_PROJECT_ID=<project-id>
APPWRITE_API_KEY=<api-key-server>
APPWRITE_DATABASE_ID=flowdoro

# Google — hasil dari Langkah 2
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCXXX-xxxxxxxxxxxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback

# Generate random 32-byte hex key untuk enkripsi token
# Jalankan perintah ini di terminal:
#   openssl rand -hex 32
# lalu tempel hasilnya ke baris bawah:
GOOGLE_TOKEN_ENCRYPTION_KEY=<64-hex-char>
```

---

## 4. Seed Database (Opsional)

```bash
bun run --cwd apps/api seed:dev
```

---

## 5. Jalankan Aplikasi

Terminal 1 — Backend:
```bash
bun run dev:api
# → http://localhost:3000
```

Terminal 2 — Frontend:
```bash
bun run dev:web
# → http://localhost:5173
```

---

## 6. Cara Pakai Fitur Baru

### Task Manager
1. Buka http://localhost:5173/tasks
2. Klik **New Task** → isi title, due date, priority
3. Drag & drop untuk reorder
4. Centang checkbox untuk tandai selesai (task hilang dari list pending)

### Koneksi Google Calendar
1. Buka Settings → section **Google Calendar**
2. Klik **Connect Google Calendar** → izin muncul di popup Google
3. Setelah approve, semua task ber-due-date yang belum sinkron akan otomatis dibuat event di Google Calendar
4. Saat task di-toggle selesai → event dihapus dari calendar
5. Untuk disconnect: klik **Disconnect**

### Focus Timer + Task
1. Buka /focus
2. Dropdown di atas timer → pilih task yang ingin dikerjakan
3. Start Focus → saat session berakhir, task tersimpan bersama sesi

---

## Troubleshooting

| Masalah | Solusi |
|---|---|
| `UNAUTHORIZED` saat akses `/api/tasks` | Pastikan cookie/session Appwrite valid, cek `.env` |
| OAuth gagal di callback | Verifikasi redirect URI sama persis: `http://localhost:3000/api/google/callback` |
| `GOOGLE_TOKEN_ENCRYPTION_KEY` default warning | Ganti dengan key random sebelum production |
| Task tidak muncul di Calendar | Cek console browser — pastikan sudah connected + ada dueDate |
| Build error di typecheck | Build tetap OK. Beberapa error pre-existing di Focus/InputField (bukan dari fitur baru) |

---

## Ringkasan File yang Diubah/Dibuat

**Backend baru:**
- `apps/api/src/lib/crypto.ts` — enkripsi token
- `apps/api/src/lib/google.ts` — OAuth helper
- `apps/api/src/lib/calendar.ts` — sync ke Google Calendar
- `apps/api/src/modules/google/google.routes.ts` — endpoint OAuth

**Backend diubah:**
- `apps/api/src/modules/tasks/task.routes.ts` — full CRUD + calendar trigger
- `apps/api/src/app.ts` — register google routes
- `apps/api/src/config/env.ts` — env vars Google
- `apps/api/src/lib/appwrite.ts` — collection `googleTokens`
- `apps/api/package.json` — deps `googleapis`

**Frontend baru:**
- `apps/web/src/lib/pages/Tasks.svelte` — halaman Tasks lengkap

**Frontend diubah:**
- `apps/web/src/App.svelte` — route `/tasks`
- `apps/web/src/lib/components/layout/Navigation.svelte` — menu item Tasks
- `apps/web/src/lib/pages/Settings.svelte` — section Google Calendar
- `apps/web/src/lib/pages/Focus.svelte` — task selector dropdown
- `apps/web/src/lib/api/client.ts` — methods `tasks.*` + `google.*`
