# CLAUDE.md — English in Doses: Project Guide

This file documents the design system, conventions, and patterns for the **English in Doses** ESL website. Use this as the single source of truth when creating new pages.

---

## 1. Project Overview

**Site name:** English in Doses
**Purpose:** Adult ESL (English as a Second Language) learning platform
**Tagline:** "Master English at your pace" / "Learn English in Short, Effective Sessions"
**Published on:** GitHub Pages

### Content Levels
| Level | Color | Body class | Emoji |
|-------|-------|------------|-------|
| Beginner (A1–A2) | Green `#2ecc71` | `beginner-section` | 🌱 |
| Intermediate (B1–B2) | Orange `#FF9800` | `intermediate-section` | 📗 |
| Advanced (C1–C2) | Blue `#3498db` | `advanced-section` | 🎓 |
| Conversation | Teal `#26A69A` | `conversation-section` | 💬 |

---

## 2. Directory Structure

```
/
├── home.html                    # Main homepage
├── index.html                   # Redirects to home.html
├── beginner-landing.html
├── intermediate-landing.html
├── advanced-landing.html
├── conversation-page.html
├── about.html
├── my-progress.html
├── homepage-quiz.html
│
├── css/
│   ├── base.css                 # Core styles — ALL shared styles live here
│   ├── home.css                 # Homepage-specific only
│   ├── landing.css              # Level landing pages only
│   ├── activities.css           # Interactive activity styles
│   ├── button-shine.css
│   ├── flash-cards.css
│   ├── vocab-match.css
│   ├── drop-down.css
│   ├── compact-matching.css
│   ├── homepage-quiz.css
│   ├── progress-tracking-styles.css
│   └── print-reference.css
│
├── js/
│   ├── core.js                  # Theme toggle, mobile nav, print button
│   ├── mcq.js                   # Multiple-choice questions
│   ├── matching.js
│   ├── drag-drop.js
│   ├── drop-down.js
│   ├── gap-fill.js
│   ├── flash-cards.js
│   ├── vocab-match.js
│   ├── compact-matching.js
│   ├── homepage-quiz.js
│   ├── activity-nav.js
│   ├── progress-tracking-module.js
│   ├── progress-manager-ui.js
│   └── init-progress.js
│
├── grammar/
│   ├── beginner/
│   ├── intermediate/
│   └── advanced/
│       └── extra-practice/
│
├── travel/
│   └── beginner-travel/
│
├── templates/                   # Reference templates — do not serve directly
│   ├── grammar-explanation-template.html
│   ├── advanced-grammar-explanation-template.html
│   ├── practice-page-template.html
│   ├── standardized-mcq-template.html
│   ├── mcq template.html
│   ├── navbar-template.html
│   ├── breadcrumbs.html
│   ├── footer-template.html
│   ├── head.html
│   └── theme-toggle.html
│
└── images/
    ├── my-logo.svg
    ├── apple-touch-icon.png
    ├── favicon-32x32.png
    ├── favicon-16x16.png
    └── travel-beginner/
```

**Path depth rule:** From `grammar/advanced/` files use `../../` to reach root assets.
From `grammar/beginner/` or `travel/beginner-travel/` also use `../../`.

---

## 3. Design System

### 3.1 CSS Variables (`:root` in `base.css`)

```css
/* Light theme (default) */
--bg-color: #ffffff;
--text-color: #333333;
--header-bg: #1B263B;        /* Dark navy — nav & h1 background */
--header-text: #ffffff;
--card-bg: #f8f9fa;
--border-color: #ddd;
--accent-color: #3498db;     /* Blue — links, h2 underlines, left borders */
--secondary-accent: #f07d3e; /* Orange — tips, CTA buttons */
--link-color: #3498db;
--success-bg: #d4edda;
--success-color: #155724;
--error-bg: #f8d7da;
--error-color: #721c24;
--example-bg: #f8f9fa;
--shadow-color: rgba(0,0,0,0.1);
--note-bg: #e8f4fd;
--note-border: #bde0fe;

/* Beginner-specific */
--beginner-primary: #2ecc71;
--beginner-primary-dark: #27ae60;
--beginner-secondary: #f39c12;
--beginner-card-bg: #f0fff5;
--beginner-icon-bg: #e8f8e8;
```

Dark theme values are automatically applied via `[data-theme="dark"]` — do not override manually.

### 3.2 Typography

