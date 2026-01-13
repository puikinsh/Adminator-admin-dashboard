/**
 * Adminator Performance Utilities
 * Provides ResizeObserver, IntersectionObserver, and lazy loading utilities
 *
 * @module utils/performance
 */

/**
 * Store for ResizeObserver instances
 * @type {WeakMap<Element, Function>}
 */
const resizeCallbacks = new WeakMap();

/**
 * Shared ResizeObserver instance for efficiency
 * @type {ResizeObserver|null}
 */
let sharedResizeObserver = null;

/**
 * Store for IntersectionObserver callbacks
 * @type {WeakMap<Element, Function>}
 */
const intersectionCallbacks = new WeakMap();

/**
 * Map of IntersectionObservers by threshold
 * @type {Map<string, IntersectionObserver>}
 */
const intersectionObservers = new Map();

/**
 * Performance utilities namespace
 * @namespace
 */
const Performance = {
  /**
   * Observe element resize events efficiently
   * Uses shared ResizeObserver for better performance
   *
   * @param {Element} element - Element to observe
   * @param {Function} callback - Callback receiving { width, height, entry }
   * @returns {Function} Cleanup function to stop observing
   *
   * @example
   * const unobserve = Performance.onResize(chart, ({ width, height }) => {
   *   chart.resize(width, height);
   * });
   */
  onResize(element, callback) {
    if (!element || typeof callback !== 'function') {
      return () => {};
    }

    // Create shared observer if needed
    if (!sharedResizeObserver) {
      sharedResizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const cb = resizeCallbacks.get(entry.target);
          if (cb) {
            const { width, height } = entry.contentRect;
            cb({ width, height, entry });
          }
        }
      });
    }

    // Store callback and observe
    resizeCallbacks.set(element, callback);
    sharedResizeObserver.observe(element);

    // Return cleanup function
    return () => {
      resizeCallbacks.delete(element);
      sharedResizeObserver?.unobserve(element);
    };
  },

  /**
   * Observe when element enters/exits viewport
   * Useful for lazy loading and animations
   *
   * @param {Element} element - Element to observe
   * @param {Function} callback - Callback receiving { isIntersecting, entry }
   * @param {Object} [options={}] - IntersectionObserver options
   * @param {number} [options.threshold=0] - Visibility threshold (0-1)
   * @param {string} [options.rootMargin='0px'] - Root margin
   * @returns {Function} Cleanup function to stop observing
   *
   * @example
   * const unobserve = Performance.onVisible(element, ({ isIntersecting }) => {
   *   if (isIntersecting) {
   *     loadContent();
   *     unobserve(); // Stop after first trigger
   *   }
   * });
   */
  onVisible(element, callback, options = {}) {
    if (!element || typeof callback !== 'function') {
      return () => {};
    }

    const { threshold = 0, rootMargin = '0px' } = options;
    const key = `${threshold}-${rootMargin}`;

    // Get or create observer for this threshold
    if (!intersectionObservers.has(key)) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const cb = intersectionCallbacks.get(entry.target);
            if (cb) {
              cb({
                isIntersecting: entry.isIntersecting,
                ratio: entry.intersectionRatio,
                entry,
              });
            }
          }
        },
        { threshold, rootMargin }
      );
      intersectionObservers.set(key, observer);
    }

    const observer = intersectionObservers.get(key);

    // Store callback and observe
    intersectionCallbacks.set(element, callback);
    observer.observe(element);

    // Return cleanup function
    return () => {
      intersectionCallbacks.delete(element);
      observer.unobserve(element);
    };
  },

  /**
   * Lazy load an element when it becomes visible
   * Automatically handles cleanup after loading
   *
   * @param {Element} element - Element to lazy load
   * @param {Function} loadFn - Function to call when visible
   * @param {Object} [options={}] - Options
   * @param {string} [options.rootMargin='100px'] - Preload margin
   * @returns {Function} Cleanup function
   *
   * @example
   * Performance.lazyLoad(chartContainer, () => {
   *   initializeChart(chartContainer);
   * });
   */
  lazyLoad(element, loadFn, options = {}) {
    const { rootMargin = '100px' } = options;
    let loaded = false;

    const unobserve = this.onVisible(
      element,
      ({ isIntersecting }) => {
        if (isIntersecting && !loaded) {
          loaded = true;
          loadFn();
          unobserve();
        }
      },
      { rootMargin }
    );

    return unobserve;
  },

  /**
   * Batch DOM reads and writes to prevent layout thrashing
   *
   * @param {Function} readFn - Function that reads from DOM
   * @param {Function} writeFn - Function that writes to DOM
   *
   * @example
   * Performance.batch(
   *   () => element.offsetHeight, // Read
   *   (height) => element.style.minHeight = height + 'px' // Write
   * );
   */
  batch(readFn, writeFn) {
    // Use requestAnimationFrame for batching
    requestAnimationFrame(() => {
      const value = readFn();
      requestAnimationFrame(() => {
        writeFn(value);
      });
    });
  },

  /**
   * Execute callback on next animation frame
   *
   * @param {Function} callback - Function to execute
   * @returns {number} Request ID for cancellation
   *
   * @example
   * const id = Performance.nextFrame(() => updateUI());
   * // Cancel: cancelAnimationFrame(id);
   */
  nextFrame(callback) {
    return requestAnimationFrame(callback);
  },

  /**
   * Execute callback when browser is idle
   * Falls back to setTimeout if requestIdleCallback not available
   *
   * @param {Function} callback - Function to execute
   * @param {Object} [options={}] - Options
   * @param {number} [options.timeout=1000] - Maximum wait time
   * @returns {number} Request ID for cancellation
   *
   * @example
   * Performance.whenIdle(() => {
   *   // Non-critical work
   *   preloadNextPage();
   * });
   */
  whenIdle(callback, options = {}) {
    const { timeout = 1000 } = options;

    if ('requestIdleCallback' in window) {
      return requestIdleCallback(callback, { timeout });
    }

    // Fallback for Safari
    return setTimeout(callback, 1);
  },

  /**
   * Cancel an idle callback
   *
   * @param {number} id - Request ID from whenIdle
   */
  cancelIdle(id) {
    if ('cancelIdleCallback' in window) {
      cancelIdleCallback(id);
    } else {
      clearTimeout(id);
    }
  },

  /**
   * Preload a resource (image, script, etc.)
   *
   * @param {string} url - URL to preload
   * @param {string} [as='image'] - Resource type (image, script, style, font)
   * @returns {Promise<void>} Resolves when loaded
   *
   * @example
   * await Performance.preload('/images/hero.jpg', 'image');
   */
  preload(url, as = 'image') {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = as;
      link.href = url;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  },

  /**
   * Measure execution time of a function
   *
   * @param {string} label - Label for the measurement
   * @param {Function} fn - Function to measure
   * @returns {*} Return value of the function
   *
   * @example
   * const result = Performance.measure('render', () => renderChart());
   */
  measure(label, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Adminator] ${label}: ${(end - start).toFixed(2)}ms`);
    }

    return result;
  },

  /**
   * Cleanup all observers
   * Call this when destroying the app
   */
  cleanup() {
    // Cleanup resize observer
    if (sharedResizeObserver) {
      sharedResizeObserver.disconnect();
      sharedResizeObserver = null;
    }

    // Cleanup intersection observers
    for (const observer of intersectionObservers.values()) {
      observer.disconnect();
    }
    intersectionObservers.clear();
  },
};

export default Performance;
