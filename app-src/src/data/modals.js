// Modal Verbs - beginner. can and can't for ability and requests, must and
// mustn't for rules, should and shouldn't for advice. After all three: the
// base verb, no to, no -s.

const mcq = [
  { id: 'mo-mc-01', sentence: "I can't _____ a car.", options: ['drive', 'to drive', 'drives'], answer: 0, clue: 'After can, use the base verb. No to.' },
  { id: 'mo-mc-02', sentence: 'She can _____ three languages.', options: ['speaks', 'speak', 'to speak'], answer: 1, clue: 'After can, no -s.' },
  { id: 'mo-mc-03', sentence: '_____ help me with this box?', options: ['Can you', 'Do you can', 'You can'], answer: 0, clue: 'In a question, the modal comes first.' },
  { id: 'mo-mc-04', sentence: 'All staff _____ an ID card.', options: ['must wear', 'must to wear', 'must wears'], answer: 0, clue: 'After must, use the base verb.' },
  { id: 'mo-mc-05', sentence: 'You _____ smoke in the office.', options: ["mustn't", "don't must", 'not must'], answer: 0, clue: 'Add -n\'t to the modal. No do.' },
  { id: 'mo-mc-06', sentence: 'You look tired. You _____ go to bed early.', options: ['should', 'should to', 'shoulds'], answer: 0, clue: 'No to, no -s.' },
  { id: 'mo-mc-07', sentence: 'You _____ drink coffee at night.', options: ["shouldn't", "don't should", 'not should'], answer: 0, clue: 'Add -n\'t to the modal. No do.' },
  { id: 'mo-mc-08', sentence: 'What _____ do this weekend?', options: ['should we', 'do we should', 'we should'], answer: 0, clue: 'Question word, then the modal, then we.' },
  { id: 'mo-mc-09', sentence: 'Can you swim? - Yes, I _____.', options: ['can', 'do', 'am'], answer: 0, clue: 'Use the same word as the question.' },
  { id: 'mo-mc-10', sentence: 'He _____ play the guitar. He never learned.', options: ["can't", "doesn't can", 'no can'], answer: 0, clue: 'Add -n\'t to the modal. No do.' },
  { id: 'mo-mc-11', sentence: 'We _____ be late for the meeting.', options: ["mustn't", "mustn't to", "don't must"], answer: 0, clue: 'Base verb after the modal. No to.' },
  { id: 'mo-mc-12', sentence: 'My daughter can _____ really well.', options: ['cook', 'cooks', 'to cook'], answer: 0, clue: 'After can, the base verb.' },
];

const dropdown = [
  { id: 'mo-dd-01', sentence: '{1} you speak Spanish?', gaps: { 1: { options: ['Can', 'Does', 'Are'], answer: 'Can' } }, clue: 'Ask about ability.' },
  { id: 'mo-dd-02', sentence: 'I can {1} you later.', gaps: { 1: { options: ['call', 'calling', 'to call'], answer: 'call' } }, clue: 'After can, the base verb.' },
  { id: 'mo-dd-03', sentence: "You {1} park here. It's for staff only.", gaps: { 1: { options: ["mustn't", "don't must", 'not must'], answer: "mustn't" } }, clue: 'A rule: do not do it!' },
  { id: 'mo-dd-04', sentence: "You {1} try the new café. It's great.", gaps: { 1: { options: ['should', 'should to', 'shoulds'], answer: 'should' } }, clue: 'Advice. No to, no -s.' },
  { id: 'mo-dd-05', sentence: "She can't {1} today. She's ill.", gaps: { 1: { options: ['come', 'comes', 'to come'], answer: 'come' } }, clue: "After can't, the base verb." },
  { id: 'mo-dd-06', sentence: '{1} bring anything to the party?', gaps: { 1: { options: ['Should I', 'Do I should', 'I should'], answer: 'Should I' } }, clue: 'In a question, the modal comes first.' },
  { id: 'mo-dd-07', sentence: 'Drivers {1} stop at a red light.', gaps: { 1: { options: ['must', 'musts', 'must to'], answer: 'must' } }, clue: 'A rule. No -s, no to.' },
  { id: 'mo-dd-08', sentence: 'He should {1} more water.', gaps: { 1: { options: ['drink', 'drinks', 'to drink'], answer: 'drink' } }, clue: 'After should, the base verb.' },
  { id: 'mo-dd-09', sentence: 'Can she come on Friday? - No, she {1}.', gaps: { 1: { options: ["can't", "doesn't", "isn't"], answer: "can't" } }, clue: 'Use the same word as the question.' },
  { id: 'mo-dd-10', sentence: 'You {1} work so late. You need to rest.', gaps: { 1: { options: ["shouldn't", "don't should", 'not should'], answer: "shouldn't" } }, clue: 'Advice: it is a bad idea.' },
  { id: 'mo-dd-11', sentence: 'We can {1} the bus or walk.', gaps: { 1: { options: ['take', 'takes', 'taking'], answer: 'take' } }, clue: 'After can, the base verb.' },
  { id: 'mo-dd-12', sentence: 'Students {1} use their phones in the exam.', gaps: { 1: { options: ["mustn't", "don't must", "mustn't to"], answer: "mustn't" } }, clue: 'A rule: do not do it!' },
];

