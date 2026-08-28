'use client';

import { useState } from 'react';
import { useUI } from '@/components/ui/UIProvider';

// Activity audit log (SEC-09): who modified what, when.
const SEED = [
  { ts: '2026-08-28 09:12:41', actor: 'admin@signal.demo', action: 'UPDATE', target: 'density_weight_config', detail: 'w1 0.35 → 0.40 (version 2 pending review)' },
  { ts: '2026-08-28 08:55:03', actor: 'admin@signal.demo', action: 'SUSPEND', target: 'user churn@signal.demo', detail: 'Compliance flag: repeated ToS scrape' },
  { ts: '2026-08-28 07:30:18', actor: 'editor@signal.demo', action: 'PUBLISH', target: 'opportunity opp-6 (scriptwriting)', detail: '3 evidence refs verified' },
  { ts: '2026-08-27 22:14:52', actor: 'admin@signal.demo', action: 'REFUND', target: 'order 4b1c…', detail: '14-day policy, deploy purchase' },
  { ts: '2026-08-27 18:02:10', actor: 'moderator@signal.demo', action: 'PRUNE', target: 'local_license opp-3d-art ZIP 03060', detail: 'Webhook idempotency key ok' },
];

export default function AdminAudit() {
  const { openModal } = useUI();
  const [rows, setRows] = useState(SEED);

  const exportLog = () => {
    const blob = new Blob([rows.map((r) => Object.values(r).join(' | ')).join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'signal-audit-log.txt';
    a.click();
    URL.revokeObjectURL(a.href);
    openModal({ title: 'AUDIT EXPORTED', body: <p className="small dim">CSV/plaintext export downloaded. All admin actions are append-only and tamper-evident (hash chain in production).</p>, confirmLabel: 'OK' });
  };

  return (
    <div className="page-enter">
      <div className="spread" style={{ marginBottom: '16px' }}>
        <h2>ACTIVITY AUDIT LOG</h2>
        <button type="button" className="btn btn-sm" onClick={exportLog}>EXPORT LOG</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="tbl">
          <thead><tr><th>TIMESTAMP</th><th>ACTOR</th><th>ACTION</th><th>TARGET</th><th>DETAIL</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="faint">{r.ts}</td>
                <td>{r.actor}</td>
                <td><span className={`badge ${r.action === 'SUSPEND' || r.action === 'REFUND' ? 'badge-warn' : 'badge-ok'}`}>{r.action}</span></td>
                <td>{r.target}</td>
                <td className="faint">{r.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="faint xs" style={{ marginTop: '10px' }}>
        APPEND-ONLY · IMMUTABLE · CORRELATED WITH REQUEST/JOB IDS (OBS-01) · PRODUCTION: WRITE-AHEAD TO SEPARATE TABLE
      </p>
    </div>
  );
}
