// Countable and Uncountable - beginner. some and any, much and many, how
// much and how many, a lot of, and nouns with no plural.

const mcq = [
  { id: 'cu-mc-01', sentence: "I don't have _____ cash. Can I pay by card?", options: ['some', 'any', 'many'], answer: 1, clue: 'A negative sentence.' },
  { id: 'cu-mc-02', sentence: 'How _____ meetings do you have today?', options: ['much', 'many', 'any'], answer: 1, clue: 'You can count meetings.' },
  { id: 'cu-mc-03', sentence: 'How _____ sugar do you want?', options: ['many', 'much', 'some'], answer: 1, clue: 'You cannot count sugar.' },
  { id: 'cu-mc-04', sentence: 'We need _____ milk for the office.', options: ['some', 'any', 'many'], answer: 0, clue: 'A positive sentence.' },
  { id: 'cu-mc-05', sentence: 'Do you have _____ plans for the weekend?', options: ['any', 'some', 'much'], answer: 0, clue: 'A question.' },
  { id: 'cu-mc-06', sentence: 'I need some _____ about the course.', options: ['informations', 'information', 'an information'], answer: 1, clue: 'Uncountable nouns have no plural.' },
  { id: 'cu-mc-07', sentence: 'My friend always gives me good _____.', options: ['advice', 'advices', 'an advice'], answer: 0, clue: 'Uncountable: no a or an, no -s.' },
  { id: 'cu-mc-08', sentence: "There isn't _____ traffic today.", options: ['many', 'much', 'some'], answer: 1, clue: 'You cannot count traffic.' },
  { id: 'cu-mc-09', sentence: 'I have _____ friends at work.', options: ['a lot of', 'much', 'any'], answer: 0, clue: 'A positive sentence.' },
  { id: 'cu-mc-10', sentence: 'How _____ people work in your office?', options: ['much', 'many', 'some'], answer: 1, clue: 'You can count people.' },
  { id: 'cu-mc-11', sentence: "I need _____ water. I'm thirsty.", options: ['some', 'any', 'many'], answer: 0, clue: 'A positive sentence.' },
  { id: 'cu-mc-12', sentence: "She doesn't drink _____ coffee.", options: ['much', 'many', 'some'], answer: 0, clue: 'You cannot count coffee.' },
];

const dropdown = [
  { id: 'cu-dd-01', sentence: 'There are {1} biscuits in the kitchen.', gaps: { 1: { options: ['some', 'any', 'much'], answer: 'some' } }, clue: 'A positive sentence.' },
  { id: 'cu-dd-02', sentence: "I don't have {1} money this month.", gaps: { 1: { options: ['some', 'many', 'much'], answer: 'much' } }, clue: 'You cannot count money.' },
  { id: 'cu-dd-03', sentence: 'How {1} emails do you get every day?', gaps: { 1: { options: ['much', 'many', 'any'], answer: 'many' } }, clue: 'You can count emails.' },
  { id: 'cu-dd-04', sentence: 'How {1} time do you need?', gaps: { 1: { options: ['many', 'much', 'some'], answer: 'much' } }, clue: 'You cannot count time.' },
  { id: 'cu-dd-05', sentence: 'Is there {1} milk in the fridge?', gaps: { 1: { options: ['any', 'some', 'many'], answer: 'any' } }, clue: 'A question.' },
  { id: 'cu-dd-06', sentence: "We don't have {1} meetings on Friday.", gaps: { 1: { options: ['any', 'much', 'some'], answer: 'any' } }, clue: 'A negative sentence.' },
  { id: 'cu-dd-07', sentence: 'I have {1} work today.', gaps: { 1: { options: ['a lot of', 'many', 'any'], answer: 'a lot of' } }, clue: 'A positive sentence. Work is uncountable.' },
  { id: 'cu-dd-08', sentence: 'I have {1} and eggs for breakfast.', gaps: { 1: { options: ['bread', 'a bread', 'breads'], answer: 'bread' } }, clue: 'Uncountable: no a, no -s.' },
  { id: 'cu-dd-09', sentence: 'There is a lot of {1} this morning.', gaps: { 1: { options: ['traffic', 'traffics', 'a traffic'], answer: 'traffic' } }, clue: 'Uncountable: no a, no -s.' },
  { id: 'cu-dd-10', sentence: "I don't have {1} brothers or sisters.", gaps: { 1: { options: ['any', 'some', 'much'], answer: 'any' } }, clue: 'A negative sentence.' },
  { id: 'cu-dd-11', sentence: 'How {1} coffee do you drink every day?', gaps: { 1: { options: ['many', 'much', 'any'], answer: 'much' } }, clue: 'You cannot count coffee.' },
  { id: 'cu-dd-12', sentence: "There aren't {1} chairs in the meeting room.", gaps: { 1: { options: ['many', 'much', 'some'], answer: 'many' } }, clue: 'You can count chairs.' },
];

