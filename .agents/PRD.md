# Flowdoro — Product Requirement Document

> **Version:** 1.0
> **Date:** 2026-08-31
> **Based on:** `.agents/DESIGN.md` v1.0
> **Platform:** Web + PWA
> **Stack:** Svelte + Tailwind CSS + Vite + Bun + ElysiaJS + Drizzle ORM + PostgreSQL + Docker + Render

---

## Unique Value Proposition

> **"Work until your focus fades, rest in proportion. No arbitrary countdowns interrupting flow."**

Flowdoro replaces rigid countdown timers with a count-up stopwatch. Users focus freely from second 0, stop when they need rest, and automatically earn break time at a 5:1 ratio (1 minute rest per 5 minutes worked). A real-time dashboard and session history reveal productivity patterns without interrupting the workflow.

---

---

## BAGIAN 1: Visi & Tujuan Produk

### Visi Produk

Flowdoro menjadi platform manajemen waktu cerdas yang menghormati ritme alami manusia — bukan memaksa manusia menyesuaikan diri dengan timer kaku. Dengan pendekatan proportional rest berbasis stopwatch, Flowdoro membantu pengguna mencapai deep work yang lebih lama, lebih berkualitas, dan berkelanjutan tanpa gangguan arbitrary countdown.

### Tujuan Utama

1. **Menghilangkan friction timer kaku** — Stopwatch count-up dari detik 0, tidak ada timer kaku yang memecah konsentrasi
   - *Indikator:* 80% pengguna aktif menggunakan metode count-up dalam 3 bulan pertama
2. **Mengotomasi jatah istirahat** — Perhitungan proportional rest 5:1 secara otomatis
   - *Indikator:* Rata-rata 3+ sesi per hari per pengguna aktif
3. **Memberikan insight produktivitas** — Dasbor statistik real-time membantu pengguna memahami pola kerja mereka
   - *Indikator:* 60% pengguna mengunjungi halaman analytics minimal 1x per minggu
4. **Menjadi platform lintas perangkat** — PWA + cloud sync, akses dari mana saja
   - *Indikator:* 40% pengguna mengakses dari 2+ perangkat berbeda

### Value Proposition

1. **No Arbitrary Countdowns** — Anda bekerja selama fokus Anda bertahan, bukan selama timer memutuskan
2. **Proportional Rest (5:1)** — Semakin lama fokus, semakin lama jatah istirahat — otomatis dihitung
3. **Real-Time Productivity Insights** — Pola kerja Anda divisualisasikan, bukan hanya angka

### Analisis Kompetitor

| Kompetitor | Fitur Utama | Kelebihan | Kekurangan | Peluang |
|------------|-------------|-----------|------------|---------|
| **Pomodoro Apps** (Forest, Focus Keeper) | Timer kaku 25/5 | Simple, populer, gamifikasi | Timer countdown memecah flow, tidak adaptif | Switch ke count-up + proportional rest |
| **Flowtime.app** | Stopwatch count-up + proportional break | Mirip konsep Flowdoro | Tidak ada auth/cloud sync, UI basic | Full-stack + analytics lebih dalam |
| **Flowmodoro** | Stopwatch + configurable ratio (1/3, 1/4, 1/5) | Konfigurable ratio | Tidak ada dashboard, tidak ada history sync | Dashboard + PWA + multi-device |
| **Foci** | Pomodoro + tasks + ambient music + stats | Fitur lengkap (tasks, music, smart plan) | Countdown-based, UI kompleks | Lebih fokus dan clean, proportional rest |
| **ThirdTime** | Proportional rest (1/3 default) + earn rest | Sederhana, no-nonsense | Sangat basic, tidak ada visual analytics | Richer UX + analytics + PWA |

### Success Metrics

| Tujuan | KPI | Target | Cara Ukur |
|--------|-----|--------|-----------|
| Hilangkan timer kaku | % pengguna pakai count-up | 80% dari sesi aktif | Server-side analytics (session mode tracking) |
| Otomasi proportional rest | Sesi per hari per user aktif | ≥ 3 sesi/hari | Agregasi dari sessions table |
| Produktivitas insights | Kunjungan analytics per user/minggu | ≥ 1x/minggu | Page view tracking |
| Lintas perangkat | % user 2+ device | 40% dalam 3 bulan | Device fingerprint / user agent |
| Retention | DAU/MAU ratio | ≥ 30% dalam 3 bulan | Login + session activity |

---

## BAGIAN 2: User Persona

### Persona 1: Raka — Software Developer

