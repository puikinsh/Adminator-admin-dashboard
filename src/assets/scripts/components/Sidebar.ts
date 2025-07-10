/**
 * Modern Sidebar Component with TypeScript
 * Replaces jQuery-based sidebar functionality with vanilla JavaScript
 */

import type { ComponentInterface, SidebarOptions, SidebarState, AnimationOptions } from '../../../types';

export interface SidebarEventDetail {
  collapsed: boolean;
}

export interface SidebarToggleEvent extends CustomEvent {
  detail: SidebarEventDetail;
}

declare global {
  interface Window {
    EVENT?: Event;
  }
}

export class Sidebar implements ComponentInterface {
  public name: string = 'Sidebar';
  public element: HTMLElement;
  public options: SidebarOptions;
  public isInitialized: boolean = false;

  private sidebar: HTMLElement | null;
  private sidebarMenu: HTMLElement | null;
  private sidebarToggleLinks: NodeListOf<HTMLAnchorElement>;
  private sidebarToggleById: HTMLElement | null;
  private app: HTMLElement | null;
  private state: SidebarState;

  constructor(element?: HTMLElement, options: SidebarOptions = {}) {
    this.element = element || document.body;
    this.options = {
      breakpoint: 768,
      collapsible: true,
      autoHide: true,
      animation: true,
      animationDuration: 200,
      ...options,
    };

    this.sidebar = document.querySelector('.sidebar');
    this.sidebarMenu = document.querySelector('.sidebar .sidebar-menu');
    this.sidebarToggleLinks = document.querySelectorAll('.sidebar-toggle a');
    this.sidebarToggleById = document.querySelector('#sidebar-toggle');
    this.app = document.querySelector('.app');

    this.state = {
      isCollapsed: false,
      isMobile: false,
      activeMenu: null,
    };

    this.init();
  }

  /**
   * Initialize the sidebar component
   */
  public init(): void {
    if (!this.sidebar || !this.sidebarMenu) {
      console.warn('Sidebar: Required elements not found');
      return;
    }

    this.setupMenuToggle();
    this.setupSidebarToggle();
    this.setActiveLink();
    this.handleResize();
    this.setupEventListeners();

    this.isInitialized = true;
  }

  /**
   * Destroy the sidebar component
   */
  public destroy(): void {
    this.removeEventListeners();
    this.isInitialized = false;
  }

  /**
   * Setup dropdown menu functionality
   */
  private setupMenuToggle(): void {
    if (!this.sidebarMenu) return;

    const menuLinks = this.sidebarMenu.querySelectorAll('li a');
    
    menuLinks.forEach(link => {
      link.addEventListener('click', this.handleMenuClick.bind(this));
    });
  }

