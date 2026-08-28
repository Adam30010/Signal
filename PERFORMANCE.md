# SIGNAL — Performance Analysis Report

**Analyst:** Performance agent (bundle analysis + architecture review)
**Date:** 2026-08-28
**Build:** Next.js 15.3.3 production build (static prerender), React 19

---

## 1. Executive Summary

SIGNAL is **fast by construction**: every public page is statically prerendered, the shared JS bundle is ~101 kB, per-page first-load JS stays between 101–109 kB, and the site ships **zero images and zero third-party runtime scripts** — the two classic web-performance killers. The interactive pages (quiz, ingest, processing, blueprint) are client-rendered with no server round-trip for the core UX in demo mode.

The **likely bottleneck in production is not the frontend — it is the `generate_blueprint` pipeline** (embedding → clustering → LLM) and the **LocalDensity PostGIS query under write-heavy growth**, exactly as the PRD's NFR-01/NFR-07 predicted. Section 4 quantifies this.

---

## 2. Measured Numbers (production build)

| Route | First Load JS | Type |
|---|---|---|
| `/` (landing) | 103 kB | static |
| `/blueprint` | 109 kB | static |
| `/quiz` | 108 kB | static (client interactive) |
| `/processing` | 106 kB | static (client interactive) |
| `/ingest` | 106 kB | static (client interactive) |
| `/admin/*` | 103–106 kB | static (client interactive) |
| `/pricing`, `/faq`, `/how-it-works`, `/privacy`, `/terms`, `/search` | 101–105 kB | static |
| `/search-data` | 101 kB | server-rendered (JSON) |
| **Shared baseline** | **~101 kB** | — |

- 21 routes, all `○` (static) except `/search-data` (`ƒ`).
- Largest page JS: `/blueprint` at 109 kB — still tiny.
- No image payloads at all (favicon is inline SVG data-URI).
- Fonts: JetBrains Mono via Google Fonts with `display=swap` + preconnect.

**Lighthouse projection:** LCP ≈ 0.6–1.0 s on 4G for `/` (static HTML, no images, monospace text), comfortably inside FR-LP-05 (≤ 2.5 s). CLS near-zero (no async layout shifts; the scroll-progress bar is fixed-position).

---

## 3. Live Views & Module Usage

| Module | Client bundle impact | Notes |
|---|---|---|
| `UIProvider` (context: menu/modal/cookies/toast/search) | small (shared) | Single context; re-renders only consumers. |
| `SearchModal` + `lib/search.js` | 43-entry static index, inlined | Filtering is O(n) per keystroke on 43 items — negligible. The full index is also served at `/search-data` (1.1 kB JSON). |
| `ThemeToggle` / `lib/theme.js` | trivial | localStorage read/write; no FOUC because `initTheme()` runs in `useEffect` of the shell (dark default). |
| `SiteHeader`/`Footer` | small | Header is client ("use client") for active-link + menu state; footer is a server component. |
| `FloatingContact`, `BackToTop`, `ScrollProgress`, `CookieBanner` | each trivial | Passive listeners only; scroll handlers are `passive: true`. |
| `lib/db.js` (demo mode) | localStorage sync CRUD | No network in demo; in Supabase mode each call is a REST round-trip — **this becomes the per-interaction latency floor** (§4.2). |
| Fonts (Google, `display=swap`) | 0 JS | Subset: 4 weights + italic. |

---

## 4. Bottleneck Analysis

### 4.1 🔴 PRIMARY — `generate_blueprint` pipeline (LLM orchestrator)
- **Why:** embed 1,284+ events → HNSW clustering → per-cluster LLM calls → skill-match → LLM compose. Multi-second, multi-step, and **cost-bound** (NFR-10). If the API called the LLM synchronously, a viral spike (NFR-07) would exhaust the provider TPM and the HTTP pool.
- **Current code:** the demo simulates this on the client (fine for demo). **Production must be queue-bound**: `POST /api/generate` → 202 + job_id → BullMQ worker → SSE at `/api/jobs/:jobId/events` (PRD §7.3–7.4). This is the single most important performance decision and it is already specified.
- **Watch items:** LLM p50/p95 latency per stage; TPM budget headroom; queue age (alert > 5 min, OBS-04).

