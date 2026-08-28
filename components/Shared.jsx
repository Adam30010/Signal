// Shared content pieces: FAQ accordion, code block with copy, section head.
'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export function SectionHead({ idx, title, right }) {
  return (
    <div className="section-head">
      <h2><span className="idx">/{idx}</span> {title}</h2>
      {right && <div>{right}</div>}
    </div>
  );
}

export function FAQAccordion({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="acc" data-open={open === i}>
          <button
            type="button"
            className="acc-btn"
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            aria-controls={`faq-panel-${i}`}
          >
            <span>{String(i + 1).padStart(2, '0')} — {item.q}</span>
            <span className="acc-ico" aria-hidden="true">+</span>
          </button>
          <div className="acc-panel" id={`faq-panel-${i}`} role="region">
            {item.a}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CodeBlock({ title = 'CODE', code }) {
  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <span>{title}</span>
        <CopyButton text={code} label="COPY" />
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

export function Skeleton({ lines = 3 }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton sk-line" style={{ width: `${100 - i * 18}%` }} />
      ))}
    </div>
  );
}
