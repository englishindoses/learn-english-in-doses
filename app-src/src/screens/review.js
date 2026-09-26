// What the student sees at the end of twelve questions: right or wrong for
// all twelve, a link back to the lesson, and three ways out.
//
// Prefers the session held in memory and falls back to the last activity's
// finished attempt, so results survive a refresh.

import { el, announce } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { engineFor } from '../engines/index.js';
import { topicById, levelOf } from '../data/topics.js';
import { getAttempt, lastActivity, isSaved, toggleSaved } from '../lib/storage.js';
import { liveSession } from './session.js';

export function reviewScreen() {
  const session = resolveSession();
  if (!session) return go('/topics', { replace: true });

  const { topic, type, items, results } = session;
  const engine = engineFor(type);

  const right = items.filter((item) => results[item.id]).length;
  const total = items.length;

  const rows = items.map((item, index) => {
    const correct = Boolean(results[item.id]);
    return el('article', { class: `review-row ${correct ? 'is-right' : 'is-wrong'}` }, [
      el('div', { class: 'review-head' }, [
        el('span', { class: 'review-number', text: String(index + 1) }),
        el('span', { class: 'review-mark', 'aria-label': correct ? 'Right' : 'Wrong', text: correct ? '✓' : '✗' }),
      ]),
      el('div', { class: 'review-body' }, [
        el('p', { class: 'review-text', text: engine.label(item) }),
      ]),
      reviewFlag(item, topic.id, type, engine),
    ]);
  });

  renderScreen({
    title: 'Your results',
    subtitle: `${topic.title} - ${engine.name}`,
    backTo: `/topic/${topic.id}`,
    level: levelOf(topic),
    body: [
      el('div', { class: 'score' }, [
        el('span', { class: 'score-value', text: `${right}/${total}` }),
        el('span', {
          class: 'score-label',
          text: right === total ? 'Every one. Well done.' : 'Anything you got wrong is worth practising again.',
        }),
      ]),
      el('div', { class: 'stack stack-tight' }, rows),
      topic.lessons?.length
        ? el('div', { class: 'note' }, [
            el('p', { text: 'Want to go back over the lesson?' }),
            el('div', { class: 'actions actions-inline' },
              topic.lessons.map((lesson) =>
                el('a', { class: 'btn btn-quiet', href: lesson.href, text: `Open ${lesson.label}` })
              )
            ),
          ])
        : null,
      el('div', { class: 'actions actions-stacked' }, [
        el('button', {
          type: 'button',
          class: 'btn btn-primary',
          text: 'Try these again',
          onClick: () => go(`/practice/${topic.id}/${type}/replay`),
        }),
        el('button', { type: 'button', class: 'btn', text: 'Another activity', onClick: () => go(`/topic/${topic.id}`) }),
        el('button', { type: 'button', class: 'btn btn-quiet', text: 'Choose a topic', onClick: () => go('/topics') }),
      ]),
    ],
  });
}

function resolveSession() {
  const live = liveSession();
  if (live && live.finished && live.items.length) {
    return { topic: live.topic, type: live.type, items: live.items, results: live.results };
  }

  // Coming back after a refresh: rebuild the last activity's finished attempt.
  const last = lastActivity();
  if (!last) return null;

  const saved = getAttempt(last.topicId, last.type);
  const topic = topicById(last.topicId);
  if (!saved || !saved.finished || !topic?.items?.[last.type]) return null;

  const byId = new Map(topic.items[last.type].map((item) => [item.id, item]));
  const items = (saved.itemIds || []).map((id) => byId.get(id)).filter(Boolean);
  if (!items.length || !engineFor(last.type)) return null;

  return { topic, type: last.type, items, results: saved.results || {} };
}

function reviewFlag(item, topicId, type, engine) {
  const saved = isSaved(item.id);
  const button = el('button', {
    type: 'button',
    class: `flag-btn flag-btn-icon${saved ? ' is-on' : ''}`,
    'aria-pressed': saved ? 'true' : 'false',
    'aria-label': 'Save this question to ask my teacher',
    title: 'Save this question to ask my teacher',
  }, [el('span', { class: 'flag-glyph', 'aria-hidden': 'true', text: '★' })]);

  button.addEventListener('click', () => {
    const added = toggleSaved({ id: item.id, topicId, type, label: engine.label(item) });
    button.classList.toggle('is-on', added);
    button.setAttribute('aria-pressed', added ? 'true' : 'false');
    announce(added ? 'Question saved' : 'Question removed');
  });
  return button;
}
