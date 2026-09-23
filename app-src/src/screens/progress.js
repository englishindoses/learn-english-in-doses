// Progress: how much of each bank has actually been practised. Counts `seen`,
// which only grows when a round is checked.

import { el } from '../lib/dom.js';
import { renderScreen } from '../ui/shell.js';
import { engineFor } from '../engines/index.js';
import { topics, isWritten, availableActivities } from '../data/topics.js';
import { bankProgress, practiceDays } from '../lib/storage.js';

export function progressScreen() {
  const written = topics.filter(isWritten);
  const days = practiceDays();

  const body = el('div', { class: 'progress-screen' }, [
    el('div', { class: 'home-progress' }, [
      el('p', { class: 'home-progress-line', text: `${days.length} ${days.length === 1 ? 'day' : 'days'} of practice recorded` }),
    ]),

    ...written.map((topic) =>
      el('section', { class: 'progress-topic' }, [
        el('h2', { class: 'progress-topic-title', text: topic.title }),
        el('ul', { class: 'progress-bank-list' },
          availableActivities(topic).map((type) => bankRow(topic, type))
        ),
      ])
    ),

    written.length === 0
      ? el('p', { class: 'empty-note', text: 'Nothing to show yet.' })
      : null,
  ]);

  renderScreen({ title: 'My progress', subtitle: 'Beginner practice', backTo: '/', body });
}

function bankRow(topic, type) {
  const engine = engineFor(type);
  const bank = topic.items[type];
  const progress = bankProgress(topic.id, type);
  const seen = progress.seen.length;
  const percent = bank.length ? Math.round((seen / bank.length) * 100) : 0;

  return el('li', { class: 'progress-bank' }, [
    el('p', { class: 'progress-bank-name', text: engine.name }),
    el('p', { class: 'progress-bank-count', text: `${seen} of ${bank.length} questions` }),
    el('span', { class: 'activity-bar' }, [
      el('span', { class: 'activity-bar-fill', style: `width: ${percent}%` }),
    ]),
  ]);
}
