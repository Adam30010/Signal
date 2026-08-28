// ═══════════════════════════════════════════════════════════════════════
// Full-site search index.
// Content lives in one place (lib/content.js + this file) and is exported
// as a static JSON map in app/search-data/route.js for a fetchable index.
// The SearchModal client component filters locally — instant, offline.
// ═══════════════════════════════════════════════════════════════════════

const pages = [
  { path: '/', title: 'Home', blurb: 'Learn for free, pay to scale. Turn your existing consumption into a validated business opportunity.' },
  { path: '/how-it-works', title: 'How It Works', blurb: 'The 8-step loop: constraint quiz, magic-link account, data ingestion, async processing, vector mapping, blueprint, paywall, monetization surfaces.' },
  { path: '/quiz', title: 'Constraint Quiz', blurb: '9-step typed flow. No authentication. Capital buckets, weekly hours, risk tolerance, hard constraints, Big-Five-lite traits.' },
  { path: '/ingest', title: 'Data Ingestion', blurb: 'OAuth (YouTube, Instagram) or upload (Google Takeout, TikTok export). Streaming JSON parsing, checkpointed and idempotent.' },
  { path: '/processing', title: 'Processing', blurb: 'Async pipeline with streamed status events over SSE: embed, cluster, skill extraction, opportunity match, compose.' },
  { path: '/blueprint', title: 'Blueprint', blurb: '14-day zero-cost roadmap, free tech stack, cold outreach scripts. Premium: automation workflows, retainer templates, lead-gen tooling.' },
  { path: '/pricing', title: 'Pricing', blurb: 'Unlock $49 USD / $64 CAD, Deploy $79 / $99, Buy-Out License $199 / $259, Trend Alerts $19/mo / $25/mo. 14-day refunds.' },
  { path: '/faq', title: 'FAQ', blurb: 'Frequently asked questions: data privacy, TikTok upload, license mechanics, density score computation, refunds.' },
  { path: '/contact', title: 'Contact', blurb: 'Contact SIGNAL support. Form with success and error states.' },
  { path: '/privacy', title: 'Privacy Policy', blurb: 'PIPEDA, CCPA/CPRA, Quebec Law 25. Data rights, opt-out of being counted, deletion.' },
  { path: '/terms', title: 'Terms of Service', blurb: 'Terms: honest telemetry, license mechanics, 14-day refunds, CASL/CAN-SPAM compliance.' },
  { path: '/search', title: 'Search', blurb: 'Full-site search across all SIGNAL pages.' },
  { path: '/admin', title: 'Admin Panel', blurb: 'Dashboard KPIs, system health, user management, CMS, orders, messages, settings, security, audit log.' },
  { path: '/admin/users', title: 'Admin · Users', blurb: 'Searchable user list, suspend, role assignment, activity.' },
  { path: '/admin/content', title: 'Admin · Content', blurb: 'CMS: pages, posts, media, SEO fields.' },
  { path: '/admin/orders', title: 'Admin · Orders', blurb: 'Orders, refunds, invoices, payment log.' },
  { path: '/admin/messages', title: 'Admin · Messages', blurb: 'Contact form inbox and newsletter subscribers.' },
  { path: '/admin/settings', title: 'Admin · Settings', blurb: 'Site config, security, backups, feature toggles.' },
];

