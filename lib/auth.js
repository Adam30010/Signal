// ═══════════════════════════════════════════════════════════════════════
// Auth — demo role-based access for the admin panel.
//
// With Supabase configured, swap this module for @supabase/ssr auth
// (see supabase/README.md). The demo layer persists an admin session in
// localStorage so the full admin UX is explorable without env vars.
// ═══════════════════════════════════════════════════════════════════════

import { isSupabaseConfigured } from '@/lib/db';

const KEY = 'signal_admin_session';
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || 'signal-admin';

// RBAC tiers (PRD §5.12 / admin spec): super_admin > editor > moderator > support
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  EDITOR: 'editor',
  MODERATOR: 'moderator',
  SUPPORT: 'support',
};

export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  editor: 'Editor',
  moderator: 'Moderator',
  support: 'Support Agent',
};

export function login(password) {
  if (isSupabaseConfigured()) {
    // Real deployments: use Supabase Auth (supabase.auth.signInWithPassword)
    // — see supabase/README.md. This branch keeps the demo running.
    if (password === DEMO_PASSWORD) {
      const session = {
        user: { email: 'admin@signal.demo', role: ROLES.SUPER_ADMIN, id: 'demo-admin' },
        demo: true,
        at: Date.now(),
      };
      window.localStorage.setItem(KEY, JSON.stringify(session));
      return session;
    }
    return null;
  }
  if (password === DEMO_PASSWORD) {
    const session = {
      user: { email: 'admin@signal.demo', role: ROLES.SUPER_ADMIN, id: 'demo-admin' },
      demo: true,
      at: Date.now(),
    };
    window.localStorage.setItem(KEY, JSON.stringify(session));
    return session;
  }
  return null;
}

export function logout() {
  window.localStorage.removeItem(KEY);
}

export function getSession() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(window.localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function isAdmin() {
  const s = getSession();
  return !!s && !!s.user;
}

export function hasRole(role) {
  const s = getSession();
  if (!s?.user) return false;
  const hierarchy = [ROLES.SUPER_ADMIN, ROLES.EDITOR, ROLES.MODERATOR, ROLES.SUPPORT];
  return hierarchy.indexOf(s.user.role) <= hierarchy.indexOf(role);
}
