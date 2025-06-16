/**
 * Modern Sidebar Component
 * Replaces jQuery-based sidebar functionality with vanilla JavaScript
 */

class Sidebar {
  constructor() {
    this.sidebar = document.querySelector('.sidebar');
    this.sidebarMenu = document.querySelector('.sidebar .sidebar-menu');
    this.sidebarToggleLinks = document.querySelectorAll('.sidebar-toggle a');
    this.sidebarToggleById = document.querySelector('#sidebar-toggle');
    this.app = document.querySelector('.app');
    
    this.init();
  }

  init() {
    if (!this.sidebar || !this.sidebarMenu) {
      console.warn('Sidebar elements not found');
      return;
    }

    this.setupMenuToggle();
    this.setupSidebarToggle();
    this.setActiveLink();
  }

  /**
   * Setup dropdown menu functionality
   */
  setupMenuToggle() {
    const menuLinks = this.sidebarMenu.querySelectorAll('li a');
    
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const listItem = link.parentElement;
        const dropdownMenu = listItem.querySelector('.dropdown-menu');
        
        if (!dropdownMenu) return;
        
        e.preventDefault();
        
        if (listItem.classList.contains('open')) {
          this.closeDropdown(listItem, dropdownMenu);
        } else {
          this.closeAllDropdowns();
          this.openDropdown(listItem, dropdownMenu);
        }
      });
    });
  }

  /**
   * Open dropdown with smooth animation
   */
  openDropdown(listItem, dropdownMenu) {
    listItem.classList.add('open');
    dropdownMenu.style.display = 'block';
    dropdownMenu.style.height = '0px';
    dropdownMenu.style.overflow = 'hidden';
    
    // Get the natural height
    const height = dropdownMenu.scrollHeight;
    
    // Animate to full height
    dropdownMenu.animate([
      { height: '0px' },
      { height: `${height}px` }
    ], {
      duration: 200,
      easing: 'ease-out'
    }).onfinish = () => {
      dropdownMenu.style.height = 'auto';
      dropdownMenu.style.overflow = 'visible';
    };
  }

  /**
   * Close dropdown with smooth animation
   */
  closeDropdown(listItem, dropdownMenu) {
    const height = dropdownMenu.scrollHeight;
    
    dropdownMenu.style.height = `${height}px`;
    dropdownMenu.style.overflow = 'hidden';
    
    dropdownMenu.animate([
      { height: `${height}px` },
      { height: '0px' }
    ], {
      duration: 200,
      easing: 'ease-in'
    }).onfinish = () => {
      listItem.classList.remove('open');
      dropdownMenu.style.display = 'none';
      dropdownMenu.style.height = '';
      dropdownMenu.style.overflow = '';
    };
  }

  /**
   * Close all open dropdowns
   */
  closeAllDropdowns() {
    const openItems = this.sidebarMenu.querySelectorAll('li.open');
    
    openItems.forEach(item => {
      const dropdownMenu = item.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        this.closeDropdown(item, dropdownMenu);
      }
    });
  }

  /**
   * Setup sidebar toggle functionality
   */
  setupSidebarToggle() {
    // Handle mobile sidebar toggle links (inside .sidebar-toggle divs)
    this.sidebarToggleLinks.forEach(link => {
      if (link && this.app) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('Mobile sidebar toggle clicked');
          this.toggleSidebar();
        });
      }
    });

    // Handle the main topbar sidebar toggle
    if (this.sidebarToggleById && this.app) {
      this.sidebarToggleById.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Main sidebar toggle clicked');
        this.toggleSidebar();
      });
    }
  }

  /**
   * Toggle sidebar and handle resize events properly
   */
  toggleSidebar() {
    this.app.classList.toggle('is-collapsed');
    
    // Only trigger resize for masonry, but avoid chart redraw issues
    setTimeout(() => {
      // Dispatch a custom event instead of generic resize to avoid chart issues
      window.dispatchEvent(new CustomEvent('sidebar:toggle', {
        detail: { collapsed: this.app.classList.contains('is-collapsed') }
      }));
      
      // Still trigger resize for masonry but with a specific check
      if (window.EVENT) {
        window.dispatchEvent(window.EVENT);
      }
    }, 300);
  }

  /**
   * Set active link based on current URL
   */
  setActiveLink() {
    const sidebarLinks = this.sidebar.querySelectorAll('.sidebar-link');
    const currentPath = window.location.pathname.substr(1);
    
    sidebarLinks.forEach(link => {
      link.classList.remove('active');
      
      const href = link.getAttribute('href');
      if (!href) return;
      
      const pattern = href.startsWith('/') ? href.substr(1) : href;
      
      if (pattern === currentPath) {
        link.classList.add('active');
      }
    });
  }

  /**
   * Public method to refresh active links (useful for SPA navigation)
   */
  refreshActiveLink() {
    this.setActiveLink();
  }

  /**
   * Public method to toggle sidebar programmatically
   */
  toggle() {
    if (this.app) {
      this.app.classList.toggle('is-collapsed');
    }
  }

  /**
   * Public method to check if sidebar is collapsed
   */
  isCollapsed() {
    return this.app ? this.app.classList.contains('is-collapsed') : false;
  }
}

export default Sidebar; 