'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useUI } from '@/components/ui/UIProvider';
import { SEARCH_INDEX, searchIndex } from '@/lib/search';

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useUI();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      setQ('');
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen, setSearchOpen]);

  const results = useMemo(() => searchIndex(q, 12), [q]);

  if (!searchOpen) return null;

  const go = (path) => {
    setSearchOpen(false);
    window.location.href = path;
  };

  return (
    <div className="modal-overlay search-modal" onClick={() => setSearchOpen(false)} role="dialog" aria-modal="true" aria-label="Site search">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>SITE SEARCH</h3>
          <span className="small faint">ESC TO CLOSE · <span className="kbd">⌘K</span></span>
        </div>
        <input
          ref={inputRef}
          className="search-input"
          placeholder="TYPE TO SEARCH — e.g. license, quiz, density…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            if (e.key === 'Enter' && results[sel]) go(results[sel].path);
          }}
          aria-label="Search query"
        />
        <div className="search-results" role="listbox">
          {q.trim() === '' && (
            <div className="search-empty">
              {SEARCH_INDEX.length} DOCUMENTS INDEXED — TRY "LICENSE", "TIKTOK", "DENSITY", "ADMIN"…
            </div>
          )}
          {q.trim() !== '' && results.length === 0 && (
            <div className="search-empty">NO MATCHES FOR "{q}"</div>
          )}
          {results.map((r, i) => (
            <a
              key={`${r.path}-${r.title}-${i}`}
              href={r.path}
              role="option"
              aria-selected={i === sel}
              onClick={(e) => { e.preventDefault(); go(r.path); }}
              onMouseEnter={() => setSel(i)}
              style={{ background: i === sel ? 'var(--accent-dim)' : undefined }}
            >
              <div className="t">{r.title}</div>
              <div className="d">{r.blurb} · {r.path}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
