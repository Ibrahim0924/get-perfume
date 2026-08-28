import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Chip({ active = false, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
        active
          ? 'border-gold bg-gold text-on-accent shadow-[0_0_0_1px_var(--color-gold)]'
          : 'border-line bg-transparent text-muted hover:border-gold/60 hover:text-fg',
        className,
      )}
      {...props}
    />
  );
}
