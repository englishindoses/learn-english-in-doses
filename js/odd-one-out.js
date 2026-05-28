const OddOneOutModule = (function() {
  let containerId = 'odd-one-out';
  let score = 0;
  let totalGroups = 0;

  function init(config = {}) {
    containerId = config.containerId || 'odd-one-out';
    score = 0;

    const container = document.getElementById(containerId);
    if (!container) return;

    const groups = container.querySelectorAll('.ooo-group');
    totalGroups = groups.length;

    groups.forEach(function(group) {
      const options = group.querySelectorAll('.ooo-option');
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
    var groups = container.querySelectorAll('.ooo-group');

    groups.forEach(function(group) {
      var correctAnswer = group.getAttribute('data-answer');
      var options = group.querySelectorAll('.ooo-option');
      var selected = group.querySelector('.ooo-option.selected');

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
    var options = container.querySelectorAll('.ooo-option');
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
