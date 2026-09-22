import { useCallback, useEffect, useRef } from 'react';
import type { Fragrance } from '@/entities/fragrance';
import { About } from '@/widgets/About';
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

  return (
    <>
      <Header />
      {onFragrancePage && (
        <main>
          <FragrancePage id={route.id} onBack={goHome} onOpen={openFragrance} />
        </main>
      )}
      <main hidden={onFragrancePage}>
        <Hero />
        <CatalogSection onOpen={openFragrance} />
        <About />
      </main>
      <Footer />
    </>
  );
}
