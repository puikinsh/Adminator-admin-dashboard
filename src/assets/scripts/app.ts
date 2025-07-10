/**
 * Modern Adminator Application with TypeScript
 * Main application entry point with enhanced mobile support and type safety
 */

import { DOM } from './utils/dom';
import { ThemeManager } from './utils/theme';
import { Sidebar } from './components/Sidebar';
import { ChartComponent } from './components/Chart';
import UIComponents from './ui';
import DataTable from './datatable';
import DatePicker from './datepicker';
import VectorMaps from './vectorMaps';
import type { ComponentInterface } from '../../types';

// Import styles
import '../styles/index.scss';

// Import other modules that don't need immediate modernization
import './fullcalendar';
import './masonry';
import './popover';
import './scrollbar';
import './search';
import './skycons';
import './chat';
import './email';
import './googleMaps';

// Type definitions for the application
export interface AdminatorAppOptions {
  autoInit?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  mobile?: {
    enhanced?: boolean;
    fullWidthSearch?: boolean;
    disableDropdowns?: boolean;
  };
  debug?: boolean;
}

export interface AdminatorAppState {
  isInitialized: boolean;
  isMobile: boolean;
  currentTheme: 'light' | 'dark' | 'auto';
  components: Map<string, ComponentInterface>;
}

export interface AdminatorAppEvents {
  ready: CustomEvent<{ app: AdminatorApp }>;
  themeChanged: CustomEvent<{ theme: string; previousTheme: string }>;
  mobileStateChanged: CustomEvent<{ isMobile: boolean }>;
  componentAdded: CustomEvent<{ name: string; component: ComponentInterface }>;
  componentRemoved: CustomEvent<{ name: string }>;
}

declare global {
  interface Window {
    AdminatorApp?: AdminatorApp;
  }
}

export class AdminatorApp {
  public options: AdminatorAppOptions;
  public state: AdminatorAppState;
  
  private resizeTimeout: number | null = null;
  private eventHandlers: Map<string, EventListener> = new Map();
  private themeManager: typeof ThemeManager;

  constructor(options: AdminatorAppOptions = {}) {
    this.options = {
      autoInit: true,
      theme: 'auto',
      mobile: {
        enhanced: true,
        fullWidthSearch: true,
        disableDropdowns: false,
      },
      debug: false,
      ...options,
    };

    this.themeManager = ThemeManager;
    
    this.state = {
      isInitialized: false,
      isMobile: this.checkMobileState(),
      currentTheme: 'light',
      components: new Map(),
    };

    if (this.options.autoInit) {
      // Initialize when DOM is ready
      DOM.ready(() => {
        this.init();
      });
    }
  }

  /**
   * Initialize the application
   */
  public init(): void {
    if (this.state.isInitialized) return;

    this.log('Initializing Adminator App...');
    
    try {
      // Initialize core components
      this.initSidebar();
      this.initCharts();
      this.initDataTables();
      this.initDatePickers();
      this.initUIComponents();
      this.initVectorMaps();
      this.initTheme();
      this.initMobileEnhancements();

      // Setup global event listeners
      this.setupGlobalEvents();

      this.state.isInitialized = true;
      this.log('Adminator App initialized successfully');

      // Dispatch custom event for other scripts
      this.dispatchEvent('ready', { app: this });

    } catch (error) {
      console.error('Error initializing Adminator App:', error);
    }
  }

  /**
   * Initialize Sidebar component
   */
  private initSidebar(): void {
    if (DOM.exists('.sidebar')) {
      const sidebar = new Sidebar();
      this.addComponent('sidebar', sidebar);
      this.log('Sidebar component initialized');
    }
  }

