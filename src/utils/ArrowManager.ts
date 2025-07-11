/**
 * KEMEKO Arrow Manager
 * @description Professional arrow animation management system with performance monitoring
 */

import type { 
  ArrowElement, 
  Point, 
  ArrowState, 
  AnimationMode, 
  ArrowManagerState,
  SectionBounds,
  PerformanceMetrics,
  ErrorLog
} from '../types';
import { ANIMATION_CONFIG, COMPONENT_CONFIG, PERFORMANCE_THRESHOLDS } from '../config/animation';

export class ArrowManager {
  private state: ArrowManagerState;
  private container: HTMLElement;
  private targetElement: HTMLElement | null = null;
  private rafId: number | null = null;
  private errorLog: ErrorLog[] = [];

  constructor(container: HTMLElement, targetElement?: HTMLElement) {
    this.container = container;
    this.targetElement = targetElement || null;
    
    this.state = {
      mode: 'idle',
      isAnimating: false,
      mousePosition: { x: 0, y: 0 },
      targetElement: this.targetElement,
      arrows: [],
      performanceMetrics: {
        frameRate: 0,
        lastFrameTime: 0,
        frameCount: 0,
        averageFrameTime: 0
      }
    };

    this.initialize();
  }

  /**
   * Initialize the arrow manager
   */
  private initialize(): void {
    try {
      this.createArrows();
      this.bindEvents();
      this.setupAccessibility();
      
      if (COMPONENT_CONFIG.enablePerformanceMonitoring) {
        this.startPerformanceMonitoring();
      }
    } catch (error) {
      this.logError('Failed to initialize ArrowManager', error);
    }
  }

