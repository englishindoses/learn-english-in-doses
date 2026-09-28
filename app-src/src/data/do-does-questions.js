// Questions with Do and Does - beginner. Yes/no questions, short answers and
// wh- questions in the present simple, as the worksheet teaches them.

const mcq = [
  { id: 'dq-mc-01', sentence: '_____ you walk to work?', options: ['Do', 'Does', 'Are'], answer: 0, clue: 'You takes the same word as I, we and they.' },
  { id: 'dq-mc-02', sentence: '_____ your boss work from home?', options: ['Do', 'Does', 'Is'], answer: 1, clue: 'Your boss = he or she.' },
  { id: 'dq-mc-03', sentence: '_____ the gym open early?', options: ['Do', 'Does', 'Are'], answer: 1, clue: 'The gym = it.' },
  { id: 'dq-mc-04', sentence: 'Where _____ your sister work?', options: ['do', 'does', 'is'], answer: 1, clue: 'Your sister = she.' },
  { id: 'dq-mc-05', sentence: 'What time _____ you finish work?', options: ['does', 'do', 'are'], answer: 1, clue: 'Which word goes with you?' },
  { id: 'dq-mc-06', sentence: 'Does he drive to work? - No, he _____.', options: ["don't", "doesn't", "isn't"], answer: 1, clue: 'Use the same word as the question.' },
  { id: 'dq-mc-07', sentence: 'Do you like your job? - Yes, I _____.', options: ['do', 'does', 'am'], answer: 0, clue: 'Short answers use the word from the question.' },
  { id: 'dq-mc-08', sentence: 'Does she _____ tea or coffee?', options: ['drink', 'drinks', 'drinking'], answer: 0, clue: 'After does, the verb has no -s.' },
  { id: 'dq-mc-09', sentence: '_____ do you get to work? - By train.', options: ['How', 'Where', 'Who'], answer: 0, clue: 'The answer tells us the way.' },
  { id: 'dq-mc-10', sentence: "_____ do you have lunch? - At one o'clock.", options: ['When', 'Where', 'Why'], answer: 0, clue: 'The answer is a time.' },
  { id: 'dq-mc-11', sentence: '_____ do you work with? - Ana and Tom.', options: ['Who', 'What', 'Where'], answer: 0, clue: 'The answer is people.' },
  { id: 'dq-mc-12', sentence: '_____ do you play tennis? - Twice a week.', options: ['How often', 'How much', 'How long'], answer: 0, clue: 'The answer says how many times.' },
];

const dropdown = [
  { id: 'dq-dd-01', sentence: '{1} your colleagues speak English?', gaps: { 1: { options: ['Do', 'Does', 'Are'], answer: 'Do' } }, clue: 'Your colleagues = they.' },
  { id: 'dq-dd-02', sentence: '{1} this train stop at the airport?', gaps: { 1: { options: ['Do', 'Does', 'Is'], answer: 'Does' } }, clue: 'This train = it.' },
  { id: 'dq-dd-03', sentence: "{1} does she take the bus? - Because she doesn't drive.", gaps: { 1: { options: ['Why', 'When', 'Where'], answer: 'Why' } }, clue: 'The answer gives a reason.' },
  { id: 'dq-dd-04', sentence: 'Where {1} you buy your lunch?', gaps: { 1: { options: ['do', 'does', 'are'], answer: 'do' } }, clue: 'Which word goes with you?' },
  { id: 'dq-dd-05', sentence: '{1} do you go on Friday nights? - To the cinema.', gaps: { 1: { options: ['Where', 'When', 'Who'], answer: 'Where' } }, clue: 'The answer is a place.' },
  { id: 'dq-dd-06', sentence: 'Does your office {1} a kitchen?', gaps: { 1: { options: ['have', 'has', 'having'], answer: 'have' } }, clue: 'After does, the verb goes back to the base form.' },
  { id: 'dq-dd-07', sentence: 'Do you cook at home? - No, I {1}.', gaps: { 1: { options: ["don't", "doesn't", 'not'], answer: "don't" } }, clue: 'Which negative word goes with I?' },
  { id: 'dq-dd-08', sentence: 'What {1} your brother do?', gaps: { 1: { options: ['do', 'does', 'is'], answer: 'does' } }, clue: 'Your brother = he.' },
  { id: 'dq-dd-09', sentence: '{1} often do you go to the gym?', gaps: { 1: { options: ['How', 'What', 'When'], answer: 'How' } }, clue: 'Ask about the number of times.' },
  { id: 'dq-dd-10', sentence: 'Which bus {1} you take to work?', gaps: { 1: { options: ['do', 'does', 'are'], answer: 'do' } }, clue: 'Which word goes with you?' },
  { id: 'dq-dd-11', sentence: 'What time {1} the shop close?', gaps: { 1: { options: ['do', 'does', 'is'], answer: 'does' } }, clue: 'The shop = it.' },
  { id: 'dq-dd-12', sentence: 'Do they work in your team? - Yes, they {1}.', gaps: { 1: { options: ['do', 'does', 'are'], answer: 'do' } }, clue: 'Use the same word as the question.' },
];

