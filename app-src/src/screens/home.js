// The dashboard: a welcome, one big way into practice, clear progress, and
// quick links to everything else.

import { el } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { installCard } from '../ui/install.js';
import { avatar, firstName } from '../ui/avatar.js';
import { welcome } from '../ui/greetings.js';
import { activitiesIn, progressBar, statRow, courseBar } from '../ui/progress.js';
import { engineFor } from '../engines/index.js';
import { getAccount, logOut } from '../lib/account.js';
import {
  allProgress,
  summarise,
  getAttempt,
  lastActivity,
  attemptAnswered,
  savedQuestions,
  practiceDays,
  completedInTopic,
} from '../lib/storage.js';
import {
  topics,
  topicById,
  isWritten,
  levelOf,
  sectionLabel,
  ROUNDS_PER_SESSION,
  QUESTIONS_PER_SESSION,
} from '../data/topics.js';

export function homeScreen() {
  const account = getAccount();
  const progress = allProgress();
  const answered = summarise(progress).answered;

  const body = [greeting(account)];

  const resume = resumeCard(unfinished());
  body.push(el('div', { class: 'stack' }, [resume, startButton(Boolean(resume))]));

  body.push(
    el('section', { class: 'dash-section' }, [
      el('div', { class: 'dash-heading' }, [
        el('h2', { text: 'Your progress' }),
        answered > 0 ? el('a', { href: '#/progress', text: 'See all' }) : null,
      ]),
      answered > 0
        ? el('div', { class: 'stack' }, [
            statRow(progress, practiceDays()),
            courseBar(progress),
            upNext(progress),
          ])
        : el('div', { class: 'note' }, [
            el('p', {
              text: `Each activity has ${QUESTIONS_PER_SESSION} questions, in ${ROUNDS_PER_SESSION} rounds of 4. It is practice, not a test, so you can keep trying until an answer is right. Not sure about a question? Save it to ask your teacher.`,
            }),
          ]),
    ])
  );

  const questionCount = savedQuestions().length;
  body.push(
    el('section', { class: 'dash-section' }, [
      el('div', { class: 'tile-grid' }, [
        tile('\u{1F4D6}', 'How it works', () => go('/help')),
        tile('★', 'My questions', () => go('/questions'), questionCount || null),
        tile('\u{1F464}', 'Profile', () => go('/profile')),
        tile('⚙', 'Settings', () => go('/settings')),
      ]),
    ])
  );

  if (account.isTeacher) {
    body.push(
      el('button', { type: 'button', class: 'card dash-card', onClick: () => go('/students') }, [
        el('span', { class: 'card-icon', 'aria-hidden': 'true', text: '\u{1F465}' }),
        el('span', { class: 'topic-text' }, [
          el('span', { class: 'card-title', text: 'Your students' }),
          el('span', { class: 'card-meta', text: 'Progress and saved questions' }),
        ]),
        el('span', { class: 'topic-go', 'aria-hidden': 'true', text: '›' }),
      ])
    );
  }

  if (account.kind === 'guest') body.push(guestNote());

  body.push(installCard());

  renderScreen({ title: 'Practice', subtitle: 'English in Doses', body });
}

function greeting(account) {
  const { greeting: hello, question } = welcome(firstName(account.student?.name));
  return el('div', { class: 'greeting' }, [
    avatar(account.student || {}, 'lg'),
    el('div', {}, [
      el('p', { class: 'greeting-hello', text: hello }),
      el('p', { class: 'greeting-line', text: question }),
    ]),
  ]);
}

// The activity they were last on, if they did not finish it.
function unfinished() {
  const last = lastActivity();
  if (!last) return null;
  const attempt = getAttempt(last.topicId, last.type);
  if (!attempt || attempt.finished) return null;
  return { ...last, attempt };
}

function resumeCard(saved) {
  if (!saved) return null;
  const topic = topicById(saved.topicId);
  const engine = engineFor(saved.type);
  if (!topic || !engine) return null;

  const answered = attemptAnswered(saved.attempt);

  return el('button', {
    type: 'button',
    class: 'card card-resume',
    dataset: { level: levelOf(topic) || '' },
    onClick: () => go(`/practice/${saved.topicId}/${saved.type}`),
  }, [
    el('span', { class: 'card-eyebrow', text: 'Pick up where you left off' }),
    el('span', { class: 'card-title', text: `${topic.title} - ${engine.name}` }),
    el('span', {
      class: 'card-meta',
      text: answered
        ? `${answered} of ${QUESTIONS_PER_SESSION} questions answered`
        : `Round ${Math.min((saved.attempt.roundIndex || 0) + 1, ROUNDS_PER_SESSION)} of ${ROUNDS_PER_SESSION}`,
    }),
  ]);
}

function startButton(hasResume) {
  return el('button', { type: 'button', class: 'start-btn', onClick: () => go('/topics') }, [
    el('span', { class: 'start-btn-icon', 'aria-hidden': 'true', text: '▶' }),
    el('span', { class: 'start-btn-text' }, [
      el('span', { class: 'start-btn-title', text: hasResume ? 'Start something new' : 'Start practising' }),
      el('span', { class: 'start-btn-meta', text: 'Choose a topic, then an activity' }),
    ]),
  ]);
}

// The first topic, in course order, with an activity still to complete.
function upNext(progress) {
  const topic = topics.find((t) => isWritten(t) && completedInTopic(progress, t.id) < activitiesIn(t));
  if (!topic) return null;
  const done = completedInTopic(progress, topic.id);
  const total = activitiesIn(topic);

  return el('button', {
    type: 'button',
    class: 'card card-topic',
    dataset: { level: levelOf(topic) || '' },
    onClick: () => go(`/topic/${topic.id}`),
  }, [
    el('span', { class: 'topic-icon', 'aria-hidden': 'true', text: topic.icon || '\u{1F4D8}' }),
    el('span', { class: 'topic-text' }, [
      el('span', { class: 'card-eyebrow', text: `Up next · ${sectionLabel(topic)}` }),
      el('span', { class: 'card-title', text: topic.title }),
      progressBar(done, total),
      el('span', { class: 'card-meta', text: `${done} of ${total} activities completed` }),
    ]),
    el('span', { class: 'topic-go', 'aria-hidden': 'true', text: '›' }),
  ]);
}

function tile(icon, label, onClick, badge = null) {
  return el('button', { type: 'button', class: 'tile', onClick }, [
    el('span', { class: 'tile-icon', 'aria-hidden': 'true', text: icon }),
    el('span', { class: 'tile-label', text: label }),
    badge ? el('span', { class: 'tile-badge', 'aria-label': `${badge} saved`, text: String(badge) }) : null,
  ]);
}

function guestNote() {
  return el('div', { class: 'note note-action' }, [
    el('p', {
      text: 'You’re practising as a guest, so your progress is saved on this device only. Sign in to keep it on any phone or computer.',
    }),
    el('button', {
      type: 'button',
      class: 'btn btn-primary',
      text: 'Sign in with Google',
      onClick: async () => {
        await logOut(); // leaves guest mode; their practice stays on the device
        window.location.replace(window.location.pathname);
      },
    }),
  ]);
}
