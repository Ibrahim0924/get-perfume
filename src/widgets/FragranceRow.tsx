import { GENDER_LABEL, getDetails, tAccord, type Fragrance } from '@/entities/fragrance';
import { formatPrice } from '@/shared/lib/format';
import { cn } from '@/shared/lib/cn';
import { FragranceImage } from '@/shared/ui/FragranceImage';

const GENDER_TONE: Record<Fragrance['gender'], string> = {
  female: 'bg-rose/15 text-rose',
  male: 'bg-sky/15 text-sky',
  unisex: 'bg-gold/15 text-gold',
};

interface Props {
  fragrance: Fragrance;
  showBrand?: boolean;
  onOpen: (fragrance: Fragrance) => void;
}

export function FragranceRow({ fragrance, showBrand = false, onOpen }: Props) {
  const d = getDetails(fragrance.id);
  return (
    <li className="border-b border-line/50 last:border-b-0">
      <button
        type="button"
        onClick={() => onOpen(fragrance)}
        className="group flex w-full flex-wrap items-center gap-x-4 gap-y-1.5 py-2.5 text-left sm:flex-nowrap sm:py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-bg">
          <FragranceImage src={d?.imageTransparent ?? null} fallbackSrc={d?.image ?? null} alt="" className="size-10" />
        </span>
        <span className="min-w-0 flex-1 basis-[calc(100%-4rem)] sm:basis-auto">
          {showBrand && <span className="block text-xs tracking-[0.15em] text-muted uppercase">{fragrance.brand}</span>}
          <span className="block truncate font-medium text-fg transition-colors group-hover:text-gold">{fragrance.name}</span>
          {d && <span className="block truncate text-xs text-muted">{d.accords.slice(0, 3).map((a) => tAccord(a.name)).join(' · ')}</span>}
        </span>
        <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide', GENDER_TONE[fragrance.gender])}>
          {GENDER_LABEL[fragrance.gender]}
        </span>
        <span className="ml-auto shrink-0 text-right font-display text-xl text-fg tabular-nums sm:ml-0 sm:w-24">
          {formatPrice(fragrance.pricePerMl)}
          <span className="ml-1 text-xs text-muted">/мл</span>
        </span>
      </button>
    </li>
  );
}
