// A round picture for a person: their Google photo, or their first initial
// when there is no photo (or it does not load), or a plain figure for guests.

import { el } from '../lib/dom.js';

export function avatar({ name = '', photo = '' } = {}, size = 'md') {
  const initial = name.trim().charAt(0).toUpperCase();
  const fallback = el('span', {
    class: `avatar avatar-${size}${initial ? '' : ' avatar-guest'}`,
    'aria-hidden': 'true',
    text: initial || '\u{1F464}',
  });

  if (!photo) return fallback;

  const img = el('img', {
    class: `avatar avatar-${size}`,
    src: photo,
    alt: '',
    // Google's photo links refuse some requests that say where they came from.
    referrerpolicy: 'no-referrer',
  });
  img.addEventListener('error', () => img.replaceWith(fallback));
  return img;
}

// "Maria" from "Maria Papadopoulou".
export function firstName(name = '') {
  return name.trim().split(/\s+/)[0] || '';
}
