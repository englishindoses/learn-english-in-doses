// Progress pieces shared by the dashboard, the progress screen and the
// teacher's view of a student.
//
// Progress is counted in activities completed, not questions met: an activity
// is twelve questions, the student finishes it, and it counts. The score
// alongside is how many of the questions they have finished with stand correct.

import { el } from '../lib/dom.js';
import { currentScore, completedInTopic, daysThisWeek } from '../lib/storage.js';
import { topics, isWritten, availableActivities, levelOf, sectionLabel } from '../data/topics.js';

// How many activities a topic offers.
export function activitiesIn(topic) {
  return availableActivities(topic).length;
}

// "Completed once", "Completed twice", "Completed 3 times".
export function timesCompleted(n) {
  if (!n) return '';
  if (n === 1) return 'Completed once';
  if (n === 2) return 'Completed twice';
  return `Completed ${n} times`;
}

export function progressBar(value, total) {
  const percent = total ? Math.round((value / total) * 100) : 0;
  return el('span', { class: 'bar', role: 'img', 'aria-label': `${percent}% complete` }, [
    el('span', { class: 'bar-fill', style: `width: ${percent}%` }),
  ]);
}

function stat(value, label) {
  return el('div', { class: 'stat' }, [
    el('span', { class: 'stat-value', text: String(value) }),
    el('span', { class: 'stat-label', text: label }),
  ]);
}

// The headline numbers: how well it is going, and how often.
export function statRow(progress, days) {
  const score = currentScore(progress);
  return el('div', { class: 'stat-row' }, [
    stat(score === null ? '—' : `${score}%`, 'answers correct'),
    stat(`${daysThisWeek(days)}/7`, 'days practised this week'),
  ]);
}

// One bar for every written topic: activities completed.
export function courseBar(progress) {
  const written = topics.filter(isWritten);
  const total = written.reduce((sum, t) => sum + activitiesIn(t), 0);
  const done = written.reduce((sum, t) => sum + completedInTopic(progress, t.id), 0);

  return el('div', { class: 'course-bar' }, [
    el('p', { class: 'course-bar-label' }, [
      el('span', { text: 'All topics' }),
      el('strong', { text: `${done} of ${total} activities` }),
    ]),
    progressBar(done, total),
  ]);
}

// One row per written topic, in course order, each in its level's colours.
export function topicProgressList(progress) {
  return el('div', { class: 'settings-card progress-list' }, topics.filter(isWritten).map((topic) => {
    const done = completedInTopic(progress, topic.id);
    const total = activitiesIn(topic);
    return el('div', { class: 'progress-row', dataset: { level: levelOf(topic) || '' } }, [
      el('span', { class: 'topic-icon', 'aria-hidden': 'true', text: topic.icon || '\u{1F4D8}' }),
      el('div', { class: 'topic-text' }, [
        el('p', { class: 'progress-title' }, [
          el('span', { class: 'progress-lesson', text: sectionLabel(topic) }),
          ` ${topic.title}`,
        ]),
        progressBar(done, total),
        el('p', { class: 'card-meta', text: `${done} of ${total} activities completed` }),
      ]),
    ]);
  }));
}
