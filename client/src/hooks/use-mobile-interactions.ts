/**
 * Enhanced mobile interactions hook
 *
 * Provides comprehensive mobile interaction support including:
 * - Touch target optimization
 * - Gesture recognition
 * - Performance optimization
 * - Haptic feedback
 * - Scroll behavior optimization
 *
 * Requirements satisfied:
 * - 2.1: Touch response with immediate visual feedback
 * - 2.2: Smooth scroll behavior with appropriate momentum
 * - 2.4: Native and responsive input experience
 * - 2.5: Appropriate gesture recognition for swipes and taps
 */

import { useEffect, useRef, useCallback } from "react";
import {
  isTouchDevice,
  addHapticFeedback,
  addGestureSupport,
  optimizeElementPerformance,
  optimizeScrollContainer,
  type GestureOptions,
} from "@/lib/mobile-optimizations";
import { optimizeForMobile, TOUCH_TARGET } from "@/lib/mobile-utils";

export interface MobileInteractionOptions {
  // Touch target optimization
  touchTarget?: boolean;
  minTouchSize?: number;

  // Gesture support
  gestures?: GestureOptions;

  // Performance optimization
  optimizePerformance?: boolean;

  // Scroll optimization
  optimizeScroll?: boolean;

  // Haptic feedback
  hapticFeedback?: boolean;

  // Hover state management
  preventHoverStick?: boolean;
}

export function useMobileInteractions<T extends HTMLElement>(
  options: MobileInteractionOptions = {}
) {
  const elementRef = useRef<T>(null);
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);

  const {
    touchTarget = true,
    minTouchSize = TOUCH_TARGET.MIN_SIZE,
    gestures,
    optimizePerformance = true,
    optimizeScroll = false,
    hapticFeedback = true,
    preventHoverStick = true,
  } = options;

  // Cleanup function
  const cleanup = useCallback(() => {
    cleanupFunctionsRef.current.forEach((fn) => fn());
    cleanupFunctionsRef.current = [];
  }, []);

  // Apply optimizations when element is available
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    cleanup(); // Clean up previous optimizations

    // Apply mobile optimizations
    if (isTouchDevice()) {
      const mobileCleanup = optimizeForMobile(element, {
        touchTarget,
        preventHover: preventHoverStick,
        preventZoom: element.tagName === "INPUT",
        minTouchSize,
      });
      cleanupFunctionsRef.current.push(mobileCleanup);
    }

    // Apply performance optimizations
    if (optimizePerformance) {
      optimizeElementPerformance(element);
    }

    // Apply scroll optimizations
    if (optimizeScroll) {
      optimizeScrollContainer(element);
    }

    // Add gesture support
    if (gestures && isTouchDevice()) {
      const gestureCleanup = addGestureSupport(element, gestures);
      cleanupFunctionsRef.current.push(gestureCleanup);
    }

    return cleanup;
  }, [
    touchTarget,
    minTouchSize,
    gestures,
    optimizePerformance,
    optimizeScroll,
    preventHoverStick,
    cleanup,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Provide haptic feedback function
  const provideHapticFeedback = useCallback(
    (type: "light" | "medium" | "heavy" = "light") => {
      if (hapticFeedback && isTouchDevice()) {
        addHapticFeedback(type);
      }
    },
    [hapticFeedback]
  );

  // Enhanced click handler with mobile optimizations
  const handleClick = useCallback(
    (callback?: (event: React.MouseEvent<T>) => void) =>
      (event: React.MouseEvent<T>) => {
        // Provide haptic feedback
        provideHapticFeedback("light");

        // Add visual feedback
        const element = event.currentTarget;
        if (element && isTouchDevice()) {
          // Add press animation
          element.style.transform = "scale(0.95)";
          setTimeout(() => {
            element.style.transform = "";
          }, 150);
        }

        // Call original callback
        callback?.(event);
      },
    [provideHapticFeedback]
  );

  // Enhanced touch handlers
  const handleTouchStart = useCallback(
    (callback?: (event: React.TouchEvent<T>) => void) =>
      (event: React.TouchEvent<T>) => {
        provideHapticFeedback("light");
        callback?.(event);
      },
    [provideHapticFeedback]
  );

  const handleTouchEnd = useCallback(
    (callback?: (event: React.TouchEvent<T>) => void) =>
      (event: React.TouchEvent<T>) => {
        // Clear any hover states on touch devices
        if (preventHoverStick && isTouchDevice()) {
          const element = event.currentTarget;
          element.blur();
        }
        callback?.(event);
      },
    [preventHoverStick]
  );

  return {
    ref: elementRef,
    isTouchDevice: isTouchDevice(),
    provideHapticFeedback,
    handleClick,
    handleTouchStart,
    handleTouchEnd,
    cleanup,
  };
}

/**
 * Hook for optimizing scroll containers
 */
export function useScrollOptimization<T extends HTMLElement>() {
  const scrollRef = useRef<T>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    optimizeScrollContainer(element);

    // Add scroll event optimization
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll event handling can be added here
          ticking = false;
        });
        ticking = true;
      }
    };

    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { ref: scrollRef };
}

/**
 * Hook for gesture-enabled components
 */
export function useGestures<T extends HTMLElement>(gestures: GestureOptions) {
  const gestureRef = useRef<T>(null);

  useEffect(() => {
    const element = gestureRef.current;
    if (!element || !isTouchDevice()) return;

    const cleanup = addGestureSupport(element, gestures);
    return cleanup;
  }, [gestures]);

  return { ref: gestureRef };
}

/**
 * Hook for performance-optimized components
 */
export function usePerformanceOptimization<T extends HTMLElement>() {
  const performanceRef = useRef<T>(null);

  useEffect(() => {
    const element = performanceRef.current;
    if (!element) return;

    optimizeElementPerformance(element);
  }, []);

  return { ref: performanceRef };
}
