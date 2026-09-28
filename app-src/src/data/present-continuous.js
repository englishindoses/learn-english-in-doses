// Present Continuous - beginner. am, is, are + -ing, the -ing spelling rules,
// state verbs, and the difference from the present simple.

const mcq = [
  { id: 'pc-mc-01', sentence: 'I _____ lunch at my desk right now.', options: ['eat', 'am eating', 'eating'], answer: 1, clue: 'Right now needs be + -ing.' },
  { id: 'pc-mc-02', sentence: 'She _____ from home today.', options: ['works', 'is working', 'working'], answer: 1, clue: 'Today only, not every day.' },
  { id: 'pc-mc-03', sentence: 'What _____ you doing?', options: ['do', 'are', 'is'], answer: 1, clue: 'Which form of be goes with you?' },
  { id: 'pc-mc-04', sentence: 'They _____ for the bus at the moment.', options: ['are waiting', 'waiting', 'wait'], answer: 0, clue: 'At the moment needs be + -ing.' },
  { id: 'pc-mc-05', sentence: "He _____ working today. He's on holiday.", options: ["isn't", "doesn't", 'not'], answer: 0, clue: 'The negative of he is.' },
  { id: 'pc-mc-06', sentence: '_____ you listening to me?', options: ['Are', 'Do', 'Is'], answer: 0, clue: 'Which form of be goes with you?' },
  { id: 'pc-mc-07', sentence: "I _____ this song. It's great.", options: ['like', 'am liking', 'liking'], answer: 0, clue: 'State verbs do not use -ing.' },
  { id: 'pc-mc-08', sentence: 'We usually take the bus, but today we _____ a taxi.', options: ['take', 'are taking', 'takes'], answer: 1, clue: 'Today only, not our routine.' },
  { id: 'pc-mc-09', sentence: 'She is _____ on the chair by the window.', options: ['siting', 'sitting', 'sitteing'], answer: 1, clue: 'Consonant-vowel-consonant: double the last letter.' },
  { id: 'pc-mc-10', sentence: "I'm _____ dinner right now.", options: ['makeing', 'making', 'makking'], answer: 1, clue: 'The verb ends in -e.' },
  { id: 'pc-mc-11', sentence: 'She _____ coffee every morning.', options: ['drinks', 'is drinking', 'drinking'], answer: 0, clue: 'Every morning is a habit.' },
  { id: 'pc-mc-12', sentence: 'Is Tom coming to the meeting? - No, he _____.', options: ["isn't", "doesn't", 'not'], answer: 0, clue: 'Use the same verb as the question.' },
];

const dropdown = [
  { id: 'pc-dd-01', sentence: 'I {1} a report at the moment.', gaps: { 1: { options: ['write', 'am writing', 'writing'], answer: 'am writing' } }, clue: 'At the moment needs be + -ing.' },
  { id: 'pc-dd-02', sentence: 'My colleagues {1} lunch in the kitchen.', gaps: { 1: { options: ['are having', 'is having', 'having'], answer: 'are having' } }, clue: 'My colleagues = they.' },
  { id: 'pc-dd-03', sentence: '{1} she coming to the party?', gaps: { 1: { options: ['Is', 'Does', 'Are'], answer: 'Is' } }, clue: 'Which form of be goes with she?' },
  { id: 'pc-dd-04', sentence: 'Shh! The baby is {1}.', gaps: { 1: { options: ['sleeping', 'sleepping', 'sleep'], answer: 'sleeping' } }, clue: 'Most verbs just add -ing.' },
  { id: 'pc-dd-05', sentence: "We're {1} in the park before work.", gaps: { 1: { options: ['runing', 'running', 'run'], answer: 'running' } }, clue: 'Short verb: double the last letter.' },
  { id: 'pc-dd-06', sentence: "He's {1} an email to the manager.", gaps: { 1: { options: ['writeing', 'writing', 'writting'], answer: 'writing' } }, clue: 'The verb ends in -e.' },
  { id: 'pc-dd-07', sentence: "They {1} staying at a hotel. They're staying with friends.", gaps: { 1: { options: ["aren't", "don't", "isn't"], answer: "aren't" } }, clue: 'The negative of they are.' },
  { id: 'pc-dd-08', sentence: 'Are you waiting for a taxi? - Yes, I {1}.', gaps: { 1: { options: ['am', 'do', 'are'], answer: 'am' } }, clue: 'Which form of be goes with I?' },
  { id: 'pc-dd-09', sentence: 'What {1} he doing?', gaps: { 1: { options: ['is', 'does', 'are'], answer: 'is' } }, clue: 'Which form of be goes with he?' },
  { id: 'pc-dd-10', sentence: 'The children are {1} football in the garden.', gaps: { 1: { options: ['plaing', 'playing', 'playying'], answer: 'playing' } }, clue: 'We never double y.' },
  { id: 'pc-dd-11', sentence: "She {1} in a bank, but today she's working from home.", gaps: { 1: { options: ['works', 'is working', 'work'], answer: 'works' } }, clue: 'A job is a habit, not now.' },
  { id: 'pc-dd-12', sentence: 'I {1} what you mean.', gaps: { 1: { options: ['understand', 'am understanding', 'understanding'], answer: 'understand' } }, clue: 'State verbs do not use -ing.' },
];

