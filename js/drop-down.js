// ===== Drop-down Gap-fill Activity =====
/* ========For ENGLISH IN DOSES website =========*/
// Reusable component for sentence completion with dropdown menus
// Uses localStorage for saving/loading progress


// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', function() {
    initDropdownActivity();
});

// ===== Initialize Drop-down Activity =====
function initDropdownActivity() {
    const dropdownActivities = document.querySelectorAll('.dropdown-activity');
    if (dropdownActivities.length === 0) {
        console.log('No dropdown activities found on this page');
        return;
    }
    
    console.log('Initializing dropdown activities...');
    
    // Add change listeners to all dropdowns
    document.querySelectorAll('.gap-dropdown').forEach(function(dropdown) {
        dropdown.addEventListener('change', function() {
            handleDropdownChange(this);
        });
    });
    
    // Load saved states if available
    loadDropdownStates();
}

// ===== Handle Dropdown Change =====
function handleDropdownChange(dropdown) {
    // Add 'answered' class when a selection is made
    if (dropdown.value !== '') {
        dropdown.classList.add('answered');
    } else {
        dropdown.classList.remove('answered');
    }
    
    // Clear any previous correct/incorrect styling
    dropdown.classList.remove('correct', 'dd-incorrect');
    
    // Clear sentence styling too
    var sentence = dropdown.closest('.dropdown-sentence') || dropdown.closest('.dropdown-sentence-compact');
    if (sentence) {
        sentence.classList.remove('correct', 'dd-incorrect');
    }
    
    // Save state
    saveDropdownStates();
}

// ===== Check Dropdown Answers =====
function checkDropdownAnswers(activityId) {
    console.log('Checking dropdown answers for:', activityId);
    
    var activity = document.getElementById(activityId);
    if (!activity) {
        console.error('Activity not found:', activityId);
        return;
    }
    
    var dropdowns = activity.querySelectorAll('.gap-dropdown');
    var feedback = document.getElementById(activityId + 'Feedback');
    
    var correct = 0;
    var total = 0;
    var answered = 0;
    
    dropdowns.forEach(function(dropdown) {
        var correctAnswer = dropdown.dataset.answer;
        var selectedValue = dropdown.value;
        var sentence = dropdown.closest('.dropdown-sentence') || dropdown.closest('.dropdown-sentence-compact');
        
        total++;
        
        // Clear previous states
        dropdown.classList.remove('correct', 'dd-incorrect');
        if (sentence) {
            sentence.classList.remove('correct', 'dd-incorrect');
        }
        
        if (selectedValue !== '') {
            answered++;
            
            if (selectedValue === correctAnswer) {
                dropdown.classList.add('correct');
                if (sentence) {
                    sentence.classList.add('correct');
                }
                correct++;
            } else {
                dropdown.classList.add('dd-incorrect');
                if (sentence) {
                    sentence.classList.add('dd-incorrect');
                }
            }
        }
    });
    
    // Display feedback using activities.css classes
    if (feedback) {
        if (answered === 0) {
            feedback.textContent = 'Please select answers for the gaps first!';
            feedback.className = 'feedback incorrect-answer';
        } else if (correct === total) {
            feedback.textContent = 'Excellent! All ' + correct + ' answers correct! 🎉';
            feedback.className = 'feedback correct';
        } else if (answered < total) {
            feedback.textContent = correct + '/' + answered + ' correct so far. Complete all gaps and try again!';
            feedback.className = 'feedback incorrect-answer';
        } else {
            feedback.textContent = correct + '/' + total + ' correct. Review the highlighted answers and try again.';
            feedback.className = 'feedback incorrect-answer';
        }
    }
    
    // Save states after checking
    saveDropdownStates();
}

// ===== Reset Dropdown Activity =====
function resetDropdownActivity(activityId) {
    console.log('Resetting dropdown activity:', activityId);
    
    var activity = document.getElementById(activityId);
    if (!activity) {
        console.error('Activity not found:', activityId);
        return;
    }
    
    var dropdowns = activity.querySelectorAll('.gap-dropdown');
    var feedback = document.getElementById(activityId + 'Feedback');
    
    dropdowns.forEach(function(dropdown) {
        dropdown.value = '';
        dropdown.classList.remove('correct', 'dd-incorrect', 'answered');
        
        var sentence = dropdown.closest('.dropdown-sentence') || dropdown.closest('.dropdown-sentence-compact');
        if (sentence) {
            sentence.classList.remove('correct', 'dd-incorrect');
        }
    });
    
    if (feedback) {
        feedback.className = 'feedback';
        feedback.textContent = '';
    }
    
    // Clear saved states for this activity
    removeDropdownState(activityId);
}

// ===== Save Dropdown States to localStorage =====
function saveDropdownStates() {
    var activities = document.querySelectorAll('.dropdown-activity');
    var allStates = getDropdownStatesFromStorage();
    
    activities.forEach(function(activity) {
        var activityId = activity.id;
        if (!activityId) return;
        
        var states = {};
        activity.querySelectorAll('.gap-dropdown').forEach(function(dropdown, index) {
            states[index] = {
                value: dropdown.value,
                isCorrect: dropdown.classList.contains('correct'),
                isIncorrect: dropdown.classList.contains('dd-incorrect')
            };
        });
        
        allStates[activityId] = states;
    });
    
    try {
        localStorage.setItem('dropdownStates', JSON.stringify(allStates));
    } catch (e) {
        console.log('Could not save dropdown states to localStorage:', e);
    }
}

// ===== Get Dropdown States from localStorage =====
function getDropdownStatesFromStorage() {
    try {
        var saved = localStorage.getItem('dropdownStates');
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        console.log('Could not read dropdown states from localStorage:', e);
        return {};
    }
}

// ===== Remove a Single Activity State =====
function removeDropdownState(activityId) {
    var allStates = getDropdownStatesFromStorage();
    if (allStates[activityId]) {
        delete allStates[activityId];
        try {
            localStorage.setItem('dropdownStates', JSON.stringify(allStates));
        } catch (e) {
            console.log('Could not update localStorage:', e);
        }
    }
}

// ===== Load Dropdown States from localStorage =====
function loadDropdownStates() {
    var allStates = getDropdownStatesFromStorage();
    
    Object.keys(allStates).forEach(function(activityId) {
        var states = allStates[activityId];
        var activity = document.getElementById(activityId);
        if (!activity) return;
        
        var dropdowns = activity.querySelectorAll('.gap-dropdown');
        
        Object.keys(states).forEach(function(index) {
            var state = states[index];
            var dropdown = dropdowns[parseInt(index)];
            if (!dropdown) return;
            
            if (state.value) {
                dropdown.value = state.value;
                dropdown.classList.add('answered');
                
                if (state.isCorrect) {
                    dropdown.classList.add('correct');
                    var sentence = dropdown.closest('.dropdown-sentence') || dropdown.closest('.dropdown-sentence-compact');
                    if (sentence) {
                        sentence.classList.add('correct');
                    }
                }
                if (state.isIncorrect) {
                    dropdown.classList.add('dd-incorrect');
                    var sentence = dropdown.closest('.dropdown-sentence') || dropdown.closest('.dropdown-sentence-compact');
                    if (sentence) {
                        sentence.classList.add('dd-incorrect');
                    }
                }
            }
        });
    });
}
