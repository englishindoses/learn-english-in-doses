/**
 * ESL Grammar Website - Fix the Sentence Module
 *
 * The student reads a prompt (a sentence with one mistake, a sentence to
 * transform, or a set of words) and types the full correct sentence.
 *
 * Required markup inside the container:
 *   .fs-item            one question
 *     .fs-number        the question number
 *     .fs-words         the prompt line
 *       .fs-wrong       the incorrect sentence (fix-the-sentence)
 *       .fs-word        a single word tile (sentence building)
 *     .fs-input         the answer input, data-answer="answer one|answer two"
 *     .fs-correct-answer  empty element; filled with the answer when wrong
 *
 * Buttons and score display use the container id as a prefix:
 *   <containerId>-submit, <containerId>-restart, <containerId>-score
 */
const FixSentenceModule = (function() {
  let containerId = 'fix-sentence';
  let score = 0;
  let totalItems = 0;
  let onCompleteCallback = null;

  function init(config = {}) {
    containerId = config.containerId || 'fix-sentence';
    onCompleteCallback = config.onComplete || null;
    score = 0;

    var container = document.getElementById(containerId);
    if (!container) return;

    var inputs = container.querySelectorAll('.fs-input');
    totalItems = inputs.length;

    inputs.forEach(function(input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var submitBtn = document.getElementById(containerId + '-submit');
          if (submitBtn) submitBtn.click();
        }
      });
    });

    var submitBtn = document.getElementById(containerId + '-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', checkAnswers);
    }

    var restartBtn = document.getElementById(containerId + '-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', restart);
    }
  }

  function normalize(str) {
    return str.toLowerCase()
      .replace(/[‘’]/g, "'")
      .replace(/\s+/g, ' ')
      .replace(/\s*([?.!,])/g, '$1')
      .trim();
  }

  function checkAnswers() {
    score = 0;
    var container = document.getElementById(containerId);
    var items = container.querySelectorAll('.fs-item');

    items.forEach(function(item) {
      var input = item.querySelector('.fs-input');
      var correctAnswers = input.getAttribute('data-answer').split('|');
      var userAnswer = input.value.trim();
      var correctDisplay = item.querySelector('.fs-correct-answer');

      input.classList.remove('correct', 'incorrect');

      var isCorrect = correctAnswers.some(function(answer) {
        return normalize(userAnswer) === normalize(answer.trim());
      });

      if (isCorrect) {
        input.classList.add('correct');
        score++;
      } else {
        input.classList.add('incorrect');
        if (correctDisplay) {
          correctDisplay.textContent = correctAnswers[0].trim();
          correctDisplay.classList.add('show');
        }
      }

      input.setAttribute('readonly', true);
    });

    var scoreDisplay = document.getElementById(containerId + '-score');
    if (scoreDisplay) {
      scoreDisplay.querySelector('span').textContent = score;
      scoreDisplay.style.display = 'block';
    }

    var submitBtn = document.getElementById(containerId + '-submit');
    var restartBtn = document.getElementById(containerId + '-restart');
    if (submitBtn) submitBtn.style.display = 'none';
    if (restartBtn) restartBtn.style.display = 'block';

    if (onCompleteCallback) onCompleteCallback(score, totalItems);
  }

  function restart() {
    score = 0;
    var container = document.getElementById(containerId);
    var inputs = container.querySelectorAll('.fs-input');
    var corrections = container.querySelectorAll('.fs-correct-answer');

    inputs.forEach(function(input) {
      input.value = '';
      input.classList.remove('correct', 'incorrect');
      input.removeAttribute('readonly');
    });

    corrections.forEach(function(el) {
      el.classList.remove('show');
      el.textContent = '';
    });

    var scoreDisplay = document.getElementById(containerId + '-score');
    if (scoreDisplay) scoreDisplay.style.display = 'none';

    var submitBtn = document.getElementById(containerId + '-submit');
    var restartBtn = document.getElementById(containerId + '-restart');
    if (submitBtn) submitBtn.style.display = 'block';
    if (restartBtn) restartBtn.style.display = 'none';

    var firstInput = container.querySelector('.fs-input');
    if (firstInput) firstInput.focus();
  }

  return { init: init };
})();
