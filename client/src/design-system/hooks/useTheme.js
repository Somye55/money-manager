import { useDesignSystemTheme } from "../theme/ThemeProvider.jsx";
import { useEffect, useState } from "react";

// Re-export the design system theme hook with a simpler name
export const useTheme = useDesignSystemTheme;

// Additional utility hooks for common theme operations
export const useThemeMode = () => {
  const {
    mode,
    effectiveMode,
    setTheme,
    toggleTheme,
    isLight,
    isDark,
    isSystem,
  } = useTheme();

  return {
    mode,
    effectiveMode,
    setTheme,
    toggleTheme,
    isLight,
    isDark,
    isSystem,
  };
};

export const useThemeColors = () => {
  const { colors } = useTheme();
  return colors;
};

export const useThemeTokens = () => {
  const { tokens, getToken } = useTheme();
  return { tokens, getToken };
};

// Hook to listen for theme changes
export const useThemeChangeListener = (callback) => {
  useEffect(() => {
    const handleThemeChange = (event) => {
      callback(event.detail);
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, [callback]);
};

// Hook to get theme change events as state
export const useThemeChangeEvents = () => {
  const [lastThemeChange, setLastThemeChange] = useState(null);

  useThemeChangeListener((themeChangeDetail) => {
    setLastThemeChange({
      ...themeChangeDetail,
      timestamp: Date.now(),
    });
  });

  return lastThemeChange;
};

export const useResponsive = () => {
  const { breakpoints } = useTheme();

  // Helper function to create media queries
  const createMediaQuery = (breakpoint) => {
    return `(min-width: ${breakpoints[breakpoint]})`;
  };

  return {
    breakpoints,
    createMediaQuery,
    // Common breakpoint checks
    isSm: () => window.matchMedia(createMediaQuery("sm")).matches,
    isMd: () => window.matchMedia(createMediaQuery("md")).matches,
    isLg: () => window.matchMedia(createMediaQuery("lg")).matches,
    isXl: () => window.matchMedia(createMediaQuery("xl")).matches,
  };
};
