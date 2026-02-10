/* ===== Compact Matching Activity Module ===== */
/* 3-column layout with draggable number markers */
/* Supports: drag & drop, tap-tap selection, tap to undo */
/* Adapted for English in Doses website */

const CompactMatchingModule = (function() {
  'use strict';
  
  // State management
  let selectedMarker = null;
  let draggedMarker = null;
  let activities = {};
  
  // Touch support variables
  let touchClone = null;
  let currentDropTarget = null;
  
  // Configuration
  let config = {
    onComplete: null,
    storageKey: 'compact-matching'
  };
  
  // ===== Public Methods =====
  
  /**
   * Initialize the Compact Matching Module
   * @param {Object} options - Configuration options
   * @param {string} options.containerId - ID of the activity container
   * @param {string} options.storageKey - Key for localStorage
   * @param {Function} options.onComplete - Callback when activity is completed
   */
  function init(options) {
    if (options) {
      config = { ...config, ...options };
    }
    
    const activityElements = document.querySelectorAll('.compact-matching');
    
    if (activityElements.length === 0) {
      console.log('CompactMatchingModule: No activities found');
      return;
    }
    
    console.log(`CompactMatchingModule: Found ${activityElements.length} activities`);
    
    activityElements.forEach(activity => {
      initActivity(activity);
      activities[activity.id] = {
        element: activity,
        checked: false,
        score: 0
      };
    });
    
    // Set up button listeners
    setupButtonListeners();
  }
  
  // ===== Private Methods =====
  
  function initActivity(activity) {
    const markers = activity.querySelectorAll('.cm-marker');
    const answers = activity.querySelectorAll('.cm-answer');
    const slots = activity.querySelectorAll('.cm-answer-slot');
    
    // Initialize markers
    markers.forEach(marker => {
      // Drag events
      marker.addEventListener('dragstart', handleDragStart);
      marker.addEventListener('dragend', handleDragEnd);
      
      // Click/tap for tap-tap mode
      marker.addEventListener('click', handleMarkerClick);
      
      // Touch events for mobile drag
      marker.addEventListener('touchstart', handleTouchStart, { passive: false });
      marker.addEventListener('touchmove', handleTouchMove, { passive: false });
      marker.addEventListener('touchend', handleTouchEnd);
    });
    
    // Initialize answer areas as drop targets
    answers.forEach(answer => {
      answer.addEventListener('dragover', handleDragOver);
      answer.addEventListener('dragleave', handleDragLeave);
      answer.addEventListener('drop', handleDrop);
      
      // Click for tap-tap mode
      answer.addEventListener('click', handleAnswerClick);
    });
    
    // Initialize slots for returning markers
    slots.forEach(slot => {
      slot.addEventListener('click', handleSlotClick);
    });
  }
  
  function setupButtonListeners() {
    // Check buttons
    document.querySelectorAll('[id$="-cm-submit"], .cm-submit-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const activityId = this.dataset.activity || this.id.replace('-cm-submit', '');
        checkActivity(activityId);
      });
    });
    
    // Restart buttons
    document.querySelectorAll('[id$="-cm-restart"], .cm-restart-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const activityId = this.dataset.activity || this.id.replace('-cm-restart', '');
        resetActivity(activityId);
      });
    });
  }
  
  // ===== Drag & Drop Handlers =====
  
  function handleDragStart(e) {
    // Don't drag if marker is in an answer slot
    if (this.parentElement.classList.contains('cm-answer-slot')) {
      e.preventDefault();
      return;
    }
    
    draggedMarker = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.match);
    
    // Clear any tap-tap selection
    clearSelection();
    
    setTimeout(() => {
      this.style.opacity = '0.4';
    }, 0);
  }
  
  function handleDragEnd(e) {
    this.classList.remove('dragging');
    this.style.opacity = '1';
    
    // Clear all drag-over states
    document.querySelectorAll('.cm-answer').forEach(answer => {
      answer.classList.remove('drag-over');
    });
    
    draggedMarker = null;
  }
  
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const answer = e.target.closest('.cm-answer');
    if (answer) {
      // Only allow drop if slot is empty
      const slot = answer.querySelector('.cm-answer-slot');
      if (slot && !slot.querySelector('.cm-marker')) {
        answer.classList.add('drag-over');
      }
    }
  }
  
  function handleDragLeave(e) {
    const answer = e.target.closest('.cm-answer');
    if (answer) {
      answer.classList.remove('drag-over');
    }
  }
  
  function handleDrop(e) {
    e.preventDefault();
    
    const answer = e.target.closest('.cm-answer');
    if (!answer || !draggedMarker) return;
    
    answer.classList.remove('drag-over');
    
    const slot = answer.querySelector('.cm-answer-slot');
    if (!slot) return;
    
    // Check if slot already has a marker
    const existingMarker = slot.querySelector('.cm-marker');
    if (existingMarker) {
      // Return existing marker to bank
      returnMarkerToBank(existingMarker);
    }
    
    // Place the dragged marker
    placeMarkerInSlot(draggedMarker, slot);
    
    // Clear states
    draggedMarker.classList.remove('dragging');
    draggedMarker.style.opacity = '1';
    draggedMarker = null;
  }
  
  // ===== Tap-Tap Handlers =====
  
  function handleMarkerClick(e) {
    e.stopPropagation();
    
    const marker = e.target.closest('.cm-marker');
    if (!marker) return;
    
    // If marker is in an answer slot, return it to bank
    if (marker.parentElement.classList.contains('cm-answer-slot')) {
      const activity = marker.closest('.compact-matching');
      returnMarkerToBank(marker);
      
      // Clear correct/incorrect styling when marker is removed
      const answer = marker.closest('.cm-answer');
      if (answer) {
        answer.classList.remove('correct', 'incorrect');
      }
      marker.classList.remove('correct', 'incorrect');
      return;
    }
    
    // If marker is in the bank (cm-marker-slot), toggle selection
    if (marker.parentElement.classList.contains('cm-marker-slot')) {
      if (selectedMarker === marker) {
        // Deselect
        clearSelection();
      } else {
        // Select this marker
        clearSelection();
        selectedMarker = marker;
        marker.classList.add('selected');
      }
    }
  }
  
  function handleAnswerClick(e) {
    // Don't handle if clicking on a marker in the slot
    if (e.target.closest('.cm-marker')) return;
    
    const answer = e.target.closest('.cm-answer');
    if (!answer || !selectedMarker) return;
    
    const slot = answer.querySelector('.cm-answer-slot');
    if (!slot) return;
    
    // Check if slot already has a marker
    const existingMarker = slot.querySelector('.cm-marker');
    if (existingMarker) {
      // Return existing marker to bank
      returnMarkerToBank(existingMarker);
    }
    
    // Place selected marker
    placeMarkerInSlot(selectedMarker, slot);
    
    // Clear selection
    clearSelection();
  }
  
  function handleSlotClick(e) {
    const slot = e.target.closest('.cm-answer-slot');
    if (!slot) return;
    
    const marker = slot.querySelector('.cm-marker');
    if (marker) {
      returnMarkerToBank(marker);
      
      // Clear styling
      const answer = slot.closest('.cm-answer');
      if (answer) {
        answer.classList.remove('correct', 'incorrect');
      }
      marker.classList.remove('correct', 'incorrect');
    } else if (selectedMarker) {
      // Place selected marker in empty slot
      placeMarkerInSlot(selectedMarker, slot);
      clearSelection();
    }
  }
  
  // ===== Touch Handlers (Mobile Drag) =====
  
  function handleTouchStart(e) {
    const marker = e.target.closest('.cm-marker');
    if (!marker) return;
    
    // If marker is in answer slot, handle as click (return to bank)
    if (marker.parentElement.classList.contains('cm-answer-slot')) {
      return; // Let the click handler deal with it
    }
    
    // Only allow dragging from bank slots
    if (!marker.parentElement.classList.contains('cm-marker-slot')) {
      return;
    }
    
    e.preventDefault();
    draggedMarker = marker;
    marker.classList.add('dragging');
    
    const touch = e.touches[0];
    
    // Create visual clone
    touchClone = document.createElement('div');
    touchClone.className = 'cm-marker-clone';
    touchClone.textContent = marker.textContent;
    touchClone.style.left = (touch.clientX - 16) + 'px';
    touchClone.style.top = (touch.clientY - 16) + 'px';
    document.body.appendChild(touchClone);
    
    // Dim original
    marker.style.opacity = '0.4';
  }
  
  function handleTouchMove(e) {
    if (!draggedMarker || !touchClone) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    
    // Update clone position
    touchClone.style.left = (touch.clientX - 16) + 'px';
    touchClone.style.top = (touch.clientY - 16) + 'px';
    
    // Find element under touch point
    touchClone.style.display = 'none';
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    touchClone.style.display = 'flex';
    
    // Clear previous drag-over states
    document.querySelectorAll('.cm-answer').forEach(answer => {
      answer.classList.remove('drag-over');
    });
    
    if (elementBelow) {
      const answer = elementBelow.closest('.cm-answer');
      if (answer) {
        const slot = answer.querySelector('.cm-answer-slot');
        if (slot && !slot.querySelector('.cm-marker')) {
          answer.classList.add('drag-over');
          currentDropTarget = answer;
        } else {
          currentDropTarget = null;
        }
      } else {
        currentDropTarget = null;
      }
    }
  }
  
  function handleTouchEnd(e) {
    if (!draggedMarker) return;
    
    // Clean up clone
    if (touchClone && touchClone.parentNode) {
      touchClone.parentNode.removeChild(touchClone);
    }
    touchClone = null;
    
    // Handle drop if we have a valid target
    if (currentDropTarget) {
      const slot = currentDropTarget.querySelector('.cm-answer-slot');
      if (slot) {
        const existingMarker = slot.querySelector('.cm-marker');
        if (existingMarker) {
          returnMarkerToBank(existingMarker);
        }
        placeMarkerInSlot(draggedMarker, slot);
      }
    }
    
    // Clean up
    draggedMarker.classList.remove('dragging');
    draggedMarker.style.opacity = '1';
    
    document.querySelectorAll('.cm-answer').forEach(answer => {
      answer.classList.remove('drag-over');
    });
    
    draggedMarker = null;
    currentDropTarget = null;
  }
  
  // ===== Utility Functions =====
  
  function clearSelection() {
    if (selectedMarker) {
      selectedMarker.classList.remove('selected');
      selectedMarker = null;
    }
  }
  
  function placeMarkerInSlot(marker, slot) {
    // Remove draggable when in slot
    marker.removeAttribute('draggable');
    marker.classList.remove('selected', 'dragging');
    marker.style.opacity = '1';
    
    // Move marker to slot
    slot.appendChild(marker);
  }
  
  function returnMarkerToBank(marker) {
    const activity = marker.closest('.compact-matching');
    const markerNum = marker.dataset.match;
    
    // Find the original slot for this marker
    const originalSlot = activity.querySelector(`.cm-marker-slot[data-marker="${markerNum}"]`);
    
    // Restore draggable
    marker.setAttribute('draggable', 'true');
    marker.classList.remove('correct', 'incorrect');
    
    // Clear answer styling
    const answer = marker.closest('.cm-answer');
    if (answer) {
      answer.classList.remove('correct', 'incorrect');
    }
    
    // Return to original slot
    if (originalSlot) {
      originalSlot.appendChild(marker);
    }
  }
  
  // ===== Check & Reset Functions =====
  
  function checkActivity(activityId) {
    const activity = document.getElementById(activityId);
    if (!activity) {
      console.error('CompactMatchingModule: Activity not found:', activityId);
      return;
    }
    
    const answers = activity.querySelectorAll('.cm-answer');
    const feedbackEl = document.getElementById(activityId + '-feedback') || 
                       activity.querySelector('.cm-feedback');
    const scoreEl = document.getElementById(activityId + '-score') ||
                    activity.querySelector('.cm-score');
    const submitBtn = document.getElementById(activityId + '-cm-submit') ||
                      activity.querySelector('.cm-submit-btn');
    const restartBtn = document.getElementById(activityId + '-cm-restart') ||
                       activity.querySelector('.cm-restart-btn');
    
    let correct = 0;
    let answered = 0;
    const total = answers.length;
    
    answers.forEach(answer => {
      const expectedMatch = answer.dataset.match;
      const slot = answer.querySelector('.cm-answer-slot');
      const marker = slot ? slot.querySelector('.cm-marker') : null;
      
      // Clear previous states
      answer.classList.remove('correct', 'incorrect');
      if (marker) {
        marker.classList.remove('correct', 'incorrect');
      }
      
      if (marker) {
        answered++;
        const markerMatch = marker.dataset.match;
        
        if (markerMatch === expectedMatch) {
          correct++;
          answer.classList.add('correct');
          marker.classList.add('correct');
        } else {
          answer.classList.add('incorrect');
          marker.classList.add('incorrect');
        }
      }
    });
    
    // Update activity state
    if (activities[activityId]) {
      activities[activityId].checked = true;
      activities[activityId].score = correct;
    }
    
    // Display feedback
    if (feedbackEl) {
      feedbackEl.classList.add('show');
      
      if (answered === 0) {
        feedbackEl.textContent = 'Place the numbered markers next to the matching answers.';
        feedbackEl.className = 'cm-feedback show error';
      } else if (correct === total) {
        feedbackEl.textContent = `Excellent! All ${correct} matches correct! 🎉`;
        feedbackEl.className = 'cm-feedback show success';
      } else if (answered < total) {
        feedbackEl.textContent = `${correct}/${answered} correct so far. Complete all matches!`;
        feedbackEl.className = 'cm-feedback show error';
      } else {
        feedbackEl.textContent = `${correct}/${total} correct. Check the red items and try again.`;
        feedbackEl.className = 'cm-feedback show error';
      }
    }
    
    // Update score display
    if (scoreEl) {
      scoreEl.innerHTML = `Your score: <span>${correct}</span>/${total}`;
      scoreEl.classList.add('show');
    }
    
    // Toggle buttons
    if (submitBtn) submitBtn.style.display = 'none';
    if (restartBtn) restartBtn.style.display = 'inline-block';
    
    // Call completion callback if all correct
    if (correct === total && config.onComplete) {
      config.onComplete(correct, total);
    }
    
    return { correct, total, answered };
  }
  
  function resetActivity(activityId) {
    const activity = document.getElementById(activityId);
    if (!activity) {
      console.error('CompactMatchingModule: Activity not found:', activityId);
      return;
    }
    
    const feedbackEl = document.getElementById(activityId + '-feedback') ||
                       activity.querySelector('.cm-feedback');
    const scoreEl = document.getElementById(activityId + '-score') ||
                    activity.querySelector('.cm-score');
    const submitBtn = document.getElementById(activityId + '-cm-submit') ||
                      activity.querySelector('.cm-submit-btn');
    const restartBtn = document.getElementById(activityId + '-cm-restart') ||
                       activity.querySelector('.cm-restart-btn');
    
    // Return all markers to bank
    const placedMarkers = activity.querySelectorAll('.cm-answer-slot .cm-marker');
    placedMarkers.forEach(marker => {
      returnMarkerToBank(marker);
    });
    
    // Clear all styling
    activity.querySelectorAll('.cm-answer').forEach(answer => {
      answer.classList.remove('correct', 'incorrect', 'drag-over');
    });
    
    // Clear feedback
    if (feedbackEl) {
      feedbackEl.classList.remove('show');
      feedbackEl.textContent = '';
    }
    
    // Clear score
    if (scoreEl) {
      scoreEl.classList.remove('show');
    }
    
    // Toggle buttons
    if (submitBtn) submitBtn.style.display = 'inline-block';
    if (restartBtn) restartBtn.style.display = 'none';
    
    // Clear selection
    clearSelection();
    
    // Update activity state
    if (activities[activityId]) {
      activities[activityId].checked = false;
      activities[activityId].score = 0;
    }
  }
  
  // ===== Public API =====
  
  return {
    init: init,
    check: checkActivity,
    reset: resetActivity
  };
  
})();

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    // Only auto-init if there are compact-matching elements
    if (document.querySelector('.compact-matching')) {
      CompactMatchingModule.init();
    }
  });
} else {
  if (document.querySelector('.compact-matching')) {
    CompactMatchingModule.init();
  }
}
