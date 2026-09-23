import type { ReactNode } from 'react';
import { Container } from '@/shared/ui/Container';
import { WhatsAppButton, WHATSAPP_PHONE_DISPLAY, whatsAppLink } from '@/shared/ui/WhatsAppButton';

type Nav = (sectionId?: string) => void;
export interface FooterVariant {
  name: string;
  render: (nav: Nav) => ReactNode;
}

const YEAR = new Date().getFullYear();
const LINKS: [label: string, section: string][] = [
  ['Каталог', 'catalog'],
  ['О нас', 'about'],
  ['Доставка', 'delivery'],
  ['Контакты', 'contacts'],
];
const DISCLAIMER = 'Все ароматы созданы по мотивам известных композиций и не являются продукцией упомянутых брендов.';
const NOTES = 'Ваниль · Уд · Бергамот · Жасмин · Сандал · Амбра · Роза · Мускус · Пачули · Ирис · Кожа';

function NavLinks({ nav, className = '', vertical = false }: { nav: Nav; className?: string; vertical?: boolean }) {
  return (
    <nav className={`${vertical ? 'flex flex-col gap-2' : 'flex flex-wrap items-center gap-x-6 gap-y-2'} text-sm ${className}`}>
      {LINKS.map(([label, id]) => (
        <button key={id} type="button" onClick={() => nav(id)} className="text-left transition-colors hover:text-gold">{label}</button>
      ))}
    </nav>
  );
}

const Wordmark = ({ className = '' }: { className?: string }) => (
  <span className={`font-display text-2xl ${className}`}>Get <span className="text-gold">Perfume</span></span>
);
const Phone = () => (
  <a href={whatsAppLink()} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-gold">{WHATSAPP_PHONE_DISPLAY}</a>
);

