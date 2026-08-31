# Flowdoro — Technical Specification

> **Version:** 1.0
> **Date:** 2026-08-31
> **Based on:** `.agents/PRD.md` v1.0 + `.agents/DESIGN.md` v1.0
> **Platform:** Web + PWA
> **Stack:** Svelte + Tailwind CSS + Vite + Bun + ElysiaJS + Drizzle ORM + PostgreSQL + Docker + Render

---

## Unique Value Proposition

> **"Work until your focus fades, rest in proportion. No arbitrary countdowns interrupting flow."**

Flowdoro is a smart time management platform using proportional rest (5:1 ratio). Users track focus duration flexibly with a count-up stopwatch instead of rigid timers. The platform auto-calculates break allowance based on work duration, and displays a real-time productivity dashboard with session history.

---

---

## BAGIAN 1: Tech Stack & Arsitektur

### Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Svelte (SPA) | 5.37.0 |
| Build Tool | Vite | 6.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| State Management | Svelte runes (built-in) + TanStack Query | 5.x |
| PWA | vite-plugin-pwa (Workbox) | Latest |
| Monitoring (Frontend) | Sentry | Latest |
| Runtime | Bun | Latest (stable ≥ 1.1) |
| Backend | ElysiaJS | 1.3.x |
| Database | PostgreSQL | 16+ |
| ORM | Drizzle ORM + drizzle-kit | Latest (0.31+) |
| Validation | Zod | 3.x |
| Auth | JWT (jose) + bcrypt | Latest |
| File Storage | Cloudflare R2 (S3-compatible) | — |
| Email | Resend | Latest |
| Containerization | Docker | Latest |
| PaaS | Render (web service + managed PostgreSQL) | — |

---

### Arsitektur Sistem

```
                         ┌──────────────────────┐
                         │     Browser (PWA)     │
                         │  Svelte 5 + Tailwind  │
                         │  Timer (client-side)  │
                         └──────────┬───────────┘
                                    │ HTTPS / REST JSON
                                    ▼
                         ┌──────────────────────┐
                         │    ElysiaJS API       │
                         │   (Bun, :3000)        │
                         │  - Auth (JWT)         │
                         │  - Sessions           │
                         │  - Analytics          │
                         │  - Profile/Upsert     │
                         └──────┬───────┬───────┘
                                │       │
                    Drizzle ORM │       │
                                ▼       │
                    ┌───────────────────┐│   ┌──────────────────────┐
                    │   PostgreSQL 16    ││   │   Cloudflare R2       │
                    │  (Render managed)  ││   │  (avatars)            │
                    └───────────────────┘│   └──────────────────────┘
                                         ▼
                              ┌──────────────────────┐
                              │   Resend (email)      │
                              │  reset password       │
                              └──────────────────────┘
```

**Alur utama timer:**
- Timer berjalan **client-side** (requestAnimationFrame) — real-time, akurat, offline-capable
- Session record disimpan ke server saat stop/break selesai
- Jika offline → simpan ke IndexedDB → sync saat online (background queue)

---

### Struktur Folder

```
flowdoro/
├── apps/
│   ├── web/                          # Frontend SPA (Vite + Svelte)
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── api/             # TanStack Query hooks
│   │   │   │   ├── components/
│   │   │   │   │   ├── ui/          # Reusable atoms (Button, Input, Card, Modal, Toast)
│   │   │   │   │   ├── focus/       # CircularTimer, BreakTimer
│   │   │   │   │   ├── analytics/   # Charts, Heatmap
│   │   │   │   │   └── layout/      # Sidebar, TopBar, BottomNav
│   │   │   │   ├── stores/          # Svelte runes (timer, auth, settings)
│   │   │   │   ├── db/              # IndexedDB (offline queue)
│   │   │   │   ├── utils/           # formatTime, ratio calculate, etc.
│   │   │   │   └── types.ts         # Shared TS types
│   │   │   ├── routes/              # SPA pages (router)
│   │   │   │   ├── +page.svelte     # Landing
│   │   │   │   ├── +login.svelte
│   │   │   │   ├── +register.svelte
│   │   │   │   ├── +dashboard.svelte
│   │   │   │   ├── +focus.svelte
│   │   │   │   ├── +history.svelte
│   │   │   │   ├── +history/[id].svelte
│   │   │   │   ├── +analytics.svelte
│   │   │   │   └── +settings.svelte
│   │   │   ├── app.css              # Tailwind import + tokens
│   │   │   └── main.ts
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   └── api/                         # Backend (ElysiaJS + Bun)
│       ├── src/
│       │   ├── index.ts             # Server entry
│       │   ├── app.ts               # Elysia app instance
│       │   ├── db/
│       │   │   ├── index.ts         # Drizzle client
│       │   │   ├── schema.ts        # Drizzle schema
│       │   │   └── migrations/      # drizzle-kit generated
│       │   ├── modules/
│       │   │   ├── auth/            # auth.routes.ts, auth.service.ts
│       │   │   ├── session/         # session.routes.ts, session.service.ts
│       │   │   ├── analytics/       # analytics.routes.ts, analytics.service.ts
│       │   │   ├── profile/         # profile.routes.ts, upload.service.ts
│       │   │   └── health/          # health.routes.ts
│       │   ├── middleware/
│       │   │   ├── auth.ts          # JWT guard
│       │   │   ├── error.ts         # Global error handler
│       │   │   ├── rateLimit.ts     # Rate limiting
│       │   │   └── requestLog.ts    # Structured logging
│       │   └── config/
│       │       └── env.ts           # Env validation (zod)
│       ├── drizzle.config.ts
│       ├── Dockerfile
│       └── package.json
├── docker-compose.yml               # Local dev (api + postgres)
├── .env.example
├── .github/
│   └── workflows/
│       └── ci.yml                   # CI/CD pipeline
└── README.md
```

