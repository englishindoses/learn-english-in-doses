// Past Tense Review - beginner. Pulls the past simple together: past forms
// in positive sentences, didn't + base verb, and did + base verb in questions.

const mcq = [
  { id: 'rv-mc-01', sentence: 'I _____ my umbrella on the train.', options: ['left', 'leaved', 'leaves'], answer: 0, clue: 'Leave is irregular.' },
  { id: 'rv-mc-02', sentence: 'He _____ the 7.30 train this morning.', options: ['catched', 'caught', 'catch'], answer: 1, clue: 'Catch is irregular.' },
  { id: 'rv-mc-03', sentence: 'I _____ a coffee on the way to work.', options: ['bought', 'buyed', 'buy'], answer: 0, clue: 'Buy is irregular.' },
  { id: 'rv-mc-04', sentence: 'I _____ lunch today. I was too busy.', options: ["didn't have", "didn't had", "don't had"], answer: 0, clue: "After didn't, the base verb." },
  { id: 'rv-mc-05', sentence: 'The printer _____ this morning.', options: ["didn't work", "didn't worked", 'not worked'], answer: 0, clue: "After didn't, the base verb." },
  { id: 'rv-mc-06', sentence: 'Where _____ you go on holiday last year?', options: ['did', 'do', 'were'], answer: 0, clue: 'A past question with a normal verb.' },
  { id: 'rv-mc-07', sentence: 'What time _____ the meeting finish yesterday?', options: ['did', 'does', 'was'], answer: 0, clue: 'Look at the word yesterday.' },
  { id: 'rv-mc-08', sentence: 'Did you _____ the bill?', options: ['pay', 'paid', 'payed'], answer: 0, clue: 'After did, the base verb.' },
  { id: 'rv-mc-09', sentence: 'They _____ the match on TV last night.', options: ['watched', 'watch', 'watching'], answer: 0, clue: 'Regular: add -ed.' },
  { id: 'rv-mc-10', sentence: 'We _____ at a petrol station on the way.', options: ['stopped', 'stoped', 'stopt'], answer: 0, clue: 'Consonant-vowel-consonant: double the last letter.' },
  { id: 'rv-mc-11', sentence: 'I _____ for two hours last night.', options: ['studyed', 'studied', 'study'], answer: 1, clue: 'Consonant + y changes to -ied.' },
  { id: 'rv-mc-12', sentence: 'How _____ your parents meet?', options: ['did', 'do', 'were'], answer: 0, clue: 'A past question with a normal verb.' },
];

const dropdown = [
  { id: 'rv-dd-01', sentence: 'I {1} to the dentist on Monday.', gaps: { 1: { options: ['went', 'go', 'goed'], answer: 'went' } }, clue: 'Go is irregular.' },
  { id: 'rv-dd-02', sentence: "She didn't {1} my email.", gaps: { 1: { options: ['answer', 'answered', 'answers'], answer: 'answer' } }, clue: "After didn't, the base verb." },
  { id: 'rv-dd-03', sentence: '{1} you enjoy the concert last night?', gaps: { 1: { options: ['Did', 'Do', 'Were'], answer: 'Did' } }, clue: 'Enjoy is a normal verb, not be.' },
  { id: 'rv-dd-04', sentence: 'We {1} the car near the station yesterday.', gaps: { 1: { options: ['parked', 'parkt', 'park'], answer: 'parked' } }, clue: 'Regular: add -ed.' },
  { id: 'rv-dd-05', sentence: 'I {1} a new job last month.', gaps: { 1: { options: ['got', 'getted', 'get'], answer: 'got' } }, clue: 'Get is irregular.' },
  { id: 'rv-dd-06', sentence: 'He {1} to work today. He took the bus.', gaps: { 1: { options: ["didn't drive", "didn't drove", 'not drove'], answer: "didn't drive" } }, clue: "After didn't, the base verb." },
  { id: 'rv-dd-07', sentence: 'Why {1} you call me last night?', gaps: { 1: { options: ['did', 'do', 'were'], answer: 'did' } }, clue: 'A past question with a normal verb.' },
  { id: 'rv-dd-08', sentence: 'My parents {1} at university.', gaps: { 1: { options: ['met', 'meeted', 'meet'], answer: 'met' } }, clue: 'Meet is irregular.' },
  { id: 'rv-dd-09', sentence: 'We {1} a great time at the party.', gaps: { 1: { options: ['had', 'haved', 'have'], answer: 'had' } }, clue: 'Have is irregular.' },
  { id: 'rv-dd-10', sentence: "I didn't {1} any milk.", gaps: { 1: { options: ['buy', 'bought', 'buyed'], answer: 'buy' } }, clue: "After didn't, the base verb." },
  { id: 'rv-dd-11', sentence: 'Who {1} you go to the cinema with on Friday?', gaps: { 1: { options: ['did', 'do', 'were'], answer: 'did' } }, clue: 'A past question with a normal verb.' },
  { id: 'rv-dd-12', sentence: 'She {1} to Spain last summer.', gaps: { 1: { options: ['travelled', 'traveled', 'travel'], answer: 'travelled' } }, clue: 'In British English, double the l.' },
];

