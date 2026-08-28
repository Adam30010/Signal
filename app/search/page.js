'use client';

import { useMemo, useState } from 'react';
import { searchIndex } from '@/lib/search';

export default function SearchPage() {
  const [q, setQ] = useState('');
  const results = useMemo(() => searchIndex(q, 24), [q]);

  return (
    <div className="wrap" style={{ maxWidth: '720px', paddingTop: '48px' }}>
      <h2 style={{ marginBottom: '20px' }}>SEARCH</h2>
      <input
        className="search-input"
        style={{ border: '1px solid var(--line)', marginBottom: '18px' }}
        placeholder="SEARCH THE SITE — LICENSE, TIKTOK, DENSITY, QUIZ…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
        aria-label="Search query"
      />
      {q.trim() === '' && (
        <p className="dim small">Type to search {searchIndex('', 0).length || 'all'} indexed pages and topics. Tip: press <span className="kbd">⌘K</span> anywhere.</p>
      )}
      {q.trim() !== '' && results.length === 0 && <p className="dim">NO MATCHES FOR "{q}"</p>}
      {results.map((r, i) => (
        <a key={`${r.path}-${i}`} href={r.path} className="cell cell-pad" style={{ display: 'block', marginBottom: '8px' }}>
          <div className="spread">
            <span className="small uppercase" style={{ letterSpacing: '0.06em' }}>{r.title}</span>
            <span className="xs faint">{r.path}</span>
          </div>
          <p className="faint xs" style={{ marginTop: '4px' }}>{r.blurb}</p>
        </a>
      ))}
    </div>
  );
}
