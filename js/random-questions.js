/* ==============================================
   Random Questions Generator - Reusable Module
   ==============================================
   Usage: Define window.rqQuestions on the page before loading this script.
   Format: { categoryKey: [{ text: "...", id: N }, ...], ... }

   Also define window.rqCategoryLabels for button labels:
   { all: "All Topics", daily: "Daily Life", ... }
   ============================================== */

(function () {
  'use strict';

  let currentCategory = 'all';
  let previousQuestions = [];
  let isAnimating = false;

  const questionsData = window.rqQuestions || {};
  const categoryLabels = window.rqCategoryLabels || {};

  // Get all questions across categories
  function getAllQuestions() {
    const all = [];
    for (const cat in questionsData) {
      questionsData[cat].forEach(function (q) {
        all.push(q);
      });
    }
    return all;
  }

  // Get questions for current category
  function getQuestionPool() {
    if (currentCategory === 'all') {
      return getAllQuestions();
    }
    return questionsData[currentCategory] || [];
  }

  // Display a random question
  function showRandomQuestion() {
    if (isAnimating) return;
    isAnimating = true;

    var container = document.getElementById('rq-question-container');
    container.classList.add('rq-fade-out');

    setTimeout(function () {
      var pool = getQuestionPool();

      // Filter out recently shown questions
      if (previousQuestions.length < pool.length - 5) {
        pool = pool.filter(function (q) {
          return previousQuestions.indexOf(q.id) === -1;
        });
      }

      // Reset history if exhausted
      if (pool.length === 0) {
        previousQuestions = [];
        pool = getQuestionPool();
      }

      // Pick random question
      var randomIndex = Math.floor(Math.random() * pool.length);
      var question = pool[randomIndex];

      // Update display
      var textEl = document.getElementById('rq-question-text');
      var idEl = document.getElementById('rq-question-id');
      textEl.textContent = question.text;
      idEl.textContent = question.id;

      // Fade in
      setTimeout(function () {
        container.classList.remove('rq-fade-out');
        isAnimating = false;

        // Track recent questions (keep last 10)
        previousQuestions.unshift(question.id);
        if (previousQuestions.length > 10) {
          previousQuestions.pop();
        }
      }, 50);
    }, 300);
  }

  // Initialise when DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    // Set up new question button
    var newBtn = document.getElementById('rq-new-question-btn');
    if (newBtn) {
      newBtn.addEventListener('click', showRandomQuestion);
    }

    // Set up category buttons
    var categoryButtons = document.querySelectorAll('.rq-category-button');
    categoryButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        currentCategory = this.getAttribute('data-category');

        // Update active state
        categoryButtons.forEach(function (btn) {
          btn.classList.remove('active');
        });
        this.classList.add('active');

        // Reset history and show new question
        previousQuestions = [];
        showRandomQuestion();
      });
    });

    // Show initial question
    showRandomQuestion();
  });
})();
