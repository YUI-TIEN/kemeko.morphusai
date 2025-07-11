/**
 * KEMEKO System Integration
 * @description Orchestrates all system components and monitoring
 */

import { ArrowManager } from './ArrowManager';
import { PerformanceMonitor } from './performanceMonitor';
import { ErrorHandler } from './errorHandler';
import { EmailProtection } from './emailProtection';
import { COMPONENT_CONFIG } from '../config/animation';
import type { ArrowManagerState } from '../types';

export class SystemIntegration {
  private static instance: SystemIntegration;
  private arrowManagers: Map<string, ArrowManager> = new Map();
  private performanceMonitor: PerformanceMonitor;
  private errorHandler: ErrorHandler;
  private emailProtection: EmailProtection;
  private initialized = false;

  private constructor() {
    this.performanceMonitor = PerformanceMonitor.getInstance();
    this.errorHandler = ErrorHandler.getInstance();
    this.emailProtection = EmailProtection.getInstance();
  }

  public static getInstance(): SystemIntegration {
    if (!SystemIntegration.instance) {
      SystemIntegration.instance = new SystemIntegration();
    }
    return SystemIntegration.instance;
  }

  /**
   * Initialize all system components
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('System already initialized');
      return;
    }

    try {
      console.log('🚀 KEMEKO System Initialization Started');
      
      // Wait for Locomotive Scroll to be available
      await this.waitForLocomotiveScroll();
      
      // Start performance monitoring
      if (COMPONENT_CONFIG.enablePerformanceMonitoring) {
        this.performanceMonitor.startMonitoring();
        console.log('✅ Performance monitoring started');
      }

      // Initialize email protection
      this.emailProtection.initializeEmailProtection();
      this.emailProtection.protectContactForms();
      console.log('✅ Email protection initialized');

      // Initialize arrow managers for sections with arrow backgrounds
      await this.initializeArrowManagers();

      // Setup system health monitoring
      this.setupSystemHealthMonitoring();

      // Setup performance alerts
      this.setupPerformanceAlerts();

      this.initialized = true;
      console.log('🎉 KEMEKO System Initialization Complete');
      
    } catch (error) {
      this.errorHandler.logError('System initialization failed', error);
      throw error;
    }
  }

  /**
   * Wait for Locomotive Scroll to be initialized
   */
  private async waitForLocomotiveScroll(): Promise<void> {
    return new Promise((resolve) => {
      const checkLocomotiveScroll = () => {
        if (window.scroll) {
          console.log('✅ Locomotive Scroll detected');
          resolve();
        } else {
          setTimeout(checkLocomotiveScroll, 100);
        }
      };
      
      // Start checking immediately
      checkLocomotiveScroll();
    });
  }

  /**
   * Initialize arrow managers for sections with arrow backgrounds
   */
  private async initializeArrowManagers(): Promise<void> {
    const arrowSections = document.querySelectorAll('.arrow-section');
    
    for (const section of arrowSections) {
      try {
        const sectionId = section.id || `arrow-section-${Date.now()}`;
        const arrowContainer = section.querySelector('.arrow-background');
        const targetElement = section.querySelector('.arrow-target');
        
        if (arrowContainer) {
          const arrowManager = new ArrowManager(
            arrowContainer as HTMLElement,
            targetElement as HTMLElement || undefined
          );
          
          this.arrowManagers.set(sectionId, arrowManager);
          console.log(`✅ Arrow manager initialized for section: ${sectionId}`);
        }
      } catch (error) {
        this.errorHandler.logError(`Failed to initialize arrow manager for section`, error);
      }
    }
  }

