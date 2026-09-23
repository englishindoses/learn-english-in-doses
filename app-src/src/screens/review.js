// What the student sees at the end of twelve questions. Right or wrong for
// all twelve, a link back to the lesson, and three ways out.
//
// Prefers the session held in memory and falls back to the saved record, so
// results survive a refresh.

import { el } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { engineFor } from '../engines/index.js';
import { topicById } from '../data/topics.js';
import { savedSession } from '../lib/storage.js';
import { liveSession, startSession } from './session.js';

export function reviewScreen() {
  const session = liveSession() || savedSession();
  if (!session) return go('/topics');

  const topic = topicById(session.topicId);
  const engine = engineFor(session.type);
  if (!topic || !engine) return go('/topics');

  const bank = topic.items[session.type];
  const byId = new Map(bank.map((item) => [item.id, item]));

  const right = session.ids.filter((id) => session.results[id]).length;

  const body = el('div', { class: 'review-screen' }, [
    el('div', { class: 'review-summary' }, [
      el('p', { class: 'review-count', text: `${right} of ${session.ids.length} right` }),
      el('p', {
        class: 'review-note',
        text: right === session.ids.length
          ? 'Every one. Well done.'
          : 'Anything you got wrong is worth practising again.',
      }),
    ]),

    el('ol', { class: 'review-list' }, session.ids.map((id) => {
      const item = byId.get(id);
      const correct = Boolean(session.results[id]);
      return el('li', { class: `review-item ${correct ? 'is-right' : 'is-wrong'}` }, [
        el('span', { class: 'review-mark', 'aria-hidden': 'true', text: correct ? '✓' : '✗' }),
        el('span', { class: 'review-text', text: item ? engine.label(item) : id }),
        el('span', { class: 'visually-hidden', text: correct ? 'Right' : 'Wrong' }),
      ]);
    })),

    topic.lessons?.length
      ? el('div', { class: 'lesson-links' }, [
          el('p', { class: 'lesson-links-label', text: 'Read the lesson again' }),
          ...topic.lessons.map((lesson) =>
            el('a', { class: 'lesson-link', href: lesson.href }, lesson.label)
          ),
        ])
      : null,

    el('div', { class: 'control-buttons review-actions' }, [
      el('button', {
        class: 'submit-btn',
        type: 'button',
        onClick: () => startSession(session.topicId, session.type, { replay: true }),
      }, 'Try these again'),
      el('button', {
        class: 'restart-btn',
        type: 'button',
        onClick: () => go(`/topic/${session.topicId}`),
      }, 'Another activity'),
      el('button', {
        class: 'restart-btn',
        type: 'button',
        onClick: () => go('/topics'),
      }, 'Choose a topic'),
    ]),
  ]);

  renderScreen({
    title: 'Your results',
    subtitle: `${topic.title} - ${engine.name}`,
    backTo: `/topic/${topic.id}`,
    body,
  });
}
