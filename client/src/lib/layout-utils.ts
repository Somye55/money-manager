/**
 * Layout utilities for responsive design and layout calculations
 */

// ============================================================================
// BREAKPOINT UTILITIES
// ============================================================================

export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Get the current breakpoint based on window width
 */
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === "undefined") return "md";

  const width = window.innerWidth;

  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
}

/**
 * Check if current viewport matches a breakpoint
 */
export function matchesBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= breakpoints[breakpoint];
}

/**
 * Check if current viewport is mobile (below md breakpoint)
 */
export function isMobileViewport(): boolean {
  return !matchesBreakpoint("md");
}

/**
 * Check if current viewport is tablet (md to lg)
 */
export function isTabletViewport(): boolean {
  return matchesBreakpoint("md") && !matchesBreakpoint("lg");
}

/**
 * Check if current viewport is desktop (lg and above)
 */
export function isDesktopViewport(): boolean {
  return matchesBreakpoint("lg");
}

// ============================================================================
// SPACING UTILITIES
// ============================================================================

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 48,
  "3xl": 64,
} as const;

export type SpacingSize = keyof typeof spacing;

/**
 * Get spacing value in pixels
 */
export function getSpacing(size: SpacingSize): number {
  return spacing[size];
}

/**
 * Get spacing value as CSS string
 */
export function getSpacingCSS(size: SpacingSize): string {
  return `${spacing[size]}px`;
}

// ============================================================================
// GRID UTILITIES
// ============================================================================

export interface GridConfig {
  columns: number;
  gap: SpacingSize;
  responsive?: {
    [K in Breakpoint]?: {
      columns?: number;
      gap?: SpacingSize;
    };
  };
}

/**
 * Calculate grid item width based on columns and gap
 */
export function calculateGridItemWidth(
  columns: number,
  gap: SpacingSize,
  containerWidth: number
): number {
  const gapSize = spacing[gap];
  const totalGap = gapSize * (columns - 1);
  const availableWidth = containerWidth - totalGap;
  return availableWidth / columns;
}

/**
 * Get responsive grid configuration for current breakpoint
 */
export function getResponsiveGridConfig(
  config: GridConfig,
  currentBreakpoint: Breakpoint
): { columns: number; gap: SpacingSize } {
  const breakpointOrder: Breakpoint[] = ["xs", "sm", "md", "lg", "xl", "2xl"];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

  // Find the most specific responsive config that applies
  let appliedConfig = { columns: config.columns, gap: config.gap };

  if (config.responsive) {
    for (let i = 0; i <= currentIndex; i++) {
      const bp = breakpointOrder[i];
      if (config.responsive[bp]) {
        appliedConfig = {
          columns: config.responsive[bp].columns ?? appliedConfig.columns,
          gap: config.responsive[bp].gap ?? appliedConfig.gap,
        };
      }
    }
  }

  return appliedConfig;
}

// ============================================================================
// SAFE AREA UTILITIES
// ============================================================================

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Get safe area insets from CSS environment variables
 */
