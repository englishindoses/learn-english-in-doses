// The student's profile: who is signed in, and the way to everything personal.

import { el } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { avatar } from '../ui/avatar.js';
import { getAccount, logOut } from '../lib/account.js';
import { savedQuestions } from '../lib/storage.js';

export function profileScreen() {
  const { student } = getAccount();
  const questionCount = savedQuestions().length;

  const link = (icon, label, path, meta) =>
    el('button', { type: 'button', class: 'profile-link', onClick: () => go(path) }, [
      el('span', { class: 'profile-item-glyph', 'aria-hidden': 'true', text: icon }),
      el('span', { class: 'topic-text', text: label }),
      meta ? el('span', { class: 'pill', text: meta }) : null,
      el('span', { class: 'topic-go', 'aria-hidden': 'true', text: '›' }),
    ]);

  const leave = async () => {
    await logOut(); // a guest only leaves guest mode; their practice stays
    window.location.replace(window.location.pathname);
  };

  renderScreen({
    title: 'Profile',
    backTo: 'auto',
    body: [
      el('div', { class: 'profile-hero' }, [
        avatar(student || {}, 'xl'),
        el('p', { class: 'profile-hero-name', text: student ? student.name || 'Signed in' : 'Guest' }),
        el('p', {
          class: 'profile-hero-sub',
          text: student ? student.email : 'Your practice is saved on this device only',
        }),
      ]),
      el('div', { class: 'settings-card' }, [
        link('\u{1F4C8}', 'My progress', '/progress'),
        link('★', 'My questions', '/questions', questionCount ? String(questionCount) : null),
        link('⚙', 'Settings', '/settings'),
        link('\u{1F4D6}', 'How it works', '/help'),
      ]),
      el('div', { class: 'actions' }, [
        student
          ? el('button', { type: 'button', class: 'btn', text: 'Log out', onClick: leave })
          : el('button', { type: 'button', class: 'btn btn-primary', text: 'Sign in with Google', onClick: leave }),
      ]),
    ],
  });
}
