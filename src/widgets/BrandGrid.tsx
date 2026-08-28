import { catalog, type Brand } from '@/entities/fragrance';
import { groupBrandsByLetter } from '@/features/catalog';
import { plural } from '@/shared/lib/format';

const groups = groupBrandsByLetter(catalog.brands);

export function BrandGrid({ onSelect }: { onSelect: (brandId: string) => void }) {
  return (
    <div className="mt-8">
      <nav aria-label="Алфавитный указатель" className="sticky top-16 z-10 -mx-5 border-b border-line/60 bg-bg/90 px-5 py-2 backdrop-blur-md sm:-mx-8 sm:px-8 lg:static lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
        <ul className="flex flex-wrap gap-0.5 sm:gap-1">
          {groups.map((g) => (
            <li key={g.letter}>
              <a
                href={`#letter-${encodeURIComponent(g.letter)}`}
                className="inline-flex size-9 items-center justify-center rounded-full font-display text-lg text-muted transition-colors hover:bg-gold/15 hover:text-gold"
              >
                {g.letter}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-8 grid gap-12">
        {groups.map((g) => (
          <section key={g.letter} id={`letter-${g.letter}`} className="scroll-mt-32 grid gap-4 sm:grid-cols-[4rem_1fr] sm:gap-5 lg:scroll-mt-40">
            <h3 className="font-display text-4xl leading-none text-gold sm:text-5xl">{g.letter}</h3>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {g.brands.map((b) => (
                <li key={b.id}>
                  <BrandCard brand={b} onSelect={onSelect} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function BrandCard({ brand, onSelect }: { brand: Brand; onSelect: (id: string) => void }) {
  const count = brand.fragrances.length;
  const prices = brand.fragrances.map((f) => f.pricePerMl);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return (
    <button
      type="button"
      onClick={() => onSelect(brand.id)}
      className="group flex w-full touch-manipulation items-center justify-between gap-4 rounded-2xl border border-line/70 bg-surface px-4 py-3.5 text-left sm:px-5 sm:py-4 transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-[0_10px_30px_-15px_color-mix(in_oklab,var(--color-gold)_50%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <span className="min-w-0">
        <span className="block truncate font-display text-xl leading-tight sm:text-2xl text-fg group-hover:text-gold">{brand.name}</span>
        <span className="mt-0.5 block text-xs text-muted">
          {count} {plural(count, ['аромат', 'аромата', 'ароматов'])} · {min === max ? `${min} ₽` : `${min}–${max} ₽`} / мл
        </span>
      </span>
      <ArrowIcon />
    </button>
  );
}

function ArrowIcon() {
  return (
    <svg className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
