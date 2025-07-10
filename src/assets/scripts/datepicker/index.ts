/**
 * Enhanced HTML5 DatePicker with TypeScript
 * Modern date picker implementation using native HTML5 input[type="date"]
 */

import DateUtils from '../utils/date';
import type { ComponentInterface } from '../../types';

// Type definitions for DatePicker
export interface DatePickerOptions {
  format?: string;
  autoclose?: boolean;
  todayHighlight?: boolean;
  minDate?: string;
  maxDate?: string;
  startDate?: string;
  endDate?: string;
  daysOfWeekDisabled?: number[];
  datesDisabled?: string[];
  weekStart?: number;
  language?: string;
}

export interface DatePickerEvent {
  date: string;
  formattedDate: string;
  dateObject: Date;
  isValid: boolean;
}

export interface DatePickerValidation {
  isValid: boolean;
  errors: string[];
}

declare global {
  interface HTMLInputElement {
    vanillaDatePicker?: VanillaDatePicker;
    showPicker?: () => void;
  }
}

// Enhanced HTML5 date picker with vanilla JS
export class VanillaDatePicker implements ComponentInterface {
  public name: string = 'VanillaDatePicker';
  public element: HTMLInputElement;
  public options: DatePickerOptions;
  public isInitialized: boolean = false;

  private wrapper: HTMLElement | null = null;
  private todayIndicator: HTMLElement | null = null;
  private validationErrors: string[] = [];

  constructor(element: HTMLInputElement, options: DatePickerOptions = {}) {
    this.element = element;
    this.options = {
      format: 'yyyy-mm-dd',
      autoclose: true,
      todayHighlight: true,
      weekStart: 0,
      language: 'en',
      ...options,
    };

    this.init();
  }

  public init(): void {
    this.convertToHTML5();
    this.enhanceInput();
    this.applyStyles();
    this.bindEvents();
    this.validateConstraints();
    this.addTodayHighlight();
    this.isInitialized = true;
  }

