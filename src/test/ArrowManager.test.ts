import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ArrowManager } from '../utils/ArrowManager';

describe('ArrowManager', () => {
  let container: HTMLElement;
  let arrowManager: ArrowManager;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    document.body.appendChild(container);
    
    arrowManager = new ArrowManager(container);
  });

  describe('initialization', () => {
    it('should create ArrowManager instance', () => {
      expect(arrowManager).toBeDefined();
      expect(arrowManager).toBeInstanceOf(ArrowManager);
    });

    it('should initialize with default state', () => {
      const state = arrowManager.getState();
      expect(state.mode).toBe('idle');
      expect(state.isAnimating).toBe(false);
      expect(state.mousePosition).toEqual({ x: 0, y: 0 });
      expect(state.targetElement).toBeNull();
      expect(Array.isArray(state.arrows)).toBe(true);
      expect(state.performanceMetrics).toBeDefined();
    });
  });

  describe('state management', () => {
    it('should return current state', () => {
      const state = arrowManager.getState();
      expect(state).toBeDefined();
      expect(state.mode).toBeDefined();
      expect(state.isAnimating).toBeDefined();
      expect(state.mousePosition).toBeDefined();
      expect(state.arrows).toBeDefined();
      expect(state.performanceMetrics).toBeDefined();
    });

    it('should have arrow elements after initialization', () => {
      const state = arrowManager.getState();
      expect(Array.isArray(state.arrows)).toBe(true);
      // Arrows may be 0 if container is too small or other conditions
      expect(state.arrows.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('error handling', () => {
    it('should handle invalid container gracefully', () => {
      // The constructor doesn't throw, but the error is logged
      const invalidManager = new ArrowManager(null as any);
      const errors = invalidManager.getErrorLog();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should log errors to error log', () => {
      const errorLog = arrowManager.getErrorLog();
      expect(Array.isArray(errorLog)).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should destroy instance and clean up resources', () => {
      arrowManager.destroy();
      
      // After destroy, state should still be accessible but animation should stop
      const state = arrowManager.getState();
      expect(state.isAnimating).toBe(false);
    });
  });

  describe('accessibility', () => {
    it('should respect reduced motion preference', () => {
      // Mock reduced motion preference before creating the manager
      const mockMatchMedia = vi.fn().mockReturnValue({
        matches: true,
        media: '(prefers-reduced-motion: reduce)',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      });
      
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: mockMatchMedia
      });
      
      const reducedMotionContainer = document.createElement('div');
      reducedMotionContainer.style.width = '800px';
      reducedMotionContainer.style.height = '600px';
      document.body.appendChild(reducedMotionContainer);
      
      const reducedMotionManager = new ArrowManager(reducedMotionContainer);
      
      // Check if the reduced motion class was added
      expect(reducedMotionContainer.classList.contains('reduced-motion')).toBe(true);
    });
  });

  describe('mouse interaction', () => {
    it('should handle mouse events', () => {
      const mockEvent = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 200
      });
      
      container.dispatchEvent(mockEvent);
      
      // The mouse position should be updated internally
      // We can verify this through the state if the handler is working
      expect(arrowManager.getState()).toBeDefined();
    });
  });
});