---

### Code Snippets

```bash
# Scaffold ElysiaJS app
bun create elysia apps/api

# Add frontend
bun create vite@latest apps/web --template svelte-ts
```

```ts
// apps/web/vite.config.ts
import { sveltekit } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    sveltekit(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Flowdoro',
        short_name: 'Flowdoro',
        theme_color: '#0D9488',
        background_color: '#0F172A',
        display: 'standalone',
        icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
      workbox: { navigateFallback: '/index.html' },
    }),
  ],
})
```

```ts
// apps/api/src/index.ts
import { app } from './app'

app.listen(3000, () => {
  console.log('🦊 Flowdoro API running on http://localhost:3000')
})
```

---

### Justifikasi

- **Svelte 5:** Kompilator menghasilkan bundle kecil, performa tinggi, `runes` untuk reactivity sederhana — cocok untuk timer real-time yang butuh update DOM minim.
- **Tailwind 4:** Utility-first cepat, tema dark mode built-in, konsisten dengan design tokens di DESIGN.md.
- **ElysiaJS + Bun:** Type-safe end-to-end, performa sangat tinggi, ekosistem Bun cepat (dev/build/test).
- **Drizzle ORM + PostgreSQL:** Relasional (user→session→event), type-safe, migrasi mudah via drizzle-kit.
- **Render:** PaaS sederhana untuk container Docker + managed PostgreSQL, auto-deploy + auto-scale.
- **TanStack Query:** Caching + invalidation untuk dashboard/analytics/history.

---

---

## BAGIAN 2: Database Design

### Ringkasan Database

| Item | Detail |
|------|--------|
| Database | PostgreSQL 16 |
| ORM/Driver | Drizzle ORM + postgres-js |
| Pendekatan | Relational |
| Tools Migrasi | drizzle-kit |
| Ekstensi | `pgcrypto` (gen_random_uuid), `citext` (email case-insensitive) |

---

### Entity Overview

#### users

| Field | Type | Constraints | Cardinality |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | 1:N → sessions |
| email | CITEXT | NOT NULL, UNIQUE | |
| password_hash | TEXT | NULLABLE (null jika OAuth-only) | |
| name | VARCHAR(120) | NOT NULL | |
| avatar_url | TEXT | NULLABLE | |
| rest_ratio | SMALLINT | NOT NULL, DEFAULT 5 | |
| theme | VARCHAR(10) | NOT NULL, DEFAULT 'system' | |
| notifications_enabled | BOOLEAN | NOT NULL, DEFAULT false | |
| sound_enabled | BOOLEAN | NOT NULL, DEFAULT false | |
| google_id | VARCHAR(100) | NULLABLE, UNIQUE | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |
| deleted_at | TIMESTAMPTZ | NULLABLE (soft delete) | |

#### session_events

| Field | Type | Constraints | Cardinality |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | |
| session_id | UUID | NOT NULL, FK → sessions.id ON DELETE CASCADE | M:1 → session |
| event_type | VARCHAR(30) | NOT NULL (focus_started, pause, resume, break_started, break_ended, session_ended) | |
| timestamp | TIMESTAMPTZ | NOT NULL | |
| payload | JSONB | NULLABLE (extra data) | |

