// ═══════════════════════════════════════════════════════════════════════
// Database layer — Supabase-ready.
//
// The entire app is built to run against Supabase (Postgres + pgvector +
// PostGIS, per the PRD) with zero code changes: set NEXT_PUBLIC_SUPABASE_URL
// and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local and every call goes to
// the Supabase REST API. Without env vars the app transparently falls back
// to a localStorage demo store so the full UX (quiz, ingestion, blueprint,
// admin) is explorable offline.
//
// Tables are created by supabase/schema.sql.
// ═══════════════════════════════════════════════════════════════════════

export function isSupabaseConfigured() {
  return (
    typeof window !== 'undefined' &&
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const DB_PREFIX = 'signal_db_';

// ── Demo (localStorage) store ──────────────────────────────────────────

function lsGet(table) {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(DB_PREFIX + table)) || [];
  } catch {
    return [];
  }
}
function lsSet(table, rows) {
  window.localStorage.setItem(DB_PREFIX + table, JSON.stringify(rows));
}

// ── CRUD API (Supabase REST when configured, demo otherwise) ───────────

export async function list(table, { filter, order } = {}) {
  if (isSupabaseConfigured()) {
    let q = `${url()}/rest/v1/${table}?select=*`;
    if (filter) {
      Object.entries(filter).forEach(([k, v]) => {
        if (v === null || v === undefined) return;
        if (typeof v === 'string' && v.includes(',')) {
          q += `&${k}=in.(${v.split(',').map(encodeURIComponent).join(',')})`;
        } else {
          q += `&${k}=eq.${encodeURIComponent(v)}`;
        }
      });
    }
    if (order) q += `&order=${encodeURIComponent(order)}`;
    const r = await fetch(q, { headers: { apikey: key(), Authorization: `Bearer ${key()}` } });
    if (!r.ok) throw new Error(`DB list ${table}: ${r.status}`);
    return r.json();
  }
  let rows = lsGet(table);
  if (filter) {
    rows = rows.filter((row) =>
      Object.entries(filter).every(([k, v]) => row[k] === v)
    );
  }
  if (order) {
    const [col, dir] = order.split('.');
    rows = [...rows].sort((a, b) =>
      dir === 'desc' ? String(b[col]).localeCompare(String(a[col])) : String(a[col]).localeCompare(String(b[col]))
    );
  }
  return rows;
}

export async function get(table, id) {
  if (isSupabaseConfigured()) {
    const rows = await list(table, { filter: { id } });
    return rows[0] || null;
  }
  return lsGet(table).find((r) => String(r.id) === String(id)) || null;
}

