import { catalog, GENDER_LABEL, GENDERS, type Brand } from '@/entities/fragrance';
import { SORT_LABEL, SORT_MODES, type CatalogActions, type CatalogFilters, type SortMode } from '@/features/catalog';
import { plural } from '@/shared/lib/format';
import { Chip } from '@/shared/ui/Chip';
import { Arrow } from '@/shared/ui/Arrow';
import { SelectMenu } from '@/shared/ui/SelectMenu';

const SORT_SHORT: Partial<Record<SortMode, string>> = { 'price-asc': 'Дешевле', 'price-desc': 'Дороже' };
const SORT_OPTIONS = SORT_MODES.map((m) => ({ value: m, label: SORT_LABEL[m], short: SORT_SHORT[m] }));

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
      {selectedBrand && (
        // App-style page header for a brand: a clear way back first, then the brand name.
        <div className="mb-5">
          <button
            type="button"
            onClick={() => actions.selectBrand(null)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-gold/60 bg-gold/10 pr-4 pl-3 text-sm font-semibold text-gold transition-colors hover:bg-gold/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            <Arrow />
            Все бренды
          </button>
          <h2 className="font-display mt-3 truncate text-4xl leading-tight text-fg sm:text-5xl">{selectedBrand.name}</h2>
        </div>
      )}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Sort sits right beside the search: both are "how to look through the list". */}
        <div className="flex flex-1 items-center gap-2 lg:max-w-md">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Поиск по бренду или названию</span>
            <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={filters.query}
              onChange={(e) => actions.setQuery(e.target.value)}
              placeholder="Поиск: Sauvage, Kilian…"
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
          <SelectMenu
            className="shrink-0"
            label="Сортировка"
            value={filters.sort}
            options={SORT_OPTIONS}
            onChange={actions.setSort}
            icon={<SortIcon className="size-4" />}
            marked={filters.sort !== SORT_MODES[0]}
          />
        </div>

        {/* Scrolls sideways, which clips anything outside it: py/-my gives the active ring and focus outline room. */}
        <div className="-mx-5 -my-1.5 flex items-center gap-2 overflow-x-auto px-5 py-1.5 pr-12 [mask-image:linear-gradient(to_right,black_calc(100%-3rem),transparent)] [scrollbar-width:none] sm:mx-0 sm:px-0 sm:[mask-image:none] lg:flex-wrap [&::-webkit-scrollbar]:hidden">
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

      {/* One quiet line: how many, and a way back to everything when filters are on. */}
      <div className="mt-3 flex min-h-9 items-center justify-between gap-3 text-sm text-muted">
        <p aria-live="polite">{resultCount} {plural(resultCount, ['аромат', 'аромата', 'ароматов'])}</p>
        {isRefined && (
          <button
            type="button"
            onClick={actions.clearRefinements}
            aria-label="Сбросить фильтры"
            className="-my-1 inline-flex min-h-11 shrink-0 items-center gap-1.5 font-semibold whitespace-nowrap text-gold transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            Сбросить
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function SortIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M7 12h10M10 17h4" />
    </svg>
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
