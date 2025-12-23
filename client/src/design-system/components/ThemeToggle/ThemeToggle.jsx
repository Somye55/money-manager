import React from "react";
import { useTheme } from "../../hooks/useTheme.js";
import IconButton from "../IconButton/index.js";

export const ThemeToggle = ({ size = "md", ...props }) => {
  const { toggleTheme, isDark, isLight } = useTheme();

  // Icon representations for theme states
  const getThemeIcon = () => {
    if (isDark) {
      return "🌙"; // Moon for dark theme
    } else if (isLight) {
      return "☀️"; // Sun for light theme
    } else {
      return "🔄"; // Cycle icon for system theme
    }
  };

  const getAriaLabel = () => {
    if (isDark) {
      return "Switch to light theme";
    } else if (isLight) {
      return "Switch to dark theme";
    } else {
      return "Toggle theme";
    }
  };

  return (
    <IconButton
      onClick={toggleTheme}
      size={size}
      variant="ghost"
      aria-label={getAriaLabel()}
      title={getAriaLabel()}
      {...props}
    >
      <span
        style={{
          fontSize: size === "sm" ? "16px" : size === "lg" ? "24px" : "20px",
        }}
      >
        {getThemeIcon()}
      </span>
    </IconButton>
  );
};
