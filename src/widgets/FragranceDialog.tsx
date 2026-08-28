import { useEffect, useRef } from 'react';
import { GENDER_LABEL, getDetails, tAccord, tLevel, tLongevity, tNote, tOil, tRanked, type Fragrance, type Note } from '@/entities/fragrance';
import { formatPrice } from '@/shared/lib/format';
import { FragranceImage } from '@/shared/ui/FragranceImage';

const STRENGTH_WIDTH: Record<string, string> = { Dominant: '100%', Prominent: '80%', Moderate: '55%', Subtle: '30%' };

export function FragranceDialog({ fragrance, onClose }: { fragrance: Fragrance | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (fragrance && !el.open) el.showModal();
    if (!fragrance && el.open) el.close();
  }, [fragrance]);

  const d = fragrance ? getDetails(fragrance.id) : undefined;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto w-[min(100vw-1.5rem,56rem)] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-3xl border border-line bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      {fragrance && (
        <article className="grid gap-8 p-6 sm:p-8 md:grid-cols-[18rem_1fr]">
          <button type="button" onClick={onClose} aria-label="Закрыть" className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border border-line text-muted hover:border-gold hover:text-gold">✕</button>

          <figure className="flex flex-col gap-3">
            <div className="photo-frame flex aspect-[4/5] items-center justify-center rounded-2xl border border-line p-4">
              <FragranceImage src={d?.imageTransparent ?? null} fallbackSrc={d?.image ?? null} alt={fragrance.name} className="max-h-full max-w-full" />
            </div>
            <figcaption className="flex items-start gap-2 text-[11px] leading-snug text-muted">
              <span aria-hidden="true" className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-current text-[9px] font-bold">i</span>
              Изображение приведено для наглядности — оригинальный флакон. Аромат по мотивам поставляется в нашей таре и может отличаться внешне.
            </figcaption>
          </figure>

          <div className="min-w-0">
            <p className="text-xs tracking-[0.2em] text-muted uppercase">{fragrance.brand}</p>
            <h2 className="font-display mt-1 text-4xl leading-tight text-fg">{fragrance.name}</h2>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="font-display text-3xl text-gold">{formatPrice(fragrance.pricePerMl)}<span className="ml-1 text-sm text-muted">/ мл</span></span>
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">{GENDER_LABEL[fragrance.gender]}</span>
            </div>

            {d ? (
              <>
                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                  <Meta label="Оригинал" value={`${d.brand} — ${d.name}`} wide />
                  <Meta label="Год" value={d.year} />
                  <Meta label="Тип" value={tOil(d.oilType)} />
                  <Meta label="Стойкость" value={tLongevity(d.longevity)} />
                  <Meta label="Шлейф" value={tLevel(d.sillage)} />
                  <Meta label="Рейтинг" value={d.rating ? `${d.rating.toFixed(2)} / 5` : null} />
                </dl>

                {d.accords.length > 0 && (
                  <section className="mt-7">
                    <h3 className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Аккорды</h3>
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
                  <section className="mt-7">
                    <h3 className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Пирамида нот</h3>
                    <NoteTier title="Верхние" notes={d.notes.top} />
                    <NoteTier title="Сердце" notes={d.notes.middle} />
                    <NoteTier title="База" notes={d.notes.base} />
                  </section>
                ) : d.generalNotes.length > 0 && (
                  <section className="mt-7">
                    <h3 className="mb-3 text-xs font-semibold tracking-[0.2em] text-muted uppercase">Ноты</h3>
                    <p className="text-sm">{d.generalNotes.map(tNote).join(', ')}</p>
                  </section>
                )}

                {(d.seasons.length > 0 || d.occasions.length > 0) && (
                  <section className="mt-7 flex flex-wrap gap-2 text-xs">
                    {[...d.seasons, ...d.occasions].filter((r) => r.score >= 1).map((r) => (
                      <span key={r.name} className="rounded-full border border-line px-3 py-1 text-muted capitalize">{tRanked(r.name)}</span>
                    ))}
                  </section>
                )}
                <p className="mt-7 border-t border-line/60 pt-4 text-[11px] leading-relaxed text-muted">
                  Характеристики, ноты и аккорды приведены по оригинальной композиции как ориентир. Наш аромат создан по её мотивам —
                  отдельные оттенки звучания, стойкость и шлейф могут немного отличаться в зависимости от кожи и условий.
                </p>
              </>
            ) : (
              <p className="mt-6 text-sm text-muted">Подробное описание для этого аромата пока не добавлено.</p>
            )}
          </div>
        </article>
      )}
    </dialog>
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