| Element | Font | Size | Notes |
|---------|------|------|-------|
| Body | Open Sans 400 | 16px | `line-height: 1.6` |
| Headings | Montserrat 400/600/700 | — | All `h1`–`h6` |
| `h1` | Montserrat | 2rem | Navy bg `#1B263B`, white text, `border-radius: 10px`, shadow |
| `h2` | Montserrat | 1.5rem | Blue bottom border `2px solid var(--accent-color)`, `display: inline-block` |
| `h3` | Montserrat | 1.25rem | Normal styling |
| `h4` | Montserrat | 1rem | Normal styling |
| Code/examples | Source Code Pro | — | Gray bg, `padding: 5px`, `border-radius: 3px` |

Google Fonts import (use in every `<head>`):
```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&family=Source+Code+Pro&display=swap" rel="stylesheet">
```

### 3.3 Layout

```css
/* Standard content pages */
.container { max-width: 800px; margin: 0 auto; padding: 0 20px; }

/* Landing/hub pages */
.landing-container { max-width: 1280px; }

/* Content sections (inside .container) */
.intro-section, .content-section { max-width: 760px; }
```

---

## 4. Page Sections (HTML Components)

### 4.1 Section Types

```html
<!-- Opening section — blue left border -->
<section class="intro-section">
  <h2>Introduction</h2>
  <p>...</p>
</section>

<!-- Main content block — blue left border -->
<section class="content-section">
  <h2>Grammar Point</h2>
  ...
</section>

<!-- Tips — orange left border, orange h2 underline -->
<section class="tips-section">
  <h2 class="tips-heading">Useful Tips</h2>
  ...
</section>

<!-- Individual tip boxes (inside tips-section or content-section) -->
<div class="grammar-tip">
  <p>📝 <strong>TIP 1:</strong> ...</p>
</div>

<!-- Native speaker note — blue background -->
<div class="note">
  <p><strong>Native speaker note:</strong> ...</p>
</div>

<!-- Important note -->
<div class="important-note">
  <p>...</p>
</div>
```

### 4.2 Examples and Errors

```html
<!-- Code/sentence example (inline) -->
<span class="example">She has been working here for five years.</span>

<!-- Example block -->
<div class="example">
  <ol>
    <li>She <span class="example">has been working</span> here for years.</li>
    <li>They <span class="example">have finished</span> the project.</li>
  </ol>
</div>

<!-- Correct/incorrect comparison -->
<p class="incorrect">❌ He go to school every day.</p>
<p class="correct">✓ He goes to school every day.</p>

<!-- Error pattern block -->
<div class="error-pattern">
  <p class="error-title"><strong>1: Subject-Verb Agreement</strong></p>
  <p class="incorrect">He go to work.</p>
  <p class="correct">He goes to work. ✓</p>
  <p class="explanation"><em>Third person singular requires -s.</em></p>
</div>
```

---

## 5. Standard Page Structure

Every page must include the following elements in order. Use the templates in `/templates/` as the canonical reference.