#### sessions

| Field | Type | Constraints | Cardinality |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL, DEFAULT gen_random_uuid() | 1:N → session_events |
| user_id | UUID | NOT NULL, FK → users.id ON DELETE CASCADE | M:1 → user |
| task_id | UUID | NULLABLE, FK → tasks.id ON DELETE SET NULL | M:1 → task |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'active' (active/completed/aborted) | |
| duration_seconds | INTEGER | NOT NULL, DEFAULT 0 | |
| rest_earned_seconds | INTEGER | NOT NULL, DEFAULT 0 | |
| rest_taken_seconds | INTEGER | NOT NULL, DEFAULT 0 | |
| started_at | TIMESTAMPTZ | NOT NULL | |
| ended_at | TIMESTAMPTZ | NULLABLE | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

#### tasks

| Field | Type | Constraints | Cardinality |
|-------|------|-------------|-------------|
| id | UUID | PK, NOT NULL | 1:N → sessions |
| user_id | UUID | NOT NULL, FK → users.id ON DELETE CASCADE | M:1 → user |
| name | VARCHAR(120) | NOT NULL | |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | |

---

### Cardinality Summary

| Relation | Type | Description |
|----------|------|-------------|
| User → Session | 1:N | Satu user punya banyak session |
| User → Task | 1:N | Satu user punya banyak task |
| Task → Session | 1:N | Satu task bisa dipakai di banyak session |
| Session → SessionEvent | 1:N | Satu session punya banyak event (timeline) |

---

### Index Strategy

| Index | Type | Purpose |
|-------|------|---------|
| `sessions.user_id` | B-tree | Filter sessions per user |
| `sessions.user_id + started_at` | Composite B-tree | Dashboard & history by date range |
| `sessions.status` | B-tree | Query active session (fast check) |
| `session_events.session_id` | B-tree | Fetch timeline per session |
| `tasks.user_id` | B-tree | Filter tasks per user |
| `users.email` | Unique | Login lookup |
| `users.google_id` | Unique | OAuth lookup |

---

### Data Flow

1. `users` adalah root entity — semua data di-scope oleh `user_id`
2. User memulai fokus → `sessions` dibuat dengan `status='active'`, event `focus_started` ditulis ke `session_events`
3. User pause/resume → event `pause`/`resume` ditulis, duration akhir diekstrak
4. User stop → `duration_seconds` dihitung dari delta, `rest_earned_seconds = floor(duration / rest_ratio)`
5. Break berjalan → saat selesai/skip, `rest_taken_seconds` di-update
6. Session complete → `status='completed'`, `ended_at` di-set, event `session_ended`
7. Dashboard/analytics → query agregasi `sessions` grouped by date

---

### Data Migration Strategy

- **From Legacy:** Tidak ada legacy — greenfield. Data migrasi N/A.
- **Versioning:** Semua perubahan skema via `drizzle-kit generate` + `drizzle-kit migrate`. Migration files disimpan di `apps/api/src/db/migrations/`.
- **Rollback:** Setiap migration menurunkan skema lama. Rollback = `drizzle-kit migrate:rollback`.
- **Zero Downtime:** Expand-contract. Tambah kolom nullable dulu → backfill → buat NOT NULL. Delete/drop di release berikutnya.

---

### Seed Data

| Data | Purpose | Quantity |
|------|---------|----------|
| Demo user (dev only) | Testing/local auth | 1 |
| 5 preset tasks | Testing UI task selector | 5 |
| 30 sample sessions | Testing dashboard/analytics UI | 30 |

```bash
# Run seeds
bun run seed:dev
```

---

### Code Snippets

```ts
// apps/api/src/db/schema.ts
import { pgTable, uuid, text, varchar, integer, boolean, smallint, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash'),
  name: varchar('name', { length: 120 }).notNull(),
  avatarUrl: text('avatar_url'),
  restRatio: smallint('rest_ratio').notNull().default(5),
  theme: varchar('theme', { length: 10 }).notNull().default('system'),
  notificationsEnabled: boolean('notifications_enabled').notNull().default(false),
  soundEnabled: boolean('sound_enabled').notNull().default(false),
  googleId: varchar('google_id', { length: 100 }).unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  durationSeconds: integer('duration_seconds').notNull().default(0),
  restEarnedSeconds: integer('rest_earned_seconds').notNull().default(0),
  restTakenSeconds: integer('rest_taken_seconds').notNull().default(0),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
```

