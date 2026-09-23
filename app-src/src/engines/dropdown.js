// Gap-fill with a dropdown per gap. Matches the website's drop-down activity:
// .dropdown-activity > .dropdown-sentence > .sentence-number + select.gap-dropdown
//
// A native <select> is deliberate: on a phone it opens a full-screen picker
// that beats anything custom for one-handed use.

import { el, shuffle } from '../lib/dom.js';
import { feedbackSlot, paintFeedback, clearFeedback, sameAnswer } from './shared.js';

export default {
  id: 'dropdown',
  mode: 'per-item',
  name: 'Choose the word',
  blurb: 'Pick the right word for each gap',
  icon: '\ud83d\udd3d',

  label: (item) => item.sentence.replace(/\{(\d+)\}/g, '_____'),

  createQuestion(item, number) {
    const feedback = feedbackSlot();
    const selects = new Map();
    let editHandler = () => {};

    const sentence = el('div', { class: 'dropdown-sentence' }, [
      el('span', { class: 'sentence-number', text: String(number) }),
    ]);

    // The sentence is split on {1}, {2}... and a select dropped in at each.
    const parts = item.sentence.split(/(\{\d+\})/);

    for (const part of parts) {
      const marker = part.match(/^\{(\d+)\}$/);

      if (!marker) {
        if (part) sentence.append(document.createTextNode(part));
        continue;
      }

      const key = marker[1];
      const gap = item.gaps[key];

      const select = el('select', {
        class: 'gap-dropdown',
        'aria-label': `Gap ${key}`,
      }, [
        el('option', { value: '', disabled: true, selected: true }, 'Choose...'),
        ...shuffle(gap.options).map((text) => el('option', { value: text }, text)),
      ]);

      select.addEventListener('change', () => {
        clearFeedback(feedback);
        editHandler();
      });

      selects.set(key, select);
      sentence.append(select);
    }

    return {
      node: el('div', { class: 'dropdown-activity' }, [sentence, feedback]),
      feedback,
      isAnswered: () => [...selects.values()].every((s) => s.value !== ''),
      check() {
        let correct = true;
        for (const [key, select] of selects) {
          if (!sameAnswer(select.value, item.gaps[key].answer)) correct = false;
        }
        paintFeedback(feedback, correct, correct ? "That's right" : 'Not yet - try again');
        return correct;
      },
      onEdit(handler) {
        editHandler = handler;
      },
    };
  },
};
