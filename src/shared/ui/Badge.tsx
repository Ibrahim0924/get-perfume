import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-line px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.12em] text-muted uppercase',
        className,
      )}
    >
      {children}
    </span>
  );
}
