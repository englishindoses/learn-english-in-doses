// Everything the app saves goes through this file, and nothing else touches
// localStorage.
//
// It always reads and writes the browser's own storage, so every screen stays
// quick and works offline. What changes is whose storage it is:
//
//   - a guest's practice sits under the plain `eid.` keys, on this device only;
//   - a signed-in student's sits under `eid.u.<their id>.`, and every change is
//     also handed to the sync listener, which copies it to their account.
//
// Every read and write is wrapped, because a private window throws on the
// first read and an unhandled throw there takes the app down before a screen
// draws.

const PREFIX = 'eid.';

// Settings belong to the device, not the person, so they sit outside the
// namespace and survive signing out.
const SETTINGS_KEY = 'eid.device.settings';

// The parts of a student's practice that follow them between devices. `last`
// is the activity they were on, for the dashboard's resume card. `session` is
// the old single-attempt key: it is only read once, to move an unfinished
// attempt into its own activity, and then cleared.
export const SYNCED = ['progress', 'questions', 'session', 'days', 'last'];

const DAYS_KEPT = 60;

let namespace = PREFIX; // a guest until told otherwise
let syncListener = null;

function key(name, ns = namespace) {
  return ns + name;
}

function read(fullKey, fallbackValue) {
  try {
    const raw = window.localStorage.getItem(fullKey);
    return raw === null ? fallbackValue : JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

function write(fullKey, value) {
  try {
    window.localStorage.setItem(fullKey, JSON.stringify(value));
  } catch {
    // Blocked site data. The app carries on in memory for this visit.
  }
}

function remove(fullKey) {
  try {
    window.localStorage.removeItem(fullKey);
  } catch {
    // Nothing useful to do.
  }
}

// Saves one synced part for whoever is using the app now.
function writeSynced(name, value) {
  if (value === null) remove(key(name));
  else write(key(name), value);
  if (namespace !== PREFIX) {
    write(key('updatedAt'), Date.now());
    if (syncListener) syncListener();
  }
}

// --- Whose data ------------------------------------------------------------

// Switches to a signed-in student's data, or back to the guest's with null.
export function useAccount(uid) {
  namespace = uid ? `${PREFIX}u.${uid}.` : PREFIX;
  migrate();
}

export function onSyncedChange(listener) {
  syncListener = listener;
}

// A signed-in student's practice as one object, ready to send to their account.
export function exportSynced() {
  const out = { updatedAt: read(key('updatedAt'), 0) };
  for (const name of SYNCED) out[name] = read(key(name), null);
  return out;
}

// Replaces this device's copy with what came from the account.
export function importSynced(data) {
  for (const name of SYNCED) {
    if (data[name] === null || data[name] === undefined) remove(key(name));
    else write(key(name), data[name]);
  }
  write(key('updatedAt'), data.updatedAt || 0);
  migrate();
}

export function localUpdatedAt() {
  return read(key('updatedAt'), 0);
}

// Forgets a signed-in student's copy on this device, after logging out.
export function forgetAccount(uid) {
  const ns = `${PREFIX}u.${uid}.`;
  for (const name of [...SYNCED, 'updatedAt']) remove(key(name, ns));
}

// --- Moving older saved shapes across --------------------------------------
//
// The first version of the app kept progress flat, as `progress["topic.type"]`,
// counted an activity as done when it was started rather than finished, and
// kept one unfinished session under `session`. All three are moved into the
// current shape here, once, so an update never costs a student their place.

function migrate() {
  migrateFlatProgress();
  migrateLegacySession();
  migrateQuestionLabels();
}

function migrateFlatProgress() {
  const all = read(key('progress'), null);
  if (!all) return;

  const oldKeys = Object.keys(all).filter((k) => k.includes('.'));
  if (!oldKeys.length) return;

  for (const oldKey of oldKeys) {
    const [topicId, type] = oldKey.split('.');
    const old = all[oldKey] || {};
    delete all[oldKey];
    if (!all[topicId]) all[topicId] = {};
    all[topicId][type] = {
      used: old.used || [],
      seen: old.seen || [],
      // The old count went up when an activity was started, so it cannot say
      // how many were finished. Completions count from now on.
      sessions: 0,
      answered: old.answered || 0,
      firstTry: old.firstTry || 0,
      correct: 0,
      scored: 0,
      attempt: null,
    };
  }
  writeSynced('progress', all);
}

function migrateLegacySession() {
  const legacy = read(key('session'), null);
  if (!legacy) return;

  if (legacy.topicId && legacy.type) {
    const bank = bankProgress(legacy.topicId, legacy.type);
    if (!bank.attempt) {
      const attempt = {
        itemIds: legacy.ids || legacy.itemIds || [],
        roundIndex: legacy.round ?? legacy.roundIndex ?? 0,
        results: legacy.results || {},
        finished: Boolean(legacy.finished),
      };
      if (attempt.finished) {
        recordCompletion(legacy.topicId, legacy.type, attempt);
      } else {
        saveBankProgress(legacy.topicId, legacy.type, { attempt });
      }
      writeSynced('last', { topicId: legacy.topicId, type: legacy.type });
    }
  }
  writeSynced('session', null);
}

// Saved questions used to keep their text as `text`; it is `label` now.
function migrateQuestionLabels() {
  const list = read(key('questions'), null);
  if (!list || !list.some((q) => q.label === undefined)) return;
  writeSynced('questions', list.map(({ text, savedAt, ...rest }) => ({
    ...rest,
    label: rest.label ?? text ?? '',
    addedAt: rest.addedAt ?? (savedAt ? Date.parse(savedAt) : Date.now()),
  })));
}

// --- The guest's practice --------------------------------------------------

export function guestHasPractice() {
  const progress = read(key('progress', PREFIX), {});
  const questions = read(key('questions', PREFIX), []);
  return Object.keys(progress).length > 0 || questions.length > 0;
}

export function guestSummary() {
  return {
    ...summarise(read(key('progress', PREFIX), {})),
    questions: read(key('questions', PREFIX), []).length,
  };
}

// Adds the guest's practice into the signed-in student's, then clears the guest's.
export function mergeGuestIntoAccount() {
  const guestProgress = read(key('progress', PREFIX), {});
  const guestQuestions = read(key('questions', PREFIX), []);

  const progress = allProgress();
  for (const [topicId, banks] of Object.entries(guestProgress)) {
    if (!progress[topicId]) progress[topicId] = {};
    for (const [type, bank] of Object.entries(banks)) {
      const mine = progress[topicId][type] || {};
      progress[topicId][type] = {
        used: union(mine.used, bank.used),
        seen: union(practised(mine), practised(bank)),
        sessions: (mine.sessions || 0) + (bank.sessions || 0),
        answered: (mine.answered || 0) + (bank.answered || 0),
        firstTry: (mine.firstTry || 0) + (bank.firstTry || 0),
        correct: (mine.correct || 0) + (bank.correct || 0),
        scored: (mine.scored || 0) + (bank.scored || 0),
        // An attempt in play belongs to one device; keep the account's.
        attempt: mine.attempt || bank.attempt || null,
      };
    }
  }
  writeSynced('progress', progress);

  const questions = savedQuestions();
  for (const q of guestQuestions) {
    if (!questions.some((mine) => mine.id === q.id)) questions.push(q);
  }
  questions.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
  writeSynced('questions', questions);

  const days = union(practiceDays(), read(key('days', PREFIX), [])).sort();
  writeSynced('days', days.slice(-DAYS_KEPT));

  for (const name of SYNCED) remove(key(name, PREFIX));
}

function union(a = [], b = []) {
  return [...new Set([...(a || []), ...(b || [])])];
}

// --- Device settings -------------------------------------------------------

const DEFAULT_SETTINGS = { textSize: 'normal', reduceMotion: false };

export function settings() {
  return { ...DEFAULT_SETTINGS, ...read(SETTINGS_KEY, {}) };
}

export function saveSettings(patch) {
  const next = { ...settings(), ...patch };
  write(SETTINGS_KEY, next);
  return next;
}

// --- Progress, per topic and activity type ---------------------------------
//
// progress[topicId][type] =
//   { used, seen, sessions, answered, firstTry, correct, scored, attempt }
//
// `used` is what has been dealt out, and empties again once a whole bank has
// been dealt, so questions repeat fairly. `seen` is what has actually been
// checked, and never empties. `sessions` is how many times this activity has
// been completed. `correct` over `scored` is the student's current score: of
// every question they have finished an activity with, how many stand right.
// `attempt` is the twelve in play, or the finished twelve, until they start
// again.

const EMPTY_BANK = {
  used: [],
  seen: [],
  sessions: 0,
  answered: 0,
  firstTry: 0,
  correct: 0,
  scored: 0,
  attempt: null,
};

export function allProgress() {
  return read(key('progress'), {});
}

export function bankProgress(topicId, type) {
  const bank = allProgress()[topicId]?.[type];
  if (!bank) return { ...EMPTY_BANK };
  return { ...EMPTY_BANK, ...bank, seen: practised(bank) };
}

// Nobody can have practised more different questions than they answered.
function practised(bank) {
  const seen = bank.seen || [];
  const answered = bank.answered || 0;
  return seen.length > answered ? seen.slice(0, answered) : seen;
}

export function saveBankProgress(topicId, type, patch) {
  const all = allProgress();
  if (!all[topicId]) all[topicId] = {};
  const next = { ...bankProgress(topicId, type), ...patch };
  all[topicId][type] = next;
  writeSynced('progress', all);
  if (patch.answered !== undefined) notePracticeDay();
  return next;
}

// Totals for the dashboard, the progress screen and the teacher's list.
export function summarise(all) {
  let sessions = 0;
  let answered = 0;
  let firstTry = 0;
  let correct = 0;
  let scored = 0;

  for (const banks of Object.values(all || {})) {
    for (const bank of Object.values(banks || {})) {
      sessions += bank.sessions || 0;
      answered += bank.answered || 0;
      firstTry += bank.firstTry || 0;
      correct += bank.correct || 0;
      scored += bank.scored || 0;
    }
  }
  return { sessions, answered, firstTry, correct, scored };
}

// The student's score right now: of every question they have finished an
// activity with, the percentage standing correct. Null until they finish one,
// so nobody is shown 0% before they have had a chance.
export function currentScore(all) {
  const { correct, scored } = summarise(all);
  if (!scored) return null;
  return Math.round((correct / scored) * 100);
}

// How many of a topic's activities have been completed at least once.
export function completedInTopic(all, topicId) {
  const banks = (all || {})[topicId] || {};
  return Object.values(banks).filter((bank) => bank.sessions).length;
}

// --- The attempt in play, one per activity ---------------------------------
//
// An attempt is the twelve questions the student is working through:
//   { itemIds, roundIndex, results, finished }
// It stays after they finish, so the activity shows as completed until they
// choose to start again, which draws a fresh twelve.

export function getAttempt(topicId, type) {
  return bankProgress(topicId, type).attempt || null;
}

export function saveAttempt(topicId, type, attempt) {
  saveBankProgress(topicId, type, { attempt });
  writeSynced('last', { topicId, type });
}

export function lastActivity() {
  return read(key('last'), null);
}

// How many of an attempt's questions have been checked so far.
export function attemptAnswered(attempt) {
  return attempt ? Object.keys(attempt.results || {}).length : 0;
}

// Finishing an activity: count the completion, and add this attempt's final
// standing to the score. Called once, when they tap through to their results.
export function recordCompletion(topicId, type, attempt) {
  const bank = bankProgress(topicId, type);
  const right = Object.values(attempt.results || {}).filter(Boolean).length;

  saveBankProgress(topicId, type, {
    sessions: bank.sessions + 1,
    correct: bank.correct + right,
    scored: bank.scored + (attempt.itemIds || []).length,
    attempt: { ...attempt, finished: true },
  });
}

export function resetProgress() {
  writeSynced('progress', null);
  writeSynced('session', null);
  writeSynced('last', null);
}

export function resetEverything() {
  for (const name of SYNCED) writeSynced(name, null);
  remove(SETTINGS_KEY);
}

// --- Bookmarked questions --------------------------------------------------

export function savedQuestions() {
  return read(key('questions'), []);
}

export function isSaved(id) {
  return savedQuestions().some((q) => q.id === id);
}

// Returns true when the question was just added.
export function toggleSaved(entry) {
  const list = savedQuestions();
  const at = list.findIndex((q) => q.id === entry.id);
  if (at === -1) list.unshift({ ...entry, addedAt: Date.now() });
  else list.splice(at, 1);
  writeSynced('questions', list);
  return at === -1;
}

export function removeSaved(id) {
  writeSynced('questions', savedQuestions().filter((q) => q.id !== id));
}

export function clearSavedQuestions() {
  writeSynced('questions', []);
}

// --- Practice days ---------------------------------------------------------
// The dates, on the student's own calendar, they checked at least one round.

export function practiceDays() {
  return read(key('days'), []);
}

function notePracticeDay() {
  const today = dayString(new Date());
  const days = practiceDays();
  if (days.includes(today)) return;
  writeSynced('days', [...days, today].slice(-DAYS_KEPT));
}

// How many different days they practised in the last seven, today included.
export function daysThisWeek(days = practiceDays()) {
  const recent = new Set();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    recent.add(dayString(d));
  }
  return days.filter((d) => recent.has(d)).length;
}

function dayString(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}
