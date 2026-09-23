// Present Simple - beginner. Everything here uses only present simple grammar
// and everyday words a beginner already has.

const mcq = [
  { id: 'ps-mc-01', sentence: 'She _____ to work by bus.', options: ['go', 'goes', 'going'], answer: 1, clue: 'She, he, it - what happens to the verb?' },
  { id: 'ps-mc-02', sentence: 'They _____ English very well.', options: ['speaks', 'speak', 'speaking'], answer: 1, clue: 'Is they one person or more than one?' },
  { id: 'ps-mc-03', sentence: 'I _____ eat meat.', options: ["doesn't", 'not', "don't"], answer: 2, clue: 'Which negative word goes with I?' },
  { id: 'ps-mc-04', sentence: '_____ he live near the office?', options: ['Does', 'Do', 'Is'], answer: 0, clue: 'Which question word goes with he?' },
  { id: 'ps-mc-05', sentence: 'The shop _____ at nine.', options: ['open', 'opens', 'opening'], answer: 1, clue: 'The shop is it.' },
  { id: 'ps-mc-06', sentence: 'He _____ coffee. He drinks tea.', options: ["don't like", "doesn't likes", "doesn't like"], answer: 2, clue: 'What happens to the verb after doesn t?' },
  { id: 'ps-mc-07', sentence: '_____ you take the train to work?', options: ['Does', 'Do', 'Are'], answer: 1, clue: 'Which question word goes with you?' },
  { id: 'ps-mc-08', sentence: 'My sister _____ at a hospital.', options: ['work', 'works', 'working'], answer: 1, clue: 'My sister is she.' },
  { id: 'ps-mc-09', sentence: 'We _____ football on Sundays.', options: ['plays', 'play', 'playing'], answer: 1, clue: 'We is more than one person.' },
  { id: 'ps-mc-10', sentence: 'She _____ Spanish at school.', options: ['studys', 'studies', 'studyes'], answer: 1, clue: 'The verb ends in consonant plus y.' },
  { id: 'ps-mc-11', sentence: 'Does he live here? No, he _____.', options: ["don't", "doesn't", 'not'], answer: 1, clue: 'Use the same word as the question.' },
  { id: 'ps-mc-12', sentence: 'My parents _____ in Madrid.', options: ['lives', 'live', 'living'], answer: 1, clue: 'My parents is they.' },
];

const dropdown = [
  { id: 'ps-dd-01', sentence: '{1} your phone work here?', gaps: { 1: { options: ['Do', 'Does', 'Is'], answer: 'Does' } }, clue: 'Your phone is one thing - it.' },
  { id: 'ps-dd-02', sentence: '{1} your friends like football?', gaps: { 1: { options: ['Do', 'Does', 'Are'], answer: 'Do' } }, clue: 'Your friends is they.' },
  { id: 'ps-dd-03', sentence: 'My brother {1} in a restaurant.', gaps: { 1: { options: ['work', 'works', 'working'], answer: 'works' } }, clue: 'My brother is he.' },
  { id: 'ps-dd-04', sentence: 'We {1} up at seven every day.', gaps: { 1: { options: ['gets', 'get', 'getting'], answer: 'get' } }, clue: 'We is more than one person.' },
  { id: 'ps-dd-05', sentence: 'She {1} have a car.', gaps: { 1: { options: ["don't", "doesn't", 'not'], answer: "doesn't" } }, clue: 'Which negative word goes with she?' },
  { id: 'ps-dd-06', sentence: 'I {1} tea in the morning.', gaps: { 1: { options: ['drinks', 'drink', 'drinking'], answer: 'drink' } }, clue: 'Only he, she and it change the verb.' },
  { id: 'ps-dd-07', sentence: 'The train {1} at half past eight.', gaps: { 1: { options: ['leave', 'leaves', 'leaving'], answer: 'leaves' } }, clue: 'The train is it.' },
  { id: 'ps-dd-08', sentence: 'They {1} live in this street.', gaps: { 1: { options: ["doesn't", "don't", 'not'], answer: "don't" } }, clue: 'Which negative word goes with they?' },
  { id: 'ps-dd-09', sentence: '{1} she work on Saturdays?', gaps: { 1: { options: ['Do', 'Does', 'Is'], answer: 'Does' } }, clue: 'Which question word goes with she?' },
  { id: 'ps-dd-10', sentence: 'He {1} the bus to school.', gaps: { 1: { options: ['take', 'takes', 'taking'], answer: 'takes' } }, clue: 'He needs something on the end of the verb.' },
  { id: 'ps-dd-11', sentence: 'My children {1} cheese.', gaps: { 1: { options: ['likes', 'like', 'liking'], answer: 'like' } }, clue: 'My children is they.' },
  { id: 'ps-dd-12', sentence: 'It {1} a lot here in winter.', gaps: { 1: { options: ['rain', 'rains', 'raining'], answer: 'rains' } }, clue: 'It is the same as he and she.' },
];

