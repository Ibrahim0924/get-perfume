import { catalog, GENDERS, getDetails, localPhoto, type Brand, type Gender } from '@/entities/fragrance';
import { cn } from '@/shared/lib/cn';
import { plural } from '@/shared/lib/format';
import { FragranceImage } from '@/shared/ui/FragranceImage';

const GENDER_TAG: Record<Gender, { label: string; tone: string }> = {
  female: { label: 'женские', tone: 'bg-rose/15 text-rose' },
  male: { label: 'мужские', tone: 'bg-sky/15 text-sky' },
  unisex: { label: 'унисекс', tone: 'bg-gold/15 text-gold' },
};

/** Variant "Карточки брендов с превью": every brand as a card with up to three bottle photos. */
export function BrandPreviewGrid({ onSelect }: { onSelect: (brandId: string) => void }) {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {catalog.brands.map((b) => (
        <li key={b.id}>
          <BrandPreviewCard brand={b} onSelect={onSelect} />
        </li>
      ))}
    </ul>
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
