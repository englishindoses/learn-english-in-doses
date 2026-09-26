// Activity picker for one topic. Each card's bar is the attempt in play, not
// the question bank: twelve questions, and full when they are finished.

import { el } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { timesCompleted } from '../ui/progress.js';
import { engineFor } from '../engines/index.js';
import { topicById, availableActivities, levelOf, QUESTIONS_PER_SESSION, ROUNDS_PER_SESSION } from '../data/topics.js';
import { bankProgress, attemptAnswered } from '../lib/storage.js';

export function activitiesScreen({ id }) {
  const topic = topicById(id);
  if (!topic || !topic.items) return go('/topics', { replace: true });

  const cards = availableActivities(topic).map((type) => activityCard(topic, type));

  renderScreen({
    title: topic.title,
    subtitle: `Choose an activity - ${QUESTIONS_PER_SESSION} questions in ${ROUNDS_PER_SESSION} rounds`,
    backTo: '/topics',
    level: levelOf(topic),
    body: [
      el('div', { class: 'stack' }, cards),
      el('div', { class: 'note' }, [
        el('p', { text: 'Finish an activity and you can start it again with different questions.' }),
      ]),
      lessonLinks(topic),
    ],
  });
}

function activityCard(topic, type) {
  const engine = engineFor(type);
  if (!engine) return null;

  const bank = bankProgress(topic.id, type);
  const done = Boolean(bank.attempt?.finished);
  const answered = done ? QUESTIONS_PER_SESSION : attemptAnswered(bank.attempt);
  const percent = Math.round((answered / QUESTIONS_PER_SESSION) * 100);

  let note;
  if (done) note = 'Completed - start again for new questions';
  else if (answered) note = `${answered} of ${QUESTIONS_PER_SESSION} questions answered`;
  else note = `${QUESTIONS_PER_SESSION} questions`;

  return el('button', {
    type: 'button',
    class: `card card-activity${done ? ' is-complete' : ''}`,
    onClick: () => go(`/practice/${topic.id}/${type}`),
  }, [
    el('span', { class: 'topic-icon', 'aria-hidden': 'true', text: engine.icon }),
    el('span', { class: 'topic-text' }, [
      el('span', { class: 'card-title' }, [
        engine.name,
        done ? el('span', { class: 'tick', 'aria-label': 'Completed', text: '✓' }) : null,
      ]),
      el('span', { class: 'card-meta', text: engine.blurb }),
      el('span', { class: 'progress-track', 'aria-hidden': 'true' }, [
        el('span', { class: 'progress-fill', style: `width: ${percent}%` }),
      ]),
      el('span', { class: 'card-note' }, [
        note,
        bank.sessions ? el('span', { class: 'times-done', text: timesCompleted(bank.sessions) }) : null,
      ]),
    ]),
    el('span', { class: 'topic-go', 'aria-hidden': 'true', text: '›' }),
  ]);
}

function lessonLinks(topic) {
  if (!topic.lessons?.length) return null;

  return el('div', { class: 'note' }, [
    el('p', { text: 'Want to read the lesson first?' }),
    el('div', { class: 'actions actions-inline' },
      topic.lessons.map((lesson) =>
        el('a', { class: 'btn btn-quiet', href: lesson.href, text: `Open ${lesson.label}` })
      )
    ),
  ]);
}
