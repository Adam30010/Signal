'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, getSession } from '@/lib/auth';

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  if (getSession()) {
    // Already authed → dashboard lives at /admin/dashboard
    if (typeof window !== 'undefined') {
      router.replace('/admin/dashboard');
      return null;
    }
  }

  const submit = (e) => {
    e.preventDefault();
    const s = login(password);
    if (s) {
      router.replace('/admin/dashboard');
    } else {
      setError('INVALID CREDENTIALS — TRY THE DEMO PASSWORD (signal-admin)');
    }
  };

  return (
    <div className="wrap" style={{ maxWidth: '520px', paddingTop: '72px' }}>
      <div className="cell cell-pad-lg">
        <p className="tagline" style={{ color: 'var(--accent)', letterSpacing: '0.2em', fontSize: '12px' }}>▮ RESTRICTED ACCESS</p>
        <h2 style={{ margin: '8px 0 20px' }}>ADMIN PANEL</h2>
        {error && (
          <div className="alert alert-err" role="alert" style={{ marginBottom: '16px' }}>
            <span className="marker">■</span> {error}
          </div>
        )}
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="admin-pass" className="req">PASSWORD</label>
            <div className="pw-wrap">
              <input
                id="admin-pass"
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                aria-invalid={!!error}
                autoComplete="current-password"
              />
              <button type="button" className="pw-toggle" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            <span className="hint">DEMO MODE: USE <b style={{ color: 'var(--accent)' }}>signal-admin</b>. WITH SUPABASE: AUTH VIA supabase.auth (see supabase/README.md).</span>
          </div>
          <button type="submit" className="btn btn-accent btn-block btn-lg">AUTHENTICATE →</button>
        </form>
      </div>
      <p className="faint xs" style={{ textAlign: 'center', marginTop: '16px' }}>
        2FA ENFORCEMENT · RBAC TIERS · FULL AUDIT LOG — PRODUCTION REQUIREMENTS (SEC-09)
      </p>
    </div>
  );
}