const wordorder = [
  { id: 'dq-wo-01', context: 'Ask about a job', answer: 'what do you do', alternatives: [], clue: 'The question word comes first.' },
  { id: 'dq-wo-02', context: 'Ask where someone works', answer: 'where does your sister work', alternatives: [], clue: 'The question word comes first.' },
  { id: 'dq-wo-03', context: 'Ask about the journey to work', answer: 'how do you get to work', alternatives: [], clue: 'The question word comes first.' },
  { id: 'dq-wo-04', context: 'Ask about a start time', answer: 'what time does the meeting start', alternatives: [], clue: 'Start with what time.' },
  { id: 'dq-wo-05', context: 'Ask about a habit', answer: 'do you drink coffee in the morning', alternatives: [], clue: 'Yes/no questions start with do or does.' },
  { id: 'dq-wo-06', context: 'Ask about the weekend', answer: 'does she work at the weekend', alternatives: [], clue: 'Yes/no questions start with do or does.' },
  { id: 'dq-wo-07', context: 'Ask about free time', answer: 'what do you do at the weekend', alternatives: [], clue: 'The question word comes first.' },
  { id: 'dq-wo-08', context: 'Ask about a sport', answer: 'how often do you play football', alternatives: [], clue: 'Start with how often.' },
  { id: 'dq-wo-09', context: 'Ask about lunch', answer: 'where do you usually have lunch', alternatives: [], clue: 'Usually goes before the main verb.' },
  { id: 'dq-wo-10', context: 'Ask about a colleague', answer: 'does tom speak spanish', alternatives: [], clue: 'Tom = he.' },
  { id: 'dq-wo-11', context: 'Ask about the bus', answer: 'which bus do you take', alternatives: [], clue: 'Start with which bus.' },
  { id: 'dq-wo-12', context: 'Ask for a reason', answer: 'why do you like your job', alternatives: [], clue: 'The question word comes first.' },
];

const wordbank = [
  { id: 'dq-wb-01', sentence: "{1} you live near here? - Yes, it's five minutes away.", answer: 'do', alternatives: [], clue: 'Which word goes with you?' },
  { id: 'dq-wb-02', sentence: '{1} your son like school? - Yes, he loves it.', answer: 'does', alternatives: [], clue: 'Your son = he.' },
  { id: 'dq-wb-03', sentence: 'Do you eat meat? - No, I {1}.', answer: "don't", alternatives: ['dont'], clue: 'The negative short answer for I.' },
  { id: 'dq-wb-04', sentence: 'Does Ana drive? - No, she {1}.', answer: "doesn't", alternatives: ['doesnt'], clue: 'The negative short answer for she.' },
  { id: 'dq-wb-05', sentence: "{1} do you do? - I'm a nurse.", answer: 'what', alternatives: [], clue: 'The answer is a job.' },
  { id: 'dq-wb-06', sentence: '{1} do you live? - Near the station.', answer: 'where', alternatives: [], clue: 'The answer is a place.' },
  { id: 'dq-wb-07', sentence: '{1} does the film start? - At eight.', answer: 'when', alternatives: [], clue: 'The answer is a time.' },
  { id: 'dq-wb-08', sentence: '{1} do you live with? - My parents.', answer: 'who', alternatives: [], clue: 'The answer is people.' },
  { id: 'dq-wb-09', sentence: '{1} do you get up so early? - Because I start work at seven.', answer: 'why', alternatives: [], clue: 'The answer gives a reason.' },
  { id: 'dq-wb-10', sentence: '{1} do you get to work? - By bike.', answer: 'how', alternatives: [], clue: 'The answer tells us the way.' },
  { id: 'dq-wb-11', sentence: '{1} gym do you go to? - The one near my office.', answer: 'which', alternatives: [], clue: 'Choose one from a group.' },
  { id: 'dq-wb-12', sentence: 'How {1} do you see your parents? - Every Sunday.', answer: 'often', alternatives: [], clue: 'Ask about the number of times.' },
];

const scramble = [
  { id: 'dq-ss-01', answer: 'where', hint: 'A question word for a place.', clue: 'Five letters.' },
  { id: 'dq-ss-02', answer: 'when', hint: 'A question word for a time.', clue: 'Four letters.' },
  { id: 'dq-ss-03', answer: 'which', hint: 'A question word for one from a group.', clue: 'Five letters.' },
  { id: 'dq-ss-04', answer: 'often', hint: 'How _____ do you go? Once a week.', clue: 'Five letters.' },
  { id: 'dq-ss-05', answer: 'does', hint: 'The question word for he, she and it.', clue: 'Four letters.' },
  { id: 'dq-ss-06', answer: 'question', hint: 'You ask this.', clue: 'Eight letters.' },
  { id: 'dq-ss-07', answer: 'answer', hint: 'You give this when someone asks you something.', clue: 'Six letters.' },
  { id: 'dq-ss-08', answer: 'weekend', hint: 'Saturday and Sunday.', clue: 'Seven letters.' },
  { id: 'dq-ss-09', answer: 'colleague', hint: 'A person you work with.', clue: 'Nine letters.' },
  { id: 'dq-ss-10', answer: 'cinema', hint: 'You watch films here.', clue: 'Six letters.' },
  { id: 'dq-ss-11', answer: 'breakfast', hint: 'Your first meal of the day.', clue: 'Nine letters.' },
  { id: 'dq-ss-12', answer: 'dinner', hint: 'Your evening meal.', clue: 'Six letters.' },
];

export default {
  id: 'do-does-questions',
  section: 'grammar',
  order: 5,
  title: 'Do and Does Questions',
  subtitle: 'Asking about habits',
  icon: '\u{2753}',
  lessons: [{ label: 'Questions with Do and Does', href: '../grammar/beginner/do-does-questions.html' }],
  items: { mcq, dropdown, wordorder, wordbank, scramble },
};
