// Unified theme system that combines both theme approaches
import { tokens } from "./tokens.js";

// Ensure tokens are available
const ensureTokens = () => {
  if (!tokens || !tokens.colors || !tokens.colors.neutral) {
    console.error("Design tokens not available, using fallbacks");
    return false;
  }
  return true;
};

// Safe token access with fallbacks
const getToken = (path, fallback) => {
  try {
    const keys = path.split(".");
    let value = tokens;
    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return fallback;
      }
    }
    return value;
  } catch (error) {
    return fallback;
  }
};

// Create theme variants with safe access
export const createThemeVariants = () => {
  const tokensAvailable = ensureTokens();

  const lightTheme = {
    colors: {
      // Primary colors
      primary: getToken("colors.primary.500", "#0ea5e9"),
      primaryHover: getToken("colors.primary.600", "#0284c7"),
      primaryActive: getToken("colors.primary.700", "#0369a1"),
      primaryDisabled: getToken("colors.primary.300", "#7dd3fc"),

      // Secondary colors
      secondary: getToken("colors.secondary.500", "#64748b"),
      secondaryHover: getToken("colors.secondary.600", "#475569"),
      secondaryActive: getToken("colors.secondary.700", "#334155"),
      secondaryDisabled: getToken("colors.secondary.300", "#cbd5e1"),

      // Success colors
      success: getToken("colors.success.500", "#22c55e"),
      successHover: getToken("colors.success.600", "#16a34a"),
      successLight: getToken("colors.success.100", "#dcfce7"),

      // Error colors
      error: getToken("colors.error.500", "#ef4444"),
      errorHover: getToken("colors.error.600", "#dc2626"),
      errorLight: getToken("colors.error.100", "#fee2e2"),

      // Warning colors
      warning: getToken("colors.warning.500", "#f59e0b"),
      warningHover: getToken("colors.warning.600", "#d97706"),
      warningLight: getToken("colors.warning.100", "#fef3c7"),

      // Text colors
      textPrimary: getToken("colors.neutral.900", "#171717"),
      textSecondary: getToken("colors.neutral.600", "#525252"),
      textTertiary: getToken("colors.neutral.500", "#737373"),
      textDisabled: getToken("colors.neutral.400", "#a3a3a3"),
      textInverse: getToken("colors.neutral.50", "#fafafa"),

      // Background colors
      background: getToken("colors.neutral.50", "#fafafa"),
      backgroundSecondary: getToken("colors.neutral.100", "#f5f5f5"),
      backgroundTertiary: getToken("colors.neutral.200", "#e5e5e5"),

      // Surface colors
      surface: "#ffffff",
      surfaceSecondary: getToken("colors.neutral.50", "#fafafa"),
      surfaceElevated: "#ffffff",

      // Border colors
      border: getToken("colors.neutral.200", "#e5e5e5"),
      borderSecondary: getToken("colors.neutral.300", "#d4d4d4"),
      borderFocus: getToken("colors.primary.500", "#0ea5e9"),

      // Interactive colors
      interactive: getToken("colors.primary.500", "#0ea5e9"),
      interactiveHover: getToken("colors.primary.600", "#0284c7"),
      interactiveActive: getToken("colors.primary.700", "#0369a1"),
      interactiveDisabled: getToken("colors.neutral.300", "#d4d4d4"),
    },
    shadows: {
      card: getToken("shadows.sm", "0 1px 2px 0 rgba(0, 0, 0, 0.05)"),
      cardHover: getToken(
        "shadows.md",
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      ),
      modal: getToken(
        "shadows.xl",
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      ),
      dropdown: getToken(
        "shadows.lg",
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      ),
    },
  };

  const darkTheme = {
    colors: {
      // Primary colors
      primary: getToken("colors.primary.400", "#38bdf8"),
      primaryHover: getToken("colors.primary.300", "#7dd3fc"),
      primaryActive: getToken("colors.primary.200", "#bae6fd"),
      primaryDisabled: getToken("colors.primary.700", "#0369a1"),

      // Secondary colors
      secondary: getToken("colors.secondary.400", "#94a3b8"),
      secondaryHover: getToken("colors.secondary.300", "#cbd5e1"),
      secondaryActive: getToken("colors.secondary.200", "#e2e8f0"),
      secondaryDisabled: getToken("colors.secondary.700", "#334155"),

      // Success colors
      success: getToken("colors.success.400", "#4ade80"),
      successHover: getToken("colors.success.300", "#86efac"),
      successLight: getToken("colors.success.900", "#14532d"),

      // Error colors
      error: getToken("colors.error.400", "#f87171"),
      errorHover: getToken("colors.error.300", "#fca5a5"),
      errorLight: getToken("colors.error.900", "#7f1d1d"),

      // Warning colors
      warning: getToken("colors.warning.400", "#fbbf24"),
      warningHover: getToken("colors.warning.300", "#fcd34d"),
      warningLight: getToken("colors.warning.900", "#78350f"),

      // Text colors
      textPrimary: getToken("colors.neutral.100", "#f5f5f5"),
      textSecondary: getToken("colors.neutral.300", "#d4d4d4"),
      textTertiary: getToken("colors.neutral.400", "#a3a3a3"),
      textDisabled: getToken("colors.neutral.600", "#525252"),
      textInverse: getToken("colors.neutral.900", "#171717"),

      // Background colors
      background: getToken("colors.neutral.900", "#171717"),
      backgroundSecondary: getToken("colors.neutral.800", "#262626"),
      backgroundTertiary: getToken("colors.neutral.700", "#404040"),

      // Surface colors
      surface: getToken("colors.neutral.800", "#262626"),
      surfaceSecondary: getToken("colors.neutral.700", "#404040"),
      surfaceElevated: getToken("colors.neutral.700", "#404040"),

      // Border colors
      border: getToken("colors.neutral.700", "#404040"),
      borderSecondary: getToken("colors.neutral.600", "#525252"),
      borderFocus: getToken("colors.primary.400", "#38bdf8"),

      // Interactive colors
      interactive: getToken("colors.primary.400", "#38bdf8"),
      interactiveHover: getToken("colors.primary.300", "#7dd3fc"),
      interactiveActive: getToken("colors.primary.200", "#bae6fd"),
      interactiveDisabled: getToken("colors.neutral.700", "#404040"),
    },
    shadows: {
      card: "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)",
      cardHover:
        "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
      modal:
        "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
      dropdown:
        "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
    },
  };

  return { lightTheme, darkTheme, tokensAvailable };
};
