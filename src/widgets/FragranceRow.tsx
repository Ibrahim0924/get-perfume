import { GENDER_LABEL, type Fragrance } from '@/entities/fragrance';
import { formatPrice } from '@/shared/lib/format';
import { cn } from '@/shared/lib/cn';

const GENDER_TONE: Record<Fragrance['gender'], string> = {
  female: 'bg-rose/15 text-rose',
  male: 'bg-sky/15 text-sky',
  unisex: 'bg-gold/15 text-gold',
};

export function FragranceRow({ fragrance, showBrand = false }: { fragrance: Fragrance; showBrand?: boolean }) {
  return (
    <li className="group flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-line/50 py-3 last:border-b-0 sm:flex-nowrap sm:py-3.5">
      <div className="min-w-0 basis-full sm:basis-auto sm:flex-1">
        {showBrand && <p className="text-xs tracking-[0.15em] text-muted uppercase">{fragrance.brand}</p>}
        <p className="truncate font-medium text-fg transition-colors group-hover:text-gold">{fragrance.name}</p>
      </div>
      <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide', GENDER_TONE[fragrance.gender])}>
        {GENDER_LABEL[fragrance.gender]}
      </span>
      <span className="ml-auto shrink-0 text-right font-display text-xl text-fg tabular-nums sm:ml-0 sm:w-24">
        {formatPrice(fragrance.pricePerMl)}
        <span className="ml-1 text-xs text-muted">/мл</span>
      </span>
    </li>
  );
}
