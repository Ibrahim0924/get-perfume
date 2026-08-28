import { useState } from 'react';
import { cn } from '@/shared/lib/cn';

interface Props {
  src: string | null;
  fallbackSrc?: string | null;
  alt: string;
  className?: string;
}

/** Remote reference image; falls back to the secondary URL, then to a bottle glyph. */
export function FragranceImage({ src, fallbackSrc, alt, className }: Props) {
  const [stage, setStage] = useState(0);
  const url = stage === 0 ? src : stage === 1 ? fallbackSrc : null;
  if (!url) {
    return (
      <div className={cn('flex items-center justify-center text-muted/60', className)} aria-hidden="true">
        <svg viewBox="0 0 24 24" className="size-1/2" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3h6v3H9zM8 8h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z" /></svg>
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setStage((s) => s + 1)}
      className={cn('object-contain mix-blend-multiply', className)}
    />
  );
}
