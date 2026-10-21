import { useEffect, useMemo } from 'react';
import type { Fragrance } from '@/entities/fragrance';
import { useCatalogFilters } from '@/features/catalog';
import { Container } from '@/shared/ui/Container';
import { BrandPreviewGrid } from './BrandPreviewGrid';
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
      // The list is swapped for the brand view (or back): show it from its top straight away,
      // without a visible scroll. Leaving a brand only moves up if the catalog top is off-screen.
      const catalogEl = document.getElementById('catalog');
      if (catalogEl && (brandId || catalogEl.getBoundingClientRect().top < 0)) catalogEl.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [brandId, filters.brandId, actions]);

  const routedActions = useMemo(() => ({ ...actions, selectBrand: onSelectBrand }), [actions, onSelectBrand]);

  return (
    <Container id="catalog" tabIndex={-1} className="scroll-mt-28 pb-24 outline-none md:scroll-mt-16">
      <CatalogToolbar
        filters={filters}
        actions={routedActions}
        resultCount={fragrances.length}
        isRefined={isRefined}
        selectedBrand={selectedBrand}
      />

      {view === 'brands' && <BrandPreviewGrid onSelect={onSelectBrand} />}

      {view === 'brand' && selectedBrand && <BrandView brand={selectedBrand} onOpen={onOpen} />}

      {view === 'list' &&
        (fragrances.length === 0 ? (
          <EmptyState brandName={selectedBrand?.name ?? null} onReset={actions.reset} onClearRefinements={actions.clearRefinements} onAllBrands={() => onSelectBrand(null)} />
        ) : (
          <ul className="mt-8 rounded-2xl border border-line/70 bg-surface px-4 sm:px-7">
            {fragrances.map((f) => (
              <FragranceRow key={f.id} fragrance={f} showBrand={!selectedBrand} onOpen={onOpen} />
            ))}
          </ul>
        ))}
    </Container>
  );
}

function EmptyState({ brandName, onReset, onClearRefinements, onAllBrands }: { brandName: string | null; onReset: () => void; onClearRefinements: () => void; onAllBrands: () => void }) {
  const primary = 'h-11 rounded-full bg-gold px-6 text-sm font-semibold text-on-accent transition-transform hover:-translate-y-0.5';
  const secondary = 'h-11 rounded-full border border-gold px-6 text-sm font-semibold text-gold hover:bg-gold hover:text-on-accent';
  return (
    <div className="mt-16 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
      <p className="font-display text-3xl text-fg">Ничего не найдено</p>
      {brandName ? (
        // Inside a brand the filters are probably right and the brand is the limit: offer the whole catalogue first.
        <>
          <p className="mt-2 text-muted">У бренда {brandName} таких ароматов нет — но они могут быть у других.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={onAllBrands} className={primary}>Искать во всех брендах</button>
            <button type="button" onClick={onClearRefinements} className={secondary}>Все ароматы {brandName}</button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-muted">Попробуйте изменить запрос или снять фильтры.</p>
          <button type="button" onClick={onReset} className={`mt-6 ${secondary}`}>Сбросить фильтры</button>
        </>
      )}
    </div>
  );
}
