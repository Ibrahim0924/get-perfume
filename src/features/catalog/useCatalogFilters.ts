import { useCallback, useMemo, useState } from 'react';
import { catalog, type Gender } from '@/entities/fragrance';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import { filterFragrances } from './filterFragrances';
import { EMPTY_FILTERS, hasRefinements, resolveView, type CatalogFilters, type SortMode } from './model';

function toggleInSet<T>(set: ReadonlySet<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

type Refinements = Omit<CatalogFilters, 'brandId'>;

/**
 * Catalogue filter state. The brand is not stored here: it comes straight from the route, so the
 * view always matches the URL in the same render (no copy that lags a step behind on navigation).
 */
export function useCatalogFilters(brandId: string | null) {
  const [refinements, setFilters] = useState<Refinements>(EMPTY_FILTERS);
  const filters = useMemo<CatalogFilters>(() => ({ ...refinements, brandId }), [refinements, brandId]);
  const debouncedQuery = useDebouncedValue(filters.query);

  const effective = useMemo(() => ({ ...filters, query: debouncedQuery }), [filters, debouncedQuery]);
  const fragrances = useMemo(() => filterFragrances(catalog.fragrances, effective), [effective]);
  const selectedBrand = useMemo(
    () => (filters.brandId ? (catalog.brands.find((b) => b.id === filters.brandId) ?? null) : null),
    [filters.brandId],
  );

  const setQuery = useCallback((query: string) => setFilters((f) => ({ ...f, query })), []);
  const setSort = useCallback((sort: SortMode) => setFilters((f) => ({ ...f, sort })), []);
  const toggleGender = useCallback((g: Gender) => setFilters((f) => ({ ...f, genders: toggleInSet(f.genders, g) })), []);
  const togglePrice = useCallback((p: number) => setFilters((f) => ({ ...f, prices: toggleInSet(f.prices, p) })), []);
  const clearRefinements = useCallback(() => setFilters(EMPTY_FILTERS), []);

  return {
    filters,
    fragrances,
    selectedBrand,
    view: resolveView(effective),
    isRefined: hasRefinements(filters),
    actions: { setQuery, setSort, toggleGender, togglePrice, clearRefinements },
  };
}

/** Filter actions plus brand navigation, which the caller routes through the URL. */
export type CatalogActions = ReturnType<typeof useCatalogFilters>['actions'] & { selectBrand: (brandId: string | null) => void };
