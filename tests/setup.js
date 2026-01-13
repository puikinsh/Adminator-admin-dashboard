/**
 * Vitest Test Setup
 * Configures the test environment
 */

// Set up DOM environment
if (typeof document !== 'undefined') {
  // Set default document structure
  document.body.innerHTML = `
    <div class="app">
      <div class="sidebar"></div>
      <div class="main-content"></div>
    </div>
  `;
}

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => Object.keys(store)[index] || null
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {}
  })
});

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});