---

---

## BAGIAN 3: Interface Design

> Stack: SPA (Svelte) + REST API (ElysiaJS). Frontend ↔ Backend berbasis REST JSON.

### Endpoint List

| Method | Path | Description | Auth | Request Body | Response |
|--------|------|-------------|------|-------------|----------|
| POST | `/api/auth/register` | Register pengguna baru | No | `{ name, email, password }` | `User` + token |
| POST | `/api/auth/login` | Login | No | `{ email, password }` | `User` + token |
| POST | `/api/auth/logout` | Logout | Yes | — | 204 |
| POST | `/api/auth/google` | OAuth login/register Google | No | `{ idToken }` | `User` + token |
| POST | `/api/auth/forgot-password` | Kirim email reset | No | `{ email }` | 204 |
| POST | `/api/auth/reset-password` | Reset password dengan token | No | `{ token, password }` | 204 |
| GET | `/api/me` | Ambil profil user saat ini | Yes | — | `User` |
| PATCH | `/api/me` | Update profil/settings | Yes | `{ name?, restRatio?, theme?, notificationsEnabled?, soundEnabled? }` | `User` |
| POST | `/api/me/avatar` | Upload avatar | Yes | `multipart/form-data` (image) | `{ avatarUrl }` |
| POST | `/api/sessions` | Buat session baru (start focus) | Yes | `{ taskId? }` | `Session` |
| PATCH | `/api/sessions/:id` | Update session (pause/stop/rest) | Yes | `{ status?, durationSeconds?, restEarnedSeconds?, restTakenSeconds?, endedAt? }` | `Session` |
| GET | `/api/sessions/active` | Cek session aktif | Yes | — | `Session \| null` |
| GET | `/api/sessions` | List sessions (filter + pagination) | Yes | `?page&limit&from&to&taskId&sort` | `Session[]` + meta |
| GET | `/api/sessions/:id` | Detail session + timeline | Yes | — | `Session` + `SessionEvent[]` |
| DELETE | `/api/sessions/:id` | Hapus session | Yes | — | 204 |
| GET | `/api/tasks` | List tasks user | Yes | — | `Task[]` |
| POST | `/api/tasks` | Buat task baru | Yes | `{ name }` | `Task` |
| GET | `/api/analytics/summary` | Ringkasan dashboard | Yes | `?period=day\|week\|month` | `AnalyticsSummary` |
| GET | `/api/analytics/history` | Data daily focus untuk chart | Yes | `?period=day\|week\|month` | `AnalyticsPoint[]` |
| GET | `/api/analytics/tasks` | Breakdown per task | Yes | — | `TaskAnalytics[]` |
| GET | `/api/health` | Health check | No | — | `{ status: "ok" }` |

---

### Standarisasi Response Format

**Success:**
```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
}
```

**Error:**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password must be at least 8 characters",
    "details": { "field": "password", "reason": "too_short" }
  },
  "meta": null
}
```

---

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 422 | Input tidak valid |
| NOT_FOUND | 404 | Resource tidak ditemukan |
| UNAUTHORIZED | 401 | Belum login / token invalid / expired |
| FORBIDDEN | 403 | Tidak punya akses ke resource |
| CONFLICT | 409 | Email sudah terdaftar |
| RATE_LIMITED | 429 | Too many requests / login gagal |
| INTERNAL_ERROR | 500 | Server error |

---

### Pagination Format

- **Method:** Page-based (`?page=1&limit=20`)
- **Response meta:** `{ "page": 1, "limit": 20, "total": 100, "totalPages": 5 }`
- **Limit:** default 20, max 100

---

### Code Snippets

```ts
// apps/api/src/modules/session/session.routes.ts
import { Elysia, t } from 'elysia'
import { authGuard } from '../../middleware/auth'
import { db } from '../../db'
import { sessions, sessionEvents } from '../../db/schema'

export const sessionRoutes = new Elysia({ prefix: '/api/sessions' })
  .use(authGuard)
  .get('/', async ({ query, user }) => {
    const page = query.page ?? 1
    const limit = Math.min(query.limit ?? 20, 100)
    const offset = (page - 1) * limit

    // Use Drizzle dynamic filter based on query params
    const list = await db.query.sessions.findMany({
      where: (s, { eq, and, gte, lte, isNull }) => and(
        eq(s.userId, user.id),
        query.taskId ? eq(s.taskId, query.taskId) : undefined,
        query.from ? gte(s.startedAt, new Date(query.from)) : undefined,
        query.to ? lte(s.startedAt, new Date(query.to)) : undefined,
      ),
      limit, offset,
      orderBy: (s, { desc }) => [desc(s.startedAt)],
    })

    return { success: true, data: list, error: null, meta: { page, limit } }
  }, {
    query: t.Object({
      page: t.Optional(t.Number()),
      limit: t.Optional(t.Number()),
      from: t.Optional(t.String()),
      to: t.Optional(t.String()),
      taskId: t.Optional(t.String()),
      sort: t.Optional(t.String()),
    }),
  })
