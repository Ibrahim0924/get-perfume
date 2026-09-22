import { useEffect, useMemo } from 'react';
import type { Fragrance } from '@/entities/fragrance';
import { useCatalogFilters } from '@/features/catalog';
import { Container } from '@/shared/ui/Container';
import { BrandGrid } from './BrandGrid';
import { BrandView } from './BrandView';
import { CatalogToolbar } from './CatalogToolbar';
import { FragranceRow } from './FragranceRow';

interface Props {
  onOpen: (f: Fragrance) => void;
  /** Selected brand comes from the URL hash so browser Back works. */
  brandId: string | null;
  onSelectBrand: (brandId: string | null) => void;
}

export function CatalogSection({ onOpen, brandId, onSelectBrand }: Props) {
  const { filters, fragrances, selectedBrand, view, isRefined, actions } = useCatalogFilters();

  // Mirror the route into filter state (single source of truth is the hash).
  useEffect(() => {
    if (filters.brandId !== brandId) {
      actions.selectBrand(brandId);
      if (brandId) document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [brandId, filters.brandId, actions]);

  const routedActions = useMemo(() => ({ ...actions, selectBrand: onSelectBrand }), [actions, onSelectBrand]);

  return (
    <Container id="catalog" className="scroll-mt-16 pb-24">
      <CatalogToolbar
        filters={filters}
        actions={routedActions}
        resultCount={fragrances.length}
        isRefined={isRefined}
        selectedBrand={selectedBrand}
      />

      {view === 'brands' && <BrandGrid onSelect={onSelectBrand} />}

      {view === 'brand' && selectedBrand && <BrandView brand={selectedBrand} onBack={() => onSelectBrand(null)} onOpen={onOpen} />}

      {view === 'list' &&
        (fragrances.length === 0 ? (
          <EmptyState onReset={actions.reset} />
        ) : (
          <ul className="mt-8 rounded-2xl border border-line/70 bg-surface px-4 sm:px-7">
            {fragrances.map((f) => (
              <FragranceRow key={f.id} fragrance={f} showBrand onOpen={onOpen} />
            ))}
          </ul>
        ))}
    </Container>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-16 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
      <p className="font-display text-3xl text-fg">Ничего не найдено</p>
      <p className="mt-2 text-muted">Попробуйте изменить запрос или снять фильтры.</p>
      <button type="button" onClick={onReset} className="mt-6 h-11 rounded-full border border-gold px-6 text-sm font-semibold text-gold hover:bg-gold hover:text-on-accent">
        Сбросить фильтры
      </button>
    </div>
  );
}
