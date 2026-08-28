// FAQ content — expandable accordion on /faq and homepage.

export const FAQ_ITEMS = [
  {
    q: 'Where does my data come from?',
    a: 'SIGNAL ingests your existing consumption — YouTube likes/watch-later via OAuth, Instagram saved/engaged media via Graph API (business/creator accounts), and TikTok or Google Takeout exports via secure upload. You choose what gets connected; everything is normalized into a private consumption stream. (FR-IG)',
  },
  {
    q: 'Is TikTok supported?',
    a: 'TikTok has no consumer watch-history API, so TikTok is upload-only — permanently. You download your "Video Browsing History" from TikTok\'s data tools and upload the JSON here. It is stream-parsed in chunks, never loaded fully into memory. (FR-IG-07)',
  },
  {
    q: 'How does SIGNAL know my skill?',
    a: 'Every title, tag, and channel is embedded into a 1536-dimension vector space, clustered into 15–40 themes, and an LLM labels the latent capability implied by sustained consumption — not the topic. 40 hours of Blender + Unreal lighting maps to 3d_environment_art, not "watches art videos". (FR-VM)',
  },
  {
    q: 'Is the density score real?',
    a: 'Yes. Every number on every density surface is derived from real data: search-trajectory slope, active blueprint counts, and marketplace supply. Local Density is a live PostGIS count of operators within 25 miles running the same blueprint. We never fabricate scarcity — see our honest-telemetry policy. (ETH-01)',
  },
  {
    q: 'What is the Buy-Out License?',
    a: 'A one-time purchase that permanently locks an opportunity to your postal region (US ZIP5 / Canadian FSA). Once locked, the opportunity is removed from future blueprint results for that region, and existing blueprints there are suppressed. The identity of the buyer is never revealed. (FR-MP-05..09)',
  },
  {
    q: 'What is free, really?',
    a: 'Everything through the basic blueprint: the 9-step constraint quiz, ingestion, vector mapping, and the full 14-day zero-cost roadmap with named free tools and three personalized outreach scripts. The paywall sits exactly where manual effort stops scaling — automation, lead-gen, exclusivity, and trend alerts. (FR-BP-04)',
  },
  {
    q: 'Can I delete my data?',
    a: 'Yes — self-serve deletion is one click from your account panel (PIPEDA / CCPA / Quebec Law 25 compliant). All derived rows including embeddings are purged within 30 days. You can also opt out of being counted in Local Density entirely. (FR-AU-06, ETH-06)',
  },
  {
    q: 'What about refunds?',
    a: '14-day refunds on unlock, deploy, and license purchases. A license refund automatically un-prunes the affected blueprints. Subscriptions cancel in one click. (ETH-05, FR-MP-09)',
  },
  {
    q: 'Do the outreach scripts respect the law?',
    a: 'Every script ships with a compliance header covering CASL (Canada) and CAN-SPAM (US) consent requirements for email/SMS, plus platform ToS guidance for DMs. A compliance checklist accompanies every delivery. (ETH-08)',
  },
  {
    q: 'What is the 20% marketplace?',
    a: 'A fulfillment marketplace where vetted gig-workers build your assets. The platform escrows payment via Stripe Connect destination charges, takes 20%, and releases the worker payout only on your acceptance. (FR-MK)',
  },
  {
    q: 'Why does the site look like a terminal?',
    a: 'Deliberate. Pure black, white 1px borders, monospace, zero rounded corners, one functional accent. The interface is a control panel for building a business — density readouts are instrument telemetry, not marketing. (FR-UX-01..06)',
  },
  {
    q: 'Is SIGNAL available outside the US and Canada?',
    a: 'Launch geography is USA + Canada (pricing in USD and CAD, licenses keyed to ZIP5 / FSA). International expansion is on the Phase 3 roadmap. (PRD §10)',
  },
];
