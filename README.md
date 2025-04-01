# ESL Grammar Website Modular Files

This repository contains the modular CSS and JavaScript files for the ESL Grammar website. These files have been organized to make the website more maintainable and easier to update.

## Directory Structure

- **css/** - CSS stylesheets
  - `base.css` - Core styles for the site layout and common elements
  - `activities.css` - Styles specific to interactive learning activities

- **js/** - JavaScript modules
  - `core.js` - Core functionality (theme toggle, navigation, localStorage utilities)
  - `mcq.js` - Multiple choice questions module
  - `gap-fill.js` - Gap fill exercises module
  - `matching.js` - Matching exercises module
  - `drag-drop.js` - Drag and drop exercises module
  - `transformation.js` - Sentence transformation exercises module
  - `error-correction.js` - Error correction exercises module
  - `situations.js` - Situation matching module
  - `activity-nav.js` - Navigation between activities on a page
  - `progress-tracking.js` - User progress tracking module

- **templates/** - HTML templates for common page elements
  - `head.html` - Standardized head section with meta tags and CSS links
  - `breadcrumbs.html` - Breadcrumb navigation template
  - `theme-toggle.html` - Theme toggle button with JavaScript
  - `practice-page-template.html` - Complete template for practice activity pages

- **images/** - Directory for image assets (currently empty)

## How to Use These Files

1. Include the necessary CSS files in the head of your HTML:
   ```html
   <link rel="stylesheet" href="css/base.css">
   <link rel="stylesheet" href="css/activities.css">
   ```

2. Include the JavaScript modules at the end of your HTML, before the closing `</body>` tag:
   ```html
   <script src="js/core.js"></script>
   <!-- Include only the modules you need for the page -->
   <script src="js/mcq.js"></script>
   <script src="js/gap-fill.js"></script>
   <script src="js/activity-nav.js"></script>
   <script src="js/progress-tracking.js"></script>
   ```

3. Initialize the modules in your custom script:
   ```html
   <script>
     document.addEventListener('DOMContentLoaded', function() {
       // Initialize MCQ module
       MCQModule.init({
         containerId: 'mcq',
         answers: {
           'q1': 2,  // Index of correct answer for question 1 (0-based)
           'q2': 0,  // Index of correct answer for question 2
         },
         onComplete: function(score, total) {
           // Do something when all questions are answered
         }
       });
       
       // Initialize other modules as needed
     });
   </script>
   ```

4. Use the HTML templates as starting points for new pages.

## Example Implementation

A complete example of a practice page can be found in `templates/practice-page-template.html`. This template includes examples of:

- Multiple Choice Questions
- Gap Fill Exercises
- Matching Exercises
- Transformation Exercises
- Activity Navigation
- Progress Tracking

## Browser Compatibility

These files are designed to work with modern browsers (Chrome, Firefox, Safari, Edge). Limited support for Internet Explorer is provided through conditional polyfills.

## License

© 2025 English in Doses | All rights reserved
