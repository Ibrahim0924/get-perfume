import { useEffect, useState } from 'react';
import { cn } from '@/shared/lib/cn';

/** Floating "to top" button; appears once the page is scrolled past ~1.5 screens. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * 1.5);
    update();
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
        'fixed right-4 bottom-4 z-30 flex size-11 items-center justify-center rounded-full border border-line/80 bg-surface/90 text-muted shadow-[0_8px_24px_-12px_rgba(0,0,0,.45)] backdrop-blur transition-all duration-300 hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
        '[right:max(1rem,env(safe-area-inset-right))] [bottom:max(1rem,env(safe-area-inset-bottom))]',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
}
