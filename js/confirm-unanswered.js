/**
 * Confirm Unanswered Module
 * Shows the same "You haven't answered all of the questions" box as mcq.js
 * before any activity's Check Answers button runs with gaps left.
 *
 * Works alongside the activity modules without changing them: it catches the
 * click first, and only lets it through when everything is answered or the
 * user clicks Yes.
 *
 * Usage:
 *   ConfirmUnansweredModule.guard('check-button-id', function() {
 *     return numberOfUnansweredQuestions;
 *   });
 * The first argument can also be the button element itself.
 */

const ConfirmUnansweredModule = (function() {
  const guards = [];
  let pendingButton = null;
  let letThrough = false;

  function createModal() {
    if (document.getElementById('confirm-unanswered-modal')) return;

    document.body.insertAdjacentHTML('beforeend',
      '<div id="confirm-unanswered-modal" class="mcq-modal-overlay" role="dialog" aria-modal="true">' +
        '<div class="mcq-modal">' +
          '<div class="mcq-modal-content">' +
            '<p class="mcq-modal-message">You haven\'t answered all of the questions. Do you want to check answers anyway?</p>' +
            '<div class="mcq-modal-buttons">' +
              '<button id="confirm-unanswered-yes" class="mcq-modal-btn mcq-modal-btn-yes">Yes</button>' +
              '<button id="confirm-unanswered-no" class="mcq-modal-btn mcq-modal-btn-no">No</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>');

    const overlay = document.getElementById('confirm-unanswered-modal');

    document.getElementById('confirm-unanswered-yes').addEventListener('click', function() {
      const button = pendingButton;
      hideModal();
      if (button) {
        letThrough = true;
        button.click();
        letThrough = false;
      }
    });

    document.getElementById('confirm-unanswered-no').addEventListener('click', hideModal);

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) hideModal();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('show')) hideModal();
    });
  }

  function showModal(button) {
    createModal();
    pendingButton = button;
    document.getElementById('confirm-unanswered-modal').classList.add('show');
    document.getElementById('confirm-unanswered-no').focus();
  }

  function hideModal() {
    const overlay = document.getElementById('confirm-unanswered-modal');
    if (overlay) overlay.classList.remove('show');
    if (pendingButton) pendingButton.focus();
    pendingButton = null;
  }

  // Listening on the document in the capture phase runs before any listener
  // the activity module has put on the button itself
  document.addEventListener('click', function(e) {
    if (letThrough) return;
    for (let i = 0; i < guards.length; i++) {
      const guard = guards[i];
      const button = typeof guard.button === 'string' ? document.getElementById(guard.button) : guard.button;
      if (button && button.contains(e.target) && guard.countUnanswered() > 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showModal(button);
        return;
      }
    }
  }, true);

  function guard(button, countUnanswered) {
    guards.push({ button: button, countUnanswered: countUnanswered });
  }

  return {
    guard: guard
  };
})();

// Export for module systems
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = ConfirmUnansweredModule;
}
