// The dashboard's welcome: a different greeting each time, and a small
// question to get the student thinking in English before they start. The
// questions stay simple enough for a beginner.

// `{name}` is swapped for their first name; the second form is used without one.
const GREETINGS = [
  ['Hi, {name}!', 'Hi there!'],
  ['Hello, {name}!', 'Hello!'],
  ['Welcome back, {name}!', 'Welcome back!'],
  ['Good to see you, {name}!', 'Good to see you!'],
  ['Nice to see you, {name}!', 'Nice to see you!'],
  ['{timeOfDay}, {name}!', '{timeOfDay}!'],
  ['Ready when you are, {name}!', 'Ready when you are!'],
];

const QUESTIONS = [
  'How was your day?',
  'Did you use English today?',
  'What did you have for breakfast?',
  'What are you doing this weekend?',
  'Did you learn a new word today?',
  'What’s the weather like today?',
  'Did you watch anything good this week?',
  'Who did you talk to today?',
  'Are you going anywhere nice soon?',
  'What was the best part of your day?',
  'Did you read anything in English this week?',
  'What are you having for dinner tonight?',
];

const LAST_KEY = 'eid.device.lastWelcome';

// Chosen once each time the app opens, so it does not change every time the
// student comes back to the dashboard during one visit.
let chosen = null;

// A greeting and a question, never the same as the last time the app opened.
export function welcome(firstName) {
  if (!chosen) {
    const last = readLast();
    chosen = { g: pick(GREETINGS.length, last.g), q: pick(QUESTIONS.length, last.q) };
    writeLast(chosen);
  }
  const { g, q } = chosen;

  const [withName, without] = GREETINGS[g];
  const greeting = (firstName ? withName.replace('{name}', firstName) : without)
    .replace('{timeOfDay}', timeOfDay());
  return { greeting, question: QUESTIONS[q] };
}

function pick(count, avoid) {
  let i = Math.floor(Math.random() * count);
  if (i === avoid) i = (i + 1 + Math.floor(Math.random() * (count - 1))) % count;
  return i;
}

function timeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function readLast() {
  try {
    return JSON.parse(localStorage.getItem(LAST_KEY)) || {};
  } catch {
    return {};
  }
}

function writeLast(value) {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify(value));
  } catch {
    // It will just repeat sometimes.
  }
}
