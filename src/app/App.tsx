import { About } from '@/widgets/About';
import { CatalogSection } from '@/widgets/CatalogSection';
import { Footer } from '@/widgets/Footer';
import { Header } from '@/widgets/Header';
import { Hero } from '@/widgets/Hero';

export function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CatalogSection />
        <About />
      </main>
      <Footer />
    </>
  );
}
