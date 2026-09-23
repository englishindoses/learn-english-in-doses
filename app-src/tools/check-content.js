// Checks the question banks for faults that are invisible until a student
// hits them: a duplicate id, an answer missing from its own options, a word
// order alternative that cannot be built from the words on screen.
//
//   npm run check                  every topic
//   npm run check present-simple   one topic
//
// Problems stop the build. Notes are things a person should judge.

import { topics, isWritten, QUESTIONS_PER_ROUND } from '../src/data/topics.js';

const MINIMUM_BANK = 12;
const MAX_CLUE = 70;
const MAX_CHIPS = 12;

const problems = [];
const notes = [];

const only = process.argv[2];
const seenIds = new Map();

const checkers = { mcq, dropdown, wordorder, wordbank, scramble };

run();

function run() {
  const chosen = topics
    .filter(isWritten)
    .filter((topic) => !only || topic.id === only);

  if (only && chosen.length === 0) {
    console.error(`No written topic called "${only}".`);
    process.exit(1);
  }

  for (const topic of chosen) {
    for (const [type, bank] of Object.entries(topic.items)) {
      checkBank(topic, type, bank);
    }
  }

  report(chosen.length);
}

function checkBank(topic, type, bank) {
  const where = `${topic.id}/${type}`;

  if (bank.length < MINIMUM_BANK) {
    problem(where, `has ${bank.length} questions, needs at least ${MINIMUM_BANK}`);
  }

  if (bank.length % QUESTIONS_PER_ROUND !== 0) {
    note(where, `has ${bank.length} questions, which is not a whole number of rounds of ${QUESTIONS_PER_ROUND}`);
  }

  for (const item of bank) {
    checkId(where, item);
    checkClue(where, item);
    checkers[type]?.(where, item);
  }

  if (type === 'wordbank') checkWordBankTogether(where, bank);
}

// --- Rules every question shares ----------------------------------------

function checkId(where, item) {
  if (!item.id) return problem(where, 'a question has no id');

  // Bookmarks and progress key on the id alone, so a duplicate silently
  // corrupts both.
  const already = seenIds.get(item.id);
  if (already) problem(where, `id ${item.id} is already used in ${already}`);
  else seenIds.set(item.id, where);
}

function checkClue(where, item) {
  const { id, clue } = item;

  if (!clue) return problem(where, `${id} has no clue`);
  if (clue.length > MAX_CLUE) problem(where, `${id} has a clue of ${clue.length} characters, over ${MAX_CLUE}`);

  const answer = plainAnswer(item);
  if (answer && clue.toLowerCase().includes(answer.toLowerCase())) {
    problem(where, `${id} has a clue containing the answer`);
  }
}

// --- One rule set per activity type --------------------------------------

function mcq(where, item) {
  const { id, options, answer } = item;

  if (!Array.isArray(options) || options.length < 3) {
    return problem(where, `${id} needs at least three options`);
  }

  if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) {
    problem(where, `${id} has an answer index that is not one of its options`);
  }

  const duplicates = findDuplicates(options.map(normalise));
  if (duplicates.length) problem(where, `${id} repeats an option: ${duplicates.join(', ')}`);

  if (!item.sentence?.includes('_____')) {
    note(where, `${id} has no gap marked with underscores`);
  }
}

function dropdown(where, item) {
  const { id, sentence, gaps } = item;

  const markers = [...String(sentence).matchAll(/\{(\d+)\}/g)].map((m) => m[1]);
  const defined = Object.keys(gaps || {});

  if (markers.length === 0) problem(where, `${id} has no gap marker in its sentence`);

  for (const marker of markers) {
    if (!defined.includes(marker)) problem(where, `${id} has a gap {${marker}} with nothing defined for it`);
  }
  for (const key of defined) {
    if (!markers.includes(key)) problem(where, `${id} defines a gap ${key} that the sentence never uses`);
  }

  for (const [key, gap] of Object.entries(gaps || {})) {
    if (!Array.isArray(gap.options) || gap.options.length < 3) {
      problem(where, `${id} gap ${key} needs at least three options`);
    }

    if (!gap.options?.some((option) => normalise(option) === normalise(gap.answer))) {
      problem(where, `${id} gap ${key} has an answer that is not one of its own options`);
    }

    const duplicates = findDuplicates((gap.options || []).map(normalise));
    if (duplicates.length) problem(where, `${id} gap ${key} repeats an option: ${duplicates.join(', ')}`);
  }
}

