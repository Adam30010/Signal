// ═══════════════════════════════════════════════════════════════════════
// Content — opportunities, quiz questions, pipeline stages, testimonials.
// ═══════════════════════════════════════════════════════════════════════

import { DENSITY_WEIGHTS } from '@/lib/site';

// Curated opportunity catalog (FR-VM-07 — human-reviewed, constraint metadata)
export const OPPORTUNITIES = [
  {
    id: 'opp-3d-art',
    slug: '3d-environment-art-services',
    title: '3D Environment Art Services',
    category: 'creative-services',
    description:
      'Sell environment art / scene asset services to indie game studios and archviz firms. Sustained Blender + Unreal consumption implies this skill.',
    skills: ['3d_environment_art', 'blender', 'unreal', 'lighting'],
    capital_floor_cents: 0,
    min_weekly_hours: 8,
    requires_camera: false,
    requires_cold_calls: false,
    base_density: 42.3,
    match: '3D environment art · Lighting & composition · Client review workflows',
  },
  {
    id: 'opp-video-edit',
    slug: 'video-editing-for-creators',
    title: 'Video Editing Retainers for Creators',
    category: 'creative-services',
    description:
      'Monthly editing retainers for YouTube/TikTok creators. Tutorial consumption in editing tools maps directly to deliverable output.',
    skills: ['video_editing', 'premiere', 'after_effects', 'storytelling'],
    capital_floor_cents: 0,
    min_weekly_hours: 5,
    requires_camera: false,
    requires_cold_calls: false,
    base_density: 57.8,
    match: 'Video editing · Motion graphics · Creator workflow optimization',
  },
  {
    id: 'opp-webflow',
    slug: 'webflow-website-agency',
    title: 'Webflow / Framer Website Agency',
    category: 'agency',
    description:
      'No-code website builds for local businesses. Design-tutorial consumption signals layout and interaction skills.',
    skills: ['web_design', 'webflow', 'framer', 'ui_ux'],
    capital_floor_cents: 0,
    min_weekly_hours: 10,
    requires_camera: false,
    requires_cold_calls: false,
    base_density: 61.2,
    match: 'UI/UX design · Webflow development · Conversion-focused layouts',
  },
  {
    id: 'opp-notion',
    slug: 'notion-ops-consulting',
    title: 'Notion / Ops Systems Consulting',
    category: 'consulting',
    description:
      'Sell Notion workspaces, SOPs, and automation setups to small teams. Productivity-content consumption is the tell.',
    skills: ['notion', 'automation', 'systems_thinking', 'sops'],
    capital_floor_cents: 0,
    min_weekly_hours: 5,
    requires_camera: false,
    requires_cold_calls: false,
    base_density: 38.9,
    match: 'Notion architecture · Process documentation · Automation design',
  },
  {
    id: 'opp-local-seo',
    slug: 'local-seo-for-trades',
    title: 'Local SEO for Trades & Services',
    category: 'digital-marketing',
    description:
      'Local SEO retainers for plumbers, electricians, and service businesses. Search/SEO tutorial consumption maps to this model.',
    skills: ['seo', 'local_seo', 'google_business', 'content'],
    capital_floor_cents: 0,
    min_weekly_hours: 8,
    requires_camera: false,
    requires_cold_calls: false,
    base_density: 71.5,
    match: 'Local SEO · Google Business Profile · Citation building',
  },
  {
    id: 'opp-scriptwriting',
    slug: 'scriptwriting-for-channels',
    title: 'Scriptwriting for YouTube Channels',
    category: 'creative-services',
    description:
      'Write research-driven scripts for faceless YouTube channels. Consumption of essay/documentary content signals research + narrative skills.',
    skills: ['scriptwriting', 'research', 'storytelling', 'youtube'],
    capital_floor_cents: 0,
    min_weekly_hours: 5,
    requires_camera: false,
    requires_cold_calls: false,
    base_density: 33.4,
    match: 'Narrative structure · Research synthesis · Hook writing',
  },
];

