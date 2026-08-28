'use client';

import { useEffect, useState } from 'react';
import { applyTheme, getTheme, setTheme as persistTheme } from '@/lib/theme';

export default function ThemeToggle() {
  const [theme, setThemeState] = useState('dark');

  useEffect(() => {
    setThemeState(getTheme());
    applyTheme(getTheme());
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    persistTheme(next);
  };

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {theme === 'dark' ? '☀' : '◐'}
    </button>
  );
}
