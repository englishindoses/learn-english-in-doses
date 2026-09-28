// Possessives - beginner. my, your, his, her, its, our, their; his or her;
// subject pronoun or possessive; its or it's.

const mcq = [
  { id: 'po-mc-01', sentence: "I can't find _____ phone.", options: ['my', 'me', 'I'], answer: 0, clue: 'The phone belongs to me.' },
  { id: 'po-mc-02', sentence: 'Tom loves _____ job.', options: ['her', 'his', 'he'], answer: 1, clue: 'Tom is a man.' },
  { id: 'po-mc-03', sentence: 'Anna is at work. _____ desk is by the window.', options: ['His', 'Her', 'She'], answer: 1, clue: 'Anna is a woman.' },
  { id: 'po-mc-04', sentence: 'We love _____ new flat.', options: ['our', 'us', 'we'], answer: 0, clue: 'The flat belongs to us.' },
  { id: 'po-mc-05', sentence: 'Is this _____ coat?', options: ['you', 'your', 'yours'], answer: 1, clue: 'A possessive goes before the noun.' },
  { id: 'po-mc-06', sentence: 'The company changed _____ name.', options: ["it's", 'its', 'his'], answer: 1, clue: 'Can you say it is here? No.' },
  { id: 'po-mc-07', sentence: 'My colleagues are in _____ office.', options: ['their', 'they', 'there'], answer: 0, clue: 'The office belongs to them.' },
  { id: 'po-mc-08', sentence: '_____ a nice day today.', options: ["It's", 'Its', 'It'], answer: 0, clue: 'Can you say it is here? Yes.' },
  { id: 'po-mc-09', sentence: 'My brother lost _____ keys.', options: ['her', 'his', 'its'], answer: 1, clue: 'Look at the owner, not the keys.' },
  { id: 'po-mc-10', sentence: 'Mrs Brown, is this _____ bag?', options: ['your', 'her', 'you'], answer: 0, clue: 'You are talking to Mrs Brown.' },
  { id: 'po-mc-11', sentence: 'My sister and I visit _____ parents on Sundays.', options: ['our', 'their', 'we'], answer: 0, clue: 'My sister and I = we.' },
  { id: 'po-mc-12', sentence: 'My neighbours are selling _____ car.', options: ['their', 'they', 'her'], answer: 0, clue: 'My neighbours = they.' },
];

const dropdown = [
  { id: 'po-dd-01', sentence: 'Hi, {1} name is Carlos.', gaps: { 1: { options: ['my', 'me', 'I'], answer: 'my' } }, clue: 'The name belongs to me.' },
  { id: 'po-dd-02', sentence: 'David is a chef. {1} restaurant is in the centre.', gaps: { 1: { options: ['His', 'Her', 'He'], answer: 'His' } }, clue: 'David is a man.' },
  { id: 'po-dd-03', sentence: 'Sara takes {1} dog to work.', gaps: { 1: { options: ['his', 'her', 'she'], answer: 'her' } }, clue: 'Sara is a woman.' },
  { id: 'po-dd-04', sentence: 'We have lunch with {1} team on Fridays.', gaps: { 1: { options: ['our', 'us', 'we'], answer: 'our' } }, clue: 'The team belongs to us.' },
  { id: 'po-dd-05', sentence: 'I love this café. {1} coffee is very good.', gaps: { 1: { options: ['Its', "It's", 'His'], answer: 'Its' } }, clue: 'Can you say it is here? No.' },
  { id: 'po-dd-06', sentence: "Don't forget {1} umbrella. It's raining.", gaps: { 1: { options: ['you', 'your', 'yours'], answer: 'your' } }, clue: 'A possessive goes before the noun.' },
  { id: 'po-dd-07', sentence: "They're on holiday with {1} children.", gaps: { 1: { options: ['they', 'their', 'there'], answer: 'their' } }, clue: 'The children belong to them.' },
  { id: 'po-dd-08', sentence: "{1} late. Let's go home.", gaps: { 1: { options: ["It's", 'Its', 'It'], answer: "It's" } }, clue: 'Can you say it is here? Yes.' },
  { id: 'po-dd-09', sentence: 'Mr Jones is in {1} office.', gaps: { 1: { options: ['his', 'her', 'its'], answer: 'his' } }, clue: 'Mr Jones is a man.' },
  { id: 'po-dd-10', sentence: 'My mum works in a hospital. {1} job is very hard.', gaps: { 1: { options: ['Her', 'His', 'She'], answer: 'Her' } }, clue: 'My mum is a woman.' },
  { id: 'po-dd-11', sentence: 'Tom and I are colleagues. {1} office is on the fifth floor.', gaps: { 1: { options: ['Our', 'Their', 'We'], answer: 'Our' } }, clue: 'Tom and I = we.' },
  { id: 'po-dd-12', sentence: 'I like this phone. {1} camera is great.', gaps: { 1: { options: ['Its', "It's", 'Their'], answer: 'Its' } }, clue: 'Can you say it is here? No.' },
];

