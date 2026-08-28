// ═══════════════════════════════════════════════════════════════════════
// Auth — demo role-based access for the admin panel.
//
// Credentials (launch defaults, overridable via env):
//   username: Adam            (NEXT_PUBLIC_DEMO_ADMIN_USERNAME)
//   password: Password123     (NEXT_PUBLIC_DEMO_ADMIN_PASSWORD)
//
// Admin profile (email + password) is editable from /admin/settings
// (Account section). Per product decision there is NO change-username
// feature — the username is fixed.
//
// With Supabase configured, swap this module for @supabase/ssr auth
// (see supabase/README.md). The demo layer persists sessions in
// localStorage so the full admin UX is explorable without env vars.
// ═══════════════════════════════════════════════════════════════════════

const KEY = 'signal_admin_session';
const PROFILE_KEY = 'signal_admin_profile';

// Fixed username — change-username is intentionally NOT supported.
const DEFAULT_USERNAME = process.env.NEXT_PUBLIC_DEMO_ADMIN_USERNAME || 'Adam';
const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || 'Password123';
const DEFAULT_EMAIL = 'admin@signal.demo';

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

// ── Admin profile store (demo: localStorage; Supabase: auth table) ─────

function readProfile() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(window.localStorage.getItem(PROFILE_KEY)) || null;
  } catch {
    return null;
  }
}

function writeProfile(profile) {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getCredentials() {
  const p = readProfile();
  return {
    username: DEFAULT_USERNAME, // fixed — no change-username feature
    email: p?.email || DEFAULT_EMAIL,
    password: p?.password || DEFAULT_PASSWORD,
  };
}

// ── Session ────────────────────────────────────────────────────────────

export function login(username, password) {
  if (!username || !password) return null;
  const creds = getCredentials();
  if (String(username).trim().toLowerCase() !== creds.username.toLowerCase()) return null;
  if (password !== creds.password) return null;
  const session = {
    user: {
      id: 'admin',
      username: creds.username,
      email: creds.email,
      role: ROLES.SUPER_ADMIN,
    },
    at: Date.now(),
  };
  window.localStorage.setItem(KEY, JSON.stringify(session));
  return session;
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
  return !!getSession();
}

export function hasRole(role) {
  const s = getSession();
  if (!s?.user) return false;
  const hierarchy = [ROLES.SUPER_ADMIN, ROLES.EDITOR, ROLES.MODERATOR, ROLES.SUPPORT];
  return hierarchy.indexOf(s.user.role) <= hierarchy.indexOf(role);
}

// ── Account management (admin settings) ────────────────────────────────

export function changeEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('VALID EMAIL REQUIRED');
  }
  const creds = getCredentials();
  writeProfile({ ...creds, email });
  const s = getSession();
  if (s) {
    s.user.email = email;
    window.localStorage.setItem(KEY, JSON.stringify(s));
  }
  return true;
}

export function changePassword(currentPassword, newPassword) {
  const creds = getCredentials();
  if (currentPassword !== creds.password) {
    throw new Error('CURRENT PASSWORD INCORRECT');
  }
  if (!newPassword || newPassword.length < 8) {
    throw new Error('NEW PASSWORD MUST BE AT LEAST 8 CHARACTERS');
  }
  writeProfile({ ...creds, password: newPassword });
  return true;
}

// Demo mode: single local session. Production (Supabase): invalidate
// all refresh tokens server-side.
export function logoutAllSessions() {
  logout();
}
