/**
 * ESL Grammar Website - Sentence Transformation Module
 * 
 * This module handles all functionality related to sentence transformation exercises:
 * - Checking user input against correct answers
 * - Supporting multiple correct transformations
 * - Providing intelligent feedback based on student input
 * - Tracking score and progress
 * - Handling activity restart
 */

/**
 * TransformationModule - Provides functionality for sentence transformation exercises
 */
const TransformationModule = (function() {
    // Private variables
    let score = 0;
    let totalQuestions = 0;
    let containerId = 'transformation';
    let onCompleteCallback = null;
    let caseSensitive = false;
    let strictPunctuation = false;
    let alternativeAnswers = {};
    
    /**
     * Initializes the Transformation module
     * 
     * @param {Object} config - Configuration object
     * @param {string} config.containerId - ID of the container element (default: 'transformation')
     * @param {Function} config.onComplete - Callback function called when all questions are answered correctly
     * @param {boolean} config.caseSensitive - Whether answers are case-sensitive (default: false)
     * @param {boolean} config.strictPunctuation - Whether punctuation is strictly checked (default: false)
     * @param {Object} config.alternativeAnswers - Additional acceptable answers beyond data-answer
     * @param {boolean} config.saveProgress - Whether to save progress to localStorage (default: true)
     */
    function init(config = {}) {
      // Set up configuration
      containerId = config.containerId || 'transformation';
      onCompleteCallback = config.onComplete || null;
      caseSensitive = config.caseSensitive || false;
      strictPunctuation = config.strictPunctuation || false;
      alternativeAnswers = config.alternativeAnswers || {};
      const saveProgress = config.saveProgress !== undefined ? config.saveProgress : true;
      
      // Reset score
      score = 0;
      
      // Count total questions
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const inputs = container.querySelectorAll('.transformation-input');
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
        const inputs = container.querySelectorAll('.transformation-input');
        
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
              feedback.textContent = `Correct! Your transformation is perfect.`;
              feedback.className = 'feedback correct';
            }
            score++;
          } else {
            input.classList.add('incorrect');
            input.classList.remove('correct');
            allCorrect = false;
            
            if (feedback) {
              const hint = generateHint(userAnswer, correctAnswers, input);
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
     * Generates a hint based on the user's answer
     * 
     * @param {string} userAnswer - The user's answer
     * @param {Array} correctAnswers - Array of correct answers
     * @param {HTMLElement} input - The input element
     * @returns {string} - A hint for the user
     */
    function generateHint(userAnswer, correctAnswers, input) {
      if (!userAnswer) {
        return "Please enter your answer.";
      }
      
      // Find the closest correct answer for better feedback
      let closestAnswer = correctAnswers[0];
      let minDistance = Infinity;
      let bestSimilarity = 0;
      
      correctAnswers.forEach(answer => {
        const distance = levenshteinDistance(
          caseSensitive ? userAnswer : userAnswer.toLowerCase(), 
          caseSensitive ? answer : answer.toLowerCase()
        );
        
        const similarity = stringSimilarity(
          caseSensitive ? userAnswer : userAnswer.toLowerCase(), 
          caseSensitive ? answer : answer.toLowerCase()
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestAnswer = answer;
        }
        
        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
        }
      });
      
      // Get the original sentence for reference
      const questionText = input.closest('.question').querySelector('.question-text');
      let originalSentence = "";
      if (questionText) {
        // Extract original sentence (usually before the bracketed info)
        const match = questionText.textContent.match(/^\d+\.\s+(.+?)(?:\s+\(|$)/);
        if (match && match[1]) {
          originalSentence = match[1].trim();
        }
      }
      
      // Generate a contextual hint based on analysis
      let hint;
      
      // Check for common errors in transformations
      if (minDistance <= 3) {
        hint = "You're very close! Check your spelling or a small grammatical error.";
      } else if (bestSimilarity > 0.7) {
        // Check for word order issues
        const userWords = userAnswer.split(/\s+/);
        const correctWords = closestAnswer.split(/\s+/);
        
        if (haveSameWords(userWords, correctWords)) {
          hint = "Check your word order. You have the right words but not in the correct order.";
        } else {
          hint = "You're on the right track. Check that you've used the correct grammar structure.";
        }
      } else {
        // Look for specific transformation issues
        if (originalSentence && isTransformationTypeDetectable(originalSentence, closestAnswer)) {
          const transformationType = detectTransformationType(originalSentence, closestAnswer);
          hint = getTransformationHint(transformationType);
        } else {
          hint = "Remember to use the correct transformation type for this exercise. Review the grammar pattern required.";
        }
      }
      
      return hint;
    }
    
    /**
     * Checks if two word arrays contain the same words (ignoring order)
     * 
     * @param {Array} wordsA - First array of words
     * @param {Array} wordsB - Second array of words
     * @returns {boolean} - Whether the arrays contain the same words
     */
    function haveSameWords(wordsA, wordsB) {
      if (wordsA.length !== wordsB.length) return false;
      
      const sortedA = [...wordsA].sort().map(w => w.toLowerCase());
      const sortedB = [...wordsB].sort().map(w => w.toLowerCase());
      
      return sortedA.every((word, i) => word === sortedB[i]);
    }
    
    /**
     * Checks if transformation type can be detected
     * 
     * @param {string} original - Original sentence
     * @param {string} transformed - Transformed sentence
     * @returns {boolean} - Whether transformation type can be detected
     */
    function isTransformationTypeDetectable(original, transformed) {
      // This is a simplified check, in a real system it would be more sophisticated
      return original.length > 0 && transformed.length > 0;
    }
    
    /**
     * Detects the type of transformation based on original and transformed sentences
     * 
     * @param {string} original - Original sentence
     * @param {string} transformed - Transformed sentence
     * @returns {string} - Type of transformation
     */
    function detectTransformationType(original, transformed) {
      // This is a simplified detector that looks for common patterns
      // In a real system, this would be more sophisticated
      
      const lowerOriginal = original.toLowerCase();
      const lowerTransformed = transformed.toLowerCase();
      
      if (lowerTransformed.includes('if') && !lowerOriginal.includes('if')) {
        return 'conditional';
      } else if (!lowerOriginal.includes('passive') && 
                 (lowerTransformed.includes('was') || lowerTransformed.includes('were') || 
                  lowerTransformed.includes('been') || lowerTransformed.includes('by'))) {
        return 'passive';
      } else if (lowerOriginal.includes('direct speech') || 
                 lowerOriginal.includes('said') && 
                 (lowerTransformed.includes('told') || lowerTransformed.includes('asked'))) {
        return 'reported-speech';
      } else if (lowerOriginal.includes('two sentences') || 
                 lowerOriginal.includes('join') || 
                 lowerTransformed.includes('who') || 
                 lowerTransformed.includes('which') || 
                 lowerTransformed.includes('that')) {
        return 'relative-clause';
      } else {
        return 'general';
      }
    }
    
    /**
     * Gets a hint based on transformation type
     * 
     * @param {string} type - Type of transformation
     * @returns {string} - A hint specific to the transformation type
     */
    function getTransformationHint(type) {
      switch (type) {
        case 'conditional':
          return "Check the conditional structure. Remember to use the correct tense in both clauses.";
        case 'passive':
          return "Check the passive voice construction. Remember the formula: be + past participle.";
        case 'reported-speech':
          return "Review the reported speech rules. Pay attention to tense changes and reporting verbs.";
        case 'relative-clause':
          return "Check your relative pronouns (who, which, that) and make sure the sentence is properly combined.";
        default:
          return "Check your grammar transformation carefully. Pay attention to the required structure.";
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
     * Sets up the restart button
     */
    function setupRestartButton() {
      const restartButton = document.getElementById(`${containerId}-restart`);
      const submitButton = document.getElementById(`${containerId}-submit`);
      
      if (!restartButton) return;
      
      restartButton.addEventListener('click', function() {
        // Clear input values
        const container = document.getElementById(containerId);
        container.querySelectorAll('.transformation-input').forEach(input => {
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
      const inputs = container.querySelectorAll('.transformation-input');
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
      container.querySelectorAll('.transformation-input').forEach(input => {
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
     * Add keystroke analytics for research on student input patterns
     * This is optional and would be used only if analyzing student patterns
     * 
     * @param {boolean} enable - Whether to enable keystroke tracking
     */
    function enableKeystrokeAnalytics(enable = false) {
      if (!enable) return;
      
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const inputs = container.querySelectorAll('.transformation-input');
      
      inputs.forEach(input => {
        const questionId = input.id || input.closest('.question').id;
        
        // Track keystrokes and pauses
        let keystrokes = [];
        let lastKeystroke = Date.now();
        
        input.addEventListener('keydown', function(e) {
          const now = Date.now();
          const pause = now - lastKeystroke;
          
          keystrokes.push({
            key: e.key,
            time: now,
            pause: pause
          });
          
          lastKeystroke = now;
        });
        
        // Save keystroke data when input loses focus
        input.addEventListener('blur', function() {
          if (typeof saveToLocalStorage === 'function' && keystrokes.length > 0) {
            const analyticsKey = `${containerId}-keystrokes-${questionId}`;
            saveToLocalStorage(analyticsKey, keystrokes);
            keystrokes = []; // Reset after saving
          }
        });
      });
    }
    
    /**
     * Provides example transformations as hints
     * 
     * @param {string} questionId - ID of the question to hint
     * @param {string} hint - The hint to show
     */
    function provideExampleHint(questionId, hint) {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const question = container.querySelector(`#${questionId}`);
      if (!question) return;
      
      const hintContainer = question.querySelector('.example-hint') || 
                              document.createElement('div');
      
      if (!question.querySelector('.example-hint')) {
        hintContainer.className = 'example-hint';
        question.appendChild(hintContainer);
      }
      
      hintContainer.innerHTML = `
        <p class="hint-title">Example:</p>
        <p class="hint-content">${hint}</p>
      `;
    }
    
    // Public API
    return {
      init: init,
      getScore: getScore,
      isCompleted: isCompleted,
      provideExampleHint: provideExampleHint,
      enableKeystrokeAnalytics: enableKeystrokeAnalytics
    };
  })();
  
  // Export the module if module system is being used
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = TransformationModule;
  }