import { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/cn';

interface Props {
  /** Candidate URLs, tried in order until one loads. */
  sources: (string | null | undefined)[];
  alt: string;
  className?: string;
  /** For photos with their own backdrop: fill the (padding-free, same-shaped) frame edge to edge. */
  fill?: boolean;
}

/** Remote reference photo; walks the source list on error, then shows a bottle glyph. */
export function FragranceImage({ sources, alt, className, fill }: Props) {
  const [stage, setStage] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  const urls = sources.filter((s): s is string => Boolean(s));
  const url = urls[stage] ?? null;

  // Cached images may complete before React attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, [url]);

  if (!url) {
    return (
      <div className={cn('flex items-center justify-center text-muted/60', className)} aria-hidden="true">
        <svg viewBox="0 0 24 24" className="size-1/2" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3h6v3H9zM8 8h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z" /></svg>
      </div>
    );
  }
  return (
    <img
      ref={ref}
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={() => setLoaded(true)}
      onError={() => { setLoaded(false); setStage((s) => s + 1); }}
      className={cn(
        'transition-opacity duration-300',
        fill ? 'size-full object-cover' : 'object-contain',
        // Skeleton while the file is in flight: a soft pulsing tint instead of an empty frame.
        loaded ? 'opacity-100' : cn('animate-pulse bg-line/60 opacity-70', !fill && 'rounded-lg'),
        className,
      )}
    />
  );
}
