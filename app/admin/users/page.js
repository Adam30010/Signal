'use client';

import { useCallback, useEffect, useState } from 'react';
import { count, list, update } from '@/lib/db';
import { useUI } from '@/components/ui/UIProvider';

// User & access management: searchable list, roles, suspend, activity.
export default function AdminUsers() {
  const { openModal, showToast } = useUI();
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const rows = await list('users', { order: 'created_at.desc' });
    setUsers(rows);
    setLoaded(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter((u) =>
    (u.email || '').toLowerCase().includes(q.toLowerCase()) ||
    (u.status || '').toLowerCase().includes(q.toLowerCase())
  );

  const suspend = (u) => {
    openModal({
      title: 'SUSPEND ACCOUNT',
      body: <p className="small dim">Suspend <b>{u.email}</b>? They lose access immediately. A suspended user can be restored from the same list.</p>,
      confirmLabel: 'SUSPEND',
      danger: true,
      onConfirm: async () => {
        await update('users', u.id, { status: u.status === 'suspended' ? 'active' : 'suspended' });
        showToast(u.status === 'suspended' ? 'Account restored' : 'Account suspended');
        load();
      },
    });
  };

  const setRole = (u, role) => {
    openModal({
      title: 'CHANGE ROLE',
      body: <p className="small dim">Set <b>{u.email}</b> to <b style={{ color: 'var(--accent)' }}>{role.toUpperCase()}</b>? RBAC tiers: super_admin &gt; editor &gt; moderator &gt; support.</p>,
      confirmLabel: 'APPLY',
      onConfirm: async () => {
        await update('users', u.id, { role });
        showToast(`Role → ${role}`);
        load();
      },
    });
  };

  return (
    <div className="page-enter">
      <div className="spread" style={{ marginBottom: '16px' }}>
        <h2>USER &amp; ACCESS MANAGEMENT</h2>
        <span className="badge">{users.length} ACCOUNTS</span>
      </div>

      <div className="row" style={{ marginBottom: '16px' }}>
        <input
          type="search"
          placeholder="SEARCH EMAIL OR STATUS…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search users"
          style={{ border: '1px solid var(--line-soft)', background: 'var(--bg)', padding: '10px 12px', minWidth: '260px' }}
        />
        <span className="faint xs">ROLE-BASED ACCESS CONTROL · ACTIVITY AUDIT LOGGED (SEC-09)</span>
      </div>

      {!loaded ? (
        <div className="skeleton sk-block" />
      ) : filtered.length === 0 ? (
        <p className="dim">NO USERS MATCH "{q}"</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>EMAIL</th><th>ROLE</th><th>STATUS</th><th>CREATED</th><th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>
                    <select
                      value={u.role || 'user'}
                      onChange={(e) => setRole(u, e.target.value)}
                      aria-label={`Role for ${u.email}`}
                      style={{ background: 'var(--bg)', border: '1px solid var(--line-soft)', padding: '4px 6px' }}
                    >
                      {['user', 'support', 'moderator', 'editor', 'super_admin'].map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'suspended' ? 'badge-danger' : u.status === 'active' ? 'badge-ok' : 'badge-warn'}`}>
                      {u.status || 'active'}
                    </span>
                  </td>
                  <td className="faint">{u.created_at ? new Date(u.created_at).toLocaleDateString('en-CA') : '—'}</td>
                  <td>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => suspend(u)}>
                      {u.status === 'suspended' ? 'RESTORE' : 'SUSPEND'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