function wordorder(where, item) {
  const { id, answer, alternatives = [] } = item;

  if (!answer) return problem(where, `${id} has no answer`);

  const words = answer.split(' ');
  if (words.length > MAX_CHIPS) {
    problem(where, `${id} is ${words.length} words long, over the ${MAX_CHIPS} that fit on a phone`);
  }
  if (words.length < 3) {
    note(where, `${id} is only ${words.length} words, which may be too easy`);
  }

  // An alternative the chips cannot spell is an answer nobody can give.
  for (const alternative of alternatives) {
    if (!sameWords(words, alternative.split(' '))) {
      problem(where, `${id} has an alternative built from different words: "${alternative}"`);
    }
  }
}

function wordbank(where, item) {
  const { id, sentence, answer } = item;

  if (!answer) return problem(where, `${id} has no answer`);

  const markers = (String(sentence).match(/\{1\}/g) || []).length;
  if (markers !== 1) problem(where, `${id} needs exactly one gap marked {1}, found ${markers}`);

  if (answer.includes(' ')) {
    note(where, `${id} has a multi-word answer, which is hard to type on a phone`);
  }
}

// Four answers share one word box, so a repeat inside a bank makes a round
// ambiguous however the four are drawn.
function checkWordBankTogether(where, bank) {
  const duplicates = findDuplicates(bank.map((item) => normalise(item.answer)));
  for (const word of duplicates) {
    problem(where, `two questions share the answer "${word}", so the word box would be ambiguous`);
  }
}

function scramble(where, item) {
  const { id, answer } = item;

  if (!answer) return problem(where, `${id} has no answer`);

  const letters = new Set(answer.toLowerCase());
  if (letters.size < 2) problem(where, `${id} cannot be scrambled: every letter is the same`);
  if (answer.length < 4) note(where, `${id} is only ${answer.length} letters, which may be too easy`);
  if (answer.includes(' ')) problem(where, `${id} has a space in it, and scrambling would give it away`);
  if (!item.hint) note(where, `${id} has no hint, so the student has only the letters`);
}

// --- Helpers --------------------------------------------------------------

function plainAnswer(item) {
  if (typeof item.answer === 'string') return item.answer;
  if (Number.isInteger(item.answer) && item.options) return item.options[item.answer];
  if (item.gaps) return Object.values(item.gaps).map((gap) => gap.answer).join(' ');
  return null;
}

function normalise(text) {
  return String(text).toLowerCase().replace(/\s+/g, ' ').trim();
}

function sameWords(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = a.map(normalise).sort();
  const sortedB = b.map(normalise).sort();
  return sortedA.every((word, i) => word === sortedB[i]);
}

function findDuplicates(list) {
  const seen = new Set();
  const twice = new Set();
  for (const value of list) {
    if (seen.has(value)) twice.add(value);
    seen.add(value);
  }
  return [...twice];
}

function problem(where, message) {
  problems.push(`${where}: ${message}`);
}

function note(where, message) {
  notes.push(`${where}: ${message}`);
}

function report(topicCount) {
  const banks = topicCount === 0 ? 0 : seenIds.size;

  if (notes.length) {
    console.log(`\nWorth a look (${notes.length}):`);
    for (const line of notes) console.log(`  - ${line}`);
  }

  if (problems.length) {
    console.log(`\nProblems (${problems.length}):`);
    for (const line of problems) console.log(`  - ${line}`);
    console.log('');
    process.exit(1);
  }

  console.log(`\nChecked ${banks} questions across ${topicCount} ${topicCount === 1 ? 'topic' : 'topics'}. No problems.\n`);
}
