/**
 * Apply Final Polish Script
 *
 * This script applies final polish and consistency improvements to the entire application.
 * It should be run after the UI redesign is complete to ensure production quality.
 */

import {
  validatePageConsistency,
  autoFixConsistency,
} from "./consistency-validator";
import { polishEntirePage, validateAndFix } from "./final-polish";

/**
 * Comprehensive final polish application
 */
export async function applyFinalPolish(): Promise<void> {
  console.log("🎨 Starting final polish application...");

  // Step 1: Apply consistent styling to all elements
  console.log("📐 Applying consistent styling...");
  polishEntirePage();

  // Step 2: Auto-fix common consistency issues
  console.log("🔧 Auto-fixing consistency issues...");
  const allElements = document.querySelectorAll("*");
  let fixedCount = 0;

  allElements.forEach((element) => {
    if (element instanceof HTMLElement && autoFixConsistency(element)) {
      fixedCount++;
    }
  });

  console.log(`✅ Auto-fixed ${fixedCount} consistency issues`);

  // Step 3: Validate and fix accessibility issues
  console.log("♿ Validating accessibility...");
  const { fixed, issues } = validateAndFix();
  console.log(`✅ Fixed ${fixed} accessibility issues`);

  if (issues.length > 0) {
    console.log("📋 Issues fixed:");
    issues.forEach((issue) => console.log(`  - ${issue}`));
  }

  // Step 4: Apply mobile optimizations
  console.log("📱 Applying mobile optimizations...");
  applyMobileOptimizations();

  // Step 5: Apply responsive improvements
  console.log("📏 Applying responsive improvements...");
  applyResponsiveImprovements();

  // Step 6: Apply typography consistency
  console.log("🔤 Applying typography consistency...");
  applyTypographyConsistency();

  // Step 7: Apply spacing consistency
  console.log("📏 Applying spacing consistency...");
  applySpacingConsistency();

  // Step 8: Apply color consistency
  console.log("🎨 Applying color consistency...");
  applyColorConsistency();

  // Step 9: Final validation
  console.log("🔍 Running final validation...");
  const report = validatePageConsistency();

  if (report.isValid) {
    console.log("✅ All consistency checks passed!");
  } else {
    console.warn(`⚠️ Found ${report.errors.length} remaining issues`);
    report.errors.forEach((error) => {
      console.warn(`  - ${error.type}: ${error.message}`);
    });
  }

  console.log("🎉 Final polish application complete!");
}

/**
 * Apply mobile-specific optimizations
 */
function applyMobileOptimizations(): void {
  // Ensure all interactive elements have proper touch targets
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'
  );

  interactiveElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    const rect = htmlElement.getBoundingClientRect();

    // Ensure minimum 44px touch targets
    if (rect.width < 44 || rect.height < 44) {
      htmlElement.style.minHeight = "44px";
      htmlElement.style.minWidth = "44px";
    }

    // Add touch optimizations
    htmlElement.style.touchAction = "manipulation";
    htmlElement.style.webkitTapHighlightColor = "transparent";

    // Add consistent focus styles
    if (!htmlElement.classList.contains("focus-ring")) {
      htmlElement.classList.add("focus-ring");
    }
  });

  // Optimize input font sizes to prevent iOS zoom
  const inputs = document.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    const htmlInput = input as HTMLElement;
    const computedStyle = getComputedStyle(htmlInput);

    if (parseFloat(computedStyle.fontSize) < 16) {
      htmlInput.style.fontSize = "16px";
    }
  });

  // Add safe area padding to fixed positioned elements
  const fixedElements = document.querySelectorAll(
    '[style*="position: fixed"], .fixed'
  );
  fixedElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    const computedStyle = getComputedStyle(htmlElement);

    if (computedStyle.bottom === "0px") {
      htmlElement.classList.add("pb-safe-bottom");
    }

    if (computedStyle.top === "0px") {
      htmlElement.classList.add("pt-safe-top");
    }
  });
}

/**
 * Apply responsive improvements
 */
function applyResponsiveImprovements(): void {
  // Ensure images are responsive
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    if (!img.classList.contains("max-w-full")) {
      img.classList.add("max-w-full", "h-auto");
    }
  });

  // Ensure containers have proper max-widths
  const containers = document.querySelectorAll(
    '.container, .wrapper, [class*="container"]'
  );
  containers.forEach((container) => {
    const htmlContainer = container as HTMLElement;
    if (
      !htmlContainer.style.maxWidth &&
      !htmlContainer.classList.toString().includes("max-w-")
    ) {
      htmlContainer.classList.add("max-w-md", "mx-auto");
    }
  });

  // Ensure text doesn't overflow
  const textElements = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, p, span"
  );
  textElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    if (!htmlElement.classList.contains("break-words")) {
      htmlElement.classList.add("break-words");
    }
  });

  // Add responsive padding to main content areas
  const mainElements = document.querySelectorAll(
    'main, .main-content, [role="main"]'
  );
  mainElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    if (!htmlElement.classList.toString().includes("p-")) {
      htmlElement.classList.add("px-4", "py-6");
    }
  });
}

/**
 * Apply typography consistency
 */
