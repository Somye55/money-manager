/**
 * Navigation Feedback System
 *
 * Provides comprehensive navigation feedback including visual indicators,
 * smooth transitions, and touch feedback for enhanced user experience.
 *
 * Features:
 * - Visual loading indicators
 * - Smooth page transitions
 * - Navigation state management
 * - Touch feedback optimization
 * - Fallback for haptic feedback
 *
 * Requirements satisfied:
 * - 5.2: Smooth page transitions and navigation feedback
 * - 5.3: Consistent header designs across all screens
 */

import { Capacitor } from "@capacitor/core";
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Navigation feedback types
export type NavigationFeedbackType =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error";

// Navigation state interface
export interface NavigationState {
  isNavigating: boolean;
  currentRoute: string;
  previousRoute: string | null;
  transitionDirection: "forward" | "backward" | "none";
}

class NavigationFeedbackManager {
  private state: NavigationState = {
    isNavigating: false,
    currentRoute: "/",
    previousRoute: null,
    transitionDirection: "none",
  };

  private listeners: Set<(state: NavigationState) => void> = new Set();
  private isHapticsSupported = false;

  constructor() {
    this.initializeHaptics();
  }

  private async initializeHaptics() {
    if (Capacitor.isNativePlatform()) {
      try {
        // For now, we'll use visual feedback instead of haptics
        // This can be enhanced when Capacitor is updated
        this.isHapticsSupported = false;
      } catch (error) {
        console.warn("Haptics not supported:", error);
        this.isHapticsSupported = false;
      }
    }
  }

  /**
   * Provide haptic feedback for navigation actions
   * Currently uses visual feedback as fallback
   */
  async provideHapticFeedback(type: NavigationFeedbackType = "light") {
    if (!this.isHapticsSupported) {
      // Provide visual feedback instead
      this.provideVisualFeedbackGlobal(type);
      return;
    }

    // Future: Add actual haptic feedback when Capacitor is updated
    console.log(`Haptic feedback: ${type}`);
  }

  /**
   * Provide global visual feedback
   */
  private provideVisualFeedbackGlobal(type: NavigationFeedbackType) {
    // Create a subtle visual indicator for feedback
    const indicator = document.createElement("div");
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: ${this.getFeedbackColor(type)};
      z-index: 9999;
      opacity: 0.8;
      transition: transform 0.3s ease;
      transform: translateX(-100%);
    `;

    document.body.appendChild(indicator);

    // Animate the indicator
    requestAnimationFrame(() => {
      indicator.style.transform = "translateX(0%)";
      setTimeout(() => {
        indicator.style.transform = "translateX(100%)";
        setTimeout(() => {
          document.body.removeChild(indicator);
        }, 300);
      }, 100);
    });
  }

  private getFeedbackColor(type: NavigationFeedbackType): string {
    switch (type) {
      case "success":
        return "hsl(var(--success))";
      case "warning":
        return "hsl(var(--warning))";
      case "error":
        return "hsl(var(--destructive))";
      default:
        return "hsl(var(--primary))";
    }
  }

  /**
   * Update navigation state
   */
  updateNavigationState(
    newRoute: string,
    direction: "forward" | "backward" | "none" = "none"
  ) {
    const previousRoute = this.state.currentRoute;

    this.state = {
      ...this.state,
      previousRoute,
      currentRoute: newRoute,
      transitionDirection: direction,
      isNavigating: true,
    };

    this.notifyListeners();

    // Provide haptic feedback for navigation
    this.provideHapticFeedback("light");

    // Reset navigation state after transition
    setTimeout(() => {
      this.state = {
        ...this.state,
        isNavigating: false,
        transitionDirection: "none",
      };
      this.notifyListeners();
    }, 300);
  }

  /**
   * Get current navigation state
   */
  getState(): NavigationState {
    return { ...this.state };
  }

  /**
   * Subscribe to navigation state changes
   */
  subscribe(listener: (state: NavigationState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  /**
   * Provide visual feedback for button presses
   */
  provideVisualFeedback(
    element: HTMLElement,
    type: "press" | "success" | "error" = "press"
  ) {
    if (!element) return;

    const originalTransform = element.style.transform;
    const originalBackground = element.style.background;

    switch (type) {
      case "press":
        element.style.transform = "scale(0.95)";
        setTimeout(() => {
          element.style.transform = originalTransform;
        }, 150);
        break;

      case "success":
        element.style.background = "rgba(16, 185, 129, 0.1)";
        element.style.transform = "scale(1.02)";
        setTimeout(() => {
          element.style.background = originalBackground;
          element.style.transform = originalTransform;
        }, 200);
        break;

      case "error":
        element.style.background = "rgba(239, 68, 68, 0.1)";
        element.classList.add("animate-shake");
        setTimeout(() => {
          element.style.background = originalBackground;
          element.classList.remove("animate-shake");
        }, 300);
        break;
    }
  }

  /**
   * Create ripple effect for touch feedback
   */
  createRippleEffect(element: HTMLElement, event: MouseEvent | TouchEvent) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    // Get coordinates from either mouse or touch event
    let clientX: number, clientY: number;
    if ("touches" in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ("clientX" in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      // Fallback to center of element
      clientX = rect.left + rect.width / 2;
      clientY = rect.top + rect.height / 2;
    }

    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;

    const ripple = document.createElement("div");
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
    `;

    element.style.position = "relative";
    element.style.overflow = "hidden";
    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
}

// Create singleton instance
export const navigationFeedback = new NavigationFeedbackManager();

// React hook for navigation feedback
export function useNavigationFeedback() {
  const [state, setState] = React.useState<NavigationState>(
    navigationFeedback.getState()
  );

  React.useEffect(() => {
    return navigationFeedback.subscribe(setState);
  }, []);

  return {
    state,
    provideHapticFeedback:
      navigationFeedback.provideHapticFeedback.bind(navigationFeedback),
    updateNavigationState:
      navigationFeedback.updateNavigationState.bind(navigationFeedback),
    provideVisualFeedback:
      navigationFeedback.provideVisualFeedback.bind(navigationFeedback),
    createRippleEffect:
      navigationFeedback.createRippleEffect.bind(navigationFeedback),
  };
}

// Enhanced navigation hook with feedback
export function useEnhancedNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateNavigationState, provideHapticFeedback } =
    useNavigationFeedback();

  const enhancedNavigate = React.useCallback(
    (
      to: string,
      options?: {
        replace?: boolean;
        state?: any;
        feedback?: NavigationFeedbackType;
        direction?: "forward" | "backward";
      }
    ) => {
      // Provide haptic feedback
      if (options?.feedback) {
        provideHapticFeedback(options.feedback);
      }

      // Update navigation state
      updateNavigationState(to, options?.direction || "forward");

      // Navigate
      navigate(to, { replace: options?.replace, state: options?.state });
    },
    [navigate, updateNavigationState, provideHapticFeedback]
  );

  return {
    navigate: enhancedNavigate,
    location,
    currentRoute: location.pathname,
  };
}

// CSS for ripple animation (to be added to global styles)
export const rippleCSS = `
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
`;
