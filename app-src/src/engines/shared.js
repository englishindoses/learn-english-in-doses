// Bits every engine needs.
//
// Engines build the question itself and mark it right or wrong. The card
// around it, its number, the Ask my teacher button and the feedback line all
// belong to the session screen, so every activity type looks the same.

// Answers are compared loosely enough to forgive spacing and capitals, and
// strictly enough that a wrong word is still wrong.
export function normalise(text) {
  return String(text)
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function sameAnswer(given, expected) {
  return normalise(given) === normalise(expected);
}

// Marks an input or select right or wrong, clearing whichever it was before.
export function paint(node, right) {
  node.classList.toggle('is-right', right);
  node.classList.toggle('is-wrong', !right);
}

export function unpaint(node) {
  node.classList.remove('is-right', 'is-wrong', 'is-blank');
}
