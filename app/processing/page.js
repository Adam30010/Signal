'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PIPELINE_STAGES } from '@/lib/content';

// Async processing screen (FR-AS-03): live telemetry readout, streamed
// status events. Production reads SSE from /api/jobs/:jobId/events; the
// demo replays the same stage sequence locally so the UX is identical.
export default function ProcessingPage() {
  const router = useRouter();
  const [stageIdx, setStageIdx] = useState(0);
  const [lines, setLines] = useState([]);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [events, setEvents] = useState(1284);
  const [clusters, setClusters] = useState(0);
  const logRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const push = (line, kind = '') =>
      setLines((prev) => [...prev, { ts: new Date().toISOString().slice(11, 19), text: line, kind }]);

    const t0 = Date.now();
    const stage = (i) => {
      if (i >= PIPELINE_STAGES.length) return;
      const s = PIPELINE_STAGES[i];
      setStageIdx(i);
      push(`[job:bp_${Math.random().toString(36).slice(2, 10)}] → ${s.verb}`, 'ok');
      const next = () => {
        if (i === 1) { setEvents(1284); push('embedded 1,284 events · 1536-dim · batch 6/6 · tpm-ok', ''); }
        if (i === 2) { const c = 23; setClusters(c); push(`collapsed corpus → ${c} thematic clusters (silhouette 0.42)`, ''); }
        if (i === 3) { push('latent skill: 3D_ENVIRONMENT_ART (conf 0.91, recency 0.87)', ''); }
        if (i === 4) { push('matched 4/41 curated opportunities after hard-constraint filter', ''); }
        if (i === 5) { push('composed blueprint tree · 2 phases · 14 basic nodes · 12 premium nodes (gated)', ''); }
        if (i === PIPELINE_STAGES.length - 1) {
          push('blueprint.ready — rendering…', 'ok');
          setDone(true);
          setPct(100);
        }
      };
      const delay = i === 0 ? 900 : i === 5 ? 1400 : 650;
      setTimeout(next, delay);
    };

    // run stages sequentially
    let i = 0;
    const run = () => {
      stage(i);
      const del = i === 0 ? 900 : i === 5 ? 1400 : 650;
      i += 1;
      if (i < PIPELINE_STAGES.length) setTimeout(run, del + 400);
      else setPct(100);
    };
    run();

    // fake progress counter
    const iv = setInterval(() => {
      setPct((p) => {
        const elapsed = Date.now() - t0;
        const max = 6000;
        return Math.min(97, Math.round((elapsed / max) * 100));
      });
    }, 200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [lines]);

  const stage = PIPELINE_STAGES[Math.min(stageIdx, PIPELINE_STAGES.length - 1)];

  return (
    <div className="wrap" style={{ maxWidth: '860px', paddingTop: '48px', paddingBottom: '80px' }}>
      <div className="spread" style={{ marginBottom: '20px' }}>
        <h2 className="blink">PROCESSING YOUR SIGNAL</h2>
        <span className="badge badge-accent">STEP 3 / 5</span>
      </div>

      <div className="meter" style={{ marginBottom: '16px' }}>
        <div className="spread" style={{ marginBottom: '10px' }}>
          <span className="meter-live"><span className="dot" /> JOB ACTIVE</span>
          <span className="xs faint">STAGE: {stage.label} · QUEUE: generate_blueprint</span>
        </div>
        <div className="meter-bar" style={{ height: '14px' }}>
          <div className="fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="spread xs" style={{ color: 'var(--dim)', marginTop: '8px' }}>
          <span>{pct}% COMPLETE</span>
          <span>EVENTS {events.toLocaleString()} · CLUSTERS {clusters || '—'}</span>
        </div>
      </div>

      <div className="term-log" ref={logRef} aria-live="polite" aria-label="Processing log">
        <div className="line"><span className="ts">[00:00:00]</span> signal v0.1.0 · pipeline started</div>
        {lines.map((l, i) => (
          <div key={i} className={`line ${l.kind}`}>
            <span className="ts">[{l.ts}]</span> {l.text}
          </div>
        ))}
        {!done && <span className="blink" style={{ color: 'var(--accent)' }} />}
      </div>

      <div style={{ marginTop: '20px', minHeight: '70px' }}>
        {done ? (
          <button type="button" className="btn btn-accent btn-lg btn-block" onClick={() => router.push('/blueprint')}>
            VIEW MY BLUEPRINT →
          </button>
        ) : (
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="faint xs">SEPARATE QUEUES · EXP BACKOFF · DLQ · THIS NEVER BLOCKS THE API (NFR-07)</span>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => router.push('/ingest')}>← CHANGE SOURCES</button>
          </div>
        )}
      </div>
    </div>
  );
}
