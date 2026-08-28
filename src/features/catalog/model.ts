import type { Gender } from '@/entities/fragrance';

export interface CatalogFilters {
  query: string;
  genders: ReadonlySet<Gender>;
  prices: ReadonlySet<number>;
  sort: SortMode;
  /** Selected brand (drill-down); null means "all brands". */
  brandId: string | null;
}

export const SORT_MODES = ['brand', 'name', 'price-asc', 'price-desc'] as const;
export type SortMode = (typeof SORT_MODES)[number];

export const SORT_LABEL: Record<SortMode, string> = {
  brand: 'По бренду',
  name: 'По названию',
  'price-asc': 'Сначала дешевле',
  'price-desc': 'Сначала дороже',
};

export const EMPTY_FILTERS: CatalogFilters = {
  query: '',
  genders: new Set(),
  prices: new Set(),
  sort: 'brand',
  brandId: null,
};

/** True when search, facets or sorting are active (anything except brand drill-down). */
export function hasRefinements(f: CatalogFilters): boolean {
  return f.query.trim() !== '' || f.genders.size > 0 || f.prices.size > 0 || f.sort !== 'brand';
}

export type CatalogView = 'brands' | 'brand' | 'list';

export function resolveView(f: CatalogFilters): CatalogView {
  if (hasRefinements(f)) return 'list';
  return f.brandId ? 'brand' : 'brands';
}
