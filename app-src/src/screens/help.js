import { el } from '../lib/dom.js';
import { renderScreen } from '../ui/shell.js';

export function helpScreen() {
  const body = el('div', { class: 'help-screen' }, [
    section('How a session works', [
      'Pick a topic, then pick an activity.',
      'You answer twelve questions, in three rounds of four.',
      'All four questions in a round are on screen together. You check them at the end of the round, not one at a time.',
    ]),
    section('If an answer is wrong', [
      'Nothing is marked against you. Change it and check again, as many times as you like.',
      'Once a question has been marked right, it stays right.',
      'The app does not tell you why an answer is wrong. Try again, or tap the star to save the question for your teacher.',
    ]),
    section('Saved questions', [
      'The star on each question adds it to My questions.',
      'You can show that list in class, or share it from your phone.',
    ]),
    section('Offline', [
      'The app works without an internet connection once it has loaded.',
      'You can add it to your home screen and open it like any other app.',
    ]),
  ]);

  renderScreen({ title: 'How it works', backTo: '/', body });
}

function section(title, lines) {
  return el('section', { class: 'help-section' }, [
    el('h2', { class: 'help-title', text: title }),
    ...lines.map((line) => el('p', { class: 'help-line', text: line })),
  ]);
}