const wordorder = [
  { id: 'rv-wo-01', context: 'Ask about some shoes', answer: 'where did you buy your shoes', alternatives: [], clue: 'The question word comes first.' },
  { id: 'rv-wo-02', context: 'Ask about last night', answer: 'what time did you get home', alternatives: [], clue: 'Start with what time.' },
  { id: 'rv-wo-03', context: 'Ask for a reason', answer: 'why did you leave early', alternatives: [], clue: 'The question word comes first.' },
  { id: 'rv-wo-04', context: 'Ask about a couple', answer: 'how did you meet your husband', alternatives: [], clue: 'The question word comes first.' },
  { id: 'rv-wo-05', context: 'Ask about a holiday', answer: 'did you enjoy your holiday', alternatives: [], clue: 'Start with did.' },
  { id: 'rv-wo-06', context: 'Ask about the weekend', answer: 'what did you do last weekend', alternatives: [], clue: 'The question word comes first.' },
  { id: 'rv-wo-07', context: 'Ask for a reason', answer: "why didn't you come to the meeting", alternatives: [], clue: 'The question word comes first.' },
  { id: 'rv-wo-08', context: 'Say what you did not do', answer: "i didn't go to work on friday", alternatives: [], clue: "Didn't goes before the verb." },
  { id: 'rv-wo-09', context: 'Say what you did', answer: 'i watched a film last night', alternatives: ['last night i watched a film'], clue: 'Start with I.' },
  { id: 'rv-wo-10', context: 'Say what someone bought', answer: 'she bought a new phone last week', alternatives: ['last week she bought a new phone'], clue: 'Start with she.' },
  { id: 'rv-wo-11', context: 'Ask about dinner', answer: 'what did you have for dinner', alternatives: [], clue: 'The question word comes first.' },
  { id: 'rv-wo-12', context: 'Say you were too busy', answer: "we didn't have time for lunch", alternatives: [], clue: "Didn't goes before the verb." },
];

const wordbank = [
  { id: 'rv-wb-01', sentence: 'I {1} the early train to work. (catch)', answer: 'caught', alternatives: [], clue: 'Catch is irregular.' },
  { id: 'rv-wb-02', sentence: 'She {1} to the office this morning. (drive)', answer: 'drove', alternatives: [], clue: 'Drive is irregular.' },
  { id: 'rv-wb-03', sentence: 'He {1} for dinner. It was very kind of him. (pay)', answer: 'paid', alternatives: [], clue: 'Pay is irregular.' },
  { id: 'rv-wb-04', sentence: 'My boss {1} me about the new project. (tell)', answer: 'told', alternatives: [], clue: 'Tell is irregular.' },
  { id: 'rv-wb-05', sentence: 'We {1} pasta for dinner last night. (cook)', answer: 'cooked', alternatives: [], clue: 'Regular: add -ed.' },
  { id: 'rv-wb-06', sentence: 'I {1} Spanish at school. (study)', answer: 'studied', alternatives: [], clue: 'Consonant + y changes to -ied.' },
  { id: 'rv-wb-07', sentence: 'The lift {1} on every floor. (stop)', answer: 'stopped', alternatives: [], clue: 'Double the last letter.' },
  { id: 'rv-wb-08', sentence: 'They {1} to Italy last summer. (travel)', answer: 'travelled', alternatives: [], clue: 'In British English, double the l.' },
  { id: 'rv-wb-09', sentence: 'I {1} a new coat at the weekend. (buy)', answer: 'bought', alternatives: [], clue: 'Buy is irregular.' },
  { id: 'rv-wb-10', sentence: 'I {1} my password again! (forget)', answer: 'forgot', alternatives: [], clue: 'Forget is irregular.' },
  { id: 'rv-wb-11', sentence: 'She {1} a long email to the team. (write)', answer: 'wrote', alternatives: [], clue: 'Write is irregular.' },
  { id: 'rv-wb-12', sentence: 'We {1} too much money on holiday. (spend)', answer: 'spent', alternatives: [], clue: 'Spend is irregular.' },
];

const scramble = [
  { id: 'rv-ss-01', answer: 'caught', hint: 'The past of catch.', clue: 'Six letters.' },
  { id: 'rv-ss-02', answer: 'drove', hint: 'The past of drive.', clue: 'Five letters.' },
  { id: 'rv-ss-03', answer: 'paid', hint: 'The past of pay.', clue: 'Four letters.' },
  { id: 'rv-ss-04', answer: 'wrote', hint: 'The past of write.', clue: 'Five letters.' },
  { id: 'rv-ss-05', answer: 'spent', hint: 'The past of spend.', clue: 'Five letters.' },
  { id: 'rv-ss-06', answer: 'forgot', hint: 'The past of forget.', clue: 'Six letters.' },
  { id: 'rv-ss-07', answer: 'stopped', hint: 'The past of stop.', clue: 'Seven letters.' },
  { id: 'rv-ss-08', answer: 'studied', hint: 'The past of study.', clue: 'Seven letters.' },
  { id: 'rv-ss-09', answer: 'travelled', hint: 'The past of travel, in British English.', clue: 'Nine letters.' },
  { id: 'rv-ss-10', answer: 'watched', hint: 'The past of watch.', clue: 'Seven letters.' },
  { id: 'rv-ss-11', answer: 'arrived', hint: 'The past of arrive.', clue: 'Seven letters.' },
  { id: 'rv-ss-12', answer: 'planned', hint: 'The past of plan.', clue: 'Seven letters.' },
];

export default {
  id: 'past-tense-review',
  section: 'grammar',
  order: 13,
  title: 'Past Tense Review',
  subtitle: 'Putting the past together',
  icon: '\u{1F501}',
  lessons: [{ label: 'Past Tense Review', href: '../grammar/beginner/past-tense-review.html' }],
  items: { mcq, dropdown, wordorder, wordbank, scramble },
};
