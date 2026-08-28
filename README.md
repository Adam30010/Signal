# SIGNAL

**Working title:** SIGNAL — *"Learn for free, pay to scale."*

A web application that converts a user's existing digital consumption into a validated business opportunity and a tiered execution blueprint. Built to the PRD: dark-brutalist terminal aesthetic, honest telemetry, queue-bound architecture.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

**Admin panel demo:** `/admin` — username `Adam` / password `Password123` (env overrides: `NEXT_PUBLIC_DEMO_ADMIN_USERNAME` / `NEXT_PUBLIC_DEMO_ADMIN_PASSWORD`). Change email/password from `/admin/settings` → Account & Credentials. Change the site logo + accent color from `/admin/settings` → Branding (applies site-wide instantly).

**Supabase wiring:** copy `.env.example` → `.env.local`, set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and run `supabase/schema.sql` in the SQL editor. Without env vars the app runs in demo mode (localStorage-backed, zero config). Details: `supabase/README.md`.

## Routes

| Area | Routes |
|---|---|
| Public | `/` · `/how-it-works` · `/quiz` · `/ingest` · `/processing` · `/blueprint` · `/pricing` · `/faq` · `/contact` · `/privacy` · `/terms` · `/search` |
| Admin | `/admin` (login) · `/admin/dashboard` · `/admin/users` · `/admin/content` · `/admin/orders` · `/admin/messages` · `/admin/settings` · `/admin/audit` |
| Data | `/search-data` (JSON site index) |

## Site-wide features

Dark/light toggle (dark is brand) · cookie banner · full-site search (`⌘K`) · back-to-top · mobile menu · loading skeletons + spinner · scroll progress bar · copy buttons · print stylesheet (`/print.css`) · sticky header · skip-to-content · password visibility toggle · UTM tracking → `utm_events` · form success/error states · confirmation modals · last-updated footer · expandable FAQ · floating contact widget · blur-gated blueprint (FR-TR-01) · Saturation Meter with honest-telemetry disclosure.

## Documents

- **PRD.md** — product requirements (v0.1, engineering-focused)
- **SECURITY_AUDIT.md** — security review of the built codebase (7 findings, remediation checklist)
- **PERFORMANCE.md** — performance analysis of the built codebase (measured bundles + bottleneck analysis)
- **supabase/schema.sql** — full PRD §6 schema (pgvector + PostGIS + RLS + seed)
