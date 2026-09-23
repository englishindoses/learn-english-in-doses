// Activity picker for one topic.

import { el } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { engineFor } from '../engines/index.js';
import { topicById, availableActivities, QUESTIONS_PER_SESSION } from '../data/topics.js';
import { bankProgress } from '../lib/storage.js';

export function activitiesScreen({ id }) {
  const topic = topicById(id);
  if (!topic) return go('/topics');

  const types = availableActivities(topic);

  const body = el('div', {}, [
    el('ul', { class: 'activity-list' }, types.map((type) => activityRow(topic, type))),
    lessonLinks(topic),
  ]);

  renderScreen({
    title: topic.title,
    subtitle: topic.subtitle,
    backTo: '/topics',
    body,
  });
}

function activityRow(topic, type) {
  const engine = engineFor(type);
  if (!engine) return null;

  const bank = topic.items[type];
  const progress = bankProgress(topic.id, type);
  const seen = progress.seen.length;
  const percent = bank.length ? Math.round((seen / bank.length) * 100) : 0;

  const button = el('button', {
    class: 'activity-row',
    type: 'button',
    onClick: () => go(`/practice/${topic.id}/${type}`),
  }, [
    el('span', { class: 'activity-row-icon', 'aria-hidden': 'true', text: engine.icon }),
    el('span', { class: 'activity-row-text' }, [
      el('span', { class: 'activity-row-title', text: engine.name }),
      el('span', { class: 'activity-row-blurb', text: engine.blurb }),
      el('span', {
        class: 'activity-row-progress',
        text: seen ? `${seen} of ${bank.length} questions practised` : `${QUESTIONS_PER_SESSION} questions, 3 rounds`,
      }),
      el('span', { class: 'activity-bar' }, [
        el('span', { class: 'activity-bar-fill', style: `width: ${percent}%` }),
      ]),
    ]),
  ]);

  return el('li', {}, [button]);
}

function lessonLinks(topic) {
  if (!topic.lessons?.length) return null;

  return el('div', { class: 'lesson-links' }, [
    el('p', { class: 'lesson-links-label', text: 'Read the lesson' }),
    ...topic.lessons.map((lesson) =>
      el('a', { class: 'lesson-link', href: lesson.href }, lesson.label)
    ),
  ]);
}
