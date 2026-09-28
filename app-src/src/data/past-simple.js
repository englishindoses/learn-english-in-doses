// Past Simple - beginner. Regular and irregular past forms, didn't and did
// with the base verb, and was and were.

const mcq = [
  { id: 'pa-mc-01', sentence: 'I _____ until eight last night.', options: ['work', 'worked', 'working'], answer: 1, clue: 'Regular verbs add -ed.' },
  { id: 'pa-mc-02', sentence: 'She _____ to the gym after work yesterday.', options: ['go', 'went', 'goed'], answer: 1, clue: 'Go is irregular.' },
  { id: 'pa-mc-03', sentence: 'We _____ a taxi to the station last night.', options: ['taked', 'took', 'take'], answer: 1, clue: 'Take is irregular.' },
  { id: 'pa-mc-04', sentence: 'I _____ watch TV last night.', options: ["didn't", "don't", "wasn't"], answer: 0, clue: 'A past negative with a base verb.' },
  { id: 'pa-mc-05', sentence: '_____ you enjoy the party?', options: ['Do', 'Did', 'Were'], answer: 1, clue: 'Enjoy is a normal verb, not be.' },
  { id: 'pa-mc-06', sentence: 'The meeting yesterday _____ very long.', options: ['were', 'was', 'did'], answer: 1, clue: 'The meeting = it.' },
  { id: 'pa-mc-07', sentence: 'They _____ at work on Monday.', options: ['was', 'were', 'did'], answer: 1, clue: 'They = more than one person.' },
  { id: 'pa-mc-08', sentence: "She didn't _____ the email.", options: ['send', 'sent', 'sended'], answer: 0, clue: "After didn't, use the base verb." },
  { id: 'pa-mc-09', sentence: 'What _____ you have for lunch yesterday?', options: ['do', 'did', 'were'], answer: 1, clue: 'A past question with a normal verb.' },
  { id: 'pa-mc-10', sentence: 'I _____ my keys at home this morning.', options: ['leaved', 'left', 'leave'], answer: 1, clue: 'Leave is irregular.' },
  { id: 'pa-mc-11', sentence: '_____ you at home last night?', options: ['Did', 'Were', 'Was'], answer: 1, clue: 'Be does not use did.' },
  { id: 'pa-mc-12', sentence: 'He _____ English at school.', options: ['studyed', 'studied', 'studys'], answer: 1, clue: 'Consonant + y changes to -ied.' },
];

const dropdown = [
  { id: 'pa-dd-01', sentence: 'I {1} a new laptop last week.', gaps: { 1: { options: ['buyed', 'bought', 'buy'], answer: 'bought' } }, clue: 'Buy is irregular.' },
  { id: 'pa-dd-02', sentence: 'We {1} dinner at a nice restaurant on Saturday.', gaps: { 1: { options: ['had', 'haved', 'have'], answer: 'had' } }, clue: 'Have is irregular.' },
  { id: 'pa-dd-03', sentence: 'The train {1} at ten o\'clock last night.', gaps: { 1: { options: ['arrived', 'arriveed', 'arrive'], answer: 'arrived' } }, clue: 'Verbs ending in -e add only -d.' },
  { id: 'pa-dd-04', sentence: "I didn't {1} to the meeting.", gaps: { 1: { options: ['go', 'went', 'goed'], answer: 'go' } }, clue: "After didn't, use the base verb." },
  { id: 'pa-dd-05', sentence: '{1} she call you back?', gaps: { 1: { options: ['Did', 'Was', 'Were'], answer: 'Did' } }, clue: 'Call is a normal verb, not be.' },
  { id: 'pa-dd-06', sentence: 'I {1} tired after work yesterday.', gaps: { 1: { options: ['was', 'were', 'did'], answer: 'was' } }, clue: 'The past of I am.' },
  { id: 'pa-dd-07', sentence: 'We {1} happy with the hotel.', gaps: { 1: { options: ["weren't", "wasn't", "didn't"], answer: "weren't" } }, clue: 'We = more than one person.' },
  { id: 'pa-dd-08', sentence: 'The bus {1} outside my office this morning.', gaps: { 1: { options: ['stoped', 'stopped', 'stopt'], answer: 'stopped' } }, clue: 'Consonant-vowel-consonant: double the last letter.' },
  { id: 'pa-dd-09', sentence: 'Did you like the film? - Yes, I {1}.', gaps: { 1: { options: ['did', 'liked', 'was'], answer: 'did' } }, clue: 'Use the same word as the question.' },
  { id: 'pa-dd-10', sentence: 'She {1} her colleagues at the café.', gaps: { 1: { options: ['meeted', 'met', 'meet'], answer: 'met' } }, clue: 'Meet is irregular.' },
  { id: 'pa-dd-11', sentence: 'We {1} a lot of photos on holiday.', gaps: { 1: { options: ['taked', 'took', 'take'], answer: 'took' } }, clue: 'Take is irregular.' },
  { id: 'pa-dd-12', sentence: 'Was the meeting long? - No, it {1}.', gaps: { 1: { options: ["wasn't", "didn't", "weren't"], answer: "wasn't" } }, clue: 'Use the same verb as the question.' },
];

