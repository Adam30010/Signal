// ═══════════════════════════════════════════════════════════════════════
// Site-wide configuration — single source of truth for copy/pricing.
// Brand values (accent etc.) live in lib/brand.js.
// ═══════════════════════════════════════════════════════════════════════

import { BRAND } from '@/lib/brand';

export const SITE = {
  name: BRAND.name,
  tagline: 'Learn for free, pay to scale.',
  version: '0.1.0',
  lastUpdated: '2026-08-28',
  // BRAND ACCENT — sourced from lib/brand.js (one-place swap).
  accent: BRAND.accent,
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  geo: 'USA + Canada',
};

// Launch-default pricing (USD / CAD) — PRD §10. Configurable.
export const PRICING = {
  unlock: { usd: 49, cad: 64, label: 'Unlock Full Roadmap', once: true },
  deploy: { usd: 79, cad: 99, label: '1-Click Infrastructure Deploy', once: true },
  license: { usd: 199, cad: 259, label: 'Buy-Out Local License', once: true },
  alerts: { usd: 19, cad: 25, label: 'Live Trend Alerts', monthly: true },
  marketplaceFee: 0.2,
  refundDays: 14,
};

export const LINKS = {
  quiz: '/quiz',
  ingest: '/ingest',
  blueprint: '/blueprint',
  pricing: '/pricing',
  faq: '/faq',
  contact: '/contact',
  admin: '/admin',
  howItWorks: '/how-it-works',
  privacy: '/privacy',
  terms: '/terms',
  search: '/search',
};

// Saturation engine weights (FR-SAT-01..03) — mirrored for the landing demo.
export const DENSITY_WEIGHTS = { w1: 0.4, w2: 0.35, w3: 0.25 };
