// Articles - beginner. a, an, the and no article, with be and the simple
// I and you sentences the lesson itself uses.

const mcq = [
  { id: 'ar-mc-01', sentence: 'She is _____ nurse.', options: ['a', 'an', 'the'], answer: 0, clue: 'Jobs need an article. Nurse starts with an n sound.' },
  { id: 'ar-mc-02', sentence: 'He is _____ engineer.', options: ['a', 'an', 'the'], answer: 1, clue: 'Engineer starts with a vowel sound.' },
  { id: 'ar-mc-03', sentence: 'Please close _____ door.', options: ['a', 'an', 'the'], answer: 2, clue: 'We both know which door.' },
  { id: 'ar-mc-04', sentence: 'I listen to _____ music on the train.', options: ['a', 'the', 'no article'], answer: 2, clue: 'Music in general, not one song.' },
  { id: 'ar-mc-05', sentence: 'Do you have _____ pen?', options: ['a', 'an', 'the'], answer: 0, clue: 'Any pen, not one special pen.' },
  { id: 'ar-mc-06', sentence: 'I have _____ hour for lunch.', options: ['a', 'an', 'the'], answer: 1, clue: 'The h in hour is silent.' },
  { id: 'ar-mc-07', sentence: 'He is _____ university teacher.', options: ['a', 'an', 'the'], answer: 0, clue: 'University starts with the sound yoo.' },
  { id: 'ar-mc-08', sentence: 'I have _____ meeting at ten. _____ meeting is in room 4.', options: ['a / The', 'the / A', 'a / A'], answer: 0, clue: 'First time, then second time.' },
  { id: 'ar-mc-09', sentence: '_____ internet is very slow today.', options: ['A', 'An', 'The'], answer: 2, clue: 'There is only one internet.' },
  { id: 'ar-mc-10', sentence: 'She lives in _____ Madrid.', options: ['the', 'a', 'no article'], answer: 2, clue: 'Cities never take a, an or the.' },
  { id: 'ar-mc-11', sentence: 'I want to speak to _____ manager.', options: ['a', 'an', 'the'], answer: 2, clue: 'We both know which manager.' },
  { id: 'ar-mc-12', sentence: 'He drives _____ old car.', options: ['a', 'an', 'the'], answer: 1, clue: 'Old starts with a vowel sound.' },
];

const dropdown = [
  { id: 'ar-dd-01', sentence: 'I work in {1} office in the city centre.', gaps: { 1: { options: ['a', 'an', 'the'], answer: 'an' } }, clue: 'Office starts with a vowel sound.' },
  { id: 'ar-dd-02', sentence: 'My brother is {1} taxi driver.', gaps: { 1: { options: ['a', 'an', 'the'], answer: 'a' } }, clue: 'Jobs need an article. Taxi starts with t.' },
  { id: 'ar-dd-03', sentence: "Please open {1} window. It's hot in here.", gaps: { 1: { options: ['a', 'an', 'the'], answer: 'the' } }, clue: 'We both know which window.' },
  { id: 'ar-dd-04', sentence: 'I have {1} interview on Monday.', gaps: { 1: { options: ['a', 'an', 'the'], answer: 'an' } }, clue: 'Interview starts with a vowel sound.' },
  { id: 'ar-dd-05', sentence: 'I have {1} new laptop. {2} laptop is very fast.', gaps: { 1: { options: ['a', 'an', 'the'], answer: 'a' }, 2: { options: ['A', 'An', 'The'], answer: 'The' } }, clue: 'First time, then second time.' },
  { id: 'ar-dd-06', sentence: 'I drink {1} tea at work.', gaps: { 1: { options: ['a', 'the', 'no article'], answer: 'no article' } }, clue: 'Tea in general, not one cup.' },
  { id: 'ar-dd-07', sentence: 'It is {1} easy job.', gaps: { 1: { options: ['a', 'an', 'the'], answer: 'an' } }, clue: 'Easy starts with a vowel sound.' },
  { id: 'ar-dd-08', sentence: 'I need {1} taxi to the station.', gaps: { 1: { options: ['a', 'an', 'the'], answer: 'a' } }, clue: 'Any taxi, not one special taxi.' },
  { id: 'ar-dd-09', sentence: '{1} lift is broken today.', gaps: { 1: { options: ['A', 'An', 'The'], answer: 'The' } }, clue: 'Our building has only one lift.' },
  { id: 'ar-dd-10', sentence: 'He speaks {1} English at work.', gaps: { 1: { options: ['the', 'a', 'no article'], answer: 'no article' } }, clue: 'Languages do not take a, an or the.' },
  { id: 'ar-dd-11', sentence: 'My mum is {1} English teacher.', gaps: { 1: { options: ['a', 'an', 'the'], answer: 'an' } }, clue: 'English starts with a vowel sound.' },
  { id: 'ar-dd-12', sentence: 'I have {1} umbrella in my bag.', gaps: { 1: { options: ['a', 'an', 'the'], answer: 'an' } }, clue: 'Umbrella starts with a vowel sound.' },
];

