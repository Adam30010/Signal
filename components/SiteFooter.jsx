import Link from 'next/link';
import BrandMark from '@/components/BrandMark';
import { LINKS, PRICING, SITE } from '@/lib/site';

const COLS = [
  {
    title: 'PRODUCT',
    links: [
      { href: LINKS.quiz, label: 'Constraint Quiz' },
      { href: LINKS.ingest, label: 'Data Ingestion' },
      { href: LINKS.blueprint, label: 'Blueprint' },
      { href: LINKS.pricing, label: 'Pricing' },
      { href: '/how-it-works', label: 'How It Works' },
    ],
  },
  {
    title: 'COMPANY',
    links: [
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/admin', label: 'Admin' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="cols">
          <div>
            <p className="brand" style={{ fontSize: '15px' }}>
              <BrandMark height={16} />{SITE.name}
            </p>
            <p className="dim small" style={{ marginTop: '10px', maxWidth: '38ch' }}>
              {SITE.tagline} Your existing consumption is a latent skill. We surface it,
              validate it against real opportunities, and hand you a 14-day free roadmap.
            </p>
            <p className="faint xs" style={{ marginTop: '12px' }}>
              LAUNCH GEO: {SITE.geo} · PRICING: USD / CAD
            </p>
          </div>
          {COLS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h4>{c.title}</h4>
              {c.links.map((l) => (
                <Link key={l.href} href={l.href} className="foot-link">{l.label}</Link>
              ))}
            </nav>
          ))}
          <div>
            <h4>TELEMETRY</h4>
            <p className="faint xs" style={{ marginBottom: '10px' }}>
              Density scores are real data — never fabricated. Disclosure on every surface.
            </p>
            <p className="faint xs">UNLOCK ${PRICING.unlock.usd} USD / ${PRICING.unlock.cad} CAD</p>
            <p className="faint xs">DEPLOY ${PRICING.deploy.usd} / ${PRICING.deploy.cad}</p>
            <p className="faint xs">LICENSE ${PRICING.license.usd} / ${PRICING.license.cad}</p>
            <p className="faint xs">ALERTS ${PRICING.alerts.usd}/MO / ${PRICING.alerts.cad}/MO</p>
          </div>
        </div>
        <div className="footer-bar">
          <span>© 2026 {SITE.name}. ALL RIGHTS RESERVED.</span>
          <span>LEARN FOR FREE. PAY TO SCALE.</span>
          <span>LAST UPDATED {SITE.lastUpdated}</span>
        </div>
      </div>
    </footer>
  );
}