export const FOOTER_VARIANTS: FooterVariant[] = [
  {
    name: 'Три колонки',
    render: (nav) => (
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-3 max-w-60 text-[13px] text-muted">Ателье ароматов: знакомые композиции в вашем объёме.</p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Разделы</h4>
            <NavLinks nav={nav} vertical />
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Связь</h4>
            <p className="text-sm">WhatsApp · <Phone /></p>
            <p className="mt-1 text-sm text-muted">ежедневно 9:00–21:00</p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-1.5 border-t border-line/60 pt-4 text-xs text-muted sm:flex-row sm:justify-between">
          <span>© {YEAR} Get Perfume</span><span>{DISCLAIMER}</span>
        </div>
      </Container>
    ),
  },
  {
    name: 'Центр-минимал',
    render: (nav) => (
      <Container className="py-11 text-center">
        <Wordmark />
        <NavLinks nav={nav} className="mt-4 justify-center text-muted" />
        <p className="mt-4 text-xs text-muted">© {YEAR} · WhatsApp <Phone /></p>
      </Container>
    ),
  },
  {
    name: 'Гигантский вордмарк',
    render: (nav) => (
      <Container className="overflow-hidden py-10">
        <div aria-hidden="true" className="font-display text-center text-[clamp(3rem,12vw,9rem)] leading-[0.9] whitespace-nowrap text-gold opacity-25">Get Perfume</div>
        <div className="mt-3 flex flex-col items-center gap-2 text-[13px] text-muted sm:flex-row sm:justify-between">
          <span>© {YEAR}</span><NavLinks nav={nav} className="text-muted" /><span>WhatsApp <Phone /></span>
        </div>
      </Container>
    ),
  },
  {
    name: 'Тёмная полоса',
    render: (nav) => (
      <div className="bg-[#211d18] text-[#f3ecdf]">
        <Container className="py-11">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-between">
            <span className="font-display text-2xl">Get <span className="text-[#c9a86a]">Perfume</span></span>
            <NavLinks nav={nav} className="text-[#a89d8d]" />
            <WhatsAppButton label="WhatsApp" className="h-10 px-5" />
          </div>
          <p className="mt-6 text-center text-xs text-[#7d7365] sm:text-left">© {YEAR} Get Perfume · Ароматы по мотивам известных композиций</p>
        </Container>
      </div>
    ),
  },
  {
    name: 'CTA-футер',
    render: (nav) => (
      <Container className="py-14 text-center">
        <h3 className="font-display text-3xl">Остались вопросы?</h3>
        <p className="mt-2 text-muted">Напишите — поможем с выбором и расскажем про доставку.</p>
        <div className="mt-6"><WhatsAppButton label="Написать в WhatsApp" text="Здравствуйте! Есть вопрос." /></div>
        <div className="mt-9 flex flex-col items-center gap-3 text-xs text-muted">
          <NavLinks nav={nav} className="justify-center text-muted" />
          <span>© {YEAR} Get Perfume</span>
        </div>
      </Container>
    ),
  },
  {
    name: 'Нав + связь в строку',
    render: (nav) => (
      <Container className="py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <NavLinks nav={nav} className="text-muted" />
          <span className="text-sm">WhatsApp · <Phone /></span>
        </div>
        <div className="mt-6 flex flex-col gap-1 border-t border-line/60 pt-4 text-xs text-muted sm:flex-row sm:justify-between">
          <span>© {YEAR} Get Perfume</span><span>сделано с любовью к ароматам</span>
        </div>
      </Container>
    ),
  },
  {
    name: 'С дисклеймером',
    render: (nav) => (
      <Container className="py-10">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <Wordmark />
          <NavLinks nav={nav} className="text-muted" />
        </div>
        <p className="mt-5 max-w-xl text-[11px] leading-relaxed text-muted">{DISCLAIMER} Названия используются только для описания направления звучания. © {YEAR} Get Perfume.</p>
      </Container>
    ),
  },
  {
    name: 'Каталожные колонки',
    render: (nav) => (
      <Container className="py-12">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="mb-2.5 text-xs font-semibold tracking-[0.18em] text-muted uppercase">Каталог</h4>
            <div className="grid gap-1.5 text-sm">
              {['Женские', 'Мужские', 'Универсальные'].map((t) => (
                <button key={t} type="button" onClick={() => nav('catalog')} className="text-left hover:text-gold">{t}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-2.5 text-xs font-semibold tracking-[0.18em] text-muted uppercase">Покупателям</h4>
            <NavLinks nav={nav} vertical />
          </div>
          <div>
            <h4 className="mb-2.5 text-xs font-semibold tracking-[0.18em] text-muted uppercase">Связь</h4>
            <p className="text-sm">WhatsApp <Phone /></p>
            <p className="mt-1 text-sm text-muted">ежедневно 9:00–21:00</p>
          </div>
          <div><Wordmark /></div>
        </div>
        <p className="mt-8 text-xs text-muted">© {YEAR} Get Perfume</p>
      </Container>
    ),
  },
  {
    name: 'Приглашение к диалогу',
    render: (nav) => (
      <Container className="py-11">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-display text-2xl">Не знаете, с чего начать?</h3>
            <p className="mt-1 text-sm text-muted">Опишите любимые запахи — предложим три варианта под вас.</p>
          </div>
          <WhatsAppButton label="Подобрать аромат" text="Здравствуйте! Помогите подобрать аромат." />
        </div>
        <div className="mt-7 flex flex-col gap-2 border-t border-line/60 pt-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {YEAR} Get Perfume</span><NavLinks nav={nav} className="text-xs text-muted" />
        </div>
      </Container>
    ),
  },
  {
    name: 'Кнопка по центру',
    render: (nav) => (
      <Container className="py-13 text-center">
        <WhatsAppButton label="Заказать в WhatsApp" className="h-13 px-8 text-[15px]" />
        <NavLinks nav={nav} className="mt-5 justify-center text-muted" />
        <p className="mt-4 text-xs text-muted">© {YEAR} Get Perfume</p>
      </Container>
    ),
  },
  {
    name: 'Вертикальная нав справа',
    render: (nav) => (
      <Container className="py-12">
        <div className="flex flex-col justify-between gap-7 sm:flex-row">
          <div>
            <Wordmark />
            <p className="mt-3 max-w-72 text-[13px] text-muted">Ароматы по мотивам любимых композиций. WhatsApp <Phone />.</p>
            <p className="mt-5 text-xs text-muted">© {YEAR}</p>
          </div>
          <NavLinks nav={nav} vertical className="sm:text-right" />
        </div>
      </Container>
    ),
  },
  {
    name: 'Орнамент',
    render: (nav) => (
      <Container className="py-10 text-center">
        <p aria-hidden="true" className="mb-4 text-sm tracking-[0.6em] text-gold">✦ ❖ ✦</p>
        <Wordmark />
        <NavLinks nav={nav} className="mt-4 justify-center text-muted" />
        <p className="mt-4 text-xs text-muted">© {YEAR} · WhatsApp <Phone /></p>
      </Container>
    ),
  },
  {
    name: 'Лента нот',
    render: () => (
      <div>
        <div className="font-display overflow-hidden border-b border-line/60 py-3.5 text-lg whitespace-nowrap text-gold italic">{NOTES} · {NOTES}</div>
        <Container className="flex flex-col gap-1.5 py-6 text-[13px] text-muted sm:flex-row sm:justify-between">
          <span>© {YEAR} Get Perfume</span><span>WhatsApp <Phone /></span>
        </Container>
      </div>
    ),
  },
  {
    name: 'Одна строка',
    render: () => (
      <Container className="flex flex-col items-center gap-2 py-5 text-[13px] text-muted sm:flex-row sm:justify-between">
        <span className="font-display text-lg text-fg">Get <span className="text-gold">Perfume</span></span>
        <span>© {YEAR} · Ароматы по мотивам · WhatsApp <Phone /></span>
      </Container>
    ),
  },
  {
    name: 'Панель-карточка',
    render: (nav) => (
      <Container className="py-9">
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-3xl border border-line/70 bg-surface p-7">
          <div>
            <Wordmark />
            <NavLinks nav={nav} className="mt-2.5 text-muted" />
          </div>
          <WhatsAppButton label="WhatsApp" />
        </div>
        <p className="mt-4 text-center text-xs text-muted">© {YEAR} Get Perfume</p>
      </Container>
    ),
  },
  {
    name: 'С часами работы',
    render: (nav) => (
      <Container className="grid items-center gap-6 py-11 text-center sm:grid-cols-3 sm:text-left">
        <div>
          <Wordmark />
          <p className="mt-1 text-xs text-muted">© {YEAR}</p>
        </div>
        <div className="sm:text-center">
          <p className="font-display text-xl">Ежедневно 9:00 – 21:00</p>
          <p className="text-xs text-muted">отвечаем в WhatsApp в течение часа</p>
        </div>
        <div className="sm:text-right">
          <p className="text-sm"><Phone /></p>
          <NavLinks nav={nav} className="mt-1.5 justify-center text-xs text-muted sm:justify-end" />
        </div>
      </Container>
    ),
  },
  {
    name: 'Крупный слоган',
    render: () => (
      <Container className="py-14 text-center">
        <h3 className="font-display text-3xl italic sm:text-4xl">Запахи, которые остаются</h3>
        <p className="mt-4 text-[13px] text-muted">Get Perfume · © {YEAR} · WhatsApp <Phone /></p>
      </Container>
    ),
  },
  {
    name: 'Тёмный градиент',
    render: (nav) => (
      <div className="bg-[radial-gradient(60%_120%_at_50%_0%,#3a3126,#211d18)] text-[#f3ecdf]">
        <Container className="py-13 text-center">
          <span className="font-display text-3xl">Get <span className="text-[#c9a86a]">Perfume</span></span>
          <NavLinks nav={nav} className="mt-4 justify-center text-[#a89d8d]" />
          <p className="mt-4 text-xs text-[#7d7365]">© {YEAR} · WhatsApp {WHATSAPP_PHONE_DISPLAY} · ароматы по мотивам</p>
        </Container>
      </div>
    ),
  },
  {
    name: 'Двойная рамка',
    render: (nav) => (
      <Container className="py-9">
        <div className="border border-gold p-6 text-center outline outline-offset-4 outline-gold">
          <Wordmark />
          <NavLinks nav={nav} className="mt-3 justify-center text-muted" />
          <p className="mt-3 text-xs text-muted">© {YEAR} · WhatsApp <Phone /></p>
        </div>
      </Container>
    ),
  },
  {
    name: 'Столбик по центру',
    render: (nav) => (
      <Container className="flex flex-col items-center gap-4 py-12 text-center">
        <span className="font-display text-3xl">Get <span className="text-gold">Perfume</span></span>
        <p className="font-display text-lg text-muted italic">искусство пахнуть собой</p>
        <WhatsAppButton label="Написать нам" className="h-11" />
        <NavLinks nav={nav} className="justify-center text-muted" />
        <p className="text-xs text-muted">© {YEAR} Get Perfume</p>
      </Container>
    ),
  },
];
