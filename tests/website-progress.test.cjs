const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('js/website-progress.js', 'utf8');
const catalog = [
  { path: 'grammar/beginner/a.html', title: 'A', course: 'Beginner', next: 'grammar/beginner/b.html', activities: [{ id: 'mcq', type: 'mcq', total: 2 }, { id: 'drag', type: 'drag', total: 1 }] },
  { path: 'grammar/beginner/b.html', title: 'B', course: 'Beginner', activities: [{ id: 'mcq', type: 'mcq', total: 2 }] },
];
const copy = value => JSON.parse(JSON.stringify(value));
function client(store = new Map()) {
  const window = { WebsiteLessonCatalog: catalog, localStorage: {
    getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v), removeItem: k => store.delete(k),
  } };
  vm.runInNewContext(source, { window, setTimeout: () => 1, clearTimeout() {}, console });
  return { p: window.WebsiteProgress, window, store };
}
function cloud(p) {
  let data = p.empty(), writes = 0, failRead = false, failWrite = false;
  const transport = {
    async read() { if (failRead) throw Error('offline'); return copy(data); },
    async update(changes) { if (failWrite) throw Error('offline'); writes++; data = p.merge(data, changes); return copy(data); },
    async reset() { data = { ...p.empty(), epoch: data.epoch + 1 }; return copy(data); },
  };
  return { transport, get data() { return data; }, get writes() { return writes; },
    set failRead(v) { failRead = v; }, set failWrite(v) { failWrite = v; } };
}
const answer = { answers: { fields: [{ value: 'student answer' }] }, answered: 2, total: 2, checked: true, completed: true, score: 1 };

