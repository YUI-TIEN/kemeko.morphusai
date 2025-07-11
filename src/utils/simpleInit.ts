/**
 * Simple initialization for KEMEKO system
 * This ensures Locomotive Scroll works first, then adds enhancements
 */

import { COMPONENT_CONFIG } from '../config/animation';

/**
 * Initialize basic system components without interfering with Locomotive Scroll
 */
export async function initializeBasicSystem(): Promise<void> {
  try {
    console.log('🚀 KEMEKO Basic System Initialization');
    
    // Wait for Locomotive Scroll to be ready
    await waitForLocomotiveScroll();
    
    // Only initialize email protection if needed
    if (COMPONENT_CONFIG.debugMode) {
      await initializeEmailProtection();
    }
    
    // Initialize performance monitoring in development
    if (COMPONENT_CONFIG.enablePerformanceMonitoring) {
      await initializePerformanceMonitoring();
    }
    
    console.log('✅ KEMEKO Basic System Ready');
    
  } catch (error) {
    console.warn('⚠️ KEMEKO system initialization failed (non-critical):', error);
  }
}

/**
 * Wait for Locomotive Scroll to be initialized
 */
async function waitForLocomotiveScroll(): Promise<void> {
  return new Promise((resolve) => {
    const checkLocomotiveScroll = () => {
      if (window.scroll) {
        console.log('✅ Locomotive Scroll detected');
        resolve();
      } else {
        setTimeout(checkLocomotiveScroll, 100);
      }
    };
    
    checkLocomotiveScroll();
  });
}

/**
 * Initialize email protection
 */
async function initializeEmailProtection(): Promise<void> {
  try {
    const { EmailProtection } = await import('./emailProtection');
    const emailProtection = EmailProtection.getInstance();
    emailProtection.initializeEmailProtection();
    emailProtection.protectContactForms();
    console.log('✅ Email protection initialized');
  } catch (error) {
    console.warn('⚠️ Email protection failed:', error);
  }
}

/**
 * Initialize performance monitoring
 */
async function initializePerformanceMonitoring(): Promise<void> {
  try {
    const { PerformanceMonitor } = await import('./performanceMonitor');
    const monitor = PerformanceMonitor.getInstance();
    monitor.startMonitoring();
    console.log('✅ Performance monitoring started');
  } catch (error) {
    console.warn('⚠️ Performance monitoring failed:', error);
  }
}

/**
 * Initialize arrow managers for sections with arrow backgrounds
 */
export async function initializeArrowManagers(): Promise<void> {
  try {
    const arrowSections = document.querySelectorAll('.arrow-section');
    if (arrowSections.length === 0) {
      console.log('📄 No arrow sections found');
      return;
    }
    
    const { ArrowManager } = await import('./ArrowManager');
    
    for (const section of arrowSections) {
      const sectionId = section.id || `arrow-section-${Date.now()}`;
      const arrowContainer = section.querySelector('.arrow-background');
      const targetElement = section.querySelector('.arrow-target');
      
      if (arrowContainer) {
        const arrowManager = new ArrowManager(
          arrowContainer as HTMLElement,
          targetElement as HTMLElement || undefined
        );
        
        console.log(`✅ Arrow manager initialized for section: ${sectionId}`);
      }
    }
  } catch (error) {
    console.warn('⚠️ Arrow managers initialization failed:', error);
  }
}

// Make functions available globally for debugging
if (typeof window !== 'undefined' && COMPONENT_CONFIG.debugMode) {
  (window as any).KemekoInit = {
    initializeBasicSystem,
    initializeArrowManagers
  };
}