/**
 * Vocabulary Matching Module
 * Drag and Drop Vocabulary to Images Activity
 * For Travel English Lessons
 * Updated: Carousel with Sticky Word Bank, Multiple Instance Support
 */

const VocabMatchModule = (function() {
  // Store instances for multiple containers
  const instances = {};
  
  /**
   * Creates a new instance for a container
   */
  function createInstance(containerId) {
    return {
      containerId: containerId,
      score: 0,
      totalItems: 0,
      currentPage: 0,
      totalPages: 0,
      onCompleteCallback: null,
      currentDraggedItem: null,
      isChecked: false,
      touchElement: null,
      touchClone: null
    };
  }
  
  /**
   * Initializes the Vocabulary Matching module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the container element
   * @param {Function} config.onComplete - Callback when all items are correctly matched
   */
  function init(config = {}) {
    const containerId = config.containerId || 'vocab-match';
    
    // Create new instance
    const instance = createInstance(containerId);
    instance.onCompleteCallback = config.onComplete || null;
    instances[containerId] = instance;
    
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('VocabMatchModule: Container not found:', containerId);
      return;
    }
    
    // Count total items
    const dropZones = container.querySelectorAll('.vocab-drop-zone');
    instance.totalItems = dropZones.length;
    
    // Set up carousel
    setupCarousel(containerId);
    
    // Set up drag and drop
    setupDragAndDrop(containerId);
    
    // Set up control buttons
    setupControlButtons(containerId);
    
    console.log('VocabMatchModule initialized:', containerId, 'with', instance.totalItems, 'items');
  }
  
  /**
   * Sets up carousel navigation
   */
  function setupCarousel(containerId) {
    const instance = instances[containerId];
    const container = document.getElementById(containerId);
    if (!container || !instance) return;
    
    const pages = container.querySelectorAll('.vocab-carousel-page');
    instance.totalPages = pages.length;
    
    if (instance.totalPages <= 1) return; // No carousel needed
    
    // Set first page as active
    pages.forEach((page, index) => {
      if (index === 0) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });
    
    // Set up navigation buttons
    const prevBtn = container.querySelector('.vocab-carousel-prev');
    const nextBtn = container.querySelector('.vocab-carousel-next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => navigateCarousel(containerId, -1));
      prevBtn.disabled = true; // Disable on first page
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => navigateCarousel(containerId, 1));
      nextBtn.disabled = instance.totalPages <= 1;
    }
    
    // Set up dots
    const dots = container.querySelectorAll('.vocab-carousel-dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToPage(containerId, index));
      if (index === 0) {
        dot.classList.add('active');
      }
    });
    
    // Update indicator
    updateCarouselIndicator(containerId);
    
    // Set initial dot states (all unanswered)
    updatePageDotStates(containerId);
  }
  
  /**
   * Navigates the carousel
   */
  function navigateCarousel(containerId, direction) {
    const instance = instances[containerId];
    if (!instance) return;
    
    const newPage = instance.currentPage + direction;
    
    if (newPage >= 0 && newPage < instance.totalPages) {
      goToPage(containerId, newPage);
    }
  }
  
  /**
   * Goes to a specific page
   */
  function goToPage(containerId, pageIndex) {
    const instance = instances[containerId];
    const container = document.getElementById(containerId);
    if (!container || !instance) return;
    
    const pages = container.querySelectorAll('.vocab-carousel-page');
    const dots = container.querySelectorAll('.vocab-carousel-dot');
    
    // Update pages
    pages.forEach((page, index) => {
      if (index === pageIndex) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });
    
    // Update dots
    dots.forEach((dot, index) => {
      if (index === pageIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    instance.currentPage = pageIndex;
    
    // Update buttons
    const prevBtn = container.querySelector('.vocab-carousel-prev');
    const nextBtn = container.querySelector('.vocab-carousel-next');
    
    if (prevBtn) prevBtn.disabled = pageIndex === 0;
    if (nextBtn) nextBtn.disabled = pageIndex === instance.totalPages - 1;
    
    // Update indicator
    updateCarouselIndicator(containerId);
  }
  
  /**
   * Updates the page indicator text
   */
  function updateCarouselIndicator(containerId) {
    const instance = instances[containerId];
    const container = document.getElementById(containerId);
    if (!container || !instance) return;
    
    const indicator = container.querySelector('.vocab-carousel-indicator');
    if (indicator) {
      indicator.textContent = `${instance.currentPage + 1} / ${instance.totalPages}`;
    }
  }
  
  /**
   * Updates the state of page dots based on completion and correctness
   */
  function updatePageDotStates(containerId) {
    const instance = instances[containerId];
    const container = document.getElementById(containerId);
    if (!container || !instance) return;
    
    const pages = container.querySelectorAll('.vocab-carousel-page');
    const dots = container.querySelectorAll('.vocab-carousel-dot');
    
    pages.forEach((page, index) => {
      const dot = dots[index];
      if (!dot) return;
      
      const dropZones = page.querySelectorAll('.vocab-drop-zone');
      let answeredCount = 0;
      let correctCount = 0;
      let hasBeenChecked = false;
      
      dropZones.forEach(zone => {
        const hasWord = zone.querySelector('.vocab-word-item');
        if (hasWord) answeredCount++;
        
        // Check if answers have been checked
        if (zone.classList.contains('correct')) {
          correctCount++;
          hasBeenChecked = true;
        } else if (zone.classList.contains('incorrect')) {
          hasBeenChecked = true;
        }
      });
      
      const totalZones = dropZones.length;
      const allAnswered = answeredCount === totalZones;
      
      // Remove all state classes
      dot.classList.remove('unanswered', 'complete', 'all-correct', 'has-errors');
      
      if (hasBeenChecked) {
        // After checking answers
        if (correctCount === totalZones) {
          dot.classList.add('all-correct');
        } else {
          dot.classList.add('has-errors');
        }
      } else if (allAnswered) {
        // All answered but not yet checked
        dot.classList.add('complete');
      } else {
        // Missing answers
        dot.classList.add('unanswered');
      }
    });
  }
  
  /**
   * Sets up drag and drop functionality
   */
  function setupDragAndDrop(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Set up word items
    const wordItems = container.querySelectorAll('.vocab-word-item');
    wordItems.forEach(item => {
      setupWordItem(item, containerId);
    });
    
    // Set up drop zones
    const dropZones = container.querySelectorAll('.vocab-drop-zone');
    dropZones.forEach(zone => {
      setupDropZone(zone, containerId);
    });
    
    // Set up word containers (for returning items)
    const wordContainers = container.querySelectorAll('.vocab-words-container');
    wordContainers.forEach(wordContainer => {
      setupWordContainer(wordContainer, containerId);
    });
  }
  
  /**
   * Sets up a draggable word item
   */
  function setupWordItem(item, containerId) {
    const instance = instances[containerId];
    
    item.setAttribute('draggable', 'true');
    
    // Store original container reference
    item.dataset.originalContainer = containerId;
    
    // Drag start
    item.addEventListener('dragstart', function(e) {
      this.classList.add('dragging');
      instance.currentDraggedItem = this;
      e.dataTransfer.setData('text/plain', this.textContent);
      e.dataTransfer.setData('containerId', containerId);
      e.dataTransfer.effectAllowed = 'move';
    });
    
    // Drag end
    item.addEventListener('dragend', function(e) {
      this.classList.remove('dragging');
      instance.currentDraggedItem = null;
      
      // Remove all highlights
      const container = document.getElementById(containerId);
      container.querySelectorAll('.vocab-drop-zone.highlight, .vocab-image-item.highlight').forEach(el => {
        el.classList.remove('highlight');
      });
    });
    
    // Touch support
    item.addEventListener('touchstart', (e) => handleTouchStart(e, containerId), { passive: false });
    item.addEventListener('touchmove', (e) => handleTouchMove(e, containerId), { passive: false });
    item.addEventListener('touchend', (e) => handleTouchEnd(e, containerId), { passive: false });
  }
  
  /**
   * Sets up a drop zone
   */
  function setupDropZone(zone, containerId) {
    const instance = instances[containerId];
    
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
      
      if (!instance.currentDraggedItem) return;
      if (instance.isChecked) return; // Don't allow drops after checking
      
      const draggedItem = instance.currentDraggedItem;
      
      // If drop zone already has an item, return it to word bank
      const existingItem = this.querySelector('.vocab-word-item');
      if (existingItem) {
        returnToWordBank(existingItem, containerId);
      }
      
      // Check if item was in another drop zone
      const previousZone = draggedItem.closest('.vocab-drop-zone');
      if (previousZone) {
        updateDropZoneState(previousZone);
      }
      
      // Move dragged item to this zone
      draggedItem.classList.remove('placed');
      this.appendChild(draggedItem);
      draggedItem.classList.add('placed');
      updateDropZoneState(this);
      
      // Clear correct/incorrect states when items are moved
      this.classList.remove('correct', 'incorrect');
      
      // Update page dot states
      updatePageDotStates(containerId);
    });
  }
  
  /**
   * Sets up word container for returning items
   */
  function setupWordContainer(wordContainer, containerId) {
    const instance = instances[containerId];
    
    wordContainer.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
    
    wordContainer.addEventListener('drop', function(e) {
      e.preventDefault();
      if (!instance.currentDraggedItem) return;
      if (instance.isChecked) return;
      
      const draggedItem = instance.currentDraggedItem;
      
      // Clear the drop zone state where item came from
      const previousZone = draggedItem.closest('.vocab-drop-zone');
      
      // Return item to this container
      draggedItem.classList.remove('placed');
      this.appendChild(draggedItem);
      
      if (previousZone) {
        updateDropZoneState(previousZone);
      }
      
      // Update page dot states
      updatePageDotStates(containerId);
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
   * Returns an item to the word bank
   */
  function returnToWordBank(item, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const wordBank = container.querySelector('.vocab-words-container');
    if (wordBank) {
      item.classList.remove('placed');
      wordBank.appendChild(item);
    }
  }
  
  /**
   * Touch event handlers for mobile support
   */
  function handleTouchStart(e, containerId) {
    const instance = instances[containerId];
    if (instance.isChecked) return;
    
    const touch = e.touches[0];
    instance.touchElement = e.target.closest('.vocab-word-item');
    
    if (!instance.touchElement) return;
    
    e.preventDefault();
    instance.touchElement.classList.add('dragging');
    instance.currentDraggedItem = instance.touchElement;
    
    // Create visual clone for dragging
    instance.touchClone = instance.touchElement.cloneNode(true);
    instance.touchClone.style.position = 'fixed';
    instance.touchClone.style.pointerEvents = 'none';
    instance.touchClone.style.zIndex = '10000';
    instance.touchClone.style.opacity = '0.8';
    instance.touchClone.style.transform = 'scale(1.1)';
    document.body.appendChild(instance.touchClone);
    
    positionClone(touch, instance);
  }
  
  function handleTouchMove(e, containerId) {
    const instance = instances[containerId];
    if (!instance.touchElement || !instance.touchClone) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    positionClone(touch, instance);
    
    // Highlight drop zone under touch
    const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementUnder?.closest('.vocab-drop-zone');
    
    // Remove all highlights first
    const container = document.getElementById(containerId);
    container.querySelectorAll('.vocab-drop-zone.highlight, .vocab-image-item.highlight').forEach(el => {
      el.classList.remove('highlight');
    });
    
    // Add highlight to current zone
    if (dropZone && !dropZone.contains(instance.touchElement)) {
      dropZone.classList.add('highlight');
      dropZone.closest('.vocab-image-item')?.classList.add('highlight');
    }
  }
  
  function handleTouchEnd(e, containerId) {
    const instance = instances[containerId];
    if (!instance.touchElement) return;
    e.preventDefault();
    
    const touch = e.changedTouches[0];
    const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementUnder?.closest('.vocab-drop-zone');
    const wordContainer = elementUnder?.closest('.vocab-words-container');
    
    // Remove clone
    if (instance.touchClone) {
      instance.touchClone.remove();
      instance.touchClone = null;
    }
    
    const container = document.getElementById(containerId);
    
    // Handle drop
    if (dropZone && dropZone.closest(`#${containerId}`) && !dropZone.contains(instance.touchElement)) {
      // If zone has existing item, return it
      const existingItem = dropZone.querySelector('.vocab-word-item');
      if (existingItem) {
        returnToWordBank(existingItem, containerId);
      }
      
      // Check if item was in another drop zone
      const previousZone = instance.touchElement.closest('.vocab-drop-zone');
      if (previousZone) {
        updateDropZoneState(previousZone);
      }
      
      instance.touchElement.classList.remove('placed');
      dropZone.appendChild(instance.touchElement);
      instance.touchElement.classList.add('placed');
      updateDropZoneState(dropZone);
      dropZone.classList.remove('correct', 'incorrect');
      
      // Update page dot states
      updatePageDotStates(containerId);
    } else if (wordContainer && wordContainer.closest(`#${containerId}`)) {
      // Return to word bank
      const previousZone = instance.touchElement.closest('.vocab-drop-zone');
      instance.touchElement.classList.remove('placed');
      wordContainer.appendChild(instance.touchElement);
      if (previousZone) {
        updateDropZoneState(previousZone);
      }
      
      // Update page dot states
      updatePageDotStates(containerId);
    }
    
    // Cleanup
    instance.touchElement.classList.remove('dragging');
    instance.touchElement = null;
    instance.currentDraggedItem = null;
    
    // Remove all highlights
    container.querySelectorAll('.vocab-drop-zone.highlight, .vocab-image-item.highlight').forEach(el => {
      el.classList.remove('highlight');
    });
  }
  
  function positionClone(touch, instance) {
    if (instance.touchClone) {
      instance.touchClone.style.left = (touch.clientX - 50) + 'px';
      instance.touchClone.style.top = (touch.clientY - 25) + 'px';
    }
  }
  
  /**
   * Sets up control buttons
   */
  function setupControlButtons(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const checkBtn = container.querySelector('.vocab-check-btn');
    const resetBtn = container.querySelector('.vocab-reset-btn');
    
    if (checkBtn) {
      checkBtn.addEventListener('click', () => checkAnswers(containerId));
    }
    
    if (resetBtn) {
      resetBtn.addEventListener('click', () => resetActivity(containerId));
    }
  }
  
  /**
   * Checks all answers
   */
  function checkAnswers(containerId) {
    const instance = instances[containerId];
    const container = document.getElementById(containerId);
    if (!container || !instance) return;
    
    instance.score = 0;
    instance.isChecked = true;
    
    const dropZones = container.querySelectorAll('.vocab-drop-zone');
    
    dropZones.forEach(zone => {
      const correctAnswer = zone.getAttribute('data-answer').toLowerCase().trim();
      const wordItem = zone.querySelector('.vocab-word-item');
      
      if (wordItem) {
        const userAnswer = wordItem.textContent.toLowerCase().trim();
        
        if (userAnswer === correctAnswer) {
          zone.classList.add('correct');
          zone.classList.remove('incorrect');
          instance.score++;
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
      scoreDisplay.querySelector('span').textContent = instance.score;
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
      if (instance.score === instance.totalItems) {
        feedback.textContent = '🎉 Excellent! You got all the words correct!';
        feedback.className = 'vocab-feedback show success';
      } else if (instance.score >= instance.totalItems * 0.7) {
        feedback.textContent = '👍 Good job! Review the words you missed and try again.';
        feedback.className = 'vocab-feedback show success';
      } else {
        feedback.textContent = '📚 Keep practising! Match the words to learn them better.';
        feedback.className = 'vocab-feedback show error';
      }
    }
    
    // Callback
    if (instance.score === instance.totalItems && typeof instance.onCompleteCallback === 'function') {
      instance.onCompleteCallback(instance.score, instance.totalItems);
    }
    
    // Update page dot states to show correct/incorrect
    updatePageDotStates(containerId);
  }
  
  /**
   * Resets the activity
   */
  function resetActivity(containerId) {
    const instance = instances[containerId];
    const container = document.getElementById(containerId);
    if (!container || !instance) return;
    
    instance.isChecked = false;
    instance.score = 0;
    
    // Return all words to word bank
    const wordBank = container.querySelector('.vocab-words-container');
    const wordItems = container.querySelectorAll('.vocab-drop-zone .vocab-word-item');
    
    wordItems.forEach(item => {
      item.classList.remove('placed');
      wordBank.appendChild(item);
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
    
    // Reset to first page
    goToPage(containerId, 0);
    
    // Reset page dot states
    updatePageDotStates(containerId);
  }
  
  /**
   * Gets current score for a container
   */
  function getScore(containerId) {
    const instance = instances[containerId || Object.keys(instances)[0]];
    if (!instance) return { score: 0, total: 0, percentage: 0 };
    
    return {
      score: instance.score,
      total: instance.totalItems,
      percentage: instance.totalItems > 0 ? Math.round((instance.score / instance.totalItems) * 100) : 0
    };
  }
  
  // Public API
  return {
    init: init,
    checkAnswers: checkAnswers,
    resetActivity: resetActivity,
    getScore: getScore,
    goToPage: goToPage
  };
})();

// Export for module systems
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = VocabMatchModule;
}
