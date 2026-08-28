'use client';

import { useEffect } from 'react';
import { initTheme } from '@/lib/theme';
import { captureUtm } from '@/lib/utm';
import { seedDemoData } from '@/lib/db';
import { applyBranding, BRANDING_EVENT } from '@/lib/branding';

// Bootstraps client-side concerns exactly once: theme, UTM capture,
// runtime branding overrides (logo/accent from /admin/settings),
// demo-data seeding (no-op when Supabase is configured).
export default function ClientShell({ children }) {
  useEffect(() => {
    initTheme();
    captureUtm();
    applyBranding();
    seedDemoData().catch(() => {});
    const onBranding = () => applyBranding();
    window.addEventListener(BRANDING_EVENT, onBranding);
    return () => window.removeEventListener(BRANDING_EVENT, onBranding);
  }, []);
  return children;
}
