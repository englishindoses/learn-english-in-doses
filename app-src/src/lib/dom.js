// The only DOM abstraction in the app. Everything else builds nodes with this.

export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;

    if (key === 'class') {
      node.className = value;
    } else if (key === 'html') {
      node.innerHTML = value;
    } else if (key === 'text') {
      node.textContent = value;
    } else if (key === 'dataset') {
      Object.assign(node.dataset, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      node.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      node.setAttribute(key, value === true ? '' : value);
    }
  }

  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(child));
  }

  return node;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

export function announce(message) {
  const region = document.getElementById('live-region');
  if (region) region.textContent = message;
}

// Fisher-Yates. Used everywhere options or chips need shuffling.
export function shuffle(list) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Shuffles, but never hands back the original order when one is avoidable.
export function shuffleDifferently(list) {
  if (list.length < 2) return list.slice();
  const same = (a, b) => a.every((item, i) => item === b[i]);
  let out = shuffle(list);
  let attempts = 0;
  while (same(out, list) && attempts < 20) {
    out = shuffle(list);
    attempts++;
  }
  return out;
}
