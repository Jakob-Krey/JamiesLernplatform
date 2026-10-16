import { defineConfig } from 'astro/config';

// https://astro.build/config
// Wenn über GitHub Actions gebaut wird (GITHUB_ACTIONS=true),
// wird der Base-Pfad auf das Repository (/open/) gesetzt.
// Lokal läuft das Projekt einfach auf /.
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: 'https://jakob-krey.github.io',
  base: isGitHubPages ? '/open/' : '/',
  build: {
    assets: '_assets'
  }
});
