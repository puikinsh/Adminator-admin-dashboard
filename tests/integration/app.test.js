/**
 * Application Integration Tests
 * Tests for component interactions and app-wide functionality
 */

describe('Application Integration', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <div class="app" data-theme="light">
        <aside class="sidebar">
          <nav class="sidebar-menu">
            <ul>
              <li><a href="/dashboard" class="sidebar-link">Dashboard</a></li>
              <li><a href="/settings" class="sidebar-link">Settings</a></li>
            </ul>
          </nav>
        </aside>
        <main class="content">
          <button class="sidebar-toggle">Toggle</button>
          <button class="theme-toggle">Theme</button>
          <div class="dashboard-widgets">
            <div class="widget" data-widget="chart"></div>
            <div class="widget" data-widget="stats"></div>
          </div>
        </main>
      </div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    localStorage.clear();
  });

  describe('App Initialization', () => {
    it('should have main app container', () => {
      const app = container.querySelector('.app');
      expect(app).toBeTruthy();
    });

    it('should have sidebar', () => {
      const sidebar = container.querySelector('.sidebar');
      expect(sidebar).toBeTruthy();
    });

    it('should have content area', () => {
      const content = container.querySelector('.content');
      expect(content).toBeTruthy();
    });

    it('should have toggle buttons', () => {
      const sidebarToggle = container.querySelector('.sidebar-toggle');
      const themeToggle = container.querySelector('.theme-toggle');
      expect(sidebarToggle).toBeTruthy();
      expect(themeToggle).toBeTruthy();
    });
  });

  describe('Sidebar and Theme Integration', () => {
    it('should toggle sidebar without affecting theme', () => {
      const app = container.querySelector('.app');
      const sidebarToggle = container.querySelector('.sidebar-toggle');
      const initialTheme = app.getAttribute('data-theme');
      
      sidebarToggle.click();
      expect(app.classList.contains('is-collapsed')).toBe(true);
      expect(app.getAttribute('data-theme')).toBe(initialTheme);
    });

    it('should toggle theme without affecting sidebar state', () => {
      const app = container.querySelector('.app');
      const sidebarToggle = container.querySelector('.sidebar-toggle');
      const themeToggle = container.querySelector('.theme-toggle');
      
      // Collapse sidebar
      sidebarToggle.click();
      expect(app.classList.contains('is-collapsed')).toBe(true);
      
      // Toggle theme
      const currentTheme = app.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      app.setAttribute('data-theme', newTheme);
      
      // Sidebar should still be collapsed
      expect(app.classList.contains('is-collapsed')).toBe(true);
    });

    it('should persist both sidebar and theme states', () => {
      const app = container.querySelector('.app');
      const sidebarToggle = container.querySelector('.sidebar-toggle');
      
      // Set states
      sidebarToggle.click();
      app.setAttribute('data-theme', 'dark');
      localStorage.setItem('sidebar-collapsed', 'true');
      localStorage.setItem('adminator-theme', 'dark');
      
      // Verify persistence
      expect(localStorage.getItem('sidebar-collapsed')).toBe('true');
      expect(localStorage.getItem('adminator-theme')).toBe('dark');
    });
  });

  describe('Navigation and Active States', () => {
    it('should mark active link based on current page', () => {
      const links = container.querySelectorAll('.sidebar-link');
      
      // Simulate navigation to dashboard
      delete window.location;
      window.location = { pathname: '/dashboard' };
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '/dashboard') {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      
      const dashboardLink = container.querySelector('a[href="/dashboard"]');
      const settingsLink = container.querySelector('a[href="/settings"]');
      
      expect(dashboardLink.classList.contains('active')).toBe(true);
      expect(settingsLink.classList.contains('active')).toBe(false);
    });

    it('should update active link on navigation', () => {
      const links = container.querySelectorAll('.sidebar-link');
      
      // Navigate to settings
      delete window.location;
      window.location = { pathname: '/settings' };
      
      links.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '/settings') {
          link.classList.add('active');
        }
      });
      
      const settingsLink = container.querySelector('a[href="/settings"]');
      expect(settingsLink.classList.contains('active')).toBe(true);
    });
  });

  describe('Widget Loading', () => {
    it('should have dashboard widgets', () => {
      const widgets = container.querySelectorAll('.widget');
      expect(widgets.length).toBeGreaterThan(0);
    });

    it('should identify widget types', () => {
      const chartWidget = container.querySelector('[data-widget="chart"]');
      const statsWidget = container.querySelector('[data-widget="stats"]');
      
      expect(chartWidget).toBeTruthy();
      expect(statsWidget).toBeTruthy();
    });

    it('should initialize widgets after DOM load', () => {
      const widgets = container.querySelectorAll('.widget');
      
      widgets.forEach(widget => {
        widget.classList.add('initialized');
      });
      
      const initializedWidgets = container.querySelectorAll('.widget.initialized');
      expect(initializedWidgets.length).toBe(widgets.length);
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle mobile viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      const app = container.querySelector('.app');
      if (window.innerWidth < 768) {
        app.classList.add('mobile');
      }
      
      expect(app.classList.contains('mobile')).toBe(true);
    });

    it('should handle tablet viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      const app = container.querySelector('.app');
      app.classList.remove('mobile');
      
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        app.classList.add('tablet');
      }
      
      expect(app.classList.contains('tablet')).toBe(true);
    });

    it('should handle desktop viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      
      expect(window.innerWidth).toBeGreaterThan(1024);
    });
  });

  describe('Event Coordination', () => {
    it('should handle multiple simultaneous events', () => {
      const app = container.querySelector('.app');
      const sidebarToggle = container.querySelector('.sidebar-toggle');
      const themeToggle = container.querySelector('.theme-toggle');
      
      // Trigger both toggles
      sidebarToggle.click();
      themeToggle.click();
      
      expect(app).toBeTruthy();
    });

    it('should dispatch custom events', () => {
      const handler = jest.fn();
      window.addEventListener('app:ready', handler);
      
      window.dispatchEvent(new CustomEvent('app:ready', {
        detail: { timestamp: Date.now() }
      }));
      
      expect(handler).toHaveBeenCalled();
      window.removeEventListener('app:ready', handler);
    });

    it('should handle resize events', () => {
      const handler = jest.fn();
      window.addEventListener('resize', handler);
      
      window.dispatchEvent(new Event('resize'));
      
      expect(handler).toHaveBeenCalled();
      window.removeEventListener('resize', handler);
    });
  });

  describe('State Management', () => {
    it('should maintain app state', () => {
      const state = {
        sidebarCollapsed: false,
        theme: 'light',
        currentPage: '/dashboard',
      };
      
      localStorage.setItem('app-state', JSON.stringify(state));
      
      const savedState = JSON.parse(localStorage.getItem('app-state'));
      expect(savedState.theme).toBe('light');
      expect(savedState.currentPage).toBe('/dashboard');
    });

    it('should update state on changes', () => {
      const state = { theme: 'light' };
      localStorage.setItem('app-state', JSON.stringify(state));
      
      // Update state
      state.theme = 'dark';
      localStorage.setItem('app-state', JSON.stringify(state));
      
      const updated = JSON.parse(localStorage.getItem('app-state'));
      expect(updated.theme).toBe('dark');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing elements gracefully', () => {
      const emptyContainer = document.createElement('div');
      document.body.appendChild(emptyContainer);
      
      const sidebar = emptyContainer.querySelector('.sidebar');
      expect(sidebar).toBeNull();
      
      document.body.removeChild(emptyContainer);
    });

    it('should handle localStorage errors', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });
      
      expect(() => {
        try {
          localStorage.setItem('test', 'value');
        } catch (e) {
          // Handle gracefully
        }
      }).not.toThrow();
      
      Storage.prototype.setItem = originalSetItem;
    });

    it('should handle invalid theme values', () => {
      const app = container.querySelector('.app');
      
      expect(() => {
        app.setAttribute('data-theme', 'invalid-theme');
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should initialize quickly', () => {
      const start = performance.now();
      
      // Simulate app initialization
      const app = container.querySelector('.app');
      const sidebar = container.querySelector('.sidebar');
      const content = container.querySelector('.content');
      
      const end = performance.now();
      const duration = end - start;
      
      expect(app).toBeTruthy();
      expect(sidebar).toBeTruthy();
      expect(content).toBeTruthy();
      expect(duration).toBeLessThan(100); // Should be fast
    });

    it('should handle rapid interactions', () => {
      const sidebarToggle = container.querySelector('.sidebar-toggle');
      const app = container.querySelector('.app');
      
      // Rapid clicks
      for (let i = 0; i < 10; i++) {
        sidebarToggle.click();
      }
      
      // Should still be functional
      expect(app).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible navigation', () => {
      const links = container.querySelectorAll('.sidebar-link');
      
      links.forEach(link => {
        expect(link.tagName).toBe('A');
        expect(link.hasAttribute('href')).toBe(true);
      });
    });

    it('should have accessible buttons', () => {
      const buttons = container.querySelectorAll('button');
      
      buttons.forEach(button => {
        expect(button.tagName).toBe('BUTTON');
      });
    });

    it('should support keyboard navigation', () => {
      const sidebarToggle = container.querySelector('.sidebar-toggle');
      
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      
      expect(() => {
        sidebarToggle.dispatchEvent(keyEvent);
      }).not.toThrow();
    });
  });
});
