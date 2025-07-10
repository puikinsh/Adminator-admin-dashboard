/**
 * Modern Date Utilities with TypeScript
 * Using Day.js (2KB) instead of Moment.js (67KB) - 97% size reduction
 * Provides consistent date formatting and manipulation across the application
 */

import dayjs, { Dayjs, ConfigType, UnitType, ManipulateType } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isBetween from 'dayjs/plugin/isBetween';

// Enable Day.js plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(isBetween);

// Type definitions
export interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayjs: Dayjs;
}

export interface CalendarMonth {
  month: string;
  year: number;
  monthIndex: number;
  days: CalendarDay[];
}

export interface WeekDay {
  date: string;
  day: number;
  dayName: string;
  shortDayName: string;
  isToday: boolean;
  dayjs: Dayjs;
}

export interface WeekData {
  weekStart: string;
  weekEnd: string;
  days: WeekDay[];
}

export interface ChartDatePoint {
  date: string;
  label: string;
  value: string;
  dayjs: Dayjs;
}

export type DateInput = ConfigType;
export type DateUnit = UnitType;
export type DateManipulateUnit = ManipulateType;

export interface DateFormatters {
  shortDate: (date: DateInput) => string;
  longDate: (date: DateInput) => string;
  dateTime: (date: DateInput) => string;
  calendarDate: (date: DateInput) => string;
  calendarDateTime: (date: DateInput) => string;
  inputDate: (date: DateInput) => string;
  inputDateTime: (date: DateInput) => string;
  timeOnly: (date: DateInput) => string;
  monthYear: (date: DateInput) => string;
  dayMonth: (date: DateInput) => string;
  relative: (date: DateInput) => string;
  relativeCalendar: (date: DateInput) => string;
}

export interface DateCalendarUtils {
  getMonthData: (date?: DateInput) => CalendarMonth;
  getWeekData: (date?: DateInput) => WeekData;
}

export interface DateFormUtils {
  toInputValue: (date: DateInput) => string;
  toDateTimeInputValue: (date: DateInput) => string;
  fromInputValue: (value: string) => Dayjs;
  validateDateInput: (value: string) => boolean;
}

export interface DateChartUtils {
  generateDateRange: (start: DateInput, end: DateInput, interval?: DateManipulateUnit) => ChartDatePoint[];
  getChartLabels: (period?: 'week' | 'month' | 'year') => string[];
}

export interface DateTimezoneUtils {
  convert: (date: DateInput, tz: string) => Dayjs;
  utc: (date: DateInput) => Dayjs;
  local: (date: DateInput) => Dayjs;
  guess: () => string;
}

export interface DateUtilsInterface {
  now: () => Dayjs;
  parse: (input: DateInput, format?: string) => Dayjs;
  format: (date: DateInput, format?: string) => string;
  formatters: DateFormatters;
  add: (date: DateInput, amount: number, unit: DateManipulateUnit) => Dayjs;
  subtract: (date: DateInput, amount: number, unit: DateManipulateUnit) => Dayjs;
  startOf: (date: DateInput, unit: DateUnit) => Dayjs;
  endOf: (date: DateInput, unit: DateUnit) => Dayjs;
  isBefore: (date1: DateInput, date2: DateInput) => boolean;
  isAfter: (date1: DateInput, date2: DateInput) => boolean;
  isSame: (date1: DateInput, date2: DateInput, unit?: DateUnit) => boolean;
  isBetween: (date: DateInput, start: DateInput, end: DateInput) => boolean;
  isValid: (date: DateInput) => boolean;
  timezone: DateTimezoneUtils;
  calendar: DateCalendarUtils;
  form: DateFormUtils;
  charts: DateChartUtils;
}