### 5.1 `<head>` Block

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="PAGE DESCRIPTION HERE">
  <title>PAGE TITLE - English in Doses</title>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&family=Source+Code+Pro&display=swap" rel="stylesheet">

  <!-- Favicons -->
  <link rel="apple-touch-icon" sizes="180x180" href="PATH/images/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="PATH/images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="PATH/images/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">

  <!-- Styles -->
  <link rel="stylesheet" href="PATH/css/base.css">
  <link rel="stylesheet" href="PATH/css/activities.css">  <!-- if page has activities -->

  <!-- Level indicator (copy as-is, do NOT put in base.css) -->
  <style>
    .nav-indicator {
      height: 3px;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .beginner-section .nav-indicator     { background-color: var(--beginner-primary); }
    .intermediate-section .nav-indicator { background-color: #FF9800; }
    .advanced-section .nav-indicator     { background-color: var(--accent-color); }
    .conversation-section .nav-indicator { background-color: #26A69A; }
  </style>
</head>
```

Replace `PATH` with the correct relative path (`../../`, `../`, etc.).

### 5.2 `<body>` Opening

```html
<body class="LEVEL-section">   <!-- beginner-section | intermediate-section | advanced-section | conversation-section -->

  <!-- Accessibility skip link -->
  <a href="#main-content" class="skip-link">Skip to content</a>

  <!-- Theme toggle -->
  <div class="theme-toggle-container">
    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
      <span class="light-icon">☀️</span>
      <span class="dark-icon">🌙</span>
    </button>
  </div>
```

### 5.3 Navigation Bar

```html
<nav class="main-navigation">
  <a href="PATH/home.html" class="site-logo">
    <img src="PATH/images/my-logo.svg" alt="English in Doses" width="150" height="auto">
  </a>
  <button class="nav-toggle" aria-label="Toggle navigation">☰</button>
  <div class="nav-links">
    <a href="PATH/home.html" class="nav-link">Home</a>
    <a href="PATH/about.html" class="nav-link">About Us</a>
    <a href="PATH/home.html#level-test" class="nav-link">Find Your Level</a>
    <a href="PATH/beginner-landing.html" class="nav-link">Beginner</a>
    <a href="PATH/intermediate-landing.html" class="nav-link">Intermediate</a>
    <a href="PATH/advanced-landing.html" class="nav-link">Advanced</a>
    <a href="PATH/travel/beginner-travel/travel-english.html" class="nav-link">Travel English</a>
    <a href="PATH/my-progress.html" class="nav-link">My Progress</a>
    <a href="PATH/booking-page.html" class="nav-link">Book a Lesson</a>
    <div class="nav-indicator"></div>
  </div>
</nav>
```

### 5.4 Breadcrumbs

Breadcrumb patterns by page location:

| Page location | Breadcrumb |
|---|---|
| Level landing | `Home › Beginner` |
| Grammar hub | `Home › Grammar` |
| Grammar lesson | `Home › Grammar › Advanced › Topic Name` |
| Travel lesson | `Home › Travel English › Beginner › Lesson Title` |

```html
<div class="breadcrumbs" aria-label="breadcrumb">
  <span class="breadcrumb-item"><a href="PATH/home.html">Home</a></span>
  <span class="breadcrumb-separator">›</span>
  <span class="breadcrumb-item"><a href="PATH/grammar/advanced/advanced-grammar.html">Grammar</a></span>
  <span class="breadcrumb-separator">›</span>
  <span class="breadcrumb-item">Current Page Name</span>
</div>
```

### 5.5 Main Content Wrapper

```html
<div class="container">
  <!-- breadcrumbs here -->
  <main id="main-content">
    <h1>Page Title</h1>
    <!-- sections here -->
  </main>
</div>
```

### 5.6 Bottom Navigation (lesson pages)

```html
<nav class="bottom-navigation">
  <a href="PREVIOUS_URL" class="nav-button previous">← Previous: Topic Name</a>
  <div class="center-buttons">
    <button class="nav-button print-button" onclick="window.print()">Print This Page</button>
    <a href="PRACTICE_URL" class="nav-button activities">Practice Activities</a>
  </div>
  <a href="NEXT_URL" class="nav-button next">Next: Topic Name →</a>
</nav>
```

### 5.7 Footer

```html
<footer>
  <div class="footer-content">
    <div class="footer-section">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="PATH/home.html">Home</a></li>
        <li><a href="PATH/home.html#where-to-start">Grammar</a></li>
        <li><a href="PATH/extra-practice.html">Extra Practice</a></li>
        <li><a href="PATH/my-progress.html">My Progress</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <h3>Grammar Topics</h3>
      <ul>
        <li><a href="PATH/grammar/advanced/advanced-grammar.html#advanced-tenses-and-aspect">Advanced Tenses</a></li>
        <li><a href="PATH/grammar/advanced/advanced-grammar.html#conditionals">Advanced Conditionals</a></li>
        <li><a href="PATH/grammar/advanced/advanced-grammar.html#modals">Advanced Modal Verbs</a></li>
        <li><a href="PATH/grammar/advanced/advanced-grammar.html#passive">Advanced Passive Voice</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <h3>Connect</h3>
      <ul>
        <li><a href="PATH/about.html">About</a></li>
        <li><a href="PATH/contact.html">Contact</a></li>
        <li><a href="PATH/privacy.html">Privacy Policy</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2025 English in Doses | All rights reserved | <a href="PATH/license.html">Licensing Information</a></p>
  </div>
</footer>
```

### 5.8 JavaScript (end of `<body>`)

**Always include:**
```html
<script src="PATH/js/core.js"></script>
```

**Add as needed:**
```html
<script src="PATH/js/mcq.js"></script>
<script src="PATH/js/matching.js"></script>
<script src="PATH/js/gap-fill.js"></script>
<script src="PATH/js/drag-drop.js"></script>
<script src="PATH/js/drop-down.js"></script>
<script src="PATH/js/flash-cards.js"></script>
<script src="PATH/js/vocab-match.js"></script>
<script src="PATH/js/compact-matching.js"></script>
<script src="PATH/js/activity-nav.js"></script>

<!-- Progress tracking (add when the page has activities) -->
<script src="PATH/js/progress-tracking-module.js"></script>
<script src="PATH/js/init-progress.js"></script>
```

---

## 6. Activity Components

### 6.1 MCQ (Multiple Choice Questions)

```html
<section class="content-section">
  <h2>Quick Practice</h2>
  <div id="mcq" class="activity-container active">

    <div class="question" id="q1">
      <p class="mcq-question">1. Question text here?</p>
      <div class="options">
        <div class="option" data-index="0"><span>A. Option A</span></div>
        <div class="option" data-index="1"><span>B. Option B</span></div>
        <div class="option" data-index="2"><span>C. Option C</span></div>
        <div class="option" data-index="3"><span>D. Option D</span></div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Repeat for q2, q3, q4, q5 -->

    <div class="control-buttons">
      <button id="mcq-submit" class="submit-btn">Check Answers</button>
      <button id="mcq-restart" class="restart-btn" style="display:none;">Try Again</button>
    </div>
    <div class="score-display" id="mcq-score" style="display:none;">
      Your score: <span>0</span>/5
    </div>
  </div>
</section>
```

MCQ init script:
```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    MCQModule.init({
      containerId: 'mcq',
      answers: {
        'q1': 2,  // 0-based index of correct option
        'q2': 1,
        'q3': 0,
        'q4': 3,
        'q5': 2
      },
      incorrectTips: {
        'q1': 'Feedback for q1',
        'q2': 'Feedback for q2',
        'q3': 'Feedback for q3',
        'q4': 'Feedback for q4',
        'q5': 'Feedback for q5'
      },
      onComplete: function(score, total) {
        if (typeof ProgressTrackingModule !== 'undefined') {
          ProgressTrackingModule.markItemCompleted('activities', 'mcq-ACTIVITY_ID', {
            score: score, maxScore: total, completed: true,
            completedAt: new Date().toISOString(),
            title: 'GRAMMAR_TOPIC Quick Practice'
          });
          ProgressTrackingModule.updateItemProgress('lessons', 'LESSON_ID', {
            lastViewed: new Date().toISOString(), progress: 100,
            title: 'GRAMMAR_TOPIC'
          });
        }
      }
    });
  });
</script>
```

---

## 7. Grammar Lesson Page Blueprint

Use this order of sections for every grammar explanation page:

1. `<h1>` — Topic title
2. `.intro-section` — What it is + learning objectives (`<ul>`)
3. `.content-section` (×2–4) — One per grammar concept:
   - `<h2>` concept name
   - Explanation paragraph with `<strong>Structure:</strong>`
   - `.example` block with numbered `<ol>`
   - `.note` for native speaker usage
4. Summary `<table>` with `<thead>` + `<tbody>`
5. `.content-section` — Common Errors (`.error-pattern` blocks)
6. `.tips-section` / `.grammar-tip` blocks — Tips
7. MCQ practice section
8. Bottom navigation

---

## 8. Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| HTML files | kebab-case | `narrative-tenses.html` |
| CSS classes | kebab-case | `content-section` |
| JS module IDs | kebab-case | `mcq-narrative-tenses` |
| Activity IDs | `mcq-` + topic slug | `mcq-passive-voice` |
| Lesson IDs | topic slug | `passive-voice` |
| Image folders | `kebab-case/` | `travel-beginner/lesson1/` |

---

## 9. Icons / Emoji Used Sitewide

| Emoji | Meaning |
|-------|---------|
| 🌱 | Beginner level |
| 📚 | Grammar |
| 💬 | Conversation / native speaker notes |
| 📝 | Tips / writing |
| 🎯 | Interactive practice |
| ⭐ | Key point / importance |
| 🎉 | Success / completion |
| ❌ | Incorrect example |
| ✓ | Correct example |

---

## 10. Do's and Don'ts

**Do:**
- Always add `id="main-content"` to `<main>` (accessibility)
- Always include the `<a href="#main-content" class="skip-link">` skip link
- Always set `<body class="LEVEL-section">` for level pages
- Always include the `.nav-indicator` `<div>` inside `.nav-links`
- Use CSS variables (`var(--accent-color)`) rather than hardcoded hex values

**Don't:**
- Don't skip breadcrumbs on content pages
- Don't add <styles> or inline css. All css should be added to existing css files or create a new dedicated css file.
- Don't use `<table>` for layout — only for data comparison (grammar summary tables)
- Don't hardcode colors that have CSS variable equivalents
