import type { APIRoute } from 'astro';

const base = import.meta.env.BASE_URL;

export const GET: APIRoute = () => {
  const manifest = {
    name: 'Jamies Lernplattform',
    short_name: 'Jamie lernt',
    description: 'Stundenplan, Lernpfad, Übungen und Pokémon-Sammelalbum für Jamie.',
    lang: 'de',
    start_url: base,
    scope: base,
    display: 'standalone',
    orientation: 'any',
    background_color: '#eef2ff',
    theme_color: '#6366f1',
    icons: [
      { src: `${base}icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `${base}icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: `${base}icons/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };
  return new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/manifest+json' }
  });
};
