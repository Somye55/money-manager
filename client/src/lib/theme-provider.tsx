import { createContext, useContext, useEffect, useState } from "react";
import { statusBarManager, getStatusBarConfig } from "./status-bar";
import {
  ThemeMode,
  ResolvedTheme,
  ThemeConfig,
  createThemeConfig,
  applyThemeToDOM,
  resolveTheme,
  resolveSystemTheme,
} from "./theme-system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
  enableTransitions?: boolean;
};

type ThemeProviderState = {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  config: ThemeConfig;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isSystemTheme: boolean;
};

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  config: createThemeConfig("system"),
  setTheme: () => null,
  toggleTheme: () => null,
  isSystemTheme: true,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  enableTransitions = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(
    () => (localStorage.getItem(storageKey) as ThemeMode) || defaultTheme
  );

  const [config, setConfig] = useState<ThemeConfig>(() =>
    createThemeConfig(theme)
  );
  const resolvedTheme = config.resolvedTheme;
  const isSystemTheme = theme === "system";

  // Initialize status bar on mount
  useEffect(() => {
    statusBarManager.initialize();
  }, []);

  // Handle theme changes and DOM updates
  useEffect(() => {
    const newConfig = createThemeConfig(theme);
    setConfig(newConfig);

    // Add transition class for smooth theme switching
    if (enableTransitions) {
      document.documentElement.classList.add("theme-transitioning");
    }

    // Apply theme to DOM
    applyThemeToDOM(newConfig);

    // Update status bar theme
    const statusBarConfig = getStatusBarConfig(theme);
    statusBarManager.updateTheme(statusBarConfig);

    // Remove transition class after animation completes
    if (enableTransitions) {
      const timeout = setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [theme, enableTransitions]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const newConfig = createThemeConfig("system");
      setConfig(newConfig);
      applyThemeToDOM(newConfig);

      // Update status bar for system theme changes
      const statusBarConfig = getStatusBarConfig("system");
      statusBarManager.updateTheme(statusBarConfig);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Listen for reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = () => {
      const newConfig = createThemeConfig(theme);
      setConfig(newConfig);
      applyThemeToDOM(newConfig);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setThemeValue = (newTheme: ThemeMode) => {
    localStorage.setItem(storageKey, newTheme);
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    if (theme === "system") {
      // If system, switch to opposite of current system preference
      const systemTheme = resolveSystemTheme();
      setThemeValue(systemTheme === "dark" ? "light" : "dark");
    } else {
      // Toggle between light and dark
      setThemeValue(theme === "light" ? "dark" : "light");
    }
  };

  const value = {
    theme,
    resolvedTheme,
    config,
    setTheme: setThemeValue,
    toggleTheme,
    isSystemTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
