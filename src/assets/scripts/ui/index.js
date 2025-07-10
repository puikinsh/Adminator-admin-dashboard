/**
 * UI Page Bootstrap Components
 * Vanilla JavaScript implementations for Bootstrap components
 */

export default (function () {
  
  // Modal functionality
  class VanillaModal {
    constructor(element) {
      this.element = element;
      this.modal = null;
      this.backdrop = null;
      this.isOpen = false;
      this.init();
    }
    
    init() {
      this.modal = document.querySelector(this.element.getAttribute('data-bs-target'));
      if (this.modal) {
        this.element.addEventListener('click', (e) => {
          e.preventDefault();
          this.show();
        });
        
        // Close button functionality
        const closeButtons = this.modal.querySelectorAll('[data-bs-dismiss="modal"]');
        closeButtons.forEach(btn => {
          btn.addEventListener('click', () => this.hide());
        });
        
        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal) {
            this.hide();
          }
        });
      }
    }
    
    show() {
      if (this.isOpen) return;
      
      // Create backdrop
      this.backdrop = document.createElement('div');
      this.backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(this.backdrop);
      
      // Show modal
      this.modal.style.display = 'block';
      this.modal.classList.add('show');
      document.body.classList.add('modal-open');
      
      this.isOpen = true;
      
      // Focus the modal
      this.modal.setAttribute('tabindex', '-1');
      this.modal.focus();
      
      // Escape key handler
      this.escapeHandler = (e) => {
        if (e.key === 'Escape') {
          this.hide();
        }
      };
      document.addEventListener('keydown', this.escapeHandler);
    }
    
    hide() {
      if (!this.isOpen) return;
      
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
  }
  
  // Dropdown functionality
  class VanillaDropdown {
    constructor(element) {
      this.element = element;
      this.menu = null;
      this.isOpen = false;
      this.init();
    }
    
    init() {
      this.menu = this.element.parentNode.querySelector('.dropdown-menu');
      if (this.menu) {
        this.element.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggle();
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
          if (!this.element.parentNode.contains(e.target)) {
            this.hide();
          }
        });
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.isOpen) {
            this.hide();
          }
        });
      }
    }
    
    toggle() {
      if (this.isOpen) {
        this.hide();
      } else {
        this.show();
      }
    }
    
    show() {
      if (this.isOpen) return;
      
      // Close other dropdowns
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
      });
      
      this.menu.classList.add('show');
      this.element.setAttribute('aria-expanded', 'true');
      this.isOpen = true;
    }
    
    hide() {
      if (!this.isOpen) return;
      
      this.menu.classList.remove('show');
      this.element.setAttribute('aria-expanded', 'false');
      this.isOpen = false;
    }
  }
  
  // Popover functionality
  class VanillaPopover {
    constructor(element) {
      this.element = element;
      this.popover = null;
      this.isOpen = false;
      this.init();
    }
    
    init() {
      this.element.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
      
      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!this.element.contains(e.target) && (!this.popover || !this.popover.contains(e.target))) {
          this.hide();
        }
      });
    }
    
    toggle() {
      if (this.isOpen) {
        this.hide();
      } else {
        this.show();
      }
    }
    
    show() {
      if (this.isOpen) return;
      
      // Close other popovers
      document.querySelectorAll('.popover').forEach(popover => {
        popover.remove();
      });
      
      const title = this.element.getAttribute('title') || this.element.getAttribute('data-bs-title');
      const content = this.element.getAttribute('data-bs-content');
      
      this.popover = document.createElement('div');
      this.popover.className = 'popover bs-popover-top show';
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
      const rect = this.element.getBoundingClientRect();
      this.popover.style.left = `${rect.left + (rect.width / 2) - (this.popover.offsetWidth / 2)}px`;
      this.popover.style.top = `${rect.top - this.popover.offsetHeight - 10}px`;
      
      this.isOpen = true;
    }
    
    hide() {
      if (!this.isOpen) return;
      
      if (this.popover) {
        this.popover.remove();
        this.popover = null;
      }
      this.isOpen = false;
    }
  }
  
  // Tooltip functionality
  class VanillaTooltip {
    constructor(element) {
      this.element = element;
      this.tooltip = null;
      this.init();
    }
    
    init() {
      this.element.addEventListener('mouseenter', () => this.show());
      this.element.addEventListener('mouseleave', () => this.hide());
      this.element.addEventListener('focus', () => this.show());
      this.element.addEventListener('blur', () => this.hide());
    }
    
    show() {
      if (this.tooltip) return;
      
      const title = this.element.getAttribute('title') || this.element.getAttribute('data-bs-title');
      const placement = this.element.getAttribute('data-bs-placement') || 'top';
      
      if (!title) return;
      
      this.tooltip = document.createElement('div');
      this.tooltip.className = `tooltip bs-tooltip-${placement} show`;
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
      const rect = this.element.getBoundingClientRect();
      
      switch (placement) {
      case 'top':
        this.tooltip.style.left = `${rect.left + (rect.width / 2) - (this.tooltip.offsetWidth / 2)}px`;
        this.tooltip.style.top = `${rect.top - this.tooltip.offsetHeight - 5}px`;
        break;
      case 'bottom':
        this.tooltip.style.left = `${rect.left + (rect.width / 2) - (this.tooltip.offsetWidth / 2)}px`;
        this.tooltip.style.top = `${rect.bottom + 5}px`;
        break;
      case 'left':
        this.tooltip.style.left = `${rect.left - this.tooltip.offsetWidth - 5}px`;
        this.tooltip.style.top = `${rect.top + (rect.height / 2) - (this.tooltip.offsetHeight / 2)}px`;
        break;
      case 'right':
        this.tooltip.style.left = `${rect.right + 5}px`;
        this.tooltip.style.top = `${rect.top + (rect.height / 2) - (this.tooltip.offsetHeight / 2)}px`;
        break;
      }
    }
    
    hide() {
      if (this.tooltip) {
        this.tooltip.remove();
        this.tooltip = null;
      }
    }
  }
  
  // Accordion functionality
  class VanillaAccordion {
    constructor(element) {
      this.element = element;
      this.accordion = element.closest('.accordion');
      this.target = document.querySelector(element.getAttribute('data-bs-target'));
      this.isOpen = !element.classList.contains('collapsed');
      this.init();
    }
    
    init() {
      this.element.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }
    
    toggle() {
      if (this.isOpen) {
        this.hide();
      } else {
        this.show();
      }
    }
    
    show() {
      if (this.isOpen) return;
      
      // Close other accordion items in the same parent
      const parentAccordion = this.accordion;
      if (parentAccordion) {
        const otherItems = parentAccordion.querySelectorAll('.accordion-collapse.show');
        otherItems.forEach(item => {
          if (item !== this.target) {
            item.classList.remove('show');
            const button = parentAccordion.querySelector(`[data-bs-target="#${item.id}"]`);
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
    
    hide() {
      if (!this.isOpen) return;
      
      this.target.classList.remove('show');
      this.element.classList.add('collapsed');
      this.element.setAttribute('aria-expanded', 'false');
      this.isOpen = false;
    }
  }
  
  // Initialize all components
  const initComponents = () => {
    // Initialize modals
    document.querySelectorAll('[data-bs-toggle="modal"]').forEach(element => {
      new VanillaModal(element);
    });
    
    // Initialize dropdowns
    document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(element => {
      new VanillaDropdown(element);
    });
    
    // Initialize popovers
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(element => {
      new VanillaPopover(element);
    });
    
    // Initialize tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(element => {
      new VanillaTooltip(element);
    });
    
    // Initialize accordions
    document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(element => {
      new VanillaAccordion(element);
    });
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents();
  }
  
  // Public API
  return {
    init: initComponents,
    Modal: VanillaModal,
    Dropdown: VanillaDropdown,
    Popover: VanillaPopover,
    Tooltip: VanillaTooltip,
    Accordion: VanillaAccordion,
  };
}());