'use client';

import { useMemo, useState } from 'react';
import { OPPORTUNITIES } from '@/lib/content';
import { PRICING } from '@/lib/site';
import { useUI } from '@/components/ui/UIProvider';
import { CodeBlock } from '@/components/Shared';
import CopyButton from '@/components/ui/CopyButton';

// Basic Blueprint (FR-BP): 14-day roadmap, $0 stack, outreach scripts —
// rendered behind a partial blur with a single unlock CTA (FR-TR-01).
// Unlock is cosmetic-only here; server-side gating is the production rule
// (FR-BP-11).
export default function BlueprintPage() {
  const { openModal, showToast } = useUI();
  const [unlocked, setUnlocked] = useState(false);
  const [doneDays, setDoneDays] = useState({});
  const opp = OPPORTUNITIES[0];

  const days = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        day: i + 1,
        title: [
          'Set up your workspace + Notion war-room',
          'Watch: Blender Beginner Course (ep 1–3)',
          'Deliverable: 3 reference boards for your niche',
          'Watch: Lighting fundamentals (ep 4–6)',
          'Deliverable: 1 lit scene study',
          'Watch: Hard-surface modeling (ep 7–9)',
          'Deliverable: 1 hero asset, blockout',
          'Texturing: PBR basics + Substance trial',
          'Deliverable: textured hero asset',
          'Presentation: 3 renders + breakdown sheet',
          'Pricing research: 5 archviz/studio rates',
          'Draft outreach script v1 (DM variant)',
          'Portfolio page: free domain alias + 3 shots',
          'SHIP: post artifact + first 5 outreach DMs',
        ][i],
        resource: [
          'notion.so — free plan',
          'youtube.com — Blender Guru Beginner',
          '—',
          'youtube.com — Unreal 5 lighting docs',
          '—',
          'youtube.com — Hard-surface series',
          '—',
          'substance3d.adobe.com — trial',
          '—',
          '—',
          'upwork.com rate data',
          '—',
          'framer.com / netlify — free tier',
          '—',
        ][i],
      })),
    []
  );

  const premiumNodes = [
    'Make.com scenario: lead capture → CRM → follow-up (importable JSON)',
    'Retainer template: contract + SOW + pricing ladder, local rates pre-filled',
    'Lead-gen tooling: local prospect queue (rate-limited, ToS-scoped)',
    'Automated outreach sequence: DM/email variants + reply routing',
  ];

  const scripts = [
    { v: 'DM', t: `Hey — I saw [LOCAL STUDIO]'s recent project. I build 3D environment assets (scene, lighting, final renders). 3 free samples, no strings. — ${opp.title.split(' ')[0]}`, ok: true },
    { v: 'EMAIL', t: `Subject: 3 free environment renders for ${'[PROJECT]'}\n\nHi ${'[NAME]'}, I work in environment art — here are 3 samples matched to your style. If useful, I'm available for a single scene or a monthly retainer. — ${'[YOU]'}`, ok: false },
    { v: 'IN-PERSON', t: `At [LOCAL EVENT/STUDIO TOUR]: "I do environment art for games — your lighting on [PROJECT] stood out. Here's my card; happy to do one free scene for your next build."`, ok: false },
  ];

  const unlock = () => {
    if (!unlocked) {
      openModal({
        title: 'UNLOCK FULL ROADMAP',
        body: (
          <div>
            <p className="small dim" style={{ marginBottom: '14px' }}>
              One-time unlock. 14-day refund policy. No subscription.
            </p>
            <div className="spread" style={{ marginBottom: '10px' }}>
              <span className="small uppercase">UNLOCK</span>
              <span className="amt" style={{ fontSize: '26px', fontWeight: 700 }}>${PRICING.unlock.usd} USD</span>
            </div>
            <p className="faint xs">CAD ${PRICING.unlock.cad} · STRIPE CHECKOUT · REFUNDS /PRIVACY</p>
          </div>
        ),
        confirmLabel: 'UNLOCK NOW →',
        onConfirm: () => {
          setUnlocked(true);
          showToast('Roadmap unlocked — premium nodes revealed');
        },
      });
    }
  };

  const toggleDay = (d) => {
    setDoneDays((prev) => ({ ...prev, [d]: !prev[d] }));
    if (!doneDays[d]) {
      const count = Object.values(doneDays).filter(Boolean).length + 1;
      if (count === 3) {
        openModal({
          title: 'SCRIPTS WORKING?',
          body: (
            <p className="small dim">
              You&apos;ve completed 3 nodes. This is exactly where manual effort stops scaling —
              the automation behind the wall takes over from here. (Contextual upsell, FR-TR-04.)
            </p>
          ),
          confirmLabel: 'VIEW AUTOMATION',
          onConfirm: () => {
            setUnlocked(true);
            showToast('Premium tier revealed');
          },
        });
      }
    }
  };

  return (
    <div className="wrap" style={{ maxWidth: '920px', paddingTop: '48px', paddingBottom: '80px' }}>
      <div className="spread" style={{ marginBottom: '20px' }}>
        <h2>YOUR BLUEPRINT</h2>
        <span className="badge badge-accent">STEP 4 / 5</span>
      </div>

      {/* Opportunity header */}
      <div className="cell cell-pad" style={{ marginBottom: '24px' }}>
        <div className="spread">
          <div>
            <p className="faint xs" style={{ letterSpacing: '0.12em' }}>MATCHED OPPORTUNITY · CONF 0.91</p>
            <h3 style={{ marginTop: '4px' }}>{opp.title}</h3>
          </div>
          <div className="meter" style={{ minWidth: '180px', padding: '12px' }}>
            <span className="xs faint">GLOBAL DENSITY</span>
            <div className="meter-value" style={{ fontSize: '30px' }}>{opp.base_density}%</div>
            <div className="meter-bar" style={{ margin: '6px 0' }}><div className="fill" style={{ width: `${opp.base_density}%` }} /></div>
            <span className="faint xs">3 OPERATORS WITHIN 25 MI · <a href="/faq" style={{ textDecoration: 'underline' }}>REAL COUNT</a></span>
          </div>
        </div>
        <p className="dim small" style={{ marginTop: '12px' }}>{opp.match}</p>
      </div>

      <div className={`blur-gate ${unlocked ? 'open' : ''}`} style={{ position: 'relative' }}>
        {/* PHASE 1 — Basic (free) */}
        <div className="bp-phase" style={{ marginBottom: '20px' }}>
          <div className="bp-phase-head">
            <span>PHASE 1 — ZERO-TO-ONE · 14 DAYS · $0</span>
            <span className="badge">FREE TIER</span>
          </div>
          {days.map((d) => (
            <div className="bp-day" key={d.day}>
              <span className="d">D{String(d.day).padStart(2, '0')}</span>
              <div className="task">
                {d.title}
                {d.resource !== '—' && <div className="meta">RESOURCE: {d.resource}</div>}
              </div>
              <button
                type="button"
                className={`chk ${doneDays[d.day] ? 'done' : ''}`}
                onClick={() => toggleDay(d.day)}
                aria-label={`Mark day ${d.day} done`}
                title="Mark done"
              >
                {doneDays[d.day] ? '■' : '□'}
              </button>
            </div>
          ))}
        </div>

        {/* $0 stack */}
        <div className="bp-phase" style={{ marginBottom: '20px' }}>
          <div className="bp-phase-head"><span>YOUR $0 FREE-TIER STACK</span><span className="badge">PINNED TO MODEL</span></div>
          <div className="cell-pad">
            <div className="grid g3" style={{ gap: '10px' }}>
              {[
                ['CALENDAR', 'cal.com — FREE PLAN', '1 event type, unlimited bookings'],
                ['OPS', 'notion.so — FREE', 'unlimited pages, 5 guests'],
                ['DESIGN', 'canva.com — FREE', 'brand kit, 250 templates/mo'],
                ['DOMAIN', 'framer.com — free subdomain alias', 'no custom domain on free tier'],
                ['INVOICING', 'stripe.com — no monthly fee', '2.9% + 30¢ per transaction'],
                ['CRM', 'notion kanban — $0', 'upgrade path: $12/mo at scale'],
              ].map(([k, v, d]) => (
                <div className="cell-soft cell-pad" key={k} style={{ padding: '12px' }}>
                  <p className="xs faint" style={{ letterSpacing: '0.1em' }}>{k}</p>
                  <p className="small" style={{ marginTop: '4px' }}>{v}</p>
                  <p className="faint xs" style={{ marginTop: '4px' }}>{d}</p>
                </div>
              ))}
            </div>
            <p className="faint xs" style={{ marginTop: '10px' }}>
              NO &quot;CONSIDER A CRM&quot; — NAMES, LINKS, FREE-TIER LIMITS. ALWAYS.
            </p>
          </div>
        </div>

        {/* Outreach scripts */}
        <div className="bp-phase">
          <div className="bp-phase-head"><span>OUTREACH SCRIPTS · 3 VARIANTS</span><span className="badge badge-accent">PERSONALIZED</span></div>
          <div className="cell-pad">
            {scripts.map((s) => (
              <div key={s.v} className="cell-soft" style={{ marginBottom: '10px' }}>
                <div className="spread" style={{ padding: '8px 12px', borderBottom: '1px solid var(--line-soft)' }}>
                  <span className="xs" style={{ letterSpacing: '0.12em' }}>VARIANT: {s.v}</span>
                  <CopyButton text={s.t} className="btn-ghost" />
                </div>
                <pre style={{ padding: '12px', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'var(--dim)' }}>{s.t}</pre>
              </div>
            ))}
            <p className="faint xs">COMPLIANCE HEADER ATTACHED: CASL (CA) / CAN-SPAM (US) CONSENT CHECKLIST (ETH-08)</p>
          </div>
        </div>
      </div>

      {/* PHASE 2 — Premium (behind the wall) */}
      {!unlocked ? (
        <div className="cell cell-pad-lg" style={{ marginTop: '24px', textAlign: 'center' }}>
          <span className="lock-badge">▣ PREMIUM NODES BEHIND WALL</span>
          <h3 style={{ marginTop: '12px' }}>PHASE 2 — THRIVE &amp; EXPAND</h3>
          <p className="dim small" style={{ margin: '12px auto 18px', maxWidth: '52ch' }}>
            The wall sits exactly where manual effort stops scaling: automation, retainer
            templates, and lead-gen tooling. Everything above stays free.
          </p>
          <button type="button" className="btn btn-accent btn-lg" onClick={unlock}>
            UNLOCK FULL ROADMAP — ${PRICING.unlock.usd} USD →
          </button>
          <p className="faint xs" style={{ marginTop: '10px' }}>
            ONE-TIME · CAD ${PRICING.unlock.cad} · 14-DAY REFUND · NO FAKE COUNTDOWNS (ETH-04)
          </p>
        </div>
      ) : (
        <div className="bp-phase" style={{ marginTop: '24px' }} id="premium">
          <div className="bp-phase-head"><span>PHASE 2 — THRIVE &amp; EXPAND</span><span className="badge badge-accent">PREMIUM</span></div>
          <div className="cell-pad">
            {premiumNodes.map((n, i) => (
              <div key={i} className="bp-day">
                <span className="d" style={{ color: 'var(--accent)' }}>P{i + 1}</span>
                <div className="task">{n}</div>
              </div>
            ))}
            <div style={{ marginTop: '14px' }}>
              <CodeBlock
                title="MAKE.COM SCENARIO — EXPORTED JSON (LEAD CAPTURE → CRM → FOLLOW-UP)"
                code={`{
  "scenario": "lead_capture_followup_v1",
  "trigger": { "type": "webhook", "path": "/inbound/lead" },
  "steps": [
    { "action": "crm.create_contact", "tool": "notion", "db": "Leads" },
    { "action": "email.send", "tool": "resend", "template": "followup_d1" },
    { "action": "delay", "days": 3 },
    { "action": "email.send", "tool": "resend", "template": "followup_d4" }
  ],
  "rate_limit": "10 req/min",
  "compliance": { "casl_consent_field": true, "unsubscribe_header": true }
}`}
              />
            </div>
          </div>
        </div>
      )}

      <p className="faint xs" style={{ marginTop: '18px', textAlign: 'center' }}>
        SERVER-SIDE GATING IS THE PRODUCTION RULE (FR-BP-11) · NODES IMMUTABLE · VERSIONED REGENERATION
      </p>
    </div>
  );
}
