/**
 * ESL Grammar Website - Enhanced Drag and Drop Module
 * 
 * This module handles all functionality related to drag and drop exercises:
 * - Setting up draggable items
 * - Creating drop zones with free rearrangement
 * - Allowing words to be reordered within drop zones
 * - Validating correct arrangements
 * - Providing feedback
 * - Tracking score and progress
 * - Restarting the activity
 * - Proper state isolation between different activities
 */

/**
 * DragDropModule - Provides functionality for drag and drop exercises with free rearrangement
 */
const DragDropModule = (function() {
  // Private variables
  let score = 0;
  let totalQuestions = 0;
  let containerId = 'drag-drop';
  let storageKey = 'drag-drop'; // NEW: Unique identifier for this activity
  let onCompleteCallback = null;
  let correctAnswers = {};
  let currentDraggedItem = null;
  let touchDevice = false;
  let dragStartContainer = null;
  let insertionIndicator = null;
  
  /**
   * Initializes the Drag and Drop module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the container element (default: 'drag-drop')
   * @param {string} config.storageKey - Unique identifier for this activity (default: containerId)
   * @param {Object} config.answers - Object mapping question IDs to correct answers
   * @param {Function} config.onComplete - Callback function called when all drop zones are correctly filled
   * @param {boolean} config.allowMultipleCorrectOrders - Whether multiple correct orders are valid (default: false)
   * @param {boolean} config.saveProgress - Whether to save progress to localStorage (default: true)
   */
  function init(config = {}) {
    // Set up configuration
    containerId = config.containerId || 'drag-drop';
    storageKey = config.storageKey || containerId; // NEW: Use unique storageKey
    correctAnswers = config.answers || {};
    onCompleteCallback = config.onComplete || null;
    const allowMultipleCorrectOrders = config.allowMultipleCorrectOrders || false;
    const saveProgress = config.saveProgress !== undefined ? config.saveProgress : true;
    
    // NEW: Check if we've switched activities and clear old state if needed
    const currentActivity = localStorage.getItem('dragdrop-current-activity');
    if (currentActivity !== storageKey) {
      clearAllState();
      localStorage.setItem('dragdrop-current-activity', storageKey);
    }
    
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
    
    // Create insertion indicator
    createInsertionIndicator();
    
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
   * NEW: Clears all drag-drop related localStorage items
   * This prevents state pollution between different activities
   */
  function clearAllState() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('dragdrop-')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
  
  /**
   * Creates an insertion indicator element for visual feedback
   */
  function createInsertionIndicator() {
    insertionIndicator = document.createElement('div');
    insertionIndicator.className = 'insertion-indicator';
    insertionIndicator.style.cssText = `
      width: 3px;
      height: 30px;
      background-color: var(--accent-color, #3498db);
      position: absolute;
      z-index: 1000;
      border-radius: 2px;
      display: none;
      animation: pulse 1s infinite;
    `;
    
    // Add CSS animation if not already present
    if (!document.querySelector('#insertion-indicator-styles')) {
      const style = document.createElement('style');
      style.id = 'insertion-indicator-styles';
      style.textContent = `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .drop-zone {
          position: relative;
          min-height: 40px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 5px;
          padding: 10px;
        }
        .drop-zone.highlight {
          background-color: var(--accent-color-light, rgba(52, 152, 219, 0.1));
          border-color: var(--accent-color, #3498db);
        }
        .drag-item {
          cursor: move;
          user-select: none;
          transition: transform 0.2s ease;
        }
        .drag-item:hover {
          transform: scale(1.05);
        }
        .drag-item.dragging {
          opacity: 0.5;
          transform: rotate(5deg);
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(insertionIndicator);
  }
  
  /**
   * Sets up event handlers for draggable items
   */
  function setupDragItems() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const dragItems = container.querySelectorAll('.drag-item');
    
    dragItems.forEach(item => {
      setupDragItemEventListeners(item);
    });
  }
  
  /**
   * Sets up event listeners for a drag item
   * 
   * @param {HTMLElement} item - The drag item
   */
  function setupDragItemEventListeners(item) {
    // Set attributes needed for drag operations
    item.setAttribute('draggable', 'true');
    
    // Dragstart event - triggered when the user starts dragging
    item.addEventListener('dragstart', function(e) {
      this.classList.add('dragging');
      
      // Store the dragged item's text in the dataTransfer object
      e.dataTransfer.setData('text/plain', this.textContent);
      e.dataTransfer.effectAllowed = 'move';
      
      // Store reference to the currently dragged item and its container
      currentDraggedItem = this;
      dragStartContainer = this.parentElement;
    });
    
    // Dragend event - triggered when the user finishes dragging
    item.addEventListener('dragend', function() {
      this.classList.remove('dragging');
      currentDraggedItem = null;
      dragStartContainer = null;
      hideInsertionIndicator();
    });
    
    // Add double-click to remove and return item to options
    item.addEventListener('dblclick', function() {
      handleItemDoubleClick(this);
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
        setupDragItemEventListeners(newItem);
        
        // Add to options container
        optionsContainer.appendChild(newItem);
        
        // Remove this item from the drop zone
        item.remove();
      }
    }
  }
  
  /**
   * Gets the insertion point within a drop zone based on mouse position
   * 
   * @param {HTMLElement} dropZone - The drop zone element
   * @param {number} clientX - Mouse X position
   * @param {number} clientY - Mouse Y position
   * @returns {Object} Object containing insertBefore element and position info
   */
  function getInsertionPoint(dropZone, clientX, clientY) {
    const items = Array.from(dropZone.querySelectorAll('.drag-item:not(.dragging)'));
    
    if (items.length === 0) {
      return { insertBefore: null, position: { x: clientX, y: clientY } };
    }
    
    let closestItem = null;
    let minDistance = Infinity;
    let insertBefore = null;
    let insertionX = clientX;
    let insertionY = clientY;
    
    // Check each item to find the best insertion point
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const itemCenterY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(clientX - itemCenterX, 2) + 
        Math.pow(clientY - itemCenterY, 2)
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestItem = item;
        
        // Determine if we should insert before or after this item
        if (clientX < itemCenterX) {
          insertBefore = item;
          insertionX = rect.left;
          insertionY = rect.top + rect.height / 2;
        } else {
          insertBefore = items[i + 1] || null;
          insertionX = rect.right;
          insertionY = rect.top + rect.height / 2;
        }
      }
    }
    
    return { 
      insertBefore: insertBefore, 
      position: { x: insertionX, y: insertionY } 
    };
  }
  
  /**
   * Shows the insertion indicator at the specified position
   * 
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  function showInsertionIndicator(x, y) {
    if (!insertionIndicator) return;
    
    insertionIndicator.style.display = 'block';
    insertionIndicator.style.left = `${x}px`;
    insertionIndicator.style.top = `${y - 15}px`;
  }
  
  /**
   * Hides the insertion indicator
   */
  function hideInsertionIndicator() {
    if (insertionIndicator) {
      insertionIndicator.style.display = 'none';
    }
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
        e.preventDefault(); // Allow drop
        e.dataTransfer.dropEffect = 'move';
        
        this.classList.add('highlight');
        
        // Get insertion point
        const { insertBefore, position } = getInsertionPoint(this, e.clientX, e.clientY);
        
        // Show insertion indicator
        showInsertionIndicator(position.x, position.y);
      });
      
      // Dragleave event - triggered when a dragged item leaves the drop zone
      zone.addEventListener('dragleave', function() {
        this.classList.remove('highlight');
        hideInsertionIndicator();
      });
      
      // Drop event - triggered when an item is dropped into the zone
      zone.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.classList.remove('highlight');
        hideInsertionIndicator();
        
        // Get the dragged item's text
        const draggedText = e.dataTransfer.getData('text/plain');
        
        if (currentDraggedItem) {
          // Get insertion point
          const { insertBefore } = getInsertionPoint(this, e.clientX, e.clientY);
          
          // Move the dragged item to the new location
          if (insertBefore) {
            this.insertBefore(currentDraggedItem, insertBefore);
          } else {
            this.appendChild(currentDraggedItem);
          }
          
          // Remove from original container if it was from a drag-items container
          if (dragStartContainer && dragStartContainer.classList.contains('drag-items')) {
            // Item was moved from options to drop zone, leave it where it is
          }
        }
      });
    });
  }
  
  /**
   * Sets up the submit button
   * 
   * @param {boolean} allowMultipleCorrectOrders - Whether multiple correct orders are valid
   */
  function setupSubmitButton(allowMultipleCorrectOrders) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const submitButton = document.getElementById(`${containerId}-submit`);
    if (!submitButton) return;
    
    submitButton.addEventListener('click', function() {
      checkAnswers(allowMultipleCorrectOrders);
    });
  }
  
  /**
   * Checks the answers and provides feedback
   * 
   * @param {boolean} allowMultipleCorrectOrders - Whether multiple correct orders are valid
   */
  function checkAnswers(allowMultipleCorrectOrders) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    score = 0;
    const dropZones = container.querySelectorAll('.drop-zone');
    
    dropZones.forEach(zone => {
      // UPDATED: Get question ID instead of data-index
      const question = zone.closest('.question');
      if (!question) return;
      
      const questionId = question.id;
      const feedback = question.querySelector('.feedback');
      
      // Get the words from the drop zone
      const droppedItems = Array.from(zone.querySelectorAll('.drag-item'));
      const droppedText = droppedItems.map(item => item.textContent).join(' ');
      
      // Get the correct answer(s)
      let correctAnswer = correctAnswers[questionId];
      
      // Check if the answer is correct
      let isCorrect = false;
      
      if (Array.isArray(correctAnswer)) {
        // Multiple correct answers allowed
        isCorrect = correctAnswer.some(answer => {
          if (allowMultipleCorrectOrders) {
            // Check if all words are present regardless of order
            const droppedWords = droppedText.toLowerCase().split(' ').sort();
            const correctWords = answer.toLowerCase().split(' ').sort();
            return JSON.stringify(droppedWords) === JSON.stringify(correctWords);
          } else {
            // Check exact match
            return droppedText.toLowerCase().trim() === answer.toLowerCase().trim();
          }
        });
      } else {
        // Single correct answer
        if (allowMultipleCorrectOrders) {
          // Check if all words are present regardless of order
          const droppedWords = droppedText.toLowerCase().split(' ').sort();
          const correctWords = correctAnswer.toLowerCase().split(' ').sort();
          isCorrect = JSON.stringify(droppedWords) === JSON.stringify(correctWords);
        } else {
          // Check exact match
          isCorrect = droppedText.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
        }
      }
      
      // Provide feedback
      if (isCorrect) {
        score++;
        zone.style.borderColor = '#2ecc71'; // Green
        zone.style.backgroundColor = 'rgba(46, 204, 113, 0.1)';
        if (feedback) {
          feedback.textContent = '✓ Correct!';
          feedback.className = 'feedback correct';
        }
      } else {
        zone.style.borderColor = '#e74c3c'; // Red
        zone.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
        if (feedback) {
          feedback.textContent = '✗ Try again';
          feedback.className = 'feedback incorrect';
        }
      }
    });
    
    // Update score display
    const scoreDisplay = document.getElementById(`${containerId}-score`);
    if (scoreDisplay) {
      const scoreValue = scoreDisplay.querySelector('span');
      if (scoreValue) {
        scoreValue.textContent = score;
      }
      scoreDisplay.style.display = 'block';
    }
    
    // Show restart button, hide submit button
    const submitButton = document.getElementById(`${containerId}-submit`);
    const restartButton = document.getElementById(`${containerId}-restart`);
    
    if (submitButton) {
      submitButton.style.display = 'none';
    }
    if (restartButton) {
      restartButton.style.display = 'block';
    }
    
    // Save progress
    saveProgress();
    
    // Call onComplete callback if all answers are correct
    if (score === totalQuestions && onCompleteCallback) {
      onCompleteCallback(score, totalQuestions);
    }
  }
  
  /**
   * Sets up the restart button
   */
  function setupRestartButton() {
    const restartButton = document.getElementById(`${containerId}-restart`);
    if (!restartButton) return;
    
    restartButton.addEventListener('click', function() {
      restart();
    });
  }
  
  /**
   * Restarts the activity
   */
  function restart() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const submitButton = document.getElementById(`${containerId}-submit`);
    const restartButton = document.getElementById(`${containerId}-restart`);
    
    // Reset all drop zones
    const dropZones = container.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
      zone.innerHTML = '';
      zone.style.borderColor = 'var(--border-color)';
      zone.style.backgroundColor = 'var(--drop-zone-bg)';
    });
    
    // Clear all feedback
    const feedbacks = container.querySelectorAll('.feedback');
    feedbacks.forEach(feedback => {
      feedback.textContent = '';
      feedback.className = 'feedback';
    });
    
    // Restore original drag items
    restoreDragItems();
    
    // Hide score display
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
    clearProgress();
  }
  
  /**
   * Restores original drag items after restart
   */
  function restoreDragItems() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // For each question, restore the original drag items
    container.querySelectorAll('.question').forEach(question => {
      const questionId = question.id;
      const dragItemsContainer = question.querySelector('.drag-items');
      
      // Skip if no drag items container
      if (!dragItemsContainer) return;
      
      // Clear the drag items container
      dragItemsContainer.innerHTML = '';
      
      // Get the correct answers to recreate original items
      if (correctAnswers[questionId]) {
        let words;
        if (Array.isArray(correctAnswers[questionId])) {
          // Use the first correct answer if there are multiple options
          words = correctAnswers[questionId][0].split(' ');
        } else {
          words = correctAnswers[questionId].split(' ');
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
          setupDragItemEventListeners(item);
          
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
   * UPDATED: Uses storageKey instead of containerId
   */
  function saveProgress() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Save the current state of each drop zone
    const dropZonesState = {};
    
    container.querySelectorAll('.drop-zone').forEach(zone => {
      const question = zone.closest('.question');
      if (!question) return;
      
      const questionId = question.id;
      
      if (questionId) {
        dropZonesState[questionId] = Array.from(zone.querySelectorAll('.drag-item'))
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
    
    // UPDATED: Use storageKey
    localStorage.setItem(`dragdrop-${storageKey}-progress`, JSON.stringify(progressData));
  }
  
  /**
   * Loads progress from localStorage
   * UPDATED: Uses storageKey instead of containerId
   */
  function loadProgress() {
    // UPDATED: Use storageKey
    const progressDataString = localStorage.getItem(`dragdrop-${storageKey}-progress`);
    if (!progressDataString) return;
    
    const progressData = JSON.parse(progressDataString);
    if (!progressData || !progressData.dropZones) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Restore each drop zone
    Object.entries(progressData.dropZones).forEach(([questionId, items]) => {
      const question = container.querySelector(`#${questionId}`);
      if (!question) return;
      
      const zone = question.querySelector('.drop-zone');
      
      if (zone && Array.isArray(items)) {
        // Clear the zone first
        zone.innerHTML = '';
        
        // Add items to the zone in order
        items.forEach(itemText => {
          const item = document.createElement('div');
          item.className = 'drag-item';
          item.textContent = itemText;
          item.setAttribute('draggable', 'true');
          
          // Add event listeners
          setupDragItemEventListeners(item);
          
          zone.appendChild(item);
        });
        
        // Remove these items from the original container
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
   * NEW: Clears progress for the current activity
   */
  function clearProgress() {
    localStorage.removeItem(`dragdrop-${storageKey}-progress`);
  }
  
  /**
   * Sets up touch events for mobile devices
   */
  function setupTouchEvents() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const dragItems = container.querySelectorAll('.drag-item');
    
    dragItems.forEach(item => {
      let touchStartX = 0;
      let touchStartY = 0;
      
      item.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        this.classList.add('dragging');
      });
      
      item.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        
        // Update visual position
        this.style.position = 'fixed';
        this.style.left = `${touch.clientX - 50}px`;
        this.style.top = `${touch.clientY - 20}px`;
        this.style.zIndex = '1000';
      });
      
      item.addEventListener('touchend', function(e) {
        this.classList.remove('dragging');
        this.style.position = '';
        this.style.left = '';
        this.style.top = '';
        this.style.zIndex = '';
        
        // Get the element at the touch point
        const touch = e.changedTouches[0];
        const dropZone = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (dropZone && dropZone.classList.contains('drop-zone')) {
          // Move the item to the drop zone
          dropZone.appendChild(this);
        }
      });
    });
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
    setupDragItemEventListeners(item);
    
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