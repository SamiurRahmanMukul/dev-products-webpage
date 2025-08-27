/**
 * ========================================
 * DEV PRODUCTS WEBPAGE - MAIN JAVASCRIPT
 * ========================================
 *
 * Organized JavaScript modules for:
 * - Mobile Menu Management
 * - Page Animations & Effects
 * - User Interactions
 * - Performance Optimizations
 */

// ========================================
// CONFIGURATION & CONSTANTS
// ========================================

const CONFIG = {
  // Animation Timings
  ANIMATION_DELAY: 100,
  CARD_ANIMATION_DURATION: 600,

  // Breakpoints
  MOBILE_BREAKPOINT: 768,

  // Performance Settings
  ENABLE_PARALLAX_ON_MOBILE: false,
  PARALLAX_SPEED: 0.5,

  // Selectors
  SELECTORS: {
    mobileMenuButton: "#mobile-menu-button",
    mobileMenuClose: "#mobile-menu-close",
    mobileMenu: "#mobile-menu",
    mobileMenuLinks: ".mobile-menu-link",
    glassCards: ".glass-card",
    anchorLinks: 'a[href^="#"]',
    stars: ".stars",
  },
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Utility functions for common operations
 */
const Utils = {
  /**
   * Check if device is mobile based on screen width
   * @returns {boolean}
   */
  isMobile() {
    return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
  },

  /**
   * Debounce function to limit function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function}
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Get element by selector with error handling
   * @param {string} selector - CSS selector
   * @returns {Element|null}
   */
  getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
      console.warn(`Element not found: ${selector}`);
    }
    return element;
  },

  /**
   * Get elements by selector with error handling
   * @param {string} selector - CSS selector
   * @returns {NodeList}
   */
  getElements(selector) {
    return document.querySelectorAll(selector);
  },
};

// ========================================
// MOBILE MENU MODULE
// ========================================

/**
 * Mobile Menu Management
 * Handles all mobile menu interactions and state management
 */
const MobileMenu = {
  // DOM Elements
  button: null,
  closeButton: null,
  menu: null,
  links: null,

  /**
   * Initialize mobile menu functionality
   */
  init() {
    this.cacheDOMElements();
    this.bindEvents();
    this.setupInitialState();
  },

  /**
   * Cache DOM elements for better performance
   */
  cacheDOMElements() {
    this.button = Utils.getElement(CONFIG.SELECTORS.mobileMenuButton);
    this.closeButton = Utils.getElement(CONFIG.SELECTORS.mobileMenuClose);
    this.menu = Utils.getElement(CONFIG.SELECTORS.mobileMenu);
    this.links = Utils.getElements(CONFIG.SELECTORS.mobileMenuLinks);
  },

  /**
   * Bind all event listeners
   */
  bindEvents() {
    if (!this.button || !this.menu) return;

    // Menu toggle button
    this.button.addEventListener("click", () => this.toggle());

    // Close button
    if (this.closeButton) {
      this.closeButton.addEventListener("click", () => this.close());
    }

    // Menu links
    this.links.forEach((link) => {
      link.addEventListener("click", () => this.close());
    });

    // Outside click handler
    document.addEventListener("click", (e) => this.handleOutsideClick(e));

    // Overlay click handler
    this.menu.addEventListener("click", (e) => this.handleOverlayClick(e));

    // Window resize handler
    window.addEventListener(
      "resize",
      Utils.debounce(() => this.handleResize(), 250)
    );
  },

  /**
   * Setup initial state
   */
  setupInitialState() {
    // Ensure body can scroll by default
    document.body.style.overflow = "auto";
  },

  /**
   * Toggle mobile menu open/closed
   */
  toggle() {
    if (!this.menu || !this.button) return;

    const isActive = this.menu.classList.contains("active");

    if (isActive) {
      this.close();
    } else {
      this.open();
    }
  },

  /**
   * Open mobile menu
   */
  open() {
    if (!this.menu || !this.button) return;

    this.menu.classList.add("active");
    this.button.classList.add("active");
    document.body.style.overflow = "hidden";
  },

  /**
   * Close mobile menu
   */
  close() {
    if (!this.menu || !this.button) return;

    this.menu.classList.remove("active");
    this.button.classList.remove("active");
    document.body.style.overflow = "auto";
  },

  /**
   * Handle clicks outside the menu
   * @param {Event} e - Click event
   */
  handleOutsideClick(e) {
    if (!this.menu || !this.button) return;

    if (this.menu.classList.contains("active")) {
      const isClickInsideMenu = this.menu.contains(e.target);
      const isClickOnMenuButton = this.button.contains(e.target);

      if (!isClickInsideMenu && !isClickOnMenuButton) {
        this.close();
      }
    }
  },

  /**
   * Handle clicks on menu overlay
   * @param {Event} e - Click event
   */
  handleOverlayClick(e) {
    // Only close if clicking on the overlay itself, not the content
    if (e.target === this.menu) {
      this.close();
    }
  },

  /**
   * Handle window resize
   */
  handleResize() {
    // Close menu on desktop breakpoint
    if (window.innerWidth >= CONFIG.MOBILE_BREAKPOINT) {
      this.close();
    }
  },
};

