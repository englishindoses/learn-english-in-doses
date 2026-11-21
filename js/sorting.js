/*
 * Load sorting.css and this script on the page.
 * Wrap one activity, including its controls, in .sorting-activity.
 * Use #phraseBank.phrase-bank for the bank and .sorting-zones for the categories.
 * Each .sort-zone contains a .zone-content element. Set data-category on
 * each zone and each .phrase to the matching answer key.
 * Call checkSorting() and resetSorting() from the activity controls.
 * Include #sortingFeedback.feedback for the results.
 */
(() => {
    let selectedPhrase = null;

    function clearSelection() {
        if (!selectedPhrase) return;
        selectedPhrase.classList.remove('selected');
        selectedPhrase.removeAttribute('aria-pressed');
        selectedPhrase = null;
    }

    function initSortingActivity() {
        const phraseBank = document.getElementById('phraseBank');
        if (!phraseBank) return; // Activity not on this page

        // Initialize phrase click handlers
        document.querySelectorAll('#phraseBank .phrase').forEach(phrase => {
            phrase.addEventListener('click', handlePhraseClick);
        });

        // Initialize zone click handlers
        document.querySelectorAll('.sorting-activity .sort-zone').forEach(zone => {
            zone.addEventListener('click', handleZoneClick);
        });

        // Allow clicking phrases in zones to move them back
        document.querySelectorAll('.sorting-activity .zone-content').forEach(zone => {
            zone.addEventListener('click', handleZoneContentClick);
        });
    }

    function handlePhraseClick(e) {
        const phrase = e.currentTarget;
        if (phrase.closest('.zone-content')) return;
        const wasSelected = selectedPhrase === phrase;
        clearSelection();
        if (wasSelected) return;
        phrase.classList.add('selected');
        phrase.setAttribute('aria-pressed', 'true');
        selectedPhrase = phrase;
    }

    function handleZoneClick(e) {
        const zone = e.currentTarget;
        if (selectedPhrase && !e.target.closest('.phrase')) {
            const zoneContent = zone.querySelector('.zone-content');
            zoneContent.appendChild(selectedPhrase);
            clearSelection();
        }
    }

    function handleZoneContentClick(e) {
        if (e.target.classList.contains('phrase')) {
            const phraseBank = document.getElementById('phraseBank');
            phraseBank.appendChild(e.target);
            e.target.classList.remove('correct', 'incorrect');
        }
    }

    // Generic check sorting function - reads correct answers from data attributes
    window.checkSorting = function() {
        const sortZones = document.querySelectorAll('.sorting-activity .sort-zone');
        const feedback = document.getElementById('sortingFeedback');

        let correct = 0;
        let total = 0;

        sortZones.forEach(zone => {
            const expectedCategory = zone.dataset.category; // e.g., "formal", "safe"

            zone.querySelectorAll('.zone-content .phrase').forEach(phrase => {
                total++;
                const phraseCategory = phrase.dataset.category; // e.g., data-category="formal"

                if (phraseCategory === expectedCategory) {
                    phrase.classList.add('correct');
                    phrase.classList.remove('incorrect');
                    correct++;
                } else {
                    phrase.classList.add('incorrect');
                    phrase.classList.remove('correct');
                }
            });
        });

        const totalPhrases = total + document.querySelectorAll('#phraseBank .phrase').length;

        feedback.classList.add('show');
        if (total === 0) {
            feedback.textContent = 'Please sort some phrases first!';
            feedback.className = 'feedback show incorrect-answer';
        } else if (correct === total && total === totalPhrases) {
            feedback.textContent = `Excellent! All ${correct} phrases sorted correctly! 🎉`;
            feedback.className = 'feedback show correct';
        } else if (correct === total) {
            feedback.textContent = `${correct}/${total} correct so far. Keep going!`;
            feedback.className = 'feedback show correct';
        } else {
            feedback.textContent = `${correct}/${total} correct. The highlighted phrases need to be moved.`;
            feedback.className = 'feedback show incorrect-answer';
        }
    };

    window.resetSorting = function() {
        const phraseBank = document.getElementById('phraseBank');
        const feedback = document.getElementById('sortingFeedback');

        document.querySelectorAll('.sorting-activity .zone-content .phrase').forEach(phrase => {
            phrase.classList.remove('correct', 'incorrect', 'selected');
            phraseBank.appendChild(phrase);
        });

        feedback.className = 'feedback';
        feedback.textContent = '';
        clearSelection();

    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSortingActivity);
    } else {
        initSortingActivity();
    }
})();
