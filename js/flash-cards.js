/**
 * Flashcard Module
 * Turnable Cards for Key Phrases
 * For Travel English Lessons
 */

const FlashcardModule = (function() {
  // Private variables
  let containerId = 'flashcards';
  let allFlipped = false;
  
  /**
   * Initializes the Flashcard module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the container element
   */
  function init(config = {}) {
    containerId = config.containerId || 'flashcards';
    
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('FlashcardModule: Container not found:', containerId);
      return;
    }
    
    // Set up card click handlers
    setupCards();
    
    // Set up flip all button
    setupFlipAllButton();
    
    // Set up keyboard navigation
    setupKeyboardNav();
    
    console.log('FlashcardModule initialized');
  }
  
  /**
   * Sets up individual card click handlers
   */
  function setupCards() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const cards = container.querySelectorAll('.flashcard');
    
    cards.forEach((card, index) => {
      // Click to flip
      card.addEventListener('click', function(e) {
        flipCard(this);
      });
      
      // Keyboard accessibility
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Flashcard ${index + 1}. Press Enter or Space to flip.`);
      
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          flipCard(this);
        }
      });
    });
  }
  
  /**
   * Flips a single card
   */
  function flipCard(card) {
    card.classList.toggle('flipped');
    
    // Update aria-label based on state
    const isFlipped = card.classList.contains('flipped');
    const currentLabel = card.getAttribute('aria-label');
    const newLabel = isFlipped ? 
      currentLabel.replace('Press Enter or Space to flip.', 'Showing example. Press Enter or Space to flip back.') :
      currentLabel.replace('Showing example. Press Enter or Space to flip back.', 'Press Enter or Space to flip.');
    card.setAttribute('aria-label', newLabel);
    
    // Update progress dots if they exist
    updateProgressDots();
  }
  
  /**
   * Sets up the flip all button
   */
  function setupFlipAllButton() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const flipAllBtn = container.querySelector('.flip-all-btn');
    if (!flipAllBtn) return;
    
    flipAllBtn.addEventListener('click', function() {
      flipAllCards();
    });
  }
  
  /**
   * Flips all cards
   */
  function flipAllCards() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const cards = container.querySelectorAll('.flashcard');
    allFlipped = !allFlipped;
    
    cards.forEach((card, index) => {
      // Stagger the flip animation
      setTimeout(() => {
        if (allFlipped) {
          card.classList.add('flipped');
        } else {
          card.classList.remove('flipped');
        }
      }, index * 100);
    });
    
    // Update button text
    const flipAllBtn = container.querySelector('.flip-all-btn');
    if (flipAllBtn) {
      const newText = allFlipped ? '🔄 Flip All Back' : '🔄 Flip All Cards';
      flipAllBtn.innerHTML = `<span class="icon">🔄</span> ${allFlipped ? 'Flip All Back' : 'Show All Examples'}`;
    }
    
    updateProgressDots();
  }
  
  /**
   * Sets up keyboard navigation between cards
   */
  function setupKeyboardNav() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const cards = container.querySelectorAll('.flashcard');
    
    cards.forEach((card, index) => {
      card.addEventListener('keydown', function(e) {
        let targetIndex = -1;
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          targetIndex = (index + 1) % cards.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          targetIndex = (index - 1 + cards.length) % cards.length;
        }
        
        if (targetIndex !== -1) {
          e.preventDefault();
          cards[targetIndex].focus();
        }
      });
    });
  }
  
  /**
   * Updates progress dots based on flipped state
   */
  function updateProgressDots() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const cards = container.querySelectorAll('.flashcard');
    const dots = container.querySelectorAll('.flashcard-dot');
    
    if (dots.length === 0) return;
    
    cards.forEach((card, index) => {
      if (dots[index]) {
        if (card.classList.contains('flipped')) {
          dots[index].classList.add('active');
        } else {
          dots[index].classList.remove('active');
        }
      }
    });
  }
  
  /**
   * Gets the count of flipped cards
   */
  function getFlippedCount() {
    const container = document.getElementById(containerId);
    if (!container) return { flipped: 0, total: 0 };
    
    const cards = container.querySelectorAll('.flashcard');
    const flippedCards = container.querySelectorAll('.flashcard.flipped');
    
    return {
      flipped: flippedCards.length,
      total: cards.length
    };
  }
  
  /**
   * Resets all cards to front side
   */
  function resetCards() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const cards = container.querySelectorAll('.flashcard');
    cards.forEach(card => {
      card.classList.remove('flipped');
    });
    
    allFlipped = false;
    
    // Update button text
    const flipAllBtn = container.querySelector('.flip-all-btn');
    if (flipAllBtn) {
      flipAllBtn.innerHTML = '<span class="icon">🔄</span> Show All Examples';
    }
    
    updateProgressDots();
  }
  
  // Public API
  return {
    init: init,
    flipCard: flipCard,
    flipAllCards: flipAllCards,
    resetCards: resetCards,
    getFlippedCount: getFlippedCount
  };
})();

// Export for module systems
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = FlashcardModule;
}
