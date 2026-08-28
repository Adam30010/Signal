'use client';

import { useState } from 'react';
import { useUI } from '@/components/ui/UIProvider';

// Platform settings & security: site config, feature toggles, backups, 2FA.
export default function AdminSettings() {
  const { openModal, showToast } = useUI();
  const [flags, setFlags] = useState({
    maintenance: false,
    promoBanner: true,
    betaUnlock: false,
    marketplacePreview: true,
    densityV2Weights: false,
  });
  const [twoFA, setTwoFA] = useState(true);
  const [config, setConfig] = useState({
    siteTitle: 'SIGNAL',
    defaultLocale: 'en',
    timezone: 'America/Halifax',
    accentColor: '#00ff9c',
    supportEmail: 'support@signal.app',
  });

  const toggleFlag = (k) => {
    setFlags((f) => ({ ...f, [k]: !f[k] }));
    showToast(`Feature toggle: ${k} → ${!flags[k] ? 'ON' : 'OFF'} (applied without redeploy)`);
  };

  const saveConfig = () => {
    openModal({
      title: 'CONFIG SAVED',
      body: <p className="small dim">Site configuration persisted. Accent color change requires a rebuild of the design tokens (globals.css).</p>,
      confirmLabel: 'OK',
    });
  };

  const runBackup = () => {
    openModal({
      title: 'BACKUP TRIGGERED',
      body: <p className="small dim">Manual PostgreSQL snapshot + object-storage sync queued. PITR window: 5 min. Restore drill: quarterly (NFR-14).</p>,
      confirmLabel: 'OK',
    });
  };

  const rows = [
    ['MAINTENANCE MODE', flags.maintenance, '503 for all visitors except admins'],
    ['PROMO BANNER', flags.promoBanner, 'Landing banner: "14-day refunds on all paid tiers"'],
    ['BETA — BUY-OUT LICENSE', flags.betaUnlock, 'Phase 2 feature behind flag'],
    ['MARKETPLACE PREVIEW', flags.marketplacePreview, 'Phase 3 teaser on pricing'],
    ['DENSITY WEIGHTS V2', flags.densityV2Weights, 'Tunable per-category weights (FR-SAT-03)'],
  ];

  return (
    <div className="page-enter">
      <div className="spread" style={{ marginBottom: '16px' }}>
        <h2>SETTINGS &amp; SECURITY</h2>
        <span className="badge badge-accent">OPERATOR TIER</span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="cell cell-pad">
          <h3 style={{ marginBottom: '12px' }}>SITE CONFIGURATION</h3>
          {Object.entries(config).map(([k, v]) => (
            <div className="field" key={k}>
              <label htmlFor={`cfg-${k}`}>{k.toUpperCase().replace(/([A-Z])/g, ' $1')}</label>
              <input id={`cfg-${k}`} value={v} onChange={(e) => setConfig((c) => ({ ...c, [k]: e.target.value }))} />
            </div>
          ))}
          <button type="button" className="btn btn-accent btn-block" onClick={saveConfig}>SAVE CONFIGURATION</button>
        </div>

        <div className="cell cell-pad">
          <h3 style={{ marginBottom: '12px' }}>FEATURE TOGGLES</h3>
          {rows.map(([label, val, desc]) => (
            <div key={label} className="spread" style={{ padding: '10px 0', borderBottom: '1px dashed var(--line-soft)' }}>
              <div>
                <span className="small uppercase">{label}</span>
                <p className="faint xs">{desc}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={val}
                className="toggle"
                onClick={() => toggleFlag(label.toLowerCase().replace(/[^a-z]+/g, '_').replace(/^_|_$/g, ''))}
                aria-label={label}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: '16px' }}>
        <div className="cell cell-pad">
          <h3 style={{ marginBottom: '12px' }}>SECURITY</h3>
          <div className="spread" style={{ padding: '8px 0', borderBottom: '1px dashed var(--line-soft)' }}>
            <span className="small uppercase">2FA ENFORCEMENT</span>
            <button type="button" role="switch" aria-checked={twoFA} className="toggle" onClick={() => { setTwoFA(!twoFA); showToast(`2FA ${!twoFA ? 'enforced' : 'relaxed'} (SEC-09)`); }} aria-label="Toggle 2FA enforcement" />
          </div>
          <p className="faint xs" style={{ marginTop: '12px' }}>
            SSO + HARDWARE-KEY MFA · SCOPED ROLES · SECURITY TOKEN ROTATION 90D · CSP REPORTING ENABLED
          </p>
        </div>
        <div className="cell cell-pad">
          <h3 style={{ marginBottom: '12px' }}>BACKUPS</h3>
          <p className="small dim" style={{ marginBottom: '12px' }}>
            PostgreSQL PITR (RPO ≤ 5 min) · nightly snapshots · encrypted · object storage replicated.
            Last automatic backup: 2026-08-28 02:00 UTC.
          </p>
          <button type="button" className="btn btn-block" onClick={runBackup}>RUN MANUAL BACKUP NOW</button>
        </div>
      </div>
    </div>
  );
}
