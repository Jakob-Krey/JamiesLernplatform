import type { APIRoute } from 'astro';

const base = import.meta.env.BASE_URL;
const version = Date.now().toString(36); // neue Version bei jedem Build

/* Service Worker: macht die Seite als App nutzbar (auch offline).
   - Seiten: erst Netz, bei Fehler die gespeicherte Version
   - Dateien der Seite und Pokémon-Bilder: gespeicherte Version sofort, im Hintergrund aktualisieren
   - Firebase/Cloud-Sync und alles andere läuft unverändert über das Netz */
const source = `
const CACHE = 'jamie-${version}';
const BASE = '${base}';
const SHELL = [BASE, BASE + 'lernziele/', BASE + 'mathe/', BASE + 'englisch/', BASE + 'deutsch/', BASE + 'pokemon/', BASE + 'timer/', BASE + 'uebungen/'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('jamie-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isPokemonImage(url) {
  return url.hostname === 'raw.githubusercontent.com' && url.pathname.startsWith('/PokeAPI/');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match(BASE)))
    );
    return;
  }

  if ((url.origin === location.origin && url.pathname.startsWith(BASE)) || isPokemonImage(url)) {
    event.respondWith(
      caches.match(req).then((hit) => {
        const refresh = fetch(req)
          .then((res) => {
            if (res.ok || res.type === 'opaque') {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => hit);
        return hit || refresh;
      })
    );
  }
});
`;

export const GET: APIRoute = () =>
  new Response(source, { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });
