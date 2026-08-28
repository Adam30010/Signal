// ═══════════════════════════════════════════════════════════════════════
// Runtime branding — lets the admin change the logo and accent color from
// /admin/settings without redeploying. Overrides are applied on top of the
// server-side brand defaults (lib/brand.js) and reset with one click.
//
// Demo mode: persisted in localStorage. Supabase mode: swap this store for
// a `site_branding` table row (service-role read at the edge) — the event
// contract stays the same.
// ═══════════════════════════════════════════════════════════════════════

import { faviconDataUri } from '@/lib/brand';

const KEY = 'signal_admin_branding';

export const BRANDING_EVENT = 'signal:branding-changed';

export function getBranding() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function setBranding(patch) {
  const next = { ...(getBranding() || {}), ...patch };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(BRANDING_EVENT));
  return next;
}

export function removeBranding(key) {
  const cur = getBranding() || {};
  const { [key]: _removed, ...rest } = cur;
  window.localStorage.setItem(KEY, JSON.stringify(rest));
  window.dispatchEvent(new CustomEvent(BRANDING_EVENT));
  return rest;
}

export function hexToRgba(hex, alpha) {
  let h = String(hex || '').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export const isHex = (v) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v || '');

// Applies saved branding to <html> CSS vars + favicon. Called by
// ClientShell on mount and on every BRANDING_EVENT.
export function applyBranding() {
  const b = getBranding();
  const root = document.documentElement;

  if (b?.accent && isHex(b.accent)) {
    root.style.setProperty('--accent', b.accent);
    root.style.setProperty('--accent-ink', '#000000'); // black ink keeps AA on orange
    root.style.setProperty('--accent-dim', hexToRgba(b.accent, 0.1) || 'rgba(255, 51, 0, 0.10)');
    root.style.setProperty('--accent-glow', hexToRgba(b.accent, 0.35) || 'rgba(255, 51, 0, 0.35)');
  } else {
    root.style.removeProperty('--accent');
    root.style.removeProperty('--accent-ink');
    root.style.removeProperty('--accent-dim');
    root.style.removeProperty('--accent-glow');
  }

  const fav = document.querySelector('link[rel="icon"]');
  if (fav) fav.href = b?.logo || faviconDataUri();
}
