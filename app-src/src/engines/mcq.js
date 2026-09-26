// Multiple choice: a sentence with a gap, and three or more options to pick
// from. The options are shuffled, because the written order would otherwise
// give the answer away on a repeat.

import { el, shuffle } from '../lib/dom.js';
import { paint, unpaint } from './shared.js';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default {
  id: 'mcq',
  mode: 'per-item',
  name: 'Multiple choice',
  blurb: 'Choose the correct answer',
  icon: '✔️',

  label: (item) => item.sentence,

  createQuestion(item, number) {
    const options = shuffle(item.options.map((text, i) => ({ text, correct: i === item.answer })));

    let chosen = null;
    let editHandler = () => {};

    const buttons = options.map((option, index) =>
      el('button', {
        type: 'button',
        class: 'mcq-option',
        role: 'radio',
        'aria-checked': 'false',
        onClick: () => select(index),
      }, [
        el('span', { class: 'mcq-letter', 'aria-hidden': 'true', text: LETTERS[index] }),
        el('span', { text: option.text }),
      ])
    );

    function select(index) {
      chosen = index;
      buttons.forEach((button, i) => {
        button.classList.toggle('is-selected', i === index);
        button.setAttribute('aria-checked', i === index ? 'true' : 'false');
        unpaint(button);
      });
      editHandler();
    }

    const node = el('div', { class: 'question-body' }, [
      el('p', { class: 'question-prompt', text: item.sentence }),
      el('div', { class: 'mcq-options', role: 'radiogroup', 'aria-label': `Question ${number}` }, buttons),
    ]);

    return {
      node,
      isAnswered: () => chosen !== null,
      check() {
        const right = chosen !== null && options[chosen].correct;
        if (chosen !== null) paint(buttons[chosen], right);
        return right;
      },
      onEdit(handler) {
        editHandler = handler;
      },
    };
  },
};
