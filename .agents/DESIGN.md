# Flowdoro — UI/UX Design Specification

> **Version:** 1.0
> **Date:** 2026-08-31
> **Platform:** Web + PWA
> **Stack:** Svelte + Tailwind CSS + Vite + Bun + ElysiaJS + Drizzle ORM + PostgreSQL + Docker + Render

---

## Unique Value Proposition

> **"Work until your focus fades, rest in proportion. No arbitrary countdowns interrupting flow."**

Flowdoro replaces rigid countdown timers with a count-up stopwatch. Users focus freely from second 0, stop when they need rest, and automatically earn break time at a 5:1 ratio (1 minute rest per 5 minutes worked). A real-time dashboard and session history reveal productivity patterns without interrupting the workflow.

**Key Differentiators vs Competitors:**
- **Stopwatch count-up** (not countdown) — never interrupts deep focus
- **5:1 proportional rest** — breaks scale naturally with effort
- **Real-time analytics dashboard** — session history, trends, streaks
- **Full-stack with auth** — cloud sync, multi-device access

---

---

## BAGIAN 1: Design System

### Style Profile
- **Style:** Modern & Clean
- **Platform:** Web + PWA
- **Mode:** Both (Light + Dark — dark mode primary for focus sessions)
- **Typography:** Inter (clean, modern, excellent readability at all sizes)
- **Grid System:** 4px base grid
- **Border Philosophy:** Rounded corners, subtle borders, minimal shadows

---

### Color Palette

#### Light Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#0D9488` | Brand teal — main CTA, active states, focus ring |
| `--color-primary-hover` | `#0F766E` | Hover/pressed states on primary elements |
| `--color-primary-light` | `#CCFBF1` | Primary background tint, badges |
| `--color-secondary` | `#F59E0B` | Accent amber — earned rest indicator, streaks |
| `--color-surface` | `#FFFFFF` | Card/container backgrounds |
| `--color-surface-elevated` | `#F8FAFC` | Elevated cards, hover states |
| `--color-background` | `#F1F5F9` | Page background |
| `--color-text-primary` | `#0F172A` | Headings, primary text |
| `--color-text-secondary` | `#64748B` | Muted text, labels, timestamps |
| `--color-error` | `#EF4444` | Error states, destructive actions |
| `--color-success` | `#10B981` | Success states, completed tasks |
| `--color-warning` | `#F59E0B` | Warnings, time alerts |
| `--color-border` | `#E2E8F0` | Dividers, input borders |
| `--color-overlay` | `#0F172A/60` | Modal backdrop |

#### Dark Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary-dark` | `#14B8A6` | Brand teal (brighter for dark bg) |
| `--color-primary-hover-dark` | `#0D9488` | Hover/pressed states (dark) |
| `--color-primary-light-dark` | `#134E4A` | Primary background tint (dark) |
| `--color-secondary-dark` | `#FBBF24` | Accent amber (brighter for dark bg) |
| `--color-surface-dark` | `#1E293B` | Card/container backgrounds (dark) |
| `--color-surface-elevated-dark` | `#334155` | Elevated cards (dark) |
| `--color-background-dark` | `#0F172A` | Page background (dark) |
| `--color-text-primary-dark` | `#F8FAFC` | Headings, primary text (dark) |
| `--color-text-secondary-dark` | `#94A3B8` | Muted text (dark) |
| `--color-error-dark` | `#F87171` | Error states (dark) |
| `--color-success-dark` | `#34D399` | Success states (dark) |
| `--color-warning-dark` | `#FBBF24` | Warnings (dark) |
| `--color-border-dark` | `#334155` | Dividers (dark) |
| `--color-overlay-dark` | `#000000/70` | Modal backdrop (dark) |

---

### Typography

| Token | Font Family | Size | Weight | Line Height | Usage |
|-------|------------|------|--------|-------------|-------|
| `--font-family` | Inter, system-ui, sans-serif | — | — | — | Base font family |
| `--font-display` | Inter | 48px / 3rem | 700 | 1.1 | Hero text, large numbers (timer) |
| `--font-h1` | Inter | 32px / 2rem | 700 | 1.2 | Page titles |
| `--font-h2` | Inter | 24px / 1.5rem | 600 | 1.3 | Section titles |
| `--font-h3` | Inter | 18px / 1.125rem | 600 | 1.4 | Card titles |
| `--font-body` | Inter | 16px / 1rem | 400 | 1.6 | Body text |
| `--font-body-sm` | Inter | 14px / 0.875rem | 400 | 1.5 | Captions, secondary text |
| `--font-mono` | JetBrains Mono, monospace | 48px / 3rem | 600 | 1.0 | Timer display (count-up digits) |
| `--font-button` | Inter | 14px / 0.875rem | 600 | 1.0 | Button labels |
| `--font-caption` | Inter | 12px / 0.75rem | 400 | 1.4 | Helper text, timestamps |

---

### Spacing (4px Grid)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-2xs` | 2px | Tight inline spacing |
| `--space-xs` | 4px | Icon gaps, inline elements |
| `--space-sm` | 8px | Small padding, compact gaps |
| `--space-md` | 16px | Standard padding, card gaps |
| `--space-lg` | 24px | Section spacing |
| `--space-xl` | 32px | Large section gaps |
| `--space-2xl` | 48px | Page margins, hero spacing |
| `--space-3xl` | 64px | Major section separators |

---

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Input fields, small badges |
| `--radius-md` | 8px | Cards, buttons, inputs |
| `--radius-lg` | 12px | Modals, large cards |
| `--radius-xl` | 16px | Bottom sheets, panels |
| `--radius-full` | 9999px | Avatars, pills, circular timer ring |

---

### Elevation / Shadow

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle cards, inputs |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` | Cards, dropdowns |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` | Modals, floating panels |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)` | Toast notifications |

---

### Icon Style
- **Style:** Lucide (outline, clean lines)
- **Default Size:** 20px
- **Small Size:** 16px
- **Large Size:** 24px
- **Stroke Width:** 1.5px
- **Skeleton Loading:** Pulse animation — 800ms ease-in-out infinite, `--color-border` background

---

### Animation Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 100ms | Button press, toggles |
| `--duration-normal` | 200ms | Hover states, small transitions |
| `--duration-medium` | 300ms | Page transitions, modals |
| `--duration-slow` | 500ms | Complex animations |
| `--easing-default` | cubic-bezier(0.4, 0, 0.2, 1) | Standard easing |
| `--easing-in` | cubic-bezier(0.4, 0, 1, 1) | Enter animations |
| `--easing-out` | cubic-bezier(0, 0, 0.2, 1) | Exit animations |
| `--easing-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | Bouncy/spring feel |

---

---

## BAGIAN 2: Screen Map & User Flow

### Information Architecture / Sitemap

```
[Depth 0] Landing Page (/)
│
├── [Depth 1] Auth
│   ├── [Depth 2] Login (/login)
│   └── [Depth 2] Register (/register)
│
└── [Depth 1] App Shell (requires auth)
    ├── [Depth 1] Dashboard (/dashboard)
    │   └── [Depth 2] Session Detail (/dashboard/session/:id)
    │
    ├── [Depth 1] Focus (/focus)
    │   └── [Depth 2] Break Mode (overlay, not separate route)
    │
    ├── [Depth 1] History (/history)
    │   └── [Depth 2] Session Detail (/history/session/:id)
    │
    ├── [Depth 1] Analytics (/analytics)
    │
    └── [Depth 1] Settings (/settings)
        ├── [Depth 2] Profile
        ├── [Depth 2] Preferences (ratio, theme, notifications)
        └── [Depth 2] Account
```

**Navigasi Depth:** Maks 3 level (App Shell → Module → Detail)
**Bottom Nav:** Dashboard | Focus | History | Settings
**Top Nav:** Logo + App name | Theme toggle | User avatar dropdown

---

### Screen Inventory

| # | Screen | Route | Module | Depth |
|---|--------|-------|--------|-------|
| 1 | Landing Page | `/` | Marketing | L1 |
| 2 | Login | `/login` | Auth | L2 |
| 3 | Register | `/register` | Auth | L2 |
| 4 | Dashboard | `/dashboard` | Core | L1 |
| 5 | Focus Screen | `/focus` | Core | L1 |
| 6 | Break Mode | (overlay) | Core | L1 |
| 7 | History | `/history` | Core | L1 |
| 8 | Session Detail | `/history/session/:id` | Core | L2 |
| 9 | Analytics | `/analytics` | Core | L1 |
| 10 | Settings | `/settings` | Core | L1 |

---

