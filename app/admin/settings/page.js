'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUI } from '@/components/ui/UIProvider';
import { BRAND, faviconDataUri } from '@/lib/brand';
import { applyBranding, getBranding, isHex, removeBranding, setBranding } from '@/lib/branding';
import {
  changeEmail,
  changePassword,
  getCredentials,
  logoutAllSessions,
} from '@/lib/auth';

// Platform settings & security: site config, branding (logo + accent),
// feature toggles, admin account (email/password — no username change),
// backups. Branding changes apply site-wide instantly.
export default function AdminSettings() {
  const { openModal, showToast } = useUI();
  const router = useRouter();
  const fileRef = useRef(null);

  // ── Feature toggles ─────────────────────────────────────────────────
  const [flags, setFlags] = useState({
    maintenance: false,
    promoBanner: true,
    betaUnlock: false,
    marketplacePreview: true,
    densityV2Weights: false,
  });
  const [twoFA, setTwoFA] = useState(true);

  // ── Site config ─────────────────────────────────────────────────────
  const [config, setConfig] = useState({
    siteTitle: 'SIGNAL',
    defaultLocale: 'en',
    timezone: 'America/Halifax',
    supportEmail: 'support@signal.app',
  });

  // ── Branding (logo + accent) ────────────────────────────────────────
  const [logo, setLogo] = useState(null);
  const [accent, setAccent] = useState(BRAND.accent);
  const [accentDirty, setAccentDirty] = useState(false);

  useEffect(() => {
    const b = getBranding();
    setLogo(b?.logo || null);
    setAccent(b?.accent || BRAND.accent);
  }, []);

  // ── Account (email / password — username fixed) ─────────────────────
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErrs, setPwErrs] = useState({});
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

  useEffect(() => {
    setEmail(getCredentials().email);
  }, []);

  // ── Feature toggles ─────────────────────────────────────────────────
  const toggleFlag = (k) => {
    setFlags((f) => ({ ...f, [k]: !f[k] }));
    showToast(`Feature toggle: ${k} → ${!flags[k] ? 'ON' : 'OFF'} (applied without redeploy)`);
  };

  const saveConfig = () => {
    openModal({
      title: 'CONFIG SAVED',
      body: <p className="small dim">Site configuration persisted. Branding defaults (accent/logo) are set from lib/brand.js; runtime overrides live in the Branding section below.</p>,
      confirmLabel: 'OK',
    });
  };

  // ── Branding actions ────────────────────────────────────────────────
  const pickLogo = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 400 * 1024) {
      showToast('LOGO TOO LARGE — MAX 400KB (SVG/PNG PREFERRED)', 'err');
      e.target.value = '';
      return;
    }
    const r = new FileReader();
    r.onload = () => setLogo(r.result);
    r.readAsDataURL(f);
  };

  const applyLogo = () => {
    if (!logo) return;
    setBranding({ logo });
    showToast('Logo applied site-wide (header + footer + favicon)');
  };

  const removeLogo = () => {
    setLogo(null);
    removeBranding('logo');
    showToast('Default terminal mark restored');
  };

  const applyAccent = () => {
    if (!isHex(accent)) {
      showToast('INVALID HEX — USE #RRGGBB OR #RGB', 'err');
      return;
    }
    const normalized = accent.length === 4
      ? `#${accent.slice(1).split('').map((c) => c + c).join('')}`
      : accent;
    setAccent(normalized);
    setBranding({ accent: normalized });
    applyBranding();
    setAccentDirty(false);
    showToast('Accent color applied site-wide');
  };

  const resetBranding = () => {
    removeBranding('logo');
    removeBranding('accent');
    setLogo(null);
    setAccent(BRAND.accent);
    applyBranding();
    showToast('Branding reset to lib/brand.js defaults');
  };

  // ── Account actions ─────────────────────────────────────────────────
  const saveEmail = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailErr('VALID EMAIL REQUIRED');
      return;
    }
    try {
      changeEmail(email.trim());
      setEmailErr('');
      openModal({
        title: 'EMAIL UPDATED',
        body: <p className="small dim">Admin email is now <b>{email.trim()}</b>. Used for support + recovery.</p>,
        confirmLabel: 'OK',
      });
    } catch (err) {
      setEmailErr(err.message);
    }
  };

  const savePassword = () => {
    const e = {};
    if (!pw.current) e.current = 'CURRENT PASSWORD REQUIRED';
    if (pw.next.length < 8) e.next = 'NEW PASSWORD MUST BE ≥ 8 CHARACTERS';
    if (pw.next !== pw.confirm) e.confirm = 'PASSWORDS DO NOT MATCH';
    setPwErrs(e);
    if (Object.keys(e).length) return;
    try {
      changePassword(pw.current, pw.next);
      setPw({ current: '', next: '', confirm: '' });
      setPwErrs({});
      openModal({
        title: 'PASSWORD CHANGED',
        body: <p className="small dim">Use your new password on next login. Username stays <b>Adam</b> (fixed — no change-username feature).</p>,
        confirmLabel: 'OK',
      });
    } catch (err) {
      setPwErrs({ current: err.message });
    }
  };

  const signOutAll = () => {
    openModal({
      title: 'LOG OUT ALL SESSIONS',
      body: <p className="small dim">Sign out of the admin session everywhere. You will need to log in again.</p>,
      confirmLabel: 'LOG OUT',
      danger: true,
      onConfirm: () => {
        logoutAllSessions();
        router.replace('/admin');
      },
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

      {/* ── Branding (logo + accent) ─────────────────────────────────── */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '16px' }}>
        <div className="cell cell-pad">
          <h3 style={{ marginBottom: '6px' }}>BRANDING — LOGO</h3>
          <p className="faint xs" style={{ marginBottom: '12px' }}>
            UPLOADED LOGO SHOWS IN HEADER, FOOTER + FAVICON SITE-WIDE. DEFAULT: TERMINAL MARK ▮
          </p>
          <div className="cell-soft cell-pad" style={{ marginBottom: '12px', minHeight: '72px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            {logo ? (
              <img src={logo} alt="Logo preview" style={{ maxHeight: '56px', maxWidth: '200px', objectFit: 'contain' }} />
            ) : (
              <span className="tick" style={{ fontSize: '26px' }}>▮</span>
            )}
            <span className="faint xs">{logo ? 'PREVIEW — UNSAVED' : 'DEFAULT MARK ACTIVE'}</span>
          </div>
          <div className="row" style={{ gap: '8px' }}>
            <button type="button" className="btn btn-sm" onClick={() => fileRef.current?.click()}>SELECT LOGO FILE</button>
            <button type="button" className="btn btn-sm btn-accent" disabled={!logo} onClick={applyLogo}>APPLY LOGO</button>
            <button type="button" className="btn btn-sm btn-ghost" disabled={!logo} onClick={removeLogo}>REMOVE</button>
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" hidden onChange={pickLogo} aria-label="Upload logo" />
          <p className="faint xs" style={{ marginTop: '10px' }}>MAX 400KB · SVG/PNG PREFERRED · PERSISTED CLIENT-SIDE (DEMO)</p>
        </div>

        <div className="cell cell-pad">
          <h3 style={{ marginBottom: '6px' }}>BRANDING — ACCENT COLOR</h3>
          <p className="faint xs" style={{ marginBottom: '12px' }}>
            SINGLE SIGNAL COLOR (FR-UX-05) — SATURATION METER, CTAs, ACTIVE STATES
          </p>
          <div className="row" style={{ gap: '10px', marginBottom: '12px' }}>
            <input
              type="color"
              value={isHex(accent) ? accent : BRAND.accent}
              onChange={(e) => { setAccent(e.target.value); setAccentDirty(true); }}
              aria-label="Accent color picker"
              style={{ width: '56px', height: '40px', border: '1px solid var(--line)', background: 'var(--bg)', padding: '2px' }}
            />
            <input
              type="text"
              value={accent}
              onChange={(e) => { setAccent(e.target.value); setAccentDirty(true); }}
              aria-label="Accent hex"
              style={{ border: '1px solid var(--line-soft)', background: 'var(--bg)', padding: '10px 12px', width: '120px', fontFamily: 'var(--font-mono)' }}
              placeholder="#ff3300"
            />
            <span className="badge" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>LIVE</span>
          </div>
          <div className="row" style={{ gap: '8px' }}>
            <button type="button" className="btn btn-sm btn-accent" onClick={applyAccent}>APPLY ACCENT</button>
            <button type="button" className="btn btn-sm btn-ghost" disabled={!accentDirty && !getBranding()?.accent} onClick={resetBranding}>
              RESET TO BRAND DEFAULT
            </button>
          </div>
          <p className="faint xs" style={{ marginTop: '10px' }}>
            DEFAULT FROM lib/brand.js: <span style={{ color: 'var(--accent)' }}>#ff3300</span> · RESET RESTORES LOGO + ACCENT
          </p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '16px' }}>
        {/* ── Account & credentials ──────────────────────────────────── */}
        <div className="cell cell-pad">
          <h3 style={{ marginBottom: '6px' }}>ACCOUNT &amp; CREDENTIALS</h3>
          <p className="faint xs" style={{ marginBottom: '12px' }}>
            USERNAME <b style={{ color: 'var(--accent)' }}>Adam</b> IS FIXED — NO CHANGE-USERNAME FEATURE (PRODUCT DECISION)
          </p>

          <div className="field">
            <label htmlFor="adm-email" className="req">ADMIN EMAIL</label>
            <input id="adm-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailErr(''); }} aria-invalid={!!emailErr} aria-describedby={emailErr ? 'adm-email-err' : undefined} />
            {emailErr && <span className="error-msg" id="adm-email-err">{emailErr}</span>}
          </div>
          <button type="button" className="btn btn-sm btn-block" style={{ marginBottom: '16px' }} onClick={saveEmail}>UPDATE EMAIL</button>

          <div className="field">
            <label htmlFor="pw-current" className="req">CURRENT PASSWORD</label>
            <div className="pw-wrap">
              <input id="pw-current" type={showPw.current ? 'text' : 'password'} value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} aria-invalid={!!pwErrs.current} autoComplete="current-password" />
              <button type="button" className="pw-toggle" onClick={() => setShowPw((s) => ({ ...s, current: !s.current }))} aria-label="Toggle current password visibility">{showPw.current ? 'HIDE' : 'SHOW'}</button>
            </div>
            {pwErrs.current && <span className="error-msg">{pwErrs.current}</span>}
          </div>
          <div className="field">
            <label htmlFor="pw-next" className="req">NEW PASSWORD</label>
            <div className="pw-wrap">
              <input id="pw-next" type={showPw.next ? 'text' : 'password'} value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} aria-invalid={!!pwErrs.next} autoComplete="new-password" />
              <button type="button" className="pw-toggle" onClick={() => setShowPw((s) => ({ ...s, next: !s.next }))} aria-label="Toggle new password visibility">{showPw.next ? 'HIDE' : 'SHOW'}</button>
            </div>
            {pwErrs.next && <span className="error-msg">{pwErrs.next}</span>}
          </div>
          <div className="field">
            <label htmlFor="pw-confirm" className="req">CONFIRM NEW PASSWORD</label>
            <div className="pw-wrap">
              <input id="pw-confirm" type={showPw.confirm ? 'text' : 'password'} value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} aria-invalid={!!pwErrs.confirm} autoComplete="new-password" />
              <button type="button" className="pw-toggle" onClick={() => setShowPw((s) => ({ ...s, confirm: !s.confirm }))} aria-label="Toggle confirm password visibility">{showPw.confirm ? 'HIDE' : 'SHOW'}</button>
            </div>
            {pwErrs.confirm && <span className="error-msg">{pwErrs.confirm}</span>}
          </div>
          <button type="button" className="btn btn-sm btn-block" style={{ marginBottom: '10px' }} onClick={savePassword}>CHANGE PASSWORD</button>
          <button type="button" className="btn btn-sm btn-danger btn-block" onClick={signOutAll}>LOG OUT ALL SESSIONS</button>
        </div>

        {/* ── Feature toggles ────────────────────────────────────────── */}
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

        <div>
          <div className="cell cell-pad" style={{ marginBottom: '14px' }}>
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
    </div>
  );
}