  /**
   * Handle menu item click
   */
  private handleMenuClick(e: Event): void {
    const link = e.target as HTMLAnchorElement;
    const listItem = link.parentElement as HTMLLIElement;
    const dropdownMenu = listItem?.querySelector('.dropdown-menu') as HTMLElement;
    
    // If this is a regular navigation link (not dropdown), allow normal navigation
    if (!dropdownMenu) {
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
  }

  /**
   * Open dropdown with smooth animation
   */
  private openDropdown(listItem: HTMLLIElement, dropdownMenu: HTMLElement): void {
    listItem.classList.add('open');
    dropdownMenu.style.display = 'block';
    dropdownMenu.style.height = '0px';
    dropdownMenu.style.overflow = 'hidden';
    
    // Get the natural height
    const height = dropdownMenu.scrollHeight;
    
    // Animate to full height
    const animation = dropdownMenu.animate([
      { height: '0px' },
      { height: `${height}px` },
    ], {
      duration: this.options.animationDuration,
      easing: 'ease-out',
    });

    animation.onfinish = (): void => {
      dropdownMenu.style.height = 'auto';
      dropdownMenu.style.overflow = 'visible';
    };
  }

  /**
   * Close dropdown with smooth animation
   */
  private closeDropdown(listItem: HTMLLIElement, dropdownMenu: HTMLElement): void {
    const height = dropdownMenu.scrollHeight;
    
    dropdownMenu.style.height = `${height}px`;
    dropdownMenu.style.overflow = 'hidden';
    
    const animation = dropdownMenu.animate([
      { height: `${height}px` },
      { height: '0px' },
    ], {
      duration: this.options.animationDuration,
      easing: 'ease-in',
    });

    animation.onfinish = (): void => {
      listItem.classList.remove('open');
      dropdownMenu.style.display = 'none';
      dropdownMenu.style.height = '';
      dropdownMenu.style.overflow = '';
    };
  }

  /**
   * Close all open dropdowns
   */
  private closeAllDropdowns(): void {
    if (!this.sidebarMenu) return;

    const openItems = this.sidebarMenu.querySelectorAll('li.open');
    
    openItems.forEach(item => {
      const dropdownMenu = item.querySelector('.dropdown-menu') as HTMLElement;
      if (dropdownMenu) {
        this.closeDropdown(item as HTMLLIElement, dropdownMenu);
      }
      
      // Also remove the has-active-child class
      item.classList.remove('has-active-child');
    });
  }

  /**
   * Setup sidebar toggle functionality
   */
  private setupSidebarToggle(): void {
    // Handle mobile sidebar toggle links (inside .sidebar-toggle divs)
    this.sidebarToggleLinks.forEach(link => {
      if (link && this.app) {
        link.addEventListener('click', this.handleSidebarToggle.bind(this));
      }
    });

    // Handle the main topbar sidebar toggle
    if (this.sidebarToggleById && this.app) {
      this.sidebarToggleById.addEventListener('click', this.handleSidebarToggle.bind(this));
    }
  }

  /**
   * Handle sidebar toggle click
   */
  private handleSidebarToggle(e: Event): void {
    e.preventDefault();
    this.toggleSidebar();
  }

  /**
   * Toggle sidebar and handle resize events properly
   */
  private toggleSidebar(): void {
    if (!this.app) return;

    const wasCollapsed = this.state.isCollapsed;
    this.state.isCollapsed = !wasCollapsed;
    
    this.app.classList.toggle('is-collapsed');
    
    // Dispatch custom event with proper typing
    setTimeout(() => {
      const event: SidebarToggleEvent = new CustomEvent('sidebar:toggle', {
        detail: { collapsed: this.state.isCollapsed },
      }) as SidebarToggleEvent;
      
      window.dispatchEvent(event);
      
      // Still trigger resize for masonry but with a specific check
      if (window.EVENT) {
        window.dispatchEvent(window.EVENT);
      }
    }, this.options.animationDuration || 300);
  }

  /**
   * Set active link based on current URL
   */
  private setActiveLink(): void {
    if (!this.sidebar) return;

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
        const navItem = link.closest('.nav-item') as HTMLElement;
        if (navItem) {
          navItem.classList.add('actived');
          this.state.activeMenu = linkPage || null;
          
          // If this is inside a dropdown, handle parent dropdown specially
          const parentDropdown = navItem.closest('.dropdown-menu') as HTMLElement;
          if (parentDropdown) {
            const parentDropdownItem = parentDropdown.closest('.nav-item.dropdown') as HTMLElement;
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
   * Handle window resize
   */
  private handleResize(): void {
    this.state.isMobile = window.innerWidth <= (this.options.breakpoint || 768);
    
    if (this.options.autoHide && this.state.isMobile) {
      // Auto-hide logic for mobile
      this.collapse();
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * Remove event listeners
   */
  private removeEventListeners(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * Public method to refresh active links (useful for SPA navigation)
   */
  public refreshActiveLink(): void {
    this.setActiveLink();
  }

  /**
   * Public method to toggle sidebar programmatically
   */
  public toggle(): void {
    this.toggleSidebar();
  }

  /**
   * Public method to collapse sidebar
   */
  public collapse(): void {
    if (!this.app || this.state.isCollapsed) return;
    
    this.state.isCollapsed = true;
    this.app.classList.add('is-collapsed');
  }

  /**
   * Public method to expand sidebar
   */
  public expand(): void {
    if (!this.app || !this.state.isCollapsed) return;
    
    this.state.isCollapsed = false;
    this.app.classList.remove('is-collapsed');
  }

  /**
   * Public method to check if sidebar is collapsed
   */
  public isCollapsed(): boolean {
    return this.state.isCollapsed;
  }

  /**
   * Get current sidebar state
   */
  public getState(): SidebarState {
    return { ...this.state };
  }

  /**
   * Update sidebar options
   */
  public updateOptions(newOptions: Partial<SidebarOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Get current options
   */
  public getOptions(): SidebarOptions {
    return { ...this.options };
  }
}

export default Sidebar;