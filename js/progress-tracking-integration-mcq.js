/**
 * Integration example showing how to connect the MCQ module with
 * the Progress Tracking system.
 * 
 * This should be included after loading the core scripts:
 * - progress-tracking.js
 * - progress-manager-ui.js
 * - mcq.js
 */

document.addEventListener('DOMContentLoaded', function() {
  // Define the grammar topic and its associated IDs
  const grammarTopic = "Present Perfect Progressive"; // Change to match page topic
  const activityId = "mcq-present-perfect-progressive"; // Unique ID for this activity
  const lessonId = "present-perfect-progressive"; // Lesson this activity belongs to
  
  // 1. Initialize Progress Tracking System
  // ===================================
  // This should typically be done in a common script loaded on all pages
  if (typeof ProgressTracker !== 'undefined') {
    ProgressTracker.init({
      categories: {
        activities: {
          grammarActivities: [
            'mcq-present-perfect-progressive', 'mcq-past-perfect-progressive',
            'gap-fill-present-perfect-progressive', 'transformation-present-perfect-progressive',
            // Add all your activities here
          ],
          // Other activity subcategories...
        },
        lessons: {
          grammarLessons: [
            'present-perfect-progressive', 'past-perfect-progressive',
            'future-perfect', 'modal-perfect-forms',
            // Add all your lessons here
          ],
          // Other lesson subcategories...
        },
        // Other categories...
      }
    });
    
    // Optional: initialize UI components
    if (typeof ProgressManagerUI !== 'undefined') {
      ProgressManagerUI.init({
        progressDataProvider: ProgressTracker.getOverallProgress,
        categoryDefinitions: ProgressTracker.getCategoryDefinitions(),
        animateProgressBars: true
      });
    }
  }
  
  // 2. Initialize the MCQ Module with Progress Tracking
  // ===================================================
  if (typeof MCQModule !== 'undefined') {
    MCQModule.init({
      containerId: 'mcq',
      answers: {
        'q1': 1,  // have been studying
        'q2': 0,  // has drunk
        'q3': 0,  // Have you been walking
        'q4': 1,  // have lost
        'q5': 2   // have lived
      },
      explanations: {
        'q1': 'Present Perfect Progressive is used to emphasize ongoing activity.',
        'q2': 'Present Perfect Simple is used to count completed actions.',
        'q3': 'Present Perfect Progressive is used for recent continuous activity with visible results.',
        'q4': 'Present Perfect Simple is used for a completed action with present consequences.',
        'q5': 'Present Perfect Simple is commonly used with stative verbs like "live".'
      },
      onComplete: function(score, total) {
        console.log(`MCQ completed with score: ${score}/${total}`);
        
        // 3. Record completion in the Progress Tracking system
        // ===================================================
        if (typeof ProgressTracker !== 'undefined') {
          // Mark the MCQ activity as completed
          ProgressTracker.markItemCompleted('activities', activityId, {
            score: score,
            maxScore: total,
            completed: true,
            completedAt: new Date().toISOString(),
            title: `${grammarTopic} Quick Practice`,
            // Store which answers were correct/incorrect if needed
            questionCount: total
          });
          
          // Mark the lesson as viewed/completed
          ProgressTracker.updateItemProgress('lessons', lessonId, {
            lastViewed: new Date().toISOString(),
            progress: 100, // Percent complete
            title: grammarTopic
          });
          
          console.log('Progress tracked successfully');
          
          // Show feedback to user
          showCompletionFeedback(score, total);
        } else {
          console.warn('ProgressTracker not available - progress not tracked');
        }
      }
    });
    
    // Add progress displays to the page
    if (typeof ProgressManagerUI !== 'undefined') {
      // Add a progress bar for this specific activity if a container exists
      const activityProgressContainer = document.getElementById('activity-progress');
      if (activityProgressContainer) {
        ProgressManagerUI.createProgressBar('activity-progress', {
          category: 'activities',
          itemId: activityId
        });
      }
      
      // Add overall progress summary if a container exists
      const overallProgressContainer = document.getElementById('overall-progress');
      if (overallProgressContainer) {
        ProgressManagerUI.createProgressSummary('overall-progress');
      }
    }
  } else {
    console.error('MCQModule not available');
  }
  
  /**
   * Shows feedback to the user after completing the activity
   * 
   * @param {number} score - The score achieved
   * @param {number} total - The total possible score
   */
  function showCompletionFeedback(score, total) {
    // Calculate percentage
    const percentage = Math.round((score / total) * 100);
    
    // Create feedback element if it doesn't exist
    let feedbackElement = document.getElementById('completion-feedback');
    
    if (!feedbackElement) {
      feedbackElement = document.createElement('div');
      feedbackElement.id = 'completion-feedback';
      feedbackElement.className = 'feedback-message';
      feedbackElement.style.marginTop = '20px';
      feedbackElement.style.padding = '15px';
      feedbackElement.style.borderRadius = '5px';
      feedbackElement.style.textAlign = 'center';
      
      // Add it after the MCQ container
      const mcqContainer = document.getElementById('mcq');
      if (mcqContainer && mcqContainer.parentNode) {
        mcqContainer.parentNode.insertBefore(feedbackElement, mcqContainer.nextSibling);
      }
    }
    
    // Set content and style based on score
    if (percentage >= 80) {
      feedbackElement.style.backgroundColor = 'var(--success-bg, #d4edda)';
      feedbackElement.style.color = 'var(--success-color, #155724)';
      feedbackElement.innerHTML = `
        <h3>Great job! 🎉</h3>
        <p>You scored ${score}/${total} (${percentage}%). Your progress has been saved.</p>
        <p>Why not try another activity to continue learning?</p>
      `;
    } else if (percentage >= 60) {
      feedbackElement.style.backgroundColor = 'var(--note-bg, #fff3cd)';
      feedbackElement.style.color = 'var(--note-color, #856404)';
      feedbackElement.innerHTML = `
        <h3>Good effort! 👍</h3>
        <p>You scored ${score}/${total} (${percentage}%). Your progress has been saved.</p>
        <p>Consider reviewing the grammar points above before moving on.</p>
      `;
    } else {
      feedbackElement.style.backgroundColor = 'var(--error-bg, #f8d7da)';
      feedbackElement.style.color = 'var(--error-color, #721c24)';
      feedbackElement.innerHTML = `
        <h3>Keep practicing 💪</h3>
        <p>You scored ${score}/${total} (${percentage}%). Your progress has been saved.</p>
        <p>Review the grammar section before trying again.</p>
      `;
    }
    
    // Scroll to feedback
    feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
