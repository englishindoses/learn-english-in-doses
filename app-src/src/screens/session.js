// A session is twelve questions from one bank, in three rounds of four.
//
// The rules that give the app its character live here:
//   - green is permanent, so re-checking can never take a right answer away
//   - the counters move on the first check of a round only
//   - a question joins `seen` when its round is checked, not when it is dealt
//   - each activity keeps its own attempt, so leaving one half done to try
//     another loses nothing
//   - an activity counts as completed, and its score is added, only when the
//     student taps through to their results

import { el, announce } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { confirmDialog } from '../ui/dialog.js';
import { engineFor } from '../engines/index.js';
import { draw } from '../lib/pool.js';
import {
  topicById,
  levelOf,
  QUESTIONS_PER_ROUND,
  ROUNDS_PER_SESSION,
  QUESTIONS_PER_SESSION,
} from '../data/topics.js';
import {
  bankProgress,
  saveBankProgress,
  getAttempt,
  saveAttempt,
  recordCompletion,
  isSaved,
  toggleSaved,
} from '../lib/storage.js';

// Word order is the one activity that gives in, so nobody is stuck for ever.
const REVEAL_AFTER = 3;

// The session in memory. The review screen prefers this and falls back to the
// saved attempt, so a refresh does not lose the results.
let live = null;

export function liveSession() {
  return live;
}

function persist() {
  if (!live) return;
  saveAttempt(live.topic.id, live.type, {
    itemIds: live.items.map((item) => item.id),
    roundIndex: live.roundIndex,
    results: live.results,
    finished: live.finished,
  });
}

function buildSession(topic, type, itemIds = null) {
  const bank = topic.items[type];
  let items;
  if (itemIds) {
    const byId = new Map(bank.map((item) => [item.id, item]));
    items = itemIds.map((id) => byId.get(id)).filter(Boolean);
  } else {
    items = draw(topic.id, type, bank, QUESTIONS_PER_SESSION);
  }

  return {
    topic,
    type,
    engine: engineFor(type),
    items,
    roundIndex: 0,
    results: {},
    attempts: {},
    finished: false,
  };
}

// mode is 'new' or 'replay'. A new visit carries on the activity's unfinished
// attempt if there is one; a finished one is left alone, because starting
// again is meant to draw a fresh twelve.
export function sessionScreen({ id, type, mode = 'new' }) {
  const topic = topicById(id);
  const engine = engineFor(type);
  if (!topic || !engine || !topic.items?.[type]?.length) return go('/topics', { replace: true });

  const saved = getAttempt(topic.id, type);
  const canResume = mode !== 'replay' && saved && !saved.finished;
  const sameSession = live && live.topic.id === topic.id && live.type === type && !live.finished;

  if (mode === 'replay') {
    const source = live?.topic.id === topic.id && live.type === type ? live.items.map((i) => i.id) : saved?.itemIds;
    live = buildSession(topic, type, source || null);
  } else if (!sameSession) {
    live = canResume ? buildSession(topic, type, saved.itemIds) : buildSession(topic, type);
    if (canResume) {
      live.roundIndex = Math.min(saved.roundIndex || 0, ROUNDS_PER_SESSION - 1);
      live.results = saved.results || {};
    }
  }

  // Not enough written yet for a full session: run what there is.
  live.roundCount = Math.max(1, Math.min(ROUNDS_PER_SESSION, Math.ceil(live.items.length / QUESTIONS_PER_ROUND)));

  persist();
  renderRound();
}

