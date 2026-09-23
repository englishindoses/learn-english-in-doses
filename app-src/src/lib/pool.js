// Draws the questions for one session, so that every question in a bank is
// used before any repeats.

import { shuffle } from './dom.js';
import { bankProgress, saveBankProgress } from './storage.js';

// Takes `count` items from the bank. Unseen items first; when fewer than
// `count` remain, it takes what is left, starts a new cycle for the
// remainder, and prefers items that were not in those leftovers, so a fresh
// cycle never opens with the questions it just closed on.
export function draw(topicId, type, items, count) {
  const progress = bankProgress(topicId, type);
  const used = new Set(progress.used);

  const unseen = items.filter((item) => !used.has(item.id));
  let picked = shuffle(unseen).slice(0, count);

  if (picked.length < count) {
    const leftovers = new Set(picked.map((item) => item.id));
    const rest = items.filter((item) => !leftovers.has(item.id));
    picked = picked.concat(shuffle(rest).slice(0, count - picked.length));
  }

  progress.used = picked.map((item) => item.id);
  saveBankProgress(topicId, type, progress);

  return picked;
}