const wordorder = [
  { id: 'pa-wo-01', context: 'Say where you went', answer: 'i went to the supermarket after work', alternatives: [], clue: 'Start with I.' },
  { id: 'pa-wo-02', context: 'Say what you did not do', answer: "i didn't have breakfast this morning", alternatives: ["this morning i didn't have breakfast"], clue: "Didn't goes before the verb." },
  { id: 'pa-wo-03', context: 'Ask about a film', answer: 'did you enjoy the film', alternatives: [], clue: 'Start with did.' },
  { id: 'pa-wo-04', context: 'Say when you arrived', answer: 'we arrived at the office at nine', alternatives: [], clue: 'Start with we.' },
  { id: 'pa-wo-05', context: 'Talk about the weather', answer: 'the weather was terrible yesterday', alternatives: ['yesterday the weather was terrible'], clue: 'Start with the weather.' },
  { id: 'pa-wo-06', context: 'Ask about yesterday', answer: 'what did you do yesterday', alternatives: [], clue: 'The question word comes first.' },
  { id: 'pa-wo-07', context: 'Say how you got to work', answer: 'i took the train to work today', alternatives: ['today i took the train to work'], clue: 'Start with I.' },
  { id: 'pa-wo-08', context: 'Say you were not at home', answer: "we weren't at home last night", alternatives: ["last night we weren't at home"], clue: 'Start with we.' },
  { id: 'pa-wo-09', context: 'Ask about the weekend', answer: 'were you at home at the weekend', alternatives: [], clue: 'Be does not use did.' },
  { id: 'pa-wo-10', context: 'Say what you cooked', answer: 'i cooked pasta for my friends', alternatives: [], clue: 'Start with I.' },
  { id: 'pa-wo-11', context: 'Say someone was not at work', answer: "he didn't come to work today", alternatives: ["today he didn't come to work"], clue: 'Start with he.' },
  { id: 'pa-wo-12', context: 'Ask about lunch', answer: 'where did you have lunch', alternatives: [], clue: 'The question word comes first.' },
];

const wordbank = [
  { id: 'pa-wb-01', sentence: 'I {1} to bed early last night. (go)', answer: 'went', alternatives: [], clue: 'Go is irregular.' },
  { id: 'pa-wb-02', sentence: 'We {1} a meeting at nine this morning. (have)', answer: 'had', alternatives: [], clue: 'Have is irregular.' },
  { id: 'pa-wb-03', sentence: 'She {1} the train to work yesterday. (take)', answer: 'took', alternatives: [], clue: 'Take is irregular.' },
  { id: 'pa-wb-04', sentence: 'I {1} a new phone on Saturday. (buy)', answer: 'bought', alternatives: [], clue: 'Buy is irregular.' },
  { id: 'pa-wb-05', sentence: 'We {1} a great film last night. (see)', answer: 'saw', alternatives: [], clue: 'See is irregular.' },
  { id: 'pa-wb-06', sentence: 'I {1} my friend for coffee after work. (meet)', answer: 'met', alternatives: [], clue: 'Meet is irregular.' },
  { id: 'pa-wb-07', sentence: 'He {1} the office at six. (leave)', answer: 'left', alternatives: [], clue: 'Leave is irregular.' },
  { id: 'pa-wb-08', sentence: 'I {1} a sandwich at my desk. (eat)', answer: 'ate', alternatives: [], clue: 'Eat is irregular.' },
  { id: 'pa-wb-09', sentence: 'She {1} a cake for the party. (make)', answer: 'made', alternatives: [], clue: 'Make is irregular.' },
  { id: 'pa-wb-10', sentence: 'I {1} home very late. (get)', answer: 'got', alternatives: [], clue: 'Get is irregular.' },
  { id: 'pa-wb-11', sentence: 'They {1} until ten last night. (work)', answer: 'worked', alternatives: [], clue: 'Regular: add -ed.' },
  { id: 'pa-wb-12', sentence: 'I {1} French at school. (study)', answer: 'studied', alternatives: [], clue: 'Consonant + y changes to -ied.' },
];

const scramble = [
  { id: 'pa-ss-01', answer: 'bought', hint: 'The past of buy.', clue: 'Six letters.' },
  { id: 'pa-ss-02', answer: 'thought', hint: 'The past of think.', clue: 'Seven letters.' },
  { id: 'pa-ss-03', answer: 'found', hint: 'The past of find.', clue: 'Five letters.' },
  { id: 'pa-ss-04', answer: 'drank', hint: 'The past of drink.', clue: 'Five letters.' },
  { id: 'pa-ss-05', answer: 'gave', hint: 'The past of give.', clue: 'Four letters.' },
  { id: 'pa-ss-06', answer: 'told', hint: 'The past of tell.', clue: 'Four letters.' },
  { id: 'pa-ss-07', answer: 'knew', hint: 'The past of know.', clue: 'Four letters.' },
  { id: 'pa-ss-08', answer: 'said', hint: 'The past of say.', clue: 'Four letters.' },
  { id: 'pa-ss-09', answer: 'came', hint: 'The past of come.', clue: 'Four letters.' },
  { id: 'pa-ss-10', answer: 'went', hint: 'The past of go.', clue: 'Four letters.' },
  { id: 'pa-ss-11', answer: 'took', hint: 'The past of take.', clue: 'Four letters.' },
  { id: 'pa-ss-12', answer: 'left', hint: 'The past of leave.', clue: 'Four letters.' },
];

export default {
  id: 'past-simple',
  section: 'grammar',
  order: 9,
  title: 'Past Simple',
  subtitle: 'Talking about yesterday',
  icon: '\u{23EA}',
  lessons: [{ label: 'Past Simple', href: '../grammar/beginner/past-simple.html' }],
  items: { mcq, dropdown, wordorder, wordbank, scramble },
};
