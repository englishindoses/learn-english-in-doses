// The dashboard. The one screen with any density.

import { el } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { engineFor } from '../engines/index.js';
import { topics, topicById, isWritten } from '../data/topics.js';
import { savedSession, allProgress, practiceDays, savedQuestions } from '../lib/storage.js';
import { canInstall, isInstalled, promptInstall, onInstallAvailabilityChange } from '../lib/pwa.js';

export function homeScreen() {
  const unfinished = pickUpWhereYouLeftOff();
  const practised = Object.values(allProgress()).reduce((sum, bank) => sum + (bank.seen?.length || 0), 0);

  const body = el('div', { class: 'home-screen' }, [
    el('p', { class: 'home-greeting', text: 'Extra practice' }),

    unfinished,

    el('button', {
      class: 'home-start submit-btn',
      type: 'button',
      onClick: () => go('/topics'),
    }, 'Start practising'),

    practised > 0 ? progressBlock(practised) : firstVisitNote(),

    el('div', { class: 'home-tiles' }, [
      tile('★', 'My questions', `${savedQuestions().length} saved`, '/questions'),
      tile('\u{1F4CA}', 'My progress', `${practised} questions practised`, '/progress'),
      tile('\u{1F4DA}', 'Topics', 'Grammar and travel', '/topics'),
      tile('❓', 'How it works', 'A quick explanation', '/help'),
    ]),

    installCard(),
  ]);

  renderScreen({ title: 'Practice', subtitle: 'English in Doses', body });
}

// Chrome and Edge give us a prompt to fire; every other browser installs
// through its own menu, so those get instructions instead.
function installCard() {
  if (isInstalled()) return null;

  // Redraw the dashboard if the browser offers the prompt after this ran.
  onInstallAvailabilityChange(() => {
    if (window.location.hash.slice(1) === '/' || window.location.hash === '') homeScreen();
  });

  if (canInstall()) {
    return el('div', { class: 'install-card' }, [
      el('p', { class: 'install-card-text', text: 'Add this to your home screen and it works offline.' }),
      el('button', {
        class: 'submit-btn',
        type: 'button',
        onClick: () => promptInstall(),
      }, 'Install the app'),
    ]);
  }

  const ios = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  return el('div', { class: 'install-card' }, [
    el('p', { class: 'install-card-text', text: 'Add this to your home screen and it works offline.' }),
    el('p', {
      class: 'install-card-how',
      text: ios
        ? 'In Safari, tap the Share button, then Add to Home Screen.'
        : 'Open your browser menu and choose Add to Home Screen or Install.',
    }),
  ]);
}

function pickUpWhereYouLeftOff() {
  const session = savedSession();
  if (!session || session.finished) return null;

  const topic = topicById(session.topicId);
  const engine = engineFor(session.type);
  if (!topic || !engine) return null;

  return el('button', {
    class: 'home-resume',
    type: 'button',
    onClick: () => go(`/practice/${session.topicId}/${session.type}/resume`),
  }, [
    el('span', { class: 'home-resume-label', text: 'Pick up where you left off' }),
    el('span', { class: 'home-resume-topic', text: `${topic.title} - ${engine.name}` }),
    el('span', { class: 'home-resume-round', text: `Round ${session.round + 1} of 3` }),
  ]);
}

function progressBlock(practised) {
  const thisWeek = practiceDays().filter(withinLastWeek).length;
  const next = topics.find((topic) => isWritten(topic));

  return el('div', { class: 'home-progress' }, [
    el('p', { class: 'home-progress-line', text: `${practised} questions practised` }),
    el('p', { class: 'home-progress-line', text: `${thisWeek} ${thisWeek === 1 ? 'day' : 'days'} practised this week` }),
    next ? el('p', { class: 'home-progress-next', text: `Up next: ${next.title}` }) : null,
  ]);
}

function firstVisitNote() {
  return el('div', { class: 'home-progress' }, [
    el('p', { class: 'home-progress-line', text: 'Pick a topic, pick an activity, and answer twelve questions in three rounds of four.' }),
    el('p', { class: 'home-progress-line', text: 'It is practice, not a test. You can keep trying until an answer is right.' }),
  ]);
}

function withinLastWeek(day) {
  const then = new Date(`${day}T00:00:00`);
  const days = (Date.now() - then.getTime()) / 86400000;
  return days < 7;
}

function tile(icon, title, blurb, path) {
  return el('button', { class: 'home-tile', type: 'button', onClick: () => go(path) }, [
    el('span', { class: 'home-tile-icon', 'aria-hidden': 'true', text: icon }),
    el('span', { class: 'home-tile-title', text: title }),
    el('span', { class: 'home-tile-blurb', text: blurb }),
  ]);
}
