import photos from '@/data/photos.json';

const files = photos as Record<string, string>;

/** Locally hosted reference photo (see scripts/fetch-photos.py), or null when none was downloaded. */
export const localPhoto = (fragranceId: string): string | null => {
  const file = files[fragranceId];
  return file ? `${import.meta.env.BASE_URL}photos/${file}` : null;
};
