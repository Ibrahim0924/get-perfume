export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="currentColor" className="text-surface" />
      <path d="M32 10c-2 8-10 12-10 22a10 10 0 0 0 20 0c0-10-8-14-10-22z" fill="var(--color-gold)" />
      <path d="M26 44h12v6H26z" fill="var(--color-gold)" />
    </svg>
  );
}
