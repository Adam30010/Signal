import { pageMeta } from '@/lib/meta';
import { PRICING } from '@/lib/site';

export const metadata = pageMeta({
  title: 'Terms of Service',
  description:
    'SIGNAL terms of service — honest telemetry, buy-out license mechanics, 14-day refunds, CASL/CAN-SPAM compliance, lead-gen boundaries.',
  path: '/terms',
});

const SECTIONS = [
  ['1. THE PRODUCT', 'SIGNAL converts your digital consumption into a validated opportunity and a tiered blueprint. The basic tier is free forever. Premium features are one-time unlocks or subscriptions as labeled.'],
  ['2. HONEST TELEMETRY', 'All density scores, local counts, and alerts are derived from real data. We do not fabricate scarcity. Where a mechanic affects other users (the Buy-Out License), it is disclosed plainly before purchase.'],
  ['3. BUY-OUT LICENSE', 'A license permanently locks an opportunity to your postal region (US ZIP5 / Canadian FSA). Existing blueprints in that region are suppressed and future generation excludes the opportunity there. The buyer identity is never revealed to other users.'],
  ['4. FEES & REFUNDS', `Launch pricing: Unlock $${PRICING.unlock.usd} USD / $${PRICING.unlock.cad} CAD; Deploy $${PRICING.deploy.usd} / $${PRICING.deploy.cad}; License $${PRICING.license.usd} / $${PRICING.license.cad}; Trend alerts $${PRICING.alerts.usd}/mo / $${PRICING.alerts.cad}/mo. 14-day refunds on unlock, deploy, and license (refund un-prunes). Subscriptions cancel in one click.`],
  ['5. OUTREACH & COMPLIANCE', 'Generated outreach scripts include compliance headers. You are responsible for CASL (Canada) and CAN-SPAM (US) consent, platform ToS, and local business-communication laws when using them.'],
  ['6. LEAD-GEN BOUNDARIES', 'Premium lead-gen tooling is rate-limited, scoped to public business listings, and must be used only for your own outreach. Scraping personal data or violating source terms terminates access.'],
  ['7. MARKETPLACE (PHASE 3)', 'Vetted workers only. Payment is escrowed and released to the worker only on your acceptance or dispute resolution. The platform takes a 20% fee.'],
  ['8. ACCEPTABLE USE', 'No fraud, no reselling blueprint outputs, no fake reviews, no manipulating density mechanics, no harvesting other users\' data. 18+ only.'],
  ['9. DISCLAIMERS', 'Outcomes are not guaranteed. Density is a signal, not a promise. The service is provided as-is within applicable law (US + Canada).'],
  ['10. CHANGES & CONTACT', 'Terms may evolve; material changes are announced. Questions: /contact.'],
];

export default function TermsPage() {
  return (
    <div className="wrap" style={{ maxWidth: '820px', paddingTop: '48px' }}>
      <div className="spread" style={{ marginBottom: '28px' }}>
        <h2>TERMS OF SERVICE</h2>
        <span className="badge">V1.0 · 2026-08-28</span>
      </div>
      {SECTIONS.map(([h, body]) => (
        <section key={h} className="cell cell-pad" style={{ marginBottom: '10px' }}>
          <h3 style={{ marginBottom: '8px' }}>{h}</h3>
          <p className="dim small">{body}</p>
        </section>
      ))}
    </div>
  );
}
