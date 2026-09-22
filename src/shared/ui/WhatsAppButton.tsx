import { cn } from '@/shared/lib/cn';

export const WHATSAPP_PHONE = '79677775727';
export const WHATSAPP_PHONE_DISPLAY = '8 967 777-57-27';

export function whatsAppLink(text?: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export function WhatsAppButton({ text, label = 'Написать в WhatsApp', className }: { text?: string; label?: string; className?: string }) {
  return (
    <a
      href={whatsAppLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex h-12 items-center gap-2.5 rounded-full bg-[#25d366] px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5',
        className,
      )}
    >
      <WhatsAppIcon className="size-5" />
      {label}
    </a>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.16-1.32A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.06.79.81-2.98-.2-.31A8.2 8.2 0 1 1 12 20.2zm4.5-6.14c-.25-.12-1.46-.72-1.68-.8-.23-.09-.4-.13-.56.12-.17.25-.64.8-.79.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-1.98-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25 0-.38.11-.5.11-.12.25-.3.37-.44.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.6.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.2-.57.2-1.06.14-1.17-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}