```

---

---

## BAGIAN 4: Alur Logika & Business Rules

> Arsitektur: SPA + API. Flow: User → Frontend (Svelte) → API (ElysiaJS) → DB (PostgreSQL).

### Alur 1: Focus Session (Core Flow)

**Alur Focus Session:**
1. User di `/focus`, pilih task (opsional)
2. Tap "Start Focus" → POST `/api/sessions` → DB buat session `status='active'`
3. Timer mulai **client-side** count-up dari 0 (requestAnimationFrame) — **tidak perlu polling server**
4. Setiap detik: update digits + circular ring + earned rest badge (`elapsed / rest_ratio`)
5. Pause → timer berhenti client-side, event `pause` disimpan lokal
6. Tap "Stop" → konfirmasi modal
7. Pilih "Take Break" → hitung `rest_earned = floor(elapsed_seconds / rest_ratio)`, tampilkan Break overlay (countdown)
8. Break selesai/skip → PATCH `/api/sessions/:id` dengan `rest_taken_seconds`
9. Session complete → `status='completed'`, `ended_at`, toast "Session saved"
10. Sync analytics cache invalidation

**Alur Offline:**
1. Timer terus berjalan client-side meskipun offline
2. Session record disimpan di IndexedDB queue
3. Saat online → background sync flush queue ke API
4. "Offline" badge ditampilkan di UI

### Alur 2: Login

1. User input email + password → POST `/api/auth/login`
2. Server verifikasi password (bcrypt compare)
3. Generate JWT (7 hari) → set httpOnly cookie (`SameSite=Lax`)
4. Frontend redirect ke `/dashboard`
5. Jika 5x gagal → rate limit 15 menit (429)

### Alur 3: Dashboard & Analytics

1. User buka `/dashboard` → TanStack Query fetch `/api/analytics/summary` + `/api/sessions?limit=5`
2. Data di-cache 5 menit (TanStack Query staleTime)
3. Saat session baru selesai → invalidate cache → refetch
4. Analytics hitung: today focus, total focus, streak, weekly chart

### Business Rules (dari PRD)

- **Rest ratio default 1/5** — `restEarned = floor(duration / rest_ratio)` dihitung saat break
- **Hanya 1 active session per user** — jika POST dengan session aktif, auto-save session lama dulu
- **Pause tidak dihitung** dalam duration (timestamp delta adjustment)
- **Break max** = `rest_earned_seconds`. Over-break tidak ditarik dari sesi berikutnya
- **Streak** = hari berturut-turut dengan minimal 1 session `completed`, reset jika melewati midnight user timezone
- **Soft delete untuk users** (set `deleted_at`), hard delete setelah 30 hari (cron)

---

### Error Handling & Retry Strategy

**Global Error Middleware:**
- Elysia `onError` hook menangkap semua error → format standar (Bagian 3)
- Zod validation error → 422 VALIDATION_ERROR dengan detail field

```ts
// apps/api/src/middleware/error.ts
export const errorHandler = (app: Elysia) =>
  app.onError(({ code, error, set }) => {
    if (code === 'VALIDATION') {
      set.status = 422
      return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: error.message }, meta: null }
    }
    if (code === 'NOT_FOUND') {
      set.status = 404
      return { success: false, data: null, error: { code: 'NOT_FOUND', message: 'Not found' }, meta: null }
    }
    console.error(error)
    set.status = 500
    return { success: false, data: null, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' }, meta: null }
  })
