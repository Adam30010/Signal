'use client';

// Providers (client-side) — global UI state: menu, modal, cookies, search.
// Small, purpose-built, zero dependencies. Theme is handled by lib/theme.js.

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [modal, setModal] = useState(null); // { title, body, confirmLabel, onConfirm }
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [cookiesSeen, setCookiesSeen] = useState(false);
  const toastRef = useRef(null);

  const showToast = useCallback((msg, kind = 'ok') => {
    if (!toastRef.current) {
      const el = document.createElement('div');
      el.id = 'toast';
      Object.assign(el.style, {
        position: 'fixed', bottom: '84px', left: '50%', transform: 'translateX(-50%)',
        zIndex: '500', border: '1px solid var(--line)', background: 'var(--bg)',
        color: 'var(--fg)', padding: '10px 18px', fontSize: '12px',
        textTransform: 'uppercase', letterSpacing: '0.06em', boxShadow: '6px 6px 0 rgba(255,255,255,0.06)',
      });
      toastRef.current = el;
      document.body.appendChild(el);
    }
    const el = toastRef.current;
    el.textContent = msg;
    el.style.borderColor = kind === 'err' ? 'var(--danger)' : 'var(--accent)';
    el.style.color = kind === 'err' ? 'var(--danger)' : 'var(--fg)';
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = '0'; }, 2600);
  }, []);

  const openModal = useCallback((m) => setModal(m), []);
  const closeModal = useCallback(() => setModal(null), []);

  const value = useMemo(
    () => ({
      menuOpen, setMenuOpen,
      searchOpen, setSearchOpen,
      modal, openModal, closeModal,
      showToast,
      cookiesAccepted,
      acceptCookies: () => { setCookiesAccepted(true); localStorage.setItem('signal_cookies', 'accepted'); },
      declineCookies: () => { setCookiesAccepted(true); localStorage.setItem('signal_cookies', 'declined'); },
      cookiesSeen,
      setCookiesSeen,
    }),
    [menuOpen, searchOpen, modal, cookiesAccepted, cookiesSeen, openModal, closeModal, showToast]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside UIProvider');
  return ctx;
}
