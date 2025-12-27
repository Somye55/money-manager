/**
 * Design System Utilities
 *
 * Provides easy access to design tokens and utility functions
 * for consistent styling throughout the application.
 */

import { designSystem } from "./design-tokens";
import { cn } from "./utils";

// Re-export design tokens for easy access
export { designSystem } from "./design-tokens";
export type {
  ColorScale,
  SemanticColors,
  TypographyScale,
  SpacingScale,
  ShadowScale,
  DesignSystem,
} from "./design-tokens";

/**
 * Utility functions for working with design tokens
 */

// Color utilities
export const getColor = (color: string, shade?: number) => {
  if (shade) {
    return `var(--${color}-${shade})`;
  }
  return `var(--${color})`;
};

// Spacing utilities
export const getSpacing = (size: keyof typeof designSystem.spacing) => {
  return designSystem.spacing[size];
};

// Typography utilities
export const getTypography = (
  size: keyof typeof designSystem.typography.fontSize
) => {
  return designSystem.typography.fontSize[size];
};

// Shadow utilities
export const getShadow = (level: keyof typeof designSystem.shadows) => {
  return designSystem.shadows[level];
};

/**
 * Component variant utilities
 */

// Button variants using design tokens
export const buttonVariants = {
  primary: cn(
    "bg-primary-500 hover:bg-primary-600 active:bg-primary-700",
    "text-white font-medium",
    "shadow-primary hover:shadow-lg",
    "transition-all duration-normal ease-out"
  ),
  secondary: cn(
    "bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700",
    "text-white font-medium",
    "shadow-md hover:shadow-lg",
    "transition-all duration-normal ease-out"
  ),
  outline: cn(
    "border-2 border-primary-500 hover:border-primary-600",
    "text-primary-500 hover:text-primary-600 hover:bg-primary-50",
    "font-medium",
    "transition-all duration-normal ease-out"
  ),
  ghost: cn(
    "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100",
    "font-medium",
    "transition-all duration-normal ease-out"
  ),
  danger: cn(
    "bg-danger-500 hover:bg-danger-600 active:bg-danger-700",
    "text-white font-medium",
    "shadow-danger hover:shadow-lg",
    "transition-all duration-normal ease-out"
  ),
};

// Card variants using design tokens
export const cardVariants = {
  default: cn(
    "bg-white border border-neutral-200",
    "rounded-lg shadow-md",
    "transition-all duration-normal ease-out"
  ),
  elevated: cn(
    "bg-white border border-neutral-200",
    "rounded-lg shadow-lg hover:shadow-xl",
    "transition-all duration-normal ease-out"
  ),
  outlined: cn(
    "bg-white border-2 border-neutral-300",
    "rounded-lg",
    "transition-all duration-normal ease-out"
  ),
  filled: cn(
    "bg-neutral-50 border border-neutral-200",
    "rounded-lg shadow-sm",
    "transition-all duration-normal ease-out"
  ),
  interactive: cn(
    "bg-white border border-neutral-200",
    "rounded-lg shadow-md hover:shadow-lg",
    "cursor-pointer transform hover:scale-[1.02]",
    "transition-all duration-normal ease-out"
  ),
};

// Input variants using design tokens
export const inputVariants = {
  default: cn(
    "w-full px-4 py-3 text-base",
    "bg-white border border-neutral-300",
    "rounded-lg",
    "focus:border-primary-500 focus:ring-2 focus:ring-primary-100",
    "placeholder:text-neutral-400",
    "transition-all duration-normal ease-out"
  ),
  error: cn(
    "w-full px-4 py-3 text-base",
    "bg-white border-2 border-danger-500",
    "rounded-lg",
    "focus:border-danger-600 focus:ring-2 focus:ring-danger-100",
    "placeholder:text-neutral-400",
    "transition-all duration-normal ease-out"
  ),
  success: cn(
    "w-full px-4 py-3 text-base",
    "bg-white border-2 border-success-500",
    "rounded-lg",
    "focus:border-success-600 focus:ring-2 focus:ring-success-100",
    "placeholder:text-neutral-400",
    "transition-all duration-normal ease-out"
  ),
};

/**
 * Layout utilities using design tokens
 */

// Container utilities
export const containerVariants = {
  default: cn("w-full mx-auto px-gutter"),
  page: cn("w-full mx-auto px-page py-page"),
  section: cn("w-full mx-auto px-gutter py-section"),
};

// Flex utilities
export const flexVariants = {
  center: cn("flex items-center justify-center"),
  between: cn("flex items-center justify-between"),
  start: cn("flex items-center justify-start"),
  end: cn("flex items-center justify-end"),
  col: cn("flex flex-col"),
  colCenter: cn("flex flex-col items-center justify-center"),
};

