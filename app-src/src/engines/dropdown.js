// Gap-fill with a dropdown per gap.
//
// A native <select> is deliberate: on a phone it opens a full-screen picker
// that beats anything custom for one-handed use.

import { el, shuffle } from '../lib/dom.js';
import { sameAnswer, paint, unpaint } from './shared.js';

export default {
  id: 'dropdown',
  mode: 'per-item',
  name: 'Choose the word',
  blurb: 'Pick the right word for each gap',
  icon: '🔽',

  label: (item) => item.sentence.replace(/\{(\d+)\}/g, '_____'),

  createQuestion(item) {
    const selects = new Map();
    let editHandler = () => {};

    const line = el('p', { class: 'gf-sentence' });

    // The sentence is split on {1}, {2}... and a select dropped in at each.
    for (const part of item.sentence.split(/(\{\d+\})/)) {
      const marker = part.match(/^\{(\d+)\}$/);

      if (!marker) {
        if (part) line.append(document.createTextNode(part));
        continue;
      }

      const key = marker[1];
      const select = el('select', { class: 'gf-select', 'aria-label': `Gap ${key}` }, [
        el('option', { value: '', disabled: true, selected: true }, 'choose...'),
        ...shuffle(item.gaps[key].options).map((text) => el('option', { value: text }, text)),
      ]);

      select.addEventListener('change', () => {
        unpaint(select);
        editHandler();
      });

      selects.set(key, select);
      line.append(select);
    }

    return {
      node: el('div', { class: 'question-body' }, [line]),
      isAnswered: () => [...selects.values()].every((s) => s.value !== ''),
      check() {
        let allRight = true;
        for (const [key, select] of selects) {
          const right = sameAnswer(select.value, item.gaps[key].answer);
          paint(select, right);
          if (!right) allRight = false;
        }
        return allRight;
      },
      onEdit(handler) {
        editHandler = handler;
      },
    };
  },
};
