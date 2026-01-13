/**
 * Adminator Storage Utilities
 * Safe localStorage wrapper with error handling
 *
 * @module utils/storage
 */

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
const isAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * In-memory fallback when localStorage is unavailable
 * @type {Map<string, string>}
 */
const memoryStorage = new Map();

/**
 * Storage utility with safe localStorage access
 * Falls back to in-memory storage when localStorage is unavailable
 * (e.g., private browsing, storage quota exceeded)
 *
 * @namespace
 */
const Storage = {
  /**
   * Check if storage is available
   * @returns {boolean}
   */
  isAvailable,

  /**
   * Get an item from storage
   *
   * @param {string} key - Storage key
   * @returns {string|null} Stored value or null
   *
   * @example
   * const theme = Storage.get('theme');
   */
  get(key) {
    try {
      if (isAvailable()) {
        return localStorage.getItem(key);
      }
      return memoryStorage.get(key) ?? null;
    } catch {
      return memoryStorage.get(key) ?? null;
    }
  },

  /**
   * Set an item in storage
   *
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   * @returns {boolean} Success status
   *
   * @example
   * Storage.set('theme', 'dark');
   */
  set(key, value) {
    try {
      if (isAvailable()) {
        localStorage.setItem(key, value);
        return true;
      }
      memoryStorage.set(key, value);
      return true;
    } catch {
      // Fallback to memory storage
      memoryStorage.set(key, value);
      return true;
    }
  },

  /**
   * Remove an item from storage
   *
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   *
   * @example
   * Storage.remove('theme');
   */
  remove(key) {
    try {
      if (isAvailable()) {
        localStorage.removeItem(key);
      }
      memoryStorage.delete(key);
      return true;
    } catch {
      memoryStorage.delete(key);
      return true;
    }
  },

  /**
   * Clear all storage
   *
   * @returns {boolean} Success status
   *
   * @example
   * Storage.clear();
   */
  clear() {
    try {
      if (isAvailable()) {
        localStorage.clear();
      }
      memoryStorage.clear();
      return true;
    } catch {
      memoryStorage.clear();
      return true;
    }
  },

  /**
   * Get a JSON object from storage
   *
   * @param {string} key - Storage key
   * @param {*} [defaultValue=null] - Default value if key doesn't exist or parse fails
   * @returns {*} Parsed object or default value
   *
   * @example
   * const settings = Storage.getJSON('settings', { theme: 'light' });
   */
  getJSON(key, defaultValue = null) {
    try {
      const value = this.get(key);
      if (value === null) {
        return defaultValue;
      }
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  },

  /**
   * Set a JSON object in storage
   *
   * @param {string} key - Storage key
   * @param {*} value - Value to store (will be JSON stringified)
   * @returns {boolean} Success status
   *
   * @example
   * Storage.setJSON('settings', { theme: 'dark', sidebar: 'expanded' });
   */
  setJSON(key, value) {
    try {
      return this.set(key, JSON.stringify(value));
    } catch {
      return false;
    }
  },

  /**
   * Check if a key exists in storage
   *
   * @param {string} key - Storage key
   * @returns {boolean}
   *
   * @example
   * if (Storage.has('theme')) {
   *   // Use stored theme
   * }
   */
  has(key) {
    return this.get(key) !== null;
  },

  /**
   * Get all keys in storage
   *
   * @returns {string[]} Array of keys
   *
   * @example
   * const keys = Storage.keys();
   */
  keys() {
    try {
      if (isAvailable()) {
        return Object.keys(localStorage);
      }
      return Array.from(memoryStorage.keys());
    } catch {
      return Array.from(memoryStorage.keys());
    }
  },

  /**
   * Get storage size in bytes (approximate)
   *
   * @returns {number} Size in bytes
   *
   * @example
   * console.log(`Storage used: ${Storage.size()} bytes`);
   */
  size() {
    try {
      let total = 0;
      const keys = this.keys();
      for (const key of keys) {
        const value = this.get(key);
        if (value) {
          total += key.length + value.length;
        }
      }
      return total * 2; // UTF-16 uses 2 bytes per character
    } catch {
      return 0;
    }
  },
};

export default Storage;
