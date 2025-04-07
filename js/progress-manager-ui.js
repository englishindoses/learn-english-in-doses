/**
 * ESL Grammar Website - Progress Manager UI Component
 * 
 * This module provides UI components for displaying and managing progress:
 * - Progress bars with percentage display
 * - Achievement displays
 * - Activity completion indicators
 * - Progress summary components
 */

/**
 * ProgressManagerUI - UI components for displaying and managing progress
 */
const ProgressManagerUI = (function() {
  // Private variables
  let settings = {
    progressDataProvider: null, // Function that returns progress data
    categoryDefinitions: null,
    animateProgressBars: true,
    showPercentagesOnBars: true,
    defaultContainerClass: 'progress-display',
    barClass: 'progress-bar',
    containerSelector: '.progress-component',
    debug: false
  };
  
  /**
   * Initializes the Progress Manager UI module
   * 
   * @param {Object} config - Configuration options
   * @param {Function} config.progressDataProvider - Function that returns progress data
   * @param {Object} config.categoryDefinitions - Definition of progress categories
   * @param {boolean} config.animateProgressBars - Whether to animate progress bars
   * @param {boolean} config.showPercentagesOnBars - Whether to show percentages on bars
   * @param {string} config.defaultContainerClass - Default class for container elements
   * @param {string} config.barClass - Class for progress bar elements
   * @param {string} config.containerSelector - Selector for progress container elements
   * @param {boolean} config.debug - Enable debug mode
   */
  function init(config = {}) {
    // Update settings
    Object.assign(settings, config);
    
    logDebug('ProgressManagerUI initialized with settings:', settings);
    
    // Find and initialize existing progress components
    initExistingComponents();
    
    // Set up listener for progress updates from ProgressTracker
    setupProgressUpdateListener();
    
    return true;
  }
  
  /**
   * Logs debug information if debug mode is enabled
   * 
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  function logDebug(message, data) {
    if (settings.debug) {
      if (data !== undefined) {
        console.log(`[ProgressManagerUI] ${message}:`, data);
      } else {
        console.log(`[ProgressManagerUI] ${message}`);
      }
    }
  }
  
  /**
   * Initializes any existing progress components on the page
   */
  function initExistingComponents() {
    const containers = document.querySelectorAll(settings.containerSelector);
    
    logDebug(`Found ${containers.length} progress components to initialize`);
    
    containers.forEach(container => {
      try {
        const type = container.getAttribute('data-progress-type') || 'bar';
        const category = container.getAttribute('data-category');
        const itemId = container.getAttribute('data-item-id');
        
        logDebug(`Initializing ${type} component for ${category || 'overall'}${itemId ? '/' + itemId : ''}`);
        
        // Initialize based on type
        switch (type) {
          case 'bar':
            initProgressBar(container, category, itemId);
            break;
          case 'achievement':
            initAchievementDisplay(container);
            break;
          case 'summary':
            initProgressSummary(container);
            break;
          case 'activity-grid':
            initActivityGrid(container, category);
            break;
          default:
            logDebug(`Unknown progress component type: ${type}`);
        }
      } catch (error) {
        console.error('Error initializing progress component:', error);
      }
    });
  }
  
  /**
   * Sets up listener for progress updates from ProgressTracker
   */
  function setupProgressUpdateListener() {
    if (typeof ProgressTracker !== 'undefined' && 
        typeof ProgressTracker.addProgressChangeCallback === 'function') {
      ProgressTracker.addProgressChangeCallback(handleProgressUpdate);
      logDebug('Progress update listener set up');
    } else {
      logDebug('ProgressTracker not available, progress updates will not be automatic');
    }
  }
  
  /**
   * Handles progress update events from ProgressTracker
   * 
   * @param {Object} details - Details about the progress change
   */
  function handleProgressUpdate(details) {
    logDebug('Progress update received', details);
    
    // Update all progress components
    updateAllProgressComponents();
  }
  
  /**
   * Updates all progress components on the page
   */
  function updateAllProgressComponents() {
    const containers = document.querySelectorAll(settings.containerSelector);
    
    logDebug(`Updating ${containers.length} progress components`);
    
    containers.forEach(container => {
      try {
        const type = container.getAttribute('data-progress-type') || 'bar';
        
        // Update based on type
        switch (type) {
          case 'bar':
            updateProgressBar(container);
            break;
          case 'achievement':
            updateAchievementDisplay(container);
            break;
          case 'summary':
            updateProgressSummary(container);
            break;
          case 'activity-grid':
            updateActivityGrid(container);
            break;
        }
      } catch (error) {
        console.error('Error updating progress component:', error);
      }
    });
  }
  
  /**
   * Gets progress data from the configured provider
   * 
   * @returns {Object|null} - Progress data or null if not available
   */
  function getProgressData() {
    if (typeof settings.progressDataProvider === 'function') {
      return settings.progressDataProvider();
    } else if (typeof ProgressTracker !== 'undefined' && 
               typeof ProgressTracker.getOverallProgress === 'function') {
      return ProgressTracker.getOverallProgress();
    }
    
    return null;
  }
  
  /**
   * Initializes a progress bar component
   * 
   * @param {HTMLElement} container - The container element
   * @param {string} category - Optional category (e.g. 'activities', 'lessons')
   * @param {string} itemId - Optional specific item ID
   */
  function initProgressBar(container, category, itemId) {
    // Check if container already has a progress bar
    if (container.querySelector('.' + settings.barClass)) {
      logDebug('Progress bar already exists in container, updating instead');
      updateProgressBar(container);
      return;
    }
    
    // Create progress bar elements
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-bar-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = settings.barClass;
    progressContainer.appendChild(progressBar);
    
    // Add percentage label if enabled
    if (settings.showPercentagesOnBars) {
      const percentageLabel = document.createElement('span');
      percentageLabel.className = 'progress-percentage';
      progressContainer.appendChild(percentageLabel);
    }
    
    // Add to container
    container.appendChild(progressContainer);
    
    // Update the progress bar
    updateProgressBar(container);
  }
  
  /**
   * Updates a progress bar component
   * 
   * @param {HTMLElement} container - The container element
   */
  function updateProgressBar(container) {
    try {
      const category = container.getAttribute('data-category');
      const itemId = container.getAttribute('data-item-id');
      
      let percentage = 0;
      
      // Get progress data
      if (category && itemId) {
        // Specific item progress
        if (typeof ProgressTracker !== 'undefined' && 
            typeof ProgressTracker.getItemProgress === 'function') {
          const itemProgress = ProgressTracker.getItemProgress(category, itemId);
          if (itemProgress && itemProgress.progress !== undefined) {
            percentage = itemProgress.progress;
          } else if (itemProgress && itemProgress.completed) {
            percentage = 100;
          }
        }
      } else if (category) {
        // Category progress
        if (typeof ProgressTracker !== 'undefined' && 
            typeof ProgressTracker.getCompletionPercentage === 'function') {
          percentage = ProgressTracker.getCompletionPercentage(category);
        } else {
          const progressData = getProgressData();
          if (progressData && progressData.categories && progressData.categories[category]) {
            percentage = progressData.categories[category].percentage;
          }
        }
      } else {
        // Overall progress
        const progressData = getProgressData();
        if (progressData) {
          percentage = progressData.percentage;
        }
      }
      
      // Update the progress bar
      const progressBar = container.querySelector('.' + settings.barClass);
      if (progressBar) {
        // Animate if enabled, otherwise just set immediately
        if (settings.animateProgressBars) {
          animateProgressBar(progressBar, percentage);
        } else {
          progressBar.style.width = `${percentage}%`;
        }
        
        // Update aria attributes
        progressBar.setAttribute('aria-valuenow', percentage);
      }
      
      // Update percentage label if present
      const percentageLabel = container.querySelector('.progress-percentage');
      if (percentageLabel) {
        percentageLabel.textContent = `${percentage}%`;
      }
      
      logDebug(`Updated progress bar to ${percentage}%`, { category, itemId });
    } catch (error) {
      console.error('Error updating progress bar:', error);
    }
  }
  
  /**
   * Animates a progress bar to a target percentage
   * 
   * @param {HTMLElement} progressBar - The progress bar element
   * @param {number} targetPercentage - The target percentage
   */
  function animateProgressBar(progressBar, targetPercentage) {
    // Get current width
    const currentWidth = parseFloat(progressBar.style.width) || 0;
    
    // If we have a significant change, animate
    if (Math.abs(currentWidth - targetPercentage) > 1) {
      // Use requestAnimationFrame for smooth animation
      const startTime = performance.now();
      const duration = 800; // ms
      
      function step(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function: easeOutQuad
        const easing = 1 - (1 - progress) * (1 - progress);
        
        const currentPercentage = currentWidth + (targetPercentage - currentWidth) * easing;
        progressBar.style.width = `${currentPercentage}%`;
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // Ensure we end exactly at target
          progressBar.style.width = `${targetPercentage}%`;
        }
      }
      
      requestAnimationFrame(step);
    } else {
      // Small change, just set it directly
      progressBar.style.width = `${targetPercentage}%`;
    }
  }
  
  /**
   * Initializes an achievement display component
   * 
   * @param {HTMLElement} container - The container element
   */
  function initAchievementDisplay(container) {
    // Create container for achievements
    const achievementsContainer = document.createElement('div');
    achievementsContainer.className = 'achievements-container';
    container.appendChild(achievementsContainer);
    
    // Update the achievement display
    updateAchievementDisplay(container);
  }
  
  /**
   * Updates an achievement display component
   * 
   * @param {HTMLElement} container - The container element
   */
  function updateAchievementDisplay(container) {
    try {
      const achievementsContainer = container.querySelector('.achievements-container');
      if (!achievementsContainer) return;
      
      // Clear existing achievements
      achievementsContainer.innerHTML = '';
      
      // Get achievements
      let achievements = [];
      
      if (typeof ProgressTracker !== 'undefined') {
        const showAll = container.getAttribute('data-show-all') === 'true';
        
        if (showAll && typeof ProgressTracker.getAllAchievements === 'function') {
          achievements = ProgressTracker.getAllAchievements();
        } else if (typeof ProgressTracker.getUnlockedAchievements === 'function') {
          achievements = ProgressTracker.getUnlockedAchievements();
        }
      }
      
      // Display achievements
      if (achievements.length === 0) {
        const noAchievements = document.createElement('div');
        noAchievements.className = 'no-achievements';
        noAchievements.textContent = 'No achievements unlocked yet. Keep learning!';
        achievementsContainer.appendChild(noAchievements);
      } else {
        achievements.forEach(achievement => {
          const achievementCard = createAchievementCard(achievement);
          achievementsContainer.appendChild(achievementCard);
        });
      }
      
      logDebug(`Updated achievement display with ${achievements.length} achievements`);
    } catch (error) {
      console.error('Error updating achievement display:', error);
    }
  }
  
  /**
   * Creates an achievement card element
   * 
   * @param {Object} achievement - The achievement data
   * @returns {HTMLElement} - The achievement card element
   */
  function createAchievementCard(achievement) {
    const card = document.createElement('div');
    card.className = 'achievement-card';
    
    if (!achievement.unlocked) {
      card.classList.add('locked');
    }
    
    // Icon
    const icon = document.createElement('div');
    icon.className = 'achievement-icon';
    icon.textContent = achievement.icon || '🏆';
    card.appendChild(icon);
    
    // Title
    const title = document.createElement('div');
    title.className = 'achievement-title';
    title.textContent = achievement.title;
    card.appendChild(title);
    
    // Description
    const description = document.createElement('div');
    description.className = 'achievement-description';
    description.textContent = achievement.description;
    card.appendChild(description);
    
    // Unlock date for unlocked achievements
    if (achievement.unlocked && achievement.unlockedAt) {
      const unlockDate = document.createElement('div');
      unlockDate.className = 'achievement-unlock-date';
      
      // Format date nicely
      const date = new Date(achievement.unlockedAt);
      unlockDate.textContent = `Unlocked: ${date.toLocaleDateString()}`;
      
      card.appendChild(unlockDate);
    } else if (!achievement.unlocked) {
      // Locked overlay
      const lockedOverlay = document.createElement('div');
      lockedOverlay.className = 'locked-overlay';
      lockedOverlay.textContent = '🔒';
      card.appendChild(lockedOverlay);
    }
    
    return card;
  }
  
  /**
   * Initializes a progress summary component
   * 
   * @param {HTMLElement} container - The container element
   */
  function initProgressSummary(container) {
    // Create summary elements
    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'progress-summary';
    
    // Overall progress
    const overallSection = document.createElement('div');
    overallSection.className = 'progress-summary-section';
    
    const overallTitle = document.createElement('h3');
    overallTitle.textContent = 'Overall Progress';
    overallSection.appendChild(overallTitle);
    
    const overallProgress = document.createElement('div');
    overallProgress.className = 'progress-bar-container';
    
    const overallBar = document.createElement('div');
    overallBar.className = settings.barClass + ' overall-progress-bar';
    overallProgress.appendChild(overallBar);
    
    const overallPercentage = document.createElement('span');
    overallPercentage.className = 'progress-percentage overall-percentage';
    overallProgress.appendChild(overallPercentage);
    
    overallSection.appendChild(overallProgress);
    
    const overallStats = document.createElement('div');
    overallStats.className = 'progress-stats overall-stats';
    overallSection.appendChild(overallStats);
    
    summaryContainer.appendChild(overallSection);
    
    // Categories progress
    const categoriesSection = document.createElement('div');
    categoriesSection.className = 'progress-summary-section';
    
    const categoriesTitle = document.createElement('h3');
    categoriesTitle.textContent = 'Categories';
    categoriesSection.appendChild(categoriesTitle);
    
    const categoriesList = document.createElement('div');
    categoriesList.className = 'categories-list';
    categoriesSection.appendChild(categoriesList);
    
    summaryContainer.appendChild(categoriesSection);
    
    // Add to container
    container.appendChild(summaryContainer);
    
    // Update the summary
    updateProgressSummary(container);
  }
  
  /**
   * Updates a progress summary component
   * 
   * @param {HTMLElement} container - The container element
   */
  function updateProgressSummary(container) {
    try {
      // Get progress data
      const progressData = getProgressData();
      if (!progressData) return;
      
      // Update overall progress
      const overallBar = container.querySelector('.overall-progress-bar');
      if (overallBar) {
        if (settings.animateProgressBars) {
          animateProgressBar(overallBar, progressData.percentage);
        } else {
          overallBar.style.width = `${progressData.percentage}%`;
        }
      }
      
      const overallPercentage = container.querySelector('.overall-percentage');
      if (overallPercentage) {
        overallPercentage.textContent = `${progressData.percentage}%`;
      }
      
      const overallStats = container.querySelector('.overall-stats');
      if (overallStats) {
        overallStats.textContent = `${progressData.completed}/${progressData.total} items completed`;
      }
      
      // Update categories
      const categoriesList = container.querySelector('.categories-list');
      if (categoriesList) {
        // Clear existing categories
        categoriesList.innerHTML = '';
        
        // Add each category
        Object.entries(progressData.categories).forEach(([category, categoryData]) => {
          // Skip empty categories
          if (categoryData.total === 0) return;
          
          const categoryItem = document.createElement('div');
          categoryItem.className = 'category-item';
          
          const categoryHeader = document.createElement('div');
          categoryHeader.className = 'category-header';
          
          const categoryName = document.createElement('span');
          categoryName.className = 'category-name';
          categoryName.textContent = formatCategoryName(category);
          categoryHeader.appendChild(categoryName);
          
          const categoryPercentage = document.createElement('span');
          categoryPercentage.className = 'category-percentage';
          categoryPercentage.textContent = `${categoryData.percentage}%`;
          categoryHeader.appendChild(categoryPercentage);
          
          categoryItem.appendChild(categoryHeader);
          
          const categoryProgress = document.createElement('div');
          categoryProgress.className = 'progress-bar-container';
          
          const categoryBar = document.createElement('div');
          categoryBar.className = settings.barClass + ' category-progress-bar';
          categoryBar.style.width = `${categoryData.percentage}%`;
          categoryProgress.appendChild(categoryBar);
          
          categoryItem.appendChild(categoryProgress);
          
          const categoryStats = document.createElement('div');
          categoryStats.className = 'category-stats';
          categoryStats.textContent = `${categoryData.completed}/${categoryData.total} completed`;
          categoryItem.appendChild(categoryStats);
          
          categoriesList.appendChild(categoryItem);
        });
      }
      
      logDebug('Updated progress summary', progressData);
    } catch (error) {
      console.error('Error updating progress summary:', error);
    }
  }
  
  /**
   * Formats a category name for display
   * 
   * @param {string} category - The category name
   * @returns {string} - The formatted category name
   */
  function formatCategoryName(category) {
    return category
      .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .replace(/-/g, ' '); // Replace dashes with spaces
  }
  
  /**
   * Initializes an activity grid component
   * 
   * @param {HTMLElement} container - The container element
   * @param {string} category - The category to display
   */
  function initActivityGrid(container, category) {
    // Set default category if not provided
    if (!category) {
      category = 'activities';
    }
    
    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'activity-grid';
    gridContainer.setAttribute('data-category', category);
    container.appendChild(gridContainer);
    
    // Update the grid
    updateActivityGrid(container);
  }
  
  /**
   * Updates an activity grid component
   * 
   * @param {HTMLElement} container - The container element
   */
  function updateActivityGrid(container) {
    try {
      const gridContainer = container.querySelector('.activity-grid');
      if (!gridContainer) return;
      
      const category = gridContainer.getAttribute('data-category') || 'activities';
      
      // Clear existing grid
      gridContainer.innerHTML = '';
      
      // Get category definitions
      let categoryItems = {};
      
      if (settings.categoryDefinitions && settings.categoryDefinitions[category]) {
        categoryItems = settings.categoryDefinitions[category];
      } else if (typeof ProgressTracker !== 'undefined' && 
                typeof ProgressTracker.getCategoryDefinitions === 'function') {
        const definitions = ProgressTracker.getCategoryDefinitions();
        if (definitions && definitions[category]) {
          categoryItems = definitions[category];
        }
      }
      
      // If no items found, show message
      if (Object.keys(categoryItems).length === 0) {
        const noItems = document.createElement('div');
        noItems.className = 'no-items-message';
        noItems.textContent = `No ${category} defined.`;
        gridContainer.appendChild(noItems);
        return;
      }
      
      // Create grid for each subcategory
      Object.entries(categoryItems).forEach(([subcategory, items]) => {
        // Skip if no items
        if (!Array.isArray(items) || items.length === 0) return;
        
        // Create subcategory section
        const subcategorySection = document.createElement('div');
        subcategorySection.className = 'subcategory-section';
        
        const subcategoryTitle = document.createElement('h4');
        subcategoryTitle.className = 'subcategory-title';
        subcategoryTitle.textContent = formatCategoryName(subcategory);
        subcategorySection.appendChild(subcategoryTitle);
        
        // Create grid for items
        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'items-grid';
        
        // Add each item
        items.forEach(itemId => {
          const itemElement = createActivityGridItem(category, itemId);
          itemsGrid.appendChild(itemElement);
        });
        
        subcategorySection.appendChild(itemsGrid);
        gridContainer.appendChild(subcategorySection);
      });
      
      logDebug(`Updated activity grid for ${category}`);
    } catch (error) {
      console.error('Error updating activity grid:', error);
    }
  }
  
  /**
   * Creates an activity grid item
   * 
   * @param {string} category - The category
   * @param {string} itemId - The item ID
   * @returns {HTMLElement} - The grid item element
   */
  function createActivityGridItem(category, itemId) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item';
    gridItem.setAttribute('data-item-id', itemId);
    
    // Check completion status
    let isCompleted = false;
    let itemTitle = formatItemId(itemId);
    let itemProgress = null;
    
    if (typeof ProgressTracker !== 'undefined') {
      if (typeof ProgressTracker.isItemCompleted === 'function') {
        isCompleted = ProgressTracker.isItemCompleted(category, itemId);
      }
      
      if (typeof ProgressTracker.getItemProgress === 'function') {
        itemProgress = ProgressTracker.getItemProgress(category, itemId);
        if (itemProgress && itemProgress.title) {
          itemTitle = itemProgress.title;
        }
      }
    }
    
    // Add completion status
    if (isCompleted) {
      gridItem.classList.add('completed');
    }
    
    // Add item content
    const itemContent = document.createElement('div');
    itemContent.className = 'item-content';
    
    // Add content based on item type
    if (category === 'activities') {
      const activityTitle = document.createElement('div');
      activityTitle.className = 'activity-title';
      activityTitle.textContent = itemTitle;
      itemContent.appendChild(activityTitle);
      
      if (itemProgress && itemProgress.score !== undefined && itemProgress.maxScore !== undefined) {
        const scoreElement = document.createElement('div');
        scoreElement.className = 'activity-score';
        scoreElement.textContent = `Score: ${itemProgress.score}/${itemProgress.maxScore}`;
        itemContent.appendChild(scoreElement);
      }
    } else {
      // Generic item
      itemContent.textContent = itemTitle;
    }
    
    // Add completion status icon
    const statusIcon = document.createElement('span');
    statusIcon.className = 'status-icon';
    statusIcon.textContent = isCompleted ? '✓' : '○';
    gridItem.appendChild(statusIcon);
    
    gridItem.appendChild(itemContent);
    
    // Add click handler if URL is available
    if (itemProgress && itemProgress.url) {
      gridItem.classList.add('clickable');
      gridItem.addEventListener('click', function() {
        window.location.href = itemProgress.url;
      });
    }
    
    return gridItem;
  }
  
  /**
   * Formats an item ID for display
   * 
   * @param {string} itemId - The item ID
   * @returns {string} - The formatted item ID
   */
  function formatItemId(itemId) {
    return itemId
      .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .replace(/-/g, ' ') // Replace dashes with spaces
      .replace(/_/g, ' '); // Replace underscores with spaces
  }
  
  /**
   * Creates a simple progress bar that can be added to any element
   * 
   * @param {string} containerId - ID of container to add progress bar to
   * @param {Object} options - Progress bar options
   * @param {string} options.category - Optional category for specific progress
   * @param {string} options.itemId - Optional item ID for specific progress
   * @param {boolean} options.showPercentage - Whether to show percentage text
   * @param {boolean} options.animate - Whether to animate the progress bar
   * @returns {HTMLElement} - The created progress bar container
   */
  function createProgressBar(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found`);
      return null;
    }
    
    // Create progress component
    const progressComponent = document.createElement('div');
    progressComponent.className = settings.defaultContainerClass;
    progressComponent.classList.add(settings.containerSelector.substring(1));
    progressComponent.setAttribute('data-progress-type', 'bar');
    
    // Set category and item ID if provided
    if (options.category) {
      progressComponent.setAttribute('data-category', options.category);
    }
    
    if (options.itemId) {
      progressComponent.setAttribute('data-item-id', options.itemId);
    }
    
    // Initialize progress bar
    initProgressBar(progressComponent);
    
    // Add to container
    container.appendChild(progressComponent);
    
    return progressComponent;
  }
  
  /**
   * Creates an achievement display that can be added to any element
   * 
   * @param {string} containerId - ID of container to add achievement display to
   * @param {Object} options - Achievement display options
   * @param {boolean} options.showAll - Whether to show all achievements or only unlocked ones
   * @returns {HTMLElement} - The created achievement display container
   */
  function createAchievementDisplay(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found`);
      return null;
    }
    
    // Create achievement component
    const achievementComponent = document.createElement('div');
    achievementComponent.className = settings.defaultContainerClass;
    achievementComponent.classList.add(settings.containerSelector.substring(1));
    achievementComponent.setAttribute('data-progress-type', 'achievement');
    
    // Set show all if provided
    if (options.showAll) {
      achievementComponent.setAttribute('data-show-all', 'true');
    }
    
    // Initialize achievement display
    initAchievementDisplay(achievementComponent);
    
    // Add to container
    container.appendChild(achievementComponent);
    
    return achievementComponent;
  }
  
  /**
   * Creates a progress summary that can be added to any element
   * 
   * @param {string} containerId - ID of container to add progress summary to
   * @returns {HTMLElement} - The created progress summary container
   */
  function createProgressSummary(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found`);
      return null;
    }
    
    // Create summary component
    const summaryComponent = document.createElement('div');
    summaryComponent.className = settings.defaultContainerClass;
    summaryComponent.classList.add(settings.containerSelector.substring(1));
    summaryComponent.setAttribute('data-progress-type', 'summary');
    
    // Initialize progress summary
    initProgressSummary(summaryComponent);
    
    // Add to container
    container.appendChild(summaryComponent);
    
    return summaryComponent;
  }
  
  /**
   * Creates an activity grid that can be added to any element
   * 
   * @param {string} containerId - ID of container to add activity grid to
   * @param {Object} options - Activity grid options
   * @param {string} options.category - Category to display in grid
   * @returns {HTMLElement} - The created activity grid container
   */
  function createActivityGrid(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found`);
      return null;
    }
    
    // Create grid component
    const gridComponent = document.createElement('div');
    gridComponent.className = settings.defaultContainerClass;
    gridComponent.classList.add(settings.containerSelector.substring(1));
    gridComponent.setAttribute('data-progress-type', 'activity-grid');
    
    // Set category if provided
    if (options.category) {
      gridComponent.setAttribute('data-category', options.category);
    }
    
    // Initialize activity grid
    initActivityGrid(gridComponent, options.category);
    
    // Add to container
    container.appendChild(gridComponent);
    
    return gridComponent;
  }
  
  /**
   * Public API
   */
  return {
    // Initialization
    init: init,
    
    // Component creation
    createProgressBar: createProgressBar,
    createAchievementDisplay: createAchievementDisplay,
    createProgressSummary: createProgressSummary,
    createActivityGrid: createActivityGrid,
    
    // Manual updates
    updateAllProgressComponents: updateAllProgressComponents
  };
})();

// Export the module if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = ProgressManagerUI;
}
