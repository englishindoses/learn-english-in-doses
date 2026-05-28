const ListenChooseModule = (function() {
  let containerId = 'listen-choose';
  let score = 0;
  let totalQuestions = 0;

  function init(config = {}) {
    containerId = config.containerId || 'listen-choose';
    score = 0;

    var container = document.getElementById(containerId);
    if (!container) return;

    var questions = container.querySelectorAll('.lc-question');
    totalQuestions = questions.length;

    questions.forEach(function(question) {
      var options = question.querySelectorAll('.lc-option');
      options.forEach(function(option) {
        option.addEventListener('click', function() {
          if (option.classList.contains('disabled')) return;
          options.forEach(function(o) { o.classList.remove('selected'); });
          option.classList.add('selected');
        });
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
    var questions = container.querySelectorAll('.lc-question');

    questions.forEach(function(question) {
      var correctAnswer = question.getAttribute('data-answer');
      var options = question.querySelectorAll('.lc-option');
      var selected = question.querySelector('.lc-option.selected');

      options.forEach(function(o) {
        o.classList.add('disabled');
        o.classList.remove('correct', 'incorrect');
      });

      if (selected) {
        var userAnswer = selected.getAttribute('data-value');
        if (userAnswer === correctAnswer) {
          selected.classList.add('correct');
          score++;
        } else {
          selected.classList.add('incorrect');
          options.forEach(function(o) {
            if (o.getAttribute('data-value') === correctAnswer) {
              o.classList.add('correct');
            }
          });
        }
      } else {
        options.forEach(function(o) {
          if (o.getAttribute('data-value') === correctAnswer) {
            o.classList.add('correct');
          }
        });
      }
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
    var options = container.querySelectorAll('.lc-option');
    options.forEach(function(o) {
      o.classList.remove('selected', 'correct', 'incorrect', 'disabled');
    });

    var scoreDisplay = document.getElementById(containerId + '-score');
    if (scoreDisplay) scoreDisplay.style.display = 'none';

    var submitBtn = document.getElementById(containerId + '-submit');
    var restartBtn = document.getElementById(containerId + '-restart');
    if (submitBtn) submitBtn.style.display = 'block';
    if (restartBtn) restartBtn.style.display = 'none';
  }

  return { init: init };
})();
