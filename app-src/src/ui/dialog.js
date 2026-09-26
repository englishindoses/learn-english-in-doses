// Small dialogs, built on the native <dialog> element, so focus trapping,
// Escape to close and returning focus to whatever opened it all come free.

import { el } from '../lib/dom.js';

// Resolves true if the student chose the confirm action. The cancel button is
// the primary one, because cancelling is the safe choice.
export function confirmDialog({ title, message, confirmLabel, cancelLabel }) {
  return new Promise((resolve) => {
    const cancelBtn = el('button', { type: 'button', class: 'btn btn-primary', text: cancelLabel });
    const confirmBtn = el('button', { type: 'button', class: 'btn btn-quiet', text: confirmLabel });

    const dialog = el('dialog', { class: 'dialog', 'aria-labelledby': 'dlg-title' }, [
      el('h2', { class: 'dialog-title', id: 'dlg-title', text: title }),
      message ? el('p', { class: 'dialog-message', text: message }) : null,
      el('div', { class: 'dialog-actions' }, [cancelBtn, confirmBtn]),
    ]);

    let answer = false;
    const close = (value) => {
      answer = value;
      dialog.close();
    };

    cancelBtn.addEventListener('click', () => close(false));
    confirmBtn.addEventListener('click', () => close(true));

    // Covers Escape and any other route to closing.
    dialog.addEventListener('close', () => {
      dialog.remove();
      resolve(answer);
    });

    // Clicking the backdrop behaves like cancelling.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) close(false);
    });

    document.body.append(dialog);
    dialog.showModal();
    cancelBtn.focus();
  });
}

// Two or more choices, each { label, value, primary }. Resolves with the
// chosen value. A real choice is needed, so Escape does not dismiss it.
export function choiceDialog({ title, message, choices }) {
  return new Promise((resolve) => {
    let answer = null;

    const buttons = choices.map((choice) =>
      el('button', {
        type: 'button',
        class: choice.primary ? 'btn btn-primary' : 'btn',
        text: choice.label,
        onClick: () => {
          answer = choice.value;
          dialog.close();
        },
      })
    );

    const dialog = el('dialog', { class: 'dialog', 'aria-labelledby': 'dlg-choice-title' }, [
      el('h2', { class: 'dialog-title', id: 'dlg-choice-title', text: title }),
      message ? el('p', { class: 'dialog-message', text: message }) : null,
      el('div', { class: 'dialog-actions dialog-actions-stacked' }, buttons),
    ]);

    dialog.addEventListener('cancel', (event) => event.preventDefault());
    dialog.addEventListener('close', () => {
      dialog.remove();
      resolve(answer);
    });

    document.body.append(dialog);
    dialog.showModal();
    buttons[0].focus();
  });
}
