import { cn } from '@/shared/lib/cn';

/**
 * Arrow icon for "back" / "go" links. Unlike the "←" / "→" characters (which sit on the text
 * baseline, below the middle in our fonts), it centres on the line in an items-center flex row.
 */
export function Arrow({ direction = 'left', className }: { direction?: 'left' | 'right'; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('size-4 shrink-0', direction === 'right' && 'rotate-180', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5m6-6-6 6 6 6" />
    </svg>
  );
}
