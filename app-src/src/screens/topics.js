// Topic picker for one level: one expandable menu per section, in course
// order. The whole screen is drawn in the level's colours.

import { el } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { activitiesIn, progressBar } from '../ui/progress.js';
import { allProgress, completedInTopic } from '../lib/storage.js';
import { levels, sectionsIn, topicsIn, isWritten } from '../data/topics.js';

export function topicsScreen({ level: levelId }) {
  const level = levels.find((l) => l.id === levelId);
  const sections = level ? sectionsIn(level.id) : [];
  if (!sections.length) return go('/topics', { replace: true });

  const progress = allProgress();

  renderScreen({
    title: 'Choose a topic',
    subtitle: level.title,
    backTo: '/topics',
    level: level.id,
    body: el('div', { class: 'stack' },
      sections.map((section, i) => sectionMenu(section, progress, i === 0))
    ),
  });
}

function sectionMenu(section, progress, openByDefault) {
  return el('details', { class: 'topic-section', open: openByDefault }, [
    el('summary', { class: 'topic-section-summary' }, [
      el('span', { class: 'topic-text' }, [
        el('span', { class: 'topic-section-title', text: section.title }),
        el('span', { class: 'card-meta', text: section.blurb }),
      ]),
      el('span', { class: 'topic-section-chevron', 'aria-hidden': 'true', text: '›' }),
    ]),
    el('div', { class: 'stack stack-tight topic-section-list' },
      topicsIn(section.id).map((topic) => topicCard(topic, progress))
    ),
  ]);
}

function topicCard(topic, progress) {
  const ready = isWritten(topic);
  const done = ready ? completedInTopic(progress, topic.id) : 0;
  const total = ready ? activitiesIn(topic) : 0;

  const inner = [
    el('span', { class: 'topic-icon', 'aria-hidden': 'true', text: topic.icon || '\u{1F4D8}' }),
    el('span', { class: 'topic-text' }, [
      el('span', { class: 'card-title', text: topic.title }),
      el('span', { class: 'card-meta', text: topic.subtitle }),
      ready ? progressBar(done, total) : null,
      ready ? el('span', { class: 'card-note', text: `${done} of ${total} activities completed` }) : null,
    ]),
    ready
      ? el('span', { class: 'topic-go', 'aria-hidden': 'true', text: '›' })
      : el('span', { class: 'pill pill-muted', text: 'Coming soon' }),
  ];

  if (!ready) {
    return el('div', { class: 'card card-topic is-locked', 'aria-disabled': 'true' }, inner);
  }

  return el('button', {
    type: 'button',
    class: `card card-topic${done && done === total ? ' is-complete' : ''}`,
    onClick: () => go(`/topic/${topic.id}`),
  }, inner);
}