```

**Retry Mechanism:**
- **Max Retries:** 3 (untuk POST/PATCH mutation saat offline sync)
- **Backoff:** Exponential + jitter (1s, 2s, 4s)
- **Timeout:** 10s per attempt
- **Idempotency:** POST `/api/sessions` menerima `X-Idempotency-Key` header untuk mencegah duplikasi saat retry offline

**Circuit Breaker:**
- **Threshold:** 5 failures dalam 10 detik → open circuit untuk endpoint
- **Half-Open:** setelah 30s, izinkan 1 request test
- **Fallback:** tidak ada — API lokal, degrade ke offline queue buffer

**Fallback Strategy per Fitur:**

| Fitur | Primary | Fallback | Degradation |
|-------|---------|----------|-------------|
| Timer | Client-side (requstAnimationFrame) | IndexedDB queue | Tetap jalan, sync nanti |
| Dashboard | API (TanStack Query cache) | Cached data (staleTime 5m) | Data usang sementara |
| Analytics | API | Cached data (staleTime 15m) | Data usang sementara |
| Avatar | Cloudflare R2 | Default initials avatar | Tanpa gambar profil |
| OAuth Google | Google API | Login email/password | Tanpa OAuth |

---

---

## BAGIAN 5: Keamanan, Performa, CI/CD & Deployment

### Keamanan

- **Password:** bcrypt 12 rounds, tidak pernah plaintext
- **Auth:** JWT dalam httpOnly cookie (`SameSite=Lax`, `secure` di prod), expiry 7 hari
- **CSRF:** `SameSite` cookie + validasi Origin
- **Input Validation:** Zod di semua endpoint (server-side)
- **SQL Injection:** Parameterized queries via Drizzle ORM
- **XSS:** Svelte auto-escape, CSP header di HTML
- **Rate Limiting:** 5 req/s per IP per endpoint; 5 login gagal = blokir 15 menit
- **Helmet-equivalent headers:** `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`
- **File Upload:** Validasi MIME (JPEG/PNG), max 2MB, resize ke 256x256, unique filename (UUID)
- **Secrets:** `.env` tidak di-commit, semua via environment variables di Render

### Performa

| Metrik | Target |
|--------|--------|
| FCP | < 1.5s |
| LCP | < 2.5s |
| CLS | < 0.1 |
| API p95 | < 300ms |
| Bundle JS | < 150KB gzipped |
| Chunk splitting | Route-based lazy loading |
| Image optimization | Avatars WebP, responsive img |
| Code splitting | Dynamic import untuk charts (analytics page) |

### CI/CD Pipeline

**Branch Strategy:** GitHub Flow (trunk-based dengan PR)

| Stage | Trigger | Actions |
|-------|---------|---------|
| Build | Push ke branch | `bun install` → `bun run lint` → `bun run typecheck` → `bun run test:unit` |
| Test | PR ke main | Integration test → E2E (smoke) |
| Staging | PR merged + manual deploy trigger | Build Docker → deploy ke Render staging → smoke test `/health` |
| Production | Manual approval | Build Docker → deploy prod → `drizzle-kit migrate` → smoke test |

**Rollback Strategy:**
- **Code:** Redeploy image versi sebelumnya (Render immutable deploy)
- **Database:** Migration run terpisah; rollback = migrate:rollback atau restore backup
- **Verification:** `/api/health` + smoke test setelah deploy & rollback

### Deployment

- **Hosting:** Render — Web Service (Docker) + Managed PostgreSQL
- **Build:** Docker multi-stage (Bun build → dist → runtime)
- **Auto-Deploy:** On push ke `main` (dengan approval untuk prod)
- **Staging:** Branch preview dari Render (blueprint)
- **Health Check:** `/api/health` setiap 15 detik, auto-restart jika fail

### Dockerfile

```dockerfile
# ---- Build ----
FROM oven/bun:latest AS build
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# ---- Runtime ----
FROM oven/bun:latest
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json bun.lockb ./
RUN bun install --production
EXPOSE 3000
CMD ["bun", "run", "start"]
```

### Development Setup

```bash
# Prasyarat: Bun ≥ 1.1, Docker

# 1. Clone & install
git clone git@github.com:yourorg/flowdoro.git
cd flowdoro

# 2. Setup environment
cp .env.example .env

# 3. Start infra (PostgreSQL)
docker compose up -d

# 4. Run migrations & seed
cd apps/api
bun install
bunx drizzle-kit migrate
bun run seed:dev

# 5. Start API
bun run dev

# 6. (terminal 2) Start frontend
cd ../web
bun install
bun run dev
```

---

---

## BAGIAN 6: Monitoring & Observability

### Ringkasan

Stack ringan. Fokus pada structured logging + Sentry (error tracking) + metric dasar via Render dashboard.

### Logging

- **Format:** JSON structured (pino)
- **Levels:** debug, info, warn, error, fatal
- **Aggregation:** Render logs (cukup untuk V1)
- **Retention:** 7 hari hot di Render
- **Request log:** method, path, status, duration, requestId, userId

```ts
// apps/api/src/app.ts
import pino from 'pino'
const logger = pino({ base: { service: 'flowdoro-api' } })

