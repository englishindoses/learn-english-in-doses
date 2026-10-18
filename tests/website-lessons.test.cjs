const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, requestInterceptor, VirtualConsole } = require('../tools/test-browser/node_modules/jsdom');
const root = path.resolve('.');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
function fetchLocal(url) {
    if (!url.startsWith('https://website.test/')) return new Response('');
    const filename = path.join(root, decodeURIComponent(new URL(url).pathname));
    if (!fs.existsSync(filename)) return new Response('', { status: 404 });
    let contents = fs.readFileSync(filename);
    // Firebase is replaced by a transport double. All lesson modules and the
    // progress code execute unchanged, including each page's inline init script.
    if (filename.endsWith(path.join('js', 'core.js'))) contents = Buffer.from(contents.toString().replace('  initAccount();', '  // Account transport supplied by the test.'));
    return new Response(contents, { headers: { 'Content-Type': filename.endsWith('.js') ? 'text/javascript' : 'text/css' } });
}
async function page(filename, remote) {
  const errors = [];
  const console = new VirtualConsole();
  console.on('jsdomError', e => { if (!e.message.includes('Not implemented')) errors.push(e.message); });
  const dom = new JSDOM(fs.readFileSync(filename, 'utf8'), {
    url: 'https://website.test/' + filename, resources: { interceptors: [requestInterceptor(request => fetchLocal(request.url))] }, runScripts: 'dangerously', virtualConsole: console,
    beforeParse(w) {
      w.matchMedia = () => ({ matches: false, addEventListener() {} });
      w.confirm = () => true; w.alert = () => {};
      w.HTMLElement.prototype.scrollIntoView = () => {};
      w.CSS ||= {}; w.CSS.escape ||= s => s;
    },
  });
  await new Promise(resolve => dom.window.addEventListener('load', resolve));
  await wait(15);
  const p = dom.window.WebsiteProgress;
  let saved = remote || p.empty();
  const transport = {
    read: async () => saved,
    update: async changes => (saved = p.merge(saved, changes)),
    reset: async () => (saved = { ...p.empty(), epoch: saved.epoch + 1 }),
  };
  await p.activate('test-student', transport);
  await wait(15);
  return { dom, w: dom.window, p, errors };
}
function fill(w, spec) {
  const n = w.document.getElementById(spec.id) || [...w.document.querySelectorAll('h2')].find(h => h.textContent.trim() === spec.label)?.closest('section');
  const all = s => [...n.querySelectorAll(s)];
  if (spec.type === 'mcq') all('.question').forEach(q => q.querySelector('.option')?.click());
  else if (['choose', 'odd', 'listen'].includes(spec.type)) {
    const selectors = { choose: ['.cc-choice-group', '.cc-choice'], odd: ['.ooo-group', '.ooo-option'], listen: ['.lc-question', '.lc-option'] }[spec.type];
    all(selectors[0]).forEach(q => q.querySelector(selectors[1])?.click());
  } else if (spec.type === 'drag') all('.question').forEach(q => {
    const zone = q.querySelector('.drop-zone');
    if (zone) [...q.querySelectorAll('.drag-items .drag-item')].forEach(n => zone.appendChild(n));
  });
  else if (spec.type === 'vocab') {
    const words = all('.vocab-word-item'); all('.vocab-drop-zone').forEach((z, i) => { if (words[i]) z.appendChild(words[i]); });
  } else if (spec.type === 'compact') {
    const markers = all('.cm-marker'); all('.cm-answer-slot').forEach((z, i) => { if (markers[i]) z.appendChild(markers[i]); });
  } else if (spec.type === 'matching') all('.matching-question').forEach(q => {
    q.click(); all('.matching-answer').find(n => n.dataset.index === q.dataset.index)?.click();
  });
  else if (spec.type === 'flashcards') all('.flashcard').forEach(n => n.click());
  else if (spec.type === 'speaking') all('.sq-check').forEach(n => n.click());
  else if (spec.type === 'manual') n.querySelector('.website-practice-done').click();
  else all('input:not([type="radio"]), select, textarea').forEach(n => {
    n.value = n.tagName === 'SELECT' ? [...n.options].find(o => o.value)?.value || '' : 'my answer';
    n.dispatchEvent(new w.Event('input', { bubbles: true }));
    n.dispatchEvent(new w.Event('change', { bubbles: true }));
  });
  const check = w.document.getElementById(spec.id + '-submit') || w.document.getElementById(spec.id + '-cm-submit') ||
    (spec.type === 'mcq' ? w.document.getElementById('mcq-submit') : null) ||
    (spec.type === 'dropdown' ? w.document.getElementById('dropdown-check') : null) ||
    n.querySelector('.vocab-check-btn, .cm-submit-btn') ||
    [...w.document.querySelectorAll('button[onclick]')].find(n => n.getAttribute('onclick').includes(`checkDropdownAnswers('${spec.id}')`));
  check?.click();
}

