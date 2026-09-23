import { el } from '../lib/dom.js';

// A small modal with one or two choices. Resolves with the chosen value, or
// null when it is dismissed.
export function ask({ title, message, choices }) {
  return new Promise((resolve) => {
    let overlay;

    const close = (value) => {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
      resolve(value);
    };

    const onKey = (event) => {
      if (event.key === 'Escape') close(null);
    };

    const buttons = choices.map((choice, index) =>
      el('button', {
        class: index === 0 ? 'submit-btn' : 'restart-btn',
        type: 'button',
        onClick: () => close(choice.value),
      }, choice.label)
    );

    overlay = el('div', { class: 'app-dialog-overlay', role: 'dialog', 'aria-modal': 'true' }, [
      el('div', { class: 'app-dialog' }, [
        el('h2', { class: 'app-dialog-title', text: title }),
        el('p', { class: 'app-dialog-message', text: message }),
        el('div', { class: 'control-buttons' }, buttons),
      ]),
    ]);

    document.body.append(overlay);
    document.addEventListener('keydown', onKey);
    buttons[0].focus();
  });
}
