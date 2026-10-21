import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  /** Accessible name of the control (the visible button shows only the current value). */
  label: string;
  icon?: ReactNode;
  className?: string;
}

/** Site-styled replacement for a native <select>: same look on every OS, listbox semantics, full keyboard support. */
export function SelectMenu<T extends string>({ value, options, onChange, label, icon, className }: Props<T>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [upward, setUpward] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));

  const close = useCallback((focusButton = true) => {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  }, []);

  const openList = (index = selectedIndex) => {
    // Open upwards when the button sits near the bottom of the screen and there is more room above.
    const rect = buttonRef.current?.getBoundingClientRect();
    const needed = options.length * 44 + 32;
    setUpward(!!rect && window.innerHeight - rect.bottom < needed && rect.top > window.innerHeight - rect.bottom);
    setActive(index);
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (option && option.value !== value) onChange(option.value);
    close();
  };

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
          'inline-flex h-9 items-center gap-2 rounded-full border bg-surface pr-3 pl-4 text-sm text-fg transition-colors',
          'hover:border-gold/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
          open ? 'border-gold' : 'border-line',
        )}
      >
        {icon && <span aria-hidden="true" className="text-muted">{icon}</span>}
        <span>{options[selectedIndex]?.label}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={cn('size-4 text-muted transition-transform duration-200', open && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={label}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKey}
          className={cn(
            'menu-pop absolute right-0 z-40 min-w-56 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,.45)] outline-none',
            upward ? 'bottom-full mb-2 origin-bottom-right' : 'top-full mt-2 origin-top-right',
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
