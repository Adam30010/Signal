# SIGNAL — Security Audit Report

**Auditor:** Security review agent (automated + manual code review)
**Scope:** Entire repository as built (`app/`, `components/`, `lib/`, `next.config.mjs`, `supabase/schema.sql`)
**Date:** 2026-08-28
**Build:** `4d8eb83 + working tree`, Next.js 15.3.3, React 19, zero third-party runtime deps

---

## 1. Executive Summary

SIGNAL ships with a **defense-in-depth baseline that is unusual for a first build**: strict security headers (CSP, X-Frame-Options DENY, nosniff, CORP/COOP), a `poweredByHeader` disabled, typed DB access, no runtime dependencies beyond React/Next, and an RLS-ready Supabase schema. The known weaknesses are **concentrated in the demo-auth and demo-data layers** — which is by design for this phase, but must be understood as such. No critical-severity issues were found in the production-path design; the critical findings below are all **demo-mode-only** and must be resolved before any public deployment.

**Verdict: build phase = PASS with conditions.** The seven findings in §5 must be closed before launch. None require re-architecture.

---

## 2. Attack Surface Inventory

### 2.1 Routes (21) and their trust boundaries

| Route | Method(s) | Auth | Data written | Risk |
|---|---|---|---|---|
| `/` | GET | public | — | L |
| `/quiz` | GET | public (anonymous session) | `quiz_sessions` (PATCH per step) | M |
| `/ingest` | GET | public | `consumption_events`, `uploads` | M |
| `/processing`, `/blueprint`, `/pricing`, `/how-it-works`, `/faq`, `/search`, `/privacy`, `/terms` | GET | public | — | L |
| `/contact` | POST (form) | public | `messages` | M |
| `/search-data` | GET | public | — | L |
| `/admin` | GET+POST (demo login) | demo password | session (localStorage) | **H (demo)** |
| `/admin/{dashboard,users,content,orders,messages,settings,audit}` | GET | demo session guard | `users`, `orders`, `messages`, `settings` | **H (demo)** |

### 2.2 Components & modules

- `components/ui/*` — client widgets (theme, search, modal, cookies, copy, progress, floating contact). No network I/O except clipboard.
- `components/SiteHeader/Footer/Shared` — navigation, accordion, code blocks.
- `lib/db.js` — **the single database gateway**: Supabase REST when env-configured, localStorage demo otherwise.
- `lib/auth.js` — demo RBAC (localStorage session) or Supabase Auth swap-point.
- `lib/utm.js` — UTM capture → localStorage + `utm_events` table (fire-and-forget).
- `lib/search.js` — static index, no user input reach (client-side filter only).
- `app/search-data/route.js` — static JSON, `Cache-Control: public`.

---

## 3. Findings

### CRITICAL

#### C-01 — Demo admin password ships in the client bundle
- **Where:** `lib/auth.js` — `DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || 'signal-admin'`
- **Detail:** The fallback password is compiled into the public JS bundle. Any visitor can read it, log into `/admin`, and (in demo mode) read/write the localStorage demo database.
- **Impact:** Demo-mode admin compromise. **Not** exploitable against a Supabase-backed deployment (the REST API + RLS blocks anonymous writes to `users`/`orders`; `messages` is insert-only).
- **Fix:** (1) Production builds must fail if `NEXT_PUBLIC_DEMO_ADMIN_PASSWORD` is unset AND Supabase auth is unconfigured (add a build-time check). (2) Replace demo login with Supabase Auth + service-role admin path per `supabase/README.md`. (3) Never use the anon key for admin writes — service role only, server-side.

#### C-02 — Client-side admin gate can be bypassed in demo mode
- **Where:** `app/admin/layout.js` — `useEffect` redirect only; `getSession()` reads localStorage.
- **Detail:** The admin "auth" is a localStorage flag. Any script in the page origin can set it; there is no server enforcement because there is no server session in demo mode.
- **Fix:** With Supabase: server-side middleware + RLS (schema already supports it). The demo is explicitly non-secure; label it in the UI (already partially done) and gate the demo login behind the config flag in production builds.

### HIGH

#### H-01 — No server-side rate limiting on public write paths
- **Where:** `lib/db.js` → direct REST calls from the browser; quiz PATCH, message POST, UTM insert.
- **Detail:** NFR-05 (60 req/min per user, 30 req/min quiz, 5 magic links/15 min) is specified but **not yet implemented** anywhere in the codebase. With Supabase, an attacker can currently POST unlimited rows to `quiz_sessions` (RLS policy `true` — intentional for anonymous sessions) and to `messages` (insert-only policy).
- **Fix:** Supabase-side: RLS + triggers with rate-limit buckets, or edge function proxying. Add `lean` indexes; cap `messages` rows per email (e.g., 10/day) via a trigger. This closes the only realistic spam/abuse vector.

#### H-02 — `quiz_sessions` RLS policy is wide open (by design, must be bounded)
- **Where:** `supabase/schema.sql` — `create policy "own quiz sessions" ... for all using (true) with check (true)`
- **Detail:** Anonymous pre-auth sessions require this, but `for all` also permits **reads and updates of any session by anyone** who knows (or guesses) a UUID. UUIDs are 128-bit so guessing is infeasible (FR-QZ-07), but the policy contradicts least-privilege.
- **Fix:** Split: `insert`/`update` with `with check (true)` for anonymous writes, but gate `select`/`delete` behind auth: `using (auth.uid() = user_id or session owner cookie match)`. Even better: move quiz writes through an RPC that binds the session cookie server-side.

