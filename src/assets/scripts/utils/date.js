/**
 * Modern Date Utilities
 * Using Day.js (2KB) instead of Moment.js (67KB) - 97% size reduction
 * Provides consistent date formatting and manipulation across the application
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';

// Enable Day.js plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

export const DateUtils = {
  /**
   * Get current date/time
   */
  now: () => dayjs(),

  /**
   * Parse date from string or Date object
   */
  parse: (input, format = null) => {
    return format ? dayjs(input, format) : dayjs(input);
  },

  /**
   * Format date for display
   */
  format: (date, format = 'YYYY-MM-DD') => {
    return dayjs(date).format(format);
  },

  /**
   * Common date formatting presets
   */
  formatters: {
    // Dashboard display formats
    shortDate: (date) => dayjs(date).format('MMM DD, YYYY'),
    longDate: (date) => dayjs(date).format('MMMM DD, YYYY'),
    dateTime: (date) => dayjs(date).format('MMM DD, YYYY h:mm A'),
    
    // Calendar formats
    calendarDate: (date) => dayjs(date).format('YYYY-MM-DD'),
    calendarDateTime: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    
    // Form input formats
    inputDate: (date) => dayjs(date).format('YYYY-MM-DD'),
    inputDateTime: (date) => dayjs(date).format('YYYY-MM-DDTHH:mm'),
    
    // Display formats
    timeOnly: (date) => dayjs(date).format('h:mm A'),
    monthYear: (date) => dayjs(date).format('MMMM YYYY'),
    dayMonth: (date) => dayjs(date).format('DD MMM'),
    
    // Relative time
    relative: (date) => dayjs(date).fromNow(),
    relativeCalendar: (date) => {
      const now = dayjs();
      const target = dayjs(date);
      const diffDays = now.diff(target, 'day');
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays === -1) return 'Tomorrow';
      if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < -1 && diffDays > -7) return `In ${Math.abs(diffDays)} days`;
      return target.format('MMM DD, YYYY');
    },
  },

  /**
   * Date manipulation
   */
  add: (date, amount, unit) => dayjs(date).add(amount, unit),
  subtract: (date, amount, unit) => dayjs(date).subtract(amount, unit),
  startOf: (date, unit) => dayjs(date).startOf(unit),
  endOf: (date, unit) => dayjs(date).endOf(unit),

  /**
   * Date comparison
   */
  isBefore: (date1, date2) => dayjs(date1).isBefore(dayjs(date2)),
  isAfter: (date1, date2) => dayjs(date1).isAfter(dayjs(date2)),
  isSame: (date1, date2, unit = 'day') => dayjs(date1).isSame(dayjs(date2), unit),
  isBetween: (date, start, end) => dayjs(date).isBetween(dayjs(start), dayjs(end)),

  /**
   * Date validation
   */
  isValid: (date) => dayjs(date).isValid(),

  /**
   * Timezone utilities
   */
  timezone: {
    convert: (date, tz) => dayjs(date).tz(tz),
    utc: (date) => dayjs(date).utc(),
    local: (date) => dayjs(date).local(),
    guess: () => dayjs.tz.guess(),
  },

  /**
   * Calendar utilities
   */
  calendar: {
    // Get calendar month data for building calendar views
    getMonthData: (date = null) => {
      const target = date ? dayjs(date) : dayjs();
      const startOfMonth = target.startOf('month');
      const endOfMonth = target.endOf('month');
      const startOfCalendar = startOfMonth.startOf('week');
      const endOfCalendar = endOfMonth.endOf('week');
      
      const days = [];
      let current = startOfCalendar;
      
      while (current.isBefore(endOfCalendar) || current.isSame(endOfCalendar, 'day')) {
        days.push({
          date: current.format('YYYY-MM-DD'),
          day: current.date(),
          isCurrentMonth: current.isSame(target, 'month'),
          isToday: current.isSame(dayjs(), 'day'),
          dayjs: current.clone(),
        });
        current = current.add(1, 'day');
      }
      
      return {
        month: target.format('MMMM YYYY'),
        year: target.year(),
        monthIndex: target.month(),
        days,
      };
    },

    // Get week data
    getWeekData: (date = null) => {
      const target = date ? dayjs(date) : dayjs();
      const startOfWeek = target.startOf('week');
      const endOfWeek = target.endOf('week');
      
      const days = [];
      let current = startOfWeek;
      
      while (current.isBefore(endOfWeek) || current.isSame(endOfWeek, 'day')) {
        days.push({
          date: current.format('YYYY-MM-DD'),
          day: current.date(),
          dayName: current.format('dddd'),
          shortDayName: current.format('ddd'),
          isToday: current.isSame(dayjs(), 'day'),
          dayjs: current.clone(),
        });
        current = current.add(1, 'day');
      }
      
      return {
        weekStart: startOfWeek.format('MMM DD'),
        weekEnd: endOfWeek.format('MMM DD, YYYY'),
        days,
      };
    },
  },

  /**
   * Form utilities
   */
  form: {
    // Convert date to HTML5 input format
    toInputValue: (date) => dayjs(date).format('YYYY-MM-DD'),
    toDateTimeInputValue: (date) => dayjs(date).format('YYYY-MM-DDTHH:mm'),
    
    // Parse from HTML5 input
    fromInputValue: (value) => dayjs(value),
    
    // Validate date input
    validateDateInput: (value) => {
      const parsed = dayjs(value);
      return parsed.isValid() && value.length >= 8; // Basic validation
    },
  },

  /**
   * Chart/Data utilities
   */
  charts: {
    // Generate date ranges for charts
    generateDateRange: (start, end, interval = 'day') => {
      const dates = [];
      let current = dayjs(start);
      const endDate = dayjs(end);
      
      while (current.isBefore(endDate) || current.isSame(endDate, interval)) {
        dates.push({
          date: current.format('YYYY-MM-DD'),
          label: current.format('MMM DD'),
          value: current.toISOString(),
          dayjs: current.clone(),
        });
        current = current.add(1, interval);
      }
      
      return dates;
    },

    // Get common chart date labels
    getChartLabels: (period = 'week') => {
      const now = dayjs();
      
      switch (period) {
      case 'week':
        return Array.from({ length: 7 }, (_, i) => 
          now.subtract(6 - i, 'day').format('ddd')
        );
      case 'month':
        return Array.from({ length: 30 }, (_, i) => 
          now.subtract(29 - i, 'day').format('DD')
        );
      case 'year':
        return Array.from({ length: 12 }, (_, i) => 
          now.subtract(11 - i, 'month').format('MMM')
        );
      default:
        return [];
      }
    },
  },
};

// Export dayjs instance for direct use when needed
export { dayjs };

// Default export
export default DateUtils; 