export const DateUtils: DateUtilsInterface = {
  /**
   * Get current date/time
   */
  now: (): Dayjs => dayjs(),

  /**
   * Parse date from string or Date object
   */
  parse: (input: DateInput, format?: string): Dayjs => {
    return format ? dayjs(input, format) : dayjs(input);
  },

  /**
   * Format date for display
   */
  format: (date: DateInput, format: string = 'YYYY-MM-DD'): string => {
    return dayjs(date).format(format);
  },

  /**
   * Common date formatting presets
   */
  formatters: {
    // Dashboard display formats
    shortDate: (date: DateInput): string => dayjs(date).format('MMM DD, YYYY'),
    longDate: (date: DateInput): string => dayjs(date).format('MMMM DD, YYYY'),
    dateTime: (date: DateInput): string => dayjs(date).format('MMM DD, YYYY h:mm A'),
    
    // Calendar formats
    calendarDate: (date: DateInput): string => dayjs(date).format('YYYY-MM-DD'),
    calendarDateTime: (date: DateInput): string => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    
    // Form input formats
    inputDate: (date: DateInput): string => dayjs(date).format('YYYY-MM-DD'),
    inputDateTime: (date: DateInput): string => dayjs(date).format('YYYY-MM-DDTHH:mm'),
    
    // Display formats
    timeOnly: (date: DateInput): string => dayjs(date).format('h:mm A'),
    monthYear: (date: DateInput): string => dayjs(date).format('MMMM YYYY'),
    dayMonth: (date: DateInput): string => dayjs(date).format('DD MMM'),
    
    // Relative time
    relative: (date: DateInput): string => dayjs(date).fromNow(),
    relativeCalendar: (date: DateInput): string => {
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
  add: (date: DateInput, amount: number, unit: DateManipulateUnit): Dayjs => 
    dayjs(date).add(amount, unit),
  
  subtract: (date: DateInput, amount: number, unit: DateManipulateUnit): Dayjs => 
    dayjs(date).subtract(amount, unit),
  
  startOf: (date: DateInput, unit: DateUnit): Dayjs => 
    dayjs(date).startOf(unit),
  
  endOf: (date: DateInput, unit: DateUnit): Dayjs => 
    dayjs(date).endOf(unit),

  /**
   * Date comparison
   */
  isBefore: (date1: DateInput, date2: DateInput): boolean => 
    dayjs(date1).isBefore(dayjs(date2)),
  
  isAfter: (date1: DateInput, date2: DateInput): boolean => 
    dayjs(date1).isAfter(dayjs(date2)),
  
  isSame: (date1: DateInput, date2: DateInput, unit: DateUnit = 'day'): boolean => 
    dayjs(date1).isSame(dayjs(date2), unit),
  
  isBetween: (date: DateInput, start: DateInput, end: DateInput): boolean => 
    dayjs(date).isBetween(dayjs(start), dayjs(end)),

  /**
   * Date validation
   */
  isValid: (date: DateInput): boolean => dayjs(date).isValid(),

  /**
   * Timezone utilities
   */
  timezone: {
    convert: (date: DateInput, tz: string): Dayjs => dayjs(date).tz(tz),
    utc: (date: DateInput): Dayjs => dayjs(date).utc(),
    local: (date: DateInput): Dayjs => dayjs(date).local(),
    guess: (): string => dayjs.tz.guess(),
  },

  /**
   * Calendar utilities
   */
  calendar: {
    // Get calendar month data for building calendar views
    getMonthData: (date?: DateInput): CalendarMonth => {
      const target = date ? dayjs(date) : dayjs();
      const startOfMonth = target.startOf('month');
      const endOfMonth = target.endOf('month');
      const startOfCalendar = startOfMonth.startOf('week');
      const endOfCalendar = endOfMonth.endOf('week');
      
      const days: CalendarDay[] = [];
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
    getWeekData: (date?: DateInput): WeekData => {
      const target = date ? dayjs(date) : dayjs();
      const startOfWeek = target.startOf('week');
      const endOfWeek = target.endOf('week');
      
      const days: WeekDay[] = [];
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
    toInputValue: (date: DateInput): string => dayjs(date).format('YYYY-MM-DD'),
    toDateTimeInputValue: (date: DateInput): string => dayjs(date).format('YYYY-MM-DDTHH:mm'),
    
    // Parse from HTML5 input
    fromInputValue: (value: string): Dayjs => dayjs(value),
    
    // Validate date input
    validateDateInput: (value: string): boolean => {
      const parsed = dayjs(value);
      return parsed.isValid() && value.length >= 8; // Basic validation
    },
  },

  /**
   * Chart/Data utilities
   */
  charts: {
    // Generate date ranges for charts
    generateDateRange: (
      start: DateInput, 
      end: DateInput, 
      interval: DateManipulateUnit = 'day'
    ): ChartDatePoint[] => {
      const dates: ChartDatePoint[] = [];
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
    getChartLabels: (period: 'week' | 'month' | 'year' = 'week'): string[] => {
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