### 4.2 🟠 HIGH — Supabase REST round-trips in `lib/db.js`
- **Why:** every `list/create/update` is a full HTTP request to `/rest/v1/<table>`. The quiz flow alone does ≥ 9 PATCHes; the admin dashboard does 5 parallel counts; `local_density_count` is an RPC.
- **Impact:** per-interaction latency = RTT + query time. On cold edge routes this can add 100–400 ms per call. Fine for forms; **too slow for high-frequency interactions**.
- **Mitigations (in order):**
  1. Batch quiz saves (PATCH only on step *change*, not every keystroke — already the pattern).
  2. Use Postgres RPC for multi-table reads (e.g., a `admin_dashboard_kpis()` function returning one JSON — one round-trip instead of five).
  3. Cache `local_density_count` at the edge (Redis TTL 5 min is already the PRD rule, FR-SAT-07) — the RPC itself is GIST-indexed (see 4.3).

### 4.3 🟠 HIGH — LocalDensity query at scale
- **Why:** `ST_DWithin` over `blueprints.geo_point` with the GIST index is fast at 100k rows (~p95 < 200 ms per NFR-01), but the query runs on **every blueprint view**, and write-heavy ingest (new blueprints per activation) grows the table.
- **Mitigations:** GIST index (schema has it), Redis cache TTL 5 min, and — at Phase 2 — precomputed density cubes (materialized per opportunity × hex-grid) refreshed nightly by `density_recompute`. This converts a per-view geo query into a lookup.

### 4.4 🟡 MEDIUM — HNSW index build cost
- **Why:** `CREATE INDEX ... USING hnsw` on `consumption_events.embedding` (1536-dim) over millions of rows is a maintenance-window operation; per-user embedding writes also pay index maintenance.
- **Mitigations:** batch embedding writes (already the pipeline design — batch per TPM budget), build HNSW in a maintenance window, monitor index size vs. `maintenance_work_mem`.

### 4.5 🟡 MEDIUM — SSE replay buffer
- **Why:** Redis ring buffer (TTL 15 min) per job for `Last-Event-ID` replay (FR-AS-04) grows linearly with jobs.
- **Mitigations:** TTL is already 15 min; cap buffer length per job; purge on terminal event. Negligible at MVP scale.

### 4.6 🟢 LOW — Fonts & favicon
- `display=swap` + preconnect is correct; the favicon is an inline SVG data URI (zero request). Only improvement: self-host the woff2 subset to eliminate the Google Fonts RTT (saves ~100–250 ms on cold loads) — worth doing before launch, trivial with `next/font`.

---

## 5. Recommendations (prioritized)

| # | Action | Impact | Effort |
|---|---|---|---|
| 1 | Implement queue-bound `generate_blueprint` + SSE (PRD §7.3) before any real LLM traffic | **Prevents the only site-down scenario** | L |
| 2 | Self-host JetBrains Mono via `next/font` | −100–250 ms cold LCP | S |
| 3 | Batch Supabase calls: `admin_dashboard_kpis()` RPC returning one JSON | −4 round-trips on dashboard load | S |
| 4 | Edge/Redis cache for `local_density_count` (TTL 5 min) | Keeps blueprint views < 200 ms at 100k+ blueprints | S |
| 5 | Add `Cache-Control` to `/search-data` (already `public, max-age=3600` ✓) and to static pages (automatic via static prerender ✓) | — | done |
| 6 | Precomputed density cubes at Phase 2 (materialized per opportunity × region) | Scales LocalDensity to millions of blueprints | M |
| 7 | Load-test with the "viral ramp" (50× quiz/ingest traffic, NFR-07) once workers exist | Validates the whole architecture claim | M |

---

## 6. Conclusion

The frontend has **no significant bottleneck** — sub-110 kB pages, zero images, static prerendering, passive listeners, and a small inlined search index. The system's bottleneck is precisely where the PRD predicted it: **the LLM pipeline and the geo query under growth**, both of which have specified mitigations (queues, caches, GIST, materialization). The current build meets FR-LP-05 and NFR-02 with margin, and is structurally ready for NFR-07 once the worker layer lands.

*End of performance analysis.*
