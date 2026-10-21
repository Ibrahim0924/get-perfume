import { useMemo, useRef, useState } from 'react';
import { catalog, getDetails, localPhoto, photoFillsFrame, type Fragrance } from '@/entities/fragrance';
import { EMPTY_FILTERS, filterFragrances } from '@/features/catalog';
import { buildSelectionZip, useSelection } from '@/features/selection';
import { cn } from '@/shared/lib/cn';
import { plural } from '@/shared/lib/format';
import { useDebouncedValue } from '@/shared/lib/useDebouncedValue';
import { Container } from '@/shared/ui/Container';
import { FragranceImage } from '@/shared/ui/FragranceImage';
import { firstStep, ShowMore } from '@/shared/ui/ShowMore';
import { Arrow } from '@/shared/ui/Arrow';

const FRAGRANCE_NOUN: [string, string, string] = ['аромата', 'ароматов', 'ароматов'];

/**
 * "Подборка": every fragrance as a big photo with brand and name, ticked one by one; the ticked ones
 * download as a ZIP of photos plus a list of names. The ticks are remembered between visits.
 */
export function SelectionPage({ onBack }: { onBack: () => void }) {
  const { ids, toggle, addAll, clear } = useSelection();
  const [query, setQuery] = useState('');
  const [onlySelected, setOnlySelected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query);

  const list = useMemo(() => {
    const found = filterFragrances(catalog.fragrances, { ...EMPTY_FILTERS, query: debouncedQuery });
    return onlySelected ? found.filter((f) => ids.has(f.id)) : found;
  }, [debouncedQuery, onlySelected, ids]);

  // Starts over when the list itself changes (another search or the "only ticked" switch), not on every tick.
  const listKey = `${debouncedQuery}|${onlySelected}`;
  const [shown, setShown] = useState(() => firstStep(list.length));
  const [shownFor, setShownFor] = useState(listKey);
  if (shownFor !== listKey) {
    setShownFor(listKey);
    setShown(firstStep(list.length));
  }
  const listRef = useRef<HTMLUListElement>(null);

  const selected = useMemo(() => catalog.fragrances.filter((f) => ids.has(f.id)), [ids]);
  const allListed = list.length > 0 && list.every((f) => ids.has(f.id));

  const download = async () => {
    setBusy(true);
    setError(null);
    try {
      const blob = await buildSelectionZip(selected);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      // Latin only: browsers fall back to a bare "download" for some non-ASCII file names.
      a.download = `GerParfume-podborka-${new Date().toISOString().slice(0, 10)}.zip`;
      // Some browsers only honour the file name for a link that is in the document.
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
    } catch {
      setError('Не получилось собрать архив. Проверьте интернет и попробуйте ещё раз.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container className={cn('pt-6 pb-16', ids.size > 0 && 'pb-36')}>
      <button type="button" onClick={onBack} className="-my-3 inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-gold">
        <Arrow className="size-3.5" /> Каталог
      </button>
      <h1 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">Подборка</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Отметьте нужные ароматы — затем скачайте их фото и названия одним архивом. Отметки сохраняются, можно вернуться позже.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1 sm:max-w-md">
          <span className="sr-only">Поиск по бренду или названию</span>
          <svg className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск: Sauvage, Kilian…"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="off"
            enterKeyHint="search"
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            className="h-11 w-full rounded-full border border-line bg-surface pr-4 pl-11 text-sm text-fg placeholder:text-muted/70 focus:border-gold focus:ring-3 focus:ring-gold/30 focus:outline-none"
          />
        </label>
        <button
          type="button"
          aria-pressed={onlySelected}
          onClick={() => setOnlySelected((v) => !v)}
          className={cn(
            'inline-flex h-11 items-center justify-center gap-2 self-start rounded-full border px-4 text-sm font-medium transition-colors sm:self-auto',
            onlySelected ? 'border-gold bg-gold text-on-accent' : 'border-line text-muted hover:border-gold/60 hover:text-fg',
          )}
        >
          Только отмеченные · {ids.size}
        </button>
      </div>

      <div className="mt-4 flex min-h-9 items-center justify-between gap-3 text-sm text-muted">
        <p aria-live="polite">{list.length} {plural(list.length, ['аромат', 'аромата', 'ароматов'])}</p>
        {list.length > 0 && !allListed && (
          <button type="button" onClick={() => addAll(list.map((f) => f.id))} className="-my-1 inline-flex min-h-11 items-center font-semibold text-gold hover:opacity-80">
            Отметить все{query || onlySelected ? ' найденные' : ''}
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line px-6 py-12 text-center text-muted">
          {onlySelected ? 'Пока ничего не отмечено.' : 'Ничего не найдено — попробуйте другой запрос.'}
        </p>
      ) : (
        <>
          <ul ref={listRef} className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {list.slice(0, shown).map((f) => (
              <SelectableCard key={f.id} fragrance={f} checked={ids.has(f.id)} onToggle={() => toggle(f.id)} />
            ))}
          </ul>
          <ShowMore shown={shown} total={list.length} noun={FRAGRANCE_NOUN} onChange={setShown} listRef={listRef} />
        </>
      )}

      {ids.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-bg/95 backdrop-blur-md [padding-bottom:env(safe-area-inset-bottom)]">
          <Container className="flex items-center gap-3 py-3">
            <p className="min-w-0 flex-1 text-sm">
              <span className="font-semibold">Отмечено {ids.size}</span>
              <button type="button" onClick={clear} className="ml-3 -my-3 inline-flex min-h-11 items-center text-muted underline-offset-4 hover:text-fg hover:underline">
                снять все
              </button>
            </p>
            <button
              type="button"
              onClick={download}
              disabled={busy}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-gold px-5 text-sm font-semibold text-on-accent transition-opacity disabled:opacity-60"
            >
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />
              </svg>
              {busy ? 'Собираем…' : 'Скачать ZIP'}
            </button>
          </Container>
          {error && <p role="alert" className="pb-3 text-center text-xs text-rose">{error}</p>}
        </div>
      )}
    </Container>
  );
}

function SelectableCard({ fragrance: f, checked, onToggle }: { fragrance: Fragrance; checked: boolean; onToggle: () => void }) {
  const d = getDetails(f.id);
  const fills = photoFillsFrame(f.id);
  return (
    <li>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onToggle}
        className={cn(
          'group relative flex h-full w-full touch-manipulation flex-col overflow-hidden rounded-2xl border bg-surface text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
          checked ? 'border-gold shadow-[inset_0_0_0_1px_var(--color-gold)]' : 'border-line/70 hover:border-gold/50',
        )}
      >
        <span className={cn('photo-frame flex aspect-square items-center justify-center overflow-hidden', !fills && 'p-3')}>
          <FragranceImage
            sources={[localPhoto(f.id), d?.image, d?.imageFallback, d?.imageTransparent]}
            alt=""
            {...(fills ? { fill: true } : { className: 'max-h-full max-w-full' })}
          />
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-2 right-2 flex size-7 items-center justify-center rounded-full border-2 transition-colors',
            checked ? 'border-gold bg-gold text-on-accent' : 'border-white/90 bg-black/25 text-transparent',
          )}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5 10 17 19 7.5" />
          </svg>
        </span>
        <span className="flex flex-1 flex-col gap-0.5 p-3">
          <span className="truncate text-[11px] tracking-[0.12em] text-muted uppercase">{f.brand}</span>
          <span className="text-sm leading-snug font-medium text-fg">{f.name}</span>
        </span>
      </button>
    </li>
  );
}
