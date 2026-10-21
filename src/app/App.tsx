import { useCallback, useEffect, useRef, useState } from 'react';
import { catalog, type Fragrance } from '@/entities/fragrance';
import { About } from '@/widgets/About';
import { Contacts } from '@/widgets/Contacts';
import { Delivery } from '@/widgets/Delivery';
import { CatalogSection } from '@/widgets/CatalogSection';
import { Footer } from '@/widgets/Footer';
import { FragrancePage } from '@/widgets/FragrancePage';
import { Header } from '@/widgets/Header';
import { Hero } from '@/widgets/Hero';
import { BackToTop } from '@/shared/ui/BackToTop';
import { useHashRoute } from './useHashRoute';

const DEFAULT_TITLE = 'GerParfume — Ароматы по мотивам известных брендов';

export function App() {
  const { route, navigate } = useHashRoute();
  const savedScroll = useRef(0);
  // A hash that matched nothing (old or mistyped link): say so once instead of silently showing the home page.
  const [missingLink, setMissingLink] = useState<string | null>(null);
  useEffect(() => {
    if (route.type === 'home' && route.missing) setMissingLink(route.missing);
  }, [route]);
  const landOnCatalog = useRef(false);
  const onFragrancePage = route.type === 'fragrance';

  // The catalog stays mounted (hidden) behind the fragrance page so filters and
  // scroll position survive navigation; scroll is saved/restored manually.
  // Page changes jump instantly, app-style: a new page opens at its top, Back lands where you were.
  // Brand changes inside the catalog leave scrolling to CatalogSection.
  const prevRoute = useRef(route);
  useEffect(() => {
    const prev = prevRoute.current;
    prevRoute.current = route;
    if (prev === route) return;
    if (onFragrancePage) window.scrollTo({ top: 0, behavior: 'instant' });
    else if (prev.type !== 'fragrance') return;
    else if (landOnCatalog.current) {
      landOnCatalog.current = false;
      document.getElementById('catalog')?.scrollIntoView({ block: 'start', behavior: 'instant' });
    } else window.scrollTo({ top: savedScroll.current, behavior: 'instant' });
  }, [onFragrancePage, route]);

  // Tab title follows the route so history and open tabs are tellable apart (fragrance pages set their own).
  useEffect(() => {
    if (route.type === 'fragrance') return;
    const brand = route.type === 'brand' ? catalog.brands.find((b) => b.id === route.id) : null;
    document.title = brand ? `${brand.name} — ароматы по мотивам · GerParfume` : DEFAULT_TITLE;
  }, [route]);

  const openFragrance = useCallback(
    (f: Fragrance) => {
      if (!onFragrancePage) savedScroll.current = window.scrollY;
      navigate({ type: 'fragrance', id: f.id });
    },
    [navigate, onFragrancePage],
  );
  // "← Каталог" from a fragrance opened by direct link has no saved position: land on the catalog, not the hero.
  const goHome = useCallback(() => {
    landOnCatalog.current = savedScroll.current === 0;
    navigate({ type: 'home' });
  }, [navigate]);
  const goSection = useCallback(
    (sectionId?: string) => {
      savedScroll.current = 0;
      navigate({ type: 'home' });
      requestAnimationFrame(() => {
        if (sectionId) document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
    [navigate],
  );
  const selectBrand = useCallback(
    (brandId: string | null) => navigate(brandId ? { type: 'brand', id: brandId } : { type: 'home' }),
    [navigate],
  );

  return (
    <>
      <Header onNavigate={goSection} />
      {onFragrancePage && (
        <main>
          <FragrancePage id={route.id} onBack={goHome} onOpen={openFragrance} />
        </main>
      )}
      <main hidden={onFragrancePage}>
        {missingLink && (
          <div role="status" className="border-b border-line/60 bg-surface">
            <div className="mx-auto flex max-w-6xl items-start gap-3 px-5 py-3 text-sm sm:px-8">
              <span aria-hidden="true" className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold">!</span>
              <p className="flex-1 text-muted">
                Такой страницы нет — возможно, ссылка устарела. <span className="text-fg">Показываем весь каталог.</span>
              </p>
              <button
                type="button"
                onClick={() => setMissingLink(null)}
                aria-label="Закрыть уведомление"
                className="-my-2 -mr-2 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-gold/15 hover:text-gold"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        )}
        <Hero />
        <CatalogSection onOpen={openFragrance} brandId={route.type === 'brand' ? route.id : null} onSelectBrand={selectBrand} />
        <About />
        <Delivery />
        <Contacts />
      </main>
      <Footer onNavigate={goSection} />
      <BackToTop />
    </>
  );
}
