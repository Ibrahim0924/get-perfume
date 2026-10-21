import { useSelection } from '@/features/selection';
import { ThemeToggle } from '@/features/theme';
import { cn } from '@/shared/lib/cn';
import { useHideOnScroll } from '@/shared/lib/useHideOnScroll';
import { Container } from '@/shared/ui/Container';
import { Logo } from './Logo';

interface Props {
  /** Navigate to the start screen, optionally scrolling to a section. */
  onNavigate: (sectionId?: string) => void;
  onOpenSelection: () => void;
  selectionOpen: boolean;
}

export function Header({ onNavigate, onOpenSelection, selectionOpen }: Props) {
  const go = (sectionId?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(sectionId);
  };
  // On phones the header slides away while scrolling down and comes back on any scroll up.
  const hidden = useHideOnScroll();
  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b border-line/60 bg-bg/85 backdrop-blur-md transition-transform duration-300 ease-out focus-within:translate-y-0',
        hidden && '-translate-y-full',
      )}
    >
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
          <SelectionButton onClick={onOpenSelection} active={selectionOpen} />
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

/** Opens "Подборка" (tick fragrances, download their photos); the badge counts what is ticked. */
function SelectionButton({ onClick, active }: { onClick: () => void; active: boolean }) {
  const { ids } = useSelection();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      aria-label={ids.size > 0 ? `Подборка, отмечено ${ids.size}` : 'Подборка'}
      title="Подборка: отметить ароматы и скачать фото"
      className={cn(
        'relative inline-flex h-9 items-center justify-center gap-2 rounded-full border transition-colors max-md:w-9 md:px-3.5',
        active ? 'border-gold bg-gold/15 text-gold' : 'border-line text-muted hover:border-gold hover:text-gold',
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
        <path d="m8.5 12.5 2.5 2.5 4.5-5" />
      </svg>
      <span className="text-sm max-md:hidden">Подборка</span>
      {ids.size > 0 && (
        <span aria-hidden="true" className="absolute -top-1.5 -right-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-on-accent">
          {ids.size > 99 ? '99+' : ids.size}
        </span>
      )}
    </button>
  );
}