- **Usia/Pekerjaan:** 28 tahun, Full-Stack Developer di startup
- **Level Teknis:** Mahir — daily use VS Code, browser, terminal
- **Tujuan:** Menyelesaikan feature development dan bug fixes tanpa terganggu timer kaku Pomodoro yang sering memecah flow state saat coding
- **Pain Points:**
  - Pomodoro 25 menit terlalu pendek untuk deep coding — sering "baru masuk flow" sudah bunyi alarm
  - Timer countdown menambah anxiety — malah tidak fokus karena mikir sisa waktu
  - Tidak ada catatan berapa lama sebenarnya ia fokus per sesi
  - Coba pakai beberapa timer tapi tidak ada yang menyinkronkan data antar device
- **Motivasi:** Ingin alat yang menghormati workflow-nya, bukan memaksanya mengikuti format rigid. Butuh data untuk memahami kapan peak productivity-nya.

#### User Journey: Raka

| Stage | Action | Touchpoints | Emotions | Pain Points |
|-------|--------|-------------|----------|-------------|
| 1. Masuk | Buka Flowdoro dari shortcut PWA | Landing Page → Login | 😊 Tertarik | — |
| 2. Setup | Login, pilih task dari daftar | Login → Dashboard | 😊 Produktif | — |
| 3. Mulai Fokus | Tap "Start Focus", timer mulai count-up | Focus Screen | 😊 Fokus | — |
| 4. Deep Work | Bekerja 1.5 jam tanpa gangguan | Focus Screen (background) | 😊 Flow state | Tidak bisa lihat timer tanpa buka tab |
| 5. Butuh Istirahat | Tap "Stop & Rest", lihat earned rest 18 menit | Focus → Break Overlay | 😊 Puas | — |
| 6. Istirahat | Istirahat dengan countdown break | Break Overlay | 😐 Santai | — |
| 7. Kembali | Break selesai, kembali fokus | Break → Focus | 😊 Siap | — |
| 8. Review | Cek analytics di malam hari | Analytics Screen | 😊 Insightful | — |

### Persona 2: Sarah — Student & Content Creator

- **Usia/Pekerjaan:** 22 tahun, Mahasiswa S2 sekaligus freelance content creator
- **Level Teknis:** Menengah — aktif pakai Canva, Notion, sosmed
- **Tujuan:** Mengatur waktu belajar thesis dan membuat konten tanpa merasa terpaksa harus berhenti di waktu yang salah
- **Pain Points:**
  - Sering "terpaksa" berhenti belajar karena timer Pomodoro bunyi, padahal lagi asyik
  - Tidak punya data seberapa efektif sesi belajarnya — merasa produktif tapi tidak yakin
  - Lupa berapa total jam belajar per hari/minggu
  - Ingin melihat progress dan streak untuk motivasi
- **Motivasi:** Ingin bukti konkret bahwa waktu belajarnya efektif, dan alat yang tidak memaksanya berhenti saat sedang dalam zona belajar.

#### User Journey: Sarah

| Stage | Action | Touchpoints | Emotions | Pain Points |
|-------|--------|-------------|----------|-------------|
| 1. Masuk | Buka Flowdoro dari browser bookmark | Landing → Register | 😊 Penasaran | — |
| 2. Daftar | Register akun baru | Register Screen | 😊 Semangat | — |
| 3. Mulai Belajar | Tap "Start Focus" sebelum mulai baca jurnal | Focus Screen | 😊 Siap | — |
| 4. Belajar | Membaca jurnal selama 45 menit | Focus Screen (background) | 😊 Tenggelam | Tidak tau sudah berapa lama tanpa cek |
| 5. Selesai | Tap "Stop & Rest" — earned 9 menit | Focus → Break Overlay | 😊 Puas | — |
| 6. Lihat History | Cek riwayat sesi hari ini | History Screen | 😊 Bangga | — |
| 7. Analisis | Lihat weekly analytics, cek streak | Analytics Screen | 😊 Termotivasi | — |
| 8. Besoknya | Buka lagi, lihat streak masih aktif | Dashboard | 😊 Semangat | — |

---

## BAGIAN 3: User Stories

### Modul 1: Autentikasi

#### US-01: Registrasi Pengguna
Sebagai pengguna baru, saya ingin mendaftar dengan email dan password, agar bisa mulai menggunakan Flowdoro.

**Priority:** High
**Screen:** Register Screen

**Acceptance Criteria:**
- [ ] Form registrasi tersedia (nama, email, password)
- [ ] Email divalidasi format & keunikan di database
- [ ] Password minimal 8 karakter dengan strength indicator
- [ ] Password di-hash dengan bcrypt sebelum disimpan
- [ ] Akun berhasil dibuat & redirect ke Dashboard
- [ ] Error ditampilkan jika email sudah terdaftar

#### US-02: Login Pengguna
Sebagai pengguna terdaftar, saya ingin login, agar bisa mengakses data sesi dan statistik saya.

**Priority:** High
**Screen:** Login Screen

