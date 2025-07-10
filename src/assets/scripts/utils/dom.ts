/**
 * DOM Utility Functions
 * Provides jQuery-like functionality using vanilla JavaScript with TypeScript support
 */

import type { DOMUtilities, AnimationOptions } from '../../../types';

export type ElementSelector = string | Element | null;

interface ElementDimensions {
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
}

interface SlideAnimationKeyframes {
  height: string;
}

interface FadeAnimationKeyframes {
  opacity: number;
}

/**
 * Convert string selector to element or return element as-is
 */
function getElement(element: ElementSelector): Element | null {
  if (typeof element === 'string') {
    return document.querySelector(element);
  }
  return element;
}

/**
 * DOM Utility object with type-safe methods
 */
export const DOM: DOMUtilities = {
  /**
   * Document ready (replaces $(document).ready())
   */
  ready: (callback: () => void): void => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  },

  /**
   * Select single element (replaces $('selector'))
   */
  select: (selector: string, context: Element | Document = document): HTMLElement | null => {
    return context.querySelector(selector);
  },

  /**
   * Select multiple elements (replaces $('selector'))
   */
  selectAll: (selector: string, context: Element | Document = document): HTMLElement[] => {
    return Array.from(context.querySelectorAll(selector));
  },

  /**
   * Check if element exists
   */
  exists: (selector: string, context: Element | Document = document): boolean => {
    return context.querySelector(selector) !== null;
  },

  /**
   * Add event listener (replaces $.on())
   */
  on: (
    element: Element | Window | Document, 
    event: string, 
    handler: (event: Event) => void,
    options: AddEventListenerOptions = {}
  ): void => {
    if (element) {
      element.addEventListener(event, handler, options);
    }
  },

  /**
   * Remove event listener (replaces $.off())
   */
  off: (
    element: Element | Window | Document, 
    event: string, 
    handler: (event: Event) => void
  ): void => {
    if (element) {
      element.removeEventListener(event, handler);
    }
  },

  /**
   * Add class (replaces $.addClass())
   */
  addClass: (element: Element, className: string): void => {
    const el = getElement(element);
    if (el) {
      el.classList.add(className);
    }
  },

  /**
   * Remove class (replaces $.removeClass())
   */
  removeClass: (element: Element, className: string): void => {
    const el = getElement(element);
    if (el) {
      el.classList.remove(className);
    }
  },

  /**
   * Toggle class (replaces $.toggleClass())
   */
  toggleClass: (element: Element, className: string): void => {
    const el = getElement(element);
    if (el) {
      el.classList.toggle(className);
    }
  },

  /**
   * Check if element has class (replaces $.hasClass())
   */
  hasClass: (element: Element, className: string): boolean => {
    const el = getElement(element);
    return el ? el.classList.contains(className) : false;
  },

  /**
   * Get/Set attribute (replaces $.attr())
   */
  attr: (element: Element, name: string, value?: string): string | void => {
    const el = getElement(element);
    if (!el) return;

    if (value === undefined) {
      return el.getAttribute(name) || '';
    } else {
      el.setAttribute(name, value);
    }
  },

  /**
   * Get/Set data attribute (replaces $.data())
   */
  data: (element: Element, name: string, value?: any): any => {
    const el = getElement(element);
    if (!el) return null;

    const dataName = `data-${name}`;
    
    if (value === undefined) {
      const attrValue = el.getAttribute(dataName);
      // Try to parse JSON for complex data
      if (attrValue) {
        try {
          return JSON.parse(attrValue);
        } catch {
          return attrValue;
        }
      }
      return null;
    } else {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      el.setAttribute(dataName, stringValue);
    }
  },
};

/**
 * Extended DOM utilities with additional functionality
 */
