// The frame every screen sits in: the top bar and one scrolling body. Every
// screen goes through renderScreen.
//
// `level` colours the screen: a topic's screens pass its level, and everything
// else is drawn in the website's default blue. The top bar is navy on every
// screen.

import { el, clear } from '../lib/dom.js';
import { go, back } from '../lib/router.js';
import { savedQuestions, settings } from '../lib/storage.js';
import { getAccount, logOut } from '../lib/account.js';
import { avatar } from './avatar.js';

let bar = null;
let body = null;

export function mountShell(container) {
  bar = el('header', { class: 'topbar' });
  body = el('main', { class: 'screen', id: 'screen-body', tabindex: '-1' });
  clear(container).append(bar, body);
  applySettings();
}

// Two settings are honoured through data- attributes on the root element.
export function applySettings() {
  const { textSize, reduceMotion } = settings();
  document.documentElement.dataset.textSize = textSize;
  document.documentElement.dataset.reduceMotion = reduceMotion ? 'on' : 'off';
}

// `backTo` is a path, 'auto' for the previous screen, or null for no button.
export function renderScreen({ title, subtitle, backTo = null, body: content, progress = null, level = null }) {
  const bookmarkCount = savedQuestions().length;

  if (level) document.body.dataset.level = level;
  else delete document.body.dataset.level;

  clear(bar);
  bar.hidden = false;
  bar.append(
    el('div', { class: 'topbar-row' }, [
      el('div', { class: 'topbar-left' }, [
        backTo === null
          ? el('span', { class: 'topbar-spacer' })
          : iconButton({
              label: 'Go back',
              glyph: '‹',
              className: 'topbar-back',
              onClick: () => (backTo === 'auto' ? back('/') : go(backTo)),
            }),
      ]),
      el('div', { class: 'topbar-title' }, [
        el('h1', { text: title }),
        subtitle ? el('p', { class: 'topbar-subtitle', text: subtitle }) : null,
      ]),
      el('div', { class: 'topbar-right' }, [
        iconButton({
          label: `My questions${bookmarkCount ? `, ${bookmarkCount} saved` : ''}`,
          glyph: '★',
          badge: bookmarkCount || null,
          onClick: () => go('/questions'),
        }),
        profileButton(),
      ]),
    ])
  );
  if (progress) bar.append(roundStrip(progress));

  clear(body);
  body.append(...[].concat(content).filter(Boolean));
  window.scrollTo(0, 0);
}

// A screen with no top bar, for signing in.
export function renderBare(content) {
  delete document.body.dataset.level;
  clear(bar);
  bar.hidden = true;
  clear(body);
  body.append(...[].concat(content).filter(Boolean));
  window.scrollTo(0, 0);
}

// Keyboard users should land on the new screen, not at the top of the page.
export function focusScreen() {
  if (body) body.focus({ preventScroll: true });
}

function iconButton({ label, glyph, badge, onClick, className = '' }) {
  return el('button', {
    type: 'button',
    class: `topbar-btn ${className}`.trim(),
    'aria-label': label,
    title: label,
    onClick,
  }, [
    el('span', { class: 'topbar-glyph', 'aria-hidden': 'true', text: glyph }),
    badge ? el('span', { class: 'topbar-badge', text: String(badge) }) : null,
  ]);
}

function roundStrip({ round, total }) {
  const dots = [];
  for (let i = 1; i <= total; i++) {
    const state = i < round ? ' is-done' : i === round ? ' is-current' : '';
    dots.push(el('span', { class: `round-dot${state}` }));
  }
  return el('div', { class: 'topbar-progress' }, [
    el('span', { class: 'topbar-progress-label', text: `Round ${round} of ${total}` }),
    el('div', { class: 'round-dots', 'aria-hidden': 'true' }, dots),
  ]);
}

// --- The profile menu ------------------------------------------------------

function profileButton() {
  const { student } = getAccount();
  const button = el('button', {
    type: 'button',
    class: 'topbar-btn topbar-profile',
    'aria-label': 'Profile',
    title: 'Profile',
    'aria-haspopup': 'menu',
    'aria-expanded': 'false',
    onClick: (event) => {
      event.stopPropagation();
      toggleMenu(button);
    },
  }, [avatar(student || {}, 'sm')]);
  return button;
}

function toggleMenu(button) {
  const open = document.querySelector('.profile-menu');
  if (open) {
    open.closeMenu();
    return;
  }

  const account = getAccount();
  const { student } = account;

  const item = (label, glyph, onClick) =>
    el('button', {
      type: 'button',
      class: 'profile-item',
      role: 'menuitem',
      onClick: () => {
        closeMenu();
        onClick();
      },
    }, [
      el('span', { class: 'profile-item-glyph', 'aria-hidden': 'true', text: glyph }),
      el('span', { text: label }),
    ]);

  const leave = async () => {
    await logOut(); // a guest only leaves guest mode; their practice stays on the device
    window.location.replace(window.location.pathname);
  };

  const items = [
    item('Profile', '\u{1F464}', () => go('/profile')),
    item('My progress', '\u{1F4C8}', () => go('/progress')),
    item('Settings', '⚙', () => go('/settings')),
  ];
  if (account.isTeacher) items.splice(1, 0, item('Your students', '\u{1F465}', () => go('/students')));
  items.push(student ? item('Log out', '↩', leave) : item('Sign in with Google', '\u{1F511}', leave));

  const menu = el('div', { class: 'profile-menu', role: 'menu', 'aria-label': 'Profile' }, [
    el('div', { class: 'profile-head' }, [
      avatar(student || {}, 'md'),
      el('div', { class: 'profile-who' }, [
        el('p', { class: 'profile-name', text: student ? student.name || 'Signed in' : 'Guest' }),
        el('p', {
          class: 'profile-email',
          text: student ? student.email : 'Practice saved on this device only',
        }),
      ]),
    ]),
    ...items,
  ]);

  button.setAttribute('aria-expanded', 'true');
  bar.append(menu);
  menu.querySelector('.profile-item').focus();

  setTimeout(() => {
    document.addEventListener('click', onOutside);
    document.addEventListener('keydown', onKey);
  });

  function onOutside(event) {
    if (!menu.contains(event.target)) closeMenu();
  }
  function onKey(event) {
    if (event.key === 'Escape') {
      closeMenu();
      button.focus();
    }
  }
  function closeMenu() {
    menu.remove();
    button.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onOutside);
    document.removeEventListener('keydown', onKey);
  }
  menu.closeMenu = closeMenu;
}
