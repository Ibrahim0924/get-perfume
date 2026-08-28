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

export function useCatalogFilters() {
  const [filters, setFilters] = useState<CatalogFilters>(EMPTY_FILTERS);
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
  const selectBrand = useCallback((brandId: string | null) => setFilters((f) => ({ ...f, brandId })), []);
  const clearRefinements = useCallback(() => setFilters((f) => ({ ...EMPTY_FILTERS, brandId: f.brandId })), []);
  const reset = useCallback(() => setFilters(EMPTY_FILTERS), []);

  return {
    filters,
    fragrances,
    selectedBrand,
    view: resolveView(effective),
    isRefined: hasRefinements(filters),
    actions: { setQuery, setSort, toggleGender, togglePrice, selectBrand, clearRefinements, reset },
  };
}

export type CatalogActions = ReturnType<typeof useCatalogFilters>['actions'];
