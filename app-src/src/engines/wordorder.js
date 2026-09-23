// Word order. Matches the website's drag-drop markup:
// .question > .question-text + .drop-zone + .drag-items + .feedback
//
// Tap to place, tap again to take back, or drag to an exact position.
// Tap-to-place is not a fallback: it is what keeps the activity usable with a
// keyboard and a screen reader.

import { el, shuffleDifferently } from '../lib/dom.js';
import { makeDraggable } from '../lib/drag.js';
import { questionCard, feedbackSlot, paintFeedback, clearFeedback, normalise } from './shared.js';

export default {
  id: 'wordorder',
  mode: 'per-item',
  name: 'Word order',
  blurb: 'Put the words in the right order',
  icon: '\ud83d\udd24',

  label: (item) => item.answer,

  createQuestion(item, number) {
    const words = item.answer.split(' ');
    const feedback = feedbackSlot();
    let editHandler = () => {};

    const dropZone = el('div', { class: 'drop-zone', 'aria-label': 'Your sentence' });
    const bank = el('div', { class: 'drag-items', 'aria-label': 'Word bank' });

    const touched = () => {
      clearFeedback(feedback);
      dropZone.classList.remove('correct', 'incorrect');
      editHandler();
    };

    const makeChip = (word) => {
      const chip = el('div', {
        class: 'drag-item',
        tabindex: '0',
        role: 'button',
        text: word,
      });

      const place = () => {
        if (chip.parentElement === dropZone) bank.append(chip);
        else dropZone.append(chip);
        touched();
      };

      chip.addEventListener('click', place);
      chip.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          place();
        }
      });

      makeDraggable(chip, {
        zonesFor: () => [dropZone, bank],
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

    const given = () => [...dropZone.querySelectorAll('.drag-item')].map((c) => c.textContent).join(' ');

    const accepted = [item.answer, ...(item.alternatives || [])].map(normalise);

    return {
      node: questionCard(number, item.context || 'Put the words in order:', dropZone, bank, feedback),
      feedback,
      isAnswered: () => bank.querySelectorAll('.drag-item').length === 0,
      check() {
        const correct = accepted.includes(normalise(given()));
        dropZone.classList.toggle('correct', correct);
        dropZone.classList.toggle('incorrect', !correct);
        paintFeedback(feedback, correct, correct ? "That's right" : 'Not yet - try again');
        return correct;
      },
      // Word order is the one activity that gives in, so nobody is stuck.
      reveal() {
        paintFeedback(feedback, false, `The sentence is: ${item.answer}`);
      },
      onEdit(handler) {
        editHandler = handler;
      },
    };
  },
};
