const SentenceOrderModule = (function() {
  let containerId = 'sentence-order';
  let score = 0;
  let totalItems = 0;

  function init(config = {}) {
    containerId = config.containerId || 'sentence-order';
    score = 0;

    var container = document.getElementById(containerId);
    if (!container) return;

    var inputs = container.querySelectorAll('.so-input');
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
      .replace(/\s+/g, ' ')
      .replace(/\s*([?.!,])/g, '$1')
      .trim();
  }

  function checkAnswers() {
    score = 0;
    var container = document.getElementById(containerId);
    var items = container.querySelectorAll('.so-item');

    items.forEach(function(item) {
      var input = item.querySelector('.so-input');
      var correctAnswers = input.getAttribute('data-answer').split('|');
      var userAnswer = input.value.trim();
      var correctDisplay = item.querySelector('.so-correct-answer');

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
  }

  function restart() {
    score = 0;
    var container = document.getElementById(containerId);
    var inputs = container.querySelectorAll('.so-input');
    var corrections = container.querySelectorAll('.so-correct-answer');

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

    var firstInput = container.querySelector('.so-input');
    if (firstInput) firstInput.focus();
  }

  return { init: init };
})();