export async function create(table, data) {
  if (isSupabaseConfigured()) {
    const r = await fetch(`${url()}/rest/v1/${table}`, {
      method: 'POST',
      headers: { apikey: key(), Authorization: `Bearer ${key()}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error(`DB create ${table}: ${r.status}`);
    const j = await r.json();
    return Array.isArray(j) ? j[0] : j;
  }
  const rows = lsGet(table);
  const row = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...data };
  rows.push(row);
  lsSet(table, rows);
  return row;
}

export async function update(table, id, data) {
  if (isSupabaseConfigured()) {
    const r = await fetch(`${url()}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { apikey: key(), Authorization: `Bearer ${key()}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify(data),
    });
    if (!r.ok) throw new Error(`DB update ${table}: ${r.status}`);
    const j = await r.json();
    return Array.isArray(j) ? j[0] : j;
  }
  const rows = lsGet(table);
  const i = rows.findIndex((r) => String(r.id) === String(id));
  if (i === -1) throw new Error(`Not found: ${table}/${id}`);
  rows[i] = { ...rows[i], ...data, updated_at: new Date().toISOString() };
  lsSet(table, rows);
  return rows[i];
}

export async function remove(table, id) {
  if (isSupabaseConfigured()) {
    const r = await fetch(`${url()}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { apikey: key(), Authorization: `Bearer ${key()}` },
    });
    if (!r.ok) throw new Error(`DB delete ${table}: ${r.status}`);
    return true;
  }
  const rows = lsGet(table).filter((r) => String(r.id) !== String(id));
  lsSet(table, rows);
  return true;
}

// ── RPC (calls Postgres functions; demo fallbacks return sensible data) ─

export async function rpc(fn, args = {}) {
  if (isSupabaseConfigured()) {
    const r = await fetch(`${url()}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { apikey: key(), Authorization: `Bearer ${key()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });
    if (!r.ok) throw new Error(`RPC ${fn}: ${r.status}`);
    return r.json();
  }
  switch (fn) {
    case 'local_density_count': // (opp_id, lat, lng, radius_m) -> int
      return Math.floor(Math.abs(Math.sin(Date.now() % 1000)) * 4);
    default:
      return null;
  }
}

export async function count(table, filter = {}) {
  const rows = await list(table, { filter });
  return rows.length;
}

export async function seedDemoData() {
  if (isSupabaseConfigured()) return; // real DB — data comes from schema.sql seeds
  const users = lsGet('users');
  if (users.length === 0) {
    lsSet('users', [
      { id: crypto.randomUUID(), email: 'operator@signal.demo', role: 'admin', created_at: '2026-08-20T10:00:00Z', status: 'active' },
      { id: crypto.randomUUID(), email: 'lurker@signal.demo', role: 'user', created_at: '2026-08-21T14:22:00Z', status: 'active' },
      { id: crypto.randomUUID(), email: 'side@signal.demo', role: 'user', created_at: '2026-08-22T09:05:00Z', status: 'active' },
      { id: crypto.randomUUID(), email: 'op2@signal.demo', role: 'user', created_at: '2026-08-24T18:40:00Z', status: 'active' },
      { id: crypto.randomUUID(), email: 'churn@signal.demo', role: 'user', created_at: '2026-08-10T08:00:00Z', status: 'suspended' },
    ]);
  }
  if (lsGet('quiz_sessions').length === 0) {
    lsSet('quiz_sessions', [
      { id: crypto.randomUUID(), liquid_capital_cents: 50000, weekly_hours: 10, risk_tolerance: 'safe', current_step: 9, completed_at: '2026-08-25T12:00:00Z', created_at: '2026-08-25T11:55:00Z' },
      { id: crypto.randomUUID(), liquid_capital_cents: 200000, weekly_hours: 20, risk_tolerance: 'balanced', current_step: 5, created_at: '2026-08-26T09:30:00Z' },
      { id: crypto.randomUUID(), liquid_capital_cents: 0, weekly_hours: 8, risk_tolerance: 'safe', current_step: 3, created_at: '2026-08-27T16:10:00Z' },
    ]);
  }
  if (lsGet('orders').length === 0) {
    lsSet('orders', [
      { id: crypto.randomUUID(), amount_cents: 4900, currency: 'usd', platform_fee_cents: 980, status: 'paid', created_at: '2026-08-25T12:30:00Z' },
      { id: crypto.randomUUID(), amount_cents: 9900, currency: 'cad', platform_fee_cents: 1980, status: 'in_progress', created_at: '2026-08-26T10:00:00Z' },
      { id: crypto.randomUUID(), amount_cents: 19900, currency: 'usd', platform_fee_cents: 3980, status: 'delivered', created_at: '2026-08-27T14:20:00Z' },
      { id: crypto.randomUUID(), amount_cents: 2500, currency: 'cad', platform_fee_cents: 500, status: 'refunded', created_at: '2026-08-22T11:00:00Z' },
    ]);
  }
  if (lsGet('messages').length === 0) {
    lsSet('messages', [
      { id: crypto.randomUUID(), name: 'Jordan M.', email: 'jordan@example.com', subject: 'Buy-out license question', message: 'Does the license cover my whole city or just my ZIP?', read: false, created_at: '2026-08-27T15:00:00Z' },
      { id: crypto.randomUUID(), name: 'Avery L.', email: 'avery@example.com', subject: 'TikTok upload', message: 'TikTok export gives me a zip of HTML files, is that supported?', read: false, created_at: '2026-08-27T09:12:00Z' },
      { id: crypto.randomUUID(), name: 'Sam K.', email: 'sam@example.com', subject: 'Refund request', message: 'Requesting a refund on my deploy purchase per the 14-day policy.', read: true, created_at: '2026-08-25T18:30:00Z' },
    ]);
  }
}
