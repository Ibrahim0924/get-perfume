import { useCallback, useEffect, useState } from 'react';

export type Route = { type: 'home' } | { type: 'fragrance'; id: string };

function parseHash(hash: string): Route {
  const h = hash.replace(/^#/, '');
  const page = h.match(/^\/f\/(.+)$/);
  if (page) return { type: 'fragrance', id: decodeURIComponent(page[1]!) };
  // Legacy deep links from the dialog era: #f=<id>
  const legacy = new URLSearchParams(h).get('f');
  if (legacy) return { type: 'fragrance', id: legacy };
  return { type: 'home' };
}

export function useHashRoute() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to: Route) => {
    window.location.hash = to.type === 'fragrance' ? `/f/${encodeURIComponent(to.id)}` : '';
  }, []);

  return { route, navigate };
}
