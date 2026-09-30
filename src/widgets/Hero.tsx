import { useCallback } from 'react';
import { Container } from '@/shared/ui/Container';
import { WhatsAppButton } from '@/shared/ui/WhatsAppButton';

export function Hero() {
  const goCatalog = useCallback(() => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <section id="top" className="relative">
      <Container className="py-24 sm:py-32">
        <h1 className="font-display max-w-2xl text-5xl leading-[1.04] text-fg sm:text-7xl">
          Ароматы по мотивам <span className="text-gold">известных брендов</span>
        </h1>
        <div className="mt-9 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={goCatalog}
            className="inline-flex h-12 items-center rounded-full bg-gold px-7 text-sm font-semibold text-on-accent transition-transform hover:-translate-y-0.5"
          >
            Смотреть каталог
          </button>
          <WhatsAppButton label="Подобрать в WhatsApp" text="Здравствуйте! Помогите подобрать аромат." />
        </div>
      </Container>
    </section>
  );
}
