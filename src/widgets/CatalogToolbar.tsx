import { catalog, GENDER_LABEL, GENDERS, type Brand } from '@/entities/fragrance';
import { SORT_LABEL, SORT_MODES, type CatalogActions, type CatalogFilters, type SortMode } from '@/features/catalog';
import { plural } from '@/shared/lib/format';
import { Chip } from '@/shared/ui/Chip';

interface Props {
  filters: CatalogFilters;
  actions: CatalogActions;
  resultCount: number;
  isRefined: boolean;
  selectedBrand: Brand | null;
}

export function CatalogToolbar({ filters, actions, resultCount, isRefined, selectedBrand }: Props) {
  return (
    <div className="-mx-5 border-b border-line/60 bg-bg/90 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8 lg:sticky lg:top-16 lg:z-20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative flex-1 lg:max-w-md">
          <span className="sr-only">Поиск по бренду или названию</span>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={filters.query}
            onChange={(e) => actions.setQuery(e.target.value)}
            placeholder="Поиск: Sauvage, Kilian, Molecule…"
            // Brand names are not dictionary words: keep phone keyboards from "correcting" them; Enter hides the keyboard.
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="off"
            enterKeyHint="search"
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            className="h-11 w-full rounded-full border border-line bg-surface pr-4 pl-11 text-sm text-fg placeholder:text-muted/70 focus:border-gold focus:ring-3 focus:ring-gold/30 focus:outline-none"
          />
        </label>

        <div className="-mx-5 flex items-center gap-2 overflow-x-auto px-5 pr-12 pb-1 [mask-image:linear-gradient(to_right,black_calc(100%-3rem),transparent)] [scrollbar-width:none] sm:mx-0 sm:px-0 sm:[mask-image:none] lg:flex-wrap [&::-webkit-scrollbar]:hidden">
          <fieldset className="contents">
            <legend className="sr-only">Пол</legend>
            {GENDERS.map((g) => (
              <Chip key={g} className="shrink-0" active={filters.genders.has(g)} onClick={() => actions.toggleGender(g)}>
                {GENDER_LABEL[g]}
              </Chip>
            ))}
          </fieldset>
          <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-line" />
          <fieldset className="contents">
            <legend className="sr-only">Цена за мл</legend>
            {catalog.prices.map((p) => (
              <Chip key={p} className="shrink-0" active={filters.prices.has(p)} onClick={() => actions.togglePrice(p)}>
                {p} ₽
              </Chip>
            ))}
          </fieldset>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-muted">
        <p aria-live="polite" className="flex flex-wrap items-center gap-x-2">
          <span>{resultCount} {plural(resultCount, ['аромат', 'аромата', 'ароматов'])}</span>
          {selectedBrand && (
            <button
              type="button"
              onClick={() => actions.selectBrand(null)}
              className="-my-3 inline-flex min-h-11 items-center gap-1 py-3 text-xs font-medium text-gold [&>span:first-child]:rounded-full [&>span:first-child]:bg-gold/15 [&>span:first-child]:px-2.5 [&>span:first-child]:py-0.5 hover:[&>span:first-child]:bg-gold/25"
              aria-label={`Убрать фильтр по бренду ${selectedBrand.name}`}
            >
              <span className="inline-flex max-w-[60vw] items-center gap-1 sm:max-w-xs"><span className="truncate">{selectedBrand.name}</span><span aria-hidden="true">×</span></span>
            </button>
          )}
          {isRefined && (
            <button type="button" onClick={actions.clearRefinements} className="-my-3 inline-flex min-h-11 items-center text-gold underline-offset-4 hover:underline">
              сбросить
            </button>
          )}
        </p>
        <label className="flex items-center gap-2">
          <span className="hidden sm:inline">Сортировка</span>
          <select
            value={filters.sort}
            onChange={(e) => actions.setSort(e.target.value as SortMode)}
            className="h-9 rounded-full border border-line bg-surface px-3 text-sm text-fg focus:border-gold focus:ring-3 focus:ring-gold/30 focus:outline-none"
          >
            {SORT_MODES.map((m) => (
              <option key={m} value={m}>{SORT_LABEL[m]}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
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
