const SpeakingQuestionsModule = (function() {
  let containerId = 'speaking-questions';
  let totalQuestions = 0;
  let checkedCount = 0;

  function init(config = {}) {
    containerId = config.containerId || 'speaking-questions';
    checkedCount = 0;

    var container = document.getElementById(containerId);
    if (!container) return;

    var questions = container.querySelectorAll('.sq-question');
    totalQuestions = questions.length;

    questions.forEach(function(question) {
      var checkBtn = question.querySelector('.sq-check');
      if (checkBtn) {
        checkBtn.addEventListener('click', function() {
          var isChecked = checkBtn.classList.toggle('checked');
          question.classList.toggle('answered', isChecked);

          if (isChecked) {
            checkBtn.textContent = '✓';
            checkedCount++;
          } else {
            checkBtn.textContent = '';
            checkedCount--;
          }

          updateProgress();
        });
      }
    });

    updateProgress();
  }

  function updateProgress() {
    var container = document.getElementById(containerId);
    var progressText = container.querySelector('.sq-progress');
    var progressFill = container.querySelector('.sq-progress-fill');

    if (progressText) {
      var span = progressText.querySelector('span');
      if (span) span.textContent = checkedCount;
    }

    if (progressFill) {
      var percent = totalQuestions > 0 ? (checkedCount / totalQuestions) * 100 : 0;
      progressFill.style.width = percent + '%';
    }
  }

  return { init: init };
})();
