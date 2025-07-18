/**
 * KEMEKO Error Handler
 * @description Comprehensive error handling and logging system
 */

import type { ErrorLog } from '../types';

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ErrorLog[] = [];
  private maxLogSize = 100;

  private constructor() {
    this.setupGlobalErrorHandling();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Setup global error handling
   */
  private setupGlobalErrorHandling(): void {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', event.reason);
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.logError('Resource Loading Error', new Error(`Failed to load ${event.target}`), {
          target: event.target,
          type: event.type
        });
      }
    }, true);
  }

  /**
   * Log error with context
   */
  public logError(message: string, error: any, context?: Record<string, any>): void {
    const errorLog: ErrorLog = {
      timestamp: Date.now(),
      message,
      stack: error?.stack || error?.toString(),
      context: {
        ...context,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }
    };

    this.errorLog.push(errorLog);
    
    // Limit log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // Console logging
    console.error('KEMEKO Error:', errorLog);

    // Show user-friendly error notification
    this.showUserNotification(message, error);

    // In production, you might want to send to a logging service
    if (import.meta.env.PROD) {
      this.sendToLoggingService(errorLog);
    }
  }

  /**
   * Show user-friendly error notification
   */
  private showUserNotification(message: string, error: any): void {
    // Create notification element if it doesn't exist
    let notificationContainer = document.getElementById('error-notifications');
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.id = 'error-notifications';
      notificationContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        pointer-events: none;
      `;
      document.body.appendChild(notificationContainer);
    }

    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      background: #ff4444;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      pointer-events: auto;
      cursor: pointer;
    `;

    notification.innerHTML = `
      <div style="font-weight: 500; margin-bottom: 4px;">Something went wrong</div>
      <div style="font-size: 0.9em; opacity: 0.9;">Please try again or refresh the page</div>
    `;

    // Add click to dismiss
    notification.addEventListener('click', () => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    });

    notificationContainer.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  /**
   * Send error to logging service (placeholder)
   */
  private sendToLoggingService(errorLog: ErrorLog): void {
    // This would be implemented with your actual logging service
    // Example: Sentry, LogRocket, etc.
    console.log('Would send to logging service:', errorLog);
  }

  /**
   * Get error log
   */
  public getErrorLog(): ErrorLog[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  public clearErrorLog(): void {
    this.errorLog = [];
  }
}

/**
 * Safe DOM query selector with error handling
 */
export function safeQuerySelector<T extends HTMLElement>(
  selector: string,
  context: Document | HTMLElement = document
): T | null {
  try {
    return context.querySelector<T>(selector);
  } catch (error) {
    ErrorHandler.getInstance().logError(
      `Failed to query selector: ${selector}`,
      error,
      { selector, context: context.constructor.name }
    );
    return null;
  }
}

/**
 * Safe DOM operation with error handling
 */
export function safeDOMOperation<T>(
  operation: () => T,
  fallback: T,
  context?: string
): T {
  try {
    return operation();
  } catch (error) {
    ErrorHandler.getInstance().logError(
      `DOM operation failed: ${context || 'unknown'}`,
      error,
      { context }
    );
    return fallback;
  }
}

/**
 * Retry operation with exponential backoff
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw new Error('Max retries exceeded');
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}