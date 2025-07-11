/**
 * KEMEKO Animation Configuration
 * @description Centralized animation constants and configuration
 */

import type { AnimationConfig, ComponentConfig } from '../types';

export const ANIMATION_CONFIG: AnimationConfig = {
  arrowSpacing: 70,
  centerRadius: 350,
  fadeWidth: 100,
  transitionDuration: 500,
  minOpacity: 0.15,
  maxOpacity: 0.8,
  maxDistance: 300,
  scaleRange: {
    min: 1,
    max: 1.2
  }
} as const;

export const COMPONENT_CONFIG: ComponentConfig = {
  enableAnimations: true,
  enableAccessibility: true,
  enablePerformanceMonitoring: import.meta.env.DEV,
  debugMode: import.meta.env.DEV
} as const;

export const PERFORMANCE_THRESHOLDS = {
  maxFrameTime: 16.67, // 60fps
  warningFrameTime: 33.33, // 30fps
  criticalFrameTime: 50, // 20fps
  maxConsecutiveSlowFrames: 5
} as const;

export const ACCESSIBILITY_CONFIG = {
  enableReducedMotion: true,
  keyboardNavigation: true,
  ariaLabels: {
    arrowSection: 'Interactive arrow background responding to mouse movement',
    finalQuote: 'KEMEKO mythology quote with interactive hover effect',
    arrowBackground: 'Animated arrow grid background'
  }
} as const;

export const SECURITY_CONFIG = {
  enableCSP: true,
  emailObfuscation: true,
  integrityChecks: true
} as const;

export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px'
} as const;