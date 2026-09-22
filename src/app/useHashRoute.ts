import { useCallback, useEffect, useState } from 'react';
import { catalog, fragranceByPath, fragrancePath, isBrandId } from '@/entities/fragrance';

export type Route = { type: 'home' } | { type: 'brand'; id: string } | { type: 'fragrance'; id: string };

function canonicalHash(route: Route): string {
  if (route.type === 'brand') return `#/${route.id}`;
  if (route.type === 'fragrance') {
    const path = fragrancePath(route.id);
    return path ? `#/${path}` : '';
  }
  return '';
}

function parseHash(hash: string): Route {
  const h = hash.replace(/^#\/?/, '');
  if (!h) return { type: 'home' };

  // Legacy formats — resolved so old shared links keep working.
  const legacyFragrance = h.match(/^f\/(.+)$/)?.[1] ?? new URLSearchParams(h).get('f');
  if (legacyFragrance) {
    const id = decodeURIComponent(legacyFragrance);
    return catalog.fragrances.some((f) => f.id === id) ? { type: 'fragrance', id } : { type: 'home' };
  }
  const legacyBrand = h.match(/^b\/(.+)$/);
  if (legacyBrand) return { type: 'brand', id: decodeURIComponent(legacyBrand[1]!) };

  const path = decodeURIComponent(h).replace(/\/+$/, '');
  const fragrance = fragranceByPath(path);
  if (fragrance) return { type: 'fragrance', id: fragrance.id };
  if (isBrandId(path)) return { type: 'brand', id: path };
  return { type: 'home' };
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
    window.location.hash = canonicalHash(to);
  }, []);

  return { route, navigate };
}
