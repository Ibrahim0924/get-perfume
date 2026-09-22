import { catalog } from '@/entities/fragrance';
import { formatDate } from '@/shared/lib/format';
import { Container } from '@/shared/ui/Container';

export function Footer() {
  return (
    <footer className="border-t border-line/60">
      <Container className="flex flex-col gap-2 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Get Perfume</p>
        <p>Прайс-лист актуален на {formatDate(catalog.priceDate)}. Цены указаны в рублях за 1 мл.</p>
      </Container>
    </footer>
  );
}
