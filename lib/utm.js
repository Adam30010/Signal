// ═══════════════════════════════════════════════════════════════════════
// UTM tracking (FR: campaign attribution)
// Captures utm_* + gclid/fbclid params, persists to localStorage, exposes
// the session for the admin dashboard "traffic sources" KPI and (when
// Supabase is configured) logs to the `utm_events` table via lib/db.js.
// ═══════════════════════════════════════════════════════════════════════

import { isSupabaseConfigured, create } from '@/lib/db';

const KEY = 'signal_utm';
const VISIT_KEY = 'signal_first_visit';

export function captureUtm() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(
    (k) => {
      const v = params.get(k);
      if (v) utm[k] = v;
    }
  );
  if (Object.keys(utm).length === 0) return getUtm();
  const prev = getUtm() || {};
  const merged = { ...prev, ...utm, captured_at: new Date().toISOString() };
  window.localStorage.setItem(KEY, JSON.stringify(merged));
  if (!window.localStorage.getItem(VISIT_KEY)) {
    window.localStorage.setItem(VISIT_KEY, new Date().toISOString());
  }
  // Fire-and-forget persistence when Supabase is wired up.
  if (isSupabaseConfigured()) {
    try {
      create('utm_events', {
        source: utm.utm_source || null,
        medium: utm.utm_medium || null,
        campaign: utm.utm_campaign || null,
        page: window.location.pathname,
        captured_at: merged.captured_at,
      }).catch(() => {});
    } catch {
      /* never block UX on analytics */
    }
  }
  return merged;
}

export function getUtm() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function getFirstVisit() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(VISIT_KEY);
}
