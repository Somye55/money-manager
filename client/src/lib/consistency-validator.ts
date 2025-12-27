/**
 * Design Consistency Validator
 *
 * Validates and enforces design consistency across the application.
 * Implements requirements 1.1, 1.4, 6.1, 6.2, 6.3 for consistent design.
 */

import { designSystem } from "./design-tokens";

// Consistency validation results
export interface ConsistencyReport {
  isValid: boolean;
  errors: ConsistencyError[];
  warnings: ConsistencyWarning[];
  suggestions: ConsistencySuggestion[];
}

export interface ConsistencyError {
  type: "spacing" | "typography" | "color" | "touch-target" | "responsive";
  element: string;
  message: string;
  expected: string;
  actual: string;
}

export interface ConsistencyWarning {
  type: "accessibility" | "performance" | "usability";
  element: string;
  message: string;
  recommendation: string;
}

export interface ConsistencySuggestion {
  type: "enhancement" | "optimization";
  element: string;
  message: string;
  improvement: string;
}

/**
 * Validates spacing consistency across elements
 */
export function validateSpacing(element: HTMLElement): ConsistencyError[] {
  const errors: ConsistencyError[] = [];
  const computedStyle = getComputedStyle(element);

  // Check for non-standard spacing values
  const spacingProperties = ["padding", "margin", "gap"];
  const validSpacingValues = Object.values(designSystem.spacing);

  spacingProperties.forEach((property) => {
    const value = computedStyle.getPropertyValue(property);
    if (value && value !== "0px" && !validSpacingValues.includes(value)) {
      // Check if it's a compound value (e.g., "16px 24px")
      const values = value.split(" ").filter((v) => v !== "0px");
      const hasInvalidSpacing = values.some(
        (v) => !validSpacingValues.includes(v)
      );

      if (hasInvalidSpacing) {
        errors.push({
          type: "spacing",
          element: element.tagName.toLowerCase(),
          message: `Non-standard ${property} value detected`,
          expected: "Value from design system spacing scale",
          actual: value,
        });
      }
    }
  });

  return errors;
}

/**
 * Validates typography consistency
 */
export function validateTypography(element: HTMLElement): ConsistencyError[] {
  const errors: ConsistencyError[] = [];
  const computedStyle = getComputedStyle(element);

  // Check font sizes
  const fontSize = computedStyle.fontSize;
  const validFontSizes = Object.values(designSystem.typography.fontSize).map(
    (f) => f.size
  );

  if (fontSize && !validFontSizes.includes(fontSize)) {
    errors.push({
      type: "typography",
      element: element.tagName.toLowerCase(),
      message: "Non-standard font size detected",
      expected: "Value from design system typography scale",
      actual: fontSize,
    });
  }

  // Check font weights
  const fontWeight = computedStyle.fontWeight;
  const validFontWeights = Object.values(designSystem.typography.fontWeight);

  if (fontWeight && !validFontWeights.includes(fontWeight)) {
    errors.push({
      type: "typography",
      element: element.tagName.toLowerCase(),
      message: "Non-standard font weight detected",
      expected: "Value from design system font weights",
      actual: fontWeight,
    });
  }

  return errors;
}

/**
 * Validates color usage consistency
 */
export function validateColors(element: HTMLElement): ConsistencyError[] {
  const errors: ConsistencyError[] = [];
  const computedStyle = getComputedStyle(element);

  // Check if colors are using CSS custom properties (theme variables)
  const colorProperties = ["color", "background-color", "border-color"];

  colorProperties.forEach((property) => {
    const value = computedStyle.getPropertyValue(property);
    if (value && value !== "rgba(0, 0, 0, 0)" && value !== "transparent") {
      // Check if it's using CSS custom properties or theme classes
      const isUsingThemeVar =
        value.includes("var(--") ||
        element.classList.toString().includes("theme-") ||
        element.classList.toString().includes("text-") ||
        element.classList.toString().includes("bg-");

      if (!isUsingThemeVar && !isSystemColor(value)) {
        errors.push({
          type: "color",
          element: element.tagName.toLowerCase(),
          message: `Hardcoded ${property} detected`,
          expected: "CSS custom property or theme class",
          actual: value,
        });
      }
    }
  });

  return errors;
}

