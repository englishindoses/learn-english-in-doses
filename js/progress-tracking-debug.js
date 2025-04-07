/**
 * Progress Tracking System - Debug Utility
 * 
 * This utility helps debug the progress tracking system by:
 * - Displaying current progress data
 * - Testing storage functionality
 * - Providing tools to manipulate progress data
 * - Simulating achievement unlocks
 * 
 * Include this file after progress-tracking.js in development environments.
 */

/**
 * ProgressDebug - Debug utility for the Progress Tracking System
 */
const ProgressDebug = (function() {
  // Private variables
  let debugPanelId = 'progress-debug-panel';
  let isInitialized = false;
  
  /**
   * Initializes the debug utility
   * 
   * @param {Object} config - Configuration options
   * @param {string} config.panelId - ID for the debug panel (default: 'progress-debug-panel')
   * @param {string} config.containerId - ID of container to append panel to (default: create floating panel)
   * @param {boolean} config.startMinimized - Whether to start with the panel minimized (default: true)
   * @returns {boolean} - Whether initialization was successful
   */
  function init(config = {}) {
    // Only initialize once
    if (isInitialized) return false;
    
    console.log('[ProgressDebug] Initializing debug utility');
    
    // Check if ProgressTracker is available
    if (typeof ProgressTracker === 'undefined') {
      console.error('[ProgressDebug] ProgressTracker module not found');
      return false;
    }
    
    // Set up configuration
    debugPanelId = config.panelId || 'progress-debug-panel';
    const containerId = config.containerId;
    const startMinimized = config.startMinimized !== undefined ? config.startMinimized : true;
    
    // Create debug panel
    createDebugPanel(containerId, startMinimized);
    
    // Set up event listeners
    setupEventListeners();
    
    isInitialized = true;
    return true;
  }
  
  /**
   * Creates the debug panel
   * 
   * @param {string} containerId - ID of container to append panel to
   * @param {boolean} startMinimized - Whether to start with the panel minimized
   */
  function createDebugPanel(containerId, startMinimized) {
    // Create panel container
    const panel = document.createElement('div');
    panel.id = debugPanelId;
    panel.className = 'progress-debug-panel';
    
    // Set panel styles
    if (!containerId) {
      // Floating panel if no container specified
      panel.style.position = 'fixed';
      panel.style.bottom = '20px';
      panel.style.right = '20px';
      panel.style.width = '400px';
      panel.style.maxWidth = '90vw';
      panel.style.maxHeight = '80vh';
      panel.style.overflowY = 'auto';
      panel.style.backgroundColor = 'rgba(240, 240, 240, 0.95)';
      panel.style.border = '1px solid #ccc';
      panel.style.borderRadius = '8px';
      panel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      panel.style.zIndex = '9999';
      panel.style.fontFamily = 'monospace';
      panel.style.fontSize = '14px';
      panel.style.padding = '10px';
    } else {
      // Fixed panel if container specified
      panel.style.backgroundColor = '#f8f9fa';
      panel.style.border = '1px solid #ddd';
      panel.style.borderRadius = '8px';
      panel.style.fontFamily = 'monospace';
      panel.style.fontSize = '14px';
      panel.style.padding = '10px';
      panel.style.marginBottom = '20px';
    }
    
    // Add title bar
    const titleBar = document.createElement('div');
    titleBar.className = 'debug-panel-title';
    titleBar.style.display = 'flex';
    titleBar.style.justifyContent = 'space-between';
    titleBar.style.alignItems = 'center';
    titleBar.style.marginBottom = '10px';
    titleBar.style.cursor = 'pointer';
    
    const title = document.createElement('h3');
    title.textContent = 'Progress Tracking Debug';
    title.style.margin = '0';
    title.style.fontSize = '16px';
    
    const buttonContainer = document.createElement('div');
    
    // Add minimize/expand button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = startMinimized ? '▼' : '▲';
    toggleButton.className = 'debug-toggle-button';
    toggleButton.style.background = 'none';
    toggleButton.style.border = 'none';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.fontSize = '16px';
    toggleButton.style.padding = '5px';
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.className = 'debug-close-button';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '16px';
    closeButton.style.padding = '5px';
    closeButton.style.marginLeft = '5px';
    
    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(closeButton);
    
    titleBar.appendChild(title);
    titleBar.appendChild(buttonContainer);
    panel.appendChild(titleBar);
    
    // Add content container
    const content = document.createElement('div');
    content.className = 'debug-panel-content';
    if (startMinimized) {
      content.style.display = 'none';
    }
    panel.appendChild(content);
    
    // Create debug tools section
    const toolsSection = document.createElement('div');
    toolsSection.className = 'debug-section';
    
    const toolsTitle = document.createElement('h4');
    toolsTitle.textContent = 'Debug Tools';
    toolsTitle.style.borderBottom = '1px solid #ccc';
    toolsTitle.style.paddingBottom = '5px';
    toolsTitle.style.marginBottom = '10px';
    toolsSection.appendChild(toolsTitle);
    
    // Add tool buttons
    const toolButtons = document.createElement('div');
    toolButtons.style.display = 'flex';
    toolButtons.style.flexWrap = 'wrap';
    toolButtons.style.gap = '5px';
    toolButtons.style.marginBottom = '10px';
    
    // Refresh button
    const refreshButton = createButton('Refresh Data', refreshDebugData);
    toolButtons.appendChild(refreshButton);
    
    // Clear progress button
    const clearButton = createButton('Reset Progress', resetProgress);
    clearButton.style.backgroundColor = '#dc3545';
    clearButton.style.color = 'white';
    toolButtons.appendChild(clearButton);
    
    // Export button
    const exportButton = createButton('Export Progress', exportProgress);
    toolButtons.appendChild(exportButton);
    
    // Import button
    const importButton = createButton('Import Progress', importProgress);
    toolButtons.appendChild(importButton);
    
    // Simulate achievement button
    const achieveButton = createButton('Simulate Achievement', simulateAchievement);
    toolButtons.appendChild(achieveButton);
    
    toolsSection.appendChild(toolButtons);
    content.appendChild(toolsSection);
    
    // Create data display section
    const dataSection = document.createElement('div');
    dataSection.className = 'debug-section';
    
    const dataTitle = document.createElement('h4');
    dataTitle.textContent = 'Current Progress Data';
    dataTitle.style.borderBottom = '1px solid #ccc';
    dataTitle.style.paddingBottom = '5px';
    dataTitle.style.marginBottom = '10px';
    dataSection.appendChild(dataTitle);
    
    const dataDisplay = document.createElement('pre');
    dataDisplay.className = 'debug-data';
    dataDisplay.style.backgroundColor = '#f0f0f0';
    dataDisplay.style.padding = '10px';
    dataDisplay.style.borderRadius = '4px';
    dataDisplay.style.overflow = 'auto';
    dataDisplay.style.maxHeight = '300px';
    dataDisplay.style.fontSize = '12px';
    dataDisplay.style.whiteSpace = 'pre-wrap';
    dataDisplay.style.wordBreak = 'break-word';
    dataSection.appendChild(dataDisplay);
    
    content.appendChild(dataSection);
    
    // Create localStorage section
    const storageSection = document.createElement('div');
    storageSection.className = 'debug-section';
    
    const storageTitle = document.createElement('h4');
    storageTitle.textContent = 'localStorage Status';
    storageTitle.style.borderBottom = '1px solid #ccc';
    storageTitle.style.paddingBottom = '5px';
    storageTitle.style.marginBottom = '10px';
    storageSection.appendChild(storageTitle);
    
    const storageDisplay = document.createElement('pre');
    storageDisplay.className = 'debug-storage';
    storageDisplay.style.backgroundColor = '#f0f0f0';
    storageDisplay.style.padding = '10px';
    storageDisplay.style.borderRadius = '4px';
    storageDisplay.style.overflow = 'auto';
    storageDisplay.style.maxHeight = '200px';
    storageDisplay.style.fontSize = '12px';
    storageDisplay.style.whiteSpace = 'pre-wrap';
    storageDisplay.style.wordBreak = 'break-word';
    storageSection.appendChild(storageDisplay);
    
    content.appendChild(storageSection);
    
    // Add to page
    if (containerId) {
      const container = document.getElementById(containerId);
      if (container) {
        container.appendChild(panel);
      } else {
        document.body.appendChild(panel);
      }
    } else {
      document.body.appendChild(panel);
    }
    
    // Initial data refresh
    refreshDebugData();
  }
  
  /**
   * Creates a styled button
   * 
   * @param {string} text - Button text
   * @param {Function} clickHandler - Click event handler
   * @returns {HTMLButtonElement} - The created button
   */
  function createButton(text, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.padding = '5px 10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '12px';
    
    if (typeof clickHandler === 'function') {
      button.addEventListener('click', clickHandler);
    }
    
    return button;
  }
  
  /**
   * Sets up event listeners for the debug panel
   */
  function setupEventListeners() {
    document.addEventListener('click', function(event) {
      // Toggle panel visibility
      if (event.target.matches('.debug-toggle-button')) {
        const panel = document.getElementById(debugPanelId);
        const content = panel.querySelector('.debug-panel-content');
        const isVisible = content.style.display !== 'none';
        
        content.style.display = isVisible ? 'none' : 'block';
        event.target.textContent = isVisible ? '▼' : '▲';
      }
      
      // Close panel
      if (event.target.matches('.debug-close-button')) {
        const panel = document.getElementById(debugPanelId);
        if (panel) {
          panel.remove();
        }
      }
    });
    
    // Listen for progress changes
    if (typeof ProgressTracker !== 'undefined' && 
        typeof ProgressTracker.addProgressChangeCallback === 'function') {
      ProgressTracker.addProgressChangeCallback(function() {
        refreshDebugData();
      });
    }
  }
  
  /**
   * Refreshes the debug data display
   */
  function refreshDebugData() {
    const panel = document.getElementById(debugPanelId);
    if (!panel) return;
    
    try {
      // Get progress data
      let progressData = null;
      
      if (typeof ProgressTracker !== 'undefined') {
        if (typeof ProgressTracker.getProgressData === 'function') {
          progressData = ProgressTracker.getProgressData();
        }
      }
      
      // Update data display
      const dataDisplay = panel.querySelector('.debug-data');
      if (dataDisplay) {
        dataDisplay.textContent = progressData ? 
          JSON.stringify(progressData, null, 2) : 
          'Progress data not available';
      }
      
      // Check localStorage
      const storageDisplay = panel.querySelector('.debug-storage');
      if (storageDisplay) {
        let storageInfo = 'localStorage Status:\n\n';
        
        try {
          // Check if localStorage is available
          const testKey = `__storage_test_${Math.random().toString(36).substring(2)}`;
          localStorage.setItem(testKey, testKey);
          const result = localStorage.getItem(testKey) === testKey;
          localStorage.removeItem(testKey);
          
          storageInfo += `localStorage available: ${result}\n\n`;
          
          if (result) {
            // Get storage usage
            let totalBytes = 0;
            const items = [];
            
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              const value = localStorage.getItem(key);
              const bytes = (key.length + value.length) * 2; // Approximate size in bytes
              totalBytes += bytes;
              
              // Push item info
              items.push({
                key: key,
                size: bytes,
                preview: value.length > 50 ? `${value.substring(0, 50)}...` : value
              });
            }
            
            // Sort by size (largest first)
            items.sort((a, b) => b.size - a.size);
            
            // Calculate KB
            const totalKB = (totalBytes / 1024).toFixed(2);
            
            storageInfo += `Total storage used: ${totalKB} KB (${totalBytes} bytes)\n`;
            storageInfo += `Number of items: ${localStorage.length}\n\n`;
            storageInfo += 'Progress-related items:\n';
            
            // List items related to progress tracking
            const progressItems = items.filter(item => 
              item.key.includes('progress') || 
              item.key.includes('esl-progress')
            );
            
            if (progressItems.length > 0) {
              progressItems.forEach(item => {
                storageInfo += `${item.key}: ${item.size} bytes\n`;
              });
            } else {
              storageInfo += 'No progress-related items found\n';
            }
          }
        } catch (e) {
          storageInfo += `localStorage error: ${e.message}\n`;
        }
        
        storageDisplay.textContent = storageInfo;
      }
      
      console.log('[ProgressDebug] Debug data refreshed');
    } catch (error) {
      console.error('[ProgressDebug] Error refreshing debug data:', error);
    }
  }
  
  /**
   * Resets progress data
   */
  function resetProgress() {
    try {
      if (typeof ProgressTracker !== 'undefined' && 
          typeof ProgressTracker.resetAllProgress === 'function') {
        // Double-check with the user
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
          ProgressTracker.resetAllProgress(false);
          refreshDebugData();
          console.log('[ProgressDebug] Progress reset');
          alert('Progress has been reset');
        }
      } else {
        console.error('[ProgressDebug] ProgressTracker.resetAllProgress not available');
      }
    } catch (error) {
      console.error('[ProgressDebug] Error resetting progress:', error);
    }
  }
  
  /**
   * Exports progress data to JSON
   */
  function exportProgress() {
    try {
      if (typeof ProgressTracker !== 'undefined' && 
          typeof ProgressTracker.exportProgressData === 'function') {
        const jsonData = ProgressTracker.exportProgressData();
        
        // Create download link
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `progress-export-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('[ProgressDebug] Progress exported');
      } else {
        console.error('[ProgressDebug] ProgressTracker.exportProgressData not available');
      }
    } catch (error) {
      console.error('[ProgressDebug] Error exporting progress:', error);
    }
  }
  
  /**
   * Imports progress data from JSON
   */
  function importProgress() {
    try {
      if (typeof ProgressTracker !== 'undefined' && 
          typeof ProgressTracker.importProgressData === 'function') {
        // Create file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        
        input.onchange = function(event) {
          const file = event.target.files[0];
          if (!file) return;
          
          const reader = new FileReader();
          
          reader.onload = function(e) {
            const contents = e.target.result;
            
            try {
              // Verify it's valid JSON
              JSON.parse(contents);
              
              // Ask about merge vs replace
              const shouldMerge = confirm(
                'Do you want to merge this data with existing progress?\n\n' +
                'Press OK to merge, or Cancel to replace all existing progress.'
              );
              
              // Import the data
              ProgressTracker.importProgressData(contents, shouldMerge);
              refreshDebugData();
              console.log('[ProgressDebug] Progress imported');
              alert('Progress data has been imported successfully');
            } catch (error) {
              console.error('[ProgressDebug] Invalid JSON file:', error);
              alert('Error: Invalid JSON file');
            }
          };
          
          reader.readAsText(file);
        };
        
        input.click();
      } else {
        console.error('[ProgressDebug] ProgressTracker.importProgressData not available');
      }
    } catch (error) {
      console.error('[ProgressDebug] Error importing progress:', error);
    }
  }
  
  /**
   * Simulates achievement unlock
   */
  function simulateAchievement() {
    try {
      // Check for ProgressTracker
      if (typeof ProgressTracker === 'undefined') {
        console.error('[ProgressDebug] ProgressTracker not available');
        return;
      }
      
      // Get all achievements
      let achievements = [];
      
      if (typeof ProgressTracker.getAllAchievements === 'function') {
        achievements = ProgressTracker.getAllAchievements();
      }
      
      if (achievements.length === 0) {
        console.warn('[ProgressDebug] No achievements defined');
        alert('No achievements defined in the system');
        return;
      }
      
      // Show dialog to choose achievement
      const lockedAchievements = achievements.filter(a => !a.unlocked);
      
      if (lockedAchievements.length === 0) {
        alert('All achievements are already unlocked');
        return;
      }
      
      const options = lockedAchievements.map(a => `${a.icon} ${a.title}`);
      
      // Create a simple dialog for selecting achievement
      const dialogContainer = document.createElement('div');
      dialogContainer.style.position = 'fixed';
      dialogContainer.style.top = '0';
      dialogContainer.style.left = '0';
      dialogContainer.style.width = '100%';
      dialogContainer.style.height = '100%';
      dialogContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      dialogContainer.style.display = 'flex';
      dialogContainer.style.justifyContent = 'center';
      dialogContainer.style.alignItems = 'center';
      dialogContainer.style.zIndex = '10000';
      
      const dialog = document.createElement('div');
      dialog.style.backgroundColor = 'white';
      dialog.style.padding = '20px';
      dialog.style.borderRadius = '8px';
      dialog.style.maxWidth = '400px';
      dialog.style.width = '90%';
      
      const title = document.createElement('h3');
      title.textContent = 'Select achievement to simulate';
      title.style.marginTop = '0';
      dialog.appendChild(title);
      
      const list = document.createElement('div');
      list.style.maxHeight = '300px';
      list.style.overflowY = 'auto';
      list.style.marginBottom = '20px';
      
      lockedAchievements.forEach((achievement, index) => {
        const item = document.createElement('div');
        item.className = 'achievement-option';
        item.setAttribute('data-index', index);
        item.style.padding = '10px';
        item.style.cursor = 'pointer';
        item.style.borderBottom = '1px solid #eee';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        
        const icon = document.createElement('span');
        icon.textContent = achievement.icon;
        icon.style.fontSize = '24px';
        icon.style.marginRight = '10px';
        item.appendChild(icon);
        
        const details = document.createElement('div');
        
        const name = document.createElement('div');
        name.textContent = achievement.title;
        name.style.fontWeight = 'bold';
        details.appendChild(name);
        
        const description = document.createElement('div');
        description.textContent = achievement.description;
        description.style.fontSize = '14px';
        description.style.color = '#666';
        details.appendChild(description);
        
        item.appendChild(details);
        
        item.addEventListener('mouseover', function() {
          item.style.backgroundColor = '#f0f0f0';
        });
        
        item.addEventListener('mouseout', function() {
          item.style.backgroundColor = '';
        });
        
        item.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          unlockAchievement(lockedAchievements[index].id);
          dialogContainer.remove();
        });
        
        list.appendChild(item);
      });
      
      dialog.appendChild(list);
      
      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.justifyContent = 'flex-end';
      
      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancel';
      cancelButton.style.padding = '8px 16px';
      cancelButton.style.marginLeft = '10px';
      cancelButton.style.border = '1px solid #ccc';
      cancelButton.style.borderRadius = '4px';
      cancelButton.style.backgroundColor = '#f0f0f0';
      cancelButton.style.cursor = 'pointer';
      
      cancelButton.addEventListener('click', function() {
        dialogContainer.remove();
      });
      
      buttonContainer.appendChild(cancelButton);
      dialog.appendChild(buttonContainer);
      
      dialogContainer.appendChild(dialog);
      document.body.appendChild(dialogContainer);
    } catch (error) {
      console.error('[ProgressDebug] Error simulating achievement:', error);
    }
  }
  
  /**
   * Unlocks an achievement manually
   * 
   * @param {string} achievementId - ID of the achievement to unlock
   */
  function unlockAchievement(achievementId) {
    try {
      // This is a hack to force an achievement to unlock
      // We'll directly manipulate progress data for this purpose
      
      if (typeof ProgressTracker === 'undefined' || 
          typeof ProgressTracker.getProgressData !== 'function') {
        console.error('[ProgressDebug] ProgressTracker not available');
        return;
      }
      
      // Get current progress data
      const progressData = ProgressTracker.getProgressData();
      
      if (!progressData) {
        console.error('[ProgressDebug] Progress data not available');
        return;
      }
      
      // Get achievement definitions
      let achievement = null;
      
      if (typeof ProgressTracker.getAllAchievements === 'function') {
        const achievements = ProgressTracker.getAllAchievements();
        achievement = achievements.find(a => a.id === achievementId);
      }
      
      if (!achievement) {
        console.error(`[ProgressDebug] Achievement "${achievementId}" not found`);
        return;
      }
      
      // Initialize achievements object if needed
      if (!progressData.achievements) {
        progressData.achievements = {};
      }
      
      // Mark achievement as unlocked
      progressData.achievements[achievementId] = {
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon
      };
      
      // Save progress data
      if (typeof ProgressTracker.saveProgress === 'function') {
        ProgressTracker.saveProgress();
      }
      
      // Check achievements to trigger notification
      if (typeof ProgressTracker.checkAchievements === 'function') {
        ProgressTracker.checkAchievements();
      }
      
      refreshDebugData();
      console.log(`[ProgressDebug] Achievement "${achievementId}" unlocked`);
    } catch (error) {
      console.error('[ProgressDebug] Error unlocking achievement:', error);
    }
  }
  
  /**
   * Logs the current progress data to console
   */
  function logProgressData() {
    try {
      if (typeof ProgressTracker !== 'undefined' && 
          typeof ProgressTracker.getProgressData === 'function') {
        const progressData = ProgressTracker.getProgressData();
        console.log('Current progress data:', progressData);
        
        // Log stats
        if (typeof ProgressTracker.getOverallProgress === 'function') {
          const stats = ProgressTracker.getOverallProgress();
          console.log('Progress statistics:', stats);
        }
        
        // Log achievements
        if (typeof ProgressTracker.getAllAchievements === 'function') {
          const achievements = ProgressTracker.getAllAchievements();
          console.log('Achievements:', achievements);
        }
      } else {
        console.error('[ProgressDebug] ProgressTracker.getProgressData not available');
      }
    } catch (error) {
      console.error('[ProgressDebug] Error logging progress data:', error);
    }
  }
  
  /**
   * Creates a test activity
   * 
   * @param {string} category - Category for the activity
   * @param {string} id - ID suffix for the activity (timestamp will be prepended)
   */
  function createTestActivity(category = 'activities', id = null) {
    try {
      if (typeof ProgressTracker !== 'undefined' && 
          typeof ProgressTracker.markItemCompleted === 'function') {
        // Generate a unique ID if not provided
        const activityId = id || `test-activity-${Date.now()}`;
        
        // Create a random score
        const maxScore = 10;
        const score = Math.floor(Math.random() * (maxScore + 1));
        
        // Mark the activity as completed
        ProgressTracker.markItemCompleted(category, activityId, {
          score: score,
          maxScore: maxScore,
          title: `Test Activity: ${activityId}`,
          completed: true,
          completedAt: new Date().toISOString()
        });
        
        refreshDebugData();
        console.log(`[ProgressDebug] Test activity "${activityId}" created`);
      } else {
        console.error('[ProgressDebug] ProgressTracker.markItemCompleted not available');
      }
    } catch (error) {
      console.error('[ProgressDebug] Error creating test activity:', error);
    }
  }
  
  /**
   * Public API
   */
  return {
    init: init,
    refreshDebugData: refreshDebugData,
    resetProgress: resetProgress,
    exportProgress: exportProgress,
    importProgress: importProgress,
    logProgressData: logProgressData,
    createTestActivity: createTestActivity,
    unlockAchievement: unlockAchievement
  };
})();

// Auto-initialize after the page loads if debug mode is enabled
document.addEventListener('DOMContentLoaded', function() {
  // Check for debug mode flag in URL or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const debugModeParam = urlParams.get('debug');
  const debugModeStorage = localStorage.getItem('debug-mode');
  
  if (debugModeParam === 'true' || debugModeStorage === 'true') {
    ProgressDebug.init({
      startMinimized: true
    });
    
    console.log('[ProgressDebug] Debug mode enabled');
  }
});
