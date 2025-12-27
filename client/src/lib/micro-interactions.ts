/**
 * Micro-interactions and Animation Utilities
 *
 * Provides enhanced micro-interactions, animations, and touch feedback
 * for a polished mobile experience.
 *
 * Features:
 * - Touch feedback and haptic responses
 * - Smooth state transitions
 * - Performance-optimized animations
 * - Accessibility-aware motion
 * - Mobile-first interaction patterns
 */

import { useEffect, useRef, useState, useCallback } from "react";

// Animation timing constants
export const ANIMATION_TIMING = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  MICRO: 100,
} as const;

// Easing functions
export const EASING = {
  EASE_OUT: "cubic-bezier(0, 0, 0.2, 1)",
  EASE_IN: "cubic-bezier(0.4, 0, 1, 1)",
  EASE_IN_OUT: "cubic-bezier(0.4, 0, 0.2, 1)",
  BOUNCE: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  SPRING: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
} as const;

// Touch feedback types
export type TouchFeedbackType =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "impact";

// Haptic feedback utility
export const hapticFeedback = (type: TouchFeedbackType = "light") => {
  if (typeof window === "undefined") return;

  // Check if device supports haptic feedback
  if ("vibrate" in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      selection: [5],
      impact: [15, 10, 15],
    };

    navigator.vibrate(patterns[type]);
  }

  // iOS haptic feedback (if available)
  if ("Haptics" in window && (window as any).Haptics) {
    const hapticTypes = {
      light: "light",
      medium: "medium",
      heavy: "heavy",
      selection: "selection",
      impact: "impact",
    };

    try {
      (window as any).Haptics.impact({ style: hapticTypes[type] });
    } catch (error) {
      // Silently fail if haptics not available
    }
  }
};

// Ripple effect utility
export const createRippleEffect = (
  element: HTMLElement,
  event: React.MouseEvent | React.TouchEvent
) => {
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x =
    ("touches" in event ? event.touches[0].clientX : event.clientX) -
    rect.left -
    size / 2;
  const y =
    ("touches" in event ? event.touches[0].clientY : event.clientY) -
    rect.top -
    size / 2;

  const ripple = document.createElement("span");
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

  element.appendChild(ripple);

  // Remove ripple after animation
  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple);
    }
  }, 600);
};

// Enhanced button press animation
export const useButtonPress = (
  options: {
    scale?: number;
    duration?: number;
    haptic?: TouchFeedbackType;
  } = {}
) => {
  const {
    scale = 0.95,
    duration = ANIMATION_TIMING.MICRO,
    haptic = "light",
  } = options;
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handlePressStart = useCallback(() => {
    setIsPressed(true);
    hapticFeedback(haptic);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [haptic]);

  const handlePressEnd = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsPressed(false);
    }, duration);
  }, [duration]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const pressProps = {
    onMouseDown: handlePressStart,
    onMouseUp: handlePressEnd,
    onMouseLeave: handlePressEnd,
    onTouchStart: handlePressStart,
    onTouchEnd: handlePressEnd,
    style: {
      transform: isPressed ? `scale(${scale})` : "scale(1)",
      transition: `transform ${duration}ms ${EASING.EASE_OUT}`,
    },
  };

  return { isPressed, pressProps };
};

// Hover lift animation
export const useHoverLift = (
  options: {
    translateY?: number;
    scale?: number;
    duration?: number;
  } = {}
) => {
  const {
    translateY = -4,
    scale = 1.02,
    duration = ANIMATION_TIMING.NORMAL,
  } = options;
  const [isHovered, setIsHovered] = useState(false);

  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    style: {
      transform: isHovered
        ? `translateY(${translateY}px) scale(${scale})`
        : "translateY(0) scale(1)",
      transition: `transform ${duration}ms ${EASING.EASE_OUT}`,
    },
  };

  return { isHovered, hoverProps };
};

// Stagger animation for lists
export const useStaggerAnimation = (itemCount: number, delay: number = 50) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getItemStyle = (index: number) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity ${ANIMATION_TIMING.NORMAL}ms ${EASING.EASE_OUT} ${
      index * delay
    }ms, 
                 transform ${ANIMATION_TIMING.NORMAL}ms ${EASING.EASE_OUT} ${
      index * delay
    }ms`,
  });

  return { containerRef, getItemStyle, isVisible };
};

// Loading state animation
export const useLoadingAnimation = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return dots;
};

// Smooth scroll utility
export const smoothScrollTo = (
  element: HTMLElement | string,
  options: {
    offset?: number;
    duration?: number;
    behavior?: ScrollBehavior;
  } = {}
) => {
  const { offset = 0, behavior = "smooth" } = options;

  const targetElement =
    typeof element === "string"
      ? (document.querySelector(element) as HTMLElement)
      : element;

  if (!targetElement) return;

  const targetPosition = targetElement.offsetTop - offset;

  window.scrollTo({
    top: targetPosition,
    behavior,
  });
};

// Focus management for accessibility
export const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement>(null);

  const focusElement = useCallback(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (event.key !== "Tab") return;

    const focusableElements = focusRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, []);

  return { focusRef, focusElement, trapFocus };
};

// Performance-optimized animation frame utility
export const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};

// Reduced motion detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};

// Touch gesture utilities
export const useTouchGestures = (
  options: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    threshold?: number;
  } = {}
) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
  } = options;
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > threshold || absDeltaY > threshold) {
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      }

      touchStartRef.current = null;
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold]
  );

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
};

// Animation class utilities
export const animationClasses = {
  // Entrance animations
  fadeIn: "animate-fade-in",
  slideUp: "animate-slide-up",
  scaleIn: "animate-scale-in",
  slideInRight: "animate-slide-in-right",
  bounceIn: "animate-bounce-in",

  // Micro-interactions
  bounce: "micro-bounce",
  lift: "micro-lift",
  glow: "micro-glow",

  // Loading states
  shimmer: "animate-shimmer",
  pulse: "animate-pulse",
  float: "animate-float",

  // Utility classes
  stagger: "animate-stagger",
  shake: "animate-shake",
  ripple: "ripple-effect",
} as const;

// CSS-in-JS animation styles
export const animationStyles = {
  fadeIn: {
    animation: `fade-in ${ANIMATION_TIMING.NORMAL}ms ${EASING.EASE_OUT}`,
  },
  slideUp: {
    animation: `slide-up ${ANIMATION_TIMING.NORMAL}ms ${EASING.EASE_OUT}`,
  },
  scaleIn: {
    animation: `scale-in ${ANIMATION_TIMING.FAST}ms ${EASING.EASE_OUT}`,
  },
  bounce: {
    transition: `transform ${ANIMATION_TIMING.FAST}ms ${EASING.BOUNCE}`,
  },
  lift: {
    transition: `all ${ANIMATION_TIMING.NORMAL}ms ${EASING.EASE_OUT}`,
  },
} as const;
