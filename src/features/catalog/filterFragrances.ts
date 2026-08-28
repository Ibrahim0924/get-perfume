import type { Brand, Fragrance } from '@/entities/fragrance';
import type { CatalogFilters, SortMode } from './model';

const collator = new Intl.Collator(['ru', 'en'], { sensitivity: 'base', numeric: true });

const COMPARATORS: Record<SortMode, (a: Fragrance, b: Fragrance) => number> = {
  brand: () => 0, // keeps source order (grouped by brand)
  name: (a, b) => collator.compare(a.name, b.name) || collator.compare(a.brand, b.brand),
  'price-asc': (a, b) => a.pricePerMl - b.pricePerMl || collator.compare(a.name, b.name),
  'price-desc': (a, b) => b.pricePerMl - a.pricePerMl || collator.compare(a.name, b.name),
};

function normalizeQuery(q: string): string[] {
  return q.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/\s+/).filter(Boolean);
}

function matchesQuery(f: Fragrance, terms: string[]): boolean {
  if (terms.length === 0) return true;
  const haystack = `${f.brand} ${f.name}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return terms.every((t) => haystack.includes(t));
}

export function filterFragrances(items: readonly Fragrance[], filters: CatalogFilters): Fragrance[] {
  const terms = normalizeQuery(filters.query);
  const result = items.filter(
    (f) =>
      (filters.brandId === null || f.brandId === filters.brandId) &&
      (filters.genders.size === 0 || filters.genders.has(f.gender)) &&
      (filters.prices.size === 0 || filters.prices.has(f.pricePerMl)) &&
      matchesQuery(f, terms),
  );
  return filters.sort === 'brand' ? result : result.sort(COMPARATORS[filters.sort]);
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
