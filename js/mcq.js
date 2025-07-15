/**
 * ESL Grammar Website - Enhanced Multiple Choice Questions Module
 * 
 * This module provides comprehensive functionality for multiple choice questions:
 * - Progressive difficulty questions
 * - Question navigation
 * - Detailed feedback with explanations
 * - Progress tracking and completion reporting
 * - Difficulty level tracking
 * - Integration with site-wide progress tracking
 */

const MCQModule = (function() {
    // Private variables
    let score = 0;
    let totalQuestions = 0;
    let currentQuestionIndex = 0;
    let correctAnswers = {};
    let correctExplanations = {};
    let incorrectExplanations = {};
    let explanations = {};
    let answered = {};
    let userSelections = {};
    let containerId = 'mcq-container';
    let onCompleteCallback = null;
    let difficultyLevels = {
        basic: { min: 0, max: 2, score: 0, total: 3 },
        intermediate: { min: 3, max: 5, score: 0, total: 3 },
        advanced: { min: 6, max: 8, score: 0, total: 3 },
        expert: { min: 9, max: 9, score: 0, total: 1 }
    };
    let showFeedbackImmediately = false;
    let grammarSummaryId = 'grammar-summary';
    
    /**
     * Initializes the MCQ module
     * 
     * @param {Object} config - Configuration object
     * @param {string} config.containerId - ID of the container element (default: 'mcq-container')
     * @param {Object} config.answers - Object mapping question IDs to correct answer indices
     * @param {Object} config.explanations - Object mapping question IDs to general explanations
     * @param {Object} config.correctExplanations - Object mapping question IDs to explanations for correct answers
     * @param {Object} config.incorrectExplanations - Object mapping question IDs to explanations for incorrect answers
     * @param {boolean} config.showFeedbackImmediately - Whether to show feedback immediately after selecting an option
     * @param {string} config.grammarSummaryId - ID of the grammar summary element to scroll to
     * @param {Function} config.onComplete - Callback function called when all questions are answered
     * @param {boolean} config.allowRetry - Allow retry after incorrect answer (default: true)
     * @param {boolean} config.clearSelections - Whether to clear all selections on load (default: false)
     * @param {boolean} config.showAllQuestionsAtOnce - Whether to show all questions at once (default: false)
     */
    function init(config = {}) {
        console.log('Initializing Enhanced MCQ Module with config:', config);
        
        // Set up configuration
        containerId = config.containerId || 'mcq-container';
        correctAnswers = config.answers || {};
        explanations = config.explanations || {};
        correctExplanations = config.correctExplanations || {};
        incorrectExplanations = config.incorrectExplanations || {};
        showFeedbackImmediately = config.showFeedbackImmediately || false;
        grammarSummaryId = config.grammarSummaryId || 'grammar-summary';
        onCompleteCallback = config.onComplete || null;
        const allowRetry = config.allowRetry !== undefined ? config.allowRetry : true;
        
        // Reset score and answered status
        score = 0;
        currentQuestionIndex = 0;
        
        // Calculate total questions
        totalQuestions = Object.keys(correctAnswers).length;
        console.log(`MCQ Module initialized with ${totalQuestions} questions`);
        
        // Initialize answered object and reset difficulty scores
        answered = {};
        Object.keys(correctAnswers).forEach(questionId => {
            answered[questionId] = false;
        });
        
        resetDifficultyScores();
        
        // Clear all selections if requested
        if (config.clearSelections) {
            clearAllSelections();
        }
        
        // Always show all questions
        showAllQuestions(true);
        
        // Set up option click handlers
        setupOptionClickHandlers(allowRetry);
        
        // Hide navigation buttons since we're showing all questions
        hideNavigationButtons();
        
        // Set up submit button
        setupSubmitButton();
        
        // Set up restart button
        setupRestartButton();
        
        // Set up "Check the Grammar" button
        setupCheckGrammarButton();
        
        // Load progress
        loadProgress();
    }
    
    /**
     * Resets the difficulty level scores
     */
    function resetDifficultyScores() {
        Object.keys(difficultyLevels).forEach(level => {
            difficultyLevels[level].score = 0;
        });
    }
    
    /**
     * Clears all selected options
     */
    function clearAllSelections() {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.querySelectorAll('.option input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        
        container.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        userSelections = {};
        
        console.log('Cleared all selections');
    }
    
    /**
     * Hide navigation buttons since we're showing all questions
     */
    function hideNavigationButtons() {
        const navButtons = document.querySelector('.question-navigation');
        if (navButtons) {
            navButtons.style.display = 'none';
        }
    }
    
    /**
     * Sets up option click handlers for all questions
     * 
     * @param {boolean} allowRetry - Whether to allow retry after incorrect answer
     */
    function setupOptionClickHandlers(allowRetry) {
        // Get all option elements
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`MCQ container with ID "${containerId}" not found`);
            return;
        }
        
        const options = container.querySelectorAll('.option');
        console.log(`Found ${options.length} options in MCQ container`);
        
        options.forEach(option => {
            // Handle click on the option div
            option.addEventListener('click', function() {
                const radio = this.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                }
                
                const questionElement = this.closest('.question');
                if (!questionElement) {
                    console.warn('Question element not found for clicked option');
                    return;
                }
                
                const questionId = questionElement.id;
                if (!questionId) {
                    console.warn('Question ID not found for clicked option');
                    return;
                }
                
                // If already answered and no retry, do nothing
                if (answered[questionId] && !allowRetry) return;
                
                const options = questionElement.querySelectorAll('.option');
                
                // Clear previous selections for this question
                options.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // Select this option
                this.classList.add('selected');
                
                // Store the user's selection
                const optionIndex = parseInt(this.getAttribute('data-index'));
                userSelections[questionId] = optionIndex;
                
                console.log(`Option selected for question ${questionId}: ${this.textContent.trim()}`);
                
                // Show feedback immediately if configured
                if (showFeedbackImmediately) {
                    checkSingleAnswer(questionId);
                }
            });
            
            // Also handle click on the radio input directly
            const radio = option.querySelector('input[type="radio"]');
            if (radio) {
                radio.addEventListener('change', function() {
                    if (this.checked) {
                        const optionElement = this.closest('.option');
                        if (optionElement) {
                            // Trigger the click event on the parent option
                            optionElement.click();
                        }
                    }
                });
            }
        });
    }
    
    /**
     * Sets up the submit button
     */
    function setupSubmitButton() {
        const submitButton = document.getElementById('mcq-submit');
        if (!submitButton) {
            console.warn(`Submit button with ID "mcq-submit" not found`);
            return;
        }
        
        submitButton.addEventListener('click', function() {
            console.log('MCQ submit button clicked');
            checkAllAnswers();
        });
    }
    
    /**
     * Checks all answers and provides feedback
     */
    function checkAllAnswers() {
        score = 0;
        let allAnswered = true;
        resetDifficultyScores();
        
        Object.keys(correctAnswers).forEach(questionId => {
            const questionElement = document.getElementById(questionId);
            if (!questionElement) return;
            
            // Get the question index and determine its difficulty level
            const questionIndex = parseInt(questionId.replace('q', '')) - 1;
            const difficultyLevel = getDifficultyLevelForQuestion(questionIndex);
            
            // Check if this question has been answered
            const selectedOption = userSelections[questionId] !== undefined ? 
                document.querySelector(`#${questionId} .option[data-index="${userSelections[questionId]}"]`) : null;
            
            if (!selectedOption) {
                allAnswered = false;
                const feedback = questionElement.querySelector('.feedback');
                if (feedback) {
                    feedback.textContent = 'Please select an answer.';
                    feedback.className = 'feedback alert';
                }
            } else {
                checkSingleAnswer(questionId, difficultyLevel);
            }
        });
        
        // If not all questions are answered, show a message
        if (!allAnswered) {
            alert('Please answer all questions before submitting.');
            return;
        }
        
        // Show results
        showResults();
        
        // Enhanced score display
        const scoreDisplay = document.getElementById('mcq-score');
        if (scoreDisplay) {
            // Update the score value
            const scoreValueElem = scoreDisplay.querySelector('.score-value');
            if (scoreValueElem) {
                scoreValueElem.textContent = score;
            } else {
                const scoreSpan = scoreDisplay.querySelector('span');
                if (scoreSpan) {
                    scoreSpan.textContent = score;
                }
            }
            
            // Show the score display with animation
            scoreDisplay.style.display = 'block';
            scoreDisplay.classList.add('show');
        }
        
        // Save progress
        saveProgress();
        
        // Check if all questions are answered correctly
        const allCorrect = Object.values(answered).every(status => status);
        
        console.log(`MCQ submission results: Score: ${score}/${totalQuestions}, All correct: ${allCorrect}`);
        
        // If all questions are answered, notify about completion
        notifyCompletion();
        
        // Call onComplete callback if provided
        if (typeof onCompleteCallback === 'function') {
            try {
                onCompleteCallback(score, totalQuestions);
            } catch (error) {
                console.error('Error in onComplete callback:', error);
            }
        }
        
        // Show restart button and hide submit button
        const restartButton = document.getElementById('mcq-restart');
        if (restartButton) {
            restartButton.style.display = 'block';
        }
        
        const submitButton = document.getElementById('mcq-submit');
        if (submitButton) {
            submitButton.style.display = 'none';
        }
        
        // Show "Check the Grammar" button
        const checkGrammarButton = document.getElementById('check-grammar');
        if (checkGrammarButton) {
            checkGrammarButton.style.display = 'inline-block';
        }
    }
    
    /**
     * Checks if a single answer is correct and provides feedback
     * 
     * @param {string} questionId - The ID of the question to check
     * @param {string} difficultyLevel - The difficulty level of the question
     * @returns {boolean} - Whether the answer is correct
     */
    function checkSingleAnswer(questionId, difficultyLevel = null) {
        const selectedOptionIndex = userSelections[questionId];
        const feedback = document.querySelector(`#${questionId} .feedback`);
        
        if (selectedOptionIndex === undefined) {
            if (feedback) {
                feedback.textContent = 'Please select an answer.';
                feedback.className = 'feedback alert';
            }
            return false;
        }
        
        // Determine difficulty level if not provided
        if (!difficultyLevel) {
            const questionIndex = parseInt(questionId.replace('q', '')) - 1;
            difficultyLevel = getDifficultyLevelForQuestion(questionIndex);
        }
        
        const isCorrect = selectedOptionIndex === correctAnswers[questionId];
        
        if (isCorrect) {
            // Correct answer feedback
            let explanation = 'Correct!';
            if (correctExplanations[questionId]) {
                explanation = correctExplanations[questionId];
            } else if (explanations[questionId]) {
                explanation = explanations[questionId];
            }
            
            if (feedback) {
                feedback.innerHTML = `<span class="feedback-result correct-result">Correct!</span> ${explanation}`;
                feedback.className = 'feedback correct';
            }
            
            // Mark as answered correctly
            answered[questionId] = true;
            score++;
            
            // Update difficulty level score
            if (difficultyLevel && difficultyLevels[difficultyLevel]) {
                difficultyLevels[difficultyLevel].score++;
            }
        } else {
            // Incorrect answer feedback
            let explanation = 'Sorry, that\'s not correct.';
            if (incorrectExplanations[questionId]) {
                explanation = incorrectExplanations[questionId];
            } else if (explanations[questionId]) {
                explanation = explanations[questionId];
            }
            
            if (feedback) {
                feedback.innerHTML = `<span class="feedback-result incorrect-result">Incorrect!</span> ${explanation}`;
                feedback.className = 'feedback incorrect-answer';
            }
            
            // Mark as answered incorrectly
            answered[questionId] = false;
        }
        
        return isCorrect;
    }
    
    /**
     * Gets the difficulty level for a question based on its index
     * 
     * @param {number} questionIndex - The zero-based index of the question
     * @returns {string} - The difficulty level ('basic', 'intermediate', 'advanced', or 'expert')
     */
    function getDifficultyLevelForQuestion(questionIndex) {
        for (const [level, range] of Object.entries(difficultyLevels)) {
            if (questionIndex >= range.min && questionIndex <= range.max) {
                return level;
            }
        }
        
        return 'basic'; // Default to basic if no match
    }
    
    /**
     * Shows or hides all questions
     * 
     * @param {boolean} show - Whether to show or hide all questions
     */
    function showAllQuestions(show = true) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.querySelectorAll('.question').forEach(question => {
            question.style.display = show ? 'block' : 'none';
        });
        
        // Hide navigation buttons when showing all questions
        hideNavigationButtons();
    }
    
    /**
     * Checks if all questions are currently visible
     * 
     * @returns {boolean} - Whether all questions are visible
     */
    function allQuestionsVisible() {
        const container = document.getElementById(containerId);
        if (!container) return false;
        
        const questions = container.querySelectorAll('.question');
        const visibleQuestions = Array.from(questions).filter(q => q.style.display !== 'none');
        
        return visibleQuestions.length === questions.length;
    }
    
    /**
     * Shows the results summary
     */
    function showResults() {
        const resultsContainer = document.getElementById('mcq-results');
        if (!resultsContainer) return;
        
        // Update score
        const scoreValue = document.getElementById('score-value');
        if (scoreValue) {
            scoreValue.textContent = score;
        }
        
        const totalQuestionsScore = document.getElementById('total-questions-score');
        if (totalQuestionsScore) {
            totalQuestionsScore.textContent = totalQuestions;
        }
        
        // Update progress bar
        const resultsProgressBar = document.getElementById('results-progress-bar');
        if (resultsProgressBar) {
            const percentage = (score / totalQuestions) * 100;
            resultsProgressBar.style.width = `${percentage}%`;
        }
        
        // Update difficulty breakdown
        for (const [level, data] of Object.entries(difficultyLevels)) {
            const scoreElement = document.getElementById(`${level}-score`);
            if (scoreElement) {
                scoreElement.textContent = data.score;
            }
        }
        
        // Show results container
        resultsContainer.style.display = 'block';
    }
    
    /**
     * Sets up the restart button
     */
    function setupRestartButton() {
        const restartButton = document.getElementById('mcq-restart');
        const submitButton = document.getElementById('mcq-submit');
        
        if (!restartButton) {
            console.warn(`Restart button with ID "mcq-restart" not found`);
            return;
        }
        
        restartButton.addEventListener('click', function() {
            console.log('MCQ restart button clicked');
            
            // Clear selections
            clearAllSelections();
            
            // Clear feedback
            const container = document.getElementById(containerId);
            container.querySelectorAll('.feedback').forEach(feedback => {
                feedback.textContent = '';
                feedback.className = 'feedback';
            });
            
            // Reset answered status
            Object.keys(answered).forEach(questionId => {
                answered[questionId] = false;
            });
            
            // Reset score
            score = 0;
            resetDifficultyScores();
            
            // Hide results
            const resultsContainer = document.getElementById('mcq-results');
            if (resultsContainer) {
                resultsContainer.style.display = 'none';
            }
            
            // Hide the score display
            const scoreDisplay = document.getElementById('mcq-score');
            if (scoreDisplay) {
                scoreDisplay.style.display = 'none';
                scoreDisplay.classList.remove('show');
            }
            
            // Show all questions
            showAllQuestions(true);
            
            // Show submit button, hide restart button
            if (submitButton) {
                submitButton.style.display = 'block';
            }
            restartButton.style.display = 'none';
            
            // Hide "Check the Grammar" button
            const checkGrammarButton = document.getElementById('check-grammar');
            if (checkGrammarButton) {
                checkGrammarButton.style.display = 'none';
            }
            
            // Hide completion feedback if it exists
            const feedbackElement = document.getElementById('completion-feedback');
            if (feedbackElement) {
                feedbackElement.style.display = 'none';
            }
            
            // Clear progress
            clearProgress();
        });
    }
    
    /**
     * Sets up the "Check the Grammar" button
     */
    function setupCheckGrammarButton() {
        const checkGrammarButton = document.getElementById('check-grammar');
        if (!checkGrammarButton) {
            console.warn(`Check Grammar button with ID "check-grammar" not found`);
            return;
        }
        
        checkGrammarButton.addEventListener('click', function(e) {
            console.log('Check Grammar button clicked');
            
            // Scroll to the grammar summary section smoothly
            const grammarSummary = document.getElementById(grammarSummaryId);
            if (grammarSummary) {
                e.preventDefault();
                
                grammarSummary.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    /**
     * Notifies that the activity has been completed
     * Uses multiple methods to ensure reliable tracking
     */
    function notifyCompletion() {
        console.log(`MCQ Activity completed: ${containerId}`);
        
        // Create completion data object
        const completionData = {
            activityId: containerId,
            score: score,
            maxScore: totalQuestions,
            completed: true,
            completedAt: new Date().toISOString(),
            title: document.title || `MCQ Activity: ${containerId}`,
            difficultyScores: difficultyLevels
        };
        
        // Method 1: Save directly to localStorage as a fallback
        if (typeof saveToLocalStorage === 'function') {
            saveToLocalStorage(`${containerId}-progress`, completionData);
        } else {
            try {
                localStorage.setItem(`${containerId}-progress`, JSON.stringify(completionData));
            } catch (e) {
                console.error('Error saving to localStorage directly:', e);
            }
        }
        
        // Method 2: Use ProgressTrackingModule directly
        if (typeof ProgressTrackingModule !== 'undefined' && 
            typeof ProgressTrackingModule.markItemCompleted === 'function') {
            try {
                ProgressTrackingModule.markItemCompleted('activities', containerId, completionData);
                console.log('Notified ProgressTrackingModule directly');
            } catch (e) {
                console.error('Error notifying ProgressTrackingModule:', e);
            }
        }
        
        // Method 3: Use ActivityNavModule
        if (typeof ActivityNavModule !== 'undefined' && 
            typeof ActivityNavModule.notifyActivityCompleted === 'function') {
            try {
                ActivityNavModule.notifyActivityCompleted(containerId, completionData);
                console.log('Notified ActivityNavModule');
            } catch (e) {
                console.error('Error notifying ActivityNavModule:', e);
            }
        }
        
        // Method 4: Dispatch custom event
        try {
            const event = new CustomEvent('activityCompleted', {
                detail: completionData
            });
            document.dispatchEvent(event);
            console.log('Dispatched activityCompleted event');
        } catch (e) {
            console.error('Error dispatching event:', e);
        }
        
        // Method 5: Visual feedback if available
        try {
            if (typeof showFeedbackMessage === 'function') {
                showFeedbackMessage(`Activity completed! Score: ${score}/${totalQuestions}`, 'success', 3000);
            }
        } catch (e) {
            console.error('Error showing feedback message:', e);
        }
    }
    
    /**
     * Saves progress to localStorage
     */
    function saveProgress() {
        try {
            console.log(`Saving MCQ progress for ${containerId}`);
            
            // Create progress data object
            const progressData = {
                score: score,
                totalQuestions: totalQuestions,
                answered: answered,
                userSelections: userSelections,
                difficultyScores: difficultyLevels,
                completed: Object.values(answered).filter(status => status).length === totalQuestions,
                timestamp: new Date().toISOString(),
                title: document.title || `MCQ Activity: ${containerId}`
            };
            
            // Method 1: Use saveToLocalStorage function if available
            if (typeof saveToLocalStorage === 'function') {
                saveToLocalStorage(`${containerId}-progress`, progressData);
                console.log('Progress saved using saveToLocalStorage function');
            }
            // Method 2: Use localStorage directly
            else if (typeof localStorage !== 'undefined') {
                localStorage.setItem(`${containerId}-progress`, JSON.stringify(progressData));
                console.log('Progress saved directly to localStorage');
            } else {
                console.warn('Unable to save progress: localStorage not available');
            }
            
            return true;
        } catch (error) {
            console.error('Error saving progress:', error);
            return false;
        }
    }
    
    /**
     * Loads progress from localStorage
     */
    function loadProgress() {
        try {
            console.log(`Loading MCQ progress for ${containerId}`);
            
            let savedProgress = null;
            
            // Method 1: Use getFromLocalStorage function if available
            if (typeof getFromLocalStorage === 'function') {
                savedProgress = getFromLocalStorage(`${containerId}-progress`);
                console.log('Progress loaded using getFromLocalStorage function');
            }
            // Method 2: Use localStorage directly
            else if (typeof localStorage !== 'undefined') {
                const savedData = localStorage.getItem(`${containerId}-progress`);
                
                if (savedData) {
                    savedProgress = JSON.parse(savedData);
                    console.log('Progress loaded directly from localStorage');
                }
            }
            
            if (savedProgress) {
                console.log('Saved progress found:', savedProgress);
                
                // Restore answered state
                if (savedProgress.answered) {
                    answered = savedProgress.answered;
                    
                    // Restore user selections
                    if (savedProgress.userSelections) {
                        userSelections = savedProgress.userSelections;
                        
                        // Restore the user's actual selections in the UI
                        Object.entries(userSelections).forEach(([questionId, selectedIndex]) => {
                            if (selectedIndex !== undefined) {
                                selectOption(questionId, selectedIndex);
                            }
                        });
                    } else {
                        // Fallback for older saved data without userSelections
                        Object.entries(answered).forEach(([questionId, isAnswered]) => {
                            if (isAnswered && correctAnswers[questionId] !== undefined) {
                                selectOption(questionId, correctAnswers[questionId]);
                            }
                        });
                    }
                    
                    // Update score
                    score = Object.values(answered).filter(status => status).length;
                    
                    // Restore difficulty scores if available
                    if (savedProgress.difficultyScores) {
                        Object.keys(difficultyLevels).forEach(level => {
                            if (savedProgress.difficultyScores[level]) {
                                difficultyLevels[level].score = savedProgress.difficultyScores[level].score || 0;
                            }
                        });
                    }
                    
                    // If activity was completed, restore completion state
                    if (savedProgress.completed) {
                        // Show all answers and results
                        showAllQuestions();
                        showResults();
                        
                        // Update UI to show completion state
                        const submitButton = document.getElementById('mcq-submit');
                        const restartButton = document.getElementById('mcq-restart');
                        const checkGrammarButton = document.getElementById('check-grammar');
                        
                        if (submitButton) submitButton.style.display = 'none';
                        if (restartButton) restartButton.style.display = 'block';
                        if (checkGrammarButton) checkGrammarButton.style.display = 'inline-block';
                        
                        // Check each answer to display feedback
                        Object.keys(correctAnswers).forEach(questionId => {
                            checkSingleAnswer(questionId);
                        });
                    }
                }
            } else {
                console.log('No saved progress found');
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    }
    
    /**
     * Clears saved progress
     */
    function clearProgress() {
        try {
            console.log(`Clearing MCQ progress for ${containerId}`);
            
            // Reset userSelections object
            userSelections = {};
            
            // Method 1: Use removeFromLocalStorage function if available
            if (typeof removeFromLocalStorage === 'function') {
                removeFromLocalStorage(`${containerId}-progress`);
                console.log('Progress cleared using removeFromLocalStorage function');
            }
            // Method 2: Use localStorage directly
            else if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(`${containerId}-progress`);
                console.log('Progress cleared directly from localStorage');
            } else {
                console.warn('Unable to clear progress: localStorage not available');
            }
        } catch (error) {
            console.error('Error clearing progress:', error);
        }
    }
    
    /**
     * Manually select an option for a question
     * Helper function for external selection and restoring saved state
     * 
     * @param {string} questionId - ID of the question
     * @param {number} optionIndex - Index of the option to select
     */
    function selectOption(questionId, optionIndex) {
        const question = document.getElementById(questionId);
        if (!question) {
            console.warn(`Question with ID "${questionId}" not found`);
            return;
        }
        
        const options = question.querySelectorAll('.option');
        if (options.length === 0) {
            console.warn(`No options found for question "${questionId}"`);
            return;
        }
        
        // Clear previous selections
        options.forEach(opt => {
            opt.classList.remove('selected');
            const radio = opt.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = false;
            }
        });
        
        // Select the specified option
        const optionToSelect = options[optionIndex];
        if (optionToSelect) {
            optionToSelect.classList.add('selected');
            const radio = optionToSelect.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
            
            // Store the user's selection
            userSelections[questionId] = optionIndex;
            
            console.log(`Selected option ${optionIndex} for question ${questionId}`);
        } else {
            console.warn(`Option with index ${optionIndex} not found for question "${questionId}"`);
        }
    }
    
    /**
     * Gets the current score
     * 
     * @returns {Object} Object containing score, totalQuestions and difficulty breakdown
     */
    function getScore() {
        return {
            score: score,
            totalQuestions: totalQuestions,
            percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0,
            difficultyBreakdown: difficultyLevels
        };
    }
    
    /**
     * Checks if all questions have been answered correctly
     * 
     * @returns {boolean} True if all questions are answered correctly
     */
    function isCompleted() {
        return Object.values(answered).filter(status => status).length === totalQuestions;
    }
    
    /**
     * Gets an array of incorrectly answered questions
     * 
     * @returns {Array} Array of question IDs that were answered incorrectly
     */
    function getIncorrectAnswers() {
        return Object.entries(answered)
            .filter(([_, status]) => !status)
            .map(([questionId, _]) => questionId);
    }
    
    /**
     * Gets the user's selections
     * 
     * @returns {Object} Object mapping question IDs to selected option indices
     */
    function getUserSelections() {
        return {...userSelections};
    }
    
    // Public API
    return {
        // Core functions
        init: init,
        getScore: getScore,
        isCompleted: isCompleted,
        selectOption: selectOption,
        clearSelections: clearAllSelections,
        getIncorrectAnswers: getIncorrectAnswers,
        getUserSelections: getUserSelections,
        
        // Navigation functions
        showAllQuestions: showAllQuestions,
        
        // Direct access for debugging and testing
        _saveProgress: saveProgress,
        _loadProgress: loadProgress,
        _checkAllAnswers: checkAllAnswers,
        _notifyCompletion: notifyCompletion
    };
  })();
  
  // Export the module if module system is being used
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = MCQModule;
  }