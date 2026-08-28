'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSession, logout } from '@/lib/auth';
import { useEffect } from 'react';

// Admin shell: sidebar + content. Redirects to /admin when unauthenticated.
const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', ico: '▦' },
  { href: '/admin/users', label: 'Users', ico: '◎' },
  { href: '/admin/content', label: 'Content', ico: '▤' },
  { href: '/admin/orders', label: 'Orders', ico: '$' },
  { href: '/admin/messages', label: 'Messages', ico: '✉' },
  { href: '/admin/settings', label: 'Settings', ico: '⚙' },
  { href: '/admin/audit', label: 'Audit Log', ico: '≡' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!getSession() && pathname !== '/admin') {
      router.replace('/admin');
    }
  }, [pathname, router]);

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <nav aria-label="Admin">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={pathname === n.href ? 'active' : ''}>
              <span style={{ color: 'var(--accent)' }}>{n.ico}</span> {n.label}
            </Link>
          ))}
          <Link href="/" style={{ marginTop: 'auto', borderTop: '1px solid var(--line-soft)' }}>← BACK TO SITE</Link>
          <button
            type="button"
            onClick={() => { logout(); router.replace('/admin'); }}
            style={{ textAlign: 'left', marginTop: '4px' }}
          >
            <span style={{ color: 'var(--danger)' }}>✕</span> LOG OUT
          </button>
        </nav>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
