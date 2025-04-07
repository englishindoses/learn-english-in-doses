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
 * MCQModule - Provides functionality for multiple choice questions
 */
const MCQModule = (function() {
  // Private variables
  let score = 0;
  let totalQuestions = 0;
  let correctAnswers = {};
  let correctExplanations = {}; 
  let incorrectExplanations = {}; 
  let explanations = {};
  let incorrectTips = {};
  let answered = {};
  let userSelections = {}; 
  let containerId = 'mcq';
  let onCompleteCallback = null;
  
  /**
   * Initializes the MCQ module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the container element (default: 'mcq')
   * @param {Object} config.answers - Object mapping question IDs to correct answer indices
   * @param {Object} config.explanations - Object mapping question IDs to explanations
   * @param {Object} config.incorrectTips - Object mapping question IDs to tips for incorrect answers
   * @param {Function} config.onComplete - Callback function called when all questions are answered
   * @param {boolean} config.allowRetry - Allow retry after incorrect answer (default: true)
   * @param {boolean} config.clearSelections - Whether to clear all selections on load (default: false)
   */
  function init(config = {}) {
    console.log('Initializing MCQ Module with config:', config);
    
    // Set up configuration
    containerId = config.containerId || 'mcq';
    correctAnswers = config.answers || {};
    explanations = config.explanations || {};
    correctExplanations = config.correctExplanations || {};
    incorrectExplanations = config.incorrectExplanations || {};
    incorrectTips = config.incorrectTips || {};
    const allowRetry = config.allowRetry !== undefined ? config.allowRetry : true;
    onCompleteCallback = config.onComplete || null;
    
    // Reset score and answered status
    score = 0;
    
    // Calculate total questions
    totalQuestions = Object.keys(correctAnswers).length;
    console.log(`MCQ Module initialized with ${totalQuestions} questions`);
    
    // Initialize answered object
    answered = {};
    Object.keys(correctAnswers).forEach(questionId => {
      answered[questionId] = false;
    });
    
    // Clear all selections if requested
    if (config.clearSelections) {
      clearAllSelections();
    }
    
    // Set up option click handlers
    setupOptionClickHandlers(allowRetry);
    
    // Set up submit button
    setupSubmitButton();
    
    // Set up restart button
    setupRestartButton();
    
    // Load progress
    loadProgress();
  }
  
  /**
   * Clears all selected options
   */
  function clearAllSelections() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.querySelectorAll('.option').forEach(option => {
      option.classList.remove('selected');
    });
    
    console.log('Cleared all selections');
  }
  
  /**
   * Sets up option click handlers for all questions
   * 
   * @param {boolean} allowRetry - Whether to allow retry after incorrect answer
   */
  function setupOptionClickHandlers(allowRetry) {
    // Get all options
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`MCQ container with ID "${containerId}" not found`);
      return;
    }
    
    const options = container.querySelectorAll('.option');
    console.log(`Found ${options.length} options in MCQ container`);
    
    options.forEach(option => {
      option.addEventListener('click', function() {
        const questionElement = this.closest('.question');
        if (!questionElement) {
          console.warn('Question element not found for clicked option');
          return;
        }
        
        const questionId = questionElement.id;
        if (!questionId) {
          console.warn('Question ID not found for clicked option');
          return;
        }
        
        // If already answered and no retry, do nothing
        if (answered[questionId] && !allowRetry) return;
        
        const options = document.querySelectorAll(`#${questionId} .option`);
        
        // Clear previous selections
        options.forEach(opt => {
          opt.classList.remove('selected');
        });
        
        // Select this option
        this.classList.add('selected');

        // Store the user's selection
        userSelections[questionId] = parseInt(this.getAttribute('data-index'));
        
        console.log(`Option selected for question ${questionId}: ${this.textContent.trim()}`);
      });
    });
  }
  
  /**
   * Sets up the submit button
   */
  function setupSubmitButton() {
    const submitButton = document.getElementById(`${containerId}-submit`);
    if (!submitButton) {
      console.warn(`Submit button with ID "${containerId}-submit" not found`);
      return;
    }
    
    submitButton.addEventListener('click', function() {
      console.log('MCQ submit button clicked');
      score = 0;
      let allCorrect = true;
      
      Object.keys(correctAnswers).forEach(questionId => {
        const selectedOption = document.querySelector(`#${questionId} .option.selected`);
        const feedback = document.querySelector(`#${questionId} .feedback`);
        
        if (selectedOption) {
          const selectedIndex = parseInt(selectedOption.getAttribute('data-index'));
          console.log(`Question ${questionId}: selected index ${selectedIndex}, correct answer is ${correctAnswers[questionId]}`);
          
          // Get data-explanation attribute from the option if it exists, otherwise use our stored explanations
          const optionExplanation = selectedOption.getAttribute('data-explanation');
          
          if (selectedIndex === correctAnswers[questionId]) {
            // Correct answer feedback
            // Look for explanation in various places, providing a reasonable default
            let explanation = 'Correct choice!';
            if (correctExplanations[questionId]) {
              explanation = correctExplanations[questionId];
            } else if (explanations[questionId]) {
              explanation = explanations[questionId];
            } else if (optionExplanation) {
              explanation = optionExplanation;
            }
            
            feedback.innerHTML = '<span class="feedback-result correct-result">Correct!</span> ' + explanation;
            feedback.className = 'feedback correct';
            score++;
            answered[questionId] = true;
          } else {
            // Incorrect answer feedback
            // Look for explanation in various places, providing a reasonable default
            let tip = 'Try to understand when we use this tense.';
            if (incorrectTips[questionId]) {
              tip = incorrectTips[questionId];
            } else if (incorrectExplanations[questionId]) {
              tip = incorrectExplanations[questionId];
            } else if (explanations[questionId]) {
              tip = explanations[questionId];
            }
            
            feedback.innerHTML = '<span class="feedback-result incorrect-result">Sorry, try again!</span> ' + tip;
            feedback.className = 'feedback incorrect';
            allCorrect = false;
          }
        } else if (feedback) {
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
      
      // Check if all questions are answered correctly
      const allAnswered = Object.values(answered).every(status => status);
      
      console.log(`MCQ submission results: Score: ${score}/${totalQuestions}, All correct: ${allCorrect}, All answered: ${allAnswered}`);
      
      // Save progress
      saveProgress();
      
      // If all questions are answered correctly, notify about completion
      if (allAnswered) {
        notifyCompletion();
        
        // Call onComplete callback if provided
        if (typeof onCompleteCallback === 'function') {
          try {
            onCompleteCallback(score, totalQuestions);
          } catch (error) {
            console.error('Error in onComplete callback:', error);
          }
        }
      }
    });
  }
  
  /**
   * Notifies that the activity has been completed
   * Improved to ensure reliable tracking with multiple fallbacks
   */
  function notifyCompletion() {
    console.log(`MCQ Activity completed: ${containerId}`);
    
    // Create and store completion data directly
    const completionData = {
      activityId: containerId,
      score: score,
      maxScore: totalQuestions,
      completed: true,
      completedAt: new Date().toISOString(),
      title: document.title || `MCQ Activity: ${containerId}`
    };
    
    // Save directly to localStorage as a fallback
    if (typeof saveToLocalStorage === 'function') {
      saveToLocalStorage(`${containerId}-progress`, completionData);
    } else {
      try {
        localStorage.setItem(`${containerId}-progress`, JSON.stringify(completionData));
      } catch (e) {
        console.error('Error saving to localStorage directly:', e);
      }
    }
    
    // Try all notification methods
    // Method 1: Use ProgressTrackingModule directly
    if (typeof ProgressTrackingModule !== 'undefined' && 
        typeof ProgressTrackingModule.markItemCompleted === 'function') {
      try {
        ProgressTrackingModule.markItemCompleted('activities', containerId, completionData);
        console.log('Notified ProgressTrackingModule directly');
      } catch (e) {
        console.error('Error notifying ProgressTrackingModule:', e);
      }
    }
    
    // Method 2: Use ActivityNavModule
    if (typeof ActivityNavModule !== 'undefined' && 
        typeof ActivityNavModule.notifyActivityCompleted === 'function') {
      try {
        ActivityNavModule.notifyActivityCompleted(containerId, completionData);
        console.log('Notified ActivityNavModule');
      } catch (e) {
        console.error('Error notifying ActivityNavModule:', e);
      }
    }
    
    // Method 3: Dispatch event
    try {
      const event = new CustomEvent('activityCompleted', {
        detail: {
          activityId: containerId,
          score: score,
          maxScore: totalQuestions,
          completed: true,
          completedAt: new Date().toISOString(),
          title: document.title || `MCQ Activity: ${containerId}`
        }
      });
      document.dispatchEvent(event);
      console.log('Dispatched activityCompleted event');
    } catch (e) {
      console.error('Error dispatching event:', e);
    }
    
    // Method 4: Try to display visual feedback to the user
    try {
      if (typeof showFeedbackMessage === 'function') {
        showFeedbackMessage(`Activity completed! Score: ${score}/${totalQuestions}`, 'success', 3000);
      }
    } catch (e) {
      console.error('Error showing feedback message:', e);
    }
  }
  
  /**
   * Sets up the restart button
   */
  function setupRestartButton() {
    const restartButton = document.getElementById(`${containerId}-restart`);
    const submitButton = document.getElementById(`${containerId}-submit`);
    
    if (!restartButton) {
      console.warn(`Restart button with ID "${containerId}-restart" not found`);
      return;
    }
    
    restartButton.addEventListener('click', function() {
      console.log('MCQ restart button clicked');
      
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
      
      // Clear progress
      clearProgress();
    });
  }
  
  /**
   * Saves progress to localStorage
   */
  function saveProgress() {
    try {
      console.log(`Saving MCQ progress for ${containerId}`);
      
      // Create progress data object
      const progressData = {
        score: score,
        totalQuestions: totalQuestions,
        answered: answered,
        userSelections: userSelections,  
        completed: Object.values(answered).every(status => status),
        timestamp: new Date().toISOString(),
        title: document.title || `MCQ Activity: ${containerId}`
      };
      
      // Method 1: Use saveToLocalStorage function if available
      if (typeof saveToLocalStorage === 'function') {
        saveToLocalStorage(`${containerId}-progress`, progressData);
        console.log('Progress saved using saveToLocalStorage function');
      }
      // Method 2: Use localStorage directly
      else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`${containerId}-progress`, JSON.stringify(progressData));
        console.log('Progress saved directly to localStorage');
      } else {
        console.warn('Unable to save progress: localStorage not available');
      }
      
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }
  
  /**
   * Loads progress from localStorage
   */
  function loadProgress() {
    try {
      console.log(`Loading MCQ progress for ${containerId}`);
      
      let savedProgress = null;
      
      // Method 1: Use getFromLocalStorage function if available
      if (typeof getFromLocalStorage === 'function') {
        savedProgress = getFromLocalStorage(`${containerId}-progress`);
        console.log('Progress loaded using getFromLocalStorage function');
      }
      // Method 2: Use localStorage directly
      else if (typeof localStorage !== 'undefined') {
        const savedData = localStorage.getItem(`${containerId}-progress`);
        
        if (savedData) {
          savedProgress = JSON.parse(savedData);
          console.log('Progress loaded directly from localStorage');
        }
      }
      
      if (savedProgress) {
        console.log('Saved progress found:', savedProgress);
        
        // Restore answered state
        if (savedProgress.answered) {
          answered = savedProgress.answered;
          
        // Restore user selections
        if (savedProgress.userSelections) {
         userSelections = savedProgress.userSelections;
  
         // Restore the user's actual selections
        Object.entries(userSelections).forEach(([questionId, selectedIndex]) => {
        if (selectedIndex !== undefined) {
        selectOption(questionId, selectedIndex);
       }
  });
} else {
  // Fallback for older saved data without userSelections
  Object.entries(answered).forEach(([questionId, isAnswered]) => {
    if (isAnswered && correctAnswers[questionId] !== undefined) {
      selectOption(questionId, correctAnswers[questionId]);
    }
  });
}
          
          // Update score
          score = savedProgress.score || 0;
          
          // If activity was completed, trigger submit
          if (savedProgress.completed) {
            const submitButton = document.getElementById(`${containerId}-submit`);
            if (submitButton) {
              console.log('Activity was previously completed, triggering submit button');
              submitButton.click();
            }
          }
        }
      } else {
        console.log('No saved progress found');
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }
  
  /**
   * Clears saved progress
   */
  function clearProgress() {
    try {
      console.log(`Clearing MCQ progress for ${containerId}`);
    
      // Reset userSelections object
      userSelections = {};
      
      // Method 1: Use removeFromLocalStorage function if available
      if (typeof removeFromLocalStorage === 'function') {
        removeFromLocalStorage(`${containerId}-progress`);
        console.log('Progress cleared using removeFromLocalStorage function');
      }
      // Method 2: Use localStorage directly
      else if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(`${containerId}-progress`);
        console.log('Progress cleared directly from localStorage');
      } else {
        console.warn('Unable to clear progress: localStorage not available');
      }
    } catch (error) {
      console.error('Error clearing progress:', error);
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
    if (!question) {
      console.warn(`Question with ID "${questionId}" not found`);
      return;
    }
    
    const options = question.querySelectorAll('.option');
    if (options.length === 0) {
      console.warn(`No options found for question "${questionId}"`);
      return;
    }
    
    // Clear previous selections
    options.forEach(opt => {
      opt.classList.remove('selected');
    });
    
    // Select the specified option
    const optionToSelect = options[optionIndex];
    if (optionToSelect) {
      optionToSelect.classList.add('selected');
      console.log(`Selected option ${optionIndex} for question ${questionId}`);
    } else {
      console.warn(`Option with index ${optionIndex} not found for question "${questionId}"`);
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
    selectOption: selectOption,
    clearSelections: clearAllSelections,
    // For debugging
    _saveProgress: saveProgress,
    _loadProgress: loadProgress,
    _notifyCompletion: notifyCompletion
  };
})();

// Export the module if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = MCQModule;
}