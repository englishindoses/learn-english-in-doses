// My progress: the headline numbers, then every written topic in course order.

import { el } from '../lib/dom.js';
import { renderScreen } from '../ui/shell.js';
import { allProgress, practiceDays } from '../lib/storage.js';
import { statRow, courseBar, topicProgressList } from '../ui/progress.js';
import { QUESTIONS_PER_SESSION } from '../data/topics.js';

export function progressScreen() {
  const progress = allProgress();

  renderScreen({
    title: 'My progress',
    backTo: 'auto',
    body: [
      el('div', { class: 'stack' }, [statRow(progress, practiceDays()), courseBar(progress)]),
      el('section', { class: 'settings-section' }, [
        el('h2', { class: 'settings-heading', text: 'Topics' }),
        topicProgressList(progress),
      ]),
      el('div', { class: 'note' }, [
        el('p', {
          text: `An activity is complete once you have answered all ${QUESTIONS_PER_SESSION} of its questions. Start one again whenever you like. You will get different questions, and your score keeps counting.`,
        }),
      ]),
    ],
  });
}
