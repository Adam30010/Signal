import { pageMeta } from '@/lib/meta';
import { FAQAccordion, SectionHead } from '@/components/Shared';
import { FAQ_ITEMS } from '@/lib/faq';

export const metadata = pageMeta({
  title: 'FAQ',
  description:
    'Frequently asked questions about SIGNAL — data sources, TikTok uploads, the density score, buy-out license mechanics, refunds, compliance, and more.',
  path: '/faq',
});

export default function FaqPage() {
  return (
    <div className="wrap" style={{ maxWidth: '820px', paddingTop: '48px' }}>
      <div className="spread" style={{ marginBottom: '28px' }}>
        <h2>FREQUENTLY ASKED QUESTIONS</h2>
        <span className="badge badge-accent">{FAQ_ITEMS.length} ITEMS</span>
      </div>
      <div id="density">
        <FAQAccordion items={FAQ_ITEMS} />
      </div>

      <section className="section">
        <SectionHead idx="30" title="STILL STUCK?" />
        <div className="cell cell-pad-lg" style={{ textAlign: 'center' }}>
          <p className="dim" style={{ marginBottom: '18px' }}>We answer within 24 hours. Real humans, no bots.</p>
          <a href="/contact" className="btn btn-accent">CONTACT SUPPORT →</a>
        </div>
      </section>
    </div>
  );
}
