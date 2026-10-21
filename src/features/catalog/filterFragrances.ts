import type { Brand, Fragrance } from '@/entities/fragrance';
import type { CatalogFilters, SortMode } from './model';
import { buildIndex, queryTerms, searchScore, type SearchIndex } from './search';

const collator = new Intl.Collator(['ru', 'en'], { sensitivity: 'base', numeric: true });

const COMPARATORS: Record<SortMode, (a: Fragrance, b: Fragrance) => number> = {
  brand: () => 0, // keeps source order (grouped by brand)
  name: (a, b) => collator.compare(a.name, b.name) || collator.compare(a.brand, b.brand),
  'price-asc': (a, b) => a.pricePerMl - b.pricePerMl || collator.compare(a.name, b.name),
  'price-desc': (a, b) => b.pricePerMl - a.pricePerMl || collator.compare(a.name, b.name),
};

// Built once per fragrance; the catalogue is static.
const indexCache = new WeakMap<Fragrance, SearchIndex>();
function indexOf(f: Fragrance): SearchIndex {
  let idx = indexCache.get(f);
  if (!idx) indexCache.set(f, (idx = buildIndex(`${f.brand} ${f.name}`)));
  return idx;
}

export function filterFragrances(items: readonly Fragrance[], filters: CatalogFilters): Fragrance[] {
  const terms = queryTerms(filters.query);
  const scores = new Map<Fragrance, number>();
  const result = items.filter((f) => {
    if (filters.brandId !== null && f.brandId !== filters.brandId) return false;
    if (filters.genders.size > 0 && !filters.genders.has(f.gender)) return false;
    if (filters.prices.size > 0 && !filters.prices.has(f.pricePerMl)) return false;
    if (terms.length === 0) return true;
    const score = searchScore(terms, indexOf(f));
    scores.set(f, score);
    return score > 0;
  });
  if (filters.sort !== 'brand') return result.sort(COMPARATORS[filters.sort]);
  // Default order while searching: closest matches first (exact before sound-alike before typo).
  return terms.length > 0 ? result.sort((a, b) => scores.get(b)! - scores.get(a)!) : result;
}

/** Regroups a flat (already filtered) list back into brand sections, preserving brand order. */
export function groupByBrand(items: readonly Fragrance[], brands: readonly Brand[]): Brand[] {
  const byBrand = new Map<string, Fragrance[]>();
  for (const f of items) byBrand.set(f.brandId, [...(byBrand.get(f.brandId) ?? []), f]);
  return brands.flatMap((b) => {
    const fragrances = byBrand.get(b.id);
    return fragrances ? [{ ...b, fragrances }] : [];
  });
}
