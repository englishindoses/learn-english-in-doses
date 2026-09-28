// Singular and Plural Nouns - beginner. Regular and irregular plurals, with
// be and the simple sentences the lesson itself uses.

const mcq = [
  { id: 'pl-mc-01', sentence: 'We have two new _____ in our team.', options: ['person', 'people', 'persons'], answer: 1, clue: 'This plural is irregular.' },
  { id: 'pl-mc-02', sentence: 'I wash the _____ after dinner.', options: ['dishs', 'dishes', 'dishies'], answer: 1, clue: 'Nouns ending in -sh add -es.' },
  { id: 'pl-mc-03', sentence: 'The _____ on my desk are very heavy.', options: ['boxs', 'boxes', 'boxies'], answer: 1, clue: 'Nouns ending in -x add -es.' },
  { id: 'pl-mc-04', sentence: 'She has two _____.', options: ['childs', 'children', 'childrens'], answer: 1, clue: 'Irregular: no -s at the end.' },
  { id: 'pl-mc-05', sentence: 'London and Paris are big _____.', options: ['citys', 'cityes', 'cities'], answer: 2, clue: 'Consonant + y.' },
  { id: 'pl-mc-06', sentence: 'I have two _____ for the office.', options: ['keys', 'keies', 'kies'], answer: 0, clue: 'Vowel + y: just add -s.' },
  { id: 'pl-mc-07', sentence: 'I take two _____ to work.', options: ['buses', 'buss', 'busies'], answer: 0, clue: 'Bus ends in -s.' },
  { id: 'pl-mc-08', sentence: 'We need three _____ for the table.', options: ['knifes', 'knives', 'knivs'], answer: 1, clue: 'Knife is one of the -f words that change.' },
  { id: 'pl-mc-09', sentence: 'Three _____ and two women work in my office.', options: ['mans', 'mens', 'men'], answer: 2, clue: 'Man has an irregular plural.' },
  { id: 'pl-mc-10', sentence: 'I brush my _____ after breakfast.', options: ['tooths', 'teeth', 'teeths'], answer: 1, clue: 'Tooth has an irregular plural.' },
  { id: 'pl-mc-11', sentence: 'Many big _____ have offices in the city centre.', options: ['companys', 'companies', 'companyes'], answer: 1, clue: 'Consonant + y.' },
  { id: 'pl-mc-12', sentence: 'I work five _____ a week.', options: ['days', 'daies', 'dayes'], answer: 0, clue: 'Vowel + y.' },
];

const dropdown = [
  { id: 'pl-dd-01', sentence: 'I have two {1} and a sister.', gaps: { 1: { options: ['brother', 'brothers', 'brotheres'], answer: 'brothers' } }, clue: 'More than one: most nouns just add -s.' },
  { id: 'pl-dd-02', sentence: 'The {1} are at school today.', gaps: { 1: { options: ['childrens', 'children', 'childs'], answer: 'children' } }, clue: 'Do not add -s to this plural.' },
  { id: 'pl-dd-03', sentence: 'I drink three {1} of coffee a day.', gaps: { 1: { options: ['cup', 'cups', 'cupes'], answer: 'cups' } }, clue: 'Most nouns just add -s.' },
  { id: 'pl-dd-04', sentence: 'We have {1} for lunch at work.', gaps: { 1: { options: ['sandwichs', 'sandwiches', 'sandwichies'], answer: 'sandwiches' } }, clue: 'Nouns ending in -ch add -es.' },
  { id: 'pl-dd-05', sentence: 'Two {1} work at the front desk.', gaps: { 1: { options: ['womans', 'women', 'womens'], answer: 'women' } }, clue: 'Woman has an irregular plural.' },
  { id: 'pl-dd-06', sentence: 'My parents live in two different {1}.', gaps: { 1: { options: ['countrys', 'countries', 'countryes'], answer: 'countries' } }, clue: 'Consonant + y.' },
  { id: 'pl-dd-07', sentence: 'I have three {1} in my kitchen.', gaps: { 1: { options: ['shelfs', 'shelves', 'shelvs'], answer: 'shelves' } }, clue: 'Shelf is one of the -f words that change.' },
  { id: 'pl-dd-08', sentence: 'My {1} hurt. These shoes are new.', gaps: { 1: { options: ['foots', 'feets', 'feet'], answer: 'feet' } }, clue: 'Foot has an irregular plural.' },
  { id: 'pl-dd-09', sentence: 'I answer a lot of {1} at work.', gaps: { 1: { options: ['email', 'emails', 'emailes'], answer: 'emails' } }, clue: 'Most nouns just add -s.' },
  { id: 'pl-dd-10', sentence: 'All the {1} on my street are old.', gaps: { 1: { options: ['house', 'houses', 'housies'], answer: 'houses' } }, clue: 'The noun already ends in -e. Just add -s.' },
  { id: 'pl-dd-11', sentence: 'My son has three {1} in a tank.', gaps: { 1: { options: ['fishs', 'fish', 'fishies'], answer: 'fish' } }, clue: 'This noun is the same in the singular and plural.' },
  { id: 'pl-dd-12', sentence: "My sister has two {1}. They're twins.", gaps: { 1: { options: ['babys', 'babies', 'babyes'], answer: 'babies' } }, clue: 'Consonant + y.' },
];

