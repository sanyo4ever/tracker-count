import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'site-metadata',
      transformIndexHtml(html) {
        const configuredUrl = process.env.VITE_SITE_URL || 'https://sanyo4ever.github.io/tracker-count/';
        const url = new URL(configuredUrl.replace(/\/*$/, '/'));
        // Pages can report HTTP while a new domain's certificate is provisioning.
        url.protocol = 'https:';
        return html.replaceAll('__SITE_URL__', url.href);
      },
    },
  ],
  base: process.env.VITE_BASE_PATH || '/tracker-count/',
  build: { target: 'es2022' },
});
