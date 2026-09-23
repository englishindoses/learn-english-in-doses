// Spelling scramble. Matches the website's markup:
// .spelling-scramble-container > .ss-item > .ss-number + .ss-scrambled + .ss-arrow + .ss-input

import { el, shuffleDifferently } from '../lib/dom.js';
import { feedbackSlot, paintFeedback, clearFeedback, sameAnswer } from './shared.js';

function scrambleLetters(word) {
  return shuffleDifferently(word.split('')).join('').toUpperCase();
}

export default {
  id: 'scramble',
  mode: 'per-item',
  name: 'Spelling',
  blurb: 'Put the letters in order',
  icon: '\ud83d\udd21',

  label: (item) => item.answer,

  createQuestion(item, number) {
    const feedback = feedbackSlot();
    let editHandler = () => {};

    const input = el('input', {
      type: 'text',
      class: 'ss-input',
      placeholder: '...',
      autocapitalize: 'off',
      autocomplete: 'off',
      spellcheck: 'false',
      'aria-label': `Answer ${number}`,
    });

    input.addEventListener('input', () => {
      input.classList.remove('correct', 'incorrect');
      clearFeedback(feedback);
      editHandler();
    });

    const item_ = el('div', { class: 'ss-item' }, [
      el('span', { class: 'ss-number', text: `${number}.` }),
      el('span', { class: 'ss-scrambled', text: scrambleLetters(item.answer) }),
      el('span', { class: 'ss-arrow', 'aria-hidden': 'true', text: '\u2192' }),
      input,
    ]);

    return {
      node: el('div', { class: 'spelling-scramble-container' }, [
        item.hint ? el('p', { class: 'question-text', text: item.hint }) : null,
        item_,
        feedback,
      ]),
      feedback,
      isAnswered: () => input.value.trim() !== '',
      check() {
        const correct = sameAnswer(input.value, item.answer);
        input.classList.toggle('correct', correct);
        input.classList.toggle('incorrect', !correct);
        paintFeedback(feedback, correct, correct ? "That's right" : 'Not yet - try again');
        return correct;
      },
      onEdit(handler) {
        editHandler = handler;
      },
    };
  },
};
