// How it works, in short plain sections a learner can follow.

import { el } from '../lib/dom.js';
import { renderScreen } from '../ui/shell.js';
import { engines } from '../engines/index.js';

const SECTIONS = [
  {
    icon: '\u{1F3AF}',
    title: 'Start practising',
    text: [
      'Tap Start practising, choose a topic, then choose an activity.',
      'The topics are in the same order as the lessons on the website.',
    ],
  },
  {
    icon: '\u{1F501}',
    title: 'How an activity works',
    text: [
      'An activity has 12 questions, in 3 short rounds of 4.',
      'Answer all 4, then tap Check answers. There is no timer, so take your time.',
      'Finish all 12 and the activity is complete. Start it again whenever you like and you get different questions.',
    ],
  },
  {
    icon: '\u{1F9E9}',
    title: 'The activities',
    list: engines.map((engine) => [engine.name, `${engine.blurb.charAt(0).toLowerCase()}${engine.blurb.slice(1)}.`]),
  },
  {
    icon: '✅',
    title: 'Wrong answers',
    text: [
      'Nothing is marked against you. Change your answer and check again, as many times as you like.',
      'Once a question is marked right, it stays right.',
      'In Word order, the app shows you the sentence after three tries.',
      'The app does not tell you why an answer is wrong. Try again, or tap Ask my teacher to save the question for your next lesson.',
    ],
  },
  {
    icon: '★',
    title: 'Questions for your teacher',
    text: [
      'Not sure about a question? Tap Ask my teacher to save it.',
      'Open My questions to see your list. Show it in your next lesson, or tap Send to my teacher to send it on WhatsApp or by email.',
    ],
  },
  {
    icon: '\u{1F4C8}',
    title: 'Your progress',
    text: [
      'The home screen shows how many of your answers are correct, and how many days you practised this week.',
      'The bar counts the activities you have completed. Tap See all for every topic.',
    ],
  },
  {
    icon: '\u{1F464}',
    title: 'Signing in',
    text: [
      'Sign in with Google to keep your progress on any phone or computer. Your teacher can see your progress and saved questions.',
      'As a guest, your practice stays on this device only.',
    ],
  },
  {
    icon: '\u{1F4F2}',
    title: 'Put the app on your home screen',
    text: [
      'Tap Install the app at the bottom of the home screen, and it opens like any other app. It works without the internet too.',
    ],
  },
];

export function helpScreen() {
  renderScreen({
    title: 'How it works',
    backTo: 'auto',
    body: el('div', { class: 'stack' }, SECTIONS.map(section)),
  });
}

function section({ icon, title, text = [], list = [] }) {
  return el('section', { class: 'help-card' }, [
    el('h2', { class: 'help-title' }, [
      el('span', { class: 'help-icon', 'aria-hidden': 'true', text: icon }),
      title,
    ]),
    ...text.map((line) => el('p', { text: line })),
    list.length
      ? el('ul', { class: 'help-list' }, list.map(([name, what]) =>
          el('li', {}, [el('strong', { text: name }), ` - ${what}`])
        ))
      : null,
  ]);
}
