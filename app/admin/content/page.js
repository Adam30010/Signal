'use client';

import { useState } from 'react';
import { useUI } from '@/components/ui/UIProvider';

// CMS: publishing suite, SEO management, media library (demo).
const PAGES = [
  { slug: '/', title: 'Home', status: 'published', updated: '2026-08-28', seo: 'SIGNAL — Learn for free, pay to scale.' },
  { slug: '/how-it-works', title: 'How It Works', status: 'published', updated: '2026-08-27', seo: 'The SIGNAL loop — 8 moves, one artifact first' },
  { slug: '/pricing', title: 'Pricing', status: 'published', updated: '2026-08-26', seo: 'SIGNAL pricing — $0 blueprint, unlock, deploy, license, alerts' },
  { slug: '/faq', title: 'FAQ', status: 'published', updated: '2026-08-25', seo: 'SIGNAL FAQ — ingestion, density, license, refunds' },
  { slug: '/contact', title: 'Contact', status: 'published', updated: '2026-08-25', seo: 'Contact SIGNAL support' },
];

export default function AdminContent() {
  const { openModal, showToast } = useUI();
  const [pages, setPages] = useState(PAGES);
  const [media] = useState([
    { name: 'hero-terminal.svg', type: 'SVG', size: '2.1 KB', tags: ['hero'] },
    { name: 'density-meter.png', type: 'PNG', size: '48 KB', tags: ['meter'] },
    { name: 'quiz-wireframe.pdf', type: 'PDF', size: '1.2 MB', tags: ['quiz'] },
  ]);
  const [draft, setDraft] = useState({ title: '', slug: '', metaTitle: '', metaDesc: '', body: '' });

  const toggleStatus = (slug) => {
    setPages((ps) => ps.map((p) => (p.slug === slug ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p)));
    showToast('Status toggled (feature-flag backed in production)');
  };

  const publish = () => {
    if (!draft.title.trim() || !draft.slug.trim()) {
      openModal({
        title: 'PUBLISH ERROR',
        body: <p className="small dim">Title and slug are required. Body and SEO fields are recommended before publishing.</p>,
        confirmLabel: 'OK',
      });
      return;
    }
    setPages((ps) => [...ps, { slug: draft.slug, title: draft.title, status: 'published', updated: '2026-08-28', seo: draft.metaTitle || '—' }]);
    openModal({
      title: 'PAGE PUBLISHED',
      body: <p className="small dim"><b>{draft.title}</b> is live at <span style={{ color: 'var(--accent)' }}>{draft.slug}</span>. Canonical + OG fields set from the SEO manager.</p>,
      confirmLabel: 'DONE',
    });
    setDraft({ title: '', slug: '', metaTitle: '', metaDesc: '', body: '' });
  };

  return (
    <div className="page-enter">
      <div className="spread" style={{ marginBottom: '16px' }}>
        <h2>CONTENT MANAGEMENT</h2>
        <span className="badge badge-accent">CMS</span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Publishing suite */}
        <div className="cell cell-pad">
          <h3 style={{ marginBottom: '12px' }}>PUBLISHING SUITE</h3>
          <div className="field">
            <label htmlFor="c-title">TITLE</label>
            <input id="c-title" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          </div>
          <div className="field">
            <label htmlFor="c-slug">URL SLUG</label>
            <input id="c-slug" value={draft.slug} onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))} placeholder="/post-slug" />
          </div>
          <div className="field">
            <label htmlFor="c-seo-t">SEO META TITLE</label>
            <input id="c-seo-t" value={draft.metaTitle} onChange={(e) => setDraft((d) => ({ ...d, metaTitle: e.target.value }))} />
          </div>
          <div className="field">
            <label htmlFor="c-seo-d">SEO META DESCRIPTION</label>
            <textarea id="c-seo-d" value={draft.metaDesc} onChange={(e) => setDraft((d) => ({ ...d, metaDesc: e.target.value }))} style={{ minHeight: '60px' }} />
          </div>
          <div className="field">
            <label htmlFor="c-body">BODY (MARKDOWN)</label>
            <textarea id="c-body" value={draft.body} onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))} style={{ minHeight: '100px' }} />
          </div>
          <button type="button" className="btn btn-accent btn-block" onClick={publish}>PUBLISH PAGE →</button>
          <p className="faint xs" style={{ marginTop: '8px' }}>CANONICAL TAG · OPEN GRAPH IMAGERY · SLUG CUSTOMIZATION — ALL IN THE SEO MANAGER</p>
        </div>

        {/* Pages + media */}
        <div>
          <div className="cell cell-pad" style={{ marginBottom: '14px' }}>
            <h3 style={{ marginBottom: '10px' }}>PAGES</h3>
            {pages.map((p) => (
              <div key={p.slug} className="spread" style={{ padding: '8px 0', borderBottom: '1px dashed var(--line-soft)' }}>
                <div>
                  <span className="small uppercase">{p.title}</span>
                  <span className="faint xs" style={{ display: 'block' }}>{p.slug} · UPD {p.updated}</span>
                </div>
                <div className="row" style={{ gap: '6px' }}>
                  <span className={`badge ${p.status === 'published' ? 'badge-ok' : 'badge-warn'}`}>{p.status}</span>
                  <button type="button" className="btn btn-sm btn-ghost" onClick={() => toggleStatus(p.slug)}>
                    {p.status === 'published' ? 'UNPUBLISH' : 'PUBLISH'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cell cell-pad">
            <h3 style={{ marginBottom: '10px' }}>MEDIA LIBRARY</h3>
            {media.map((m) => (
              <div key={m.name} className="spread" style={{ padding: '7px 0', borderBottom: '1px dashed var(--line-soft)' }}>
                <span className="small">{m.name}</span>
                <span className="xs faint">{m.type} · {m.size} · {m.tags.join(', ')}</span>
              </div>
            ))}
            <p className="faint xs" style={{ marginTop: '10px' }}>UPLOAD · COMPRESS · TAG · DELETE — PIPELINE CONNECTED TO OBJECT STORAGE (S3/R2)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
