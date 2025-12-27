/**
 * Final Polish Utilities
 *
 * Applies final polish and consistency improvements across the application.
 * Implements requirements 1.1, 1.4, 6.1, 6.2, 6.3 for production-quality UI.
 */

import { designSystem } from "./design-tokens";
import { cn } from "./utils";

/**
 * Production-ready component class generator
 */
export const polishedClasses = {
  // Enhanced button classes with consistent styling
  button: {
    base: cn(
      // Layout and positioning
      "inline-flex items-center justify-center gap-2",
      "relative overflow-hidden",

      // Typography
      "font-medium text-base leading-none",
      "whitespace-nowrap",

      // Spacing and sizing
      "px-6 py-3 min-h-[44px] min-w-[44px]",

      // Visual design
      "rounded-lg border-0",
      "shadow-sm hover:shadow-md",

      // Transitions and animations
      "transition-all duration-300 ease-out",
      "transform-gpu",

      // Mobile optimizations
      "touch-manipulation",
      "select-none",

      // Focus and accessibility
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",

      // Disabled state
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",

      // Hover effects
      "hover:-translate-y-0.5 hover:scale-[1.02]",
      "active:translate-y-0 active:scale-[0.98]",

      // Reduced motion support
      "motion-reduce:transition-none motion-reduce:transform-none"
    ),

    primary: cn(
      "bg-gradient-to-r from-primary-500 to-primary-600",
      "text-white shadow-primary/30",
      "hover:from-primary-600 hover:to-primary-700 hover:shadow-primary/40",
      "active:from-primary-700 active:to-primary-800"
    ),

    secondary: cn(
      "bg-gradient-to-r from-secondary-500 to-secondary-600",
      "text-white shadow-secondary/30",
      "hover:from-secondary-600 hover:to-secondary-700 hover:shadow-secondary/40",
      "active:from-secondary-700 active:to-secondary-800"
    ),

    outline: cn(
      "bg-transparent border-2 border-primary-500",
      "text-primary-600 hover:text-primary-700",
      "hover:bg-primary-50 hover:border-primary-600",
      "active:bg-primary-100"
    ),

    ghost: cn(
      "bg-transparent text-neutral-700",
      "hover:bg-neutral-100 hover:text-neutral-900",
      "active:bg-neutral-200"
    ),
  },

  // Enhanced card classes
  card: {
    base: cn(
      // Layout
      "relative overflow-hidden",

      // Visual design
      "bg-card rounded-xl border border-border",
      "shadow-sm hover:shadow-lg",

      // Transitions
      "transition-all duration-300 ease-out",
      "transform-gpu",

      // Hover effects
      "hover:-translate-y-1 hover:shadow-xl",

      // Reduced motion
      "motion-reduce:transition-none motion-reduce:transform-none"
    ),

    interactive: cn(
      "cursor-pointer group",
      "hover:border-primary/30",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
    ),

    elevated: cn(
      "shadow-lg hover:shadow-2xl",
      "bg-gradient-to-br from-white to-neutral-50"
    ),
  },

  // Enhanced input classes
  input: {
    base: cn(
      // Layout and sizing
      "w-full min-h-[44px] px-4 py-3",

      // Typography - 16px prevents iOS zoom
      "text-base leading-tight",

      // Visual design
      "bg-background border-2 border-input rounded-lg",
      "shadow-sm focus:shadow-md",

      // Transitions
      "transition-all duration-300 ease-out",
      "transform-gpu",

      // Focus states
      "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
      "focus:-translate-y-0.5",

      // Hover states
      "hover:border-primary/50",

      // Placeholder
      "placeholder:text-muted-foreground",

      // Mobile optimizations
      "touch-manipulation",

      // Disabled state
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted",

      // Reduced motion
      "motion-reduce:transition-none motion-reduce:transform-none"
    ),

    error: cn(
      "border-danger-500 focus:border-danger-600 focus:ring-danger-500/20",
      "bg-danger-50/30"
    ),

    success: cn(
      "border-success-500 focus:border-success-600 focus:ring-success-500/20",
      "bg-success-50/30"
    ),
  },

  // Enhanced typography classes
  typography: {
    display: cn(
      "text-3xl md:text-4xl font-bold leading-tight tracking-tight",
      "bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent"
    ),

    heading1: cn(
      "text-2xl font-bold leading-tight tracking-tight",
      "text-foreground"
    ),

    heading2: cn("text-xl font-semibold leading-tight", "text-foreground"),

    heading3: cn("text-lg font-semibold leading-snug", "text-foreground"),

    body: cn("text-base leading-relaxed", "text-foreground"),

    bodySecondary: cn("text-base leading-relaxed", "text-muted-foreground"),

    caption: cn("text-sm leading-normal", "text-muted-foreground"),

    small: cn(
      "text-xs leading-normal font-medium",
      "text-muted-foreground uppercase tracking-wide"
    ),
  },

  // Enhanced layout classes
  layout: {
    container: cn("container mx-auto max-w-md", "px-4 py-6", "space-y-6"),

    section: cn("space-y-4"),

    grid: cn("grid gap-4", "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"),

    flex: cn("flex items-center gap-3"),

    stack: cn("flex flex-col gap-4"),
  },

  // Enhanced navigation classes
  navigation: {
    bottom: cn(
      // Positioning
      "fixed bottom-0 left-0 right-0 z-50",

      // Layout
      "flex items-center justify-around",
      "px-2 py-2",

      // Visual design
      "bg-background/95 backdrop-blur-md",
      "border-t border-border",

      // Safe area
      "pb-safe-bottom",

      // Mobile optimizations
      "touch-manipulation"
    ),

    item: cn(
      // Layout
      "flex flex-col items-center justify-center",
      "min-h-[56px] min-w-[56px] flex-1",
      "px-2 py-2 rounded-xl",

      // Typography
      "text-xs font-medium",

      // Transitions
      "transition-all duration-200 ease-out",

      // States
      "text-muted-foreground hover:text-foreground",
      "hover:bg-accent/50",

      // Focus
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",

      // Mobile optimizations
      "touch-manipulation select-none"
    ),

    itemActive: cn("text-primary bg-primary/10", "font-semibold"),
  },

  // Enhanced form classes
  form: {
    field: cn("space-y-2"),

    label: cn("block text-sm font-medium text-foreground", "mb-2"),

    error: cn(
      "flex items-start gap-2 p-3 rounded-lg",
      "bg-danger-50 border border-danger-200",
      "text-sm text-danger-700",
      "animate-in slide-in-from-top-1 duration-200"
    ),

    success: cn(
      "flex items-start gap-2 p-3 rounded-lg",
      "bg-success-50 border border-success-200",
      "text-sm text-success-700",
      "animate-in slide-in-from-top-1 duration-200"
    ),
  },
};

