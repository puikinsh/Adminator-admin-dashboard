/**
 * Adminator Logger Utility
 * Development-only logging utility for debugging
 *
 * @module utils/logger
 */

/**
 * Check if we're in development mode
 * @returns {boolean}
 */
const isDev = () => {
  try {
    return process.env.NODE_ENV === 'development' ||
           window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1';
  } catch {
    return false;
  }
};

/**
 * Logger object with development-only output
 * All methods are no-ops in production for zero overhead
 */
const Logger = {
  /**
   * Log informational messages (development only)
   * @param {string} message - The message to log
   * @param {Object} [context] - Additional context data
   */
  info(message, context) {
    if (isDev()) {
      console.info(`[Adminator] ${message}`, context || '');
    }
  },

  /**
   * Log warning messages (development only)
   * @param {string} message - The warning message
   * @param {Object} [context] - Additional context data
   */
  warn(message, context) {
    if (isDev()) {
      console.warn(`[Adminator] ${message}`, context || '');
    }
  },

  /**
   * Log error messages (development only)
   * @param {string} message - The error message
   * @param {Error|Object} [context] - Error object or context data
   */
  error(message, context) {
    if (isDev()) {
      console.error(`[Adminator] ${message}`, context || '');
    }
  },

  /**
   * Log debug messages (development only)
   * @param {string} message - The debug message
   * @param {Object} [context] - Additional context data
   */
  debug(message, context) {
    if (isDev()) {
      console.debug(`[Adminator] ${message}`, context || '');
    }
  },

  /**
   * Group related log messages (development only)
   * @param {string} label - Group label
   */
  group(label) {
    if (isDev()) {
      console.group(`[Adminator] ${label}`);
    }
  },

  /**
   * End a log group (development only)
   */
  groupEnd() {
    if (isDev()) {
      console.groupEnd();
    }
  },

  /**
   * Log with timing information (development only)
   * @param {string} label - Timer label
   */
  time(label) {
    if (isDev()) {
      console.time(`[Adminator] ${label}`);
    }
  },

  /**
   * End timing and log result (development only)
   * @param {string} label - Timer label (must match time() call)
   */
  timeEnd(label) {
    if (isDev()) {
      console.timeEnd(`[Adminator] ${label}`);
    }
  },

  /**
   * Log a table of data (development only)
   * @param {Array|Object} data - Data to display as table
   */
  table(data) {
    if (isDev()) {
      console.table(data);
    }
  },
};

export default Logger;