function renderRound() {
  const { topic, type, engine, items, roundIndex, roundCount } = live;
  const start = roundIndex * QUESTIONS_PER_ROUND;
  const roundItems = items.slice(start, start + QUESTIONS_PER_ROUND);
  const isLastRound = roundIndex >= roundCount - 1;

  // Built fresh each round; `checkedOnce` is what keeps the counters honest.
  let checkedOnce = false;
  const questions = [];
  let round = null;
  const cards = [];

  if (engine.mode === 'per-round') {
    round = engine.createRound(roundItems, start + 1);
    const card = el('article', { class: 'qcard' }, [round.node]);
    cards.push(card);
    roundItems.forEach((item, i) => {
      questions.push({ item, feedback: round.feedbackNodes[i], card });
    });
    round.onEdit((index) => {
      if (index === undefined) questions.forEach(clearFeedback);
      else clearFeedback(questions[index]);
      updateControls();
    });
  } else {
    roundItems.forEach((item, i) => {
      const question = engine.createQuestion(item, start + i + 1);
      const feedback = el('div', { class: 'qfeedback', hidden: true });
      const card = el('article', { class: 'qcard' }, [
        el('div', { class: 'qcard-head' }, [
          el('span', { class: 'qcard-number', text: String(start + i + 1) }),
          flagButton(item),
        ]),
        question.node,
        feedback,
      ]);
      const entry = { item, question, feedback, card };
      question.onEdit(() => {
        clearFeedback(entry);
        updateControls();
      });
      cards.push(card);
      questions.push(entry);
    });
  }

  function clearFeedback(q) {
    q.feedback.hidden = true;
    if (!round) q.card.classList.remove('is-right', 'is-wrong');
  }

  function showFeedback(q, right, revealed) {
    if (!round) {
      q.card.classList.toggle('is-right', right);
      q.card.classList.toggle('is-wrong', !right);
    }
    q.feedback.hidden = false;
    q.feedback.className = `qfeedback ${right ? 'is-right' : 'is-wrong'}`;

    const parts = [
      el('p', { class: 'qfeedback-line' }, [
        el('span', { class: 'qfeedback-mark', 'aria-hidden': 'true', text: right ? '✓' : '✗' }),
        el('span', { text: right ? 'That’s right.' : 'Not quite. Try again!' }),
      ]),
    ];
    if (revealed) parts.push(el('p', { class: 'qfeedback-answer', text: `The sentence is: ${engine.label(q.item)}` }));
    if (round) parts.push(flagButton(q.item, true));
    q.feedback.replaceChildren(...parts);
  }

  function blankCount() {
    if (round) return round.blankCount();
    return questions.filter((q) => !q.question.isAnswered()).length;
  }

  function highlightBlanks() {
    if (round) {
      round.highlightBlanks();
      return;
    }
    let first = null;
    for (const q of questions) {
      const blank = !q.question.isAnswered();
      q.card.classList.toggle('needs-answer', blank);
      if (blank && !first) first = q.card;
    }
    first?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  async function check() {
    const blanks = blankCount();

    if (blanks > 0) {
      const plural = blanks === 1 ? 'question is' : 'questions are';
      const goAhead = await confirmDialog({
        title: `${blanks} ${plural} still blank`,
        message: 'You can go back and finish them, or check what you have. Blank answers will be marked wrong.',
        cancelLabel: 'Finish them',
        confirmLabel: 'Check anyway',
      });
      if (!goAhead) {
        highlightBlanks();
        announce(`${blanks} ${plural} still blank.`);
        return;
      }
    }
    for (const q of questions) q.card.classList.remove('needs-answer');

    const outcomes = round ? round.check() : questions.map((q) => q.question.check());

    let rightCount = 0;
    questions.forEach((q, i) => {
      const right = Boolean(outcomes[i]);
      const id = q.item.id;
      if (right) rightCount++;

      // Green is permanent: only ever upgrade.
      if (right) live.results[id] = true;
      else if (live.results[id] !== true) live.results[id] = false;

      let revealed = false;
      if (!right) {
        live.attempts[id] = (live.attempts[id] || 0) + 1;
        revealed = live.attempts[id] >= REVEAL_AFTER && Boolean(engine.revealsAnswer);
      }
      showFeedback(q, right, revealed);
    });

    if (!checkedOnce) {
      const bank = bankProgress(topic.id, type);
      saveBankProgress(topic.id, type, {
        answered: bank.answered + questions.length,
        firstTry: bank.firstTry + rightCount,
        // Only now, once the round is checked, do these count as practised.
        seen: [...new Set([...bank.seen, ...questions.map((q) => q.item.id)])],
      });
      checkedOnce = true;
    }

    persist();
    updateControls();
    announce(`${rightCount} of ${questions.length} right.`);
  }

  const checkBtn = el('button', { type: 'button', class: 'btn btn-primary', text: 'Check answers', onClick: check });

  const nextBtn = el('button', {
    type: 'button',
    class: 'btn btn-next',
    hidden: true,
    text: isLastRound ? 'See your results' : 'Next round',
    onClick() {
      if (isLastRound) {
        live.finished = true;
        recordCompletion(topic.id, type, {
          itemIds: live.items.map((item) => item.id),
          roundIndex: live.roundIndex,
          results: live.results,
          finished: true,
        });
        go('/review');
      } else {
        live.roundIndex += 1;
        persist();
        renderRound();
      }
    },
  });

  function updateControls() {
    const everyChecked = questions.every((q) => !q.feedback.hidden);
    nextBtn.hidden = !checkedOnce;
    checkBtn.textContent = everyChecked ? 'Check again' : 'Check answers';
  }

  updateControls();

  renderScreen({
    title: engine.name,
    subtitle: topic.title,
    backTo: `/topic/${topic.id}`,
    level: levelOf(topic),
    progress: { round: roundIndex + 1, total: roundCount },
    body: [
      el('div', { class: 'stack' }, cards),
      el('div', { class: 'actions' }, [checkBtn, nextBtn]),
    ],
  });
}

// Every question carries an Ask my teacher bookmark.
function flagButton(item, compact = false) {
  const saved = isSaved(item.id);
  const button = el('button', {
    type: 'button',
    class: `flag-btn${compact ? ' flag-btn-compact' : ''}${saved ? ' is-on' : ''}`,
    'aria-pressed': saved ? 'true' : 'false',
    'aria-label': 'Save this question to ask my teacher',
    title: 'Save this question to ask my teacher',
  }, [
    el('span', { class: 'flag-glyph', 'aria-hidden': 'true', text: '★' }),
    el('span', { class: 'flag-text', text: 'Ask my teacher' }),
  ]);

  button.addEventListener('click', () => {
    const added = toggleSaved({
      id: item.id,
      topicId: live.topic.id,
      type: live.type,
      label: live.engine.label(item),
    });
    button.classList.toggle('is-on', added);
    button.setAttribute('aria-pressed', added ? 'true' : 'false');
    announce(added ? 'Question saved' : 'Question removed');
  });

  return button;
}
