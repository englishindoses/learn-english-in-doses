// There is and There are - beginner. Positive, negative, questions, short
// answers, some and any, and how many ... are there.

const mcq = [
  { id: 'th-mc-01', sentence: '_____ a café near my office.', options: ['There is', 'There are', 'It is'], answer: 0, clue: 'One café.' },
  { id: 'th-mc-02', sentence: '_____ three meeting rooms on this floor.', options: ['There is', 'There are', 'It has'], answer: 1, clue: 'More than one room.' },
  { id: 'th-mc-03', sentence: '_____ a bathroom on this floor?', options: ['Is there', 'Are there', 'Has it'], answer: 0, clue: 'One bathroom.' },
  { id: 'th-mc-04', sentence: '_____ any good restaurants near here?', options: ['Is there', 'Are there', 'Do there'], answer: 1, clue: 'Restaurants is plural.' },
  { id: 'th-mc-05', sentence: 'There _____ any milk in the fridge.', options: ["isn't", "aren't", "don't"], answer: 0, clue: 'Milk is uncountable.' },
  { id: 'th-mc-06', sentence: 'There _____ any seats on the train.', options: ["isn't", "aren't", "doesn't"], answer: 1, clue: 'Seats is plural.' },
  { id: 'th-mc-07', sentence: 'How many people _____ in your team?', options: ['is there', 'are there', 'there are'], answer: 1, clue: 'A question with a plural noun.' },
  { id: 'th-mc-08', sentence: 'Is there a lift? - No, _____.', options: ["there isn't", "it isn't", "there aren't"], answer: 0, clue: 'Use the same words as the question.' },
  { id: 'th-mc-09', sentence: '_____ a lot of traffic today.', options: ['There is', 'There are', 'It has'], answer: 0, clue: 'Traffic is uncountable.' },
  { id: 'th-mc-10', sentence: 'There _____ some chairs in the kitchen.', options: ['is', 'are', 'has'], answer: 1, clue: 'Chairs is plural.' },
  { id: 'th-mc-11', sentence: 'Are there any biscuits? - Yes, _____.', options: ['there are', 'there is', 'they are'], answer: 0, clue: 'Use the same words as the question.' },
  { id: 'th-mc-12', sentence: "_____ a meeting at three o'clock.", options: ["There's", 'There are', 'It has'], answer: 0, clue: 'One meeting.' },
];

const dropdown = [
  { id: 'th-dd-01', sentence: '{1} a printer in the office?', gaps: { 1: { options: ['Is there', 'Are there', 'Has there'], answer: 'Is there' } }, clue: 'One printer.' },
  { id: 'th-dd-02', sentence: 'There {1} two cafés on my street.', gaps: { 1: { options: ['is', 'are', 'has'], answer: 'are' } }, clue: 'More than one café.' },
  { id: 'th-dd-03', sentence: 'There {1} a supermarket near my house.', gaps: { 1: { options: ['is', 'are', 'have'], answer: 'is' } }, clue: 'One supermarket.' },
  { id: 'th-dd-04', sentence: 'There {1} any buses after midnight.', gaps: { 1: { options: ["aren't", "isn't", "don't"], answer: "aren't" } }, clue: 'Buses is plural.' },
  { id: 'th-dd-05', sentence: 'How many floors {1} in your building?', gaps: { 1: { options: ['are there', 'is there', 'there are'], answer: 'are there' } }, clue: 'A question with a plural noun.' },
  { id: 'th-dd-06', sentence: '{1} any coffee left?', gaps: { 1: { options: ['Is there', 'Are there', 'Is it'], answer: 'Is there' } }, clue: 'Coffee is uncountable.' },
  { id: 'th-dd-07', sentence: 'There {1} a lot of people on the train every morning.', gaps: { 1: { options: ['are', 'is', 'has'], answer: 'are' } }, clue: 'People is plural.' },
  { id: 'th-dd-08', sentence: 'Are there any shops at the station? - No, there {1}.', gaps: { 1: { options: ["aren't", "isn't", "don't"], answer: "aren't" } }, clue: 'Use the same verb as the question.' },
  { id: 'th-dd-09', sentence: 'There {1} a gym in our building.', gaps: { 1: { options: ["isn't", "aren't", "doesn't"], answer: "isn't" } }, clue: 'One gym.' },
  { id: 'th-dd-10', sentence: '{1} a bus stop near here?', gaps: { 1: { options: ['Is there', 'Are there', 'It is'], answer: 'Is there' } }, clue: 'One bus stop.' },
  { id: 'th-dd-11', sentence: 'There {1} some water on the table.', gaps: { 1: { options: ['is', 'are', 'has'], answer: 'is' } }, clue: 'Water: uncountable.' },
  { id: 'th-dd-12', sentence: 'Is there a car park? - Yes, there {1}.', gaps: { 1: { options: ['is', 'are', 'has'], answer: 'is' } }, clue: 'Use the same verb as the question.' },
];

