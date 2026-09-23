import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // The app's public path. Get this wrong and the app loads a blank page on
  // the live site while working perfectly in development.
  base: '/app/',

  build: {
    outDir: '../app',
    emptyOutDir: true,
  },

  plugins: [
    VitePWA({
      // 'prompt', never 'autoUpdate': an auto-updating service worker reloads
      // the page under a student halfway through a round.
      registerType: 'prompt',
      injectRegister: null,

      includeAssets: ['icons/icon-180.png', 'icons/icon-32.png'],

      workbox: {
        globPatterns: ['**/*.{js,css,html,png,woff2}'],
        navigateFallback: 'index.html',
      },

      manifest: {
        name: 'Extra Practice - English in Doses',
        short_name: 'Practice',
        description: 'Extra practice activities for English in Doses.',
        start_url: '/app/',
        scope: '/app/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#1B263B',
        lang: 'en-GB',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
