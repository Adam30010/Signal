'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { create } from '@/lib/db';
import { useUI } from '@/components/ui/UIProvider';

// Data ingestion choice (FR-IG): OAuth paths (YouTube/Instagram) and upload
// path (Takeout/TikTok/Instagram exports). Upload simulates the worker
// pipeline; with Supabase configured, uploads log to `uploads` and enqueue
// via the parse_export flow (supabase/schema.sql).
export default function IngestPage() {
  const router = useRouter();
  const { showToast } = useUI();
  const [busy, setBusy] = useState(null);
  const [file, setFile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const fileRef = useRef(null);

  const providers = [
    { id: 'youtube', name: 'YOUTUBE', desc: 'Liked videos · watch later · subscriptions', scopes: 'youtube.readonly', enabled: true },
    { id: 'instagram', name: 'INSTAGRAM', desc: 'Saved/engaged media (business/creator accounts)', scopes: 'graph-api', enabled: true },
    { id: 'tiktok', name: 'TIKTOK', desc: 'No watch-history API — upload only', scopes: null, enabled: false },
  ];

  const startOAuth = async (provider) => {
    setBusy(provider.id);
    // Production: redirect to /api/ingest/oauth/:provider/start with state param.
    // Demo: simulate a token exchange + event ingestion.
    await new Promise((r) => setTimeout(r, 1400));
    await create('consumption_events', {
      source: provider.id,
      ingest_method: 'oauth',
      title: `Sample ${provider.name} event`,
      channel: 'signal-demo',
      tags: ['demo', provider.id],
    }).catch(() => {});
    setBusy(null);
    showToast(`${provider.name} connected — events pulled`);
    router.push('/processing');
  };

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setUploads((u) => [...u, { name: f.name, size: `${(f.size / 1024 / 1024).toFixed(1)} MB`, status: 'QUEUED' }]);
  };

  const runUpload = async () => {
    if (!file) return;
    setBusy('upload');
    setUploads((u) => u.map((x) => (x.name === file.name ? { ...x, status: 'PARSING' } : x)));
    // Demo: simulate the parse_export worker (stream-parse → normalize → emit).
    await new Promise((r) => setTimeout(r, 1800));
    await create('uploads', {
      filename: file.name,
      format: file.name.includes('takeout') || file.name.includes('watch-history') ? 'takeout' : 'tiktok',
      status: 'done',
      byte_size: file.size,
    }).catch(() => {});
    setUploads((u) => u.map((x) => (x.name === file.name ? { ...x, status: 'DONE' } : x)));
    setBusy(null);
    showToast(`Parsed ${file.name} — moving to processing`);
    router.push('/processing');
  };

  return (
    <div className="wrap" style={{ maxWidth: '860px', paddingTop: '48px', paddingBottom: '80px' }}>
      <div className="spread" style={{ marginBottom: '24px' }}>
        <h2>DATA INGESTION</h2>
        <span className="badge badge-accent">STEP 2 / 5</span>
      </div>
      <p className="dim" style={{ marginBottom: '28px' }}>
        Connect a source or upload an export. Everything is normalized into one private
        consumption stream. Files are stream-parsed in chunks — never loaded fully into memory.
      </p>

      <h3 style={{ marginBottom: '12px' }}>/A — OAUTH (OFFICIAL APIS)</h3>
      <div className="grid g3" style={{ marginBottom: '36px' }}>
        {providers.map((p) => (
          <div className="cell cell-pad" key={p.id}>
            <div className="spread" style={{ marginBottom: '8px' }}>
              <span className="small uppercase" style={{ letterSpacing: '0.08em' }}>{p.name}</span>
              {p.enabled ? <span className="badge badge-accent">OAUTH</span> : <span className="badge badge-warn">UPLOAD ONLY</span>}
            </div>
            <p className="faint xs" style={{ marginBottom: '12px', minHeight: '3em' }}>{p.desc}</p>
            {p.enabled ? (
              <button
                type="button"
                className="btn btn-sm btn-block"
                disabled={busy === p.id}
                onClick={() => startOAuth(p.id)}
              >
                {busy === p.id ? 'CONNECTING…' : `CONNECT ${p.name}`}
              </button>
            ) : (
              <button type="button" className="btn btn-sm btn-ghost btn-block" onClick={() => fileRef.current?.click()}>
                UPLOAD EXPORT ↓
              </button>
            )}
          </div>
        ))}
      </div>

      <h3 style={{ marginBottom: '12px' }}>/B — UPLOAD (DATA EXPORTS)</h3>
      <div className="cell cell-pad">
        <div className="row" style={{ gap: '10px' }}>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            {file ? `✓ ${file.name}` : 'SELECT EXPORT FILE'}
          </button>
          <button type="button" className="btn btn-accent" disabled={!file || busy === 'upload'} onClick={runUpload}>
            {busy === 'upload' ? 'PARSING…' : 'PARSE & NORMALIZE →'}
          </button>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={pickFile} aria-label="Upload export file" />
        </div>
        <p className="faint xs" style={{ marginTop: '10px' }}>
          SUPPORTED: GOOGLE TAKEOUT <b>watch-history.json</b> · TIKTOK <b>Video Browsing History</b> · INSTAGRAM EXPORT · ≤ 500 MB · STREAM-PARSED
        </p>
      </div>

      {uploads.length > 0 && (
        <div className="cell-soft" style={{ marginTop: '16px' }}>
          <div className="cell-pad">
            <p className="small uppercase" style={{ letterSpacing: '0.1em', marginBottom: '8px' }}>UPLOAD QUEUE</p>
            {uploads.map((u) => (
              <div key={u.name} className="spread" style={{ padding: '6px 0', borderBottom: '1px solid var(--line-soft)' }}>
                <span className="small">{u.name} <span className="faint">({u.size})</span></span>
                <span className={`badge ${u.status === 'DONE' ? 'badge-ok' : u.status === 'PARSING' ? 'badge-warn' : ''}`}>{u.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="faint xs" style={{ marginTop: '20px' }}>
        TIKTOK HAS NO CONSUMER WATCH-HISTORY API — UPLOAD IS PERMANENT FOR TIKTOK. INSTAGRAM PERSONAL ACCOUNTS ARE UPLOAD-ONLY TOO.
      </p>
    </div>
  );
}
