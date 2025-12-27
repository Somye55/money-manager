import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  ThemeMode, 
  ResolvedTheme, 
  ThemeConfig, 
  createThemeConfig, 
  applyThemeToDOM,
  resolveSystemTheme 
} from "../lib/theme-system";

// Legacy context for backward compatibility
const ThemeContext = createContext<any>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // Check localStorage first, default to system
    return (localStorage.getItem("theme") as ThemeMode) || "system";
  });

  const [config, setConfig] = useState<ThemeConfig>(() => createThemeConfig(theme));
  const resolvedTheme = config.resolvedTheme;

  useEffect(() => {
    const newConfig = createThemeConfig(theme);
    setConfig(newConfig);

    // Add transition class for smooth theme switching
    document.documentElement.classList.add('theme-transitioning');

    // Apply theme to DOM
    applyThemeToDOM(newConfig);

    // Apply legacy theme classes for backward compatibility
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newConfig.resolvedTheme);
    root.setAttribute("data-theme", newConfig.resolvedTheme);

    // Store theme preference
    localStorage.setItem("theme", theme);

    // Remove transition class after animation completes
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 300);

    return () => clearTimeout(timeout);
  }, [theme]);

  // Listen for system theme changes when theme is set to 'system'
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const newConfig = createThemeConfig("system");
      setConfig(newConfig);
      applyThemeToDOM(newConfig);

      // Update legacy classes
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newConfig.resolvedTheme);
      root.setAttribute("data-theme", newConfig.resolvedTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const toggleTheme = () => {
    // Toggle between light and dark only (for header button)
    setTheme((prev) => {
      if (prev === "system") {
        // If system, switch to opposite of current system preference
        const systemTheme = resolveSystemTheme();
        return systemTheme === "dark" ? "light" : "dark";
      }
      return prev === "light" ? "dark" : "light";
    });
  };

  const setSpecificTheme = (newTheme: ThemeMode) => {
    // For settings page to set specific theme
    setTheme(newTheme);
  };

  // Get current effective theme (resolves 'system' to actual theme)
  const getCurrentTheme = (): ResolvedTheme => {
    return resolvedTheme;
  };

  return (
    <ThemeContext.Provider
      value={{ 
        theme, 
        resolvedTheme,
        config,
        toggleTheme, 
        setSpecificTheme, 
        getCurrentTheme,
        setTheme: setSpecificTheme,
        isSystemTheme: theme === "system"
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
