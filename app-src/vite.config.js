import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // The app's public path. Get this wrong and the app loads a blank page on
  // the live site while working perfectly in development.
  base: '/app/',

  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '0.1.0'),
  },

  build: {
    outDir: '../app',
    emptyOutDir: true,
    // Firebase comes as one large piece. It only loads for signed-in students.
    chunkSizeWarningLimit: 600,
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
        // Google Fonts: cached so the app keeps the website's fonts offline.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
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
