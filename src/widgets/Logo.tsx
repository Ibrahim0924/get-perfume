import emblem from '@/shared/assets/logo-emblem.webp';

/** Brand emblem (gold bottle monogram), transparent so it sits on either theme. */
export function Logo({ className }: { className?: string }) {
  return <img src={emblem} alt="" aria-hidden="true" className={className} />;
}
