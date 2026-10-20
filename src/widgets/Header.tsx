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
      {/* Skip link for keyboard users: visible only when focused. */}
      <a
        href="#catalog"
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById('catalog');
          el?.scrollIntoView({ block: 'start' });
          el?.focus({ preventScroll: true });
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:inline-flex focus:h-11 focus:items-center focus:rounded-full focus:bg-gold focus:px-5 focus:text-sm focus:font-semibold focus:text-on-accent focus:outline-2 focus:outline-offset-2 focus:outline-gold"
      >
        Перейти к каталогу
      </a>
      <Container className="flex h-16 items-center justify-between [padding-left:max(1.25rem,env(safe-area-inset-left))] [padding-right:max(1.25rem,env(safe-area-inset-right))]">
        <a href="#" onClick={go()} className="flex items-center gap-3" aria-label="GerParfume — на главную">
          <Logo className="h-10 w-auto" />
          <span className="font-display text-2xl leading-none tracking-wide text-fg">
            Ger<span className="text-gold">Parfume</span>
          </span>
        </a>
        <div className="flex items-center gap-4 md:gap-5">
          <nav className="hidden items-center gap-6 text-sm whitespace-nowrap text-muted md:flex" aria-label="Основная навигация">
            <a className="transition-colors hover:text-fg" href="#catalog" onClick={go('catalog')}>Каталог</a>
            <a className="transition-colors hover:text-fg" href="#about" onClick={go('about')}>О нас</a>
            <a className="transition-colors hover:text-fg" href="#delivery" onClick={go('delivery')}>Доставка</a>
            <a className="transition-colors hover:text-fg" href="#contacts" onClick={go('contacts')}>Контакты</a>
          </nav>
          <ThemeToggle />
        </div>
      </Container>
      <nav
        className="-mb-px flex items-center gap-2 overflow-x-auto border-t border-line/60 px-3 text-sm text-muted [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
        aria-label="Навигация"
      >
        <a className="inline-flex min-h-11 shrink-0 items-center px-2" href="#catalog" onClick={go('catalog')}>Каталог</a>
        <a className="inline-flex min-h-11 shrink-0 items-center px-2" href="#about" onClick={go('about')}>О нас</a>
        <a className="inline-flex min-h-11 shrink-0 items-center px-2" href="#delivery" onClick={go('delivery')}>Доставка</a>
        <a className="inline-flex min-h-11 shrink-0 items-center px-2" href="#contacts" onClick={go('contacts')}>Контакты</a>
      </nav>
    </header>
  );
}