const wordorder = [
  { id: 'cu-wo-01', context: 'Ask about money', answer: 'how much money do you need', alternatives: [], clue: 'Start with how much.' },
  { id: 'cu-wo-02', context: 'Say what is not near your office', answer: "there aren't any shops near my office", alternatives: [], clue: 'Start with there.' },
  { id: 'cu-wo-03', context: 'Ask about a team', answer: 'how many people are in your team', alternatives: [], clue: 'Start with how many.' },
  { id: 'cu-wo-04', context: 'Say what you need', answer: 'we need some milk for the office', alternatives: [], clue: 'Start with we.' },
  { id: 'cu-wo-05', context: 'Say you are busy', answer: "i don't have much time today", alternatives: [], clue: 'Start with I.' },
  { id: 'cu-wo-06', context: 'Ask about questions', answer: 'do you have any questions', alternatives: [], clue: 'Start with do.' },
  { id: 'cu-wo-07', context: 'Talk about your friends', answer: 'i have a lot of friends at work', alternatives: [], clue: 'Start with I.' },
  { id: 'cu-wo-08', context: 'Ask about emails', answer: 'how many emails do you get every day', alternatives: [], clue: 'Start with how many.' },
  { id: 'cu-wo-09', context: 'Say how you like your coffee', answer: "i don't want any sugar", alternatives: [], clue: 'Start with I.' },
  { id: 'cu-wo-10', context: 'Say what is in the kitchen', answer: 'there is some coffee in the kitchen', alternatives: [], clue: 'Start with there.' },
  { id: 'cu-wo-11', context: 'Ask about coffee', answer: 'how much coffee do you drink', alternatives: [], clue: 'Start with how much.' },
  { id: 'cu-wo-12', context: 'Say what you need', answer: 'i need some information about the course', alternatives: [], clue: 'Start with I.' },
];

const wordbank = [
  { id: 'cu-wb-01', sentence: 'How much {1} do you need for the taxi?', answer: 'money', alternatives: [], clue: 'You pay with this.' },
  { id: 'cu-wb-02', sentence: 'I need some {1} about the train times.', answer: 'information', alternatives: [], clue: 'Facts about something.' },
  { id: 'cu-wb-03', sentence: 'My mum always gives me good {1}.', answer: 'advice', alternatives: [], clue: 'Ideas to help you decide.' },
  { id: 'cu-wb-04', sentence: "Sorry, I don't have much {1} today. Let's talk tomorrow.", answer: 'time', alternatives: [], clue: 'Hours and minutes.' },
  { id: 'cu-wb-05', sentence: "There isn't any {1} for my coffee.", answer: 'milk', alternatives: [], clue: 'A white drink from cows.' },
  { id: 'cu-wb-06', sentence: "There's a lot of {1} on the road to work.", answer: 'traffic', alternatives: [], clue: 'Too many cars.' },
  { id: 'cu-wb-07', sentence: 'How many {1} do you have today? - Three.', answer: 'meetings', alternatives: [], clue: 'Countable: you sit and talk with colleagues in these.' },
  { id: 'cu-wb-08', sentence: 'How many {1} work in your office?', answer: 'people', alternatives: [], clue: 'Countable: men and women.' },
  { id: 'cu-wb-09', sentence: 'I get a lot of {1} every day. My inbox is full.', answer: 'emails', alternatives: [], clue: 'Countable: messages on your computer.' },
  { id: 'cu-wb-10', sentence: 'Do you have any {1}? - No, everything is clear.', answer: 'questions', alternatives: [], clue: 'Countable: you ask these.' },
  { id: 'cu-wb-11', sentence: 'We need six {1} for the cake.', answer: 'eggs', alternatives: [], clue: 'Countable: chickens lay these.' },
  { id: 'cu-wb-12', sentence: 'The children have a lot of {1} from school tonight.', answer: 'homework', alternatives: [], clue: 'Uncountable: school work you do at home.' },
];

const scramble = [
  { id: 'cu-ss-01', answer: 'information', hint: 'Facts about something. Never with -s.', clue: 'Eleven letters.' },
  { id: 'cu-ss-02', answer: 'advice', hint: 'Ideas to help someone. Never with -s.', clue: 'Six letters.' },
  { id: 'cu-ss-03', answer: 'money', hint: 'You pay with this.', clue: 'Five letters.' },
  { id: 'cu-ss-04', answer: 'traffic', hint: 'All the cars on the road.', clue: 'Seven letters.' },
  { id: 'cu-ss-05', answer: 'bread', hint: 'You make toast and sandwiches with this.', clue: 'Five letters.' },
  { id: 'cu-ss-06', answer: 'sugar', hint: 'Some people put this in their coffee.', clue: 'Five letters.' },
  { id: 'cu-ss-07', answer: 'weather', hint: 'Sun, rain, wind and snow.', clue: 'Seven letters.' },
  { id: 'cu-ss-08', answer: 'luggage', hint: 'Your bags when you travel.', clue: 'Seven letters.' },
  { id: 'cu-ss-09', answer: 'furniture', hint: 'Tables, chairs and beds.', clue: 'Nine letters.' },
  { id: 'cu-ss-10', answer: 'homework', hint: 'Work from school that you do at home.', clue: 'Eight letters.' },
  { id: 'cu-ss-11', answer: 'cheese', hint: 'A yellow food made from milk.', clue: 'Six letters.' },
  { id: 'cu-ss-12', answer: 'rice', hint: 'Small white grains. People eat it with curry.', clue: 'Four letters.' },
];

export default {
  id: 'countable-uncountable',
  section: 'grammar',
  order: 8,
  title: 'Countable and Uncountable',
  subtitle: 'some, any, much, many',
  icon: '\u{2615}',
  lessons: [{ label: 'Countable and Uncountable Nouns', href: '../grammar/beginner/countable-uncountable.html' }],
  items: { mcq, dropdown, wordorder, wordbank, scramble },
};
