/**
 * ESL Grammar Website - Activity Navigation Module
 * 
 * This module handles navigation between different activities on practice pages:
 * - Switching between different activity types (MCQ, gap fill, etc.)
 * - Updating URL parameters to track current activity
 * - Managing navigation history for back button functionality
 * - Tracking progress across activities
 * - Providing a consistent UI for activity navigation
 */

/**
 * ActivityNavModule - Provides functionality for navigating between activities
 */
const ActivityNavModule = (function() {
    // Private variables
    let activeActivityId = null;
    let activities = [];
    let containerId = 'activity-nav';
    let activityContainersSelector = '.activity-container';
    let activityButtonSelector = '.activity-nav-btn';
    let onActivityChangeCallback = null;
    let progressTrackingEnabled = true;
    let progressContainerId = 'progress-bar';
    let progressInfoContainerId = 'progress-info';
    let useUrlParams = false;
    
    /**
     * Initializes the Activity Navigation module
     * 
     * @param {Object} config - Configuration object
     * @param {string} config.containerId - ID of the navigation container (default: 'activity-nav')
     * @param {string} config.activityContainersSelector - Selector for activity containers (default: '.activity-container')
     * @param {string} config.activityButtonSelector - Selector for activity buttons (default: '.activity-nav-btn')
     * @param {Array} config.activities - Array of activity IDs to initialize (if not provided, will be auto-detected)
     * @param {Function} config.onActivityChange - Callback function when activity changes
     * @param {boolean} config.progressTracking - Whether to enable progress tracking (default: true)
     * @param {string} config.progressContainerId - ID of progress bar container (default: 'progress-bar')
     * @param {string} config.progressInfoContainerId - ID of progress info container (default: 'progress-info')
     * @param {boolean} config.useUrlParams - Whether to update URL parameters with activity (default: false)
     */
    function init(config = {}) {
      // Set up configuration
      containerId = config.containerId || 'activity-nav';
      activityContainersSelector = config.activityContainersSelector || '.activity-container';
      activityButtonSelector = config.activityButtonSelector || '.activity-nav-btn';
      onActivityChangeCallback = config.onActivityChange || null;
      progressTrackingEnabled = config.progressTracking !== undefined ? config.progressTracking : true;
      progressContainerId = config.progressContainerId || 'progress-bar';
      progressInfoContainerId = config.progressInfoContainerId || 'progress-info';
      useUrlParams = config.useUrlParams || false;
      
      // Set up activities array
      if (config.activities && Array.isArray(config.activities)) {
        activities = config.activities;
      } else {
        // Auto-detect activities from DOM
        activities = detectActivities();
      }
      
      // Set up navigation button click handlers
      setupNavButtonHandlers();
      
      // Check URL parameters for initial activity
      if (useUrlParams) {
        const urlParams = new URLSearchParams(window.location.search);
        const activityParam = urlParams.get('activity');
        
        if (activityParam && activities.includes(activityParam)) {
          // If URL has valid activity parameter, navigate to it
          navigateToActivity(activityParam);
        } else {
          // Otherwise, navigate to first activity or check localStorage
          loadLastActivity();
        }
      } else {
        // If not using URL params, just check localStorage
        loadLastActivity();
      }
      
      // If no active activity was set, default to first one
      if (!activeActivityId && activities.length > 0) {
        navigateToActivity(activities[0]);
      }
      
      // Update progress display if enabled
      if (progressTrackingEnabled) {
        updateProgressDisplay();
      }
    }
    
    /**
     * Auto-detects activities from the DOM
     * 
     * @returns {Array} - Array of activity IDs
     */
    function detectActivities() {
      const detectedActivities = [];
      
      // Check navigation buttons
      const navContainer = document.getElementById(containerId);
      if (navContainer) {
        const buttons = navContainer.querySelectorAll(activityButtonSelector);
        buttons.forEach(button => {
          const activityId = button.getAttribute('data-activity');
          if (activityId) {
            detectedActivities.push(activityId);
          }
        });
      }
      
      // If no activities found from buttons, check containers directly
      if (detectedActivities.length === 0) {
        const containers = document.querySelectorAll(activityContainersSelector);
        containers.forEach(container => {
          if (container.id) {
            detectedActivities.push(container.id);
          }
        });
      }
      
      return detectedActivities;
    }
    
    /**
     * Sets up click handlers for navigation buttons
     */
    function setupNavButtonHandlers() {
      const navContainer = document.getElementById(containerId);
      if (!navContainer) return;
      
      const buttons = navContainer.querySelectorAll(activityButtonSelector);
      
      buttons.forEach(button => {
        button.addEventListener('click', function() {
          const activityId = this.getAttribute('data-activity');
          if (activityId) {
            navigateToActivity(activityId);
          }
        });
      });
    }
    
    /**
     * Navigates to a specific activity
     * 
     * @param {string} activityId - ID of the activity to navigate to
     */
    function navigateToActivity(activityId) {
      if (!activities.includes(activityId)) {
        console.error(`Activity '${activityId}' not found`);
        return;
      }
      
      // Hide all activities
      document.querySelectorAll(activityContainersSelector).forEach(container => {
        container.classList.remove('active');
      });
      
      // Show selected activity
      const activityContainer = document.getElementById(activityId);
      if (activityContainer) {
        activityContainer.classList.add('active');
      }
      
      // Update navigation buttons
      const navContainer = document.getElementById(containerId);
      if (navContainer) {
        navContainer.querySelectorAll(activityButtonSelector).forEach(button => {
          button.classList.remove('active');
          
          if (button.getAttribute('data-activity') === activityId) {
            button.classList.add('active');
          }
        });
      }
      
      // Update URL parameter if enabled
      if (useUrlParams) {
        updateUrlParam(activityId);
      }
      
      // Save activity to localStorage
      saveToLocalStorage('lastActivity', activityId);
      
      // Store active activity
      activeActivityId = activityId;
      
      // Call onActivityChange callback if provided
      if (typeof onActivityChangeCallback === 'function') {
        onActivityChangeCallback(activityId);
      }
    }
    
    /**
     * Updates URL parameter with current activity
     * 
     * @param {string} activityId - ID of the current activity
     */
    function updateUrlParam(activityId) {
      // Only proceed if History API is supported
      if (!window.history || !window.history.replaceState) return;
      
      const url = new URL(window.location);
      url.searchParams.set('activity', activityId);
      window.history.replaceState({}, '', url);
    }
    
    /**
     * Loads the last active activity from localStorage
     */
    function loadLastActivity() {
      if (typeof getFromLocalStorage !== 'function') return;
      
      const lastActivity = getFromLocalStorage('lastActivity');
      
      if (lastActivity && activities.includes(lastActivity)) {
        navigateToActivity(lastActivity);
      }
    }
    
    /**
     * Updates the progress display
     * 
     * @param {Object} progress - Optional progress data to display
     */
    function updateProgressDisplay(progress = null) {
      if (!progressTrackingEnabled) return;
      
      // If no progress data provided, calculate it
      if (!progress) {
        progress = calculateProgress();
      }
      
      // Update progress bar
      const progressBar = document.getElementById(progressContainerId);
      if (progressBar) {
        progressBar.style.width = `${progress.percentage}%`;
      }
      
      // Update progress info text
      const progressInfo = document.getElementById(progressInfoContainerId);
      if (progressInfo) {
        let statusText = '';
        
        if (progress.percentage < 25) {
          statusText = "Just getting started! Keep going!";
        } else if (progress.percentage < 50) {
          statusText = "Making good progress! Keep it up!";
        } else if (progress.percentage < 75) {
          statusText = "Excellent progress! You're doing great!";
        } else if (progress.percentage < 100) {
          statusText = "Almost there! Just a few more activities to go!";
        } else {
          statusText = "Congratulations! You've completed all activities!";
        }
        
        progressInfo.textContent = `Progress: ${progress.percentage}% complete (${progress.completed}/${progress.total} activities completed)`;
      }
    }
    
    /**
     * Calculates overall progress across activities
     * 
     * @returns {Object} - Progress data object
     */
    function calculateProgress() {
      let completed = 0;
      const total = activities.length;
      
      // Check each activity's completion status
      activities.forEach(activityId => {
        const isCompleted = isActivityCompleted(activityId);
        if (isCompleted) {
          completed++;
        }
      });
      
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        completed: completed,
        total: total,
        percentage: percentage
      };
    }
    
    /**
     * Checks if a specific activity is completed
     * 
     * @param {string} activityId - ID of the activity to check
     * @returns {boolean} - Whether the activity is completed
     */
    function isActivityCompleted(activityId) {
      if (typeof getFromLocalStorage !== 'function') return false;
      
      // Try to get activity progress from localStorage
      const progressKey = `${activityId}-progress`;
      const progressData = getFromLocalStorage(progressKey);
      
      return progressData && progressData.completed === true;
    }
    
    /**
     * Gets the active activity ID
     * 
     * @returns {string} - ID of the active activity
     */
    function getActiveActivity() {
      return activeActivityId;
    }
    
    /**
     * Checks if activity is active
     * 
     * @param {string} activityId - ID of the activity to check
     * @returns {boolean} - Whether the activity is active
     */
    function isActivityActive(activityId) {
      return activeActivityId === activityId;
    }
    
    /**
     * Navigates to the next activity
     * 
     * @returns {boolean} - Whether navigation was successful
     */
    function navigateToNextActivity() {
      const currentIndex = activities.indexOf(activeActivityId);
      
      if (currentIndex >= 0 && currentIndex < activities.length - 1) {
        navigateToActivity(activities[currentIndex + 1]);
        return true;
      }
      
      return false;
    }
    
    /**
     * Navigates to the previous activity
     * 
     * @returns {boolean} - Whether navigation was successful
     */
    function navigateToPreviousActivity() {
      const currentIndex = activities.indexOf(activeActivityId);
      
      if (currentIndex > 0) {
        navigateToActivity(activities[currentIndex - 1]);
        return true;
      }
      
      return false;
    }
    
    /**
     * Adds "Next" and "Previous" buttons to each activity
     */
    function addNextPrevButtons() {
      activities.forEach(activityId => {
        const container = document.getElementById(activityId);
        if (!container) return;
        
        // Check if buttons already exist
        if (container.querySelector('.activity-nav-next') || 
            container.querySelector('.activity-nav-prev')) {
          return;
        }
        
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'activity-nav-buttons';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '20px';
        
        // Create previous button (if not first activity)
        const currentIndex = activities.indexOf(activityId);
        
        if (currentIndex > 0) {
          const prevButton = document.createElement('button');
          prevButton.className = 'activity-nav-prev nav-button';
          prevButton.innerHTML = '&larr; Previous Activity';
          prevButton.addEventListener('click', navigateToPreviousActivity);
          buttonContainer.appendChild(prevButton);
        } else {
          // Add empty div for spacing
          const spacer = document.createElement('div');
          buttonContainer.appendChild(spacer);
        }
        
        // Create next button (if not last activity)
        if (currentIndex < activities.length - 1) {
          const nextButton = document.createElement('button');
          nextButton.className = 'activity-nav-next nav-button';
          nextButton.innerHTML = 'Next Activity &rarr;';
          nextButton.addEventListener('click', navigateToNextActivity);
          buttonContainer.appendChild(nextButton);
        }
        
        // Add buttons container to activity container
        container.appendChild(buttonContainer);
      });
    }
    
    /**
     * Sets up keyboard navigation (arrow keys) between activities
     * 
     * @param {boolean} enable - Whether to enable keyboard navigation
     */
    function setupKeyboardNavigation(enable = true) {
      if (enable) {
        document.addEventListener('keydown', handleKeyNavigation);
      } else {
        document.removeEventListener('keydown', handleKeyNavigation);
      }
    }
    
    /**
     * Handles keyboard navigation events
     * 
     * @param {KeyboardEvent} event - Keyboard event
     */
    function handleKeyNavigation(event) {
      // Only handle left/right arrow keys
      if (event.key === 'ArrowRight') {
        // Check if not typing in an input field
        if (document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA') {
          navigateToNextActivity();
        }
      } else if (event.key === 'ArrowLeft') {
        // Check if not typing in an input field
        if (document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA') {
          navigateToPreviousActivity();
        }
      }
    }
    
    /**
     * Creates a table of contents for all activities
     * 
     * @param {string} containerId - ID of container to append table of contents
     */
    function createTableOfContents(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      // Create table of contents
      const toc = document.createElement('div');
      toc.className = 'activity-toc';
      
      // Add heading
      const heading = document.createElement('h3');
      heading.textContent = 'Activity List';
      toc.appendChild(heading);
      
      // Create list of activities
      const list = document.createElement('ul');
      list.className = 'activity-toc-list';
      
      // Add each activity
      activities.forEach(activityId => {
        const listItem = document.createElement('li');
        
        // Try to get activity title
        let activityTitle = activityId;
        const activityContainer = document.getElementById(activityId);
        
        if (activityContainer) {
          // Look for heading in the activity container
          const heading = activityContainer.querySelector('h2, h3');
          if (heading) {
            activityTitle = heading.textContent;
          }
        }
        
        // Check completion status
        const isCompleted = isActivityCompleted(activityId);
        
        // Create link
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = activityTitle;
        link.addEventListener('click', function(e) {
          e.preventDefault();
          navigateToActivity(activityId);
        });
        
        // Add completion status
        if (isCompleted) {
          const completedBadge = document.createElement('span');
          completedBadge.className = 'completed-badge';
          completedBadge.textContent = '✓';
          completedBadge.style.color = 'var(--success-color, #155724)';
          completedBadge.style.marginLeft = '8px';
          link.appendChild(completedBadge);
        }
        
        listItem.appendChild(link);
        list.appendChild(listItem);
      });
      
      toc.appendChild(list);
      container.appendChild(toc);
    }
    
    /**
     * Updates the UI when activities are completed
     * 
     * @param {string} activityId - ID of the completed activity
     */
    function handleActivityCompletion(activityId) {
      // Update activity button to show completion
      const navContainer = document.getElementById(containerId);
      if (navContainer) {
        const button = navContainer.querySelector(`${activityButtonSelector}[data-activity="${activityId}"]`);
        
        if (button) {
          button.classList.add('completed');
          
          // Add completion icon if not already present
          if (!button.querySelector('.completion-icon')) {
            const icon = document.createElement('span');
            icon.className = 'completion-icon';
            icon.textContent = '✓';
            icon.style.marginLeft = '5px';
            button.appendChild(icon);
          }
        }
      }
      
      // Update progress display
      if (progressTrackingEnabled) {
        updateProgressDisplay();
      }
      
      // Show congratulations message for completing all activities
      const progress = calculateProgress();
      if (progress.completed === progress.total) {
        showCompletionMessage();
      }
    }
    
    /**
     * Shows a message when all activities are completed
     */
    function showCompletionMessage() {
      // Check if message already exists
      if (document.getElementById('completion-message')) {
        return;
      }
      
      // Create message container
      const messageContainer = document.createElement('div');
      messageContainer.id = 'completion-message';
      messageContainer.className = 'completion-message';
      messageContainer.style.backgroundColor = 'var(--success-bg, #d4edda)';
      messageContainer.style.color = 'var(--success-color, #155724)';
      messageContainer.style.padding = '15px';
      messageContainer.style.borderRadius = '5px';
      messageContainer.style.margin = '20px 0';
      messageContainer.style.textAlign = 'center';
      messageContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      
      // Add message content
      const heading = document.createElement('h3');
      heading.textContent = 'Congratulations!';
      heading.style.marginTop = '0';
      
      const message = document.createElement('p');
      message.textContent = 'You have completed all the activities! Well done on your progress!';
      
      const icon = document.createElement('div');
      icon.textContent = '🎉';
      icon.style.fontSize = '2rem';
      icon.style.marginBottom = '10px';
      
      messageContainer.appendChild(icon);
      messageContainer.appendChild(heading);
      messageContainer.appendChild(message);
      
      // Add button to restart all activities
      const restartButton = document.createElement('button');
      restartButton.textContent = 'Restart All Activities';
      restartButton.className = 'restart-btn';
      restartButton.addEventListener('click', resetAllActivities);
      messageContainer.appendChild(restartButton);
      
      // Add message after progress bar
      const progressInfo = document.getElementById(progressInfoContainerId);
      if (progressInfo && progressInfo.parentNode) {
        progressInfo.parentNode.insertBefore(messageContainer, progressInfo.nextSibling);
      } else {
        // If progress info not found, add after navigation
        const navContainer = document.getElementById(containerId);
        if (navContainer && navContainer.parentNode) {
          navContainer.parentNode.insertBefore(messageContainer, navContainer.nextSibling);
        }
      }
    }
    
    /**
     * Resets progress for all activities
     */
    function resetAllActivities() {
      if (typeof removeFromLocalStorage !== 'function') return;
      
      if (!confirm('Are you sure you want to reset progress for all activities?')) {
        return;
      }
      
      // Remove progress data for each activity
      activities.forEach(activityId => {
        removeFromLocalStorage(`${activityId}-progress`);
      });
      
      // Update UI
      const navContainer = document.getElementById(containerId);
      if (navContainer) {
        navContainer.querySelectorAll(`${activityButtonSelector} .completion-icon`).forEach(icon => {
          icon.remove();
        });
        
        navContainer.querySelectorAll(`${activityButtonSelector}`).forEach(button => {
          button.classList.remove('completed');
        });
      }
      
      // Remove completion message
      const completionMessage = document.getElementById('completion-message');
      if (completionMessage) {
        completionMessage.remove();
      }
      
      // Update progress display
      if (progressTrackingEnabled) {
        updateProgressDisplay({
          completed: 0,
          total: activities.length,
          percentage: 0
        });
      }
      
      // Reload page to reset all activity states
      window.location.reload();
    }
    
    /**
     * Sets an event listener for activity completion from other modules
     */
    function listenForActivityCompletion() {
      document.addEventListener('activityCompleted', function(e) {
        if (e.detail && e.detail.activityId) {
          handleActivityCompletion(e.detail.activityId);
        }
      });
    }
    
    /**
     * Notifies that an activity has been completed
     * 
     * @param {string} activityId - ID of the completed activity
     * @param {Object} details - Additional completion details
     */
    function notifyActivityCompleted(activityId, details = {}) {
      // Create and dispatch custom event
      const event = new CustomEvent('activityCompleted', {
        detail: {
          activityId: activityId,
          timestamp: new Date().toISOString(),
          ...details
        }
      });
      
      document.dispatchEvent(event);
    }
    
    // Initialize event listeners when module loads
    function initialize() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', listenForActivityCompletion);
      } else {
        listenForActivityCompletion();
      }
    }
    
    // Call initialize
    initialize();
    
    // Public API
    return {
      init: init,
      navigateToActivity: navigateToActivity,
      getActiveActivity: getActiveActivity,
      isActivityActive: isActivityActive,
      navigateToNextActivity: navigateToNextActivity,
      navigateToPreviousActivity: navigateToPreviousActivity,
      updateProgressDisplay: updateProgressDisplay,
      calculateProgress: calculateProgress,
      isActivityCompleted: isActivityCompleted,
      addNextPrevButtons: addNextPrevButtons,
      setupKeyboardNavigation: setupKeyboardNavigation,
      createTableOfContents: createTableOfContents,
      resetAllActivities: resetAllActivities,
      notifyActivityCompleted: notifyActivityCompleted
    };
  })();
  
  // Export the module if module system is being used
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = ActivityNavModule;
  }