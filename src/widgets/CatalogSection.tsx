import { useCallback } from 'react';
import { useCatalogFilters } from '@/features/catalog';
import { Container } from '@/shared/ui/Container';
import { BrandGrid } from './BrandGrid';
import { BrandView } from './BrandView';
import { CatalogToolbar } from './CatalogToolbar';
import { FragranceRow } from './FragranceRow';

export function CatalogSection() {
  const { filters, fragrances, selectedBrand, view, isRefined, actions } = useCatalogFilters();

  const openBrand = useCallback(
    (brandId: string | null) => {
      actions.selectBrand(brandId);
      document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [actions],
  );

  return (
    <Container id="catalog" className="scroll-mt-16 pb-24">
      <CatalogToolbar
        filters={filters}
        actions={actions}
        resultCount={fragrances.length}
        isRefined={isRefined}
        selectedBrand={selectedBrand}
      />

      {view === 'brands' && <BrandGrid onSelect={openBrand} />}

      {view === 'brand' && selectedBrand && <BrandView brand={selectedBrand} onBack={() => openBrand(null)} />}

      {view === 'list' &&
        (fragrances.length === 0 ? (
          <EmptyState onReset={actions.reset} />
        ) : (
          <ul className="mt-8 rounded-2xl border border-line/70 bg-surface px-4 sm:px-7">
            {fragrances.map((f) => (
              <FragranceRow key={f.id} fragrance={f} showBrand />
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
