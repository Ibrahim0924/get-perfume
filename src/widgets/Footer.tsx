import { Container } from '@/shared/ui/Container';
import { WHATSAPP_PHONE_DISPLAY, whatsAppLink } from '@/shared/ui/WhatsAppButton';

const YEAR = new Date().getFullYear();
const LINKS: [label: string, section: string][] = [
  ['Каталог', 'catalog'],
  ['О нас', 'about'],
  ['Доставка', 'delivery'],
  ['Контакты', 'contacts'],
];
const DISCLAIMER = 'Все ароматы созданы по мотивам известных композиций и не являются продукцией упомянутых брендов.';

export function Footer({ onNavigate }: { onNavigate: (sectionId?: string) => void }) {
  return (
    <footer className="border-t border-line/60">
      {/* Extra bottom room on phones so the floating "Наверх" button never covers the last line. */}
      <Container className="pt-12 pb-28 sm:pb-12">
        <div className="grid gap-8 sm:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <span className="font-display text-2xl">Ger<span className="text-gold">Parfume</span></span>
            <p className="mt-3 max-w-60 text-[13px] text-muted">Ателье ароматов: знакомые композиции в вашем объёме.</p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Разделы</h4>
            <nav className="flex flex-col text-sm" aria-label="Разделы сайта">
              {LINKS.map(([label, id]) => (
                <button key={id} type="button" onClick={() => onNavigate(id)} className="-my-2 inline-flex min-h-11 items-center self-start py-3 text-left transition-colors hover:text-gold">{label}</button>
              ))}
            </nav>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Связь</h4>
            <p className="text-sm">
              WhatsApp ·{' '}
              <a href={whatsAppLink()} target="_blank" rel="noopener noreferrer" className="-my-3 inline-flex min-h-11 items-center font-semibold hover:text-gold">{WHATSAPP_PHONE_DISPLAY}</a>
            </p>
            <p className="mt-1 text-sm text-muted">ежедневно 9:00–21:00</p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-1.5 border-t border-line/60 pt-4 text-xs text-muted sm:flex-row sm:justify-between">
          <span>© {YEAR} GerParfume</span><span>{DISCLAIMER}</span>
        </div>
      </Container>
    </footer>
  );
}
