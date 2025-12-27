/**
 * React hooks for responsive layout and modern layout system
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getCurrentBreakpoint,
  matchesBreakpoint,
  isMobileViewport,
  isTabletViewport,
  isDesktopViewport,
  getSafeAreaInsets,
  debounce,
  throttle,
  createLayoutObserver,
  type Breakpoint,
  type SafeAreaInsets,
  type GridConfig,
  getResponsiveGridConfig,
} from "@/lib/layout-utils";

// ============================================================================
// BREAKPOINT HOOKS
// ============================================================================

/**
 * Hook to get current breakpoint and respond to changes
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() =>
    getCurrentBreakpoint()
  );

  useEffect(() => {
    const updateBreakpoint = debounce(() => {
      setBreakpoint(getCurrentBreakpoint());
    }, 100);

    updateBreakpoint(); // Initial call
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}

/**
 * Hook to check if viewport matches specific breakpoint
 */
export function useMatchBreakpoint(breakpoint: Breakpoint) {
  const [matches, setMatches] = useState(() => matchesBreakpoint(breakpoint));

  useEffect(() => {
    const updateMatches = debounce(() => {
      setMatches(matchesBreakpoint(breakpoint));
    }, 100);

    updateMatches(); // Initial call
    window.addEventListener("resize", updateMatches);
    return () => window.removeEventListener("resize", updateMatches);
  }, [breakpoint]);

  return matches;
}

/**
 * Hook to get viewport type (mobile, tablet, desktop)
 */
export function useViewportType() {
  const [viewportType, setViewportType] = useState<
    "mobile" | "tablet" | "desktop"
  >(() => {
    if (isMobileViewport()) return "mobile";
    if (isTabletViewport()) return "tablet";
    return "desktop";
  });

  useEffect(() => {
    const updateViewportType = debounce(() => {
      if (isMobileViewport()) setViewportType("mobile");
      else if (isTabletViewport()) setViewportType("tablet");
      else setViewportType("desktop");
    }, 100);

    updateViewportType(); // Initial call
    window.addEventListener("resize", updateViewportType);
    return () => window.removeEventListener("resize", updateViewportType);
  }, []);

  return viewportType;
}

// ============================================================================
// SAFE AREA HOOKS
// ============================================================================

/**
 * Hook to get safe area insets
 */
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState<SafeAreaInsets>(() =>
    getSafeAreaInsets()
  );

  useEffect(() => {
    const updateInsets = () => {
      setInsets(getSafeAreaInsets());
    };

    updateInsets(); // Initial call

    // Listen for orientation changes and resize events
    window.addEventListener("resize", updateInsets);
    window.addEventListener("orientationchange", updateInsets);

    return () => {
      window.removeEventListener("resize", updateInsets);
      window.removeEventListener("orientationchange", updateInsets);
    };
  }, []);

  return insets;
}

/**
 * Hook to apply safe area insets to an element
 */
export function useSafeAreaElement<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (ref.current) {
      const element = ref.current;
      element.style.paddingTop = `max(1rem, env(safe-area-inset-top))`;
      element.style.paddingBottom = `max(1rem, env(safe-area-inset-bottom))`;
      element.style.paddingLeft = `max(1rem, env(safe-area-inset-left))`;
      element.style.paddingRight = `max(1rem, env(safe-area-inset-right))`;
    }
  }, [insets]);

  return ref;
}

// ============================================================================
// RESPONSIVE GRID HOOKS
// ============================================================================

/**
 * Hook for responsive grid configuration
 */
export function useResponsiveGrid(config: GridConfig) {
  const breakpoint = useBreakpoint();

  const gridConfig = getResponsiveGridConfig(config, breakpoint);

  return {
    ...gridConfig,
    breakpoint,
    isMobile: breakpoint === "xs" || breakpoint === "sm",
    isTablet: breakpoint === "md",
    isDesktop:
      breakpoint === "lg" || breakpoint === "xl" || breakpoint === "2xl",
  };
}

// ============================================================================
// ELEMENT DIMENSION HOOKS
// ============================================================================

/**
 * Hook to track element dimensions
 */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = createLayoutObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    if (observer) {
      observer.observe(ref.current);
      return () => observer.disconnect();
    }

    // Fallback for browsers without ResizeObserver
    const updateSize = debounce(() => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setSize({ width: rect.width, height: rect.height });
      }
    }, 100);

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return { ref, ...size };
}

