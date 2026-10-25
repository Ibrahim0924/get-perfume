import { useRef, useState } from 'react';
import { supabaseEnabled } from '@/shared/config/supabase';
import { cn } from '@/shared/lib/cn';
import { uploadPhoto } from './uploadPhoto';

type Status = { kind: 'idle' } | { kind: 'busy' } | { kind: 'done' } | { kind: 'error'; message: string };

/** Where the button sits on its (relative) container; the status note opens towards the inside. */
const CORNER = {
  'top-left': { button: 'top-1.5 left-1.5', note: 'top-full left-0 mt-1.5' },
  'bottom-right': { button: 'right-3 bottom-3', note: 'right-0 bottom-full mb-1.5' },
} as const;

/**
 * Round camera button over a photo: pick a picture (or take one on a phone) and it becomes the
 * fragrance's main photo for everyone. Renders nothing while uploads are switched off.
 */
export function UploadPhotoButton({ fragranceId, corner }: { fragranceId: string; corner: keyof typeof CORNER }) {
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  if (!supabaseEnabled) return null;

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setStatus({ kind: 'busy' });
    try {
      await uploadPhoto(fragranceId, file);
      setStatus({ kind: 'done' });
      setTimeout(() => setStatus({ kind: 'idle' }), 2500);
    } catch (e) {
      setStatus({ kind: 'error', message: e instanceof Error ? e.message : 'Не удалось загрузить фото.' });
      setTimeout(() => setStatus({ kind: 'idle' }), 4000);
    }
  };

  const label = status.kind === 'busy' ? 'Загружаем…' : status.kind === 'done' ? 'Фото обновлено' : status.kind === 'error' ? status.message : 'Загрузить своё фото';

  return (
    <span className={cn('absolute z-10', CORNER[corner].button)}>
      {status.kind !== 'idle' && (
        <span
          role="status"
          className={cn(
            'absolute rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap shadow',
            CORNER[corner].note,
            status.kind === 'error' ? 'bg-rose text-white' : 'bg-bg/90 text-fg',
          )}
        >
          {label}
        </span>
      )}
      <button
        type="button"
        // Never let the tap reach a clickable card around the photo.
        onClick={(e) => {
          e.stopPropagation();
          input.current?.click();
        }}
        disabled={status.kind === 'busy'}
        aria-label="Загрузить своё фото"
        title="Загрузить своё фото — оно станет основным для всех"
        className="flex size-9 items-center justify-center rounded-full border border-line/70 bg-bg/85 text-fg shadow-sm backdrop-blur transition-colors hover:border-gold hover:text-gold disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {status.kind === 'busy' ? (
          <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2h6L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
        )}
      </button>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = ''; // the same file can be picked again
        }}
      />
    </span>
  );
}
