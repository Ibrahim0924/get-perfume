import { useState } from 'react';
import { restoreOriginal } from './uploadPhoto';
import { useUploadedPhoto } from './uploadedPhotos';

/** "Вернуть исходное фото": shown only while a visitor-uploaded photo is the main one. */
export function RestoreOriginalButton({ fragranceId }: { fragranceId: string }) {
  const uploaded = useUploadedPhoto(fragranceId);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  if (!uploaded) return null;

  const restore = async () => {
    setBusy(true);
    setError(false);
    try {
      await restoreOriginal(fragranceId);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <p className="flex flex-wrap items-center gap-x-3 text-xs text-muted">
      <span>Показано загруженное фото.</span>
      <button type="button" onClick={restore} disabled={busy} className="-my-3 inline-flex min-h-11 items-center font-semibold text-gold underline-offset-4 hover:underline disabled:opacity-60">
        {busy ? 'Возвращаем…' : 'Вернуть исходное фото'}
      </button>
      {error && <span role="alert" className="text-rose">Не получилось, попробуйте ещё раз.</span>}
    </p>
  );
}