### MEDIUM

#### M-01 — CSP requires `'unsafe-inline'` / `'unsafe-eval'` for Next.js dev
- **Where:** `next.config.mjs` CSP.
- **Detail:** Next.js dev (and some RSC hydration paths) need `unsafe-inline`/`unsafe-eval` for scripts. This weakens the script-src guarantee in dev; acceptable, but the CSP should be **strictened for production** (hash-based scripts, no eval) using `process.env.NODE_ENV` conditional.
- **Fix:** Split CSP by environment; add `upgrade-insecure-requests` in prod; keep `frame-ancestors 'none'` (already correct — this is why the site cannot be iframed, which is the correct posture for an auth-bearing app).

#### M-02 — Clipboard API without permission fallback
- **Where:** `components/ui/CopyButton.jsx`
- **Detail:** `navigator.clipboard.writeText` requires secure context and can reject; the code catches and toasts an error — good. Minor: no `execCommand` fallback for old WebViews.
- **Fix:** Optional; low priority.

#### M-03 — `local_density_count` RPC executes on anonymous-ish path
- **Where:** `supabase/schema.sql` RPC is `stable` and unauthenticated-callable.
- **Detail:** It's a count-only aggregate over `blueprints` (no user PII); fine for the landing demo, but confirm it cannot be used to enumerate blueprint existence per region at scale (rate-limit the endpoint, H-01).

#### M-04 — Upload path is simulated
- **Where:** `app/ingest/page.js`
- **Detail:** No real file validation, AV scan, or size enforcement yet (PRD FR-IG-06..09). The production worker pipeline must implement: presigned PUT, AV hook, 500 MB cap, stream-parse with memory cap, checkpoint resume.
- **Fix:** Implement the `parse_export` worker + storage integration before any user uploads are accepted.

### LOW

- **L-01** — `seedDemoData()` writes to localStorage without explicit consent. Tied to cookie consent; currently seeds on first load. Acceptable for demo; gate behind consent in prod.
- **L-02** — No `integrity` attributes on the Google Fonts `<link>` (fonts.googleapis.com). SRI for stylesheet preconnects is impractical; low risk, note only.
- **L-03** — `utm_events` logged without a session identifier; can't correlate campaigns to conversions. Not a security issue; analytics gap.
- **L-04** — Error messages in demo login reveal the demo password hint ("TRY THE DEMO PASSWORD (signal-admin)"). Fine for demo; **remove in production** (info-disclosure hygiene).

---

## 4. What Is Done Right (defensible positions)

1. **Headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera/mic/geolocation/payment, `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`, `frame-ancestors 'none'`. This is a stronger default set than most production apps ship.
2. **Zero runtime attack surface:** only `next`, `react`, `react-dom`. No lodash-style audit debt, no analytics SDK in the bundle, no third-party client code executing.
3. **DB gateway is centralized** (`lib/db.js`): one place to enforce table allow-lists, filters, and orders. No scattered SQL string-building.
4. **RLS schema ready:** every privacy-critical table has policies; embeddings live on `consumption_events` (user-scoped); `local_licenses` is service-role-only by omission of policies (deny by default).
5. **Ethical telemetry posture:** no fabricated scarcity numbers exist anywhere in code; density displays are computed from real weights/aggregates (ETH-01). This is a *security*-adjacent asset: it eliminates a class of consumer-protection liability.
6. **Print stylesheet & a11y surface** (skip link, ARIA, focus-visible) reduce the class of "UI lockout" complaints that become support-channel spam.

---

## 5. Remediation Checklist (ordered)

| # | Item | Severity | Effort |
|---|---|---|---|
| 1 | Enforce production build gate: no demo password without explicit demo flag | C-01 | S |
| 2 | Move admin to Supabase Auth (server-side session + RLS) | C-02 | M |
| 3 | Rate-limit triggers/RPCs on `quiz_sessions`, `messages`, `utm_events` | H-01 | M |
| 4 | Tighten `quiz_sessions` RLS (write-anon, read-owned) | H-02 | S |
| 5 | Environment-split CSP (prod: hashes, no eval, upgrade-insecure-requests) | M-01 | S |
| 6 | Real upload pipeline: presigned PUT + AV + size cap + stream-parse worker | M-04 | L |
| 7 | Remove demo password hint from production error copy | L-04 | S |
| 8 | Wire Supabase Auth into `lib/auth.js` (swap point already documented) | C-02 | M |

---

## 6. Methodology & Limits

- Manual code review of every route, component, lib module, config file, and the SQL schema.
- Route-by-route trust-boundary mapping (§2).
- No live network exploitation performed (no prod deployment exists).
- The Supabase REST path was reviewed against the documented API contract; the demo path was reviewed against executed code.
- **Not yet reviewed:** future worker services (BullMQ), Stripe webhook handler (not yet implemented — when added, it must verify signatures + idempotency per SEC-05), OAuth token encryption-at-rest implementation (spec: libsodium secretbox + KMS), and the LLM prompt-injection guardrails (ETH-11) — all are PRD-locked but code-stubbed.

*End of security audit — full re-audit recommended at Phase 1 feature-complete.*
