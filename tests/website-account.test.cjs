const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('../tools/test-browser/node_modules/jsdom');
const wait = () => new Promise(resolve => setTimeout(resolve, 0));
const student = { uid: 'student-uid', email: 'personal@example.test', displayName: 'Test Student' };

async function setup(initialUser = null, filename = 'grammar/beginner/present-simple.html') {
  const dom = new JSDOM('<div class="theme-toggle-container"><button id="theme-toggle">Theme</button></div>', {
    url: 'https://website.test/' + filename, runScripts: 'dangerously',
  });
  const w = dom.window, navigation = [], calls = [];
  let authChanged;
  w.testNavigate = url => navigation.push(url);
  w.testReload = () => navigation.push('reload');
  w.WebsiteProgress = { activate: uid => calls.push(['activate', uid]), flush: async () => {} };
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; };
  w.testFirebase = {
    getRedirectResult: async () => null,
    onAuthStateChanged(_auth, fn) { authChanged = fn; fn(initialUser); },
    setPersistence: async () => {}, browserLocalPersistence: {},
    signInWithEmailAndPassword: async () => { calls.push(['login']); authChanged(student); return { user: student }; },
    createUserWithEmailAndPassword: async () => { calls.push(['create']); authChanged(student); return { user: student }; },
    updateProfile: async () => { calls.push(['profile']); },
    signOut: async () => authChanged(null),
    GoogleAuthProvider: class { setCustomParameters() {} },
    signInWithPopup: async () => { authChanged(student); return { user: student }; },
  };
  const script = w.document.createElement('script');
  // Replace only the external SDK and browser navigation boundaries; execute
  // the actual account UI, event handlers and redirect decisions.
  script.textContent = fs.readFileSync('js/account.js', 'utf8')
    .replace('export async function initAccount', 'async function initAccount')
    .replace(/async function loadFirebase\(\) \{[\s\S]*?\n\}/, 'async function loadFirebase() { fb = window.testFirebase; auth = {}; }')
    .replaceAll('location.assign(', 'window.testNavigate(')
    .replaceAll('location.replace(', 'window.testNavigate(')
    .replaceAll('location.reload()', 'window.testReload()');
  w.document.body.append(script);
  await w.initAccount('https://website.test/');
  return { dom, w, navigation, calls };
}

test('login button opens the real account dialog and username login goes to the dashboard', async () => {
  const r = await setup();
  try {
    const login = r.w.document.querySelector('.account-login'); assert.ok(login);
    login.click();
    r.w.document.getElementById('account-username').value = 'test.student';
    r.w.document.getElementById('account-password').value = 'example-password';
    r.w.document.querySelector('form').dispatchEvent(new r.w.Event('submit', { bubbles: true, cancelable: true }));
    await wait();
    assert.deepEqual(r.navigation, ['https://website.test/student-dashboard.html']);
    assert.equal(r.w.WebsiteStudent.firstName, 'Test');
  } finally { r.dom.window.close(); }
});
test('a signed-in student returning to the homepage goes to their dashboard', async () => {
  const r = await setup(student, 'home.html');
  try { assert.deepEqual(r.navigation, ['https://website.test/student-dashboard.html']); }
  finally { r.dom.window.close(); }
});
test('a signed-in lesson stays open and the account menu links to the dashboard', async () => {
  const r = await setup(student);
  try {
    assert.deepEqual(r.navigation, []);
    r.w.document.querySelector('.account-chip').click();
    const dashboard = [...r.w.document.querySelectorAll('.account-menu a')].find(n => n.textContent === 'My Dashboard');
    assert.equal(dashboard.href, 'https://website.test/student-dashboard.html');
    r.w.document.querySelector('.account-menu button').click(); await wait();
    assert.deepEqual(r.navigation, ['reload']);
  } finally { r.dom.window.close(); }
});
test('Google popup login takes a student to the dashboard', async () => {
  const r = await setup();
  try {
    r.w.document.querySelector('.account-login').click();
    r.w.document.querySelector('.account-google').click(); await wait();
    assert.deepEqual(r.navigation, ['https://website.test/student-dashboard.html']);
  } finally { r.dom.window.close(); }
});
