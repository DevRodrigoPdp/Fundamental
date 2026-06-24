// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  site: env.PUBLIC_SITE_URL || 'https://fundamentalbikeparts.com',
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