const wordorder = [
  { id: 'po-wo-01', context: 'Show someone your phone', answer: 'this is my new phone', alternatives: [], clue: 'Start with this.' },
  { id: 'po-wo-02', context: 'Say what someone likes', answer: 'she likes her new job', alternatives: [], clue: 'Start with she.' },
  { id: 'po-wo-03', context: 'Ask about a bag', answer: 'is this your bag', alternatives: [], clue: 'In a question, is comes first.' },
  { id: 'po-wo-04', context: 'Say what someone is doing', answer: 'he is looking for his keys', alternatives: [], clue: 'Start with he.' },
  { id: 'po-wo-05', context: 'Say where people are', answer: 'they are at home with their kids', alternatives: [], clue: 'Start with they.' },
  { id: 'po-wo-06', context: 'Say where your office is', answer: 'our office is on the second floor', alternatives: [], clue: 'Start with our office.' },
  { id: 'po-wo-07', context: 'Talk about a friend', answer: 'my friend ana loves her job', alternatives: [], clue: 'Start with my friend.' },
  { id: 'po-wo-08', context: 'Say what the company is doing', answer: 'the company is changing its name', alternatives: [], clue: 'Start with the company.' },
  { id: 'po-wo-09', context: 'Ask about someone\'s family', answer: 'where do your parents live', alternatives: [], clue: 'The question word comes first.' },
  { id: 'po-wo-10', context: 'Say what your colleagues think', answer: 'they love their new office', alternatives: [], clue: 'Start with they.' },
  { id: 'po-wo-11', context: 'Talk about your Sundays', answer: 'we visit our parents on sundays', alternatives: [], clue: 'Start with we.' },
  { id: 'po-wo-12', context: 'Describe a man\'s car', answer: 'his car is very old', alternatives: [], clue: 'Start with his car.' },
];

const scramble = [
  { id: 'po-ss-01', answer: 'parents', hint: 'Your mother and father.', clue: 'Seven letters.' },
  { id: 'po-ss-02', answer: 'husband', hint: 'The man a woman is married to.', clue: 'Seven letters.' },
  { id: 'po-ss-03', answer: 'daughter', hint: 'Your parents\' girl.', clue: 'Eight letters.' },
  { id: 'po-ss-04', answer: 'brother', hint: 'A boy in your family, the son of your parents.', clue: 'Seven letters.' },
  { id: 'po-ss-05', answer: 'family', hint: 'Your parents, brothers, sisters and children.', clue: 'Six letters.' },
  { id: 'po-ss-06', answer: 'neighbour', hint: 'A person who lives next to you.', clue: 'Nine letters.' },
  { id: 'po-ss-07', answer: 'passport', hint: 'You show this at the airport.', clue: 'Eight letters.' },
  { id: 'po-ss-08', answer: 'wallet', hint: 'You keep your money and cards in this.', clue: 'Six letters.' },
  { id: 'po-ss-09', answer: 'laptop', hint: 'A small computer you can carry.', clue: 'Six letters.' },
  { id: 'po-ss-10', answer: 'desk', hint: 'You sit at this in the office.', clue: 'Four letters.' },
  { id: 'po-ss-11', answer: 'name', hint: 'Hi, my _____ is Carlos.', clue: 'Four letters.' },
  { id: 'po-ss-12', answer: 'mother', hint: 'Your mum.', clue: 'Six letters.' },
];

export default {
  id: 'possessives',
  section: 'grammar',
  order: 7,
  title: 'Possessives',
  subtitle: 'my, your, his, her, its',
  icon: '\u{1F511}',
  lessons: [{ label: 'Possessives: My, Your, His, Her, Our, Their', href: '../grammar/beginner/possessives.html' }],
  items: { mcq, dropdown, wordorder, scramble },
};