**Acceptance Criteria:**
- [ ] Form login tersedia (email, password)
- [ ] Kredensial terverifikasi against database
- [ ] JWT token di-generate dan disimpan di client
- [ ] Redirect ke Dashboard setelah login berhasil
- [ ] Error "Invalid email or password" jika gagal
- [ ] Setelah 5x gagal, akun terblokir sementara 15 menit

#### US-03: Logout Pengguna
Sebagai pengguna, saya ingin logout, agar data saya aman jika menggunakan perangkat bersama.

**Priority:** Mid
**Screen:** Top Bar (Avatar Dropdown)

**Acceptance Criteria:**
- [ ] Tombol logout tersedia di dropdown menu avatar
- [ ] JWT token dihapus dari client
- [ ] Redirect ke Landing Page
- [ ] Session di server di-invalidate

---

### Modul 2: Focus Timer

#### US-04: Memulai Sesi Fokus
Sebagai pengguna, saya ingin memulai sesi fokus dengan menekan satu tombol, agar timer langsung mulai menghitung waktu kerja saya.

**Priority:** High
**Screen:** Focus Screen

**Acceptance Criteria:**
- [ ] Tombol "Start Focus" terlihat jelas di layar utama
- [ ] Timer mulai count-up dari 00:00:00 saat ditekan
- [ ] Circular SVG ring mulai terisi clockwise
- [ ] Earned rest indicator mulai terhitung (elapsed / 5)
- [ ] Sesi baru dibuat di database dengan status "active"
- [ ] Browser tab title menampilkan elapsed time

#### US-05: Melihat Waktu Fokus Real-Time
Sebagai pengguna yang sedang fokus, saya ingin melihat durasi fokus saya secara real-time tanpa terganggu, agar saya tahu sudah berapa lama saya bekerja.

**Priority:** High
**Screen:** Focus Screen

**Acceptance Criteria:**
- [ ] Timer digits berupdate setiap detik dengan animasi smooth
- [ ] Circular ring terisi proporsional dengan waktu berjalan
- [ ] Earned rest indicator update setiap 60 detik
- [ ] Timer tetap akurat meskipun browser tab di-background (requestAnimationFrame)
- [ ] Timer tetap akurat meskipun device sleep/bangun kembali
- [ ] Layout tidak mengganggu produktivitas — clean dan minimal

#### US-06: Menjeda Sesi Fokus
Sebagai pengguna, saya ingin bisa menjeda sesi fokus saat ada gangguan singkat, agar waktu yang tercatat akurat.

**Priority:** Mid
**Screen:** Focus Screen

**Acceptance Criteria:**
- [ ] Tombol "Pause" muncul saat timer berjalan
- [ ] Timer berhenti berhitung saat pause
- [ ] Tombol berubah menjadi "Resume"
- [ ] Resume melanjutkan dari waktu yang terakhir
- [ ] Durasi pause tidak dihitung dalam fokus time

#### US-07: Menghentikan Sesi & Mengambil Istirahat
Sebagai pengguna yang sudah cukup fokus, saya ingin menghentikan sesi dan mengambil istirahat yang proporsional, agar saya mendapat waktu istirahat yang adil berdasarkan lama kerja.

**Priority:** High
**Screen:** Focus Screen → Break Mode (Overlay)

**Acceptance Criteria:**
- [ ] Tombol "Stop" memunculkan konfirmasi modal
- [ ] Modal menampilkan: "Take a break?" dengan earned rest time
- [ ] Pilihan: "Take Break" atau "Save & Stop"
- [ ] "Take Break" → hitung rest = elapsed / 5, mulai break countdown
- [ ] "Save & Stop" → simpan session, kembali ke idle
- [ ] Break countdown mulai dari earned rest time (count-down)
- [ ] Break ring berwarna amber dan berkurang seiring waktu
- [ ] Browser notification + vibration saat break selesai
- [ ] Break overlay bisa di-skip ("Skip Break")

#### US-08: Melihat Status Earned Rest
Sebagai pengguna yang sedang fokus, saya ingin melihat berapa jatah istirahat yang sudah saya kumpulkan, agar saya tahu kapan sebaiknya berhenti.

**Priority:** Mid
**Screen:** Focus Screen

**Acceptance Criteria:**
- [ ] Badge "Earned Rest: Xm" ditampilkan di bawah timer
- [ ] Update real-time setiap menit (elapsed / 5)
- [ ] Format: "XXm" untuk < 1 jam, "Xh Xm" untuk ≥ 1 jam
- [ ] Visual distinction dengan warna amber (secondary color)

---

### Modul 3: Session Management

#### US-09: Menyimpan Sesi Secara Otomatis
Sebagai pengguna, saya ingin sesi tersimpan otomatis setelah selesai, agar saya tidak kehilangan data fokus.