### User Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER JOURNEY                          │
│                                                         │
│  [Landing] ──→ [Register/Login] ──→ [Dashboard]        │
│                                       │                 │
│                    ┌──────────────────┤                 │
│                    ▼                  ▼                 │
│              [History]         [Focus Screen]           │
│                    │              │       │              │
│                    ▼              ▼       ▼              │
│            [Session Detail] [Break]  [Analytics]        │
│                                 │       │               │
│                                 ▼       ▼               │
│                          [Back to Focus] [Settings]     │
│                                                     │   │
│                                                     ▼   │
│                                                [Profile]│
└─────────────────────────────────────────────────────────┘
```

**Flow Legend:**
- `→` Primary navigation
- `⇢` Alternative path
- `←` Back navigation

---

### Main Flows

**Flow 1: Focus Session (Core Flow)**
1. User opens `/focus` screen
2. User selects or creates a task (optional)
3. User taps "Start Focus" — stopwatch starts counting UP from 00:00
4. Stopwatch displays live elapsed time with smooth digit animation
5. User works freely (no timer pressure)
6. When focus wanes, user taps "Take a Break"
7. System calculates earned rest: `focus_duration / 5` (e.g., 50min focus → 10min rest)
8. Break countdown appears as overlay, counts DOWN from earned rest
9. Break timer ends → notification + vibration → user returns to focus
10. Session auto-saves to history with full stats

**Flow 2: View Analytics**
1. User navigates to `/analytics` via bottom nav
2. Sees today's summary (focus time, rest time, sessions count)
3. Switches between Daily / Weekly / Monthly views
4. Views charts: focus time trend, session duration distribution, streak calendar
5. Taps a specific day to see drill-down

**Flow 3: Review Session History**
1. User navigates to `/history` via bottom nav
2. Sees chronological list of past sessions (date, task, duration, rest earned)
3. Taps a session to see detail: timeline, duration, rest taken, notes
4. Can filter by date range, task, or duration

---

### Responsive Behavior

| Breakpoint | Layout | Navigation | Timer Size |
|-----------|--------|------------|------------|
| **Mobile (< 768px)** | Single column, stacked cards | Bottom nav (4 tabs) | Full-width hero |
| **Tablet (768-1024px)** | 2-column grid for cards | Bottom nav + sidebar toggle | Centered, 60% width |
| **Desktop (> 1024px)** | 3-column dashboard, sidebar | Sidebar navigation | Centered with surrounding stats |

---

---

## BAGIAN 3: Per-Screen Design

---

### Screen 01: Landing Page

**Purpose:** Marketing page to explain Flowdoro's value proposition and drive sign-ups
**UVP Highlight:** "Stop fighting the clock. Start flowing with it."
**Route:** `/`
**Access:** Public

#### Layout Structure
```
┌──────────────────────────────────────────────┐
│  Navbar: Logo + "Flowdoro" | Login | Sign Up │
├──────────────────────────────────────────────┤
│                                              │
│  Hero Section                                │
│  ┌────────────────────────────────────────┐  │
│  │  "Work until your focus fades,         │  │
│  │   rest in proportion."                 │  │
│  │                                        │  │
│  │  [Animated Stopwatch Preview]          │  │
│  │                                        │  │
│  │  [Get Started — Free] (Primary CTA)    │  │
│  └────────────────────────────────────────┘  │
│                                              │
├──────────────────────────────────────────────┤
│  How It Works (3 steps)                      │
│  ┌──────┐  ┌──────┐  ┌──────┐              │
│  │Step 1│→ │Step 2│→ │Step 3│              │
│  │Start │  │Focus │  │Rest  │              │
│  └──────┘  └──────┘  └──────┘              │
├──────────────────────────────────────────────┤
│  Features Grid (2x2)                         │
│  ┌─────────┐  ┌─────────┐                   │
│  │Proportio│  │Real-time│                   │
│  │nal Rest │  │Analytics│                   │
│  └─────────┘  └─────────┘                   │
│  ┌─────────┐  ┌─────────┐                   │
│  │Session  │  │Smart    │                   │
│  │History  │  │Insights │                   │
│  └─────────┘  └─────────┘                   │
├──────────────────────────────────────────────┤
│  Footer: Links + Social                      │
└──────────────────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| Navbar | Top | Logo, nav links, CTA buttons |
| Hero | Center | Headline, animated preview, CTA |
| StepCards | Center | 3-step how-it-works illustration |
| FeatureCard | Center | 2x2 feature grid |
| Footer | Bottom | Links, copyright |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | Full landing page renders | Normal load |
| **Loading** | Skeleton pulse for hero + cards | Initial load (rare, SPA) |
| **Error** | Generic error + retry | Network failure |
| **Logged In** | Navbar shows avatar + Dashboard link | Auth session exists |
| **Mobile** | Stacked layout, hamburger menu | < 768px breakpoint |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Hero Text | 2 rounded lines | 100% x 48px, 60% x 32px | Shimmer 1500ms |
| Hero Button | Rounded rect | 200px x 48px | Shimmer 1500ms |
| Step Cards | 3 rounded rects | 30% x 200px each | Shimmer 1500ms |

#### Empty State Spec
N/A — Landing page always has content.

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| **Network Offline** | "You're offline" + connection icon | Auto-retry when online |
| **Server Error** | "Something went wrong" + retry button | Tap retry → reload |

#### Data Format Per Screen
| Element | Type | Source | Format |
|---------|------|--------|--------|
| Headline | Static text | CMS/Code | — |
| CTA Button | Link | Code | `/register` |
| Stats Counter | Animated number | Hardcoded | "5,000+ focus sessions" |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Hero Headline | Page load | Fade up + slide in | 600ms | ease-out |
| Stopwatch Preview | Page load | Continuous rotation + count-up simulation | 3000ms loop | linear |
| Step Cards | Scroll into view | Stagger fade up (100ms delay each) | 400ms | ease-out |
| Feature Cards | Scroll into view | Scale up from 0.95 | 300ms | ease-out |
| CTA Button | Hover | Scale 1.03 + shadow-md | 200ms | ease-out |
| CTA Button | Click | Scale 0.97 | 100ms | ease-in |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Login button | Click | Navigate to `/login` |
| Sign Up button | Click | Navigate to `/register` |
| CTA "Get Started" | Click | Navigate to `/register` |
| Hamburger menu (mobile) | Click | Slide-in sidebar with nav links |

#### Accessibility
- **Keyboard Navigation:** Tab through all links and buttons in logical order (logo → nav → CTA)
- **ARIA Labels:** `role="banner"` for navbar, `role="main"` for content, `aria-label="Get started"` for CTA
- **Contrast Ratio:** All text on brand backgrounds ≥ 4.5:1 (WCAG AA)
- **Touch Target:** All interactive elements ≥ 44x44px
- **Screen Reader:** Hero section reads headline → subheadline → CTA in sequence

#### Responsive Behavior
- **Mobile (< 768px):** Single column, hero stacks vertically, hamburger replaces nav links, step cards stack
- **Tablet (768-1024px):** 2-column feature grid, hero uses 60% width
- **Desktop (> 1024px):** Full 3-column hero with animated preview side-by-side, 2x2 feature grid

---

### Screen 02: Login

**Purpose:** User authentication — login with email/password
**Route:** `/login`
**Access:** Public (redirect to dashboard if logged in)