  /**
   * Initialize Chart components
   */
  private initCharts(): void {
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
      this.addComponent('charts', charts);
      this.log('Chart components initialized');
    }
  }

  /**
   * Initialize DataTables
   */
  private initDataTables(): void {
    const dataTableElement = DOM.select('#dataTable');
    if (dataTableElement) {
      DataTable.init();
      this.log('DataTable initialized');
    }
  }

  /**
   * Initialize Date Pickers
   */
  private initDatePickers(): void {
    const startDatePickers = DOM.selectAll('.start-date');
    const endDatePickers = DOM.selectAll('.end-date');

    if (startDatePickers.length > 0 || endDatePickers.length > 0) {
      DatePicker.init();
      this.log('Date pickers initialized');
    }
  }

  /**
   * Initialize UI Components
   */
  private initUIComponents(): void {
    UIComponents.init();
    this.log('UI components initialized');
  }

  /**
   * Initialize Vector Maps
   */
  private initVectorMaps(): void {
    if (DOM.exists('#world-map-marker')) {
      VectorMaps.init();
      this.log('Vector maps initialized');
    }
  }

  /**
   * Initialize theme system with toggle
   */
  private initTheme(): void {
    this.log('Initializing theme system...');

    // Initialize theme system first
    this.themeManager.init();
    this.state.currentTheme = this.themeManager.current();

    // Inject theme toggle if missing
    setTimeout(() => {
      this.injectThemeToggle();
    }, 100);
  }

  /**
   * Inject theme toggle button
   */
  private injectThemeToggle(): void {
    const navRight = DOM.select('.nav-right');
    
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

      // Insert before user dropdown (last item)
      const lastItem = navRight.querySelector('li:last-child');
      if (lastItem && lastItem.parentNode === navRight) {
        navRight.insertBefore(li, lastItem);
      } else {
        navRight.appendChild(li);
      }

      this.setupThemeToggle();
      this.log('Theme toggle injected');
    }
  }

  /**
   * Setup theme toggle functionality
   */
  private setupThemeToggle(): void {
    const toggle = DOM.select('#theme-toggle') as HTMLInputElement;
    if (!toggle) return;

    // Set initial state
    toggle.checked = this.state.currentTheme === 'dark';

    // Add change handler
    const changeHandler = (): void => {
      const newTheme = toggle.checked ? 'dark' : 'light';
      const previousTheme = this.state.currentTheme;
      
      this.themeManager.apply(newTheme);
      this.state.currentTheme = newTheme;
      
      this.dispatchEvent('themeChanged', { theme: newTheme, previousTheme });
    };

    DOM.on(toggle, 'change', changeHandler);
    this.eventHandlers.set('theme-toggle', changeHandler);

    // Listen for theme changes from other sources
    const themeChangeHandler = (event: CustomEvent): void => {
      const newTheme = event.detail.theme;
      toggle.checked = newTheme === 'dark';
      this.state.currentTheme = newTheme;

      // Update charts when theme changes
      const charts = this.getComponent('charts') as ChartComponent;
      if (charts && typeof charts.redrawCharts === 'function') {
        charts.redrawCharts();
      }
    };

    window.addEventListener('adminator:themeChanged', themeChangeHandler as EventListener);
    this.eventHandlers.set('theme-change', themeChangeHandler as EventListener);
  }

  /**
   * Initialize mobile-specific enhancements
   */
  private initMobileEnhancements(): void {
    if (!this.options.mobile?.enhanced) return;

    this.log('Initializing mobile enhancements...');
    this.enhanceMobileDropdowns();
    this.enhanceMobileSearch();

    // Prevent horizontal scroll on mobile
    if (this.state.isMobile) {
      document.body.style.overflowX = 'hidden';
    }
  }

  /**
   * Setup global event listeners
   */
  private setupGlobalEvents(): void {
    // Global click handler
    const globalClickHandler = (event: Event): void => {
      this.handleGlobalClick(event);
    };
    DOM.on(document, 'click', globalClickHandler);
    this.eventHandlers.set('global-click', globalClickHandler);

    // Window resize handler with debouncing
    const resizeHandler = (): void => {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = window.setTimeout(() => {
        this.handleResize();
      }, 250);
    };
    DOM.on(window, 'resize', resizeHandler);
    this.eventHandlers.set('resize', resizeHandler);

    this.log('Global event listeners set up');
  }

  /**
   * Handle window resize events
   */
  private handleResize(): void {
    const wasMobile = this.state.isMobile;
    this.state.isMobile = this.checkMobileState();

    if (wasMobile !== this.state.isMobile) {
      this.dispatchEvent('mobileStateChanged', { isMobile: this.state.isMobile });
    }

    this.log('Window resized, updating mobile features');

    // Close all mobile-specific overlays when switching to desktop
    if (!this.state.isMobile) {
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
      this.closeSearch();
    } else {
      // Re-enable mobile overflow protection
      document.body.style.overflowX = 'hidden';
    }

    // Re-apply mobile enhancements
    if (this.options.mobile?.enhanced) {
      this.enhanceMobileDropdowns();
      this.enhanceMobileSearch();
    }
  }

  /**
   * Handle global click events
   */
  private handleGlobalClick(event: Event): void {
    const target = event.target as HTMLElement;

    // Close mobile dropdowns when clicking outside
    if (!target.closest('.dropdown')) {
      const dropdowns = DOM.selectAll('.nav-right .dropdown');
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) menu.classList.remove('show');
      });
      document.body.style.overflow = '';
    }

    // Close search when clicking outside
    if (!target.closest('.search-box') && !target.closest('.search-input')) {
      this.closeSearch();
    }
  }

  /**
   * Check if we're on a mobile device
   */
  private checkMobileState(): boolean {
    return window.innerWidth <= 768;
  }

  /**
   * Enhanced mobile dropdown handling
   */
  private enhanceMobileDropdowns(): void {
    if (!this.state.isMobile || this.options.mobile?.disableDropdowns) return;

    const dropdowns = DOM.selectAll('.nav-right .dropdown');

    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle') as HTMLElement;
      const menu = dropdown.querySelector('.dropdown-menu') as HTMLElement;

      if (toggle && menu) {
        // Remove existing listeners to prevent duplicates
        const newToggle = toggle.cloneNode(true) as HTMLElement;
        toggle.replaceWith(newToggle);

        // Add click functionality for mobile dropdowns
        DOM.on(newToggle, 'click', (e: Event) => {
          e.preventDefault();
          e.stopPropagation();

          // Close search if open
          this.closeSearch();

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
        DOM.on(menu, 'click', (e: Event) => {
          const rect = menu.getBoundingClientRect();
          const clickY = (e as MouseEvent).clientY - rect.top;

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
    const escapeHandler = (e: Event): void => {
      const keyEvent = e as KeyboardEvent;
      if (keyEvent.key === 'Escape') {
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('show');
          const menu = dropdown.querySelector('.dropdown-menu');
          if (menu) menu.classList.remove('show');
        });
        document.body.style.overflow = '';
        document.body.classList.remove('mobile-menu-open');
      }
    };

    DOM.on(document, 'keydown', escapeHandler);
  }

  /**
   * Enhanced mobile search handling
   */
  private enhanceMobileSearch(): void {
    if (!this.options.mobile?.fullWidthSearch) return;

    const searchBox = DOM.select('.search-box') as HTMLElement;
    const searchInput = DOM.select('.search-input') as HTMLElement;

    if (searchBox && searchInput) {
      const searchToggle = searchBox.querySelector('a') as HTMLAnchorElement;
      const searchField = searchInput.querySelector('input') as HTMLInputElement;

      if (searchToggle && searchField) {
        // Remove existing listeners to prevent duplication
        const newSearchToggle = searchToggle.cloneNode(true) as HTMLAnchorElement;
        searchToggle.replaceWith(newSearchToggle);

        DOM.on(newSearchToggle, 'click', (e: Event) => {
          e.preventDefault();
          e.stopPropagation();

          // Close any open dropdowns first
          const dropdowns = DOM.selectAll('.nav-right .dropdown');
          dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) menu.classList.remove('show');
          });

          // Toggle search state
          const isActive = searchInput.classList.contains('active');
          const searchIcon = newSearchToggle.querySelector('i') as HTMLElement;

          if (isActive) {
            this.closeSearch();
          } else {
            this.openSearch(searchField, searchIcon);
          }
        });

        // Handle search input
        DOM.on(searchField, 'keypress', (e: Event) => {
          const keyEvent = e as KeyboardEvent;
          if (keyEvent.key === 'Enter') {
            keyEvent.preventDefault();
            const query = searchField.value.trim();
            if (query) {
              this.handleSearch(query);
            }
          }
        });
      }
    }
  }

  /**
   * Open search interface
   */
  private openSearch(searchField: HTMLInputElement, searchIcon: HTMLElement): void {
    const searchInput = DOM.select('.search-input') as HTMLElement;
    
    searchInput.classList.add('active');
    document.body.classList.add('search-open');

    // Change icon to close
    if (searchIcon) {
      searchIcon.className = 'ti-close';
    }

    // Focus the input after a short delay
    setTimeout(() => {
      searchField.focus();
    }, 100);
  }

  /**
   * Close search interface
   */
  private closeSearch(): void {
    const searchBox = DOM.select('.search-box') as HTMLElement;
    const searchInput = DOM.select('.search-input') as HTMLElement;

    if (searchBox && searchInput) {
      searchInput.classList.remove('active');
      document.body.classList.remove('search-open');
      document.body.classList.remove('mobile-menu-open');

      // Reset icon
      const searchIcon = searchBox.querySelector('i') as HTMLElement;
      if (searchIcon) {
        searchIcon.className = 'ti-search';
      }

      // Clear input
      const searchField = searchInput.querySelector('input') as HTMLInputElement;
      if (searchField) {
        searchField.value = '';
        searchField.blur();
      }
    }
  }

  /**
   * Handle search query
   */
  private handleSearch(query: string): void {
    this.log(`Search query: ${query}`);
    
    // Implement your search logic here
    // For demo, close search after "searching"
    this.closeSearch();
  }

  /**
   * Add component to the application
   */
  public addComponent(name: string, component: ComponentInterface): void {
    this.state.components.set(name, component);
    this.dispatchEvent('componentAdded', { name, component });
    this.log(`Component added: ${name}`);
  }

  /**
   * Remove component from the application
   */
  public removeComponent(name: string): void {
    const component = this.state.components.get(name);
    if (component) {
      if (typeof component.destroy === 'function') {
        component.destroy();
      }
      this.state.components.delete(name);
      this.dispatchEvent('componentRemoved', { name });
      this.log(`Component removed: ${name}`);
    }
  }

  /**
   * Get a component by name
   */
  public getComponent(name: string): ComponentInterface | undefined {
    return this.state.components.get(name);
  }

  /**
   * Get all components
   */
  public getComponents(): Map<string, ComponentInterface> {
    return new Map(this.state.components);
  }

  /**
   * Check if app is ready
   */
  public isReady(): boolean {
    return this.state.isInitialized;
  }

  /**
   * Get current application state
   */
  public getState(): Readonly<AdminatorAppState> {
    return {
      ...this.state,
      components: new Map(this.state.components),
    };
  }

  /**
   * Update application options
   */
  public updateOptions(newOptions: Partial<AdminatorAppOptions>): void {
    this.options = { ...this.options, ...newOptions };
    this.log('Options updated');
  }

  /**
   * Dispatch custom event
   */
  private dispatchEvent<T extends keyof AdminatorAppEvents>(
    type: T,
    detail: AdminatorAppEvents[T]['detail']
  ): void {
    const event = new CustomEvent(`adminator:${type}`, {
      detail,
      bubbles: true,
    });
    window.dispatchEvent(event);
  }

  /**
   * Log message if debugging is enabled
   */
  private log(message: string): void {
    if (this.options.debug) {
      console.log(`[AdminatorApp] ${message}`);
    }
  }

  /**
   * Destroy the application
   */
  public destroy(): void {
    this.log('Destroying Adminator App');

    // Destroy all components
    this.state.components.forEach((component, name) => {
      if (typeof component.destroy === 'function') {
        component.destroy();
      }
      this.log(`Component destroyed: ${name}`);
    });

    // Remove event listeners
    this.eventHandlers.forEach((_, name) => {
      // Note: We'd need to track which element each handler was attached to
      // For now, we'll rely on the browser's garbage collection
      this.log(`Event handler removed: ${name}`);
    });

    // Clear state
    this.state.components.clear();
    this.eventHandlers.clear();
    this.state.isInitialized = false;

    // Clear timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
  }

  /**
   * Refresh/reinitialize the application
   */
  public refresh(): void {
    this.log('Refreshing Adminator App');

    if (this.state.isInitialized) {
      this.destroy();
    }

    setTimeout(() => {
      this.init();
    }, 100);
  }
}

// Initialize the application
const app = new AdminatorApp({
  debug: process.env.NODE_ENV === 'development',
});

// Make app globally available for debugging
window.AdminatorApp = app;

// Export for module usage
export default app;