import { catalog, GENDER_LABEL, GENDERS, type Brand } from '@/entities/fragrance';
import { SORT_LABEL, SORT_MODES, type CatalogActions, type CatalogFilters } from '@/features/catalog';
import { plural } from '@/shared/lib/format';
import { Chip } from '@/shared/ui/Chip';
import { SelectMenu } from '@/shared/ui/SelectMenu';

const SORT_OPTIONS = SORT_MODES.map((m) => ({ value: m, label: SORT_LABEL[m] }));

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
        // The brand you are in, as its own bar: always visible, one obvious way back to all brands.
        <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface py-2.5 pr-2.5 pl-4">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.18em] text-muted uppercase">Бренд</p>
            <h2 className="font-display truncate text-2xl leading-tight text-fg sm:text-3xl">{selectedBrand.name}</h2>
          </div>
          <Chip className="shrink-0" onClick={() => actions.selectBrand(null)} aria-pressed={undefined}>
            Все бренды <span aria-hidden="true" className="text-base leading-none">×</span>
          </Chip>
        </div>
      )}
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

      {/* Sort stays pinned right; only the count/reset side may wrap, so nothing jumps between lines. */}
      <div className="mt-3 flex items-center justify-between gap-3 text-sm text-muted">
        <p aria-live="polite" className="flex min-w-0 flex-wrap items-center gap-x-2">
          <span>{resultCount} {plural(resultCount, ['аромат', 'аромата', 'ароматов'])}</span>
          {isRefined && (
            <>
              <span aria-hidden="true">·</span>
              <button type="button" onClick={actions.clearRefinements} className="-my-3 inline-flex min-h-11 items-center font-semibold text-gold underline-offset-4 hover:underline">
                сбросить фильтры
              </button>
            </>
          )}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <span aria-hidden="true" className="hidden sm:inline">Сортировка</span>
          <SelectMenu
            label="Сортировка"
            value={filters.sort}
            options={SORT_OPTIONS}
            onChange={actions.setSort}
            icon={<SortIcon className="size-4" />}
          />
        </div>
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
