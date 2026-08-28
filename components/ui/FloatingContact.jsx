'use client';

import { useEffect, useRef, useState } from 'react';

// Floating contact widget — rendered on every page where it helps (all).
export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="float-contact" ref={ref}>
      {open && (
        <div className="panel cell-pad">
          <p className="small uppercase" style={{ letterSpacing: '0.1em', marginBottom: '6px' }}>
            <span style={{ color: 'var(--accent)' }}>■</span> SUPPORT CHANNEL
          </p>
          <p className="small dim" style={{ marginBottom: '12px' }}>
            Questions about ingestion, licenses, or refunds? We answer within 24h.
          </p>
          <div className="row" style={{ gap: '8px' }}>
            <a className="btn btn-sm btn-accent" href="/contact">CONTACT FORM</a>
            <a className="btn btn-sm btn-ghost" href="/faq">FAQ</a>
          </div>
        </div>
      )}
      <button
        type="button"
        className="fab"
        aria-label={open ? 'Close contact panel' : 'Open contact panel'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        title="Contact"
      >
        {open ? '✕' : '?'}
      </button>
    </div>
  );
}