test('anonymous work is not assigned to the next account', async () => {
  const { p } = client(); p.record(catalog[0].path, 'mcq', answer);
  const c = cloud(p); await p.activate('alice', c.transport);
  assert.equal(p.getActivity(catalog[0].path, 'mcq'), null);
  assert.equal(c.writes, 0);
});
test('a lesson completes only after all its activities; accuracy is separate', async () => {
  const { p } = client(); const c = cloud(p); await p.activate('alice', c.transport);
  p.record(catalog[0].path, 'mcq', answer); assert.equal(p.summary().completed, 0);
  p.record(catalog[0].path, 'drag', answer); assert.equal(p.summary().completed, 1);
  assert.equal(p.summary().next.path, catalog[1].path);
  p.record(catalog[0].path, 'drag', { ...answer, completed: false });
  assert.equal(p.summary().completed, 1);
});
test('partial work resumes the current lesson and survives reload', async () => {
  const { p, store } = client(); const c = cloud(p); await p.activate('alice', c.transport);
  p.record(catalog[0].path, 'mcq', { ...answer, completed: false });
  const next = client(store).p; await next.activate('alice', c.transport);
  assert.equal(next.summary().next.path, catalog[0].path);
  assert.equal(next.getActivity(catalog[0].path, 'mcq').answers.fields[0].value, 'student answer');
});
test('accounts have separate answers and pending queues', async () => {
  const { p } = client(); const a = cloud(p), b = cloud(p);
  await p.activate('alice', a.transport); p.record(catalog[0].path, 'mcq', answer); await p.flush();
  await p.activate('bob', b.transport); assert.equal(p.summary().activities, 0);
  await p.activate('alice', a.transport); assert.equal(p.summary().activities, 1);
});
test('viewing progress does not record a practice day', async () => {
  const { p } = client(); const c = cloud(p); await p.activate('alice', c.transport);
  assert.equal(p.summary().week, 0); assert.equal(p.summary().month, 0); assert.equal(c.writes, 0);
  p.record(catalog[0].path, 'mcq', answer); p.record(catalog[0].path, 'mcq', answer);
  assert.equal(p.summary().week, 1); assert.equal(p.getData().days.length, 1);
});
test('calendar week starts Monday; month and duplicate dates are handled', () => {
  const { p } = client();
  const result = p.practiceCounts(['2026-09-30', '2026-10-01', '2026-10-11', '2026-10-12', '2026-10-12', '2026-10-18', '2026-10-19'], new Date(2026, 9, 18));
  assert.equal(result.week, 2); assert.equal(result.month, 4);
});
test('failed cloud read cannot upload an empty or stale device copy', async () => {
  const { p } = client(); const c = cloud(p); c.failRead = true;
  await p.activate('alice', c.transport); p.record(catalog[0].path, 'mcq', answer); await p.flush();
  assert.equal(c.writes, 0); assert.equal(p.summary().status, 'error');
  c.failRead = false; await p.flush(); assert.equal(c.writes, 1);
});
test('failed writes retain answers and pending changes for retry', async () => {
  const { p, store } = client(); const c = cloud(p); await p.activate('alice', c.transport);
  p.record(catalog[0].path, 'mcq', answer); c.failWrite = true; await p.flush();
  assert.equal(p.summary().status, 'error');
  const next = client(store).p; c.failWrite = false; await next.activate('alice', c.transport); await next.flush();
  assert.equal(c.data.lessons[catalog[0].path].activities.mcq.score, 1);
});
test('two devices merge different activities rather than replacing each other', async () => {
  const one = client().p, two = client().p, c = cloud(one);
  await one.activate('alice', c.transport); await two.activate('alice', c.transport);
  one.record(catalog[0].path, 'mcq', answer); two.record(catalog[0].path, 'drag', answer);
  await one.flush(); await two.flush();
  assert.equal(Object.keys(c.data.lessons[catalog[0].path].activities).length, 2);
});
test('two devices preserve edits to different questions in the same activity', async () => {
  const one = client().p, two = client().p, c = cloud(one);
  await one.activate('alice', c.transport); await two.activate('alice', c.transport);
  const original = { fields: [{ value: '' }, { value: '' }] };
  one.record(catalog[0].path, 'mcq', { ...answer, answers: { fields: [{ value: 'first' }, { value: '' }] } }, true, original);
  two.record(catalog[0].path, 'mcq', { ...answer, answers: { fields: [{ value: '' }, { value: 'second' }] } }, true, original);
  await one.flush(); await two.flush();
  const fields = c.data.lessons[catalog[0].path].activities.mcq.answers.fields;
  assert.equal(fields[0].value, 'first'); assert.equal(fields[1].value, 'second');
});
test('offline work from before a reset cannot resurrect deleted progress', async () => {
  const one = client().p, two = client().p, c = cloud(one);
  await one.activate('alice', c.transport); await two.activate('alice', c.transport);
  two.record(catalog[0].path, 'mcq', answer); await one.reset(); await two.flush();
  assert.equal(Object.keys(c.data.lessons).length, 0); assert.equal(c.data.epoch, 1);
});
test('blocked browser storage retains work in memory and can sync it', async () => {
  const { p, window } = client(); const c = cloud(p); await p.activate('alice', c.transport);
  window.localStorage.setItem = () => { throw Error('blocked'); };
  p.record(catalog[0].path, 'mcq', answer);
  assert.equal(p.summary().storageBlocked, true);
  assert.equal(p.getActivity(catalog[0].path, 'mcq').score, 1);
  await p.flush(); assert.equal(c.writes, 1);
});
test('unregistered IDs cannot inflate totals above 100 percent', async () => {
  const { p } = client(); const c = cloud(p); await p.activate('alice', c.transport);
  p.record(catalog[0].path, 'unknown', answer); p.record('unknown', 'mcq', answer);
  assert.equal(p.summary().activities, 0); assert.equal(p.summary().percentage, 0);
});
test('explicit legacy import preserves the original and does not invent practice days', async () => {
  const { p, store } = client(); const c = cloud(p);
  const old = JSON.stringify({ userSelections: { q1: 0, q2: 1 }, score: 1, completed: true });
  store.set('mcq-progress-a.html', old);
  await p.activate('alice', c.transport); assert.equal(p.summary().activities, 0);
  assert.equal(p.importLegacy(), 1); assert.equal(p.summary().activities, 1);
  assert.equal(p.summary().week, 0); assert.equal(store.get('mcq-progress-a.html'), old);
  assert.equal(p.importLegacy(), 0);
  p.record(catalog[0].path, 'mcq', { ...answer, answers: { choices: [1, 0] } });
  assert.equal(p.getActivity(catalog[0].path, 'mcq').answers.choicesById, undefined);
  assert.equal(p.getActivity(catalog[0].path, 'mcq').answers.choices[0], 1);
});

test('manual completion syncs without completing exercises and survives reload and reset', async () => {
  const { p, store } = client(); const c = cloud(p);
  await p.activate('alice', c.transport);
  p.completeLesson(catalog[0].path);
  assert.equal(p.summary().completed, 1);
  assert.equal(p.summary().activities, 0);
  assert.equal(p.summary().next.path, catalog[1].path);
  assert.equal(p.summary().week, 1);
  await p.flush();
  const next = client(store).p; await next.activate('alice', c.transport);
  assert.equal(next.summary().completed, 1);
  assert.equal(next.getActivity(catalog[0].path, 'mcq'), null);
  await next.reset();
  assert.equal(next.summary().completed, 0);
});
