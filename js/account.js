/**
 * ESL Grammar Website - Accounts
 *
 * The Log in button next to the theme toggle, the login box, and the menu a
 * signed-in student sees. Loaded by core.js on every page that has the theme
 * toggle, so no page needs its own markup for it.
 *
 * Students log in with Google, or with a username and password. It is the
 * same account as the practice app (app/), and because the app lives on the
 * same site, logging in on one logs in on the other.
 *
 * Firebase only signs people in with an email address, so a username is
 * stored as a made-up one: "maria" becomes "maria@users.englishindoses.com".
 * Students never see it. The same rule is in app-src/src/lib/cloud.js, and
 * the two must stay the same or an account made in one will not work in the
 * other.
 */

const FIREBASE = 'https://www.gstatic.com/firebasejs/12.19.0';

// The same project as the practice app (app-src/src/lib/cloud.js).
const firebaseConfig = {
  apiKey: 'AIzaSyD44OgfZB4k63OD6pWJr6lxkvQA1O2snQA',
  authDomain: 'english-in-doses.firebaseapp.com',
  projectId: 'english-in-doses',
  storageBucket: 'english-in-doses.firebasestorage.app',
  messagingSenderId: '671131712565',
  appId: '1:671131712565:web:729170731e3a1dc8c7457c',
};

const USERNAME_DOMAIN = 'users.englishindoses.com';
const MIN_PASSWORD = 6; // Firebase will not accept anything shorter

let fb = null; // the Firebase functions, once loaded
let auth = null;
let root = '';
let slot = null; // where the button or the student's name goes

/**
 * Called by core.js with the address of the site's top folder, so links work
 * from any page however deep it is.
 */
export async function initAccount(siteRoot) {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  root = siteRoot;
  addStylesheet();

  slot = document.createElement('div');
  slot.className = 'account-nav';
  toggle.parentElement.insertBefore(slot, toggle);

  try {
    await loadFirebase();
  } catch (error) {
    console.error('Accounts could not load:', error);
    slot.remove();
    return;
  }

  // Back from a Google sign-in that had to leave the page.
  fb.getRedirectResult(auth).catch(() => {});

  fb.onAuthStateChanged(auth, (user) => showAccount(user));
}

function addStylesheet() {
  if (document.querySelector('link[data-account-css]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${root}css/account.css`;
  link.dataset.accountCss = '';
  document.head.append(link);
}

async function loadFirebase() {
  const [app, authModule] = await Promise.all([
    import(`${FIREBASE}/firebase-app.js`),
    import(`${FIREBASE}/firebase-auth.js`),
  ]);
  fb = authModule;
  auth = authModule.getAuth(app.initializeApp(firebaseConfig));
}

/* ----------------------------------------
   1. The button and the menu
   ---------------------------------------- */

function describe(user) {
  const email = user.email || '';
  const username = email.endsWith(`@${USERNAME_DOMAIN}`) ? email.split('@')[0] : '';
  const name = user.displayName || username || email;
  return {
    name,
    firstName: name.trim().split(/\s+/)[0],
    line: username ? `Username: ${username}` : email,
    photo: user.photoURL || '',
  };
}

function showAccount(user) {
  closeMenu();
  slot.replaceChildren();

  if (!user) {
    const login = element('button', { type: 'button', class: 'account-login', text: 'Log in' });
    login.addEventListener('click', () => openLogin());
    slot.append(login);
    return;
  }

  const who = describe(user);
  const chip = element('button', {
    type: 'button',
    class: 'account-chip',
    'aria-haspopup': 'menu',
    'aria-expanded': 'false',
    'aria-label': `Account: ${who.name}`,
  }, [avatar(who), element('span', { class: 'account-chip-name', text: who.firstName })]);

  chip.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu(chip, who);
  });
  slot.append(chip);
}

function avatar(who) {
  const initial = element('span', {
    class: 'account-avatar',
    'aria-hidden': 'true',
    text: (who.name.trim().charAt(0) || '?').toUpperCase(),
  });
  if (!who.photo) return initial;

  const img = element('img', { class: 'account-avatar', src: who.photo, alt: '', referrerpolicy: 'no-referrer' });
  img.addEventListener('error', () => img.replaceWith(initial));
  return img;
}

function toggleMenu(chip, who) {
  if (slot.querySelector('.account-menu')) {
    closeMenu();
    return;
  }

  const menu = element('div', { class: 'account-menu', role: 'menu' }, [
    element('div', { class: 'account-menu-head' }, [
      element('p', { class: 'account-menu-name', text: who.name }),
      who.line ? element('p', { class: 'account-menu-line', text: who.line }) : null,
    ]),
    element('a', { class: 'account-menu-item', role: 'menuitem', href: `${root}my-progress.html`, text: 'My Progress' }),
    element('a', { class: 'account-menu-item', role: 'menuitem', href: `${root}app/`, text: 'Practice app' }),
    element('button', { type: 'button', class: 'account-menu-item', role: 'menuitem', text: 'Log out' }),
  ]);

  menu.querySelector('button').addEventListener('click', async () => {
    closeMenu();
    await fb.signOut(auth);
  });

  chip.setAttribute('aria-expanded', 'true');
  slot.append(menu);
  menu.querySelector('.account-menu-item').focus();

  setTimeout(() => {
    document.addEventListener('click', onOutside);
    document.addEventListener('keydown', onKey);
  });
}

