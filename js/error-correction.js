/**
 * ESL Grammar Website - Error Correction Module
 * 
 * This module handles all functionality related to error correction exercises:
 * - Validating student corrections against multiple possible answers
 * - Providing intelligent feedback based on common error types
 * - Supporting different levels of strictness for corrections
 * - Tracking score and progress
 * - Handling activity restart
 * - Saving/loading progress from localStorage
 */

/**
 * ErrorCorrectionModule - Provides functionality for error correction exercises
 */
const ErrorCorrectionModule = (function() {
  // Private variables
  let score = 0;
  let totalQuestions = 0;
  let containerId = 'error-correction';
  let onCompleteCallback = null;
  let caseSensitive = false;
  let strictPunctuation = false;
  let alternativeAnswers = {};
  let errorTypes = {};
  
  /**
   * Initializes the Error Correction module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the container element (default: 'error-correction')
   * @param {Function} config.onComplete - Callback function called when all questions are answered correctly
   * @param {boolean} config.caseSensitive - Whether answers are case-sensitive (default: false)
   * @param {boolean} config.strictPunctuation - Whether punctuation is strictly checked (default: false)
   * @param {Object} config.alternativeAnswers - Additional acceptable answers beyond data-answer
   * @param {Object} config.errorTypes - Categorization of errors for better feedback
   * @param {boolean} config.saveProgress - Whether to save progress to localStorage (default: true)
   */
  function init(config = {}) {
    // Set up configuration
    containerId = config.containerId || 'error-correction';
    onCompleteCallback = config.onComplete || null;
    caseSensitive = config.caseSensitive || false;
    strictPunctuation = config.strictPunctuation || false;
    alternativeAnswers = config.alternativeAnswers || {};
    errorTypes = config.errorTypes || {};
    const saveProgress = config.saveProgress !== undefined ? config.saveProgress : true;
    
    // Reset score
    score = 0;
    
    // Count total questions
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const inputs = container.querySelectorAll('.error-correction-input');
    totalQuestions = inputs.length;
    
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
    
    // Load progress if enabled
    if (saveProgress) {
      loadProgress();
    }
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
      const inputs = container.querySelectorAll('.error-correction-input');
      
      inputs.forEach(input => {
        // Get correct answers from data attribute and any alternatives
        let correctAnswers = getCorrectAnswers(input);
        const userAnswer = input.value.trim();
        const feedback = input.closest('.question').querySelector('.feedback');
        
        // Check if answer is correct
        const isCorrect = isAnswerCorrect(userAnswer, correctAnswers);
        
        if (isCorrect) {
          input.classList.add('correct');
          input.classList.remove('incorrect');
          if (feedback) {
            feedback.textContent = `Correct! You've fixed the error properly.`;
            feedback.className = 'feedback correct';
          }
          score++;
        } else {
          input.classList.add('incorrect');
          input.classList.remove('incorrect');
          allCorrect = false;
          
          if (feedback) {
            // Get original sentence with error for comparison
            const originalText = input.closest('.question').querySelector('.error-correction-text');
            const originalSentence = originalText ? originalText.textContent.trim() : '';
            
            // Generate intelligent feedback
            const hint = generateHint(userAnswer, correctAnswers, originalSentence, input);
            feedback.textContent = hint;
            feedback.className = 'feedback incorrect';
          }
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
   * Gets all correct answers for a question
   * 
   * @param {HTMLElement} input - The input element
   * @returns {Array} - Array of correct answers
   */
  function getCorrectAnswers(input) {
    // Get answers from data attribute
    let correctAnswers = input.getAttribute('data-answer') 
      ? input.getAttribute('data-answer').split(',') 
      : [];
    
    // Add any alternative answers from config
    const questionId = input.id || input.closest('.question').id;
    if (questionId && alternativeAnswers[questionId]) {
      if (Array.isArray(alternativeAnswers[questionId])) {
        correctAnswers = correctAnswers.concat(alternativeAnswers[questionId]);
      } else {
        correctAnswers.push(alternativeAnswers[questionId]);
      }
    }
    
    return correctAnswers.map(answer => answer.trim());
  }
  
  /**
   * Checks if the user's answer is correct
   * 
   * @param {string} userAnswer - The user's answer
   * @param {Array} correctAnswers - Array of correct answers
   * @returns {boolean} - Whether the answer is correct
   */
  function isAnswerCorrect(userAnswer, correctAnswers) {
    return correctAnswers.some(answer => {
      let userProcessed = userAnswer;
      let correctProcessed = answer;
      
      // Apply case sensitivity setting
      if (!caseSensitive) {
        userProcessed = userProcessed.toLowerCase();
        correctProcessed = correctProcessed.toLowerCase();
      }
      
      // Apply punctuation setting
      if (!strictPunctuation) {
        userProcessed = removePunctuation(userProcessed);
        correctProcessed = removePunctuation(correctProcessed);
      }
      
      // Normalize spacing
      userProcessed = normalizeSpacing(userProcessed);
      correctProcessed = normalizeSpacing(correctProcessed);
      
      return userProcessed === correctProcessed;
    });
  }
  
  /**
   * Removes punctuation from a string
   * 
   * @param {string} text - The input text
   * @returns {string} - Text without punctuation
   */
  function removePunctuation(text) {
    return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  }
  
  /**
   * Normalizes spacing in a string
   * 
   * @param {string} text - The input text
   * @returns {string} - Text with normalized spacing
   */
  function normalizeSpacing(text) {
    return text.replace(/\s+/g, " ").trim();
  }
  
  /**
   * Generates a hint based on the user's answer, correct answers, and original sentence
   * 
   * @param {string} userAnswer - The user's answer
   * @param {Array} correctAnswers - Array of correct answers
   * @param {string} originalSentence - The original sentence with errors
   * @param {HTMLElement} input - The input element
   * @returns {string} - A hint for the user
   */
  function generateHint(userAnswer, correctAnswers, originalSentence, input) {
    if (!userAnswer) {
      return "Please enter your correction.";
    }
    
    // Check if the user just repeated the error
    if (normalizeSpacing(userAnswer.toLowerCase()) === normalizeSpacing(originalSentence.toLowerCase())) {
      return "You've just repeated the original sentence. Look for the error and fix it.";
    }
    
    // Find the closest correct answer for better feedback
    let closestAnswer = correctAnswers[0];
    let minDistance = Infinity;
    let bestSimilarity = 0;
    
    correctAnswers.forEach(answer => {
      const userProcessed = caseSensitive ? userAnswer : userAnswer.toLowerCase();
      const answerProcessed = caseSensitive ? answer : answer.toLowerCase();
      
      const distance = levenshteinDistance(userProcessed, answerProcessed);
      const similarity = stringSimilarity(userProcessed, answerProcessed);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestAnswer = answer;
      }
      
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
      }
    });
    
    // Determine the error type if available
    const questionId = input.id || input.closest('.question').id;
    const errorType = errorTypes[questionId] || detectErrorType(originalSentence, closestAnswer);
    
    // Generate specific feedback based on error type and how close the answer is
    if (minDistance <= 2) {
      return "You're very close! Check your spelling or punctuation.";
    } else if (bestSimilarity > 0.8) {
      return "You've found the error, but your correction needs a small adjustment.";
    } else {
      // Give more specific feedback based on error type
      return getErrorTypeHint(errorType, originalSentence, closestAnswer);
    }
  }
  
  /**
   * Attempts to detect the type of error in the sentence
   * 
   * @param {string} originalSentence - The original sentence with errors
   * @param {string} correctSentence - The corrected sentence
   * @returns {string} - The detected error type
   */
  function detectErrorType(originalSentence, correctSentence) {
    const original = originalSentence.toLowerCase();
    const corrected = correctSentence.toLowerCase();
    
    // Simple error detection heuristics
    if (original.split(' ').length !== corrected.split(' ').length) {
      // Word count difference suggests missing/extra word
      return 'word-count';
    } else if (/\b(is|am|are|was|were|be|been|being)\b/.test(original) && 
               /\b(is|am|are|was|were|be|been|being)\b/.test(corrected)) {
      // Both contain be verbs, might be verb tense or form
      return 'verb-form';
    } else if (/\b(a|an|the)\b/.test(original) !== /\b(a|an|the)\b/.test(corrected)) {
      // Article differences
      return 'article';
    } else if (/\b(in|on|at|to|for|with|by|about|under|over)\b/.test(original) !== 
               /\b(in|on|at|to|for|with|by|about|under|over)\b/.test(corrected)) {
      // Preposition differences
      return 'preposition';
    } else if (/(?:ed|ing|s)\b/.test(original) !== /(?:ed|ing|s)\b/.test(corrected)) {
      // Verb endings suggest tense errors
      return 'verb-tense';
    } else if (/\b(doesn't|don't|didn't|isn't|aren't|wasn't|weren't)\b/.test(original) !== 
               /\b(doesn't|don't|didn't|isn't|aren't|wasn't|weren't)\b/.test(corrected)) {
      // Negative form differences
      return 'negation';
    } else {
      // Default to general grammar error
      return 'general';
    }
  }
  
  /**
   * Gets a hint based on error type
   * 
   * @param {string} errorType - The type of error
   * @param {string} originalSentence - The original sentence with errors
   * @param {string} correctSentence - The corrected sentence
   * @returns {string} - A hint specific to the error type
   */
  function getErrorTypeHint(errorType, originalSentence, correctSentence) {
    switch (errorType) {
      case 'word-count':
        return "Check if a word is missing or if there's an extra word that shouldn't be there.";
      case 'verb-form':
        return "Check the verb form. Is it the correct tense and does it agree with the subject?";
      case 'article':
        return "Look at the articles (a/an/the) in the sentence. Is there one missing or incorrect?";
      case 'preposition':
        return "Check the prepositions. Are you using the correct one for this context?";
      case 'verb-tense':
        return "The verb tense might be incorrect. Consider when the action takes place.";
      case 'subject-verb-agreement':
        return "Check if the verb agrees with the subject (singular/plural).";
      case 'word-order':
        return "The word order might be incorrect. Check the structure of the sentence.";
      case 'negation':
        return "Check the negative form. Is it formed correctly?";
      case 'pronoun':
        return "Check the pronouns. Are they the correct type and do they agree with their antecedents?";
      case 'plural':
        return "Check for plural/singular consistency. Does everything agree?";
      default:
        return "Look carefully at the grammar in the sentence. Something needs to be corrected.";
    }
  }
  
  /**
   * Calculate the Levenshtein distance between two strings
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
   * Calculate the similarity between two strings (0 to 1)
   * 
   * @param {string} a - First string
   * @param {string} b - Second string
   * @returns {number} - Similarity score from 0 to 1
   */
  function stringSimilarity(a, b) {
    const distance = levenshteinDistance(a, b);
    const maxLength = Math.max(a.length, b.length);
    
    if (maxLength === 0) return 1.0; // Both strings are empty
    return 1.0 - (distance / maxLength);
  }
  
  /**
   * Compares two sentences to create a diff highlighting changes
   * 
   * @param {string} original - Original sentence with errors
   * @param {string} corrected - Corrected sentence
   * @returns {string} - HTML string with differences highlighted
   */
  function createDiff(original, corrected) {
    // This is a simplified diff implementation
    // For a real application, consider using a library like diff or jsdiff
    
    const originalWords = original.split(/\s+/);
    const correctedWords = corrected.split(/\s+/);
    
    let diffHtml = '';
    let i = 0, j = 0;
    
    while (i < originalWords.length || j < correctedWords.length) {
      if (i >= originalWords.length) {
        // Remaining corrected words were added
        diffHtml += ` <span class="added">${correctedWords[j]}</span>`;
        j++;
      } else if (j >= correctedWords.length) {
        // Remaining original words were removed
        diffHtml += ` <span class="removed">${originalWords[i]}</span>`;
        i++;
      } else if (originalWords[i].toLowerCase() === correctedWords[j].toLowerCase()) {
        // Words match
        diffHtml += ` ${correctedWords[j]}`;
        i++;
        j++;
      } else {
        // Words differ - check if it's a replacement, addition, or deletion
        const nextOriginalMatch = originalWords.slice(i + 1).findIndex(word => 
          word.toLowerCase() === correctedWords[j].toLowerCase());
        const nextCorrectedMatch = correctedWords.slice(j + 1).findIndex(word => 
          word.toLowerCase() === originalWords[i].toLowerCase());
        
        if (nextOriginalMatch >= 0 && (nextCorrectedMatch < 0 || nextOriginalMatch < nextCorrectedMatch)) {
          // Word was added in corrected
          diffHtml += ` <span class="added">${correctedWords[j]}</span>`;
          j++;
        } else if (nextCorrectedMatch >= 0 && (nextOriginalMatch < 0 || nextCorrectedMatch < nextOriginalMatch)) {
          // Word was removed from original
          diffHtml += ` <span class="removed">${originalWords[i]}</span>`;
          i++;
        } else {
          // Word was changed
          diffHtml += ` <span class="removed">${originalWords[i]}</span> <span class="added">${correctedWords[j]}</span>`;
          i++;
          j++;
        }
      }
    }
    
    return diffHtml.trim();
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
      container.querySelectorAll('.error-correction-input').forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'incorrect');
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
    
    // Collect input values
    const inputs = container.querySelectorAll('.error-correction-input');
    const inputValues = {};
    
    inputs.forEach(input => {
      const id = input.id || input.closest('.question').id;
      if (id) {
        inputValues[id] = input.value;
      }
    });
    
    // Save progress data
    const progressData = {
      score: score,
      totalQuestions: totalQuestions,
      inputs: inputValues,
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
    if (!progressData || !progressData.inputs) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Restore input values
    container.querySelectorAll('.error-correction-input').forEach(input => {
      const id = input.id || input.closest('.question').id;
      if (id && progressData.inputs[id]) {
        input.value = progressData.inputs[id];
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
   * Shows a hint for a specific question
   * 
   * @param {string} questionId - ID of the question
   * @param {boolean} showAnswer - Whether to show the correct answer (default: false)
   */
  function showHint(questionId, showAnswer = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const question = container.querySelector(`#${questionId}`);
    if (!question) return;
    
    const input = question.querySelector('.error-correction-input');
    const originalText = question.querySelector('.error-correction-text');
    const feedback = question.querySelector('.feedback');
    
    if (!input || !originalText || !feedback) return;
    
    const originalSentence = originalText.textContent.trim();
    const correctAnswers = getCorrectAnswers(input);
    
    if (showAnswer && correctAnswers.length > 0) {
      // Show correct answer
      feedback.textContent = `The correct answer is: "${correctAnswers[0]}"`;
      feedback.className = 'feedback hint';
    } else {
      // Show hint based on error type
      const errorType = errorTypes[questionId] || detectErrorType(originalSentence, correctAnswers[0]);
      const hint = getErrorTypeHint(errorType, originalSentence, correctAnswers[0]);
      feedback.textContent = hint;
      feedback.className = 'feedback hint';
    }
  }
  
  /**
   * Highlights the specific error in the original sentence
   * 
   * @param {string} questionId - ID of the question
   */
  function highlightError(questionId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const question = container.querySelector(`#${questionId}`);
    if (!question) return;
    
    const originalText = question.querySelector('.error-correction-text');
    const input = question.querySelector('.error-correction-input');
    
    if (!originalText || !input) return;
    
    const originalSentence = originalText.textContent.trim();
    const correctAnswers = getCorrectAnswers(input);
    
    if (correctAnswers.length > 0) {
      // Create a diff to highlight the change
      const diff = createDiff(originalSentence, correctAnswers[0]);
      originalText.innerHTML = diff;
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
    return score === totalQuestions;
  }
  
  /**
   * Sets pre-categorized error types for better feedback
   * 
   * @param {Object} types - Mapping of question IDs to error types
   */
  function setErrorTypes(types) {
    errorTypes = {...errorTypes, ...types};
  }
  
  /**
   * Adds a feature to underline or highlight specific parts of incorrect sentences
   * 
   * @param {string} questionId - ID of the question
   * @param {number} startIndex - Start index of the text to highlight
   * @param {number} endIndex - End index of the text to highlight
   */
  function highlightErrorPart(questionId, startIndex, endIndex) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const question = container.querySelector(`#${questionId}`);
    if (!question) return;
    
    const originalText = question.querySelector('.error-correction-text');
    if (!originalText) return;
    
    const originalSentence = originalText.textContent.trim();
    
    if (startIndex >= 0 && endIndex <= originalSentence.length && startIndex < endIndex) {
      const before = originalSentence.substring(0, startIndex);
      const highlighted = originalSentence.substring(startIndex, endIndex);
      const after = originalSentence.substring(endIndex);
      
      originalText.innerHTML = `${before}<span class="error-highlight">${highlighted}</span>${after}`;
    }
  }
  
  // Public API
  return {
    init: init,
    getScore: getScore,
    isCompleted: isCompleted,
    showHint: showHint,
    highlightError: highlightError,
    setErrorTypes: setErrorTypes,
    highlightErrorPart: highlightErrorPart
  };
})();

// Export the module if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = ErrorCorrectionModule;
}