# ESL Website Modular Files
# Copy and paste this into a .sh file and run it to create the file structure
# Or manually create the directories and files

# Create directory structure
mkdir -p css js templates html images

# CSS Files
cat > css/base.css << 'EOL'
/* 
 * ESL Grammar Website - Base Styles
 * Updated version with requested changes
 */

/* ----------------------------------------
   1. Color Scheme & Theme Variables
   ---------------------------------------- */
   :root {
    /* Light theme (default) */
    --bg-color: #ffffff;
    --text-color: #333333;
    --header-bg: #1B263B;
    --header-text: #ffffff;
    --card-bg: #f8f9fa;
    --border-color: #ddd;
    --accent-color: #3498db;
    --secondary-accent: #f07d3e;
    --link-color: #3498db;
    --success-bg: #d4edda;
    --success-color: #155724;
    --error-bg: #f8d7da;
    --error-color: #721c24;
    --example-bg: #f8f9fa;
    --shadow-color: rgba(0, 0, 0, 0.1);
    --progress-bg: #f0f0f0;
    --progress-fill: #3498db;
    --note-bg: #e8f4fd;
    --note-border: #bde0fe;
    --error-text: #dc3545;
    --success-text: #28a745;

    /* Beginner section theme variables */
  --beginner-primary: #2ecc71;      /* Vibrant green */
  --beginner-primary-dark: #27ae60; /* Darker green for hover states */
  --beginner-secondary: #f39c12;    /* Warm orange accent */
  --beginner-card-bg: #f0fff5;      /* Very light green background */
  --beginner-icon-bg: #e8f8e8;      /* Slightly darker green for icons */
  }
  
  [data-theme="dark"] {
    /* Dark theme */
    --bg-color: #121212;
    --text-color: #e0e0e0;
    --header-bg: #000000;
    --header-text: #ffffff;
    --card-bg: #1e1e1e;
    --border-color: #444444;
    --accent-color: #4fa3e0;
    --secondary-accent: #f38d56;
    --link-color: #4fa3e0;
    --success-bg: #143823;
    --success-color: #7cda9c;
    --error-bg: #2c1215;
    --error-color: #e7a9ad;
    --example-bg: #2a2a2a;
    --shadow-color: rgba(0, 0, 0, 0.3);
    --progress-bg: #2a2a2a;
    --progress-fill: #4fa3e0;
    --note-bg: #1a2a3a;
    --note-border: #234567;
    --error-text: #f87c86;
    --success-text: #75e096;
    
  }
  
  /* ----------------------------------------
     2. Typography
     ---------------------------------------- */
  body {
    font-family: 'Open Sans', sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--bg-color);
    transition: background-color 0.3s ease, color 0.3s ease;
    margin: 0;
    padding: 0;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Montserrat', sans-serif;
    margin-top: 0;
    color: var(--text-color);
  }
  
  h1 {
    background-color: var(--header-bg);
    color: var(--header-text);
    padding: 20px;
    padding-left: 30px;
    border-radius: 10px;
    margin-bottom: 30px;
    box-shadow: 0 4px 6px var(--shadow-color);
    font-size: 2rem;
  }
  
  h2 {
    border-bottom: 2px solid var(--accent-color);
    display: inline-block;
    padding-bottom: 5px;
    margin-bottom: 20px;
    margin-top: 30px;
    font-size: 1.5rem;
  }
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 15px;
  }
  
  .example, span.example, em {
    font-family: 'Source Code Pro', monospace;
    background-color: var(--example-bg);
    padding: 5px;
    border-radius: 3px;
    margin: 0;
    display: inline-block;
  }
  
  a {
    color: var(--link-color);
    text-decoration: none;
    transition: color 0.2s;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  code, .code {
    font-family: 'Source Code Pro', monospace;
    background-color: var(--example-bg);
    padding: 2px 5px;
    border-radius: 3px;
  }
  
  /* ----------------------------------------
     3. Layout & Containers
     ---------------------------------------- */
  .container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
    box-sizing: border-box;
  }
  
  section {
    margin-bottom: 2rem;
  }
  
  .intro-section {
    background-color: var(--card-bg);
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    border-left: 5px solid var(--accent-color);
    width: 100%;
    box-sizing: border-box;
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .content-section {
    background-color: var(--card-bg);
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    border-left: 5px solid var(--accent-color);
    width: 100%;
    box-sizing: border-box;
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .tips-section {
    background-color: var(--card-bg);
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    border-left: 5px solid var(--secondary-accent);
    width: 100%;
    box-sizing: border-box;
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
  }
  
  /* Change tips section h2 underline to secondary accent color */
  .tips-section h2, .tips-heading, .tips h2 {
    border-bottom: 2px solid var(--secondary-accent);
  }
  
  .grammar-tip {
    background-color: var(--example-bg);
    padding: 10px;
    border-radius: 4px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-left: 3px solid var(--secondary-accent);
  }
  
  hr {
    border: none;
    height: 1px;
    background-color: var(--border-color);
    margin: 25px 0;
  }
  
  /* ----------------------------------------
     4. Navigation Bar
     ---------------------------------------- */
  .main-navigation {
    background-color: var(--header-bg);
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    position: relative;
  }
  
  .site-logo {
    color: var(--header-text);
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    font-size: 1.2rem;
    text-decoration: none;
    margin-right: 20px;
  }
  
  .site-logo img {
    display: block;
    max-height: 50px; /* Adjust this value as needed */
    width: auto;
    border-radius: 50%;
    transition: transform 0.2s ease; /* Optional: adds a subtle hover effect */
    
  }
  
  .site-logo:hover img {
    transform: scale(1.1); /* Increased from 1.05 to 1.1 */
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.4); /* Adds a subtle glow effect */
  }
  
  .nav-links {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    margin-right: 80px;
  }
  
  .nav-link {
    color: var(--header-text);
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
    text-decoration: none;
  }
  
  .nav-link.active {
    background-color: var(--accent-color);
  }
  
  .nav-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--header-text);
    font-size: 1.5rem;
    cursor: pointer;
  }
  
  /* Bottom navigation - Full width of the page */
  .bottom-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    padding: 15px;
    border-top: 1px solid var(--border-color);
    width: 100%;
    background-color: var(--header-bg);
    border-radius: 5px;
  }
  
  .center-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
  
  .nav-button {
    background-color: var(--accent-color);
    color: white;
    padding: 10px 15px;
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.3s, transform 0.2s;
    font-family: 'Open Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }
  
  .nav-button:hover {
    background-color: #2980b9;
    text-decoration: none;
    transform: translateY(-2px);
  }
  
  .nav-button.previous {
    margin-right: auto;
  }
  
  .nav-button.next {
    margin-left: auto;
  }
  
  .nav-button.activities {
    background-color: var(--secondary-accent);
  }
  
  .nav-button.activities:hover {
    background-color: #e06d2e;
  }
  
  /* ----------------------------------------
     5. Breadcrumbs
     ---------------------------------------- */
  .breadcrumbs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    font-size: 0.9rem;
    flex-wrap: wrap;
  }
  
  .breadcrumb-item {
    color: #6c757d;
  }
  
  .breadcrumb-item a {
    color: var(--link-color);
    text-decoration: none;
  }
  
  .breadcrumb-item a:hover {
    text-decoration: underline;
  }
  
  .breadcrumb-separator {
    color: #6c757d;
  }
  
  /* ----------------------------------------
     6. Footer
     ---------------------------------------- */
  footer {
    font-style: italic;
    color: var(--text-color);
    opacity: 0.8;
    margin-top: 30px;
    padding-top: 15px;
    border-top: 1px solid var(--border-color);
    text-align: center;
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
  }
  
  /* Updated footer layout to display sections horizontally */
  .footer-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .footer-section {
    flex: 1;
    min-width: 150px;
    text-align: left;
  }
  
  .footer-section h3 {
    font-size: 1.1rem;
    margin-bottom: 10px;
  }
  
  .footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .footer-section ul li {
    margin-bottom: 8px;
  }
  
  .footer-bottom {
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid var(--border-color);
  }
  
  /* ----------------------------------------
     7. Tables
     ---------------------------------------- */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    box-shadow: 0 2px 3px var(--shadow-color);
    border-radius: 5px;
    overflow: hidden;
  }
  
  th, td {
    border: 1px solid var(--border-color);
    padding: 12px;
    text-align: left;
  }
  
  th {
    background-color: var(--accent-color);
    color: white;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
  }
  
  tr:nth-child(even) {
    background-color: var(--card-bg);
  }
  
  tr:hover {
    background-color: rgba(52, 152, 219, 0.1);
  }
  
  /* ----------------------------------------
     8. Theme Toggle
     ---------------------------------------- */
  .theme-toggle-container {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 100;
  }
  
  .theme-toggle {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: background-color 0.3s;
  }
  
  .theme-toggle:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .light-icon, .dark-icon {
    position: absolute;
    transition: opacity 0.3s, transform 0.3s;
  }
  
  .light-icon {
    opacity: 0;
    transform: rotate(90deg);
  }
  
  .dark-icon {
    opacity: 1;
    transform: rotate(0);
  }
  
  [data-theme="dark"] .light-icon {
    opacity: 1;
    transform: rotate(0);
  }
  
  [data-theme="dark"] .dark-icon {
    opacity: 0;
    transform: rotate(-90deg);
  }
  
  /* ----------------------------------------
     9. Buttons and Form Elements
     ---------------------------------------- */
  button, .btn {
    background-color: var(--accent-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 15px;
    cursor: pointer;
    font-family: 'Open Sans', sans-serif;
    transition: background-color 0.3s, transform 0.2s;
  }
  
  button:hover, .btn:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }
  
  .btn-secondary {
    background-color: var(--secondary-accent);
  }
  
  .btn-secondary:hover {
    background-color: #e06d2e;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="password"],
  textarea,
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: var(--bg-color);
    color: var(--text-color);
    font-family: 'Open Sans', sans-serif;
    transition: border-color 0.3s;
  }
  
  input[type="text"]:focus,
  input[type="email"]:focus,
  input[type="password"]:focus,
  textarea:focus,
  select:focus {
    border-color: var(--accent-color);
    outline: none;
  }
  
  /* ----------------------------------------
     10. Progress Tracking
     ---------------------------------------- */
  .progress-container {
    background-color: var(--progress-bg);
    border-radius: 5px;
    height: 10px;
    width: 100%;
    max-width: 760px;
    margin: 20px auto;
    overflow: hidden;
  }
  
  .progress-bar {
    height: 100%;
    width: 0%;
    background-color: var(--progress-fill);
    transition: width 0.5s ease;
  }
  
  .progress-info {
    text-align: center;
    font-size: 0.9rem;
    margin-bottom: 20px;
    color: var(--text-color);
  }
  
  /* ----------------------------------------
     11. Accessibility
     ---------------------------------------- */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: #1B263B;
    color: white;
    padding: 8px;
    z-index: 100;
    transition: top 0.3s;
    border-radius: 20px;
  }
  
  .skip-link:focus {
    top: 0;
  }
  
  /* ----------------------------------------
     12. Print Styles
     ---------------------------------------- */
  @media print {
    .main-navigation, 
    .theme-toggle-container, 
    .bottom-navigation, 
    .print-button {
      display: none !important;
    }
    
    body {
      background-color: white;
      color: black;
    }
    
    h1 {
      background-color: white;
      color: black;
      box-shadow: none;
    }
  }
  
  /* ----------------------------------------
     13. Responsive Design Media Queries
     ---------------------------------------- */
  @media (max-width: 768px) {
    .nav-toggle {
      display: block;
    }
    
    .nav-links {
      display: none;
      width: 100%;
      flex-direction: column;
    }
    
    .nav-links.show {
      display: flex;
    }

    .site-logo img {
      max-height: 40px;
    }
    
    .bottom-navigation {
      flex-direction: column;
      gap: 10px;
    }
    
    .center-buttons {
      display: flex;
      width: 100%;
      gap: 10px;
    }
    
    .nav-button, .print-button {
      width: 100%;
      text-align: center;
      justify-content: center;
    }
    
    html {
      font-size: 15px;
    }
    
    h1 {
      font-size: 1.8rem;
      padding: 15px;
    }
    
    h2 {
      font-size: 1.5rem;
    }
    
    .container {
      padding: 0 15px;
    }
    
    /* Adjust footer for mobile */
    .footer-content {
      flex-direction: column;
      gap: 15px;
    }
    
    .footer-section {
      width: 100%;
    }
  }
  
  @media (max-width: 480px) {
    html {
      font-size: 14px;
    }
    
    .breadcrumbs {
      font-size: 0.8rem;
    }
    
    table {
      font-size: 0.9rem;
    }
    
    th, td {
      padding: 8px;
    }
  }
  
  /* ----------------------------------------
     14. NEWLY ADDED STYLES
     ---------------------------------------- */
  
  /* Grammar point section styling */
  .grammar-point {
    background-color: var(--card-bg);
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    border-left: 5px solid var(--accent-color);
    width: 100%;
    box-sizing: border-box;
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
  }
  
  /* Common errors section styling */
  .common-errors {
    background-color: var(--card-bg);
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    border-left: 5px solid var(--accent-color);
    width: 100%;
    box-sizing: border-box;
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
  }
  
  /* Tips section styling */
  .tips {
    background-color: transparent;
    padding: 15px;
    border-radius: 5px;
    margin: 20px 0;
    border-left: none;
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
  }
  
  /* Native Speaker Note with speech bubble icon */
  .note {
    background-color: rgba(240, 240, 240, 0.6);
    padding: 15px 15px 15px 40px;
    border-radius: 4px;
    margin: 10px 0;
    font-size: 0.9em;
    position: relative;
  }
  
  .note:before {
    content: "💬";
    position: absolute;
    left: 12px;
    top: 12px;
    font-size: 1.2em;
  }
  
  [data-theme="dark"] .note {
    background-color: rgba(60, 60, 60, 0.6);
  }
  
  /* Common Errors Section */
  .common-errors-heading::before {
    content: "⚠️";
    margin-right: 8px;
  }
  
  .error-pattern {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px dashed var(--border-color);
  }
  
  .error-title {
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .incorrect {
    color: var(--error-text);
    text-decoration: line-through;
    text-decoration-thickness: 1px;
    text-decoration-color: var(--error-text);
    font-family: 'Source Code Pro', monospace;
    background-color: var(--example-bg);
    padding: 5px;
    border-radius: 3px;
    margin: 5px 0;
    display: inline-block;
  }
  
  .correct {
    color: var(--success-text);
    font-family: 'Source Code Pro', monospace;
    background-color: var(--example-bg);
    padding: 5px;
    border-radius: 3px;
    margin: 5px 0;
    display: inline-block;
    font-weight: bold;
  }
  
  .explanation {
    font-style: italic;
    margin-top: 5px;
    margin-bottom: 15px;
  }

/* ----------------------------------------
   15. Level-specific Styling (Beginner)
   ---------------------------------------- */
.beginner-section .function-card {
  background-color: var(--beginner-card-bg);
  border-top: 4px solid var(--beginner-primary);
}

.beginner-section .function-icon {
  background-color: var(--beginner-icon-bg);
  color: var(--beginner-primary);
}

.beginner-section .star {
  color: var(--beginner-secondary);
}

.beginner-section .section-intro {
  background-color: var(--beginner-card-bg);
  border-left: 5px solid var(--beginner-primary);
}

.beginner-section .category-title {
  border-bottom: 2px solid var(--beginner-primary);
}

.beginner-section .learn-button {
  background-color: var(--beginner-primary);
}

.beginner-section .learn-button:hover {
  background-color: var(--beginner-primary-dark);
}

.beginner-section h1 {
  border-left: 5px solid var(--beginner-primary);
}

.beginner-section .translate-tip strong {
  color: var(--beginner-secondary);
}
/* Main heading background color change for beginner section */
.beginner-section h1 {
  background-color: var(--beginner-primary-dark);
  border-left: 5px solid var(--beginner-primary);
}

/* Change intro and content sections to use beginner colors */
.beginner-section .intro-section,
.beginner-section .content-section {
  border-left: 5px solid var(--beginner-primary);
}

/* Navigation indicator for beginner section */
.nav-indicator {
  height: 3px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--beginner-primary);
}