export const app = new Elysia()
  .derive(({ request }) => ({ requestId: crypto.randomUUID() }))
  .onRequest(({ requestId }) => { logger.info({ requestId }, 'request-start') })
  .use(errorHandler)
  // ... routes
```

### Metrics

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Request Rate | normal per user | — | — |
| Error Rate | < 1% | > 1% | > 5% |
| Latency P50 | < 200ms | > 400ms | > 1s |
| Latency P95 | < 500ms | > 1s | > 3s |
| CPU Usage | < 70% | > 80% | > 90% |
| Memory Usage | < 70% | > 80% | > 90% |
| DB Pool Connections | < 80% | > 80% | > 95% |

*(Metrics diambil dari Render instance dashboard + pino logs)*

### Distributed Tracing

- **Tool:** OpenTelemetry (opsional V1, mudah di-add nanti)
- **Trace ID:** `X-Request-ID` header di-generate per request
- **Sampling:** 100% untuk errors (Sentry), 10% success (OTel)

### Alerting

| Alert | Condition | Channel | Priority |
|-------|-----------|---------|----------|
| High error rate | Error rate > 5% (5 min) | Slack + Email | Critical |
| Health check fail | `/api/health` non-200 | Render auto-restart + Email | Critical |
| High latency | P95 > 3s (10 min) | Slack | Warning |
| New error group | Sentry new issue | Sentry → Slack | Warning |

### Error Tracking

- **Service:** Sentry (frontend + backend)
- **Source Maps:** Upload saat deploy frontend
- **Alert on:** New error group, error spike > baseline
- **Context:** userId, requestId, route

### Dashboard

- **Tool:** Render instance dashboard + Sentry (V1)
- **Panels:** Request rate, error rate, latency, resource usage (Render native)
- **Business metrics:** total sessions/day, active users/day (via log query)

---

---

## BAGIAN 7: Environment Variables

### Ringkasan

List environment variables dikategorikan. Wajib didokumentasikan di `.env.example`.

### Database
- `DATABASE_URL` — Koneksi PostgreSQL (Render managed) — `postgresql://user:pass@host:5432/flowdoro`
- `DATABASE_SSL` — SSL mode koneksi — `true`

### Auth
- `JWT_SECRET` — Secret key JWT (min 32 char) — `your-random-256-bit-secret`
- `JWT_EXPIRES_IN` — JWT expiry — `7d`
- `COOKIE_SECURE` — Cookie secure flag (true di prod) — `true`
- `BCRYPT_ROUNDS` — Bcrypt cost factor — `12`
- `GOOGLE_CLIENT_ID` — Google OAuth Client ID — `xxxxx.apps.googleusercontent.com`
- `GOOGLE_CLIENT_SECRET` — Google OAuth Client Secret — `xxxxx`

### API Keys
- `RESEND_API_KEY` — Resend API key (email) — `re_xxxxx`
- `R2_ACCOUNT_ID` — Cloudflare R2 account ID — `xxxxx`
- `R2_ACCESS_KEY_ID` — R2 access key — `xxxxx`
- `R2_SECRET_ACCESS_KEY` — R2 secret key — `xxxxx`
- `R2_BUCKET` — R2 bucket name — `flowdoro-avatars`
- `R2_PUBLIC_URL` — R2 public base URL — `https://avatars.flowdoro.com`

### App Config
- `NODE_ENV` — Environment mode — `development`
- `PORT` — Server port — `3000`
- `APP_URL` — Frontend base URL — `http://localhost:5173`
- `API_URL` — API base URL — `http://localhost:3000`
- `FRONTEND_URL` — Frontend URL untuk CORS — `http://localhost:5173`
- `CORS_ORIGIN` — Allowed CORS origins (comma-sep) — `http://localhost:5173`
- `REST_RATIO_DEFAULT` — Default rest ratio — `5`

### Monitoring
- `SENTRY_DSN` — Sentry DSN (frontend + backend) — `https://xxx@sentry.io/xxx`
- `LOG_LEVEL` — Pino log level — `info`

---

---

## BAGIAN 8: Testing Strategy

### Ringkasan

Test coverage mencakup unit (business logic), integration (API + DB), dan E2E (critical user flows dari DESIGN.md).

### Unit Testing

