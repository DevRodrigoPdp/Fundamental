// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  site: env.PUBLIC_SITE_URL || 'https://fundamentalbikeparts.com',
  adapter: vercel(),
  // CSS en línea: una sola hoja (~10 KB comprimida) que así no bloquea el primer pintado con otra petición.
  build: {
    inlineStylesheets: 'always',
  },
  // /t3r se fusionó en la home (URL canónica de la marca).
  redirects: {
    '/t3r': { status: 301, destination: '/' },
  },
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