/* Active navigation link in beginner section */
.beginner-section .nav-link.active {
  background-color: var(--beginner-primary);
}

/* Change the h2 element border colors to match the beginner theme */
.beginner-section h2 {
  border-bottom: 2px solid var(--beginner-primary);
}

/* Table headers should match the theme */
.beginner-section th {
  background-color: var(--beginner-primary);
}

/* Buttons should use the beginner theme colors */
.beginner-section .nav-button {
  background-color: var(--beginner-primary);
}

.beginner-section .nav-button:hover {
  background-color: var(--beginner-primary-dark);
}

.beginner-section .nav-button.activities {
  background-color: var(--beginner-secondary);
}

.beginner-section .nav-button.activities:hover {
  background-color: #e67e22; /* Darker orange */
}

/* ----------------------------------------
   16. Dark Theme for Beginner Section
   ---------------------------------------- */
   [data-theme="dark"] {
    /* Basic dark theme variables */
    --bg-color: #121212;
    --text-color: #e0e0e0;
    --header-bg: #000000;
    --header-text: #ffffff;
    --card-bg: #1e1e1e;
    --border-color: #444444;
    --accent-color: #4fa3e0;
    --secondary-accent: #f38d56;
    --link-color: #4fa3e0;
    --example-bg: #2a2a2a;
    --shadow-color: rgba(0, 0, 0, 0.3);
    
    /* Dark theme beginner-specific colors */
    --beginner-primary: #3dd685;       /* Brighter green for dark mode */
    --beginner-primary-dark: #2fb672;  /* Slightly darker green */
    --beginner-secondary: #ffab38;     /* Brighter orange for dark mode */
    --beginner-card-bg: #1e2a23;       /* Dark green-tinted background */
    --beginner-icon-bg: #223c2a;       /* Darker green for icons */
  }
  
  /* Dark theme beginner-specific element styles */
  [data-theme="dark"] .beginner-section h1 {
    background-color: #1a2a20;
    border-left: 5px solid var(--beginner-primary);
    color: #ffffff;
  }
  
  [data-theme="dark"] .beginner-section .intro-section,
  [data-theme="dark"] .beginner-section .content-section,
  [data-theme="dark"] .beginner-section .section-intro {
    background-color: #1a2e22; /* Same darker green as cards */
    border-left: 5px solid var(--beginner-primary);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  }
  
  [data-theme="dark"] .beginner-section .function-card {
    background-color: #1a2e22; /* Darker green instead of light mint */
    border-top: 4px solid var(--beginner-primary);
  }
  
  [data-theme="dark"] .beginner-section .function-header {
    color: #ffffff;
  }
  
  [data-theme="dark"] .beginner-section .function-icon {
    background-color: var(--beginner-icon-bg);
    color: var(--beginner-primary);
  }
  
  [data-theme="dark"] .beginner-section .function-title {
    color: #ffffff; /* Pure white */
    font-weight: 600; /* Semi-bold to make it stand out */
    text-shadow: 0 1px 1px rgba(0,0,0,0.2); /* Subtle shadow to improve legibility */
  }
  
  [data-theme="dark"] .beginner-section .function-desc {
    color: #ffffff; /* Pure white for maximum contrast */
    font-weight: 400; /* Slightly bolder to improve visibility */
  }
  
  [data-theme="dark"] .beginner-section .function-example {
    background-color: #111111; /* Darker background */
    border: 1px solid #333333;
    color: #e6e6e6; /* Slightly off-white for code text */
  }
  
  [data-theme="dark"] .beginner-section .function-time {
    color: #ffffff; /* White instead of gray */
    font-weight: 500; /* Medium weight for better visibility */
  }
  
  [data-theme="dark"] .beginner-section .star {
    color: #ffcc29; /* Brighter yellow/gold */
    text-shadow: 0 0 2px rgba(0,0,0,0.3); /* Subtle shadow for definition */
  }
  
  [data-theme="dark"] .beginner-section .star.empty {
    color: #ffffff; /* White empty stars */
    opacity: 0.5; /* More visible than before */
  }
  
  [data-theme="dark"] .beginner-section .category-title {
    color: #ffffff;
    border-bottom: 2px solid var(--beginner-primary);
  }
  
  [data-theme="dark"] .beginner-section .learn-button {
    background-color: #2ecc71; /* Bright green */
    color: #000000; /* Black text */
    font-weight: 600; /* Semi-bold for clarity */
    box-shadow: 0 2px 4px rgba(0,0,0,0.2); /* Subtle shadow for depth */
  }
  
  [data-theme="dark"] .beginner-section .learn-button:hover {
    background-color: var(--beginner-primary-dark);
  }
  
  [data-theme="dark"] .nav-indicator {
    background-color: var(--beginner-primary);
  }
  
  [data-theme="dark"] .beginner-section .nav-link.active {
    background-color: var(--beginner-primary);
  }
  
  /* Dark theme common elements in beginner pages */
  [data-theme="dark"] .beginner-section a {
    color: #5dd898;
  }
  
  [data-theme="dark"] .beginner-section a:hover {
    color: #7ae2ac;
  }
  
  [data-theme="dark"] .beginner-section .breadcrumb-item a {
    color: #5dd898;
  }
  
  [data-theme="dark"] .beginner-section .translate-tip strong {
    color: var(--beginner-secondary);
  }
  /* Add these styles to your dark theme section */

/* Improve heading contrast in section boxes */
[data-theme="dark"] .beginner-section .section-intro h3 {
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 15px;
}

/* Improve list item and paragraph text contrast */
[data-theme="dark"] .beginner-section .section-intro p,
[data-theme="dark"] .beginner-section .section-intro li {
  color: #ffffff;
}

/* Add a subtle accent color to list markers for better visibility */
[data-theme="dark"] .beginner-section .section-intro ul li::marker,
[data-theme="dark"] .beginner-section .section-intro ol li::marker {
  color: var(--beginner-primary);
}

/* For any strong/bold text in these sections */
[data-theme="dark"] .beginner-section .section-intro strong {
  color: var(--beginner-secondary);
}

