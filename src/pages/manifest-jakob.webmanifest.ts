import type { APIRoute } from 'astro';
import { buildManifest } from '../lib/profile';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(buildManifest('jakob', import.meta.env.BASE_URL)), {
    headers: { 'Content-Type': 'application/manifest+json' }
  });
