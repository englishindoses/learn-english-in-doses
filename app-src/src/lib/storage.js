// Everything the app saves goes through this file, and nothing else touches
// localStorage. When accounts are added later, only this file changes: the
// namespace becomes `eid.u.<uid>.` and writes also fire a sync listener.
//
// Every read and write is wrapped, because a private window throws on the
// first read and an unhandled throw there takes the app down before a screen
// draws.

const NAMESPACE = 'eid.';

// Settings belong to the device, not the person, so they sit outside the
// namespace and survive a future sign-out.
const DEVICE_KEYS = new Set(['settings']);

function keyFor(name) {
  return DEVICE_KEYS.has(name) ? `eid.device.${name}` : NAMESPACE + name;
}

function read(name, fallbackValue) {
  try {
    const raw = window.localStorage.getItem(keyFor(name));
    return raw === null ? fallbackValue : JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

function write(name, value) {
  try {
    window.localStorage.setItem(keyFor(name), JSON.stringify(value));
  } catch {
    // Blocked site data. The app carries on in memory for this visit.
  }
}

function remove(name) {
  try {
    window.localStorage.removeItem(keyFor(name));
  } catch {
    // Nothing useful to do.
  }
}

// --- Progress, per topic and activity type -------------------------------

const emptyBank = () => ({
  used: [],
  seen: [],
  sessions: 0,
  answered: 0,
  firstTry: 0,
});

export function bankProgress(topicId, type) {
  const all = read('progress', {});
  return { ...emptyBank(), ...(all[`${topicId}.${type}`] || {}) };
}

export function saveBankProgress(topicId, type, bank) {
  const all = read('progress', {});
  all[`${topicId}.${type}`] = bank;
  write('progress', all);
}

export function allProgress() {
  return read('progress', {});
}

// --- The session in flight ------------------------------------------------

export function savedSession() {
  return read('session', null);
}

export function saveSession(session) {
  write('session', session);
}

export function clearSession() {
  remove('session');
}

// --- Bookmarked questions -------------------------------------------------

export function savedQuestions() {
  return read('questions', []);
}

export function isSaved(id) {
  return savedQuestions().some((q) => q.id === id);
}

export function toggleSaved(entry) {
  const list = savedQuestions();
  const at = list.findIndex((q) => q.id === entry.id);
  if (at === -1) {
    list.push({ ...entry, savedAt: new Date().toISOString() });
  } else {
    list.splice(at, 1);
  }
  write('questions', list);
  return at === -1;
}

export function clearSavedQuestions() {
  remove('questions');
}

// --- Practice days --------------------------------------------------------

export function practiceDays() {
  return read('days', []);
}

export function recordPracticeToday() {
  const today = new Date().toISOString().slice(0, 10);
  const days = practiceDays();
  if (days.includes(today)) return;
  days.push(today);
  write('days', days.slice(-60));
}

// --- Device settings ------------------------------------------------------

export function settings() {
  return read('settings', { textSize: 'normal', reducedMotion: false });
}

export function saveSettings(next) {
  write('settings', { ...settings(), ...next });
}