const wordorder = [
  { id: 'pc-wo-01', context: 'Say what you are doing now', answer: 'i am reading a book', alternatives: [], clue: 'Start with I.' },
  { id: 'pc-wo-02', context: 'Say someone is not at work', answer: 'she is not working today', alternatives: ['today she is not working'], clue: 'Not goes after is.' },
  { id: 'pc-wo-03', context: 'Ask about now', answer: 'what are you doing', alternatives: [], clue: 'The question word comes first.' },
  { id: 'pc-wo-04', context: 'Say where you are waiting', answer: 'we are waiting for the train', alternatives: [], clue: 'Start with we.' },
  { id: 'pc-wo-05', context: 'Ask about the meeting', answer: 'is he coming to the meeting', alternatives: [], clue: 'In a question, be comes first.' },
  { id: 'pc-wo-06', context: 'Say what your colleagues are doing', answer: 'they are having lunch in the kitchen', alternatives: [], clue: 'Start with they.' },
  { id: 'pc-wo-07', context: 'Say where you are working today', answer: 'i am working from home today', alternatives: ['today i am working from home'], clue: 'Start with I.' },
  { id: 'pc-wo-08', context: 'Talk about the weather', answer: 'it is raining outside', alternatives: [], clue: 'Start with it.' },
  { id: 'pc-wo-09', context: 'Say what you are cooking', answer: 'i am making pasta for dinner', alternatives: [], clue: 'Start with I.' },
  { id: 'pc-wo-10', context: 'Ask about now', answer: 'are you listening to music', alternatives: [], clue: 'In a question, be comes first.' },
  { id: 'pc-wo-11', context: 'Say what someone is not doing', answer: "he isn't answering the phone", alternatives: [], clue: 'Start with he.' },
  { id: 'pc-wo-12', context: 'Say what you are studying', answer: 'i am learning english at the moment', alternatives: ['at the moment i am learning english'], clue: 'Start with I.' },
];

const wordbank = [
  { id: 'pc-wb-01', sentence: "I'm {1} lunch at my desk.", answer: 'eating', alternatives: [], clue: 'You do this with food.' },
  { id: 'pc-wb-02', sentence: "She's {1} an email to a customer.", answer: 'writing', alternatives: [], clue: 'Remove the -e first.' },
  { id: 'pc-wb-03', sentence: "We're {1} on a bench in the park.", answer: 'sitting', alternatives: [], clue: 'Double the last letter.' },
  { id: 'pc-wb-04', sentence: "He's {1} to catch the bus. He's late!", answer: 'running', alternatives: [], clue: 'Double the last letter.' },
  { id: 'pc-wb-05', sentence: "I'm {1} a cake for the party.", answer: 'making', alternatives: [], clue: 'Remove the -e first.' },
  { id: 'pc-wb-06', sentence: 'The kids are {1} a game on the computer.', answer: 'playing', alternatives: [], clue: 'Do not double y.' },
  { id: 'pc-wb-07', sentence: 'Is Tom {1} from home today?', answer: 'working', alternatives: [], clue: 'Just add -ing.' },
  { id: 'pc-wb-08', sentence: "I'm {1} for the bus. It's late again.", answer: 'waiting', alternatives: [], clue: 'Just add -ing.' },
  { id: 'pc-wb-09', sentence: 'Dad is {1} the newspaper.', answer: 'reading', alternatives: [], clue: 'Just add -ing.' },
  { id: 'pc-wb-10', sentence: 'Sara is {1} to the office. The traffic is terrible.', answer: 'driving', alternatives: [], clue: 'Remove the -e first.' },
  { id: 'pc-wb-11', sentence: 'The children are {1} in the pool.', answer: 'swimming', alternatives: [], clue: 'Double the last letter.' },
  { id: 'pc-wb-12', sentence: "We're {1} for new shoes.", answer: 'shopping', alternatives: [], clue: 'Double the last letter.' },
];

const scramble = [
  { id: 'pc-ss-01', answer: 'sitting', hint: 'The -ing form of sit.', clue: 'Seven letters.' },
  { id: 'pc-ss-02', answer: 'running', hint: 'The -ing form of run.', clue: 'Seven letters.' },
  { id: 'pc-ss-03', answer: 'making', hint: 'The -ing form of make.', clue: 'Six letters.' },
  { id: 'pc-ss-04', answer: 'writing', hint: 'The -ing form of write.', clue: 'Seven letters.' },
  { id: 'pc-ss-05', answer: 'swimming', hint: 'The -ing form of swim.', clue: 'Eight letters.' },
  { id: 'pc-ss-06', answer: 'stopping', hint: 'The -ing form of stop.', clue: 'Eight letters.' },
  { id: 'pc-ss-07', answer: 'living', hint: 'The -ing form of live.', clue: 'Six letters.' },
  { id: 'pc-ss-08', answer: 'playing', hint: 'The -ing form of play.', clue: 'Seven letters.' },
  { id: 'pc-ss-09', answer: 'shopping', hint: 'The -ing form of shop.', clue: 'Eight letters.' },
  { id: 'pc-ss-10', answer: 'coming', hint: 'The -ing form of come.', clue: 'Six letters.' },
  { id: 'pc-ss-11', answer: 'getting', hint: 'The -ing form of get.', clue: 'Seven letters.' },
  { id: 'pc-ss-12', answer: 'taking', hint: 'The -ing form of take.', clue: 'Six letters.' },
];

export default {
  id: 'present-continuous',
  section: 'grammar',
  order: 6,
  title: 'Present Continuous',
  subtitle: 'What is happening now',
  icon: '\u{1F3C3}',
  lessons: [{ label: 'Present Continuous', href: '../grammar/beginner/present-continuous.html' }],
  items: { mcq, dropdown, wordorder, wordbank, scramble },
};
