// ═══════════════════════════════════════════════════════════════════════
// BRAND — single source of truth for SIGNAL's visual identity.
//
// Everything brand-colored on the site derives from this file:
//   - the CSS custom properties injected by app/layout.js
//   - the favicon SVG
//   - lib/site.js (SITE.accent)
//
// Brand palette (from branding asset):
//   ACCENT  #ff3300  (signal orange-red — Saturation Meter + CTAs)
//   WHITE   #ffffff  (pure white — structural borders + type)
//
// Admins can override the accent + logo at runtime from
// /admin/settings (Branding section) — persisted client-side, applied
// instantly, reset to these defaults with one click.
// ═══════════════════════════════════════════════════════════════════════

export const BRAND = {
  name: 'SIGNAL',
  // Accent — one functional signal color for Saturation Meter + CTAs (FR-UX-05).
  accent: '#ff3300',
  // Text rendered on top of accent-colored surfaces (black keeps AA contrast
  // on the orange — white drops below 4.5:1 for normal-size text).
  accentInk: '#000000',
  // Derived tints (10% / 35% alpha of the accent) for hover cells and glows.
  accentDim: 'rgba(255, 51, 0, 0.10)',
  accentGlow: 'rgba(255, 51, 0, 0.35)',
  // Light-mode accent (dark is the brand default; light is a convenience override).
  accentLight: '#ff3300',
  accentInkLight: '#000000',
  accentDimLight: 'rgba(255, 51, 0, 0.10)',
  accentGlowLight: 'rgba(255, 51, 0, 0.25)',
  // Typography
  fontMono: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  // Structural colors (brutalist directive FR-UX-01..02)
  bg: '#000000',
  fg: '#ffffff',
  line: '#ffffff',
};

// Favicon as an inline SVG data URI (zero extra request).
// The mark: a black square with a 1px accent square frame — terminal, industrial.
export function faviconDataUri() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><rect width='16' height='16' fill='%23000000'/><rect x='2' y='2' width='12' height='12' fill='none' stroke='${BRAND.accent}' stroke-width='2'/></svg>`;
  return `data:image/svg+xml,${svg.replace(/#/g, '%23')}`;
}
