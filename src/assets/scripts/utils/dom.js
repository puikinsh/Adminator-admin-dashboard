/**
 * DOM Utility Functions
 * Provides jQuery-like functionality using vanilla JavaScript
 */

export const DOM = {
  /**
   * Select single element (replaces $('selector'))
   */
  select: (selector, context = document) => {
    return context.querySelector(selector);
  },

  /**
   * Select multiple elements (replaces $('selector'))
   */
  selectAll: (selector, context = document) => {
    return Array.from(context.querySelectorAll(selector));
  },

  /**
   * Check if element exists
   */
  exists: (selector) => {
    return document.querySelector(selector) !== null;
  },

  /**
   * Add event listener (replaces $.on())
   */
  on: (element, event, handler, options = {}) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.addEventListener(event, handler, options);
    }
  },

  /**
   * Remove event listener (replaces $.off())
   */
  off: (element, event, handler) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.removeEventListener(event, handler);
    }
  },

  /**
   * Add class (replaces $.addClass())
   */
  addClass: (element, className) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.classList.add(className);
    }
  },

  /**
   * Remove class (replaces $.removeClass())
   */
  removeClass: (element, className) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.classList.remove(className);
    }
  },

  /**
   * Toggle class (replaces $.toggleClass())
   */
  toggleClass: (element, className) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.classList.toggle(className);
    }
  },

  /**
   * Check if element has class (replaces $.hasClass())
   */
  hasClass: (element, className) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    return element ? element.classList.contains(className) : false;
  },

  /**
   * Get/Set attribute (replaces $.attr())
   */
  attr: (element, name, value) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return null;

    if (value === undefined) {
      return element.getAttribute(name);
    } else {
      element.setAttribute(name, value);
      return element;
    }
  },

  /**
   * Get/Set data attribute (replaces $.data())
   */
  data: (element, name, value) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return null;

    const dataName = `data-${name}`;
    
    if (value === undefined) {
      return element.getAttribute(dataName);
    } else {
      element.setAttribute(dataName, value);
      return element;
    }
  },

  /**
   * Get/Set text content (replaces $.text())
   */
  text: (element, content) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return null;

    if (content === undefined) {
      return element.textContent;
    } else {
      element.textContent = content;
      return element;
    }
  },

  /**
   * Get/Set HTML content (replaces $.html())
   */
  html: (element, content) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return null;

    if (content === undefined) {
      return element.innerHTML;
    } else {
      element.innerHTML = content;
      return element;
    }
  },

  /**
   * Hide element (replaces $.hide())
   */
  hide: (element) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.style.display = 'none';
    }
  },

  /**
   * Show element (replaces $.show())
   */
  show: (element, display = 'block') => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      element.style.display = display;
    }
  },

  /**
   * Toggle visibility (replaces $.toggle())
   */
  toggle: (element, display = 'block') => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (element) {
      if (element.style.display === 'none') {
        element.style.display = display;
      } else {
        element.style.display = 'none';
      }
    }
  },

  /**
   * Slide up animation (replaces $.slideUp())
   */
  slideUp: (element, duration = 300) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      const height = element.scrollHeight;
      element.style.height = `${height}px`;
      element.style.overflow = 'hidden';
      
      element.animate([
        { height: `${height}px` },
        { height: '0px' },
      ], {
        duration,
        easing: 'ease-in-out',
      }).onfinish = () => {
        element.style.display = 'none';
        element.style.height = '';
        element.style.overflow = '';
        resolve();
      };
    });
  },

  /**
   * Slide down animation (replaces $.slideDown())
   */
  slideDown: (element, duration = 300) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      element.style.display = 'block';
      element.style.height = '0px';
      element.style.overflow = 'hidden';
      
      const height = element.scrollHeight;
      
      element.animate([
        { height: '0px' },
        { height: `${height}px` },
      ], {
        duration,
        easing: 'ease-in-out',
      }).onfinish = () => {
        element.style.height = 'auto';
        element.style.overflow = 'visible';
        resolve();
      };
    });
  },

  /**
   * Fade in animation (replaces $.fadeIn())
   */
  fadeIn: (element, duration = 300) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      element.style.opacity = '0';
      element.style.display = 'block';
      
      element.animate([
        { opacity: 0 },
        { opacity: 1 },
      ], {
        duration,
        easing: 'ease-in-out',
      }).onfinish = () => {
        element.style.opacity = '';
        resolve();
      };
    });
  },

  /**
   * Fade out animation (replaces $.fadeOut())
   */
  fadeOut: (element, duration = 300) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return Promise.resolve();

    return new Promise((resolve) => {
      element.animate([
        { opacity: 1 },
        { opacity: 0 },
      ], {
        duration,
        easing: 'ease-in-out',
      }).onfinish = () => {
        element.style.display = 'none';
        element.style.opacity = '';
        resolve();
      };
    });
  },

  /**
   * Get element dimensions and position
   */
  dimensions: (element) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
    };
  },

  /**
   * Wait for DOM to be ready (replaces $(document).ready())
   */
  ready: (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  },
};

export default DOM; 