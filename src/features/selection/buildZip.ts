import { strToU8, zipSync, type Zippable } from 'fflate';
import { fragranceTitle, GENDER_LABEL, type Fragrance } from '@/entities/fragrance';
import { photoSources } from '@/features/photo-upload';

/** Characters Windows and macOS do not allow in file names. */
const safeName = (s: string) => s.replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim();

const extensionOf = (url: string, type: string) =>
  type.includes('png') ? 'png' : type.includes('jpeg') ? 'jpg' : type.includes('webp') ? 'webp' : (url.split('?')[0]!.split('.').pop() ?? 'jpg');

/** First photo of the fragrance that can actually be downloaded (uploaded one, our copy, then the remote ones). */
async function fetchPhoto(f: Fragrance): Promise<{ bytes: Uint8Array; ext: string } | null> {
  for (const url of photoSources(f.id).sources) {
    if (!url) continue;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      return { bytes: new Uint8Array(await res.arrayBuffer()), ext: extensionOf(url, res.headers.get('content-type') ?? '') };
    } catch {
      /* unreachable or blocked by the other site — try the next one */
    }
  }
  return null;
}

/**
 * Archive with one photo per fragrance, named "01 Brand — Name.webp", plus a list of the names.
 * A fragrance whose photo cannot be fetched still appears in the list, marked as such.
 */
export async function buildSelectionZip(fragrances: readonly Fragrance[]): Promise<Blob> {
  const files: Zippable = {};
  const lines: string[] = [];
  const width = String(fragrances.length).length;
  const photos = await Promise.all(fragrances.map(fetchPhoto));

  fragrances.forEach((f, i) => {
    const title = fragranceTitle(f);
    const n = String(i + 1).padStart(Math.max(2, width), '0');
    const photo = photos[i];
    // Photos are already compressed: store them as is.
    if (photo) files[`${n} ${safeName(title)}.${photo.ext}`] = [photo.bytes, { level: 0 }];
    lines.push(`${n}. ${title} (${GENDER_LABEL[f.gender]}, ${f.pricePerMl} ₽/мл)${photo ? '' : ' — фото нет'}`);
  });
  files['Список ароматов.txt'] = strToU8(`Подборка GerParfume, ${fragrances.length} шт.\n\n${lines.join('\n')}\n`);

  const zipped = zipSync(files);
  return new Blob([zipped.buffer as ArrayBuffer], { type: 'application/zip' });
}
