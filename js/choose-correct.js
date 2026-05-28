const ChooseCorrectModule = (function() {
  let containerId = 'choose-correct';
  let score = 0;
  let totalQuestions = 0;

  function init(config = {}) {
    containerId = config.containerId || 'choose-correct';
    score = 0;

    var container = document.getElementById(containerId);
    if (!container) return;

    var sentences = container.querySelectorAll('.cc-sentence');
    totalQuestions = sentences.length;

    sentences.forEach(function(sentence) {
      var choices = sentence.querySelectorAll('.cc-choice');
      choices.forEach(function(choice) {
        choice.addEventListener('click', function() {
          if (choice.classList.contains('disabled')) return;
          var group = choice.closest('.cc-choice-group');
          group.querySelectorAll('.cc-choice').forEach(function(c) {
            c.classList.remove('selected');
          });
          choice.classList.add('selected');
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
    var groups = container.querySelectorAll('.cc-choice-group');

    groups.forEach(function(group) {
      var correctAnswer = group.getAttribute('data-answer');
      var choices = group.querySelectorAll('.cc-choice');
      var selected = group.querySelector('.cc-choice.selected');

      choices.forEach(function(c) {
        c.classList.add('disabled');
        c.classList.remove('correct', 'incorrect');
      });

      if (selected) {
        var userAnswer = selected.getAttribute('data-value');
        if (userAnswer === correctAnswer) {
          selected.classList.add('correct');
          score++;
        } else {
          selected.classList.add('incorrect');
          choices.forEach(function(c) {
            if (c.getAttribute('data-value') === correctAnswer) {
              c.classList.add('correct');
            }
          });
        }
      } else {
        choices.forEach(function(c) {
          if (c.getAttribute('data-value') === correctAnswer) {
            c.classList.add('correct');
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
    var choices = container.querySelectorAll('.cc-choice');
    choices.forEach(function(c) {
      c.classList.remove('selected', 'correct', 'incorrect', 'disabled');
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
