/**
 * ESL Grammar Website - Drag and Drop Module
 * 
 * This module handles all functionality related to drag and drop exercises:
 * - Setting up draggable items
 * - Creating drop zones
 * - Validating correct arrangements
 * - Providing feedback
 * - Tracking score and progress
 * - Restarting the activity
 */

/**
 * DragDropModule - Provides functionality for drag and drop exercises
 */
const DragDropModule = (function() {
  // Private variables
  let score = 0;
  let totalQuestions = 0;
  let containerId = 'drag-drop';
  let onCompleteCallback = null;
  let correctAnswers = {};
  let currentDraggedItem = null;
  let touchDevice = false;
  
  /**
   * Initializes the Drag and Drop module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the container element (default: 'drag-drop')
   * @param {Object} config.answers - Object mapping question indices to arrays of correct answers
   * @param {Function} config.onComplete - Callback function called when all drop zones are correctly filled
   * @param {boolean} config.allowMultipleCorrectOrders - Whether multiple correct orders are valid (default: false)
   * @param {boolean} config.saveProgress - Whether to save progress to localStorage (default: true)
   */
  function init(config = {}) {
    // Set up configuration
    containerId = config.containerId || 'drag-drop';
    correctAnswers = config.answers || {};
    onCompleteCallback = config.onComplete || null;
    const allowMultipleCorrectOrders = config.allowMultipleCorrectOrders || false;
    const saveProgress = config.saveProgress !== undefined ? config.saveProgress : true;
    
    // Detect touch device
    touchDevice = ('ontouchstart' in window) || 
                 (navigator.maxTouchPoints > 0) || 
                 (navigator.msMaxTouchPoints > 0);
    
    // Reset score
    score = 0;
    
    // Count total questions
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const dropZones = container.querySelectorAll('.drop-zone');
    totalQuestions = dropZones.length;
    
    // Set up drag items
    setupDragItems();
    
    // Set up drop zones
    setupDropZones();
    
    // Set up submit button
    setupSubmitButton(allowMultipleCorrectOrders);
    
    // Set up restart button
    setupRestartButton();
    
    // Add touch/pointer event handlers for mobile devices
    if (touchDevice) {
      setupTouchEvents();
    }
    
    // Load progress if enabled
    if (saveProgress) {
      loadProgress();
    }
  }
  
  /**
   * Sets up event handlers for draggable items
   */
  function setupDragItems() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const dragItems = container.querySelectorAll('.drag-item');
    
    dragItems.forEach(item => {
      // Set attributes needed for drag operations
      item.setAttribute('draggable', 'true');
      
      // Dragstart event - triggered when the user starts dragging
      item.addEventListener('dragstart', function(e) {
        this.classList.add('dragging');
        
        // Store the dragged item's text in the dataTransfer object
        e.dataTransfer.setData('text/plain', this.textContent);
        e.dataTransfer.effectAllowed = 'move';
        
        // Store reference to the currently dragged item
        currentDraggedItem = this;
      });
      
      // Dragend event - triggered when the user finishes dragging
      item.addEventListener('dragend', function() {
        this.classList.remove('dragging');
        currentDraggedItem = null;
      });
      
      // Add double-click to remove and return item to options
      item.addEventListener('dblclick', function() {
        handleItemDoubleClick(this);
      });
    });
  }
  
  /**
   * Handles double-click on drag items to return them to options
   * 
   * @param {HTMLElement} item - The drag item that was double-clicked
   */
  function handleItemDoubleClick(item) {
    // Get the parent element
    const parent = item.parentElement;
    
    // If this item is in a drop zone, return it to the options
    if (parent && parent.classList.contains('drop-zone')) {
      // Find the original container for this item
      const questionId = parent.closest('.question').id;
      const optionsContainer = document.querySelector(`#${questionId} .drag-items`);
      
      if (optionsContainer) {
        // Clone the item and add to options
        const newItem = item.cloneNode(true);
        
        // Add event listeners to the new item
        setupClonedItemEventListeners(newItem);
        
        // Add to options container
        optionsContainer.appendChild(newItem);
        
        // Remove this item from the drop zone
        item.remove();
      }
    }
  }
  
  /**
   * Sets up event listeners for a cloned drag item
   * 
   * @param {HTMLElement} item - The cloned drag item
   */
  function setupClonedItemEventListeners(item) {
    // Dragstart event
    item.addEventListener('dragstart', function(e) {
      this.classList.add('dragging');
      e.dataTransfer.setData('text/plain', this.textContent);
      e.dataTransfer.effectAllowed = 'move';
      currentDraggedItem = this;
    });
    
    // Dragend event
    item.addEventListener('dragend', function() {
      this.classList.remove('dragging');
      currentDraggedItem = null;
    });
    
    // Double-click event
    item.addEventListener('dblclick', function() {
      handleItemDoubleClick(this);
    });
  }
  
  /**
   * Sets up event handlers for drop zones
   */
  function setupDropZones() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const dropZones = container.querySelectorAll('.drop-zone');
    
    dropZones.forEach(zone => {
      // Dragover event - triggered when a dragged item is over the drop zone
      zone.addEventListener('dragover', function(e) {
        // Prevent default to allow drop
        e.preventDefault();
        this.classList.add('highlight');
      });
      
      // Dragleave event - triggered when a dragged item leaves the drop zone
      zone.addEventListener('dragleave', function() {
        this.classList.remove('highlight');
      });
      
      // Drop event - triggered when a dragged item is dropped
      zone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('highlight');
        
        // Get the dragged item's text
        const itemText = e.dataTransfer.getData('text/plain');
        
        // Create a new drag item in the drop zone
        const newItem = document.createElement('div');
        newItem.className = 'drag-item';
        newItem.textContent = itemText;
        newItem.draggable = true;
        
        // Add event listeners to the new item
        setupClonedItemEventListeners(newItem);
        
        // Add the new item to the drop zone
        this.appendChild(newItem);
        
        // Remove the original item if it exists
        if (currentDraggedItem) {
          currentDraggedItem.remove();
          currentDraggedItem = null;
        }
      });
    });
  }
  
  /**
   * Sets up touch events for mobile devices
   */
  function setupTouchEvents() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Implementation of touch drag-and-drop
    // This is a simplified version - more complex implementations may be needed for production
    
    let touchDragItem = null;
    let touchStartX, touchStartY;
    
    // Touch start event for drag items
    container.querySelectorAll('.drag-item').forEach(item => {
      item.addEventListener('touchstart', function(e) {
        touchDragItem = this;
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        
        this.classList.add('dragging');
        
        // Prevent scrolling while dragging
        e.preventDefault();
      }, { passive: false });
    });
    
    // Touch move event for the entire container
    container.addEventListener('touchmove', function(e) {
      if (!touchDragItem) return;
      
      const touch = e.touches[0];
      
      // Move the dragged item with the touch
      touchDragItem.style.position = 'absolute';
      touchDragItem.style.left = touch.clientX + 'px';
      touchDragItem.style.top = touch.clientY + 'px';
      
      // Prevent scrolling while dragging
      e.preventDefault();
    }, { passive: false });
    
    // Touch end event for drop zones
    container.querySelectorAll('.drop-zone').forEach(zone => {
      zone.addEventListener('touchend', function(e) {
        if (!touchDragItem) return;
        
        const touch = e.changedTouches[0];
        const dropRect = this.getBoundingClientRect();
        
        // Check if the touch ended over this drop zone
        if (touch.clientX >= dropRect.left && touch.clientX <= dropRect.right &&
            touch.clientY >= dropRect.top && touch.clientY <= dropRect.bottom) {
          
          // Create a clone of the dragged item
          const newItem = touchDragItem.cloneNode(true);
          newItem.style.position = '';
          newItem.style.left = '';
          newItem.style.top = '';
          newItem.classList.remove('dragging');
          
          // Add event listeners to the new item
          setupClonedItemEventListeners(newItem);
          
          // Add to the drop zone
          this.appendChild(newItem);
          
          // Remove the original if it was in a different container
          if (touchDragItem.parentElement !== this) {
            touchDragItem.remove();
          }
        }
        
        // Reset the dragged item
        touchDragItem.classList.remove('dragging');
        touchDragItem.style.position = '';
        touchDragItem.style.left = '';
        touchDragItem.style.top = '';
        touchDragItem = null;
      });
    });
  }
  
  /**
   * Sets up the submit button
   * 
   * @param {boolean} allowMultipleCorrectOrders - Whether multiple correct orders are valid
   */
  function setupSubmitButton(allowMultipleCorrectOrders) {
    const submitButton = document.getElementById(`${containerId}-submit`);
    if (!submitButton) return;
    
    submitButton.addEventListener('click', function() {
      score = 0;
      let allCorrect = true;
      
      // Check each drop zone
      Object.keys(correctAnswers).forEach(zoneIndex => {
        const zone = document.querySelector(`.drop-zone[data-index="${zoneIndex}"]`);
        if (!zone) return;
        
        const feedback = zone.closest('.question').querySelector('.feedback');
        const userAnswer = Array.from(zone.querySelectorAll('.drag-item'))
          .map(item => item.textContent.toLowerCase())
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Get the correct answers for this zone
        const correctAnswersForZone = Array.isArray(correctAnswers[zoneIndex]) 
          ? correctAnswers[zoneIndex] 
          : [correctAnswers[zoneIndex]];
        
        // Check if the user's answer matches any of the correct answers
        const isCorrect = correctAnswersForZone.some(answer => {
          if (allowMultipleCorrectOrders) {
            // For this mode, we'll consider word sets rather than exact order
            const userWords = userAnswer.split(' ').sort().join(' ');
            const correctWords = answer.toLowerCase().split(' ').sort().join(' ');
            return userWords === correctWords;
          } else {
            return userAnswer === answer.toLowerCase();
          }
        });
        
        if (isCorrect) {
          // Correct arrangement
          zone.style.borderColor = 'var(--success-color)';
          zone.style.backgroundColor = 'var(--success-bg)';
          if (feedback) {
            feedback.textContent = 'Correct! Perfect arrangement.';
            feedback.className = 'feedback correct';
          }
          score++;
        } else {
          // Incorrect arrangement
          zone.style.borderColor = 'var(--error-color)';
          zone.style.backgroundColor = 'var(--error-bg)';
          allCorrect = false;
          
          if (feedback) {
            let hint;
            
            // Try to give a helpful hint based on the content
            if (userAnswer === '') {
              hint = "This area is empty. Place some items here.";
            } else {
              hint = "Try a different arrangement. Check the order of the words.";
              
              if (allowMultipleCorrectOrders) {
                hint = "You may have missing or extra words. Check your selection.";
              }
            }
            
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
      
      // Call onComplete callback if all answers are correct
      if (allCorrect && typeof onCompleteCallback === 'function') {
        onCompleteCallback(score, totalQuestions);
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
      const container = document.getElementById(containerId);
      if (!container) return;
      
      // Clear all drop zones
      container.querySelectorAll('.drop-zone').forEach(zone => {
        zone.innerHTML = '';
        zone.style.borderColor = 'var(--border-color)';
        zone.style.backgroundColor = 'var(--drop-zone-bg)';
      });
      
      // Restore original drag items
      restoreDragItems();
      
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
   * Restores original drag items after restart
   */
  function restoreDragItems() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // For each question, restore the original drag items
    container.querySelectorAll('.question').forEach(question => {
      const zoneIndex = question.querySelector('.drop-zone').getAttribute('data-index');
      const dragItemsContainer = question.querySelector('.drag-items');
      
      // Skip if no drag items container
      if (!dragItemsContainer) return;
      
      // Clear the drag items container
      dragItemsContainer.innerHTML = '';
      
      // Get the correct answers to recreate original items
      if (correctAnswers[zoneIndex]) {
        let words;
        if (Array.isArray(correctAnswers[zoneIndex])) {
          // Use the first correct answer if there are multiple options
          words = correctAnswers[zoneIndex][0].split(' ');
        } else {
          words = correctAnswers[zoneIndex].split(' ');
        }
        
        // Shuffle words
        words = shuffleArray(words);
        
        // Create drag items
        words.forEach(word => {
          const item = document.createElement('div');
          item.className = 'drag-item';
          item.textContent = word;
          item.setAttribute('draggable', 'true');
          
          // Add event listeners
          setupClonedItemEventListeners(item);
          
          dragItemsContainer.appendChild(item);
        });
      }
    });
  }
  
  /**
   * Shuffles an array (Fisher-Yates algorithm)
   * 
   * @param {Array} array - The array to shuffle
   * @returns {Array} - The shuffled array
   */
  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
  
  /**
   * Saves progress to localStorage
   */
  function saveProgress() {
    if (typeof saveToLocalStorage !== 'function') return;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Save the current state of each drop zone
    const dropZonesState = {};
    
    container.querySelectorAll('.drop-zone').forEach(zone => {
      const zoneIndex = zone.getAttribute('data-index');
      
      if (zoneIndex) {
        dropZonesState[zoneIndex] = Array.from(zone.querySelectorAll('.drag-item'))
          .map(item => item.textContent);
      }
    });
    
    // Save progress data
    const progressData = {
      score: score,
      totalQuestions: totalQuestions,
      dropZones: dropZonesState,
      completed: score === totalQuestions
    };
    
    saveToLocalStorage(`${containerId}-progress`, progressData);
  }
  
  /**
   * Loads progress from localStorage
   */
  function loadProgress() {
    if (typeof getFromLocalStorage !== 'function') return;
    
    const progressData = getFromLocalStorage(`${containerId}-progress`);
    if (!progressData || !progressData.dropZones) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Restore each drop zone
    Object.entries(progressData.dropZones).forEach(([zoneIndex, items]) => {
      const zone = container.querySelector(`.drop-zone[data-index="${zoneIndex}"]`);
      
      if (zone && Array.isArray(items)) {
        // Clear the zone first
        zone.innerHTML = '';
        
        // Add items to the zone
        items.forEach(itemText => {
          const item = document.createElement('div');
          item.className = 'drag-item';
          item.textContent = itemText;
          item.setAttribute('draggable', 'true');
          
          // Add event listeners
          setupClonedItemEventListeners(item);
          
          zone.appendChild(item);
        });
        
        // Remove these items from the original container
        const question = zone.closest('.question');
        if (question) {
          const dragItemsContainer = question.querySelector('.drag-items');
          
          if (dragItemsContainer) {
            items.forEach(itemText => {
              const matchingItems = Array.from(dragItemsContainer.querySelectorAll('.drag-item'))
                .filter(item => item.textContent === itemText);
              
              // Remove one instance of matching item
              if (matchingItems.length > 0) {
                matchingItems[0].remove();
              }
            });
          }
        }
      }
    });
    
    // If the activity was completed, check answers to restore state
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
   * Adds a single drag item to a specific container
   * Useful for dynamically adding new items
   * 
   * @param {string} containerSelector - CSS selector for the container
   * @param {string} text - Text content for the new drag item
   * @returns {HTMLElement|null} - The created drag item or null if container not found
   */
  function addDragItem(containerSelector, text) {
    const container = document.querySelector(containerSelector);
    if (!container) return null;
    
    const item = document.createElement('div');
    item.className = 'drag-item';
    item.textContent = text;
    item.setAttribute('draggable', 'true');
    
    // Add event listeners
    setupClonedItemEventListeners(item);
    
    // Add to container
    container.appendChild(item);
    
    return item;
  }
  
  /**
   * Clears all items from a drop zone
   * 
   * @param {string} zoneSelector - CSS selector for the drop zone
   */
  function clearDropZone(zoneSelector) {
    const zone = document.querySelector(zoneSelector);
    if (zone) {
      zone.innerHTML = '';
      zone.style.borderColor = 'var(--border-color)';
      zone.style.backgroundColor = 'var(--drop-zone-bg)';
    }
  }
  
  // Public API
  return {
    init: init,
    getScore: getScore,
    isCompleted: isCompleted,
    addDragItem: addDragItem,
    clearDropZone: clearDropZone
  };
})();

// Export the module if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = DragDropModule;
}