// ========================================
// ANIMATIONS MODULE
// ========================================

/**
 * Page Animations and Visual Effects
 * Handles loading animations, transitions, and visual feedback
 */
const Animations = {
  /**
   * Initialize all animations
   */
  init() {
    this.setupLoadingAnimations();
    this.setupParallaxEffect();
  },

  /**
   * Setup card loading animations
   */
  setupLoadingAnimations() {
    window.addEventListener("load", () => {
      const cards = Utils.getElements(CONFIG.SELECTORS.glassCards);

      cards.forEach((card, index) => {
        setTimeout(() => {
          // Set initial state
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          card.style.transition = `all ${CONFIG.CARD_ANIMATION_DURATION}ms ease`;

          // Animate to final state
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 100);
        }, index * CONFIG.ANIMATION_DELAY);
      });
    });
  },

  /**
   * Setup parallax scrolling effect
   */
  setupParallaxEffect() {
    // Only enable on desktop for performance
    if (Utils.isMobile() && !CONFIG.ENABLE_PARALLAX_ON_MOBILE) {
      return;
    }

    const starsElement = Utils.getElement(CONFIG.SELECTORS.stars);
    if (!starsElement) return;

    const handleScroll = Utils.debounce(() => {
      const scrolled = window.pageYOffset;
      const speed = scrolled * CONFIG.PARALLAX_SPEED;
      starsElement.style.transform = `translateY(${speed}px)`;
    }, 16); // ~60fps

    window.addEventListener("scroll", handleScroll, { passive: true });
  },
};

// ========================================
// NAVIGATION MODULE
// ========================================

/**
 * Navigation and Scrolling Behavior
 * Handles smooth scrolling and navigation interactions
 */
const Navigation = {
  /**
   * Initialize navigation functionality
   */
  init() {
    this.setupSmoothScrolling();
  },

  /**
   * Setup smooth scrolling for anchor links
   */
  setupSmoothScrolling() {
    const anchorLinks = Utils.getElements(CONFIG.SELECTORS.anchorLinks);

    anchorLinks.forEach((anchor) => {
      anchor.addEventListener("click", (e) => this.handleAnchorClick(e, anchor));
    });
  },

  /**
   * Handle anchor link clicks
   * @param {Event} e - Click event
   * @param {Element} anchor - Anchor element
   */
  handleAnchorClick(e, anchor) {
    e.preventDefault();

    const targetId = anchor.getAttribute("href");
    const target = document.querySelector(targetId);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  },
};

// ========================================
// PERFORMANCE MODULE
// ========================================

/**
 * Performance Optimizations
 * Handles performance-related functionality and monitoring
 */
const Performance = {
  /**
   * Initialize performance optimizations
   */
  init() {
    this.setupIntersectionObserver();
    this.preloadCriticalResources();
  },

  /**
   * Setup Intersection Observer for lazy loading and animations
   */
  setupIntersectionObserver() {
    if (!("IntersectionObserver" in window)) {
      return; // Fallback for older browsers
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    // Observe cards for scroll-triggered animations
    const cards = Utils.getElements(CONFIG.SELECTORS.glassCards);
    cards.forEach((card) => observer.observe(card));
  },

  /**
   * Preload critical resources
   */
  preloadCriticalResources() {
    // Add any critical resource preloading here
    // For example: fonts, critical images, etc.
  },
};

// ========================================
// ERROR HANDLING MODULE
// ========================================

/**
 * Error Handling and Logging
 * Centralized error handling and user feedback
 */
const ErrorHandler = {
  /**
   * Initialize error handling
   */
  init() {
    this.setupGlobalErrorHandler();
  },

  /**
   * Setup global error handler
   */
  setupGlobalErrorHandler() {
    window.addEventListener("error", (e) => {
      console.error("JavaScript Error:", e.error);
      // Add user-friendly error handling here if needed
    });

    window.addEventListener("unhandledrejection", (e) => {
      console.error("Unhandled Promise Rejection:", e.reason);
      // Add user-friendly error handling here if needed
    });
  },
};

// ========================================
// MAIN APPLICATION
// ========================================

/**
 * Main Application Controller
 * Orchestrates all modules and handles initialization
 */
const App = {
  /**
   * Initialize the entire application
   */
  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.start());
    } else {
      this.start();
    }
  },

  /**
   * Start all application modules
   */
  start() {
    try {
      // Initialize all modules
      ErrorHandler.init();
      MobileMenu.init();
      Animations.init();
      Navigation.init();
      Performance.init();
    } catch (error) {
      console.error("❌ Failed to initialize Dev Products Webpage:", error);
    }
  },
};

// ========================================
// APPLICATION STARTUP
// ========================================

// Initialize the application
App.init();