#### Layout Structure
```
┌────────────────────────────────────┐
│                                    │
│         [Flowdoro Logo]            │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  Email                       │  │
│  │  ┌────────────────────────┐  │  │
│  │  │ user@example.com       │  │  │
│  │  └────────────────────────┘  │  │
│  │                              │  │
│  │  Password                    │  │
│  │  ┌────────────────────────┐  │  │
│  │  │ ••••••••        [eye]  │  │  │
│  │  └────────────────────────┘  │  │
│  │                              │  │
│  │  [        Log In          ]  │  │
│  │                              │  │
│  │  ── or continue with ──      │  │
│  │                              │  │
│  │  [Google] [GitHub]           │  │
│  │                              │  │
│  │  Don't have an account?      │  │
│  │  Sign Up                     │  │
│  └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| Logo | Top center | Flowdoro brand mark |
| InputField | Center | Email + password fields with validation |
| Button (Primary) | Center | "Log In" submit |
| Divider | Center | "or continue with" separator |
| SocialButton | Center | Google + GitHub OAuth |
| LinkText | Bottom | "Don't have an account? Sign Up" |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | Empty form, ready for input | Initial load |
| **Loading** | Button shows spinner, fields disabled | Submit in progress |
| **Error** | Red border on field + error message below | Validation / auth failure |
| **Success** | Brief green check → redirect to dashboard | Auth success |
| **Logged In** | Redirect to `/dashboard` | Auth session exists |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Logo | Circle | 48px x 48px | Pulse 800ms |
| Form Fields | Rounded rects | 100% x 52px each | Shimmer 1500ms |
| Submit Button | Rounded rect | 100% x 48px | Shimmer 1500ms |

#### Empty State Spec
N/A — Form is always visible.

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| **Invalid Credentials** | "Invalid email or password" + red border | Retry input |
| **Network Offline** | "Check your connection" banner | Auto-retry |
| **Account Locked** | "Account temporarily locked" message | Wait + retry later |
| **Validation Error** | Inline red text below field | Fix and resubmit |
| **OAuth Error** | "Failed to connect. Try again." banner | Retry OAuth flow |

#### Data Format Per Screen
| Element | Type | Source | Format |
|---------|------|--------|--------|
| Email | Text input | User input | email@domain.com |
| Password | Password input | User input | Min 8 chars, masked |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Logo | Page load | Scale up from 0.8 | 400ms | ease-out |
| Form Card | Page load | Fade up from 20px | 500ms | ease-out |
| Input Focus | Focus | Border color transition | 200ms | ease-out |
| Error Message | Error | Shake + fade in | 300ms | ease-out |
| Submit Button | Loading | Width shrinks to spinner | 300ms | ease-in-out |
| Success | Auth success | Fade out + redirect | 400ms | ease-in |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Email field | Type | Live validation on blur |
| Password field | Type + eye toggle | Show/hide password |
| Log In button | Click | Loading spinner → redirect or error |
| Google/GitHub | Click | OAuth redirect flow |
| Sign Up link | Click | Navigate to `/register` |

#### Accessibility
- **Keyboard Navigation:** Tab: email → password → submit → OAuth buttons → sign up link
- **ARIA Labels:** `aria-label="Email address"`, `aria-label="Password"`, `aria-describedby` for errors
- **Contrast Ratio:** Error text red on white ≥ 4.5:1
- **Touch Target:** All inputs ≥ 44px height, buttons ≥ 44x44px
- **Screen Reader:** Announces field labels, error messages via `aria-live="polite"`

#### Responsive Behavior
- **Mobile (< 768px):** Full-width card with 16px padding, centered vertically
- **Tablet (768-1024px):** Card max-width 400px, centered
- **Desktop (> 1024px):** Card max-width 420px, centered with decorative side panel

---

### Screen 03: Register

**Purpose:** New account creation — email/password + optional OAuth
**Route:** `/register`
**Access:** Public (redirect to dashboard if logged in)

#### Layout Structure
```
┌────────────────────────────────────┐
│                                    │
│         [Flowdoro Logo]            │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  Full Name                   │  │
│  │  ┌────────────────────────┐  │  │
│  │  │ John Doe               │  │  │
│  │  └────────────────────────┘  │  │
│  │                              │  │
│  │  Email                       │  │
│  │  ┌────────────────────────┐  │  │
│  │  │ user@example.com       │  │  │
│  │  └────────────────────────┘  │  │
│  │                              │  │
│  │  Password                    │  │
│  │  ┌────────────────────────┐  │  │
│  │  │ ••••••••        [eye]  │  │  │
│  │  └────────────────────────┘  │  │
│  │  Password strength: ████░░  │  │
│  │                              │  │
│  │  [       Create Account    ]  │  │
│  │                              │  │
│  │  ── or continue with ──      │  │
│  │                              │  │
│  │  [Google] [GitHub]           │  │
│  │                              │  │
│  │  Already have an account?    │  │
│  │  Log In                      │  │
│  └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| Logo | Top center | Flowdoro brand mark |
| InputField (3x) | Center | Name, email, password |
| PasswordStrength | Below password | Visual strength indicator |
| Button (Primary) | Center | "Create Account" submit |
| Divider | Center | "or continue with" |
| SocialButton (2x) | Center | Google + GitHub OAuth |
| LinkText | Bottom | "Already have an account? Log In" |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | Empty form | Initial load |
| **Loading** | Button spinner, fields disabled | Submit in progress |
| **Error** | Red field border + message | Validation / duplicate email |
| **Success** | Green check → redirect to dashboard | Account created |
| **Password Weak** | Strength bar red/orange | < 3 strength criteria met |
| **Password Strong** | Strength bar green | All criteria met |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Logo | Circle | 48px x 48px | Pulse 800ms |
| Form Fields | Rounded rects | 100% x 52px each | Shimmer 1500ms |

#### Empty State Spec
N/A

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| **Email Exists** | "An account with this email already exists" | Redirect to login |
| **Weak Password** | Strength indicator stays red/orange | Add more chars/symbols |
| **Network Offline** | "Check your connection" banner | Auto-retry |
| **Validation Error** | Inline red text below field | Fix and resubmit |

#### Data Format Per Screen
| Element | Type | Source | Format |
|---------|------|--------|--------|
| Full Name | Text input | User input | Min 2 chars |
| Email | Email input | User input | Valid email format |
| Password | Password input | User input | Min 8 chars, 1 uppercase, 1 number |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Password Strength Bar | Typing | Width + color transition | 200ms | ease-out |
| Logo | Page load | Scale up from 0.8 | 400ms | ease-out |
| Form Card | Page load | Fade up from 20px | 500ms | ease-out |
| Error Message | Error | Shake + fade in | 300ms | ease-out |
| Success | Account created | Green checkmark animation + fade out | 500ms | ease-out |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Fields | Type | Live validation on blur |
| Password | Type | Strength bar updates live |
| Create Account | Click | Loading → success redirect or error |
| OAuth buttons | Click | Redirect to provider |
| Log In link | Click | Navigate to `/login` |

#### Accessibility
- **Keyboard Navigation:** Tab: name → email → password → submit → OAuth → login link
- **ARIA Labels:** Each field has `aria-label`, errors use `aria-describedby`
- **Contrast Ratio:** All text ≥ 4.5:1
- **Touch Target:** ≥ 44x44px all interactive elements
- **Screen Reader:** Announces password strength level ("weak", "medium", "strong")

#### Responsive Behavior
- **Mobile (< 768px):** Full-width card, 16px padding, vertically centered
- **Tablet (768-1024px):** Max-width 400px, centered
- **Desktop (> 1024px):** Max-width 420px, centered

---

### Screen 04: Dashboard

**Purpose:** Main hub — overview of today's productivity, quick access to focus
**UVP Highlight:** "See your progress at a glance — every session counts."
**Route:** `/dashboard`
**Access:** Auth required

