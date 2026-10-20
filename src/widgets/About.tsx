import { Container } from '@/shared/ui/Container';
import { WhatsAppButton, WHATSAPP_PHONE_DISPLAY, whatsAppLink } from '@/shared/ui/WhatsAppButton';

const POINTS = [
  { title: 'Цена за миллилитр', text: 'Заказывайте ровно столько, сколько нужно — от пробника до полного флакона.' },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-28 border-t md:scroll-mt-16 border-line/60 bg-surface">
      <Container className="py-14 sm:py-20">
        <h2 className="font-display text-3xl text-fg sm:text-4xl">О GerParfume</h2>
        <div className="mt-8 grid max-w-xl gap-8 sm:mt-10">
          {POINTS.map((p) => (
            <article key={p.title}>
              <h3 className="text-base font-semibold text-gold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <WhatsAppButton label="Для оформления заказа пишите в WhatsApp" text="Здравствуйте! Хочу оформить заказ." />
          <a href={whatsAppLink()} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm font-semibold text-fg underline-offset-4 hover:text-gold hover:underline">{WHATSAPP_PHONE_DISPLAY}</a>
        </div>
        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted">
          Фотографии флаконов и описания в карточках относятся к оригинальным ароматам и приведены для удобства выбора.
          Наши композиции созданы по их мотивам и поставляются в собственной таре — восприятие отдельных нот может немного отличаться.
        </p>
      </Container>
    </section>
  );
}
