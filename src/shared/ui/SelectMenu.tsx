import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

/** Minimum gap between the menu and any screen edge. */
const EDGE = 8;
const GAP = 8;

interface Option<T extends string> {
  value: T;
  label: string;
  /** Shorter text for the button itself (the menu shows the full label). */
  short?: string;
}

interface Props<T extends string> {
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  /** Accessible name of the control (the visible button shows only the current value). */
  label: string;
  icon?: ReactNode;
  /** Gold dot on the phone (icon-only) button, e.g. when a non-default option is chosen. */
  marked?: boolean;
  className?: string;
}

/** Site-styled replacement for a native <select>: same look on every OS, listbox semantics, full keyboard support. */
export function SelectMenu<T extends string>({ value, options, onChange, label, icon, marked = false, className }: Props<T>) {
  const [open, setOpen] = useState(false);
  // Stays true while the closing animation plays, so the menu fades out instead of vanishing.
  const [mounted, setMounted] = useState(false);
  // The label only animates after a pick, not on first render.
  const [picked, setPicked] = useState(false);
  const [active, setActive] = useState(0);
  const [place, setPlace] = useState<CSSProperties>({});
  const [upward, setUpward] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));

  const close = useCallback((focusButton = true) => {
    setOpen(false);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setMounted(false);
    if (focusButton) buttonRef.current?.focus();
  }, []);

  const openList = (index = selectedIndex) => {
    setActive(index);
    setOpen(true);
    setMounted(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (option && option.value !== value) {
      setPicked(true);
      onChange(option.value);
    }
    close();
  };

  // Keep the open menu fully on screen: right-aligned to the button when it fits, otherwise shifted
  // in from whichever side it would cross; opens towards the larger free space, scrolls if even that is short.
  useLayoutEffect(() => {
    if (!open || !listRef.current || !rootRef.current) return;
    const anchor = rootRef.current.getBoundingClientRect();
    const width = listRef.current.offsetWidth;
    const below = window.innerHeight - anchor.bottom - GAP - EDGE;
    const above = anchor.top - GAP - EDGE;
    const goUp = listRef.current.scrollHeight > below && above > below;
    const alignRight = anchor.right - width;
    const preferredLeft = alignRight >= EDGE ? alignRight : anchor.left; // near the left edge: align to the button's left
    const left = Math.min(Math.max(preferredLeft, EDGE), window.innerWidth - EDGE - width);
    setUpward(goUp);
    setPlace({ left: left - anchor.left, right: 'auto', maxHeight: Math.max(goUp ? above : below, 120) });
  }, [open]);

  // Focus the list on open; close on a tap/click anywhere else.
  useEffect(() => {
    if (!open) return;
    listRef.current?.focus({ preventScroll: true });
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, close]);

  const onButtonKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      openList();
    }
  };

  const onListKey = (e: KeyboardEvent) => {
    const last = options.length - 1;
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive((i) => Math.min(last, i + 1)),
      ArrowUp: () => setActive((i) => Math.max(0, i - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => choose(active),
      ' ': () => choose(active),
      Escape: () => close(),
      Tab: () => close(false),
    };
    const handler = keys[e.key];
    if (!handler) return;
    if (e.key !== 'Tab') e.preventDefault();
    handler();
  };

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`${label}: ${options[selectedIndex]?.label ?? ''}`}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onButtonKey}
        className={cn(
          // Phones: a round icon button beside the search field; wider screens also show the current value.
          'relative inline-flex h-11 items-center gap-2 rounded-full border bg-surface pr-3 pl-4 text-sm text-fg transition-colors max-sm:w-11 max-sm:justify-center max-sm:p-0',
          'hover:border-gold/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
          open ? 'border-gold' : 'border-line',
        )}
      >
        {icon && <span aria-hidden="true" className="text-muted max-sm:text-fg">{icon}</span>}
        {marked && <span aria-hidden="true" className="absolute top-2 right-2 size-2 rounded-full bg-gold ring-2 ring-surface sm:hidden" />}
        {/* Every label sits in the same grid cell, so the button is always as wide as the longest one
            and does not jump (or rewrap the row) when the choice changes. */}
        <span className="grid text-left max-sm:hidden">
          {options.map((o) => (
            <span key={o.value} aria-hidden="true" className="invisible col-start-1 row-start-1">{o.short ?? o.label}</span>
          ))}
          <span key={value} className={cn('col-start-1 row-start-1', picked && 'label-swap')}>{options[selectedIndex]?.short ?? options[selectedIndex]?.label}</span>
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={cn('size-4 text-muted transition-transform duration-200 max-sm:hidden', open && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {mounted && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKey}
          onAnimationEnd={() => { if (!open) setMounted(false); }}
          style={place}
          className={cn(
            'menu-pop absolute right-0 z-40 max-w-[calc(100vw-1rem)] min-w-56 overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface p-1.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,.45)] outline-none',
            upward ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right',
            !open && 'menu-out pointer-events-none',
          )}
        >
          {options.map((o, i) => {
            const selected = i === selectedIndex;
            return (
              <li
                key={o.value}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={selected}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(i)}
                className={cn(
                  'flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-xl px-3.5 text-sm select-none',
                  selected ? 'font-semibold text-gold' : 'text-fg',
                  i === active && 'bg-gold/10',
                )}
              >
                {o.label}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className={cn('size-4 shrink-0', !selected && 'invisible')}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12.5 10 17 19 7.5" />
                </svg>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