/* ----------------------------------------
   17. Level-specific Styling (Conversation)
   ---------------------------------------- */
   :root {
    /* Conversation section theme variables - Friendly & Approachable */
    --conversation-primary:  #7b6db0;      /* Medium purple */
    --conversation-primary-dark: #564c82; /* Darker purple for hover states */
    --conversation-secondary: #f1c40f;    /* Bright yellow accent */
    --conversation-card-bg: #f8f0ff;      /* Very light lavender background */
    --conversation-icon-bg: #f3e5f8;      /* Slightly darker lavender for icons */
  }
  
  /* Dark theme conversation-specific colors */
  [data-theme="dark"] {
    --conversation-primary: #b26bd3;      /* Brighter purple for dark mode */
    --conversation-primary-dark: #9c59b5; /* Darker purple for hover states */
    --conversation-secondary: #f9ca24;    /* Brighter yellow for dark mode */
    --conversation-card-bg: #271a2f;      /* Dark purple-tinted background */
    --conversation-icon-bg: #352044;      /* Darker purple for icons */
  }
  
  /* Conversation section specific styling */

  /* Navigation indicator for beginner section */

  .conversation-section .function-card {
    background-color: var(--conversation-card-bg);
    border-top: 4px solid var(--conversation-primary);
  }
  
  .conversation-section .function-icon {
    background-color: var(--conversation-icon-bg);
    color: var(--conversation-primary);
  }
  
  .conversation-section .star {
    color: var(--conversation-secondary);
  }
  
  .conversation-section .section-intro {
    background-color: var(--conversation-card-bg);
    border-left: 5px solid var(--conversation-primary);
  }
  
  .conversation-section .category-title {
    border-bottom: 2px solid var(--conversation-primary);
  }
  
  .conversation-section .chat-button, 
  .conversation-section .learn-button {
    background-color: var(--conversation-primary);
  }
  
  .conversation-section .chat-button:hover,
  .conversation-section .learn-button:hover {
    background-color: var(--conversation-primary-dark);
  }
  
  .conversation-section .highlight {
    color: var(--conversation-primary);
    font-weight: 600;
  }
  
  .conversation-section .accent {
    color: var(--conversation-secondary);
    font-weight: 600;
  }
  
  /* Main heading background color change for conversation section */
  .conversation-section h1 {
    background-color: var(--conversation-primary-dark);
    color: var(--header-text); /* Keep text color white for readability */
    padding: 20px;
    padding-left: 30px;
    border-radius: 10px;
    margin-bottom: 30px;
    box-shadow: 0 4px 6px rgba(155, 89, 182, 0.3); /* Purple-tinted shadow */
    font-size: 2rem;
    border-left: 5px solid var(--conversation-primary);
  }
  
  /* Change intro and content sections to use conversation colors */
  .conversation-section .intro-section,
  .conversation-section .content-section {
    border-left: 5px solid var(--conversation-primary);
  }
  
  /* Topic cards for conversation section */
  .conversation-section .topic-card {
    background-color: var(--conversation-card-bg);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px var(--shadow-color);
    margin-bottom: 20px;
    border-left: 4px solid var(--conversation-primary);
  }
  
  /* Navigation indicator for conversation section */
  .conversation-nav-indicator {
    background-color: var(--conversation-primary);
  }
  
  /* Active navigation link in conversation section */
  .conversation-section .nav-link.active {
    background-color: var(--conversation-primary);
  }
  
  /* Change the h2 element border colors to match the conversation theme */
  .conversation-section h2 {
    border-bottom: 2px solid var(--conversation-primary);
  }
  
  /* Table headers should match the theme */
  .conversation-section th {
    background-color: var(--conversation-primary);
  }
  
  /* Testimonials styling for conversation section */
  .conversation-section .testimonials {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
    margin-bottom: 30px;
  }
  
  .conversation-section .testimonial {
    background-color: var(--conversation-card-bg);
    border-radius: 10px;
    padding: 20px;
    position: relative;
    box-shadow: 0 4px 8px var(--shadow-color);
  }
  
  .conversation-section .testimonial::before {
    content: '"';
    font-size: 5rem;
    position: absolute;
    top: -15px;
    left: 10px;
    color: var(--conversation-primary);
    opacity: 0.2;
    font-family: Georgia, serif;
  }
  
  .conversation-section .testimonial-text {
    position: relative;
    z-index: 1;
    font-style: italic;
    margin-bottom: 15px;
  }
  
  .conversation-section .testimonial-author {
    text-align: right;
    font-weight: bold;
    color: var(--conversation-primary);
  }
  
  /* FAQ styling for conversation section */
  .conversation-section .faq-container {
    margin-top: 30px;
    margin-bottom: 40px;
  }
  
  .conversation-section .faq-item {
    margin-bottom: 15px;
    border-bottom: 1px solid rgba(155, 89, 182, 0.2);
    padding-bottom: 15px;
  }
  
  .conversation-section .faq-question {
    font-weight: 600;
    color: var(--conversation-primary);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .conversation-section .faq-answer {
    padding-top: 10px;
    display: none;
  }
  
  .conversation-section .faq-answer.show {
    display: block;
  }
  
  /* Message template styling for conversation section */
  .conversation-section .message-template {
    background-color: white;
    border-radius: 10px;
    border-left: 4px solid var(--conversation-secondary);
    padding: 15px;
    margin: 20px 0;
    font-family: 'Source Code Pro', monospace;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  /* Dark mode specific styles for conversation section */
  [data-theme="dark"] .conversation-section h1 {
    background-color: #34214a;
    color: #ffffff;
    border-left: 5px solid var(--conversation-primary);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  }
  
  [data-theme="dark"] .conversation-section .intro-section,
  [data-theme="dark"] .conversation-section .content-section,
  [data-theme="dark"] .conversation-section .section-intro {
    background-color: #271a2f;
    border-left: 5px solid var(--conversation-primary);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  }
  
  [data-theme="dark"] .conversation-section .topic-card,
  [data-theme="dark"] .conversation-section .testimonial,
  [data-theme="dark"] .conversation-section .function-card {
    background-color: #271a2f;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  [data-theme="dark"] .conversation-section .message-template {
    background-color: #1a1a1a;
    color: #e0e0e0;
    border-left: 4px solid var(--conversation-secondary);
  }
  
  [data-theme="dark"] .conversation-section .function-title,
  [data-theme="dark"] .conversation-section .faq-question,
  [data-theme="dark"] .conversation-section h3,
  [data-theme="dark"] .conversation-section h4 {
    color: #ffffff;
  }
  
  [data-theme="dark"] .conversation-section .highlight {
    color: #d2a0e7;
  }
  
  [data-theme="dark"] .conversation-section .accent {
    color: #f9d44d;
  }
  
  [data-theme="dark"] .conversation-section a {
    color: #d2a0e7;
  }
  
  [data-theme="dark"] .conversation-section a:hover {
    color: #e4bdf2;
  }
  
  [data-theme="dark"] .conversation-section .section-intro h3 {
    color: #ffffff;
    font-weight: 600;
    margin-bottom: 15px;
  }
  
  [data-theme="dark"] .conversation-section .section-intro p,
  [data-theme="dark"] .conversation-section .section-intro li,
  [data-theme="dark"] .conversation-section .faq-answer {
    color: #ffffff;
  }
  
  [data-theme="dark"] .conversation-section .section-intro ul li::marker,
  [data-theme="dark"] .conversation-section .section-intro ol li::marker {
    color: var(--conversation-primary);
  }
  
  [data-theme="dark"] .conversation-section .chat-button.secondary {
    background-color: var(--conversation-secondary);
    color: #000000;
  }
  
  /* Improve section headers and content contrast in dark mode */
  [data-theme="dark"] .conversation-section .section-title,
  [data-theme="dark"] .conversation-section .category-title {
    color: #ffffff;
  }
  
  /* Function grid cards in dark mode */
  [data-theme="dark"] .conversation-section .function-card {
    border-top: 4px solid var(--conversation-primary);
  }
  
  [data-theme="dark"] .conversation-section .function-desc {
    color: #e0e0e0;
  }

  [data-theme="dark"] .nav-indicator {
    background-color: var(--conversation-primary);
  }
EOL

cat > css/activities.css << 'EOL'
/* 
 * ESL Grammar Website - Activity Styles
 * Contains styling for all interactive activities including:
 * - Multiple choice questions
 * - Gap fill exercises
 * - Matching activities
 * - Drag and drop interactions
 * - Sentence transformation
 * - Error correction
 * - Situation matching
 * - Progress tracking elements
 */

/* ----------------------------------------
   1. Common Activity Container Styles
   ---------------------------------------- */
.activity-container {
  background-color: var(--mcq-container-bg, #f0f8ff);
  padding: 20px;
  border-radius: 5px;
  margin: 30px 0;
  display: none;
  width: 100%;
  box-sizing: border-box;
  max-width: 760px;
  margin-left: auto;
  margin-right: auto;
}

[data-theme="dark"] .activity-container {
  background-color: var(--mcq-container-bg, #1a2632);
}

.activity-container.active {
  display: block;
}

.activity-nav {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  max-width: 760px;
  margin-left: auto;
  margin-right: auto;
}

.activity-nav-btn {
  background-color: var(--btn-bg, #3498db);
  color: var(--btn-text, #ffffff);
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
  font-size: 0.9rem;
  transition: background-color 0.3s, transform 0.2s;
  flex: 1;
  min-width: 100px;
  max-width: calc(25% - 8px);
  text-align: center;
}

.activity-nav-btn:hover {
  background-color: var(--btn-hover, #2980b9);
  transform: translateY(-2px);
}

.activity-nav-btn.active {
  background-color: var(--nav-btn-active, #f07d3e);
  font-weight: bold;
}

.question {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color, #ddd);
}

.question-text {
  margin-bottom: 20px;
  font-weight: 600;
}

/* Common feedback styles used across different activity types */
.feedback {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  display: none;
}

.feedback.correct {
  background-color: var(--success-bg, #d4edda);
  color: var(--success-color, #155724);
  border: 1px solid var(--success-bg, #d4edda);
  display: block;
}

.feedback.incorrect {
  background-color: var(--error-bg, #f8d7da);
  color: var(--error-color, #721c24);
  border: 1px solid var(--error-bg, #f8d7da);
  display: block;
}

/* Score display for all activities */
.score-display {
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  padding: 15px;
  background-color: var(--card-bg, #f8f9fa);
  border-radius: 5px;
  display: none;
}

/* Control buttons for all activities */
.control-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.submit-btn, .restart-btn, .check-btn {
  background-color: var(--btn-bg, #3498db);
  color: var(--btn-text, #ffffff);
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
  font-size: 1rem;
  transition: background-color 0.3s, transform 0.2s;
}

.submit-btn:hover, .restart-btn:hover, .check-btn:hover {
  background-color: var(--btn-hover, #2980b9);
  transform: translateY(-2px);
}

.restart-btn {
  background-color: var(--secondary-accent, #f07d3e);
}

.restart-btn:hover {
  background-color: #e06d2e;
}

/* ----------------------------------------
   2. Multiple Choice Questions (MCQ)
   ---------------------------------------- */
.mcq-container {
  background-color: var(--mcq-container-bg, #f0f8ff);
}

[data-theme="dark"] .mcq-container {
  background-color: var(--mcq-container-bg, #1a2632);
}

/* MCQ question */
.mcq-question {
  margin-bottom: 20px;
  font-weight: 600;
}

/* Container for all options */
.options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

/* Individual option buttons */
.option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

/* Hover effect for options */
.option:hover {
  background-color: var(--mcq-hover-bg, #d0e6f7);
  transform: translateY(-1px);
}

/* Selected state for options */
.option.selected {
  border: 2px solid var(--mcq-selected-border, #3498db);
  background-color: var(--mcq-selected-bg, #d0e6f7);
  font-weight: bold;
}

[data-theme="dark"] .option:hover {
  background-color: var(--mcq-hover-bg, #253545);
}

[data-theme="dark"] .option.selected {
  border-color: var(--mcq-selected-border, #4fa3e0);
  background-color: var(--mcq-selected-bg, #253545);
}

/* ----------------------------------------
   3. Gap Fill Activity
   ---------------------------------------- */
.gap-fill-container {
  background-color: var(--mcq-container-bg, #f0f8ff);
}

[data-theme="dark"] .gap-fill-container {
  background-color: var(--mcq-container-bg, #1a2632);
}

.gap-fill-sentence {
  font-family: 'Source Code Pro', monospace;
  margin-bottom: 5px;
  line-height: 2;
}

.gap-input {
  width: 140px;
  padding: 5px 8px;
  margin: 0 5px;
  border: 2px solid var(--border-color, #ddd);
  border-radius: 4px;
  background-color: var(--bg-color, #ffffff);
  color: var(--text-color, #333333);
  font-family: 'Source Code Pro', monospace;
  transition: border-color 0.3s;
}

.gap-input:focus {
  border-color: var(--gap-input-border, #3498db);
  outline: none;
}

.gap-input.correct {
  border-color: var(--success-color, #155724);
  background-color: var(--success-bg, #d4edda);
  color: var(--success-color, #155724);
}

.gap-input.incorrect {
  border-color: var(--error-color, #721c24);
  background-color: var(--error-bg, #f8d7da);
  color: var(--error-color, #721c24);
}

/* ----------------------------------------
   4. Matching Activity
   ---------------------------------------- */
.matching-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.matching-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.matching-question, .matching-answer {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border-color, #ddd);
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: var(--card-bg, #f8f9fa);
}

.matching-question:hover, .matching-answer:hover {
  background-color: var(--mcq-hover-bg, #d0e6f7);
}

.matching-question.selected, .matching-answer.selected {
  border: 2px solid var(--mcq-selected-border, #3498db);
  background-color: var(--mcq-selected-bg, #d0e6f7);
}

.matching-question.matched, .matching-answer.matched {
  border-color: var(--success-color, #155724);
  background-color: var(--success-bg, #d4edda);
}

.matching-line-container {
  position: relative;
  height: 0;
}

.matching-line {
  position: absolute;
  background-color: var(--accent-color, #3498db);
  height: 2px;
  z-index: 1;
  transform-origin: 0 0;
}

[data-theme="dark"] .matching-question:hover, 
[data-theme="dark"] .matching-answer:hover {
  background-color: var(--mcq-hover-bg, #253545);
}

[data-theme="dark"] .matching-question.selected, 
[data-theme="dark"] .matching-answer.selected {
  border-color: var(--mcq-selected-border, #4fa3e0);
  background-color: var(--mcq-selected-bg, #253545);
}

/* ----------------------------------------
   5. Drag and Drop Activity
   ---------------------------------------- */
.drag-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.drop-zone {
  min-height: 50px;
  border: 2px dashed var(--border-color, #ddd);
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  background-color: var(--drop-zone-bg, #eaf7ff);
  transition: background-color 0.3s;
}

.drop-zone.highlight {
  background-color: var(--mcq-hover-bg, #d0e6f7);
  border-color: var(--accent-color, #3498db);
}

.drag-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.drag-item {
  padding: 8px 12px;
  background-color: var(--drag-item-bg, #e0f0fd);
  border: 1px solid var(--drag-item-border, #3498db);
  border-radius: 4px;
  cursor: grab;
  user-select: none;
  transition: transform 0.1s;
  color: var(--drag-item-text, #2c3e50);
  font-family: 'Source Code Pro', monospace;
}

.drag-item:hover {
  transform: translateY(-2px);
}

.drag-item.dragging {
  opacity: 0.5;
  border-style: dashed;
}

[data-theme="dark"] .drop-zone {
  background-color: var(--drop-zone-bg, #1a2632);
}

[data-theme="dark"] .drop-zone.highlight {
  background-color: var(--mcq-hover-bg, #253545);
}

[data-theme="dark"] .drag-item {
  background-color: var(--drag-item-bg, #253545);
  border-color: var(--drag-item-border, #4fa3e0);
  color: var(--drag-item-text, #e0e0e0);
}

/* ----------------------------------------
   6. Sentence Transformation Activity
   ---------------------------------------- */
.transformation-container {
  background-color: var(--mcq-container-bg, #f0f8ff);
}

[data-theme="dark"] .transformation-container {
  background-color: var(--mcq-container-bg, #1a2632);
}

.transformation-input {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border: 2px solid var(--border-color, #ddd);
  border-radius: 4px;
  background-color: var(--bg-color, #ffffff);
  color: var(--text-color, #333333);
  font-family: 'Source Code Pro', monospace;
}

.transformation-input:focus {
  border-color: var(--gap-input-border, #3498db);
  outline: none;
}

.transformation-input.correct {
  border-color: var(--success-color, #155724);
  background-color: var(--success-bg, #d4edda);
  color: var(--success-color, #155724);
}

.transformation-input.incorrect {
  border-color: var(--error-color, #721c24);
  background-color: var(--error-bg, #f8d7da);
  color: var(--error-color, #721c24);
}

/* ----------------------------------------
   7. Error Correction Activity
   ---------------------------------------- */
.error-correction-container {
  background-color: var(--mcq-container-bg, #f0f8ff);
}

[data-theme="dark"] .error-correction-container {
  background-color: var(--mcq-container-bg, #1a2632);
}

.error-correction-text {
  font-family: 'Source Code Pro', monospace;
  line-height: 1.8;
  margin-bottom: 15px;
  padding: 10px;
  background-color: var(--example-bg, #f8f9fa);
  border-radius: 4px;
  border-left: 3px solid var(--error-color, #721c24);
}

.error-correction-input {
  width: 100%;
  padding: 8px;
  border: 2px solid var(--border-color, #ddd);
  border-radius: 4px;
  font-family: 'Source Code Pro', monospace;
  background-color: var(--bg-color, #ffffff);
  color: var(--text-color, #333333);
}

.error-correction-input:focus {
  border-color: var(--gap-input-border, #3498db);
  outline: none;
}

.error-correction-input.correct {
  border-color: var(--success-color, #155724);
  background-color: var(--success-bg, #d4edda);
  color: var(--success-color, #155724);
}

.error-correction-input.incorrect {
  border-color: var(--error-color, #721c24);
  background-color: var(--error-bg, #f8d7da);
  color: var(--error-color, #721c24);
}

/* ----------------------------------------
   8. Situation Matching Activity
   ---------------------------------------- */
.situation-container {
  background-color: var(--mcq-container-bg, #f0f8ff);
}

[data-theme="dark"] .situation-container {
  background-color: var(--mcq-container-bg, #1a2632);
}

.situation-description {
  background-color: var(--card-bg, #f8f9fa);
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
  border-left: 3px solid var(--accent-color, #3498db);
}

/* For situation matching we reuse the MCQ options styling */

/* ----------------------------------------
   9. Mixed Activity Styles
   ---------------------------------------- */
.mixed-conditional-container {
  background-color: var(--mcq-container-bg, #f0f8ff);
}

[data-theme="dark"] .mixed-conditional-container {
  background-color: var(--mcq-container-bg, #1a2632);
}

/* ----------------------------------------
   10. Audio Activity Styles
   ---------------------------------------- */
.audio-container {
  margin: 15px 0;
}

.audio-player {
  width: 100%;
  margin-bottom: 15px;
}

.audio-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background-color: var(--accent-color, #3498db);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.audio-button:hover {
  background-color: var(--btn-hover, #2980b9);
}

.audio-icon {
  font-size: 1.2em;
}

/* ----------------------------------------
   11. Responsive Styles for Activities
   ---------------------------------------- */
@media (max-width: 768px) {
  .activity-nav-btn {
    max-width: calc(50% - 5px);
  }
  
  .matching-item {
    flex-direction: column;
  }
  
  .matching-question, .matching-answer {
    width: 100%;
  }
  
  .drag-items, .drop-zone {
    gap: 5px;
  }
  
  .drag-item {
    padding: 6px 10px;
    font-size: 0.9rem;
  }
  
  .control-buttons {
    flex-direction: column;
    gap: 10px;
  }
  
  .submit-btn, .restart-btn, .check-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .gap-input {
    width: 100px;
  }
  
  .question-text, .mcq-question {
    font-size: 0.95rem;
  }
  
  .option {
    padding: 6px 10px;
  }
  
  .situation-description {
    padding: 10px;
    font-size: 0.9rem;
  }
}
EOL

# JS Files
cat > js/core.js << 'EOL'
/**
 * ESL Grammar Website - Core JavaScript
 * 
 * This file contains core functionality used across the ESL Grammar website, including:
 * - Theme toggling (light/dark mode)
 * - Mobile navigation controls
 * - Local storage utilities for saving/retrieving user preferences and progress
 * - Common UI helpers and utility functions
 */

// Ensure the DOM is fully loaded before running any code
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all core functionality
  initThemeToggle();
  initMobileNavigation();
  initPrintButton();
  initSkipLink();
});

/**
 * ----------------------------------------
 * 1. Theme Toggle Functionality
 * ----------------------------------------
 */

/**
 * Initializes the theme toggle functionality
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  
  if (!themeToggle) return;
  
  // Set initial theme based on stored preference or system preference
  setInitialTheme();
  
  // Handle theme toggle click
  themeToggle.addEventListener('click', function() {
    toggleTheme();
  });
}

/**
 * Sets the initial theme based on local storage or system preference
 */
function setInitialTheme() {
  // Check for stored theme preference
  const storedTheme = getFromLocalStorage('theme');
  
  if (storedTheme) {
    // Apply stored theme preference
    document.documentElement.setAttribute('data-theme', storedTheme);
  } else {
    // Check for system dark mode preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      saveToLocalStorage('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      saveToLocalStorage('theme', 'light');
    }
  }
}

/**
 * Toggles between light and dark themes
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Update the theme attribute
  document.documentElement.setAttribute('data-theme', newTheme);
  
  // Save theme preference to local storage
  saveToLocalStorage('theme', newTheme);
}

/**
 * ----------------------------------------
 * 2. Mobile Navigation Functionality
 * ----------------------------------------
 */

/**
 * Initializes the mobile navigation toggle button
 */
function initMobileNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!navToggle || !navLinks) return;
  
  navToggle.addEventListener('click', function() {
    // Toggle the 'show' class to display/hide the navigation links
    navLinks.classList.toggle('show');
    
    // Update the aria-expanded attribute for accessibility
    const isExpanded = navLinks.classList.contains('show');
    navToggle.setAttribute('aria-expanded', isExpanded.toString());
  });
  
  // Close mobile nav when clicking outside
  document.addEventListener('click', function(event) {
    const isNavToggle = event.target.closest('.nav-toggle');
    const isNavLinks = event.target.closest('.nav-links');
    
    if (!isNavToggle && !isNavLinks && navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close mobile nav when ESC key is pressed
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Add resize listener to handle transition from mobile to desktop view
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && navLinks.classList.contains('show')) {
      navLinks.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * ----------------------------------------
 * 3. Local Storage Utility Functions
 * ----------------------------------------
 */

/**
 * Saves a value to localStorage with error handling
 * 
 * @param {string} key - The key to store the value under
 * @param {any} value - The value to store
 * @returns {boolean} - True if successful, false otherwise
 */
function saveToLocalStorage(key, value) {
  try {
    // Handle objects and arrays by JSON stringifying them
    const valueToStore = typeof value === 'object' 
      ? JSON.stringify(value) 
      : value;
    
    localStorage.setItem(key, valueToStore);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Retrieves a value from localStorage with error handling
 * 
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Default value to return if key doesn't exist
 * @returns {any} - The value from localStorage or defaultValue
 */
function getFromLocalStorage(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key);
    
    if (value === null) return defaultValue;
    
    // Try to parse JSON, return original value if not JSON
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Removes a value from localStorage with error handling
 * 
 * @param {string} key - The key to remove
 * @returns {boolean} - True if successful, false otherwise
 */
function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
}

/**
 * Checks if local storage is available in the browser
 * 
 * @returns {boolean} - True if available, false otherwise
 */
function isLocalStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * ----------------------------------------
 * 4. Common UI Helpers
 * ----------------------------------------
 */

/**
 * Initialize the print button functionality
 */
function initPrintButton() {
  const printButton = document.querySelector('.print-button');
  
  if (printButton) {
    printButton.addEventListener('click', function() {
      window.print();
    });
  }
}

/**
 * Initialize the skip link functionality for accessibility
 */
function initSkipLink() {
  const skipLink = document.querySelector('.skip-link');
  
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = skipLink.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.tabIndex = -1;
        targetElement.focus();
      }
    });
  }
}

/**
 * Shows a feedback message to the user
 *
 * @param {string} message - The message to display
 * @param {string} type - The type of message ('success', 'error', 'info')
 * @param {number} duration - How long to show the message in ms (0 for permanent)
 * @param {string} containerId - ID of container to append message to (default: 'feedback-container')
 */
function showFeedbackMessage(message, type = 'info', duration = 3000, containerId = 'feedback-container') {
  // Try to find the container
  let container = document.getElementById(containerId);
  
  // If container doesn't exist, create it
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.className = 'feedback-message-container';
    document.body.appendChild(container);
  }
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = `feedback-message feedback-${type}`;
  messageElement.textContent = message;
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.className = 'feedback-close';
  closeButton.innerHTML = '&times;';
  closeButton.setAttribute('aria-label', 'Close message');
  messageElement.appendChild(closeButton);
  
  // Add to container
  container.appendChild(messageElement);
  
  // Handle close button click
  closeButton.addEventListener('click', function() {
    messageElement.remove();
  });
  
  // Auto-remove after duration (if not 0)
  if (duration > 0) {
    setTimeout(function() {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, duration);
  }
  
  return messageElement;
}

/**
 * Creates an accessible tab interface for content sections
 * 
 * @param {string} containerSelector - Selector for the container element
 * @param {object} options - Configuration options
 */
function createAccessibleTabs(containerSelector, options = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const defaultOptions = {
    tabListClass: 'tabs-list',
    tabClass: 'tab',
    tabPanelClass: 'tab-panel',
    activeTabClass: 'active',
    tabButtonSelector: '[role="tab"]',
    tabPanelSelector: '[role="tabpanel"]'
  };
  
  const settings = {...defaultOptions, ...options};
  
  // Get tab buttons and panels
  const tabButtons = container.querySelectorAll(settings.tabButtonSelector);
  const tabPanels = container.querySelectorAll(settings.tabPanelSelector);
  
  // Initialize: hide all panels except the first one
  tabPanels.forEach((panel, index) => {
    if (index === 0) {
      panel.removeAttribute('hidden');
      tabButtons[index].setAttribute('aria-selected', 'true');
      tabButtons[index].classList.add(settings.activeTabClass);
    } else {
      panel.setAttribute('hidden', '');
      tabButtons[index].setAttribute('aria-selected', 'false');
    }
  });
  
  // Add click event to tab buttons
  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      showTab(index);
    });
    
    // Add keyboard navigation
    button.addEventListener('keydown', (e) => {
      let targetIndex;
      
      switch (e.key) {
        case 'ArrowRight':
          targetIndex = (index + 1) % tabButtons.length;
          break;
        case 'ArrowLeft':
          targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
          break;
        case 'Home':
          targetIndex = 0;
          break;
        case 'End':
          targetIndex = tabButtons.length - 1;
          break;
        default:
          return; // Exit if not a navigation key
      }
      
      e.preventDefault();
      tabButtons[targetIndex].focus();
      showTab(targetIndex);
    });
  });
  
  // Function to show a specific tab
  function showTab(index) {
    // Update tabs
    tabButtons.forEach((button, i) => {
      const isActive = i === index;
      button.setAttribute('aria-selected', isActive.toString());
      button.classList.toggle(settings.activeTabClass, isActive);
    });
    
    // Update panels
    tabPanels.forEach((panel, i) => {
      if (i === index) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }
}

/**
 * Smooth scroll to an element on the page
 * 
 * @param {string} targetSelector - Selector for the target element
 * @param {number} offset - Offset in pixels from the top (default: 0)
 * @param {number} duration - Animation duration in ms (default: 500)
 */
function smoothScrollTo(targetSelector, offset = 0, duration = 500) {
  const targetElement = document.querySelector(targetSelector);
  
  if (!targetElement) return;
  
  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Easing function: easeInOutQuad
    const easeProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    window.scrollTo(0, startPosition + distance * easeProgress);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
}

/**
 * Debounce function to limit how often a function can be called
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to call the function immediately
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 300, immediate = false) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

/**
 * Add event listeners to a collection of elements
 * 
 * @param {string} selector - CSS selector for elements
 * @param {string} eventType - Event type, e.g., 'click'
 * @param {Function} handler - Event handler function
 */
function addEventListenerToAll(selector, eventType, handler) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.addEventListener(eventType, handler);
  });
}

/**
 * Toggle collapsible sections
 * 
 * @param {string} toggleSelector - CSS selector for toggle buttons
 * @param {string} contentSelector - CSS selector for content to toggle
 * @param {string} activeClass - Class to add to active toggle (default: 'active')
 * @param {string} collapsedClass - Class to add to collapsed content (default: 'collapsed')
 */
function initCollapsibleSections(toggleSelector, contentSelector, activeClass = 'active', collapsedClass = 'collapsed') {
  const toggleButtons = document.querySelectorAll(toggleSelector);
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Toggle active state on button
      this.classList.toggle(activeClass);
      
      // Find target content
      const targetContent = this.nextElementSibling;
      if (targetContent && targetContent.matches(contentSelector)) {
        targetContent.classList.toggle(collapsedClass);
        
        // Update aria attributes
        const isExpanded = !targetContent.classList.contains(collapsedClass);
        this.setAttribute('aria-expanded', isExpanded.toString());
      }
    });
  });
}

// Export functions if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {
    initThemeToggle,
    toggleTheme,
    saveToLocalStorage,
    getFromLocalStorage,
    removeFromLocalStorage,
    isLocalStorageAvailable,
    showFeedbackMessage,
    createAccessibleTabs,
    smoothScrollTo,
    debounce,
    addEventListenerToAll,
    initCollapsibleSections
  };
}
EOL

cat > js/mcq.js << 'EOL'
/**
 * ESL Grammar Website - Multiple Choice Questions Module
 * 
 * This module handles all functionality related to multiple choice questions:
 * - Selecting options
 * - Checking answers
 * - Providing feedback
 * - Tracking scores
 * - Restarting the activity
 */

/**
 * MCQ Module - Provides functionality for multiple choice questions
 */
const MCQModule = (function() {
  // Private variables
  let score = 0;
  let totalQuestions = 0;
  let correctAnswers = {};
  let answered = {};
  let containerId = 'mcq';
  
  /**
   * Initializes the MCQ module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the container element (default: 'mcq')
   * @param {Object} config.answers - Object mapping question IDs to correct answer indices
   * @param {Function} config.onComplete - Callback function called when all questions are answered
   * @param {boolean} config.allowRetry - Allow retry after incorrect answer (default: true)
   */
  function init(config = {}) {
    // Set up configuration
    containerId = config.containerId || 'mcq';
    correctAnswers = config.answers || {};
    const allowRetry = config.allowRetry !== undefined ? config.allowRetry : true;
    const onComplete = config.onComplete || null;
    
    // Reset score and answered status
    score = 0;
    
    // Calculate total questions
    totalQuestions = Object.keys(correctAnswers).length;
    
    // Initialize answered object
    answered = {};
    Object.keys(correctAnswers).forEach(questionId => {
      answered[questionId] = false;
    });
    
    // Set up option click handlers
    setupOptionClickHandlers(allowRetry);
    
    // Set up submit button
    setupSubmitButton(onComplete);
    
    // Set up restart button
    setupRestartButton();
  }
  
  /**
   * Sets up option click handlers for all questions
   * 
   * @param {boolean} allowRetry - Whether to allow retry after incorrect answer
   */
  function setupOptionClickHandlers(allowRetry) {
    // Get all options
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const options = container.querySelectorAll('.option');
    
    options.forEach(option => {
      option.addEventListener('click', function() {
        const questionId = this.closest('.question').id;
        
        // If already answered and no retry, do nothing
        if (answered[questionId] && !allowRetry) return;
        
        const options = document.querySelectorAll(`#${questionId} .option`);
        
        // Clear previous selections
        options.forEach(opt => {
          opt.classList.remove('selected');
        });
        
        // Select this option
        this.classList.add('selected');
      });
    });
  }
  
  /**
   * Sets up the submit button
   * 
   * @param {Function} onComplete - Callback function called when all questions are answered
   */
  function setupSubmitButton(onComplete) {
    const submitButton = document.getElementById(`${containerId}-submit`);
    if (!submitButton) return;
    
    submitButton.addEventListener('click', function() {
      score = 0;
      
      Object.keys(correctAnswers).forEach(questionId => {
        const selectedOption = document.querySelector(`#${questionId} .option.selected`);
        const feedback = document.querySelector(`#${questionId} .feedback`);
        
        if (selectedOption) {
          const selectedIndex = parseInt(selectedOption.getAttribute('data-index'));
          const explanation = selectedOption.getAttribute('data-explanation');
          
          if (selectedIndex === correctAnswers[questionId]) {
            feedback.textContent = explanation || 'Correct!';
            feedback.className = 'feedback correct';
            score++;
            answered[questionId] = true;
          } else {
            feedback.textContent = explanation || 'Incorrect. Try again.';
            feedback.className = 'feedback incorrect';
          }
        } else {
          feedback.textContent = 'Please select an answer.';
          feedback.className = 'feedback incorrect';
        }
      });
      
      // Show score
      const scoreDisplay = document.getElementById(`${containerId}-score`);
      if (scoreDisplay) {
        scoreDisplay.querySelector('span').textContent = score;
        scoreDisplay.style.display = 'block';
      }
      
      // Show restart button
      const restartButton = document.getElementById(`${containerId}-restart`);
      if (restartButton) {
        submitButton.style.display = 'none';
        restartButton.style.display = 'block';
      }
      
      // Check if all questions are answered correctly
      const allAnswered = Object.values(answered).every(status => status);
      
      // Call onComplete callback if all questions are answered
      if (allAnswered && typeof onComplete === 'function') {
        onComplete(score, totalQuestions);
      }
      
      // Save progress to localStorage if available
      if (typeof saveToLocalStorage === 'function') {
        const activityData = {
          score: score,
          totalQuestions: totalQuestions,
          completed: allAnswered
        };
        
        saveToLocalStorage(`${containerId}-progress`, activityData);
      }
    });
  }
  
  /**
   * Sets up the restart button
   */
  function setupRestartButton() {
    const restartButton = document.getElementById(`${containerId}-restart`);
    const submitButton = document.getElementById(`${containerId}-submit`);
    
    if (!restartButton) return;
    
    restartButton.addEventListener('click', function() {
      // Clear selections
      const container = document.getElementById(containerId);
      container.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
      });
      
      // Clear feedback
      container.querySelectorAll('.feedback').forEach(feedback => {
        feedback.textContent = '';
        feedback.className = 'feedback';
      });
      
      // Reset answered status
      Object.keys(answered).forEach(questionId => {
        answered[questionId] = false;
      });
      
      // Hide score
      const scoreDisplay = document.getElementById(`${containerId}-score`);
      if (scoreDisplay) {
        scoreDisplay.style.display = 'none';
      }
      
      // Show submit button, hide restart button
      if (submitButton) {
        submitButton.style.display = 'block';
      }
      restartButton.style.display = 'none';
      
      // Reset score
      score = 0;
    });
  }
  
  /**
   * Manually select an option for a question
   * Helper function for external selection
   * 
   * @param {string} questionId - ID of the question
   * @param {number} optionIndex - Index of the option to select
   */
  function selectOption(questionId, optionIndex) {
    const question = document.getElementById(questionId);
    if (!question) return;
    
    const options = question.querySelectorAll('.option');
    
    // Clear previous selections
    options.forEach(opt => {
      opt.classList.remove('selected');
    });
    
    // Select the specified option
    const optionToSelect = options[optionIndex];
    if (optionToSelect) {
      optionToSelect.classList.add('selected');
    }
  }
  
  /**
   * Gets the current score
   * 
   * @returns {Object} Object containing score and totalQuestions
   */
  function getScore() {
    return {
      score: score,
      totalQuestions: totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
    };
  }
  
  /**
   * Checks if all questions have been answered correctly
   * 
   * @returns {boolean} True if all questions are answered correctly
   */
  function isCompleted() {
    return Object.values(answered).every(status => status);
  }
  
  // Public API
  return {
    init: init,
    getScore: getScore,
    isCompleted: isCompleted,
    selectOption: selectOption
  };
})();

// Export the module if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = MCQModule;
}
EOL

cat > js/gap-fill.js << 'EOL'
/**
 * ESL Grammar Website - Gap Fill Module
 * 
 * This module handles all functionality related to gap fill exercises:
 * - Checking user input against correct answers
 * - Supporting multiple correct answers
 * - Providing feedback on answers
 * - Scoring and progress tracking
 * - Activity restart functionality
 */

/**
 * GapFill Module - Provides functionality for gap fill exercises
 */
const GapFillModule = (function() {
  // Private variables
  let score = 0;
  let totalGaps = 0;
  let containerId = 'gap-fill';
  let onCompleteCallback = null;
  let caseSensitive = false;
  
  /**
   * Initializes the Gap Fill module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the container element (default: 'gap-fill')
   * @param {Function} config.onComplete - Callback function called when all gaps are filled correctly
   * @param {boolean} config.caseSensitive - Whether answers are case-sensitive (default: false)
   */
  function init(config = {}) {
    // Set up configuration
    containerId = config.containerId || 'gap-fill';
    onCompleteCallback = config.onComplete || null;
    caseSensitive = config.caseSensitive || false;
    
    // Reset score
    score = 0;
    
    // Count total gaps
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const inputs = container.querySelectorAll('.gap-input');
    totalGaps = inputs.length;
    
    // Set up enter key handler for inputs
    inputs.forEach(input => {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          // Prevent form submission
          e.preventDefault();
          
          // Find the submit button and trigger click
          const submitButton = document.getElementById(`${containerId}-submit`);
          if (submitButton) {
            submitButton.click();
          }
        }
      });
    });
    
    // Set up submit button
    setupSubmitButton();
    
    // Set up restart button
    setupRestartButton();
    
    // Load progress if available
    loadProgress();
  }
  
  /**
   * Sets up the submit button
   */
  function setupSubmitButton() {
    const submitButton = document.getElementById(`${containerId}-submit`);
    if (!submitButton) return;
    
    submitButton.addEventListener('click', function() {
      score = 0;
      let allCorrect = true;
      
      const container = document.getElementById(containerId);
      const inputs = container.querySelectorAll('.gap-input');
      
      inputs.forEach(input => {
        const correctAnswers = input.getAttribute('data-answer').split(',');
        const userAnswer = input.value.trim();
        const feedback = input.closest('.question').querySelector('.feedback');
        
        // Check if answer is correct (case insensitive by default)
        const isCorrect = correctAnswers.some(answer => {
          if (caseSensitive) {
            return userAnswer === answer.trim();
          } else {
            return userAnswer.toLowerCase() === answer.trim().toLowerCase();
          }
        });
        
        if (isCorrect) {
          input.classList.add('correct');
          input.classList.remove('incorrect');
          if (feedback) {
            feedback.textContent = `Correct! "${input.value}" is correct.`;
            feedback.className = 'feedback correct';
          }
          score++;
        } else {
          input.classList.add('incorrect');
          input.classList.remove('correct');
          allCorrect = false;
          
          if (feedback) {
            // Provide hint without giving away the answer
            let hint;
            if (userAnswer === '') {
              hint = "Please enter an answer.";
            } else if (userAnswer.length < 3) {
              hint = "Your answer is too short.";
            } else {
              // Find the closest correct answer for better feedback
              let closestAnswer = correctAnswers[0];
              let minDifference = 100;
              
              correctAnswers.forEach(answer => {
                const cleanAnswer = answer.trim();
                const difference = levenshteinDistance(userAnswer.toLowerCase(), cleanAnswer.toLowerCase());
                
                if (difference < minDifference) {
                  minDifference = difference;
                  closestAnswer = cleanAnswer;
                }
              });
              
              if (minDifference <= 2) {
                hint = "You're very close! Check your spelling.";
              } else {
                hint = "That's not correct. Try again.";
              }
            }
            
            feedback.textContent = hint;
            feedback.className = 'feedback incorrect';
          }
        }
      });
      
      // Show score
      const scoreDisplay = document.getElementById(`${containerId}-score`);
      if (scoreDisplay) {
        scoreDisplay.querySelector('span').textContent = score;
        scoreDisplay.style.display = 'block';
      }
      
      // Show restart button
      const restartButton = document.getElementById(`${containerId}-restart`);
      if (restartButton) {
        submitButton.style.display = 'none';
        restartButton.style.display = 'block';
      }
      
      // Call onComplete callback if all gaps are filled correctly
      if (allCorrect && typeof onCompleteCallback === 'function') {
        onCompleteCallback(score, totalGaps);
      }
      
      // Save progress to localStorage if available
      saveProgress();
    });
  }
  
  /**
   * Sets up the restart button
   */
  function setupRestartButton() {
    const restartButton = document.getElementById(`${containerId}-restart`);
    const submitButton = document.getElementById(`${containerId}-submit`);
    
    if (!restartButton) return;
    
    restartButton.addEventListener('click', function() {
      // Clear input values
      const container = document.getElementById(containerId);
      container.querySelectorAll('.gap-input').forEach(input => {
        input.value = '';
        input.classList.remove('correct', 'incorrect');
      });
      
      // Clear feedback
      container.querySelectorAll('.feedback').forEach(feedback => {
        feedback.textContent = '';
        feedback.className = 'feedback';
      });
      
      // Hide score
      const scoreDisplay = document.getElementById(`${containerId}-score`);
      if (scoreDisplay) {
        scoreDisplay.style.display = 'none';
      }
      
      // Show submit button, hide restart button
      if (submitButton) {
        submitButton.style.display = 'block';
      }
      restartButton.style.display = 'none';
      
      // Reset score
      score = 0;
      
      // Clear saved progress
      if (typeof removeFromLocalStorage === 'function') {
        removeFromLocalStorage(`${containerId}-progress`);
      }
    });
  }
  
  /**
   * Save progress to localStorage
   */
  function saveProgress() {
    if (typeof saveToLocalStorage !== 'function') return;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Collect input values
    const inputs = container.querySelectorAll('.gap-input');
    const inputValues = {};
    
    inputs.forEach(input => {
      const id = input.id || input.getAttribute('data-id') || Math.random().toString(36).substring(2, 9);
      inputValues[id] = input.value;
    });
    
    // Save progress data
    const progressData = {
      score: score,
      totalGaps: totalGaps,
      inputs: inputValues,
      completed: score === totalGaps
    };
    
    saveToLocalStorage(`${containerId}-progress`, progressData);
  }
  
  /**
   * Load progress from localStorage
   */
  function loadProgress() {
    if (typeof getFromLocalStorage !== 'function') return;
    
    const progressData = getFromLocalStorage(`${containerId}-progress`);
    if (!progressData) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Restore input values if available
    if (progressData.inputs) {
      const inputs = container.querySelectorAll('.gap-input');
      
      inputs.forEach(input => {
        const id = input.id || input.getAttribute('data-id');
        if (id && progressData.inputs[id]) {
          input.value = progressData.inputs[id];
        }
      });
    }
    
    // If the activity was completed, check answers to restore state
    if (progressData.completed) {
      const submitButton = document.getElementById(`${containerId}-submit`);
      if (submitButton) {
        submitButton.click();
      }
    }
  }
  
  /**
   * Calculate the Levenshtein distance between two strings
   * This helps provide better feedback by determining how "close" a wrong answer is
   * 
   * @param {string} a - First string
   * @param {string} b - Second string
   * @returns {number} - The edit distance between the strings
   */
  function levenshteinDistance(a, b) {
    const matrix = [];
    
    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    
    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    
    return matrix[b.length][a.length];
  }
  
  /**
   * Gets the current score
   * 
   * @returns {Object} Object containing score and totalGaps
   */
  function getScore() {
    return {
      score: score,
      totalGaps: totalGaps,
      percentage: totalGaps > 0 ? Math.round((score / totalGaps) * 100) : 0
    };
  }
  
  /**
   * Checks if all gaps have been filled correctly
   * 
   * @returns {boolean} True if all gaps are filled correctly
   */
  function isCompleted() {
    return score === totalGaps;
  }
  
  // Public API
  return {
    init: init,
    getScore: getScore,
    isCompleted: isCompleted
  };
})();

// Export the module if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = GapFillModule;
}
EOL

# Now let's combine the gap-fill.js parts
cat js/gap-fill-continued.js >> js/gap-fill.js
rm js/gap-fill-continued.js

# Create the remaining JS modules
cat > js/matching.js << 'EOL'
/**
 * ESL Grammar Website - Matching Exercise Module
 * 
 * This module handles all functionality related to matching exercises:
 * - Selecting items to match
 * - Creating visual connections between matched items
 * - Validating matches
 * - Providing feedback
 * - Tracking score and progress
 * - Restarting the activity
 */

/**
 * MatchingModule - Provides functionality for matching exercises
 */
const MatchingModule = (function() {
  // Private variables
  let score = 0;
  let totalPairs = 0;
  let matchedPairs = new Set();
  let selectedItem = null;
  let containerId = 'matching';
  let onCompleteCallback = null;
  let matchColors = [
    'rgba(144, 238, 144, 0.6)',  // light green
    'rgba(173, 216, 230, 0.6)',  // light blue
    'rgba(221, 160, 221, 0.6)',  // plum
    'rgba(255, 182, 193, 0.6)',  // light pink
    'rgba(255, 218, 185, 0.6)',  // peach
    'rgba(152, 251, 152, 0.6)',  // pale green
    'rgba(135, 206, 250, 0.6)',  // light sky blue
    'rgba(238, 130, 238, 0.6)'   // violet
  ];
  
  /**
   * Initializes the Matching module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the container element (default: 'matching')
   * @param {Function} config.onComplete - Callback function called when all pairs are matched
   * @param {Array} config.colors - Array of colors for match highlighting (optional)
   * @param {string} config.lineContainerId - ID of the container for match lines (default: 'line-container')
   * @param {boolean} config.saveProgress - Whether to save progress to localStorage (default: true)
   */
  function init(config = {}) {
    // Set up configuration
    containerId = config.containerId || 'matching';
    onCompleteCallback = config.onComplete || null;
    const lineContainerId = config.lineContainerId || 'line-container';
    const saveProgress = config.saveProgress !== undefined ? config.saveProgress : true;
    
    if (config.colors && Array.isArray(config.colors)) {
      matchColors = config.colors;
    }
    
    // Reset state
    score = 0;
    matchedPairs = new Set();
    selectedItem = null;
    
    // Count total pairs
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const questions = container.querySelectorAll('.matching-question');
    totalPairs = questions.length;
    
    // Set up click handlers for matching items
    setupMatchingItemHandlers();
    
    // Set up restart button
    setupRestartButton();
    
    // Load progress if enabled
    if (saveProgress) {
      loadProgress();
    }
  }
  
  /**
   * Sets up click handlers for matching items
   */
  function setupMatchingItemHandlers() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const items = container.querySelectorAll('.matching-question, .matching-answer');
    
    items.forEach(item => {
      item.addEventListener('click', function() {
        // If this item is already matched, do nothing
        if (this.classList.contains('matched')) {
          return;
        }
        
        const isQuestion = this.classList.contains('matching-question');
        const index = parseInt(this.getAttribute('data-index'));
        
        if (isQuestion) {
          // Clear previous question selection
          container.querySelectorAll('.matching-question').forEach(q => {
            if (!q.classList.contains('matched')) {
              q.classList.remove('selected');
            }
          });
          
          // Select this question
          this.classList.add('selected');
          selectedItem = this;
        } else {
          // This is an answer
          // If no question is selected, do nothing
          if (!selectedItem) {
            return;
          }
          
          const questionIndex = parseInt(selectedItem.getAttribute('data-index'));
          
          // Check if match is correct
          if (questionIndex === index) {
            // Correct match - apply matching color
            const colorIndex = matchedPairs.size;
            const matchColor = matchColors[colorIndex % matchColors.length];
            
            selectedItem.classList.add('matched');
            this.classList.add('matched');
            
            selectedItem.style.backgroundColor = matchColor;
            this.style.backgroundColor = matchColor;
            
            // Create visual line connecting the match if line container exists
            createMatchLine(selectedItem, this);
            
            // Add to matched pairs
            matchedPairs.add(questionIndex);
            
            // Increment score
            score++;
            
            // Check if all pairs are matched
            if (matchedPairs.size === totalPairs) {
              // Show score
              const scoreDisplay = document.getElementById(`${containerId}-score`);
              if (scoreDisplay) {
                scoreDisplay.querySelector('span').textContent = score;
                scoreDisplay.style.display = 'block';
              }
              
              // Show restart button
              const restartButton = document.getElementById(`${containerId}-restart`);
              if (restartButton) {
                restartButton.style.display = 'block';
              }
              
              // Call onComplete callback if provided
              if (typeof onCompleteCallback === 'function') {
                onCompleteCallback(score, totalPairs);
              }
              
              // Save progress to localStorage if available
              saveProgress();
            }
            
            // Clear selection
            selectedItem.classList.remove('selected');
            selectedItem = null;
          } else {
            // Incorrect match - flash
            this.classList.add('selected');
            setTimeout(() => {
              this.classList.remove('selected');
              selectedItem.classList.remove('selected');
              selectedItem = null;
            }, 500);
          }
        }
      });
    });
  }
  
  /**
   * Creates a visual line connecting matched items
   * 
   * @param {HTMLElement} fromElement - The source element (question)
   * @param {HTMLElement} toElement - The target element (answer)
   */
  function createMatchLine(fromElement, toElement) {
    const lineContainer = document.getElementById('line-container');
    if (!lineContainer) return;
    
    // Get the positions of the elements
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    const containerRect = lineContainer.getBoundingClientRect();
    
    // Calculate the coordinates relative to the line container
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    const fromX = fromRect.right - containerRect.left - scrollLeft;
    const fromY = (fromRect.top + fromRect.bottom) / 2 - containerRect.top - scrollTop;
    const toX = toRect.left - containerRect.left - scrollLeft;
    const toY = (toRect.top + toRect.bottom) / 2 - containerRect.top - scrollTop;
    
    // Calculate the length and angle of the line
    const length = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
    const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
    
    // Create the line element
    const line = document.createElement('div');
    line.className = 'matching-line';
    line.style.width = `${length}px`;
    line.style.left = `${fromX}px`;
    line.style.top = `${fromY}px`;
    line.style.transform = `rotate(${angle}deg)`;
    
    // Add a data attribute to identify this match (for removal on restart)
    const matchIndex = matchedPairs.size;
    line.setAttribute('data-match-index', matchIndex);
    
    // Use the same color as the matched pair
    const colorIndex = matchedPairs.size - 1;
    const matchColor = matchColors[colorIndex % matchColors.length];
    line.style.backgroundColor = matchColor;
    
    // Add the line to the container
    lineContainer.appendChild(line);
  }
  
  /**
   * Removes all connection lines between matched items
   */
  function removeAllLines() {
    const lineContainer = document.getElementById('line-container');
    if (!lineContainer) return;
    
    const lines = lineContainer.querySelectorAll('.matching-line');
    lines.forEach(line => {
      line.remove();
    });
  }
  
  /**
   * Sets up the restart button
   */
  function setupRestartButton() {
    const restartButton = document.getElementById(`${containerId}-restart`);
    if (!restartButton) return;
    
    restartButton.addEventListener('click', function() {
      // Clear matches
      const container = document.getElementById(containerId);
      container.querySelectorAll('.matching-question, .matching-answer').forEach(item => {
        item.classList.remove('selected', 'matched');
        item.style.backgroundColor = ''; // Remove background color
      });
      
      // Remove connection lines
      removeAllLines();
      
      // Reset matched pairs and selection
      matchedPairs = new Set();
      selectedItem = null;
      
      // Hide score and restart button
      const scoreDisplay = document.getElementById(`${containerId}-score`);
      if (scoreDisplay) {
        scoreDisplay.style.display = 'none';
      }
      restartButton.style.display = 'none';
      
      // Reset score
      score = 0;
      
      // Clear saved progress
      if (typeof removeFromLocalStorage === 'function') {
        removeFromLocalStorage(`${containerId}-progress`);
      }
    });
  }
  
  /**
   * Saves the current progress to localStorage
   */
  function saveProgress() {
    if (typeof saveToLocalStorage !== 'function') return;
    
    const progressData = {
      score: score,
      totalPairs: totalPairs,
      matchedPairs: Array.from(matchedPairs),
      completed: matchedPairs.size === totalPairs
    };
    
    saveToLocalStorage(`${containerId}-progress`, progressData);
  }
  
  /**
   * Loads progress from localStorage
   */
  function loadProgress() {
    if (typeof getFromLocalStorage !== 'function') return;
    
    const progressData = getFromLocalStorage(`${containerId}-progress`);
    if (!progressData || !progressData.matchedPairs || !progressData.matchedPairs.length) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Recreate matches
    progressData.matchedPairs.forEach(pairIndex => {
      const question = container.querySelector(`.matching-question[data-index="${pairIndex}"]`);
      const answer = container.querySelector(`.matching-answer[data-index="${pairIndex}"]`);
      
      if (question && answer) {
        // Apply matching color
        const colorIndex = matchedPairs.size;
        const matchColor = matchColors[colorIndex % matchColors.length];
        
        question.classList.add('matched');
        answer.classList.add('matched');
        
        question.style.backgroundColor = matchColor;
        answer.style.backgroundColor = matchColor;
        
        // Create visual line
        createMatchLine(question, answer);
        
        // Add to matched pairs
        matchedPairs.add(pairIndex);
      }
    });
    
    // Update score
    score = matchedPairs.size;
    
    // If all pairs are matched, update UI
    if (matchedPairs.size === totalPairs) {
      const scoreDisplay = document.getElementById(`${containerId}-score`);
      if (scoreDisplay) {
        scoreDisplay.querySelector('span').textContent = score;
        scoreDisplay.style.display = 'block';
      }
      
      const restartButton = document.getElementById(`${containerId}-restart`);
      if (restartButton) {
        restartButton.style.display = 'block';
      }
    }
  }
  
  /**
   * Gets the current score
   * 
   * @returns {Object} Object containing score and totalPairs
   */
  function getScore() {
    return {
      score: score,
      totalPairs: totalPairs,
      percentage: totalPairs > 0 ? Math.round((score / totalPairs) * 100) : 0
    };
  }
  
  /**
   * Checks if all pairs have been matched
   * 
   * @returns {boolean} True if all pairs are matched
   */
  function isCompleted() {
    return matchedPairs.size === totalPairs;
  }
  
  /**
   * Calculate positions for elements if they've moved (e.g., responsive layout changes)
   * This is useful to call on window resize to update match lines
   */
  function recalculateMatchLines() {
    // First remove all existing lines
    removeAllLines();
    
    // Then recreate lines for each match
    const container = document.getElementById(containerId);
    if (!container) return;
    
    matchedPairs.forEach(pairIndex => {
      const question = container.querySelector(`.matching-question[data-index="${pairIndex}"]`);
      const answer = container.querySelector(`.matching-answer[data-index="${pairIndex}"]`);
      
      if (question && answer) {
        createMatchLine(question, answer);
      }
    });
  }
  
  /**
   * Add window resize event listener to recalculate match lines
   * 
   * @param {boolean} enable - Whether to enable or disable the resize listener
   */
  function handleResize(enable = true) {
    if (enable) {
      // Use debounce if available to avoid too many recalculations
      const resizeHandler = typeof debounce === 'function' 
        ? debounce(recalculateMatchLines, 150) 
        : recalculateMatchLines;
      
      window.addEventListener('resize', resizeHandler);
    } else {
      window.removeEventListener('resize', recalculateMatchLines);
    }
  }
  
  /**
   * Setup auto-scroll to center the selected item
   * Useful for mobile views where items might be far apart
   * 
   * @param {boolean} enable - Whether to enable or disable auto-scrolling
   */
  function setupAutoScroll(enable = true) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (enable) {
      container.querySelectorAll('.matching-question, .matching-answer').forEach(item => {
        item.addEventListener('click', function() {
          if (window.innerWidth <= 768) { // Only on mobile/small screens
            this.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        });
      });
    } else {
      // Remove event listeners if needed
      // This would require keeping references to the handlers
    }
  }
  
  // Public API
  return {
    init: init,
    getScore: getScore,
    isCompleted: isCompleted,
    recalculateMatchLines: recalculateMatchLines,
    handleResize: handleResize,
    setupAutoScroll: setupAutoScroll
  };
})();

// Export the module if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = MatchingModule;
}
EOL

cat > js/activity-nav.js << 'EOL'
/**
 * ESL Grammar Website - Activity Navigation Module
 * 
 * This module handles navigation between different activities on practice pages:
 * - Switching between different activity types (MCQ, gap fill, etc.)
 * - Updating URL parameters to track current activity
 * - Managing navigation history for back button functionality
 * - Tracking progress across activities
 * - Providing a consistent UI for activity navigation
 */

/**
 * ActivityNavModule - Provides functionality for navigating between activities
 */
const ActivityNavModule = (function() {
  // Private variables
  let activeActivityId = null;
  let activities = [];
  let containerId = 'activity-nav';
  let activityContainersSelector = '.activity-container';
  let activityButtonSelector = '.activity-nav-btn';
  let onActivityChangeCallback = null;
  let progressTrackingEnabled = true;
  let progressContainerId = 'progress-bar';
  let progressInfoContainerId = 'progress-info';
  let useUrlParams = false;
  
  /**
   * Initializes the Activity Navigation module
   * 
   * @param {Object} config - Configuration object
   * @param {string} config.containerId - ID of the navigation container (default: 'activity-nav')
   * @param {string} config.activityContainersSelector - Selector for activity containers (default: '.activity-container')
   * @param {string} config.activityButtonSelector - Selector for activity buttons (default: '.activity-nav-btn')
   * @param {Array} config.activities - Array of activity IDs to initialize (if not provided, will be auto-detected)
   * @param {Function} config.onActivityChange - Callback function when activity changes
   * @param {boolean} config.progressTracking - Whether to enable progress tracking (default: true)
   * @param {string} config.progressContainerId - ID of progress bar container (default: 'progress-bar')
   * @param {string} config.progressInfoContainerId - ID of progress info container (default: 'progress-info')
   * @param {boolean} config.useUrlParams - Whether to update URL parameters with activity (default: false)
   */
  function init(config = {}) {
    // Set up configuration
    containerId = config.containerId || 'activity-nav';
    activityContainersSelector = config.activityContainersSelector || '.activity-container';
    activityButtonSelector = config.activityButtonSelector || '.activity-nav-btn';
    onActivityChangeCallback = config.onActivityChange || null;
    progressTrackingEnabled = config.progressTracking !== undefined ? config.progressTracking : true;
    progressContainerId = config.progressContainerId || 'progress-bar';
    progressInfoContainerId = config.progressInfoContainerId || 'progress-info';
    useUrlParams = config.useUrlParams || false;
    
    // Set up activities array
    if (config.activities && Array.isArray(config.activities)) {
      activities = config.activities;
    } else {
      // Auto-detect activities from DOM
      activities = detectActivities();
    }
    
    // Set up navigation button click handlers
    setupNavButtonHandlers();
    
    // Check URL parameters for initial activity
    if (useUrlParams) {
      const urlParams = new URLSearchParams(window.location.search);
      const activityParam = urlParams.get('activity');
      
      if (activityParam && activities.includes(activityParam)) {
        // If URL has valid activity parameter, navigate to it
        navigateToActivity(activityParam);
      } else {
        // Otherwise, navigate to first activity or check localStorage
        loadLastActivity();
      }
    } else {
      // If not using URL params, just check localStorage
      loadLastActivity();
    }
    
    // If no active activity was set, default to first one
    if (!activeActivityId && activities.length > 0) {
      navigateToActivity(activities[0]);
    }
    
    // Update progress display if enabled
    if (progressTrackingEnabled) {
      updateProgressDisplay();
    }
  }
  
  /**
   * Auto-detects activities from the DOM
   * 
   * @returns {Array} - Array of activity IDs
   */
  function detectActivities() {
    const detectedActivities = [];
    
    // Check navigation buttons
    const navContainer = document.getElementById(containerId);
    if (navContainer) {
      const buttons = navContainer.querySelectorAll(activityButtonSelector);
      buttons.forEach(button => {
        const activityId = button.getAttribute('data-activity');
        if (activityId) {
          detectedActivities.push(activityId);
        }
      });
    }
    
    // If no activities found from buttons, check containers directly
    if (detectedActivities.length === 0) {
      const containers = document.querySelectorAll(activityContainersSelector);
      containers.forEach(container => {
        if (container.id) {
          detectedActivities.push(container.id);
        }
      });
    }
    
    return detectedActivities;
  }
  
  /**
   * Sets up click handlers for navigation buttons
   */
  function setupNavButtonHandlers() {
    const navContainer = document.getElementById(containerId);
    if (!navContainer) return;
    
    const buttons = navContainer.querySelectorAll(activityButtonSelector);
    
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const activityId = this.getAttribute('data-activity');
        if (activityId) {
          navigateToActivity(activityId);
        }
      });
    });
  }
  
  /**
   * Navigates to a specific activity
   * 
   * @param {string} activityId - ID of the activity to navigate to
   */
  function navigateToActivity(activityId) {
    if (!activities.includes(activityId)) {
      console.error(`Activity '${activityId}' not found`);
      return;
    }
    
    // Hide all activities
    document.querySelectorAll(activityContainersSelector).forEach(container => {
      container.classList.remove('active');
    });
    
    // Show selected activity
    const activityContainer = document.getElementById(activityId);
    if (activityContainer) {
      activityContainer.classList.add('active');
    }
    
    // Update navigation buttons
    const navContainer = document.getElementById(containerId);
    if (navContainer) {
      navContainer.querySelectorAll(activityButtonSelector).forEach(button => {
        button.classList.remove('active');
        
        if (button.getAttribute('data-activity') === activityId) {
          button.classList.add('active');
        }
      });
    }
    
    // Update URL parameter if enabled
    if (useUrlParams) {
      updateUrlParam(activityId);
    }
    
    // Save activity to localStorage
    saveToLocalStorage('lastActivity', activityId);
    
    // Store active activity
    activeActivityId = activityId;
    
    // Call onActivityChange callback if provided
    if (typeof onActivityChangeCallback === 'function') {
      onActivityChangeCallback(activityId);
    }
  }
  
  /**
   * Updates URL parameter with current activity
   * 
   * @param {string} activityId - ID of the current activity
   */
  function updateUrlParam(activityId) {
    // Only proceed if History API is supported
    if (!window.history || !window.history.replaceState) return;
    
    const url = new URL(window.location);
    url.searchParams.set('activity', activityId);
    window.history.replaceState({}, '', url);
  }
  
  /**
   * Loads the last active activity from localStorage
   */
  function loadLastActivity() {
    if (typeof getFromLocalStorage !== 'function') return;
    
    const lastActivity = getFromLocalStorage('lastActivity');
    
    if (lastActivity && activities.includes(lastActivity)) {
      navigateToActivity(lastActivity);
    }
  }
  
  /**
   * Updates the progress display
   * 
   * @param {Object} progress - Optional progress data to display
   */
  function updateProgressDisplay(progress = null) {
    if (!progressTrackingEnabled) return;
    
    // If no progress data provided, calculate it
    if (!progress) {
      progress = calculateProgress();
    }
    
    // Update progress bar
    const progressBar = document.getElementById(progressContainerId);
    if (progressBar) {
      progressBar.style.width = `${progress.percentage}%`;
    }
    
    // Update progress info text
    const progressInfo = document.getElementById(progressInfoContainerId);
    if (progressInfo) {
      let statusText = '';
      
      if (progress.percentage < 25) {
        statusText = "Just getting started! Keep going!";
      } else if (progress.percentage < 50) {
        statusText = "Making good progress! Keep it up!";
      } else if (progress.percentage < 75) {
        statusText = "Excellent progress! You're doing great!";
      } else if (progress.percentage < 100) {
        statusText = "Almost there! Just a few more activities to go!";
      } else {
        statusText = "Congratulations! You've completed all activities!";
      }
      
      progressInfo.textContent = `Progress: ${progress.percentage}% complete (${progress.completed}/${progress.total} activities completed)`;
    }
  }
  
  /**
   * Calculates overall progress across activities
   * 
   * @returns {Object} - Progress data object
   */
  function calculateProgress() {
    let completed = 0;
    const total = activities.length;
    
    // Check each activity's completion status
    activities.forEach(activityId => {
      const isCompleted = isActivityCompleted(activityId);
      if (isCompleted) {
        completed++;
      }
    });
    
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      completed: completed,
      total: total,
      percentage: percentage
    };
  }
  
  /**
   * Checks if a specific activity is completed
   * 
   * @param {string} activityId - ID of the activity to check
   * @returns {boolean} - Whether the activity is completed
   */
  function isActivityCompleted(activityId) {
    if (typeof getFromLocalStorage !== 'function') return false;
    
    // Try to get activity progress from localStorage
    const progressKey = `${activityId}-progress`;
    const progressData = getFromLocalStorage(progressKey);
    
    return progressData && progressData.completed === true;
  }
  
  /**
   * Gets the active activity ID
   * 
   * @returns {string} - ID of the active activity
   */
  function getActiveActivity() {
    return activeActivityId;
  }
  
  /**
   * Checks if activity is active
   * 
   * @param {string} activityId - ID of the activity to check
   * @returns {boolean} - Whether the activity is active
   */
  function isActivityActive(activityId) {
    return activeActivityId === activityId;
  }
  
  /**
   * Navigates to the next activity
   * 
   * @returns {boolean} - Whether navigation was successful
   */
  function navigateToNextActivity() {
    const currentIndex = activities.indexOf(activeActivityId);
    
    if (currentIndex >= 0 && currentIndex < activities.length - 1) {
      navigateToActivity(activities[currentIndex + 1]);
      return true;
    }
    
    return false;
  }
  
  /**
   * Navigates to the previous activity
   * 
   * @returns {boolean} - Whether navigation was successful
   */
  function navigateToPreviousActivity() {
    const currentIndex = activities.indexOf(activeActivityId);
    
    if (currentIndex > 0) {
      navigateToActivity(activities[currentIndex - 1]);
      return true;
    }
    
    return false;
  }
  
  /**
   * Adds "Next" and "Previous" buttons to each activity
   */
  function addNextPrevButtons() {
    activities.forEach(activityId => {
      const container = document.getElementById(activityId);
      if (!container) return;
      
      // Check if buttons already exist
      if (container.querySelector('.activity-nav-next') || 
          container.querySelector('.activity-nav-prev')) {
        return;
      }
      
      // Create button container
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'activity-nav-buttons';
      buttonContainer.style.display = 'flex';
      buttonContainer.style.justifyContent = 'space-between';
      buttonContainer.style.marginTop = '20px';
      
      // Create previous button (if not first activity)
      const currentIndex = activities.indexOf(activityId);
      
      if (currentIndex > 0) {
        const prevButton = document.createElement('button');
        prevButton.className = 'activity-nav-prev nav-button';
        prevButton.innerHTML = '&larr; Previous Activity';
        prevButton.addEventListener('click', navigateToPreviousActivity);
        buttonContainer.appendChild(prevButton);
      } else {
        // Add empty div for spacing
        const spacer = document.createElement('div');
        buttonContainer.appendChild(spacer);
      }
      
      // Create next button (if not last activity)
      if (currentIndex < activities.length - 1) {
        const nextButton = document.createElement('button');
        nextButton.className = 'activity-nav-next nav-button';
        nextButton.innerHTML = 'Next Activity &rarr;';
        nextButton.addEventListener('click', navigateToNextActivity);
        buttonContainer.appendChild(nextButton);
      }
      
      // Add buttons container to activity container
      container.appendChild(buttonContainer);
    });
  }
  
  /**
   * Sets up keyboard navigation (arrow keys) between activities
   * 
   * @param {boolean} enable - Whether to enable keyboard navigation
   */
  function setupKeyboardNavigation(enable = true) {
    if (enable) {
      document.addEventListener('keydown', handleKeyNavigation);
    } else {
      document.removeEventListener('keydown', handleKeyNavigation);
    }
  }
  
  /**
   * Handles keyboard navigation events
   * 
   * @param {KeyboardEvent} event - Keyboard event
   */
  function handleKeyNavigation(event) {
    // Only handle left/right arrow keys
    if (event.key === 'ArrowRight') {
      // Check if not typing in an input field
      if (document.activeElement.tagName !== 'INPUT' && 
          document.activeElement.tagName !== 'TEXTAREA') {
        navigateToNextActivity();
      }
    } else if (event.key === 'ArrowLeft') {
      // Check if not typing in an input field
      if (document.activeElement.tagName !== 'INPUT' && 
          document.activeElement.tagName !== 'TEXTAREA') {
        navigateToPreviousActivity();
      }
    }
  }
  
  /**
   * Creates a table of contents for all activities
   * 
   * @param {string} containerId - ID of container to append table of contents
   */
  function createTableOfContents(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Create table of contents
    const toc = document.createElement('div');
    toc.className = 'activity-toc';
    
    // Add heading
    const heading = document.createElement('h3');
    heading.textContent = 'Activity List';
    toc.appendChild(heading);
    
    // Create list of activities
    const list = document.createElement('ul');
    list.className = 'activity-toc-list';
    
    // Add each activity
    activities.forEach(activityId => {
      const listItem = document.createElement('li');
      
      // Try to get activity title
      let activityTitle = activityId;
      const activityContainer = document.getElementById(activityId);
      
      if (activityContainer) {
        // Look for heading in the activity container
        const heading = activityContainer.querySelector('h2, h3');
        if (heading) {
          activityTitle = heading.textContent;
        }
      }
      
      // Check completion status
      const isCompleted = isActivityCompleted(activityId);
      
      // Create link
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = activityTitle;
      link.addEventListener('click', function(e) {
        e.preventDefault();
        navigateToActivity(activityId);
      });
      
      // Add completion status
      if (isCompleted) {
        const completedBadge = document.createElement('span');
        completedBadge.className = 'completed-badge';
        completedBadge.textContent = '✓';
        completedBadge.style.color = 'var(--success-color, #155724)';
        completedBadge.style.marginLeft = '8px';
        link.appendChild(completedBadge);
      }
      
      listItem.appendChild(link);
      list.appendChild(listItem);
    });
    
    toc.appendChild(list);
    container.appendChild(toc);
  }
  
  /**
   * Updates the UI when activities are completed
   * 
   * @param {string} activityId - ID of the completed activity
   */
  function handleActivityCompletion(activityId) {
    // Update activity button to show completion
    const navContainer = document.getElementById(containerId);
    if (navContainer) {
      const button = navContainer.querySelector(`${activityButtonSelector}[data-activity="${activityId}"]`);
      
      if (button) {
        button.classList.add('completed');
        
        // Add completion icon if not already present
        if (!button.querySelector('.completion-icon')) {
          const icon = document.createElement('span');
          icon.className = 'completion-icon';
          icon.textContent = '✓';
          icon.style.marginLeft = '5px';
          button.appendChild(icon);
        }
      }
    }
    
    // Update progress display
    if (progressTrackingEnabled) {
      updateProgressDisplay();
    }
    
    // Show congratulations message for completing all activities
    const progress = calculateProgress();
    if (progress.completed === progress.total) {
      showCompletionMessage();
    }
  }
  
  /**
   * Shows a message when all activities are completed
   */
  function showCompletionMessage() {
    // Check if message already exists
    if (document.getElementById('completion-message')) {
      return;
    }
    
    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.id = 'completion-message';
    messageContainer.className = 'completion-message';
    messageContainer.style.backgroundColor = 'var(--success-bg, #d4edda)';
    messageContainer.style.color = 'var(--success-color, #155724)';
    messageContainer.style.padding = '15px';
    messageContainer.style.borderRadius = '5px';
    messageContainer.style.margin = '20px 0';
    messageContainer.style.textAlign = 'center';
    messageContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    
    // Add message content
    const heading = document.createElement('h3');
    heading.textContent = 'Congratulations!';
    heading.style.marginTop = '0';
    
    const message = document.createElement('p');
    message.textContent = 'You have completed all the activities! Well done on your progress!';
    
    const icon = document.createElement('div');
    icon.textContent = '🎉';
    icon.style.fontSize = '2rem';
    icon.style.marginBottom = '10px';
    
    messageContainer.appendChild(icon);
    messageContainer.appendChild(heading);
    messageContainer.appendChild(message);
    
    // Add button to restart all activities
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart All Activities';
    restartButton.className = 'restart-btn';
    restartButton.addEventListener('click', resetAllActivities);
    messageContainer.appendChild(restartButton);
    
    // Add message after progress bar
    const progressInfo = document.getElementById(progressInfoContainerId);
    if (progressInfo && progressInfo.parentNode) {
      progressInfo.parentNode.insertBefore(messageContainer, progressInfo.nextSibling);
    } else {
      // If progress info not found, add after navigation
      const navContainer = document.getElementById(containerId);
      if (navContainer && navContainer.parentNode) {
        navContainer.parentNode.insertBefore(messageContainer, navContainer.nextSibling);
      }
    }
  }
  
  /**
   * Resets progress for all activities
   */
  function resetAllActivities() {
    if (typeof removeFromLocalStorage !== 'function') return;
    
    if (!confirm('Are you sure you want to reset progress for all activities?')) {
      return;
    }
    
    // Remove progress data for each activity
    activities.forEach(activityId => {
      removeFromLocalStorage(`${activityId}-progress`);
    });
    
    // Update UI
    const navContainer = document.getElementById(containerId);
    if (navContainer) {
      navContainer.querySelectorAll(`${activityButtonSelector} .completion-icon`).forEach(icon => {
        icon.remove();
      });
      
      navContainer.querySelectorAll(`${activityButtonSelector}`).forEach(button => {
        button.classList.remove('completed');
      });
    }
    
    // Remove completion message
    const completionMessage = document.getElementById('completion-message');
    if (completionMessage) {
      completionMessage.remove();
    }
    
    // Update progress display
    if (progressTrackingEnabled) {
      updateProgressDisplay({
        completed: 0,
        total: activities.length,
        percentage: 0
      });
    }
    
    // Reload page to reset all activity states
    window.location.reload();
  }
  
  /**
   * Sets an event listener for activity completion from other modules
   */
  function listenForActivityCompletion() {
    document.addEventListener('activityCompleted', function(e) {
      if (e.detail && e.detail.activityId) {
        handleActivityCompletion(e.detail.activityId);
      }
    });
  }
  
  /**
   * Notifies that an activity has been completed
   * 
   * @param {string} activityId - ID of the completed activity
   * @param {Object} details - Additional completion details
   */
  function notifyActivityCompleted(activityId, details = {}) {
    // Create and dispatch custom event
    const event = new CustomEvent('activityCompleted', {
      detail: {
        activityId: activityId,
        timestamp: new Date().toISOString(),
        ...details
      }
    });
    
    document.dispatchEvent(event);
  }
  
  // Initialize event listeners when module loads
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', listenForActivityCompletion);
    } else {
      listenForActivityCompletion();
    }
  }
  
  // Call initialize
  initialize();
  
  // Public API
  return {
    init: init,
    navigateToActivity: navigateToActivity,
    getActiveActivity: getActiveActivity,
    isActivityActive: isActivityActive,
    navigateToNextActivity: navigateToNextActivity,
    navigateToPreviousActivity: navigateToPreviousActivity,
    updateProgressDisplay: updateProgressDisplay,
    calculateProgress: calculateProgress,
    isActivityCompleted: isActivityCompleted,
    addNextPrevButtons: addNextPrevButtons,
    setupKeyboardNavigation: setupKeyboardNavigation,
    createTableOfContents: createTableOfContents,
    resetAllActivities: resetAllActivities,
    notifyActivityCompleted: notifyActivityCompleted
  };
})();

// Export the module if module system is being used
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = ActivityNavModule;
}
EOL

# HTML Template files
cat > templates/head.html << 'EOL'
<!-- Standardized Head Section Template -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="{PAGE_DESCRIPTION}">
<title>{PAGE_TITLE} - Advanced ESL Grammar</title>

<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&family=Source+Code+Pro&display=swap" rel="stylesheet">

<!-- Base and Activity Styles -->
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/activities.css">

<!-- Favicon -->
<link rel="icon" type="image/png" href="images/favicon.png">

<!-- Conditional polyfills -->
<!--[if IE]>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
<![endif]-->
EOL

cat > templates/breadcrumbs.html << 'EOL'
<!-- Breadcrumbs navigation -->
<div class="breadcrumbs" aria-label="breadcrumb">
  <span class="breadcrumb-item"><a href="index.html">Home</a></span>
  <span class="breadcrumb-separator">›</span>
  <!-- Second level breadcrumb (optional) -->
  {SECOND_LEVEL_BREADCRUMB}
  <!-- Current page breadcrumb -->
  <span class="breadcrumb-item">{CURRENT_PAGE}</span>
</div>

<!-- Example of a completed breadcrumb for a grammar page:
<div class="breadcrumbs" aria-label="breadcrumb">
  <span class="breadcrumb-item"><a href="index.html">Home</a></span>
  <span class="breadcrumb-separator">›</span>
  <span class="breadcrumb-item"><a href="grammar.html">Grammar</a></span>
  <span class="breadcrumb-separator">›</span>
  <span class="breadcrumb-item">Present Perfect Continuous</span>
</div>
-->
EOL

cat > templates/theme-toggle.html << 'EOL'
<!-- Theme toggle button component -->
<div class="theme-toggle-container">
  <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
    <span class="light-icon">☀️</span>
    <span class="dark-icon">🌙</span>
  </button>
</div>

<!-- JavaScript for theme toggle functionality -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Set initial theme based on stored preference or system preference
    setInitialTheme();
    
    // Handle theme toggle click
    themeToggle.addEventListener('click', function() {
      toggleTheme();
    });
    
    function setInitialTheme() {
      // Check for stored theme preference
      const storedTheme = localStorage.getItem('theme');
      
      if (storedTheme) {
        // Apply stored theme preference
        document.documentElement.setAttribute('data-theme', storedTheme);
      } else {
        // Check for system dark mode preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (prefersDarkMode) {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
        }
      }
    }
    
    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Update the theme attribute
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // Save theme preference to local storage
      localStorage.setItem('theme', newTheme);
    }
  });
</script>
EOL

# Create a sample page template that uses these modular components
cat > templates/practice-page-template.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Include standardized head content -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Practice activities for {GRAMMAR_TOPIC} - Advanced ESL grammar practice">
  <title>{GRAMMAR_TOPIC} Practice - Advanced ESL Grammar</title>
  
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600&family=Source+Code+Pro&display=swap" rel="stylesheet">
  
  <!-- Styles -->
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/activities.css">
</head>
<body>
  <!-- Include skip link and theme toggle -->
  <a href="#main-content" class="skip-link">Skip to content</a>
  
  <div class="theme-toggle-container">
    <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode">
      <span class="light-icon">☀️</span>
      <span class="dark-icon">🌙</span>
    </button>
  </div>
  
  <!-- Include navigation -->
  <nav class="main-navigation">
    <a href="index.html" class="site-logo">ESL Grammar</a>
    <button class="nav-toggle" aria-label="Toggle navigation">☰</button>
    <div class="nav-links">
      <a href="index.html" class="nav-link">Home</a>
      <a href="grammar.html" class="nav-link">Grammar</a>
      <a href="extra-practice.html" class="nav-link">Extra Practice</a>
      <a href="progress.html" class="nav-link">My Progress</a>
    </div>
  </nav>

  <div class="container">
    <!-- Include breadcrumbs -->
    <div class="breadcrumbs" aria-label="breadcrumb">
      <span class="breadcrumb-item"><a href="index.html">Home</a></span>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-item"><a href="grammar.html">Grammar</a></span>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-item"><a href="{GRAMMAR_TOPIC_URL}">{GRAMMAR_TOPIC}</a></span>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-item">Practice</span>
    </div>

    <main id="main-content">
      <h1>{GRAMMAR_TOPIC} Practice</h1>

      <!-- Introduction Section -->
      <section class="intro-section">
        <h2>Practice Activities</h2>
        <p>Now it's time to practice what you've learned about {GRAMMAR_TOPIC}. Complete the activities below to test your understanding and build your skills.</p>
        
        <div id="progress-container" class="progress-container">
          <div id="progress-bar" class="progress-bar" style="width: 0%"></div>
        </div>
        <div id="progress-info" class="progress-info">
          Progress: 0% complete (0/4 activities completed)
        </div>
      </section>

      <!-- Activity Navigation -->
      <div id="activity-nav" class="activity-nav">
        <button data-activity="mcq" class="activity-nav-btn active">Multiple Choice</button>
        <button data-activity="gap-fill" class="activity-nav-btn">Gap Fill</button>
        <button data-activity="matching" class="activity-nav-btn">Matching</button>
        <button data-activity="transformation" class="activity-nav-btn">Transformation</button>
      </div>

      <!-- Multiple Choice Questions -->
      <section id="mcq" class="activity-container active">
        <h2>Multiple Choice Questions</h2>
        <p>Choose the correct option for each sentence.</p>
        
        <div class="question" id="q1">
          <p class="mcq-question">1. {MCQ_QUESTION_1}</p>
          <div class="options">
            <div class="option" data-index="0" onclick="MCQModule.selectOption('q1', 0)">
              <span>A. {OPTION_1_A}</span>
            </div>
            <div class="option" data-index="1" onclick="MCQModule.selectOption('q1', 1)">
              <span>B. {OPTION_1_B}</span>
            </div>
            <div class="option" data-index="2" onclick="MCQModule.selectOption('q1', 2)">
              <span>C. {OPTION_1_C}</span>
            </div>
            <div class="option" data-index="3" onclick="MCQModule.selectOption('q1', 3)">
              <span>D. {OPTION_1_D}</span>
            </div>
          </div>
          <div class="feedback" id="feedback-q1-0">{FEEDBACK_1_A}</div>
          <div class="feedback" id="feedback-q1-1">{FEEDBACK_1_B}</div>
          <div class="feedback" id="feedback-q1-2">{FEEDBACK_1_C}</div>
          <div class="feedback" id="feedback-q1-3">{FEEDBACK_1_D}</div>
        </div>
        
        <!-- Add more questions as needed -->
        
        <div class="control-buttons">
          <button id="mcq-submit" class="submit-btn">Check Answers</button>
          <button id="mcq-restart" class="restart-btn" style="display:none;">Try Again</button>
        </div>
        
        <div class="score-display" id="mcq-score" style="display:none;">
          Your score: <span>0</span>/5
        </div>
      </section>

      <!-- Gap Fill Activity -->
      <section id="gap-fill" class="activity-container">
        <h2>Gap Fill Exercise</h2>
        <p>Complete the sentences with the correct form of the words in brackets.</p>
        
        <div class="question" id="gf1">
          <p class="gap-fill-sentence">{GAP_FILL_SENTENCE_1}</p>
          <input type="text" class="gap-input" data-answer="{CORRECT_ANSWER_1}" placeholder="Type your answer">
          <div class="feedback"></div>
        </div>
        
        <!-- Add more questions as needed -->
        
        <div class="control-buttons">
          <button id="gap-fill-submit" class="submit-btn">Check Answers</button>
          <button id="gap-fill-restart" class="restart-btn" style="display:none;">Try Again</button>
        </div>
        
        <div class="score-display" id="gap-fill-score" style="display:none;">
          Your score: <span>0</span>/5
        </div>
      </section>

      <!-- Matching Activity -->
      <section id="matching" class="activity-container">
        <h2>Matching Exercise</h2>
        <p>Match the beginning of each sentence with the correct ending.</p>
        
        <div id="line-container" class="matching-line-container"></div>
        
        <div class="matching-container">
          <div class="matching-item">
            <div class="matching-question" data-index="1">{MATCHING_START_1}</div>
            <div class="matching-answer" data-index="1">{MATCHING_END_1}</div>
          </div>
          
          <!-- Add more items as needed -->
        </div>
        
        <div class="control-buttons">
          <button id="matching-restart" class="restart-btn" style="display:none;">Try Again</button>
        </div>
        
        <div class="score-display" id="matching-score" style="display:none;">
          Your score: <span>0</span>/5
        </div>
      </section>

      <!-- Transformation Activity -->
      <section id="transformation" class="activity-container">
        <h2>Sentence Transformation</h2>
        <p>Rewrite each sentence using the word in brackets, keeping the same meaning.</p>
        
        <div class="question" id="tr1">
          <p class="question-text">1. {TRANSFORMATION_ORIGINAL_1} ({TRANSFORMATION_KEY_1})</p>
          <input type="text" class="transformation-input" data-answer="{TRANSFORMATION_ANSWER_1}" placeholder="Rewrite the sentence here...">
          <div class="feedback"></div>
        </div>
        
        <!-- Add more questions as needed -->
        
        <div class="control-buttons">
          <button id="transformation-submit" class="submit-btn">Check Answers</button>
          <button id="transformation-restart" class="restart-btn" style="display:none;">Try Again</button>
        </div>
        
        <div class="score-display" id="transformation-score" style="display:none;">
          Your score: <span>0</span>/5
        </div>
      </section>
    </main>
  </div>
  
  <!-- BOTTOM NAVIGATION -->
  <nav class="bottom-navigation">
    <a href="{GRAMMAR_TOPIC_URL}" class="nav-button previous">← Back to: {GRAMMAR_TOPIC} Explanation</a>
    <div class="center-buttons">
      <button class="nav-button print-button" onclick="window.print()">Print This Page</button>
    </div>
    <a href="progress.html" class="nav-button next">View My Progress →</a>
  </nav>

  <!-- Include footer -->
  <footer>
    <div class="footer-content">
      <div class="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="grammar.html">Grammar</a></li>
          <li><a href="extra-practice.html">Extra Practice</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3>Grammar Topics</h3>
        <ul>
          <li><a href="tenses.html">Advanced Tenses</a></li>
          <li><a href="conditionals.html">Conditionals</a></li>
          <li><a href="modals.html">Modal Verbs</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h3>Connect</h3>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>© 2025 English in Doses | All rights reserved</p>
    </div>
  </footer>

  <!-- JavaScript -->
  <script src="js/core.js"></script>
  <script src="js/mcq.js"></script>
  <script src="js/gap-fill.js"></script>
  <script src="js/matching.js"></script>
  <script src="js/transformation.js"></script>
  <script src="js/activity-nav.js"></script>
  <script src="js/progress-tracking.js"></script>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Initialize activity modules
      MCQModule.init({
        containerId: 'mcq',
        answers: {
          'q1': 2,  // Index of correct answer for question 1 (0-based)
          'q2': 0,  // Index of correct answer for question 2
          'q3': 3,  // Index of correct answer for question 3
          'q4': 1,  // Index of correct answer for question 4
          'q5': 2   // Index of correct answer for question 5
        },
        onComplete: function(score, total) {
          ProgressTrackingModule.updateItemProgress('activities', 'mcq', {
            completed: true,
            score: score,
            maxScore: total
          });
          ActivityNavModule.notifyActivityCompleted('mcq', {
            score: score,
            maxScore: total
          });
        }
      });
      
      GapFillModule.init({
        containerId: 'gap-fill',
        onComplete: function(score, total) {
          ProgressTrackingModule.updateItemProgress('activities', 'gap-fill', {
            completed: true,
            score: score,
            maxScore: total
          });
          ActivityNavModule.notifyActivityCompleted('gap-fill', {
            score: score,
            maxScore: total
          });
        }
      });
      
      MatchingModule.init({
        containerId: 'matching',
        onComplete: function(score, total) {
          ProgressTrackingModule.updateItemProgress('activities', 'matching', {
            completed: true,
            score: score,
            maxScore: total
          });
          ActivityNavModule.notifyActivityCompleted('matching', {
            score: score,
            maxScore: total
          });
        }
      });
      
      TransformationModule.init({
        containerId: 'transformation',
        onComplete: function(score, total) {
          ProgressTrackingModule.updateItemProgress('activities', 'transformation', {
            completed: true,
            score: score,
            maxScore: total
          });
          ActivityNavModule.notifyActivityCompleted('transformation', {
            score: score,
            maxScore: total
          });
        }
      });
      
      // Initialize activity navigation
      ActivityNavModule.init({
        containerId: 'activity-nav',
        activities: ['mcq', 'gap-fill', 'matching', 'transformation'],
        progressContainerId: 'progress-bar',
        progressInfoContainerId: 'progress-info',
        onActivityChange: function(activityId) {
          console.log('Activity changed to:', activityId);
        }
      });
      
      // Initialize progress tracking
      ProgressTrackingModule.init({
        categories: {
          activities: {
            grammarActivities: ['mcq', 'gap-fill', 'matching', 'transformation']
          }
        },
        onProgressChange: function(details) {
          ActivityNavModule.updateProgressDisplay();
        }
      });
    });
  </script>
</body>
</html>
EOL

# Create a README file with implementation instructions
cat > README.md << 'EOL'
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
EOL

echo "All files have been created successfully. See the README.md file for implementation instructions."
