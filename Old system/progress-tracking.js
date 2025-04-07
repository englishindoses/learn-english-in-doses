/**
 * ESL Grammar Website - Progress Tracking Module
 * 
 * This module handles all functionality related to tracking student progress:
 * - Tracking completion status of activities and lessons
 * - Calculating and displaying overall and per-section progress
 * - Saving and loading progress data using localStorage
 * - Visually representing progress with progress bars
 * - Providing achievement notifications and summaries
 */

/**
 * ProgressTrackingModule - Provides functionality for tracking student progress
 */
const ProgressTrackingModule = (function() {
  // Private variables
  let progressData = {};
  let categoryDefinitions = {};
  let globalSettings = {
    saveToLocalStorage: true,
    storageKeyPrefix: 'esl-progress-',
    enableAchievements: true,
    showDetailedStats: true,
    autoSaveInterval: 30000, // 30 seconds
  };
  let autoSaveTimer = null;
  let achievementCallbacks = {};
  let progressChangeCallbacks = [];
  
  /**
   * Initializes the Progress Tracking module
   * 
   * @param {Object} config - Configuration object
   * @param {Object} config.categories - Definition of progress categories and their items
   * @param {boolean} config.saveToLocalStorage - Whether to save progress to localStorage (default: true)
   * @param {string} config.storageKeyPrefix - Prefix for localStorage keys (default: 'esl-progress-')
   * @param {boolean} config.enableAchievements - Whether to enable achievement tracking (default: true)
   * @param {boolean} config.showDetailedStats - Whether to show detailed stats in progress UI (default: true)
   * @param {number} config.autoSaveInterval - Interval for auto-saving progress in ms (default: 30000)
   * @param {Function} config.onProgressChange - Callback function for progress changes
   */
  function init(config = {}) {
    // Update global settings
    if (config.saveToLocalStorage !== undefined) globalSettings.saveToLocalStorage = config.saveToLocalStorage;
    if (config.storageKeyPrefix) globalSettings.storageKeyPrefix = config.storageKeyPrefix;
    if (config.enableAchievements !== undefined) globalSettings.enableAchievements = config.enableAchievements;
    if (config.showDetailedStats !== undefined) globalSettings.showDetailedStats = config.showDetailedStats;
    if (config.autoSaveInterval !== undefined) globalSettings.autoSaveInterval = config.autoSaveInterval;
    
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
    
    // Load existing progress from localStorage
    loadProgress();
    
    // Set up auto-save timer
    if (globalSettings.autoSaveInterval > 0) {
      setupAutoSave();
    }
    
    // Set up listeners for activity completion events
    setupActivityCompletionListener();

    // Check for achievements after import
    checkAchievements();
  }
  
  /**
   * Sets up auto-save timer
   */
  function setupAutoSave() {
    // Clear any existing timer
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
    }
    
    // Set up new timer
    autoSaveTimer = setInterval(function() {
      saveProgress();
    }, globalSettings.autoSaveInterval);
  }
  
  /**
   * Sets up listener for activity completion events
   */
  function setupActivityCompletionListener() {
    document.addEventListener('activityCompleted', function(e) {
      if (e.detail && e.detail.activityId) {
        markItemCompleted('activities', e.detail.activityId, e.detail);
        
        // NOTE: We don't call checkAchievements() here as it's already called in markItemCompleted
      }
    });
    
    // Legacy support for modules that might not use the event system
    if (typeof window !== 'undefined') {
      window.markActivityCompleted = function(activityId, details = {}) {
        markItemCompleted('activities', activityId, details);
      };
    }
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
  }
  
  /**
   * Loads progress data from localStorage
   */
  function loadProgress() {
    if (!globalSettings.saveToLocalStorage || typeof localStorage === 'undefined') {
      progressData = {
        activities: {},
        lessons: {},
        assessments: {},
        stats: {
          totalTimeSpent: 0,
          lastActive: new Date().toISOString(),
          dailyStreak: 0,
          lastActivityDate: null
        },
        achievements: {}
      };
      return;
    }
    
    try {
      const savedData = localStorage.getItem(`${globalSettings.storageKeyPrefix}data`);
      
      if (savedData) {
        progressData = JSON.parse(savedData);
        
        // Initialize missing sections if needed
        if (!progressData.activities) progressData.activities = {};
        if (!progressData.lessons) progressData.lessons = {};
        if (!progressData.assessments) progressData.assessments = {};
        if (!progressData.achievements) progressData.achievements = {};
        if (!progressData.stats) {
          progressData.stats = {
            totalTimeSpent: 0,
            lastActive: new Date().toISOString(),
            dailyStreak: 0,
            lastActivityDate: null
          };
        }
        
        // Update daily streak based on last activity date
        updateDailyStreak();
        
        // Import activity data from individual activity modules
        importLegacyActivityData();
      } else {
        // Initialize with empty data
        progressData = {
          activities: {},
          lessons: {},
          assessments: {},
          stats: {
            totalTimeSpent: 0,
            lastActive: new Date().toISOString(),
            dailyStreak: 0,
            lastActivityDate: null
          },
          achievements: {}
        };
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
      
      // Initialize with empty data on error
      progressData = {
        activities: {},
        lessons: {},
        assessments: {},
        stats: {
          totalTimeSpent: 0,
          lastActive: new Date().toISOString(),
          dailyStreak: 0,
          lastActivityDate: null
        },
        achievements: {}
      };
    }
  }
  
  /**
   * Import activity progress data stored by individual modules
   */
  function importLegacyActivityData() {
    if (typeof localStorage === 'undefined') return;
    
    try {
      // Find all localStorage keys ending with "-progress"
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.endsWith('-progress')) {
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
                title: activityData.title || activityId
              };
            }
          } catch (e) {
            console.warn(`Could not import activity data for ${key}:`, e);
          }
        }
      }
      
      // Save the imported data to ensure it's consolidated
      saveProgress();
    } catch (error) {
      console.error('Error importing legacy activity data:', error);
    }
  }
  
  /**
   * Saves progress data to localStorage
   */
  function saveProgress() {
    if (!globalSettings.saveToLocalStorage || typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      // Update last active timestamp
      if (progressData.stats) {
        progressData.stats.lastActive = new Date().toISOString();
      }
      
      localStorage.setItem(`${globalSettings.storageKeyPrefix}data`, JSON.stringify(progressData));
    } catch (error) {
      console.error('Error saving progress data:', error);
    }
  }
  
  /**
   * Updates the daily streak counter
   */
  function updateDailyStreak() {
    if (!progressData.stats) return;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    if (!progressData.stats.lastActivityDate) {
      // First activity
      progressData.stats.lastActivityDate = today;
      progressData.stats.dailyStreak = 1;
      return;
    }
    
    const lastActive = new Date(progressData.stats.lastActivityDate).getTime();
    const yesterday = today - (24 * 60 * 60 * 1000);
    
    if (lastActive === today) {
      // Already logged activity today
      return;
    } else if (lastActive === yesterday) {
      // Consecutive day
      progressData.stats.lastActivityDate = today;
      progressData.stats.dailyStreak++;
    } else if (lastActive < yesterday) {
      // Streak broken
      progressData.stats.lastActivityDate = today;
      progressData.stats.dailyStreak = 1;
    }
    
    // Save changes
    saveProgress();
  }
  
  /**
   * Marks an item as completed
   * 
   * @param {string} category - Category of the item ('activities', 'lessons', 'assessments')
   * @param {string} itemId - ID of the item
   * @param {Object} details - Additional details about the completion
   */
  function markItemCompleted(category, itemId, details = {}) {
    if (!progressData[category]) {
      progressData[category] = {};
    }
    
    // Create or update the item data
    progressData[category][itemId] = {
      completed: true,
      completedAt: new Date().toISOString(),
      score: details.score || null,
      maxScore: details.maxScore || null,
      timeSpent: details.timeSpent || null,
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
    if (globalSettings.enableAchievements) {
      checkAchievements();
    }
    
    return progressData[category][itemId];
  }
  
  /**
   * Updates an item's progress without marking it as completed
   * 
   * @param {string} category - Category of the item ('activities', 'lessons', 'assessments')
   * @param {string} itemId - ID of the item
   * @param {Object} details - Progress details to update
   */
  function updateItemProgress(category, itemId, details = {}) {
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
    return !!(progressData[category] && 
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
    if (!progressData[category] || !progressData[category][itemId]) {
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
    if (!progressData[category]) return 0;
    
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
    if (!categoryDefinitions[category]) return 0;
    
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
   * Calculates overall progress across all categories
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
   * Updates progress display elements in the DOM
   * 
   * @param {Object} selectors - Object mapping progress elements to CSS selectors
   */
  function updateProgressDisplay(selectors = {}) {
    const defaultSelectors = {
      overallProgressBar: '#overall-progress-bar',
      overallProgressText: '#overall-progress-text',
      activitiesProgressBar: '#activities-progress-bar',
      lessonsProgressBar: '#lessons-progress-bar',
      assessmentsProgressBar: '#assessments-progress-bar',
      streakCounter: '#streak-counter',
      completedActivities: '#completed-activities',
      completedLessons: '#completed-lessons',
      detailsContainer: '#progress-details'
    };
    
    const finalSelectors = { ...defaultSelectors, ...selectors };
    
    // Calculate progress
    const progress = getOverallProgress();
    
    // Update progress bars
    updateProgressBar(finalSelectors.overallProgressBar, progress.percentage);
    updateProgressBar(finalSelectors.activitiesProgressBar, progress.categories.activities.percentage);
    updateProgressBar(finalSelectors.lessonsProgressBar, progress.categories.lessons.percentage);
    updateProgressBar(finalSelectors.assessmentsProgressBar, progress.categories.assessments.percentage);
    
    // Update text elements
    updateTextContent(finalSelectors.overallProgressText, `${progress.percentage}% Complete (${progress.completed}/${progress.total})`);
    updateTextContent(finalSelectors.streakCounter, progressData.stats.dailyStreak || 0);
    updateTextContent(finalSelectors.completedActivities, progress.categories.activities.completed);
    updateTextContent(finalSelectors.completedLessons, progress.categories.lessons.completed);
    
    // Update detailed progress if enabled
    if (globalSettings.showDetailedStats) {
      updateDetailedProgress(finalSelectors.detailsContainer);
    }
  }
  
  /**
   * Updates a progress bar element
   * 
   * @param {string} selector - CSS selector for the progress bar
   * @param {number} percentage - Percentage to display (0-100)
   */
  function updateProgressBar(selector, percentage) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    // For standard progress elements
    if (element.tagName === 'PROGRESS') {
      element.value = percentage;
      return;
    }
    
    // For div-based progress bars
    element.style.width = `${percentage}%`;
    
    // If there's an aria attribute, update it
    if (element.hasAttribute('aria-valuenow')) {
      element.setAttribute('aria-valuenow', percentage);
    }
  }
  
  /**
   * Updates text content of an element
   * 
   * @param {string} selector - CSS selector for the element
   * @param {string} text - Text content to set
   */
  function updateTextContent(selector, text) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    element.textContent = text;
  }
  
  /**
   * Updates detailed progress information
   * 
   * @param {string} selector - CSS selector for the container
   */
  function updateDetailedProgress(selector) {
    const container = document.querySelector(selector);
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Get category data
    const categories = ['activities', 'lessons', 'assessments'];
    
    categories.forEach(category => {
      if (!categoryDefinitions[category]) return;
      
      // Create category section
      const categorySection = document.createElement('div');
      categorySection.className = 'progress-category';
      
      // Add category title
      const categoryTitle = document.createElement('h3');
      categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      categorySection.appendChild(categoryTitle);
      
      // Add subcategories
      Object.entries(categoryDefinitions[category]).forEach(([subcategoryKey, items]) => {
        // Create subcategory container
        const subcategoryContainer = document.createElement('div');
        subcategoryContainer.className = 'progress-subcategory';
        
        // Add subcategory title
        const subcategoryTitle = document.createElement('h4');
        subcategoryTitle.textContent = subcategoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        subcategoryContainer.appendChild(subcategoryTitle);
        
        // Calculate subcategory progress
        const completedItems = items.filter(itemId => isItemCompleted(category, itemId)).length;
        const totalItems = items.length;
        const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        
        // Add progress bar
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.width = `${percentage}%`;
        
        const progressText = document.createElement('span');
        progressText.className = 'progress-text';
        progressText.textContent = `${completedItems}/${totalItems} (${percentage}%)`;
        
        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(progressText);
        subcategoryContainer.appendChild(progressContainer);
        
        categorySection.appendChild(subcategoryContainer);
      });
      
      container.appendChild(categorySection);
    });
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
    if (!globalSettings.enableAchievements) return;
    
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
      }
    });
  }
  
  /**
   * Gets all unlocked achievements
   * 
   * @returns {Array} - Array of unlocked achievements
   */
  function getUnlockedAchievements() {
    if (!progressData.achievements) return [];
    
    return Object.entries(progressData.achievements)
      .filter(([id, achievement]) => achievement.unlocked)
      .map(([id, achievement]) => ({
        id,
        ...achievement
      }));
  }
  
  /**
   * Shows an achievement notification
   * 
   * @param {string} achievementId - ID of the unlocked achievement
   */
  function showAchievementNotification(achievementId) {
    if (!progressData.achievements[achievementId]) return;
    
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
   * Creates a progress report view
   * 
   * @param {string} containerId - ID of container to insert the progress report
   */
  function createProgressReport(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Calculate progress
    const progress = getOverallProgress();
    
    // Create overall progress section
    const overallSection = document.createElement('div');
    overallSection.className = 'progress-report-section';
    
    const overallTitle = document.createElement('h2');
    overallTitle.textContent = 'Overall Progress';
    overallSection.appendChild(overallTitle);
    
    const overallBar = document.createElement('div');
    overallBar.className = 'progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.width = `${progress.percentage}%`;
    overallBar.appendChild(progressBar);
    
    const progressText = document.createElement('div');
    progressText.className = 'progress-text';
    progressText.textContent = `${progress.percentage}% Complete (${progress.completed}/${progress.total})`;
    overallBar.appendChild(progressText);
    
    overallSection.appendChild(overallBar);
    container.appendChild(overallSection);
    
    // Create category progress sections
    Object.entries(progress.categories).forEach(([category, categoryProgress]) => {
      const categorySection = document.createElement('div');
      categorySection.className = 'progress-report-section';
      
      const categoryTitle = document.createElement('h3');
      categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      categorySection.appendChild(categoryTitle);
      
      const categoryBar = document.createElement('div');
      categoryBar.className = 'progress-container';
      
      const catProgressBar = document.createElement('div');
      catProgressBar.className = 'progress-bar';
      catProgressBar.style.width = `${categoryProgress.percentage}%`;
      categoryBar.appendChild(catProgressBar);
      
      const catProgressText = document.createElement('div');
      catProgressText.className = 'progress-text';
      catProgressText.textContent = `${categoryProgress.percentage}% Complete (${categoryProgress.completed}/${categoryProgress.total})`;
      categoryBar.appendChild(catProgressText);
      
      categorySection.appendChild(categoryBar);
      
      // Add subcategory details if category definitions exist
      if (categoryDefinitions[category]) {
        const subcategoriesList = document.createElement('div');
        subcategoriesList.className = 'subcategories-list';
        
        Object.entries(categoryDefinitions[category]).forEach(([subcategoryKey, items]) => {
          // Calculate subcategory progress
          const completedItems = items.filter(itemId => isItemCompleted(category, itemId)).length;
          const totalItems = items.length;
          const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
          
          // Create subcategory container
          const subcategoryItem = document.createElement('div');
          subcategoryItem.className = 'subcategory-item';
          
          const subcategoryTitle = document.createElement('div');
          subcategoryTitle.className = 'subcategory-title';
          subcategoryTitle.textContent = subcategoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          subcategoryItem.appendChild(subcategoryTitle);
          
          const subcategoryProgress = document.createElement('div');
          subcategoryProgress.className = 'subcategory-progress';
          subcategoryProgress.textContent = `${completedItems}/${totalItems} (${percentage}%)`;
          subcategoryItem.appendChild(subcategoryProgress);
          
          subcategoriesList.appendChild(subcategoryItem);
        });
        
        categorySection.appendChild(subcategoriesList);
      }
      
      container.appendChild(categorySection);
    });
    
    // Add streak information
    if (progressData.stats && progressData.stats.dailyStreak) {
      const streakSection = document.createElement('div');
      streakSection.className = 'progress-report-section streak-section';
      
      const streakTitle = document.createElement('h3');
      streakTitle.textContent = 'Activity Streak';
      streakSection.appendChild(streakTitle);
      
      const streakContent = document.createElement('div');
      streakContent.className = 'streak-content';
      
      const streakIcon = document.createElement('span');
      streakIcon.className = 'streak-icon';
      streakIcon.textContent = '🔥';
      streakContent.appendChild(streakIcon);
      
      const streakText = document.createElement('span');
      streakText.className = 'streak-text';
      streakText.textContent = `${progressData.stats.dailyStreak} day${progressData.stats.dailyStreak !== 1 ? 's' : ''} in a row!`;
      streakContent.appendChild(streakText);
      
      streakSection.appendChild(streakContent);
      container.appendChild(streakSection);
    }
    
    // Add achievements section
    const unlockedAchievements = getUnlockedAchievements();
    
    if (unlockedAchievements.length > 0) {
      const achievementsSection = document.createElement('div');
      achievementsSection.className = 'progress-report-section achievements-section';
      
      const achievementsTitle = document.createElement('h3');
      achievementsTitle.textContent = 'Achievements';
      achievementsSection.appendChild(achievementsTitle);
      
      const achievementsList = document.createElement('div');
      achievementsList.className = 'achievements-list';
      
      unlockedAchievements.forEach(achievement => {
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement-item';
        
        const achievementIcon = document.createElement('span');
        achievementIcon.className = 'achievement-icon';
        achievementIcon.textContent = achievement.icon || '🏆';
        achievementItem.appendChild(achievementIcon);
        
        const achievementText = document.createElement('div');
        achievementText.className = 'achievement-text';
        
        const achievementTitle = document.createElement('div');
        achievementTitle.className = 'achievement-title';
        achievementTitle.textContent = achievement.title;
        achievementText.appendChild(achievementTitle);
        
        const achievementDesc = document.createElement('div');
        achievementDesc.className = 'achievement-description';
        achievementDesc.textContent = achievement.description;
        achievementText.appendChild(achievementDesc);
        
        achievementItem.appendChild(achievementText);
        achievementsList.appendChild(achievementItem);
      });
      
      achievementsSection.appendChild(achievementsList);
      container.appendChild(achievementsSection);
    }
  }
  
  /**
   * Creates a visual progress grid for a category
   * 
   * @param {string} containerId - ID of container to insert the grid
   * @param {string} category - Category to visualize
   * @param {string} subcategory - Optional subcategory to filter by
   */
  function createProgressGrid(containerId, category, subcategory = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Check if category definition exists
    if (!categoryDefinitions[category]) {
      container.textContent = 'No data available for this category.';
      return;
    }
    
    // Filter items by subcategory if specified
    let itemsToShow = {};
    
    if (subcategory && categoryDefinitions[category][subcategory]) {
      itemsToShow[subcategory] = categoryDefinitions[category][subcategory];
    } else {
      itemsToShow = categoryDefinitions[category];
    }
    
    // Create grid
    const grid = document.createElement('div');
    grid.className = 'progress-grid';
    
    // Create items for each subcategory
    Object.entries(itemsToShow).forEach(([subcat, items]) => {
      // Add subcategory header
      const subcatHeader = document.createElement('h3');
      subcatHeader.className = 'subcategory-header';
      subcatHeader.textContent = subcat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      grid.appendChild(subcatHeader);
      
      // Create grid row for items
      const gridRow = document.createElement('div');
      gridRow.className = 'grid-row';
      
      // Add items
      items.forEach(itemId => {
        const itemElement = document.createElement('div');
        itemElement.className = 'grid-item';
        itemElement.setAttribute('data-item-id', itemId);
        
        // Check completion status
        const isCompleted = isItemCompleted(category, itemId);
        if (isCompleted) {
          itemElement.classList.add('completed');
        }
        
        // Add item content
        const itemContent = document.createElement('div');
        itemContent.className = 'item-content';
        
        // Try to get a friendly name from the item ID
        let displayName = itemId
          .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
          .replace(/[-_]/g, ' ')      // Replace dashes and underscores with spaces
          .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
        
        // Truncate if too long
        if (displayName.length > 15) {
          displayName = displayName.substring(0, 12) + '...';
        }
        
        itemContent.textContent = displayName;
        
        // Add completion status icon
        const statusIcon = document.createElement('span');
        statusIcon.className = 'status-icon';
        statusIcon.textContent = isCompleted ? '✓' : '○';
        itemElement.appendChild(statusIcon);
        
        itemElement.appendChild(itemContent);
        gridRow.appendChild(itemElement);
      });
      
      grid.appendChild(gridRow);
    });
    
    container.appendChild(grid);
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
   * This is a destructive operation and should be used with caution
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
      progressData = {
        activities: {},
        lessons: {},
        assessments: {},
        stats: {
          totalTimeSpent: 0,
          lastActive: new Date().toISOString(),
          dailyStreak: 0,
          lastActivityDate: null
        },
        achievements: {}
      };
      
      // Save to localStorage
      saveProgress();
      
      // Clear all other progress-related localStorage items
      if (typeof localStorage !== 'undefined') {
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
        progressData = importedData;
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
      
      return true;
    } catch (error) {
      console.error('Error importing progress data:', error);
      return false;
    }
  }
  
  /**
   * Sets category definitions
   * 
   * @param {Object} categories - Category definitions
   */
  function setCategoryDefinitions(categories) {
    categoryDefinitions = categories;
  }

  /**
   * Gets all progress data
   * 
   * @returns {Object} - The complete progress data object
   */
  function getProgressData() {
    return progressData;
  }
  
  /**
   * Gets category definitions
   * 
   * @returns {Object} - The category definitions object
   */
  function getCategoryDefinitions() {
    return categoryDefinitions;
  }
  
  /**
   * Gets all achievements (both locked and unlocked)
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
        unlocked: !!(progressData.achievements && 
                  progressData.achievements[id] && 
                  progressData.achievements[id].unlocked)
      };
      
      achievements.push(achievement);
    });
    
    return achievements;
  }

  /**
   * Gets stats information
   * 
   * @returns {Object} - The stats object from progress data
   */
  function getStats() {
    return progressData.stats || {
      totalTimeSpent: 0,
      lastActive: new Date().toISOString(),
      dailyStreak: 0,
      lastActivityDate: null
    };
  }
  
  // Public API
  return {
    init: init,
    saveProgress: saveProgress,
    loadProgress: loadProgress,
    markItemCompleted: markItemCompleted,
    updateItemProgress: updateItemProgress,
    isItemCompleted: isItemCompleted,
    getItemProgress: getItemProgress,
    getCompletedCount: getCompletedCount,
    getTotalCount: getTotalCount,
    getCompletionPercentage: getCompletionPercentage,
    getOverallProgress: getOverallProgress,
    updateProgressDisplay: updateProgressDisplay,
    registerAchievement: registerAchievement,
    checkAchievements: checkAchievements,
    getUnlockedAchievements: getUnlockedAchievements,
    createProgressReport: createProgressReport,
    createProgressGrid: createProgressGrid,
    addProgressChangeCallback: addProgressChangeCallback,
    resetAllProgress: resetAllProgress,
    exportProgressData: exportProgressData,
    importProgressData: importProgressData,
    setCategoryDefinitions: setCategoryDefinitions,
    // Methods for direct data access
    getProgressData: getProgressData,
    getCategoryDefinitions: getCategoryDefinitions,
    getAllAchievements: getAllAchievements,
    getStats: getStats
  };
})();

// Export the module if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = ProgressTrackingModule;
}