function applyTypographyConsistency(): void {
  // Standardize heading styles
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headings.forEach((heading) => {
    const htmlHeading = heading as HTMLElement;
    const tagName = htmlHeading.tagName.toLowerCase();

    // Remove existing font classes and apply consistent ones
    htmlHeading.classList.remove(
      "text-xs",
      "text-sm",
      "text-base",
      "text-lg",
      "text-xl",
      "text-2xl",
      "text-3xl",
      "text-4xl"
    );

    const sizeMap: Record<string, string> = {
      h1: "text-2xl",
      h2: "text-xl",
      h3: "text-lg",
      h4: "text-base",
      h5: "text-sm",
      h6: "text-xs",
    };

    htmlHeading.classList.add(
      sizeMap[tagName],
      "font-semibold",
      "leading-tight"
    );
  });

  // Standardize body text
  const paragraphs = document.querySelectorAll("p");
  paragraphs.forEach((p) => {
    const htmlP = p as HTMLElement;
    if (!htmlP.classList.toString().includes("text-")) {
      htmlP.classList.add("text-base", "leading-relaxed");
    }
  });

  // Standardize small text
  const smallElements = document.querySelectorAll("small, .text-small");
  smallElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    htmlElement.classList.add("text-sm", "text-muted-foreground");
  });
}

/**
 * Apply spacing consistency
 */
function applySpacingConsistency(): void {
  // Apply consistent spacing to sections
  const sections = document.querySelectorAll(
    'section, .section, [class*="section"]'
  );
  sections.forEach((section) => {
    const htmlSection = section as HTMLElement;
    if (
      !htmlSection.classList.toString().includes("space-y-") &&
      !htmlSection.classList.toString().includes("gap-")
    ) {
      htmlSection.classList.add("space-y-6");
    }
  });

  // Apply consistent padding to cards
  const cards = document.querySelectorAll('.card, [class*="card"]');
  cards.forEach((card) => {
    const htmlCard = card as HTMLElement;
    if (
      !htmlCard.classList.toString().includes("p-") &&
      !htmlCard.style.padding
    ) {
      htmlCard.classList.add("p-6");
    }
  });

  // Apply consistent spacing to form fields
  const formFields = document.querySelectorAll(
    '.form-field, .field, [class*="field"]'
  );
  formFields.forEach((field) => {
    const htmlField = field as HTMLElement;
    if (!htmlField.classList.toString().includes("space-y-")) {
      htmlField.classList.add("space-y-2");
    }
  });

  // Apply consistent gap to flex containers
  const flexContainers = document.querySelectorAll('[class*="flex"]');
  flexContainers.forEach((container) => {
    const htmlContainer = container as HTMLElement;
    const computedStyle = getComputedStyle(htmlContainer);

    if (
      computedStyle.display === "flex" &&
      !htmlContainer.classList.toString().includes("gap-") &&
      !htmlContainer.style.gap
    ) {
      htmlContainer.classList.add("gap-3");
    }
  });
}

/**
 * Apply color consistency
 */
function applyColorConsistency(): void {
  // Ensure buttons use theme colors
  const buttons = document.querySelectorAll('button, [role="button"]');
  buttons.forEach((button) => {
    const htmlButton = button as HTMLElement;
    const computedStyle = getComputedStyle(htmlButton);

    // Check if using hardcoded colors
    if (
      computedStyle.backgroundColor &&
      !computedStyle.backgroundColor.includes("var(--") &&
      computedStyle.backgroundColor !== "rgba(0, 0, 0, 0)" &&
      computedStyle.backgroundColor !== "transparent"
    ) {
      // Add theme-aware classes
      if (
        htmlButton.classList.contains("btn-primary") ||
        htmlButton.getAttribute("variant") === "primary"
      ) {
        htmlButton.style.background = "hsl(var(--primary))";
        htmlButton.style.color = "hsl(var(--primary-foreground))";
      }
    }
  });

  // Ensure text uses theme colors
  const textElements = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, p, span, div"
  );
  textElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    const computedStyle = getComputedStyle(htmlElement);

    if (
      computedStyle.color &&
      !computedStyle.color.includes("var(--") &&
      !htmlElement.classList.toString().includes("text-")
    ) {
      // Apply appropriate text color classes
      if (htmlElement.matches("h1, h2, h3, h4, h5, h6")) {
        htmlElement.classList.add("text-foreground");
      } else {
        htmlElement.classList.add("text-foreground");
      }
    }
  });

  // Ensure borders use theme colors
  const borderedElements = document.querySelectorAll(
    '[class*="border"], .card, .input'
  );
  borderedElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    const computedStyle = getComputedStyle(htmlElement);

    if (
      computedStyle.borderColor &&
      !computedStyle.borderColor.includes("var(--") &&
      computedStyle.borderColor !== "rgba(0, 0, 0, 0)"
    ) {
      htmlElement.classList.add("border-border");
    }
  });
}

/**
 * Development helper to apply polish on demand
 */
if (process.env.NODE_ENV === "development") {
  (window as any).applyFinalPolish = applyFinalPolish;

  // Auto-apply polish when the page loads (in development)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(applyFinalPolish, 1000);
    });
  } else {
    setTimeout(applyFinalPolish, 1000);
  }
}

export default applyFinalPolish;
