// Copies the site's icons into the app's public folder, so the manifest and
// the install prompt use the same logo as the website. Run by `npm run assets`.
//
// Never edit the files in public/icons/ by hand: they are overwritten on every
// build. Replace the originals in ../images/ instead.

import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const siteImages = join(here, '..', '..', 'images');
const target = join(here, '..', 'public', 'icons');

const icons = {
  'android-chrome-192x192.png': 'icon-192.png',
  'android-chrome-512x512.png': 'icon-512.png',
  'apple-touch-icon.png': 'icon-180.png',
  'favicon-32x32.png': 'icon-32.png',
};

mkdirSync(target, { recursive: true });

for (const [from, to] of Object.entries(icons)) {
  copyFileSync(join(siteImages, from), join(target, to));
}

console.log(`Copied ${Object.keys(icons).length} icons from the website.`);