/**
 * Apply consistent spacing to elements
 */
export function applyConsistentSpacing(
  element: HTMLElement,
  type: "section" | "card" | "form" | "list" = "section"
): void {
  const spacingMap = {
    section: "space-y-6",
    card: "p-6",
    form: "space-y-4",
    list: "space-y-2",
  };

  element.classList.add(spacingMap[type]);
}

/**
 * Apply consistent typography to text elements
 */
export function applyConsistentTypography(element: HTMLElement): void {
  const tagName = element.tagName.toLowerCase();

  const typographyMap: Record<string, string> = {
    h1: polishedClasses.typography.heading1,
    h2: polishedClasses.typography.heading2,
    h3: polishedClasses.typography.heading3,
    p: polishedClasses.typography.body,
    span: polishedClasses.typography.body,
    small: polishedClasses.typography.small,
    caption: polishedClasses.typography.caption,
  };

  const classes = typographyMap[tagName];
  if (classes) {
    element.className = cn(element.className, classes);
  }
}

/**
 * Apply mobile optimizations to interactive elements
 */
export function applyMobileOptimizations(element: HTMLElement): void {
  const isInteractive = element.matches(
    'button, a, input, select, textarea, [role="button"], [tabindex]'
  );

  if (isInteractive) {
    // Ensure minimum touch target size
    const rect = element.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) {
      element.style.minHeight = "44px";
      element.style.minWidth = "44px";
    }

    // Add touch optimizations
    element.style.touchAction = "manipulation";
    element.style.webkitTapHighlightColor = "transparent";

    // Add consistent interactive classes
    element.classList.add(
      "transition-all",
      "duration-200",
      "ease-out",
      "hover:-translate-y-0.5",
      "active:translate-y-0",
      "active:scale-95",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-primary/50",
      "focus-visible:ring-offset-2"
    );
  }
}