const wordorder = [
  { id: 'mo-wo-01', context: 'Say what you can do', answer: 'i can speak three languages', alternatives: [], clue: 'Start with I.' },
  { id: 'mo-wo-02', context: 'Say what someone cannot do', answer: "my dad can't use a computer", alternatives: [], clue: 'Start with my dad.' },
  { id: 'mo-wo-03', context: 'Ask for help', answer: 'can you help me with this', alternatives: [], clue: 'In a question, the modal comes first.' },
  { id: 'mo-wo-04', context: 'Talk about a rule at work', answer: 'we must finish the report today', alternatives: ['today we must finish the report'], clue: 'Start with we.' },
  { id: 'mo-wo-05', context: 'Talk about a rule', answer: "you mustn't smoke in the building", alternatives: [], clue: 'Start with you.' },
  { id: 'mo-wo-06', context: 'Give advice', answer: 'you should see a doctor', alternatives: [], clue: 'Start with you.' },
  { id: 'mo-wo-07', context: 'Give advice', answer: "you shouldn't work so late", alternatives: [], clue: 'Start with you.' },
  { id: 'mo-wo-08', context: 'Ask for advice', answer: 'what should i do', alternatives: [], clue: 'The question word comes first.' },
  { id: 'mo-wo-09', context: 'Ask for advice', answer: 'where should we go for lunch', alternatives: [], clue: 'The question word comes first.' },
  { id: 'mo-wo-10', context: 'Ask about ability', answer: 'can you play the guitar', alternatives: [], clue: 'In a question, the modal comes first.' },
  { id: 'mo-wo-11', context: 'Ask for advice', answer: 'should i take the train or the bus', alternatives: ['should i take the bus or the train'], clue: 'In a question, the modal comes first.' },
  { id: 'mo-wo-12', context: 'Say what someone can do', answer: 'she can cook very well', alternatives: [], clue: 'Very well goes at the end.' },
];

const wordbank = [
  { id: 'mo-wb-01', sentence: 'Can you {1} a car?', answer: 'drive', alternatives: [], clue: 'You do this on the road.' },
  { id: 'mo-wb-02', sentence: 'She can {1} English and French.', answer: 'speak', alternatives: [], clue: 'You do this with a language.' },
  { id: 'mo-wb-03', sentence: "I can't {1}, so I never go in the sea.", answer: 'swim', alternatives: [], clue: 'You do this in water.' },
  { id: 'mo-wb-04', sentence: 'You must {1} a helmet on a motorbike.', answer: 'wear', alternatives: [], clue: 'You do this with clothes.' },
  { id: 'mo-wb-05', sentence: 'You should {1} a doctor about that cough.', answer: 'see', alternatives: [], clue: 'Visit.' },
  { id: 'mo-wb-06', sentence: 'Can you {1} me with this box? It\'s heavy.', answer: 'help', alternatives: [], clue: 'Give someone a hand.' },
  { id: 'mo-wb-07', sentence: 'My husband can {1} really well. His pasta is amazing.', answer: 'cook', alternatives: [], clue: 'You do this in the kitchen.' },
  { id: 'mo-wb-08', sentence: "You mustn't {1} here. It's for staff cars only.", answer: 'park', alternatives: [], clue: 'Leave your car.' },
  { id: 'mo-wb-09', sentence: 'You should {1} more water.', answer: 'drink', alternatives: [], clue: 'You do this when you are thirsty.' },
  { id: 'mo-wb-10', sentence: "I can {1} you tonight. What's your number?", answer: 'call', alternatives: [], clue: 'Phone.' },
  { id: 'mo-wb-11', sentence: 'Can you {1} the guitar?', answer: 'play', alternatives: [], clue: 'You do this with music.' },
  { id: 'mo-wb-12', sentence: "You mustn't {1} in the building.", answer: 'smoke', alternatives: [], clue: 'You do this with a cigarette.' },
];

const scramble = [
  { id: 'mo-ss-01', answer: 'must', hint: 'A word for rules.', clue: 'Four letters.' },
  { id: 'mo-ss-02', answer: 'should', hint: 'A word for advice.', clue: 'Six letters.' },
  { id: 'mo-ss-03', answer: 'seatbelt', hint: 'You must wear this in the car.', clue: 'Eight letters.' },
  { id: 'mo-ss-04', answer: 'helmet', hint: 'You must wear this on a motorbike.', clue: 'Six letters.' },
  { id: 'mo-ss-05', answer: 'guitar', hint: 'A musical instrument with six strings.', clue: 'Six letters.' },
  { id: 'mo-ss-06', answer: 'language', hint: 'English, Spanish or French.', clue: 'Eight letters.' },
  { id: 'mo-ss-07', answer: 'swim', hint: 'You can do this in the sea.', clue: 'Four letters.' },
  { id: 'mo-ss-08', answer: 'drive', hint: 'You need a licence to do this.', clue: 'Five letters.' },
  { id: 'mo-ss-09', answer: 'cook', hint: 'You do this in the kitchen.', clue: 'Four letters.' },
  { id: 'mo-ss-10', answer: 'report', hint: 'A document you write at work.', clue: 'Six letters.' },
  { id: 'mo-ss-11', answer: 'exam', hint: 'A test at school or university.', clue: 'Four letters.' },
  { id: 'mo-ss-12', answer: 'party', hint: 'Friends, music and food on a Saturday night.', clue: 'Five letters.' },
];

export default {
  id: 'modals',
  section: 'grammar',
  order: 12,
  title: 'Modal Verbs',
  subtitle: 'can, must and should',
  icon: '\u{1F4AA}',
  lessons: [{ label: 'Modal Verbs: can, must, should', href: '../grammar/beginner/modals.html' }],
  items: { mcq, dropdown, wordorder, wordbank, scramble },
};
