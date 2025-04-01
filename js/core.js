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
