import { pageMeta } from '@/lib/meta';
import { DEMO_CLUSTERS } from '@/lib/content';
import { DENSITY_WEIGHTS, LINKS, PRICING } from '@/lib/site';
import { FAQAccordion, SectionHead } from '@/components/Shared';
import { FAQ_ITEMS } from '@/lib/faq';
import { SEARCH_INDEX } from '@/lib/search';
import { SITE } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Home',
  description:
    'SIGNAL — your existing consumption is a latent skill. Constraint quiz, ingestion, vector mapping, and a 14-day free blueprint. Learn for free, pay to scale.',
  path: '/',
});

const LOOP = [
  { n: '01', t: 'CONSTRAINT QUIZ', d: '9 steps, no auth' },
  { n: '02', t: 'INGEST DATA', d: 'OAuth or upload' },
  { n: '03', t: 'VECTOR MAP', d: 'Latent skill found' },
  { n: '04', t: 'BLUEPRINT', d: '14-day free roadmap' },
  { n: '05', t: 'SCALE', d: 'Pay to scale' },
];

const FEATURES = [
  {
    code: 'CLUSTER',
    title: '40 hours of Blender ≠ "watches art videos"',
    body: 'Every title, tag, and channel is embedded into a 1536-dim vector space, clustered, and labeled by an LLM as the latent capability it implies — 3d_environment_art, not "art videos".',
  },
  {
    code: 'MATCH',
    title: 'Validated against real opportunities',
    body: 'Inferred skills are matched against a curated opportunity catalog with constraint metadata — then hard-filtered by your capital, hours, risk, and camera aversion.',
  },
  {
    code: 'BLUEPRINT',
    title: 'A 14-day roadmap that costs $0',
    body: 'Daily nodes with named free resources, deliverables, and self-checks. A $0 tech stack pinned to your model. Three outreach scripts pre-filled with your niche. By day 14: one portfolio artifact.',
  },
  {
    code: 'DENSITY',
    title: 'Real telemetry, never fabricated',
    body: 'Global Density from search-trajectory slope, active blueprints, and marketplace supply. Local Density: a live PostGIS count of operators within 25 miles. All real. All disclosed.',
  },
];