const wordorder = [
  { id: 'th-wo-01', context: 'Describe your street', answer: 'there is a park near my house', alternatives: [], clue: 'Start with there.' },
  { id: 'th-wo-02', context: 'Say what is not near you', answer: "there aren't any shops near here", alternatives: [], clue: 'Start with there.' },
  { id: 'th-wo-03', context: 'Ask about a bathroom', answer: 'is there a bathroom on this floor', alternatives: [], clue: 'In a question, is comes first.' },
  { id: 'th-wo-04', context: 'Describe your flat', answer: 'there are two bedrooms in my flat', alternatives: [], clue: 'Start with there.' },
  { id: 'th-wo-05', context: 'Ask about a team', answer: 'how many people are there in your team', alternatives: [], clue: 'Start with how many.' },
  { id: 'th-wo-06', context: 'Ask about restaurants', answer: 'are there any good restaurants near here', alternatives: [], clue: 'In a question, are comes first.' },
  { id: 'th-wo-07', context: 'Say what is in the fridge', answer: 'there is some milk in the fridge', alternatives: [], clue: 'Start with there.' },
  { id: 'th-wo-08', context: 'Describe your office', answer: 'there are ten desks in our office', alternatives: [], clue: 'Start with there.' },
  { id: 'th-wo-09', context: 'Say what your office does not have', answer: "there isn't a kitchen in our office", alternatives: [], clue: 'Start with there.' },
  { id: 'th-wo-10', context: 'Ask about a gym', answer: 'is there a gym near your office', alternatives: [], clue: 'In a question, is comes first.' },
  { id: 'th-wo-11', context: 'Talk about the traffic', answer: 'there is a lot of traffic today', alternatives: ['today there is a lot of traffic'], clue: 'Start with there.' },
  { id: 'th-wo-12', context: 'Ask about a bus journey', answer: 'how many stops are there before the station', alternatives: [], clue: 'Start with how many.' },
];

const scramble = [
  { id: 'th-ss-01', answer: 'supermarket', hint: 'A big shop where you buy food.', clue: 'Eleven letters.' },
  { id: 'th-ss-02', answer: 'bathroom', hint: 'The room with a shower.', clue: 'Eight letters.' },
  { id: 'th-ss-03', answer: 'bedroom', hint: 'The room where you sleep.', clue: 'Seven letters.' },
  { id: 'th-ss-04', answer: 'restaurant', hint: 'You go here to eat a meal.', clue: 'Ten letters.' },
  { id: 'th-ss-05', answer: 'printer', hint: 'An office machine that puts your document on paper.', clue: 'Seven letters.' },
  { id: 'th-ss-06', answer: 'chair', hint: 'You sit on this at your desk.', clue: 'Five letters.' },
  { id: 'th-ss-07', answer: 'lift', hint: 'It takes you up to the fifth floor.', clue: 'Four letters.' },
  { id: 'th-ss-08', answer: 'pharmacy', hint: 'A shop that sells medicine.', clue: 'Eight letters.' },
  { id: 'th-ss-09', answer: 'library', hint: 'You borrow books here.', clue: 'Seven letters.' },
  { id: 'th-ss-10', answer: 'garden', hint: 'The place outside a house with grass and flowers.', clue: 'Six letters.' },
  { id: 'th-ss-11', answer: 'hospital', hint: 'Doctors and nurses work here.', clue: 'Eight letters.' },
  { id: 'th-ss-12', answer: 'park', hint: 'A green place in town where people walk their dogs.', clue: 'Four letters.' },
];

export default {
  id: 'there-is-are',
  section: 'grammar',
  order: 11,
  title: 'There is and There are',
  subtitle: 'Saying what exists',
  icon: '\u{1F3D9}\u{FE0F}',
  lessons: [{ label: 'There Is / There Are', href: '../grammar/beginner/there-is-are.html' }],
  items: { mcq, dropdown, wordorder, scramble },
};