/**
 * Hook to track viewport dimensions
 */
export function useViewportSize() {
  const [size, setSize] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));

  useEffect(() => {
    const updateSize = debounce(() => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 100);

    updateSize(); // Initial call
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
}

// ============================================================================
// SCROLL HOOKS
// ============================================================================

/**
 * Hook to track scroll position
 */
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateScrollPosition = throttle(() => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    }, 16);

    updateScrollPosition(); // Initial call
    window.addEventListener("scroll", updateScrollPosition, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollPosition);
  }, []);

  return scrollPosition;
}

/**
 * Hook to detect scroll direction
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateScrollDirection = throttle(() => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection("up");
      }

      lastScrollY.current = currentScrollY;
    }, 16);

    window.addEventListener("scroll", updateScrollDirection, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, []);

  return scrollDirection;
}

// ============================================================================
// LAYOUT STATE HOOKS
// ============================================================================

/**
 * Hook for managing layout state (sidebar, modal, etc.)
 */
export function useLayoutState() {
  const [state, setState] = useState({
    sidebarOpen: false,
    modalOpen: false,
    overlayOpen: false,
  });

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  }, []);

  const openModal = useCallback(() => {
    setState((prev) => ({ ...prev, modalOpen: true }));
  }, []);

  const closeModal = useCallback(() => {
    setState((prev) => ({ ...prev, modalOpen: false }));
  }, []);

  const openOverlay = useCallback(() => {
    setState((prev) => ({ ...prev, overlayOpen: true }));
  }, []);

  const closeOverlay = useCallback(() => {
    setState((prev) => ({ ...prev, overlayOpen: false }));
  }, []);

  const closeAll = useCallback(() => {
    setState({
      sidebarOpen: false,
      modalOpen: false,
      overlayOpen: false,
    });
  }, []);

  return {
    ...state,
    toggleSidebar,
    openModal,
    closeModal,
    openOverlay,
    closeOverlay,
    closeAll,
  };
}

// ============================================================================
// MOBILE-SPECIFIC HOOKS
// ============================================================================

/**
 * Hook to detect mobile keyboard visibility
 */
export function useMobileKeyboard() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const initialViewportHeight = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    initialViewportHeight.current = window.innerHeight;

    const handleResize = debounce(() => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialViewportHeight.current - currentHeight;

      // Keyboard is likely visible if height decreased significantly
      if (heightDifference > 150) {
        setKeyboardVisible(true);
        setKeyboardHeight(heightDifference);
      } else {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
        // Update initial height when keyboard is hidden
        if (Math.abs(heightDifference) < 50) {
          initialViewportHeight.current = currentHeight;
        }
      }
    }, 100);

    window.addEventListener("resize", handleResize);

    // Handle orientation change
    const handleOrientationChange = () => {
      setTimeout(() => {
        initialViewportHeight.current = window.innerHeight;
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }, 500);
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return { keyboardVisible, keyboardHeight };
}

/**
 * Hook to handle mobile-specific layout adjustments
 */
export function useMobileLayout() {
  const viewportType = useViewportType();
  const { keyboardVisible, keyboardHeight } = useMobileKeyboard();
  const safeAreaInsets = useSafeAreaInsets();

  const isMobile = viewportType === "mobile";
  const isTablet = viewportType === "tablet";
  const isDesktop = viewportType === "desktop";

  return {
    isMobile,
    isTablet,
    isDesktop,
    keyboardVisible,
    keyboardHeight,
    safeAreaInsets,
    // Helper methods
    shouldUseBottomSheet: isMobile,
    shouldUseDrawer: isTablet || isDesktop,
    shouldStackVertically: isMobile,
    shouldUseCompactLayout: isMobile || keyboardVisible,
  };
}

// ============================================================================
// LAYOUT ANIMATION HOOKS
// ============================================================================

/**
 * Hook for layout transitions
 */
export function useLayoutTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = useCallback(() => {
    setIsTransitioning(true);
  }, []);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  const withTransition = useCallback(
    async (callback: () => void | Promise<void>) => {
      startTransition();
      try {
        await callback();
      } finally {
        // Small delay to ensure smooth transition
        setTimeout(endTransition, 200);
      }
    },
    [startTransition, endTransition]
  );

  return {
    isTransitioning,
    startTransition,
    endTransition,
    withTransition,
  };
}