// Grid utilities
export const gridVariants = {
  responsive: cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"),
  cards: cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"),
  list: cn("grid grid-cols-1 gap-3"),
};

/**
 * Typography utilities using design tokens
 */

export const textVariants = {
  // Display text
  display: cn("text-3xl font-bold text-neutral-900 leading-tight"),

  // Headings
  h1: cn("text-2xl font-bold text-neutral-900 leading-tight"),
  h2: cn("text-xl font-semibold text-neutral-900 leading-tight"),
  h3: cn("text-lg font-semibold text-neutral-800 leading-tight"),

  // Body text
  body: cn("text-base text-neutral-700 leading-relaxed"),
  bodyLarge: cn("text-lg text-neutral-700 leading-relaxed"),

  // Secondary text
  caption: cn("text-sm text-neutral-600"),
  small: cn("text-xs text-neutral-500"),

  // Interactive text
  link: cn("text-primary-600 hover:text-primary-700 underline cursor-pointer"),
  button: cn("font-medium text-center"),

  // Status text
  success: cn("text-success-600 font-medium"),
  warning: cn("text-warning-600 font-medium"),
  danger: cn("text-danger-600 font-medium"),
};

/**
 * Animation utilities using design tokens
 */

export const animationVariants = {
  fadeIn: cn("animate-fade-in"),
  slideUp: cn("animate-slide-up"),

  // Hover animations
  hoverScale: cn(
    "transform hover:scale-105 transition-transform duration-normal ease-out"
  ),
  hoverLift: cn(
    "transform hover:-translate-y-1 transition-transform duration-normal ease-out"
  ),

  // Loading animations
  pulse: cn("animate-pulse"),
  spin: cn("animate-spin"),
};

/**
 * Mobile-specific utilities
 */

export const mobileVariants = {
  // Touch targets
  touchTarget: cn("min-h-touch min-w-touch"),

  // Safe areas
  safeTop: cn("pt-safe-top"),
  safeBottom: cn("pb-safe-bottom"),
  safeLeft: cn("pl-safe-left"),
  safeRight: cn("pr-safe-right"),

  // Mobile optimizations
  noZoom: cn("touch-manipulation"),
  noHighlight: cn("tap-highlight-transparent"),

  // Scroll behavior
  scroll: cn("overscroll-contain -webkit-overflow-scrolling-touch"),
  noPullRefresh: cn("overscroll-y-contain"),
};

/**
 * Responsive utilities
 */

export const responsiveVariants = {
  // Hide/show on different screen sizes
  mobileOnly: cn("block sm:hidden"),
  desktopOnly: cn("hidden sm:block"),

  // Responsive spacing
  responsivePadding: cn("px-4 sm:px-6 lg:px-8"),
  responsiveMargin: cn("mx-4 sm:mx-6 lg:mx-8"),

  // Responsive text
  responsiveText: cn("text-sm sm:text-base lg:text-lg"),
  responsiveHeading: cn("text-lg sm:text-xl lg:text-2xl"),
};

/**
 * Utility function to create consistent component styles
 */

export const createComponentVariants = <T extends Record<string, string>>(
  baseStyles: string,
  variants: T
): T & { base: string } => {
  return {
    base: baseStyles,
    ...variants,
  };
};

/**
 * Theme-aware utilities
 */

export const themeVariants = {
  // Background variants
  background: cn("bg-white dark:bg-neutral-900"),
  surface: cn("bg-neutral-50 dark:bg-neutral-800"),

  // Text variants
  textPrimary: cn("text-neutral-900 dark:text-neutral-100"),
  textSecondary: cn("text-neutral-600 dark:text-neutral-400"),
  textTertiary: cn("text-neutral-500 dark:text-neutral-500"),

  // Border variants
  border: cn("border-neutral-200 dark:border-neutral-700"),
  borderLight: cn("border-neutral-100 dark:border-neutral-800"),
};

/**
 * Export commonly used combinations
 */

export const commonStyles = {
  // Page layouts
  page: cn(containerVariants.page, themeVariants.background),
  section: cn(containerVariants.section),

  // Cards
  card: cn(cardVariants.default, themeVariants.surface),
  cardInteractive: cn(cardVariants.interactive, themeVariants.surface),

  // Buttons
  buttonPrimary: cn(buttonVariants.primary, mobileVariants.touchTarget),
  buttonSecondary: cn(buttonVariants.secondary, mobileVariants.touchTarget),

  // Text
  heading: cn(textVariants.h1, themeVariants.textPrimary),
  body: cn(textVariants.body, themeVariants.textSecondary),

  // Mobile optimized
  mobileButton: cn(
    buttonVariants.primary,
    mobileVariants.touchTarget,
    mobileVariants.noZoom,
    mobileVariants.noHighlight
  ),
  mobileCard: cn(cardVariants.default, themeVariants.surface, "mx-4 my-2"),
};
