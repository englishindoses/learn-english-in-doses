// Offline, install, and the update bar.
//
// The service worker is registered with `prompt`, not `autoUpdate`, so a new
// version never reloads the page under a student mid-round. They get a bar
// with an Update button instead.

import { registerSW } from 'virtual:pwa-register';
import { el } from './dom.js';

let deferredInstall = null;
let onInstallChange = () => {};

export function setupPWA() {
  const updateSW = registerSW({
    onNeedRefresh() {
      showUpdateBar(() => updateSW(true));
    },
  });

  // Chrome and Edge hand us the install prompt to fire later.
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstall = event;
    onInstallChange();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstall = null;
    onInstallChange();
  });
}

export function canInstall() {
  return deferredInstall !== null;
}

export function isInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export function onInstallAvailabilityChange(handler) {
  onInstallChange = handler;
}

export async function promptInstall() {
  if (!deferredInstall) return false;
  deferredInstall.prompt();
  const { outcome } = await deferredInstall.userChoice;
  deferredInstall = null;
  onInstallChange();
  return outcome === 'accepted';
}

function showUpdateBar(applyUpdate) {
  if (document.querySelector('.update-bar')) return;

  const bar = el('div', { class: 'update-bar', role: 'status' }, [
    el('span', { class: 'update-bar-text', text: 'A new version is ready.' }),
    el('button', {
      class: 'update-bar-button',
      type: 'button',
      onClick: () => applyUpdate(),
    }, 'Update'),
    el('button', {
      class: 'update-bar-dismiss',
      type: 'button',
      'aria-label': 'Not now',
      onClick: () => bar.remove(),
    }, '✕'),
  ]);

  document.body.append(bar);
}
