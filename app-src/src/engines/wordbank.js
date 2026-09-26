// Typed gap-fill with a word box above the sentences. Like the website's
// word gap-fill, a word is greyed out once it has been typed somewhere.
//
// This is a per-round engine because the word box has to cover all four
// sentences at once: a box with one word per gap would give the answers away.

import { el, shuffle } from '../lib/dom.js';
import { sameAnswer, normalise, paint, unpaint } from './shared.js';

export default {
  id: 'wordbank',
  mode: 'per-round',
  name: 'Write the word',
  blurb: 'Type the missing word, using the box',
  icon: '✏️',

  label: (item) => item.sentence.replace('{1}', '_____'),

  createRound(items, firstNumber = 1) {
    const inputs = [];
    const feedbackNodes = [];
    let editHandler = () => {};

    const wordList = el('div', { class: 'wb-words' },
      shuffle(items.map((item) => item.answer)).map((word) => el('span', { class: 'wb-word', text: word }))
    );

    const updateWordBox = () => {
      const typed = inputs.map((input) => normalise(input.value)).filter(Boolean);
      wordList.querySelectorAll('.wb-word').forEach((word) => {
        const at = typed.indexOf(normalise(word.textContent));
        word.classList.toggle('is-used', at !== -1);
        if (at !== -1) typed.splice(at, 1);
      });
    };

    const lines = items.map((item, index) => {
      const feedback = el('div', { class: 'qfeedback', hidden: true });
      feedbackNodes.push(feedback);

      const input = el('input', {
        type: 'text',
        class: 'text-input',
        autocapitalize: 'off',
        autocomplete: 'off',
        spellcheck: 'false',
        'aria-label': `Answer ${firstNumber + index}`,
      });

      input.addEventListener('input', () => {
        unpaint(input);
        updateWordBox();
        editHandler(index);
      });

      inputs.push(input);

      const [before, after] = item.sentence.split('{1}');
      const sentence = el('p', { class: 'gf-sentence' }, [before, input, after || '']);

      return el('div', { class: 'wb-line' }, [
        el('div', { class: 'wb-line-row' }, [
          el('span', { class: 'qcard-number', text: String(firstNumber + index) }),
          sentence,
        ]),
        feedback,
      ]);
    });

    const node = el('div', { class: 'question-body' }, [
      el('div', { class: 'wb-box' }, [
        el('p', { class: 'wb-box-label', text: 'Words' }),
        wordList,
      ]),
      el('div', { class: 'wb-lines' }, lines),
    ]);

    return {
      node,
      feedbackNodes,
      isAnswered: () => inputs.every((input) => input.value.trim() !== ''),
      blankCount: () => inputs.filter((input) => input.value.trim() === '').length,
      highlightBlanks() {
        inputs.forEach((input) => input.classList.toggle('is-blank', input.value.trim() === ''));
        inputs.find((input) => input.value.trim() === '')?.focus();
      },
      check() {
        return items.map((item, index) => {
          const answers = [item.answer, ...(item.alternatives || [])];
          const right = answers.some((answer) => sameAnswer(inputs[index].value, answer));
          paint(inputs[index], right);
          return right;
        });
      },
      // The handler is told which sentence changed.
      onEdit(handler) {
        editHandler = handler;
      },
    };
  },
};
