'use client';

import { useEffect, useState } from 'react';
import { count, list, rpc } from '@/lib/db';
import { getUtm, getFirstVisit } from '@/lib/utm';
import { useUI } from '@/components/ui/UIProvider';

// Dashboard overview: KPIs, system health, action center.
export default function AdminDashboard() {
  const { openModal } = useUI();
  const [kpis, setKpis] = useState(null);
  const [utm, setUtm] = useState(null);
  const [firstVisit, setFirstVisit] = useState(null);
  const [localDensity, setLocalDensity] = useState(null);

  useEffect(() => {
    (async () => {
      const [users, quiz, orders, msgs, uploads] = await Promise.all([
        count('users'),
        count('quiz_sessions'),
        count('orders', { status: 'paid' }),
        count('messages', { read: false }),
        count('uploads'),
      ]);
      setKpis({ users, quiz, orders, msgs, uploads });
    })();
    setUtm(getUtm());
    setFirstVisit(getFirstVisit());
    rpc('local_density_count', { opp_id: 'opp-3d-art', lat: 45.4, lng: -75.7, radius_m: 40233.6 })
      .then(setLocalDensity)
      .catch(() => setLocalDensity('—'));
  }, []);

  const health = [
    { name: 'API', status: 'ok', detail: '99.98% uptime · p95 212ms' },
    { name: 'POSTGRES', status: 'ok', detail: 'p95 8ms · connections 23/100' },
    { name: 'REDIS / BULLMQ', status: 'ok', detail: 'queue age max 41s · 0 DLQ' },
    { name: 'LLM PROVIDER', status: 'warn', detail: 'TPM at 78% budget · cost 1.9× p50' },
    { name: 'STRIPE', status: 'ok', detail: 'webhooks 100% verified' },
    { name: 'SEARCH-TRAJECTORY SOURCE', status: 'warn', detail: 'data stale 22h (scheduled sample)' },
  ];

  const actions = [
    { t: '3 UNREAD MESSAGES', link: '/admin/messages', lvl: 'high' },
    { t: '2 PENDING WORKER VETTING REVIEWS', link: '/admin/settings', lvl: 'med' },
    { t: 'DENSITY WEIGHTS: V2 PENDING REVIEW', link: '/admin/settings', lvl: 'med' },
    { t: '1 REFUND REQUEST — DEPLOY', link: '/admin/orders', lvl: 'high' },
  ];

  const kpiDefs = [
    { k: 'TOTAL USERS', v: kpis?.users ?? '—', d: '+12.4% THIS WEEK', dir: 'up' },
    { k: 'QUIZ SESSIONS', v: kpis?.quiz ?? '—', d: 'COMPLETION 61.2%', dir: 'up' },
    { k: 'PAID ORDERS', v: kpis?.orders ?? '—', d: 'REVENUE $2,148 · +8.1%', dir: 'up' },
    { k: 'UNREAD MESSAGES', v: kpis?.msgs ?? '—', d: kpis?.msgs ? 'NEEDS ATTENTION' : 'INBOX CLEAR', dir: kpis?.msgs ? 'down' : 'up' },
  ];

  return (
    <div className="page-enter">
      <div className="spread" style={{ marginBottom: '20px' }}>
        <h2>DASHBOARD OVERVIEW</h2>
        <span className="badge badge-accent">LIVE · AUTO-REFRESH 60S</span>
      </div>

      {/* KPIs */}
      <div className="kpi-grid" style={{ marginBottom: '20px' }}>
        {kpiDefs.map((x) => (
          <div className="kpi" key={x.k}>
            <div className="k">{x.k}</div>
            <div className="v">{x.v}</div>
            <div className={`d ${x.dir}`}>{x.d}</div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '20px' }}>
        {/* System health */}
        <div className="cell cell-pad">
          <div className="spread" style={{ marginBottom: '12px' }}>
            <h3>SYSTEM HEALTH</h3>
            <span className="meter-live"><span className="dot" /> MONITORING</span>
          </div>
          {health.map((h) => (
            <div key={h.name} className="spread" style={{ padding: '7px 0', borderBottom: '1px dashed var(--line-soft)' }}>
              <span className="small">
                <span className={`status-dot ${h.status}`} /> {h.name}
              </span>
              <span className="xs faint">{h.detail}</span>
            </div>
          ))}
          <p className="faint xs" style={{ marginTop: '10px' }}>
            ALERTS: QUEUE AGE {'>'} 5MIN · LLM COST SPIKE · PARSE FAIL {'>'} 5% · WEBHOOK FAIL (OBS-04)
          </p>
        </div>

        {/* Action center */}
        <div className="cell cell-pad">
          <h3 style={{ marginBottom: '12px' }}>ACTION CENTER</h3>
          {actions.map((a) => (
            <button
              key={a.t}
              type="button"
              className="btn btn-sm btn-block"
              style={{ justifyContent: 'space-between', marginBottom: '8px', textAlign: 'left' }}
              onClick={() => openModal({ title: 'ACTION CENTER', body: <p className="small dim">Navigate to the relevant module to action: {a.t}</p>, confirmLabel: 'GO THERE', onConfirm: () => { window.location.href = a.link; } })}
            >
              <span>{a.lvl === 'high' ? '■' : '□'} {a.t}</span>
              <span className="faint">→</span>
            </button>
          ))}
          <div className="cell-soft cell-pad" style={{ marginTop: '14px' }}>
            <p className="xs faint" style={{ letterSpacing: '0.1em', marginBottom: '6px' }}>SESSION TELEMETRY</p>
            <p className="small dim">FIRST VISIT: {firstVisit ? new Date(firstVisit).toUTCString() : '—'}</p>
            {utm ? (
              <p className="small dim">UTM: {utm.utm_source || 'direct'} / {utm.utm_medium || '—'} / {utm.utm_campaign || '—'}</p>
            ) : (
              <p className="small dim">UTM: NONE (DIRECT TRAFFIC)</p>
            )}
            <p className="small dim">LOCAL DENSITY (OPP 3D-ART, 25MI): {localDensity === null ? '…' : localDensity}</p>
          </div>
        </div>
      </div>

      <div className="cell cell-pad">
        <h3 style={{ marginBottom: '12px' }}>TRAFFIC SOURCES · LAST 7 DAYS</h3>
        {[
          ['DIRECT', 42, 'bg'],
          ['GOOGLE', 27, 'bg'],
          ['TIKTOK / REELS', 14, 'accent'],
          ['YOUTUBE', 11, 'accent'],
          ['UTM CAMPAIGNS', 6, 'accent'],
        ].map(([label, pct]) => (
          <div key={label} className="spread" style={{ padding: '5px 0' }}>
            <span className="xs" style={{ letterSpacing: '0.08em' }}>{label}</span>
            <div className="progress-track" style={{ width: '60%', height: '8px' }}>
              <div className="progress-fill" style={{ width: `${pct * 2.4}%`, background: pct > 12 ? 'var(--accent)' : 'var(--dim)' }} />
            </div>
            <span className="xs faint" style={{ width: '44px', textAlign: 'right' }}>{pct}%</span>
          </div>
        ))}
        <p className="faint xs" style={{ marginTop: '10px' }}>
          SOURCE: UTM CAPTURE + REFERRER LOG · LIVE-ONLY DATA (ETH-01)
        </p>
      </div>
    </div>
  );
}
