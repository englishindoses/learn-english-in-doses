// Bits every engine needs. The class names are the website's, so the copied
// stylesheets style the app's activities without a line of new CSS.

import { el } from '../lib/dom.js';

export function questionCard(number, prompt, ...parts) {
  return el('div', { class: 'question' }, [
    prompt ? el('p', { class: 'question-text' }, `${number}. ${prompt}`) : null,
    ...parts,
  ]);
}

export function feedbackSlot() {
  return el('div', { class: 'feedback' });
}

export function paintFeedback(slot, correct, text) {
  slot.className = `feedback ${correct ? 'correct' : 'incorrect-answer'}`;
  slot.textContent = text;
}

export function clearFeedback(slot) {
  slot.className = 'feedback';
  slot.textContent = '';
}

// Answers are compared loosely enough to forgive spacing and capitals, and
// strictly enough that a wrong word is still wrong.
export function normalise(text) {
  return String(text)
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function sameAnswer(given, expected) {
  return normalise(given) === normalise(expected);
}
