import { pageMeta } from '@/lib/meta';
import { PRICING } from '@/lib/site';
import { SectionHead } from '@/components/Shared';

export const metadata = pageMeta({
  title: 'Pricing',
  description:
    'SIGNAL pricing — free 14-day blueprint, $49 unlock, $79 deploy, $199 buy-out license, $19/mo trend alerts. USD + CAD. 14-day refunds. Honest telemetry.',
  path: '/pricing',
});

const TIERS = [
  {
    tier: 'TIER 0',
    price: '$0',
    sub: 'FOREVER',
    items: ['9-step constraint quiz', 'Data ingestion (OAuth + upload)', 'Vector mapping + match rationale', '14-day zero-cost blueprint', '$0 stack pinned to model', '3 outreach script variants'],
    featured: false,
  },
  {
    tier: 'UNLOCK',
    price: `$${PRICING.unlock.usd}`,
    sub: `USD ONE-TIME · CAD $${PRICING.unlock.cad}`,
    items: ['Everything in Tier 0', 'Phase 2 premium nodes revealed', 'Automation workflows (Make/Zapier JSON)', 'Retainer templates + pricing ladder', 'Lead-gen tooling (rate-limited)'],
    featured: true,
    cta: '/quiz',
  },
  {
    tier: 'DEPLOY',
    price: `$${PRICING.deploy.usd}`,
    sub: `USD ONE-TIME · CAD $${PRICING.deploy.cad}`,
    items: ['Stack auto-provisioned for you', 'Domain alias + scheduling + email + CRM', 'Partner APIs via affiliate links', 'Resource IDs in your stack panel', 'Requires premium unlock'],
    featured: false,
  },
  {
    tier: 'LICENSE',
    price: `$${PRICING.license.usd}`,
    sub: `USD ONE-TIME · CAD $${PRICING.license.cad}`,
    items: ['Lock an opportunity to your ZIP/FSA', 'Removes it from neighbors’ future results', 'Existing blueprints in region suppressed', 'Real mechanic — identity never revealed', 'Requires premium unlock'],
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="wrap" style={{ paddingTop: '48px' }}>
      <div className="cell cell-pad-lg" style={{ marginBottom: '36px' }}>
        <p className="tagline" style={{ color: 'var(--accent)', letterSpacing: '0.2em', fontSize: '12px' }}>▮ PRICING</p>
        <h2 style={{ marginTop: '8px' }}>LEARN FOR FREE.<br />PAY TO SCALE.</h2>
        <p className="dim" style={{ marginTop: '12px', maxWidth: '60ch' }}>
          The artifact comes first, always. Every paywall below sits after demonstrated value,
          ships with a 14-day refund, and carries no fake urgency (ETH-04).
        </p>
      </div>

      <div className="grid g4" style={{ marginBottom: '36px' }}>
        {TIERS.map((t) => (
          <div className={`cell price-cell ${t.featured ? 'featured' : ''}`} key={t.tier}>
            <span className={`badge ${t.featured ? 'badge-accent' : ''}`}>{t.tier}</span>
            <div className="amt"><span className="cur">$</span>{t.price.replace('$', '')}</div>
            <p className="faint xs" style={{ letterSpacing: '0.08em' }}>{t.sub}</p>
            <ul>{t.items.map((i) => <li key={i}>{i}</li>)}</ul>
            {t.cta && <a href={t.cta} className="btn btn-accent btn-block">GET STARTED →</a>}
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '60px' }}>
        <div className="cell cell-pad">
          <h3>LIVE TREND ALERTS</h3>
          <p className="small dim" style={{ marginTop: '8px' }}>
            ${PRICING.alerts.usd} USD / ${PRICING.alerts.cad} CAD per month. Push notification when an
            opportunity&apos;s search trajectory crosses a spike threshold — before Global Density
            rises. One-click unsubscribe (CASL/CAN-SPAM).
          </p>
          <p className="faint xs" style={{ marginTop: '10px' }}>PHASE 2 · SUBSCRIPTION · CANCELLATION IN ONE CLICK</p>
        </div>
        <div className="cell cell-pad">
          <h3>FULFILLMENT MARKETPLACE</h3>
          <p className="small dim" style={{ marginTop: '8px' }}>
            Don&apos;t want to build? Vetted gig-workers build your assets. Platform escrows the
            payment, takes a {PRICING.marketplaceFee * 100}% cut, and releases the worker payout only
            on your acceptance.
          </p>
          <p className="faint xs" style={{ marginTop: '10px' }}>PHASE 3 · STRIPE CONNECT · ESCROW ON DELIVERY</p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: '0' }}>
        <SectionHead idx="05" title="REFUNDS & GUARDRAILS" />
        <div className="grid g2">
          {[
            ['14-DAY REFUNDS', 'On unlock, deploy, and license. A license refund automatically un-prunes affected blueprints (FR-MP-09).'],
            ['HONEST TELEMETRY', 'Every density number is real data. Disclosure links on every surface (ETH-01/02).'],
            ['NO FAKE URGENCY', 'No countdown timers, no "3 people viewing" widgets, no expiring offers that aren\'t real (ETH-04).'],
            ['ONE-CLICK CANCEL', 'Subscriptions cancel in one click from the billing portal. Opt-out of being counted is always available (ETH-05/06).'],
          ].map(([k, v]) => (
            <div className="cell feature-cell" key={k}>
              <h3>{k}</h3>
              <p>{v}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
