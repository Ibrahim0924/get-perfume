import idsRaw from '@/data/ids.json';
import { slugify } from '@/shared/lib/slugify';
import { catalog } from './catalog';
import type { Fragrance } from './types';

/**
 * Canonical URL is the short numeric id (`#/217`, from src/data/ids.json — stable, append-only).
 * Readable `<brand>/<name>` paths keep resolving as aliases.
 */
const numericIds = idsRaw as Record<string, number>;

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
    pathToFragrance.set(`${brand.id}/${slug}`, f);
    const num = numericIds[f.id];
    if (num !== undefined) {
      idToPath.set(f.id, String(num));
      pathToFragrance.set(String(num), f);
    } else {
      idToPath.set(f.id, `${brand.id}/${slug}`);
    }
  }
}

export const fragrancePath = (fragranceId: string): string | null => idToPath.get(fragranceId) ?? null;
export const fragranceByPath = (path: string): Fragrance | null => pathToFragrance.get(path) ?? null;
export const isBrandId = (id: string): boolean => catalog.brands.some((b) => b.id === id);
