import type { Brand } from '@/entities/fragrance';

export interface LetterGroup {
  letter: string;
  brands: Brand[];
}

const OTHER = '#';
const collator = new Intl.Collator(['en', 'ru'], { sensitivity: 'base', numeric: true });

function letterOf(name: string): string {
  const ch = name.trim().charAt(0).toUpperCase();
  return /\p{L}/u.test(ch) ? ch : OTHER;
}

/** Latin letters first, then Cyrillic, then "#" for digits/symbols. */
function compareLetters(a: string, b: string): number {
  if (a === b) return 0;
  if (a === OTHER) return 1;
  if (b === OTHER) return -1;
  const aCyr = /[Ѐ-ӿ]/.test(a);
  const bCyr = /[Ѐ-ӿ]/.test(b);
  if (aCyr !== bCyr) return aCyr ? 1 : -1;
  return collator.compare(a, b);
}

export function groupBrandsByLetter(brands: readonly Brand[]): LetterGroup[] {
  const map = new Map<string, Brand[]>();
  for (const b of brands) map.set(letterOf(b.name), [...(map.get(letterOf(b.name)) ?? []), b]);
  return [...map.entries()]
    .sort(([a], [b]) => compareLetters(a, b))
    .map(([letter, list]) => ({ letter, brands: [...list].sort((a, b) => collator.compare(a.name, b.name)) }));
}
