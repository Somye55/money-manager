import { useState, useEffect } from "react";
import { tokens } from "../theme/tokens.js";

/**
 * Hook for responsive design utilities
 * Provides current breakpoint, screen size info, and responsive helpers
 */
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const [currentBreakpoint, setCurrentBreakpoint] = useState("xs");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });

      // Determine current breakpoint
      const breakpoints = tokens.responsive.breakpoints;
      if (width >= parseInt(breakpoints["2xl"])) {
        setCurrentBreakpoint("2xl");
      } else if (width >= parseInt(breakpoints.xl)) {
        setCurrentBreakpoint("xl");
      } else if (width >= parseInt(breakpoints.lg)) {
        setCurrentBreakpoint("lg");
      } else if (width >= parseInt(breakpoints.md)) {
        setCurrentBreakpoint("md");
      } else if (width >= parseInt(breakpoints.sm)) {
        setCurrentBreakpoint("sm");
      } else {
        setCurrentBreakpoint("xs");
      }
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper functions
  const isMobile = currentBreakpoint === "xs" || currentBreakpoint === "sm";
  const isTablet = currentBreakpoint === "md";
  const isDesktop =
    currentBreakpoint === "lg" ||
    currentBreakpoint === "xl" ||
    currentBreakpoint === "2xl";

  const isBreakpoint = (breakpoint) => currentBreakpoint === breakpoint;
  const isBreakpointUp = (breakpoint) => {
    const breakpoints = ["xs", "sm", "md", "lg", "xl", "2xl"];
    const currentIndex = breakpoints.indexOf(currentBreakpoint);
    const targetIndex = breakpoints.indexOf(breakpoint);
    return currentIndex >= targetIndex;
  };
  const isBreakpointDown = (breakpoint) => {
    const breakpoints = ["xs", "sm", "md", "lg", "xl", "2xl"];
    const currentIndex = breakpoints.indexOf(currentBreakpoint);
    const targetIndex = breakpoints.indexOf(breakpoint);
    return currentIndex <= targetIndex;
  };

  // Get responsive value based on current breakpoint
  const getResponsiveValue = (values) => {
    if (typeof values === "object" && values !== null) {
      // Return value for current breakpoint or fallback to smaller breakpoints
      const breakpoints = ["2xl", "xl", "lg", "md", "sm", "xs"];
      const currentIndex = breakpoints.indexOf(currentBreakpoint);

      for (let i = currentIndex; i < breakpoints.length; i++) {
        const bp = breakpoints[i];
        if (values[bp] !== undefined) {
          return values[bp];
        }
      }

      // If no breakpoint-specific value found, return the first available value
      return Object.values(values)[0];
    }
    return values;
  };

  // Get responsive spacing based on current breakpoint
  const getResponsiveSpacing = (type = "component") => {
    return (
      tokens.responsive.spacing[currentBreakpoint]?.[type] ||
      tokens.responsive.spacing.xs[type]
    );
  };

  // Get responsive typography based on current breakpoint
  const getResponsiveTypography = (variant = "body") => {
    return (
      tokens.responsive.typography[currentBreakpoint]?.[variant] ||
      tokens.responsive.typography.xs[variant]
    );
  };

  // Check if touch target size is compliant (minimum 44px)
  const isTouchTargetCompliant = (size) => {
    const minSize = parseInt(tokens.mobile.touchTarget.min);
    const sizeValue = typeof size === "string" ? parseInt(size) : size;
    return sizeValue >= minSize;
  };

  return {
    screenSize,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isBreakpoint,
    isBreakpointUp,
    isBreakpointDown,
    getResponsiveValue,
    getResponsiveSpacing,
    getResponsiveTypography,
    isTouchTargetCompliant,
  };
};

export default useResponsive;
