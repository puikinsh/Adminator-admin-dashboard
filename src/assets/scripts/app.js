/**
 * Modern Adminator Application
 * Main application entry point with enhanced mobile support
 */

import bootstrap from 'bootstrap';
import DOM from './utils/dom';
import DateUtils from './utils/date';
import Theme from './utils/theme';
import Sidebar from './components/Sidebar';
import ChartComponent from './components/Chart';

// Import styles
import '../styles/index.scss';

// Import other modules that don't need immediate modernization
import './fullcalendar';
import './masonry';
import './popover';
import './scrollbar';
import './search';
import './skycons';
import './vectorMaps';
import './chat';
import './email';
import './googleMaps';

class AdminatorApp {
  constructor() {
    this.components = new Map();
    this.isInitialized = false;
    
    // Initialize when DOM is ready
    DOM.ready(() => {
      this.init();
    });
  }

  /**
   * Initialize the application
   */
  init() {
    if (this.isInitialized) return;
    
    console.log('🚀 Initializing Adminator App (Mobile Optimized)');
    
    try {
      // Initialize core components
      this.initSidebar();
      this.initCharts();
      this.initDataTables();
      this.initDatePickers();
      this.initTheme();
      this.initMobileEnhancements();
      
      // Setup global event listeners
      this.setupGlobalEvents();
      
      this.isInitialized = true;
      console.log('✅ Adminator App initialized successfully');
      
      // Dispatch custom event for other scripts
      window.dispatchEvent(new CustomEvent('adminator:ready', {
        detail: { app: this }
      }));
      
    } catch (error) {
      console.error('❌ Error initializing Adminator App:', error);
    }
  }

  /**
   * Initialize Sidebar component
   */
  initSidebar() {
    if (DOM.exists('.sidebar')) {
      const sidebar = new Sidebar();
      this.components.set('sidebar', sidebar);
      console.log('📁 Sidebar component initialized');
    }
  }

  /**
   * Initialize Chart components
   */
  initCharts() {
    // Check if we have any chart elements
    const hasCharts = DOM.exists('#sparklinedash') || 
                     DOM.exists('.sparkline') || 
                     DOM.exists('.sparkbar') ||
                     DOM.exists('.sparktri') ||
                     DOM.exists('.sparkdisc') ||
                     DOM.exists('.sparkbull') ||
                     DOM.exists('.sparkbox') ||
                     DOM.exists('.easy-pie-chart') ||
                     DOM.exists('#line-chart') ||
                     DOM.exists('#area-chart') ||
                     DOM.exists('#scatter-chart') ||
                     DOM.exists('#bar-chart');
    
    if (hasCharts) {
      const charts = new ChartComponent();
      this.components.set('charts', charts);
      console.log('📊 Chart components initialized');
    }
  }

  /**
   * Initialize DataTables (modern approach)
   */
  initDataTables() {
    const dataTableElement = DOM.select('#dataTable');
    if (dataTableElement) {
      // For now, use a lightweight approach
      // In future iterations, we can replace with a modern table library
      this.initBasicDataTable(dataTableElement);
      console.log('📋 DataTable initialized');
    }
  }

  /**
   * Basic DataTable implementation (placeholder for full modernization)
   */
  initBasicDataTable(table) {
    // Add basic sorting functionality
    const headers = DOM.selectAll('th', table);
    
    headers.forEach(header => {
      if (header.textContent.trim()) {
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        
        DOM.on(header, 'click', () => {
          console.log('Sorting by:', header.textContent);
          // Basic sort functionality can be added here
          // For now, we'll keep the existing DataTables library
        });
      }
    });
  }

