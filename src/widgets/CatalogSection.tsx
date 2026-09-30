import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Fragrance } from '@/entities/fragrance';
import { useCatalogFilters } from '@/features/catalog';
import { cn } from '@/shared/lib/cn';
import { Container } from '@/shared/ui/Container';
import { BrandView } from './BrandView';
import { BrandPreviewGrid } from './catalog/BrandPreviewGrid';
import { SidebarCatalog } from './catalog/SidebarCatalog';
import { CatalogToolbar } from './CatalogToolbar';
import { FragranceRow } from './FragranceRow';

interface Props {
  onOpen: (f: Fragrance) => void;
  /** Selected brand comes from the URL hash so browser Back works. */
  brandId: string | null;
  onSelectBrand: (brandId: string | null) => void;
}

// Временный переключатель двух вариантов каталога — убрать после выбора финального.
const VARIANTS = [
  { id: 'sidebar', name: 'Фильтры слева' },
  { id: 'cards', name: 'Карточки брендов' },
] as const;
type VariantId = (typeof VARIANTS)[number]['id'];
const STORAGE_KEY = 'gerparfume:catalog-variant';

function readStored(): VariantId {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return VARIANTS.some((x) => x.id === v) ? (v as VariantId) : 'sidebar';
  } catch {
    return 'sidebar';
  }
}

export function CatalogSection({ onOpen, brandId, onSelectBrand }: Props) {
  const { filters, fragrances, selectedBrand, view, isRefined, actions } = useCatalogFilters();
  const [variant, setVariant] = useState<VariantId>(readStored);

  const pick = useCallback((id: VariantId) => {
    setVariant(id);
    try { localStorage.setItem(STORAGE_KEY, id); } catch { /* fine without persistence */ }
  }, []);

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
      <div className="flex justify-end pt-2">
        <div role="radiogroup" aria-label="Вариант каталога" className="inline-flex items-center gap-1 rounded-full border border-line/70 bg-surface/90 p-1 text-xs text-muted shadow-sm">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={variant === v.id}
              onClick={() => pick(v.id)}
              className={cn('rounded-full px-3 py-1 transition-colors', variant === v.id ? 'bg-gold text-on-accent' : 'hover:bg-gold/15 hover:text-gold')}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {variant === 'sidebar' ? (
        <SidebarCatalog filters={filters} actions={routedActions} fragrances={fragrances} selectedBrand={selectedBrand} onOpen={onOpen} />
      ) : (
        <>
          <CatalogToolbar
            filters={filters}
            actions={routedActions}
            resultCount={fragrances.length}
            isRefined={isRefined}
            selectedBrand={selectedBrand}
          />

          {view === 'brands' && <BrandPreviewGrid onSelect={onSelectBrand} />}

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
        </>
      )}
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
