'use client';

import { useState } from 'react';
import { useUI } from '@/components/ui/UIProvider';

export default function CopyButton({ text, label = 'COPY', className = '' }) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useUI();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('Copied to clipboard');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      showToast('Copy failed — select the text manually', 'err');
    }
  };

  return (
    <button type="button" className={`btn btn-sm ${className}`} onClick={copy} aria-live="polite">
      {copied ? '✓ COPIED' : label}
    </button>
  );
}