  /**
   * Initialize Date Pickers (modern approach with Day.js)
   */
  initDatePickers() {
    const startDatePickers = DOM.selectAll('.start-date');
    const endDatePickers = DOM.selectAll('.end-date');
    
    [...startDatePickers, ...endDatePickers].forEach(picker => {
      // Convert to HTML5 date input for better UX
      if (picker.type !== 'date') {
        picker.type = 'date';
        picker.classList.add('form-control');
        
        // Clear the placeholder since HTML5 date inputs don't need it
        picker.removeAttribute('placeholder');
        
        // Set default value to today if no value is set
        if (!picker.value) {
          picker.value = DateUtils.form.toInputValue(DateUtils.now());
        }
        
        // Make sure the input is clickable and focusable
        picker.style.pointerEvents = 'auto';
        picker.style.cursor = 'pointer';
        
        // Ensure proper styling for HTML5 date input
        picker.style.minHeight = '38px';
        picker.style.lineHeight = '1.5';
        
        console.log('📅 Date picker converted to HTML5 with Day.js support');
      }
    });
    
    // Add enhanced interaction - handle both field and icon clicks
    [...startDatePickers, ...endDatePickers].forEach(picker => {
      // Handle direct field clicks
      DOM.on(picker, 'click', (event) => {
        event.target.focus();
        // For mobile browsers, trigger the date picker
        if (event.target.showPicker && typeof event.target.showPicker === 'function') {
          try {
            event.target.showPicker();
          } catch (e) {
            // Fallback if showPicker is not supported
            console.log('📅 Date picker opened via field click');
          }
        }
      });
      
      // Handle calendar icon clicks (find the icon in the input group)
      const inputGroup = picker.closest('.input-group');
      if (inputGroup) {
        const calendarIcon = inputGroup.querySelector('.input-group-text i.ti-calendar');
        if (calendarIcon) {
          DOM.on(calendarIcon, 'click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            picker.focus();
            if (picker.showPicker && typeof picker.showPicker === 'function') {
              try {
                picker.showPicker();
              } catch (e) {
                console.log('📅 Date picker opened via icon click');
              }
            }
          });
        }
      }
    });
  }

  /**
   * Initialize theme system with toggle
   */
  initTheme() {
    console.log('🌙 Initializing theme system');
    
    // Initialize theme system first
    Theme.init();
    
    // Inject theme toggle if missing - with retry mechanism
    setTimeout(() => {
      const navRight = DOM.select('.nav-right');
      console.log('🔍 nav-right found:', !!navRight);
      console.log('🔍 navRight element:', navRight);
      console.log('🔍 theme-toggle exists:', DOM.exists('#theme-toggle'));
      console.log('🔍 All nav-right li elements:', navRight ? navRight.querySelectorAll('li').length : 0);
      
      // Debug the DOM structure
      if (navRight) {
        console.log('🔍 navRight children:', Array.from(navRight.children).map(child => ({
          tagName: child.tagName,
          className: child.className,
          id: child.id
        })));
      }
      
      if (navRight && !DOM.exists('#theme-toggle')) {
      const li = document.createElement('li');
      li.className = 'theme-toggle d-flex ai-c';
      li.innerHTML = `
        <div class="form-check form-switch d-flex ai-c" style="margin: 0; padding: 0;">
          <label class="form-check-label me-2 text-nowrap c-grey-700" for="theme-toggle" style="font-size: 12px; margin-right: 8px;">
            <i class="ti-sun" style="margin-right: 4px;"></i><span class="theme-label">Light</span>
          </label>
          <input class="form-check-input" type="checkbox" id="theme-toggle" style="margin: 0;">
          <label class="form-check-label ms-2 text-nowrap c-grey-700" for="theme-toggle" style="font-size: 12px; margin-left: 8px;">
            <span class="theme-label">Dark</span><i class="ti-moon" style="margin-left: 4px;"></i>
          </label>
        </div>
      `;
      
      // Insert before user dropdown (last item) - safer approach
      const lastItem = navRight.querySelector('li:last-child');
      console.log('🔍 lastItem found:', !!lastItem);
      console.log('🔍 lastItem parent:', lastItem ? lastItem.parentNode : null);
      console.log('🔍 navRight:', navRight);
      
      if (lastItem && lastItem.parentNode === navRight) {
        navRight.insertBefore(li, lastItem);
        console.log('✅ Theme toggle inserted before last item');
      } else {
        navRight.appendChild(li);
        console.log('✅ Theme toggle appended to nav-right (safer approach)');
      }
      
      // Add toggle functionality
      const toggle = DOM.select('#theme-toggle');
      if (toggle) {
        // Set initial state
        const currentTheme = Theme.current();
        toggle.checked = currentTheme === 'dark';
        
        DOM.on(toggle, 'change', () => {
          Theme.apply(toggle.checked ? 'dark' : 'light');
        });
        
        // Listen for theme changes from other sources
        window.addEventListener('adminator:themeChanged', (event) => {
          toggle.checked = event.detail.theme === 'dark';
          
          // Update charts when theme changes
          const charts = this.components.get('charts');
          if (charts) charts.redrawCharts();
        });
      }
      } else {
        console.log('❌ No nav-right found or theme-toggle already exists');
      }
    }, 100); // Wait 100ms for DOM to be fully ready
  }

  /**
   * Initialize mobile-specific enhancements
   */
  initMobileEnhancements() {
    console.log('📱 Initializing mobile enhancements');
    this.enhanceMobileDropdowns();
    this.enhanceMobileSearch();
    
    // Prevent horizontal scroll on mobile
    if (this.isMobile()) {
      document.body.style.overflowX = 'hidden';
    }
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEvents() {
    // Global click handler
    DOM.on(document, 'click', (event) => this.handleGlobalClick(event));
    
    // Window resize handler with debouncing
    let resizeTimeout;
    DOM.on(window, 'resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.handleResize(), 250);
    });
    
    console.log('🌐 Global event listeners set up');
  }

  /**
   * Handle window resize events
   */
  handleResize() {
    console.log('📐 Window resized, updating mobile features');
    
    // Close all mobile-specific overlays when switching to desktop
    if (!this.isMobile()) {
      document.body.style.overflow = '';
      document.body.style.overflowX = '';
      
      // Close dropdowns
      const dropdowns = DOM.selectAll('.nav-right .dropdown');
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) menu.classList.remove('show');
      });
      
      // Close search
      const searchBox = DOM.select('.search-box');
      const searchInput = DOM.select('.search-input');
      if (searchBox && searchInput) {
        searchBox.classList.remove('active');
        searchInput.classList.remove('active');
      }
    } else {
      // Re-enable mobile overflow protection
      document.body.style.overflowX = 'hidden';
    }
    
    // Re-apply mobile enhancements
    this.enhanceMobileDropdowns();
    this.enhanceMobileSearch();
  }

  /**
   * Handle global click events
   */
  handleGlobalClick(event) {
    // Close mobile dropdowns when clicking outside
    if (!event.target.closest('.dropdown')) {
      const dropdowns = DOM.selectAll('.nav-right .dropdown');
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) menu.classList.remove('show');
      });
      document.body.style.overflow = '';
    }

    // Close search when clicking outside
    if (!event.target.closest('.search-box') && !event.target.closest('.search-input')) {
      const searchBox = DOM.select('.search-box');
      const searchInput = DOM.select('.search-input');
      if (searchBox && searchInput) {
        searchBox.classList.remove('active');
        searchInput.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('mobile-menu-open');
      }
    }
  }

  /**
   * Check if we're on a mobile device
   */
  isMobile() {
    return window.innerWidth <= 768;
  }

  /**
   * Enhanced mobile dropdown handling with improved email layout
   */
  enhanceMobileDropdowns() {
    if (!this.isMobile()) return;

    const dropdowns = DOM.selectAll('.nav-right .dropdown');
    
    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (toggle && menu) {
        // Remove existing listeners to prevent duplicates
        const newToggle = toggle.cloneNode(true);
        toggle.replaceWith(newToggle);
        
        // Add click functionality for mobile dropdowns
        DOM.on(newToggle, 'click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Close search if open
          const searchBox = DOM.select('.search-box');
          const searchInput = DOM.select('.search-input');
          if (searchBox && searchInput) {
            searchBox.classList.remove('active');
            searchInput.classList.remove('active');
          }
          
          // Close other dropdowns first
          dropdowns.forEach(otherDropdown => {
            if (otherDropdown !== dropdown) {
              otherDropdown.classList.remove('show');
              const otherMenu = otherDropdown.querySelector('.dropdown-menu');
              if (otherMenu) otherMenu.classList.remove('show');
            }
          });
          
          // Toggle current dropdown
          const isOpen = dropdown.classList.contains('show');
          if (isOpen) {
            dropdown.classList.remove('show');
            menu.classList.remove('show');
            document.body.style.overflow = '';
            document.body.classList.remove('mobile-menu-open');
          } else {
            dropdown.classList.add('show');
            menu.classList.add('show');
            document.body.style.overflow = 'hidden';
            document.body.classList.add('mobile-menu-open');
          }
        });

        // Enhanced mobile close button functionality
        DOM.on(menu, 'click', (e) => {
          // Check if clicked on the close area (::before pseudo-element area)
          const rect = menu.getBoundingClientRect();
          const clickY = e.clientY - rect.top;
          
          // If clicked in top 50px (close button area)
          if (clickY <= 50) {
            dropdown.classList.remove('show');
            menu.classList.remove('show');
            document.body.style.overflow = '';
            document.body.classList.remove('mobile-menu-open');
            e.preventDefault();
            e.stopPropagation();
          }
        });
      }
    });

    // Close dropdowns on escape key
    DOM.on(document, 'keydown', (e) => {
      if (e.key === 'Escape') {
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('show');
          const menu = dropdown.querySelector('.dropdown-menu');
          if (menu) menu.classList.remove('show');
        });
        document.body.style.overflow = '';
        document.body.classList.remove('mobile-menu-open');
      }
    });
  }

      /**
     * Enhanced mobile search handling - Full-width search bar
     */
    enhanceMobileSearch() {
      const searchBox = DOM.select('.search-box');
      const searchInput = DOM.select('.search-input');
      
      if (searchBox && searchInput) {
        const searchToggle = searchBox.querySelector('a');
        const searchField = searchInput.querySelector('input');
        
        if (searchToggle && searchField) {
          console.log('🔍 Setting up full-width search functionality');
          
          // Remove existing listeners to prevent duplication
          const newSearchToggle = searchToggle.cloneNode(true);
          searchToggle.replaceWith(newSearchToggle);
          
          DOM.on(newSearchToggle, 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🔍 Full-width search toggle clicked');
            
            // Close any open dropdowns first
            const dropdowns = DOM.selectAll('.nav-right .dropdown');
            dropdowns.forEach(dropdown => {
              dropdown.classList.remove('show');
              const menu = dropdown.querySelector('.dropdown-menu');
              if (menu) menu.classList.remove('show');
            });
            
            // Toggle search state
            const isActive = searchInput.classList.contains('active');
            const searchIcon = newSearchToggle.querySelector('i');
            
            if (isActive) {
              // Close search
              searchInput.classList.remove('active');
              document.body.classList.remove('search-open');
              
              // Change icon back to search
              if (searchIcon) {
                searchIcon.className = 'ti-search';
              }
              
              // Clear input
              if (searchField) {
                searchField.value = '';
                searchField.blur();
              }
              
              console.log('🔍 Full-width search closed');
            } else {
              // Open search
              searchInput.classList.add('active');
              document.body.classList.add('search-open');
              
              // Change icon to close
              if (searchIcon) {
                searchIcon.className = 'ti-close';
              }
              
              // Focus the input after a short delay
              setTimeout(() => {
                if (searchField) {
                  searchField.focus();
                  console.log('🔍 Search field focused');
                }
              }, 100);
              
              console.log('🔍 Full-width search opened');
            }
          });
          
          // Close search on escape
          DOM.on(document, 'keydown', (e) => {
            if (e.key === 'Escape' && searchInput.classList.contains('active')) {
              searchInput.classList.remove('active');
              document.body.classList.remove('search-open');
              
              // Reset icon
              const searchIcon = newSearchToggle.querySelector('i');
              if (searchIcon) {
                searchIcon.className = 'ti-search';
              }
              
              // Clear input
              if (searchField) {
                searchField.value = '';
                searchField.blur();
              }
              
              console.log('🔍 Full-width search closed via escape');
            }
          });
          
          // Handle search input
          DOM.on(searchField, 'keypress', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const query = searchField.value.trim();
              if (query) {
                console.log('🔍 Search query:', query);
                // Implement your search logic here
                
                // For demo, close search after "searching"
                searchInput.classList.remove('active');
                document.body.classList.remove('search-open');
                
                const searchIcon = newSearchToggle.querySelector('i');
                if (searchIcon) {
                  searchIcon.className = 'ti-search';
                }
                
                searchField.value = '';
                searchField.blur();
              }
            }
          });
          
          console.log('🔍 Full-width search functionality initialized');
        }
      }
    }

  /**
   * Get a component by name
   */
  getComponent(name) {
    return this.components.get(name);
  }

  /**
   * Check if app is ready
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Destroy the application
   */
  destroy() {
    console.log('🗑️ Destroying Adminator App');
    
    // Destroy all components
    this.components.forEach((component, name) => {
      if (typeof component.destroy === 'function') {
        component.destroy();
      }
      console.log(`🗑️ ${name} component destroyed`);
    });
    
    this.components.clear();
    this.isInitialized = false;
  }

  /**
   * Refresh/reinitialize the application
   */
  refresh() {
    console.log('🔄 Refreshing Adminator App');
    
    if (this.isInitialized) {
      this.destroy();
    }
    
    setTimeout(() => {
      this.init();
    }, 100);
  }
}

// Initialize the application
console.log('📱 Starting Adminator (Mobile Optimized)');
const app = new AdminatorApp();

// Make app globally available for debugging
window.AdminatorApp = app;

// Export for module usage
export default app; 