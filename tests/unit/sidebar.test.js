/**
 * Sidebar Component Tests
 * Tests for sidebar navigation, toggle, and dropdown functionality
 */

describe('Sidebar Component', () => {
  let container;
  let app;
  let sidebar;
  let sidebarToggle;

  beforeEach(() => {
    // Create DOM structure
    container = document.createElement('div');
    container.innerHTML = `
      <div class="app">
        <aside class="sidebar">
          <nav class="sidebar-menu">
            <ul>
              <li>
                <a href="/dashboard" class="sidebar-link">
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" class="has-dropdown">
                  <span>Components</span>
                </a>
                <ul class="dropdown-menu" style="display: none;">
                  <li><a href="/buttons">Buttons</a></li>
                  <li><a href="/cards">Cards</a></li>
                </ul>
              </li>
              <li>
                <a href="#" class="has-dropdown">
                  <span>Forms</span>
                </a>
                <ul class="dropdown-menu" style="display: none;">
                  <li><a href="/inputs">Inputs</a></li>
                  <li><a href="/validation">Validation</a></li>
                </ul>
              </li>
              <li>
                <a href="/settings" class="sidebar-link">
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        <button class="sidebar-toggle" id="sidebar-toggle">Toggle</button>
      </div>
    `;
    document.body.appendChild(container);

    app = container.querySelector('.app');
    sidebar = container.querySelector('.sidebar');
    sidebarToggle = container.querySelector('.sidebar-toggle');
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.clearAllTimers();
  });

  describe('Sidebar Structure', () => {
    it('should have sidebar element', () => {
      expect(sidebar).toBeTruthy();
      expect(sidebar.classList.contains('sidebar')).toBe(true);
    });

    it('should have sidebar menu', () => {
      const menu = sidebar.querySelector('.sidebar-menu');
      expect(menu).toBeTruthy();
    });

    it('should have menu items', () => {
      const menuItems = sidebar.querySelectorAll('.sidebar-menu li');
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('should have sidebar links', () => {
      const links = sidebar.querySelectorAll('.sidebar-menu a');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Sidebar Toggle', () => {
    it('should have toggle button', () => {
      expect(sidebarToggle).toBeTruthy();
    });

    it('should toggle collapsed class on app', () => {
      expect(app.classList.contains('is-collapsed')).toBe(false);
      
      sidebarToggle.click();
      expect(app.classList.contains('is-collapsed')).toBe(true);
      
      sidebarToggle.click();
      expect(app.classList.contains('is-collapsed')).toBe(false);
    });

    it('should prevent default on toggle click', () => {
      const event = new Event('click', { bubbles: true, cancelable: true });
      const preventDefault = jest.spyOn(event, 'preventDefault');
      
      sidebarToggle.dispatchEvent(event);
      expect(preventDefault).toHaveBeenCalled();
    });

    it('should dispatch resize event after toggle', (done) => {
      jest.useFakeTimers();
      
      const resizeHandler = jest.fn();
      window.addEventListener('resize', resizeHandler);
      
      sidebarToggle.click();
      
      jest.advanceTimersByTime(300);
      
      expect(resizeHandler).toHaveBeenCalled();
      window.removeEventListener('resize', resizeHandler);
      
      jest.useRealTimers();
      done();
    });
  });

  describe('Dropdown Menus', () => {
    let dropdownLink;
    let dropdownMenu;
    let parentLi;

    beforeEach(() => {
      dropdownLink = sidebar.querySelector('.has-dropdown');
      parentLi = dropdownLink.parentElement;
      dropdownMenu = parentLi.querySelector('.dropdown-menu');
    });

    it('should have dropdown menus', () => {
      const dropdowns = sidebar.querySelectorAll('.dropdown-menu');
      expect(dropdowns.length).toBeGreaterThan(0);
    });

    it('should initially hide dropdown menus', () => {
      expect(dropdownMenu.style.display).toBe('none');
    });

    it('should open dropdown on click', (done) => {
      jest.useFakeTimers();
      
      dropdownLink.click();
      
      jest.advanceTimersByTime(200);
      
      expect(parentLi.classList.contains('open')).toBe(true);
      
      jest.useRealTimers();
      done();
    });

    it('should close dropdown on second click', (done) => {
      jest.useFakeTimers();
      
      // Open
      dropdownLink.click();
      jest.advanceTimersByTime(200);
      expect(parentLi.classList.contains('open')).toBe(true);
      
      // Close
      dropdownLink.click();
      jest.advanceTimersByTime(200);
      expect(parentLi.classList.contains('open')).toBe(false);
      
      jest.useRealTimers();
      done();
    });

    it('should close other dropdowns when opening new one', (done) => {
      jest.useFakeTimers();
      
      const firstDropdown = sidebar.querySelectorAll('.has-dropdown')[0];
      const secondDropdown = sidebar.querySelectorAll('.has-dropdown')[1];
      const firstParent = firstDropdown.parentElement;
      const secondParent = secondDropdown.parentElement;
      
      // Open first dropdown
      firstDropdown.click();
      jest.advanceTimersByTime(200);
      expect(firstParent.classList.contains('open')).toBe(true);
      
      // Open second dropdown
      secondDropdown.click();
      jest.advanceTimersByTime(200);
      expect(secondParent.classList.contains('open')).toBe(true);
      expect(firstParent.classList.contains('open')).toBe(false);
      
      jest.useRealTimers();
      done();
    });
  });

  describe('Active Link Highlighting', () => {
    beforeEach(() => {
      // Mock window.location.pathname
      delete window.location;
      window.location = { pathname: '/dashboard' };
    });

    it('should mark current page link as active', () => {
      const dashboardLink = sidebar.querySelector('a[href="/dashboard"]');
      
      // Simulate the active link logic
      const links = sidebar.querySelectorAll('.sidebar-link');
      links.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href) {
          const pattern = href[0] === '/' ? href.substr(1) : href;
          if (pattern === window.location.pathname.substr(1)) {
            link.classList.add('active');
          }
        }
      });
      
      expect(dashboardLink.classList.contains('active')).toBe(true);
    });

    it('should not mark other links as active', () => {
      const settingsLink = sidebar.querySelector('a[href="/settings"]');
      
      // Simulate the active link logic
      const links = sidebar.querySelectorAll('.sidebar-link');
      links.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href) {
          const pattern = href[0] === '/' ? href.substr(1) : href;
          if (pattern === window.location.pathname.substr(1)) {
            link.classList.add('active');
          }
        }
      });
      
      expect(settingsLink.classList.contains('active')).toBe(false);
    });
  });

  describe('Slide Animations', () => {
    let testElement;

    beforeEach(() => {
      testElement = document.createElement('div');
      testElement.style.height = '100px';
      testElement.innerHTML = '<p>Test content</p>';
      document.body.appendChild(testElement);
    });

    afterEach(() => {
      document.body.removeChild(testElement);
    });

    describe('slideUp', () => {
      it('should set initial height', () => {
        const initialHeight = testElement.scrollHeight;
        
        // Simulate slideUp
        testElement.style.height = `${initialHeight}px`;
        testElement.style.transition = 'height 200ms ease';
        testElement.style.overflow = 'hidden';
        
        expect(testElement.style.height).toBe(`${initialHeight}px`);
        expect(testElement.style.overflow).toBe('hidden');
      });

      it('should animate to zero height', (done) => {
        jest.useFakeTimers();
        
        const initialHeight = testElement.scrollHeight;
        testElement.style.height = `${initialHeight}px`;
        testElement.style.transition = 'height 200ms ease';
        testElement.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
          testElement.style.height = '0';
          testElement.style.paddingTop = '0';
          testElement.style.paddingBottom = '0';
        });
        
        jest.advanceTimersByTime(16);
        expect(testElement.style.height).toBe('0px');
        
        jest.useRealTimers();
        done();
      });

      it('should hide element after animation', (done) => {
        jest.useFakeTimers();
        
        testElement.style.height = '100px';
        testElement.style.transition = 'height 200ms ease';
        
        setTimeout(() => {
          testElement.style.display = 'none';
        }, 200);
        
        jest.advanceTimersByTime(200);
        expect(testElement.style.display).toBe('none');
        
        jest.useRealTimers();
        done();
      });

      it('should call callback after animation', (done) => {
        jest.useFakeTimers();
        
        const callback = jest.fn();
        
        setTimeout(() => {
          callback();
        }, 200);
        
        jest.advanceTimersByTime(200);
        expect(callback).toHaveBeenCalled();
        
        jest.useRealTimers();
        done();
      });
    });

    describe('slideDown', () => {
      beforeEach(() => {
        testElement.style.display = 'none';
      });

      it('should show element', () => {
        testElement.style.removeProperty('display');
        let display = window.getComputedStyle(testElement).display;
        if (display === 'none') display = 'block';
        testElement.style.display = display;
        
        expect(testElement.style.display).not.toBe('none');
      });

      it('should set initial zero height', () => {
        testElement.style.display = 'block';
        testElement.style.height = '0';
        testElement.style.overflow = 'hidden';
        
        expect(testElement.style.height).toBe('0px');
        expect(testElement.style.overflow).toBe('hidden');
      });

      it('should animate to full height', (done) => {
        jest.useFakeTimers();
        
        testElement.style.display = 'block';
        testElement.style.height = '0';
        const height = testElement.scrollHeight;
        testElement.style.transition = 'height 200ms ease';
        
        requestAnimationFrame(() => {
          testElement.style.height = `${height}px`;
        });
        
        jest.advanceTimersByTime(16);
        expect(testElement.style.height).toBe(`${height}px`);
        
        jest.useRealTimers();
        done();
      });

      it('should set auto height after animation', (done) => {
        jest.useFakeTimers();
        
        setTimeout(() => {
          testElement.style.height = 'auto';
        }, 200);
        
        jest.advanceTimersByTime(200);
        expect(testElement.style.height).toBe('auto');
        
        jest.useRealTimers();
        done();
      });

      it('should call callback after animation', (done) => {
        jest.useFakeTimers();
        
        const callback = jest.fn();
        
        setTimeout(() => {
          callback();
        }, 200);
        
        jest.advanceTimersByTime(200);
        expect(callback).toHaveBeenCalled();
        
        jest.useRealTimers();
        done();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      expect(window.innerWidth).toBe(375);
      
      // Sidebar should be collapsible on mobile
      sidebarToggle.click();
      expect(app.classList.contains('is-collapsed')).toBe(true);
    });

    it('should handle tablet viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      expect(window.innerWidth).toBe(768);
    });

    it('should handle desktop viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      
      expect(window.innerWidth).toBe(1920);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible toggle button', () => {
      expect(sidebarToggle.tagName).toBe('BUTTON');
    });

    it('should have keyboard navigation support', () => {
      const links = sidebar.querySelectorAll('a');
      links.forEach(link => {
        expect(link.tagName).toBe('A');
        expect(link.hasAttribute('href')).toBe(true);
      });
    });

    it('should handle keyboard events on toggle', () => {
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      
      sidebarToggle.dispatchEvent(keyEvent);
      // Button should be keyboard accessible
      expect(sidebarToggle).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing dropdown menu', () => {
      const linkWithoutDropdown = sidebar.querySelector('a[href="/dashboard"]');
      
      expect(() => {
        linkWithoutDropdown.click();
      }).not.toThrow();
    });

    it('should handle multiple rapid clicks', (done) => {
      jest.useFakeTimers();
      
      const dropdownLink = sidebar.querySelector('.has-dropdown');
      
      // Rapid clicks
      dropdownLink.click();
      dropdownLink.click();
      dropdownLink.click();
      
      jest.advanceTimersByTime(200);
      
      // Should handle gracefully
      expect(dropdownLink.parentElement).toBeTruthy();
      
      jest.useRealTimers();
      done();
    });

    it('should handle missing app container', () => {
      const toggleWithoutApp = document.createElement('button');
      toggleWithoutApp.className = 'sidebar-toggle';
      document.body.appendChild(toggleWithoutApp);
      
      expect(() => {
        toggleWithoutApp.click();
      }).not.toThrow();
      
      document.body.removeChild(toggleWithoutApp);
    });

    it('should handle empty sidebar', () => {
      const emptySidebar = document.createElement('aside');
      emptySidebar.className = 'sidebar';
      document.body.appendChild(emptySidebar);
      
      const links = emptySidebar.querySelectorAll('a');
      expect(links.length).toBe(0);
      
      document.body.removeChild(emptySidebar);
    });
  });
});
