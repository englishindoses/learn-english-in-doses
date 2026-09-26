import { el, announce } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen, applySettings } from '../ui/shell.js';
import { settings, saveSettings, resetProgress, resetEverything, allProgress, summarise } from '../lib/storage.js';
import { getAccount } from '../lib/account.js';

const APP_VERSION = __APP_VERSION__;

export function settingsScreen() {
  const current = settings();
  const summary = summarise(allProgress());
  const signedIn = getAccount().kind === 'student';
  const where = signedIn ? 'your account' : 'this device';

  const body = [
    section('Reading', [
      choiceRow({
        label: 'Text size',
        description: 'Larger text on small screens.',
        value: current.textSize,
        options: [
          { value: 'normal', label: 'Normal' },
          { value: 'large', label: 'Large' },
        ],
        onChange(value) {
          saveSettings({ textSize: value });
          applySettings();
          announce(`Text size set to ${value}.`);
        },
      }),
      toggleRow({
        label: 'Reduce motion',
        description: 'Turn off the small animations.',
        value: current.reduceMotion,
        onChange(value) {
          saveSettings({ reduceMotion: value });
          applySettings();
        },
      }),
    ]),

    section('Your practice', [
      row('Progress so far', `${summary.answered} questions answered, ${summary.sessions} ${summary.sessions === 1 ? 'activity' : 'activities'} completed.`),
      row(
        'Start the question sets again',
        'Clears which questions you have seen, so every set starts fresh. Your saved questions are kept.',
        el('button', {
          type: 'button',
          class: 'btn btn-quiet btn-danger',
          text: 'Reset progress',
          onClick() {
            if (!confirm('Reset your progress? Your saved questions will be kept.')) return;
            resetProgress();
            announce('Progress reset.');
            settingsScreen();
          },
        })
      ),
      row(
        'Clear everything',
        `Removes your progress, your saved questions and these settings from ${where}.`,
        el('button', {
          type: 'button',
          class: 'btn btn-quiet btn-danger',
          text: 'Clear all',
          onClick() {
            if (!confirm(`Remove everything this app has saved on ${where}?`)) return;
            resetEverything();
            applySettings();
            announce('Everything cleared.');
            go('/');
          },
        })
      ),
    ]),

    section('About', [
      row('English in Doses', `Practice · version ${APP_VERSION}`),
      row(
        'The lessons',
        'The full lessons are on the website.',
        el('a', { class: 'btn btn-quiet', href: '../home.html', text: 'Open the website' })
      ),
      el('div', { class: 'note' }, [
        el('p', {
          text: signedIn
            ? 'Your practice is saved to your Google account, so it follows you to any phone or computer where you sign in.'
            : 'You’re using the app as a guest, so your practice is saved on this device only.',
        }),
      ]),
    ]),
  ];

  renderScreen({ title: 'Settings', backTo: 'auto', body });
}

function section(title, rows) {
  return el('section', { class: 'settings-section' }, [
    el('h2', { class: 'settings-heading', text: title }),
    el('div', { class: 'settings-card' }, rows),
  ]);
}

function row(label, description, control = null) {
  return el('div', { class: 'setting-row' }, [
    el('div', { class: 'setting-text' }, [
      el('p', { class: 'setting-label', text: label }),
      el('p', { class: 'setting-desc', text: description }),
    ]),
    control,
  ]);
}

function toggleRow({ label, description, value, onChange }) {
  const input = el('input', { type: 'checkbox', class: 'switch-input' });
  input.checked = Boolean(value);
  input.addEventListener('change', () => onChange(input.checked));

  return el('label', { class: 'setting-row' }, [
    el('div', { class: 'setting-text' }, [
      el('p', { class: 'setting-label', text: label }),
      el('p', { class: 'setting-desc', text: description }),
    ]),
    el('span', { class: 'switch' }, [input, el('span', { class: 'switch-track' })]),
  ]);
}

function choiceRow({ label, description, value, options, onChange }) {
  const buttons = options.map((option) =>
    el('button', {
      type: 'button',
      class: `segmented-btn${option.value === value ? ' is-on' : ''}`,
      text: option.label,
      'aria-pressed': option.value === value ? 'true' : 'false',
      onClick() {
        for (const b of buttons) {
          const on = b === this;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        }
        onChange(option.value);
      },
    })
  );

  return row(label, description, el('div', { class: 'segmented', role: 'group', 'aria-label': label }, buttons));
}