**Priority:** High
**Screen:** Focus Screen (background process)

**Acceptance Criteria:**
- [ ] Sesi tersimpan ke database saat user "Stop & Save" atau break selesai
- [ ] Data yang disimpan: user_id, task_id, duration, rest_earned, rest_taken, started_at, ended_at, created_at
- [ ] Jika offline, data disimpan di local storage dan di-sync saat online
- [ ] Toast notifikasi "Session saved" muncul setelah berhasil disimpan
- [ ] Error handling: jika save gagal, data tetap di local storage untuk retry

#### US-10: Melihat Riwayat Sesi
Sebagai pengguna, saya ingin melihat daftar semua sesi fokus saya, agar saya bisa meninjau seberapa konsisten saya.

**Priority:** High
**Screen:** History Screen

**Acceptance Criteria:**
- [ ] Daftar sesi ditampilkan secara kronologis (terbaru di atas)
- [ ] Sesi dikelompokkan berdasarkan tanggal: "Today", "Yesterday", "Aug 30, 2026"
- [ ] Setiap item menampilkan: durasi fokus, nama task (jika ada), rest earned, timestamp
- [ ] Filter tersedia: date range, task, sort order
- [ ] Infinite scroll atau "Load More" untuk pagination
- [ ] Summary strip: "Total: XX sessions | XXXh XXm focus time"

#### US-11: Melihat Detail Sesi
Sebagai pengguna, saya ingin melihat detail dari satu sesi tertentu, agar saya bisa menganalisis sesi individu.

**Priority:** Mid
**Screen:** Session Detail Screen

**Acceptance Criteria:**
- [ ] Ringkasan: durasi fokus (dengan ring visual), task, tanggal, rest earned vs rest taken
- [ ] Timeline: urutan event (focus started → break started → session ended)
- [ ] Tombol hapus sesi dengan konfirmasi
- [ ] Back button untuk kembali ke history
- [ ] Loading state dan error state tersedia

---

### Modul 4: Analytics

#### US-12: Melihat Dasbor Hari Ini
Sebagai pengguna yang baru buka aplikasi, saya ingin melihat ringkasan produktivitas hari ini, agar saya tahu sudah berapa banyak yang saya kerjakan.

**Priority:** High
**Screen:** Dashboard

**Acceptance Criteria:**
- [ ] 3 stat cards: Today's Focus (durasi), Total Focus (akumulasi), Streak (hari)
- [ ] Quick Start button untuk langsung ke Focus Screen
- [ ] 5 sesi terakhir dengan durasi dan rest
- [ ] Weekly focus bar chart (7 hari terakhir)
- [ ] Jika belum ada sesi: empty state "Ready to focus?" + CTA
- [ ] Stat numbers animasi count-up saat halaman dimuat

#### US-13: Melihat Grafik Produktivitas
Sebagai pengguna, saya ingin melihat grafik tren fokus saya dari waktu ke waktu, agar saya bisa mengidentifikasi pola produktivitas.

**Priority:** Mid
**Screen:** Analytics Screen

**Acceptance Criteria:**
- [ ] Toggle period: Day / Week / Month
- [ ] Line chart: tren durasi fokus per periode
- [ ] 4 stat cards: Avg Focus, Total Focus, Best Day, Longest Session
- [ ] Bar chart: distribusi durasi sesi (kelompok per rentang waktu)
- [ ] Heatmap: kalender kontribusi ala GitHub
- [ ] Tooltip pada hover/touch untuk detail data point
- [ ] Chart transisi animasi saat switch periode

#### US-14: Melihat Streak Konsistensi
Sebagai pengguna, saya ingin melihat berapa hari berturut-turut saya melakukan sesi fokus, agar saya termotivasi untuk konsisten.

**Priority:** Mid
**Screen:** Dashboard, Analytics Screen

**Acceptance Criteria:**
- [ ] Streak counter ditampilkan di Dashboard (stat card)
- [ ] Streak = jumlah hari berturut-turut dengan minimal 1 sesi fokus
- [ ] Streak reset ke 0 jika hari ini belum ada sesi (melewati midnight)
- [ ] Streak ditampilkan juga di heatmap (Analytics)
- [ ] Visual: angka streak dengan icon 🔥

---

### Modul 5: Settings

#### US-15: Mengubah Rest Ratio
Sebagai pengguna yang ingin menyesuaikan rasio istirahat, saya ingin mengubah rest ratio, agar sesuai dengan kebutuhan saya.

**Priority:** Low
**Screen:** Settings Screen