const wordorder = [
  { id: 'ps-wo-01', context: 'Say where someone works', answer: 'she works in a bank', alternatives: [], clue: 'Start with the person.' },
  { id: 'ps-wo-02', context: 'Say what you do not like', answer: "i don't like cold weather", alternatives: [], clue: 'The negative word comes before the verb.' },
  { id: 'ps-wo-03', context: 'Ask about a language', answer: 'does he speak english', alternatives: [], clue: 'Questions start with do or does.' },
  { id: 'ps-wo-04', context: 'Say when you start work', answer: 'i start work at nine', alternatives: [], clue: 'The time goes at the end.' },
  { id: 'ps-wo-05', context: 'Ask about the weekend', answer: 'do you work on saturdays', alternatives: [], clue: 'Which question word goes with you?' },
  { id: 'ps-wo-06', context: 'Say what your brother does', answer: 'my brother drives a taxi', alternatives: [], clue: 'Start with the person.' },
  { id: 'ps-wo-07', context: 'Say what someone does not have', answer: "she doesn't have a car", alternatives: [], clue: 'After doesn t the verb does not change.' },
  { id: 'ps-wo-08', context: 'Say how often you do something', answer: 'we go to the gym on mondays', alternatives: [], clue: 'The day goes at the end.' },
  { id: 'ps-wo-09', context: 'Ask where someone lives', answer: 'where does she live', alternatives: [], clue: 'The question word comes first.' },
  { id: 'ps-wo-10', context: 'Say what time something opens', answer: 'the shop opens at ten', alternatives: [], clue: 'The shop is it.' },
  { id: 'ps-wo-11', context: 'Say what you do every day', answer: 'i read the news every morning', alternatives: [], clue: 'How often goes at the end.' },
  { id: 'ps-wo-12', context: 'Say what someone does not eat', answer: "they don't eat meat", alternatives: [], clue: 'They takes don t.' },
];

const wordbank = [
  { id: 'ps-wb-01', sentence: 'She {1} in a school.', answer: 'works', alternatives: [], clue: 'She needs something on the end.' },
  { id: 'ps-wb-02', sentence: 'They {1} in London.', answer: 'live', alternatives: [], clue: 'They does not change the verb.' },
  { id: 'ps-wb-03', sentence: 'He {1} coffee every morning.', answer: 'drinks', alternatives: [], clue: 'He needs something on the end.' },
  { id: 'ps-wb-04', sentence: 'We {1} football at the weekend.', answer: 'play', alternatives: [], clue: 'We does not change the verb.' },
  { id: 'ps-wb-05', sentence: 'My sister {1} English at university.', answer: 'studies', alternatives: [], clue: 'The verb ends in consonant plus y.' },
  { id: 'ps-wb-06', sentence: 'The film {1} at eight.', answer: 'starts', alternatives: [], clue: 'The film is it.' },
  { id: 'ps-wb-07', sentence: 'I {1} the bus to work.', answer: 'take', alternatives: [], clue: 'I does not change the verb.' },
  { id: 'ps-wb-08', sentence: 'She {1} television in the evening.', answer: 'watches', alternatives: [], clue: 'The verb ends in ch.' },
  { id: 'ps-wb-09', sentence: 'My parents {1} in a small house.', answer: 'stay', alternatives: [], clue: 'My parents is they.' },
  { id: 'ps-wb-10', sentence: 'He {1} his car on Sundays.', answer: 'cleans', alternatives: [], clue: 'He needs something on the end.' },
  { id: 'ps-wb-11', sentence: 'We {1} dinner at seven.', answer: 'eat', alternatives: [], clue: 'We does not change the verb.' },
  { id: 'ps-wb-12', sentence: 'The shop {1} at six.', answer: 'closes', alternatives: [], clue: 'The shop is it.' },
];

const scramble = [
  { id: 'ps-ss-01', answer: 'work', hint: 'You do this at your job.', clue: 'Four letters.' },
  { id: 'ps-ss-02', answer: 'live', hint: 'You do this in a house.', clue: 'Four letters.' },
  { id: 'ps-ss-03', answer: 'study', hint: 'You do this at school.', clue: 'Five letters.' },
  { id: 'ps-ss-04', answer: 'drink', hint: 'You do this with water.', clue: 'Five letters.' },
  { id: 'ps-ss-05', answer: 'watch', hint: 'You do this with television.', clue: 'Five letters.' },
  { id: 'ps-ss-06', answer: 'speak', hint: 'You do this with a language.', clue: 'Five letters.' },
  { id: 'ps-ss-07', answer: 'start', hint: 'The film does this at eight.', clue: 'Five letters.' },
  { id: 'ps-ss-08', answer: 'finish', hint: 'The opposite of start.', clue: 'Six letters.' },
  { id: 'ps-ss-09', answer: 'morning', hint: 'The first part of the day.', clue: 'Seven letters.' },
  { id: 'ps-ss-10', answer: 'always', hint: 'One hundred per cent of the time.', clue: 'Six letters.' },
  { id: 'ps-ss-11', answer: 'never', hint: 'Zero per cent of the time.', clue: 'Five letters.' },
  { id: 'ps-ss-12', answer: 'usually', hint: 'Almost every time.', clue: 'Seven letters.' },
];

export default {
  id: 'present-simple',
  section: 'grammar',
  order: 4,
  title: 'Present Simple',
  subtitle: 'Everyday habits and facts',
  icon: '\u{1F553}',
  lessons: [{ label: 'Present Simple', href: '../grammar/beginner/present-simple.html' }],
  items: { mcq, dropdown, wordorder, wordbank, scramble },
};
