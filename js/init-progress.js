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
          beginnerActivities: [
            'mcq-articles', 'drag-drop-articles',
            'mcq-prepositions-time-place', 'drag-drop-prepositions-time-place',
            'mcq-past-simple', 'drag-drop-past-simple',
            'mcq-countable-uncountable', 'drag-drop-countable-uncountable',
            'mcq-possessives', 'drag-drop-possessives',
            'mcq-present-continuous', 'drag-drop-present-continuous',
            'mcq-present-simple-vs-continuous', 'drag-drop-present-simple-vs-continuous',
            'mcq-present-simple', 'drag-drop-present-simple',
            'mcq-singular-plural-nouns', 'drag-drop-singular-plural-nouns',
            'mcq-subject-pronouns-be', 'drag-drop-subject-pronouns-be',
            'mcq-there-is-are', 'drag-drop-there-is-are'
          ],
          intermediateActivities: [
            'mcq-verb-to-get', 'drag-drop-verb-to-get',
            'mcq-still-vs-yet', 'drag-drop-still-vs-yet', 'matching-still-vs-yet'
          ],
          advancedActivities: [
            'mcq-present-perfect-progressive',
            'mcq-past-perfect-progressive-vs-past-perfect',
            'mcq-future-perfect-continuous',
            'mcq-advanced-present-perfect',
            'mcq-mixed-time-frames',
            'mcq-narrative-tenses',
            'mcq-perfect-infinitives-gerunds',
            'mcq-conditionals',
            'mcq-inverted-conditionals',
            'mcq-conditional-expressions',
            'wish-if-only',
            'mcq-modal-perfect-forms',
            'modal-progressive-mcq',
            'mcq-modal-differences',
            'mcq-modal-advanced-meanings',
            'mcq-mixed-modal-constructions',
            'mcq-passive-fundamentals',
            'mcq-passive-get-have',
            'mcq-passive-infinitives-gerunds',
            'mcq-passive-reporting-verbs',
            'mcq-passive-voice-summary',
            'mcq-double-passive',
            'mcq-relative-clauses',
            'mcq-that-clauses',
            'drag-drop-that-if-whether-clauses', 'mcq-nominal-clauses-review',
            'mcq-were-subjunctive', 'drag-drop-were-subjunctive',
            'mcq-present-subjunctive', 'drag-drop-present-subjunctive',
            'mcq-subjunctive-revision', 'drag-drop-subjunctive-revision',
            'mcq-inversion-emphasis', 'drag-drop-inversion-emphasis',
            'mcq-it-cleft-sentences', 'drag-drop-it-cleft-sentences',
            'mcq-participle-clauses', 'drag-drop-participle-clauses',
            'mcq-gerund-infinitive-meaning', 'gap-fill-gerund-infinitive-meaning',
            'gap-fill-gerund-infinitive-extra', 'matching-gerund-infinitive-extra',
            'drag-drop-gerund-infinitive-extra',
            'mcq-causative-verbs', 'drag-drop-causative-verbs',
            'mcq-reporting-verbs-patterns', 'drag-drop-reporting-verbs-patterns',
            'mcq-adverb-position', 'drag-drop-adverb-position',
            'mcq-multiple-adverbs', 'drag-drop-multiple-adverbs',
            'mcq-focusing-adverbs', 'drag-drop-focusing-adverbs',
            'mcq-comment-adverbs', 'drag-drop-comment-adverbs',
            'mcq-complex-prepositions', 'drag-drop-complex-prepositions',
            'mcq-dependent-prepositions', 'drag-drop-dependent-prepositions',
            'mcq-dependent-prepositions2', 'drag-drop-dependent-prepositions2'
          ]
        },
        lessons: {
          beginnerAndIntermediateLessons: [
            'present-simple-vs-continuous',
            'verb-to-get',
            'still-vs-yet'
          ],
          advancedLessons: [
            'present-perfect-progressive', 'past-perfect-progressive',
            'future-perfect-continuous', 'mixed-time-frames',
            'advanced-present-perfect', 'perfect-infinitives-gerunds',
            'narrative-tenses',
            'conditionals', 'inverted-conditionals',
            'conditional-expressions', 'wish-if-only',
            'modal-perfect-forms', 'modal-progressive',
            'modal-differences', 'modal-advanced-meanings',
            'mixed-modal-constructions',
            'passive-fundamentals', 'passive-get-have',
            'passive-infinitives-gerunds', 'passive-reporting-verbs',
            'passive-voice-summary', 'double-passive',
            'relative-clauses', 'that-clauses', 'nominal-clauses-review',
            'were-subjunctive', 'present-subjunctive', 'subjunctive-revision',
            'inversion-emphasis', 'it-cleft-sentences', 'participle-clauses',
            'gerund-infinitive-meaning-changes', 'causative-verbs',
            'reporting-verbs-patterns',
            'adverb-position', 'multiple-adverbs',
            'focusing-adverbs', 'comment-adverbs',
            'complex-prepositions', 'dependent-prepositions', 'dependent-prepositions2'
          ]
        },
        assessments: {
          grammarTests: []
        }
      },
      onProgressChange: updateProgressUI,
      storageKeyPrefix: 'esl-progress-',
      autoSaveInterval: 30000, // 30 seconds
      enableAchievements: true,
      debugMode: false
    });
    

    // Initialize UI components if available
    initUIComponents();
  });
  
  /**
   * Updates UI elements based on progress changes
   * @param {Object} changeDetails - Details about the progress change
   */
  function updateProgressUI(changeDetails) {
    // This function will be called whenever progress changes
    
    // Update progress displays if ProgressManagerUI is available
    if (typeof ProgressManagerUI !== 'undefined' && 
        typeof ProgressManagerUI.updateAllProgressComponents === 'function') {
      ProgressManagerUI.updateAllProgressComponents();
    }
    
    // Show notification for achievements
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
    
  }
})();