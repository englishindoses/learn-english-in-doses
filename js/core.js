/**
 * ESL Grammar Website - Core JavaScript
 * 
 * This file contains core functionality used across the ESL Grammar website, including:
 * - Theme toggling (light/dark mode)
 * - Mobile navigation controls
 * - Local storage utilities for saving/retrieving user preferences and progress
 * - Common UI helpers and utility functions
 * - Module detection and communication utilities
 */

// Ensure the DOM is fully loaded before running any code
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all core functionality
  initThemeToggle();
  initMobileNavigation();
  initActiveNavLink();
  initPrintButton();
  initSkipLink();

  // Initialize modules
  initModules();
  
  // Log initialization for debugging
  console.log('Core module initialized');
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
 * 2b. Active Navigation Link
 * ----------------------------------------
 */

/**
 * Highlights the current page's nav link by matching the URL path
 * against each nav link's href. Handles root pages and subdirectory
 * pages (e.g. grammar lessons fall under their level's nav link).
 */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  if (!navLinks.length) return;

  const currentPath = window.location.pathname.toLowerCase();

  // Map subdirectory patterns to the nav link text they belong to
  const sectionMap = {
    '/grammar/beginner/': 'Beginner',
    '/beginner-landing': 'Beginner',
    '/grammar/intermediate/': 'Intermediate',
    '/intermediate-landing': 'Intermediate',
    '/grammar/advanced/': 'Advanced',
    '/advanced/': 'Advanced',
    '/advanced-landing': 'Advanced',
    '/travel/': 'Travel English',
    '/booking-page': 'Book a Lesson',
    '/about': 'About Us',
    '/home': 'Home',
    '/my-progress': 'My Progress'
  };

  // Find the matching section by checking path prefixes
  let matchedLinkText = null;
  for (const [pattern, linkText] of Object.entries(sectionMap)) {
    if (currentPath.includes(pattern)) {
      matchedLinkText = linkText;
      break;
    }
  }

  if (!matchedLinkText) return;

  navLinks.forEach(function(link) {
    if (link.textContent.trim() === matchedLinkText) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * ----------------------------------------
 * 3. Local Storage Utility Functions
 * ----------------------------------------
 */

/**
 * Saves a value to localStorage with improved error handling
 * 
 * @param {string} key - The key to store the value under
 * @param {any} value - The value to store
 * @returns {boolean} - True if successful, false otherwise
 */
function saveToLocalStorage(key, value) {
  try {
    // First check if localStorage is available
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available in this browser');
      return false;
    }
    
    // Handle objects and arrays safely
    let valueToStore;
    if (typeof value === 'object' && value !== null) {
      try {
        valueToStore = JSON.stringify(value);
      } catch (err) {
        console.error('Failed to stringify object for localStorage:', err);
        return false;
      }
    } else {
      valueToStore = value;
    }
    
    // Attempt to store
    localStorage.setItem(key, valueToStore);
    
    // Verify storage was successful
    const verification = localStorage.getItem(key);
    if (!verification) {
      console.warn(`Storage verification failed for key: ${key}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Retrieves a value from localStorage with improved error handling
 * 
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Default value to return if key doesn't exist
 * @returns {any} - The value from localStorage or defaultValue
 */
function getFromLocalStorage(key, defaultValue = null) {
  try {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available in this browser');
      return defaultValue;
    }
    
    const value = localStorage.getItem(key);
    
    // If key doesn't exist, return the default value
    if (value === null) {
      return defaultValue;
    }
    
    // Try to parse as JSON, return original value if not valid JSON
    try {
      return JSON.parse(value);
    } catch (e) {
      // Not JSON, return as is
      return value;
    }
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Removes a value from localStorage with improved error handling
 * 
 * @param {string} key - The key to remove
 * @returns {boolean} - True if successful, false otherwise
 */
function removeFromLocalStorage(key) {
  try {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available in this browser');
      return false;
    }
    
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
    // Use a unique test key to avoid conflicts
    const testKey = `__storage_test_${Math.random().toString(36).substring(2)}`;
    localStorage.setItem(testKey, testKey);
    const result = localStorage.getItem(testKey) === testKey;
    localStorage.removeItem(testKey);
    return result;
  } catch (e) {
    return false;
  }
}

/**
 * Gets all keys in localStorage that match a pattern
 * 
 * @param {string} pattern - Pattern to match (e.g., 'progress-' for all progress keys)
 * @returns {Array} - Array of matching keys
 */
function getLocalStorageKeys(pattern = '') {
  try {
    if (!isLocalStorageAvailable()) {
      return [];
    }
    
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (!pattern || key.includes(pattern))) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
    return [];
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
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '1000';
    document.body.appendChild(container);
  }
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = `feedback-message feedback-${type}`;
  messageElement.textContent = message;
  
  // Style based on type if not already styled in CSS
  if (!messageElement.offsetWidth) {
    messageElement.style.padding = '10px 15px';
    messageElement.style.marginBottom = '10px';
    messageElement.style.borderRadius = '4px';
    messageElement.style.backgroundColor = 
      type === 'success' ? '#d4edda' : 
      type === 'error' ? '#f8d7da' : '#d1ecf1';
    messageElement.style.color = 
      type === 'success' ? '#155724' : 
      type === 'error' ? '#721c24' : '#0c5460';
    messageElement.style.border = '1px solid transparent';
    messageElement.style.borderColor = 
      type === 'success' ? '#c3e6cb' : 
      type === 'error' ? '#f5c6cb' : '#bee5eb';
  }
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.className = 'feedback-close';
  closeButton.innerHTML = '&times;';
  closeButton.setAttribute('aria-label', 'Close message');
  closeButton.style.marginLeft = '10px';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.cursor = 'pointer';
  closeButton.style.float = 'right';
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

/**
 * Debug function to log storage status
 */
function logStorageStatus() {
  console.group('LocalStorage Status');
  
  try {
    console.log('LocalStorage available:', isLocalStorageAvailable());
    
    if (isLocalStorageAvailable()) {
      console.log('Storage usage:', calculateStorageUsage());
      
      // Log keys and values
      console.log('Keys in storage:');
      const keys = getLocalStorageKeys();
      keys.forEach(key => {
        const value = localStorage.getItem(key);
        const truncatedValue = value && value.length > 50 ? value.substring(0, 50) + '...' : value;
        console.log(`- ${key}: ${truncatedValue}`);
      });
    }
  } catch (error) {
    console.error('Error logging storage status:', error);
  }
  
  console.groupEnd();
}

/**
 * Calculate storage usage
 * 
 * @returns {Object} - Object with usage information
 */
function calculateStorageUsage() {
  try {
    if (!isLocalStorageAvailable()) {
      return { available: false };
    }
    
    let totalBytes = 0;
    const itemCount = localStorage.length;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      
      // Calculate size in bytes: 2 bytes per character for UTF-16
      const bytes = (key.length + value.length) * 2;
      totalBytes += bytes;
    }
    
    // Convert to KB for easier reading
    const totalKB = (totalBytes / 1024).toFixed(2);
    
    return {
      available: true,
      bytes: totalBytes,
      kilobytes: totalKB,
      itemCount: itemCount
    };
  } catch (error) {
    console.error('Error calculating storage usage:', error);
    return { available: false, error: error.message };
  }
}

/**
 * ----------------------------------------
 * 5. Module Utility Functions
 * ----------------------------------------
 */

/**
 * Checks if a module is available
 * 
 * @param {string} moduleName - Name of the module to check
 * @returns {boolean} - Whether the module is available
 */
function isModuleAvailable(moduleName) {
  return typeof window[moduleName] !== 'undefined';
}

/**
 * Safely calls a module function if available
 * 
 * @param {string} moduleName - Name of the module
 * @param {string} functionName - Name of the function to call
 * @param {Array} args - Arguments to pass to the function
 * @returns {any} - Result of the function call or null if not available
 */
function callModuleFunction(moduleName, functionName, args = []) {
  if (!isModuleAvailable(moduleName)) return null;
  
  try {
    if (typeof window[moduleName][functionName] === 'function') {
      return window[moduleName][functionName](...args);
    }
  } catch (error) {
    console.error(`Error calling ${moduleName}.${functionName}:`, error);
  }
  
  return null;
}

/**
 * Dispatches a standardized custom event
 * 
 * @param {string} eventName - Name of the event
 * @param {Object} detail - Event details
 */
function dispatchCustomEvent(eventName, detail = {}) {
  try {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
    console.log(`Dispatched ${eventName} event:`, detail);
  } catch (error) {
    console.error(`Error dispatching ${eventName} event:`, error);
  }
}

/**
 * Registers an event listener for custom events
 * 
 * @param {string} eventName - Name of the event
 * @param {Function} callback - Callback function
 */
function listenForCustomEvent(eventName, callback) {
  document.addEventListener(eventName, function(event) {
    try {
      callback(event.detail);
    } catch (error) {
      console.error(`Error in ${eventName} event handler:`, error);
    }
  });
}

/**
 * ----------------------------------------
 * 6. Module Initialization Function
 * ----------------------------------------
 */

/**
 * Initializes all core modules on page load
 */
function initModules() {
  // Initialize progress tracking module if available
  if (isModuleAvailable('ProgressTrackingModule')) {
    // The specific initialization is typically done in page-specific code
    console.log('ProgressTrackingModule available and ready for initialization');
  }
  
  // Initialize activity navigation module if available
  if (isModuleAvailable('ActivityNavModule')) {
    console.log('ActivityNavModule available and ready for initialization');
  }
  
  // Check and log modules availability for debugging
  if (window.location.search.includes('debug=true')) {
    logModulesStatus();
  }
}

/**
 * Logs the status of all modules for debugging
 */
function logModulesStatus() {
  console.group('Modules Status');
  console.log('ProgressTrackingModule:', isModuleAvailable('ProgressTrackingModule') ? 'Available' : 'Not Available');
  console.log('ActivityNavModule:', isModuleAvailable('ActivityNavModule') ? 'Available' : 'Not Available');
  console.log('MCQModule:', isModuleAvailable('MCQModule') ? 'Available' : 'Not Available');
  console.groupEnd();
}

/**
 * Migrates progress data from old format to new format
 * Should be called once when the new system is deployed
 */
function migrateProgressData() {
  if (getFromLocalStorage('migration-completed')) return;
  
  console.log('Starting progress data migration...');
  
  try {
    // Find all old activity progress items
    let migratedCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.endsWith('-progress')) {
        try {
          const oldData = JSON.parse(localStorage.getItem(key));
          const activityId = key.replace('-progress', '');
          
          // Convert to new format if the ProgressTrackingModule is available
          if (oldData && oldData.completed && isModuleAvailable('ProgressTrackingModule')) {
            callModuleFunction('ProgressTrackingModule', 'markItemCompleted', [
              'activities', 
              activityId, 
              {
                score: oldData.score || null,
                maxScore: oldData.maxScore || null,
                title: oldData.title || activityId
              }
            ]);
            migratedCount++;
          }
        } catch (e) {
          console.warn(`Could not migrate data for ${key}:`, e);
        }
      }
    }
    
    console.log(`Migration completed. Migrated ${migratedCount} activities.`);
    
    // Mark migration as complete
    saveToLocalStorage('migration-completed', true);
    return true;
  } catch (error) {
    console.error('Error during progress data migration:', error);
    return false;
  }
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
    getLocalStorageKeys,
    showFeedbackMessage,
    createAccessibleTabs,
    smoothScrollTo,
    debounce,
    addEventListenerToAll,
    initCollapsibleSections,
    initActiveNavLink,
    logStorageStatus,
    calculateStorageUsage,
    // New module utility functions
    isModuleAvailable,
    callModuleFunction,
    dispatchCustomEvent,
    listenForCustomEvent,
    initModules,
    logModulesStatus,
    migrateProgressData
  };
}