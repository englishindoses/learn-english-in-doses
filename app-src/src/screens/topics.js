// Topic picker: one expandable menu per section, in course order.

import { el } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { sections, topicsIn, isWritten, availableActivities } from '../data/topics.js';

export function topicsScreen() {
  const body = el('div', { class: 'topic-sections' },
    sections.map((section, index) => sectionMenu(section, index === 0))
  );

  renderScreen({
    title: 'Choose a topic',
    subtitle: 'Beginner practice',
    backTo: '/',
    body,
  });
}

function sectionMenu(section, openByDefault) {
  const list = el('ul', { class: 'topic-list' },
    topicsIn(section.id).map(topicRow)
  );

  const details = el('details', { class: 'topic-section', open: openByDefault }, [
    el('summary', { class: 'topic-section-summary' }, [
      el('span', { class: 'topic-section-title', text: section.title }),
      el('span', { class: 'topic-section-blurb', text: section.blurb }),
    ]),
    list,
  ]);

  return details;
}

function topicRow(topic) {
  const ready = isWritten(topic);

  const button = el('button', {
    class: `topic-row${ready ? '' : ' is-coming-soon'}`,
    type: 'button',
    disabled: !ready,
    onClick: ready ? () => go(`/topic/${topic.id}`) : null,
  }, [
    el('span', { class: 'topic-row-icon', 'aria-hidden': 'true', text: topic.icon || '\u{1F4D8}' }),
    el('span', { class: 'topic-row-text' }, [
      el('span', { class: 'topic-row-title', text: topic.title }),
      el('span', {
        class: 'topic-row-subtitle',
        text: ready
          ? `${availableActivities(topic).length} activities`
          : 'Coming soon',
      }),
    ]),
  ]);

  return el('li', {}, [button]);
}
