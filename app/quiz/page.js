'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUIZ_STEPS } from '@/lib/content';
import { create, update } from '@/lib/db';
import { useUI } from '@/components/ui/UIProvider';

// 9-step typed flow (FR-QZ). Anonymous: session UUID created on first step,
// persisted server-side (Supabase quiz_sessions) keyed by cookie.
export default function QuizPage() {
  const router = useRouter();
  const { showToast } = useUI();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [hours, setHours] = useState(15);
  const [constraints, setConstraints] = useState([]);
  const [skillsText, setSkillsText] = useState('');
  const sessionRef = useRef(null);

  const cur = QUIZ_STEPS[step];
  const total = QUIZ_STEPS.length;

  // Ensure a session row exists (or reuse the cookie one).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let sid = null;
      try { sid = document.cookie.match(/quiz_session=([^;]+)/)?.[1] || null; } catch { /* ignore */ }
      if (sid) {
        sessionRef.current = sid;
        setSessionId(sid);
        return;
      }
      const row = await create('quiz_sessions', { current_step: 1 });
      if (cancelled) return;
      sessionRef.current = row.id;
      setSessionId(row.id);
      document.cookie = `quiz_session=${row.id}; path=/; max-age=2592000; samesite=lax`;
    })();
    return () => { cancelled = true; };
  }, []);

  const persist = async (patch) => {
    if (!sessionRef.current) return;
    setSaving(true);
    try {
      await update('quiz_sessions', sessionRef.current, { ...patch, current_step: step + 2 });
    } catch {
      // Demo/localStorage failures are non-fatal; Supabase errors surface in admin.
    } finally {
      setSaving(false);
    }
  };

  const next = async () => {
    const a = { ...answers };
    if (cur.key === 'weekly_hours') a.weekly_hours = hours;
    if (cur.key === 'hard_constraints') a.hard_constraints = constraints;
    if (cur.key === 'existing_skills') a.existing_skills = skillsText.split(',').map((s) => s.trim()).filter(Boolean);
    else a[cur.key] = cur.multi ? constraints : cur.slider ? hours : answers[cur.key];
    setAnswers(a);
    await persist(a);

    if (step === total - 1) {
      await update('quiz_sessions', sessionRef.current, { ...a, completed_at: new Date().toISOString() }).catch(() => {});
      showToast('Profile locked in — proceeding to ingestion');
      router.push('/ingest');
      return;
    }
    setStep(step + 1);
  };

  const back = () => {
    if (step === 0) router.push('/');
    else setStep(step - 1);
  };

  const pick = (v) => {
    if (cur.multi) {
      setConstraints((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
    } else {
      setAnswers((a) => ({ ...a, [cur.key]: v }));
    }
  };

  const selected = cur.multi
    ? constraints
    : cur.slider ? hours : answers[cur.key];

  return (
    <div className="wrap" style={{ maxWidth: '720px', paddingTop: '48px', paddingBottom: '80px' }}>
      <div className="spread" style={{ marginBottom: '14px' }}>
        <span className="badge badge-accent">CONSTRAINT QUIZ</span>
        <span className="xs faint">STEP {String(step + 1).padStart(2, '0')}/{total}</span>
      </div>

      <div className="progress-track" style={{ marginBottom: '28px' }}>
        <div className="progress-fill" style={{ width: `${((step + 1) / total) * 100}%` }} />
        <div className="ticks" />
      </div>

      <div key={step} className="cell cell-pad-lg quiz-step page-enter">
        <p className="faint xs" style={{ letterSpacing: '0.14em', marginBottom: '6px' }}>
          /Q{String(cur.n).padStart(2, '0')}
        </p>
        <h2 style={{ marginBottom: '6px' }}>{cur.title}</h2>
        <p className="dim" style={{ marginBottom: '22px' }}>{cur.prompt}</p>

        {cur.slider && (
          <div>
            <div className="spread" style={{ marginBottom: '8px' }}>
              <span className="meter-value" style={{ fontSize: '40px' }}>{hours}</span>
              <span className="xs faint">HRS/WEEK · 0–60</span>
            </div>
            <input
              type="range"
              min={cur.slider.min} max={cur.slider.max} value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              aria-label="Weekly hours"
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>
        )}

        {cur.text && (
          <textarea
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="e.g. blender, video editing, notion, copywriting…"
            aria-label="Existing skills"
            className="cell-soft"
            style={{ width: '100%', padding: '14px', minHeight: '120px', background: 'var(--bg)' }}
          />
        )}

        {cur.options?.map((o) => (
          <button
            type="button"
            key={String(o.value)}
            className="quiz-opt"
            data-selected={selected === o.value || (cur.multi && selected.includes(o.value))}
            onClick={() => pick(o.value)}
          >
            {o.label}
            {o.desc && <span className="desc">{o.desc}</span>}
          </button>
        ))}

        <div className="quiz-nav">
          <button type="button" className="btn" onClick={back}>← BACK</button>
          <button
            type="button"
            className="btn btn-accent"
            onClick={next}
            disabled={!cur.multi && !cur.slider && !cur.text && selected === undefined}
          >
            {saving ? 'SAVING…' : step === total - 1 ? 'LOCK PROFILE →' : 'NEXT →'}
          </button>
        </div>
        <p className="faint xs" style={{ marginTop: '14px' }}>
          {sessionId ? `SESSION ${String(sessionId).slice(0, 8)}… AUTO-SAVED` : 'INITIALIZING SESSION…'}
        </p>
      </div>

      <p className="faint xs" style={{ marginTop: '16px', textAlign: 'center' }}>
        ANONYMOUS — NO ACCOUNT REQUIRED UNTIL INGESTION (MAGIC LINK) · PRIVACY: /PRIVACY
      </p>
    </div>
  );
}
