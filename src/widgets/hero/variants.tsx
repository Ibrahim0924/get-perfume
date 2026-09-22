import type { ReactNode } from 'react';
import { Container } from '@/shared/ui/Container';
import { WhatsAppButton } from '@/shared/ui/WhatsAppButton';

export interface HeroVariant {
  name: string;
  render: (goCatalog: () => void) => ReactNode;
}

function Cta({ onClick, children, ghost = false }: { onClick: () => void; children: ReactNode; ghost?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        ghost
          ? 'inline-flex h-12 items-center rounded-full border border-gold px-7 text-sm font-semibold text-gold transition-transform hover:-translate-y-0.5'
          : 'inline-flex h-12 items-center rounded-full bg-gold px-7 text-sm font-semibold text-on-accent transition-transform hover:-translate-y-0.5'
      }
    >
      {children}
    </button>
  );
}

const NOTES = 'Ваниль · Уд · Бергамот · Жасмин · Сандал · Амбра · Роза · Мускус · Пачули · Ирис · Кожа';

export const HERO_VARIANTS: HeroVariant[] = [
  {
    name: 'Слоган по центру',
    render: (go) => (
      <Container className="py-20 text-center sm:py-28">
        <h1 className="font-display mx-auto max-w-3xl text-4xl leading-[1.08] sm:text-6xl">
          Любимый аромат — <span className="text-gold">без переплаты за флакон</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base text-muted sm:text-lg">Знакомые композиции на разлив: берите ровно столько, сколько хочется носить.</p>
        <div className="mt-9"><Cta onClick={go}>Смотреть каталог</Cta></div>
      </Container>
    ),
  },
  {
    name: 'Поэтичный, слева',
    render: (go) => (
      <Container className="py-24 sm:py-32">
        <h1 className="font-display max-w-3xl text-5xl leading-[1.02] sm:text-7xl">
          Запах, который <em className="text-gold italic">запоминают</em>
        </h1>
        <p className="mt-6 max-w-md text-base text-muted sm:text-lg">Ателье ароматов Get Perfume: подберём звучание под ваш характер и случай.</p>
        <div className="mt-9"><Cta onClick={go}>Найти свой аромат</Cta></div>
      </Container>
    ),
  },
  {
    name: 'Сплит с флаконом',
    render: (go) => (
      <Container className="grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl">Парфюмерия<br />на разлив</h1>
          <p className="mt-5 max-w-sm text-muted">Оригинальное звучание в удобном объёме — от пробника до флакона.</p>
          <div className="mt-8"><Cta onClick={go}>Открыть каталог</Cta></div>
        </div>
        <div aria-hidden="true" className="relative mx-auto h-64 w-full max-w-xs sm:h-96">
          <div className="absolute bottom-6 left-1/2 h-3/4 w-40 -translate-x-1/2 rounded-t-2xl rounded-b-3xl bg-gradient-to-br from-gold to-[#7a5a2a] shadow-[0_40px_70px_-30px_rgba(58,42,26,.55)]" />
          <div className="absolute top-0 left-1/2 size-14 -translate-x-1/2 rounded-lg bg-fg/90" />
        </div>
      </Container>
    ),
  },
  {
    name: 'Поиск в центре',
    render: (go) => (
      <Container className="py-20 text-center sm:py-28">
        <h1 className="font-display text-4xl sm:text-6xl">Найдите свой аромат</h1>
        <p className="mt-3 text-muted">По названию, бренду или настроению</p>
        <button type="button" onClick={go} className="mx-auto mt-8 flex h-14 w-full max-w-xl items-center rounded-full border border-line bg-surface pr-2 pl-6 text-muted transition-colors hover:border-gold">
          <span className="truncate">Sauvage, ваниль, что-то свежее…</span>
          <span className="ml-auto flex h-10 shrink-0 items-center rounded-full bg-gold px-5 text-sm font-semibold text-on-accent">Искать</span>
        </button>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {['Сладкие', 'Свежие', 'Восточные', 'Унисекс'].map((t) => (
            <button key={t} type="button" onClick={go} className="rounded-full border border-line px-4 py-1.5 text-sm text-muted hover:border-gold hover:text-gold">{t}</button>
          ))}
        </div>
      </Container>
    ),
  },
  {
    name: 'Цитата',
    render: () => (
      <Container className="py-24 text-center sm:py-32">
        <span aria-hidden="true" className="font-display block text-8xl leading-[0.4] text-gold">“</span>
        <h1 className="font-display mx-auto mt-4 max-w-3xl text-3xl italic sm:text-5xl">Аромат — это невидимая, но незабываемая часть образа</h1>
        <p className="mt-6 text-[11px] font-semibold tracking-[0.3em] text-muted uppercase">Get Perfume · ателье ароматов</p>
      </Container>
    ),
  },
  {
    name: 'Две строки-манифест',
    render: (go) => (
      <Container className="py-24 text-center sm:py-32">
        <h1 className="font-display text-6xl leading-[1.02] sm:text-8xl">Ваш аромат.<span className="block text-gold">Ваш объём.</span></h1>
        <div className="mt-10"><Cta onClick={go}>Выбрать аромат</Cta></div>
      </Container>
    ),
  },
  {
    name: 'Лента нот',
    render: () => (
      <div className="py-20 sm:py-28">
        <Container className="text-center">
          <h1 className="font-display text-4xl sm:text-6xl">Собрано из любимых нот</h1>
          <p className="mt-4 text-muted">Ваниль, уд, бергамот, жасмин — найдите звучание, которое ваше.</p>
        </Container>
        <div className="font-display mt-10 overflow-hidden border-y border-line/60 py-4 text-xl whitespace-nowrap text-gold italic">
          {NOTES} · {NOTES}
        </div>
      </div>
    ),
  },
  {
    name: 'Тёплый градиент',
    render: (go) => (
      <div className="hero-glow">
        <Container className="py-24 sm:py-32">
          <h1 className="font-display max-w-2xl text-4xl leading-[1.06] sm:text-6xl">Ароматы, знакомые до последней ноты</h1>
          <p className="mt-5 max-w-md text-muted sm:text-lg">То самое звучание — в честном объёме и без лишних наценок.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Cta onClick={go}>Смотреть каталог</Cta><Cta onClick={go} ghost>Как это работает</Cta></div>
        </Container>
      </div>
    ),
  },
  {
    name: 'Строгий минимум',
    render: () => (
      <Container className="py-28 text-center sm:py-40">
        <p className="font-display text-2xl tracking-[0.4em] text-gold uppercase">GP</p>
        <h1 className="font-display mt-4 text-3xl tracking-wide sm:text-5xl">Ателье ароматов</h1>
      </Container>
    ),
  },
  {
    name: 'WhatsApp-первый',
    render: (go) => (
      <Container className="py-20 text-center sm:py-28">
        <h1 className="font-display mx-auto max-w-2xl text-4xl sm:text-6xl">Подберём аромат лично под вас</h1>
        <p className="mx-auto mt-5 max-w-md text-muted">Расскажите, что любите — предложим варианты и нальём нужный объём.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <WhatsAppButton label="Написать в WhatsApp" text="Здравствуйте! Помогите подобрать аромат." />
          <Cta onClick={go} ghost>Смотреть каталог</Cta>
        </div>
      </Container>
    ),
  },
  {
    name: 'Три преимущества',
    render: () => (
      <Container className="py-20 text-center sm:py-24">
        <h1 className="font-display text-4xl sm:text-6xl">Парфюм, как вы любите</h1>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            ['🌿', 'Точное звучание', 'композиции раскрываются как оригинал'],
            ['💧', 'Любой объём', 'от пробника до полного флакона'],
            ['🤝', 'Личный подбор', 'поможем найти аромат под характер'],
          ].map(([i, t, d]) => (
            <div key={t} className="rounded-2xl border border-line/70 bg-surface p-6">
              <div className="text-2xl">{i}</div>
              <p className="mt-3 text-sm font-semibold">{t}</p>
              <p className="mt-1 text-xs text-muted">{d}</p>
            </div>
          ))}
        </div>
      </Container>
    ),
  },
  {
    name: 'Про звучание',
    render: () => (
      <Container className="py-24 sm:py-32">
        <p className="text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">Ателье ароматов</p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl leading-[1.08] sm:text-6xl">
          От первой ноты до шлейфа — <em className="text-gold italic">звучит как оригинал</em>
        </h1>
      </Container>
    ),
  },
  {
    name: 'Арка',
    render: (go) => (
      <Container className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <h1 className="font-display text-4xl leading-[1.06] sm:text-6xl">Пробуйте больше — платите за миллилитры</h1>
          <p className="mt-5 max-w-sm text-muted">Один флакон — это один запах. Разлив — целая полка любимых.</p>
          <div className="mt-8"><Cta onClick={go}>К каталогу</Cta></div>
        </div>
        <div aria-hidden="true" className="relative mx-auto h-64 w-full max-w-sm rounded-t-full rounded-b-3xl bg-gradient-to-b from-[#d9c193] to-gold sm:h-96">
          <div className="absolute inset-6 rounded-t-full rounded-b-2xl border border-white/50" />
        </div>
      </Container>
    ),
  },
  {
    name: 'Тёмная полоса',
    render: (go) => (
      <div className="bg-[#211d18] text-[#f3ecdf]">
        <Container className="py-24 text-center sm:py-32">
          <h1 className="font-display text-5xl sm:text-7xl">Тот самый <span className="text-[#c9a86a]">аромат</span></h1>
          <p className="mx-auto mt-5 max-w-md text-[#a89d8d]">Который ищут годами — уже собран у нас. Осталось выбрать объём.</p>
          <button type="button" onClick={go} className="mt-9 inline-flex h-12 items-center rounded-full bg-[#c9a86a] px-7 text-sm font-semibold text-[#211d18] transition-transform hover:-translate-y-0.5">Смотреть каталог</button>
        </Container>
      </div>
    ),
  },
  {
    name: 'Журнальная буквица',
    render: () => (
      <Container className="grid items-center gap-8 py-20 sm:py-28 lg:grid-cols-[220px_1fr]">
        <div aria-hidden="true" className="font-display text-[9rem] leading-[0.8] text-gold sm:text-[15rem]">G</div>
        <div>
          <h1 className="font-display max-w-xl text-3xl leading-[1.12] sm:text-5xl">Гардероб из ароматов — на каждый день и настроение</h1>
          <p className="mt-4 max-w-md text-muted">Утро, офис, свидание, вечер — у каждого момента свой запах.</p>
        </div>
      </Container>
    ),
  },
  {
    name: 'Игривый',
    render: (go) => (
      <Container className="py-24 text-center sm:py-32">
        <h1 className="font-display text-4xl sm:text-6xl">Сначала пробник — <span className="text-gold">потом любовь</span></h1>
        <p className="mt-5 text-muted sm:text-lg">Влюбляться в аромат лучше постепенно. Начните с пары миллилитров.</p>
        <div className="mt-8"><Cta onClick={go}>Выбрать первый</Cta></div>
      </Container>
    ),
  },
  {
    name: 'Вертикальный ритм',
    render: () => (
      <Container className="py-24 text-center sm:py-32">
        <p className="text-[11px] tracking-[0.4em] text-muted uppercase">Ателье ароматов</p>
        <h1 className="font-display mt-3 text-6xl sm:text-8xl">Get <span className="text-gold">Perfume</span></h1>
        <p className="font-display mt-2 text-xl text-muted italic sm:text-2xl">искусство пахнуть собой</p>
      </Container>
    ),
  },
  {
    name: 'Ноты вокруг',
    render: () => (
      <Container className="relative py-28 text-center sm:py-36">
        {[
          ['ваниль', 'top-10 left-[12%]'], ['бергамот', 'top-20 right-[14%]'], ['сандал', 'bottom-14 left-[20%]'],
          ['жасмин', 'bottom-24 right-[22%]'], ['уд', 'top-1/2 left-[4%]'], ['амбра', 'top-[46%] right-[5%]'],
        ].map(([n, pos]) => (
          <span key={n} aria-hidden="true" className={`font-display absolute hidden text-xl text-gold/75 italic lg:block ${pos}`}>{n}</span>
        ))}
        <h1 className="font-display relative text-4xl sm:text-6xl">Всё начинается с ноты</h1>
      </Container>
    ),
  },
  {
    name: 'Люкс-рамка',
    render: () => (
      <Container className="py-16 sm:py-20">
        <div className="border border-gold px-5 py-14 text-center outline outline-offset-6 outline-gold sm:px-10 sm:py-16">
          <p aria-hidden="true" className="mb-4 text-xs tracking-[0.5em] text-gold">✦ ❖ ✦</p>
          <h1 className="font-display text-4xl tracking-wide sm:text-6xl">Искусство аромата</h1>
          <p className="mt-4 text-muted">Коллекция звучаний — от классики до нишевых редкостей</p>
        </div>
      </Container>
    ),
  },
  {
    name: 'Два CTA',
    render: (go) => (
      <Container className="py-24 sm:py-32">
        <h1 className="font-display max-w-2xl text-5xl leading-[1.04] sm:text-7xl">Аромат под настроение — на каждый день</h1>
        <p className="mt-6 max-w-md text-muted">Выбирайте из каталога или доверьтесь нам — подберём по описанию.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Cta onClick={go}>Смотреть каталог</Cta>
          <WhatsAppButton label="Подобрать в WhatsApp" text="Здравствуйте! Помогите подобрать аромат." />
        </div>
      </Container>
    ),
  },
];