export function getSafeAreaInsets(): SafeAreaInsets {
  if (typeof window === "undefined") {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  const computedStyle = getComputedStyle(document.documentElement);

  const parseInset = (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  return {
    top: parseInset(computedStyle.getPropertyValue("--safe-area-top")),
    bottom: parseInset(computedStyle.getPropertyValue("--safe-area-bottom")),
    left: parseInset(computedStyle.getPropertyValue("--safe-area-left")),
    right: parseInset(computedStyle.getPropertyValue("--safe-area-right")),
  };
}

/**
 * Apply safe area insets to an element
 */
export function applySafeAreaInsets(
  element: HTMLElement,
  insets: Partial<SafeAreaInsets>
): void {
  if (insets.top !== undefined) {
    element.style.paddingTop = `max(${insets.top}px, env(safe-area-inset-top))`;
  }
  if (insets.bottom !== undefined) {
    element.style.paddingBottom = `max(${insets.bottom}px, env(safe-area-inset-bottom))`;
  }
  if (insets.left !== undefined) {
    element.style.paddingLeft = `max(${insets.left}px, env(safe-area-inset-left))`;
  }
  if (insets.right !== undefined) {
    element.style.paddingRight = `max(${insets.right}px, env(safe-area-inset-right))`;
  }
}

// ============================================================================
// LAYOUT CALCULATION UTILITIES
// ============================================================================

export interface LayoutDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * Calculate element dimensions maintaining aspect ratio
 */
export function calculateAspectRatioDimensions(
  targetWidth: number,
  targetHeight: number,
  aspectRatio: number
): LayoutDimensions {
  const calculatedHeight = targetWidth / aspectRatio;
  const calculatedWidth = targetHeight * aspectRatio;

  if (calculatedHeight <= targetHeight) {
    return {
      width: targetWidth,
      height: calculatedHeight,
      aspectRatio,
    };
  } else {
    return {
      width: calculatedWidth,
      height: targetHeight,
      aspectRatio,
    };
  }
}

/**
 * Calculate optimal font size based on container width
 */
export function calculateResponsiveFontSize(
  containerWidth: number,
  minSize: number = 14,
  maxSize: number = 24,
  scaleFactor: number = 0.02
): number {
  const calculatedSize = containerWidth * scaleFactor;
  return Math.max(minSize, Math.min(maxSize, calculatedSize));
}

// ============================================================================
// LAYOUT VALIDATION UTILITIES
// ============================================================================

/**
 * Validate that an element meets minimum touch target requirements
 */
export function validateTouchTarget(element: Element): {
  isValid: boolean;
  width: number;
  height: number;
  recommendations: string[];
} {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // WCAG AA minimum
  const recommendations: string[] = [];

  if (rect.width < minSize) {
    recommendations.push(`Increase width to at least ${minSize}px`);
  }
  if (rect.height < minSize) {
    recommendations.push(`Increase height to at least ${minSize}px`);
  }

  return {
    isValid: rect.width >= minSize && rect.height >= minSize,
    width: rect.width,
    height: rect.height,
    recommendations,
  };
}

/**
 * Check if layout has proper spacing between interactive elements
 */
export function validateInteractiveSpacing(
  elements: Element[],
  minSpacing: number = 8
): {
  isValid: boolean;
  violations: Array<{
    element1: Element;
    element2: Element;
    distance: number;
  }>;
} {
  const violations: Array<{
    element1: Element;
    element2: Element;
    distance: number;
  }> = [];

  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      const rect1 = elements[i].getBoundingClientRect();
      const rect2 = elements[j].getBoundingClientRect();

      // Calculate minimum distance between rectangles
      const dx = Math.max(
        0,
        Math.max(rect1.left - rect2.right, rect2.left - rect1.right)
      );
      const dy = Math.max(
        0,
        Math.max(rect1.top - rect2.bottom, rect2.top - rect1.bottom)
      );
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minSpacing) {
        violations.push({
          element1: elements[i],
          element2: elements[j],
          distance,
        });
      }
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
}

// ============================================================================
// LAYOUT PERFORMANCE UTILITIES
// ============================================================================

/**
 * Debounce function for resize handlers
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for scroll handlers
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Create a ResizeObserver for layout monitoring
 */
export function createLayoutObserver(
  callback: (entries: ResizeObserverEntry[]) => void
): ResizeObserver | null {
  if (typeof ResizeObserver === "undefined") {
    return null;
  }

  return new ResizeObserver(callback);
}

// ============================================================================
// CSS-IN-JS UTILITIES
// ============================================================================

/**
 * Generate CSS grid template columns
 */
export function generateGridColumns(columns: number | string[]): string {
  if (typeof columns === "number") {
    return `repeat(${columns}, 1fr)`;
  }
  return columns.join(" ");
}

/**
 * Generate CSS gap value
 */
export function generateGapValue(gap: SpacingSize | number): string {
  if (typeof gap === "number") {
    return `${gap}px`;
  }
  return getSpacingCSS(gap);
}

/**
 * Generate responsive CSS media queries
 */
export function generateMediaQuery(breakpoint: Breakpoint): string {
  return `@media (min-width: ${breakpoints[breakpoint]}px)`;
}

// ============================================================================
// LAYOUT CONSTANTS
// ============================================================================

export const LAYOUT_CONSTANTS = {
  // Touch targets
  MIN_TOUCH_TARGET: 44,
  COMFORTABLE_TOUCH_TARGET: 48,
  LARGE_TOUCH_TARGET: 56,

  // Spacing
  MIN_INTERACTIVE_SPACING: 8,
  COMFORTABLE_INTERACTIVE_SPACING: 16,

  // Typography
  MIN_FONT_SIZE: 14,
  BASE_FONT_SIZE: 16,
  MAX_FONT_SIZE: 24,

  // Layout
  MAX_CONTENT_WIDTH: 1200,
  SIDEBAR_WIDTH: 280,
  HEADER_HEIGHT: 64,
  FOOTER_HEIGHT: 80,

  // Animation
  LAYOUT_TRANSITION_DURATION: 200,
  SCROLL_DEBOUNCE_DELAY: 16,
  RESIZE_DEBOUNCE_DELAY: 100,
} as const;
