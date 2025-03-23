/**
 * ESL Grammar Website - Multiple Choice Questions Module
 * 
 * This module handles all functionality related to multiple choice questions:
 * - Selecting options
 * - Checking answers
 * - Providing feedback with explanations
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
  let explanations = {};
  let answered = {};
  let containerId = 'mcq';
  
  /**
   * Initializes the MCQ module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the container element (default: 'mcq')
   * @param {Object} config.answers - Object mapping question IDs to correct answer indices
   * @param {Object} config.explanations - Object mapping question IDs to explanations for each option
   * @param {Function} config.onComplete - Callback function called when all questions are answered
   * @param {boolean} config.allowRetry - Allow retry after incorrect answer (default: true)
   */
  function init(config = {}) {
    // Set up configuration
    containerId = config.containerId || 'mcq';
    correctAnswers = config.answers || {};
    explanations = config.explanations || {};
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
    
    // Load progress if available
    loadProgress();
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
   * Gets the explanation for a specific option
   * 
   * @param {string} questionId - ID of the question
   * @param {number} optionIndex - Index of the option
   * @param {boolean} isCorrect - Whether the option is correct
   * @returns {string} - Explanation text for the option
   */
  function getExplanation(questionId, optionIndex, isCorrect) {
    // Try to get specific explanation from config
    if (explanations && 
        explanations[questionId] && 
        explanations[questionId][optionIndex]) {
      return explanations[questionId][optionIndex];
    }
    
    // If no specific explanation found, use the default one
    if (isCorrect) {
      return "Correct! Well done.";
    } else {
      return "That's not correct. Remember to consider the context and grammar rules.";
    }
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
          
          if (selectedIndex === correctAnswers[questionId]) {
            // Show correct answer explanation
            const explanation = getExplanation(questionId, selectedIndex, true);
            feedback.innerHTML = `<span class="feedback-result correct">Correct!</span> ${explanation}`;
            feedback.className = 'feedback correct';
            score++;
            answered[questionId] = true;
          } else {
            // Show incorrect answer explanation
            const explanation = getExplanation(questionId, selectedIndex, false);
            feedback.innerHTML = `<span class="feedback-result incorrect">Incorrect.</span> ${explanation}`;
            feedback.className = 'feedback incorrect';
          }
        } else {
          feedback.innerHTML = 'Please select an answer.';
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
      saveProgress();
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
      
      // Clear saved progress
      if (typeof removeFromLocalStorage === 'function') {
        removeFromLocalStorage(`${containerId}-progress`);
      }
    });
  }
  
  /**
   * Save progress to localStorage
   */
  function saveProgress() {
    if (typeof saveToLocalStorage !== 'function') return;
    
    // Collect selected options
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const selections = {};
    
    Object.keys(correctAnswers).forEach(questionId => {
      const selectedOption = document.querySelector(`#${questionId} .option.selected`);
      if (selectedOption) {
        selections[questionId] = parseInt(selectedOption.getAttribute('data-index'));
      }
    });
    
    // Save progress data
    const progressData = {
      score: score,
      totalQuestions: totalQuestions,
      selections: selections,
      answered: answered,
      completed: Object.values(answered).every(status => status)
    };
    
    saveToLocalStorage(`${containerId}-progress`, progressData);
  }
  
  /**
   * Load progress from localStorage
   */
  function loadProgress() {
    if (typeof getFromLocalStorage !== 'function') return;
    
    const progressData = getFromLocalStorage(`${containerId}-progress`);
    if (!progressData || !progressData.selections) return;
    
    // Restore selections and answered status
    if (progressData.selections) {
      Object.entries(progressData.selections).forEach(([questionId, selectedIndex]) => {
        selectOption(questionId, selectedIndex);
      });
    }
    
    if (progressData.answered) {
      answered = progressData.answered;
    }
    
    // If the activity was completed, check answers to show feedback
    if (progressData.completed) {
      const submitButton = document.getElementById(`${containerId}-submit`);
      if (submitButton) {
        submitButton.click();
      }
    }
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
  
  /**
   * Adds custom explanations for options
   * 
   * @param {Object} newExplanations - Object mapping question IDs to explanations
   */
  function addExplanations(newExplanations) {
    explanations = {...explanations, ...newExplanations};
  }
  
  // Public API
  return {
    init: init,
    getScore: getScore,
    isCompleted: isCompleted,
    selectOption: selectOption,
    addExplanations: addExplanations
  };
})();

// Export the module if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = MCQModule;
}