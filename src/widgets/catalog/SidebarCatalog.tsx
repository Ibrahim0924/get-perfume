import { useState, type ReactNode } from 'react';
import { catalog, GENDER_LABEL, GENDERS, type Brand, type Fragrance } from '@/entities/fragrance';
import { SORT_LABEL, SORT_MODES, type CatalogActions, type CatalogFilters, type SortMode } from '@/features/catalog';
import { cn } from '@/shared/lib/cn';
import { plural } from '@/shared/lib/format';
import { FragranceRow } from '../FragranceRow';

interface Props {
  filters: CatalogFilters;
  actions: CatalogActions;
  fragrances: Fragrance[];
  selectedBrand: Brand | null;
  onOpen: (f: Fragrance) => void;
}

const BRANDS_COLLAPSED = 8;

/** Variant "Фильтры слева, список справа": facets in a sidebar, a flat fragrance list next to it. */
export function SidebarCatalog({ filters, actions, fragrances, selectedBrand, onOpen }: Props) {
  const [allBrands, setAllBrands] = useState(false);
  const brands = allBrands ? catalog.brands : catalog.brands.slice(0, BRANDS_COLLAPSED);
  const hiddenBrand = selectedBrand && !brands.some((b) => b.id === selectedBrand.id) ? selectedBrand : null;
  const isRefined = filters.query.trim() !== '' || filters.genders.size > 0 || filters.prices.size > 0 || filters.brandId !== null;

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <label className="relative block">
          <span className="sr-only">Поиск по бренду или названию</span>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => actions.setQuery(e.target.value)}
            placeholder="Поиск…"
            className="h-11 w-full rounded-full border border-line bg-surface pr-4 pl-11 text-sm text-fg placeholder:text-muted/70 focus:border-gold focus:outline-none"
          />
        </label>

        <div className="mt-2 grid grid-cols-2 gap-x-6 lg:grid-cols-1">
          <Facet title="Пол">
            {GENDERS.map((g) => (
              <Check key={g} checked={filters.genders.has(g)} onChange={() => actions.toggleGender(g)}>{GENDER_LABEL[g]}</Check>
            ))}
          </Facet>
          <Facet title="Цена за мл">
            {catalog.prices.map((p) => (
              <Check key={p} checked={filters.prices.has(p)} onChange={() => actions.togglePrice(p)}>{p} ₽</Check>
            ))}
          </Facet>
        </div>

        <Facet title="Бренды">
          {hiddenBrand && <Check checked onChange={() => actions.selectBrand(null)} radio>{hiddenBrand.name}</Check>}
          {brands.map((b) => (
            <Check key={b.id} checked={filters.brandId === b.id} onChange={() => actions.selectBrand(filters.brandId === b.id ? null : b.id)} radio>
              <span className="flex-1 truncate">{b.name}</span>
              <span className="text-xs text-muted">{b.fragrances.length}</span>
            </Check>
          ))}
          <button type="button" onClick={() => setAllBrands((v) => !v)} className="mt-1 py-1 text-left text-sm font-semibold text-gold hover:underline">
            {allBrands ? 'Свернуть' : `Ещё ${catalog.brands.length - BRANDS_COLLAPSED}…`}
          </button>
        </Facet>
      </aside>

      <div className="min-w-0">
        <div className="flex items-center justify-between gap-4 text-sm text-muted">
          <p aria-live="polite" className="flex flex-wrap items-center gap-x-2">
            <span>{fragrances.length} {plural(fragrances.length, ['аромат', 'аромата', 'ароматов'])}</span>
            {isRefined && (
              <button type="button" onClick={actions.reset} className="text-gold underline-offset-4 hover:underline">сбросить</button>
            )}
          </p>
          <label className="flex items-center gap-2">
            <span className="hidden sm:inline">Сортировка</span>
            <select
              value={filters.sort}
              onChange={(e) => actions.setSort(e.target.value as SortMode)}
              className="h-9 rounded-full border border-line bg-surface px-3 text-sm text-fg focus:border-gold focus:outline-none"
            >
              {SORT_MODES.map((m) => (
                <option key={m} value={m}>{SORT_LABEL[m]}</option>
              ))}
            </select>
          </label>
        </div>

        {fragrances.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
            <p className="font-display text-3xl text-fg">Ничего не найдено</p>
            <p className="mt-2 text-muted">Попробуйте изменить запрос или снять фильтры.</p>
            <button type="button" onClick={actions.reset} className="mt-6 h-11 rounded-full border border-gold px-6 text-sm font-semibold text-gold hover:bg-gold hover:text-on-accent">
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <ul className="mt-4 rounded-2xl border border-line/70 bg-surface px-4 sm:px-6">
            {fragrances.map((f) => (
              <FragranceRow key={f.id} fragrance={f} showBrand onOpen={onOpen} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Facet({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="mt-5">
      <legend className="mb-2 text-[11px] font-semibold tracking-[0.2em] text-muted uppercase">{title}</legend>
      <div className="flex flex-col">{children}</div>
    </fieldset>
  );
}

function Check({ checked, onChange, radio = false, children }: { checked: boolean; onChange: () => void; radio?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className="group flex w-full items-center gap-2.5 py-1.5 text-left text-sm text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-4 shrink-0 items-center justify-center border transition-colors',
          radio ? 'rounded-full' : 'rounded-[4px]',
          checked ? 'border-gold bg-gold text-on-accent' : 'border-line bg-surface group-hover:border-gold/60',
        )}
      >
        {checked && (radio ? <span className="size-1.5 rounded-full bg-on-accent" /> : (
          <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2.5 6.5 2.5 2.5 4.5-5" /></svg>
        ))}
      </span>
      {children}
    </button>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
