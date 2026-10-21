import type { Brand, Fragrance } from '@/entities/fragrance';
import { FragranceRow } from './FragranceRow';

/** A brand's fragrances; the brand name, count and way back live in the toolbar's brand bar. */
export function BrandView({ brand, onOpen }: { brand: Brand; onOpen: (f: Fragrance) => void }) {
  return (
    <ul className="mt-8 rounded-2xl border border-line/70 bg-surface px-4 sm:px-7">
      {brand.fragrances.map((f) => (
        <FragranceRow key={f.id} fragrance={f} onOpen={onOpen} />
      ))}
    </ul>
  );
}
