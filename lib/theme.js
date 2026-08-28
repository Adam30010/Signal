// Theme handling: dark is the brand identity (default). Light is a
// convenience override. Persisted in localStorage, applied to <html>.

const KEY = 'signal_theme';

export function getTheme() {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark'; // brand default — dark always unless user opts into light
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
}

export function setTheme(theme) {
  window.localStorage.setItem(KEY, theme);
  applyTheme(theme);
}

export function initTheme() {
  applyTheme(getTheme());
}
