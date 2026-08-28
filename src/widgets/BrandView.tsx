import type { Brand } from '@/entities/fragrance';
import { plural } from '@/shared/lib/format';
import { FragranceRow } from './FragranceRow';

export function BrandView({ brand, onBack }: { brand: Brand; onBack: () => void }) {
  const count = brand.fragrances.length;
  return (
    <section className="mt-8">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold">
        <span aria-hidden="true">←</span> Все бренды
      </button>
      <header className="mt-4 mb-6 flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="font-display text-4xl text-fg sm:text-5xl">{brand.name}</h2>
        <span className="text-xs tracking-[0.15em] text-muted uppercase">
          {count} {plural(count, ['аромат', 'аромата', 'ароматов'])}
        </span>
      </header>
      <ul className="rounded-2xl border border-line/70 bg-surface px-4 sm:px-7">
        {brand.fragrances.map((f) => (
          <FragranceRow key={f.id} fragrance={f} />
        ))}
      </ul>
    </section>
  );
}
