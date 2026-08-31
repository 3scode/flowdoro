# Flowdoro — Task List

> **Version:** 1.0
> **Date:** 2026-08-31
> **Based on:** `.agents/TECH-SPEC.md` v1.0 + `.agents/DESIGN.md` v1.0
> **Breakdown:** Per Modul
> **Project Status:** Baru (greenfield)
> **Opsional Tasks:** Tidak include (Testing, CI/CD, Monitoring, Compliance — di-skip per user request)

---

## Ringkasan

```
📋 Task Generator — Ringkasan
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tech Stack:       Svelte 5 + Tailwind 4 + ElysiaJS + Drizzle ORM + PostgreSQL + Bun + Docker + Render
Screens:          10 (Landing, Login, Register, Dashboard, Focus, Break, History, Session Detail, Analytics, Settings)
Modules:          Auth, Session, Analytics, Profile/Settings, Tasks, Health
Project Status:   Baru (greenfield — include setup task)
Design References: 0 (tidak ada design-references/)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Task Grouping by Phase

| Phase | Tasks | Keterangan |
|-------|-------|------------|
| **Foundation** | T-01, T-02 | Setup project + Design system |
| **Core** | T-03 → T-09 | Database, API (per modul), Frontend (per screen) |
| **Enhancement** | T-10, T-11, T-12 | Error handling, Response format, Auth flow |
| **Infrastructure** | T-13 | Deployment (Render + Docker) |

---

---

## T-01: Setup Project (Monorepo + Infra)

**Modul:** Setup
**Phase:** Foundation
**Screen:** N/A
**Related FR:** N/A
**Prioritas:** 🔴 High
**Status:** ✅ Done
**Effort:** M
**Tech Stack:** Bun, Docker, TypeScript
**File yang diubah:** `package.json`, `docker-compose.yml`, `.env.example`, `apps/api/package.json`, `apps/web/package.json`

### Dependensi
- Tidak ada (task pertama)

### Sub-task Checklist
- [ ] Inisialisasi monorepo root dengan `bun init`
- [ ] Scaffold backend: `bun create elysia apps/api`
- [ ] Scaffold frontend: `bun create vite apps/web --template svelte-ts`
- [ ] Setup `docker-compose.yml` (PostgreSQL 16 + api service untuk local dev)
- [ ] Buat `.env.example` dengan semua environment variables dari TECH-SPEC Bagian 7
- [ ] Setup TypeScript config terpadu (root `tsconfig.json`)
- [ ] Setup ESLint + Prettier di kedua apps
- [ ] Setup `apps/web/vite.config.ts` dengan VitePWA plugin
- [ ] Jalankan dev server, pastikan keduanya jalan

### Acceptance Criteria
- [ ] `docker compose up -d` menjalankan PostgreSQL tanpa error
- [ ] `bun run dev` di `apps/api` jalan di port 3000
- [ ] `bun run dev` di `apps/web` jalan (SPA) di port 5173
- [ ] `.env.example` berisi semua env vars dari TECH-SPEC
- [ ] Struktur folder `apps/web` + `apps/api` sesuai TECH-SPEC Bagian 1

### Referensi Design
- 📄 N/A

### Environment Variables
- `DATABASE_URL` — Koneksi PostgreSQL
- `PORT` — API server port
- `APP_URL` — Frontend base URL
- `CORS_ORIGIN` — Allowed CORS origins

---

## T-02: Design System & Base Components

**Modul:** Frontend — Design System
**Phase:** Foundation
**Screen:** Semua screen
**Related FR:** N/A
**Prioritas:** 🔴 High
**Status:** ⬜ Todo
**Effort:** L
**Tech Stack:** Svelte 5, Tailwind CSS 4
**File yang diubah:** `apps/web/src/app.css`, `apps/web/tailwind.config.ts`, `apps/web/src/lib/components/ui/*`

### Dependensi
- T-01: Setup Project

### Sub-task Checklist
- [ ] Setup Tailwind 4 + design tokens (colors light/dark, typography, spacing, radius, shadow) dari DESIGN.md Bagian 1
- [ ] Buat `app.css` dengan CSS custom properties + dark mode variant (`class` strategy)
- [ ] Buat komponen **Button** (5 variants: primary, secondary, ghost, danger, danger-outline) + states
- [ ] Buat komponen **InputField** (label floating, error/success, password eye toggle)
- [ ] Buat komponen **Card** (default, elevated, interactive, glass)
- [ ] Buat komponen **Modal** (focus trap, aria, backdrop, ESC close)
- [ ] Buat komponen **Toast** (4 variants, slide in/out, auto-dismiss)
- [ ] Buat komponen **StatCard**, **SessionCard** (compact + default)
- [ ] Buat komponen **Navigation** (Sidebar desktop + BottomNav mobile)
- [ ] Install Lucide Svelte icons
- [ ] Terapkan skeleton loading style (pulse) sebagai base pattern
- [ ] Verifikasi komponen di storybook-like dev page atau manual check

### Acceptance Criteria
- [ ] Semua design tokens cocok dengan DESIGN.md Bagian 1
- [ ] Dark mode toggle berfungsi (light/dark/system)
- [ ] Semua komponen punya variants + states sesuai DESIGN.md Bagian 4
- [ ] Aksesibilitas: keyboard nav, ARIA labels, focus ring di setiap komponen
- [ ] Responsive: komponen adaptif di mobile/tablet/desktop

### Referensi Design
- 📄 N/A

---

---

## T-03: Database Setup & Schema

**Modul:** Database
**Phase:** Core
**Screen:** N/A
**Related FR:** N/A (dasar)
**Prioritas:** 🔴 High
**Status:** ⬜ Todo
**Effort:** M
**Tech Stack:** Drizzle ORM, PostgreSQL 16, drizzle-kit
**File yang diubah:** `apps/api/src/db/schema.ts`, `apps/api/src/db/index.ts`, `apps/api/drizzle.config.ts`, `apps/api/src/db/migrations/*`

### Dependensi
- T-01: Setup Project

### Sub-task Checklist
- [ ] Buat `apps/api/src/db/index.ts` — Drizzle client (postgres-js) dari `DATABASE_URL`
- [ ] Buat `apps/api/src/db/schema.ts` — definisi 4 entity: `users`, `sessions`, `session_events`, `tasks` sesuai TECH-SPEC Bagian 2
- [ ] Setup `drizzle.config.ts` (dialect postgresql, schema path, migrations folder)
- [ ] Generate initial migration dengan `bunx drizzle-kit generate`
- [ ] Jalankan migrasi dengan `bunx drizzle-kit migrate`
- [ ] Buat seed script `src/db/seed.ts` (demo user, 5 tasks, 30 sample sessions)
- [ ] Jalankan seed, verifikasi data masuk

### Acceptance Criteria
- [ ] Semua 4 tabel (users, sessions, session_events, tasks) terbuat
- [ ] Foreign keys + cascade correct (user cascade, task set null)
- [ ] Migration ter-generate dan jalan tanpa error
- [ ] Seed data masuk dan bisa di-query
- [ ] Index strategy dari TECH-SPEC diterapkan

### Referensi Design
- 📄 N/A

### Environment Variables
- `DATABASE_URL` — Koneksi PostgreSQL
- `DATABASE_SSL` — SSL mode

---

## T-04: API — Auth Module (Register/Login/Logout)

**Modul:** Auth
**Phase:** Core
**Screen:** Login Screen, Register Screen
**Related FR:** FR-01, FR-02, FR-03
**Prioritas:** 🔴 High
**Status:** ⬜ Todo
**Effort:** L
**Tech Stack:** ElysiaJS, Zod, jose, bcrypt
**File yang diubah:** `apps/api/src/modules/auth/*`, `apps/api/src/middleware/auth.ts`

### Dependensi
- T-03: Database Setup & Schema

### Sub-task Checklist
- [ ] Buat `auth.service.ts` — register (validasi, hash bcrypt, insert), login (verify + JWT)
- [ ] Buat route `POST /api/auth/register` (Zod validation)
- [ ] Buat route `POST /api/auth/login` (rate limit 5 gagal → blokir 15 menit)
- [ ] Buat route `POST /api/auth/logout` (invalidate JWT)
- [ ] Buat `middleware/auth.ts` — JWT guard (verifikasi cookie)
- [ ] Set JWT httpOnly cookie (`SameSite=Lax`, `secure` di prod)
- [ ] Buat route `POST /api/auth/forgot-password` (generate token + email via Resend)
- [ ] Buat route `POST /api/auth/reset-password` (validasi token, update password)
- [ ] Test semua endpoint via curl/supertest

### Acceptance Criteria
- [ ] Register: validasi email unik (409 jika duplikat), password ≥ 8, hash bcrypt
- [ ] Login: JWT di-set sebagai httpOnly cookie, redirect berhasil
- [ ] Rate limit: login gagal 5x → 429 selama 15 menit
- [ ] Forgot/reset password flow lengkap (token 24 jam, sekali pakai)
- [ ] Auth guard menolak request tanpa cookie valid (401)

### Referensi Design
- 📄 Koneksi ke Login Screen & Register Screen (DESIGN.md Screen 02, 03)

### Environment Variables
- `JWT_SECRET` — Secret key JWT
- `JWT_EXPIRES_IN` — Expiry JWT
- `COOKIE_SECURE` — Secure cookie flag
- `BCRYPT_ROUNDS` — Bcrypt cost
- `RESEND_API_KEY` — API key email

---

## T-05: API — Session Module

**Modul:** Session
**Phase:** Core
**Screen:** Focus Screen, Break Mode
**Related FR:** FR-05, FR-06, FR-07, FR-08, FR-09, FR-10, FR-11
**Prioritas:** 🔴 High
**Status:** ⬜ Todo
**Effort:** L
**Tech Stack:** ElysiaJS, Zod, Drizzle
**File yang diubah:** `apps/api/src/modules/session/*`

### Dependensi
- T-03: Database Setup & Schema
- T-04: API — Auth Module

### Sub-task Checklist
- [ ] Buat route `POST /api/sessions` — buat session baru (optional taskId, idempotency key)
- [ ] Buat route `PATCH /api/sessions/:id` — update status/duration/rest
- [ ] Buat route `GET /api/sessions/active` — cek session aktif user
- [ ] Buat route `GET /api/sessions` — list + filter (from/to/taskId/sort) + pagination
- [ ] Buat route `GET /api/sessions/:id` — detail + session_events timeline
- [ ] Buat route `DELETE /api/sessions/:id` — hapus session
- [ ] Implementasi business rule: hanya 1 active session per user
- [ ] Implementasi perhitungan `rest_earned = floor(duration / rest_ratio)` di server
- [ ] Implementasi penulisan `session_events` (focus_started, pause, resume, break_started, break_ended, session_ended)
- [ ] Test semua endpoint

### Acceptance Criteria
- [ ] POST membuat session `status='active'`, tolak jika sudah ada session aktif (409)
- [ ] PATCH update status ke `completed` + isi `ended_at`, `duration_seconds`, `rest_earned_seconds`, `rest_taken_seconds`
- [ ] GET list mendukung filter + pagination (format TECH-SPEC Bagian 3)
- [ ] GET detail mengembalikan session + timeline events lengkap
- [ ] DELETE menghapus session + cascade events

### Referensi Design
- 📄 Koneksi ke Focus Screen & Break Mode (DESIGN.md Screen 05, 06)

### Environment Variables
- N/A

---

## T-06: API — Analytics Module

**Modul:** Analytics
**Phase:** Core
**Screen:** Dashboard, Analytics Screen
**Related FR:** FR-16, FR-17, FR-18
**Prioritas:** 🟡 Mid
**Status:** ⬜ Todo
**Effort:** L
**Tech Stack:** ElysiaJS, Drizzle, PostgreSQL aggregate
**File yang diubah:** `apps/api/src/modules/analytics/*`

### Dependensi
- T-03: Database Setup & Schema
- T-04: API — Auth Module

### Sub-task Checklist
- [ ] Buat route `GET /api/analytics/summary` — today focus, total focus, best day, longest session, streak (query param: period)
- [ ] Buat route `GET /api/analytics/history` — daily focus per periode (day/week/month) untuk chart
- [ ] Buat route `GET /api/analytics/tasks` — breakdown waktu per task
- [ ] Implementasi server-side streak calculation (consecutive days strategy)
- [ ] Optimasi query dengan index (user_id + started_at composite)
- [ ] Return format sesuai TECH-SPEC Bagian 3 (data + meta)

### Acceptance Criteria
- [ ] Summary mengembalikan today_focus, total_focus, avg_focus, best_day, longest_session, streak
- [ ] History mengembalikan array data point per tanggal untuk chart
- [ ] Tasks breakdown mengembalikan distribusi waktu per task (≥ 3 ditampilkan)
- [ ] Streak menghitung hari berturut-turut dengan benar (reset jika lewat midnight user timezone)
- [ ] Semua query < 300ms p95 (pakai index)

### Referensi Design
- 📄 Koneksi ke Dashboard & Analytics Screen (DESIGN.md Screen 04, 09)

### Environment Variables
- N/A

---

## T-07: API — Profile, Settings & Tasks Module

**Modul:** Profile & Tasks
**Phase:** Core
**Screen:** Settings Screen
**Related FR:** FR-12, FR-13, FR-14, FR-15, FR-19, FR-20
**Prioritas:** 🟡 Mid
**Status:** ⬜ Todo
**Effort:** M
**Tech Stack:** ElysiaJS, Zod, Cloudflare R2 (S3)
**File yang diubah:** `apps/api/src/modules/profile/*`, `apps/api/src/modules/tasks/*`

### Dependensi
- T-04: API — Auth Module

### Sub-task Checklist
- [ ] Buat route `GET /api/me` + `PATCH /api/me` — ambil/update profil & settings (restRatio, theme, notifications, sound)
- [ ] Buat route `POST /api/me/avatar` — upload avatar (multipart, validasi MIME + size, resize 256px, upload R2)
- [ ] Buat route `GET /api/tasks` + `POST /api/tasks` — list & buat task
- [ ] Implementasi validasi rest_ratio (enum 1/3, 1/4, 1/5, 1/6 → stored as 3/4/5/6)
- [ ] Fallback avatar: initials jika tidak ada gambar
- [ ] Test semua endpoint

### Acceptance Criteria
- [ ] PATCH `/api/me` update settings tervalidasi (zod) dan persist ke DB
- [ ] Avatar upload: tolak non-JPEG/PNG & > 2MB (422), resolve ke R2 public URL
- [ ] Tasks CRUD dasar (list + create) jalan
- [ ] Fallback avatar initials tampil jika belum upload

### Referensi Design
- 📄 Koneksi ke Settings Screen (DESIGN.md Screen 10)

### Environment Variables
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`

---

## T-08: Frontend — Auth & Landing Pages

**Modul:** Frontend — Auth & Landing
**Phase:** Core
**Screen:** Landing Page, Login Screen, Register Screen
**Related FR:** FR-01, FR-02, FR-03
**Prioritas:** 🔴 High
**Status:** ⬜ Todo
**Effort:** L
**Tech Stack:** Svelte 5, Tailwind 4, TanStack Query
**File yang diubah:** `apps/web/src/routes/+page.svelte`, `+login.svelte`, `+register.svelte`, `apps/web/src/lib/api/*`

### Dependensi
- T-02: Design System & Base Components
- T-04: API — Auth Module

### Sub-task Checklist
- [ ] Setup SPA router (svelte-routing atau manual) + route guards (protected routes redirect ke login)
- [ ] Setup TanStack Query client + api client (fetch wrapper dengan cookie credentials)
- [ ] Buat **Landing Page** sesuai DESIGN.md Screen 01 (hero, 3-step, features, footer)
- [ ] Buat **Login Screen** sesuai DESIGN.md Screen 02 (form, error handling, loading state)
- [ ] Buat **Register Screen** sesuai DESIGN.md Screen 03 (form + password strength)
- [ ] Integrasikan auth store (Svelte runes) untuk session state
- [ ] Responsive + accessibility check

### Acceptance Criteria
- [ ] Landing tampil sesuai DESIGN.md (hero, steps, features, responsive)
- [ ] Login → redirect ke dashboard saat sukses, error inline saat gagal
- [ ] Register → password strength indicator, validasi, redirect saat sukses
- [ ] Route guard: halaman protected redirect ke `/login` jika belum auth
- [ ] Auth state tersimpan & persist (cookie auto-validated via `/api/me`)

### Referensi Design
- 📄 DESIGN.md Screen 01, 02, 03

### Environment Variables
- `API_URL` — API base URL

---

## T-09: Frontend — Focus Timer (Hero) & Break Mode

**Modul:** Frontend — Focus
**Phase:** Core
**Screen:** Focus Screen, Break Mode
**Related FR:** FR-05, FR-06, FR-07, FR-08, FR-09, FR-10, FR-11
**Prioritas:** 🔴 High
**Status:** ⬜ Todo
**Effort:** XL
**Tech Stack:** Svelte 5, requestAnimationFrame, IndexedDB, Service Worker
**File yang diubah:** `apps/web/src/routes/+focus.svelte`, `apps/web/src/lib/components/focus/*`, `apps/web/src/lib/stores/timer.ts`, `apps/web/src/lib/db/*`

### Dependensi
- T-02: Design System & Base Components
- T-05: API — Session Module

### Sub-task Checklist
- [ ] Buat **CircularTimer** component (SVG ring count-up, mono digits, smooth animation) sesuai DESIGN.md Screen 05
- [ ] Buat timer store (Svelte runes) — start/pause/resume/reset berbasis timestamp delta (requestAnimationFrame)
- [ ] Implementasi skip frames + device sleep recovery (akurasi pastikan benar)
- [ ] Buat Earned Rest indicator (`elapsed / rest_ratio`, update tiap menit)
- [ ] Integrasikan task selector (dropdown dari `/api/tasks` + quick create)
- [ ] Buat control buttons (Pause, Stop) + konfirmasi modal
- [ ] Implementasi session lifecycle: start → POST, stop/break → PATCH dengan rest calculation
- [ ] Buat **Break Mode** overlay (countdown ring amber, skip break, notifikasi saat selesai) sesuai DESIGN.md Screen 06
- [ ] Setup IndexedDB offline queue + background sync (Service Worker) — session tetap jalan offline
- [ ] Update tab title dengan elapsed time
- [ ] Responsive + accessibility check

### Acceptance Criteria
- [ ] Timer count-up akurat (±1s/jam), tetap akurat saat tab background & device sleep
- [ ] Circular ring terisi clockwise real-time
- [ ] Earned rest badge update per menit, format "XXm"
- [ ] Pause/Resume/Stop berfungsi, pause tidak dihitung dalam duration
- [ ] Stop → modal konfirmasi → Break overlay dengan countdown amber
- [ ] Break selesai → notifikasi + auto-return
- [ ] Offline: timer jalan, data masuk IndexedDB, sync saat online
- [ ] Session tersimpan ke API dengan benar (idempotency)

### Referensi Design
- 📄 DESIGN.md Screen 05, 06

### Environment Variables
- `REST_RATIO_DEFAULT` — default rest ratio (dari settings/user)

---

## T-10: Frontend — Dashboard, History & Session Detail

**Modul:** Frontend — Dashboard & History
**Phase:** Core
**Screen:** Dashboard, History Screen, Session Detail Screen
**Related FR:** FR-12, FR-13, FR-14, FR-15, FR-16
**Prioritas:** 🟡 Mid
**Status:** ⬜ Todo
**Effort:** L
**Tech Stack:** Svelte 5, TanStack Query, Tailwind 4
**File yang diubah:** `apps/web/src/routes/+dashboard.svelte`, `+history.svelte`, `+history/[id].svelte`, `apps/web/src/lib/components/*`

### Dependensi
- T-02: Design System & Base Components
- T-05: API — Session Module
- T-06: API — Analytics Module

### Sub-task Checklist
- [ ] Buat App Shell layout: Sidebar (desktop) + TopBar + BottomNav (mobile) + theme toggle
- [ ] Buat **Dashboard** sesuai DESIGN.md Screen 04 (3 stat cards, quick start, recent sessions, weekly chart)
- [ ] Buat **History** sesuai DESIGN.md Screen 07 (session list grouped by date, filters, pagination/load more, summary strip)
- [ ] Buat **Session Detail** sesuai DESIGN.md Screen 08 (summary ring, task, rest stats, timeline, delete)
- [ ] Integrasikan dengan TanStack Query + caching (staleTime: dashboard 5m, history 1m)
- [ ] Implement empty states + loading skeletons + error states sesuai DESIGN.md
- [ ] Responsive + accessibility check

### Acceptance Criteria
- [ ] Dashboard menampilkan stat cards, quick start, recent sessions, weekly chart dengan data API
- [ ] History list grouped by date (Today/Yesterday/date) + filter + pagination
- [ ] Session Detail menampilkan summary + timeline + delete (dengan konfirmasi)
- [ ] Empty states muncul saat tidak ada data
- [ ] Loading skeleton + error + retry di setiap screen
- [ ] Sidebar/BottomNav navigasi benar + active state

### Referensi Design
- 📄 DESIGN.md Screen 04, 07, 08

### Environment Variables
- N/A

---

## T-11: Frontend — Analytics & Settings

**Modul:** Frontend — Analytics & Settings
**Phase:** Core
**Screen:** Analytics Screen, Settings Screen
**Related FR:** FR-17, FR-18, FR-19, FR-20
**Prioritas:** 🟡 Mid
**Status:** ⬜ Todo
**Effort:** L
**Tech Stack:** Svelte 5, TanStack Query, Tailwind 4, Chart.js
**File yang diubah:** `apps/web/src/routes/+analytics.svelte`, `+settings.svelte`, `apps/web/src/lib/components/analytics/*`

### Dependensi
- T-02: Design System & Base Components
- T-06: API — Analytics Module
- T-07: API — Profile, Settings & Tasks Module

### Sub-task Checklist
- [ ] Instal & setup Chart.js (atau lightweight chart lib) dengan lazy loading (dynamic import)
- [ ] Buat **Analytics** sesuai DESIGN.md Screen 09 (period toggle, line chart, 4 stat cards, bar chart, heatmap)
- [ ] Implementasi heatmap (GitHub-style contribution calendar)
- [ ] Integrasikan period toggle (day/week/month) dengan refetch
- [ ] Buat **Settings** sesuai DESIGN.md Screen 10 (profile, preferences: restRatio/theme/notifications/sound, account, about)
- [ ] Implementasi avatar upload + inline edit nama
- [ ] Integrasikan theme toggle global (light/dark/system)
- [ ] Empty states, loading skeletons, error states
- [ ] Responsive + accessibility check

### Acceptance Criteria
- [ ] Analytics chart akurat + tooltip, period switch refetch dengan benar
- [ ] Heatmap menampilkan kontribusi per hari dengan intensitas warna
- [ ] Settings: ubah restRatio/theme/notifications/sound → PATCH `/api/me` → persist
- [ ] Avatar upload via file picker → resize preview → upload → update
- [ ] System theme mengikuti preferensi OS, dark mode default untuk focus
- [ ] Aksesibilitas: color-blind friendly heatmap

### Referensi Design
- 📄 DESIGN.md Screen 09, 10

### Environment Variables
- `R2_PUBLIC_URL` — untuk avatar URL

---

---

## T-12: Enhancement — Error Handling, Response Format & API Client

**Modul:** Enhancement
**Phase:** Enhancement
**Screen:** Semua screen
**Related FR:** N/A (cross-cutting)
**Prioritas:** 🔴 High
**Status:** ⬜ Todo
**Effort:** M
**Tech Stack:** ElysiaJS, Zod, Svelte
**File yang diubah:** `apps/api/src/middleware/error.ts`, `apps/api/src/middleware/rateLimit.ts`, `apps/api/src/middleware/requestLog.ts`, `apps/web/src/lib/api/client.ts`

### Dependensi
- T-04: API — Auth Module (backend routes jalan)

### Sub-task Checklist
- [ ] Buat global error handler (Elysia `onError`) → standarisasi format: `{ success, data, error, meta }` sesuai TECH-SPEC Bagian 3
- [ ] Implementasi error codes: VALIDATION_ERROR (422), NOT_FOUND (404), UNAUTHORIZED (401), FORBIDDEN (403), CONFLICT (409), RATE_LIMITED (429), INTERNAL_ERROR (500)
- [ ] Setup rate limiting middleware (5 req/s per IP)
- [ ] Setup request logging (pino JSON, requestId header)
- [ ] Buat frontend API client wrapper — parse error format, throw typed errors, handle 401 (logout redirect)
- [ ] Setup retry with exponential backoff + idempotency key for mutation
- [ ] Standarisasi pagination di semua list endpoint

### Acceptance Criteria
- [ ] Semua API error mengembalikan format standar dengan `error.code` yang tepat
- [ ] Frontend API client menampilkan pesan error yang benar di UI
- [ ] Rate limit 5 req/s → 429 dengan format standar
- [ ] Request logging JSON dengan requestId
- [ ] Retry: 401 → redirect login, network error → retry dengan backoff

### Referensi Design
- 📄 N/A

### Environment Variables
- `LOG_LEVEL` — level logging

---

## T-13: Deployment — Docker & Render

**Modul:** Infrastructure
**Phase:** Infrastructure
**Screen:** N/A
**Related FR:** N/A
**Prioritas:** 🟡 Mid
**Status:** ⬜ Todo
**Effort:** M
**Tech Stack:** Docker, Render
**File yang diubah:** `apps/api/Dockerfile`, `render.yaml` (blueprint), `.env.production`

### Dependensi
- T-01 sampai T-12 (semua fitur selesai)

### Sub-task Checklist
- [ ] Buat `docker-compose.yml` production-ready (api + postgres)
- [ ] Buat `apps/api/Dockerfile` multi-stage (build + runtime) sesuai TECH-SPEC Bagian 5
- [ ] Buat `render.yaml` blueprint (web service + managed postgres + env vars)
- [ ] Setup health check endpoint `/api/health`
- [ ] Konfigurasi environment variables production di Render
- [ ] Build frontend (SPA) → serve via API atau static host
- [ ] Deploy ke Render, verifikasi health check + smoke test

### Acceptance Criteria
- [ ] Docker image build sukses tanpa error
- [ ] `render.yaml` mendefinisikan web service + postgres + env vars
- [ ] Deployment ke Render sukses, `/api/health` return 200
- [ ] Frontend SPA ter-serve dan bisa diakses publik
- [ ] Migration berjalan saat deploy (startup script)

### Referensi Design
- 📄 N/A

### Environment Variables
- Semua env vars dari TECH-SPEC Bagian 7 (production values)

---

---

## Ringkasan Effort

| Task | Modul | Phase | Effort |
|------|-------|-------|--------|
| T-01 | Setup Project | Foundation | M |
| T-02 | Design System | Foundation | L |
| T-03 | Database Setup | Core | M |
| T-04 | API — Auth | Core | L |
| T-05 | API — Session | Core | L |
| T-06 | API — Analytics | Core | L |
| T-07 | API — Profile/Tasks | Core | M |
| T-08 | Frontend — Auth/Landing | Core | L |
| T-09 | Frontend — Focus Timer | Core | XL |
| T-10 | Frontend — Dashboard/History | Core | L |
| T-11 | Frontend — Analytics/Settings | Core | L |
| T-12 | Enhancement — Error/Response | Enhancement | M |
| T-13 | Deployment | Infrastructure | M |

**Total: 13 tasks**
- Foundation: 2 | Core: 9 | Enhancement: 1 | Infrastructure: 1
- Total effort (rough): ~3.5 weeks (~14M equivalent) single dev

---

---

## Task Review — Konsistensi Check

```
🔍 Task Review — Konsistensi Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase Coverage:   ✅ Foundation 2 | Core 9 | Enhancement 1 | Infra 1
Screen Coverage:  ✅ 10/10 screen dari DESIGN.md tercakup
Module Coverage:  ✅ 6/6 modul dari TECH-SPEC (Auth, Session, Analytics, Profile, Tasks, Health)
Dependencies:     ✅ Linear, no circular (Foundation → Core → Enhancement → Infra)
Effort:           ✅ Konsisten (T-09 Focus XL, kompleksitas sesuai)
Opsional Tasks:   ✅ Tidak include (sesuai pilihan user: no testing/CI-CD/monitoring/compliance)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

> **Next Step:** Ketik `"Kerjakan task sekarang"` atau `"Mulai implementasi dari T-01"` untuk memulai coding via skill `implement-task`.
