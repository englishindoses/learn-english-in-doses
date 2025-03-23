/**
 * ESL Grammar Website - Multiple Choice Questions Module
 * 
 * This module handles all functionality related to multiple choice questions:
 * - Selecting options
 * - Checking answers
 * - Providing feedback
 * - Tracking scores
 * - Restarting the activity
 */

/**
 * MCQ Module - Provides functionality for multiple choice questions
 */
const MCQModule = (function() {
  // Private variables
  let score = 0;
  let totalQuestions = 0;
  let correctAnswers = {};
  let answered = {};
  let containerId = 'mcq';
  
  /**
   * Initializes the MCQ module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the container element (default: 'mcq')
   * @param {Object} config.answers - Object mapping question IDs to correct answer indices
   * @param {Function} config.onComplete - Callback function called when all questions are answered
   * @param {boolean} config.allowRetry - Allow retry after incorrect answer (default: true)
   */
  function init(config = {}) {
    // Set up configuration
    containerId = config.containerId || 'mcq';
    correctAnswers = config.answers || {};
    const allowRetry = config.allowRetry !== undefined ? config.allowRetry : true;
    const onComplete = config.onComplete || null;
    
    // Reset score and answered status
    score = 0;
    
    // Calculate total questions
    totalQuestions = Object.keys(correctAnswers).length;
    
    // Initialize answered object
    answered = {};
    Object.keys(correctAnswers).forEach(questionId => {
      answered[questionId] = false;
    });
    
    // Set up option click handlers
    setupOptionClickHandlers(allowRetry);
    
    // Set up submit button
    setupSubmitButton(onComplete);
    
    // Set up restart button
    setupRestartButton();
  }
  
  /**
   * Sets up option click handlers for all questions
   * 
   * @param {boolean} allowRetry - Whether to allow retry after incorrect answer
   */
  function setupOptionClickHandlers(allowRetry) {
    // Get all options
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const options = container.querySelectorAll('.option');
    
    options.forEach(option => {
      option.addEventListener('click', function() {
        const questionId = this.closest('.question').id;
        
        // If already answered and no retry, do nothing
        if (answered[questionId] && !allowRetry) return;
        
        const options = document.querySelectorAll(`#${questionId} .option`);
        
        // Clear previous selections
        options.forEach(opt => {
          opt.classList.remove('selected');
        });
        
        // Select this option
        this.classList.add('selected');
      });
    });
  }
  
  /**
   * Sets up the submit button
   * 
   * @param {Function} onComplete - Callback function called when all questions are answered
   */
  function setupSubmitButton(onComplete) {
    const submitButton = document.getElementById(`${containerId}-submit`);
    if (!submitButton) return;
    
    submitButton.addEventListener('click', function() {
      score = 0;
      
      Object.keys(correctAnswers).forEach(questionId => {
        const selectedOption = document.querySelector(`#${questionId} .option.selected`);
        const feedback = document.querySelector(`#${questionId} .feedback`);
        
        if (selectedOption) {
          const selectedIndex = parseInt(selectedOption.getAttribute('data-index'));
          const explanation = selectedOption.getAttribute('data-explanation');
          
          if (selectedIndex === correctAnswers[questionId]) {
            feedback.textContent = explanation || 'Correct!';
            feedback.className = 'feedback correct';
            score++;
            answered[questionId] = true;
          } else {
            feedback.textContent = explanation || 'Incorrect. Try again.';
            feedback.className = 'feedback incorrect';
          }
        } else {
          feedback.textContent = 'Please select an answer.';
          feedback.className = 'feedback incorrect';
        }
      });
      
      // Show score
      const scoreDisplay = document.getElementById(`${containerId}-score`);
      if (scoreDisplay) {
        scoreDisplay.querySelector('span').textContent = score;
        scoreDisplay.style.display = 'block';
      }
      
      // Show restart button
      const restartButton = document.getElementById(`${containerId}-restart`);
      if (restartButton) {
        submitButton.style.display = 'none';
        restartButton.style.display = 'block';
      }
      
      // Check if all questions are answered correctly
      const allAnswered = Object.values(answered).every(status => status);
      
      // Call onComplete callback if all questions are answered
      if (allAnswered && typeof onComplete === 'function') {
        onComplete(score, totalQuestions);
      }
      
      // Save progress to localStorage if available
      if (typeof saveToLocalStorage === 'function') {
        const activityData = {
          score: score,
          totalQuestions: totalQuestions,
          completed: allAnswered
        };
        
        saveToLocalStorage(`${containerId}-progress`, activityData);
      }
    });
  }
  
  /**
   * Sets up the restart button
   */
  function setupRestartButton() {
    const restartButton = document.getElementById(`${containerId}-restart`);
    const submitButton = document.getElementById(`${containerId}-submit`);
    
    if (!restartButton) return;
    
    restartButton.addEventListener('click', function() {
      // Clear selections
      const container = document.getElementById(containerId);
      container.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
      });
      
      // Clear feedback
      container.querySelectorAll('.feedback').forEach(feedback => {
        feedback.textContent = '';
        feedback.className = 'feedback';
      });
      
      // Reset answered status
      Object.keys(answered).forEach(questionId => {
        answered[questionId] = false;
      });
      
      // Hide score
      const scoreDisplay = document.getElementById(`${containerId}-score`);
      if (scoreDisplay) {
        scoreDisplay.style.display = 'none';
      }
      
      // Show submit button, hide restart button
      if (submitButton) {
        submitButton.style.display = 'block';
      }
      restartButton.style.display = 'none';
      
      // Reset score
      score = 0;
    });
  }
  
  /**
   * Manually select an option for a question
   * Helper function for external selection
   * 
   * @param {string} questionId - ID of the question
   * @param {number} optionIndex - Index of the option to select
   */
  function selectOption(questionId, optionIndex) {
    const question = document.getElementById(questionId);
    if (!question) return;
    
    const options = question.querySelectorAll('.option');
    
    // Clear previous selections
    options.forEach(opt => {
      opt.classList.remove('selected');
    });
    
    // Select the specified option
    const optionToSelect = options[optionIndex];
    if (optionToSelect) {
      optionToSelect.classList.add('selected');
    }
  }
  
  /**
   * Gets the current score
   * 
   * @returns {Object} Object containing score and totalQuestions
   */
  function getScore() {
    return {
      score: score,
      totalQuestions: totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
    };
  }
  
  /**
   * Checks if all questions have been answered correctly
   * 
   * @returns {boolean} True if all questions are answered correctly
   */
  function isCompleted() {
    return Object.values(answered).every(status => status);
  }
  
  // Public API
  return {
    init: init,
    getScore: getScore,
    isCompleted: isCompleted,
    selectOption: selectOption
  };
})();

// Export the module if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = MCQModule;
}