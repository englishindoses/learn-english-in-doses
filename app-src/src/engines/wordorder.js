// Word order. Tap a word to add it to the sentence, tap it again to take it
// back, or hold it and drag it to an exact position.
//
// Tap-to-place is not a fallback: it is what keeps the activity usable with a
// keyboard and a screen reader.
//
// This is the one activity that gives in: after three wrong checks the
// session screen shows the sentence, so nobody is stuck for ever.

import { el, shuffleDifferently } from '../lib/dom.js';
import { makeDraggable } from '../lib/drag.js';
import { normalise } from './shared.js';

export default {
  id: 'wordorder',
  mode: 'per-item',
  name: 'Word order',
  blurb: 'Put the words in the right order',
  icon: '🔤',
  revealsAnswer: true,

  label: (item) => item.answer,

  createQuestion(item) {
    const words = item.answer.split(' ');
    let editHandler = () => {};

    const placeholder = el('span', {
      class: 'wo-placeholder',
      text: 'Tap the words below, or hold one and drag it here',
    });
    const line = el('div', { class: 'wo-line', role: 'list', 'aria-label': 'Your sentence' }, [placeholder]);
    const bank = el('div', { class: 'wo-bank', role: 'list', 'aria-label': 'Available words' });

    const lineWords = () => [...line.querySelectorAll('.wo-word')];

    const touched = () => {
      placeholder.hidden = lineWords().length > 0;
      line.classList.remove('is-right', 'is-wrong');
      editHandler();
    };

    // `drag-item` is the class the shared drag code looks for.
    const makeChip = (word) => {
      const chip = el('button', {
        type: 'button',
        class: 'wo-word drag-item',
        text: word,
        onClick: () => {
          if (chip.parentElement === line) bank.append(chip);
          else line.append(chip);
          touched();
        },
      });

      makeDraggable(chip, {
        zonesFor: () => [line, bank],
        onDrop: (moved, zone, before) => {
          if (before && before !== moved) zone.insertBefore(moved, before);
          else zone.append(moved);
          touched();
        },
      });

      return chip;
    };

    // Never hand the sentence back already in order.
    shuffleDifferently(words).forEach((word) => bank.append(makeChip(word)));

    const accepted = [item.answer, ...(item.alternatives || [])].map(normalise);
    const given = () => normalise(lineWords().map((chip) => chip.textContent).join(' '));

    return {
      node: el('div', { class: 'question-body' }, [
        el('p', { class: 'question-context', text: item.context || 'Put the words in order' }),
        line,
        bank,
      ]),
      isAnswered: () => bank.querySelectorAll('.wo-word').length === 0,
      check() {
        const right = accepted.includes(given());
        line.classList.toggle('is-right', right);
        line.classList.toggle('is-wrong', !right);
        return right;
      },
      onEdit(handler) {
        editHandler = handler;
      },
    };
  },
};
