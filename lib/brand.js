// ═══════════════════════════════════════════════════════════════════════
// BRAND — single source of truth for SIGNAL's visual identity.
//
// Everything brand-colored on the site derives from this file:
//   - the CSS custom properties injected by app/layout.js
//   - the favicon SVG
//   - lib/site.js (SITE.accent)
//
// To apply the real branding asset: replace the hex values below (and any
// logo file dropped in /public). That's the whole swap.
// ═══════════════════════════════════════════════════════════════════════

export const BRAND = {
  name: 'SIGNAL',
  // Accent — one functional signal color for Saturation Meter + CTAs (FR-UX-05).
  // CURRENT VALUE: placeholder signal green until the branding asset lands.
  accent: '#00ff9c',
  // Text rendered on top of accent-colored surfaces.
  accentInk: '#00150c',
  // Derived tints (10% / 35% alpha of the accent) for hover cells and glows.
  accentDim: 'rgba(0, 255, 156, 0.10)',
  accentGlow: 'rgba(0, 255, 156, 0.35)',
  // Light-mode accent (dark is the brand default; light is a convenience override).
  accentLight: '#00875a',
  accentInkLight: '#ffffff',
  accentDimLight: 'rgba(0, 135, 90, 0.10)',
  accentGlowLight: 'rgba(0, 135, 90, 0.25)',
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
