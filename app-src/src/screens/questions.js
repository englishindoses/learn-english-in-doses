// My questions: the list built from the Ask my teacher bookmarks. The student
// can show it in class, push it through the phone's own share menu, or, with
// no share menu, copy it to the clipboard.

import { el, announce } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { engineFor } from '../engines/index.js';
import { topicById } from '../data/topics.js';
import { savedQuestions, toggleSaved, clearSavedQuestions } from '../lib/storage.js';

export function questionsScreen() {
  const list = savedQuestions();

  const body = list.length === 0
    ? el('p', { class: 'empty-note', text: 'No saved questions yet. Tap the star on any question to save it for your teacher.' })
    : el('div', {}, [
        el('ul', { class: 'saved-list' }, list.map(savedRow)),
        el('div', { class: 'control-buttons' }, [
          el('button', { class: 'submit-btn', type: 'button', onClick: () => share(list) }, 'Share this list'),
          el('button', {
            class: 'restart-btn',
            type: 'button',
            onClick: () => {
              clearSavedQuestions();
              questionsScreen();
            },
          }, 'Clear the list'),
        ]),
      ]);

  renderScreen({
    title: 'My questions',
    subtitle: 'To ask your teacher',
    backTo: '/',
    body,
  });
}

function savedRow(entry) {
  const topic = topicById(entry.topicId);
  const engine = engineFor(entry.type);

  return el('li', { class: 'saved-item' }, [
    el('div', { class: 'saved-item-text' }, [
      el('p', { class: 'saved-item-question', text: entry.text }),
      el('p', {
        class: 'saved-item-source',
        text: [topic?.title, engine?.name].filter(Boolean).join(' - '),
      }),
    ]),
    el('button', {
      class: 'saved-item-remove',
      type: 'button',
      'aria-label': 'Remove this question',
      onClick: () => {
        toggleSaved(entry);
        questionsScreen();
      },
    }, '✕'),
  ]);
}

async function share(list) {
  const text = ['Questions to ask my teacher:', '', ...list.map((entry, i) => `${i + 1}. ${entry.text}`)].join('\n');

  if (navigator.share) {
    try {
      await navigator.share({ title: 'My questions', text });
      return;
    } catch {
      // Dismissed, or sharing is not allowed here. Fall through to the copy.
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    announce('List copied');
  } catch {
    announce('Could not copy the list');
  }
}
