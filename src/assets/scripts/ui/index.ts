/**
 * UI Bootstrap Components with TypeScript
 * Vanilla JavaScript implementations for Bootstrap components
 */

import type { ComponentInterface } from '../../types';

// Type definitions for UI components
export interface UIComponentOptions {
  autoInit?: boolean;
  selector?: string;
}

export interface TooltipOptions {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  animation?: boolean;
}

export interface PopoverOptions {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'click' | 'hover' | 'focus' | 'manual';
  html?: boolean;
  animation?: boolean;
}

export interface ModalOptions {
  backdrop?: boolean | 'static';
  keyboard?: boolean;
  focus?: boolean;
  show?: boolean;
}

export interface AccordionOptions {
  parent?: string;
  toggle?: boolean;
}

export interface DropdownOptions {
  offset?: [number, number];
  flip?: boolean;
  boundary?: 'clippingParents' | 'viewport' | HTMLElement;
}

// Modal functionality
export class VanillaModal implements ComponentInterface {
  public name: string = 'VanillaModal';
  public element: HTMLElement;
  public options: ModalOptions;
  public isInitialized: boolean = false;

  private modal: HTMLElement | null = null;
  private backdrop: HTMLElement | null = null;
  private isOpen: boolean = false;
  private escapeHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor(element: HTMLElement, options: ModalOptions = {}) {
    this.element = element;
    this.options = {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ...options,
    };
    this.init();
  }

  public init(): void {
    const targetSelector = this.element.getAttribute('data-bs-target');
    if (!targetSelector) {
      console.warn('Modal: Missing data-bs-target attribute');
      return;
    }

    this.modal = document.querySelector(targetSelector);
    if (!this.modal) {
      console.warn(`Modal: Target element ${targetSelector} not found`);
      return;
    }

    this.element.addEventListener('click', this.handleElementClick.bind(this));

    // Close button functionality
    const closeButtons = this.modal.querySelectorAll<HTMLElement>('[data-bs-dismiss="modal"]');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', this.hide.bind(this));
    });

    // Close on backdrop click
    if (this.options.backdrop !== false) {
      this.modal.addEventListener('click', this.handleBackdropClick.bind(this));
    }

    this.isInitialized = true;
  }

  public destroy(): void {
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
      this.escapeHandler = null;
    }
    this.hide();
    this.isInitialized = false;
  }

  private handleElementClick(e: Event): void {
    e.preventDefault();
    this.show();
  }

  private handleBackdropClick(e: Event): void {
    if (e.target === this.modal && this.options.backdrop !== 'static') {
      this.hide();
    }
  }

  public show(): void {
    if (this.isOpen || !this.modal) return;

    // Create backdrop
    if (this.options.backdrop !== false) {
      this.backdrop = document.createElement('div');
      this.backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(this.backdrop);
    }

    // Show modal
    this.modal.style.display = 'block';
    this.modal.classList.add('show');
    document.body.classList.add('modal-open');

    this.isOpen = true;

    // Focus the modal
    if (this.options.focus) {
      this.modal.setAttribute('tabindex', '-1');
      this.modal.focus();
    }

    // Escape key handler
    if (this.options.keyboard) {
      this.escapeHandler = this.handleEscapeKey.bind(this);
      document.addEventListener('keydown', this.escapeHandler);
    }
  }

  public hide(): void {
    if (!this.isOpen || !this.modal) return;

    // Hide modal
    this.modal.classList.remove('show');
    this.modal.style.display = 'none';
    document.body.classList.remove('modal-open');

    // Remove backdrop
    if (this.backdrop) {
      this.backdrop.remove();
      this.backdrop = null;
    }

    this.isOpen = false;

    // Remove escape handler
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
      this.escapeHandler = null;
    }
  }

  private handleEscapeKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.hide();
    }
  }

  public toggle(): void {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  public isVisible(): boolean {
    return this.isOpen;
  }
}

// Dropdown functionality
export class VanillaDropdown implements ComponentInterface {
  public name: string = 'VanillaDropdown';
  public element: HTMLElement;
  public options: DropdownOptions;
  public isInitialized: boolean = false;

  private menu: HTMLElement | null = null;
  private isOpen: boolean = false;
  private outsideClickHandler: ((e: Event) => void) | null = null;
  private escapeHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor(element: HTMLElement, options: DropdownOptions = {}) {
    this.element = element;
    this.options = {
      offset: [0, 2],
      flip: true,
      boundary: 'clippingParents',
      ...options,
    };
    this.init();
  }

