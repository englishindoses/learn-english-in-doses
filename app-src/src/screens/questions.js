// My questions: the list built from the Ask my teacher bookmarks. The student
// can show it in class, or send it through the phone's own share menu, so they
// pick WhatsApp or email and choose the teacher themselves. With no share
// menu, usually on a laptop, the list is copied to paste instead.

import { el, announce } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { engineFor } from '../engines/index.js';
import { topicById } from '../data/topics.js';
import { savedQuestions, removeSaved, clearSavedQuestions } from '../lib/storage.js';

export function questionsScreen() {
  const list = savedQuestions();

  if (!list.length) {
    renderScreen({
      title: 'My questions',
      subtitle: 'To ask your teacher',
      backTo: 'auto',
      body: el('div', { class: 'empty' }, [
        el('p', { class: 'empty-icon', 'aria-hidden': 'true', text: '★' }),
        el('p', { class: 'empty-title', text: 'Nothing saved yet' }),
        el('p', {
          class: 'empty-text',
          text: 'While you practise, tap Ask my teacher on any question you are not sure about. It will be waiting here for your next lesson.',
        }),
        el('button', { type: 'button', class: 'btn btn-primary', text: 'Start practising', onClick: () => go('/topics') }),
      ]),
    });
    return;
  }

  const rows = list.map((entry) => {
    const topic = topicById(entry.topicId);
    const engine = engineFor(entry.type);

    return el('article', { class: 'question-row' }, [
      el('div', { class: 'question-row-body' }, [
        el('p', { class: 'question-row-meta' }, [
          topic ? el('span', { class: 'pill', text: topic.title }) : null,
          engine ? el('span', { class: 'pill pill-muted', text: engine.name }) : null,
        ]),
        el('p', { class: 'question-row-text', text: entry.label }),
      ]),
      el('button', {
        type: 'button',
        class: 'icon-btn',
        'aria-label': 'Remove this question',
        title: 'Remove',
        text: '✕',
        onClick() {
          removeSaved(entry.id);
          announce('Question removed');
          questionsScreen();
        },
      }),
    ]);
  });

  renderScreen({
    title: 'My questions',
    subtitle: `${list.length} saved to ask about`,
    backTo: 'auto',
    body: [
      el('div', { class: 'note' }, [
        el('p', { text: 'Send this list to your teacher, or show it to them in your next lesson.' }),
      ]),
      sendBlock(list),
      el('div', { class: 'stack stack-tight' }, rows),
      el('div', { class: 'actions' }, [
        el('button', {
          type: 'button',
          class: 'btn btn-quiet btn-danger',
          text: 'Clear the whole list',
          onClick() {
            if (!confirm('Remove every saved question?')) return;
            clearSavedQuestions();
            announce('List cleared');
            questionsScreen();
          },
        }),
      ]),
    ],
  });
}

// The list as plain text, laid out to read well in a message.
function buildMessage(list) {
  const lines = ['Questions to ask my teacher', ''];
  list.forEach((entry, i) => {
    const where = [topicById(entry.topicId)?.title, engineFor(entry.type)?.name].filter(Boolean).join(' - ');
    lines.push(`${i + 1}. ${where}`);
    lines.push(`   ${entry.label}`);
    lines.push('');
  });
  return lines.join('\n').trim();
}

function sendBlock(list) {
  const status = el('p', { class: 'share-status', role: 'status', hidden: true });
  const manual = el('textarea', {
    class: 'share-text',
    readonly: true,
    rows: '8',
    'aria-label': 'Your questions, ready to copy',
    hidden: true,
  });

  async function send() {
    const text = buildMessage(list);
    status.hidden = true;
    manual.hidden = true;

    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (error) {
        // Closing the share menu without choosing an app is not a problem.
        if (error?.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Copied. Open WhatsApp or your email, choose your teacher and paste the message.';
    } catch {
      status.textContent = 'This device would not copy the list. Select the text below and copy it.';
      manual.value = text;
      manual.hidden = false;
    }
    status.hidden = false;
    announce(status.textContent);
  }

  return el('div', { class: 'share-block' }, [
    el('button', { type: 'button', class: 'btn btn-primary', text: 'Send to my teacher', onClick: send }),
    status,
    manual,
  ]);
}
