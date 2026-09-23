// Shared dragging for the chip-based activities. The insertion indicator and
// the touch handling follow js/drag-drop.js on the website; the submit,
// restart and progress logic that file also carries lives in the session
// screen here instead.
//
// The 250 ms hold before a touch drag starts is the rule that matters: without
// it, every attempt to scroll past a chip drags the chip instead.

const HOLD_MS = 250;
const TOUCH_WOBBLE = 8;
const MOUSE_THRESHOLD = 5;
const EDGE = 60;
const EDGE_SPEED = 12;

let indicator = null;

function getIndicator() {
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'drag-insertion-indicator';
    indicator.style.display = 'none';
    document.body.append(indicator);
  }
  return indicator;
}

function hideIndicator() {
  getIndicator().style.display = 'none';
}

// Where in `zone` a chip dropped at (x, y) should land: the child it goes
// before, or null for the end.
export function insertionPoint(zone, x, y) {
  const chips = [...zone.querySelectorAll('.drag-item')].filter((c) => !c.classList.contains('dragging'));

  for (const chip of chips) {
    const box = chip.getBoundingClientRect();
    const sameRow = y >= box.top && y <= box.bottom;
    if (sameRow && x < box.left + box.width / 2) return chip;
    if (y < box.top) return chip;
  }
  return null;
}

function showIndicatorAt(zone, before) {
  const bar = getIndicator();
  const box = before
    ? before.getBoundingClientRect()
    : (() => {
        const chips = zone.querySelectorAll('.drag-item');
        const last = chips[chips.length - 1];
        return last ? last.getBoundingClientRect() : zone.getBoundingClientRect();
      })();

  const left = before || !zone.querySelector('.drag-item') ? box.left : box.right;
  bar.style.display = 'block';
  bar.style.left = `${left + window.scrollX - 1}px`;
  bar.style.top = `${box.top + window.scrollY}px`;
  bar.style.height = `${box.height}px`;
}

function autoScroll(y) {
  if (y < EDGE) window.scrollBy(0, -EDGE_SPEED);
  else if (y > window.innerHeight - EDGE) window.scrollBy(0, EDGE_SPEED);
}

// Makes `chip` draggable into any of the zones `zonesFor()` returns.
// `onDrop(chip, zone, before)` does the actual moving.
export function makeDraggable(chip, { zonesFor, onDrop }) {
  let ghost = null;
  let active = false;
  let holdTimer = null;
  let startX = 0;
  let startY = 0;

  const zoneAt = (x, y) => {
    const under = document.elementFromPoint(x, y);
    if (!under) return null;
    return zonesFor().find((zone) => zone === under || zone.contains(under)) || null;
  };

  const start = (x, y) => {
    active = true;
    startX = x;
    startY = y;
    chip.classList.add('dragging');

    ghost = chip.cloneNode(true);
    ghost.classList.add('drag-ghost');
    ghost.classList.remove('dragging');
    ghost.style.width = `${chip.offsetWidth}px`;
    document.body.append(ghost);
    moveGhost(x, y);
  };

  const moveGhost = (x, y) => {
    if (!ghost) return;
    ghost.style.left = `${x}px`;
    ghost.style.top = `${y}px`;
  };

  const move = (x, y) => {
    moveGhost(x, y);
    autoScroll(y);
    const zone = zoneAt(x, y);
    if (zone) showIndicatorAt(zone, insertionPoint(zone, x, y));
    else hideIndicator();
  };

  const finish = (x, y) => {
    const zone = zoneAt(x, y);
    if (zone) onDrop(chip, zone, insertionPoint(zone, x, y));
    cancel();
  };

  const cancel = () => {
    active = false;
    clearTimeout(holdTimer);
    chip.classList.remove('dragging');
    if (ghost) ghost.remove();
    ghost = null;
    hideIndicator();
  };

  // --- Touch ---

  chip.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    holdTimer = setTimeout(() => start(touch.clientX, touch.clientY), HOLD_MS);
  }, { passive: true });

  chip.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];

    if (!active) {
      // Still inside the hold: a real scroll cancels the pending drag.
      const moved = Math.hypot(touch.clientX - startX, touch.clientY - startY);
      if (moved > TOUCH_WOBBLE) clearTimeout(holdTimer);
      return;
    }

    event.preventDefault();
    move(touch.clientX, touch.clientY);
  }, { passive: false });

  chip.addEventListener('touchend', (event) => {
    clearTimeout(holdTimer);
    if (!active) return;
    event.preventDefault();
    const touch = event.changedTouches[0];
    finish(touch.clientX, touch.clientY);
    swallowNextClick(chip);
  }, { passive: false });

  chip.addEventListener('touchcancel', cancel);

  // The browser's own long-press menu would fire during the hold.
  chip.addEventListener('contextmenu', (event) => event.preventDefault());

  // --- Mouse ---

  chip.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;
    const downX = event.clientX;
    const downY = event.clientY;

    const onMove = (e) => {
      if (!active) {
        if (Math.hypot(e.clientX - downX, e.clientY - downY) < MOUSE_THRESHOLD) return;
        start(e.clientX, e.clientY);
      }
      e.preventDefault();
      move(e.clientX, e.clientY);
    };

    const onUp = (e) => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (!active) return;
      finish(e.clientX, e.clientY);
      swallowNextClick(chip);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

// A click fires after a drop and would immediately undo it through the
// tap-to-place handler, so the next one is eaten.
function swallowNextClick(chip) {
  const eat = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };
  chip.addEventListener('click', eat, { capture: true, once: true });
  setTimeout(() => chip.removeEventListener('click', eat, { capture: true }), 350);
}
