// Copies the website's stylesheets into the app source, so the app can be
// served offline without reaching back up into the site. Run by `npm run css`,
// which both `npm run dev` and `npm run build` call first.
//
// Never edit the files in src/styles/site/ by hand: they are overwritten on
// every build. Edit the originals in ../css/ and rebuild.

import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const siteCss = join(here, '..', '..', 'css');
const target = join(here, '..', 'src', 'styles', 'site');

// The order matters: base sets the custom properties everything else reads.
const sheets = [
  'base.css',
  'levels.css',
  'activities.css',
  'drop-down.css',
  'word-gap-fill.css',
  'spelling-scramble.css',
];

mkdirSync(target, { recursive: true });

for (const sheet of sheets) {
  copyFileSync(join(siteCss, sheet), join(target, sheet));
}

const banner = '/* Copied from ../../../css by tools/copy-site-css.js. Do not edit. */\n';
const imports = sheets.map((s) => `@import './site/${s}';`).join('\n');
writeFileSync(join(here, '..', 'src', 'styles', 'site.css'), banner + imports + '\n');

console.log(`Copied ${sheets.length} stylesheets from the website.`);
