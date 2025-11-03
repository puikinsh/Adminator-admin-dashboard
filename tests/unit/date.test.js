/**
 * Date Utility Tests
 * Tests for date formatting, manipulation, and validation
 */

import { DateUtils, dayjs } from '../../src/assets/scripts/utils/date.js';

describe('Date Utilities', () => {
  const testDate = '2024-01-15T10:30:00';
  const testDate2 = '2024-01-20T15:45:00';

  describe('Basic Operations', () => {
    it('should get current date', () => {
      const now = DateUtils.now();
      expect(now).toBeDefined();
      expect(dayjs.isDayjs(now)).toBe(true);
    });

    it('should parse date string', () => {
      const parsed = DateUtils.parse(testDate);
      expect(dayjs.isDayjs(parsed)).toBe(true);
      expect(parsed.isValid()).toBe(true);
    });

    it('should parse date with custom format', () => {
      const parsed = DateUtils.parse('15/01/2024', 'DD/MM/YYYY');
      expect(parsed.isValid()).toBe(true);
      expect(parsed.year()).toBe(2024);
      expect(parsed.month()).toBe(0); // January is 0
    });

    it('should format date', () => {
      const formatted = DateUtils.format(testDate, 'YYYY-MM-DD');
      expect(formatted).toBe('2024-01-15');
    });

    it('should format date with default format', () => {
      const formatted = DateUtils.format(testDate);
      expect(formatted).toBe('2024-01-15');
    });
  });

  describe('Date Formatters', () => {
    it('should format short date', () => {
      const result = DateUtils.formatters.shortDate(testDate);
      expect(result).toBe('Jan 15, 2024');
    });

    it('should format long date', () => {
      const result = DateUtils.formatters.longDate(testDate);
      expect(result).toBe('January 15, 2024');
    });

    it('should format date time', () => {
      const result = DateUtils.formatters.dateTime(testDate);
      expect(result).toContain('Jan 15, 2024');
      expect(result).toContain('10:30');
    });

    it('should format time only', () => {
      const result = DateUtils.formatters.timeOnly(testDate);
      expect(result).toContain('10:30');
    });

    it('should format month year', () => {
      const result = DateUtils.formatters.monthYear(testDate);
      expect(result).toBe('January 2024');
    });

    it('should format day month', () => {
      const result = DateUtils.formatters.dayMonth(testDate);
      expect(result).toBe('15 Jan');
    });

    it('should format input date', () => {
      const result = DateUtils.formatters.inputDate(testDate);
      expect(result).toBe('2024-01-15');
    });
  });

  describe('Date Manipulation', () => {
    it('should add days', () => {
      const result = DateUtils.add(testDate, 5, 'day');
      expect(result.format('YYYY-MM-DD')).toBe('2024-01-20');
    });

    it('should add months', () => {
      const result = DateUtils.add(testDate, 2, 'month');
      expect(result.format('YYYY-MM-DD')).toBe('2024-03-15');
    });

    it('should subtract days', () => {
      const result = DateUtils.subtract(testDate, 5, 'day');
      expect(result.format('YYYY-MM-DD')).toBe('2024-01-10');
    });

    it('should get start of month', () => {
      const result = DateUtils.startOf(testDate, 'month');
      expect(result.format('YYYY-MM-DD')).toBe('2024-01-01');
    });

    it('should get end of month', () => {
      const result = DateUtils.endOf(testDate, 'month');
      expect(result.date()).toBe(31);
    });

    it('should get start of week', () => {
      const result = DateUtils.startOf(testDate, 'week');
      expect(result.day()).toBe(0); // Sunday
    });
  });

  describe('Date Comparison', () => {
    it('should check if date is before', () => {
      expect(DateUtils.isBefore(testDate, testDate2)).toBe(true);
      expect(DateUtils.isBefore(testDate2, testDate)).toBe(false);
    });

    it('should check if date is after', () => {
      expect(DateUtils.isAfter(testDate2, testDate)).toBe(true);
      expect(DateUtils.isAfter(testDate, testDate2)).toBe(false);
    });

    it('should check if dates are same', () => {
      expect(DateUtils.isSame(testDate, testDate, 'day')).toBe(true);
      expect(DateUtils.isSame(testDate, testDate2, 'day')).toBe(false);
    });

    it('should check if date is between', () => {
      const middle = '2024-01-17';
      expect(DateUtils.isBetween(middle, testDate, testDate2)).toBe(true);
      expect(DateUtils.isBetween(testDate, middle, testDate2)).toBe(false);
    });
  });

  describe('Date Validation', () => {
    it('should validate correct date', () => {
      expect(DateUtils.isValid(testDate)).toBe(true);
    });

    it('should invalidate incorrect date', () => {
      expect(DateUtils.isValid('invalid-date')).toBe(false);
    });

    it('should validate Date object', () => {
      expect(DateUtils.isValid(new Date())).toBe(true);
    });
  });

  describe('Form Utilities', () => {
    it('should convert to input value', () => {
      const result = DateUtils.form.toInputValue(testDate);
      expect(result).toBe('2024-01-15');
    });

    it('should convert to datetime input value', () => {
      const result = DateUtils.form.toDateTimeInputValue(testDate);
      expect(result).toContain('2024-01-15');
      expect(result).toContain('10:30');
    });

    it('should parse from input value', () => {
      const result = DateUtils.form.fromInputValue('2024-01-15');
      expect(result.isValid()).toBe(true);
      expect(result.format('YYYY-MM-DD')).toBe('2024-01-15');
    });

    it('should validate date input', () => {
      expect(DateUtils.form.validateDateInput('2024-01-15')).toBe(true);
      expect(DateUtils.form.validateDateInput('invalid')).toBe(false);
      expect(DateUtils.form.validateDateInput('2024')).toBe(false);
    });
  });

  describe('Calendar Utilities', () => {
    it('should get month data', () => {
      const data = DateUtils.calendar.getMonthData(testDate);
      expect(data).toHaveProperty('month');
      expect(data).toHaveProperty('year');
      expect(data).toHaveProperty('days');
      expect(Array.isArray(data.days)).toBe(true);
      expect(data.year).toBe(2024);
    });

    it('should include all days in month', () => {
      const data = DateUtils.calendar.getMonthData(testDate);
      const currentMonthDays = data.days.filter(d => d.isCurrentMonth);
      expect(currentMonthDays.length).toBe(31); // January has 31 days
    });

    it('should mark today correctly', () => {
      const today = dayjs();
      const data = DateUtils.calendar.getMonthData(today);
      const todayDays = data.days.filter(d => d.isToday);
      expect(todayDays.length).toBe(1);
    });

    it('should get week data', () => {
      const data = DateUtils.calendar.getWeekData(testDate);
      expect(data).toHaveProperty('weekStart');
      expect(data).toHaveProperty('weekEnd');
      expect(data).toHaveProperty('days');
      expect(data.days.length).toBe(7);
    });

    it('should include day names in week data', () => {
      const data = DateUtils.calendar.getWeekData(testDate);
      data.days.forEach(day => {
        expect(day).toHaveProperty('dayName');
        expect(day).toHaveProperty('shortDayName');
      });
    });
  });

  describe('Chart Utilities', () => {
    it('should generate date range', () => {
      const start = '2024-01-01';
      const end = '2024-01-05';
      const range = DateUtils.charts.generateDateRange(start, end, 'day');
      
      expect(range.length).toBe(5);
      expect(range[0].date).toBe('2024-01-01');
      expect(range[4].date).toBe('2024-01-05');
    });

    it('should generate week labels', () => {
      const labels = DateUtils.charts.getChartLabels('week');
      expect(labels.length).toBe(7);
      expect(labels.every(l => l.length === 3)).toBe(true); // 3-letter day names
    });

    it('should generate month labels', () => {
      const labels = DateUtils.charts.getChartLabels('month');
      expect(labels.length).toBe(30);
    });

    it('should generate year labels', () => {
      const labels = DateUtils.charts.getChartLabels('year');
      expect(labels.length).toBe(12);
      expect(labels.every(l => l.length === 3)).toBe(true); // 3-letter month names
    });

    it('should return empty array for invalid period', () => {
      const labels = DateUtils.charts.getChartLabels('invalid');
      expect(labels).toEqual([]);
    });
  });

  describe('Timezone Utilities', () => {
    it('should convert to UTC', () => {
      const utc = DateUtils.timezone.utc(testDate);
      expect(utc).toBeDefined();
    });

    it('should convert to local', () => {
      const local = DateUtils.timezone.local(testDate);
      expect(local).toBeDefined();
    });

    it('should guess timezone', () => {
      const tz = DateUtils.timezone.guess();
      expect(typeof tz).toBe('string');
      expect(tz.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null date', () => {
      const now = DateUtils.calendar.getMonthData(null);
      expect(now).toBeDefined();
    });

    it('should handle invalid date string', () => {
      const result = DateUtils.parse('not-a-date');
      expect(result.isValid()).toBe(false);
    });

    it('should handle leap year', () => {
      const leapYear = '2024-02-29';
      expect(DateUtils.isValid(leapYear)).toBe(true);
    });

    it('should handle non-leap year', () => {
      const nonLeapYear = '2023-02-29';
      expect(DateUtils.isValid(nonLeapYear)).toBe(false);
    });

    it('should handle year boundaries', () => {
      const endOfYear = '2024-12-31';
      const result = DateUtils.add(endOfYear, 1, 'day');
      expect(result.format('YYYY-MM-DD')).toBe('2025-01-01');
    });
  });
});
