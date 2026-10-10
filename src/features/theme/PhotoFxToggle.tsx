import { useCallback, useEffect, useState } from 'react';

// Временный переключатель обработки фото (убрать после сравнения).
const STORAGE_KEY = 'gerparfume:photo-fx';

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

/** Switches the CSS photo treatment (multiply blend + plate) on and off for side-by-side comparison. */
export function PhotoFxToggle() {
  const [on, setOn] = useState(readStored);

  useEffect(() => {
    document.documentElement.dataset.photoFx = on ? 'on' : 'off';
    try { localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off'); } catch { /* fine without persistence */ }
  }, [on]);

  const toggle = useCallback(() => setOn((v) => !v), []);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
      title={on ? 'Обработка фото включена' : 'Обработка фото выключена'}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-line px-3 text-xs font-medium text-muted transition-colors hover:border-gold hover:text-gold"
    >
      <span className="hidden sm:inline">Обработка фото</span>
      <span aria-hidden="true" className={`relative h-4 w-7 rounded-full transition-colors ${on ? 'bg-gold' : 'bg-line'}`}>
        <span className={`absolute top-0.5 size-3 rounded-full bg-surface shadow transition-transform ${on ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
      </span>
      <span className="w-7 tabular-nums">{on ? 'вкл' : 'выкл'}</span>
    </button>
  );
}
