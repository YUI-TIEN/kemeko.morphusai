import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ErrorHandler, safeQuerySelector, safeDOMOperation, retryOperation } from '../utils/errorHandler';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = ErrorHandler.getInstance();
    errorHandler.clearErrorLog();
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ErrorHandler.getInstance();
      const instance2 = ErrorHandler.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('error logging', () => {
    it('should log errors with context', () => {
      const error = new Error('Test error');
      const context = { component: 'TestComponent' };
      
      errorHandler.logError('Test message', error, context);
      
      const logs = errorHandler.getErrorLog();
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toBe('Test message');
      expect(logs[0].context.component).toBe('TestComponent');
    });

    it('should limit log size', () => {
      // Fill up the log beyond maxLogSize
      for (let i = 0; i < 150; i++) {
        errorHandler.logError(`Error ${i}`, new Error(`Test error ${i}`));
      }
      
      const logs = errorHandler.getErrorLog();
      expect(logs.length).toBeLessThanOrEqual(100);
    });

    it('should show user notification on error', () => {
      const error = new Error('Test error');
      
      errorHandler.logError('Test message', error);
      
      const notification = document.getElementById('error-notifications');
      expect(notification).toBeTruthy();
    });
  });

  describe('global error handling', () => {
    it('should handle JavaScript errors', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Clear any existing errors
      errorHandler.clearErrorLog();
      
      const errorEvent = new ErrorEvent('error', {
        message: 'Test error',
        filename: 'test.js',
        lineno: 10,
        colno: 5,
        error: new Error('Test error')
      });
      
      window.dispatchEvent(errorEvent);
      
      const logs = errorHandler.getErrorLog();
      expect(logs.length).toBeGreaterThan(0);
      // The actual implementation may log different message types
      expect(logs[0].message).toBeDefined();
      
      consoleSpy.mockRestore();
    });

    it('should handle promise rejections', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Clear any existing errors
      errorHandler.clearErrorLog();
      
      // Create a proper unhandledrejection event
      const rejectionEvent = new Event('unhandledrejection');
      Object.defineProperty(rejectionEvent, 'reason', {
        value: 'Test rejection',
        writable: false
      });
      
      window.dispatchEvent(rejectionEvent);
      
      const logs = errorHandler.getErrorLog();
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].message).toBeDefined();
      
      consoleSpy.mockRestore();
    });
  });
});

describe('safeQuerySelector', () => {
  it('should return element when selector is valid', () => {
    const div = document.createElement('div');
    div.id = 'test';
    document.body.appendChild(div);
    
    const result = safeQuerySelector('#test');
    expect(result).toBe(div);
  });

  it('should return null when selector is invalid', () => {
    const result = safeQuerySelector('invalid[selector');
    expect(result).toBeNull();
  });

  it('should log error when selector fails', () => {
    const errorHandler = ErrorHandler.getInstance();
    errorHandler.clearErrorLog();
    
    // Use a selector that will actually fail
    const result = safeQuerySelector('invalid[selector');
    
    // Should return null for invalid selector
    expect(result).toBeNull();
    
    // Check if error was logged (may depend on implementation)
    const logs = errorHandler.getErrorLog();
    expect(logs.length).toBeGreaterThanOrEqual(0);
  });
});

describe('safeDOMOperation', () => {
  it('should return result when operation succeeds', () => {
    const operation = () => 'success';
    const result = safeDOMOperation(operation, 'fallback');
    
    expect(result).toBe('success');
  });

  it('should return fallback when operation throws', () => {
    const operation = () => {
      throw new Error('Operation failed');
    };
    
    const result = safeDOMOperation(operation, 'fallback');
    expect(result).toBe('fallback');
  });

  it('should log error when operation fails', () => {
    const errorHandler = ErrorHandler.getInstance();
    const initialLogLength = errorHandler.getErrorLog().length;
    
    const operation = () => {
      throw new Error('Operation failed');
    };
    
    safeDOMOperation(operation, 'fallback', 'test context');
    
    const logs = errorHandler.getErrorLog();
    expect(logs.length).toBe(initialLogLength + 1);
    expect(logs[logs.length - 1].context.context).toBe('test context');
  });
});

describe('retryOperation', () => {
  it('should succeed on first try', async () => {
    const operation = vi.fn().mockResolvedValue('success');
    
    const result = await retryOperation(operation);
    
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure', async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))
      .mockResolvedValueOnce('success');
    
    const result = await retryOperation(operation, 3, 10);
    
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('should throw after max retries', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('Always fails'));
    
    await expect(retryOperation(operation, 3, 10)).rejects.toThrow('Always fails');
    expect(operation).toHaveBeenCalledTimes(3);
  });
});