  public init(): void {
    const parent = this.element.parentNode as HTMLElement;
    if (!parent) return;

    this.menu = parent.querySelector('.dropdown-menu');
    if (!this.menu) return;

    this.element.addEventListener('click', this.handleElementClick.bind(this));

    // Setup event handlers
    this.outsideClickHandler = this.handleOutsideClick.bind(this);
    this.escapeHandler = this.handleEscapeKey.bind(this);

    this.isInitialized = true;
  }

  public destroy(): void {
    this.hide();
    if (this.outsideClickHandler) {
      document.removeEventListener('click', this.outsideClickHandler);
      this.outsideClickHandler = null;
    }
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
      this.escapeHandler = null;
    }
    this.isInitialized = false;
  }

  private handleElementClick(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.toggle();
  }

  private handleOutsideClick(e: Event): void {
    const parent = this.element.parentNode as HTMLElement;
    if (parent && !parent.contains(e.target as Node)) {
      this.hide();
    }
  }

  private handleEscapeKey(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.isOpen) {
      this.hide();
    }
  }

  public toggle(): void {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  public show(): void {
    if (this.isOpen || !this.menu) return;

    // Close other dropdowns
    document.querySelectorAll<HTMLElement>('.dropdown-menu.show').forEach(menu => {
      menu.classList.remove('show');
    });

    this.menu.classList.add('show');
    this.element.setAttribute('aria-expanded', 'true');
    this.isOpen = true;

    // Add event listeners
    if (this.outsideClickHandler) {
      document.addEventListener('click', this.outsideClickHandler);
    }
    if (this.escapeHandler) {
      document.addEventListener('keydown', this.escapeHandler);
    }
  }

  public hide(): void {
    if (!this.isOpen || !this.menu) return;

    this.menu.classList.remove('show');
    this.element.setAttribute('aria-expanded', 'false');
    this.isOpen = false;

    // Remove event listeners
    if (this.outsideClickHandler) {
      document.removeEventListener('click', this.outsideClickHandler);
    }
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
    }
  }
}

// Popover functionality
export class VanillaPopover implements ComponentInterface {
  public name: string = 'VanillaPopover';
  public element: HTMLElement;
  public options: PopoverOptions;
  public isInitialized: boolean = false;

  private popover: HTMLElement | null = null;
  private isOpen: boolean = false;
  private outsideClickHandler: ((e: Event) => void) | null = null;

  constructor(element: HTMLElement, options: PopoverOptions = {}) {
    this.element = element;
    this.options = {
      placement: 'top',
      trigger: 'click',
      html: false,
      animation: true,
      ...options,
    };
    this.init();
  }

  public init(): void {
    if (this.options.trigger === 'click') {
      this.element.addEventListener('click', this.handleElementClick.bind(this));
    } else if (this.options.trigger === 'hover') {
      this.element.addEventListener('mouseenter', this.show.bind(this));
      this.element.addEventListener('mouseleave', this.hide.bind(this));
    } else if (this.options.trigger === 'focus') {
      this.element.addEventListener('focus', this.show.bind(this));
      this.element.addEventListener('blur', this.hide.bind(this));
    }

    this.outsideClickHandler = this.handleOutsideClick.bind(this);
    this.isInitialized = true;
  }

  public destroy(): void {
    this.hide();
    if (this.outsideClickHandler) {
      document.removeEventListener('click', this.outsideClickHandler);
      this.outsideClickHandler = null;
    }
    this.isInitialized = false;
  }

  private handleElementClick(e: Event): void {
    e.preventDefault();
    this.toggle();
  }

  private handleOutsideClick(e: Event): void {
    if (!this.element.contains(e.target as Node) && 
        (!this.popover || !this.popover.contains(e.target as Node))) {
      this.hide();
    }
  }