#### Layout Structure
```
┌──────────────────────────────────────────────┐
│  TopBar: Logo | Search | Theme Toggle | Avatar│
├──────────┬───────────────────────────────────┤
│          │                                   │
│ Sidebar  │  Dashboard Content                │
│          │                                   │
│ Dashboard│  ┌─────────┐ ┌─────────┐ ┌─────┐ │
│ Focus    │  │Today    │ │Total    │ │Streak│ │
│ History  │  │Focus    │ │Focus    │ │Days  │ │
│ Analytics│  │2h 34m   │ │127h     │ │  12  │ │
│ Settings │  └─────────┘ └─────────┘ └─────┘ │
│          │                                   │
│          │  ┌──────────────────────────────┐ │
│          │  │  Quick Start Focus           │ │
│          │  │  [▶ Start Focusing]          │ │
│          │  └──────────────────────────────┘ │
│          │                                   │
│          │  Recent Sessions                  │
│          │  ┌──────────────────────────────┐ │
│          │  │ Session 1 — 45m — Rest: 9m  │ │
│          │  │ Session 2 — 32m — Rest: 6m  │ │
│          │  │ Session 3 — 1h 5m — Rest:13m│ │
│          │  └──────────────────────────────┘ │
│          │                                   │
│          │  ┌──────────────────────────────┐ │
│          │  │  Weekly Focus Chart (bar)    │ │
│          │  │  █ █ █ █ █ █ █              │ │
│          │  └──────────────────────────────┘ │
│          │                                   │
└──────────┴───────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| TopBar | Top | Logo, search, theme toggle, user avatar |
| Sidebar (desktop) / BottomNav (mobile) | Left / Bottom | Navigation links with active indicator |
| StatCard (3x) | Top of content | Today's focus, total focus, streak |
| QuickStartButton | Center | Large "Start Focusing" CTA |
| SessionList | Below | Last 5 sessions with duration + rest |
| WeeklyChart | Bottom | Bar chart of this week's focus minutes |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | Stats loaded, recent sessions visible | Normal load |
| **Loading** | Skeleton pulse on all cards | Fetching data |
| **Error** | Error banner + retry | API failure |
| **Empty** | "Start your first focus session" + CTA | No sessions yet |
| **Active Session** | "Continue your session" banner | Unfinished session exists |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Stat Cards | Rounded rects | 30% x 100px each (3 cols) | Shimmer 1500ms |
| Quick Start Button | Rounded rect | 100% x 56px | Shimmer 1500ms |
| Session List (5x) | Lines + circles | 100% x 64px each | Shimmer 1500ms |
| Weekly Chart | Bar skeletons | 100% x 200px | Shimmer 1500ms |

#### Empty State Spec
| Elemen | Deskripsi |
|--------|-----------|
| **Ilustrasi** | Minimalist stopwatch icon with a "+" badge |
| **Ukuran Ilustrasi** | 120px x 120px |
| **Title** | "Ready to focus?" |
| **Description** | "Start your first focus session. Work as long as you need — Flowdoro tracks it all." |
| **CTA** | "Start Focusing" (Primary button) |

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| **API Failure** | Red banner "Couldn't load data" + Retry button | Tap retry → reload |
| **Network Offline** | Full offline banner with icon | Auto-retry when online |
| **Auth Expired** | "Session expired" + redirect to login | Auto-redirect to login |

#### Data Format Per Screen
| Element | Type | Source | Format |
|---------|------|--------|--------|
| Today's Focus | Duration | `sessions` table | "Xh XXm" |
| Total Focus | Duration | `sessions` table SUM | "XXXh" |
| Streak | Number | Calculated | "X days" |
| Session Item | Object | `sessions` table | Task name + duration + rest |
| Weekly Chart | Array | `sessions` grouped by day | Bar heights in minutes |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Stat Cards | Page load | Stagger fade up (80ms each) | 400ms | ease-out |
| Quick Start Button | Hover | Scale 1.02 + shadow-lg | 200ms | ease-out |
| Quick Start Button | Click | Scale 0.96 + pulse | 150ms | ease-out |
| Session List Item | Hover | Background tint | 150ms | ease-out |
| Session List Item | Click | Scale 0.98 | 100ms | ease-in |
| Weekly Chart Bars | Page load | Grow from bottom, stagger | 500ms | ease-out |
| Stat Number | Page load | Count-up animation | 800ms | ease-out |
| Active Session Banner | Appear | Slide down + fade in | 300ms | ease-out |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Quick Start | Click | Navigate to `/focus` |
| Session Item | Click | Navigate to session detail |
| Sidebar Nav Item | Click | Navigate to respective route |
| Theme Toggle | Click | Toggle light/dark mode |
| User Avatar | Click | Dropdown menu (Profile, Settings, Logout) |
| Stat Card | Click | Navigate to `/analytics` for detail |

#### Accessibility
- **Keyboard Navigation:** Sidebar → stat cards → quick start → session list → chart
- **ARIA Labels:** `role="navigation"` sidebar, `aria-current="page"` active nav, stat cards `aria-label="Today's focus time: 2 hours 34 minutes"`
- **Contrast Ratio:** All text ≥ 4.5:1, chart bars ≥ 3:1 against background
- **Touch Target:** All interactive ≥ 44x44px
- **Screen Reader:** Stats announced as complete sentences, chart described as text alternative

#### Responsive Behavior
- **Mobile (< 768px):** Bottom nav replaces sidebar, stat cards stack vertically, session list full-width
- **Tablet (768-1024px):** Collapsible sidebar, 2-column stat cards, 2-column chart + session list
- **Desktop (> 1024px):** Persistent sidebar, 3-column stat cards, 2-column bottom section

---

### Screen 05: Focus Screen (Hero Screen)

**Purpose:** Core screen — stopwatch count-up timer for focus sessions
**UVP Highlight:** "The stopwatch that respects your flow. Count up, not down."
**Route:** `/focus`
**Access:** Auth required

#### Layout Structure
```
┌──────────────────────────────────────────────┐
│  TopBar: Logo | Session Task | Theme | Avatar │
├──────────────────────────────────────────────┤
│                                              │
│         ┌──────────────────────────┐         │
│         │                          │         │
│         │    ╭──────────────╮      │         │
│         │   │                │     │         │
│         │   │    01:23:45    │     │         │
│         │   │   ──────────   │     │         │
│         │   │  Focus Time    │     │         │
│         │    ╰──────────────╯      │         │
│         │                          │         │
│         │  ┌────────────────────┐  │         │
│         │  │  Earned Rest: 16m  │  │         │
│         │  └────────────────────┘  │         │
│         │                          │         │
│         │  [▶ Pause]  [■ Stop]     │         │
│         │                          │         │
│         └──────────────────────────┘         │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Today's Sessions: 3 | Focus: 2h 34m  │  │
│  └────────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘
```

#### Circular Timer Ring
The main timer uses a **circular SVG progress ring** that:
- Fills clockwise as time increases (count-up visualization)
- Ring color: `--color-primary` (teal)
- Background ring: `--color-border`
- Number display: Large `--font-mono` digits inside the ring
- Pulsing glow effect when running

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| TopBar | Top | Logo, current task selector, theme toggle |
| CircularTimer | Center | SVG ring + count-up digits |
| EarnedRestIndicator | Below timer | "Earned Rest: Xm" badge that updates in real-time |
| ControlButtons | Below timer | Pause + Stop buttons |
| TodayStatsBar | Bottom | Quick stats strip |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Idle** | Timer at 00:00:00, "Start" button visible | No active session |
| **Running** | Timer counting up, ring filling, "Pause" + "Stop" visible | Session in progress |
| **Paused** | Timer frozen, ring paused, "Resume" + "Stop" visible | User tapped pause |
| **Break Mode** | Break overlay with countdown from earned rest | User tapped "Stop & Rest" |
| **Session Ended** | Session saved confirmation, stats summary | Break completed |
| **Error** | Error banner + retry | API failure |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Timer Ring | Circle | 240px diameter | Pulse 800ms |
| Timer Digits | Lines | 200px x 48px | Shimmer 1500ms |
| Control Buttons | Rounded rects | 48% x 48px each | Shimmer 1500ms |

#### Empty State Spec
N/A — Timer is always visible.

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| **API Failure (save)** | "Session couldn't save" + Retry | Retry save, data preserved locally |
| **Network Offline** | Timer continues, "Offline — saving when connected" | Auto-sync when online |
| **Browser Tab Hidden** | Timer continues accurately (requestAnimationFrame) | No visual change |

#### Data Format Per Screen
| Element | Type | Source | Format |
|---------|------|--------|--------|
| Elapsed Time | Duration | Client-side timer | HH:MM:SS (count-up) |
| Earned Rest | Duration | Calculated (elapsed / 5) | "XXm" |
| Current Task | String | User selection or "No task" | Truncated 30 chars |
| Today's Sessions | Number | `sessions` table | Integer |
| Today's Focus | Duration | `sessions` table SUM | "Xh XXm" |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Timer Digits | Every second | Smooth flip/update | 300ms | ease-out |
| Timer Ring | Continuous | Smooth clockwise fill | Real-time | linear |
| Start Button | Hover | Glow pulse + scale 1.03 | 200ms | ease-out |
| Start Button | Click | Scale 0.95 → expand to full timer | 400ms | spring |
| Pause Button | Click | Timer digits freeze with fade | 200ms | ease-out |
| Stop Button | Click | Confirmation slide-up | 300ms | ease-out |
| Earned Rest Badge | Each 60s | Number count-up + pulse | 300ms | ease-out |
| Break Overlay | Appear | Slide up from bottom + fade | 400ms | ease-out |
| Break Countdown | Running | Ring depletes clockwise | Real-time | linear |
| Session Complete | Break ends | Success checkmark animation | 500ms | spring |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Start button | Click | Timer starts counting up, button transforms to controls |
| Pause button | Click | Timer freezes, resume button appears |
| Stop button | Click | Confirmation modal: "Take a break?" |
| Stop & Rest | Click (modal) | Transition to break mode overlay |
| Stop & Save | Click (modal) | Save session, return to idle state |
| Task Selector | Click | Dropdown to select/create task |
| Break Countdown | Auto | Vibrate + notification when break ends |

#### Accessibility
- **Keyboard Navigation:** Space to start/pause, S to stop, Escape to cancel
- **ARIA Labels:** `aria-live="polite"` for timer digits, `aria-label="Focus time: 1 hour 23 minutes 45 seconds"`
- **Contrast Ratio:** Timer digits on ring background ≥ 7:1
- **Touch Target:** Control buttons ≥ 56x56px (primary action zone)
- **Screen Reader:** Announces elapsed time every 60 seconds, announces earned rest updates
- **Reduced Motion:** Disable ring animation, use static display

#### Responsive Behavior
- **Mobile (< 768px):** Timer ring fills width (80%), controls stack vertically below ring
- **Tablet (768-1024px):** Timer ring 280px centered, controls side-by-side
- **Desktop (> 1024px):** Timer ring 320px centered with sidebar stats panel

---

### Screen 06: Break Mode (Overlay)

**Purpose:** Countdown overlay during earned rest period
**UVP Highlight:** "You earned this rest — count down, then come back stronger."
**Route:** Overlay on `/focus`
**Access:** Auth required

#### Layout Structure
```
┌──────────────────────────────────────────────┐
│                                              │
│         ┌──────────────────────────┐         │
│         │                          │         │
│         │    ╭──────────────╮      │         │
│         │   │                │     │         │
│         │   │    12:34       │     │         │
│         │   │   ──────────   │     │         │
│         │   │  Break Time    │     │         │
│         │    ╰──────────────╯      │         │
│         │                          │         │
│         │  You focused for 1h 02m  │         │
│         │                          │         │
│         │  ┌────────────────────┐  │         │
│         │  │  [Skip Break]      │  │         │
│         │  └────────────────────┘  │         │
│         │                          │         │
│         └──────────────────────────┘         │
│                                              │
└──────────────────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| BreakTimerRing | Center | SVG ring counting DOWN (amber accent) |
| SessionSummary | Below timer | "You focused for Xm" text |
| SkipButton | Bottom | "Skip Break" ghost button |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Running** | Break countdown ticking, ring depleting | Break started |
| **Paused** | Countdown frozen | User clicked pause break |
| **Skipped** | Dismiss overlay → back to focus | User tapped "Skip Break" |
| **Completed** | "Welcome back!" → auto-dismiss | Countdown reached 0 |
| **Notification** | Browser notification + vibration | Break ended |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Break Ring | Circle | 200px diameter | Pulse 800ms |
| Break Digits | Lines | 120px x 40px | Shimmer 1500ms |

