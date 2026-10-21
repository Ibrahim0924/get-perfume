import { useMemo, useRef, useState } from 'react';
import { catalog, type Fragrance } from '@/entities/fragrance';
import { useCatalogFilters } from '@/features/catalog';
import { Container } from '@/shared/ui/Container';
import { firstStep, ShowMore } from '@/shared/ui/ShowMore';
import { BrandPreviewGrid } from './BrandPreviewGrid';
import { BrandView, FRAGRANCE_NOUN } from './BrandView';
import { CatalogToolbar } from './CatalogToolbar';
import { FragranceRow } from './FragranceRow';

interface Props {
  onOpen: (f: Fragrance) => void;
  /** Selected brand comes from the URL hash so browser Back works. */
  brandId: string | null;
  onSelectBrand: (brandId: string | null) => void;
}

export function CatalogSection({ onOpen, brandId, onSelectBrand }: Props) {
  const { filters, fragrances, selectedBrand, view, isRefined, actions } = useCatalogFilters(brandId);
  // Lives here, not in the grid, so coming back from a brand finds the list as far open as you left it.
  const [brandsShown, setBrandsShown] = useState(() => firstStep(catalog.brands.length));

  // Fragrance lists (a brand, or search/filter results) open a step at a time and start over whenever
  // the list itself changes — another brand or other filters — but survive a visit to a fragrance.
  const listTotal = view === 'brand' ? (selectedBrand?.fragrances.length ?? 0) : fragrances.length;
  const listSource = view === 'brand' ? selectedBrand : fragrances;
  const [listShown, setListShown] = useState(() => firstStep(listTotal));
  const [shownFor, setShownFor] = useState(listSource);
  if (shownFor !== listSource) {
    setShownFor(listSource);
    setListShown(firstStep(listTotal));
  }
  const listRef = useRef<HTMLUListElement>(null);

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

      {view === 'brands' && <BrandPreviewGrid onSelect={onSelectBrand} shown={brandsShown} onShownChange={setBrandsShown} />}

      {view === 'brand' && selectedBrand && (
        <BrandView brand={selectedBrand} onOpen={onOpen} shown={listShown} onShownChange={setListShown} />
      )}

      {view === 'list' &&
        (fragrances.length === 0 ? (
          <EmptyState brandName={selectedBrand?.name ?? null} onReset={actions.clearRefinements} onClearRefinements={actions.clearRefinements} onAllBrands={() => onSelectBrand(null)} />
        ) : (
          <>
            <ul ref={listRef} className="mt-8 rounded-2xl border border-line/70 bg-surface px-4 sm:px-7">
              {fragrances.slice(0, listShown).map((f) => (
                <FragranceRow key={f.id} fragrance={f} showBrand={!selectedBrand} onOpen={onOpen} />
              ))}
            </ul>
            <ShowMore shown={listShown} total={fragrances.length} noun={FRAGRANCE_NOUN} onChange={setListShown} listRef={listRef} />
          </>
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
