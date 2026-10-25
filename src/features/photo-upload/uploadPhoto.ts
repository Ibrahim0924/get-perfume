import { SUPABASE_URL, supabaseHeaders } from '@/shared/config/supabase';
import { originalPath, publicPhotoUrl, rememberUpload } from './uploadedPhotos';

const MAX_SIDE = 1200;
const MAX_INPUT_BYTES = 15 * 1024 * 1024;

/**
 * Redraws the picture at most 1200px on its longer side as JPEG. Keeps uploads small and drops
 * everything hidden in the original file (camera data, GPS location).
 */
async function prepare(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fff'; // transparent PNGs get the same white plate as the other photos
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), 'image/jpeg', 0.86));
}

/**
 * Uploads a new main photo for a fragrance: a new file in the bucket plus a row pointing at it.
 * Nothing is overwritten — older photos stay and the newest row wins, so any upload can be undone.
 */
export async function uploadPhoto(fragranceId: string, file: File): Promise<void> {
  if (!file.type.startsWith('image/')) throw new Error('Это не изображение.');
  if (file.size > MAX_INPUT_BYTES) throw new Error('Файл слишком большой (больше 15 МБ).');
  const blob = await prepare(file);
  const path = `${fragranceId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

  const put = await fetch(`${SUPABASE_URL}/storage/v1/object/photos/${encodeURI(path)}`, {
    method: 'POST',
    headers: { ...supabaseHeaders, 'Content-Type': 'image/jpeg', 'x-upsert': 'false' },
    body: blob,
  });
  if (!put.ok) throw new Error('Не удалось загрузить фото.');

  if (!(await addRow(fragranceId, path))) throw new Error('Фото загружено, но не сохранилось как основное.');
  rememberUpload(fragranceId, publicPhotoUrl(path));
}

/** Makes the site's own photo the main one again. Uploaded files stay, so this can be undone too. */
export async function restoreOriginal(fragranceId: string): Promise<void> {
  if (!(await addRow(fragranceId, originalPath(fragranceId)))) throw new Error('Не удалось вернуть исходное фото.');
  rememberUpload(fragranceId, null);
}

/** Appends a row to the photo history; the newest row per fragrance decides its main photo. */
async function addRow(fragranceId: string, path: string): Promise<boolean> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/photo_overrides`, {
    method: 'POST',
    headers: { ...supabaseHeaders, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ fragrance_id: fragranceId, path }),
  });
  return res.ok;
}