  public toggle(): void {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  public show(): void {
    if (this.isOpen) return;

    // Close other popovers
    document.querySelectorAll<HTMLElement>('.popover').forEach(popover => {
      popover.remove();
    });

    const title = this.element.getAttribute('title') || this.element.getAttribute('data-bs-title');
    const content = this.element.getAttribute('data-bs-content');

    if (!content) return;

    this.popover = document.createElement('div');
    this.popover.className = `popover bs-popover-${this.options.placement} show`;
    this.popover.style.position = 'absolute';
    this.popover.style.zIndex = '1070';
    this.popover.style.maxWidth = '276px';
    this.popover.style.backgroundColor = '#fff';
    this.popover.style.border = '1px solid rgba(0,0,0,.2)';
    this.popover.style.borderRadius = '6px';
    this.popover.style.boxShadow = '0 5px 10px rgba(0,0,0,.2)';

    let popoverContent = '';
    if (title) {
      popoverContent += `<div class="popover-header" style="padding: 8px 14px; margin-bottom: 0; font-size: 14px; background-color: #f7f7f7; border-bottom: 1px solid #ebebeb; border-radius: 5px 5px 0 0; font-weight: 600;">${title}</div>`;
    }
    popoverContent += `<div class="popover-body" style="padding: 9px 14px; word-wrap: break-word;">${content}</div>`;

    this.popover.innerHTML = popoverContent;
    document.body.appendChild(this.popover);

    // Position popover
    this.positionPopover();

    this.isOpen = true;

    // Add outside click handler
    if (this.outsideClickHandler) {
      document.addEventListener('click', this.outsideClickHandler);
    }
  }

  public hide(): void {
    if (!this.isOpen) return;

    if (this.popover) {
      this.popover.remove();
      this.popover = null;
    }
    this.isOpen = false;

    // Remove outside click handler
    if (this.outsideClickHandler) {
      document.removeEventListener('click', this.outsideClickHandler);
    }
  }

  private positionPopover(): void {
    if (!this.popover) return;

    const rect = this.element.getBoundingClientRect();
    const popoverRect = this.popover.getBoundingClientRect();

    switch (this.options.placement) {
      case 'top':
        this.popover.style.left = `${rect.left + (rect.width / 2) - (popoverRect.width / 2)}px`;
        this.popover.style.top = `${rect.top - popoverRect.height - 10}px`;
        break;
      case 'bottom':
        this.popover.style.left = `${rect.left + (rect.width / 2) - (popoverRect.width / 2)}px`;
        this.popover.style.top = `${rect.bottom + 10}px`;
        break;
      case 'left':
        this.popover.style.left = `${rect.left - popoverRect.width - 10}px`;
        this.popover.style.top = `${rect.top + (rect.height / 2) - (popoverRect.height / 2)}px`;
        break;
      case 'right':
        this.popover.style.left = `${rect.right + 10}px`;
        this.popover.style.top = `${rect.top + (rect.height / 2) - (popoverRect.height / 2)}px`;
        break;
    }
  }
}

// Tooltip functionality
export class VanillaTooltip implements ComponentInterface {
  public name: string = 'VanillaTooltip';
  public element: HTMLElement;
  public options: TooltipOptions;
  public isInitialized: boolean = false;

  private tooltip: HTMLElement | null = null;
  private showTimeout: number | null = null;
  private hideTimeout: number | null = null;

  constructor(element: HTMLElement, options: TooltipOptions = {}) {
    this.element = element;
    this.options = {
      placement: 'top',
      delay: 0,
      animation: true,
      ...options,
    };
    this.init();
  }

  public init(): void {
    this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    this.element.addEventListener('focus', this.handleFocus.bind(this));
    this.element.addEventListener('blur', this.handleBlur.bind(this));
    this.isInitialized = true;
  }

  public destroy(): void {
    this.hide();
    this.clearTimeouts();
    this.isInitialized = false;
  }

  private handleMouseEnter(): void {
    this.clearTimeouts();
    this.showTimeout = window.setTimeout(() => this.show(), this.options.delay);
  }

  private handleMouseLeave(): void {
    this.clearTimeouts();
    this.hideTimeout = window.setTimeout(() => this.hide(), this.options.delay);
  }

  private handleFocus(): void {
    this.show();
  }

  private handleBlur(): void {
    this.hide();
  }

  private clearTimeouts(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  public show(): void {
    if (this.tooltip) return;

    const title = this.element.getAttribute('title') || this.element.getAttribute('data-bs-title');
    if (!title) return;

    this.tooltip = document.createElement('div');
    this.tooltip.className = `tooltip bs-tooltip-${this.options.placement} show`;
    this.tooltip.style.position = 'absolute';
    this.tooltip.style.zIndex = '1070';
    this.tooltip.style.maxWidth = '200px';
    this.tooltip.style.padding = '4px 8px';
    this.tooltip.style.fontSize = '12px';
    this.tooltip.style.backgroundColor = '#000';
    this.tooltip.style.color = '#fff';
    this.tooltip.style.borderRadius = '4px';
    this.tooltip.style.pointerEvents = 'none';
    this.tooltip.style.whiteSpace = 'nowrap';

    this.tooltip.innerHTML = `<div class="tooltip-inner">${title}</div>`;
    document.body.appendChild(this.tooltip);

    // Position tooltip
    this.positionTooltip();
  }

  public hide(): void {
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }

  private positionTooltip(): void {
    if (!this.tooltip) return;

    const rect = this.element.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();

    switch (this.options.placement) {
      case 'top':
        this.tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipRect.width / 2)}px`;
        this.tooltip.style.top = `${rect.top - tooltipRect.height - 5}px`;
        break;
      case 'bottom':
        this.tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipRect.width / 2)}px`;
        this.tooltip.style.top = `${rect.bottom + 5}px`;
        break;
      case 'left':
        this.tooltip.style.left = `${rect.left - tooltipRect.width - 5}px`;
        this.tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltipRect.height / 2)}px`;
        break;
      case 'right':
        this.tooltip.style.left = `${rect.right + 5}px`;
        this.tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltipRect.height / 2)}px`;
        break;
    }
  }
}

