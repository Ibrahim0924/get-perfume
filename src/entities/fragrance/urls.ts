import { slugify } from '@/shared/lib/slugify';
import { catalog } from './catalog';
import type { Fragrance } from './types';

/** Clean URL paths: `<brand>/<name>`, with a short gender suffix only when a name repeats within the brand. */
const GENDER_SUFFIX = { female: 'f', male: 'm', unisex: 'u' } as const;

const idToPath = new Map<string, string>();
const pathToFragrance = new Map<string, Fragrance>();

for (const brand of catalog.brands) {
  const counts = new Map<string, number>();
  for (const f of brand.fragrances) {
    const s = slugify(f.name);
    counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  for (const f of brand.fragrances) {
    const s = slugify(f.name);
    const slug = (counts.get(s) ?? 0) > 1 ? `${s}-${GENDER_SUFFIX[f.gender]}` : s;
    const path = `${brand.id}/${slug}`;
    idToPath.set(f.id, path);
    pathToFragrance.set(path, f);
  }
}

export const fragrancePath = (fragranceId: string): string | null => idToPath.get(fragranceId) ?? null;
export const fragranceByPath = (path: string): Fragrance | null => pathToFragrance.get(path) ?? null;
export const isBrandId = (id: string): boolean => catalog.brands.some((b) => b.id === id);
