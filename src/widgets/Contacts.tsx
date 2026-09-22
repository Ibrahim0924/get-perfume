import { Container } from '@/shared/ui/Container';
import { WhatsAppButton, WHATSAPP_PHONE_DISPLAY, whatsAppLink } from '@/shared/ui/WhatsAppButton';

export function Contacts() {
  return (
    <section id="contacts" className="scroll-mt-16 border-t border-line/60 bg-surface">
      <Container className="py-14 sm:py-20">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-fg sm:text-4xl">Контакты</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              Быстрее всего мы отвечаем в WhatsApp: поможем подобрать аромат под ваш вкус и бюджет, подскажем по объёму и оформим заказ.
            </p>
            <p className="mt-4 text-sm">
              <a href={whatsAppLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-fg underline-offset-4 hover:text-gold hover:underline">
                {WHATSAPP_PHONE_DISPLAY}
              </a>
              <span className="ml-2 text-muted">· отвечаем ежедневно с 9:00 до 21:00</span>
            </p>
          </div>
          <WhatsAppButton label="Написать в WhatsApp" text="Здравствуйте! Помогите подобрать аромат." />
        </div>
      </Container>
    </section>
  );
}
