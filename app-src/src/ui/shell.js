// One top bar and one scrolling body. Every screen goes through renderScreen.

import { el, clear } from '../lib/dom.js';
import { go, currentPath } from '../lib/router.js';
import { savedQuestions } from '../lib/storage.js';

export function renderScreen({ title, subtitle, backTo, body, progress }) {
  const app = clear(document.getElementById('app'));

  const bookmarkCount = savedQuestions().length;

  const bar = el('header', { class: 'app-bar' }, [
    backTo
      ? el('button', {
          class: 'app-bar-button',
          type: 'button',
          'aria-label': 'Go back',
          onClick: () => go(backTo),
        }, '\u2190')
      : el('span', { class: 'app-bar-button app-bar-spacer', 'aria-hidden': 'true' }),

    el('div', { class: 'app-bar-titles' }, [
      el('h1', { class: 'app-bar-title', text: title }),
      subtitle ? el('p', { class: 'app-bar-subtitle', text: subtitle }) : null,
    ]),

    el('button', {
      class: 'app-bar-button',
      type: 'button',
      'aria-label': `My questions, ${bookmarkCount} saved`,
      onClick: () => go('/questions'),
    }, [
      '\u2605',
      bookmarkCount ? el('span', { class: 'app-bar-badge', text: String(bookmarkCount) }) : null,
    ]),
  ]);

  const main = el('main', { class: 'app-main', id: 'screen-body', tabindex: '-1' }, [
    progress ? roundStrip(progress) : null,
    body,
  ]);

  app.append(bar, main);

  // Keyboard users should land on the new screen, not at the top of the page.
  if (currentPath() !== '/') main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function roundStrip({ round, total }) {
  const dots = [];
  for (let i = 1; i <= total; i++) {
    dots.push(el('span', { class: `round-dot${i <= round ? ' is-done' : ''}`, 'aria-hidden': 'true' }));
  }
  return el('div', { class: 'round-strip' }, [
    el('p', { class: 'round-label', text: `Round ${round} of ${total}` }),
    el('div', { class: 'round-dots' }, dots),
  ]);
}
