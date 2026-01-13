/**
 * DOM Utilities Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DOM } from '../../src/assets/scripts/utils/dom.js';

describe('DOM Utilities', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="container">
        <button id="btn" class="btn primary">Click me</button>
        <ul class="list">
          <li class="item">Item 1</li>
          <li class="item">Item 2</li>
          <li class="item">Item 3</li>
        </ul>
        <div class="panel" style="display: block;">Content</div>
        <input type="text" id="input" data-id="123" />
      </div>
    `;
  });

  describe('select()', () => {
    it('selects a single element by selector', () => {
      const btn = DOM.select('#btn');
      expect(btn).not.toBeNull();
      expect(btn.textContent).toBe('Click me');
    });

    it('returns null for non-existent elements', () => {
      const el = DOM.select('.non-existent');
      expect(el).toBeNull();
    });

    it('supports context parameter', () => {
      const list = DOM.select('.list');
      const item = DOM.select('.item', list);
      expect(item.textContent).toBe('Item 1');
    });
  });

  describe('selectAll()', () => {
    it('selects all matching elements', () => {
      const items = DOM.selectAll('.item');
      expect(items).toHaveLength(3);
    });

    it('returns an array', () => {
      const items = DOM.selectAll('.item');
      expect(Array.isArray(items)).toBe(true);
    });

    it('returns empty array for no matches', () => {
      const items = DOM.selectAll('.non-existent');
      expect(items).toHaveLength(0);
    });
  });

  describe('exists()', () => {
    it('returns true for existing elements', () => {
      expect(DOM.exists('#btn')).toBe(true);
    });

    it('returns false for non-existent elements', () => {
      expect(DOM.exists('.non-existent')).toBe(false);
    });
  });

  describe('on() / off()', () => {
    it('adds event listener', () => {
      const handler = vi.fn();
      const btn = DOM.select('#btn');

      DOM.on(btn, 'click', handler);
      btn.click();

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('supports selector string', () => {
      const handler = vi.fn();

      DOM.on('#btn', 'click', handler);
      DOM.select('#btn').click();

      expect(handler).toHaveBeenCalled();
    });

    it('removes event listener', () => {
      const handler = vi.fn();
      const btn = DOM.select('#btn');

      DOM.on(btn, 'click', handler);
      DOM.off(btn, 'click', handler);
      btn.click();

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('addClass() / removeClass() / toggleClass() / hasClass()', () => {
    it('adds a class', () => {
      const btn = DOM.select('#btn');
      DOM.addClass(btn, 'active');
      expect(btn.classList.contains('active')).toBe(true);
    });

    it('removes a class', () => {
      const btn = DOM.select('#btn');
      DOM.removeClass(btn, 'primary');
      expect(btn.classList.contains('primary')).toBe(false);
    });

    it('toggles a class', () => {
      const btn = DOM.select('#btn');

      DOM.toggleClass(btn, 'active');
      expect(btn.classList.contains('active')).toBe(true);

      DOM.toggleClass(btn, 'active');
      expect(btn.classList.contains('active')).toBe(false);
    });

    it('checks if element has class', () => {
      expect(DOM.hasClass('#btn', 'primary')).toBe(true);
      expect(DOM.hasClass('#btn', 'non-existent')).toBe(false);
    });

    it('supports selector strings', () => {
      DOM.addClass('#btn', 'test-class');
      expect(DOM.hasClass('#btn', 'test-class')).toBe(true);
    });
  });

  describe('attr()', () => {
    it('gets attribute value', () => {
      const id = DOM.attr('#btn', 'id');
      expect(id).toBe('btn');
    });

    it('sets attribute value', () => {
      DOM.attr('#btn', 'title', 'My Button');
      expect(DOM.select('#btn').getAttribute('title')).toBe('My Button');
    });

    it('returns null for non-existent element', () => {
      expect(DOM.attr('.non-existent', 'id')).toBeNull();
    });
  });

  describe('data()', () => {
    it('gets data attribute value', () => {
      const id = DOM.data('#input', 'id');
      expect(id).toBe('123');
    });

    it('sets data attribute value', () => {
      DOM.data('#input', 'value', '456');
      expect(DOM.select('#input').getAttribute('data-value')).toBe('456');
    });
  });

  describe('text() / html()', () => {
    it('gets text content', () => {
      expect(DOM.text('#btn')).toBe('Click me');
    });

    it('sets text content', () => {
      DOM.text('#btn', 'New Text');
      expect(DOM.select('#btn').textContent).toBe('New Text');
    });

    it('gets HTML content', () => {
      const html = DOM.html('.container');
      expect(html).toContain('<button');
    });

    it('sets HTML content', () => {
      DOM.html('.panel', '<span>New</span>');
      expect(DOM.select('.panel').innerHTML).toBe('<span>New</span>');
    });
  });

  describe('hide() / show() / toggle()', () => {
    it('hides an element', () => {
      DOM.hide('.panel');
      expect(DOM.select('.panel').style.display).toBe('none');
    });

    it('shows an element', () => {
      DOM.hide('.panel');
      DOM.show('.panel');
      expect(DOM.select('.panel').style.display).toBe('block');
    });

    it('shows with custom display value', () => {
      DOM.hide('.panel');
      DOM.show('.panel', 'flex');
      expect(DOM.select('.panel').style.display).toBe('flex');
    });

    it('toggles visibility', () => {
      const panel = DOM.select('.panel');

      DOM.toggle(panel);
      expect(panel.style.display).toBe('none');

      DOM.toggle(panel);
      expect(panel.style.display).toBe('block');
    });
  });

  describe('dimensions()', () => {
    it('returns dimensions object', () => {
      const dims = DOM.dimensions('#btn');
      expect(dims).toHaveProperty('width');
      expect(dims).toHaveProperty('height');
      expect(dims).toHaveProperty('top');
      expect(dims).toHaveProperty('left');
    });

    it('returns null for non-existent element', () => {
      expect(DOM.dimensions('.non-existent')).toBeNull();
    });
  });

  describe('ready()', () => {
    it('executes callback immediately when DOM is ready', () => {
      const callback = vi.fn();
      DOM.ready(callback);
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('create()', () => {
    it('creates an element with tag', () => {
      const el = DOM.create('div');
      expect(el.tagName).toBe('DIV');
    });

    it('creates element with attributes', () => {
      const el = DOM.create('button', { class: 'btn', type: 'submit' });
      expect(el.className).toBe('btn');
      expect(el.type).toBe('submit');
    });

    it('creates element with text children', () => {
      const el = DOM.create('span', {}, ['Hello']);
      expect(el.textContent).toBe('Hello');
    });

    it('creates element with element children', () => {
      const child = DOM.create('span', {}, ['Child']);
      const parent = DOM.create('div', {}, [child]);
      expect(parent.firstChild).toBe(child);
    });
  });

  describe('closest()', () => {
    it('finds closest ancestor', () => {
      const item = DOM.select('.item');
      const list = DOM.closest(item, '.list');
      expect(list).not.toBeNull();
      expect(list.classList.contains('list')).toBe(true);
    });

    it('returns null when no ancestor matches', () => {
      const item = DOM.select('.item');
      expect(DOM.closest(item, '.non-existent')).toBeNull();
    });
  });
});
