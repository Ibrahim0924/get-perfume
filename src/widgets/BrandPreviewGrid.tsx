import { useEffect, useRef } from 'react';
import { catalog, GENDERS, getDetails, localPhoto, type Brand, type Gender } from '@/entities/fragrance';
import { cn } from '@/shared/lib/cn';
import { plural } from '@/shared/lib/format';
import { FragranceImage } from '@/shared/ui/FragranceImage';

const GENDER_TAG: Record<Gender, { label: string; tone: string }> = {
  female: { label: 'женские', tone: 'bg-rose/15 text-rose' },
  male: { label: 'мужские', tone: 'bg-sky/15 text-sky' },
  unisex: { label: 'унисекс', tone: 'bg-gold/15 text-gold' },
};

/** Brands revealed per step; 12 fills whole rows in the 1-, 2- and 3-column grids. */
export const BRANDS_PAGE = 12;

interface GridProps {
  onSelect: (brandId: string) => void;
  /** How many brands are revealed. Owned by the parent so it survives a visit to a brand page. */
  shown: number;
  onShowMore: (count: number) => void;
}

/** Brand cards with up to three bottle photos, revealed in steps so phones are not handed 100+ cards at once. */
export function BrandPreviewGrid({ onSelect, shown, onShowMore }: GridProps) {
  const total = catalog.brands.length;
  const visible = catalog.brands.slice(0, shown);
  const listRef = useRef<HTMLUListElement>(null);
  const firstNew = useRef<number | null>(null);

  // Keyboard and screen-reader users continue from the first newly revealed card.
  useEffect(() => {
    if (firstNew.current === null) return;
    listRef.current?.querySelectorAll<HTMLButtonElement>('li > button')[firstNew.current]?.focus({ preventScroll: true });
    firstNew.current = null;
  }, [shown]);

  const reveal = (count: number) => {
    firstNew.current = shown;
    onShowMore(count);
  };

  return (
    <>
      <ul ref={listRef} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((b) => (
          <li key={b.id}>
            <BrandPreviewCard brand={b} onSelect={onSelect} />
          </li>
        ))}
      </ul>
      {shown < total && (
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted">
            Показано {shown} из {total} {plural(total, ['бренда', 'брендов', 'брендов'])}
          </p>
          <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={() => reveal(Math.min(total, shown + BRANDS_PAGE))}
              className="h-12 w-full rounded-full border border-gold bg-gold/10 px-8 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-on-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto"
            >
              Показать ещё {Math.min(BRANDS_PAGE, total - shown)}
            </button>
            <button
              type="button"
              onClick={() => reveal(total)}
              className="-my-1 inline-flex min-h-11 items-center px-4 text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-fg hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Показать все
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function BrandPreviewCard({ brand, onSelect }: { brand: Brand; onSelect: (id: string) => void }) {
  const count = brand.fragrances.length;
  const prices = brand.fragrances.map((f) => f.pricePerMl);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const preview = brand.fragrances.slice(0, 3);
  return (
    <button
      type="button"
      onClick={() => onSelect(brand.id)}
      className="group flex h-full w-full touch-manipulation flex-col rounded-2xl border border-line/70 bg-surface p-4 text-left transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-[0_10px_30px_-15px_color-mix(in_oklab,var(--color-gold)_50%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:p-5"
    >
      <span className="flex gap-2">
        {preview.map((f) => {
          const d = getDetails(f.id);
          return (
            <span key={f.id} className="photo-frame flex size-16 items-center justify-center overflow-hidden rounded-2xl border border-line/70">
              <FragranceImage sources={[localPhoto(f.id), d?.image, d?.imageFallback, d?.imageTransparent]} alt="" className="size-12" />
            </span>
          );
        })}
      </span>
      <span className="mt-4 block font-display text-2xl leading-tight text-fg group-hover:text-gold">{brand.name}</span>
      <span className="mt-0.5 block text-xs text-muted">
        {count} {plural(count, ['аромат', 'аромата', 'ароматов'])} · {min === max ? `${min} ₽` : `${min}–${max} ₽`} / мл
      </span>
      {/* Which audiences the brand covers — saves a click into brands that only have, say, men's scents. */}
      <span className="mt-2 flex flex-wrap gap-1.5">
        {GENDERS.filter((g) => brand.fragrances.some((f) => f.gender === g)).map((g) => (
          <span key={g} className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide', GENDER_TAG[g].tone)}>{GENDER_TAG[g].label}</span>
        ))}
      </span>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold">
        Смотреть бренд <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </button>
  );
}
