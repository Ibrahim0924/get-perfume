import { ThemeToggle } from '@/features/theme';
import { Container } from '@/shared/ui/Container';
import { Logo } from './Logo';

interface Props {
  /** Navigate to the start screen, optionally scrolling to a section. */
  onNavigate: (sectionId?: string) => void;
}

export function Header({ onNavigate }: Props) {
  const go = (sectionId?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(sectionId);
  };
  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-bg/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between [padding-left:max(1.25rem,env(safe-area-inset-left))] [padding-right:max(1.25rem,env(safe-area-inset-right))]">
        <a href="#" onClick={go()} className="flex items-center gap-3" aria-label="Get Perfume — на главную">
          <Logo className="size-8" />
          <span className="font-display text-2xl leading-none tracking-wide text-fg">
            Get <span className="text-gold">Perfume</span>
          </span>
        </a>
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 text-sm text-muted sm:flex" aria-label="Основная навигация">
            <a className="transition-colors hover:text-fg" href="#catalog" onClick={go('catalog')}>Каталог</a>
            <a className="transition-colors hover:text-fg" href="#about" onClick={go('about')}>О нас</a>
            <a className="transition-colors hover:text-fg" href="#delivery" onClick={go('delivery')}>Доставка</a>
            <a className="transition-colors hover:text-fg" href="#contacts" onClick={go('contacts')}>Контакты</a>
          </nav>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
