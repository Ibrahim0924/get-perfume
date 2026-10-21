import { useCallback, useEffect, useState } from 'react';
import { catalog, fragranceByPath, fragrancePath, isBrandId } from '@/entities/fragrance';

/** `missing` carries a hash that matched nothing, so the UI can say so instead of silently showing the home page. */
export type Route =
  | { type: 'home'; missing?: string }
  | { type: 'brand'; id: string }
  | { type: 'fragrance'; id: string }
  | { type: 'selection' };

/** Path of the "Подборка" page (pick fragrances, download their photos). */
const SELECTION_PATH = 'podborka';

function canonicalHash(route: Route): string {
  if (route.type === 'selection') return `#/${SELECTION_PATH}`;
  if (route.type === 'brand') return `#/${route.id}`;
  if (route.type === 'fragrance') {
    const path = fragrancePath(route.id);
    return path ? `#/${path}` : '';
  }
  return '';
}

const SECTION_IDS = new Set(['top', 'catalog', 'about', 'delivery', 'contacts']);

function parseHash(hash: string): Route {
  const h = hash.replace(/^#\/?/, '');
  if (!h) return { type: 'home' };

  // Legacy formats — resolved so old shared links keep working.
  const legacyFragrance = h.match(/^f\/(.+)$/)?.[1] ?? new URLSearchParams(h).get('f');
  if (legacyFragrance) {
    const id = decodeURIComponent(legacyFragrance);
    return catalog.fragrances.some((f) => f.id === id) ? { type: 'fragrance', id } : { type: 'home', missing: id };
  }
  const legacyBrand = h.match(/^b\/(.+)$/);
  if (legacyBrand) return { type: 'brand', id: decodeURIComponent(legacyBrand[1]!) };

  const path = decodeURIComponent(h).replace(/\/+$/, '');
  if (SECTION_IDS.has(path)) return { type: 'home' }; // plain in-page anchors like #catalog
  if (path === SELECTION_PATH) return { type: 'selection' };
  const fragrance = fragranceByPath(path);
  if (fragrance) return { type: 'fragrance', id: fragrance.id };
  if (isBrandId(path)) return { type: 'brand', id: path };
  return { type: 'home', missing: path };
}

export function useHashRoute() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  // Quietly rewrite legacy hashes to the canonical short form.
  useEffect(() => {
    const canonical = canonicalHash(route);
    const current = window.location.hash;
    if (canonical && current !== canonical) history.replaceState(null, '', canonical);
    if (!canonical && route.type === 'home' && current && current !== '#') history.replaceState(null, '', window.location.pathname + window.location.search);
  }, [route]);

  const navigate = useCallback((to: Route) => {
    const hash = canonicalHash(to);
    if (hash) {
      window.location.hash = hash;
      return;
    }
    // An empty hash would make the browser jump to the top of the page; scrolling is ours to decide.
    if (!window.location.hash) return;
    history.pushState(null, '', window.location.pathname + window.location.search);
    setRoute(parseHash(''));
  }, []);

  return { route, navigate };
}