/**
 * Validates touch target sizes for mobile optimization
 */
export function validateTouchTargets(element: HTMLElement): ConsistencyError[] {
  const errors: ConsistencyError[] = [];

  // Check if element is interactive
  const isInteractive = element.matches(
    'button, a, input, select, textarea, [role="button"], [tabindex]'
  );

  if (isInteractive) {
    const rect = element.getBoundingClientRect();
    const minSize = 44; // Minimum touch target size

    if (rect.width < minSize || rect.height < minSize) {
      errors.push({
        type: "touch-target",
        element: element.tagName.toLowerCase(),
        message: "Touch target too small for mobile devices",
        expected: `Minimum ${minSize}px x ${minSize}px`,
        actual: `${Math.round(rect.width)}px x ${Math.round(rect.height)}px`,
      });
    }
  }

  return errors;
}

/**
 * Validates responsive behavior
 */
export function validateResponsive(element: HTMLElement): ConsistencyWarning[] {
  const warnings: ConsistencyWarning[] = [];
  const computedStyle = getComputedStyle(element);

  // Check for fixed widths that might break on mobile
  const width = computedStyle.width;
  if (width && width.includes("px") && parseInt(width) > 320) {
    const hasResponsiveClass =
      element.classList.toString().includes("w-") ||
      element.classList.toString().includes("max-w-") ||
      computedStyle.maxWidth !== "none";

    if (!hasResponsiveClass) {
      warnings.push({
        type: "usability",
        element: element.tagName.toLowerCase(),
        message: "Fixed width detected without responsive constraints",
        recommendation: "Use responsive width classes or max-width constraints",
      });
    }
  }

  return warnings;
}

/**
 * Validates accessibility compliance
 */
export function validateAccessibility(
  element: HTMLElement
): ConsistencyWarning[] {
  const warnings: ConsistencyWarning[] = [];

  // Check for missing alt text on images
  if (element.tagName === "IMG" && !element.getAttribute("alt")) {
    warnings.push({
      type: "accessibility",
      element: "img",
      message: "Image missing alt attribute",
      recommendation: "Add descriptive alt text for screen readers",
    });
  }

  // Check for missing labels on form inputs
  if (
    element.matches("input, select, textarea") &&
    !element.getAttribute("aria-label") &&
    !element.getAttribute("aria-labelledby")
  ) {
    const hasLabel = document.querySelector(`label[for="${element.id}"]`);
    if (!hasLabel) {
      warnings.push({
        type: "accessibility",
        element: element.tagName.toLowerCase(),
        message: "Form input missing label or aria-label",
        recommendation: "Add proper labeling for screen readers",
      });
    }
  }

  // Check for low contrast (simplified check)
  const computedStyle = getComputedStyle(element);
  const color = computedStyle.color;
  const backgroundColor = computedStyle.backgroundColor;

  if (
    color &&
    backgroundColor &&
    color !== "rgba(0, 0, 0, 0)" &&
    backgroundColor !== "rgba(0, 0, 0, 0)"
  ) {
    // This is a simplified check - in production, use a proper contrast ratio calculator
    const isLowContrast = color === backgroundColor;
    if (isLowContrast) {
      warnings.push({
        type: "accessibility",
        element: element.tagName.toLowerCase(),
        message: "Potential low contrast detected",
        recommendation: "Ensure sufficient color contrast for readability",
      });
    }
  }

  return warnings;
}

/**
 * Generates improvement suggestions
 */
export function generateSuggestions(
  element: HTMLElement
): ConsistencySuggestion[] {
  const suggestions: ConsistencySuggestion[] = [];

  // Suggest using semantic HTML elements
  if (
    element.getAttribute("role") === "button" &&
    element.tagName !== "BUTTON"
  ) {
    suggestions.push({
      type: "enhancement",
      element: element.tagName.toLowerCase(),
      message: "Consider using semantic button element",
      improvement: "Replace with <button> element for better accessibility",
    });
  }

  // Suggest using CSS Grid or Flexbox for layouts
  const computedStyle = getComputedStyle(element);
  if (computedStyle.display === "block" && element.children.length > 1) {
    const hasLayoutClass =
      element.classList.toString().includes("flex") ||
      element.classList.toString().includes("grid");

    if (!hasLayoutClass) {
      suggestions.push({
        type: "optimization",
        element: element.tagName.toLowerCase(),
        message: "Consider using modern layout methods",
        improvement: "Use Flexbox or CSS Grid for better layout control",
      });
    }
  }

  return suggestions;
}

