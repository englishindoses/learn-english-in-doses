// A session is twelve questions from one bank, in three rounds of four.
//
// The rules that give the app its character live here:
//   - green is permanent, so re-checking can never take a right answer away
//   - the counters move on the first check of a round only
//   - a question joins `seen` when its round is checked, not when it is dealt

import { el, announce } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { ask } from '../ui/dialog.js';
import { engineFor } from '../engines/index.js';
import { draw } from '../lib/pool.js';
import {
  topicById,
  QUESTIONS_PER_ROUND,
  ROUNDS_PER_SESSION,
  QUESTIONS_PER_SESSION,
} from '../data/topics.js';
import {
  bankProgress,
  saveBankProgress,
  saveSession,
  savedSession,
  isSaved,
  toggleSaved,
  recordPracticeToday,
} from '../lib/storage.js';

// The session in memory. The review screen prefers this and falls back to the
// saved record, so a refresh does not lose the results.
let live = null;

export function liveSession() {
  return live;
}

export function startSession(topicId, type, { replay = false } = {}) {
  const topic = topicById(topicId);
  const engine = engineFor(type);
  if (!topic || !engine || !topic.items?.[type]) return go('/topics');

  const bank = topic.items[type];

  let ids;
  if (replay && live && live.topicId === topicId && live.type === type) {
    ids = live.ids;
  } else {
    ids = draw(topicId, type, bank, QUESTIONS_PER_SESSION).map((item) => item.id);
  }

  live = {
    topicId,
    type,
    ids,
    round: 0,
    results: {},
    attempts: {},
    finished: false,
  };

  const progress = bankProgress(topicId, type);
  progress.sessions += 1;
  saveBankProgress(topicId, type, progress);

  persist();
  renderRound();
}

export function resumeSession() {
  const saved = savedSession();
  if (!saved || saved.finished) return go('/topics');
  live = { attempts: {}, ...saved };
  renderRound();
}

function persist() {
  if (!live) return;
  const { topicId, type, ids, round, results, finished } = live;
  saveSession({ topicId, type, ids, round, results, finished });
}

function itemsForRound() {
  const topic = topicById(live.topicId);
  const bank = topic.items[live.type];
  const byId = new Map(bank.map((item) => [item.id, item]));
  const start = live.round * QUESTIONS_PER_ROUND;
  return live.ids.slice(start, start + QUESTIONS_PER_ROUND).map((id) => byId.get(id));
}

function renderRound() {
  const topic = topicById(live.topicId);
  const engine = engineFor(live.type);
  const items = itemsForRound();
  const isLastRound = live.round === ROUNDS_PER_SESSION - 1;

  // Built fresh each round; `checkedOnce` is what keeps the counters honest.
  let checkedOnce = false;

  const body = el('div', { class: 'activity-container active' });
  const questions = [];

  if (engine.mode === 'per-round') {
    const round = engine.createRound(items);
    round.onEdit(() => {});
    body.append(round.node);
    questions.push({ kind: 'round', round, items });
  } else {
    items.forEach((item, index) => {
      const question = engine.createQuestion(item, live.round * QUESTIONS_PER_ROUND + index + 1);
      question.onEdit(() => {});
      body.append(wrapWithBookmark(question.node, item, engine));
      questions.push({ kind: 'item', question, item });
    });
  }

  const checkButton = el('button', { class: 'submit-btn', type: 'button' }, 'Check answers');
  const nextButton = el('button', {
    class: 'restart-btn',
    type: 'button',
    style: 'display: none;',
  }, isLastRound ? 'See your results' : 'Next round');

  const controls = el('div', { class: 'control-buttons' }, [checkButton, nextButton]);
  body.append(controls);

  checkButton.addEventListener('click', async () => {
    const blanks = countBlanks(questions);

    if (blanks > 0) {
      const choice = await ask({
        title: 'Some answers are empty',
        message: `You have ${blanks} ${blanks === 1 ? 'answer' : 'answers'} still to finish.`,
        choices: [
          { label: 'Finish them', value: 'finish' },
          { label: 'Check anyway', value: 'check' },
        ],
      });
      if (choice !== 'check') {
        highlightBlanks(questions);
        return;
      }
    }

    const outcomes = markRound(questions);
    recordOutcomes(outcomes, checkedOnce);
    checkedOnce = true;

    nextButton.style.display = '';
    checkButton.textContent = 'Check again';

    const right = outcomes.filter((o) => o.correct).length;
    announce(`${right} of ${outcomes.length} right.`);
  });

  nextButton.addEventListener('click', () => {
    if (isLastRound) {
      live.finished = true;
      persist();
      go('/review');
    } else {
      live.round += 1;
      persist();
      renderRound();
    }
  });

  renderScreen({
    title: topic.title,
    subtitle: engine.name,
    backTo: `/topic/${topic.id}`,
    progress: { round: live.round + 1, total: ROUNDS_PER_SESSION },
    body,
  });
}

// Every question carries an Ask my teacher bookmark.
function wrapWithBookmark(node, item, engine) {
  const button = el('button', {
    class: 'bookmark-button',
    type: 'button',
    'aria-pressed': isSaved(item.id) ? 'true' : 'false',
    'aria-label': 'Save this question to ask my teacher',
  }, '★');

  button.addEventListener('click', () => {
    const nowSaved = toggleSaved({
      id: item.id,
      topicId: live.topicId,
      type: live.type,
      text: engine.label(item),
    });
    button.setAttribute('aria-pressed', nowSaved ? 'true' : 'false');
    announce(nowSaved ? 'Question saved' : 'Question removed');
  });

  node.classList.add('has-bookmark');
  node.append(button);
  return node;
}

function countBlanks(questions) {
  let blanks = 0;
  for (const entry of questions) {
    if (entry.kind === 'round') blanks += entry.round.blankCount();
    else if (!entry.question.isAnswered()) blanks += 1;
  }
  return blanks;
}

function highlightBlanks(questions) {
  for (const entry of questions) {
    if (entry.kind === 'round') entry.round.highlightBlanks();
  }
}

function markRound(questions) {
  const outcomes = [];

  for (const entry of questions) {
    if (entry.kind === 'round') {
      const results = entry.round.check();
      entry.items.forEach((item, index) => {
        outcomes.push({ id: item.id, correct: results[index] });
      });
    } else {
      const correct = entry.question.check();
      outcomes.push({ id: entry.item.id, correct, question: entry.question });
    }
  }

  return outcomes;
}

function recordOutcomes(outcomes, alreadyChecked) {
  const progress = bankProgress(live.topicId, live.type);

  for (const outcome of outcomes) {
    // Green is permanent: only ever upgrade.
    if (!live.results[outcome.id]) live.results[outcome.id] = outcome.correct;

    if (!outcome.correct) {
      live.attempts[outcome.id] = (live.attempts[outcome.id] || 0) + 1;
      // Word order is the one activity that gives in, so nobody is stuck.
      if (live.attempts[outcome.id] >= 3 && outcome.question?.reveal) {
        outcome.question.reveal();
      }
    }

    if (!alreadyChecked) {
      progress.answered += 1;
      if (outcome.correct) progress.firstTry += 1;
      if (!progress.seen.includes(outcome.id)) progress.seen.push(outcome.id);
    }
  }

  if (!alreadyChecked) {
    saveBankProgress(live.topicId, live.type, progress);
    recordPracticeToday();
  }

  persist();
}