// Accordion functionality
export class VanillaAccordion implements ComponentInterface {
  public name: string = 'VanillaAccordion';
  public element: HTMLElement;
  public options: AccordionOptions;
  public isInitialized: boolean = false;

  private accordion: HTMLElement | null = null;
  private target: HTMLElement | null = null;
  private isOpen: boolean = false;

  constructor(element: HTMLElement, options: AccordionOptions = {}) {
    this.element = element;
    this.options = {
      toggle: true,
      ...options,
    };
    this.init();
  }

  public init(): void {
    this.accordion = this.element.closest('.accordion');
    const targetSelector = this.element.getAttribute('data-bs-target');
    if (!targetSelector) return;

    this.target = document.querySelector(targetSelector);
    if (!this.target) return;

    this.isOpen = !this.element.classList.contains('collapsed');
    this.element.addEventListener('click', this.handleElementClick.bind(this));
    this.isInitialized = true;
  }

  public destroy(): void {
    this.isInitialized = false;
  }

  private handleElementClick(e: Event): void {
    e.preventDefault();
    this.toggle();
  }

  public toggle(): void {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  public show(): void {
    if (this.isOpen || !this.target) return;

    // Close other accordion items in the same parent
    if (this.accordion) {
      const otherItems = this.accordion.querySelectorAll<HTMLElement>('.accordion-collapse.show');
      otherItems.forEach(item => {
        if (item !== this.target) {
          item.classList.remove('show');
          const button = this.accordion!.querySelector<HTMLElement>(`[data-bs-target="#${item.id}"]`);
          if (button) {
            button.classList.add('collapsed');
            button.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }

    // Show this item
    this.target.classList.add('show');
    this.element.classList.remove('collapsed');
    this.element.setAttribute('aria-expanded', 'true');
    this.isOpen = true;
  }

  public hide(): void {
    if (!this.isOpen || !this.target) return;

    this.target.classList.remove('show');
    this.element.classList.add('collapsed');
    this.element.setAttribute('aria-expanded', 'false');
    this.isOpen = false;
  }
}

// UI Manager Class
export class UIManager {
  private components: Map<string, ComponentInterface> = new Map();

  public initializeComponents(): void {
    // Initialize modals
    document.querySelectorAll<HTMLElement>('[data-bs-toggle="modal"]').forEach(element => {
      const modal = new VanillaModal(element);
      this.components.set(`modal-${element.id || Date.now()}`, modal);
    });

    // Initialize dropdowns
    document.querySelectorAll<HTMLElement>('[data-bs-toggle="dropdown"]').forEach(element => {
      const dropdown = new VanillaDropdown(element);
      this.components.set(`dropdown-${element.id || Date.now()}`, dropdown);
    });

    // Initialize popovers
    document.querySelectorAll<HTMLElement>('[data-bs-toggle="popover"]').forEach(element => {
      const popover = new VanillaPopover(element);
      this.components.set(`popover-${element.id || Date.now()}`, popover);
    });

    // Initialize tooltips
    document.querySelectorAll<HTMLElement>('[data-bs-toggle="tooltip"]').forEach(element => {
      const tooltip = new VanillaTooltip(element);
      this.components.set(`tooltip-${element.id || Date.now()}`, tooltip);
    });

    // Initialize accordions
    document.querySelectorAll<HTMLElement>('[data-bs-toggle="collapse"]').forEach(element => {
      const accordion = new VanillaAccordion(element);
      this.components.set(`accordion-${element.id || Date.now()}`, accordion);
    });
  }

  public destroyComponents(): void {
    this.components.forEach(component => {
      component.destroy();
    });
    this.components.clear();
  }

  public getComponent(id: string): ComponentInterface | undefined {
    return this.components.get(id);
  }
}

// Create and export singleton instance
const uiManager = new UIManager();

// Initialize when DOM is ready
const initializeUI = (): void => {
  uiManager.initializeComponents();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUI);
} else {
  initializeUI();
}

// Export default object for compatibility
export default {
  init: initializeUI,
  manager: uiManager,
  Modal: VanillaModal,
  Dropdown: VanillaDropdown,
  Popover: VanillaPopover,
  Tooltip: VanillaTooltip,
  Accordion: VanillaAccordion,
};