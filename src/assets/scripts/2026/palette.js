/**
 * Command palette (⌘K / Ctrl+K).
 *
 * Builds a searchable modal of every NAV item plus a few global actions
 * (toggle theme, view docs/repo). Opens via:
 *   - Click on any [data-palette-open] element (the topbar .cmd button)
 *   - Cmd/Ctrl + K keyboard shortcut, anywhere on the page
 *   - "/" keypress when no input is focused
 *
 * Closes via:
 *   - Esc
 *   - Click outside the panel
 *   - Selecting a result (Enter or click)
 *
 * Keyboard navigation: ↑ / ↓ to move, Enter to select.
 *
 * The palette renders into <body> the first time it's opened, then re-uses
 * that DOM node. All state is local to this module.
 */

import { NAV } from './Shell.js';

const PANEL_HTML = `
  <div class="palette-modal" role="dialog" aria-modal="true" aria-label="Command palette">
    <div class="palette-input-row">
      <svg viewBox="0 0 24 24" class="palette-icon" aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/>
        <path d="m21 21-4.3-4.3" fill="none" stroke="currentColor" stroke-width="2"/>
      </svg>
      <input class="palette-input" type="text" placeholder="Search pages, actions…" autocomplete="off" spellcheck="false">
      <kbd class="palette-esc">esc</kbd>
    </div>
    <div class="palette-results" role="listbox"></div>
    <div class="palette-foot">
      <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
      <span><kbd>↵</kbd> select</span>
      <span><kbd>esc</kbd> close</span>
    </div>
  </div>
`;

let backdrop = null;
let modal = null;
let input = null;
let resultsEl = null;
let allItems = [];
let filtered = [];
let cursor = 0;

function buildItems() {
  // Flatten the NAV manifest into a single list of selectable rows.
  const items = [];

  for (const section of NAV) {
    for (const item of section.items) {
      if (item.children) {
        for (const child of item.children) {
          items.push({
            kind: 'page',
            label: child.text,
            section: `${section.label} › ${item.text}`,
            href: child.href,
            icon: item.icon,
          });
        }
      } else if (item.href && item.href !== '#') {
        items.push({
          kind: 'page',
          label: item.text,
          section: section.label,
          href: item.href,
          icon: item.icon,
        });
      }
    }
  }

  // Static actions
  items.push({
    kind: 'action',
    label: 'Toggle theme (light / dark)',
    section: 'Action',
    action: () => {
      const toggle = document.getElementById('themeToggle');
      if (toggle) {
        toggle.click();
        return;
      }
      const root = document.documentElement;
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('dash26-theme', next); } catch { /* no localStorage */ }
    },
    icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
  });
  items.push({
    kind: 'link',
    label: 'View on GitHub',
    section: 'External',
    href: 'https://github.com/puikinsh/Adminator-admin-dashboard',
    target: '_blank',
    icon: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  });
  items.push({
    kind: 'link',
    label: 'Documentation',
    section: 'External',
    href: 'https://puikinsh.github.io/Adminator-admin-dashboard/',
    target: '_blank',
    icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  });

  return items;
}

function score(item, query) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const label = item.label.toLowerCase();
  if (label === q) return 100;
  if (label.startsWith(q)) return 50;
  if (label.includes(q)) return 20;
  if (item.section.toLowerCase().includes(q)) return 5;
  return 0;
}

function renderResults() {
  resultsEl.innerHTML = filtered.length === 0
    ? '<div class="palette-empty">No results</div>'
    : filtered.map((item, i) => `
      <div class="palette-result${i === cursor ? ' is-selected' : ''}" role="option" data-index="${i}" aria-selected="${i === cursor}">
        <span class="palette-result-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">${item.icon || ''}</svg></span>
        <span class="palette-result-label">${item.label}</span>
        <span class="palette-result-section">${item.section}</span>
      </div>
    `).join('');
}

function update(query) {
  filtered = allItems
    .map((item) => ({ item, s: score(item, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 12)
    .map((x) => x.item);
  cursor = 0;
  renderResults();
}

function activate(item) {
  if (!item) return;
  close();
  if (item.kind === 'action' && typeof item.action === 'function') {
    item.action();
  } else if (item.href) {
    if (item.target === '_blank') {
      window.open(item.href, '_blank', 'noopener');
    } else {
      window.location.href = item.href;
    }
  }
}

function ensureMounted() {
  // If the cached modal was removed from the DOM (e.g. by a test or by code
  // that wipes <body>), drop the stale refs and remount.
  if (modal && !document.contains(modal)) {
    modal = null; backdrop = null; input = null; resultsEl = null;
  }
  if (modal) return;
  backdrop = document.createElement('div');
  backdrop.className = 'palette-backdrop';
  backdrop.innerHTML = PANEL_HTML;
  document.body.appendChild(backdrop);
  modal = backdrop.querySelector('.palette-modal');
  input = backdrop.querySelector('.palette-input');
  resultsEl = backdrop.querySelector('.palette-results');

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
  input.addEventListener('input', () => update(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      cursor = Math.min(cursor + 1, filtered.length - 1);
      renderResults();
      scrollCursorIntoView();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      cursor = Math.max(cursor - 1, 0);
      renderResults();
      scrollCursorIntoView();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      activate(filtered[cursor]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  });
  resultsEl.addEventListener('click', (e) => {
    const row = e.target.closest('.palette-result');
    if (row) activate(filtered[Number(row.getAttribute('data-index'))]);
  });
}

function scrollCursorIntoView() {
  const sel = resultsEl.querySelector('.palette-result.is-selected');
  if (sel && typeof sel.scrollIntoView === 'function') {
    sel.scrollIntoView({ block: 'nearest' });
  }
}

export function open() {
  ensureMounted();
  if (allItems.length === 0) allItems = buildItems();
  input.value = '';
  update('');
  document.body.classList.add('has-palette-open');
  // Focus on next tick (jsdom-friendly).
  setTimeout(() => input.focus(), 0);
}

export function close() {
  if (!modal) return;
  document.body.classList.remove('has-palette-open');
}

export function isOpen() {
  return document.body.classList.contains('has-palette-open');
}

let _initialized = false;

export function initPalette() {
  // Guard against being called twice (e.g. when init runs on both
  // DOMContentLoaded and on a manual re-init after hot reload). Without
  // this, every keydown handler runs N times, which causes Cmd+K to net-no-op
  // on the second invocation.
  if (_initialized) return;
  _initialized = true;

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-palette-open]')) {
      e.preventDefault();
      open();
    }
  });

  document.addEventListener('keydown', (e) => {
    // Cmd+K (Mac) / Ctrl+K (Windows/Linux): open from anywhere
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      isOpen() ? close() : open();
      return;
    }
    // Slash: open when no input is focused
    if (e.key === '/' && !isOpen()) {
      const tag = document.activeElement && document.activeElement.tagName;
      const editable = document.activeElement && document.activeElement.isContentEditable;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT' && !editable) {
        e.preventDefault();
        open();
      }
    }
  });
}
