import { useEffect, useState } from "react";
import { statusBarManager, getStatusBarConfig } from "../lib/status-bar";

type Theme = "dark" | "light" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "system";
    }
    return "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    let resolvedTheme: "light" | "dark";

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      resolvedTheme = systemTheme;
    } else {
      root.classList.add(theme);
      resolvedTheme = theme;
    }

    // Update status bar theme
    const statusBarConfig = getStatusBarConfig(theme);
    statusBarManager.updateTheme(statusBarConfig);
  }, [theme]);

  const setThemeValue = (theme: Theme) => {
    localStorage.setItem("theme", theme);
    setTheme(theme);
  };

  return {
    theme,
    setTheme: setThemeValue,
  };
}
