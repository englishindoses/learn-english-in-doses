// Level picker: the first step after Start practising. A level with no topics
// yet is shown as Coming soon.

import { el } from '../lib/dom.js';
import { go } from '../lib/router.js';
import { renderScreen } from '../ui/shell.js';
import { levels, sectionsIn } from '../data/topics.js';

export function levelsScreen() {
  renderScreen({
    title: 'Choose a level',
    backTo: '/',
    body: el('div', { class: 'stack' }, levels.map(levelCard)),
  });
}

function levelCard(level) {
  const sections = sectionsIn(level.id);
  const ready = sections.length > 0;

  const inner = [
    el('span', { class: 'level-dot', 'aria-hidden': 'true' }),
    el('span', { class: 'topic-text' }, [
      el('span', { class: 'card-title', text: level.title }),
      el('span', { class: 'card-meta', text: ready ? sections.map((s) => s.title).join(' and ') : 'No topics yet' }),
    ]),
    ready
      ? el('span', { class: 'topic-go', 'aria-hidden': 'true', text: '›' })
      : el('span', { class: 'pill pill-muted', text: 'Coming soon' }),
  ];

  if (!ready) {
    return el('div', { class: 'card card-topic card-level is-locked', 'aria-disabled': 'true', dataset: { level: level.id } }, inner);
  }

  return el('button', {
    type: 'button',
    class: 'card card-topic card-level',
    dataset: { level: level.id },
    onClick: () => go(`/topics/${level.id}`),
  }, inner);
}