/**
 * Apply consistent theming to elements
 */
export function applyConsistentTheming(element: HTMLElement): void {
  // Ensure elements use theme-aware colors
  const computedStyle = getComputedStyle(element);

  // Check for hardcoded colors and suggest theme alternatives
  const colorProperties = ["color", "backgroundColor", "borderColor"];

  colorProperties.forEach((property) => {
    const value = computedStyle.getPropertyValue(property);
    if (value && !value.includes("var(--") && !isSystemColor(value)) {
      console.warn(
        `Element has hardcoded ${property}: ${value}. Consider using theme variables.`
      );
    }
  });

  // Add theme transition class for smooth theme switching
  element.classList.add("transition-colors", "duration-300");
}

/**
 * Apply responsive behavior to elements
 */
export function applyResponsiveBehavior(element: HTMLElement): void {
  // Add responsive classes based on element type
  if (element.matches("img")) {
    element.classList.add("max-w-full", "h-auto");
  }

  if (element.matches(".container, .wrapper")) {
    element.classList.add("max-w-md", "mx-auto", "px-4");
  }

  // Ensure text doesn't overflow on small screens
  if (element.matches("h1, h2, h3, h4, h5, h6, p")) {
    element.classList.add("break-words");
  }
}

/**
 * Comprehensive polish application
 */
export function applyFinalPolish(element: HTMLElement): void {
  applyConsistentTypography(element);
  applyMobileOptimizations(element);
  applyConsistentTheming(element);
  applyResponsiveBehavior(element);

  // Apply spacing to container elements
  if (element.matches(".container, .section, .card-content")) {
    applyConsistentSpacing(element);
  }
}

/**
 * Polish entire page
 */
export function polishEntirePage(): void {
  const allElements = document.querySelectorAll("*");

  allElements.forEach((element) => {
    if (element instanceof HTMLElement) {
      applyFinalPolish(element);
    }
  });

  console.log("✨ Applied final polish to entire page");
}

/**
 * Validate and fix common issues
 */
export function validateAndFix(): { fixed: number; issues: string[] } {
  const issues: string[] = [];
  let fixed = 0;

  // Fix missing alt attributes
  const images = document.querySelectorAll("img:not([alt])");
  images.forEach((img) => {
    img.setAttribute("alt", "");
    fixed++;
    issues.push("Added missing alt attribute to image");
  });

  // Fix small touch targets
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [role="button"]'
  );
  interactiveElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) {
      (element as HTMLElement).style.minHeight = "44px";
      (element as HTMLElement).style.minWidth = "44px";
      fixed++;
      issues.push(`Fixed small touch target: ${element.tagName.toLowerCase()}`);
    }
  });

  // Fix missing focus styles
  const focusableElements = document.querySelectorAll(
    "button, a, input, select, textarea, [tabindex]"
  );
  focusableElements.forEach((element) => {
    const computedStyle = getComputedStyle(element as HTMLElement);
    if (!computedStyle.outlineStyle || computedStyle.outlineStyle === "none") {
      element.classList.add(
        "focus-visible:ring-2",
        "focus-visible:ring-primary/50"
      );
      fixed++;
      issues.push(`Added focus styles to: ${element.tagName.toLowerCase()}`);
    }
  });

  return { fixed, issues };
}

/**
 * Helper function to check if a color is a system color
 */
function isSystemColor(color: string): boolean {
  const systemColors = [
    "transparent",
    "currentColor",
    "inherit",
    "initial",
    "unset",
    "rgba(0, 0, 0, 0)",
  ];

  return systemColors.includes(color) || color.startsWith("var(--");
}

/**
 * Development helper functions
 */
if (process.env.NODE_ENV === "development") {
  (window as any).polishPage = polishEntirePage;
  (window as any).validateAndFix = validateAndFix;
  (window as any).polishedClasses = polishedClasses;
}
