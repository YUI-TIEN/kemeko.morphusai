/**
 * KEMEKO Performance Monitor
 * @description Comprehensive performance monitoring and optimization
 */

import type { PerformanceMetrics } from '../types';
import { PERFORMANCE_THRESHOLDS } from '../config/animation';
import { ErrorHandler } from './errorHandler';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics;
  private slowFrameCount: number = 0;
  private isMonitoring: boolean = false;
  private observerConnections: PerformanceObserver[] = [];

  private constructor() {
    this.metrics = {
      frameRate: 0,
      lastFrameTime: 0,
      frameCount: 0,
      averageFrameTime: 0
    };
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start performance monitoring
   */
  public startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.setupCoreWebVitals();
    this.setupFrameRateMonitoring();
    this.setupMemoryMonitoring();
    this.setupNetworkMonitoring();
  }

  /**
   * Setup Core Web Vitals monitoring
   */
  private setupCoreWebVitals(): void {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            console.log('LCP:', entry);
            if (entry.startTime > 2500) {
              console.warn('LCP is slower than recommended (2.5s)');
            }
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observerConnections.push(lcpObserver);
      } catch (error) {
        ErrorHandler.getInstance().logError('Failed to setup LCP monitoring', error);
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            console.log('FID:', entry);
            if (entry.processingStart - entry.startTime > 100) {
              console.warn('FID is slower than recommended (100ms)');
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observerConnections.push(fidObserver);
      } catch (error) {
        ErrorHandler.getInstance().logError('Failed to setup FID monitoring', error);
      }

      // Cumulative Layout Shift (CLS)
      try {
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            console.log('CLS:', entry);
            if (entry.value > 0.1) {
              console.warn('CLS is higher than recommended (0.1)');
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observerConnections.push(clsObserver);
      } catch (error) {
        ErrorHandler.getInstance().logError('Failed to setup CLS monitoring', error);
      }
    }
  }

  /**
   * Setup frame rate monitoring
   */
  private setupFrameRateMonitoring(): void {
    let lastTime = performance.now();
    let frameCount = 0;
    let totalFrameTime = 0;

    const measureFrameRate = () => {
      const currentTime = performance.now();
      const frameTime = currentTime - lastTime;
      
      frameCount++;
      totalFrameTime += frameTime;
      
      this.metrics.lastFrameTime = frameTime;
      this.metrics.frameRate = 1000 / frameTime;
      this.metrics.frameCount = frameCount;
      this.metrics.averageFrameTime = totalFrameTime / frameCount;

      // Check for slow frames
      if (frameTime > PERFORMANCE_THRESHOLDS.warningFrameTime) {
        this.slowFrameCount++;
        console.warn(`Slow frame detected: ${frameTime.toFixed(2)}ms`);
        
        if (this.slowFrameCount > PERFORMANCE_THRESHOLDS.maxConsecutiveSlowFrames) {
          console.error('Too many consecutive slow frames detected');
          this.slowFrameCount = 0;
        }
      } else {
        this.slowFrameCount = 0;
      }

      lastTime = currentTime;
      
      if (this.isMonitoring) {
        requestAnimationFrame(measureFrameRate);
      }
    };

    requestAnimationFrame(measureFrameRate);
  }

  /**
   * Setup memory monitoring
   */
  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        console.log('Memory Usage:', {
          used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
        });

        // Warning if memory usage is high
        if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
          console.warn('High memory usage detected');
        }
      }, 10000);
    }
  }

  /**
   * Setup network monitoring
   */
  private setupNetworkMonitoring(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      console.log('Network Info:', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      });

      connection.addEventListener('change', () => {
        console.log('Network changed:', connection.effectiveType);
      });
    }
  }

  /**
   * Measure function execution time
   */
  public measureFunction<T>(
    func: () => T,
    name: string
  ): T {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    
    console.log(`${name} execution time: ${(end - start).toFixed(2)}ms`);
    
    return result;
  }

  /**
   * Measure async function execution time
   */
  public async measureAsyncFunction<T>(
    func: () => Promise<T>,
    name: string
  ): Promise<T> {
    const start = performance.now();
    const result = await func();
    const end = performance.now();
    
    console.log(`${name} execution time: ${(end - start).toFixed(2)}ms`);
    
    return result;
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Log performance summary
   */
  public logSummary(): void {
    console.group('Performance Summary');
    console.log('Frame Rate:', `${this.metrics.frameRate.toFixed(2)} fps`);
    console.log('Average Frame Time:', `${this.metrics.averageFrameTime.toFixed(2)}ms`);
    console.log('Total Frames:', this.metrics.frameCount);
    console.log('Last Frame Time:', `${this.metrics.lastFrameTime.toFixed(2)}ms`);
    console.groupEnd();
  }

  /**
   * Stop monitoring
   */
  public stopMonitoring(): void {
    this.isMonitoring = false;
    
    // Disconnect all observers
    this.observerConnections.forEach(observer => {
      observer.disconnect();
    });
    this.observerConnections = [];
  }

  /**
   * Get performance recommendations
   */
  public getRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.metrics.averageFrameTime > PERFORMANCE_THRESHOLDS.warningFrameTime) {
      recommendations.push('Consider optimizing animations or reducing DOM complexity');
    }
    
    if (this.slowFrameCount > 0) {
      recommendations.push('Recent slow frames detected - monitor for performance bottlenecks');
    }
    
    return recommendations;
  }
}

/**
 * Performance measurement decorator
 */
export function measurePerformance(name: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      return PerformanceMonitor.getInstance().measureFunction(
        () => originalMethod.apply(this, args),
        `${target.constructor.name}.${name || propertyKey}`
      );
    };
    
    return descriptor;
  };
}

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring(): void {
  if (import.meta.env.DEV) {
    const monitor = PerformanceMonitor.getInstance();
    monitor.startMonitoring();
    
    // Log summary every 30 seconds
    setInterval(() => {
      monitor.logSummary();
    }, 30000);
  }
}