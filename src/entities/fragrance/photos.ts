import photos from '@/data/photos.json';

const files = photos as Record<string, string>;

/** Locally hosted reference photo (see scripts/fetch-photos.py), or null when none was downloaded. */
export const localPhoto = (fragranceId: string): string | null => {
  const file = files[fragranceId];
  return file ? `${import.meta.env.BASE_URL}photos/${file}` : null;
};

/** Brands whose photos are studio shots with their own backdrop (not a cut-out on white). */
const BACKDROP_BRANDS = new Set(['avtorskie']);

/** True when the photo should fill its frame edge to edge instead of sitting on the white plate. */
export const photoFillsFrame = (fragranceId: string): boolean => BACKDROP_BRANDS.has(fragranceId.split('--')[0]!);