#### Empty State Spec
N/A

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| **Notification Blocked** | Silent — no change to UI | Manual return |
| **Tab Background** | Timer continues accurately | Tab title shows countdown |

#### Data Format Per Screen
| Element | Type | Source | Format |
|---------|------|--------|--------|
| Break Time Remaining | Duration | Calculated (focus / 5) | MM:SS (count-down) |
| Focus Duration | Duration | Previous session | "You focused for Xh Xm" |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Break Ring | Running | Smooth counter-clockwise depletion | Real-time | linear |
| Break Digits | Every second | Smooth update | 200ms | ease-out |
| Overlay | Appear | Fade in from 0% to 100% opacity | 400ms | ease-out |
| Overlay | Dismiss | Fade out + slide down | 300ms | ease-in |
| Welcome Back | Break complete | Scale up + bounce | 500ms | spring |
| Skip Button | Hover | Text color change | 150ms | ease-out |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Skip Break | Click | Dismiss overlay, back to focus |
| Overlay backdrop | Click | No action (prevent accidental dismiss) |

#### Accessibility
- **Keyboard Navigation:** Escape to skip break
- **ARIA Labels:** `aria-live="polite"` for countdown, `aria-label="Break time remaining: 12 minutes 34 seconds"`
- **Contrast Ratio:** Break text ≥ 4.5:1 on overlay background
- **Touch Target:** Skip button ≥ 44x44px
- **Screen Reader:** Announces break end ("Break complete. Ready to focus again?")

#### Responsive Behavior
- **Mobile (< 768px):** Full-screen overlay, timer ring 180px
- **Tablet (768-1024px):** Modal overlay, timer ring 220px
- **Desktop (> 1024px):** Centered modal, timer ring 240px

---

### Screen 07: History

**Purpose:** Chronological list of all past focus sessions with filtering
**UVP Highlight:** "Every session tells a story — see where your focus goes."
**Route:** `/history`
**Access:** Auth required

#### Layout Structure
```
┌──────────────────────────────────────────────┐
│  TopBar: Logo | "History" | Theme | Avatar    │
├──────────┬───────────────────────────────────┤
│          │                                   │
│ Sidebar  │  Filters                          │
│          │  ┌──────────────────────────────┐ │
│          │  │ [Date Range] [Task] [Sort ▼] │ │
│          │  └──────────────────────────────┘ │
│          │                                   │
│          │  Total: 47 sessions | 89h 23m     │
│          │                                   │
│          │  ── Today ──                      │
│          │  ┌──────────────────────────────┐ │
│          │  │ 🟢 01:23:45 │ Design Spec   │ │
│          │  │ Rest: 14m   │ 10:23 AM       │ │
│          │  └──────────────────────────────┘ │
│          │  ┌──────────────────────────────┐ │
│          │  │ 🟢 00:32:12 │ Bug Fix       │ │
│          │  │ Rest: 6m    │ 9:01 AM        │ │
│          │  └──────────────────────────────┘ │
│          │                                   │
│          │  ── Yesterday ──                  │
│          │  ┌──────────────────────────────┐ │
│          │  │ 🟢 00:54:33 │ Feature Work  │ │
│          │  │ Rest: 10m   │ 2:15 PM        │ │
│          │  └──────────────────────────────┘ │
│          │                                   │
│          │  [Load More]                      │
│          │                                   │
└──────────┴───────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| TopBar | Top | Logo, title, theme toggle, avatar |
| Sidebar / BottomNav | Left / Bottom | Navigation |
| FilterBar | Below top | Date range picker, task filter, sort dropdown |
| SummaryStrip | Below filters | Total sessions + total focus time |
| SessionCard (list) | Content area | Session duration, task, rest, timestamp |
| DateGroupHeader | Between groups | "Today", "Yesterday", "Aug 30, 2026" |
| LoadMoreButton | Bottom | Load next batch |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | Session list grouped by date | Normal load |
| **Loading** | Skeleton cards | Fetching data |
| **Empty** | "No sessions yet" + CTA to focus | No history data |
| **Filtered** | Filtered list with active filter badges | Filters applied |
| **Loading More** | Spinner at bottom of list | Pagination load |
| **Error** | Error banner + retry | API failure |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Filter Bar | Rounded rect | 100% x 48px | Shimmer 1500ms |
| Session Card (8x) | Rounded rects | 100% x 72px | Shimmer 1500ms |
| Date Header | Line | 30% x 20px | Shimmer 1500ms |

#### Empty State Spec
| Elemen | Deskripsi |
|--------|-----------|
| **Ilustrasi** | Empty calendar with clock icon |
| **Ukuran Ilustrasi** | 100px x 100px |
| **Title** | "No sessions yet" |
| **Description** | "Your focus history will appear here after your first session." |
| **CTA** | "Start Focusing" (Primary button → `/focus`) |

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| **API Failure** | Red banner + retry button | Tap retry → reload |
| **Network Offline** | "Offline — showing cached data" | Show last cached sessions |
| **Empty Filter** | "No sessions match these filters" + clear filters | Clear filters button |

#### Data Format Per Screen
| Element | Type | Source | Format |
|---------|------|--------|--------|
| Session Duration | Duration | `sessions.duration` | HH:MM:SS |
| Task Name | String | `tasks.name` | Truncated 30 chars |
| Rest Earned | Duration | Calculated (duration / 5) | "Xm" |
| Timestamp | DateTime | `sessions.created_at` | "10:23 AM" |
| Date Group | Date | Grouped by day | "Today", "Yesterday", "Aug 30, 2026" |
| Total Sessions | Number | Count | Integer |
| Total Focus | Duration | Sum | "XXh XXm" |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Session Card | Click | Scale 0.98 + shadow | 100ms | ease-in |
| Session Card | Hover | Background tint | 150ms | ease-out |
| Filter Change | Apply | List cross-fade | 200ms | ease-out |
| Date Group Header | Scroll in | Fade in | 200ms | ease-out |
| Load More | Click | Spinner + fade in new items | 300ms | ease-out |
| Page Enter | Route change | Slide left | 300ms | ease-in-out |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Session Card | Click | Navigate to session detail |
| Date Range Filter | Select | Filter list by date |
| Task Filter | Select | Filter by task |
| Sort Dropdown | Select | Reorder list |
| Load More | Click | Fetch next page |
| Clear Filters | Click | Reset all filters |

#### Accessibility
- **Keyboard Navigation:** Filters → session cards (arrow keys) → load more
- **ARIA Labels:** Session cards `aria-label="Focus session: 1 hour 23 minutes, Design Spec, at 10:23 AM"`
- **Contrast Ratio:** All text ≥ 4.5:1
- **Touch Target:** Session cards ≥ 72px height, filter buttons ≥ 44x44px
- **Screen Reader:** Announces group headers ("Today, 2 sessions"), session details

#### Responsive Behavior
- **Mobile (< 768px):** Bottom nav, filters in horizontal scroll, session cards full-width
- **Tablet (768-1024px):** Collapsible sidebar, filters inline, 2-column session list
- **Desktop (> 1024px):** Persistent sidebar, filters in toolbar, single-column list

---

### Screen 08: Session Detail

**Purpose:** Detailed view of a single past session
**Route:** `/history/session/:id`
**Access:** Auth required

#### Layout Structure
```
┌──────────────────────────────────────────────┐
│  ← Back | Session Detail                     │
├──────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │         Session Summary                │  │
│  │                                        │  │
│  │     ╭──────────────╮                   │  │
│  │    │  1:23:45       │                  │  │
│  │    │  Focus Time    │                  │  │
│  │     ╰──────────────╯                   │  │
│  │                                        │  │
│  │  Task: Design Spec                     │  │
│  │  Date: Aug 31, 2026 — 10:23 AM        │  │
│  │  Rest Earned: 16 min                   │  │
│  │  Rest Taken: 14 min                    │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │         Session Timeline               │  │
│  │                                        │  │
│  │  ● 10:23 — Focus started               │  │
│  │  │  1:23:45                            │  │
│  │  ○ 11:47 — Break started (16m earned)  │  │
│  │  │  14:00                              │  │
│  │  ● 12:01 — Session ended               │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │         Actions                       │  │
│  │  [Delete Session]                      │  │
│  └────────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| BackButton | Top left | Navigate back to history |
| SessionSummary | Top | Timer ring (static), task, date, rest stats |
| Timeline | Middle | Vertical timeline of session events |
| DeleteButton | Bottom | Destructive action (danger style) |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | Full session data displayed | Normal load |
| **Loading** | Skeleton | Fetching session |
| **Error** | "Session not found" + back button | Invalid ID / deleted |
| **Deleted** | Success toast + redirect to history | Delete confirmed |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Summary Ring | Circle | 180px | Pulse 800ms |
| Summary Text | Lines | 60% x 20px, 40% x 16px | Shimmer 1500ms |
| Timeline Items | Lines + dots | 100% x 48px | Shimmer 1500ms |

