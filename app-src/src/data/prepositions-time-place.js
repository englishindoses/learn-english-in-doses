// Prepositions of Time and Place - beginner. in, on and at for time and
// place, and no preposition before last, next, every and this.

const mcq = [
  { id: 'tp-mc-01', sentence: 'The meeting is _____ Monday.', options: ['in', 'on', 'at'], answer: 1, clue: 'Days take this one.' },
  { id: 'tp-mc-02', sentence: "I start work _____ nine o'clock.", options: ['in', 'on', 'at'], answer: 2, clue: 'An exact time.' },
  { id: 'tp-mc-03', sentence: 'My birthday is _____ July.', options: ['in', 'on', 'at'], answer: 0, clue: 'Months take this one.' },
  { id: 'tp-mc-04', sentence: 'She works _____ Manchester.', options: ['in', 'on', 'at'], answer: 0, clue: 'Cities take this one.' },
  { id: 'tp-mc-05', sentence: 'My office is _____ the fourth floor.', options: ['in', 'on', 'at'], answer: 1, clue: 'Floors take this one.' },
  { id: 'tp-mc-06', sentence: "I'm _____ the bus stop.", options: ['in', 'on', 'at'], answer: 2, clue: 'A specific point.' },
  { id: 'tp-mc-07', sentence: 'I go running _____ the morning.', options: ['in', 'on', 'at'], answer: 0, clue: 'Parts of the day take this one.' },
  { id: 'tp-mc-08', sentence: 'I never check my emails _____ night.', options: ['in', 'on', 'at'], answer: 2, clue: 'Night is special. Think of the fixed phrase.' },
  { id: 'tp-mc-09', sentence: 'The café is _____ Park Street.', options: ['in', 'on', 'at'], answer: 1, clue: 'Streets take this one.' },
  { id: 'tp-mc-10', sentence: 'I saw her _____ last week.', options: ['in', 'on', 'no preposition'], answer: 2, clue: 'Look at the word last.' },
  { id: 'tp-mc-11', sentence: "We don't work _____ Sundays.", options: ['in', 'on', 'at'], answer: 1, clue: 'Days take this one.' },
  { id: 'tp-mc-12', sentence: 'The milk is _____ the fridge.', options: ['in', 'on', 'at'], answer: 0, clue: 'Inside something.' },
];

const dropdown = [
  { id: 'tp-dd-01', sentence: "I have lunch {1} one o'clock.", gaps: { 1: { options: ['in', 'on', 'at'], answer: 'at' } }, clue: 'An exact time.' },
  { id: 'tp-dd-02', sentence: 'We have a team meeting {1} Tuesday.', gaps: { 1: { options: ['in', 'on', 'at'], answer: 'on' } }, clue: 'Days take this one.' },
  { id: 'tp-dd-03', sentence: "I'm {1} work until six.", gaps: { 1: { options: ['in', 'on', 'at'], answer: 'at' } }, clue: 'A fixed phrase, like home and school.' },
  { id: 'tp-dd-04', sentence: "It's very busy here {1} summer.", gaps: { 1: { options: ['in', 'on', 'at'], answer: 'in' } }, clue: 'Seasons take this one.' },
  { id: 'tp-dd-05', sentence: 'My desk is {1} the second floor.', gaps: { 1: { options: ['in', 'on', 'at'], answer: 'on' } }, clue: 'Floors take this one.' },
  { id: 'tp-dd-06', sentence: 'My keys are {1} my bag.', gaps: { 1: { options: ['in', 'on', 'at'], answer: 'in' } }, clue: 'Inside something.' },
  { id: 'tp-dd-07', sentence: 'She started her job {1} 2024.', gaps: { 1: { options: ['in', 'on', 'at'], answer: 'in' } }, clue: 'Years take this one.' },
  { id: 'tp-dd-08', sentence: 'We visit my parents {1} Christmas.', gaps: { 1: { options: ['in', 'on', 'at'], answer: 'at' } }, clue: 'A holiday period.' },
  { id: 'tp-dd-09', sentence: 'The shop is {1} King Street.', gaps: { 1: { options: ['in', 'on', 'at'], answer: 'on' } }, clue: 'Streets take this one.' },
  { id: 'tp-dd-10', sentence: "I'm {1} home all day on Saturday.", gaps: { 1: { options: ['in', 'on', 'at'], answer: 'at' } }, clue: 'A fixed phrase, like work and school.' },
  { id: 'tp-dd-11', sentence: 'The bus leaves {1} 7.15.', gaps: { 1: { options: ['in', 'on', 'at'], answer: 'at' } }, clue: 'An exact time.' },
  { id: 'tp-dd-12', sentence: 'I see my friends {1} Friday evenings.', gaps: { 1: { options: ['in', 'on', 'at'], answer: 'on' } }, clue: 'The day is the important word.' },
];

