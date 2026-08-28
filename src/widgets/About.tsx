import { Container } from '@/shared/ui/Container';

const POINTS = [
  { title: 'Цена за миллилитр', text: 'Заказывайте ровно столько, сколько нужно — от пробника до полного флакона.' },
  { title: 'По мотивам оригиналов', text: 'Ароматы воссоздают звучание известных композиций и раскрываются так же — от верхних нот до шлейфа.' },
  { title: 'Три ценовых уровня', text: 'Прозрачная стоимость: 100, 150 или 200 ₽ за мл, без скрытых наценок.' },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-16 border-t border-line/60 bg-surface">
      <Container className="py-14 sm:py-20">
        <h2 className="font-display text-3xl text-fg sm:text-4xl">О Misk World</h2>
        <div className="mt-8 grid gap-8 sm:mt-10 md:grid-cols-3">
          {POINTS.map((p) => (
            <article key={p.title}>
              <h3 className="text-base font-semibold text-gold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