// Constraint quiz — 9 steps (FR-QZ). Each option maps to typed fields.
export const QUIZ_STEPS = [
  {
    n: 1,
    key: 'liquid_capital_cents',
    title: 'LIQUID CAPITAL',
    prompt: 'How much can you deploy without touching essentials?',
    options: [
      { value: 0, label: '$0', desc: 'Bootstrapped. Everything must be free.' },
      { value: 50000, label: 'UP TO $50K', desc: 'Can cover small tools and services.' },
      { value: 200000, label: 'UP TO $200K', desc: 'Can fund real operations.' },
      { value: 1000000, label: '$1M+', desc: 'Full operator mode.' },
    ],
  },
  {
    n: 2,
    key: 'weekly_hours',
    title: 'WEEKLY HOURS',
    prompt: 'Hours per week you can actually run this?',
    slider: { min: 0, max: 60 },
  },
  {
    n: 3,
    key: 'risk_tolerance',
    title: 'RISK TOLERANCE',
    prompt: 'Which failure mode are you okay with?',
    options: [
      { value: 'safe', label: 'SAFE', desc: 'Slow compounding. No downside drama.' },
      { value: 'balanced', label: 'BALANCED', desc: 'Calculated swings, real upside.' },
      { value: 'degenerate', label: 'DEGENERATE', desc: 'All in. Full throttle.' },
    ],
  },
  {
    n: 4,
    key: 'time_horizon_days',
    title: 'TIME HORIZON',
    prompt: 'When do you expect the first dollar?',
    options: [
      { value: 30, label: '30 DAYS', desc: 'Immediate feedback loop.' },
      { value: 90, label: '90 DAYS', desc: 'Standard ramp.' },
      { value: 180, label: '6 MONTHS', desc: 'Patient build.' },
      { value: 365, label: '12 MONTHS+', desc: 'Long game.' },
    ],
  },
  {
    n: 5,
    key: 'trait_introversion',
    title: 'TRAIT · VISIBILITY',
    prompt: 'Build in public vs. build in silence?',
    options: [
      { value: 0.2, label: 'BUILD IN PUBLIC', desc: 'Document everything. (+openness, −introversion)' },
      { value: 0.8, label: 'BUILD IN SILENCE', desc: 'Ship first, talk later. (+introversion)' },
    ],
  },
  {
    n: 6,
    key: 'trait_conscientious',
    title: 'TRAIT · STRUCTURE',
    prompt: 'Strict weekly system vs. organic bursts?',
    options: [
      { value: 0.2, label: 'STRICT SYSTEM', desc: 'Same time, same process, every week.' },
      { value: 0.8, label: 'ORGANIC BURSTS', desc: 'Deep dives when the energy hits.' },
    ],
  },
  {
    n: 7,
    key: 'trait_openness',
    title: 'TRAIT · PLAY',
    prompt: 'Stick to one lane or explore adjacent skills?',
    options: [
      { value: 0.2, label: 'ONE LANE', desc: 'Depth over breadth.' },
      { value: 0.8, label: 'EXPLORE', desc: 'Adjacent skills compound.' },
    ],
  },
  {
    n: 8,
    key: 'hard_constraints',
    title: 'HARD CONSTRAINTS',
    prompt: 'Hard filters — the generator excludes anything violating these.',
    multi: true,
    options: [
      { value: 'no_camera', label: 'NO CAMERA', desc: 'Never on video.' },
      { value: 'no_cold_calls', label: 'NO COLD CALLS', desc: 'No phone prospecting.' },
      { value: 'no_weekend_work', label: 'NO WEEKENDS', desc: 'Weekends off, always.' },
      { value: 'no_travel', label: 'NO TRAVEL', desc: 'Fully remote, local only.' },
      { value: 'no_public_facing', label: 'NO PUBLIC FACING', desc: 'No personal brand required.' },
    ],
  },
  {
    n: 9,
    key: 'existing_skills',
    title: 'EXISTING SKILLS',
    prompt: 'What can you already do? (self-reported, reconciled against your data)',
    text: true,
  },
];

// Pipeline stages — rendered verbatim on the processing screen (FR-AS-03).
export const PIPELINE_STAGES = [
  { key: 'ingest', label: 'INGEST', verb: 'Normalizing consumption events' },
  { key: 'embed', label: 'EMBED', verb: 'Embedding title+tags+channel into 1536-dim space' },
  { key: 'cluster', label: 'CLUSTER', verb: 'Collapsing corpus into thematic clusters' },
  { key: 'extract', label: 'EXTRACT', verb: 'Extracting latent skills from sustained consumption' },
  { key: 'match', label: 'MATCH', verb: 'Matching skills against curated opportunity vectors' },
  { key: 'compose', label: 'COMPOSE', verb: 'Composing the tier-gated blueprint tree' },
  { key: 'ready', label: 'READY', verb: 'Blueprint ready' },
];

export function weightSum() {
  const { w1, w2, w3 } = DENSITY_WEIGHTS;
  return (w1 + w2 + w3) / 3;
}

// Landing "how did it know" demo clusters
export const DEMO_CLUSTERS = [
  { label: '3D ENVIRONMENT ART', evidence: 'Blender Guru · Unreal 5 lighting · Substance Painter', hours: 41, pct: 34 },
  { label: 'CLIENT WORKFLOW', evidence: 'Freelance pricing · contracts · client onboarding', hours: 22, pct: 18 },
  { label: 'GAME DEV PIPELINE', evidence: 'Maya retopo · texture baking · Unity integration', hours: 17, pct: 14 },
];
