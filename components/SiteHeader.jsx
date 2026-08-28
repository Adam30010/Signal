'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUI } from '@/components/ui/UIProvider';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { LINKS, SITE } from '@/lib/site';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/blueprint', label: 'Blueprint' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { menuOpen, setMenuOpen, searchOpen, setSearchOpen } = useUI();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, setMenuOpen]);

  const isAdminArea = pathname?.startsWith('/admin');

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`} style={scrolled ? { boxShadow: '0 1px 0 var(--line-soft)' } : undefined}>
      <div className="wrap inner">
        <Link href="/" className="brand" aria-label={`${SITE.name} home`}>
          <span className="tick">▮</span>
          {SITE.name}
          <span className="faint xs" style={{ letterSpacing: '0.2em' }}>V{SITE.version}</span>
        </Link>

        <nav className="main-nav" aria-label="Primary">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={pathname === n.href ? 'active' : ''}>
              {n.label}
            </Link>
          ))}
          {isAdminArea && <Link href="/admin" className="active">ADMIN</Link>}
        </nav>

        <div className="hdr-tools">
          <button type="button" className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search site" title="Search (⌘K)">
            ⌕
          </button>
          <ThemeToggle />
          <Link href={LINKS.quiz} className="btn btn-sm btn-accent" style={{ display: 'inline-flex' }}>
            START QUIZ
          </Link>
          <button
            type="button"
            className="icon-btn hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '≡'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-menu" aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={pathname === n.href ? 'active' : ''}>
              {n.label}
            </Link>
          ))}
          <Link href="/admin">ADMIN</Link>
          <Link href="/quiz" style={{ color: 'var(--accent)' }}>START QUIZ →</Link>
        </nav>
      )}
    </header>
  );
}
