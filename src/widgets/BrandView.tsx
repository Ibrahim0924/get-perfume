import { useRef } from 'react';
import type { Brand, Fragrance } from '@/entities/fragrance';
import { ShowMore } from '@/shared/ui/ShowMore';
import { FragranceRow } from './FragranceRow';

interface Props {
  brand: Brand;
  onOpen: (f: Fragrance) => void;
  shown: number;
  onShownChange: (shown: number) => void;
}

/** A brand's fragrances; the brand name, count and way back live in the toolbar's brand header. */
export function BrandView({ brand, onOpen, shown, onShownChange }: Props) {
  const listRef = useRef<HTMLUListElement>(null);
  return (
    <>
      <ul ref={listRef} className="mt-8 rounded-2xl border border-line/70 bg-surface px-4 sm:px-7">
        {brand.fragrances.slice(0, shown).map((f) => (
          <FragranceRow key={f.id} fragrance={f} onOpen={onOpen} />
        ))}
      </ul>
      <ShowMore shown={shown} total={brand.fragrances.length} noun={FRAGRANCE_NOUN} onChange={onShownChange} listRef={listRef} />
    </>
  );
}

export const FRAGRANCE_NOUN: [string, string, string] = ['аромата', 'ароматов', 'ароматов'];
