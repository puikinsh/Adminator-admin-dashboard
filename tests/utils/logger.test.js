/**
 * Logger Utility Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Logger from '../../src/assets/scripts/utils/logger.js';

describe('Logger Utility', () => {
  const originalEnv = process.env.NODE_ENV;
  let consoleSpies;

  beforeEach(() => {
    consoleSpies = {
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
      group: vi.spyOn(console, 'group').mockImplementation(() => {}),
      groupEnd: vi.spyOn(console, 'groupEnd').mockImplementation(() => {}),
      time: vi.spyOn(console, 'time').mockImplementation(() => {}),
      timeEnd: vi.spyOn(console, 'timeEnd').mockImplementation(() => {}),
      table: vi.spyOn(console, 'table').mockImplementation(() => {})
    };
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  describe('in development mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('logs info messages', () => {
      Logger.info('Test message', { data: 'test' });
      expect(consoleSpies.info).toHaveBeenCalled();
    });

    it('logs warn messages', () => {
      Logger.warn('Warning message');
      expect(consoleSpies.warn).toHaveBeenCalled();
    });

    it('logs error messages', () => {
      Logger.error('Error message', new Error('Test'));
      expect(consoleSpies.error).toHaveBeenCalled();
    });

    it('logs debug messages', () => {
      Logger.debug('Debug message');
      expect(consoleSpies.debug).toHaveBeenCalled();
    });

    it('creates log groups', () => {
      Logger.group('Test Group');
      Logger.groupEnd();
      expect(consoleSpies.group).toHaveBeenCalled();
      expect(consoleSpies.groupEnd).toHaveBeenCalled();
    });

    it('logs timing', () => {
      Logger.time('operation');
      Logger.timeEnd('operation');
      expect(consoleSpies.time).toHaveBeenCalled();
      expect(consoleSpies.timeEnd).toHaveBeenCalled();
    });

    it('logs tables', () => {
      Logger.table([{ a: 1 }, { a: 2 }]);
      expect(consoleSpies.table).toHaveBeenCalled();
    });

    it('prefixes messages with [Adminator]', () => {
      Logger.info('Test');
      expect(consoleSpies.info).toHaveBeenCalledWith(
        expect.stringContaining('[Adminator]'),
        expect.anything()
      );
    });
  });

  describe('in production mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      // Mock window.location for the isDev check
      Object.defineProperty(window, 'location', {
        value: { hostname: 'example.com' },
        writable: true
      });
    });

    it('does not log info messages', () => {
      Logger.info('Test message');
      expect(consoleSpies.info).not.toHaveBeenCalled();
    });

    it('does not log warn messages', () => {
      Logger.warn('Warning message');
      expect(consoleSpies.warn).not.toHaveBeenCalled();
    });

    it('does not log error messages', () => {
      Logger.error('Error message');
      expect(consoleSpies.error).not.toHaveBeenCalled();
    });
  });
});