**Acceptance Criteria:**
- [ ] Dropdown pilihan: 1/3, 1/4, **1/5** (default), 1/6
- [ ] Preview: "Contoh: 30 menit fokus → 6 menit istirahat"
- [ ] Perubahan langsung berlaku untuk sesi berikutnya
- [ ] Tidak mengubah sesi yang sudah selesai

#### US-16: Mengubah Theme
Sebagai pengguna, saya ingin mengubah tema antara light, dark, atau system, agar nyaman digunakan dalam kondisi pencahayaan berbeda.

**Priority:** Mid
**Screen:** Settings Screen

**Acceptance Criteria:**
- [ ] Toggle: Light / Dark / System (ikuti OS preference)
- [ ] Perubahan tema langsung diterapkan tanpa reload
- [** ] Preferensi tersimpan di database dan di-sync antar perangkat
- [ ] Dark mode menjadi default untuk Focus Screen

#### US-17: Mengelola Profil
Sebagai pengguna, saya ingin mengubah nama dan avatar saya, agar profil saya sesuai identitas.

**Priority:** Low
**Screen:** Settings Screen

**Acceptance Criteria:**
- [ ] Edit nama: inline edit dengan save button
- [ ] Upload avatar: file picker (JPEG/PNG, max 2MB), crop, preview
- [ ] Avatar disimpan ke object storage (Cloudflare R2 / S3)
- [ ] Perubahan langsung terlihat di navbar avatar

---

### Modul 6: Task Management (Basic)

#### US-18: Memilih Task Saat Mulai Fokus
Sebagai pengguna, saya ingin memilih task yang sedang dikerjakan saat memulai sesi, agar saya tahu waktu fokus saya habis untuk apa.

**Priority:** Mid
**Screen:** Focus Screen

**Acceptance Criteria:**
- [ ] Dropdown task selector di atas timer
- [ ] Pilihan: pilih task yang ada, atau "No task" (tanpa task)
- [ ] Quick create: ketik nama task baru langsung dari dropdown
- [ ] Task yang dipilih ditampilkan selama sesi berlangsung
- [ ] Task disimpan bersama session record

#### US-19: Melihat Task Berdasarkan Waktu Fokus
Sebagai pengguna, saya ingin melihat task mana yang paling banyak menghabiskan waktu fokus, agar saya bisa mengalokasikan waktu lebih baik.

**Priority:** Low
**Screen:** Analytics Screen

**Acceptance Criteria:**
- [ ] Breakdown per task di Analytics
- [ ] Pie chart atau bar chart: distribusi waktu per task
- [ ] Klik task → filter history oleh task tersebut
- [ ] Minimum 3 task ditampilkan

---

## BAGIAN 4: Functional Requirements

### Modul 1: Autentikasi

**FR-01: Registrasi Pengguna** — **Must Have** — **M**
- **Input:** Nama, email, password
- **Proses:** Validasi format email, cek keunikan, hash password (bcrypt, 12 rounds), simpan ke `users` table
- **Output:** Akun terdaftar, JWT token, redirect ke Dashboard
- **Aturan:** Password min 8 karakter, email harus unique, nama min 2 karakter

**FR-02: Login Pengguna** — **Must Have** — **S**
- **Input:** Email, password
- **Proses:** Verifikasi kredensial, generate JWT token (expiry 7 hari), set httpOnly cookie
- **Output:** Token akses, redirect ke Dashboard
- **Aturan:** 5x gagal berturut = rate limit 15 menit per IP

**FR-03: Reset Password** — **Should Have** — **M**
- **Input:** Email
- **Proses:** Generate reset token (crypto.randomBytes), kirim email via Resend/SendGrid
- **Output:** Email reset terkirim
- **Aturan:** Token valid 24 jam, sekali pakai, semua session lama ter-invalidate

**FR-04: OAuth Login (Google)** — **Could Have** — **L**
- **Input:** Google OAuth callback
- **Proses:** Verify Google token, upsert user, generate JWT
- **Output:** Login/Register otomatis, redirect ke Dashboard
- **Aturan:** Jika email sudah ada dengan password, link akun Google

### Modul 2: Focus Timer

**FR-05: Start Focus Session** — **Must Have** — **M**
- **Input:** User tap "Start Focus", optional task_id
- **Proses:** Buat record di `sessions` table (status: active, started_at: now), mulai client-side timer (requestAnimationFrame)
- **Output:** Timer mulai count-up, session ID tersimpan
- **Aturan:** Hanya 1 active session per user, jika ada session aktif lama → auto-save dulu

**FR-06: Real-Time Timer Display** — **Must Have** — **M**
- **Input:** Client-side elapsed seconds
- **Proses:** Render digits HH:MM:SS dengan animasi smooth, update circular ring SVG, update earned rest badge
- **Output:** Timer visual real-time
- **Aturan:** Akurat meskipun tab background (requestAnimationFrame + timestamp delta), akurat setelah device sleep

