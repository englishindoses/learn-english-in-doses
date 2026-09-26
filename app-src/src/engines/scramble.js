// Spelling scramble: the letters of a word, shuffled, and a box to type the
// word into. The hint says what the word means.

import { el, shuffleDifferently } from '../lib/dom.js';
import { sameAnswer, paint, unpaint } from './shared.js';

function scrambleLetters(word) {
  return shuffleDifferently(word.split('')).join('').toUpperCase();
}

export default {
  id: 'scramble',
  mode: 'per-item',
  name: 'Spelling',
  blurb: 'Put the letters in order',
  icon: '🔡',

  label: (item) => item.answer,

  createQuestion(item, number) {
    let editHandler = () => {};

    const input = el('input', {
      type: 'text',
      class: 'text-input',
      autocapitalize: 'off',
      autocomplete: 'off',
      spellcheck: 'false',
      'aria-label': `Answer ${number}`,
    });

    input.addEventListener('input', () => {
      unpaint(input);
      editHandler();
    });

    return {
      node: el('div', { class: 'question-body' }, [
        item.hint ? el('p', { class: 'question-context', text: item.hint }) : null,
        el('div', { class: 'ss-row' }, [
          el('span', { class: 'ss-letters', text: scrambleLetters(item.answer) }),
          el('span', { class: 'ss-arrow', 'aria-hidden': 'true', text: '→' }),
          input,
        ]),
      ]),
      isAnswered: () => input.value.trim() !== '',
      check() {
        const right = sameAnswer(input.value, item.answer);
        paint(input, right);
        return right;
      },
      onEdit(handler) {
        editHandler = handler;
      },
    };
  },
};
