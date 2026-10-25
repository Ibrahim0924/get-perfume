import { useSyncExternalStore } from 'react';
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseEnabled } from '@/shared/config/supabase';

const BUCKET = 'photos';
const HEADERS = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };

export const publicPhotoUrl = (path: string) => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURI(path)}`;

/** Path of a row that means "back to the site's own photo" (no file behind it). */
export const originalPath = (fragranceId: string) => `${fragranceId}/original`;

/** fragranceId → URL of its newest uploaded photo, or null once the original was restored. */
let photos: ReadonlyMap<string, string | null> = new Map();
let requested = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

async function load() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/photo_overrides?select=fragrance_id,path&order=created_at.desc`, { headers: HEADERS });
    if (!res.ok) return;
    const rows = (await res.json()) as { fragrance_id: string; path: string }[];
    const next = new Map<string, string | null>();
    for (const r of rows) {
      if (next.has(r.fragrance_id)) continue; // newest first: only the latest row counts
      next.set(r.fragrance_id, r.path === originalPath(r.fragrance_id) ? null : publicPhotoUrl(r.path));
    }
    photos = next;
    emit();
  } catch {
    /* offline or service down: the built-in photos stay */
  }
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  if (supabaseEnabled && !requested) {
    requested = true;
    void load();
  }
  return () => listeners.delete(listener);
};

/** Newest visitor-uploaded photo of a fragrance, or null. Fetched once per visit, shared by every component. */
export function useUploadedPhoto(fragranceId: string): string | null {
  return useSyncExternalStore(subscribe, () => photos.get(fragranceId) ?? null);
}

/** Same, outside React (e.g. when building the ZIP). */
export const uploadedPhoto = (fragranceId: string): string | null => photos.get(fragranceId) ?? null;

/** Show a just-uploaded photo (or the restored original, null) right away, without refetching the list. */
export function rememberUpload(fragranceId: string, url: string | null) {
  photos = new Map(photos).set(fragranceId, url);
  emit();
}