**FR-07: Pause/Resume Session** — **Should Have** — **M**
- **Input:** User tap "Pause" / "Resume"
- **Proses:** Pause: stop timer, catat paused_at. Resume: hitung delta pause, adjust started_at
- **Output:** Timer berhenti/lanjut
- **Aturan:** Total pause duration tidak dihitung dalam fokus time

**FR-08: Stop Session & Take Break** — **Must Have** — **L**
- **Input:** User tap "Stop", pilih "Take Break"
- **Proses:** Hitung rest_earned = floor(elapsed_seconds / (ratio_number)), buat break timer countdown, tampilkan Break overlay
- **Output:** Break countdown mulai, earned rest time ditampilkan
- **Aturan:** Ratio default 1/5 (configurable di settings), break max = rest_earned

**FR-09: Break Countdown** — **Must Have** — **M**
- **Input:** Rest earned duration (dari FR-08)
- **Proses:** Countdown dari rest_earned sampai 0, render break ring (amber), browser notification saat selesai
- **Output:** Break timer berjalan, notifikasi saat selesai
- **Aturan:** Break bisa di-skip ("Skip Break"). Jika skip, sisa rest tidak ditambahkan ke sesi berikutnya

**FR-10: Auto-Save Session** — **Must Have** — **M**
- **Input:** Session berhenti (stop atau break selesai)
- **Proses:** Update record `sessions`: ended_at, duration, rest_earned, rest_taken, status = completed
- **Output:** Data tersimpan ke database
- **Aturan:** Jika offline, simpan ke IndexedDB, sync saat online. Jika tab close tanpa save → save saat user login lagi

**FR-11: Offline Timer Resilience** — **Must Have** — **L**
- **Input:** Network lost saat timer berjalan
- **Proses:** Timer tetap berjalan (client-side), data disimpan di IndexedDB, sync saat network恢复
- **Output:** Tidak ada kehilangan data
- **Aturan:** Indikator "Offline" muncul di UI, auto-sync saat online

### Modul 3: Session Management

**FR-12: Session History List** — **Must Have** — **M**
- **Input:** User navigate ke `/history`
- **Proses:** Fetch sessions dari database, group by date, paginasi
- **Output:** Daftar sesi kronologis dengan durasi, task, rest, timestamp
- **Aturan:** Default 20 item per halaman, infinite scroll / load more

**FR-13: Session Filtering & Sorting** — **Should Have** — **M**
- **Input:** Filter parameters (date range, task, sort order)
- **Proses:** Query database dengan filter, return filtered results
- **Output:** Filtered session list
- **Aturan:** Filter: date_from, date_to, task_id, sort (newest/oldest/longest/shortest)

**FR-14: Session Detail View** — **Should Have** — **S**
- **Input:** Session ID
- **Proses:** Fetch session + events dari database
- **Output:** Detail view: summary ring, task, date, rest stats, timeline
- **Aturan:** Timeline events: focus_started, break_started, break_ended, session_ended

**FR-15: Delete Session** — **Could Have** — **S**
- **Input:** User tap "Delete" pada session detail
- **Proses:** Hard delete session record + events
- **Output:** Session terhapus, redirect ke history
- **Aturan:** Konfirmasi modal sebelum delete. Tidak ada soft delete untuk V1

### Modul 4: Analytics

**FR-16: Dashboard Overview** — **Must Have** — **M**
- **Input:** User navigate ke `/dashboard`
- **Proses:** Aggregate data: today focus, total focus, streak, recent sessions, weekly chart
- **Output:** 3 stat cards + quick start + recent sessions + weekly chart
- **Aturan:** Data di-cache 5 menit, invalidasi saat ada session baru

**FR-17: Analytics Charts** — **Should Have** — **L**
- **Input:** User navigate ke `/analytics`, pilih period (day/week/month)
- **Proses:** Aggregate data per periode, hitung avg, total, best day, longest session
- **Output:** Line chart, stat cards, bar chart, heatmap
- **Aturan:** Minimum data 1 session untuk menampilkan chart. Kosong = empty state

**FR-18: Streak Calculation** — **Should Have** — **S**
- **Input:** User sessions grouped by date
- **Proses:** Hitung hari berturut-turut dengan minimal 1 session, mulai dari hari ini mundur
- **Output:** Streak count (angka)
- **Aturan:** Reset jika hari ini belum ada session (melewati midnight user timezone)

### Modul 5: Settings & Profile

**FR-19: User Settings Management** — **Must Have** — **M**
- **Input:** Settings update (rest_ratio, theme, notifications, sound)
- **Proses:** Validasi input, update `users` table
- **Output:** Settings tersimpan, diterapkan langsung
- **Aturan:** Rest ratio: enum 1/3, 1/4, 1/5, 1/6. Default 1/5. Theme: light/dark/system. Semua settings sync antar device

