// Simple vanilla JS tooltip and popover implementation
export default (function () {
  
  // Simple tooltip implementation
  function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    
    tooltipElements.forEach(element => {
      const tooltipText = element.getAttribute('data-bs-title') || element.getAttribute('title');
      
      if (tooltipText) {
        element.addEventListener('mouseenter', function() {
          const tooltip = document.createElement('div');
          tooltip.className = 'custom-tooltip';
          tooltip.textContent = tooltipText;
          tooltip.style.cssText = `
            position: absolute;
            background: #000;
            color: #fff;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1050;
            pointer-events: none;
            white-space: nowrap;
          `;
          
          document.body.appendChild(tooltip);
          
          const rect = element.getBoundingClientRect();
          tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)  }px`;
          tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5  }px`;
          
          element._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
          if (element._tooltip) {
            element._tooltip.remove();
            element._tooltip = null;
          }
        });
      }
    });
  }
  
  // Simple popover implementation
  function initPopovers() {
    const popoverElements = document.querySelectorAll('[data-bs-toggle="popover"]');
    
    popoverElements.forEach(element => {
      const popoverContent = element.getAttribute('data-bs-content');
      const popoverTitle = element.getAttribute('data-bs-title');
      
      if (popoverContent) {
        element.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Remove existing popover
          if (element._popover) {
            element._popover.remove();
            element._popover = null;
            return;
          }
          
          const popover = document.createElement('div');
          popover.className = 'custom-popover';
          popover.innerHTML = `
            ${popoverTitle ? `<div class="popover-title">${popoverTitle}</div>` : ''}
            <div class="popover-content">${popoverContent}</div>
          `;
          popover.style.cssText = `
            position: absolute;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 1050;
            min-width: 200px;
            max-width: 300px;
          `;
          
          document.body.appendChild(popover);
          
          const rect = element.getBoundingClientRect();
          popover.style.left = `${rect.left  }px`;
          popover.style.top = `${rect.bottom + 5  }px`;
          
          element._popover = popover;
        });
      }
    });
  }
  
  // Initialize both
  initTooltips();
  initPopovers();
  
  // Close popovers when clicking outside
  document.addEventListener('click', function(e) {
    const popovers = document.querySelectorAll('.custom-popover');
    popovers.forEach(popover => {
      if (!popover.contains(e.target)) {
        popover.remove();
      }
    });
  });
  
}());
