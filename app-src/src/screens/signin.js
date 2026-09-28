// The first screen: sign in with Google, log in or create an account with a
// username and password, or carry on as a guest.

import { el } from '../lib/dom.js';
import { go, refresh, currentPath } from '../lib/router.js';
import { renderBare } from '../ui/shell.js';
import { signIn, signInWithUsername, continueAsGuest } from '../lib/account.js';

const MIN_PASSWORD = 6; // Firebase will not accept anything shorter

export function signinScreen() {
  const stay = el('input', { type: 'checkbox', class: 'switch-input', id: 'stay-signed-in' });
  stay.checked = true;

  const error = el('p', { class: 'signin-error', role: 'alert' });
  let busy = false;

  // --- Google --------------------------------------------------------------

  const googleLabel = el('span', { text: 'Sign in with Google' });
  const googleBtn = el('button', {
    type: 'button',
    class: 'btn btn-google',
    onClick: async () => {
      if (busy) return;
      error.textContent = '';
      setBusy(true);
      googleLabel.textContent = 'Signing in…';
      try {
        if (await signIn(stay.checked)) return finish();
      } catch (err) {
        error.textContent = friendlyError(err);
      }
      setBusy(false);
      googleLabel.textContent = 'Sign in with Google';
    },
  }, [el('span', { class: 'btn-google-mark', 'aria-hidden': 'true', html: GOOGLE_G }), googleLabel]);

  // --- Username and password -----------------------------------------------

  let creating = false;

  const username = el('input', {
    type: 'text',
    class: 'field-input',
    id: 'signin-username',
    autocomplete: 'username',
    autocapitalize: 'off',
    spellcheck: 'false',
    required: true,
  });
  const password = el('input', {
    type: 'password',
    class: 'field-input',
    id: 'signin-password',
    autocomplete: 'current-password',
    required: true,
  });
  const passwordHint = el('p', { class: 'field-hint', text: `At least ${MIN_PASSWORD} characters.`, hidden: true });
  const usernameHint = el('p', {
    class: 'field-hint',
    text: 'Letters, numbers, dots, hyphens and underscores. You will use this to log in.',
    hidden: true,
  });

  const submitBtn = el('button', { type: 'submit', class: 'btn btn-primary', text: 'Log in' });
  const switchLine = el('p', { class: 'signin-switch' });

  const form = el('form', { class: 'signin-form', novalidate: true }, [
    el('div', { class: 'field' }, [
      el('label', { class: 'field-label', for: 'signin-username', text: 'Username' }),
      username,
      usernameHint,
    ]),
    el('div', { class: 'field' }, [
      el('label', { class: 'field-label', for: 'signin-password', text: 'Password' }),
      password,
      passwordHint,
    ]),
    submitBtn,
    switchLine,
  ]);

  function showMode() {
    submitBtn.textContent = creating ? 'Create account' : 'Log in';
    password.setAttribute('autocomplete', creating ? 'new-password' : 'current-password');
    usernameHint.hidden = !creating;
    passwordHint.hidden = !creating;
    switchLine.replaceChildren(
      creating ? 'Already have an account? ' : 'New here? ',
      el('button', {
        type: 'button',
        class: 'link-btn',
        text: creating ? 'Log in' : 'Create an account',
        onClick: () => {
          creating = !creating;
          error.textContent = '';
          showMode();
          username.focus();
        },
      })
    );
  }
  showMode();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;

    const name = username.value.trim().toLowerCase();
    const problem = checkForm(name, password.value, creating);
    if (problem) {
      error.textContent = problem;
      return;
    }

    error.textContent = '';
    setBusy(true);
    submitBtn.textContent = creating ? 'Creating your account…' : 'Logging in…';
    try {
      if (await signInWithUsername(name, password.value, stay.checked, { create: creating })) return finish();
    } catch (err) {
      error.textContent = friendlyError(err);
    }
    setBusy(false);
    showMode();
  });

  // --- Guest ---------------------------------------------------------------

  const guestBtn = el('button', {
    type: 'button',
    class: 'btn btn-quiet',
    text: 'Continue as a guest',
    onClick: () => {
      if (busy) return;
      continueAsGuest(stay.checked);
      finish();
    },
  });

  function setBusy(value) {
    busy = value;
    googleBtn.disabled = value;
    submitBtn.disabled = value;
  }

  function finish() {
    if (currentPath() === '/') refresh();
    else go('/', { replace: true });
  }

  renderBare([
    el('div', { class: 'signin' }, [
      el('div', { class: 'signin-brand' }, [
        el('img', { class: 'signin-logo', src: 'icons/icon-192.png', alt: '' }),
        el('h1', { class: 'signin-title', text: 'Practice' }),
        el('p', { class: 'signin-sub', text: 'English in Doses' }),
      ]),

      el('div', { class: 'signin-card' }, [
        form,
        el('div', { class: 'signin-divider' }, [el('span', { text: 'or' })]),
        googleBtn,
        el('p', {
          class: 'signin-note',
          text: 'Your progress and saved questions go wherever you sign in, and your teacher can see them to help you in class.',
        }),
        el('div', { class: 'signin-divider' }, [el('span', { text: 'or' })]),
        guestBtn,
        el('p', { class: 'signin-note', text: 'As a guest, your practice stays on this device only.' }),
        error,
      ]),

      el('label', { class: 'setting-row signin-stay', for: 'stay-signed-in' }, [
        el('div', { class: 'setting-text' }, [
          el('p', { class: 'setting-label', text: 'Stay signed in' }),
          el('p', { class: 'setting-desc', text: 'Turn this off on a shared phone or computer.' }),
        ]),
        el('span', { class: 'switch' }, [stay, el('span', { class: 'switch-track' })]),
      ]),
    ]),
  ]);
}

// The same rules cloud.js applies, checked here so a mistake shows before
// anything is sent.
function checkForm(name, pass, creating) {
  if (!name) return 'Please type your username.';
  if (!pass) return 'Please type your password.';
  if (!creating) return null;
  if (name.length < 3) return 'Your username needs at least 3 characters.';
  if (name.length > 20) return 'Your username can have up to 20 characters.';
  if (!/^[a-z0-9._-]+$/.test(name)) return 'Use only letters, numbers, dots, hyphens and underscores in your username.';
  if (pass.length < MIN_PASSWORD) return `Your password needs at least ${MIN_PASSWORD} characters.`;
  return null;
}

function friendlyError(err) {
  const code = err?.code || '';
  if (code === 'auth/network-request-failed' || !navigator.onLine) {
    return 'You seem to be offline. Connect to the internet to sign in, or continue as a guest.';
  }
  if (code === 'auth/email-already-in-use') {
    return 'That username is already taken. Please choose another one.';
  }
  if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email'].includes(code)) {
    return 'That username or password is not right. Please try again.';
  }
  if (code === 'auth/weak-password' || code === 'auth/password-does-not-meet-requirements') {
    return `Your password needs at least ${MIN_PASSWORD} characters.`;
  }
  if (code === 'auth/too-many-requests') {
    return 'Too many tries. Please wait a few minutes and try again.';
  }
  if (['auth/unauthorized-domain', 'auth/operation-not-allowed', 'auth/configuration-not-found'].includes(code)) {
    return 'Signing in isn’t switched on yet. Please tell your teacher, and continue as a guest for now.';
  }
  return 'Signing in didn’t work. Please try again, or continue as a guest.';
}

const GOOGLE_G =
  '<svg viewBox="0 0 48 48" width="20" height="20"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';
