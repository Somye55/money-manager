/**
 * Theme Toggle Component
 *
 * Modern theme switcher with smooth transitions and accessibility.
 * Demonstrates the comprehensive theming system.
 */

import React from "react";
import { useTheme } from "../../lib/theme-provider";
import { ThemeMode } from "../../lib/theme-system";

interface ThemeToggleProps {
  variant?: "button" | "select" | "segmented";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

// Icons for theme modes
const SunIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SystemIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const getThemeIcon = (theme: ThemeMode, resolvedTheme: string) => {
  if (theme === "system") return <SystemIcon />;
  if (theme === "light" || resolvedTheme === "light") return <SunIcon />;
  return <MoonIcon />;
};

const getThemeLabel = (theme: ThemeMode) => {
  switch (theme) {
    case "light":
      return "Light";
    case "dark":
      return "Dark";
    case "system":
      return "System";
    default:
      return "Theme";
  }
};

// Button variant - Simple toggle
export const ThemeToggleButton: React.FC<ThemeToggleProps> = ({
  size = "md",
  showLabel = false,
  className = "",
}) => {
  const { theme, resolvedTheme, toggleTheme, isSystemTheme } = useTheme();

  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        theme-button theme-button--ghost
        ${sizeClasses[size]}
        ${showLabel ? "flex-row gap-2 px-3" : "aspect-square"}
        relative
        ${className}
      `}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      title={`Current theme: ${getThemeLabel(theme)}`}
    >
      <span className="relative">
        {getThemeIcon(theme, resolvedTheme)}
        {isSystemTheme && <span className="theme-system-indicator" />}
      </span>
      {showLabel && <span className="theme-text">{getThemeLabel(theme)}</span>}
    </button>
  );
};

// Select variant - Dropdown with all options
export const ThemeToggleSelect: React.FC<ThemeToggleProps> = ({
  size = "md",
  className = "",
}) => {
  const { theme, setTheme } = useTheme();

  const sizeClasses = {
    sm: "h-8 text-sm px-2",
    md: "h-10 text-base px-3",
    lg: "h-12 text-lg px-4",
  };

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as ThemeMode)}
      className={`
        theme-input
        ${sizeClasses[size]}
        cursor-pointer
        ${className}
      `}
      aria-label="Select theme"
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
};

// Segmented variant - Button group
export const ThemeToggleSegmented: React.FC<ThemeToggleProps> = ({
  size = "md",
  className = "",
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const sizeClasses = {
    sm: "h-8 px-2 text-xs",
    md: "h-10 px-3 text-sm",
    lg: "h-12 px-4 text-base",
  };

  const themes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <SunIcon /> },
    { value: "dark", label: "Dark", icon: <MoonIcon /> },
    { value: "system", label: "System", icon: <SystemIcon /> },
  ];

  return (
    <div
      className={`
        inline-flex
        bg-gray-100 dark:bg-gray-800
        rounded-lg
        p-1
        ${className}
      `}
      role="radiogroup"
      aria-label="Theme selection"
    >
      {themes.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            ${sizeClasses[size]}
            flex items-center gap-2
            rounded-md
            font-medium
            transition-all duration-200
            ${
              theme === value
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }
          `}
          role="radio"
          aria-checked={theme === value}
          aria-label={`${label} theme`}
        >
          <span className="relative">
            {icon}
            {value === "system" && theme === "system" && (
              <span className="theme-system-indicator" />
            )}
          </span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

// Main component with variant selection
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = "button",
  ...props
}) => {
  switch (variant) {
    case "select":
      return <ThemeToggleSelect {...props} />;
    case "segmented":
      return <ThemeToggleSegmented {...props} />;
    case "button":
    default:
      return <ThemeToggleButton {...props} />;
  }
};

// Hook for theme-aware styling
export const useThemeClasses = () => {
  const { resolvedTheme, config } = useTheme();

  return {
    theme: resolvedTheme,
    isDark: resolvedTheme === "dark",
    isLight: resolvedTheme === "light",
    config,

    // Utility functions for conditional classes
    themeClass: (lightClass: string, darkClass: string) =>
      resolvedTheme === "dark" ? darkClass : lightClass,

    // Get theme-aware color values
    getColor: (colorPath: string) => {
      const keys = colorPath.split(".");
      let value: any = config.colors;

      for (const key of keys) {
        value = value?.[key];
      }

      return value || "";
    },
  };
};

export default ThemeToggle;
