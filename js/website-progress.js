/* Account-owned website progress. No app data or anonymous browser data is changed.
 * Cloud transport is supplied by account.js after Firebase confirms the identity.
 */
(function (global) {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const empty = () => ({ version: 2, epoch: 0, lessons: {}, days: [], last: null });
  const blankQueue = epoch => ({ epoch, activities: {}, days: [], last: null });
  const listeners = new Set();
  let uid = null, data = empty(), queue = blankQueue(0), transport = null;
  let generation = 0, timer = null, unsubscribe = null, saving = false, loaded = false;
  let status = 'loading', storageBlocked = false;

  function day(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function practiceCounts(days, now = new Date()) {
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
    const start = day(monday), today = day(now), month = today.slice(0, 7);
    const unique = [...new Set(days)];
    return { week: unique.filter(d => d >= start && d <= today).length,
      month: unique.filter(d => d.startsWith(month) && d <= today).length };
  }

  function normalise(raw) {
    if (!raw || raw.version !== 2) return empty();
    return { ...empty(), ...raw, lessons: raw.lessons || {}, days: Array.isArray(raw.days) ? raw.days : [] };
  }

  // Apply only changed activities. Transactions merge these into the latest cloud
  // record, so an old device cannot replace another lesson's answers or practice days.
  function merge(base, changes) {
    const out = clone(normalise(base));
    if (changes.epoch !== out.epoch) return out;
    for (const [path, activities] of Object.entries(changes.activities || {})) {
      const lesson = out.lessons[path] || { activities: {} };
      const merged = { ...lesson.activities };
      for (const [id, patch] of Object.entries(activities)) {
        const before = merged[id] || {};
        let answers = clone(before.answers || {});
        if (patch.answerChanges) {
          for (const [kind, values] of Object.entries(patch.answerChanges)) {
            if (kind === 'manual' || kind === 'choicesById') { answers[kind] = clone(values); continue; }
            if (kind === 'choices') delete answers.choicesById;
            if (!Array.isArray(answers[kind])) answers[kind] = [];
            for (const [index, value] of Object.entries(values)) answers[kind][index] = clone(value);
          }
        } else answers = clone(patch.answers || answers);
        const { answerChanges, ...record } = patch;
        merged[id] = { ...before, ...clone(record), answers, completed: Boolean(before.completed || patch.completed) };
      }
      out.lessons[path] = { ...lesson, activities: merged };
    }
    out.days = [...new Set([...out.days, ...(changes.days || [])])].sort();
    if (changes.last && (!out.last || changes.last.at >= out.last.at)) out.last = clone(changes.last);
    return out;
  }

  function cacheKey() { return `eid.website.v2.${uid}`; }
  function persist() {
    if (!uid) return;
    try { global.localStorage.setItem(cacheKey(), JSON.stringify({ data, queue })); storageBlocked = false; }
    catch { storageBlocked = true; }
  }
  function emit() { for (const fn of listeners) fn(); }
  function pending() { return Object.keys(queue.activities).length > 0 || queue.days.length > 0 || Boolean(queue.last); }
  function schedule() {
    clearTimeout(timer);
    if (uid && loaded && pending()) timer = setTimeout(() => flush(), 700);
  }

  async function activate(nextUid, nextTransport) {
    const token = ++generation;
    clearTimeout(timer);
    if (unsubscribe) unsubscribe();
    unsubscribe = null;
    uid = nextUid; transport = nextTransport; loaded = false; saving = false;
    data = empty(); queue = blankQueue(0); storageBlocked = false;
    if (!uid) { status = 'signed-out'; emit(); return; }
    try {
      const cached = JSON.parse(global.localStorage.getItem(cacheKey()) || 'null');
      if (cached) { data = normalise(cached.data); queue = cached.queue || blankQueue(data.epoch); }
    } catch { /* Memory remains available if storage is blocked. */ }
    status = 'loading'; emit();
    try {
      const remote = normalise(await transport.read());
      if (token !== generation) return;
      if (remote.epoch !== queue.epoch) queue = blankQueue(remote.epoch);
      data = merge(remote, queue); loaded = true;
      status = pending() ? 'pending' : 'saved'; persist(); emit(); schedule();
      if (transport.subscribe) unsubscribe = transport.subscribe(remoteValue => {
        if (token !== generation || saving) return;
        const remoteData = normalise(remoteValue);
        if (remoteData.epoch !== queue.epoch) queue = blankQueue(remoteData.epoch);
        data = merge(remoteData, queue); persist(); emit();
      }, () => { if (token === generation) { status = 'error'; emit(); } });
    } catch {
      if (token !== generation) return;
      // Crucially, a failed read never turns into an upload of an empty record.
      status = 'error'; emit();
    }
  }

  function record(path, activityId, snapshot, practiced = true, previousAnswers) {
    if (!uid) return;
    const lesson = (global.WebsiteLessonCatalog || []).find(l => l.path === path);
    if (!lesson || !lesson.activities.some(a => a.id === activityId)) return;
    const old = data.lessons[path]?.activities?.[activityId];
    const before = previousAnswers || old?.answers || {};
    const answerChanges = clone(queue.activities[path]?.[activityId]?.answerChanges || {});
    for (const [kind, values] of Object.entries(snapshot.answers || {})) {
      if (kind === 'manual' || kind === 'choicesById') {
        if (JSON.stringify(values) !== JSON.stringify(before[kind])) answerChanges[kind] = clone(values);
      } else if (Array.isArray(values)) values.forEach((value, i) => {
        if (JSON.stringify(value) !== JSON.stringify(before[kind]?.[i])) {
          answerChanges[kind] ||= {}; answerChanges[kind][i] = clone(value);
        }
      });
    }
    const activity = { ...snapshot, updatedAt: Date.now(),
      answerChanges,
      // Completion is earned once. A later retry never removes it.
      completed: Boolean(old?.completed || snapshot.completed) };
    queue.activities[path] ||= {};
    queue.activities[path][activityId] = activity;
    if (practiced) queue.days = [...new Set([...queue.days, day()])];
    queue.last = { path, activityId, at: Date.now() };
    data = merge(data, queue); status = loaded ? 'pending' : 'error'; persist(); emit(); schedule();
  }

  async function flush() {
    clearTimeout(timer);
    if (!uid || !transport || saving) return;
    const token = generation;
    if (!loaded) {
      await activate(uid, transport);
      if (loaded) return flush();
      return;
    }
    if (!pending()) {
      if (status === 'error') await activate(uid, transport);
      return;
    }
    const batch = clone(queue), batchTransport = transport;
    saving = true; status = 'saving'; emit();
    try {
      const remote = normalise(await batchTransport.update(batch));
      if (token !== generation) return;
      // Remove only acknowledged values; keep edits made while the request ran.
      if (remote.epoch !== queue.epoch) queue = blankQueue(remote.epoch);
      else {
        for (const [path, activities] of Object.entries(batch.activities)) {
          for (const [id, value] of Object.entries(activities)) {
            if (JSON.stringify(queue.activities[path]?.[id]) === JSON.stringify(value)) delete queue.activities[path][id];
          }
          if (queue.activities[path] && !Object.keys(queue.activities[path]).length) delete queue.activities[path];
        }
        queue.days = queue.days.filter(d => !batch.days.includes(d));
        if (JSON.stringify(queue.last) === JSON.stringify(batch.last)) queue.last = null;
      }
      data = merge(remote, queue); status = pending() ? 'pending' : 'saved';
      persist(); emit();
    } catch {
      if (token === generation) { status = 'error'; persist(); emit(); }
    } finally {
      if (token === generation) { saving = false; if (status !== 'error') schedule(); }
    }
  }

  function summary() {
    const catalog = (global.WebsiteLessonCatalog || []).filter(l => !l.path.startsWith('students/') || data.lessons[l.path]);
    let completed = 0, activities = 0, totalActivities = 0;
    const lessons = catalog.map(lesson => {
      const done = lesson.activities.filter(a => data.lessons[lesson.path]?.activities?.[a.id]?.completed).length;
      const complete = lesson.activities.length > 0 && done === lesson.activities.length;
      if (complete) completed++;
      activities += done; totalActivities += lesson.activities.length;
      return { ...lesson, done, complete, started: Boolean(data.lessons[lesson.path]) };
    });
    const last = lessons.find(l => l.path === data.last?.path);
    const next = last?.complete ? lessons.find(l => l.path === last.next) : last;
    return { lessons, completed, total: catalog.length, activities, totalActivities,
      percentage: catalog.length ? Math.round(completed / catalog.length * 100) : 0,
      ...practiceCounts(data.days), last, next, uid, status, storageBlocked };
  }

  async function reset() {
    if (!uid || !loaded || !transport) throw new Error('Connect before resetting your saved progress.');
    await flush();
    if (status === 'error') throw new Error('Your progress could not sync. Please try again.');
    const token = generation;
    const remote = await transport.reset();
    if (token !== generation) return;
    data = normalise(remote); queue = blankQueue(data.epoch); status = 'saved'; persist(); emit();
  }

  function importLegacy() {
    if (!uid) return 0;
    let count = 0;
    const catalog = global.WebsiteLessonCatalog || [];
    const readOld = key => {
      try { return JSON.parse(global.localStorage.getItem(key) || 'null'); } catch { return null; }
    };
    for (const lesson of catalog) {
      const filename = lesson.path.split('/').pop();
      // A shared old filename cannot safely identify a student's lesson.
      if (catalog.filter(l => l.path.endsWith('/' + filename)).length !== 1) continue;
      for (const spec of lesson.activities) {
        if (data.lessons[lesson.path]?.activities?.[spec.id]) continue;
        const old = readOld(`${spec.id}-progress-${filename}`);
        if (spec.type !== 'mcq' || !old?.userSelections) continue;
        const answered = Object.keys(old.userSelections).length;
        if (!answered) continue;
        record(lesson.path, spec.id, { answers: { choicesById: old.userSelections }, answered,
          total: spec.total, checked: Boolean(old.completed),
          completed: Boolean(old.completed && answered === spec.total), score: old.score ?? null }, false);
        count++;
      }
    }
    return count;
  }

  global.WebsiteProgress = { activate, record, flush, summary, reset, importLegacy, day, practiceCounts, merge, empty,
    getData: () => clone(data), getActivity: (path, id) => clone(data.lessons[path]?.activities?.[id] || null),
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    get signedIn() { return Boolean(uid); } };
  const categoryData = () => {
    const s = summary();
    return { activities: { completed: s.activities, total: s.totalActivities, percentage: s.totalActivities ? Math.round(s.activities / s.totalActivities * 100) : 0 },
      lessons: { completed: s.completed, total: s.total, percentage: s.percentage },
      assessments: { completed: 0, total: 0, percentage: 0 } };
  };
  function currentItem(category, id) {
    const lesson = (global.WebsiteLessonCatalog || []).find(l => global.location?.pathname.endsWith('/' + l.path));
    if (!lesson) return null;
    if (category === 'lessons') {
      const entry = summary().lessons.find(l => l.path === lesson.path);
      return { completed: Boolean(entry?.complete), title: lesson.title };
    }
    const spec = lesson.activities.find(a => a.id === id || id.startsWith(a.id + '-'));
    return spec ? clone(data.lessons[lesson.path]?.activities?.[spec.id] || null) : null;
  }
  global.WebsiteProgress.legacy = {
    init: () => true, saveProgress: flush, loadProgress: () => {},
    markItemCompleted: () => false, updateItemProgress: () => false,
    addProgressChangeCallback: fn => listeners.add(fn),
    getOverallProgress: () => ({ completed: summary().completed, total: summary().total,
      percentage: summary().percentage, categories: categoryData() }),
    getCompletedCount: category => categoryData()[category]?.completed || 0,
    getTotalCount: category => categoryData()[category]?.total || 0,
    getCompletionPercentage: category => categoryData()[category]?.percentage || 0,
    getStats: () => ({ practiceDaysThisWeek: summary().week, practiceDaysThisMonth: summary().month }),
    getCategoryDefinitions: () => ({}), setCategoryDefinitions: () => {},
    isItemCompleted: (category, id) => Boolean(currentItem(category, id)?.completed), getItemProgress: currentItem,
    getProgressData: () => ({ activities: {}, lessons: {}, assessments: {} }),
    getAllAchievements: () => [], getUnlockedAchievements: () => [],
    registerAchievement: () => {}, checkAchievements: () => {},
    resetAllProgress: reset, exportProgressData: () => JSON.stringify(data),
  };
  global.addEventListener?.('online', () => flush());
  global.document?.addEventListener('visibilitychange', () => { if (global.document.visibilityState === 'hidden') flush(); });
  // Other tabs refresh via Firestore. Never adopt another tab's account identity.
})(typeof window !== 'undefined' ? window : globalThis);
