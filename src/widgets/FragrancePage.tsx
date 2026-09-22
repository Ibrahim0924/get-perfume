import { useEffect } from 'react';
import {
  catalog, GENDER_LABEL, getDetails, tAccord, tLevel, tLongevity, tNote, tOil, tRanked,
  type Fragrance, type Note,
} from '@/entities/fragrance';
import { findSimilar } from '@/features/similar';
import { formatPrice } from '@/shared/lib/format';
import { cn } from '@/shared/lib/cn';
import { Container } from '@/shared/ui/Container';
import { WhatsAppButton, WHATSAPP_PHONE_DISPLAY } from '@/shared/ui/WhatsAppButton';
import { FragranceImage } from '@/shared/ui/FragranceImage';

const STRENGTH_WIDTH: Record<string, string> = { Dominant: '100%', Prominent: '80%', Moderate: '55%', Subtle: '30%' };
const GENDER_TONE: Record<Fragrance['gender'], string> = {
  female: 'bg-rose/15 text-rose',
  male: 'bg-sky/15 text-sky',
  unisex: 'bg-gold/15 text-gold',
};

export function FragrancePage({ id, onBack, onOpen }: { id: string; onBack: () => void; onOpen: (f: Fragrance) => void }) {
  const fragrance = catalog.fragrances.find((f) => f.id === id) ?? null;
  const d = fragrance ? getDetails(fragrance.id) : undefined;
  const similar = fragrance ? findSimilar(fragrance) : [];

  useEffect(() => {
    document.title = fragrance ? `${fragrance.name} — ${fragrance.brand} · Get Perfume` : 'Get Perfume';
    return () => { document.title = 'Get Perfume — Ароматы по мотивам известных брендов'; };
  }, [fragrance]);

  if (!fragrance) {
    return (
      <Container className="py-24 text-center">
        <p className="font-display text-3xl">Аромат не найден</p>
        <button type="button" onClick={onBack} className="mt-6 h-11 rounded-full border border-gold px-6 text-sm font-semibold text-gold hover:bg-gold hover:text-on-accent">← В каталог</button>
      </Container>
    );
  }

  return (
    <Container className="pt-6 pb-20 sm:pt-8">
      <nav className="mb-6 text-sm text-muted" aria-label="Хлебные крошки">
        <button type="button" onClick={onBack} className="transition-colors hover:text-gold">← Каталог</button>
        <span className="mx-2" aria-hidden="true">/</span>
        <span className="text-fg">{fragrance.brand}</span>
      </nav>

      <article className="grid gap-10 lg:grid-cols-[22rem_1fr]">
        <figure className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
          <div className="photo-frame flex aspect-[4/5] items-center justify-center rounded-3xl border border-line p-6">
            <FragranceImage src={d?.imageTransparent ?? null} fallbackSrc={d?.image ?? null} alt={fragrance.name} className="max-h-full max-w-full" />
          </div>
          <figcaption className="flex items-start gap-2 text-[11px] leading-snug text-muted">
            <span aria-hidden="true" className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-current text-[9px] font-bold">i</span>
            Изображение приведено для наглядности — оригинальный флакон. Аромат по мотивам поставляется в нашей таре и может отличаться внешне.
          </figcaption>
        </figure>

        <div className="min-w-0">
          <p className="text-xs tracking-[0.2em] text-muted uppercase">{fragrance.brand}</p>
          <h1 className="font-display mt-1 text-4xl leading-tight sm:text-5xl">{fragrance.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="font-display text-3xl text-gold">{formatPrice(fragrance.pricePerMl)}<span className="ml-1 text-sm text-muted">/ мл</span></span>
            <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', GENDER_TONE[fragrance.gender])}>{GENDER_LABEL[fragrance.gender]}</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-line/70 bg-surface px-5 py-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">Для оформления заказа пишите нам</p>
              <p className="text-xs text-muted">WhatsApp · {WHATSAPP_PHONE_DISPLAY}</p>
            </div>
            <WhatsAppButton
              className="ml-auto"
              label="Заказать в WhatsApp"
              text={`Здравствуйте! Хочу заказать аромат ${fragrance.brand} — ${fragrance.name} (${fragrance.pricePerMl} ₽/мл).`}
            />
          </div>

          {d ? (
            <>
              <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                <Meta label="Оригинал" value={`${d.brand} — ${d.name}`} wide />
                <Meta label="Год" value={d.year} />
                <Meta label="Тип" value={tOil(d.oilType)} />
                <Meta label="Стойкость" value={tLongevity(d.longevity)} />
                <Meta label="Шлейф" value={tLevel(d.sillage)} />
                <Meta label="Рейтинг" value={d.rating ? `${d.rating.toFixed(2)} / 5` : null} />
              </dl>

              {d.accords.length > 0 && (
                <section className="mt-8">
                  <h2 className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Аккорды</h2>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {d.accords.slice(0, 8).map((a) => (
                      <li key={a.name} className="text-sm">
                        <div className="flex justify-between"><span className="capitalize">{tAccord(a.name)}</span><span className="text-muted">{tLevel(a.strength)}</span></div>
                        <div className="mt-1 h-1.5 rounded-full bg-line"><div className="h-full rounded-full bg-gold" style={{ width: STRENGTH_WIDTH[a.strength ?? ''] ?? '40%' }} /></div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {(d.notes.top.length || d.notes.middle.length || d.notes.base.length) > 0 ? (
                <section className="mt-8">
                  <h2 className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Пирамида нот</h2>
                  <NoteTier title="Верхние" notes={d.notes.top} />
                  <NoteTier title="Сердце" notes={d.notes.middle} />
                  <NoteTier title="База" notes={d.notes.base} />
                </section>
              ) : d.generalNotes.length > 0 && (
                <section className="mt-8">
                  <h2 className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Ноты</h2>
                  <p className="text-sm">{d.generalNotes.map(tNote).join(', ')}</p>
                </section>
              )}

              {(d.seasons.length > 0 || d.occasions.length > 0) && (
                <section className="mt-8 flex flex-wrap gap-2 text-xs">
                  {[...d.seasons, ...d.occasions].filter((r) => r.score >= 1).map((r) => (
                    <span key={r.name} className="rounded-full border border-line px-3 py-1 text-muted capitalize">{tRanked(r.name)}</span>
                  ))}
                </section>
              )}

              <p className="mt-8 border-t border-line/60 pt-4 text-[11px] leading-relaxed text-muted">
                Характеристики, ноты и аккорды приведены по оригинальной композиции как ориентир. Наш аромат создан по её мотивам —
                отдельные оттенки звучания, стойкость и шлейф могут немного отличаться в зависимости от кожи и условий.
              </p>
            </>
          ) : (
            <p className="mt-7 text-sm text-muted">Подробное описание для этого аромата пока не добавлено — уточните детали при заказе.</p>
          )}
        </div>
      </article>

      {similar.length > 0 && (
        <section className="mt-16 border-t border-line/60 pt-10" aria-label="Похожие ароматы">
          <h2 className="font-display text-3xl sm:text-4xl">Похожие ароматы</h2>
          <p className="mt-2 text-sm text-muted">Подобраны по общим аккордам и нотам композиции.</p>
          <ul className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {similar.map((s) => (
              <li key={s.fragrance.id}>
                <button
                  type="button"
                  onClick={() => onOpen(s.fragrance)}
                  className="group flex w-full flex-col rounded-2xl border border-line/70 bg-surface p-3 text-left transition-all hover:-translate-y-0.5 hover:border-gold/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <SimilarThumb id={s.fragrance.id} name={s.fragrance.name} />
                  <span className="mt-3 block text-[10px] tracking-[0.15em] text-muted uppercase">{s.fragrance.brand}</span>
                  <span className="mt-0.5 line-clamp-2 text-sm leading-snug font-medium group-hover:text-gold">{s.fragrance.name}</span>
                  <span className="mt-1.5 line-clamp-1 text-[11px] text-muted">{s.sharedAccords.slice(0, 3).map(tAccord).join(' · ')}</span>
                  <span className="mt-2 font-display text-lg">{formatPrice(s.fragrance.pricePerMl)}<span className="ml-1 text-[10px] text-muted">/мл</span></span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}

function SimilarThumb({ id, name }: { id: string; name: string }) {
  const d = getDetails(id);
  return (
    <span className="photo-frame flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-line/70 p-2">
      <FragranceImage src={d?.imageTransparent ?? null} fallbackSrc={d?.image ?? null} alt={name} className="max-h-full max-w-full" />
    </span>
  );
}

function Meta({ label, value, wide = false }: { label: string; value: string | null; wide?: boolean }) {
  if (!value) return null;
  return (
    <div className={wide ? 'col-span-full min-w-0' : 'min-w-0'}>
      <dt className="text-[11px] tracking-[0.15em] text-muted uppercase">{label}</dt>
      <dd className="truncate font-medium" title={value}>{value}</dd>
    </div>
  );
}

function NoteTier({ title, notes }: { title: string; notes: Note[] }) {
  if (notes.length === 0) return null;
  return (
    <div className="mb-3 flex gap-4">
      <span className="w-16 shrink-0 pt-1.5 text-xs text-muted">{title}</span>
      <ul className="flex flex-wrap gap-2">
        {notes.map((n) => (
          <li key={n.name} className="flex items-center gap-1.5 rounded-full border border-line bg-bg py-1 pr-3 pl-1 text-xs">
            {n.image ? <img src={n.image} alt="" loading="lazy" referrerPolicy="no-referrer" className="size-5 rounded-full object-cover" /> : <span className="size-5 rounded-full bg-gold/30" />}
            {tNote(n.name)}
          </li>
        ))}
      </ul>
    </div>
  );
}
