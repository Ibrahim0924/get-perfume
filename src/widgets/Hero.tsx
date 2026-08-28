import { catalog } from '@/entities/fragrance';
import { formatDate, plural } from '@/shared/lib/format';
import { Container } from '@/shared/ui/Container';

export function Hero() {
  const total = catalog.fragrances.length;
  const brands = catalog.brands.length;
  const minPrice = catalog.prices[0] ?? 0;

  return (
    <section id="top" className="relative overflow-hidden">
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />
      <Container className="relative py-14 sm:py-24 lg:py-36">
        <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-gold uppercase">
          Прайс-лист · {formatDate(catalog.priceDate)}
        </p>
        <h1 className="font-display max-w-3xl text-4xl leading-[1.08] text-fg sm:text-6xl lg:text-7xl">
          Ароматы по мотивам <em className="text-gold not-italic">известных брендов</em>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {total} {plural(total, ['аромат', 'аромата', 'ароматов'])} от {brands}{' '}
          {plural(brands, ['бренда', 'брендов', 'брендов'])}. Разлив на любой объём — цена указана за один миллилитр.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#catalog"
            className="inline-flex h-12 items-center rounded-full bg-gold px-7 text-sm font-semibold text-on-accent transition-transform hover:-translate-y-0.5"
          >
            Смотреть каталог
          </a>
          <span className="text-sm text-muted">от {minPrice} ₽ за мл</span>
        </div>

        <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-line/60 pt-6 sm:mt-16 sm:gap-6 sm:pt-8">
          <Stat value={String(brands)} label="брендов" />
          <Stat value={String(total)} label="ароматов" />
          <Stat value="3" label="ценовых уровня" />
        </dl>
      </Container>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="order-2 text-xs tracking-[0.2em] text-muted uppercase">{label}</dt>
      <dd className="font-display text-3xl text-fg sm:text-4xl">{value}</dd>
    </div>
  );
}