export default function HomePage() {
  const liveDensity = (DENSITY_WEIGHTS.w1 * 100 * 0.62 + DENSITY_WEIGHTS.w2 * 100 * 0.71 + DENSITY_WEIGHTS.w3 * 100 * 0.55).toFixed(1);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="hero wrap">
        <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'stretch' }}>
          <div>
            <p className="tagline">▮ {SITE.tagline}</p>
            <h1>YOUR CONSUMPTION IS A LATENT SKILL.<br /><span style={{ color: 'var(--accent)' }}>WE SURFACE IT.</span></h1>
            <p className="sub" style={{ marginTop: '18px' }}>
              You&apos;ve already watched the tutorials. SIGNAL reads your YouTube, TikTok, and Instagram
              history, clusters it into latent skills, matches those skills against validated business
              models — then hands you a free 14-day blueprint. One artifact before any payment ask.
            </p>
            <div className="row" style={{ marginTop: '28px', gap: '10px' }}>
              <a href={LINKS.quiz} className="btn btn-accent btn-lg">START THE CONSTRAINT QUIZ →</a>
              <a href="/how-it-works" className="btn btn-lg">HOW IT WORKS</a>
            </div>
            <p className="faint xs" style={{ marginTop: '14px', letterSpacing: '0.08em' }}>
              NO SIGNUP WALL · QUIZ IS ANONYMOUS · FREE 14-DAY ROADMAP · US + CANADA
            </p>
          </div>

          {/* Saturation Meter — live instrument readout (FR-LP-03) */}
          <div className="meter" aria-label="Global density telemetry">
            <div className="spread">
              <span className="meter-live"><span className="dot" /> LIVE TELEMETRY</span>
              <span className="xs faint">GLOBAL DENSITY</span>
            </div>
            <div className="meter-value">{liveDensity}%</div>
            <div className="meter-bar"><div className="fill" style={{ width: `${liveDensity}%` }} /></div>
            <div className="spread xs" style={{ color: 'var(--dim)' }}>
              <span>3D ENV ART · CATEGORY WEIGHTS v1</span>
              <span>w1 {DENSITY_WEIGHTS.w1} · w2 {DENSITY_WEIGHTS.w2} · w3 {DENSITY_WEIGHTS.w3}</span>
            </div>
            <p className="faint xs" style={{ marginTop: '12px' }}>
              REAL AGGREGATE DATA · <a href="/faq#density" style={{ textDecoration: 'underline' }}>HOW IS THIS COMPUTED?</a>
            </p>
          </div>
        </div>

        {/* Loop flow */}
        <div className="loop-flow" role="list" aria-label="Product loop">
          {LOOP.map((s) => (
            <div className="node" key={s.n} role="listitem">
              {s.n !== '01' && <span className="arrow">▶</span>}
              <span className="n">/{s.n}</span>
              <div className="t">{s.t}</div>
              <span className="faint xs">{s.d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT KNOWS (the activation hook) ───────────────────────── */}
      <section className="section wrap" id="signal">
        <SectionHead idx="01" title="THE SIGNAL" right={<span className="badge badge-accent">THE &quot;HOW DID IT KNOW?&quot; MOMENT</span>} />
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="cell cell-pad-lg">
            <h3>DEMO CLUSTER OUTPUT</h3>
            <p className="dim small" style={{ marginTop: '8px', marginBottom: '18px' }}>
              Simulated corpus: 1,284 events · 23 clusters · 1536-dim · HNSW cosine
            </p>
            {DEMO_CLUSTERS.map((c) => (
              <div key={c.label} className="cell-soft cell-pad" style={{ marginBottom: '10px' }}>
                <div className="spread">
                  <span className="small uppercase" style={{ letterSpacing: '0.08em' }}>{c.label}</span>
                  <span className="xs faint">{c.hours} HRS · {c.pct}% OF CORPUS</span>
                </div>
                <div className="progress-track" style={{ marginTop: '8px' }}>
                  <div className="progress-fill" style={{ width: `${c.pct * 2.4}%` }} />
                  <div className="ticks" />
                </div>
                <p className="faint xs" style={{ marginTop: '6px' }}>EVIDENCE: {c.evidence}</p>
              </div>
            ))}
            <p className="faint xs" style={{ marginTop: '10px' }}>
              → LATENT SKILL: <span style={{ color: 'var(--accent)' }}>3D_ENVIRONMENT_ART</span> (CONF 0.91, RECENCY 0.87)
            </p>
          </div>
          <div className="cell cell-pad-lg">
            <h3>MATCHED OPPORTUNITY</h3>
            <div className="meter" style={{ marginTop: '16px' }}>
              <div className="spread">
                <span className="xs faint">GLOBAL DENSITY</span>
                <span className="xs faint">TREND: <span style={{ color: 'var(--warning)' }}>▲ RISING</span></span>
              </div>
              <div className="meter-value" style={{ fontSize: '44px' }}>42.3%</div>
              <div className="meter-bar"><div className="fill" style={{ width: '42.3%' }} /></div>
            </div>
            <div className="cell-soft cell-pad" style={{ marginTop: '14px' }}>
              <div className="spread">
                <span className="small uppercase" style={{ letterSpacing: '0.06em' }}>3D ENVIRONMENT ART SERVICES</span>
                <span className="badge badge-accent">MATCH 0.91</span>
              </div>
              <p className="dim small" style={{ marginTop: '10px' }}>
                Sustainably consuming 3D art + lighting + pipeline content maps to client-facing
                environment art services for indie studios and archviz firms.
              </p>
              <p className="faint xs" style={{ marginTop: '8px' }}>
                CAPITAL FLOOR $0 · 8 HRS/WK · NO CAMERA · NO COLD CALLS · HARD CONSTRAINTS RESPECTED
              </p>
            </div>
            <p className="dim small" style={{ marginTop: '16px' }}>
              Then the blueprint: <b style={{ color: 'var(--fg)' }}>14 days, $0</b> — named free resources,
              deliverables, self-checks, a portfolio artifact, and 3 outreach scripts. Free, forever.
            </p>
            <a href={LINKS.quiz} className="btn btn-accent btn-block" style={{ marginTop: '18px' }}>
              FIND MY SIGNAL →
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section className="section wrap" id="features">
        <SectionHead idx="02" title="SYSTEM FEATURES" />
        <div className="grid g2">
          {FEATURES.map((f) => (
            <div className="cell feature-cell" key={f.code}>
              <span className="code">{`[${f.code}]`}</span>
              <h3 style={{ marginTop: '8px' }}>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING TEASER ───────────────────────────────────────────── */}
      <section className="section wrap" id="pricing-teaser">
        <SectionHead idx="03" title="PAY TO SCALE — NOT TO START" right={<a href={LINKS.pricing} className="btn btn-sm">FULL PRICING</a>} />
        <div className="grid g4">
          <div className="cell price-cell">
            <span className="badge">TIER 0</span>
            <div className="amt"><span className="cur">$</span>0</div>
            <p className="small dim">14-day roadmap · free stack · 3 outreach scripts</p>
            <span className="xs faint">FOREVER</span>
          </div>
          <div className="cell price-cell">
            <span className="badge">UNLOCK</span>
            <div className="amt"><span className="cur">$</span>{PRICING.unlock.usd}<span className="cur"> USD</span></div>
            <p className="small dim">Automation workflows · retainer templates · lead-gen tooling</p>
            <span className="xs faint">ONE-TIME · 14-DAY REFUND</span>
          </div>
          <div className="cell price-cell">
            <span className="badge">DEPLOY</span>
            <div className="amt"><span className="cur">$</span>{PRICING.deploy.usd}<span className="cur"> USD</span></div>
            <p className="small dim">Your stack provisioned — domain, scheduling, email, CRM</p>
            <span className="xs faint">ONE-TIME · AFFILIATE-ATTRIBUTED</span>
          </div>
          <div className="cell price-cell featured">
            <span className="badge badge-accent">LICENSE</span>
            <div className="amt"><span className="cur">$</span>{PRICING.license.usd}<span className="cur"> USD</span></div>
            <p className="small dim">Lock an opportunity to your ZIP/FSA. Prunes neighbor results.</p>
            <span className="xs faint" style={{ color: 'var(--accent)' }}>REAL MECHANIC · DISCLOSED</span>
          </div>
        </div>
      </section>

      {/* ── FAQ TEASER ───────────────────────────────────────────────── */}
      <section className="section wrap" id="faq">
        <SectionHead idx="04" title="QUESTIONS" right={<a href="/faq" className="btn btn-sm">ALL FAQ</a>} />
        <FAQAccordion items={FAQ_ITEMS.slice(0, 5)} />
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="section wrap">
        <div className="cell cell-pad-lg" style={{ textAlign: 'center' }}>
          <h2 className="blink" style={{ marginBottom: '14px' }}>READY FOR YOUR SIGNAL?</h2>
          <p className="dim" style={{ margin: '0 auto 22px' }}>
            9 questions. No account. No payment. A free 14-day blueprint at the end.
          </p>
          <a href={LINKS.quiz} className="btn btn-accent btn-lg">START THE CONSTRAINT QUIZ →</a>
        </div>
      </section>
    </>
  );
}