  public destroy(): void {
    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.parentNode.replaceChild(this.element, this.wrapper);
    }
    this.isInitialized = false;
  }

  private convertToHTML5(): void {
    // Convert input to HTML5 date type
    this.element.type = 'date';
    this.element.classList.add('form-control', 'vanilla-datepicker');

    // Remove placeholder since HTML5 date inputs don't need it
    this.element.removeAttribute('placeholder');

    // Set constraints
    if (this.options.minDate) {
      this.element.min = this.options.minDate;
    }
    if (this.options.maxDate) {
      this.element.max = this.options.maxDate;
    }

    // Set default value if no value is set
    if (!this.element.value) {
      if (this.options.startDate) {
        this.element.value = this.options.startDate;
      } else if (this.options.todayHighlight) {
        this.element.value = DateUtils.formatters.inputDate(DateUtils.now());
      }
    }

    // Ensure proper styling
    this.element.style.minHeight = '38px';
    this.element.style.lineHeight = '1.5';
    this.element.style.cursor = 'pointer';

    // Add ARIA attributes
    this.element.setAttribute('aria-label', 'Select date');
    this.element.setAttribute('role', 'textbox');
    this.element.setAttribute('aria-expanded', 'false');
  }

  private enhanceInput(): void {
    // Create wrapper for enhanced functionality
    const wrapper = document.createElement('div');
    wrapper.className = 'vanilla-datepicker-wrapper';
    wrapper.style.position = 'relative';

    // Wrap the input
    const parent = this.element.parentNode;
    if (parent) {
      parent.insertBefore(wrapper, this.element);
      wrapper.appendChild(this.element);
    }

    // Add calendar icon if input is in an input group
    const inputGroup = this.element.closest('.input-group');
    if (inputGroup) {
      const calendarIcon = inputGroup.querySelector<HTMLElement>('.input-group-text i.ti-calendar');
      if (calendarIcon) {
        calendarIcon.addEventListener('click', this.handleIconClick.bind(this));
        calendarIcon.style.cursor = 'pointer';
        calendarIcon.setAttribute('tabindex', '0');
        calendarIcon.setAttribute('role', 'button');
        calendarIcon.setAttribute('aria-label', 'Open calendar');
      }
    }

    this.wrapper = wrapper;
  }

  private applyStyles(): void {
    const styleId = 'vanilla-datepicker-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .vanilla-datepicker-wrapper {
        position: relative;
        display: inline-block;
        width: 100%;
      }
      
      .vanilla-datepicker {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--c-border, #ced4da);
        border-radius: 4px;
        background-color: var(--c-bkg-card, #fff);
        color: var(--c-text-base, #495057);
        font-size: 14px;
        font-family: inherit;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      }
      
      .vanilla-datepicker:focus {
        outline: none;
        border-color: var(--c-primary, #007bff);
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }
      
      .vanilla-datepicker:invalid {
        border-color: var(--c-danger, #dc3545);
      }
      
      .vanilla-datepicker:invalid:focus {
        border-color: var(--c-danger, #dc3545);
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
      }
      
      .vanilla-datepicker::-webkit-calendar-picker-indicator {
        cursor: pointer;
        border-radius: 4px;
        margin-right: 2px;
        opacity: 0.6;
        transition: opacity 0.15s ease-in-out;
        filter: var(--datepicker-icon-filter, none);
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
        --datepicker-icon-filter: invert(1);
      }
      
      .datepicker-today-indicator {
        position: absolute;
        top: 4px;
        right: 12px;
        width: 6px;
        height: 6px;
        background-color: var(--c-primary, #007bff);
        border-radius: 50%;
        opacity: 0.8;
        pointer-events: none;
        z-index: 1;
      }
      
      .datepicker-animation {
        animation: datepicker-highlight 0.3s ease-in-out;
      }
      
      @keyframes datepicker-highlight {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
      }
      
      .datepicker-error {
        border-color: var(--c-danger, #dc3545) !important;
      }
      
      .datepicker-error:focus {
        border-color: var(--c-danger, #dc3545) !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
      }
      
      .datepicker-validation-feedback {
        display: block;
        width: 100%;
        margin-top: 0.25rem;
        font-size: 0.875rem;
        color: var(--c-danger, #dc3545);
      }
      
      /* Responsive design */
      @media (max-width: 768px) {
        .vanilla-datepicker {
          padding: 10px 12px;
          font-size: 16px; /* Prevent zoom on iOS */
        }
        
        .vanilla-datepicker::-webkit-calendar-picker-indicator {
          width: 20px;
          height: 20px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  private bindEvents(): void {
    // Handle click events
    this.element.addEventListener('click', this.handleClick.bind(this));

    // Handle keyboard events
    this.element.addEventListener('keydown', this.handleKeydown.bind(this));

    // Handle change events
    this.element.addEventListener('change', this.handleChange.bind(this));

    // Handle focus events
    this.element.addEventListener('focus', this.handleFocus.bind(this));

    // Handle blur events
    this.element.addEventListener('blur', this.handleBlur.bind(this));

    // Handle input events for real-time validation
    this.element.addEventListener('input', this.handleInput.bind(this));
  }

  private handleClick(): void {
    this.openPicker();
  }

  private handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.openPicker();
    }
  }

  private handleChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.handleDateChange(target.value);
  }

  private handleFocus(): void {
    this.element.classList.add('datepicker-animation');
    this.element.setAttribute('aria-expanded', 'true');
    setTimeout(() => {
      this.element.classList.remove('datepicker-animation');
    }, 300);
  }

  private handleBlur(): void {
    this.element.setAttribute('aria-expanded', 'false');
    this.validateInput();
  }

  private handleInput(): void {
    this.validateInput();
  }

  private handleIconClick(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.openPicker();
  }

  private openPicker(): void {
    this.element.focus();

    // Try to open the native date picker
    if (this.element.showPicker && typeof this.element.showPicker === 'function') {
      try {
        this.element.showPicker();
      } catch (error) {
        console.warn('DatePicker: showPicker not supported', error);
      }
    }
  }

  private handleDateChange(selectedDate: string): void {
    if (selectedDate) {
      // Add visual feedback
      this.element.classList.add('datepicker-animation');
      setTimeout(() => {
        this.element.classList.remove('datepicker-animation');
      }, 300);

      // Validate the date
      const validation = this.validateDate(selectedDate);

      // Create event data
      const eventData: DatePickerEvent = {
        date: selectedDate,
        formattedDate: this.formatDate(selectedDate),
        dateObject: new Date(selectedDate),
        isValid: validation.isValid,
      };

      // Trigger custom event
      const changeEvent = new CustomEvent('datepicker:change', {
        detail: eventData,
        bubbles: true,
      });
      this.element.dispatchEvent(changeEvent);

      // Update validation state
      this.updateValidationState(validation);
    }
  }

  private validateConstraints(): void {
    // Set up date constraints based on options
    if (this.options.datesDisabled && this.options.datesDisabled.length > 0) {
      this.element.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        if (this.options.datesDisabled!.includes(target.value)) {
          this.addValidationError('This date is disabled');
        }
      });
    }

    if (this.options.daysOfWeekDisabled && this.options.daysOfWeekDisabled.length > 0) {
      this.element.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        const date = new Date(target.value);
        const dayOfWeek = date.getDay();
        if (this.options.daysOfWeekDisabled!.includes(dayOfWeek)) {
          this.addValidationError('This day of the week is disabled');
        }
      });
    }
  }

  private validateDate(dateString: string): DatePickerValidation {
    const errors: string[] = [];
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format');
    }

    // Check min/max constraints
    if (this.options.minDate) {
      const minDate = new Date(this.options.minDate);
      if (date < minDate) {
        errors.push(`Date must be after ${this.formatDate(this.options.minDate)}`);
      }
    }

    if (this.options.maxDate) {
      const maxDate = new Date(this.options.maxDate);
      if (date > maxDate) {
        errors.push(`Date must be before ${this.formatDate(this.options.maxDate)}`);
      }
    }

    // Check disabled dates
    if (this.options.datesDisabled && this.options.datesDisabled.includes(dateString)) {
      errors.push('This date is disabled');
    }

    // Check disabled days of week
    if (this.options.daysOfWeekDisabled && this.options.daysOfWeekDisabled.includes(date.getDay())) {
      errors.push('This day of the week is disabled');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private validateInput(): void {
    const value = this.element.value;
    if (value) {
      const validation = this.validateDate(value);
      this.updateValidationState(validation);
    } else {
      this.clearValidationState();
    }
  }

  private updateValidationState(validation: DatePickerValidation): void {
    this.validationErrors = validation.errors;

    // Remove existing validation feedback
    this.clearValidationFeedback();

    if (!validation.isValid) {
      // Add error class
      this.element.classList.add('datepicker-error');

      // Add validation feedback
      const feedback = document.createElement('div');
      feedback.className = 'datepicker-validation-feedback';
      feedback.textContent = validation.errors.join(', ');

      if (this.wrapper) {
        this.wrapper.appendChild(feedback);
      }

      // Set ARIA attributes
      this.element.setAttribute('aria-invalid', 'true');
      this.element.setAttribute('aria-describedby', 'datepicker-error');
      feedback.id = 'datepicker-error';
    } else {
      this.clearValidationState();
    }
  }

  private clearValidationState(): void {
    this.element.classList.remove('datepicker-error');
    this.element.setAttribute('aria-invalid', 'false');
    this.element.removeAttribute('aria-describedby');
    this.validationErrors = [];
    this.clearValidationFeedback();
  }

  private clearValidationFeedback(): void {
    if (this.wrapper) {
      const existingFeedback = this.wrapper.querySelector('.datepicker-validation-feedback');
      if (existingFeedback) {
        existingFeedback.remove();
      }
    }
  }

  private addValidationError(error: string): void {
    if (!this.validationErrors.includes(error)) {
      this.validationErrors.push(error);
    }
  }

  private addTodayHighlight(): void {
    if (this.options.todayHighlight) {
      const today = DateUtils.formatters.inputDate(DateUtils.now());
      if (this.element.value === today) {
        this.todayIndicator = document.createElement('div');
        this.todayIndicator.className = 'datepicker-today-indicator';
        this.todayIndicator.title = 'Today';
        
        if (this.wrapper) {
          this.wrapper.appendChild(this.todayIndicator);
        }
      }
    }
  }

  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return DateUtils.format(date, this.options.format || 'yyyy-mm-dd');
    } catch (error) {
      return dateString;
    }
  }

  // Public API methods
  public setDate(dateString: string): void {
    this.element.value = dateString;
    this.handleDateChange(dateString);
  }

  public getDate(): string {
    return this.element.value;
  }

  public getFormattedDate(): string {
    return this.formatDate(this.element.value);
  }

  public getDateObject(): Date | null {
    return this.element.value ? new Date(this.element.value) : null;
  }

  public isValid(): boolean {
    return this.validationErrors.length === 0;
  }

  public getValidationErrors(): string[] {
    return [...this.validationErrors];
  }

  public setMinDate(dateString: string): void {
    this.options.minDate = dateString;
    this.element.min = dateString;
    this.validateInput();
  }

  public setMaxDate(dateString: string): void {
    this.options.maxDate = dateString;
    this.element.max = dateString;
    this.validateInput();
  }

  public reset(): void {
    this.element.value = '';
    this.clearValidationState();
    if (this.todayIndicator) {
      this.todayIndicator.remove();
      this.todayIndicator = null;
    }
  }

  public enable(): void {
    this.element.disabled = false;
  }

  public disable(): void {
    this.element.disabled = true;
  }

  public updateOptions(newOptions: Partial<DatePickerOptions>): void {
    this.options = { ...this.options, ...newOptions };
    this.validateConstraints();
    this.validateInput();
  }
}

// DatePicker Manager
export class DatePickerManager {
  private instances: Map<string, VanillaDatePicker> = new Map();

  public initialize(selector: string, options: DatePickerOptions = {}): VanillaDatePicker[] {
    const elements = document.querySelectorAll<HTMLInputElement>(selector);
    const instances: VanillaDatePicker[] = [];

    elements.forEach((element, index) => {
      // Clean up existing instance
      if (element.vanillaDatePicker) {
        element.vanillaDatePicker.destroy();
      }

      // Create new instance
      const datePicker = new VanillaDatePicker(element, options);
      element.vanillaDatePicker = datePicker;

      // Store in manager
      const key = `${selector}-${index}`;
      this.instances.set(key, datePicker);
      instances.push(datePicker);
    });

    return instances;
  }

  public getInstances(selector: string): VanillaDatePicker[] {
    const instances: VanillaDatePicker[] = [];
    this.instances.forEach((instance, key) => {
      if (key.startsWith(selector)) {
        instances.push(instance);
      }
    });
    return instances;
  }

  public destroyInstances(selector: string): void {
    const keysToDelete: string[] = [];
    this.instances.forEach((instance, key) => {
      if (key.startsWith(selector)) {
        instance.destroy();
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.instances.delete(key));
  }

  public destroyAll(): void {
    this.instances.forEach(instance => instance.destroy());
    this.instances.clear();
  }
}

// Create singleton manager
const datePickerManager = new DatePickerManager();

// Initialize date pickers
const initializeDatePickers = (): void => {
  // Start date pickers
  datePickerManager.initialize('.start-date', {
    format: 'yyyy-mm-dd',
    autoclose: true,
    todayHighlight: true,
  });

  // End date pickers
  datePickerManager.initialize('.end-date', {
    format: 'yyyy-mm-dd',
    autoclose: true,
    todayHighlight: true,
  });

  // Generic date pickers
  datePickerManager.initialize('input[type="date"]:not(.start-date):not(.end-date)', {
    format: 'yyyy-mm-dd',
    autoclose: true,
    todayHighlight: true,
  });
};

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDatePickers);
} else {
  initializeDatePickers();
}

// Reinitialize on theme change
window.addEventListener('adminator:themeChanged', () => {
  setTimeout(initializeDatePickers, 100);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  datePickerManager.destroyAll();
});

// Export default for compatibility
export default {
  init: initializeDatePickers,
  manager: datePickerManager,
  VanillaDatePicker,
  DatePickerManager,
};