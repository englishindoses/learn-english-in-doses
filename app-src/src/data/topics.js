// The topic list and the session constants.
//
// Order follows the website's index pages, which are the source of truth for
// lesson order: grammar/beginner/beginner-grammar.html and
// travel/beginner-travel/travel-english.html. A topic with no `items` is
// listed as Coming soon.

import presentSimple from './present-simple.js';

export const QUESTIONS_PER_ROUND = 4;
export const ROUNDS_PER_SESSION = 3;
export const QUESTIONS_PER_SESSION = QUESTIONS_PER_ROUND * ROUNDS_PER_SESSION;

// An activity type needs at least this many written questions to be offered.
const MINIMUM_BANK = QUESTIONS_PER_ROUND;

// The three levels, in course order. A level's id is also its colour scheme:
// anything carrying data-level="beginner" is drawn in the beginner colours.
export const levels = [
  { id: 'beginner', title: 'Beginner' },
  { id: 'intermediate', title: 'Intermediate' },
  { id: 'advanced', title: 'Advanced' },
];

// Every section belongs to one level, and a topic takes its level from its
// section. An intermediate grammar section needs its own id, such as
// 'intermediate-grammar', because ids are shared across levels.
export const sections = [
  { id: 'grammar', level: 'beginner', title: 'Grammar', blurb: 'Beginner grammar practice' },
  { id: 'travel', level: 'beginner', title: 'Travel English', blurb: 'English for trips and holidays' },
];

// Topics still to be written. They appear greyed out, in the right place in
// the order, so the course shape is visible from the start.
const placeholders = [
  { id: 'subject-pronouns-be', section: 'grammar', order: 1, title: 'Subject Pronouns and Be', subtitle: 'I am, you are, he is' },
  { id: 'articles', section: 'grammar', order: 2, title: 'Articles', subtitle: 'a, an and the' },
  { id: 'singular-plural-nouns', section: 'grammar', order: 3, title: 'Singular and Plural Nouns', subtitle: 'One thing or more than one' },
  { id: 'do-does-questions', section: 'grammar', order: 5, title: 'Do and Does Questions', subtitle: 'Asking about habits' },
  { id: 'present-continuous', section: 'grammar', order: 6, title: 'Present Continuous', subtitle: 'What is happening now' },
  { id: 'possessives', section: 'grammar', order: 7, title: 'Possessives', subtitle: 'my, your, and the apostrophe' },
  { id: 'countable-uncountable', section: 'grammar', order: 8, title: 'Countable and Uncountable', subtitle: 'some, any, much, many' },
  { id: 'past-simple', section: 'grammar', order: 9, title: 'Past Simple', subtitle: 'Talking about yesterday' },
  { id: 'prepositions-time-place', section: 'grammar', order: 10, title: 'Prepositions of Time and Place', subtitle: 'in, on and at' },
  { id: 'there-is-are', section: 'grammar', order: 11, title: 'There is and There are', subtitle: 'Saying what exists' },
  { id: 'past-tense-review', section: 'grammar', order: 12, title: 'Past Tense Review', subtitle: 'Putting the past together' },

  { id: 'airport', section: 'travel', order: 1, title: 'At the Airport', subtitle: 'Check-in, security and boarding' },
  { id: 'hotel', section: 'travel', order: 2, title: 'At the Hotel', subtitle: 'Arriving and checking in' },
  { id: 'hotel-issues', section: 'travel', order: 3, title: 'Hotel Problems', subtitle: 'Asking for help with your room' },
  { id: 'reservations', section: 'travel', order: 4, title: 'Reservations', subtitle: 'Booking a room or a table' },
  { id: 'directions', section: 'travel', order: 5, title: 'Directions', subtitle: 'Finding your way around' },
  { id: 'restaurant', section: 'travel', order: 6, title: 'At the Restaurant', subtitle: 'Ordering food and drink' },
  { id: 'problems', section: 'travel', order: 7, title: 'Travel Problems', subtitle: 'Delays, lost bags and mix-ups' },
  { id: 'tours', section: 'travel', order: 8, title: 'Tours and Sightseeing', subtitle: 'Booking trips and asking about times' },
  { id: 'describing', section: 'travel', order: 9, title: 'Describing Places', subtitle: 'Saying what somewhere is like' },
  { id: 'experiences', section: 'travel', order: 10, title: 'Travel Experiences', subtitle: 'Talking about your trip' },
];

const written = [presentSimple];

export const topics = [...written, ...placeholders].sort((a, b) => {
  if (a.section !== b.section) {
    return sections.findIndex((s) => s.id === a.section) - sections.findIndex((s) => s.id === b.section);
  }
  return a.order - b.order;
});

export function topicsIn(sectionId) {
  return topics.filter((topic) => topic.section === sectionId);
}

export function topicById(id) {
  return topics.find((topic) => topic.id === id) || null;
}

export function sectionsIn(levelId) {
  return sections.filter((section) => section.level === levelId);
}

export function levelOf(topic) {
  const section = sections.find((s) => s.id === topic?.section);
  return section ? section.level : null;
}

// The small label above a topic's title, such as "Grammar".
export function sectionLabel(topic) {
  return sections.find((s) => s.id === topic?.section)?.title || '';
}

export function isWritten(topic) {
  return Boolean(topic && topic.items && availableActivities(topic).length > 0);
}

// Hides any activity type with too few written questions, so a half-written
// topic still runs.
export function availableActivities(topic) {
  if (!topic || !topic.items) return [];
  return Object.entries(topic.items)
    .filter(([, bank]) => bank && bank.length >= MINIMUM_BANK)
    .map(([type]) => type);
}
