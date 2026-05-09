export type Theme = 'light' | 'dark';

export const STORAGE_KEY = 'app-theme';

export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

export function applyTheme(theme: Theme) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}
