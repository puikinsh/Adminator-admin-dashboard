/**
 * Adminator DOM Utility Functions
 * Provides jQuery-like functionality using vanilla JavaScript
 *
 * @module utils/dom
 * @example
 * import { DOM } from './utils/dom';
 *
 * // Select elements
 * const button = DOM.select('.my-button');
 * const items = DOM.selectAll('.list-item');
 *
 * // Add event listeners
 * DOM.on(button, 'click', () => console.log('Clicked!'));
 *
 * // Manipulate classes
 * DOM.addClass(button, 'active');
 * DOM.toggleClass(button, 'loading');
 */

/**
 * DOM utility object providing jQuery-like methods
 * @namespace
 */
export const DOM = {
  /**
   * Select a single element matching the selector
   * Replaces jQuery's $('selector').first()
   *
   * @param {string} selector - CSS selector
   * @param {Document|Element} [context=document] - Context to search within
   * @returns {Element|null} The matched element or null
   *
   * @example
   * const header = DOM.select('.header');
   * const navItem = DOM.select('.nav-item', sidebar);
   */
  select: (selector, context = document) => {
    return context.querySelector(selector);
  },

  /**
   * Select all elements matching the selector
   * Replaces jQuery's $('selector')
   *
   * @param {string} selector - CSS selector
   * @param {Document|Element} [context=document] - Context to search within
   * @returns {Element[]} Array of matched elements
   *
   * @example
   * const buttons = DOM.selectAll('.btn');
   * buttons.forEach(btn => DOM.addClass(btn, 'initialized'));
   */
  selectAll: (selector, context = document) => {
    return Array.from(context.querySelectorAll(selector));
  },

  /**
   * Check if an element matching the selector exists
   *
   * @param {string} selector - CSS selector
   * @returns {boolean} True if element exists
   *
   * @example
   * if (DOM.exists('.sidebar')) {
   *   initSidebar();
   * }
   */
  exists: (selector) => {
    return document.querySelector(selector) !== null;
  },

  /**
   * Add an event listener to an element
   * Replaces jQuery's $.on()
   *
   * @param {Element|string} element - Element or selector
   * @param {string} event - Event name (e.g., 'click', 'change')
   * @param {Function} handler - Event handler function
   * @param {Object} [options={}] - addEventListener options
   *
   * @example
   * DOM.on('.btn', 'click', handleClick);
   * DOM.on(button, 'click', handleClick, { once: true });
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
   * Remove an event listener from an element
   * Replaces jQuery's $.off()
   *
   * @param {Element|string} element - Element or selector
   * @param {string} event - Event name
   * @param {Function} handler - Event handler to remove
   *
   * @example
   * DOM.off(button, 'click', handleClick);
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
   * Add a class to an element
   * Replaces jQuery's $.addClass()
   *
   * @param {Element|string} element - Element or selector
   * @param {string} className - Class name to add
   *
   * @example
   * DOM.addClass('.menu', 'open');
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
   * Remove a class from an element
   * Replaces jQuery's $.removeClass()
   *
   * @param {Element|string} element - Element or selector
   * @param {string} className - Class name to remove
   *
   * @example
   * DOM.removeClass('.menu', 'open');
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
   * Toggle a class on an element
   * Replaces jQuery's $.toggleClass()
   *
   * @param {Element|string} element - Element or selector
   * @param {string} className - Class name to toggle
   *
   * @example
   * DOM.toggleClass('.dropdown', 'show');
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
   * Check if an element has a class
   * Replaces jQuery's $.hasClass()
   *
   * @param {Element|string} element - Element or selector
   * @param {string} className - Class name to check
   * @returns {boolean} True if element has the class
   *
   * @example
   * if (DOM.hasClass('.menu', 'open')) {
   *   closeMenu();
   * }
   */
  hasClass: (element, className) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    return element ? element.classList.contains(className) : false;
  },

  /**
   * Get or set an attribute on an element
   * Replaces jQuery's $.attr()
   *
   * @param {Element|string} element - Element or selector
   * @param {string} name - Attribute name
   * @param {string} [value] - Value to set (omit to get)
   * @returns {string|Element|null} Attribute value when getting, element when setting
   *
   * @example
   * // Get attribute
   * const href = DOM.attr(link, 'href');
   *
   * // Set attribute
   * DOM.attr(link, 'href', '/new-page');
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
   * Get or set a data attribute on an element
   * Replaces jQuery's $.data()
   *
   * @param {Element|string} element - Element or selector
   * @param {string} name - Data attribute name (without 'data-' prefix)
   * @param {string} [value] - Value to set (omit to get)
   * @returns {string|Element|null} Data value when getting, element when setting
   *
   * @example
   * // Get data attribute
   * const id = DOM.data(row, 'id'); // Gets data-id
   *
   * // Set data attribute
   * DOM.data(row, 'id', '123');
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
   * Get or set text content of an element
   * Replaces jQuery's $.text()
   *
   * @param {Element|string} element - Element or selector
   * @param {string} [content] - Text to set (omit to get)
   * @returns {string|Element|null} Text content when getting, element when setting
   *
   * @example
   * const text = DOM.text('.title');
   * DOM.text('.title', 'New Title');
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
   * Get or set HTML content of an element
   * Replaces jQuery's $.html()
   *
   * @param {Element|string} element - Element or selector
   * @param {string} [content] - HTML to set (omit to get)
   * @returns {string|Element|null} HTML content when getting, element when setting
   *
   * @example
   * const html = DOM.html('.container');
   * DOM.html('.container', '<p>New content</p>');
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
   * Hide an element
   * Replaces jQuery's $.hide()
   *
   * @param {Element|string} element - Element or selector
   *
   * @example
   * DOM.hide('.modal');
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
   * Show an element
   * Replaces jQuery's $.show()
   *
   * @param {Element|string} element - Element or selector
   * @param {string} [display='block'] - Display value to use
   *
   * @example
   * DOM.show('.modal');
   * DOM.show('.flex-item', 'flex');
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
   * Toggle element visibility
   * Replaces jQuery's $.toggle()
   *
   * @param {Element|string} element - Element or selector
   * @param {string} [display='block'] - Display value when showing
   *
   * @example
   * DOM.toggle('.menu');
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
   * Animate element sliding up (collapsing)
   * Replaces jQuery's $.slideUp()
   *
   * @param {Element|string} element - Element or selector
   * @param {number} [duration=300] - Animation duration in ms
   * @returns {Promise<void>} Resolves when animation completes
   *
   * @example
   * await DOM.slideUp('.panel');
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
   * Animate element sliding down (expanding)
   * Replaces jQuery's $.slideDown()
   *
   * @param {Element|string} element - Element or selector
   * @param {number} [duration=300] - Animation duration in ms
   * @returns {Promise<void>} Resolves when animation completes
   *
   * @example
   * await DOM.slideDown('.panel');
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
   * Animate element fading in
   * Replaces jQuery's $.fadeIn()
   *
   * @param {Element|string} element - Element or selector
   * @param {number} [duration=300] - Animation duration in ms
   * @returns {Promise<void>} Resolves when animation completes
   *
   * @example
   * await DOM.fadeIn('.modal');
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
   * Animate element fading out
   * Replaces jQuery's $.fadeOut()
   *
   * @param {Element|string} element - Element or selector
   * @param {number} [duration=300] - Animation duration in ms
   * @returns {Promise<void>} Resolves when animation completes
   *
   * @example
   * await DOM.fadeOut('.modal');
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
   * Get element dimensions and position relative to viewport
   *
   * @param {Element|string} element - Element or selector
   * @returns {Object|null} Dimensions object or null
   * @property {number} width - Element width
   * @property {number} height - Element height
   * @property {number} top - Distance from viewport top
   * @property {number} left - Distance from viewport left
   * @property {number} bottom - Distance from viewport bottom
   * @property {number} right - Distance from viewport right
   *
   * @example
   * const { width, height, top, left } = DOM.dimensions('.card');
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
   * Execute callback when DOM is ready
   * Replaces jQuery's $(document).ready()
   *
   * @param {Function} callback - Function to execute when DOM is ready
   *
   * @example
   * DOM.ready(() => {
   *   initApp();
   * });
   */
  ready: (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  },

  /**
   * Create an element with optional attributes and children
   *
   * @param {string} tag - HTML tag name
   * @param {Object} [attrs={}] - Attributes to set
   * @param {Array<Element|string>} [children=[]] - Child elements or text
   * @returns {Element} The created element
   *
   * @example
   * const button = DOM.create('button', { class: 'btn', type: 'submit' }, ['Submit']);
   */
  create: (tag, attrs = {}, children = []) => {
    const el = document.createElement(tag);

    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'class') {
        el.className = value;
      } else if (key.startsWith('data-')) {
        el.setAttribute(key, value);
      } else {
        el[key] = value;
      }
    });

    children.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Element) {
        el.appendChild(child);
      }
    });

    return el;
  },

  /**
   * Find the closest ancestor matching a selector
   *
   * @param {Element|string} element - Element or selector
   * @param {string} selector - Selector to match
   * @returns {Element|null} Closest matching ancestor or null
   *
   * @example
   * const form = DOM.closest(input, 'form');
   */
  closest: (element, selector) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    return element ? element.closest(selector) : null;
  },
};

export default DOM;
