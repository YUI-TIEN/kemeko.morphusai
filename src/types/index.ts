/**
 * KEMEKO Website Type Definitions
 * @description Comprehensive TypeScript interfaces for the KEMEKO website
 */

export interface Point {
  x: number;
  y: number;
}

export interface ArrowElement extends HTMLDivElement {
  centerX: number;
  centerY: number;
}

export interface AnimationConfig {
  readonly arrowSpacing: number;
  readonly centerRadius: number;
  readonly fadeWidth: number;
  readonly transitionDuration: number;
  readonly minOpacity: number;
  readonly maxOpacity: number;
  readonly maxDistance: number;
  readonly scaleRange: {
    min: number;
    max: number;
  };
}

export interface ArrowState {
  element: ArrowElement;
  position: Point;
  opacity: number;
  scale: number;
  rotation: number;
}

export interface MouseTracker {
  x: number;
  y: number;
  isActive: boolean;
  lastUpdate: number;
}

export interface SectionBounds {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface PerformanceMetrics {
  frameRate: number;
  lastFrameTime: number;
  frameCount: number;
  averageFrameTime: number;
}

export interface ErrorLog {
  timestamp: number;
  message: string;
  stack?: string;
  context?: Record<string, any>;
}

export interface ComponentConfig {
  enableAnimations: boolean;
  enableAccessibility: boolean;
  enablePerformanceMonitoring: boolean;
  debugMode: boolean;
}

export type AnimationMode = 'mouse-follow' | 'ascension' | 'idle';

export interface ArrowManagerState {
  mode: AnimationMode;
  isAnimating: boolean;
  mousePosition: Point;
  targetElement: HTMLElement | null;
  arrows: ArrowState[];
  performanceMetrics: PerformanceMetrics;
}

export interface SecurityConfig {
  readonly enableCSP: boolean;
  readonly emailObfuscation: boolean;
  readonly integrityChecks: boolean;
}

export interface EmailProtectionConfig {
  readonly obfuscationMethod: 'base64' | 'rot13' | 'unicode';
  readonly showPartialEmail: boolean;
  readonly enableClickProtection: boolean;
  readonly formProtection: boolean;
}

export interface ProtectedEmailData {
  encodedEmail: string;
  displayEmail: string;
  subject?: string;
  body?: string;
  className?: string;
}