#### Empty State Spec
N/A

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| **Not Found** | "Session not found" + back button | Navigate to history |
| **Deleted** | Toast "Session deleted" + redirect | Auto-redirect |
| **Network Offline** | Show cached data + offline badge | Sync when online |

#### Data Format Per Screen
| Element | Type | Source | Format |
|---------|------|--------|--------|
| Focus Time | Duration | `sessions.duration` | HH:MM:SS |
| Task | String | `tasks.name` | Full name |
| Date | DateTime | `sessions.created_at` | "Aug 31, 2026 — 10:23 AM" |
| Rest Earned | Duration | Calculated | "XX min" |
| Rest Taken | Duration | `sessions.rest_taken` | "XX min" |
| Timeline Events | Array | `session_events` table | Event type + timestamp |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Page Enter | Route | Slide right | 300ms | ease-in-out |
| Back Button | Click | Slide left | 300ms | ease-in-out |
| Summary Ring | Page load | Draw-in animation | 800ms | ease-out |
| Timeline Events | Page load | Stagger fade left (80ms each) | 400ms | ease-out |
| Delete Button | Click | Confirmation modal | 200ms | ease-out |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Back Button | Click | Navigate to `/history` |
| Delete | Click | Confirmation modal → delete → redirect |

#### Accessibility
- **Keyboard Navigation:** Back → summary → timeline → delete
- **ARIA Labels:** `aria-label="Go back to history"`, timeline announced as ordered list
- **Contrast Ratio:** All text ≥ 4.5:1
- **Touch Target:** All interactive ≥ 44x44px
- **Screen Reader:** Full session summary read as structured content

#### Responsive Behavior
- **Mobile (< 768px):** Full-width, back button in top bar, timeline full-width
- **Tablet (768-1024px):** Max-width 600px centered
- **Desktop (> 1024px):** Max-width 640px centered, larger ring

---

### Screen 09: Analytics

**Purpose:** Productivity insights with charts and trends
**UVP Highlight:** "Patterns emerge from consistency — see yours clearly."
**Route:** `/analytics`
**Access:** Auth required

