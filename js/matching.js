/**
 * ESL Grammar Website - Matching Exercise Module
 * 
 * This module handles all functionality related to matching exercises:
 * - Selecting items to match
 * - Creating visual connections between matched items
 * - Validating matches
 * - Providing feedback
 * - Tracking score and progress
 * - Restarting the activity
 */

/**
 * MatchingModule - Provides functionality for matching exercises
 */
const MatchingModule = (function() {
    // Private variables
    let score = 0;
    let totalPairs = 0;
    let matchedPairs = new Set();
    let selectedItem = null;
    let containerId = 'matching';
    let onCompleteCallback = null;
    let matchColors = [
      'rgba(144, 238, 144, 0.6)',  // light green
      'rgba(173, 216, 230, 0.6)',  // light blue
      'rgba(221, 160, 221, 0.6)',  // plum
      'rgba(255, 182, 193, 0.6)',  // light pink
      'rgba(255, 218, 185, 0.6)',  // peach
      'rgba(152, 251, 152, 0.6)',  // pale green
      'rgba(135, 206, 250, 0.6)',  // light sky blue
      'rgba(238, 130, 238, 0.6)'   // violet
    ];
    
    /**
     * Initializes the Matching module
     * 
     * @param {Object} config - Configuration object
     * @param {string} config.containerId - ID of the container element (default: 'matching')
     * @param {Function} config.onComplete - Callback function called when all pairs are matched
     * @param {Array} config.colors - Array of colors for match highlighting (optional)
     * @param {string} config.lineContainerId - ID of the container for match lines (default: 'line-container')
     * @param {boolean} config.saveProgress - Whether to save progress to localStorage (default: true)
     */
    function init(config = {}) {
      // Set up configuration
      containerId = config.containerId || 'matching';
      onCompleteCallback = config.onComplete || null;
      const lineContainerId = config.lineContainerId || 'line-container';
      const saveProgress = config.saveProgress !== undefined ? config.saveProgress : true;
      
      if (config.colors && Array.isArray(config.colors)) {
        matchColors = config.colors;
      }
      
      // Reset state
      score = 0;
      matchedPairs = new Set();
      selectedItem = null;
      
      // Count total pairs
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const questions = container.querySelectorAll('.matching-question');
      totalPairs = questions.length;
      
      // Set up click handlers for matching items
      setupMatchingItemHandlers();
      
      // Set up restart button
      setupRestartButton();
      
      // Load progress if enabled
      if (saveProgress) {
        loadProgress();
      }
    }
    
    /**
     * Sets up click handlers for matching items
     */
    function setupMatchingItemHandlers() {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const items = container.querySelectorAll('.matching-question, .matching-answer');
      
      items.forEach(item => {
        item.addEventListener('click', function() {
          // If this item is already matched, do nothing
          if (this.classList.contains('matched')) {
            return;
          }
          
          const isQuestion = this.classList.contains('matching-question');
          const index = parseInt(this.getAttribute('data-index'));
          
          if (isQuestion) {
            // Clear previous question selection
            container.querySelectorAll('.matching-question').forEach(q => {
              if (!q.classList.contains('matched')) {
                q.classList.remove('selected');
              }
            });
            
            // Select this question
            this.classList.add('selected');
            selectedItem = this;
          } else {
            // This is an answer
            // If no question is selected, do nothing
            if (!selectedItem) {
              return;
            }
            
            const questionIndex = parseInt(selectedItem.getAttribute('data-index'));
            
            // Check if match is correct
            if (questionIndex === index) {
              // Correct match - apply matching color
              const colorIndex = matchedPairs.size;
              const matchColor = matchColors[colorIndex % matchColors.length];
              
              selectedItem.classList.add('matched');
              this.classList.add('matched');
              
              selectedItem.style.backgroundColor = matchColor;
              this.style.backgroundColor = matchColor;
              
              // Create visual line connecting the match if line container exists
              createMatchLine(selectedItem, this);
              
              // Add to matched pairs
              matchedPairs.add(questionIndex);
              
              // Increment score
              score++;
              
              // Check if all pairs are matched
              if (matchedPairs.size === totalPairs) {
                // Show score
                const scoreDisplay = document.getElementById(`${containerId}-score`);
                if (scoreDisplay) {
                  scoreDisplay.querySelector('span').textContent = score;
                  scoreDisplay.style.display = 'block';
                }
                
                // Show restart button
                const restartButton = document.getElementById(`${containerId}-restart`);
                if (restartButton) {
                  restartButton.style.display = 'block';
                }
                
                // Call onComplete callback if provided
                if (typeof onCompleteCallback === 'function') {
                  onCompleteCallback(score, totalPairs);
                }
                
                // Save progress to localStorage if available
                saveProgress();
              }
              
              // Clear selection
              selectedItem.classList.remove('selected');
              selectedItem = null;
            } else {
              // Incorrect match - flash
              this.classList.add('selected');
              setTimeout(() => {
                this.classList.remove('selected');
                selectedItem.classList.remove('selected');
                selectedItem = null;
              }, 500);
            }
          }
        });
      });
    }
    
    /**
     * Creates a visual line connecting matched items
     * 
     * @param {HTMLElement} fromElement - The source element (question)
     * @param {HTMLElement} toElement - The target element (answer)
     */
    function createMatchLine(fromElement, toElement) {
      const lineContainer = document.getElementById('line-container');
      if (!lineContainer) return;
      
      // Get the positions of the elements
      const fromRect = fromElement.getBoundingClientRect();
      const toRect = toElement.getBoundingClientRect();
      const containerRect = lineContainer.getBoundingClientRect();
      
      // Calculate the coordinates relative to the line container
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      const fromX = fromRect.right - containerRect.left - scrollLeft;
      const fromY = (fromRect.top + fromRect.bottom) / 2 - containerRect.top - scrollTop;
      const toX = toRect.left - containerRect.left - scrollLeft;
      const toY = (toRect.top + toRect.bottom) / 2 - containerRect.top - scrollTop;
      
      // Calculate the length and angle of the line
      const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
      const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
      
      // Create the line element
      const line = document.createElement('div');
      line.className = 'matching-line';
      line.style.width = `${length}px`;
      line.style.left = `${fromX}px`;
      line.style.top = `${fromY}px`;
      line.style.transform = `rotate(${angle}deg)`;
      
      // Add a data attribute to identify this match (for removal on restart)
      const matchIndex = matchedPairs.size;
      line.setAttribute('data-match-index', matchIndex);
      
      // Use the same color as the matched pair
      const colorIndex = matchedPairs.size - 1;
      const matchColor = matchColors[colorIndex % matchColors.length];
      line.style.backgroundColor = matchColor;
      
      // Add the line to the container
      lineContainer.appendChild(line);
    }
    
    /**
     * Removes all connection lines between matched items
     */
    function removeAllLines() {
      const lineContainer = document.getElementById('line-container');
      if (!lineContainer) return;
      
      const lines = lineContainer.querySelectorAll('.matching-line');
      lines.forEach(line => {
        line.remove();
      });
    }
    
    /**
     * Sets up the restart button
     */
    function setupRestartButton() {
      const restartButton = document.getElementById(`${containerId}-restart`);
      if (!restartButton) return;
      
      restartButton.addEventListener('click', function() {
        // Clear matches
        const container = document.getElementById(containerId);
        container.querySelectorAll('.matching-question, .matching-answer').forEach(item => {
          item.classList.remove('selected', 'matched');
          item.style.backgroundColor = ''; // Remove background color
        });
        
        // Remove connection lines
        removeAllLines();
        
        // Reset matched pairs and selection
        matchedPairs = new Set();
        selectedItem = null;
        
        // Hide score and restart button
        const scoreDisplay = document.getElementById(`${containerId}-score`);
        if (scoreDisplay) {
          scoreDisplay.style.display = 'none';
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
     * Saves the current progress to localStorage
     */
    function saveProgress() {
      if (typeof saveToLocalStorage !== 'function') return;
      
      const progressData = {
        score: score,
        totalPairs: totalPairs,
        matchedPairs: Array.from(matchedPairs),
        completed: matchedPairs.size === totalPairs
      };
      
      saveToLocalStorage(`${containerId}-progress`, progressData);
    }
    
    /**
     * Loads progress from localStorage
     */
    function loadProgress() {
      if (typeof getFromLocalStorage !== 'function') return;
      
      const progressData = getFromLocalStorage(`${containerId}-progress`);
      if (!progressData || !progressData.matchedPairs || !progressData.matchedPairs.length) return;
      
      const container = document.getElementById(containerId);
      if (!container) return;
      
      // Recreate matches
      progressData.matchedPairs.forEach(pairIndex => {
        const question = container.querySelector(`.matching-question[data-index="${pairIndex}"]`);
        const answer = container.querySelector(`.matching-answer[data-index="${pairIndex}"]`);
        
        if (question && answer) {
          // Apply matching color
          const colorIndex = matchedPairs.size;
          const matchColor = matchColors[colorIndex % matchColors.length];
          
          question.classList.add('matched');
          answer.classList.add('matched');
          
          question.style.backgroundColor = matchColor;
          answer.style.backgroundColor = matchColor;
          
          // Create visual line
          createMatchLine(question, answer);
          
          // Add to matched pairs
          matchedPairs.add(pairIndex);
        }
      });
      
      // Update score
      score = matchedPairs.size;
      
      // If all pairs are matched, update UI
      if (matchedPairs.size === totalPairs) {
        const scoreDisplay = document.getElementById(`${containerId}-score`);
        if (scoreDisplay) {
          scoreDisplay.querySelector('span').textContent = score;
          scoreDisplay.style.display = 'block';
        }
        
        const restartButton = document.getElementById(`${containerId}-restart`);
        if (restartButton) {
          restartButton.style.display = 'block';
        }
      }
    }
    
    /**
     * Gets the current score
     * 
     * @returns {Object} Object containing score and totalPairs
     */
    function getScore() {
      return {
        score: score,
        totalPairs: totalPairs,
        percentage: totalPairs > 0 ? Math.round((score / totalPairs) * 100) : 0
      };
    }
    
    /**
     * Checks if all pairs have been matched
     * 
     * @returns {boolean} True if all pairs are matched
     */
    function isCompleted() {
      return matchedPairs.size === totalPairs;
    }
    
    /**
     * Calculate positions for elements if they've moved (e.g., responsive layout changes)
     * This is useful to call on window resize to update match lines
     */
    function recalculateMatchLines() {
      // First remove all existing lines
      removeAllLines();
      
      // Then recreate lines for each match
      const container = document.getElementById(containerId);
      if (!container) return;
      
      matchedPairs.forEach(pairIndex => {
        const question = container.querySelector(`.matching-question[data-index="${pairIndex}"]`);
        const answer = container.querySelector(`.matching-answer[data-index="${pairIndex}"]`);
        
        if (question && answer) {
          createMatchLine(question, answer);
        }
      });
    }
    
    /**
     * Add window resize event listener to recalculate match lines
     * 
     * @param {boolean} enable - Whether to enable or disable the resize listener
     */
    function handleResize(enable = true) {
      if (enable) {
        // Use debounce if available to avoid too many recalculations
        const resizeHandler = typeof debounce === 'function' 
          ? debounce(recalculateMatchLines, 150) 
          : recalculateMatchLines;
        
        window.addEventListener('resize', resizeHandler);
      } else {
        window.removeEventListener('resize', recalculateMatchLines);
      }
    }
    
    /**
     * Setup auto-scroll to center the selected item
     * Useful for mobile views where items might be far apart
     * 
     * @param {boolean} enable - Whether to enable or disable auto-scrolling
     */
    function setupAutoScroll(enable = true) {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      if (enable) {
        container.querySelectorAll('.matching-question, .matching-answer').forEach(item => {
          item.addEventListener('click', function() {
            if (window.innerWidth <= 768) { // Only on mobile/small screens
              this.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            }
          });
        });
      } else {
        // Remove event listeners if needed
        // This would require keeping references to the handlers
      }
    }
    
    // Public API
    return {
      init: init,
      getScore: getScore,
      isCompleted: isCompleted,
      recalculateMatchLines: recalculateMatchLines,
      handleResize: handleResize,
      setupAutoScroll: setupAutoScroll
    };
  })();
  
  // Export the module if module system is being used
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = MatchingModule;
  }