const wordorder = [
  { id: 'tp-wo-01', context: 'Say when the meeting is', answer: 'the meeting is on thursday at two', alternatives: ['the meeting is at two on thursday'], clue: 'Start with the meeting.' },
  { id: 'tp-wo-02', context: 'Say where you live', answer: 'i live in a small town', alternatives: [], clue: 'Small goes before town.' },
  { id: 'tp-wo-03', context: 'Say where your office is', answer: 'my office is on the third floor', alternatives: [], clue: 'Start with my office.' },
  { id: 'tp-wo-04', context: 'Say when you start work', answer: 'i start work at eight', alternatives: [], clue: 'The time goes at the end.' },
  { id: 'tp-wo-05', context: 'Say where you are waiting', answer: 'i am waiting at the bus stop', alternatives: [], clue: 'Start with I.' },
  { id: 'tp-wo-06', context: 'Say when you go swimming', answer: 'i go swimming on saturday mornings', alternatives: [], clue: 'The time goes at the end.' },
  { id: 'tp-wo-07', context: 'Say when your holiday is', answer: 'we go on holiday in august', alternatives: [], clue: 'The month goes at the end.' },
  { id: 'tp-wo-08', context: 'Say where the keys are', answer: 'your keys are on the kitchen table', alternatives: [], clue: 'Start with your keys.' },
  { id: 'tp-wo-09', context: 'Say when you read', answer: 'i read in bed at night', alternatives: ['at night i read in bed'], clue: 'Start with I.' },
  { id: 'tp-wo-10', context: 'Say where the café is', answer: 'the café is on park street', alternatives: [], clue: 'Start with the café.' },
  { id: 'tp-wo-11', context: 'Say when someone was born', answer: 'she was born in march', alternatives: [], clue: 'Start with she.' },
  { id: 'tp-wo-12', context: 'Say when you saw someone', answer: 'i saw him last friday', alternatives: ['last friday i saw him'], clue: 'No in, on or at before last.' },
];

const scramble = [
  { id: 'tp-ss-01', answer: 'morning', hint: 'We say in the _____.', clue: 'Seven letters.' },
  { id: 'tp-ss-02', answer: 'afternoon', hint: 'The part of the day after lunch.', clue: 'Nine letters.' },
  { id: 'tp-ss-03', answer: 'evening', hint: 'The part of the day after work.', clue: 'Seven letters.' },
  { id: 'tp-ss-04', answer: 'night', hint: 'We say at _____, when it is dark.', clue: 'Five letters.' },
  { id: 'tp-ss-05', answer: 'summer', hint: 'The hottest season.', clue: 'Six letters.' },
  { id: 'tp-ss-06', answer: 'winter', hint: 'The coldest season.', clue: 'Six letters.' },
  { id: 'tp-ss-07', answer: 'birthday', hint: 'The day you were born, every year.', clue: 'Eight letters.' },
  { id: 'tp-ss-08', answer: 'floor', hint: 'My office is on the third _____.', clue: 'Five letters.' },
  { id: 'tp-ss-09', answer: 'street', hint: 'A road in a town, with houses and shops.', clue: 'Six letters.' },
  { id: 'tp-ss-10', answer: 'kitchen', hint: 'The room where you cook.', clue: 'Seven letters.' },
  { id: 'tp-ss-11', answer: 'fridge', hint: 'It keeps your milk cold.', clue: 'Six letters.' },
  { id: 'tp-ss-12', answer: 'holiday', hint: 'Time away from work, often in another place.', clue: 'Seven letters.' },
];

export default {
  id: 'prepositions-time-place',
  section: 'grammar',
  order: 10,
  title: 'Prepositions of Time and Place',
  subtitle: 'in, on and at',
  icon: '\u{1F4CD}',
  lessons: [{ label: 'Prepositions of Time and Place', href: '../grammar/beginner/prepositions-time-place.html' }],
  items: { mcq, dropdown, wordorder, scramble },
};
