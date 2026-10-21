import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'gerparfume:selection';

function read(): ReadonlySet<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

let selected = read();
const listeners = new Set<() => void>();

function commit(next: ReadonlySet<string>) {
  selected = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    /* storage unavailable — the selection still works for this visit */
  }
  listeners.forEach((l) => l());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/**
 * Fragrances ticked in "Подборка". One shared set (the header badge and the page read the same one),
 * kept in localStorage so a long pick can be spread over several visits.
 */
export function useSelection() {
  const ids = useSyncExternalStore(subscribe, () => selected);
  return {
    ids,
    toggle: (id: string) => {
      const next = new Set(selected);
      if (!next.delete(id)) next.add(id);
      commit(next);
    },
    addAll: (list: readonly string[]) => commit(new Set([...selected, ...list])),
    clear: () => commit(new Set()),
  };
}
