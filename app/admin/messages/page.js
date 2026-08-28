'use client';

import { useCallback, useEffect, useState } from 'react';
import { list, update, remove } from '@/lib/db';
import { useUI } from '@/components/ui/UIProvider';

// Form & communication hub: contact submissions + newsletter subscribers.
export default function AdminMessages() {
  const { openModal, showToast } = useUI();
  const [messages, setMessages] = useState([]);
  const [subs] = useState([
    { email: 'news@example.com', joined: '2026-08-20', status: 'subscribed' },
    { email: 'beta@example.com', joined: '2026-08-21', status: 'subscribed' },
    { email: 'optout@example.com', joined: '2026-08-15', status: 'unsubscribed' },
  ]);

  const load = useCallback(async () => {
    setMessages(await list('messages', { order: 'created_at.desc' }));
  }, []);

  useEffect(() => { load(); }, [load]);

  const view = (m) => {
    openModal({
      title: m.subject,
      body: (
        <div>
          <p className="xs faint">FROM: {m.name} &lt;{m.email}&gt; · {m.created_at ? new Date(m.created_at).toLocaleString('en-CA') : '—'}</p>
          <p className="small dim" style={{ marginTop: '12px', whiteSpace: 'pre-wrap' }}>{m.message}</p>
        </div>
      ),
      confirmLabel: 'MARK READ',
      onConfirm: async () => {
        await update('messages', m.id, { read: true });
        showToast('Marked as read');
        load();
      },
    });
  };

  const deleteMsg = (m) => {
    openModal({
      title: 'DELETE MESSAGE',
      body: <p className="small dim">Permanently delete this message? This is logged in the audit trail.</p>,
      confirmLabel: 'DELETE',
      danger: true,
      onConfirm: async () => {
        await remove('messages', m.id);
        showToast('Message deleted');
        load();
      },
    });
  };

  return (
    <div className="page-enter">
      <div className="spread" style={{ marginBottom: '16px' }}>
        <h2>MESSAGES &amp; SUBSCRIBERS</h2>
        <span className="badge badge-accent">{messages.filter((m) => !m.read).length} UNREAD</span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <h3 style={{ marginBottom: '10px' }}>CONTACT INBOX</h3>
          {messages.length === 0 && <p className="dim small">No messages yet.</p>}
          {messages.map((m) => (
            <div key={m.id} className="cell-soft cell-pad" style={{ marginBottom: '8px' }}>
              <div className="spread">
                <span className="small uppercase" style={{ letterSpacing: '0.05em' }}>
                  {!m.read && <span style={{ color: 'var(--accent)' }}>■ </span>}{m.subject || '(no subject)'}
                </span>
                <span className="xs faint">{m.created_at ? new Date(m.created_at).toLocaleDateString('en-CA') : '—'}</span>
              </div>
              <p className="faint xs" style={{ marginTop: '4px' }}>{m.name} · {m.email}</p>
              <div className="row" style={{ gap: '6px', marginTop: '8px' }}>
                <button type="button" className="btn btn-sm" onClick={() => view(m)}>VIEW</button>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => deleteMsg(m)}>DELETE</button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 style={{ marginBottom: '10px' }}>NEWSLETTER SUBSCRIBERS</h3>
          <table className="tbl">
            <thead><tr><th>EMAIL</th><th>JOINED</th><th>STATUS</th></tr></thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.email}>
                  <td>{s.email}</td>
                  <td className="faint">{s.joined}</td>
                  <td><span className={`badge ${s.status === 'subscribed' ? 'badge-ok' : 'badge-warn'}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="faint xs" style={{ marginTop: '10px' }}>
            CASL/CAN-SPAM: ONE-CLICK UNSUBSCRIBE ENFORCED · CONSENT LOGGED (ETH-08)
          </p>
        </div>
      </div>
    </div>
  );
}