export const DOMExtended = {
  ...DOM,

  /**
   * Get/Set text content (replaces $.text())
   */
  text: (element: ElementSelector, content?: string): string | void => {
    const el = getElement(element);
    if (!el) return;

    if (content === undefined) {
      return el.textContent || '';
    } else {
      el.textContent = content;
    }
  },

  /**
   * Get/Set HTML content (replaces $.html())
   */
  html: (element: ElementSelector, content?: string): string | void => {
    const el = getElement(element);
    if (!el) return;

    if (content === undefined) {
      return (el as HTMLElement).innerHTML;
    } else {
      (el as HTMLElement).innerHTML = content;
    }
  },

  /**
   * Hide element (replaces $.hide())
   */
  hide: (element: ElementSelector): void => {
    const el = getElement(element) as HTMLElement;
    if (el) {
      el.style.display = 'none';
    }
  },

  /**
   * Show element (replaces $.show())
   */
  show: (element: ElementSelector, display: string = 'block'): void => {
    const el = getElement(element) as HTMLElement;
    if (el) {
      el.style.display = display;
    }
  },

  /**
   * Toggle visibility (replaces $.toggle())
   */
  toggle: (element: ElementSelector, display: string = 'block'): void => {
    const el = getElement(element) as HTMLElement;
    if (el) {
      if (el.style.display === 'none') {
        el.style.display = display;
      } else {
        el.style.display = 'none';
      }
    }
  },

  /**
   * Slide up animation (replaces $.slideUp())
   */
  slideUp: (element: ElementSelector, duration: number = 300): Promise<void> => {
    const el = getElement(element) as HTMLElement;
    if (!el) return Promise.resolve();

    return new Promise((resolve) => {
      const height = el.scrollHeight;
      el.style.height = `${height}px`;
      el.style.overflow = 'hidden';
      
      const animation = el.animate([
        { height: `${height}px` } as SlideAnimationKeyframes,
        { height: '0px' } as SlideAnimationKeyframes,
      ], {
        duration,
        easing: 'ease-in-out',
      });

      animation.onfinish = (): void => {
        el.style.display = 'none';
        el.style.height = '';
        el.style.overflow = '';
        resolve();
      };
    });
  },

  /**
   * Slide down animation (replaces $.slideDown())
   */
  slideDown: (element: ElementSelector, duration: number = 300): Promise<void> => {
    const el = getElement(element) as HTMLElement;
    if (!el) return Promise.resolve();

    return new Promise((resolve) => {
      el.style.display = 'block';
      el.style.height = '0px';
      el.style.overflow = 'hidden';
      
      const height = el.scrollHeight;
      
      const animation = el.animate([
        { height: '0px' } as SlideAnimationKeyframes,
        { height: `${height}px` } as SlideAnimationKeyframes,
      ], {
        duration,
        easing: 'ease-in-out',
      });

      animation.onfinish = (): void => {
        el.style.height = 'auto';
        el.style.overflow = 'visible';
        resolve();
      };
    });
  },

  /**
   * Fade in animation (replaces $.fadeIn())
   */
  fadeIn: (element: ElementSelector, duration: number = 300): Promise<void> => {
    const el = getElement(element) as HTMLElement;
    if (!el) return Promise.resolve();

    return new Promise((resolve) => {
      el.style.opacity = '0';
      el.style.display = 'block';
      
      const animation = el.animate([
        { opacity: 0 } as FadeAnimationKeyframes,
        { opacity: 1 } as FadeAnimationKeyframes,
      ], {
        duration,
        easing: 'ease-in-out',
      });

      animation.onfinish = (): void => {
        el.style.opacity = '';
        resolve();
      };
    });
  },

  /**
   * Fade out animation (replaces $.fadeOut())
   */
  fadeOut: (element: ElementSelector, duration: number = 300): Promise<void> => {
    const el = getElement(element) as HTMLElement;
    if (!el) return Promise.resolve();

    return new Promise((resolve) => {
      const animation = el.animate([
        { opacity: 1 } as FadeAnimationKeyframes,
        { opacity: 0 } as FadeAnimationKeyframes,
      ], {
        duration,
        easing: 'ease-in-out',
      });

      animation.onfinish = (): void => {
        el.style.display = 'none';
        el.style.opacity = '';
        resolve();
      };
    });
  },

  /**
   * Get element dimensions and position
   */
  dimensions: (element: ElementSelector): ElementDimensions | null => {
    const el = getElement(element);
    if (!el) return null;

    const rect = el.getBoundingClientRect();
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
  ready: (callback: () => void): void => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  },

  /**
   * Create element with attributes and content
   */
  create: (tagName: string, attributes?: Record<string, string>, content?: string): HTMLElement => {
    const element = document.createElement(tagName);
    
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    
    if (content) {
      element.textContent = content;
    }
    
    return element;
  },

  /**
   * Append element to parent
   */
  append: (parent: ElementSelector, child: Element): void => {
    const parentEl = getElement(parent);
    if (parentEl) {
      parentEl.appendChild(child);
    }
  },

  /**
   * Remove element from DOM
   */
  remove: (element: ElementSelector): void => {
    const el = getElement(element);
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  },

  /**
   * Get/Set CSS styles
   */
  css: (element: ElementSelector, property: string, value?: string): string | void => {
    const el = getElement(element) as HTMLElement;
    if (!el) return;

    if (value === undefined) {
      return window.getComputedStyle(el).getPropertyValue(property);
    } else {
      el.style.setProperty(property, value);
    }
  },

  /**
   * Get/Set element value (for form elements)
   */
  val: (element: ElementSelector, value?: string): string | void => {
    const el = getElement(element) as HTMLInputElement;
    if (!el) return;

    if (value === undefined) {
      return el.value;
    } else {
      el.value = value;
    }
  },

  /**
   * Trigger custom event
   */
  trigger: (element: ElementSelector, eventName: string, detail?: any): void => {
    const el = getElement(element);
    if (el) {
      const event = new CustomEvent(eventName, { detail });
      el.dispatchEvent(event);
    }
  },

  /**
   * Check if element is visible
   */
  isVisible: (element: ElementSelector): boolean => {
    const el = getElement(element) as HTMLElement;
    if (!el) return false;

    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  },

  /**
   * Get element offset relative to document
   */
  offset: (element: ElementSelector): { top: number; left: number } | null => {
    const el = getElement(element);
    if (!el) return null;

    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset,
    };
  },

  /**
   * Delegate event handling
   */
  delegate: (
    parent: ElementSelector, 
    selector: string, 
    event: string, 
    handler: (event: Event) => void
  ): void => {
    const parentEl = getElement(parent);
    if (parentEl) {
      parentEl.addEventListener(event, (e) => {
        const target = e.target as Element;
        if (target && target.matches(selector)) {
          handler(e);
        }
      });
    }
  },
};

// Export both the basic DOM utilities and extended version
export { DOM as default, DOMExtended };

// Re-export types for convenience
export type { DOMUtilities, ElementSelector, ElementDimensions };