/**
 * Translate toggle
 *
 * A button with data-translate-toggle switches its section between English
 * and Portuguese. Every element in that section with a data-pt attribute has
 * its content swapped for the Portuguese written in data-pt, and back again.
 *
 * Markup:
 *   <button class="check-btn" data-translate-toggle aria-pressed="false">Ver em português</button>
 *   <p data-pt="Leia esta conversa.">Read this conversation.</p>
 */
(function() {
  'use strict';

  var SHOW_PORTUGUESE = 'Ver em português';
  var SHOW_ENGLISH = 'Back to English';

  function toggleSection(button) {
    var section = button.closest('section');
    if (!section) return;

    var toPortuguese = button.getAttribute('aria-pressed') !== 'true';

    section.querySelectorAll('[data-pt]').forEach(function(el) {
      // Keep the English the first time, so it can be put back
      if (el.dataset.en === undefined) {
        el.dataset.en = el.innerHTML;
      }
      el.innerHTML = toPortuguese ? el.dataset.pt : el.dataset.en;
      if (toPortuguese) {
        el.setAttribute('lang', 'pt-BR');
      } else {
        el.removeAttribute('lang');
      }
    });

    button.setAttribute('aria-pressed', toPortuguese ? 'true' : 'false');
    button.textContent = toPortuguese ? SHOW_ENGLISH : SHOW_PORTUGUESE;
  }

  document.addEventListener('click', function(e) {
    var button = e.target.closest('[data-translate-toggle]');
    if (button) toggleSection(button);
  });
})();
