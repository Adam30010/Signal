import { pageMeta } from '@/lib/meta';
import { SectionHead } from '@/components/Shared';

export const metadata = pageMeta({
  title: 'Privacy Policy',
  description:
    'SIGNAL privacy policy — PIPEDA, CCPA/CPRA, Quebec Law 25. Data rights, opt-out of being counted, self-serve deletion, honest telemetry.',
  path: '/privacy',
});

const SECTIONS = [
  ['WHAT WE COLLECT', [
    'Quiz answers (anonymous session UUID before account creation)',
    'Consumption events from connected sources (titles, channels, tags, timestamps)',
    'Uploaded exports (Google Takeout, TikTok, Instagram) — stream-parsed, never stored beyond processing needs',
    'OAuth tokens — encrypted at rest (libsodium secretbox, KMS keys), never logged',
    'Email (magic-link only) and postal region for geo-fencing',
  ]],
  ['HOW WE USE IT', [
    'Vector mapping: embed → cluster → skill extraction → opportunity match',
    'Blueprint generation and personalization',
    'Local Density counts — aggregate only, with opt-out (see below)',
    'Support, billing, and legal obligations',
  ]],
  ['YOUR RIGHTS (PIPEDA / CCPA / QUEBEC LAW 25)', [
    'Access and export: request a JSON export of all personal data',
    'Deletion: one-click self-serve deletion from your account panel; derived rows including embeddings purged within 30 days',
    'Correction, restriction, portability per applicable law',
    'Quebec residents: French-language notices available on request; privacy officer contact via /contact',
  ]],
  ['BEING COUNTED (LOCAL DENSITY)', [
    'Your blueprint contributes to the local operator count only while consent_counted is true',
    'Opt out anytime — your own product experience is not degraded by opting out (ETH-06)',
    'Counts are aggregates; identities and coordinates are never exposed to other users (FR-SAT-09, ETH-03)',
  ]],
  ['COOKIES & ANALYTICS', [
    'Necessary: quiz session UUID, theme preference, UTM attribution, cookie consent',
    'Analytics logging only runs with your consent (cookie banner)',
    'No cross-site trackers, no ad networks, no third-party fingerprinting',
  ]],
  ['DATA RESIDENCY & RETENTION', [
    'US and Canadian user data processed under a signed DPA; residency region documented in production config',
    'Backups encrypted; retention aligned to legal requirements and the 30-day deletion window',
  ]],
];

export default function PrivacyPage() {
  return (
    <div className="wrap" style={{ maxWidth: '820px', paddingTop: '48px' }}>
      <div className="spread" style={{ marginBottom: '10px' }}>
        <h2>PRIVACY POLICY</h2>
        <span className="badge">PIPEDA · CCPA/CPRA · LAW 25</span>
      </div>
      <p className="faint xs" style={{ marginBottom: '28px' }}>LAST UPDATED 2026-08-28 · VERSION 1.0</p>

      {SECTIONS.map(([t, items], i) => (
        <section key={t} className="cell cell-pad" style={{ marginBottom: '12px' }}>
          <h3 style={{ marginBottom: '10px' }}><span style={{ color: 'var(--accent)' }}>/{String(i + 1).padStart(2, '0')}</span> {t}</h3>
          <ul>
            {items.map((it) => (
              <li key={it} style={{ padding: '6px 0', borderBottom: '1px dashed var(--line-soft)', color: 'var(--dim)', fontSize: '13.5px' }}>
                {it}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="section" style={{ paddingBottom: '60px' }}>
        <SectionHead idx="99" title="CONTACT THE PRIVACY OFFICER" />
        <p className="dim" style={{ marginBottom: '16px' }}>
          Privacy questions, data requests, or Quebec Law 25 matters: privacy@signal.app or via the contact form.
        </p>
        <a href="/contact" className="btn">CONTACT FORM →</a>
      </section>
    </div>
  );
}
