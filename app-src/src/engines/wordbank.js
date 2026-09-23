// Typed gap-fill with a word box above the sentences. Matches the website's
// word-gap-fill markup, and like that activity it greys a word out once it has
// been typed somewhere.
//
// This is a per-round engine because the word box has to cover all four
// sentences at once: a bank with one word per gap would give the answers away.

import { el, shuffle } from '../lib/dom.js';
import { feedbackSlot, paintFeedback, clearFeedback, sameAnswer, normalise } from './shared.js';

export default {
  id: 'wordbank',
  mode: 'per-round',
  name: 'Write the word',
  blurb: 'Type the missing word, using the box',
  icon: '\u270f\ufe0f',

  label: (item) => item.sentence.replace('{1}', '_____'),

  createRound(items) {
    const inputs = [];
    const feedbackNodes = [];
    let editHandler = () => {};

    const wordList = el('div', { class: 'wgf-word-list' },
      shuffle(items.map((item) => item.answer)).map((word) =>
        el('span', { class: 'wgf-word', text: word })
      )
    );

    const updateWordBox = () => {
      const typed = inputs
        .map((input) => normalise(input.value))
        .filter(Boolean);

      wordList.querySelectorAll('.wgf-word').forEach((word) => {
        const at = typed.indexOf(normalise(word.textContent));
        if (at === -1) {
          word.classList.remove('used');
        } else {
          word.classList.add('used');
          typed.splice(at, 1);
        }
      });
    };

    const lines = items.map((item, index) => {
      const feedback = feedbackSlot();
      feedbackNodes.push(feedback);

      const input = el('input', {
        type: 'text',
        class: 'wgf-input',
        placeholder: '...',
        autocapitalize: 'off',
        autocomplete: 'off',
        spellcheck: 'false',
        'aria-label': `Answer ${index + 1}`,
      });

      input.addEventListener('input', () => {
        input.classList.remove('correct', 'incorrect', 'is-blank');
        clearFeedback(feedback);
        updateWordBox();
        editHandler();
      });

      inputs.push(input);

      const line = el('p', { class: 'wgf-line' }, [
        el('strong', {}, `${index + 1}.`),
        ' ',
      ]);

      const [before, after] = item.sentence.split('{1}');
      line.append(document.createTextNode(before), input, document.createTextNode(after || ''));

      return el('div', {}, [line, feedback]);
    });

    const node = el('div', { class: 'word-gap-fill-container' }, [
      el('div', { class: 'wgf-word-box' }, [
        el('p', { class: 'wgf-word-box-label', text: 'Words' }),
        wordList,
      ]),
      ...lines,
    ]);

    return {
      node,
      feedbackNodes,
      isAnswered: () => inputs.every((input) => input.value.trim() !== ''),
      blankCount: () => inputs.filter((input) => input.value.trim() === '').length,
      highlightBlanks() {
        inputs.forEach((input) => {
          if (input.value.trim() === '') input.classList.add('is-blank');
        });
      },
      check() {
        return items.map((item, index) => {
          const input = inputs[index];
          const answers = [item.answer, ...(item.alternatives || [])];
          const correct = answers.some((answer) => sameAnswer(input.value, answer));

          input.classList.toggle('correct', correct);
          input.classList.toggle('incorrect', !correct);
          paintFeedback(feedbackNodes[index], correct, correct ? "That's right" : 'Not yet - try again');
          return correct;
        });
      },
      onEdit(handler) {
        editHandler = handler;
      },
    };
  },
};
