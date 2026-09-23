// A fifth activity type is a new file here plus one line in this list.

import mcq from './mcq.js';
import dropdown from './dropdown.js';
import wordorder from './wordorder.js';
import wordbank from './wordbank.js';
import scramble from './scramble.js';

export const engines = [mcq, dropdown, wordorder, wordbank, scramble];

export function engineFor(type) {
  return engines.find((engine) => engine.id === type) || null;
}
