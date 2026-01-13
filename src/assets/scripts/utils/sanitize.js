/**
 * Adminator Sanitization Utilities
 * HTML and input sanitization for security
 *
 * @module utils/sanitize
 */

/**
 * HTML entities map for encoding
 * @type {Object<string, string>}
 */
const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Sanitization utilities namespace
 * @namespace
 */
const Sanitize = {
  /**
   * Escape HTML entities to prevent XSS
   *
   * @param {string} str - String to escape
   * @returns {string} Escaped string safe for HTML insertion
   *
   * @example
   * const safe = Sanitize.html('<script>alert("xss")</script>');
   * // Returns: &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;
   */
  html(str) {
    if (typeof str !== 'string') {
      return String(str ?? '');
    }
    return str.replace(/[&<>"'`=/]/g, char => HTML_ENTITIES[char]);
  },

  /**
   * Escape string for use in HTML attributes
   *
   * @param {string} str - String to escape
   * @returns {string} Escaped string safe for attribute values
   *
   * @example
   * element.setAttribute('data-name', Sanitize.attr(userInput));
   */
  attr(str) {
    return this.html(str);
  },

  /**
   * Sanitize URL to prevent javascript: and data: URLs
   *
   * @param {string} url - URL to sanitize
   * @param {string[]} [allowedProtocols=['http:', 'https:', 'mailto:', 'tel:']] - Allowed protocols
   * @returns {string} Sanitized URL or empty string if invalid
   *
   * @example
   * const safeUrl = Sanitize.url(userProvidedUrl);
   * if (safeUrl) {
   *   window.location.href = safeUrl;
   * }
   */
  url(url, allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:']) {
    if (typeof url !== 'string') {
      return '';
    }

    // Trim and normalize
    const trimmed = url.trim().toLowerCase();

    // Block dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
    for (const protocol of dangerousProtocols) {
      if (trimmed.startsWith(protocol)) {
        return '';
      }
    }

    // Check for allowed protocols
    try {
      const parsed = new URL(url, window.location.origin);
      if (!allowedProtocols.includes(parsed.protocol)) {
        // Allow relative URLs
        if (!url.startsWith('/') && !url.startsWith('./') && !url.startsWith('../')) {
          return '';
        }
      }
      return url;
    } catch {
      // If URL parsing fails, check if it's a relative URL
      if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../') || url.startsWith('#')) {
        return url;
      }
      return '';
    }
  },

  /**
   * Strip HTML tags from a string
   *
   * @param {string} str - String with HTML
   * @returns {string} String with HTML tags removed
   *
   * @example
   * const text = Sanitize.stripTags('<p>Hello <b>World</b></p>');
   * // Returns: 'Hello World'
   */
  stripTags(str) {
    if (typeof str !== 'string') {
      return String(str ?? '');
    }

    // Create a temporary element to leverage browser's HTML parser
    const div = document.createElement('div');
    div.innerHTML = str;
    return div.textContent || div.innerText || '';
  },

  /**
   * Sanitize a string for use in CSS
   *
   * @param {string} str - String to sanitize
   * @returns {string} CSS-safe string
   *
   * @example
   * element.style.setProperty('--custom', Sanitize.css(userInput));
   */
  css(str) {
    if (typeof str !== 'string') {
      return '';
    }

    // Remove potentially dangerous CSS values
    return str
      .replace(/expression\s*\(/gi, '')
      .replace(/url\s*\(/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/[<>"']/g, '');
  },

  /**
   * Sanitize a string for use in a filename
   *
   * @param {string} str - String to sanitize
   * @returns {string} Filename-safe string
   *
   * @example
   * const filename = Sanitize.filename(userInput) + '.txt';
   */
  filename(str) {
    if (typeof str !== 'string') {
      return '';
    }

    return str
      .replace(/[/\\?%*:|"<>]/g, '-') // Replace dangerous characters
      .replace(/\.\./g, '-') // Prevent directory traversal
      .replace(/^\./, '_') // Don't start with dot
      .slice(0, 255); // Limit length
  },

  /**
   * Create safe innerHTML by escaping interpolated values
   *
   * @param {TemplateStringsArray} strings - Template literal strings
   * @param {...*} values - Values to interpolate
   * @returns {string} HTML string with escaped values
   *
   * @example
   * element.innerHTML = Sanitize.template`<div>${userInput}</div>`;
   */
  template(strings, ...values) {
    return strings.reduce((result, str, i) => {
      const value = values[i - 1];
      const escaped = value !== undefined ? this.html(String(value)) : '';
      return result + escaped + str;
    });
  },

  /**
   * Validate and sanitize an email address
   *
   * @param {string} email - Email to validate
   * @returns {string} Sanitized email or empty string if invalid
   *
   * @example
   * const email = Sanitize.email(userInput);
   * if (email) {
   *   sendEmail(email);
   * }
   */
  email(email) {
    if (typeof email !== 'string') {
      return '';
    }

    const trimmed = email.trim().toLowerCase();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return '';
    }

    // Additional checks
    if (trimmed.length > 254) {
      return '';
    }

    return trimmed;
  },

  /**
   * Sanitize a number input
   *
   * @param {*} value - Value to sanitize
   * @param {Object} [options={}] - Options
   * @param {number} [options.min=-Infinity] - Minimum value
   * @param {number} [options.max=Infinity] - Maximum value
   * @param {number} [options.default=0] - Default if invalid
   * @returns {number} Sanitized number
   *
   * @example
   * const age = Sanitize.number(userInput, { min: 0, max: 120, default: 18 });
   */
  number(value, options = {}) {
    const { min = -Infinity, max = Infinity, default: defaultValue = 0 } = options;

    const num = parseFloat(value);

    if (isNaN(num) || !isFinite(num)) {
      return defaultValue;
    }

    return Math.max(min, Math.min(max, num));
  },

  /**
   * Sanitize an integer input
   *
   * @param {*} value - Value to sanitize
   * @param {Object} [options={}] - Options
   * @param {number} [options.min=-Infinity] - Minimum value
   * @param {number} [options.max=Infinity] - Maximum value
   * @param {number} [options.default=0] - Default if invalid
   * @returns {number} Sanitized integer
   *
   * @example
   * const count = Sanitize.integer(userInput, { min: 1, max: 100 });
   */
  integer(value, options = {}) {
    return Math.floor(this.number(value, options));
  },
};

export default Sanitize;
