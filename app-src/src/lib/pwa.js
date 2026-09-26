// Offline support and the update bar.
//
// The service worker is registered with `prompt`, not `autoUpdate`, so a new
// version never reloads the page under a student mid-round. They get a bar
// with an Update button instead.

import { registerSW } from 'virtual:pwa-register';
import { el } from './dom.js';

export function setupPWA() {
  const updateSW = registerSW({
    onNeedRefresh() {
      showUpdateBar(() => updateSW(true));
    },
  });
}

function showUpdateBar(applyUpdate) {
  if (document.querySelector('.update-bar')) return;

  const bar = el('div', { class: 'update-bar', role: 'status' }, [
    el('span', { class: 'update-bar-text', text: 'A new version is ready.' }),
    el('button', { class: 'btn btn-next', type: 'button', onClick: () => applyUpdate() }, 'Update'),
    el('button', {
      class: 'update-bar-dismiss',
      type: 'button',
      'aria-label': 'Not now',
      onClick: () => bar.remove(),
    }, '✕'),
  ]);

  document.body.append(bar);
}
