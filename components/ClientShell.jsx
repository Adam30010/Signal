'use client';

import { useEffect } from 'react';
import { initTheme } from '@/lib/theme';
import { captureUtm } from '@/lib/utm';
import { seedDemoData } from '@/lib/db';

// Bootstraps client-side concerns exactly once: theme, UTM capture,
// demo-data seeding (no-op when Supabase is configured).
export default function ClientShell({ children }) {
  useEffect(() => {
    initTheme();
    captureUtm();
    seedDemoData().catch(() => {});
  }, []);
  return children;
}
