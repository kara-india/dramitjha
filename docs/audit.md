# Comprehensive Codebase & UX Audit: KrishnaHealth / Dr. Amit Jha Sports Medicine

**Audit Date:** July 27, 2026  
**Target Codebase:** KrishnaHealth ERP / Dr. Amit Jha Sports Injury & Orthopedic Clinic  
**Framework:** Next.js 16.2.11 (App Router), React 19.2.4, Supabase SSR, Prisma 7.9, Tailwind CSS v4 / Extended v3 config.

---

## 1. Component Inventory

### `src/app/` File Inventory

| File Path | Description | Scope |
| :--- | :--- | :--- |
| `src/app/layout.tsx` | Root application layout wrapping the app with `ThemeProvider`, `QueryProvider`, and Sonner `Toaster`. | Global |
| `src/app/page.tsx` | Public landing page monolith for Dr. Amit Jha Clinic (Hero, Body Navigator, Sports Treated, Services, Doctor Bio, Booking Wizard). **51 KB, 1016 lines, full `"use client"`.** | Public (`/`) |
| `src/app/globals.css` | Global CSS file with `@import "tailwindcss"`, custom color/font CSS variables, and public page utility classes. | Global |
| `src/app/favicon.ico` | Application browser favicon icon. | Global |
| `src/app/(auth)/layout.tsx` | Layout wrapper for auth routes; redirects authenticated users to `/dashboard`. | Auth / Public |
| `src/app/(auth)/login/page.tsx` | Split-screen branding and login page shell for clinic staff. | Public / Auth (`/login`) |
| `src/app/(auth)/login/login-form.tsx` | Interactive client login form using React Hook Form, Zod, Framer Motion, and Server Action invocation. | Public / Auth |
| `src/app/(auth)/login/actions.ts` | Server Actions (`loginAction`, `logoutAction`, `getCurrentUser`) using Supabase Auth with dev fallback auto-signup. | Server / Auth |
| `src/app/auth/callback/route.ts` | Route Handler for exchanging Supabase OAuth/Magic Link auth code for a session token. | Auth API (`/auth/callback`) |
| `src/app/(dashboard)/layout.tsx` | Server Component layout for dashboard: authenticates session, fetches user role, renders `DashboardLayout`. | Dashboard-Only |
| `src/app/(dashboard)/dashboard/page.tsx` | General entry overview page for authenticated staff. | Dashboard-Only (`/dashboard`) |
| `src/app/(dashboard)/admin/page.tsx` | System Administration module entry. | Dashboard-Only (`/admin`) |
| `src/app/(dashboard)/admin/admin-client.tsx` | Interactive client dashboard for users, RBAC, settings, audit logs. | Dashboard-Only |
| `src/app/(dashboard)/accounts/page.tsx` | Accounts and financial management dashboard. | Dashboard-Only (`/accounts`) |
| `src/app/(dashboard)/appointments/page.tsx` | Master appointment schedule and queue page. | Dashboard-Only (`/appointments`) |
| `src/app/(dashboard)/appointments/actions.ts` | Server Actions for appointment CRUD and status transitions. | Server / Dashboard |
| `src/app/(dashboard)/appointments/new/page.tsx` | Appointment scheduling wizard. | Dashboard-Only (`/appointments/new`) |
| `src/app/(dashboard)/appointments/[id]/page.tsx` | Single appointment detail view. | Dashboard-Only |
| `src/app/(dashboard)/appointments/components/appointment-queue.tsx` | Interactive queue component with status filtering. | Dashboard-Only |
| `src/app/(dashboard)/appointments/components/time-slot-picker.tsx` | Grid picker for morning/evening OPD slots. | Dashboard-Only |
| `src/app/(dashboard)/billing/actions.ts` | Server Actions for invoices, payments, refunds. | Server / Dashboard |
| `src/app/(dashboard)/consultations/actions.ts` | Server Actions for clinical consultation records, vitals, EMR. | Server / Dashboard |
| `src/app/(dashboard)/consultations/[id]/page.tsx` | Doctor clinical consultation workstation (EMR, prescriptions, sign-off). | Dashboard-Only |
| `src/app/(dashboard)/doctor/page.tsx` | Doctor OPD workspace: live patient queue and quick EMR actions. | Dashboard-Only (`/doctor`) |
| `src/app/(dashboard)/inventory/actions.ts` | Server Actions for medicine inventory and stock management. | Server / Dashboard |
| `src/app/(dashboard)/ot/page.tsx` | Operation Theatre surgical master schedule. | Dashboard-Only (`/ot`) |
| `src/app/(dashboard)/ot/actions.ts` | Server Actions for OT suite booking, team assignment, status updates. | Server / Dashboard |
| `src/app/(dashboard)/ot/new/page.tsx` | New surgical procedure scheduling form. | Dashboard-Only |
| `src/app/(dashboard)/ot/[id]/page.tsx` | Surgical case record with operative notes and post-op orders. | Dashboard-Only |
| `src/app/(dashboard)/patients/page.tsx` | Master patient directory data table. | Dashboard-Only (`/patients`) |
| `src/app/(dashboard)/patients/actions.ts` | Server Actions for patient CRUD. | Server / Dashboard |
| `src/app/(dashboard)/patients/queries.ts` | React Query hooks for paginated patient data. | Dashboard-Only |
| `src/app/(dashboard)/patients/schema.ts` | Zod validation schemas for patient forms. | Global / Shared |
| `src/app/(dashboard)/patients/new/page.tsx` | Patient intake registration form. | Dashboard-Only |
| `src/app/(dashboard)/patients/[id]/page.tsx` | Comprehensive Patient EMR Chart. | Dashboard-Only |
| `src/app/(dashboard)/patients/[id]/edit/page.tsx` | Edit patient demographics. | Dashboard-Only |
| `src/app/(dashboard)/pharmacy/page.tsx` | Pharmacy dispensing portal and inventory. | Dashboard-Only (`/pharmacy`) |
| `src/app/(dashboard)/physio/page.tsx` | Physiotherapy OPD dashboard with 30-min slots and 5-Phase ACL tracker. | Dashboard-Only (`/physio`) |
| `src/app/(dashboard)/reception/page.tsx` | Front-desk portal: triage, walk-in token, queue, fee collection. | Dashboard-Only (`/reception`) |

