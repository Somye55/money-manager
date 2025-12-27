/**
 * Modern Design System Foundation
 *
 * This file contains all design tokens for the Money Manager app redesign.
 * Based on requirements 1.1, 6.2, 6.3, 8.1 for modern, consistent design.
 */

// Color System - Modern palette with semantic tokens
export const colors = {
  // Primary palette - Modern blue
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Main primary color
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },

  // Secondary palette - Complementary purple
  secondary: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#8b5cf6", // Main secondary color
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
    950: "#2e1065",
  },

  // Success palette - Fresh green
  success: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981", // Main success color
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22",
  },

  // Warning palette - Warm orange
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // Main warning color
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
  },

  // Danger palette - Modern red
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444", // Main danger color
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
  },

  // Neutral palette - Clean grays
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },

  // Semantic color mappings
  semantic: {
    background: {
      light: "#ffffff",
      dark: "#0f172a",
    },
    surface: {
      light: "#f8fafc",
      dark: "#1e293b",
    },
    text: {
      primary: {
        light: "#0f172a",
        dark: "#f8fafc",
      },
      secondary: {
        light: "#64748b",
        dark: "#94a3b8",
      },
      tertiary: {
        light: "#94a3b8",
        dark: "#64748b",
      },
    },
    border: {
      light: "#e2e8f0",
      dark: "#334155",
    },
  },
} as const;

// Typography System - Consistent scale and hierarchy
export const typography = {
  // Font families
  fontFamily: {
    sans: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "sans-serif",
    ],
    mono: ["SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "monospace"],
  },

  // Font sizes with line heights - Mobile-optimized
  fontSize: {
    xs: { size: "12px", lineHeight: "16px" }, // Labels, metadata
    sm: { size: "14px", lineHeight: "20px" }, // Captions, secondary text
    base: { size: "16px", lineHeight: "24px" }, // Body text (prevents iOS zoom)
    lg: { size: "18px", lineHeight: "28px" }, // Large body text
    xl: { size: "20px", lineHeight: "28px" }, // Card titles, section headers
    "2xl": { size: "24px", lineHeight: "32px" }, // Page headers
    "3xl": { size: "30px", lineHeight: "36px" }, // Display text
    "4xl": { size: "36px", lineHeight: "40px" }, // Large display
  },

  // Font weights
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  // Letter spacing
  letterSpacing: {
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
  },
} as const;

// Spacing System - 4px base unit with consistent scale
export const spacing = {
  // Base unit: 4px
  0: "0px",
  1: "4px", // 0.25rem
  2: "8px", // 0.5rem
  3: "12px", // 0.75rem
  4: "16px", // 1rem
  5: "20px", // 1.25rem
  6: "24px", // 1.5rem
  7: "28px", // 1.75rem
  8: "32px", // 2rem
  10: "40px", // 2.5rem
  12: "48px", // 3rem
  14: "56px", // 3.5rem
  16: "64px", // 4rem
  20: "80px", // 5rem
  24: "96px", // 6rem
  32: "128px", // 8rem
  40: "160px", // 10rem
  48: "192px", // 12rem
  56: "224px", // 14rem
  64: "256px", // 16rem

  // Semantic spacing
  touch: "44px", // Minimum touch target
  gutter: "16px", // Standard content padding
  section: "32px", // Section spacing
  page: "24px", // Page margins
} as const;

// Shadow and Elevation System - Depth and hierarchy
export const shadows = {
  // Elevation levels
  none: "none",

  // Subtle shadows for cards and surfaces
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",

  // Default card shadow
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",

  // Elevated elements like modals
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",

  // High elevation for overlays
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",

  // Maximum elevation for tooltips and dropdowns
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",

  // Colored shadows for interactive elements
  primary: "0 4px 12px rgba(59, 130, 246, 0.3)",
  success: "0 4px 12px rgba(16, 185, 129, 0.3)",
  warning: "0 4px 12px rgba(245, 158, 11, 0.3)",
  danger: "0 4px 12px rgba(239, 68, 68, 0.3)",

  // Inner shadows for inputs and pressed states
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
} as const;

// Border Radius System - Consistent rounded corners
export const borderRadius = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  "3xl": "24px",
  full: "9999px",
} as const;

// Z-Index System - Layering hierarchy
export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1020,
  banner: 1030,
  overlay: 1040,
  modal: 1050,
  popover: 1060,
  skipLink: 1070,
  toast: 1080,
  tooltip: 1090,
} as const;

// Animation and Transition System
export const animation = {
  // Duration
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },

  // Easing functions
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },

  // Common transitions
  transition: {
    all: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    colors:
      "color 300ms cubic-bezier(0.4, 0, 0.2, 1), background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), border-color 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Export all tokens as a single design system object
export const designSystem = {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  zIndex,
  animation,
  breakpoints,
} as const;

// Type definitions for TypeScript support
export type ColorScale = typeof colors.primary;
export type SemanticColors = typeof colors.semantic;
export type TypographyScale = typeof typography;
export type SpacingScale = typeof spacing;
export type ShadowScale = typeof shadows;
export type DesignSystem = typeof designSystem;