// Every searchable term — pages + key topics so search feels complete.
const topics = [
  { path: '/how-it-works', title: 'Constraint Quiz — 9 steps', blurb: 'capital buckets 0/50k/200k/1M+, weekly hours 0-60, risk tolerance, time horizon, trait tradeoffs, hard_constraints, existing skills, geo' },
  { path: '/how-it-works', title: 'Hard constraints', blurb: 'no_camera, no_cold_calls — a hard filter on the blueprint generator, never a soft weight (FR-BP-05)' },
  { path: '/how-it-works', title: 'Magic link auth', blurb: 'no passwords, 15-minute single-use token, soft verification, httpOnly cookie' },
  { path: '/ingest', title: 'YouTube Data API v3', blurb: 'liked videos, watch later, subscriptions via OAuth scope youtube.readonly' },
  { path: '/ingest', title: 'Instagram Graph API', blurb: 'saved/engaged media for business/creator accounts; personal accounts are upload-only' },
  { path: '/ingest', title: 'TikTok upload', blurb: 'no consumer watch-history API exists — TikTok is upload-only, permanent' },
  { path: '/ingest', title: 'Google Takeout', blurb: 'watch-history.json upload, stream-parsed, checkpointed, idempotent' },
  { path: '/processing', title: 'SSE status events', blurb: 'queued → ingest → embed → cluster → extract → match → compose → ready | failed' },
  { path: '/processing', title: 'BullMQ queues', blurb: 'parse_export, generate_blueprint, token_refresh, density_recompute, deploy_jobs, prune_job, trend_monitor' },
  { path: '/blueprint', title: '14-day roadmap', blurb: 'daily nodes with named free resource, deliverable, self-check; portfolio artifact by day 14' },
  { path: '/blueprint', title: 'Cold outreach scripts', blurb: '3 variants (DM, email, in-person) pre-filled with your niche and local market' },
  { path: '/blueprint', title: 'Blur gate', blurb: 'basic blueprint renders behind partial blur with a single unlock CTA (FR-TR-01)' },
  { path: '/pricing', title: 'Unlock full roadmap', blurb: '$49 USD / $64 CAD one-time. Premium nodes: automation, retainer templates, lead-gen.' },
  { path: '/pricing', title: 'Deploy', blurb: '$79 USD / $99 CAD one-time. Cal.com, domain alias, email, CRM provisioned with affiliate attribution.' },
  { path: '/pricing', title: 'Buy-out license', blurb: '$199 USD / $259 CAD. Lock an opportunity to your ZIP/FSA. Prunes neighbors results. Real mechanic, honest telemetry.' },
  { path: '/pricing', title: 'Trend alerts', blurb: '$19 USD / $25 CAD per month. Push when a search trajectory spikes before density rises.' },
  { path: '/pricing', title: 'Marketplace', blurb: '20% platform take, Stripe Connect destination charges, escrow on delivery acceptance.' },
  { path: '/how-it-works', title: 'Global Density Score', blurb: 'clamp(w1·search_trajectory + w2·active_blueprint_ratio + w3·marketplace_supply, 0, 100)' },
  { path: '/how-it-works', title: 'Local Density Index', blurb: 'PostGIS ST_DWithin 25 miles — real count of operators running the same blueprint' },
  { path: '/how-it-works', title: 'Vector mapping', blurb: 'pgvector 1536-dim embeddings, HNSW index, cosine clustering, latent skill extraction, opportunity matching' },
  { path: '/faq', title: 'Is the density number real?', blurb: 'Yes — every scarcity number is derived from real data (ETH-01). Disclosure links on every surface.' },
  { path: '/privacy', title: 'PIPEDA / CCPA / Quebec Law 25', blurb: 'data rights, export, deletion, opt-out of being counted (consent_counted)' },
  { path: '/terms', title: 'CASL / CAN-SPAM', blurb: 'consent requirements on outreach scripts and remarketing' },
  { path: '/admin', title: 'Feature toggles', blurb: 'maintenance mode, promo banner, beta features — no redeploy' },
  { path: '/admin', title: '2FA enforcement', blurb: 'two-factor authentication, security tokens, backup management' },
];

export const SEARCH_INDEX = [...pages, ...topics];

export function searchIndex(query, limit = 12) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = [];
  for (const item of SEARCH_INDEX) {
    const hay = `${item.title} ${item.blurb} ${item.path}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (hay.includes(t)) score += 1;
      if (item.title.toLowerCase().includes(t)) score += 3;
      if (item.path.includes(t)) score += 2;
    }
    if (score > 0) scored.push({ ...item, score });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}