**FR-20: Profile Management** — **Should Have** — **M**
- **Input:** Profile update (name, avatar)
- **Proses:** Validate, upload avatar ke R2/S3, update `users` table
- **Output:** Profile terupdate
- **Aturan:** Avatar max 2MB, JPEG/PNG only, auto-resize ke 256x256

---

## BAGIAN 5: Non-Functional Requirements

### Performa
| Metrik | Target | Cara Ukur |
|--------|--------|-----------|
| First Contentful Paint (FCP) | < 1.5 detik | Lighthouse / Web Vitals |
| Largest Contentful Paint (LCP) | < 2.5 detik | Lighthouse / Web Vitals |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse / Web Vitals |
| API Response Time (p95) | < 300ms | Server monitoring |
| Timer Accuracy | ±1 detik per jam | Client-side test |
| Bundle Size (JS) | < 150KB gzipped | Build analysis |
| PWA Install Prompt | < 3 detik load | Lighthouse PWA audit |

### Keamanan
| Standar | Implementasi |
|---------|-------------|
| Password Hashing | bcrypt, 12 rounds |
| Transport | HTTPS wajib (HSTS) |
| Authentication | JWT (httpOnly cookie, 7 hari expiry) |
| CSRF | SameSite cookie + CSRF token |
| Rate Limiting | 5 req/detik per endpoint, 5 login gagal = blokir 15 menit |
| Input Validation | Server-side validation semua input (zod) |
| SQL Injection | Parameterized queries via Drizzle ORM |
| XSS | Svelte auto-escapes, CSP header |
| Secrets | Environment variables, tidak di repo |

### Skalabilitas
| Metrik | Target | Strategi |
|--------|--------|----------|
| Concurrent Users | 500 | Render auto-scale, PostgreSQL connection pooling |
| Total Users | 10.000 | Vertical scale → horizontal (load balancer) |
| Database | PostgreSQL | Indexed queries, connection pooling (PgBouncer) |
| Storage | Object storage | Cloudflare R2 (avatars) |
| CDN | Static assets | Render CDN / Cloudflare |

### Usability
| Standar | Implementasi |
|---------|-------------|
| Responsive | Mobile-first, 3 breakpoint (768px, 1024px) |
| Accessibility | WCAG 2.1 AA, keyboard navigation, ARIA labels |
| Browser Support | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ |
| PWA | Service worker, offline support, installable |
| Theme | Light + Dark mode |
| Language | English (V1), Bahasa Indonesia (V2) |

---

## BAGIAN 6: Integration Points

### Ringkasan

Flowdoro V1 membutuhkan minimal integrasi untuk autentikasi, penyimpanan, dan email.

### Integration List

| Service | Purpose | Auth Method | Data Flow | SLA / Limits |
|---------|---------|-------------|-----------|--------------|
| **Google OAuth** | Login/Register via Google | OAuth 2.0 (Authorization Code) | User authorize → Google callback → verify token → upsert user | 99.99% uptime, rate limit: 10.000 req/user/hari |
| **Cloudflare R2** | Avatar storage | S3-compatible API (access key + secret) | Upload → R2 → public URL → store in DB | 99.99% uptime, 10GB free |
| **Resend** | Transactional email (reset password, verification) | API Key (Bearer) | Generate token → Resend API → email delivered | 99.9% uptime, 3000 email/bulan free |
| **Render** | Hosting & Database | Managed service | Deploy via Docker, PostgreSQL managed | 99.95% uptime (starter plan) |

### Dependencies
- **Synchronization:** Real-time (WebSocket untuk timer sync antar tab/device — V2), Polling (dashboard stats setiap 30 detik)
- **Fallback:** Jika Google OAuth down → login email/password saja. Jika R2 down → avatar default (initials). Jika Resend down → retry queue, fallback ke email client
- **Caching Strategy:** Dashboard data di-cache 5 menit (server-side), session list cached 1 menit, analytics cached 15 menit

---

## BAGIAN 7: Compliance & Data Privacy

### Regulasi
- **Indonesia:** UU PDP (Pelindungan Data Pribadi) No. 27 Tahun 2022
- **Global (jika ekspansi):** GDPR (General Data Protection Regulation)

### Data Classification

