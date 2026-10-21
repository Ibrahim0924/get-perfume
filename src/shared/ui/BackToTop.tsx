import { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/cn';

const MIN_DELTA = 6;

/**
 * Floating "to top" button. Shows up only while the visitor scrolls back up (past ~1.5 screens),
 * which is when they want it, and slides away again as soon as they scroll down.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < MIN_DELTA) return;
      last = y;
      setVisible(delta < 0 && y > window.innerHeight * 1.5);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Наверх"
      title="Наверх"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        'fixed z-30 flex size-11 items-center justify-center rounded-full border border-line/80 bg-surface/90 text-muted shadow-[0_8px_24px_-12px_rgba(0,0,0,.45)] backdrop-blur transition-all duration-300 hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
        // Clear of the screen edge and the phone's gesture bar.
        '[right:calc(1.5rem+env(safe-area-inset-right))] [bottom:calc(2rem+env(safe-area-inset-bottom))]',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
}
