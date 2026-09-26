// Draws the questions for one session, so that every question in a bank is
// used before any repeats.

import { shuffle } from './dom.js';
import { bankProgress, saveBankProgress } from './storage.js';

// Takes `count` items from the bank. Unseen items first; when fewer than
// `count` remain, it takes what is left, starts a new cycle for the
// remainder, and prefers items that were not in those leftovers, so a fresh
// cycle never opens with the questions it just closed on.
export function draw(topicId, type, items, count) {
  const used = new Set(bankProgress(topicId, type).used);
  const unseen = items.filter((item) => !used.has(item.id));

  if (unseen.length >= count) {
    const picked = shuffle(unseen).slice(0, count);
    saveBankProgress(topicId, type, { used: [...used, ...picked.map((item) => item.id)] });
    return picked;
  }

  const leftovers = new Set(unseen.map((item) => item.id));
  const recycled = shuffle(items.filter((item) => !leftovers.has(item.id))).slice(0, count - unseen.length);
  const picked = shuffle([...unseen, ...recycled]);

  // A new cycle: only this draw counts as used.
  saveBankProgress(topicId, type, { used: picked.map((item) => item.id) });
  return picked;
}