function onOutside(event) {
  if (!slot.contains(event.target)) closeMenu();
}

function onKey(event) {
  if (event.key === 'Escape') {
    closeMenu();
    slot.querySelector('.account-chip')?.focus();
  }
}

function closeMenu() {
  slot?.querySelector('.account-menu')?.remove();
  slot?.querySelector('.account-chip')?.setAttribute('aria-expanded', 'false');
  document.removeEventListener('click', onOutside);
  document.removeEventListener('keydown', onKey);
}

/* ----------------------------------------
   2. The login box
   ---------------------------------------- */

function openLogin() {
  let creating = false;
  let busy = false;

  const title = element('h2', { class: 'account-dialog-title', id: 'account-dialog-title' });
  const error = element('p', { class: 'account-error', role: 'alert' });

  const username = element('input', {
    type: 'text',
    class: 'account-input',
    id: 'account-username',
    autocomplete: 'username',
    autocapitalize: 'off',
    spellcheck: 'false',
  });
  const password = element('input', {
    type: 'password',
    class: 'account-input',
    id: 'account-password',
    autocomplete: 'current-password',
  });
  const usernameHint = element('p', {
    class: 'account-hint',
    text: 'Letters, numbers, dots, hyphens and underscores. You will use this to log in.',
  });
  const passwordHint = element('p', { class: 'account-hint', text: `At least ${MIN_PASSWORD} characters.` });

  const submit = element('button', { type: 'submit', class: 'account-submit' });
  const switchLine = element('p', { class: 'account-switch' });

  const form = element('form', { class: 'account-form', novalidate: '' }, [
    element('div', { class: 'account-field' }, [
      element('label', { class: 'account-label', for: 'account-username', text: 'Username' }),
      username,
      usernameHint,
    ]),
    element('div', { class: 'account-field' }, [
      element('label', { class: 'account-label', for: 'account-password', text: 'Password' }),
      password,
      passwordHint,
    ]),
    submit,
    switchLine,
  ]);

  const google = element('button', { type: 'button', class: 'account-google' }, [
    element('span', { class: 'account-google-mark', 'aria-hidden': 'true', html: GOOGLE_G }),
    element('span', { text: 'Log in with Google' }),
  ]);

  const close = element('button', { type: 'button', class: 'account-close', 'aria-label': 'Close', text: '✕' });

  const dialog = element('dialog', { class: 'account-dialog', 'aria-labelledby': 'account-dialog-title' }, [
    close,
    title,
    form,
    element('div', { class: 'account-divider' }, [element('span', { text: 'or' })]),
    google,
    error,
    element('p', { class: 'account-note', text: 'Your account also works in the practice app.' }),
  ]);

  function showMode() {
    title.textContent = creating ? 'Create an account' : 'Log in';
    submit.textContent = creating ? 'Create account' : 'Log in';
    password.setAttribute('autocomplete', creating ? 'new-password' : 'current-password');
    usernameHint.hidden = !creating;
    passwordHint.hidden = !creating;

    const flip = element('button', {
      type: 'button',
      class: 'account-link',
      text: creating ? 'Log in' : 'Create an account',
    });
    flip.addEventListener('click', () => {
      creating = !creating;
      error.textContent = '';
      showMode();
      username.focus();
    });
    switchLine.replaceChildren(creating ? 'Already have an account? ' : 'New here? ', flip);
  }

  function setBusy(value) {
    busy = value;
    submit.disabled = value;
    google.disabled = value;
  }

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
    submit.textContent = creating ? 'Creating your account…' : 'Logging in…';
    try {
      const email = `${name}@${USERNAME_DOMAIN}`;
      await fb.setPersistence(auth, fb.browserLocalPersistence);
      if (creating) {
        const result = await fb.createUserWithEmailAndPassword(auth, email, password.value);
        await fb.updateProfile(result.user, { displayName: name });
        showAccount(result.user); // the name was set after the first update
      } else {
        await fb.signInWithEmailAndPassword(auth, email, password.value);
      }
      dialog.close();
      return;
    } catch (err) {
      error.textContent = friendlyError(err);
    }
    setBusy(false);
    showMode();
  });

  google.addEventListener('click', async () => {
    if (busy) return;
    error.textContent = '';
    setBusy(true);
    try {
      await fb.setPersistence(auth, fb.browserLocalPersistence);
      const provider = new fb.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await fb.signInWithPopup(auth, provider);
      dialog.close();
      return;
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
        await fb.signInWithRedirect(auth, new fb.GoogleAuthProvider()); // leaves the page
        return;
      }
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        error.textContent = friendlyError(err);
      }
    }
    setBusy(false);
  });

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => dialog.remove());

  showMode();
  document.body.append(dialog);
  dialog.showModal();
  username.focus();
}

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
    return 'You seem to be offline. Connect to the internet and try again.';
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
  return 'Logging in didn’t work. Please try again.';
}

/* ----------------------------------------
   3. Helpers
   ---------------------------------------- */

function element(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'html') node.innerHTML = value;
    else node.setAttribute(key, value);
  }
  for (const child of children) {
    if (child === null || child === undefined) continue;
    node.append(child);
  }
  return node;
}

const GOOGLE_G =
  '<svg viewBox="0 0 48 48" width="20" height="20"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';