const wordorder = [
  { id: 'pl-wo-01', context: 'Say how many children someone has', answer: 'she has three children', alternatives: [], clue: 'The number goes before the noun.' },
  { id: 'pl-wo-02', context: 'Talk about your team', answer: 'there are ten people in my team', alternatives: [], clue: 'Start with there are.' },
  { id: 'pl-wo-03', context: 'Say how many days you work', answer: 'i work five days a week', alternatives: [], clue: 'Start with I.' },
  { id: 'pl-wo-04', context: 'Say where the boxes are', answer: 'the boxes are on my desk', alternatives: [], clue: 'Start with the boxes.' },
  { id: 'pl-wo-05', context: 'Say how you get to work', answer: 'i take two buses to work', alternatives: [], clue: 'The number goes before the noun.' },
  { id: 'pl-wo-06', context: 'Say where the knives are', answer: 'the knives are on the table', alternatives: [], clue: 'Start with the knives.' },
  { id: 'pl-wo-07', context: 'Talk about your team', answer: 'two men and three women work in my team', alternatives: ['three women and two men work in my team'], clue: 'Start with the people.' },
  { id: 'pl-wo-08', context: 'Talk about your family', answer: 'i have two brothers and a sister', alternatives: [], clue: 'Start with I.' },
  { id: 'pl-wo-09', context: 'Say what hurts', answer: 'my feet hurt after work', alternatives: [], clue: 'Start with my.' },
  { id: 'pl-wo-10', context: 'Say where the dishes are', answer: 'the dishes are in the sink', alternatives: [], clue: 'Start with the dishes.' },
  { id: 'pl-wo-11', context: 'Say where the children are', answer: 'the children are at school', alternatives: [], clue: 'Start with the children.' },
  { id: 'pl-wo-12', context: 'Say what you need', answer: 'i need two tickets for the train', alternatives: [], clue: 'The number goes before the noun.' },
];

const wordbank = [
  { id: 'pl-wb-01', sentence: 'There are twenty {1} in my office.', answer: 'people', alternatives: [], clue: 'Person has an irregular plural.' },
  { id: 'pl-wb-02', sentence: 'My {1} go to the same school.', answer: 'children', alternatives: [], clue: 'Child has an irregular plural.' },
  { id: 'pl-wb-03', sentence: 'I take two {1} to get to work.', answer: 'buses', alternatives: [], clue: 'Bus ends in -s.' },
  { id: 'pl-wb-04', sentence: 'Rome and Milan are big {1}.', answer: 'cities', alternatives: [], clue: 'Consonant + y.' },
  { id: 'pl-wb-05', sentence: 'I have two {1} for my flat.', answer: 'keys', alternatives: [], clue: 'Vowel + y.' },
  { id: 'pl-wb-06', sentence: 'Put the forks and {1} on the table, please.', answer: 'knives', alternatives: [], clue: 'The -fe changes.' },
  { id: 'pl-wb-07', sentence: 'Two men and three {1} work in the shop.', answer: 'women', alternatives: [], clue: 'Woman has an irregular plural.' },
  { id: 'pl-wb-08', sentence: 'I brush my {1} twice a day.', answer: 'teeth', alternatives: [], clue: 'Tooth has an irregular plural.' },
  { id: 'pl-wb-09', sentence: 'I stand all day at work, so my {1} hurt.', answer: 'feet', alternatives: [], clue: 'Foot has an irregular plural.' },
  { id: 'pl-wb-10', sentence: 'We need five {1} for the books.', answer: 'boxes', alternatives: [], clue: 'Nouns ending in -x add -es.' },
  { id: 'pl-wb-11', sentence: 'I work three {1} a week.', answer: 'days', alternatives: [], clue: 'Vowel + y.' },
  { id: 'pl-wb-12', sentence: "My sister has two {1}. They're twins.", answer: 'babies', alternatives: [], clue: 'Consonant + y.' },
];

const scramble = [
  { id: 'pl-ss-01', answer: 'children', hint: 'One child, two ...', clue: 'Eight letters.' },
  { id: 'pl-ss-02', answer: 'people', hint: 'One person, ten ...', clue: 'Six letters.' },
  { id: 'pl-ss-03', answer: 'women', hint: 'One woman, three ...', clue: 'Five letters.' },
  { id: 'pl-ss-04', answer: 'knives', hint: 'One knife, two ...', clue: 'Six letters.' },
  { id: 'pl-ss-05', answer: 'cities', hint: 'One city, two ...', clue: 'Six letters.' },
  { id: 'pl-ss-06', answer: 'teeth', hint: 'One tooth, two ...', clue: 'Five letters.' },
  { id: 'pl-ss-07', answer: 'feet', hint: 'One foot, two ...', clue: 'Four letters.' },
  { id: 'pl-ss-08', answer: 'boxes', hint: 'One box, five ...', clue: 'Five letters.' },
  { id: 'pl-ss-09', answer: 'buses', hint: 'One bus, two ...', clue: 'Five letters.' },
  { id: 'pl-ss-10', answer: 'keys', hint: 'One key, two ...', clue: 'Four letters.' },
  { id: 'pl-ss-11', answer: 'babies', hint: 'One baby, three ...', clue: 'Six letters.' },
  { id: 'pl-ss-12', answer: 'countries', hint: 'One country, many ...', clue: 'Nine letters.' },
];

export default {
  id: 'singular-plural-nouns',
  section: 'grammar',
  order: 3,
  title: 'Singular and Plural Nouns',
  subtitle: 'One thing or more than one',
  icon: '\u{1F465}',
  lessons: [{ label: 'Singular and Plural Nouns', href: '../grammar/beginner/singular-plural-nouns.html' }],
  items: { mcq, dropdown, wordorder, wordbank, scramble },
};
