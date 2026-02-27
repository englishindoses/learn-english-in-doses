# Advanced Grammar Page — HTML Guidelines

This document explains exactly how to build an HTML grammar page for the `grammar/advanced/` directory. Follow these rules to produce a page that matches the existing design system perfectly.

---

## Table of Contents

1. [Complete HTML Skeleton](#1-complete-html-skeleton)
2. [Head Section](#2-head-section)
3. [Body & Top-Level Structure](#3-body--top-level-structure)
4. [Navigation](#4-navigation)
5. [Breadcrumbs](#5-breadcrumbs)
6. [Main Content Area](#6-main-content-area)
7. [Section Types Reference](#7-section-types-reference)
8. [Inline Styling Classes](#8-inline-styling-classes)
9. [Drag-and-Drop Activity](#9-drag-and-drop-activity)
10. [Summary Table](#10-summary-table)
11. [MCQ (Multiple Choice) Activity](#11-mcq-multiple-choice-activity)
12. [Bottom Navigation](#12-bottom-navigation)
13. [Footer](#13-footer)
14. [JavaScript](#14-javascript)
15. [Full Page Template](#15-full-page-template)

---

## 1. Complete HTML Skeleton

Every page follows this top-level order:

```
<!DOCTYPE html>
<html lang="en">
<head>  ...  </head>
<body class="advanced-section">
  <!-- Skip link -->
  <!-- Theme toggle -->
  <!-- Navigation -->
  <div class="container">
    <!-- Breadcrumbs -->
    <main id="main-content">
      <!-- H1 title -->
      <!-- Introduction section -->
      <!-- Grammar point sections (1 or more) -->
      <!-- Drag-and-Drop activity -->
      <!-- Summary table -->
      <!-- Common errors section -->
      <!-- Tips section -->
      <!-- MCQ activity -->
    </main>
  </div>
  <!-- Bottom navigation -->
  <!-- Footer -->
  <!-- JavaScript files -->
  <!-- Inline init script -->
</body>
</html>
```

---

## 2. Head Section

```html
<head>
  <!-- Standard head content -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="TOPIC NAME - Advanced ESL grammar explanation with examples and practice">
  <title>TOPIC NAME - Advanced ESL Grammar</title>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&family=Source+Code+Pro&display=swap" rel="stylesheet">

  <!-- Favicon -->
  <link rel="apple-touch-icon" sizes="180x180" href="../../images/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="../../images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="../../images/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">

  <!-- Styles -->
  <link rel="stylesheet" href="../../css/base.css">
  <link rel="stylesheet" href="../../css/levels.css">
  <link rel="stylesheet" href="../../css/activities.css">
  <link rel="stylesheet" href="../../css/progress-tracking-styles.css">
  <link rel="stylesheet" href="../../css/button-shine.css">
</head>
```

### Rules

- **Fonts**: Always load exactly these three Google Fonts families:
  - `Montserrat` (weights 400, 600, 700) — headings
  - `Open Sans` (weights 400, 600) — body text
  - `Source Code Pro` — code/monospace elements
- **CSS files**: Always include all five stylesheets in this exact order:
  1. `../../css/base.css`
  2. `../../css/levels.css`
  3. `../../css/activities.css`
  4. `../../css/progress-tracking-styles.css`
  5. `../../css/button-shine.css`
- **Meta description**: Use the format `"TOPIC NAME - Advanced ESL grammar explanation with examples and practice"`
- **Title**: Use the format `"TOPIC NAME - Advanced ESL Grammar"`
- **No inline `<style>` blocks** — all styling comes from the five CSS files. The `grammar-highlight` class and all other classes are already defined in the CSS. Do not add custom `<style>` blocks.

---

## 3. Body & Top-Level Structure

```html
<body class="advanced-section">
  <!-- Skip link and theme toggle -->
  <a href="#main-content" class="skip-link">Skip to content</a>

  <div class="theme-toggle-container">
    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
      <span class="light-icon">☀️</span>
      <span class="dark-icon">🌙</span>
    </button>
  </div>

  <!-- Navigation (see section 4) -->

  <div class="container">
    <!-- Breadcrumbs (see section 5) -->
    <main id="main-content">
      <!-- All content sections go here -->
    </main>
  </div>

  <!-- Bottom navigation (see section 12) -->
  <!-- Footer (see section 13) -->
  <!-- JavaScript (see section 14) -->
</body>
```

### Rules

- **Body class**: Always use `class="advanced-section"` on the `<body>` tag. This applies the correct colour scheme and level indicator styling.
- **Skip link**: Always the first element inside `<body>`. Links to `#main-content`.
- **Theme toggle**: Always present immediately after the skip link. Uses exactly the emoji icons shown (☀️ and 🌙).
- **Container div**: Wraps breadcrumbs and `<main>`. Class is `container`.
- **Main element**: Always has `id="main-content"`.

---

## 4. Navigation

```html
<nav class="main-navigation">
  <a href="../../home.html" class="site-logo">
    <img src="../../images/my-logo.svg" alt="English in Doses" width="150" height="auto">
  </a>
  <button class="nav-toggle" aria-label="Toggle navigation">☰</button>
  <div class="nav-links">
    <a href="../../home.html" class="nav-link">Home</a>
    <a href="../../about.html" class="nav-link">About Us</a>
    <a href="../../home.html#level-test" class="nav-link">Find Your Level</a>
    <a href="../../beginner-landing.html" class="nav-link">Beginner</a>
    <a href="../../intermediate-landing.html" class="nav-link">Intermediate</a>
    <a href="../../advanced-landing.html" class="nav-link">Advanced</a>
    <a href="../../travel/beginner-travel/travel-english.html" class="nav-link">Travel English</a>
    <a href="../../my-progress.html" class="nav-link">My Progress</a>
    <a href="../../booking-page.html" class="nav-link">Book a Lesson</a>
  </div>

  <div class="advanced-nav-indicator"></div>
</nav>
```

### Rules

- Copy this navigation block exactly. All paths are relative from `grammar/advanced/`.
- The `advanced-nav-indicator` div is always present at the end of the nav (it creates a coloured indicator bar for the advanced level).
- The hamburger icon is the `☰` character.

---

## 5. Breadcrumbs

```html
<div class="breadcrumbs" aria-label="breadcrumb">
  <span class="breadcrumb-item"><a href="../../home.html">Home</a></span>
  <span class="breadcrumb-separator">›</span>
  <span class="breadcrumb-item"><a href="../../advanced-landing.html">Advanced English</a></span>
  <span class="breadcrumb-separator">›</span>
  <span class="breadcrumb-item"><a href="advanced-grammar.html">Advanced Grammar</a></span>
  <span class="breadcrumb-separator">›</span>
  <span class="breadcrumb-item"><a href="advanced-grammar.html#CATEGORY-ID">CATEGORY NAME</a></span>
  <span class="breadcrumb-separator">›</span>
  <span class="breadcrumb-item">PAGE TITLE</span>
</div>
```

### Rules

- First three items are always: **Home** → **Advanced English** → **Advanced Grammar**
- Fourth item links to the relevant category section on the grammar index page (e.g., `advanced-grammar.html#verb-patterns`, `advanced-grammar.html#complex-structures`, `advanced-grammar.html#conditionals`, `advanced-grammar.html#modals`, `advanced-grammar.html#passive`, `advanced-grammar.html#advanced-tenses-and-aspect`)
- Final item is plain text (no link) — the current page title.
- Separator character is `›` (right single angle quotation mark).
- Each item uses `<span class="breadcrumb-item">`, separators use `<span class="breadcrumb-separator">`.

---

## 6. Main Content Area

Everything inside `<main id="main-content">` follows this order:

### 6.1 Page Title (H1)

```html
<h1>Topic Title</h1>
```

Only one `<h1>` per page. It appears directly inside `<main>`, before any sections.

### 6.2 Introduction Section

```html
<section class="intro-section">
  <h2>Introduction</h2>
  <p>Introductory paragraph explaining the grammar topic...</p>

  <h3>After this lesson, you will be able to:</h3>
  <ul>
    <li>Learning objective 1.</li>
    <li>Learning objective 2.</li>
    <li>Learning objective 3.</li>
  </ul>
</section>
```

### Rules

- Class is `intro-section`.
- Always contains an `<h2>Introduction</h2>`, one or more `<p>` tags, then an `<h3>` with learning objectives in a `<ul>`.
- Typically 3 learning objectives.

### 6.3 Grammar Point Sections

```html
<section class="grammar-point" id="optional-id">
  <h2>Grammar Point Title</h2>

  <p><strong>Form</strong>: description with <span class="grammar-highlight">highlighted parts</span></p>
  <p><strong>When to use it</strong>: explanation of usage...</p>

  <div class="example">
    <ol>
      <li><span class="grammar-highlight">Highlighted grammar</span> rest of example.<br>(= explanation in parentheses)</li>
      <li>Another example sentence.<br>(= explanation)</li>
      <li>Third example.<br>(= explanation)</li>
    </ol>
  </div>

  <div class="note">
    <p><strong>Native speaker note:</strong> Information about how native speakers actually use this structure...</p>
  </div>
</section>
```

### Rules

- Class is `grammar-point`.
- Grammar point sections do **not** need `id="grammar-summary"`. That ID belongs on the summary table section (see [Section 10](#10-summary-table)).
- Each section has an `<h2>` title.
- **Form line**: Bold "Form" label, then the grammatical structure with `<span class="grammar-highlight">` on the key grammar elements.
- **When to use it line**: Bold "When to use it" label.
- **Example block**: Wrapped in `<div class="example">`. Use `<ol>` for numbered examples. Each `<li>` contains the example sentence followed by `<br>` and an explanation in parentheses.
- Examples can also use `<ul>` for unnumbered lists.
- You can group examples with sub-headings inside the example div: `<p><strong>Sub-heading:</strong></p>` followed by `<ol>`.
- Separate groups within examples with `<br>` tags between the closing `</ol>` and next `<p>`.
- **Note block**: Wrapped in `<div class="note">`. Usually contains a bold label like "Native speaker note:", "Important:", or "Remember:".
- You can have multiple grammar point sections — as many as the topic requires.
- Additional elements within grammar points can include plain `<ul>` or `<ol>` lists and regular `<p>` paragraphs.

---

## 7. Section Types Reference

### 7.1 Common Errors Section

```html
<section class="common-errors">
  <h2 class="common-errors-heading">Common Errors</h2>

  <div class="error-pattern">
    <p class="error-title"><strong>1: Description of the error</strong></p>
    <p class="incorrect">❌ Incorrect example sentence.</p><br>
    <p class="correct">✓ Correct example sentence.</p>
    <p class="explanation"><em>Explanation of why it's wrong and how to fix it.</em></p>
  </div>

  <div class="error-pattern">
    <p class="error-title"><strong>2: Description of the error</strong></p>
    <p class="incorrect">❌ Incorrect example sentence.</p><br>
    <p class="correct">✓ Correct example sentence.</p>
    <p class="explanation"><em>Explanation.</em></p>
  </div>

  <div class="error-pattern">
    <p class="error-title"><strong>3: Description of the error</strong></p>
    <p class="incorrect">❌ Incorrect example sentence.</p><br>
    <p class="correct">✓ Correct example sentence.</p>
    <p class="explanation"><em>Explanation.</em></p>
  </div>
</section>
```

### Rules

- Section class: `common-errors`
- Heading: `<h2 class="common-errors-heading">Common Errors</h2>`
- Usually 3 error patterns.
- Each error is a `<div class="error-pattern">` containing:
  - `<p class="error-title">` with bold numbered title
  - `<p class="incorrect">` prefixed with ❌
  - `<br>` between incorrect and correct
  - `<p class="correct">` prefixed with ✓
  - `<p class="explanation">` wrapped in `<em>`

### 7.2 Tips Section

```html
<section class="tips">
  <h2 class="tips-heading">Useful Tips</h2>

  <div class="grammar-tip">
    <p>📌 <strong>TIP 1:</strong> Tip text here.</p>
  </div>

  <div class="grammar-tip">
    <p>📌 <strong>TIP 2:</strong> Tip text here.</p>
  </div>

  <div class="grammar-tip">
    <p>📌 <strong>TIP 3:</strong> Tip text here.</p>
  </div>
</section>
```

### Rules

- Section class: `tips`
- Heading: `<h2 class="tips-heading">Useful Tips</h2>`
- Usually 3 tips.
- Each tip is a `<div class="grammar-tip">` containing a `<p>` prefixed with 📌 emoji and bold "TIP N:" label.

---

## 8. Inline Styling Classes

Use these CSS classes within content sections:

| Class | Element | Purpose | Example |
|-------|---------|---------|---------|
| `grammar-highlight` | `<span>` | Highlights key grammar structures in blue/accent colour, bold | `<span class="grammar-highlight">verb-ing</span>` |
| `example` | `<div>` | Wraps example blocks with styled background/border | `<div class="example">...</div>` |
| `note` | `<div>` | Wraps note/callout boxes with distinct background | `<div class="note">...</div>` |
| `incorrect` | `<p>` | Red-styled incorrect example | `<p class="incorrect">❌ Wrong sentence.</p>` |
| `correct` | `<p>` | Green-styled correct example | `<p class="correct">✓ Correct sentence.</p>` |
| `explanation` | `<p>` | Explanation text (always italicised with `<em>`) | `<p class="explanation"><em>Why...</em></p>` |
| `error-pattern` | `<div>` | Container for each error in common errors | |
| `error-title` | `<p>` | Title of an error pattern | |
| `grammar-tip` | `<div>` | Container for each tip | |

### Text formatting within examples

- Use `<strong>` to bold key words in example sentences (verbs, grammar structures being taught).
- Use `<em>` for italicised text in notes and explanations.
- Use `<br>` to add line breaks between an example sentence and its explanation.
- Use `<span class="grammar-highlight">` to highlight the grammar structure being demonstrated.
- In example sentences, the explanation is placed in parentheses after `<br>`: `sentence.<br>(= explanation)`

---

## 9. Drag-and-Drop Activity

The drag-and-drop section is a sentence reordering activity where learners drag words into the correct order.

### HTML Structure

```html
<section class="content-section">
  <h2>Practice: Sentence Reordering</h2>
  <p>Drag the words into the correct order to make sentences with TOPIC.</p>

  <div id="drag-drop" class="activity-container active">
    <!-- Question 1 -->
    <div class="question" id="dd-q1">
      <p class="question-text">1. Instruction for this question:</p>
      <div class="drop-zone" data-index="dd-q1" data-answer="the full answer in lowercase"></div>
      <div class="drag-items">
        <div class="drag-item" draggable="true">word1</div>
        <div class="drag-item" draggable="true">word2</div>
        <div class="drag-item" draggable="true">word3</div>
        <!-- more drag items -->
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Question 2 -->
    <div class="question" id="dd-q2">
      <p class="question-text">2. Instruction for this question:</p>
      <div class="drop-zone" data-index="dd-q2" data-answer="the full answer in lowercase"></div>
      <div class="drag-items">
        <div class="drag-item" draggable="true">word1</div>
        <div class="drag-item" draggable="true">word2</div>
        <!-- more drag items -->
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Questions 3, 4, 5 follow the same pattern -->

    <div class="control-buttons">
      <button id="drag-drop-submit" class="submit-btn">Check Answers</button>
      <button id="drag-drop-restart" class="restart-btn">Try Again</button>
    </div>

    <div class="score-display" id="drag-drop-score">
      Your score: <span>0</span>/5
    </div>
  </div>
</section>
```

### Rules

- Wrapper section class: `content-section`
- Activity container: `id="drag-drop"` with classes `activity-container active`
- Usually **5 questions** (dd-q1 through dd-q5).
- Each question has:
  - `<div class="question" id="dd-qN">` — unique ID with `dd-q` prefix
  - `<p class="question-text">` — numbered instruction
  - `<div class="drop-zone">` — with `data-index` matching the question ID and `data-answer` containing the full correct answer **in lowercase**
  - `<div class="drag-items">` — contains individual `<div class="drag-item" draggable="true">` for each word
  - `<div class="feedback"></div>` — empty, populated by JS
- The drag items should be in **scrambled order** (not the correct answer order).
- Each word is a separate drag-item. Include duplicate words if needed (e.g., two "the" items).
- **Control buttons**: All buttons are always visible (no inline `style="display:none;"`). The JS modules handle showing/hiding/disabling as needed.
  - Submit: `id="drag-drop-submit"`, class `submit-btn`
  - Restart: `id="drag-drop-restart"`, class `restart-btn`
- **Score display**: `id="drag-drop-score"`. No inline `style` — the JS module handles visibility. The `<span>` inside gets populated by JS. Denominator matches question count.
- **No inline styles** on any activity elements. Visibility and state are managed entirely by the JS modules.

---

## 10. Summary Table

```html
<section id="summary">
  <h2>Summary: TOPIC NAME</h2>
  <table>
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th>Column 3</th>
        <th>Column 4</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Row label</strong></td>
        <td>Description</td>
        <td>structure with <span class="grammar-highlight">highlight</span></td>
        <td><span class="example">Example sentence here.</span></td>
      </tr>
      <!-- More rows -->
    </tbody>
  </table>
</section>
```

### Rules

- Section `id="summary"` — this is the anchor target for the "Review Grammar" link in the MCQ control buttons. Every page must have exactly one section with this ID, and it must be the summary table.
- Plain `<table>` with `<thead>` and `<tbody>`.
- Use `<span class="grammar-highlight">` inside table cells for grammar structure highlights.
- Use `<span class="example">` inside table cells for example sentences.
- Use `<strong>` for bold labels.
- The table columns vary by topic but typically include: Type/Verb, Meaning/Form, Structure, and Example.

---

## 11. MCQ (Multiple Choice) Activity

### HTML Structure

```html
<section class="content-section mcq-container">
  <h2>Test Your Knowledge</h2>
  <p>Choose the correct option for each question.</p>

  <div id="mcq" class="activity-container active">
    <!-- Question 1 -->
    <div class="question" id="q1">
      <p class="mcq-question">1. Question text with _____ blank.</p>
      <div class="options">
        <div class="option" data-index="0">
          <span>A. Option text</span>
        </div>
        <div class="option" data-index="1">
          <span>B. Option text</span>
        </div>
        <div class="option" data-index="2">
          <span>C. Option text</span>
        </div>
        <div class="option" data-index="3">
          <span>D. Option text</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Questions 2 through 10 follow the same pattern -->

    <div class="control-buttons">
      <button id="mcq-submit" class="submit-btn">Check Answers</button>
      <button id="mcq-restart" class="restart-btn">Try Again</button>
      <a href="#summary" class="nav-button">Review Grammar</a>
    </div>

    <div class="score-display" id="mcq-score">
      Your score: <span>0</span>/10
    </div>
  </div>
</section>
```

### Rules

- Wrapper section classes: `content-section mcq-container`
- Activity container: `id="mcq"` with classes `activity-container active`
- Usually **10 questions** (q1 through q10).
- Each question has:
  - `<div class="question" id="qN">` — unique ID with `q` prefix (no "dd-" prefix)
  - `<p class="mcq-question">` — numbered question text. Use `_____` (five underscores) for blanks.
  - `<div class="options">` — contains the answer options
  - Each option: `<div class="option" data-index="N">` where N is 0-based index, containing a `<span>` with letter prefix (A., B., C., D.)
  - `<div class="feedback"></div>` — empty, populated by JS
- Options can be 3 or 4 per question (most pages use 3 or 4, be consistent within a page).
- **Control buttons** — all three are always visible side by side, in this exact order. No inline `style` attributes — the JS modules handle showing/hiding/disabling as needed:
  1. Submit button: `<button id="mcq-submit" class="submit-btn">Check Answers</button>`
  2. Restart button: `<button id="mcq-restart" class="restart-btn">Try Again</button>`
  3. Review Grammar link: `<a href="#summary" class="nav-button">Review Grammar</a>` — links to the summary table section
- **Score display**: `id="mcq-score"`. No inline `style` — the JS module handles visibility. Denominator matches question count.
- **No inline styles** on any activity elements (buttons, score displays). Visibility and state are managed entirely by the JS modules. Do not add `style="display:none;"` or the `review-grammar-btn` class — these are not needed.

---

## 12. Bottom Navigation

```html
<nav class="bottom-navigation">
  <a href="PREVIOUS-PAGE.html" class="nav-button previous">← Previous: Previous Topic Name</a>
  <div class="center-buttons">
    <button class="nav-button print-button" onclick="window.print()">Print This Page</button>
  </div>
  <a href="NEXT-PAGE.html" class="nav-button next">Next: Next Topic Name →</a>
</nav>
```

### Rules

- Placed outside the `<div class="container">`, directly before the footer.
- Three elements: previous link, center buttons, next link.
- Previous link format: `← Previous: Topic Name` or `← Back to: Topic Name`
- Next link format: `Next: Topic Name →`
- Center always contains at minimum the print button.
- Optionally, center can include a practice activities link: `<a href="PRACTICE-PAGE.html" class="nav-button activities">Practice Activities</a>`
- If there's no previous or next page, link to `advanced-grammar.html` with text like `← Back to: Advanced Grammar Topics`

---

## 13. Footer

```html
<footer>
  <div class="footer-content">
    <div class="footer-section">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="../../home.html">Home</a></li>
        <li><a href="../../home.html#where-to-start">Grammar</a></li>
        <li><a href="../../extra-practice.html">Extra Practice</a></li>
        <li><a href="../../my-progress.html">My Progress</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h3>Grammar Topics</h3>
      <ul>
        <li><a href="advanced-grammar.html#advanced-tenses-and-aspect">Advanced Tenses</a></li>
        <li><a href="advanced-grammar.html#conditionals">Advanced Conditionals</a></li>
        <li><a href="advanced-grammar.html#modals">Advanced Modal Verbs</a></li>
        <li><a href="advanced-grammar.html#passive">Advanced Passive Voice</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h3>Connect</h3>
      <ul>
        <li><a href="../../about.html">About</a></li>
        <li><a href="../../contact.html">Contact</a></li>
      </ul>
    </div>
  </div>

  <div class="footer-bottom">
    <p>&copy; 2025 English in Doses | All rights reserved | <a href="../../license.html">Licensing Information</a></p>
  </div>
</footer>
```

### Rules

- Copy this footer block exactly for every page. All paths are relative from `grammar/advanced/`.

---

## 14. JavaScript

### Script tags (placed after footer, before closing `</body>`)

```html
<!-- JavaScript -->
<script src="../../js/core.js"></script>
<script src="../../js/mcq.js"></script>
<script src="../../js/drag-drop.js"></script>
<script src="../../js/progress-tracking-module.js"></script>
```

### Rules

- Always include all four scripts in this order.
- `core.js` — theme toggle, navigation, core functionality
- `mcq.js` — MCQ activity module
- `drag-drop.js` — drag-and-drop activity module
- `progress-tracking-module.js` — progress/completion tracking

### Initialisation Script

After the script tags, include an inline `<script>` block that initialises both activities:

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize MCQ Module
    MCQModule.init({
      containerId: 'mcq',
      answers: {
        'q1': 0,   // 0-based index of correct option
        'q2': 1,
        'q3': 2,
        'q4': 1,
        'q5': 0,
        'q6': 1,
        'q7': 2,
        'q8': 1,
        'q9': 1,
        'q10': 0
      },
      correctExplanations: {
        'q1': "Explanation shown when the user selects the correct answer.",
        'q2': "Explanation for q2...",
        // ... one per question
      },
      incorrectExplanations: {
        'q1': "Explanation shown when the user selects a wrong answer.",
        'q2': "Explanation for q2...",
        // ... one per question
      },
      showAllQuestionsAtOnce: true,
      onComplete: function(score, total) {
        console.log(`MCQ completed with score: ${score}/${total}`);

        if (typeof ProgressTracker !== "undefined") {
          ProgressTracker.markItemCompleted('activities', 'mcq-LESSON-SLUG', {
            score: score,
            maxScore: total,
            completed: true,
            completedAt: new Date().toISOString(),
            title: "TOPIC NAME Practice"
          });

          ProgressTracker.updateItemProgress('lessons', 'LESSON-SLUG', {
            lastViewed: new Date().toISOString(),
            progress: 100,
            title: "TOPIC NAME"
          });
        }
      }
    });

    // Initialize Drag and Drop Module
    DragDropModule.init({
      containerId: 'drag-drop',
      storageKey: 'LESSON-SLUG',
      answers: {
        'dd-q1': 'full answer in lowercase',
        'dd-q2': 'full answer in lowercase',
        'dd-q3': 'full answer in lowercase',
        'dd-q4': 'full answer in lowercase',
        'dd-q5': 'full answer in lowercase'
      },
      onComplete: function(score, total) {
        console.log(`Drag and Drop completed with score: ${score}/${total}`);

        if (typeof ProgressTracker !== "undefined") {
          ProgressTracker.markItemCompleted('activities', 'drag-drop-LESSON-SLUG', {
            score: score,
            maxScore: total,
            completed: true,
            completedAt: new Date().toISOString(),
            title: "TOPIC NAME Sentence Reordering"
          });
        }
      }
    });
  });
</script>
```

### Rules for the init script

- **MCQModule.init**:
  - `containerId`: Always `'mcq'`
  - `answers`: Object mapping question IDs (e.g. `'q1'`) to the 0-based index of the correct option
  - `correctExplanations`: Object mapping question IDs to the explanation shown when the user answers correctly
  - `incorrectExplanations`: Object mapping question IDs to the explanation shown when the user answers incorrectly
  - `showAllQuestionsAtOnce`: Always `true`
  - `onComplete`: Callback that logs the score and calls ProgressTracker

- **DragDropModule.init**:
  - `containerId`: Always `'drag-drop'`
  - `storageKey`: A unique slug for this lesson (e.g., `'causative-verbs'`, `'participle-clauses'`)
  - `answers`: Object mapping question IDs (e.g. `'dd-q1'`) to the complete correct answer as a **lowercase string** with words separated by spaces
  - `onComplete`: Callback that logs the score and calls ProgressTracker

- **LESSON-SLUG**: Use a kebab-case version of the topic name (e.g., `causative-verbs`, `inversion-emphasis`, `participle-clauses`). This is used consistently in:
  - `storageKey` for DragDropModule
  - `'mcq-LESSON-SLUG'` for ProgressTracker MCQ activity ID
  - `'drag-drop-LESSON-SLUG'` for ProgressTracker drag-drop activity ID
  - `'LESSON-SLUG'` for ProgressTracker lesson ID

---

## 15. Full Page Template

Below is a minimal but complete template. Replace all `PLACEHOLDER` values with actual content.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Standard head content -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="TOPIC_NAME - Advanced ESL grammar explanation with examples and practice">
  <title>TOPIC_NAME - Advanced ESL Grammar</title>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&family=Source+Code+Pro&display=swap" rel="stylesheet">

  <!-- Favicon -->
  <link rel="apple-touch-icon" sizes="180x180" href="../../images/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="../../images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="../../images/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">

  <!-- Styles -->
  <link rel="stylesheet" href="../../css/base.css">
  <link rel="stylesheet" href="../../css/levels.css">
  <link rel="stylesheet" href="../../css/activities.css">
  <link rel="stylesheet" href="../../css/progress-tracking-styles.css">
  <link rel="stylesheet" href="../../css/button-shine.css">
</head>
<body class="advanced-section">
  <!-- Skip link and theme toggle -->
  <a href="#main-content" class="skip-link">Skip to content</a>

  <div class="theme-toggle-container">
    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
      <span class="light-icon">☀️</span>
      <span class="dark-icon">🌙</span>
    </button>
  </div>

  <!-- Navigation -->
  <nav class="main-navigation">
    <a href="../../home.html" class="site-logo">
      <img src="../../images/my-logo.svg" alt="English in Doses" width="150" height="auto">
    </a>
    <button class="nav-toggle" aria-label="Toggle navigation">☰</button>
    <div class="nav-links">
      <a href="../../home.html" class="nav-link">Home</a>
      <a href="../../about.html" class="nav-link">About Us</a>
      <a href="../../home.html#level-test" class="nav-link">Find Your Level</a>
      <a href="../../beginner-landing.html" class="nav-link">Beginner</a>
      <a href="../../intermediate-landing.html" class="nav-link">Intermediate</a>
      <a href="../../advanced-landing.html" class="nav-link">Advanced</a>
      <a href="../../travel/beginner-travel/travel-english.html" class="nav-link">Travel English</a>
      <a href="../../my-progress.html" class="nav-link">My Progress</a>
      <a href="../../booking-page.html" class="nav-link">Book a Lesson</a>
    </div>

    <div class="advanced-nav-indicator"></div>
  </nav>

  <div class="container">
    <!-- Breadcrumbs -->
    <div class="breadcrumbs" aria-label="breadcrumb">
      <span class="breadcrumb-item"><a href="../../home.html">Home</a></span>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-item"><a href="../../advanced-landing.html">Advanced English</a></span>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-item"><a href="advanced-grammar.html">Advanced Grammar</a></span>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-item"><a href="advanced-grammar.html#CATEGORY_ID">CATEGORY_NAME</a></span>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-item">TOPIC_NAME</span>
    </div>

    <main id="main-content">
      <h1>TOPIC_NAME</h1>

      <!-- INTRODUCTION SECTION -->
      <section class="intro-section">
        <h2>Introduction</h2>
        <p>INTRO_PARAGRAPH</p>

        <h3>After this lesson, you will be able to:</h3>
        <ul>
          <li>OBJECTIVE_1</li>
          <li>OBJECTIVE_2</li>
          <li>OBJECTIVE_3</li>
        </ul>
      </section>

      <!-- GRAMMAR POINT SECTION 1 -->
      <section class="grammar-point">
        <h2>GRAMMAR_POINT_1_TITLE</h2>

        <p><strong>Form</strong>: FORM_DESCRIPTION with <span class="grammar-highlight">highlighted part</span></p>
        <p><strong>When to use it</strong>: USAGE_DESCRIPTION</p>

        <div class="example">
          <ol>
            <li><span class="grammar-highlight">Grammar part</span> rest of sentence.<br>(= explanation)</li>
            <li><span class="grammar-highlight">Grammar part</span> rest of sentence.<br>(= explanation)</li>
            <li><span class="grammar-highlight">Grammar part</span> rest of sentence.<br>(= explanation)</li>
          </ol>
        </div>

        <div class="note">
          <p><strong>Native speaker note:</strong> NOTE_TEXT</p>
        </div>
      </section>

      <!-- GRAMMAR POINT SECTION 2 -->
      <section class="grammar-point">
        <h2>GRAMMAR_POINT_2_TITLE</h2>
        <!-- Same structure as above -->
      </section>

      <!-- ADD MORE GRAMMAR POINT SECTIONS AS NEEDED -->

      <!-- DRAG AND DROP ACTIVITY -->
      <section class="content-section">
        <h2>Practice: Sentence Reordering</h2>
        <p>Drag the words into the correct order to make sentences with TOPIC_NAME.</p>

        <div id="drag-drop" class="activity-container active">
          <!-- Question 1 -->
          <div class="question" id="dd-q1">
            <p class="question-text">1. INSTRUCTION:</p>
            <div class="drop-zone" data-index="dd-q1" data-answer="ANSWER_LOWERCASE"></div>
            <div class="drag-items">
              <div class="drag-item" draggable="true">WORD</div>
              <div class="drag-item" draggable="true">WORD</div>
              <div class="drag-item" draggable="true">WORD</div>
              <!-- more words -->
            </div>
            <div class="feedback"></div>
          </div>

          <!-- Questions dd-q2 through dd-q5: same structure -->

          <div class="control-buttons">
            <button id="drag-drop-submit" class="submit-btn">Check Answers</button>
            <button id="drag-drop-restart" class="restart-btn">Try Again</button>
          </div>

          <div class="score-display" id="drag-drop-score">
            Your score: <span>0</span>/5
          </div>
        </div>
      </section>

      <!-- SUMMARY TABLE -->
      <section id="summary">
        <h2>Summary: TOPIC_NAME</h2>
        <table>
          <thead>
            <tr>
              <th>COLUMN_1</th>
              <th>COLUMN_2</th>
              <th>COLUMN_3</th>
              <th>COLUMN_4</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>ROW_LABEL</strong></td>
              <td>DESCRIPTION</td>
              <td>STRUCTURE</td>
              <td><span class="example">EXAMPLE_SENTENCE</span></td>
            </tr>
            <!-- more rows -->
          </tbody>
        </table>
      </section>

      <!-- COMMON ERRORS -->
      <section class="common-errors">
        <h2 class="common-errors-heading">Common Errors</h2>

        <div class="error-pattern">
          <p class="error-title"><strong>1: ERROR_DESCRIPTION</strong></p>
          <p class="incorrect">❌ WRONG_SENTENCE</p><br>
          <p class="correct">✓ CORRECT_SENTENCE</p>
          <p class="explanation"><em>EXPLANATION</em></p>
        </div>

        <div class="error-pattern">
          <p class="error-title"><strong>2: ERROR_DESCRIPTION</strong></p>
          <p class="incorrect">❌ WRONG_SENTENCE</p><br>
          <p class="correct">✓ CORRECT_SENTENCE</p>
          <p class="explanation"><em>EXPLANATION</em></p>
        </div>

        <div class="error-pattern">
          <p class="error-title"><strong>3: ERROR_DESCRIPTION</strong></p>
          <p class="incorrect">❌ WRONG_SENTENCE</p><br>
          <p class="correct">✓ CORRECT_SENTENCE</p>
          <p class="explanation"><em>EXPLANATION</em></p>
        </div>
      </section>

      <!-- TIPS -->
      <section class="tips">
        <h2 class="tips-heading">Useful Tips</h2>

        <div class="grammar-tip">
          <p>📌 <strong>TIP 1:</strong> TIP_TEXT</p>
        </div>

        <div class="grammar-tip">
          <p>📌 <strong>TIP 2:</strong> TIP_TEXT</p>
        </div>

        <div class="grammar-tip">
          <p>📌 <strong>TIP 3:</strong> TIP_TEXT</p>
        </div>
      </section>

      <!-- MCQ ACTIVITY -->
      <section class="content-section mcq-container">
        <h2>Test Your Knowledge</h2>
        <p>Choose the correct option for each question.</p>

        <div id="mcq" class="activity-container active">
          <!-- Question 1 -->
          <div class="question" id="q1">
            <p class="mcq-question">1. QUESTION_TEXT _____.</p>
            <div class="options">
              <div class="option" data-index="0">
                <span>A. OPTION_A</span>
              </div>
              <div class="option" data-index="1">
                <span>B. OPTION_B</span>
              </div>
              <div class="option" data-index="2">
                <span>C. OPTION_C</span>
              </div>
              <div class="option" data-index="3">
                <span>D. OPTION_D</span>
              </div>
            </div>
            <div class="feedback"></div>
          </div>

          <!-- Questions q2 through q10: same structure -->

          <div class="control-buttons">
            <button id="mcq-submit" class="submit-btn">Check Answers</button>
            <button id="mcq-restart" class="restart-btn">Try Again</button>
            <a href="#summary" class="nav-button">Review Grammar</a>
          </div>

          <div class="score-display" id="mcq-score">
            Your score: <span>0</span>/10
          </div>
        </div>
      </section>
    </main>
  </div>

  <!-- BOTTOM NAVIGATION -->
  <nav class="bottom-navigation">
    <a href="PREVIOUS_PAGE.html" class="nav-button previous">← Previous: PREVIOUS_TOPIC</a>
    <div class="center-buttons">
      <button class="nav-button print-button" onclick="window.print()">Print This Page</button>
    </div>
    <a href="NEXT_PAGE.html" class="nav-button next">Next: NEXT_TOPIC →</a>
  </nav>

  <!-- Footer -->
  <footer>
    <div class="footer-content">
      <div class="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="../../home.html">Home</a></li>
          <li><a href="../../home.html#where-to-start">Grammar</a></li>
          <li><a href="../../extra-practice.html">Extra Practice</a></li>
          <li><a href="../../my-progress.html">My Progress</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Grammar Topics</h3>
        <ul>
          <li><a href="advanced-grammar.html#advanced-tenses-and-aspect">Advanced Tenses</a></li>
          <li><a href="advanced-grammar.html#conditionals">Advanced Conditionals</a></li>
          <li><a href="advanced-grammar.html#modals">Advanced Modal Verbs</a></li>
          <li><a href="advanced-grammar.html#passive">Advanced Passive Voice</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Connect</h3>
        <ul>
          <li><a href="../../about.html">About</a></li>
          <li><a href="../../contact.html">Contact</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 English in Doses | All rights reserved | <a href="../../license.html">Licensing Information</a></p>
    </div>
  </footer>

  <!-- JavaScript -->
  <script src="../../js/core.js"></script>
  <script src="../../js/mcq.js"></script>
  <script src="../../js/drag-drop.js"></script>
  <script src="../../js/progress-tracking-module.js"></script>

  <!-- Activity Initialisation -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Initialize MCQ Module
      MCQModule.init({
        containerId: 'mcq',
        answers: {
          'q1': 0,  // 0-based index of correct answer
          'q2': 0,
          'q3': 0,
          'q4': 0,
          'q5': 0,
          'q6': 0,
          'q7': 0,
          'q8': 0,
          'q9': 0,
          'q10': 0
        },
        correctExplanations: {
          'q1': "CORRECT_EXPLANATION",
          'q2': "CORRECT_EXPLANATION",
          'q3': "CORRECT_EXPLANATION",
          'q4': "CORRECT_EXPLANATION",
          'q5': "CORRECT_EXPLANATION",
          'q6': "CORRECT_EXPLANATION",
          'q7': "CORRECT_EXPLANATION",
          'q8': "CORRECT_EXPLANATION",
          'q9': "CORRECT_EXPLANATION",
          'q10': "CORRECT_EXPLANATION"
        },
        incorrectExplanations: {
          'q1': "INCORRECT_EXPLANATION",
          'q2': "INCORRECT_EXPLANATION",
          'q3': "INCORRECT_EXPLANATION",
          'q4': "INCORRECT_EXPLANATION",
          'q5': "INCORRECT_EXPLANATION",
          'q6': "INCORRECT_EXPLANATION",
          'q7': "INCORRECT_EXPLANATION",
          'q8': "INCORRECT_EXPLANATION",
          'q9': "INCORRECT_EXPLANATION",
          'q10': "INCORRECT_EXPLANATION"
        },
        showAllQuestionsAtOnce: true,
        onComplete: function(score, total) {
          console.log(`MCQ completed with score: ${score}/${total}`);

          if (typeof ProgressTracker !== "undefined") {
            ProgressTracker.markItemCompleted('activities', 'mcq-LESSON_SLUG', {
              score: score,
              maxScore: total,
              completed: true,
              completedAt: new Date().toISOString(),
              title: "TOPIC_NAME Practice"
            });

            ProgressTracker.updateItemProgress('lessons', 'LESSON_SLUG', {
              lastViewed: new Date().toISOString(),
              progress: 100,
              title: "TOPIC_NAME"
            });
          }
        }
      });

      // Initialize Drag and Drop Module
      DragDropModule.init({
        containerId: 'drag-drop',
        storageKey: 'LESSON_SLUG',
        answers: {
          'dd-q1': 'answer in lowercase',
          'dd-q2': 'answer in lowercase',
          'dd-q3': 'answer in lowercase',
          'dd-q4': 'answer in lowercase',
          'dd-q5': 'answer in lowercase'
        },
        onComplete: function(score, total) {
          console.log(`Drag and Drop completed with score: ${score}/${total}`);

          if (typeof ProgressTracker !== "undefined") {
            ProgressTracker.markItemCompleted('activities', 'drag-drop-LESSON_SLUG', {
              score: score,
              maxScore: total,
              completed: true,
              completedAt: new Date().toISOString(),
              title: "TOPIC_NAME Sentence Reordering"
            });
          }
        }
      });
    });
  </script>

</body>
</html>
```

---

## Section Order Checklist

Use this checklist when building a new page:

1. `<h1>` — Page title
2. `<section class="intro-section">` — Introduction + learning objectives
3. `<section class="grammar-point">` — Grammar point 1 (repeat as needed)
4. `<section class="grammar-point">` — Grammar point 2, etc.
5. `<section class="content-section">` — Drag-and-drop activity (5 questions)
6. `<section id="summary">` — Summary table (this is the "Review Grammar" anchor target)
7. `<section class="common-errors">` — Common errors (3 patterns)
8. `<section class="tips">` — Useful tips (3 tips)
9. `<section class="content-section mcq-container">` — MCQ activity (10 questions)
