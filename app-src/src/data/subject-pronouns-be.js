// Subject Pronouns and Be - beginner. The first lesson, so everything here
// uses only am, is and are, with everyday words a beginner already has.

const mcq = [
  { id: 'sp-mc-01', sentence: 'I _____ tired today.', options: ['am', 'is', 'are'], answer: 0, clue: 'Only one form goes with I.' },
  { id: 'sp-mc-02', sentence: 'My manager _____ very nice.', options: ['are', 'is', 'am'], answer: 1, clue: 'My manager = he or she.' },
  { id: 'sp-mc-03', sentence: 'We _____ in a meeting.', options: ['is', 'am', 'are'], answer: 2, clue: 'We = more than one person.' },
  { id: 'sp-mc-04', sentence: '_____ you at work?', options: ['Is', 'Am', 'Are'], answer: 2, clue: 'Which form goes with you?' },
  { id: 'sp-mc-05', sentence: 'She _____ not in the office today.', options: ['are', 'is', 'am'], answer: 1, clue: 'She takes the same form as he and it.' },
  { id: 'sp-mc-06', sentence: 'My colleagues _____ from Spain.', options: ['is', 'are', 'am'], answer: 1, clue: 'My colleagues = they.' },
  { id: 'sp-mc-07', sentence: 'It _____ cold in the office.', options: ['is', 'are', 'am'], answer: 0, clue: 'It takes the same form as he and she.' },
  { id: 'sp-mc-08', sentence: 'Are you hungry? - No, _____.', options: ["I'm not", "I amn't", 'I not'], answer: 0, clue: 'There is only one short form for I am not.' },
  { id: 'sp-mc-09', sentence: 'Is he your boss? - Yes, _____.', options: ["he's", 'he is', 'he are'], answer: 1, clue: 'No short form in a positive short answer.' },
  { id: 'sp-mc-10', sentence: 'The shop _____ open today.', options: ["isn't", "aren't", 'not'], answer: 0, clue: 'The shop = it.' },
  { id: 'sp-mc-11', sentence: "My parents _____ at home. They're on holiday.", options: ["aren't", "isn't", 'not'], answer: 0, clue: 'My parents = they.' },
  { id: 'sp-mc-12', sentence: '_____ the station far from here?', options: ['Is', 'Are', 'Am'], answer: 0, clue: 'The station = it.' },
];

const dropdown = [
  { id: 'sp-dd-01', sentence: 'My sister {1} a teacher.', gaps: { 1: { options: ['am', 'is', 'are'], answer: 'is' } }, clue: 'My sister = she.' },
  { id: 'sp-dd-02', sentence: '{1} your colleagues nice?', gaps: { 1: { options: ['Is', 'Are', 'Am'], answer: 'Are' } }, clue: 'Your colleagues = they.' },
  { id: 'sp-dd-03', sentence: 'I {1} at the bus stop.', gaps: { 1: { options: ['am', 'is', 'are'], answer: 'am' } }, clue: 'Only one form goes with I.' },
  { id: 'sp-dd-04', sentence: "Tom {1} at work today. He's ill.", gaps: { 1: { options: ["isn't", "aren't", 'not'], answer: "isn't" } }, clue: 'Tom = he.' },
  { id: 'sp-dd-05', sentence: 'We {1} very busy this morning.', gaps: { 1: { options: ['is', 'are', 'am'], answer: 'are' } }, clue: 'We = more than one person.' },
  { id: 'sp-dd-06', sentence: '{1} you ready for the meeting?', gaps: { 1: { options: ['Are', 'Is', 'Am'], answer: 'Are' } }, clue: 'Which form goes with you?' },
  { id: 'sp-dd-07', sentence: 'The coffee {1} very hot.', gaps: { 1: { options: ['is', 'are', 'am'], answer: 'is' } }, clue: 'The coffee = it.' },
  { id: 'sp-dd-08', sentence: 'Are you from Italy? - No, {1}.', gaps: { 1: { options: ["I'm not", "I amn't", 'I not'], answer: "I'm not" } }, clue: "We never say amn't." },
  { id: 'sp-dd-09', sentence: 'Is she your manager? - Yes, she {1}.', gaps: { 1: { options: ['is', 'are', 'am'], answer: 'is' } }, clue: 'Use the same form as the question.' },
  { id: 'sp-dd-10', sentence: 'Are they at the office? - No, they {1}.', gaps: { 1: { options: ["aren't", "isn't", 'not'], answer: "aren't" } }, clue: 'They takes the same form as we and you.' },
  { id: 'sp-dd-11', sentence: 'My phone {1} in my bag.', gaps: { 1: { options: ['is', 'am', 'are'], answer: 'is' } }, clue: 'My phone = it.' },
  { id: 'sp-dd-12', sentence: '{1} Anna and Tom in the meeting?', gaps: { 1: { options: ['Is', 'Are', 'Am'], answer: 'Are' } }, clue: 'Anna and Tom = they.' },
];

