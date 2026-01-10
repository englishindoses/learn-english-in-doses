/**
 * Vocabulary Matching Module
 * Drag and Drop Vocabulary to Images Activity
 * For Travel English Lessons
 */

const VocabMatchModule = (function() {
  // Private variables
  let score = 0;
  let totalItems = 0;
  let containerId = 'vocab-match';
  let onCompleteCallback = null;
  let currentDraggedItem = null;
  let isChecked = false;
  
  /**
   * Initializes the Vocabulary Matching module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the container element
   * @param {Function} config.onComplete - Callback when all items are correctly matched
   */
  function init(config = {}) {
    containerId = config.containerId || 'vocab-match';
    onCompleteCallback = config.onComplete || null;
    
    // Reset state
    score = 0;
    isChecked = false;
    
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('VocabMatchModule: Container not found:', containerId);
      return;
    }
    
    // Count total items
    const dropZones = container.querySelectorAll('.vocab-drop-zone');
    totalItems = dropZones.length;
    
    // Set up drag and drop
    setupDragAndDrop();
    
    // Set up control buttons
    setupControlButtons();
    
    console.log('VocabMatchModule initialized with', totalItems, 'items');
  }
  
  /**
   * Sets up drag and drop functionality
   */
  function setupDragAndDrop() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Set up word items
    const wordItems = container.querySelectorAll('.vocab-word-item');
    wordItems.forEach(item => {
      setupWordItem(item);
    });
    
    // Set up drop zones
    const dropZones = container.querySelectorAll('.vocab-drop-zone');
    dropZones.forEach(zone => {
      setupDropZone(zone);
    });
    
    // Set up word containers (for returning items)
    const wordContainers = container.querySelectorAll('.vocab-words-container');
    wordContainers.forEach(container => {
      setupWordContainer(container);
    });
  }
  
  /**
   * Sets up a draggable word item
   */
  function setupWordItem(item) {
    item.setAttribute('draggable', 'true');
    
    // Drag start
    item.addEventListener('dragstart', function(e) {
      this.classList.add('dragging');
      currentDraggedItem = this;
      e.dataTransfer.setData('text/plain', this.textContent);
      e.dataTransfer.effectAllowed = 'move';
    });
    
    // Drag end
    item.addEventListener('dragend', function(e) {
      this.classList.remove('dragging');
      currentDraggedItem = null;
      
      // Remove all highlights
      document.querySelectorAll('.vocab-drop-zone.highlight, .vocab-image-item.highlight').forEach(el => {
        el.classList.remove('highlight');
      });
    });
    
    // Touch support
    item.addEventListener('touchstart', handleTouchStart, { passive: false });
    item.addEventListener('touchmove', handleTouchMove, { passive: false });
    item.addEventListener('touchend', handleTouchEnd, { passive: false });
  }
  
  /**
   * Sets up a drop zone
   */
  function setupDropZone(zone) {
    // Check if empty and add class
    updateDropZoneState(zone);
    
    zone.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      this.classList.add('highlight');
      this.closest('.vocab-image-item')?.classList.add('highlight');
    });
    
    zone.addEventListener('dragleave', function(e) {
      this.classList.remove('highlight');
      this.closest('.vocab-image-item')?.classList.remove('highlight');
    });
    
    zone.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('highlight');
      this.closest('.vocab-image-item')?.classList.remove('highlight');
      
      if (!currentDraggedItem) return;
      if (isChecked) return; // Don't allow drops after checking
      
      // If drop zone already has an item, return it to container
      const existingItem = this.querySelector('.vocab-word-item');
      if (existingItem) {
        returnToContainer(existingItem);
      }
      
      // Move dragged item to this zone
      this.appendChild(currentDraggedItem);
      updateDropZoneState(this);
      
      // Clear correct/incorrect states when items are moved
      this.classList.remove('correct', 'incorrect');
    });
  }
  
  /**
   * Sets up word container for returning items
   */
  function setupWordContainer(container) {
    container.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
    
    container.addEventListener('drop', function(e) {
      e.preventDefault();
      if (!currentDraggedItem) return;
      if (isChecked) return;
      
      // Return item to this container
      this.appendChild(currentDraggedItem);
      
      // Clear the drop zone state where item came from
      const previousZone = currentDraggedItem.closest('.vocab-drop-zone');
      if (previousZone) {
        updateDropZoneState(previousZone);
      }
    });
  }
  
  /**
   * Updates drop zone empty state
   */
  function updateDropZoneState(zone) {
    if (zone.querySelector('.vocab-word-item')) {
      zone.classList.remove('empty');
    } else {
      zone.classList.add('empty');
    }
  }
  
  /**
   * Returns an item to its section's word container
   */
  function returnToContainer(item) {
    const section = item.closest('.vocab-section');
    if (section) {
      const container = section.querySelector('.vocab-words-container');
      if (container) {
        container.appendChild(item);
      }
    }
  }
  
  /**
   * Touch event handlers for mobile support
   */
  let touchStartX, touchStartY, touchElement, touchClone;
  
  function handleTouchStart(e) {
    if (isChecked) return;
    
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchElement = e.target.closest('.vocab-word-item');
    
    if (!touchElement) return;
    
    e.preventDefault();
    touchElement.classList.add('dragging');
    currentDraggedItem = touchElement;
    
    // Create visual clone for dragging
    touchClone = touchElement.cloneNode(true);
    touchClone.style.position = 'fixed';
    touchClone.style.pointerEvents = 'none';
    touchClone.style.zIndex = '10000';
    touchClone.style.opacity = '0.8';
    touchClone.style.transform = 'scale(1.1)';
    document.body.appendChild(touchClone);
    
    positionClone(touch);
  }
  
  function handleTouchMove(e) {
    if (!touchElement || !touchClone) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    positionClone(touch);
    
    // Highlight drop zone under touch
    const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementUnder?.closest('.vocab-drop-zone');
    
    // Remove all highlights first
    document.querySelectorAll('.vocab-drop-zone.highlight, .vocab-image-item.highlight').forEach(el => {
      el.classList.remove('highlight');
    });
    
    // Add highlight to current zone
    if (dropZone && !dropZone.contains(touchElement)) {
      dropZone.classList.add('highlight');
      dropZone.closest('.vocab-image-item')?.classList.add('highlight');
    }
  }
  
  function handleTouchEnd(e) {
    if (!touchElement) return;
    e.preventDefault();
    
    const touch = e.changedTouches[0];
    const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementUnder?.closest('.vocab-drop-zone');
    const wordContainer = elementUnder?.closest('.vocab-words-container');
    
    // Remove clone
    if (touchClone) {
      touchClone.remove();
      touchClone = null;
    }
    
    // Handle drop
    if (dropZone && !dropZone.contains(touchElement)) {
      // If zone has existing item, return it
      const existingItem = dropZone.querySelector('.vocab-word-item');
      if (existingItem) {
        returnToContainer(existingItem);
      }
      
      dropZone.appendChild(touchElement);
      updateDropZoneState(dropZone);
      dropZone.classList.remove('correct', 'incorrect');
    } else if (wordContainer) {
      // Return to container
      wordContainer.appendChild(touchElement);
      const previousZone = touchElement.closest('.vocab-drop-zone');
      if (previousZone) {
        updateDropZoneState(previousZone);
      }
    }
    
    // Cleanup
    touchElement.classList.remove('dragging');
    touchElement = null;
    currentDraggedItem = null;
    
    // Remove all highlights
    document.querySelectorAll('.vocab-drop-zone.highlight, .vocab-image-item.highlight').forEach(el => {
      el.classList.remove('highlight');
    });
  }
  
  function positionClone(touch) {
    if (touchClone) {
      touchClone.style.left = (touch.clientX - 50) + 'px';
      touchClone.style.top = (touch.clientY - 25) + 'px';
    }
  }
  
  /**
   * Sets up control buttons
   */
  function setupControlButtons() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const checkBtn = container.querySelector('.vocab-check-btn');
    const resetBtn = container.querySelector('.vocab-reset-btn');
    
    if (checkBtn) {
      checkBtn.addEventListener('click', checkAnswers);
    }
    
    if (resetBtn) {
      resetBtn.addEventListener('click', resetActivity);
    }
  }
  
  /**
   * Checks all answers
   */
  function checkAnswers() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    score = 0;
    isChecked = true;
    
    const dropZones = container.querySelectorAll('.vocab-drop-zone');
    
    dropZones.forEach(zone => {
      const correctAnswer = zone.getAttribute('data-answer').toLowerCase().trim();
      const wordItem = zone.querySelector('.vocab-word-item');
      
      if (wordItem) {
        const userAnswer = wordItem.textContent.toLowerCase().trim();
        
        if (userAnswer === correctAnswer) {
          zone.classList.add('correct');
          zone.classList.remove('incorrect');
          score++;
        } else {
          zone.classList.add('incorrect');
          zone.classList.remove('correct');
        }
      } else {
        zone.classList.add('incorrect');
        zone.classList.remove('correct');
      }
    });
    
    // Show score
    const scoreDisplay = container.querySelector('.vocab-score');
    if (scoreDisplay) {
      scoreDisplay.querySelector('span').textContent = score;
      scoreDisplay.classList.add('show');
    }
    
    // Show/hide buttons
    const checkBtn = container.querySelector('.vocab-check-btn');
    const resetBtn = container.querySelector('.vocab-reset-btn');
    
    if (checkBtn) checkBtn.style.display = 'none';
    if (resetBtn) resetBtn.style.display = 'inline-block';
    
    // Show feedback
    const feedback = container.querySelector('.vocab-feedback');
    if (feedback) {
      if (score === totalItems) {
        feedback.textContent = '🎉 Excellent! You got all the words correct!';
        feedback.className = 'vocab-feedback show success';
      } else if (score >= totalItems * 0.7) {
        feedback.textContent = '👍 Good job! Review the words you missed and try again.';
        feedback.className = 'vocab-feedback show success';
      } else {
        feedback.textContent = '📚 Keep practising! Match the words to learn them better.';
        feedback.className = 'vocab-feedback show error';
      }
    }
    
    // Callback
    if (score === totalItems && typeof onCompleteCallback === 'function') {
      onCompleteCallback(score, totalItems);
    }
  }
  
  /**
   * Resets the activity
   */
  function resetActivity() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    isChecked = false;
    score = 0;
    
    // Return all words to their containers
    const sections = container.querySelectorAll('.vocab-section');
    sections.forEach(section => {
      const wordContainer = section.querySelector('.vocab-words-container');
      const wordItems = section.querySelectorAll('.vocab-drop-zone .vocab-word-item');
      
      wordItems.forEach(item => {
        wordContainer.appendChild(item);
      });
    });
    
    // Clear drop zone states
    const dropZones = container.querySelectorAll('.vocab-drop-zone');
    dropZones.forEach(zone => {
      zone.classList.remove('correct', 'incorrect');
      zone.classList.add('empty');
    });
    
    // Hide score
    const scoreDisplay = container.querySelector('.vocab-score');
    if (scoreDisplay) {
      scoreDisplay.classList.remove('show');
    }
    
    // Hide feedback
    const feedback = container.querySelector('.vocab-feedback');
    if (feedback) {
      feedback.classList.remove('show');
    }
    
    // Show/hide buttons
    const checkBtn = container.querySelector('.vocab-check-btn');
    const resetBtn = container.querySelector('.vocab-reset-btn');
    
    if (checkBtn) checkBtn.style.display = 'inline-block';
    if (resetBtn) resetBtn.style.display = 'none';
  }
  
  /**
   * Gets current score
   */
  function getScore() {
    return {
      score: score,
      total: totalItems,
      percentage: totalItems > 0 ? Math.round((score / totalItems) * 100) : 0
    };
  }
  
  // Public API
  return {
    init: init,
    checkAnswers: checkAnswers,
    resetActivity: resetActivity,
    getScore: getScore
  };
})();

// Export for module systems
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = VocabMatchModule;
}
