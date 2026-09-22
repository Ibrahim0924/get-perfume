import { useCallback, useState } from 'react';
import { HERO_VARIANTS } from './hero/variants';

const STORAGE_KEY = 'get-perfume:hero-variant';

function readStored(): number {
  try {
    const n = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isInteger(n) && n >= 0 && n < HERO_VARIANTS.length ? n : 0;
  } catch {
    return 0;
  }
}

export function Hero() {
  const [index, setIndex] = useState(readStored);
  const variant = HERO_VARIANTS[index]!;

  const show = useCallback((next: number) => {
    const i = (next + HERO_VARIANTS.length) % HERO_VARIANTS.length;
    setIndex(i);
    try { localStorage.setItem(STORAGE_KEY, String(i)); } catch { /* fine without persistence */ }
  }, []);

  const goCatalog = useCallback(() => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <section id="top" className="relative">
      {variant.render(goCatalog)}

      {/* Временный переключатель вариантов шапки — убрать после выбора финального. */}
      <div className="absolute right-4 bottom-3 z-10 flex items-center gap-1 rounded-full border border-line/70 bg-surface/90 px-2 py-1 text-xs text-muted shadow-sm backdrop-blur">
        <button type="button" onClick={() => show(index - 1)} aria-label="Предыдущий вариант шапки" className="flex size-7 items-center justify-center rounded-full hover:bg-gold/15 hover:text-gold">‹</button>
        <span className="min-w-24 text-center tabular-nums" title={variant.name}>#{index + 1}/20 · {variant.name.length > 14 ? `${variant.name.slice(0, 13)}…` : variant.name}</span>
        <button type="button" onClick={() => show(index + 1)} aria-label="Следующий вариант шапки" className="flex size-7 items-center justify-center rounded-full hover:bg-gold/15 hover:text-gold">›</button>
      </div>
    </section>
  );
}
