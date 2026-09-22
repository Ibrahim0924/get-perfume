import { useCallback, useEffect, useRef } from 'react';
import type { Fragrance } from '@/entities/fragrance';
import { About } from '@/widgets/About';
import { Contacts } from '@/widgets/Contacts';
import { Delivery } from '@/widgets/Delivery';
import { CatalogSection } from '@/widgets/CatalogSection';
import { Footer } from '@/widgets/Footer';
import { FragrancePage } from '@/widgets/FragrancePage';
import { Header } from '@/widgets/Header';
import { Hero } from '@/widgets/Hero';
import { useHashRoute } from './useHashRoute';

export function App() {
  const { route, navigate } = useHashRoute();
  const savedScroll = useRef(0);
  const onFragrancePage = route.type === 'fragrance';

  // The catalog stays mounted (hidden) behind the fragrance page so filters and
  // scroll position survive navigation; scroll is saved/restored manually.
  useEffect(() => {
    if (onFragrancePage) window.scrollTo(0, 0);
    else window.scrollTo(0, savedScroll.current);
  }, [onFragrancePage, route]);

  const openFragrance = useCallback(
    (f: Fragrance) => {
      if (!onFragrancePage) savedScroll.current = window.scrollY;
      navigate({ type: 'fragrance', id: f.id });
    },
    [navigate, onFragrancePage],
  );
  const goHome = useCallback(() => navigate({ type: 'home' }), [navigate]);
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
        <Hero />
        <CatalogSection onOpen={openFragrance} brandId={route.type === 'brand' ? route.id : null} onSelectBrand={selectBrand} />
        <About />
        <Delivery />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
