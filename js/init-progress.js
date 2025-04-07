/**
 * ESL Grammar Website - Progress Tracking Initialization
 * 
 * This file contains the configuration for the Progress Tracking Module
 * and handles its initialization across the website.
 */

// Create a self-executing function to avoid polluting the global namespace
(function() {
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    // Check if Progress Tracking Module is available
    if (typeof ProgressTracker === 'undefined' && typeof ProgressTrackingModule === 'undefined') {
      console.warn('Progress Tracking Module not loaded');
      return;
    }
    
    // Determine which module to use (support both naming conventions)
    const progressModule = typeof ProgressTracker !== 'undefined' ? ProgressTracker : ProgressTrackingModule;
    
    // Initialize with complete category definitions
    progressModule.init({
      categories: {
        activities: {
          // Grammar activities by type
          grammarActivities: [
            'mcq', 'gap-fill', 'matching', 'transformation',
            'drag-drop', 'error-correction', 'situations'
          ],
          // Grammar activities by topic
          practiceActivities: [
            'tenses-practice', 'conditionals-practice', 'modals-practice',
            'passive-practice', 'articles-practice', 'prepositions-practice',
            'wish-if-only'
          ]
        },
        lessons: {
          grammarLessons: [
            'tenses', 'conditionals', 'modals', 'passive', 
            'articles', 'prepositions', 'clauses',
            'wish-if-only'
          ],
          specialTopics: [
            'academic-writing', 'business-english', 'pronunciation'
          ]
        },
        assessments: {
          grammarTests: [
            'tenses-test', 'conditionals-test', 'modals-test',
            'passive-test', 'articles-test', 'prepositions-test'
          ],
          comprehensiveTests: [
            'mid-course-test', 'final-test'
          ]
        }
      },
      onProgressChange: updateProgressUI,
      storageKeyPrefix: 'esl-progress-',
      autoSaveInterval: 30000, // 30 seconds
      enableAchievements: true,
      debugMode: false
    });
    
    console.log('Progress Tracking Module initialized');
    
    // Run data migration if needed
    if (typeof migrateProgressData === 'function') {
      migrateProgressData();
    }
    
    // Initialize UI components if available
    initUIComponents();
  });
  
  /**
   * Updates UI elements based on progress changes
   * @param {Object} changeDetails - Details about the progress change
   */
  function updateProgressUI(changeDetails) {
    // This function will be called whenever progress changes
    console.log('Progress changed:', changeDetails);
    
    // Update progress displays if ProgressManagerUI is available
    if (typeof ProgressManagerUI !== 'undefined' && 
        typeof ProgressManagerUI.updateAllProgressComponents === 'function') {
      ProgressManagerUI.updateAllProgressComponents();
    }
    
    // Example: Update progress bar if it exists
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      if (typeof ProgressTracker !== 'undefined' && 
          typeof ProgressTracker.getOverallProgress === 'function') {
        const progress = ProgressTracker.getOverallProgress();
        if (progress && typeof progress.percentage === 'number') {
          progressBar.style.width = progress.percentage + '%';
        }
      } else if (typeof ProgressTrackingModule !== 'undefined' && 
                typeof ProgressTrackingModule.getOverallProgress === 'function') {
        const progress = ProgressTrackingModule.getOverallProgress();
        if (progress && typeof progress.percentage === 'number') {
          progressBar.style.width = progress.percentage + '%';
        }
      }
    }
    
    // Example: Show notification for achievements
    if (changeDetails.type === 'achievement_unlocked') {
      const achievement = changeDetails.details;
      if (achievement && typeof showFeedbackMessage === 'function') {
        showFeedbackMessage(
          `Achievement unlocked: ${achievement.title}`, 
          'success', 
          5000
        );
      }
    }
  }
  
  /**
   * Initialize UI components for progress display
   */
  function initUIComponents() {
    // Check if Progress Manager UI is available
    if (typeof ProgressManagerUI === 'undefined') {
      return;
    }
    
    // Determine which progress data provider to use
    const progressDataProvider = typeof ProgressTracker !== 'undefined' ? 
      ProgressTracker.getOverallProgress : 
      (typeof ProgressTrackingModule !== 'undefined' ? 
        ProgressTrackingModule.getOverallProgress : null);
    
    // Get category definitions
    const categoryDefinitions = typeof ProgressTracker !== 'undefined' ? 
      ProgressTracker.getCategoryDefinitions() : 
      (typeof ProgressTrackingModule !== 'undefined' ? 
        ProgressTrackingModule.getCategoryDefinitions() : null);
    
    // Initialize the UI components
    ProgressManagerUI.init({
      progressDataProvider: progressDataProvider,
      categoryDefinitions: categoryDefinitions,
      animateProgressBars: true,
      showPercentagesOnBars: true
    });
    
    // Initialize any pre-existing progress components on the page
    const progressContainers = document.querySelectorAll('[data-progress-display]');
    progressContainers.forEach(container => {
      const type = container.getAttribute('data-progress-type') || 'bar';
      const category = container.getAttribute('data-category');
      const itemId = container.getAttribute('data-item-id');
      
      switch (type) {
        case 'bar':
          ProgressManagerUI.createProgressBar(container.id, { category, itemId });
          break;
        case 'summary':
          ProgressManagerUI.createProgressSummary(container.id);
          break;
        case 'achievements':
          ProgressManagerUI.createAchievementDisplay(container.id, {
            showAll: container.getAttribute('data-show-all') === 'true'
          });
          break;
        case 'grid':
          ProgressManagerUI.createActivityGrid(container.id, { category });
          break;
      }
    });
  }
})();