/**
 * Comprehensive consistency validation
 */
export function validateConsistency(element: HTMLElement): ConsistencyReport {
  const errors: ConsistencyError[] = [
    ...validateSpacing(element),
    ...validateTypography(element),
    ...validateColors(element),
    ...validateTouchTargets(element),
  ];

  const warnings: ConsistencyWarning[] = [
    ...validateResponsive(element),
    ...validateAccessibility(element),
  ];

  const suggestions: ConsistencySuggestion[] = generateSuggestions(element);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}

/**
 * Validates entire page for consistency
 */
export function validatePageConsistency(): ConsistencyReport {
  const allElements = document.querySelectorAll("*");
  const allErrors: ConsistencyError[] = [];
  const allWarnings: ConsistencyWarning[] = [];
  const allSuggestions: ConsistencySuggestion[] = [];

  allElements.forEach((element) => {
    if (element instanceof HTMLElement) {
      const report = validateConsistency(element);
      allErrors.push(...report.errors);
      allWarnings.push(...report.warnings);
      allSuggestions.push(...report.suggestions);
    }
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    suggestions: allSuggestions,
  };
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
 * Auto-fix common consistency issues
 */
export function autoFixConsistency(element: HTMLElement): boolean {
  let fixed = false;

  // Auto-fix touch targets by adding minimum size
  const isInteractive = element.matches(
    'button, a, input, select, textarea, [role="button"], [tabindex]'
  );
  if (isInteractive) {
    const rect = element.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) {
      element.style.minHeight = "44px";
      element.style.minWidth = "44px";
      fixed = true;
    }
  }

  // Auto-fix missing touch-manipulation
  if (isInteractive && !element.style.touchAction) {
    element.style.touchAction = "manipulation";
    fixed = true;
  }

  return fixed;
}

/**
 * Generate consistency report for development
 */
export function generateConsistencyReport(): string {
  const report = validatePageConsistency();

  let output = "# Design Consistency Report\n\n";

  if (report.isValid) {
    output += "✅ **All consistency checks passed!**\n\n";
  } else {
    output += `❌ **Found ${report.errors.length} consistency issues**\n\n`;
  }

  if (report.errors.length > 0) {
    output += "## Errors\n\n";
    report.errors.forEach((error, index) => {
      output += `${index + 1}. **${error.type}** in \`${error.element}\`\n`;
      output += `   - ${error.message}\n`;
      output += `   - Expected: ${error.expected}\n`;
      output += `   - Actual: ${error.actual}\n\n`;
    });
  }

  if (report.warnings.length > 0) {
    output += "## Warnings\n\n";
    report.warnings.forEach((warning, index) => {
      output += `${index + 1}. **${warning.type}** in \`${warning.element}\`\n`;
      output += `   - ${warning.message}\n`;
      output += `   - Recommendation: ${warning.recommendation}\n\n`;
    });
  }

  if (report.suggestions.length > 0) {
    output += "## Suggestions\n\n";
    report.suggestions.forEach((suggestion, index) => {
      output += `${index + 1}. **${suggestion.type}** for \`${
        suggestion.element
      }\`\n`;
      output += `   - ${suggestion.message}\n`;
      output += `   - Improvement: ${suggestion.improvement}\n\n`;
    });
  }

  return output;
}

// Development helper - only available in development mode
if (process.env.NODE_ENV === "development") {
  (window as any).validateConsistency = validatePageConsistency;
  (window as any).generateConsistencyReport = generateConsistencyReport;
  (window as any).autoFixConsistency = (selector?: string) => {
    const elements = selector
      ? document.querySelectorAll(selector)
      : document.querySelectorAll("*");

    let fixedCount = 0;
    elements.forEach((element) => {
      if (element instanceof HTMLElement && autoFixConsistency(element)) {
        fixedCount++;
      }
    });

    console.log(`Auto-fixed ${fixedCount} consistency issues`);
    return fixedCount;
  };
}
