import { useEffect, useState } from 'react';

const SHOW_NEAR_TOP = 120;
const MIN_DELTA = 6;
/** Momentum scrolling keeps going after the finger lifts, so input counts for a while. */
const INPUT_WINDOW_MS = 1500;
const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);

/**
 * Phone-style auto-hiding chrome: true while the visitor scrolls down, false as soon as they scroll
 * up or are near the top. Only active for viewports matching `query`. Scrolls the visitor did not
 * make (page changes, restored positions, content swaps) never hide it.
 */
export function useHideOnScroll(query = '(max-width: 767px)') {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    let last = window.scrollY;
    let lastInput = -Infinity;
    const onInput = () => { lastInput = performance.now(); };
    // Taps and Enter on links are not scrolling: only drags, wheel and scroll keys count.
    const onKey = (e: KeyboardEvent) => { if (SCROLL_KEYS.has(e.key)) onInput(); };
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < MIN_DELTA) return;
      last = y;
      const byVisitor = performance.now() - lastInput < INPUT_WINDOW_MS;
      if (!mq.matches || y < SHOW_NEAR_TOP || delta < 0) setHidden(false);
      else if (byVisitor) setHidden(true);
    };
    const onMedia = () => { if (!mq.matches) setHidden(false); };
    window.addEventListener('touchmove', onInput, { passive: true });
    window.addEventListener('wheel', onInput, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    mq.addEventListener('change', onMedia);
    return () => {
      window.removeEventListener('touchmove', onInput);
      window.removeEventListener('wheel', onInput);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', onMedia);
    };
  }, [query]);

  return hidden;
}