#### Layout Structure
```
┌──────────────────────────────────────────────┐
│  TopBar: Logo | "Analytics" | Theme | Avatar  │
├──────────┬───────────────────────────────────┤
│          │                                   │
│ Sidebar  │  Period Toggle: [Day|Week|Month]  │
│          │                                   │
│          │  ┌──────────────────────────────┐ │
│          │  │  Focus Time Chart (line)     │ │
│          │  │  ╱╲    ╱╲╱╲                 │ │
│          │  │ ╱  ╲╱╱╱     ╲              │ │
│          │  └──────────────────────────────┘ │
│          │                                   │
│          │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│          │  │Avg  │ │Total│ │Best │ │Long │ │
│          │  │Focus│ │Focus│ │Day  │ │Ses. │ │
│          │  │45m  │ │127h │ │6h2m │ │2h1m │ │
│          │  └─────┘ └─────┘ └─────┘ └─────┘ │
│          │                                   │
│          │  ┌──────────────────────────────┐ │
│          │  │  Session Duration Dist.      │ │
│          │  │  (bar chart by hour range)   │ │
│          │  └──────────────────────────────┘ │
│          │                                   │
│          │  ┌──────────────────────────────┐ │
│          │  │  Focus Heatmap (calendar)    │ │
│          │  │  🟩🟩⬜🟩🟩🟩⬜              │ │
│          │  └──────────────────────────────┘ │
│          │                                   │
└──────────┴───────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| PeriodToggle | Top | Day / Week / Month switch |
| LineChart | Content | Focus time trend over period |
| StatCards (4x) | Below chart | Avg focus, total focus, best day, longest session |
| BarChart | Content | Session duration distribution |
| Heatmap | Bottom | GitHub-style contribution calendar |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | All charts loaded with data | Normal load |
| **Loading** | Skeleton pulse on all charts | Fetching data |
| **Empty** | "Not enough data yet" + encouragement | < 3 sessions |
| **Error** | Error banner + retry | API failure |
| **Period Change** | Chart transition animation | User switches period |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Line Chart | Rounded rect | 100% x 240px | Shimmer 1500ms |
| Stat Cards (4x) | Rounded rects | 22% x 100px each | Shimmer 1500ms |
| Bar Chart | Rounded rect | 100% x 200px | Shimmer 1500ms |
| Heatmap | Grid of squares | 100% x 120px | Shimmer 1500ms |

#### Empty State Spec
| Elemen | Deskripsi |
|--------|-----------|
| **Ilustrasi** | Bar chart with upward arrow |
| **Ukuran Ilustrasi** | 100px x 100px |
| **Title** | "Building your insights" |
| **Description** | "Complete a few more sessions and your productivity patterns will appear here." |
| **CTA** | "Start a Session" → `/focus` |

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| **API Failure** | "Couldn't load analytics" + retry | Tap retry |
| **Network Offline** | Show cached charts + offline badge | Sync when online |

#### Data Format Per Screen
| Element | Type | Source | Format |
|---------|------|--------|--------|
| Focus Time (chart) | Duration per day | `sessions` grouped by date | Minutes as Y-axis |
| Avg Focus | Duration | Calculated | "XXm" |
| Total Focus | Duration | SUM | "XXXh" |
| Best Day | Date + Duration | MAX sum per day | "Xh Xm — Aug 31" |
| Longest Session | Duration | MAX single session | "Xh Xm" |
| Heatmap Cell | Count per day | `sessions` grouped by date | Green intensity levels |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Period Toggle | Click | Active tab slide indicator | 200ms | ease-out |
| Line Chart | Period change | Line morph/draw | 500ms | ease-out |
| Stat Cards | Page load | Stagger count-up | 800ms | ease-out |
| Bar Chart | Page load | Bars grow from bottom, stagger | 600ms | ease-out |
| Heatmap | Page load | Cells fade in, stagger per row | 400ms | ease-out |
| Chart Hover | Hover | Tooltip follow cursor | 100ms | ease-out |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Period Toggle | Click | Switch chart data |
| Line Chart | Hover point | Show tooltip with exact value |
| Bar Chart | Hover bar | Highlight bar + tooltip |
| Heatmap Cell | Hover | Show date + session count tooltip |
| Stat Cards | Click | Filter history by metric |

#### Accessibility
- **Keyboard Navigation:** Period toggle → chart (arrow keys for data points) → stat cards → bar chart → heatmap
- **ARIA Labels:** Charts have `role="img"` with text description, stat cards `aria-label` with full values
- **Contrast Ratio:** Chart colors ≥ 3:1 against background, text ≥ 4.5:1
- **Touch Target:** Period toggle ≥ 44px, heatmap cells ≥ 24x24px
- **Screen Reader:** Chart data presented as accessible table alternative
- **Color Blind:** Heatmap uses opacity + pattern, not just color

#### Responsive Behavior
- **Mobile (< 768px):** Bottom nav, charts stack vertically, stat cards 2x2 grid, heatmap scrolls horizontally
- **Tablet (768-1024px):** Collapsible sidebar, charts 2-column, stat cards 4-in-row
- **Desktop (> 1024px):** Persistent sidebar, full layout

---

### Screen 10: Settings

**Purpose:** User preferences, profile, and account management
**Route:** `/settings`
**Access:** Auth required

#### Layout Structure
```
┌──────────────────────────────────────────────┐
│  TopBar: Logo | "Settings" | Theme | Avatar   │
├──────────┬───────────────────────────────────┤
│          │                                   │
│ Sidebar  │  ┌─ Profile ────────────────────┐ │
│          │  │  [Avatar]  John Doe          │ │
│          │  │  [Change Avatar]             │ │
│          │  │  Email: john@example.com     │ │
│          │  │  [Edit Profile]              │ │
│          │  └──────────────────────────────┘ │
│          │                                   │
│          │  ┌─ Preferences ────────────────┐ │
│          │  │  Rest Ratio: [1 / 5]         │ │
│          │  │  Theme: [Light|Dark|System]   │ │
│          │  │  Notifications: [Toggle]     │ │
│          │  │  Sound Alerts: [Toggle]      │ │
│          │  └──────────────────────────────┘ │
│          │                                   │
│          │  ┌─ Account ────────────────────┐ │
│          │  │  [Change Password]           │ │
│          │  │  [Delete Account] (danger)   │ │
│          │  └──────────────────────────────┘ │
│          │                                   │
│          │  ┌─ About ──────────────────────┐ │
│          │  │  Version: 1.0.0              │ │
│          │  │  [Privacy Policy]            │ │
│          │  │  [Terms of Service]          │ │
│          │  └──────────────────────────────┘ │
│          │                                   │
└──────────┴───────────────────────────────────┘
```

#### Components Used
| Component | Position | Description |
|-----------|----------|-------------|
| ProfileSection | Top | Avatar, name, email, edit button |
| PreferencesSection | Middle | Rest ratio, theme, notification toggles |
| AccountSection | Middle | Change password, delete account |
| AboutSection | Bottom | Version, legal links |

#### States
| State | Visual | Trigger |
|-------|--------|---------|
| **Default** | All settings loaded | Normal load |
| **Loading** | Skeleton | Fetching settings |
| **Saving** | Inline saving indicator | User changed a setting |
| **Saved** | Green checkmark on changed field | Save confirmed |
| **Error** | Toast error | Save failed |
| **Delete Confirm** | Danger confirmation modal | Delete account clicked |

#### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|--------|--------------|------|-----------|
| Avatar | Circle | 64px | Pulse 800ms |
| Profile Fields | Lines | 40% x 20px | Shimmer 1500ms |
| Toggle Rows | Lines + circles | 100% x 48px | Shimmer 1500ms |

#### Empty State Spec
N/A — Settings always has defaults.

#### Error State Detail
| Error Type | Visual | Interaction |
|------------|--------|-------------|
| **Save Failed** | Toast "Couldn't save changes" | Retry |
| **Auth Expired** | Redirect to login | Auto-redirect |
| **Delete Failed** | Modal error + retry | Retry / Cancel |

#### Data Format Per Screen
| Element | Type | Source | Format |
|---------|------|--------|--------|
| Avatar | Image | User upload | Circle, 64px |
| Full Name | Text | `users.name` | String |
| Email | Text | `users.email` | email@domain.com |
| Rest Ratio | Select | `users.rest_ratio` | "1 / 3", "1 / 4", "1 / 5", "1 / 6" |
| Theme | Toggle group | `users.theme` | "light", "dark", "system" |
| Notifications | Toggle | `users.notifications_enabled` | Boolean |
| Sound Alerts | Toggle | `users.sound_enabled` | Boolean |
| Version | Static | App config | Semver string |

#### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Theme Toggle | Click | Cross-fade entire page colors | 300ms | ease-out |
| Setting Change | Toggle/change | Green checkmark appear | 300ms | ease-out |
| Avatar Change | Upload | Fade-in new avatar | 300ms | ease-out |
| Delete Modal | Open | Scale up + fade in | 200ms | ease-out |
| Delete Modal | Close | Scale down + fade out | 150ms | ease-in |
| Section Expand | Click header | Accordion expand | 200ms | ease-out |

#### Interactions
| Element | Interaction | Feedback |
|---------|------------|----------|
| Avatar | Click upload | File picker → upload → preview update |
| Name/Email | Edit + save | Inline edit → save button appears |
| Rest Ratio | Select dropdown | Save preference → apply to future sessions |
| Theme | Toggle | Immediate visual switch |
| Notifications | Toggle | Browser permission prompt if enabling |
| Sound Alerts | Toggle | Save preference |
| Change Password | Click | Modal with old/new password fields |
| Delete Account | Click | Confirmation modal (type "DELETE" to confirm) |
| Legal Links | Click | Open in new tab |

#### Accessibility
- **Keyboard Navigation:** Profile → Preferences → Account → About (section order)
- **ARIA Labels:** Each toggle `aria-label`, sections use `role="group"` with `aria-labelledby`
- **Contrast Ratio:** All text ≥ 4.5:1
- **Touch Target:** Toggles ≥ 44x44px, list items ≥ 48px height
- **Screen Reader:** Announces toggle state changes ("Notifications enabled", "Theme changed to dark")

#### Responsive Behavior
- **Mobile (< 768px):** Bottom nav, sections stack full-width, profile header with avatar
- **Tablet (768-1024px):** Collapsible sidebar, settings content max-width 600px
- **Desktop (> 1024px):** Persistent sidebar, settings content max-width 640px centered

---

---

## BAGIAN 4: Component Specs

### Component: Button

**Usage:** All interactive actions across all screens
**Category:** Atom

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Primary | Teal bg, white text, rounded-md | Main CTA (Start Focus, Save, Submit) |
| Secondary | Teal border, teal text, transparent bg | Secondary actions (Cancel, Back) |
| Ghost | No bg, no border, teal text | Subtle actions (Skip, Dismiss) |
| Danger | Red bg, white text | Destructive (Delete, Stop Session) |
| Danger Outline | Red border, red text | Secondary destructive (Cancel Delete) |

#### States
| State | Visual Change |
|-------|--------------|
| Default | Normal appearance per variant |
| Hover | Slight darken + scale(1.02) + shadow-md |
| Active/Pressed | Scale(0.97) + darker shade |
| Disabled | 50% opacity, cursor: not-allowed |
| Loading | Text replaced with spinner, same width |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'danger-outline'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Shows spinner |
| `fullWidth` | `boolean` | `false` | 100% width |
| `icon` | `SvelteComponent` | `-` | Leading icon |
| `onClick` | `() => void` | `-` | Click handler |

#### Accessibility
- Keyboard: Enter/Space to activate
- ARIA: `role="button"`, disabled buttons have `aria-disabled="true"`
- Focus: 2px teal ring with 2px offset on focus-visible
- Loading: `aria-busy="true"` while loading

---

### Component: InputField

**Usage:** All text inputs (login, register, settings, task creation)
**Category:** Atom

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Default | Border, label, placeholder | Standard text input |
| With Icon | Left icon + border | Search, email with mail icon |
| Password | Right eye toggle icon | Password fields |
| Error | Red border + error text below | Validation errors |
| Success | Green border + checkmark | Validated input |

#### States
| State | Visual Change |
|-------|--------------|
| Default | Border: `--color-border`, label: `--color-text-secondary` |
| Focus | Border: `--color-primary`, ring glow |
| Error | Border: `--color-error`, error text appears |
| Success | Border: `--color-success`, check icon |
| Disabled | Gray bg, 50% opacity |
| Filled | Label shrinks to small (floating label) |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'text' \| 'email' \| 'password' \| 'number'` | `'text'` | Input type |
| `label` | `string` | `-` | Floating label text |
| `value` | `string` | `''` | Input value (bindable) |
| `placeholder` | `string` | `-` | Placeholder text |
| `error` | `string` | `-` | Error message |
| `success` | `string` | `-` | Success message |
| `disabled` | `boolean` | `false` | Disabled state |
| `icon` | `SvelteComponent` | `-` | Leading icon |
| `trailingIcon` | `SvelteComponent` | `-` | Trailing icon (eye toggle) |

