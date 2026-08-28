'use client';

import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [choice, setChoice] = useState(null); // 'accepted' | 'declined'

  useEffect(() => {
    const saved = localStorage.getItem('signal_cookies');
    if (saved) {
      setChoice(saved);
    } else {
      const t = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  if (!show || choice) return null;

  const decide = (v) => {
    localStorage.setItem('signal_cookies', v);
    setChoice(v);
    setShow(false);
    if (v === 'accepted') window.dispatchEvent(new CustomEvent('signal:cookies-accepted'));
  };

  return (
    <aside className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cell-pad">
        <p className="small uppercase" style={{ letterSpacing: '0.1em', marginBottom: '8px' }}>
          <span style={{ color: 'var(--accent)' }}>■</span> COOKIES
        </p>
        <p className="small dim" style={{ marginBottom: '14px' }}>
          We use cookies to persist your quiz session, theme, and UTM attribution — and, with your
          consent, to log analytics. No trackers beyond that. See our{' '}
          <a href="/privacy" style={{ textDecoration: 'underline', color: 'var(--accent)' }}>privacy policy</a>.
        </p>
        <div className="row" style={{ gap: '8px' }}>
          <button type="button" className="btn btn-sm btn-accent" onClick={() => decide('accepted')}>
            ACCEPT
          </button>
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => decide('declined')}>
            DECLINE
          </button>
        </div>
      </div>
    </aside>
  );
}
