/**
 * ESL Grammar Website - Situation Match Module
 * 
 * This module handles all functionality related to situation matching exercises:
 * - Selecting the appropriate responses for different situations
 * - Checking student answers against correct options
 * - Providing contextual feedback based on situation type
 * - Tracking score and progress
 * - Handling activity restart
 * - Saving/loading progress from localStorage
 */

/**
 * SituationMatchModule - Provides functionality for situation matching exercises
 */
 const SituationMatchModule = (function() {
  // Private variables
  let score = 0;
  let totalQuestions = 0;
  let containerId = 'situations';
  let onCompleteCallback = null;
  let situationTypes = {};
  let correctAnswers = {};
  let explanations = {};
  
  /**
   * Initializes the Situation Match module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the container element (default: 'situations')
   * @param {Object} config.answers - Object mapping question IDs to correct answer indices
   * @param {Object} config.explanations - Object mapping answer indices to explanations
   * @param {Function} config.onComplete - Callback function called when all questions are answered
   * @param {Object} config.situationTypes - Categorization of situations for better feedback
   * @param {boolean} config.saveProgress - Whether to save progress to localStorage (default: true)
   */
  function init(config = {}) {
    // Set up configuration
    containerId = config.containerId || 'situations';
    correctAnswers = config.answers || {};
    explanations = config.explanations || {};
    onCompleteCallback = config.onComplete || null;
    situationTypes = config.situationTypes || {};
    const saveProgress = config.saveProgress !== undefined ? config.saveProgress : true;
    
    // Reset score
    score = 0;
    
    // Count total questions
    totalQuestions = Object.keys(correctAnswers).length;
    
    // Set up option click handlers
    setupOptionClickHandlers();
    
    // Set up submit button
    setupSubmitButton();
    
    // Set up restart button
    setupRestartButton();
    
    // Load progress if enabled
    if (saveProgress) {
      loadProgress();
    }
  }
  
  /**
   * Sets up event handlers for options
   */
  function setupOptionClickHandlers() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const options = container.querySelectorAll('.option');
    
    options.forEach(option => {
      option.addEventListener('click', function() {
        const questionId = this.closest('.question').id;
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
   */
  function setupSubmitButton() {
    const submitButton = document.getElementById(`${containerId}-submit`);
    if (!submitButton) return;
    
    submitButton.addEventListener('click', function() {
      score = 0;
      let allCorrect = true;
      
      // Process each question
      Object.keys(correctAnswers).forEach(questionId => {
        const selectedOption = document.querySelector(`#${questionId} .option.selected`);
        const feedback = document.querySelector(`#${questionId} .feedback`);
        
        if (selectedOption) {
          const selectedIndex = parseInt(selectedOption.getAttribute('data-index'));
          
          if (selectedIndex === correctAnswers[questionId]) {
            // Correct answer
            feedback.textContent = getExplanation(questionId, selectedIndex, true);
            feedback.className = 'feedback correct';
            score++;
          } else {
            // Incorrect answer
            feedback.textContent = getExplanation(questionId, selectedIndex, false);
            feedback.className = 'feedback incorrect';
            allCorrect = false;
          }
        } else if (feedback) {
          // No option selected
          feedback.textContent = 'Please select an answer.';
          feedback.className = 'feedback incorrect';
          allCorrect = false;
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
      
      // Call onComplete callback if all questions are answered correctly
      if (allCorrect && typeof onCompleteCallback === 'function') {
        onCompleteCallback(score, totalQuestions);
      }
      
      // Save progress to localStorage if available
      saveProgress();
    });
  }
  
  /**
   * Gets explanation for selected answer
   * 
   * @param {string} questionId - ID of the question
   * @param {number} selectedIndex - Index of the selected option
   * @param {boolean} isCorrect - Whether the answer is correct
   * @returns {string} - Explanation text
   */
  function getExplanation(questionId, selectedIndex, isCorrect) {
    // First check if we have specific explanations provided in the config
    if (explanations[questionId] && explanations[questionId][selectedIndex]) {
      return explanations[questionId][selectedIndex];
    }
    
    // Fall back to generic explanations based on situation type
    const situationType = situationTypes[questionId] || 'general';
    
    if (isCorrect) {
      switch (situationType) {
        case 'formal':
          return 'Correct! This is appropriate for a formal situation.';
        case 'informal':
          return 'Correct! This is appropriate for an informal situation.';
        case 'professional':
          return 'Correct! This is appropriate in a professional context.';
        case 'academic':
          return 'Correct! This fits well in an academic setting.';
        case 'social':
          return 'Correct! This works well in this social situation.';
        case 'grammatical':
          return 'Correct! This uses the appropriate grammatical structure.';
        default:
          return 'Correct! This is the appropriate response for this situation.';
      }
    } else {
      // Generate feedback for incorrect answers
      switch (situationType) {
        case 'formal':
          return 'This response is not appropriate for a formal situation. Consider the level of formality required.';
        case 'informal':
          return 'This response is not appropriate for an informal situation. It may be too formal or not natural sounding.';
        case 'professional':
          return 'This response is not appropriate in a professional context. Consider professional norms and language.';
        case 'academic':
          return 'This response is not appropriate for an academic setting. Consider academic conventions.';
        case 'social':
          return 'This response doesn\'t work well in this social situation. Consider social norms and expectations.';
        case 'grammatical':
          return 'This response doesn\'t use the appropriate grammatical structure for this situation.';
        default:
          return 'This is not the appropriate response for this situation. Consider the context carefully.';
      }
    }
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
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Collect selected options
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
      completed: score === totalQuestions
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
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Restore selections
    Object.entries(progressData.selections).forEach(([questionId, selectedIndex]) => {
      const option = document.querySelector(`#${questionId} .option[data-index="${selectedIndex}"]`);
      if (option) {
        option.classList.add('selected');
      }
    });
    
    // If the activity was completed, check answers
    if (progressData.completed) {
      const submitButton = document.getElementById(`${containerId}-submit`);
      if (submitButton) {
        submitButton.click();
      }
    }
  }
  
  /**
   * Provides a hint for a specific question
   * 
   * @param {string} questionId - ID of the question
   */
  function provideHint(questionId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const question = container.querySelector(`#${questionId}`);
    if (!question) return;
    
    const feedback = question.querySelector('.feedback');
    if (!feedback) return;
    
    // Get situation type to generate appropriate hint
    const situationType = situationTypes[questionId] || 'general';
    
    // Generate hint based on situation type
    let hint;
    switch (situationType) {
      case 'formal':
        hint = 'Consider the level of formality needed in this situation. Formal language typically avoids contractions, slang, and uses more complex sentence structures.';
        break;
      case 'informal':
        hint = 'In informal situations, more casual language is appropriate. Look for expressions that are more conversational and natural sounding.';
        break;
      case 'professional':
        hint = 'Professional contexts require clear, respectful language that follows workplace norms. Consider what would be appropriate in a business setting.';
        break;
      case 'academic':
        hint = 'Academic situations require precise, objective language. Look for options that are well-structured and formal without being too casual.';
        break;
      case 'social':
        hint = 'Consider what would be most natural and appropriate in this social context. Think about the relationship between the speakers.';
        break;
      case 'grammatical':
        hint = 'Focus on the grammatical structure being tested. Which option correctly applies the grammar rule for this situation?';
        break;
      default:
        hint = 'Consider the context of the situation and choose the most appropriate response. Think about who is speaking to whom and why.';
    }
    
    feedback.textContent = hint;
    feedback.className = 'feedback hint';
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
    return score === totalQuestions;
  }
  
  /**
   * Sets pre-categorized situation types for better feedback
   * 
   * @param {Object} types - Mapping of question IDs to situation types
   */
  function setSituationTypes(types) {
    situationTypes = {...situationTypes, ...types};
  }
  
  /**
   * Updates explanations for answers
   * 
   * @param {Object} newExplanations - New explanations to add
   */
  function updateExplanations(newExplanations) {
    explanations = {...explanations, ...newExplanations};
  }
  
  /**
   * Adds a feature to show example dialogs for complex situations
   * 
   * @param {string} questionId - ID of the question
   * @param {string} exampleHtml - HTML content with example dialog
   */
  function showExampleDialog(questionId, exampleHtml) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const question = container.querySelector(`#${questionId}`);
    if (!question) return;
    
    // Create or locate example container
    let exampleContainer = question.querySelector('.example-dialog');
    
    if (!exampleContainer) {
      exampleContainer = document.createElement('div');
      exampleContainer.className = 'example-dialog';
      question.appendChild(exampleContainer);
    }
    
    exampleContainer.innerHTML = exampleHtml;
    
    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.className = 'example-close-btn';
    closeButton.setAttribute('aria-label', 'Close example');
    closeButton.addEventListener('click', () => {
      exampleContainer.style.display = 'none';
    });
    
    exampleContainer.prepend(closeButton);
    exampleContainer.style.display = 'block';
  }
  
  // Public API
  return {
    init: init,
    getScore: getScore,
    isCompleted: isCompleted,
    provideHint: provideHint,
    setSituationTypes: setSituationTypes,
    updateExplanations: updateExplanations,
    showExampleDialog: showExampleDialog
  };
})();

// Export the module if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = SituationMatchModule;
}