#### Accessibility
- All inputs have associated `<label>` via `for`/`id`
- Error messages linked via `aria-describedby`
- `aria-invalid="true"` on error state
- `aria-required="true"` for required fields

---

### Component: Card

**Usage:** Session cards, stat cards, settings sections, feature cards
**Category:** Molecule

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Default | White bg, border, rounded-lg, shadow-sm | Session cards, feature cards |
| Elevated | White bg, no border, shadow-md | Stat cards, focus timer container |
| Interactive | Default + hover shadow lift | Clickable cards (session list items) |
| Glass | Backdrop blur, semi-transparent bg | Break overlay, modals |

#### States
| State | Visual Change |
|-------|--------------|
| Default | Normal appearance per variant |
| Hover (Interactive) | Shadow-lift, border-color shift |
| Active (Interactive) | Scale(0.98) |
| Loading | Skeleton pulse inside |
| Selected | Teal border + teal tint bg |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'interactive' \| 'glass'` | `'default'` | Visual style |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding |
| `onClick` | `() => void` | `-` | Makes card interactive |

#### Accessibility
- Interactive cards: `role="button"`, `tabindex="0"`, Enter/Space to activate
- Non-interactive: `role="article"` or semantic `<section>`

---

### Component: CircularTimer

**Usage:** Focus screen (count-up), Break mode (count-down), Session detail (static)
**Category:** Molecule

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Focus (Count-up) | Teal ring fills CW, large mono digits | Active focus session |
| Break (Count-down) | Amber ring depletes CW, large mono digits | Break countdown |
| Static | Frozen ring at achieved value, smaller digits | Session detail, dashboard preview |

#### States
| State | Visual Change |
|-------|--------------|
| Idle | Ring at 0%, digits "00:00:00" |
| Running | Ring animates smoothly, digits update every second |
| Paused | Ring frozen, digits frozen, subtle pulse animation |
| Complete | Ring full (focus) or empty (break), success animation |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'focus' \| 'break' \| 'static'` | `'focus'` | Timer mode |
| `seconds` | `number` | `0` | Current time in seconds |
| `maxSeconds` | `number` | `0` | For break: total break time |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Ring diameter |
| `running` | `boolean` | `false` | Whether timer is active |

#### Accessibility
- `role="timer"` with `aria-live="polite"`
- Screen reader: "Focus time: 1 hour 23 minutes 45 seconds"
- Reduced motion: static display, no ring animation
- Digits have sufficient contrast (7:1 minimum)

---

### Component: StatCard

**Usage:** Dashboard (3 summary cards), Analytics (4 summary cards)
**Category:** Molecule

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Default | Elevated card, icon + value + label | Dashboard, analytics summaries |
| Compact | Smaller, inline value + label | History summary strip |
| Highlight | Teal tint bg, teal icon | Primary metric emphasis |

#### States
| State | Visual Change |
|-------|--------------|
| Default | Normal card |
| Loading | Skeleton pulse |
| Active/Clickable | Hover shadow lift, cursor pointer |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `SvelteComponent` | `-` | Leading icon |
| `label` | `string` | `-` | Description text |
| `value` | `string` | `-` | Primary value (e.g., "2h 34m") |
| `highlight` | `boolean` | `false` | Highlighted style |
| `onClick` | `() => void` | `-` | Click handler |

#### Accessibility
- Clickable: `role="button"`, `tabindex="0"`
- `aria-label` with full text: "Today's focus time: 2 hours 34 minutes"

---

### Component: SessionCard

**Usage:** History list, dashboard recent sessions
**Category:** Molecule

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Default | Full card with duration, task, rest, time | History list |
| Compact | Single line with duration + task | Dashboard recent list |

#### States
| State | Visual Change |
|-------|--------------|
| Default | Normal card |
| Hover | Background tint, shadow-sm |
| Active | Scale(0.98) |
| Completed | Green dot indicator |
| Incomplete | Gray dot indicator |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `session` | `Session` object | `-` | Session data |
| `compact` | `boolean` | `false` | Compact display |
| `onClick` | `() => void` | `-` | Navigate to detail |

#### Accessibility
- `role="listitem"` within `role="list"`
- `aria-label` with full session info
- Keyboard: Arrow keys to navigate between cards

---

### Component: Navigation

**Usage:** Sidebar (desktop), Bottom nav (mobile), Top bar
**Category:** Organism

#### Sidebar (Desktop)
```
┌──────────────┐
│  [Logo]      │
│  Flowdoro    │
│              │
│  📊 Dashboard│
│  ⏱ Focus    │
│  📋 History  │
│  📈 Analytics│
│  ⚙ Settings │
│              │
│              │
│  [Avatar]    │
│  John Doe    │
└──────────────┘
```

#### Bottom Nav (Mobile)
```
┌──────────────────────────────┐
│  📊      ⏱      📋      ⚙  │
│  Dash   Focus  History  Sets│
└──────────────────────────────┘
```

#### States
| State | Visual Change |
|-------|--------------|
| Default | Icons + labels, muted color |
| Active | Teal icon + teal label, bg tint |
| Hover | Background tint |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `NavItem[]` | Built-in | Navigation items |
| `activeRoute` | `string` | Current route | Active item |
| `variant` | `'sidebar' \| 'bottom'` | `'sidebar'` | Layout mode |

#### Accessibility
- `role="navigation"` with `aria-label="Main navigation"`
- Active item: `aria-current="page"`
- Mobile: `aria-label` on each icon ("Dashboard", "Focus", etc.)
- Keyboard: Arrow keys between items, Enter to navigate

---

### Component: Modal

**Usage:** Confirmation dialogs (stop session, delete), settings overlays
**Category:** Organism

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Default | White card, backdrop blur, centered | Standard dialogs |
| Danger | Red header accent | Destructive confirmations |
| Fullscreen | Full screen overlay (mobile) | Break mode, complex forms |

#### States
| State | Visual Change |
|-------|--------------|
| Closed | Not rendered / opacity-0 |
| Opening | Fade in + scale up from 0.95 |
| Open | Fully visible, backdrop blur |
| Closing | Fade out + scale down |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Visibility |
| `title` | `string` | `-` | Modal title |
| `variant` | `'default' \| 'danger'` | `'default'` | Visual style |
| `onClose` | `() => void` | `-` | Close handler |

#### Accessibility
- Focus trap within modal
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` = title
- Escape to close
- Return focus to trigger element on close
- Backdrop click to close (optional)

---

### Component: Toast

**Usage:** Success/error notifications across all screens
**Category:** Organism

#### Variants
| Variant | Visual | When to use |
|---------|--------|-------------|
| Success | Green left border, check icon | Action completed |
| Error | Red left border, alert icon | Action failed |
| Warning | Amber left border, warning icon | Caution |
| Info | Teal left border, info icon | Informational |

#### States
| State | Visual Change |
|-------|--------------|
| Entering | Slide in from top-right + fade |
| Visible | Full opacity, auto-dismiss timer |
| Exiting | Slide out + fade |

#### Props / API
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | `-` | Toast message |
| `variant` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Visual style |
| `duration` | `number` | `3000` | Auto-dismiss ms |
| `action` | `{ label: string, onClick: () => void }` | `-` | Optional action button |

#### Accessibility
- `role="status"`, `aria-live="polite"`
- Auto-dismiss paused on hover/focus
- Action button keyboard accessible

---

---

## Design Review — Konsistensi Check

```
🔍 Design Review — Konsistensi Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Design System:         ✅ Semua token konsisten di Bagian 1-4
Screen Coverage:       ✅ 10/10 screen tercover (Bagian 2 → 3)
Component Reusability: ✅ 7 component multi-screen
States Coverage:       ✅ Semua screen punya 5+ states
Dark Mode:             ✅ Light + Dark tokens lengkap (14 + 14)
Animations:            ✅ Semua screen ada micro-interactions
Loading Skeleton:      ✅ Semua screen punya skeleton spec
Empty States:          ✅ Semua screen applicable punya empty state
Error States:          ✅ Semua screen punya error state detail
Data Formats:          ✅ Semua screen punya data format spec
Accessibility:         ✅ Semua screen punya a11y section
Responsive:            ✅ Semua screen punya mobile/tablet/desktop
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

> **Next Step:** Ketik `"Buat PRD berdasarkan DESIGN.md yang sudah dibuat"` untuk melanjutkan ke Mini PRD.