| Data Type | Category | Storage | Encryption | Retention |
|-----------|----------|---------|------------|-----------|
| Email | PII | PostgreSQL `users.email` | AES-256 at rest | Selama akun aktif + 30 hari |
| Nama | PII | PostgreSQL `users.name` | AES-256 at rest | Selama akun aktif + 30 hari |
| Password | Sensitive | PostgreSQL `users.password_hash` | bcrypt (one-way hash) | Selama akun aktif |
| Avatar | PII | Cloudflare R2 | TLS in transit | Selama akun aktif + 30 hari |
| Session Data | Non-PII | PostgreSQL `sessions` | AES-256 at rest | 2 tahun (untuk analytics) |
| User Preferences | Non-PII | PostgreSQL `users` settings | AES-256 at rest | Selama akun aktif |
| JWT Token | Auth | Client httpOnly cookie | HTTPS only | 7 hari (auto-expire) |

### Data Deletion Flow

1. **User request hapus akun:**
   - User klik "Delete Account" di Settings → ketik "DELETE" untuk konfirmasi
   - Sistem melakukan soft delete (tandai `deleted_at`, anonymize PII)
   - Setelah 30 hari → hard delete semua data
2. **Otomasasi:**
   - Script cron job setiap hari: hard delete semua record dengan `deleted_at` > 30 hari
   - Avatar di R2 dihapus saat hard delete

### Consent Management
- **Registration Consent:** Checkbox "I agree to the Privacy Policy and Terms of Service" (wajib dicentang)
- **Cookie Consent:** Tidak diperlukan — Flowdoro hanya menggunakan httpOnly session cookies (essential), tidak ada tracking cookies
- **Data Processing:** Pengguna menyetujui pemrosesan data untuk layanan utama (timer, analytics) saat registrasi
- **Opt-out:** Pengguna bisa menarik consent dengan menghapus akun (semua data dihapus)

---

## BAGIAN 8: Out of Scope & Dependensi

### Out of Scope (V2+)

| Fitur | Alasan Ditunda | Target Version |
|-------|---------------|----------------|
| Task Management (kanban, subtask, due date) | V1 fokus timer + analytics | V2 |
| Ambient Sound / White Noise | Nice to have, bukan core | V2 |
| Integrasi Notion / Jira / Calendar | Butuh lebih banyak integrasi third-party | V2 |
| Tim / Collaboration (shared sessions) | Butuh role-based access, team management | V3 |
| Mobile App (React Native / Flutter) | PWA sudah cukup untuk V1 | V3 |
| AI Focus Coach | Butuh AI integration, training data | V3 |
| Gamification (achievements, badges) | Nice to have, butuh UX research | V2 |
| Custom rest ratio per session | V1: global ratio di settings | V2 |

### Dependensi

| Dependency | Versi | Untuk |
|------------|-------|-------|
| **Svelte** | 5.x | Frontend framework |
| **Tailwind CSS** | 4.x | Styling |
| **Vite** | 6.x | Build tool & dev server |
| **Bun** | Latest | Runtime & package manager |
| **ElysiaJS** | Latest | Backend API framework |
| **Drizzle ORM** | Latest | Database ORM |
| **PostgreSQL** | 16+ | Primary database |
| **Docker** | Latest | Containerization |
| **Render** | — | PaaS deployment |
| **Cloudflare R2** | — | Object storage (avatars) |
| **Resend** | — | Transactional email |
| **zod** | Latest | Schema validation |
| **JWT (jose)** | Latest | Token generation & verification |

### Asumsi

1. **Koneksi internet stabil** — Flowdoro adalah web app, membutuhkan koneksi internet untuk sync. Timer tetap berjalan offline tetapi data hanya tersimpan lokal sampai online
2. **Browser modern** — Support Chrome 90+, Firefox 90+, Safari 15+, Edge 90+
3. **Pengguna memiliki email aktif** — Untuk registrasi dan reset password
4. **Single-user per akun** — V1 tidak mendukung collaboration
5. **Zona waktu user** — Semua timestamp menggunakan timezone lokal user, stored sebagai UTC di database
6. **Rest ratio default 1/5** — Bisa diubah di settings, tetapi 1/5 adalah standard Flowmodoro ratio

---

---

## PRD Review — Konsistensi Check

```
🔍 PRD Review — Konsistensi Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Visi & Metrics:       ✅ Jelas & terukur (5 KPI targets)
Persona & Journey:    ✅ 2 persona + user journey lengkap
User Stories:         ✅ 19 stories, semua ada priority & AC
FR Coverage:          ✅ 20 FR, semua ada MoSCoW + effort (S/M/L/XL)
Integration:          ✅ 4 integrations (Google OAuth, R2, Resend, Render)
Compliance:           ✅ UU PDP, data classification, retention, deletion flow
Design Cross-ref:     ✅ Semua screen dari DESIGN.md tercakup dalam US/FR
Out of Scope:         ✅ V2/V3 features jelas, dependensi realistis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

> **Next Step:** Ketik `"Buat Tech Spec berdasarkan PRD dan DESIGN.md yang sudah dibuat"` untuk melanjutkan ke Technical Specification.
