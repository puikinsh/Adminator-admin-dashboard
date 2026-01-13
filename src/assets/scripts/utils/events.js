/**
 * Adminator Event Utilities
 * Provides efficient event handling with delegation and cleanup
 *
 * @module utils/events
 */

/**
 * Store for event handlers to enable proper cleanup
 * @type {WeakMap<Element, Map<string, Set<Function>>>}
 */
const handlerRegistry = new WeakMap();

/**
 * Store for AbortControllers to enable easy cleanup
 * @type {WeakMap<Element, AbortController>}
 */
const controllerRegistry = new WeakMap();

/**
 * Event utilities namespace
 * @namespace
 */
const Events = {
  /**
   * Add an event listener with automatic cleanup support
   * Uses AbortController for efficient removal
   *
   * @param {Element} element - Target element
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   * @param {Object} [options={}] - Event listener options
   * @returns {Function} Cleanup function to remove the listener
   *
   * @example
   * const cleanup = Events.on(button, 'click', handleClick);
   * // Later: cleanup() to remove
   */
  on(element, event, handler, options = {}) {
    if (!element) return () => {};

    // Get or create AbortController for this element
    let controller = controllerRegistry.get(element);
    if (!controller) {
      controller = new AbortController();
      controllerRegistry.set(element, controller);
    }

    // Register handler
    if (!handlerRegistry.has(element)) {
      handlerRegistry.set(element, new Map());
    }
    const elementHandlers = handlerRegistry.get(element);
    if (!elementHandlers.has(event)) {
      elementHandlers.set(event, new Set());
    }
    elementHandlers.get(event).add(handler);

    // Add listener with abort signal
    element.addEventListener(event, handler, {
      ...options,
      signal: controller.signal,
    });

    // Return cleanup function
    return () => {
      element.removeEventListener(event, handler, options);
      const handlers = handlerRegistry.get(element)?.get(event);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  },

  /**
   * Remove all event listeners from an element
   *
   * @param {Element} element - Target element
   *
   * @example
   * Events.off(element); // Removes all listeners
   */
  off(element) {
    if (!element) return;

    const controller = controllerRegistry.get(element);
    if (controller) {
      controller.abort();
      controllerRegistry.delete(element);
    }
    handlerRegistry.delete(element);
  },

  /**
   * Add event delegation - listen on parent for events from children
   * More efficient than adding listeners to many elements
   *
   * @param {Element} parent - Parent element to listen on
   * @param {string} event - Event type
   * @param {string} selector - CSS selector for target elements
   * @param {Function} handler - Event handler (receives event and matched element)
   * @param {Object} [options={}] - Event listener options
   * @returns {Function} Cleanup function
   *
   * @example
   * // Instead of adding click to every .btn
   * Events.delegate(container, 'click', '.btn', (e, btn) => {
   *   console.log('Button clicked:', btn);
   * });
   */
  delegate(parent, event, selector, handler, options = {}) {
    if (!parent) return () => {};

    const delegatedHandler = (e) => {
      const target = e.target.closest(selector);
      if (target && parent.contains(target)) {
        handler.call(target, e, target);
      }
    };

    return this.on(parent, event, delegatedHandler, options);
  },

  /**
   * Add a one-time event listener
   *
   * @param {Element} element - Target element
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   * @returns {Function} Cleanup function
   *
   * @example
   * Events.once(button, 'click', handleFirstClick);
   */
  once(element, event, handler) {
    return this.on(element, event, handler, { once: true });
  },

  /**
   * Create a debounced event handler
   *
   * @param {Function} handler - Original handler
   * @param {number} [delay=250] - Debounce delay in ms
   * @returns {Function} Debounced handler
   *
   * @example
   * const debouncedResize = Events.debounce(handleResize, 200);
   * window.addEventListener('resize', debouncedResize);
   */
  debounce(handler, delay = 250) {
    let timeoutId;
    return function debounced(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handler.apply(this, args), delay);
    };
  },

  /**
   * Create a throttled event handler
   *
   * @param {Function} handler - Original handler
   * @param {number} [limit=250] - Throttle limit in ms
   * @returns {Function} Throttled handler
   *
   * @example
   * const throttledScroll = Events.throttle(handleScroll, 100);
   * window.addEventListener('scroll', throttledScroll);
   */
  throttle(handler, limit = 250) {
    let inThrottle;
    return function throttled(...args) {
      if (!inThrottle) {
        handler.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Dispatch a custom event
   *
   * @param {Element|Window} target - Target to dispatch on
   * @param {string} eventName - Event name
   * @param {Object} [detail={}] - Event detail data
   * @param {Object} [options={}] - Event options (bubbles, cancelable)
   * @returns {boolean} Whether the event was not cancelled
   *
   * @example
   * Events.emit(element, 'custom:event', { data: 'value' });
   */
  emit(target, eventName, detail = {}, options = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: options.bubbles ?? true,
      cancelable: options.cancelable ?? true,
    });
    return target.dispatchEvent(event);
  },
};

export default Events;
