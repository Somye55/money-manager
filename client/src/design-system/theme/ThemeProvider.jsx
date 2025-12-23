import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { tokens } from "./tokens.js";
import { createThemeVariants } from "./unified-theme.js";
import { componentVariants } from "./variants.js";

const DesignSystemThemeContext = createContext();

export const useDesignSystemTheme = () => {
  const context = useContext(DesignSystemThemeContext);
  if (!context) {
    throw new Error(
      "useDesignSystemTheme must be used within a DesignSystemThemeProvider"
    );
  }
  return context;
};

export const DesignSystemThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // Check localStorage first, default to system
    return localStorage.getItem("design-system-theme") || "system";
  });

  // Add loading state to prevent rendering before tokens are ready
  const [tokensLoaded, setTokensLoaded] = useState(false);

  useEffect(() => {
    // Verify tokens are loaded
    if (
      tokens &&
      tokens.colors &&
      tokens.colors.neutral &&
      tokens.colors.neutral[50]
    ) {
      setTokensLoaded(true);
    } else {
      console.error("Design tokens not properly loaded, retrying...");
      // Retry after a short delay
      setTimeout(() => {
        if (
          tokens &&
          tokens.colors &&
          tokens.colors.neutral &&
          tokens.colors.neutral[50]
        ) {
          setTokensLoaded(true);
        } else {
          console.error(
            "Design tokens still not loaded, proceeding with fallbacks"
          );
          setTokensLoaded(true); // Proceed anyway with fallbacks
        }
      }, 100);
    }
  }, []);

  // Memoize the current theme to prevent unnecessary re-renders
  const currentTheme = useMemo(() => {
    const { lightTheme, darkTheme, tokensAvailable } = createThemeVariants();

    if (!tokensAvailable) {
      console.warn("Tokens not available, using fallback theme");
    }

    const getEffectiveMode = () => {
      if (mode === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return mode;
    };

    const effectiveMode = getEffectiveMode();
    const themeVariant = effectiveMode === "dark" ? darkTheme : lightTheme;

    return {
      mode,
      effectiveMode,
      tokens,
      colors: themeVariant.colors,
      shadows: themeVariant.shadows,
      typography: tokens?.typography || {},
      spacing: tokens?.spacing || {},
      radii: tokens?.radii || {},
      breakpoints: tokens?.breakpoints || {},
      zIndex: tokens?.zIndex || {},
      mobile: tokens?.mobile || {},
      components: componentVariants,
    };
  }, [mode, tokensLoaded]);

  // Apply CSS custom properties when theme changes
  useEffect(() => {
    if (!tokensLoaded) return; // Don't apply theme until tokens are loaded
    const applyThemeVariables = (theme) => {
      const root = document.documentElement;

      // Apply color variables
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(
          `--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
          value
        );
      });

      // Apply spacing variables
      Object.entries(theme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value);
      });

      // Apply typography variables
      Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
        root.style.setProperty(`--font-size-${key}`, value);
      });

      Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
        root.style.setProperty(`--font-weight-${key}`, value);
      });

      Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
        root.style.setProperty(`--line-height-${key}`, value);
      });

      // Apply shadow variables
      Object.entries(theme.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value);
      });

      // Apply radius variables
      Object.entries(theme.radii).forEach(([key, value]) => {
        root.style.setProperty(`--radius-${key}`, value);
      });

      // Apply mobile-specific variables
      Object.entries(theme.mobile.touchTarget).forEach(([key, value]) => {
        root.style.setProperty(`--touch-target-${key}`, value);
      });

      Object.entries(theme.mobile.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--mobile-spacing-${key}`, value);
      });

      // Set the data-theme attribute for compatibility with existing theme system
      root.setAttribute("data-theme", theme.effectiveMode);
    };

    applyThemeVariables(currentTheme);
    localStorage.setItem("design-system-theme", mode);

    // Listen for system theme changes when mode is set to 'system'
    if (mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        // Force re-render by updating a dummy state
        setMode("system"); // This will trigger the useMemo recalculation

        // Dispatch custom event for theme change
        window.dispatchEvent(
          new CustomEvent("themeChange", {
            detail: {
              mode: "system",
              effectiveMode: e.matches ? "dark" : "light",
              source: "system",
            },
          })
        );
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    // Dispatch theme change event for manual theme changes
    window.dispatchEvent(
      new CustomEvent("themeChange", {
        detail: {
          mode,
          effectiveMode: currentTheme.effectiveMode,
          source: "manual",
        },
      })
    );
  }, [currentTheme, mode, tokensLoaded]);

  // Don't render children until tokens are loaded
  if (!tokensLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const setTheme = (newMode) => {
    if (["light", "dark", "system"].includes(newMode)) {
      setMode(newMode);
    } else {
      console.warn(
        `Invalid theme mode: ${newMode}. Valid modes are: light, dark, system`
      );
    }
  };

  const toggleTheme = () => {
    // Toggle between light and dark (skip system for simple toggle)
    setMode((prev) => {
      if (prev === "system") {
        // If system, switch to opposite of current system preference
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        return systemTheme === "dark" ? "light" : "dark";
      }
      return prev === "light" ? "dark" : "light";
    });
  };

  const getToken = (path) => {
    // Utility function to get design tokens by path (e.g., 'colors.primary.500')
    const pathArray = path.split(".");
    let value = tokens;

    for (const key of pathArray) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        console.warn(`Design token not found: ${path}`);
        return undefined;
      }
    }

    return value;
  };

  const contextValue = {
    ...currentTheme,
    setTheme,
    toggleTheme,
    getToken,
    // Utility functions for common operations
    isLight: currentTheme.effectiveMode === "light",
    isDark: currentTheme.effectiveMode === "dark",
    isSystem: mode === "system",
  };

  return (
    <DesignSystemThemeContext.Provider value={contextValue}>
      {children}
    </DesignSystemThemeContext.Provider>
  );
};
