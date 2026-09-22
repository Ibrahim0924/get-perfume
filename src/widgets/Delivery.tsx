import { Container } from '@/shared/ui/Container';

const OPTIONS = [
  { title: 'Самовывоз', text: 'Заберите заказ лично — адрес и удобное время согласуем в WhatsApp.' },
  { title: 'Доставка по городу', text: 'Привезём в день заказа или на следующий день. Стоимость зависит от района — уточним при оформлении.' },
  { title: 'Отправка по России', text: 'Отправляем СДЭК или Почтой России. Обычно посылка идёт 3–10 дней, доставка — по тарифу перевозчика.' },
  { title: 'Оплата', text: 'Переводом или при получении — как вам удобнее. Подтверждаем заказ и сумму в переписке до отправки.' },
];

export function Delivery() {
  return (
    <section id="delivery" className="scroll-mt-16 border-t border-line/60">
      <Container className="py-14 sm:py-20">
        <h2 className="font-display text-3xl text-fg sm:text-4xl">Доставка и оплата</h2>
        <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {OPTIONS.map((o) => (
            <article key={o.title} className="rounded-2xl border border-line/70 bg-surface p-5">
              <h3 className="text-base font-semibold text-gold">{o.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{o.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted">Каждый аромат разливается под заказ и упаковывается так, чтобы флакон доехал в целости.</p>
      </Container>
    </section>
  );
}