const examples = [
  'grammar/beginner/adverbs-of-frequency.html',
  'grammar/advanced/comment-adverbs.html',
  'grammar/advanced/gerund-infinitive.html',
  'grammar/intermediate/present-perfect-quiz.html',
  'grammar/intermediate/still-vs-yet.html',
  'vocabulary/beginner/numbers.html',
  'travel/beginner-travel/Unit1/airport-lesson1.html',
  'students/hb/week1-past-simple.html',
];
const registry = { window: {} };
require('node:vm').runInNewContext(fs.readFileSync('js/website-lesson-catalog.js', 'utf8'), registry);
const selected = process.env.ALL_LESSONS ? registry.window.WebsiteLessonCatalog.map(l => l.path) : examples;
for (const filename of selected) test(`answers, completion and restoration: ${filename}`, async () => {
  const first = await page(filename);
  try {
    assert.deepEqual(first.errors, [], 'page script errors');
    const lesson = first.w.WebsiteLessonCatalog.find(l => l.path === filename);
    assert.ok(lesson);
    for (const spec of lesson.activities) fill(first.w, spec);
    await wait(160);
    assert.deepEqual(first.errors, [], 'answer checking script errors');
    for (const spec of lesson.activities) {
      const value = first.p.getActivity(filename, spec.id);
      assert.ok(value, `saved ${spec.id}`);
      assert.equal(value.answered, spec.total, `${spec.id}: all questions answered`);
      assert.equal(value.completed, true, `${spec.id}: activity completed`);
    }
    assert.equal(first.p.summary().lessons.find(l => l.path === filename).complete, true);
    await first.p.flush();
    const second = await page(filename, first.p.getData());
    try {
      assert.deepEqual(second.errors, [], 'restored page script errors');
      // A restore must not create another practice day or reset saved answers.
      for (const spec of lesson.activities) {
        const node = second.w.document.getElementById(spec.id) || [...second.w.document.querySelectorAll('h2')].find(h => h.textContent.trim() === spec.label)?.closest('section');
        const state = { spec, node, viewed: new Set(), checked: true };
        const value = second.w.WebsiteLesson.snapshot(state);
        assert.equal(value.answered, spec.total, `${spec.id}: restored answers`);
      }
    } finally { second.dom.window.close(); }
  } finally { first.dom.window.close(); }
});

test('a partial lesson restores its answers without completing it or adding a practice day', async () => {
  const filename = 'grammar/beginner/adverbs-of-frequency.html';
  const first = await page(filename);
  try {
    const firstQuestion = first.w.document.querySelector('#mcq .question');
    firstQuestion.querySelector('.option').click();
    await wait(100);
    const saved = first.p.getData();
    assert.equal(first.p.summary().completed, 0);
    const second = await page(filename, saved);
    try {
      assert.equal(second.w.document.querySelectorAll('#mcq .option.selected').length, 1);
      assert.equal(second.p.summary().completed, 0);
      assert.equal(second.p.getData().days.length, saved.days.length);
    } finally { second.dom.window.close(); }
  } finally { first.dom.window.close(); }
});

test('blank submissions do not complete an activity', async () => {
  const result = await page('grammar/beginner/adverbs-of-frequency.html');
  try {
    result.w.document.getElementById('mcq-submit').click();
    result.w.document.getElementById('drag-drop-submit').click();
    await wait(100);
    assert.equal(result.p.summary().activities, 0);
    assert.equal(result.p.summary().completed, 0);
  } finally { result.dom.window.close(); }
});

test('dashboard shows the current lesson, next lesson and practice days', async () => {
  const result = await page('my-progress.html');
  try {
    const lesson = result.w.WebsiteLessonCatalog.find(l => l.path === 'grammar/beginner/adverbs-of-frequency.html');
    for (const spec of lesson.activities) result.p.record(lesson.path, spec.id, {
      answers: {}, completed: true, checked: true, answered: spec.total, total: spec.total,
    });
    assert.match(result.w.document.getElementById('continue-learning').textContent, /You finished/);
    assert.match(result.w.document.getElementById('continue-learning').textContent, /Next:/);
    assert.equal(result.w.document.getElementById('week-days').textContent, '1');
    assert.equal(result.w.document.getElementById('month-days').textContent, '1');
    assert.deepEqual(result.errors, []);
  } finally { result.dom.window.close(); }
});

test('student dashboard welcomes a new account and shows public courses', async () => {
  const result = await page('student-dashboard.html');
  try {
    result.w.WebsiteStudent = { firstName: 'Sam' };
    result.w.document.dispatchEvent(new result.w.CustomEvent('websiteAccountChanged'));
    assert.equal(result.w.document.getElementById('dashboard-greeting').textContent, 'Welcome, Sam!');
    assert.match(result.w.document.getElementById('dashboard-lessons-intro').textContent, /Choose a course/);
    assert.equal(result.w.document.querySelectorAll('.landing-paths-grid a').length, 5);
    assert.equal(result.w.document.querySelector('#dashboard-lessons a[href*="students/"]'), null);
    const lesson = result.w.WebsiteLessonCatalog.find(l => l.path === 'grammar/beginner/adverbs-of-frequency.html');
    result.p.record(lesson.path, lesson.activities[0].id, { answers: {}, answered: 1, completed: false });
    assert.match(result.w.document.getElementById('dashboard-lessons').textContent, /Adverbs of Frequency/);
    assert.match(result.w.document.getElementById('continue-learning').textContent, /Continue this lesson/);
    await result.p.activate(null, null);
    assert.equal(result.w.document.getElementById('progress-content').hidden, true);
    assert.equal(result.w.document.getElementById('dashboard-lessons').textContent, '');
    assert.equal(result.w.document.getElementById('dashboard-greeting').textContent, 'My Dashboard');
    assert.deepEqual(result.errors, []);
  } finally { result.dom.window.close(); }
});
