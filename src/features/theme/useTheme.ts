import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'gerparfume:theme';
const QUERY = '(prefers-color-scheme: dark)';

function readStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia(QUERY).matches ? 'dark' : 'light';
}

/**
 * Switches every element in the same frame. Per-element colour transitions (hover effects) are
 * suspended for the swap, otherwise each part of the page fades at its own speed and the switch
 * looks jerky.
 */
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return;
  root.classList.add('theme-switching');
  root.dataset.theme = theme;
  // Keep the browser UI colour (address bar on phones) in sync with the chosen theme.
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#1c1b18' : '#ebe5da');
  void root.offsetWidth; // commit the new colours before transitions come back
  requestAnimationFrame(() => root.classList.remove('theme-switching'));
}

/** Cross-fades the whole page as one picture where the browser supports View Transitions. */
function withPageFade(update: () => void) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !document.startViewTransition) update();
  else document.startViewTransition(update);
}

/**
 * Theme follows the system until the visitor picks one with the toggle; only that explicit
 * choice is persisted (so a first visit in daylight does not lock the site to light forever).
 */
export function useTheme() {
  const [stored, setStored] = useState<Theme | null>(readStoredTheme);
  const [system, setSystem] = useState<Theme>(systemTheme);
  const theme = stored ?? system;

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setSystem(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => applyTheme(theme), [theme]);

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
    withPageFade(() => {
      applyTheme(next);
      flushSync(() => setStored(next)); // toggle icon swaps inside the same snapshot
    });
  }, [theme]);

  return { theme, toggle };
}
