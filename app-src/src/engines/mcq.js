// Multiple choice. Matches the markup on the website's lesson pages:
// .question > .question-text + .options > .option[data-index] + .feedback

import { el, shuffle } from '../lib/dom.js';
import { questionCard, feedbackSlot, paintFeedback, clearFeedback } from './shared.js';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default {
  id: 'mcq',
  mode: 'per-item',
  name: 'Multiple choice',
  blurb: 'Choose the correct answer',
  icon: '\u2714\ufe0f',

  label: (item) => item.sentence,

  createQuestion(item, number) {
    // The written order would otherwise give the answer away on repeat.
    const options = shuffle(item.options.map((text, i) => ({ text, correct: i === item.answer })));

    let chosen = null;
    let editHandler = () => {};

    const feedback = feedbackSlot();

    const optionNodes = options.map((option, index) =>
      el('div', {
        class: 'option',
        dataset: { index: String(index) },
        role: 'radio',
        tabindex: '0',
        'aria-checked': 'false',
      }, [el('span', {}, `${LETTERS[index]}. ${option.text}`)])
    );

    const select = (index) => {
      chosen = index;
      optionNodes.forEach((node, i) => {
        node.classList.toggle('selected', i === index);
        node.setAttribute('aria-checked', i === index ? 'true' : 'false');
      });
      clearFeedback(feedback);
      editHandler();
    };

    optionNodes.forEach((node, index) => {
      node.addEventListener('click', () => select(index));
      node.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          select(index);
        }
      });
    });

    const node = questionCard(
      number,
      item.sentence,
      el('div', { class: 'options', role: 'radiogroup', 'aria-label': `Question ${number}` }, optionNodes),
      feedback
    );

    return {
      node,
      feedback,
      isAnswered: () => chosen !== null,
      check() {
        const correct = chosen !== null && options[chosen].correct;
        paintFeedback(feedback, correct, correct ? "That's right" : 'Not yet - try again');
        return correct;
      },
      onEdit(handler) {
        editHandler = handler;
      },
    };
  },
};