### Components Used on Public Landing Page `/`
- `Button`, `Badge`, `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `Input`, `Label`, `Textarea`
- **All major sections are inline inside `page.tsx` — no modular component abstraction.**

### Dashboard-Only Components (Behind Auth)
- `DashboardLayout`, `Sidebar`, `Topbar`
- `AppointmentQueue`, `TimeSlotPicker`, `AdminClient`
- `DataTable`, `PageHeader`, `StatCard`, `EmptyState`, `LoadingScreen`
- 27 shadcn/ui primitives

---

## 2. Design Tokens & CSS Structure

### `globals.css` CSS Custom Properties (`:root`)
```css
:root {
  --font-inter: Arial, sans-serif;      /* Body font — no actual Google Font loaded */
  --font-outfit: Arial, sans-serif;     /* Heading font — no actual Google Font loaded */
  --ink: #102321;       /* Deep dark forest teal (BG + dark text) */
  --paper: #f5f5ef;     /* Off-white / cream paper background */
  --lime: #d5f14c;      /* Electric high-visibility lime accent */
  --muted: #66706d;     /* Muted slate gray-teal for body text */
  --orange: #fb6843;    /* Vibrant coral/orange secondary accent */
}
```
- **Dark mode tokens: NONE defined.** `globals.css` has no `.dark` overrides.
- `body` background: `var(--paper)` (#f5f5ef), color: `var(--ink)` (#102321).
- Headings use `var(--font-outfit)`, `em` fallback to `Georgia, serif`.

### Custom CSS Layout Classes in `globals.css`
`.site-shell`, `.utility-bar`, `.site-header`, `.hero`, `.confidence-strip`, `.body-grid`, `.feature-section`, `.process-section`, `.story-section`, `.appointment-section`, `.site-footer`

### ⚠️ CRITICAL: CSS Token Disconnect
`tailwind.config.ts` relies on HSL CSS variables for shadcn/ui components (`--background`, `--foreground`, `--primary`, `--border`, `--card`, `--radius`, etc.) but **these variables are NOT defined in `globals.css`**. Only `--ink`, `--paper`, `--lime`, `--muted`, `--orange` are defined. shadcn components relying on `bg-background` or `text-foreground` default to unstyled fallbacks.

### `tailwind.config.ts` Extended Theme

**Colors:**
```
teal: { 50..950 } — primary brand palette, teal-600 (#0d9488) is primary
status: { scheduled: #2563eb, checked-in: #7c3aed, in-consultation: #0d9488, completed: #16a34a, cancelled: #dc2626 }
shadcn semantic: border, input, ring, background, foreground, primary, secondary, destructive, muted, accent, popover, card, sidebar (all HSL var-based)
```

**Typography:**
```
sans: var(--font-inter), heading: var(--font-outfit), mono: var(--font-mono)
```

**Border Radius:** `var(--radius)` (not defined in globals.css)

**Shadows:**
```
card, card-hover, glow (teal 0.15 alpha), glow-strong (teal 0.3 alpha)
```

**Animations:** `accordion-down/up`, `slide-in-left/right`, `fade-in`, `scale-in`, `shimmer`, `pulse-ring`, `count-up`

**Current visual feel:** Dark slate/teal BG (`bg-slate-950`, `bg-slate-900`) with emerald-teal gradient accents and electric lime/orange punctuation.

---

## 3. Routing Map

| Route | Type | Description |
| :--- | :--- | :--- |
| `/` | **Public** | Full public sports medicine marketing + booking wizard |
| `/login` | **Public / Auth** | Staff ERP login; redirects to `/dashboard` if authenticated |
| `/auth/callback` | **Public API** | OAuth/Magic Link session exchange |
| `/dashboard` | **Auth Protected** | Main dashboard entry |
| `/admin` | **Auth Protected** | System Administration & RBAC |
| `/accounts` | **Auth Protected** | Financial accounts and billing |
| `/appointments` | **Auth Protected** | Appointment schedule and queue |
| `/appointments/new` | **Auth Protected** | New appointment wizard |
| `/appointments/[id]` | **Auth Protected** | Appointment detail |
| `/consultations/[id]` | **Auth Protected** | Clinical EMR workstation |
| `/doctor` | **Auth Protected** | Doctor OPD workspace |
| `/ot` | **Auth Protected** | OT surgical schedule |
| `/ot/new` | **Auth Protected** | New OT booking |
| `/ot/[id]` | **Auth Protected** | Surgical case record |
| `/patients` | **Auth Protected** | Patient directory |
| `/patients/new` | **Auth Protected** | Patient registration |
| `/patients/[id]` | **Auth Protected** | Patient EMR chart |
| `/patients/[id]/edit` | **Auth Protected** | Edit patient record |
| `/pharmacy` | **Auth Protected** | Pharmacy dispensing |
| `/physio` | **Auth Protected** | Physiotherapy OPD |
| `/reception` | **Auth Protected** | Front-desk reception |

---

## 4. State Management & Data Flow

### Auth / Session
- **Supabase SSR** via `@supabase/ssr` (`createServerClient`)
- **`src/proxy.ts`** calls `updateSession(request)` on every request → redirects `/dashboard*` → `/login` if unauthenticated; `/login` → `/dashboard` if authenticated
- **Dashboard layout** validates session server-side, extracts `role`, `name`, `avatar`, passes to `DashboardLayout`
- **RBAC:** 6 roles in `src/lib/auth/rbac.ts` with permission matrices

### State Libraries
- **Zustand `v5`:** Installed but **not used** (no store files found)
- **React Query `v5`:** Global provider in `src/components/providers/query-provider.tsx` (staleTime: 1min, gcTime: 10min); used in `patients/queries.ts`

### Server Actions
`login/actions.ts`, `appointments/actions.ts`, `billing/actions.ts`, `consultations/actions.ts`, `inventory/actions.ts`, `ot/actions.ts`, `patients/actions.ts`

### Public Page (`/`) Data
- **Zero API calls or database queries** on the public page
- All data is hardcoded arrays: `BODY_PARTS`, `SPORTS_WE_TREAT`, `SERVICES`, `RECOVERY_STAGES`, `TESTIMONIALS`, `TIME_SLOTS`
- Booking form submit → **local state only** (`setIsBooked(true)`), does not POST to any endpoint

---

## 5. Current Assets

| Filename | Size | Description |
| :--- | :--- | :--- |
| `public/dr-amit-jha-cutout.png` | ~345 KB | Transparent cutout portrait — used in Hero & Doctor Bio |
| `public/dr-amit-jha-hero.png` | ~350 KB | Full banner hero photo |
| `public/file.svg` | 391 B | Default Next.js icon |
| `public/globe.svg` | 1,035 B | Default Next.js icon |
| `public/next.svg` | 1,375 B | Next.js logo |
| `public/vercel.svg` | 128 B | Vercel logo |
| `public/window.svg` | 385 B | Default Next.js icon |

### ⚠️ Image Optimization Issues
- `page.tsx` uses plain `<img>` tags — **no `next/image`** on the public page
- Both PNG photos are 345–350 KB, no WebP/AVIF conversion, no responsive `srcset`
- No lazy loading below the fold
- Impact: High LCP, potential CLS on mobile

---

## 6. Design Principles (Premium Sports-Medicine / Ortho Sites)

1. **Viewport Action Architecture** — High-intent visitors need CTAs immediately. Sticky primary CTA above fold; persistent mobile bottom action bar. (HSS, Steadman)
2. **Interactive Anatomical Navigation** — Patients search by joint/sport, not clinical jargon. Clickable body maps (Knee, Shoulder, Ankle, Hip) and sport-specific protocols. (Rothman, Elite Sports)
3. **Verified Medical Authority Trust Anchors** — Surgical fellowship badges, volume stats (5,000+ surgeries, 98.5% return-to-sport), patient ratings visible immediately below the hero. (HSS, Steadman)
4. **Transparent Care Continuum** — 6-stage illustrated journey demystifies the process (Assessment → Imaging → Keyhole → Physio → Clearance). Reduces fear, increases conversion. (All)
5. **Dual-Spectrum Patient Segmentation** — Clear visual paths: Athletes (peak performance / arthroscopy) vs. General patients (joint preservation / HTO / OATS). (Rothman, Elite)
6. **Empathetic Color Psychology** — Deep forest teal for clinical calm and trust; electric lime/orange for athletic energy and action highlights. Avoid sterile white-only palettes. (Steadman)
7. **Social Proof at Scroll Depth** — Testimonials from real patients with outcome metrics (time to return to sport, pain scores) placed mid-page to overcome hesitation. (All)
8. **Credential-Forward Typography** — Fellowship credentials, institution names (Ganga Hospital, HSS-trained) in a prominent but understated typographic hierarchy — not buried in body copy. (HSS, Steadman)

---

## 7. Baseline Metrics & Known Issues

| Issue | Severity | Impact |
| :--- | :--- | :--- |
| Entire `page.tsx` marked `"use client"` (1016 lines) | High | No SSR streaming; full JS bundle shipped to browser |
| Plain `<img>` tags for 345–350KB PNGs | High | LCP degraded, no compression, no srcset, no lazy load |
| 35+ Lucide icon imports in one file | Medium | Bundle bloat |
| HSL CSS vars missing from `globals.css` | High | shadcn components unstyled / fallback colors |
| Google Fonts not loaded (vars fallback to Arial) | Medium | Typography quality degraded |
| Booking form is local state only | Low | No functional regression risk for UI redesign |
| No dark mode CSS tokens | Low | Theme-provider exists but globals don't support it |
| CSS layout in custom classes, not Tailwind | Medium | Harder to maintain consistently |

**Current color scheme:** Dark slate/teal backgrounds (`bg-slate-950`, `bg-slate-900`) with emerald-teal gradient accents and electric lime (`#d5f14c`) / coral orange (`#fb6843`) punctuation.

---

## Baseline for Zero-Regression Verification
- **API calls on public page:** 0
- **Route paths:** `/`, `/login`, `/auth/callback` (public); all `/dashboard/*` (protected)
- **Forms that submit:** Login form only (public); booking form is local state
- **Image filenames in use:** `dr-amit-jha-cutout.png`, `dr-amit-jha-hero.png`
- **CSS custom properties in use:** `--ink`, `--paper`, `--lime`, `--muted`, `--orange`
- **Tailwind classes on public page:** `bg-slate-950`, `bg-slate-900`, `text-white`, `from-teal-400`, `to-emerald-500`, `bg-emerald-500`, `text-lime-400`
