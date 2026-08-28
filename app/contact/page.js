'use client';

import { useState } from 'react';
import { create } from '@/lib/db';
import { useUI } from '@/components/ui/UIProvider';

// Form with explicit success / error states + confirmation (requirement list).
// SEO title via layout template (client page).
export default function ContactPage() {
  const { openModal, showToast } = useUI();
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // 'idle' | 'sending' | 'success' | 'error'
  const [attempts, setAttempts] = useState(0);

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = 'NAME IS REQUIRED';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'VALID EMAIL REQUIRED';
    if (!values.subject.trim()) e.subject = 'SUBJECT REQUIRED';
    if (values.message.trim().length < 20) e.message = 'MESSAGE MUST BE ≥ 20 CHARACTERS';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setStatus('idle');
    if (!validate()) {
      setStatus('error');
      setAttempts((a) => a + 1);
      return;
    }
    setStatus('sending');
    try {
      await create('messages', { ...values, read: false });
      setStatus('success');
      openModal({
        title: 'MESSAGE RECEIVED',
        body: (
          <div>
            <p className="small dim">Reference: <span style={{ color: 'var(--accent)' }}>MSG-{Date.now().toString(36).toUpperCase()}</span></p>
            <p className="small dim" style={{ marginTop: '10px' }}>
              Your message is queued in the support inbox. We respond within 24 hours — typically faster.
            </p>
          </div>
        ),
        confirmLabel: 'CLOSE',
      });
      setValues({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch {
      setStatus('error');
      showToast('Failed to send — check your connection', 'err');
    }
  };

  const set = (k) => (ev) => {
    setValues((v) => ({ ...v, [k]: ev.target.value }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  return (
    <div className="wrap" style={{ maxWidth: '680px', paddingTop: '48px', paddingBottom: '80px' }}>
      <div className="spread" style={{ marginBottom: '24px' }}>
        <h2>CONTACT</h2>
        <span className="badge badge-accent">RESPONSE ≤ 24H</span>
      </div>
      <p className="dim" style={{ marginBottom: '28px' }}>
        Ingestion questions, license mechanics, refunds, press — one channel, zero bots.
      </p>

      {status === 'success' && (
        <div className="alert alert-ok" role="status" style={{ marginBottom: '18px' }}>
          <span className="marker">■</span> MESSAGE SENT — REFERENCE LOGGED ABOVE. WE&apos;LL REPLY TO {values.email || 'YOUR INBOX'}.
        </div>
      )}
      {status === 'error' && (
        <div className="alert alert-err" role="alert" style={{ marginBottom: '18px' }}>
          <span className="marker">■</span> FORM HAS ERRORS — FIX THEM AND RESUBMIT (ATTEMPT {attempts}).
        </div>
      )}

      <form className="cell cell-pad-lg" onSubmit={submit} noValidate>
        <div className="grid g2" style={{ gap: '0 14px' }}>
          <div className="field">
            <label htmlFor="name" className="req">NAME</label>
            <input id="name" type="text" value={values.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} autoComplete="name" />
            {errors.name && <span className="error-msg" id="name-err">{errors.name}</span>}
          </div>
          <div className="field">
            <label htmlFor="email" className="req">EMAIL</label>
            <input id="email" type="email" value={values.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} autoComplete="email" />
            {errors.email && <span className="error-msg" id="email-err">{errors.email}</span>}
          </div>
        </div>
        <div className="field">
          <label htmlFor="subject" className="req">SUBJECT</label>
          <input id="subject" type="text" value={values.subject} onChange={set('subject')} aria-invalid={!!errors.subject} aria-describedby={errors.subject ? 'subject-err' : undefined} />
          {errors.subject && <span className="error-msg" id="subject-err">{errors.subject}</span>}
        </div>
        <div className="field">
          <label htmlFor="message" className="req">MESSAGE</label>
          <textarea id="message" value={values.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-err' : undefined} placeholder="Minimum 20 characters…" />
          {errors.message ? <span className="error-msg" id="message-err">{errors.message}</span> : <span className="hint">{values.message.length}/20 MIN CHARACTERS</span>}
        </div>
        <button type="submit" className="btn btn-accent btn-lg btn-block" disabled={status === 'sending'}>
          {status === 'sending' ? <span className="spinner" /> : null}
          {status === 'sending' ? 'TRANSMITTING…' : 'SEND MESSAGE →'}
        </button>
        <p className="faint xs" style={{ marginTop: '12px', textAlign: 'center' }}>
          NO NEWSLETTER. NO SPAM. YOUR MESSAGE GOES ONLY TO SUPPORT. (CASL/CAN-SPAM RESPECTED)
        </p>
      </form>
    </div>
  );
}
