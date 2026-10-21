import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { plural } from '@/shared/lib/format';

/**
 * One rule for every long list on the site: items are revealed this many at a time
 * (12 also fills whole rows of the 1-, 2- and 3-column brand grid).
 */
export const LIST_STEP = 12;

/** A tail shorter than a third of a step is not worth a button ("Показать ещё 2"): it comes along. */
const takesTail = (rest: number, step: number) => rest < step / 3;

/** How many items a list opens with (and collapses back to). */
export function firstStep(total: number, step = LIST_STEP): number {
  return takesTail(total - step, step) ? total : step;
}

interface Props {
  shown: number;
  total: number;
  /** How many more each "Показать ещё" reveals; the list opens with (and collapses to) firstStep(). */
  step?: number;
  /** Noun forms for the counter, genitive after a number: ['бренда', 'брендов', 'брендов']. */
  noun: [string, string, string];
  onChange: (shown: number) => void;
  /** The list above, so focus can move to the first newly revealed item. */
  listRef: RefObject<HTMLElement | null>;
}

/**
 * "Показано N из M" with Показать ещё / Показать все / Показать меньше, shared by every long list.
 * Collapsing keeps these buttons at the same spot on screen instead of dropping the visitor into
 * the footer; focus follows to the first new item (more) or stays on the controls (less).
 */
export function ShowMore({ shown, total, step = LIST_STEP, noun, onChange, listRef }: Props) {
  const controlsRef = useRef<HTMLDivElement>(null);
  const firstNew = useRef<number | null>(null);
  const controlsTop = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (controlsTop.current === null || !controlsRef.current) return;
    window.scrollBy({ top: controlsRef.current.getBoundingClientRect().top - controlsTop.current, behavior: 'instant' });
    controlsTop.current = null;
    controlsRef.current.querySelector('button')?.focus({ preventScroll: true }); // the pressed button is gone
  }, [shown]);

  useEffect(() => {
    if (firstNew.current === null) return;
    listRef.current?.querySelectorAll<HTMLElement>(':scope > li :is(a, button)')[firstNew.current]?.focus({ preventScroll: true });
    firstNew.current = null;
  }, [shown, listRef]);

  const initial = firstStep(total, step);
  if (initial >= total) return null;

  const reveal = (count: number) => {
    firstNew.current = shown;
    onChange(count);
  };
  const collapse = () => {
    controlsTop.current = controlsRef.current?.getBoundingClientRect().top ?? null;
    onChange(initial);
  };

  const allShown = shown >= total;
  // Same rule going forward: a step that would leave a tiny tail takes the tail along.
  const next = takesTail(total - (shown + step), step) ? total : shown + step;
  const secondary =
    '-my-1 inline-flex min-h-11 items-center px-4 text-sm font-medium text-muted underline-offset-4 transition-colors hover:text-fg hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

  return (
    <div ref={controlsRef} className="mt-8 flex flex-col items-center gap-3 text-center">
      <p className="text-sm text-muted">
        {allShown ? `Показаны все ${total}` : `Показано ${shown} из ${total}`} {plural(total, noun)}
      </p>
      <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row sm:gap-3">
        {!allShown && (
          <button
            type="button"
            onClick={() => reveal(next)}
            className="h-12 w-full rounded-full border border-gold bg-gold/10 px-8 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-on-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto"
          >
            Показать ещё {next - shown}
          </button>
        )}
        <div className="flex items-center">
          {!allShown && (
            <button type="button" onClick={() => reveal(total)} className={secondary}>
              Показать все
            </button>
          )}
          {shown > initial && (
            <button type="button" onClick={collapse} className={secondary}>
              Показать меньше
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