const wordorder = [
  { id: 'sp-wo-01', context: 'Say where you are', answer: 'i am at the station', alternatives: [], clue: 'Start with I.' },
  { id: 'sp-wo-02', context: 'Say where your colleagues are from', answer: 'my colleagues are from spain', alternatives: [], clue: 'Start with the people.' },
  { id: 'sp-wo-03', context: 'Say someone is not here', answer: 'she is not in the office today', alternatives: ['today she is not in the office'], clue: 'Not comes after the verb be.' },
  { id: 'sp-wo-04', context: 'Ask about a job', answer: 'is your brother a doctor', alternatives: [], clue: 'In a question, be comes first.' },
  { id: 'sp-wo-05', context: 'Ask if someone is ready', answer: 'are you ready for the meeting', alternatives: [], clue: 'In a question, be comes first.' },
  { id: 'sp-wo-06', context: 'Say how you feel', answer: 'i am very tired today', alternatives: ['today i am very tired'], clue: 'Very goes before tired.' },
  { id: 'sp-wo-07', context: 'Say where you are', answer: 'we are on the train', alternatives: [], clue: 'Start with we.' },
  { id: 'sp-wo-08', context: 'Talk about the weather', answer: 'it is cold today', alternatives: ['today it is cold'], clue: 'Start with it.' },
  { id: 'sp-wo-09', context: 'Ask about a place', answer: 'is the office far from here', alternatives: [], clue: 'In a question, be comes first.' },
  { id: 'sp-wo-10', context: 'Say someone is not at home', answer: "my parents aren't at home", alternatives: [], clue: 'Start with the people.' },
  { id: 'sp-wo-11', context: 'Say who someone is', answer: 'she is my new manager', alternatives: [], clue: 'New goes before manager.' },
  { id: 'sp-wo-12', context: 'Ask if someone is at work', answer: 'are you at work today', alternatives: [], clue: 'In a question, be comes first.' },
];

const scramble = [
  { id: 'sp-ss-01', answer: 'tired', hint: 'How you feel after a long day.', clue: 'Five letters.' },
  { id: 'sp-ss-02', answer: 'hungry', hint: 'How you feel before lunch.', clue: 'Six letters.' },
  { id: 'sp-ss-03', answer: 'ready', hint: 'Are you _____? We need to go.', clue: 'Five letters.' },
  { id: 'sp-ss-04', answer: 'late', hint: 'The opposite of early.', clue: 'Four letters.' },
  { id: 'sp-ss-05', answer: 'manager', hint: 'The boss of a team.', clue: 'Seven letters.' },
  { id: 'sp-ss-06', answer: 'meeting', hint: 'People sit together and talk about work.', clue: 'Seven letters.' },
  { id: 'sp-ss-07', answer: 'office', hint: 'A place where people work at desks.', clue: 'Six letters.' },
  { id: 'sp-ss-08', answer: 'station', hint: 'You get the train here.', clue: 'Seven letters.' },
  { id: 'sp-ss-09', answer: 'happy', hint: 'The opposite of sad.', clue: 'Five letters.' },
  { id: 'sp-ss-10', answer: 'kind', hint: 'Nice and friendly to other people.', clue: 'Four letters.' },
  { id: 'sp-ss-11', answer: 'airport', hint: 'Planes leave from here.', clue: 'Seven letters.' },
  { id: 'sp-ss-12', answer: 'engineer', hint: 'A job. This person designs machines or buildings.', clue: 'Eight letters.' },
];

export default {
  id: 'subject-pronouns-be',
  section: 'grammar',
  order: 1,
  title: 'Subject Pronouns and Be',
  subtitle: 'I am, you are, he is',
  icon: '\u{1F64B}',
  lessons: [{ label: 'Subject Pronouns and the Verb "Be"', href: '../grammar/beginner/subject-pronouns-be.html' }],
  items: { mcq, dropdown, wordorder, scramble },
};