  /**
   * Setup system health monitoring
   */
  private setupSystemHealthMonitoring(): void {
    // Monitor system health every 30 seconds
    setInterval(() => {
      this.performSystemHealthCheck();
    }, 30000);

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        this.checkMemoryUsage();
      }, 60000); // Check every minute
    }

    // Monitor network status
    if ('connection' in navigator) {
      this.monitorNetworkStatus();
    }
  }

  /**
   * Perform system health check
   */
  private performSystemHealthCheck(): void {
    try {
      const healthStatus = {
        arrowManagers: this.arrowManagers.size,
        performanceMetrics: this.performanceMonitor.getMetrics(),
        errorCount: this.errorHandler.getErrorLog().length,
        memoryUsage: this.getMemoryUsage(),
        timestamp: new Date().toISOString()
      };

      if (COMPONENT_CONFIG.debugMode) {
        console.log('🔍 System Health Check:', healthStatus);
      }

      // Alert if system health is poor
      if (healthStatus.errorCount > 10) {
        console.warn('⚠️ High error count detected:', healthStatus.errorCount);
      }

    } catch (error) {
      this.errorHandler.logError('System health check failed', error);
    }
  }

  /**
   * Check memory usage
   */
  private checkMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      if (usagePercent > 80) {
        console.warn('⚠️ High memory usage detected:', `${usagePercent.toFixed(1)}%`);
        
        // Suggest garbage collection
        if (usagePercent > 90) {
          console.error('🚨 Critical memory usage! Consider refreshing the page.');
        }
      }
    }
  }

  /**
   * Monitor network status
   */
  private monitorNetworkStatus(): void {
    const connection = (navigator as any).connection;
    
    if (connection) {
      console.log('📡 Network Status:', {
        type: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      });

      connection.addEventListener('change', () => {
        console.log('📡 Network changed to:', connection.effectiveType);
        
        // Adjust performance based on network
        if (connection.effectiveType === 'slow-2g') {
          console.warn('⚠️ Slow network detected, reducing animations');
          this.adjustForSlowNetwork();
        }
      });
    }
  }

  /**
   * Adjust system for slow network
   */
  private adjustForSlowNetwork(): void {
    // Reduce animation frequency
    this.arrowManagers.forEach(manager => {
      // This would require additional methods in ArrowManager
      // For now, just log the intent
      console.log('Adjusting arrow manager for slow network');
    });
  }

  /**
   * Setup performance alerts
   */
  private setupPerformanceAlerts(): void {
    const metrics = this.performanceMonitor.getMetrics();
    
    // Alert on slow frames
    if (metrics.averageFrameTime > 33) { // Slower than 30 FPS
      console.warn('⚠️ Performance Alert: Slow frame rate detected');
      
      // Provide performance recommendations
      const recommendations = this.performanceMonitor.getRecommendations();
      if (recommendations.length > 0) {
        console.log('💡 Performance Recommendations:', recommendations);
      }
    }
  }

  /**
   * Get memory usage information
   */
  private getMemoryUsage(): any {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }

  /**
   * Get system status
   */
  public getSystemStatus(): any {
    return {
      initialized: this.initialized,
      arrowManagers: Array.from(this.arrowManagers.keys()),
      performanceMetrics: this.performanceMonitor.getMetrics(),
      errorCount: this.errorHandler.getErrorLog().length,
      memoryUsage: this.getMemoryUsage(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get arrow manager state for debugging
   */
  public getArrowManagerState(sectionId: string): ArrowManagerState | null {
    const manager = this.arrowManagers.get(sectionId);
    return manager ? manager.getState() : null;
  }

  /**
   * Cleanup all systems
   */
  public cleanup(): void {
    try {
      // Stop performance monitoring
      this.performanceMonitor.stopMonitoring();
      
      // Destroy all arrow managers
      this.arrowManagers.forEach(manager => {
        manager.destroy();
      });
      this.arrowManagers.clear();
      
      // Clear error log
      this.errorHandler.clearErrorLog();
      
      this.initialized = false;
      console.log('🧹 System cleanup completed');
      
    } catch (error) {
      console.error('Error during system cleanup:', error);
    }
  }

  /**
   * Performance debugging utilities
   */
  public debugPerformance(): void {
    console.group('🔍 Performance Debug Report');
    console.log('Metrics:', this.performanceMonitor.getMetrics());
    console.log('Recommendations:', this.performanceMonitor.getRecommendations());
    console.log('System Status:', this.getSystemStatus());
    console.groupEnd();
  }
}

/**
 * Initialize the complete KEMEKO system
 */
export async function initializeKemekoSystem(): Promise<void> {
  try {
    const system = SystemIntegration.getInstance();
    await system.initialize();
    
    // Make system available globally for debugging
    if (COMPONENT_CONFIG.debugMode) {
      (window as any).KemekoSystem = system;
      console.log('🔧 Debug mode: KemekoSystem available globally');
    }
    
  } catch (error) {
    console.error('🚨 Failed to initialize KEMEKO system:', error);
    // Don't throw error in production to avoid breaking the site
    if (COMPONENT_CONFIG.debugMode) {
      throw error;
    }
  }
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    SystemIntegration.getInstance().cleanup();
  });
}