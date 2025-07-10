import DateUtils from '../utils/date.js';

export default (function () {
  
  // Enhanced HTML5 date picker with vanilla JS
  class VanillaDatePicker {
    constructor(element, options = {}) {
      this.element = element;
      this.options = {
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true,
        ...options,
      };
      
      this.init();
    }
    
    init() {
      this.convertToHTML5();
      this.enhanceInput();
      this.applyStyles();
      this.bindEvents();
    }
    
    convertToHTML5() {
      // Convert input to HTML5 date type
      this.element.type = 'date';
      this.element.classList.add('form-control', 'vanilla-datepicker');
      
      // Remove placeholder since HTML5 date inputs don't need it
      this.element.removeAttribute('placeholder');
      
      // Set default value to today if no value is set
      if (!this.element.value) {
        this.element.value = DateUtils.form.toInputValue(DateUtils.now());
      }
      
      // Ensure proper styling
      this.element.style.minHeight = '38px';
      this.element.style.lineHeight = '1.5';
      this.element.style.cursor = 'pointer';
    }
    
    enhanceInput() {
      // Create wrapper for enhanced functionality
      const wrapper = document.createElement('div');
      wrapper.className = 'vanilla-datepicker-wrapper';
      wrapper.style.position = 'relative';
      
      // Wrap the input
      this.element.parentNode.insertBefore(wrapper, this.element);
      wrapper.appendChild(this.element);
      
      // Add calendar icon if input is in an input group
      const inputGroup = this.element.closest('.input-group');
      if (inputGroup) {
        const calendarIcon = inputGroup.querySelector('.input-group-text i.ti-calendar');
        if (calendarIcon) {
          calendarIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openPicker();
          });
        }
      }
      
      this.wrapper = wrapper;
    }
    
    applyStyles() {
      // Add custom styles for enhanced appearance
      const style = document.createElement('style');
      style.textContent = `
        .vanilla-datepicker-wrapper {
          position: relative;
        }
        
        .vanilla-datepicker {
          width: 100%;
          padding: 6px 12px;
          border: 1px solid var(--c-border, #ced4da);
          border-radius: 4px;
          background-color: var(--c-bkg-card, #fff);
          color: var(--c-text-base, #495057);
          font-size: 14px;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        
        .vanilla-datepicker:focus {
          outline: none;
          border-color: var(--c-primary, #007bff);
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        .vanilla-datepicker::-webkit-calendar-picker-indicator {
          cursor: pointer;
          border-radius: 4px;
          margin-right: 2px;
          opacity: 0.6;
          transition: opacity 0.15s ease-in-out;
        }
        
        .vanilla-datepicker::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
        
        .vanilla-datepicker::-webkit-datetime-edit-fields-wrapper {
          padding: 0;
        }
        
        .vanilla-datepicker::-webkit-datetime-edit-month-field,
        .vanilla-datepicker::-webkit-datetime-edit-day-field,
        .vanilla-datepicker::-webkit-datetime-edit-year-field {
          color: var(--c-text-base, #495057);
        }
        
        .vanilla-datepicker::-webkit-datetime-edit-text {
          color: var(--c-text-muted, #6c757d);
        }
        
        /* Dark mode support */
        [data-theme="dark"] .vanilla-datepicker {
          background-color: var(--c-bkg-card, #1f2937);
          color: var(--c-text-base, #f9fafb);
          border-color: var(--c-border, #374151);
        }
        
        [data-theme="dark"] .vanilla-datepicker::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }
        
        .datepicker-today-indicator {
          position: absolute;
          top: 2px;
          right: 8px;
          width: 6px;
          height: 6px;
          background-color: var(--c-primary, #007bff);
          border-radius: 50%;
          opacity: 0.8;
          pointer-events: none;
        }
        
        .datepicker-animation {
          animation: datepicker-highlight 0.3s ease-in-out;
        }
        
        @keyframes datepicker-highlight {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `;
      
      // Only add the style if it doesn't exist
      if (!document.querySelector('style[data-vanilla-datepicker-styles]')) {
        style.setAttribute('data-vanilla-datepicker-styles', 'true');
        document.head.appendChild(style);
      }
    }
    
    bindEvents() {
      // Handle click events
      this.element.addEventListener('click', () => {
        this.openPicker();
      });
      
      // Handle keyboard events
      this.element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          this.openPicker();
        }
      });
      
      // Handle change events
      this.element.addEventListener('change', (e) => {
        this.handleDateChange(e);
      });
      
      // Handle focus events
      this.element.addEventListener('focus', () => {
        this.element.classList.add('datepicker-animation');
        setTimeout(() => {
          this.element.classList.remove('datepicker-animation');
        }, 300);
      });
    }
    
    openPicker() {
      this.element.focus();
      
      // Try to open the native date picker
      if (this.element.showPicker && typeof this.element.showPicker === 'function') {
        try {
          this.element.showPicker();
        } catch {
          // Fallback for browsers that don't support showPicker
        }
      }
    }
    
    handleDateChange(e) {
      const selectedDate = e.target.value;
      
      if (selectedDate) {
        // Add visual feedback
        this.element.classList.add('datepicker-animation');
        setTimeout(() => {
          this.element.classList.remove('datepicker-animation');
        }, 300);
        
        // Trigger custom event
        const changeEvent = new CustomEvent('datepicker:change', {
          detail: {
            date: selectedDate,
            formattedDate: this.formatDate(selectedDate),
          },
        });
        this.element.dispatchEvent(changeEvent);
      }
    }
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return DateUtils.format(date, this.options.format);
    }
    
    setDate(dateString) {
      this.element.value = dateString;
      this.handleDateChange({ target: this.element });
    }
    
    getDate() {
      return this.element.value;
    }
    
    destroy() {
      if (this.wrapper && this.wrapper.parentNode) {
        this.wrapper.parentNode.replaceChild(this.element, this.wrapper);
      }
    }
  }
  
  // Initialize date pickers
  const initializeDatePickers = () => {
    // Start date pickers
    const startDateElements = document.querySelectorAll('.start-date');
    startDateElements.forEach(element => {
      if (element.vanillaDatePicker) {
        element.vanillaDatePicker.destroy();
      }
      
      const datePicker = new VanillaDatePicker(element, {
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true,
      });
      
      element.vanillaDatePicker = datePicker;
    });
    
    // End date pickers
    const endDateElements = document.querySelectorAll('.end-date');
    endDateElements.forEach(element => {
      if (element.vanillaDatePicker) {
        element.vanillaDatePicker.destroy();
      }
      
      const datePicker = new VanillaDatePicker(element, {
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true,
      });
      
      element.vanillaDatePicker = datePicker;
    });
  };
  
  // Initialize on load
  initializeDatePickers();
  
  // Reinitialize on theme change
  window.addEventListener('adminator:themeChanged', () => {
    setTimeout(initializeDatePickers, 100);
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    document.querySelectorAll('.start-date, .end-date').forEach(element => {
      if (element.vanillaDatePicker) {
        element.vanillaDatePicker.destroy();
      }
    });
  });
  
  // Return public API
  return {
    init: initializeDatePickers,
    VanillaDatePicker,
  };
}());