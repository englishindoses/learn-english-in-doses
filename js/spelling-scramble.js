const SpellingScrambleModule = (function() {
  let containerId = 'spelling-scramble';
  let score = 0;
  let totalItems = 0;

  function init(config = {}) {
    containerId = config.containerId || 'spelling-scramble';
    score = 0;

    var container = document.getElementById(containerId);
    if (!container) return;

    var inputs = container.querySelectorAll('.ss-input');
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

  function checkAnswers() {
    score = 0;
    var container = document.getElementById(containerId);
    var inputs = container.querySelectorAll('.ss-input');

    inputs.forEach(function(input) {
      var correctAnswers = input.getAttribute('data-answer').split(',');
      var userAnswer = input.value.trim();

      input.classList.remove('correct', 'incorrect');

      var isCorrect = correctAnswers.some(function(answer) {
        return userAnswer.toLowerCase() === answer.trim().toLowerCase();
      });

      if (isCorrect) {
        input.classList.add('correct');
        score++;
      } else {
        input.classList.add('incorrect');
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
  }

  function restart() {
    score = 0;
    var container = document.getElementById(containerId);
    var inputs = container.querySelectorAll('.ss-input');

    inputs.forEach(function(input) {
      input.value = '';
      input.classList.remove('correct', 'incorrect');
      input.removeAttribute('readonly');
    });

    var scoreDisplay = document.getElementById(containerId + '-score');
    if (scoreDisplay) scoreDisplay.style.display = 'none';

    var submitBtn = document.getElementById(containerId + '-submit');
    var restartBtn = document.getElementById(containerId + '-restart');
    if (submitBtn) submitBtn.style.display = 'block';
    if (restartBtn) restartBtn.style.display = 'none';

    var firstInput = container.querySelector('.ss-input');
    if (firstInput) firstInput.focus();
  }

  return { init: init };
})();
