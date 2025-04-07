/**
 * ESL Grammar Website - Progress Tracking Module (Redesigned)
 * 
 * This module provides a comprehensive system for tracking student progress across:
 * - Activities (MCQs, gap fills, etc.)
 * - Lessons (grammar topics)
 * - Assessments (quizzes and tests)
 * 
 * Key features:
 * - Tracks completion status, scores, and timestamps
 * - Stores which questions were answered correctly/incorrectly
 * - Maintains achievement records
 * - Provides statistics on overall progress
 * - Manages localStorage with error handling and fallbacks
 */

/**
 * ProgressTracker - Provides functionality for tracking learning progress
 */
const ProgressTracker = (function() {
  // Private variables
  let progressData = null;
  let categoryDefinitions = {};
  let settings = {
    storageKeyPrefix: 'esl-progress-',
    enableAchievements: true,
    autoSaveInterval: 30000, // 30 seconds
    debugMode: false
  };
  
  let autoSaveTimer = null;
  let achievementCallbacks = {};
  let progressChangeCallbacks = [];
  
  // Default data structure
  const DEFAULT_DATA = {
    // Activities stores progress for all interactive elements
    activities: {},
    // Lessons tracks viewed/completed lesson pages
    lessons: {},
    // Assessments tracks formal tests and quizzes
    assessments: {},
    // Stats holds overall usage statistics
    stats: {
      totalTimeSpent: 0,
      lastActive: null,
      dailyStreak: 0,
      lastActivityDate: null
    },
    // Achievements tracks unlocked achievements
    achievements: {}
  };
  
  /**
   * Initializes the Progress Tracking module
   * 
   * @param {Object} config - Configuration options
   * @param {Object} config.categories - Definition of progress categories and their items
   * @param {string} config.storageKeyPrefix - Prefix for localStorage keys (default: 'esl-progress-')
   * @param {boolean} config.enableAchievements - Whether to enable achievement tracking (default: true)
   * @param {number} config.autoSaveInterval - Interval for auto-saving progress in ms (default: 30000)
   * @param {Function} config.onProgressChange - Callback function for progress changes
   * @param {boolean} config.debugMode - Enable additional debug logging (default: false)
   */
  function init(config = {}) {
    // Log initialization if debug mode is enabled
    logDebug('Initializing ProgressTracker module', config);
    
    // Update settings
    if (config.storageKeyPrefix) settings.storageKeyPrefix = config.storageKeyPrefix;
    if (config.enableAchievements !== undefined) settings.enableAchievements = config.enableAchievements;
    if (config.autoSaveInterval !== undefined) settings.autoSaveInterval = config.autoSaveInterval;
    if (config.debugMode !== undefined) settings.debugMode = config.debugMode;
    
    // Set up category definitions
    if (config.categories) {
      categoryDefinitions = config.categories;
    }
    
    // Set up callback
    if (typeof config.onProgressChange === 'function') {
      addProgressChangeCallback(config.onProgressChange);
    }
    
    // Set up achievements
    setupDefaultAchievements();
    
    // Load existing progress
    loadProgress();
    
    // Set up auto-save timer
    if (settings.autoSaveInterval > 0) {
      setupAutoSave();
    }
    
    // Set up activity completion listener
    setupActivityCompletionListener();
    
    // Check for achievements after import
    if (settings.enableAchievements) {
      checkAchievements();
    }
    
    return true;
  }
  
  /**
   * Logs debug information if debug mode is enabled
   * 
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  function logDebug(message, data = null) {
    if (settings.debugMode) {
      if (data) {
        console.log(`[ProgressTracker] ${message}:`, data);
      } else {
        console.log(`[ProgressTracker] ${message}`);
      }
    }
  }
  
  /**
   * Sets up auto-save functionality
   */
  function setupAutoSave() {
    // Clear any existing timer
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
    }
    
    // Set up new timer
    autoSaveTimer = setInterval(function() {
      saveProgress();
    }, settings.autoSaveInterval);
    
    logDebug('Auto-save timer set up', { interval: settings.autoSaveInterval });
  }
  
  /**
   * Sets up listener for activity completion events
   */
  function setupActivityCompletionListener() {
    document.removeEventListener('activityCompleted', handleActivityCompletedEvent);
    document.addEventListener('activityCompleted', handleActivityCompletedEvent);
    
    logDebug('Activity completion listener set up');
  }
  
  /**
   * Handles activity completed events
   * 
   * @param {CustomEvent} event - The activity completed event
   */
  function handleActivityCompletedEvent(event) {
    if (!event.detail || !event.detail.activityId) {
      logDebug('Ignoring invalid activity completed event', event);
      return;
    }
    
    const details = {
      completed: true,
      completedAt: event.detail.timestamp || new Date().toISOString(),
      score: event.detail.score,
      maxScore: event.detail.maxScore,
      title: event.detail.title || event.detail.activityId,
      answers: event.detail.answers || null
    };
    
    logDebug('Activity completed event received', { activityId: event.detail.activityId, details: details });
    
    // Mark the activity as completed
    markItemCompleted('activities', event.detail.activityId, details);
  }
  
  /**
   * Sets up default achievement definitions
   */
  function setupDefaultAchievements() {
    // Basic achievements
    registerAchievement('first_activity', {
      title: 'First Steps',
      description: 'Complete your first activity',
      criteria: function(progress) {
        return getCompletedCount('activities') >= 1;
      },
      icon: '🏆'
    });
    
    registerAchievement('five_activities', {
      title: 'Getting Started',
      description: 'Complete 5 activities',
      criteria: function(progress) {
        return getCompletedCount('activities') >= 5;
      },
      icon: '🔥'
    });
    
    registerAchievement('ten_activities', {
      title: 'Making Progress',
      description: 'Complete 10 activities',
      criteria: function(progress) {
        return getCompletedCount('activities') >= 10;
      },
      icon: '⭐'
    });
    
    registerAchievement('perfect_score', {
      title: 'Perfect!',
      description: 'Get a perfect score on any activity',
      criteria: function(progress) {
        // Check if any activity has a perfect score
        if (!progress.activities) return false;
        
        return Object.values(progress.activities).some(activity => {
          // Make sure both score and maxScore are defined and equal
          return (
            activity.score !== undefined && 
            activity.maxScore !== undefined && 
            activity.score === activity.maxScore && 
            activity.score > 0 && 
            activity.completed
          );
        });
      },
      icon: '💯'
    });
    
    registerAchievement('daily_streak_3', {
      title: 'Consistency',
      description: 'Study for 3 days in a row',
      criteria: function(progress) {
        return progress.stats && progress.stats.dailyStreak >= 3;
      },
      icon: '📅'
    });
    
    registerAchievement('category_complete', {
      title: 'Master of Grammar',
      description: 'Complete all activities in a grammar category',
      criteria: function(progress) {
        // This requires categoryDefinitions to be properly set up
        if (!categoryDefinitions || !categoryDefinitions.activities) return false;
        
        // Check if any subcategory in activities is fully completed
        return Object.entries(categoryDefinitions.activities).some(([subcategoryKey, items]) => {
          // Skip empty subcategories
          if (!Array.isArray(items) || items.length === 0) return false;
          
          // Check if all items in this subcategory are completed
          return items.every(itemId => {
            return progress.activities && 
                   progress.activities[itemId] && 
                   progress.activities[itemId].completed;
          });
        });
      },
      icon: '🎓'
    });
    
    logDebug('Default achievements set up');
  }
  
  /**
   * Loads progress data from localStorage with error handling
   */
  function loadProgress() {
    logDebug('Loading progress data');
    
    try {
      // Check if localStorage is available
      if (!isLocalStorageAvailable()) {
        throw new Error('localStorage is not available');
      }
      
      const savedData = localStorage.getItem(`${settings.storageKeyPrefix}data`);
      
      if (savedData) {
        progressData = JSON.parse(savedData);
        
        // Validate the loaded data to make sure it has the expected structure
        progressData = validateProgressData(progressData);
        
        // Update daily streak based on last activity date
        updateDailyStreak();
        
        // Import activity data from legacy sources
        importLegacyActivityData();
        
        logDebug('Progress data loaded', progressData);
      } else {
        // Initialize with empty data
        resetProgressData();
        logDebug('No saved progress data found, initialized with default');
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
      
      // Initialize with empty data on error
      resetProgressData();
      logDebug('Error loading progress data, initialized with default');
    }
  }
  
  /**
   * Validates and repairs progress data to ensure proper structure
   * 
   * @param {Object} data - The progress data to validate
   * @returns {Object} - Validated and repaired progress data
   */
  function validateProgressData(data) {
    const valid = { ...DEFAULT_DATA };
    
    // Handle missing sections by using empty objects from default structure
    if (!data) return valid;
    
    // Validate each section
    if (data.activities && typeof data.activities === 'object') {
      valid.activities = data.activities;
    }
    
    if (data.lessons && typeof data.lessons === 'object') {
      valid.lessons = data.lessons;
    }
    
    if (data.assessments && typeof data.assessments === 'object') {
      valid.assessments = data.assessments;
    }
    
    if (data.achievements && typeof data.achievements === 'object') {
      valid.achievements = data.achievements;
    }
    
    // Validate stats
    if (data.stats && typeof data.stats === 'object') {
      valid.stats = {
        totalTimeSpent: typeof data.stats.totalTimeSpent === 'number' ? data.stats.totalTimeSpent : 0,
        lastActive: data.stats.lastActive || new Date().toISOString(),
        dailyStreak: typeof data.stats.dailyStreak === 'number' ? data.stats.dailyStreak : 0,
        lastActivityDate: data.stats.lastActivityDate || null
      };
    }
    
    return valid;
  }
  
  /**
   * Resets progress data to default empty structure
   */
  function resetProgressData() {
    progressData = JSON.parse(JSON.stringify(DEFAULT_DATA));
    progressData.stats.lastActive = new Date().toISOString();
  }
  
  /**
   * Imports activity progress data from individual activity modules
   */
  function importLegacyActivityData() {
    if (!isLocalStorageAvailable()) return;
    
    try {
      logDebug('Importing legacy activity data');
      
      // Find all localStorage keys ending with "-progress"
      const legacyKeysFound = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.endsWith('-progress') && !key.startsWith(settings.storageKeyPrefix)) {
          try {
            const activityData = JSON.parse(localStorage.getItem(key));
            const activityId = key.replace('-progress', '');
            
            // Only import if it's marked as completed and not already in our data
            if (activityData && activityData.completed && 
                (!progressData.activities[activityId] || 
                 !progressData.activities[activityId].completed)) {
              
              progressData.activities[activityId] = {
                completed: true,
                completedAt: activityData.completedAt || new Date().toISOString(),
                score: activityData.score || null,
                maxScore: activityData.maxScore || null,
                title: activityData.title || activityId,
                answers: activityData.answers || null
              };
              
              legacyKeysFound.push(key);
            }
          } catch (e) {
            console.warn(`Could not import activity data for ${key}:`, e);
          }
        }
      }
      
      // If we imported any legacy keys, save the consolidated data
      if (legacyKeysFound.length > 0) {
        logDebug('Imported legacy activity data', { keysImported: legacyKeysFound });
        saveProgress();
      } else {
        logDebug('No legacy activity data found to import');
      }
    } catch (error) {
      console.error('Error importing legacy activity data:', error);
    }
  }
  
  /**
   * Checks if localStorage is available in the browser
   * 
   * @returns {boolean} - True if available, false otherwise
   */
  function isLocalStorageAvailable() {
    try {
      const testKey = `__storage_test_${Math.random().toString(36).substring(2)}`;
      localStorage.setItem(testKey, testKey);
      const result = localStorage.getItem(testKey) === testKey;
      localStorage.removeItem(testKey);
      return result;
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Saves progress data to localStorage with error handling
   * 
   * @returns {boolean} - True if successful, false otherwise
   */
  function saveProgress() {
    if (!progressData) {
      logDebug('No progress data to save');
      return false;
    }
    
    try {
      // Check if localStorage is available
      if (!isLocalStorageAvailable()) {
        throw new Error('localStorage is not available');
      }
      
      // Update last active timestamp
      if (progressData.stats) {
        progressData.stats.lastActive = new Date().toISOString();
      }
      
      localStorage.setItem(`${settings.storageKeyPrefix}data`, JSON.stringify(progressData));
      
      logDebug('Progress data saved to localStorage');
      return true;
    } catch (error) {
      console.error('Error saving progress data:', error);
      return false;
    }
  }
  
  /**
   * Updates the daily streak counter
   */
  function updateDailyStreak() {
    if (!progressData || !progressData.stats) return;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    if (!progressData.stats.lastActivityDate) {
      // First activity
      progressData.stats.lastActivityDate = today;
      progressData.stats.dailyStreak = 1;
      logDebug('First activity recorded, streak initialized', { streak: 1 });
      return;
    }
    
    const lastActive = new Date(progressData.stats.lastActivityDate).getTime();
    const yesterday = today - (24 * 60 * 60 * 1000);
    
    if (lastActive === today) {
      // Already logged activity today
      logDebug('Activity already recorded today', { streak: progressData.stats.dailyStreak });
      return;
    } else if (lastActive === yesterday) {
      // Consecutive day
      progressData.stats.lastActivityDate = today;
      progressData.stats.dailyStreak++;
      logDebug('Consecutive day activity', { streak: progressData.stats.dailyStreak });
    } else if (lastActive < yesterday) {
      // Streak broken
      progressData.stats.lastActivityDate = today;
      progressData.stats.dailyStreak = 1;
      logDebug('Streak broken, reset to 1', { previousStreak: progressData.stats.dailyStreak });
    }
    
    // Save changes
    saveProgress();
  }
  
  /**
   * Marks an item as completed and stores detailed completion data
   * 
   * @param {string} category - Category of the item ('activities', 'lessons', 'assessments')
   * @param {string} itemId - ID of the item
   * @param {Object} details - Additional details about the completion
   * @returns {Object|boolean} - The item data or false if failed
   */
  function markItemCompleted(category, itemId, details = {}) {
    if (!progressData) {
      logDebug('Progress data not initialized');
      return false;
    }
    
    if (!progressData[category]) {
      progressData[category] = {};
    }
    
    // Create or update the item data
    progressData[category][itemId] = {
      completed: true,
      completedAt: details.completedAt || new Date().toISOString(),
      score: details.score !== undefined ? details.score : null,
      maxScore: details.maxScore !== undefined ? details.maxScore : null,
      timeSpent: details.timeSpent !== undefined ? details.timeSpent : null,
      title: details.title || itemId,
      answers: details.answers || null,
      ...details
    };
    
    // Update daily streak
    updateDailyStreak();
    
    // Update total time spent if available
    if (details.timeSpent && progressData.stats) {
      progressData.stats.totalTimeSpent += details.timeSpent;
    }
    
    // Save progress
    saveProgress();
    
    // Notify callbacks
    notifyProgressChanged({
      type: 'item_completed',
      category: category,
      itemId: itemId,
      details: progressData[category][itemId]
    });
    
    // Check for achievements
    if (settings.enableAchievements) {
      checkAchievements();
    }
    
    logDebug('Item marked as completed', {
      category: category,
      itemId: itemId,
      details: progressData[category][itemId]
    });
    
    return progressData[category][itemId];
  }
  
  /**
   * Updates an item's progress without marking it as completed
   * 
   * @param {string} category - Category of the item ('activities', 'lessons', 'assessments')
   * @param {string} itemId - ID of the item
   * @param {Object} details - Progress details to update
   * @returns {Object|boolean} - The updated item data or false if failed
   */
  function updateItemProgress(category, itemId, details = {}) {
    if (!progressData) {
      logDebug('Progress data not initialized');
      return false;
    }
    
    if (!progressData[category]) {
      progressData[category] = {};
    }
    
    // Get existing data or create new
    const existingData = progressData[category][itemId] || {};
    
    // Update with new details
    progressData[category][itemId] = {
      ...existingData,
      lastUpdated: new Date().toISOString(),
      ...details
    };
    
    // Update daily streak
    updateDailyStreak();
    
    // Save progress
    saveProgress();
    
    // Notify callbacks
    notifyProgressChanged({
      type: 'item_updated',
      category: category,
      itemId: itemId,
      details: progressData[category][itemId]
    });
    
    logDebug('Item progress updated', {
      category: category,
      itemId: itemId,
      details: progressData[category][itemId]
    });
    
    return progressData[category][itemId];
  }
  
  /**
   * Checks if an item is completed
   * 
   * @param {string} category - Category of the item ('activities', 'lessons', 'assessments')
   * @param {string} itemId - ID of the item
   * @returns {boolean} - Whether the item is completed
   */
  function isItemCompleted(category, itemId) {
    return !!(progressData && 
              progressData[category] && 
              progressData[category][itemId] && 
              progressData[category][itemId].completed);
  }
  
  /**
   * Gets details about an item's progress
   * 
   * @param {string} category - Category of the item ('activities', 'lessons', 'assessments')
   * @param {string} itemId - ID of the item
   * @returns {Object|null} - Progress details or null if not found
   */
  function getItemProgress(category, itemId) {
    if (!progressData || 
        !progressData[category] || 
        !progressData[category][itemId]) {
      return null;
    }
    
    return { ...progressData[category][itemId] };
  }
  
  /**
   * Gets the count of completed items in a category
   * 
   * @param {string} category - Category to count ('activities', 'lessons', 'assessments')
   * @returns {number} - Count of completed items
   */
  function getCompletedCount(category) {
    if (!progressData || !progressData[category]) return 0;
    
    return Object.values(progressData[category])
      .filter(item => item.completed)
      .length;
  }
  
  /**
   * Gets the total count of items in a category based on categoryDefinitions
   * 
   * @param {string} category - Category to count
   * @returns {number} - Total count of items
   */
  function getTotalCount(category) {
    if (!categoryDefinitions || !categoryDefinitions[category]) return 0;
    
    let total = 0;
    
    // Count items in subcategories
    Object.values(categoryDefinitions[category]).forEach(items => {
      if (Array.isArray(items)) {
        total += items.length;
      }
    });
    
    return total;
  }
  
  /**
   * Calculates completion percentage for a category
   * 
   * @param {string} category - Category to calculate ('activities', 'lessons', 'assessments')
   * @returns {number} - Percentage of completion (0-100)
   */
  function getCompletionPercentage(category) {
    const completedCount = getCompletedCount(category);
    const totalCount = getTotalCount(category);
    
    if (totalCount === 0) return 0;
    
    return Math.round((completedCount / totalCount) * 100);
  }
  
  /**
   * Calculates overall progress across all tracked categories
   * 
   * @returns {Object} - Progress statistics
   */
  function getOverallProgress() {
    const categories = ['activities', 'lessons', 'assessments'];
    
    let totalCompleted = 0;
    let totalItems = 0;
    
    categories.forEach(category => {
      totalCompleted += getCompletedCount(category);
      totalItems += getTotalCount(category);
    });
    
    const percentage = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;
    
    return {
      completed: totalCompleted,
      total: totalItems,
      percentage: percentage,
      categories: categories.reduce((result, category) => {
        result[category] = {
          completed: getCompletedCount(category),
          total: getTotalCount(category),
          percentage: getCompletionPercentage(category)
        };
        return result;
      }, {})
    };
  }
  
  /**
   * Registers an achievement
   * 
   * @param {string} id - Unique identifier for the achievement
   * @param {Object} definition - Achievement definition
   * @param {string} definition.title - Title of the achievement
   * @param {string} definition.description - Description of the achievement
   * @param {Function} definition.criteria - Function that checks if achievement is unlocked
   * @param {string} definition.icon - Icon character or URL for the achievement
   */
  function registerAchievement(id, definition) {
    achievementCallbacks[id] = definition;
  }
  
  /**
   * Checks for newly unlocked achievements
   */
  function checkAchievements() {
    if (!settings.enableAchievements || !progressData) return;
    
    // Initialize achievements object if needed
    if (!progressData.achievements) {
      progressData.achievements = {};
    }
    
    // Check each achievement
    Object.entries(achievementCallbacks).forEach(([id, definition]) => {
      // Skip already unlocked achievements
      if (progressData.achievements[id] && progressData.achievements[id].unlocked) {
        return;
      }
      
      // Check if achievement is unlocked
      try {
        if (definition.criteria(progressData)) {
          // Unlock achievement
          progressData.achievements[id] = {
            unlocked: true,
            unlockedAt: new Date().toISOString(),
            title: definition.title,
            description: definition.description,
            icon: definition.icon
          };
          
          // Save progress
          saveProgress();
          
          // Show notification
          showAchievementNotification(id);
          
          // Notify callbacks
          notifyProgressChanged({
            type: 'achievement_unlocked',
            achievementId: id,
            details: progressData.achievements[id]
          });
          
          logDebug('Achievement unlocked', { achievementId: id, details: progressData.achievements[id] });
        }
      } catch (error) {
        console.error('Error checking achievement:', error);
      }
    });
  }
  
  /**
   * Gets all unlocked achievements
   * 
   * @returns {Array} - Array of unlocked achievements
   */
  function getUnlockedAchievements() {
    if (!progressData || !progressData.achievements) return [];
    
    return Object.entries(progressData.achievements)
      .filter(([id, achievement]) => achievement.unlocked)
      .map(([id, achievement]) => ({
        id,
        ...achievement
      }));
  }
  
  /**
   * Gets all achievement definitions with unlocked status
   * 
   * @returns {Array} - Array of all achievement objects with unlocked status
   */
  function getAllAchievements() {
    const achievements = [];
    
    // Get all achievement definitions from the callbacks
    Object.entries(achievementCallbacks).forEach(([id, definition]) => {
      const achievement = {
        id: id,
        title: definition.title,
        description: definition.description,
        icon: definition.icon,
        unlocked: !!(progressData && 
                  progressData.achievements && 
                  progressData.achievements[id] && 
                  progressData.achievements[id].unlocked)
      };
      
      achievements.push(achievement);
    });
    
    return achievements;
  }
  
  /**
   * Shows an achievement notification
   * 
   * @param {string} achievementId - ID of the unlocked achievement
   */
  function showAchievementNotification(achievementId) {
    if (!progressData || 
        !progressData.achievements || 
        !progressData.achievements[achievementId]) return;
    
    const achievement = progressData.achievements[achievementId];
    
    // Create notification element if it doesn't exist
    let notificationContainer = document.getElementById('achievement-notification-container');
    
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'achievement-notification-container';
      notificationContainer.style.position = 'fixed';
      notificationContainer.style.bottom = '20px';
      notificationContainer.style.right = '20px';
      notificationContainer.style.zIndex = '1000';
      document.body.appendChild(notificationContainer);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    notification.style.color = 'white';
    notification.style.padding = '15px';
    notification.style.borderRadius = '8px';
    notification.style.marginTop = '10px';
    notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.maxWidth = '300px';
    notification.style.transition = 'all 0.3s ease';
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    // Add achievement icon
    const icon = document.createElement('div');
    icon.style.fontSize = '2rem';
    icon.style.marginRight = '10px';
    icon.textContent = achievement.icon || '🏆';
    notification.appendChild(icon);
    
    // Add achievement text
    const textContent = document.createElement('div');
    
    const title = document.createElement('div');
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '5px';
    title.textContent = achievement.title;
    textContent.appendChild(title);
    
    const description = document.createElement('div');
    description.style.fontSize = '0.9rem';
    description.textContent = achievement.description;
    textContent.appendChild(description);
    
    notification.appendChild(textContent);
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '1.2rem';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginLeft = 'auto';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close notification');
    closeButton.onclick = function() {
      hideNotification();
    };
    notification.appendChild(closeButton);
    
    // Add to container and animate in
    notificationContainer.appendChild(notification);
    
    // Force reflow to enable transition
    notification.offsetHeight;
    
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
    
    // Hide after delay
    const hideTimeout = setTimeout(hideNotification, 5000);
    
    function hideNotification() {
      clearTimeout(hideTimeout);
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      
      // Remove after animation
      setTimeout(function() {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }
  
  /**
   * Adds a progress change callback
   * 
   * @param {Function} callback - Callback function for progress changes
   */
  function addProgressChangeCallback(callback) {
    if (typeof callback === 'function') {
      progressChangeCallbacks.push(callback);
    }
  }
  
  /**
   * Notifies all progress change callbacks
   * 
   * @param {Object} details - Details about the progress change
   */
  function notifyProgressChanged(details) {
    progressChangeCallbacks.forEach(callback => {
      try {
        callback(details);
      } catch (error) {
        console.error('Error in progress change callback:', error);
      }
    });
  }
  
  /**
   * Resets all progress data
   * 
   * @param {boolean} confirm - Whether to confirm the operation (default: true)
   * @returns {boolean} - Whether the reset was successful
   */
  function resetAllProgress(confirm = true) {
    if (confirm && typeof window !== 'undefined' && !window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      return false;
    }
    
    try {
      // Reset progress data
      resetProgressData();
      
      // Save to localStorage
      saveProgress();
      
      // Clear all other progress-related localStorage items
      if (isLocalStorageAvailable()) {
        // Get all keys
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          // Remove activity progress items and other related items
          if (key && (key.includes('-progress') || key === 'lastActivity')) {
            keysToRemove.push(key);
          }
        }
        
        // Remove the collected keys
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
        
        logDebug('All progress reset', { keysRemoved: keysToRemove });
      }
      
      // Notify callbacks
      notifyProgressChanged({
        type: 'progress_reset',
        timestamp: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error('Error resetting progress:', error);
      return false;
    }
  }
  
  /**
   * Exports progress data as JSON
   * 
   * @returns {string} - JSON string of progress data
   */
  function exportProgressData() {
    return JSON.stringify(progressData);
  }
  
  /**
   * Imports progress data from JSON
   * 
   * @param {string} jsonData - JSON string of progress data
   * @param {boolean} merge - Whether to merge with existing data (default: false)
   * @returns {boolean} - Whether the import was successful
   */
  function importProgressData(jsonData, merge = false) {
    try {
      const importedData = JSON.parse(jsonData);
      
      // Validate data structure
      if (!importedData.activities || !importedData.stats) {
        console.error('Invalid progress data format');
        return false;
      }
      
      if (merge) {
        // Merge with existing data
        progressData = {
          activities: { ...progressData.activities, ...importedData.activities },
          lessons: { ...progressData.lessons, ...importedData.lessons },
          assessments: { ...progressData.assessments, ...importedData.assessments },
          stats: { ...progressData.stats, ...importedData.stats },
          achievements: { ...progressData.achievements, ...importedData.achievements }
        };
      } else {
        // Replace existing data
        progressData = validateProgressData(importedData);
      }
      
      // Save to localStorage
      saveProgress();
      
      // Check for new achievements
      checkAchievements();
      
      // Notify callbacks
      notifyProgressChanged({
        type: 'progress_imported',
        timestamp: new Date().toISOString(),
        merge: merge
      });
      
      logDebug('Progress data imported', { merge: merge });
      
      return true;
    } catch (error) {
      console.error('Error importing progress data:', error);
      return false;
    }
  }
  
  /**
   * Gets stats information
   * 
   * @returns {Object} - The stats object from progress data
   */
  function getStats() {
    if (!progressData || !progressData.stats) {
      return {
        totalTimeSpent: 0,
        lastActive: new Date().toISOString(),
        dailyStreak: 0,
        lastActivityDate: null
      };
    }
    
    return { ...progressData.stats };
  }
  
  /**
   * Gets all progress data
   * 
   * @returns {Object} - The complete progress data object
   */
  function getProgressData() {
    return progressData ? { ...progressData } : null;
  }
  
  /**
   * Sets category definitions
   * 
   * @param {Object} categories - Category definitions
   */
  function setCategoryDefinitions(categories) {
    categoryDefinitions = categories;
    logDebug('Category definitions updated', categories);
  }
  
  /**
   * Gets category definitions
   * 
   * @returns {Object} - The category definitions object
   */
  function getCategoryDefinitions() {
    return { ...categoryDefinitions };
  }
  
  /**
   * Public API
   */
  return {
    // Core functionality
    init: init,
    saveProgress: saveProgress,
    loadProgress: loadProgress,
    
    // Item progress management
    markItemCompleted: markItemCompleted,
    updateItemProgress: updateItemProgress,
    isItemCompleted: isItemCompleted,
    getItemProgress: getItemProgress,
    
    // Progress statistics
    getCompletedCount: getCompletedCount,
    getTotalCount: getTotalCount,
    getCompletionPercentage: getCompletionPercentage,
    getOverallProgress: getOverallProgress,
    getStats: getStats,
    
    // Achievement system
    registerAchievement: registerAchievement,
    checkAchievements: checkAchievements,
    getUnlockedAchievements: getUnlockedAchievements,
    getAllAchievements: getAllAchievements,
    
    // Data management
    resetAllProgress: resetAllProgress,
    exportProgressData: exportProgressData,
    importProgressData: importProgressData,
    
    // Configuration
    setCategoryDefinitions: setCategoryDefinitions,
    getCategoryDefinitions: getCategoryDefinitions,
    addProgressChangeCallback: addProgressChangeCallback,
    
    // Access to raw data (for debugging)
    getProgressData: getProgressData
  };
})();

// For backwards compatibility with existing code
const ProgressTrackingModule = ProgressTracker;

// Export the module if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = ProgressTracker;
}
