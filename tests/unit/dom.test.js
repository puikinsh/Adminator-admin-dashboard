/**
 * DOM Utility Functions Tests
 * Tests for jQuery-like vanilla JavaScript DOM utilities
 */

import { DOM } from '../../src/assets/scripts/utils/dom.js';

describe('DOM Utilities', () => {
  let testContainer;

  beforeEach(() => {
    // Create a fresh test container for each test
    testContainer = document.createElement('div');
    testContainer.id = 'test-container';
    testContainer.innerHTML = `
      <div class="test-element" id="test-1" data-value="test">Test 1</div>
      <div class="test-element" id="test-2">Test 2</div>
      <div class="test-element hidden" id="test-3">Test 3</div>
      <button class="btn">Click me</button>
    `;
    document.body.appendChild(testContainer);
  });

  afterEach(() => {
    // Clean up after each test
    document.body.removeChild(testContainer);
  });

  describe('select', () => {
    it('should select a single element by selector', () => {
      const element = DOM.select('#test-1');
      expect(element).toBeTruthy();
      expect(element.id).toBe('test-1');
    });

    it('should return null for non-existent selector', () => {
      const element = DOM.select('#non-existent');
      expect(element).toBeNull();
    });

    it('should select within a context', () => {
      const element = DOM.select('.test-element', testContainer);
      expect(element).toBeTruthy();
      expect(element.classList.contains('test-element')).toBe(true);
    });
  });

  describe('selectAll', () => {
    it('should select multiple elements', () => {
      const elements = DOM.selectAll('.test-element');
      expect(elements).toHaveLength(3);
      expect(Array.isArray(elements)).toBe(true);
    });

    it('should return empty array for non-existent selector', () => {
      const elements = DOM.selectAll('.non-existent');
      expect(elements).toHaveLength(0);
    });

    it('should select within a context', () => {
      const elements = DOM.selectAll('.test-element', testContainer);
      expect(elements).toHaveLength(3);
    });
  });

  describe('exists', () => {
    it('should return true for existing element', () => {
      expect(DOM.exists('#test-1')).toBe(true);
    });

    it('should return false for non-existent element', () => {
      expect(DOM.exists('#non-existent')).toBe(false);
    });
  });

  describe('addClass', () => {
    it('should add class to element', () => {
      const element = DOM.select('#test-1');
      DOM.addClass(element, 'new-class');
      expect(element.classList.contains('new-class')).toBe(true);
    });

    it('should add class using selector string', () => {
      DOM.addClass('#test-1', 'new-class');
      const element = DOM.select('#test-1');
      expect(element.classList.contains('new-class')).toBe(true);
    });

    it('should handle non-existent element gracefully', () => {
      expect(() => DOM.addClass('#non-existent', 'new-class')).not.toThrow();
    });
  });

  describe('removeClass', () => {
    it('should remove class from element', () => {
      const element = DOM.select('#test-1');
      DOM.removeClass(element, 'test-element');
      expect(element.classList.contains('test-element')).toBe(false);
    });

    it('should remove class using selector string', () => {
      DOM.removeClass('#test-3', 'hidden');
      const element = DOM.select('#test-3');
      expect(element.classList.contains('hidden')).toBe(false);
    });
  });

  describe('toggleClass', () => {
    it('should toggle class on element', () => {
      const element = DOM.select('#test-1');
      DOM.toggleClass(element, 'active');
      expect(element.classList.contains('active')).toBe(true);
      DOM.toggleClass(element, 'active');
      expect(element.classList.contains('active')).toBe(false);
    });

    it('should toggle class using selector string', () => {
      DOM.toggleClass('#test-1', 'active');
      const element = DOM.select('#test-1');
      expect(element.classList.contains('active')).toBe(true);
    });
  });

  describe('hasClass', () => {
    it('should return true if element has class', () => {
      const element = DOM.select('#test-1');
      expect(DOM.hasClass(element, 'test-element')).toBe(true);
    });

    it('should return false if element does not have class', () => {
      const element = DOM.select('#test-1');
      expect(DOM.hasClass(element, 'non-existent')).toBe(false);
    });

    it('should work with selector string', () => {
      expect(DOM.hasClass('#test-3', 'hidden')).toBe(true);
    });

    it('should return false for non-existent element', () => {
      expect(DOM.hasClass('#non-existent', 'some-class')).toBe(false);
    });
  });

  describe('attr', () => {
    it('should get attribute value', () => {
      const element = DOM.select('#test-1');
      const value = DOM.attr(element, 'id');
      expect(value).toBe('test-1');
    });

    it('should set attribute value', () => {
      const element = DOM.select('#test-1');
      DOM.attr(element, 'title', 'Test Title');
      expect(element.getAttribute('title')).toBe('Test Title');
    });

    it('should work with selector string', () => {
      DOM.attr('#test-1', 'aria-label', 'Test Label');
      const element = DOM.select('#test-1');
      expect(element.getAttribute('aria-label')).toBe('Test Label');
    });

    it('should return null for non-existent element', () => {
      expect(DOM.attr('#non-existent', 'id')).toBeNull();
    });
  });

  describe('data', () => {
    it('should get data attribute value', () => {
      const element = DOM.select('#test-1');
      const value = DOM.data(element, 'value');
      expect(value).toBe('test');
    });

    it('should set data attribute value', () => {
      const element = DOM.select('#test-1');
      DOM.data(element, 'custom', 'custom-value');
      expect(element.getAttribute('data-custom')).toBe('custom-value');
    });

    it('should work with selector string', () => {
      DOM.data('#test-1', 'new', 'new-value');
      const element = DOM.select('#test-1');
      expect(element.getAttribute('data-new')).toBe('new-value');
    });
  });

  describe('text', () => {
    it('should get text content', () => {
      const element = DOM.select('#test-1');
      const text = DOM.text(element);
      expect(text).toBe('Test 1');
    });

    it('should set text content', () => {
      const element = DOM.select('#test-1');
      DOM.text(element, 'New Text');
      expect(element.textContent).toBe('New Text');
    });

    it('should work with selector string', () => {
      DOM.text('#test-1', 'Updated Text');
      const element = DOM.select('#test-1');
      expect(element.textContent).toBe('Updated Text');
    });
  });

  describe('html', () => {
    it('should get HTML content', () => {
      const element = DOM.select('#test-1');
      const html = DOM.html(element);
      expect(html).toBe('Test 1');
    });

    it('should set HTML content', () => {
      const element = DOM.select('#test-1');
      DOM.html(element, '<span>New HTML</span>');
      expect(element.innerHTML).toBe('<span>New HTML</span>');
    });

    it('should work with selector string', () => {
      DOM.html('#test-1', '<strong>Bold</strong>');
      const element = DOM.select('#test-1');
      expect(element.innerHTML).toBe('<strong>Bold</strong>');
    });
  });

  describe('hide', () => {
    it('should hide element', () => {
      const element = DOM.select('#test-1');
      DOM.hide(element);
      expect(element.style.display).toBe('none');
    });

    it('should work with selector string', () => {
      DOM.hide('#test-1');
      const element = DOM.select('#test-1');
      expect(element.style.display).toBe('none');
    });
  });

  describe('show', () => {
    it('should show hidden element', () => {
      const element = DOM.select('#test-1');
      element.style.display = 'none';
      DOM.show(element);
      expect(element.style.display).toBe('block');
    });

    it('should show with custom display value', () => {
      const element = DOM.select('#test-1');
      element.style.display = 'none';
      DOM.show(element, 'flex');
      expect(element.style.display).toBe('flex');
    });

    it('should work with selector string', () => {
      DOM.hide('#test-1');
      DOM.show('#test-1');
      const element = DOM.select('#test-1');
      expect(element.style.display).toBe('block');
    });
  });

  describe('toggle', () => {
    it('should toggle visibility', () => {
      const element = DOM.select('#test-1');
      DOM.toggle(element);
      expect(element.style.display).toBe('none');
      DOM.toggle(element);
      expect(element.style.display).toBe('block');
    });

    it('should toggle with custom display value', () => {
      const element = DOM.select('#test-1');
      DOM.toggle(element, 'flex');
      expect(element.style.display).toBe('none');
      DOM.toggle(element, 'flex');
      expect(element.style.display).toBe('flex');
    });
  });

  describe('dimensions', () => {
    it('should get element dimensions', () => {
      const element = DOM.select('#test-1');
      const dims = DOM.dimensions(element);
      expect(dims).toHaveProperty('width');
      expect(dims).toHaveProperty('height');
      expect(dims).toHaveProperty('top');
      expect(dims).toHaveProperty('left');
      expect(dims).toHaveProperty('bottom');
      expect(dims).toHaveProperty('right');
    });

    it('should return null for non-existent element', () => {
      const dims = DOM.dimensions('#non-existent');
      expect(dims).toBeNull();
    });
  });

  describe('on', () => {
    it('should add event listener', () => {
      const element = DOM.select('.btn');
      const handler = jest.fn();
      DOM.on(element, 'click', handler);
      element.click();
      expect(handler).toHaveBeenCalled();
    });

    it('should work with selector string', () => {
      const handler = jest.fn();
      DOM.on('.btn', 'click', handler);
      const element = DOM.select('.btn');
      element.click();
      expect(handler).toHaveBeenCalled();
    });

    it('should handle non-existent element gracefully', () => {
      expect(() => DOM.on('#non-existent', 'click', jest.fn())).not.toThrow();
    });
  });

  describe('off', () => {
    it('should remove event listener', () => {
      const element = DOM.select('.btn');
      const handler = jest.fn();
      DOM.on(element, 'click', handler);
      DOM.off(element, 'click', handler);
      element.click();
      expect(handler).not.toHaveBeenCalled();
    });

    it('should work with selector string', () => {
      const handler = jest.fn();
      DOM.on('.btn', 'click', handler);
      DOM.off('.btn', 'click', handler);
      const element = DOM.select('.btn');
      element.click();
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('ready', () => {
    it('should execute callback when DOM is ready', (done) => {
      DOM.ready(() => {
        expect(document.readyState).not.toBe('loading');
        done();
      });
    });

    it('should execute immediately if DOM is already loaded', () => {
      const callback = jest.fn();
      DOM.ready(callback);
      expect(callback).toHaveBeenCalled();
    });
  });
});
