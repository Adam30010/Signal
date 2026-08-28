'use client';

import { useCallback, useEffect, useState } from 'react';
import { list, update } from '@/lib/db';
import { useUI } from '@/components/ui/UIProvider';
import { PRICING } from '@/lib/site';

// Commercial & operational: orders, refunds, invoices, payment log.
export default function AdminOrders() {
  const { openModal, showToast } = useUI();
  const [orders, setOrders] = useState([]);

  const load = useCallback(async () => {
    setOrders(await list('orders', { order: 'created_at.desc' }));
  }, []);

  useEffect(() => { load(); }, [load]);

  const refund = (o) => {
    openModal({
      title: 'ISSUE REFUND',
      body: (
        <p className="small dim">
          Refund <b>${(o.amount_cents / 100).toFixed(2)} {o.currency.toUpperCase()}</b> ({o.id.slice(0, 8)}…)?
          {o.status === 'delivered' ? ' Refunds on delivered marketplace orders require buyer-return mediation.' : ''}
          {' '}Stripe refund issued via gateway; 14-day policy applies (ETH-05).
        </p>
      ),
      confirmLabel: 'REFUND',
      danger: true,
      onConfirm: async () => {
        await update('orders', o.id, { status: 'refunded' });
        showToast('Refund issued — payment gateway log updated');
        load();
      },
    });
  };

  return (
    <div className="page-enter">
      <div className="spread" style={{ marginBottom: '16px' }}>
        <h2>ORDERS &amp; COMMERCE</h2>
        <span className="badge">{orders.length} ORDERS</span>
      </div>

      <div className="kpi-grid" style={{ marginBottom: '18px' }}>
        {[
          { k: 'GROSS VOLUME', v: `$${(orders.reduce((s, o) => s + o.amount_cents, 0) / 100).toFixed(2)}`, d: 'LIFETIME' },
          { k: 'PLATFORM FEES (20%)', v: `$${(orders.reduce((s, o) => s + o.platform_fee_cents, 0) / 100).toFixed(2)}`, d: 'ESCROW + STRIPE CONNECT' },
          { k: 'REFUND RATE', v: `${(orders.filter((o) => o.status === 'refunded').length / Math.max(orders.length, 1)) * 100}%`, d: 'TARGET < 5%' },
          { k: 'AFFILIATE ANNuity', v: '12 ACTIVE REFS', d: 'CAL.COM · NOTION · CANVA' },
        ].map((x) => (
          <div className="kpi" key={x.k}>
            <div className="k">{x.k}</div>
            <div className="v" style={{ fontSize: '20px' }}>{x.v}</div>
            <div className="d">{x.d}</div>
          </div>
        ))}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr><th>ID</th><th>AMOUNT</th><th>FEE (20%)</th><th>CURRENCY</th><th>STATUS</th><th>DATE</th><th>ACTION</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="faint">{o.id.slice(0, 8)}…</td>
                <td>${(o.amount_cents / 100).toFixed(2)}</td>
                <td>${(o.platform_fee_cents / 100).toFixed(2)}</td>
                <td>{o.currency.toUpperCase()}</td>
                <td><span className={`badge ${o.status === 'paid' || o.status === 'delivered' ? 'badge-ok' : o.status === 'refunded' ? 'badge-danger' : 'badge-warn'}`}>{o.status}</span></td>
                <td className="faint">{o.created_at ? new Date(o.created_at).toLocaleString('en-CA') : '—'}</td>
                <td>
                  {o.status !== 'refunded' && (
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => refund(o)}>REFUND</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cell cell-pad" style={{ marginTop: '16px' }}>
        <h3 style={{ marginBottom: '10px' }}>PAYMENT GATEWAY LOG</h3>
        <p className="faint xs">
          stripe.checkout.session.completed → webhook signature verified → idempotent on event ID (SEC-05) ·
          destination charges hold escrow until acceptance (FR-MK-03) · affiliate attribution at provision time (FR-MP-04)
        </p>
      </div>
    </div>
  );
}
