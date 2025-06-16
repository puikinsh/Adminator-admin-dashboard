/**
 * Modern Adminator Application
 * Main application entry point - replaces jQuery-based initialization
 */

import bootstrap from 'bootstrap';
import DOM from './utils/dom';
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
import './utils';

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
    
    console.log('🚀 Initializing Adminator App (Modern Version)');
    
    try {
      // Initialize core components
      this.initSidebar();
      this.initCharts();
      this.initDataTables();
      this.initDatePickers();
      
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
   * Initialize Date Pickers (modern approach)
   */
  initDatePickers() {
    const startDatePickers = DOM.selectAll('.start-date');
    const endDatePickers = DOM.selectAll('.end-date');
    
    [...startDatePickers, ...endDatePickers].forEach(picker => {
      // Convert to HTML5 date input for better UX
      if (picker.type !== 'date') {
        picker.type = 'date';
        picker.classList.add('form-control');
        console.log('📅 Date picker converted to HTML5');
      }
    });
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEvents() {
    // Global resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 150);
    });

    // Global click handler for dynamic content
    document.addEventListener('click', (e) => {
      this.handleGlobalClick(e);
    });

    // Custom event for masonry recalculation
    window.EVENT = new Event('resize');
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Notify charts to resize
    const charts = this.components.get('charts');
    if (charts) {
      charts.redrawCharts();
    }

    // Dispatch resize event for other components
    window.dispatchEvent(new CustomEvent('adminator:resize'));
  }

  /**
   * Handle global clicks
   */
  handleGlobalClick(event) {
    // Handle any global click events here
    // This can be used for analytics, debugging, etc.
  }

  /**
   * Get component instance
   */
  getComponent(name) {
    return this.components.get(name);
  }

  /**
   * Check if app is initialized
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Destroy the application
   */
  destroy() {
    // Destroy all components
    this.components.forEach((component, name) => {
      if (typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    
    this.components.clear();
    this.isInitialized = false;
    
    console.log('🧹 Adminator App destroyed');
  }

  /**
   * Refresh all components (useful for dynamic content)
   */
  refresh() {
    console.log('🔄 Refreshing Adminator App');
    
    // Refresh sidebar active links
    const sidebar = this.components.get('sidebar');
    if (sidebar) {
      sidebar.refreshActiveLink();
    }

    // Reinitialize charts if needed
    const charts = this.components.get('charts');
    if (charts) {
      charts.redrawCharts();
    }
  }


}

// Create global app instance
const app = new AdminatorApp();

// Export for external access
window.AdminatorApp = app;

export default app; 