const wordorder = [
  { id: 'ar-wo-01', context: 'Say what someone does', answer: 'my brother is a doctor', alternatives: [], clue: 'Jobs need a or an.' },
  { id: 'ar-wo-02', context: 'Ask someone to do something', answer: 'please close the door', alternatives: [], clue: 'Start with please.' },
  { id: 'ar-wo-03', context: 'Say what you need', answer: 'i need a new phone', alternatives: [], clue: 'The article goes before new.' },
  { id: 'ar-wo-04', context: 'Say what someone does', answer: 'she is an english teacher', alternatives: [], clue: 'Start with she.' },
  { id: 'ar-wo-05', context: 'Say where the station is', answer: 'the station is near the office', alternatives: [], clue: 'Start with the station.' },
  { id: 'ar-wo-06', context: 'Say what you have for breakfast', answer: 'i have an egg for breakfast', alternatives: [], clue: 'Start with I.' },
  { id: 'ar-wo-07', context: 'You have a meeting today. Say when it is', answer: 'the meeting is at ten', alternatives: [], clue: 'The second time, we know which meeting.' },
  { id: 'ar-wo-08', context: 'Say what pets you have', answer: 'i have a cat and a dog', alternatives: ['i have a dog and a cat'], clue: 'Start with I.' },
  { id: 'ar-wo-09', context: 'Say where you work', answer: 'i work in an office', alternatives: [], clue: 'Start with I.' },
  { id: 'ar-wo-10', context: 'Say how long your lunch break is', answer: 'i have an hour for lunch', alternatives: [], clue: 'Start with I.' },
  { id: 'ar-wo-11', context: 'Describe your office', answer: 'my office is in an old building', alternatives: [], clue: 'Old goes before building.' },
  { id: 'ar-wo-12', context: 'Ask for the boss', answer: 'i want to speak to the manager', alternatives: [], clue: 'Start with I want.' },
];

const scramble = [
  { id: 'ar-ss-01', answer: 'umbrella', hint: 'You need this when it rains.', clue: 'Eight letters.' },
  { id: 'ar-ss-02', answer: 'apple', hint: 'A red or green fruit.', clue: 'Five letters.' },
  { id: 'ar-ss-03', answer: 'hour', hint: 'Sixty minutes.', clue: 'Four letters.' },
  { id: 'ar-ss-04', answer: 'window', hint: 'You open this when the room is hot.', clue: 'Six letters.' },
  { id: 'ar-ss-05', answer: 'door', hint: 'You close this when you leave a room.', clue: 'Four letters.' },
  { id: 'ar-ss-06', answer: 'interview', hint: 'A meeting when you want a new job.', clue: 'Nine letters.' },
  { id: 'ar-ss-07', answer: 'doctor', hint: 'This person works in a hospital and helps sick people.', clue: 'Six letters.' },
  { id: 'ar-ss-08', answer: 'taxi', hint: 'A car you pay to take you somewhere.', clue: 'Four letters.' },
  { id: 'ar-ss-09', answer: 'university', hint: 'You study here after school.', clue: 'Ten letters.' },
  { id: 'ar-ss-10', answer: 'internet', hint: 'You go online with this.', clue: 'Eight letters.' },
  { id: 'ar-ss-11', answer: 'artist', hint: 'This person paints pictures.', clue: 'Six letters.' },
  { id: 'ar-ss-12', answer: 'music', hint: 'You listen to this on the radio.', clue: 'Five letters.' },
];

export default {
  id: 'articles',
  section: 'grammar',
  order: 2,
  title: 'Articles',
  subtitle: 'a, an and the',
  icon: '\u{1F4DD}',
  lessons: [{ label: 'Articles: A, An, The', href: '../grammar/beginner/articles.html' }],
  items: { mcq, dropdown, wordorder, scramble },
};
