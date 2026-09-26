// Topic picker: every level that has topics, then one expandable menu per
// section, in course order. Each topic card is drawn in its level's colours.

import { el } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { activitiesIn, progressBar } from '../ui/progress.js';
import { allProgress, completedInTopic } from '../lib/storage.js';
import { levels, sectionsIn, topicsIn, isWritten } from '../data/topics.js';

export function topicsScreen() {
  const progress = allProgress();
  const shown = levels.filter((level) => sectionsIn(level.id).length > 0);
  let first = true;

  const body = shown.map((level) =>
    el('section', { class: 'level-group', dataset: { level: level.id } }, [
      shown.length > 1 ? el('h2', { class: 'level-heading', text: level.title }) : null,
      el('div', { class: 'stack' }, sectionsIn(level.id).map((section) => {
        const menu = sectionMenu(section, progress, first);
        first = false;
        return menu;
      })),
    ])
  );

  renderScreen({
    title: 'Choose a topic',
    subtitle: 'In the same order as the website',
    backTo: '/',
    body,
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
