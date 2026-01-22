/**
 * ESL Grammar Website - Gap Fill Module
 * 
 * This module handles all functionality related to gap fill exercises:
 * - Checking user input against correct answers
 * - Supporting multiple correct answers
 * - Providing feedback on answers
 * - Scoring and progress tracking
 * - Activity restart functionality
 */

/**
 * GapFill Module - Provides functionality for gap fill exercises
 */
const GapFillModule = (function() {
  // Private variables
  let score = 0;
  let totalGaps = 0;
  let containerId = 'gap-fill';
  let onCompleteCallback = null;
  let caseSensitive = false;
  
  /**
   * Initializes the Gap Fill module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the container element (default: 'gap-fill')
   * @param {Function} config.onComplete - Callback function called when all gaps are filled correctly
   * @param {boolean} config.caseSensitive - Whether answers are case-sensitive (default: false)
   */
  function init(config = {}) {
    // Set up configuration
    containerId = config.containerId || 'gap-fill';
    onCompleteCallback = config.onComplete || null;
    caseSensitive = config.caseSensitive || false;
    
    // Reset score
    score = 0;
    
    // Count total gaps
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const inputs = container.querySelectorAll('.gap-input');
    totalGaps = inputs.length;
    
    // Set up enter key handler for inputs
    inputs.forEach(input => {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          // Prevent form submission
          e.preventDefault();
          
          // Find the submit button and trigger click
          const submitButton = document.getElementById(`${containerId}-submit`);
          if (submitButton) {
            submitButton.click();
          }
        }
      });
    });
    
    // Set up submit button
    setupSubmitButton();
    
    // Set up restart button
    setupRestartButton();
    
    // Load progress if available
    loadProgress();
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
      
      const container = document.getElementById(containerId);
      const inputs = container.querySelectorAll('.gap-input');
      
      inputs.forEach(input => {
        const correctAnswers = input.getAttribute('data-answer').split(',');
        const userAnswer = input.value.trim();
        // Feedback div removed from HTML - colours on inputs indicate correct/incorrect
        // const feedback = input.closest('.question').querySelector('.feedback');
        
        // Check if answer is correct (case insensitive by default)
        const isCorrect = correctAnswers.some(answer => {
          if (caseSensitive) {
            return userAnswer === answer.trim();
          } else {
            return userAnswer.toLowerCase() === answer.trim().toLowerCase();
          }
        });
        
        if (isCorrect) {
          input.classList.add('correct');
          input.classList.remove('incorrect');
          // Written feedback removed - colours indicate correct/incorrect
          // if (feedback) {
          //   feedback.textContent = `Correct! "${input.value}" is correct.`;
          //   feedback.className = 'feedback correct';
          // }
          score++;
        } else {
          input.classList.add('incorrect');
          input.classList.remove('correct');
          allCorrect = false;
          
          // Written feedback removed - colours indicate correct/incorrect
          // if (feedback) {
          //   // Provide hint without giving away the answer
          //   let hint;
          //   if (userAnswer === '') {
          //     hint = "Please enter an answer.";
          //   } else if (userAnswer.length < 3) {
          //     hint = "Your answer is too short.";
          //   } else {
          //     // Find the closest correct answer for better feedback
          //     let closestAnswer = correctAnswers[0];
          //     let minDifference = 100;
          //     
          //     correctAnswers.forEach(answer => {
          //       const cleanAnswer = answer.trim();
          //       const difference = levenshteinDistance(userAnswer.toLowerCase(), cleanAnswer.toLowerCase());
          //       
          //       if (difference < minDifference) {
          //         minDifference = difference;
          //         closestAnswer = cleanAnswer;
          //       }
          //     });
          //     
          //     if (minDifference <= 2) {
          //       hint = "You're very close! Check your spelling.";
          //     } else {
          //       hint = "That's not correct. Try again.";
          //     }
          //   }
          //   
          //   feedback.textContent = hint;
          //   feedback.className = 'feedback incorrect';
          // }
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
      
      // Call onComplete callback if all gaps are filled correctly
      if (allCorrect && typeof onCompleteCallback === 'function') {
        onCompleteCallback(score, totalGaps);
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
      // Clear input values
      const container = document.getElementById(containerId);
      container.querySelectorAll('.gap-input').forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'incorrect');
      });
      
      // Clear feedback - commented out as feedback divs removed from HTML
      // container.querySelectorAll('.feedback').forEach(feedback => {
      //   feedback.textContent = '';
      //   feedback.className = 'feedback';
      // });
      
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
    
    // Collect input values
    const inputs = container.querySelectorAll('.gap-input');
    const inputValues = {};
    
    inputs.forEach(input => {
      const id = input.id || input.getAttribute('data-id') || Math.random().toString(36).substring(2, 9);
      inputValues[id] = input.value;
    });
    
    // Save progress data
    const progressData = {
      score: score,
      totalGaps: totalGaps,
      inputs: inputValues,
      completed: score === totalGaps
    };
    
    saveToLocalStorage(`${containerId}-progress`, progressData);
  }
  
  /**
   * Load progress from localStorage
   */
  function loadProgress() {
    if (typeof getFromLocalStorage !== 'function') return;
    
    const progressData = getFromLocalStorage(`${containerId}-progress`);
    if (!progressData) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Restore input values if available
    if (progressData.inputs) {
      const inputs = container.querySelectorAll('.gap-input');
      
      inputs.forEach(input => {
        const id = input.id || input.getAttribute('data-id');
        if (id && progressData.inputs[id]) {
          input.value = progressData.inputs[id];
        }
      });
    }
    
    // If the activity was completed, check answers to restore state
    if (progressData.completed) {
      const submitButton = document.getElementById(`${containerId}-submit`);
      if (submitButton) {
        submitButton.click();
      }
    }
  }
  
  /**
   * Calculate the Levenshtein distance between two strings
   * This helps provide better feedback by determining how "close" a wrong answer is
   * 
   * @param {string} a - First string
   * @param {string} b - Second string
   * @returns {number} - The edit distance between the strings
   */
  function levenshteinDistance(a, b) {
    const matrix = [];
    
    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    
    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    
    return matrix[b.length][a.length];
  }
  
  /**
   * Gets the current score
   * 
   * @returns {Object} Object containing score and totalGaps
   */
  function getScore() {
    return {
      score: score,
      totalGaps: totalGaps,
      percentage: totalGaps > 0 ? Math.round((score / totalGaps) * 100) : 0
    };
  }
  
  /**
   * Checks if all gaps have been filled correctly
   * 
   * @returns {boolean} True if all gaps are filled correctly
   */
  function isCompleted() {
    return score === totalGaps;
  }
  
  // Public API
  return {
    init: init,
    getScore: getScore,
    isCompleted: isCompleted
  };
})();

// Export the module if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = GapFillModule;
}
