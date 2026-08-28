import { pageMeta } from '@/lib/meta';
import { SectionHead, CodeBlock } from '@/components/Shared';

export const metadata = pageMeta({
  title: 'How It Works',
  description:
    'The SIGNAL loop — constraint quiz, magic-link account, data ingestion, async processing with streamed status, vector mapping, blueprint, paywall, monetization.',
  path: '/how-it-works',
});

const STEPS = [
  {
    n: '01', t: 'CONSTRAINT QUIZ', id: 'quiz',
    body: '9 typed questions. No authentication. Capital buckets, weekly hours, risk tolerance, time horizon, three forced-choice trait tradeoffs, and hard constraints — the field that is a hard filter, never a soft weight. Session persists under an anonymous UUID so you can resume anytime.',
  },
  {
    n: '02', t: 'MAGIC-LINK ACCOUNT', id: 'account',
    body: 'No passwords. A single-use 15-minute magic link. Verification is soft — you can proceed to ingestion immediately. The anonymous quiz session is bound to your new account.',
  },
  {
    n: '03', t: 'DATA INGESTION', id: 'ingest',
    body: 'OAuth paths: YouTube Data API v3 (liked videos, watch later, subscriptions) and Instagram Graph API (business/creator accounts). Upload paths: Google Takeout watch-history.json, TikTok Video Browsing History, Instagram export. Files are stream-parsed in chunks with checkpoints — a crashed worker resumes, never restarts.',
  },
  {
    n: '04', t: 'ASYNC PROCESSING', id: 'processing',
    body: 'The UI never calls the LLM synchronously. Your job runs on dedicated queues (parse_export, generate_blueprint) with per-queue concurrency and rate limits. Status streams to you over SSE: queued → ingest → embed → cluster → extract → match → compose → ready.',
  },
  {
    n: '05', t: 'VECTOR MAPPING', id: 'vector',
    body: 'Every title+tags+channel is embedded (1536-dim, HNSW cosine), clustered into 15–40 themes, and labeled by an LLM as the latent skill it implies. Skills are matched against a curated opportunity catalog, then hard-filtered by your constraints. The rationale is shown to you — that is the "how did it know?" moment.',
  },
  {
    n: '06', t: 'BLUEPRINT', id: 'blueprint',
    body: 'One object, tier-gated nodes. Basic (free): 14 days of named free resources, deliverables, self-checks, a $0 stack, and 3 outreach scripts. Premium: automation workflows, retainer templates, lead-gen tooling — masked server-side until unlock.',
  },
  {
    n: '07', t: 'PAYWALL', id: 'paywall',
    body: 'The basic blueprint renders behind a partial blur with a single unlock CTA. One-time payment, 14-day refund. The wall sits exactly where manual effort stops scaling.',
  },
  {
    n: '08', t: 'MONETIZATION SURFACES', id: 'monetize',
    body: '1-Click Deploy ($79): your stack provisioned via partner APIs with affiliate attribution. Buy-Out License ($199): lock an opportunity to your ZIP/FSA — a real prune mechanic, never fake. Trend Alerts ($19/mo): early access to rising trajectories. Marketplace (Phase 3): 20% take, escrow.',
  },
];

const CODE_SAMPLE = `-- GlobalDensity (FR-SAT-01) — nightly + on-demand
SELECT clamp(
  w1 * search_trajectory_factor   -- slope, not volume
+ w2 * active_blueprint_ratio     -- users on model / TAM proxy
+ w3 * marketplace_supply_factor  -- gig supply for the model
, 0, 100) AS global_density
FROM category_weight_config
WHERE opportunity_id = $1;

-- LocalDensity (FR-SAT-05) — PostGIS, real count
SELECT COUNT(*) FROM blueprints b
WHERE ST_DWithin(b.geo_point, $user_geo, 40233.6)  -- 25 miles
  AND b.opportunity_id = $opp AND b.suppressed = false;`;

export default function HowItWorksPage() {
  return (
    <div className="wrap" style={{ maxWidth: '880px', paddingTop: '48px' }}>
      <div className="cell cell-pad-lg" style={{ marginBottom: '40px' }}>
        <p className="tagline" style={{ color: 'var(--accent)', letterSpacing: '0.2em', fontSize: '12px' }}>▮ THE LOOP</p>
        <h2 style={{ marginTop: '8px' }}>8 MOVES. ONE ARTIFACT BEFORE ANY PAYMENT ASK.</h2>
        <p className="dim" style={{ marginTop: '12px' }}>
          Every screen has a job. The system is engineered so the tangible value lands first,
          and the paywalls only gate the parts that create momentum.
        </p>
      </div>

      {STEPS.map((s, i) => (
        <section key={s.n} id={s.id} className="cell cell-pad" style={{ marginBottom: '14px' }}>
          <div className="spread" style={{ marginBottom: '10px' }}>
            <h3><span style={{ color: 'var(--accent)' }}>/{s.n}</span> {s.t}</h3>
            <span className="badge">{i < 5 ? 'CORE LOOP' : 'VALUE ENGINE'}</span>
          </div>
          <p className="dim small">{s.body}</p>
        </section>
      ))}

      <section className="section" style={{ paddingBottom: '60px' }}>
        <SectionHead idx="09" title="THE SATURATION ENGINE" />
        <p className="dim" style={{ marginBottom: '16px' }}>
          Density is displayed to one decimal place on purpose — it reads like instrument
          telemetry. Rising slope raises density faster. Every number is real; every surface
          links to its disclosure.
        </p>
        <CodeBlock title="SQL — DENSITY MATH (PGVECTOR + POSTGIS)" code={CODE_SAMPLE} />
      </section>
    </div>
  );
}