- **Framework:** Vitest (frontend) + Bun test (backend)
- **Coverage Target:** 80%+
- **Contoh Test Case:**
  - `formatTime(seconds)` → "HH:MM:SS" format
  - `calculateRestEarned(focusSeconds, ratio)` → floor division
  - `calculateStreak(sessions[], today)` → consecutive days
  - Timer reducer (start/pause/resume/reset) state transitions
  - Offline queue (enqueue/dequeue/flush)

### Integration Testing

- **Framework:** Vitest + supertest (Elysia app instance)
- **Strategy:** Test API endpoints end-to-end against test database
- **Test Case:**
  - POST `/api/auth/register` → user created, bcrypt hashed
  - POST `/api/sessions` → session active created
  - PATCH `/api/sessions/:id` → status updated
  - GET `/api/analytics/summary` → correct aggregates
  - Duplicate email → 409 CONFLICT

### E2E Testing

- **Framework:** Playwright
- **Coverage:** Critical flows dari DESIGN.md
  - Login → Dashboard → Start Focus → Stop → Break
  - Register → first session → history
  - Filter history
  - Analytics period switch

### Test Folder Structure

```
tests/
├── unit/
│   ├── utils/
│   │   ├── formatTime.test.ts
│   │   ├── restRatio.test.ts
│   │   └── streak.test.ts
│   └── store/
│       └── timer.test.ts
├── integration/
│   ├── auth.test.ts
│   ├── session.test.ts
│   └── analytics.test.ts
└── e2e/
    ├── login.spec.ts
    ├── focus-flow.spec.ts
    └── analytics.spec.ts
```

### Testing Config

- **Test Database:** PostgreSQL container terpisah (`docker-compose.test.yml`), migrated per test run, truncated per test
- **Mock Strategy:** Mock Resend/R2/Google OAuth via vi.mock, gunakan test double
- **CI Command:** `bun run test:unit && bun run test:integration`
- **Coverage Threshold:** Line ≥ 80%, Branch ≥ 70%
- **E2E Command:** `bun run test:e2e` (ci: `playwright test`)

---

---

## BAGIAN 9: Data Migration & Seeding (Legacy System)

### Ringkasan

Flowdoro V1 adalah **greenfield** — tidak ada legacy system atau data lama. Bagian ini mendokumentasikan strategy migrasi untuk baseline dan migrasi berkelanjutan.

### Baseline Migration

- **Initial Schema:** `drizzle-kit generate` membuat migration pertama dari `schema.ts`
- **Apply:** `drizzle-kit migrate` saat deploy pertama
- **Zero Downtime:** Not applicable (aplikasi baru, belum ada traffic)

### Berkelanjutan (Expand-Contract)

Untuk perubahan skema di versi berikutnya:
1. **Expand:** Tambah kolom nullable, deploy API yang support keduanya
2. **Contract:** Backfill data, ubah ke NOT NULL di migration berikutnya
3. **Drop:** Hapus kolom lama setelah semua client migrated

### Rollback Plan

- **Code:** Render immutable deploy — redeploy image sebelumnya
- **Database:** `drizzle-kit migrate:rollback` untuk migration terakhir
- **Verification:** `/api/health` + smoke test setelah rollback
- **Backup:** Render managed Postgres auto-backup (restore point sebelum migration)

### Seed Data (Dev)

| Data | Purpose | Command |
|------|---------|---------|
| Demo user | Local auth testing | `bun run seed:dev` |
| 5 preset tasks | Task selector testing | `bun run seed:dev` |
| 30 sample sessions | Dashboard/analytics UI testing | `bun run seed:dev` |

---

---

## Tech Spec Review — Konsistensi Check

```
🔍 Tech Spec Review — Konsistensi Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tech Stack:       ✅ Sesuai platform (Svelte + Elysia + Drizzle + PG)
Database:         ✅ 4 entities + constraints + cardinality + index
Interface:        ✅ 18 endpoint, semua screen tercakup + response format
Alur Logika:      ✅ Focus flow + offline + error handling + retry + fallback
Keamanan/CI:      ✅ Security + pipeline + rollback + Docker + dev setup
Monitoring:       ✅ Logging + metrics + alerting + Sentry
Testing:          ✅ Unit + Integration + E2E + struktur + config
Environment:      ✅ 25+ env vars, semua terdefinisi
Migration:        ✅ Greenfield + expand-contract strategy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

> **Next Step:** Ketik `"Buat Task berdasarkan Tech Spec dan DESIGN.md yang sudah dibuat"` untuk melanjutkan ke Task Breakdown.
