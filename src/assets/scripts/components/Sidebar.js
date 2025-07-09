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
        
        // If this is a regular navigation link (not dropdown), allow normal navigation
        if (!dropdownMenu) {
          // Don't prevent default for regular navigation links
          return;
        }
        
        // Only prevent default for dropdown toggles
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
      { height: `${height}px` },
    ], {
      duration: 200,
      easing: 'ease-out',
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
      { height: '0px' },
    ], {
      duration: 200,
      easing: 'ease-in',
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
      
      // Also remove the has-active-child class
      item.classList.remove('has-active-child');
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
          this.toggleSidebar();
        });
      }
    });

    // Handle the main topbar sidebar toggle
    if (this.sidebarToggleById && this.app) {
      this.sidebarToggleById.addEventListener('click', (e) => {
        e.preventDefault();
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
        detail: { collapsed: this.app.classList.contains('is-collapsed') },
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
    // Remove active class from all nav items (including dropdown items)
    const allNavItems = this.sidebar.querySelectorAll('.nav-item');
    allNavItems.forEach(item => {
      item.classList.remove('actived');
    });

    // Close all dropdowns first
    this.closeAllDropdowns();

    // Get current page filename
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    
    // Find and activate the correct nav item
    const allLinks = this.sidebar.querySelectorAll('a[href]');
    
    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === 'javascript:void(0);' || href === 'javascript:void(0)') return;
      
      // Extract filename from href
      const linkPage = href.split('/').pop();
      
      if (linkPage === currentPage) {
        const navItem = link.closest('.nav-item');
        if (navItem) {
          navItem.classList.add('actived');
          
          // If this is inside a dropdown, handle parent dropdown specially
          const parentDropdown = navItem.closest('.dropdown-menu');
          if (parentDropdown) {
            const parentDropdownItem = parentDropdown.closest('.nav-item.dropdown');
            if (parentDropdownItem) {
              // Open the parent dropdown
              parentDropdownItem.classList.add('open');
              parentDropdown.style.display = 'block';
              
              // Add special styling to indicate parent has active child
              parentDropdownItem.classList.add('has-active-child');
            }
          }
        }
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