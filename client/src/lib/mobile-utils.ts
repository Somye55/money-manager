import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Touch target guidelines (min 44px for iOS/Android)
export const TOUCH_TARGET = {
  MIN_SIZE: 44,
};

// Common mobile classes
export const MOBILE_CLASSES = {
  TOUCH_TARGET: "min-h-[44px] min-w-[44px] touch-manipulation",
  SAFE_AREA_TOP: "pt-[env(safe-area-inset-top)]",
  SAFE_AREA_BOTTOM: "pb-[env(safe-area-inset-bottom)]",
  SAFE_AREA_LEFT: "pl-[env(safe-area-inset-left)]",
  SAFE_AREA_RIGHT: "pr-[env(safe-area-inset-right)]",
  TOUCH_MANIPULATION: "touch-manipulation",
  NO_TAP_HIGHLIGHT: "-webkit-tap-highlight-color-transparent",
};

/**
 * Detects if the current device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
  );
}

interface OptimizeOptions {
  touchTarget?: boolean;
  preventHover?: boolean;
  preventZoom?: boolean;
  minTouchSize?: number;
}

/**
 * Optimizes an element for mobile interaction
 */
export function optimizeForMobile(
  element: HTMLElement,
  options: OptimizeOptions = {}
): () => void {
  const {
    touchTarget = true,
    preventHover = true,
    preventZoom = false,
    minTouchSize = TOUCH_TARGET.MIN_SIZE,
  } = options;

  const originalStyles = {
    minHeight: element.style.minHeight,
    minWidth: element.style.minWidth,
    touchAction: element.style.touchAction,
    fontSize: element.style.fontSize,
  };

  // Apply touch target sizing
  if (touchTarget) {
    const currentMinHeight =
      parseFloat(getComputedStyle(element).minHeight) || 0;
    const currentMinWidth = parseFloat(getComputedStyle(element).minWidth) || 0;

    if (currentMinHeight < minTouchSize) {
      element.style.minHeight = `${minTouchSize}px`;
    }
    if (currentMinWidth < minTouchSize) {
      element.style.minWidth = `${minTouchSize}px`;
    }
  }

  // Improve touch handling
  element.style.touchAction = "manipulation";

  // Prevent iOS zoom on inputs
  if (
    preventZoom &&
    (element.tagName === "INPUT" || element.tagName === "TEXTAREA")
  ) {
    element.style.fontSize = "16px";
  }

  // Handle hover states on touch devices
  const handleTouchStart = () => {
    if (preventHover) {
      element.dataset.touchActive = "true";
    }
  };

  const handleTouchEnd = () => {
    if (preventHover) {
      delete element.dataset.touchActive;
      // Force blur to remove sticky :hover state
      // setTimeout to allow click events to fire first
      setTimeout(() => element.blur(), 100);
    }
  };

  element.addEventListener("touchstart", handleTouchStart, { passive: true });
  element.addEventListener("touchend", handleTouchEnd, { passive: true });

  // Cleanup function
  return () => {
    element.style.minHeight = originalStyles.minHeight;
    element.style.minWidth = originalStyles.minWidth;
    element.style.touchAction = originalStyles.touchAction;
    element.style.fontSize = originalStyles.fontSize;
    element.removeEventListener("touchstart", handleTouchStart);
    element.removeEventListener("touchend", handleTouchEnd);
  };
}