  /**
   * Create arrow grid based on container dimensions
   */
  private createArrows(): void {
    if (!this.container) {
      throw new Error('Container element not found');
    }

    const bounds = this.getSectionBounds();
    const { arrowSpacing } = ANIMATION_CONFIG;
    
    const cols = Math.ceil(bounds.width / arrowSpacing);
    const rows = Math.ceil(bounds.height / arrowSpacing);
    
    // Clear existing arrows
    this.container.innerHTML = '';
    this.state.arrows = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const arrow = this.createSingleArrow(col, row, arrowSpacing);
        this.state.arrows.push(arrow);
      }
    }
  }

  /**
   * Create a single arrow element
   */
  private createSingleArrow(col: number, row: number, spacing: number): ArrowState {
    const element = document.createElement('div') as ArrowElement;
    element.className = 'arrow';
    element.setAttribute('role', 'presentation');
    element.setAttribute('aria-hidden', 'true');
    
    const x = col * spacing + spacing / 2;
    const y = row * spacing + spacing / 2;
    
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.centerX = x + 15;
    element.centerY = y + 15;
    
    this.container.appendChild(element);
    
    return {
      element,
      position: { x: element.centerX, y: element.centerY },
      opacity: ANIMATION_CONFIG.minOpacity,
      scale: ANIMATION_CONFIG.scaleRange.min,
      rotation: 0
    };
  }

  /**
   * Get section bounds for calculations
   */
  private getSectionBounds(): SectionBounds {
    const rect = this.container.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    };
  }

  /**
   * Bind event listeners
   */
  private bindEvents(): void {
    const parentSection = this.container.closest('section');
    if (!parentSection) return;

    parentSection.addEventListener('mousemove', this.handleMouseMove.bind(this));
    parentSection.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    
    if (this.targetElement) {
      this.targetElement.addEventListener('mouseenter', this.handleTargetHover.bind(this));
      this.targetElement.addEventListener('mouseleave', this.handleTargetLeave.bind(this));
    }

    // Keyboard navigation
    if (COMPONENT_CONFIG.enableAccessibility) {
      this.setupKeyboardNavigation();
    }

    // Handle resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * Setup keyboard navigation
   */
  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Space' && this.isInSection()) {
        e.preventDefault();
        this.toggleAscensionMode();
      }
      if (e.key === 'Escape') {
        this.setMode('idle');
      }
    });
  }

  /**
   * Setup accessibility features
   */
  private setupAccessibility(): void {
    const parentSection = this.container.closest('section');
    if (!parentSection) return;

    parentSection.setAttribute('aria-label', 'Interactive arrow background');
    parentSection.setAttribute('tabindex', '0');
    
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.container.classList.add('reduced-motion');
    }
  }

  /**
   * Handle mouse movement
   */
  private handleMouseMove(event: MouseEvent): void {
    if (this.state.mode === 'ascension') return;

    this.state.mousePosition = { x: event.clientX, y: event.clientY };
    this.setMode('mouse-follow');
  }

  /**
   * Handle mouse leave
   */
  private handleMouseLeave(): void {
    this.setMode('idle');
  }

  /**
   * Handle target element hover (ascension mode)
   */
  private handleTargetHover(): void {
    this.setMode('ascension');
  }

  /**
   * Handle target element leave
   */
  private handleTargetLeave(): void {
    this.setMode('idle');
  }

  /**
   * Handle window resize
   */
  private handleResize(): void {
    clearTimeout(this.rafId || undefined);
    setTimeout(() => {
      this.createArrows();
    }, 100);
  }

  /**
   * Set animation mode
   */
  private setMode(mode: AnimationMode): void {
    if (this.state.mode === mode) return;
    
    this.state.mode = mode;
    this.startAnimation();
  }

  /**
   * Start animation loop
   */
  private startAnimation(): void {
    if (this.state.isAnimating) return;
    
    this.state.isAnimating = true;
    this.animationLoop();
  }

  /**
   * Main animation loop
   */
  private animationLoop(): void {
    const startTime = performance.now();
    
    try {
      this.updateArrows();
      this.updatePerformanceMetrics(startTime);
      
      if (this.state.mode !== 'idle') {
        this.rafId = requestAnimationFrame(() => this.animationLoop());
      } else {
        this.state.isAnimating = false;
      }
    } catch (error) {
      this.logError('Animation loop error', error);
      this.state.isAnimating = false;
    }
  }

  /**
   * Update arrow states based on current mode
   */
  private updateArrows(): void {
    const bounds = this.getSectionBounds();
    
    this.state.arrows.forEach(arrow => {
      switch (this.state.mode) {
        case 'mouse-follow':
          this.updateArrowForMouseFollow(arrow, bounds);
          break;
        case 'ascension':
          this.updateArrowForAscension(arrow, bounds);
          break;
        case 'idle':
          this.updateArrowForIdle(arrow);
          break;
      }
      
      this.applyArrowTransform(arrow);
    });
  }

  /**
   * Update arrow for mouse follow mode
   */
  private updateArrowForMouseFollow(arrow: ArrowState, bounds: SectionBounds): void {
    const deltaX = this.state.mousePosition.x - (bounds.left + arrow.position.x);
    const deltaY = this.state.mousePosition.y - (bounds.top + arrow.position.y);
    
    arrow.rotation = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const { maxDistance, minOpacity, maxOpacity } = ANIMATION_CONFIG;
    
    if (distance <= maxDistance) {
      const normalizedDistance = distance / maxDistance;
      arrow.opacity = maxOpacity - (normalizedDistance * (maxOpacity - minOpacity));
      arrow.scale = ANIMATION_CONFIG.scaleRange.max - (normalizedDistance * 0.2);
    } else {
      arrow.opacity = minOpacity;
      arrow.scale = ANIMATION_CONFIG.scaleRange.min;
    }
  }

  /**
   * Update arrow for ascension mode
   */
  private updateArrowForAscension(arrow: ArrowState, bounds: SectionBounds): void {
    if (!this.targetElement) return;

    const targetRect = this.targetElement.getBoundingClientRect();
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    
    const deltaX = targetCenterX - (bounds.left + arrow.position.x);
    const deltaY = targetCenterY - (bounds.top + arrow.position.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    arrow.rotation = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    
    const { centerRadius, fadeWidth } = ANIMATION_CONFIG;
    
    if (distance <= centerRadius) {
      const fadeStart = centerRadius - fadeWidth;
      if (distance >= fadeStart) {
        const fadeProgress = (centerRadius - distance) / fadeWidth;
        arrow.opacity = ANIMATION_CONFIG.minOpacity + (0.65 * fadeProgress);
        arrow.scale = ANIMATION_CONFIG.scaleRange.min + (0.2 * fadeProgress);
      } else {
        arrow.opacity = ANIMATION_CONFIG.maxOpacity;
        arrow.scale = ANIMATION_CONFIG.scaleRange.max;
      }
    } else {
      arrow.opacity = ANIMATION_CONFIG.minOpacity;
      arrow.scale = ANIMATION_CONFIG.scaleRange.min;
    }
  }

  /**
   * Update arrow for idle mode
   */
  private updateArrowForIdle(arrow: ArrowState): void {
    arrow.rotation = 0;
    arrow.opacity = ANIMATION_CONFIG.minOpacity;
    arrow.scale = ANIMATION_CONFIG.scaleRange.min;
  }

  /**
   * Apply transform to arrow element
   */
  private applyArrowTransform(arrow: ArrowState): void {
    const { element, rotation, scale, opacity } = arrow;
    element.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    element.style.opacity = opacity.toString();
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(startTime: number): void {
    const endTime = performance.now();
    const frameTime = endTime - startTime;
    
    this.state.performanceMetrics.frameCount++;
    this.state.performanceMetrics.lastFrameTime = frameTime;
    this.state.performanceMetrics.frameRate = 1000 / frameTime;
    
    // Calculate average frame time
    const totalTime = this.state.performanceMetrics.averageFrameTime * (this.state.performanceMetrics.frameCount - 1) + frameTime;
    this.state.performanceMetrics.averageFrameTime = totalTime / this.state.performanceMetrics.frameCount;
    
    // Performance warnings
    if (frameTime > PERFORMANCE_THRESHOLDS.warningFrameTime) {
      console.warn(`Slow frame detected: ${frameTime.toFixed(2)}ms`);
    }
  }

  /**
   * Start performance monitoring
   */
  private startPerformanceMonitoring(): void {
    setInterval(() => {
      console.log('Performance Metrics:', {
        frameRate: this.state.performanceMetrics.frameRate.toFixed(2),
        averageFrameTime: this.state.performanceMetrics.averageFrameTime.toFixed(2),
        arrowCount: this.state.arrows.length
      });
    }, 5000);
  }

  /**
   * Toggle ascension mode
   */
  private toggleAscensionMode(): void {
    this.setMode(this.state.mode === 'ascension' ? 'idle' : 'ascension');
  }

  /**
   * Check if user is in the arrow section
   */
  private isInSection(): boolean {
    const rect = this.container.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  /**
   * Log error for debugging
   */
  private logError(message: string, error: any): void {
    const errorLog: ErrorLog = {
      timestamp: Date.now(),
      message,
      stack: error?.stack,
      context: {
        mode: this.state.mode,
        isAnimating: this.state.isAnimating,
        arrowCount: this.state.arrows.length
      }
    };
    
    this.errorLog.push(errorLog);
    console.error('ArrowManager Error:', errorLog);
  }

  /**
   * Get current state (for debugging)
   */
  public getState(): ArrowManagerState {
    return { ...this.state };
  }

  /**
   * Get error log
   */
  public getErrorLog(): ErrorLog[] {
    return [...this.errorLog];
  }

  /**
   * Destroy the arrow manager
   */
  public destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    this.container.innerHTML = '';
    this.state.arrows = [];
    this.state.isAnimating = false;
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize.bind(this));
  }
}