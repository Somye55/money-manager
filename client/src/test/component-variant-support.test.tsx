/**
 * **Feature: shadcn-ui-migration, Property 16: Component Variant Support**
 * **Validates: Requirements 6.2, 6.3**
 *
 * For any button or form component, all existing variants and sizes should be
 * supported in the shadcn/ui implementation
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import fc from "fast-check";
import React from "react";

import { Button } from "@/components/ui/button";

// Clean up after each test
beforeEach(() => {
  cleanup();
});

afterEach(() => {
  cleanup();
});

describe("Component Variant Support Property Tests", () => {
  // Test all button variants are supported
  it("should support all button variants", () => {
    const variants = [
      "default",
      "destructive",
      "outline",
      "secondary",
      "ghost",
      "link",
    ];

    variants.forEach((variant) => {
      const { container } = render(
        <Button variant={variant as any}>Test</Button>
      );
      const button = container.querySelector("button");
      expect(button).toBeTruthy();

      // Each variant should apply different styling
      const computedClasses = button?.className || "";
      expect(computedClasses.length).toBeGreaterThan(0);
    });
  });

  // Test all button sizes are supported
  it("should support all button sizes", () => {
    const sizes = ["default", "sm", "lg", "icon"];

    sizes.forEach((size) => {
      const { container } = render(<Button size={size as any}>Test</Button>);
      const button = container.querySelector("button");
      expect(button).toBeTruthy();

      // Each size should apply different styling
      const computedClasses = button?.className || "";
      expect(computedClasses.length).toBeGreaterThan(0);
    });
  });

  // Property-based test for variant support
  it("Property 16: Component Variant Support - all variant and size combinations should render correctly", () => {
    fc.assert(
      fc.property(
        // Generate all valid variant and size combinations
        fc.record({
          variant: fc.constantFrom(
            "default",
            "destructive",
            "outline",
            "secondary",
            "ghost",
            "link"
          ),
          size: fc.constantFrom("default", "sm", "lg", "icon"),
          children: fc.oneof(
            fc.string().filter((s) => s.length > 0),
            fc.constant("Test"),
            fc.constant("Button")
          ),
        }),
        (props) => {
          // For any valid variant and size combination, the Button should render correctly
          let renderSucceeded = false;
          let hasCorrectElement = false;
          let hasClasses = false;
          let renderError = null;

          try {
            const result = render(<Button {...props} />);
            const button = result.container.querySelector("button");

            renderSucceeded = true;
            hasCorrectElement = button !== null;
            hasClasses = (button?.className || "").length > 0;
          } catch (error) {
            renderError = error;
          }

          // The component should render successfully
          expect(renderError).toBeNull();
          expect(renderSucceeded).toBe(true);
          expect(hasCorrectElement).toBe(true);
          expect(hasClasses).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Test that variants apply correct CSS classes
  it("should apply correct CSS classes for variants", () => {
    // Test specific classes that should be present for each variant
    const { container: defaultContainer } = render(
      <Button variant="default">Test</Button>
    );
    const defaultButton = defaultContainer.querySelector("button");
    expect(defaultButton).toHaveClass("bg-gradient-to-r");
    expect(defaultButton).toHaveClass("from-primary-500");

    const { container: destructiveContainer } = render(
      <Button variant="destructive">Test</Button>
    );
    const destructiveButton = destructiveContainer.querySelector("button");
    expect(destructiveButton).toHaveClass("bg-gradient-to-r");
    expect(destructiveButton).toHaveClass("from-danger-500");

    const { container: outlineContainer } = render(
      <Button variant="outline">Test</Button>
    );
    const outlineButton = outlineContainer.querySelector("button");
    expect(outlineButton).toHaveClass("border-2");

    const { container: secondaryContainer } = render(
      <Button variant="secondary">Test</Button>
    );
    const secondaryButton = secondaryContainer.querySelector("button");
    expect(secondaryButton).toHaveClass("from-secondary-500");

    const { container: linkContainer } = render(
      <Button variant="link">Test</Button>
    );
    const linkButton = linkContainer.querySelector("button");
    expect(linkButton).toHaveClass("underline-offset-4");

    // Ghost variant doesn't have a specific background class, but should not have bg-primary
    const { container: ghostContainer } = render(
      <Button variant="ghost">Test</Button>
    );
    const ghostButton = ghostContainer.querySelector("button");
    expect(ghostButton).not.toHaveClass("bg-primary");
    expect(ghostButton).not.toHaveClass("bg-secondary");
  });

  // Test that sizes apply correct CSS classes
  it("should apply correct CSS classes for sizes", () => {
    const sizeClassMap = {
      default: "h-11",
      sm: "h-9",
      lg: "h-12",
      icon: "h-11",
    };

    Object.entries(sizeClassMap).forEach(([size, expectedClass]) => {
      const { container } = render(<Button size={size as any}>Test</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveClass(expectedClass);
    });
  });

  // Test that all variants maintain touch target requirements
  it("should maintain touch targets across all variants and sizes", () => {
    const variants = [
      "default",
      "destructive",
      "outline",
      "secondary",
      "ghost",
      "link",
    ];
    const sizes = ["default", "sm", "lg", "icon"];

    variants.forEach((variant) => {
      sizes.forEach((size) => {
        const { container } = render(
          <Button variant={variant as any} size={size as any}>
            Test
          </Button>
        );
        const button = container.querySelector("button");

        // All buttons should have minimum touch targets
        expect(button).toHaveClass("min-h-[44px]");
        expect(button).toHaveClass("min-w-[44px]");
      });
    });
  });

  // Test that variants work with other props
  it("should support variants with additional props", () => {
    const { container } = render(
      <Button
        variant="destructive"
        size="lg"
        disabled
        fullWidth
        className="custom-class"
      >
        Complex Button
      </Button>
    );

    const button = container.querySelector("button");
    expect(button).toHaveClass("from-danger-500"); // variant
    expect(button).toHaveClass("h-12"); // size (lg is h-12)
    expect(button).toHaveClass("w-full"); // fullWidth
    expect(button).toHaveClass("custom-class"); // custom className
    expect(button).toHaveAttribute("disabled"); // disabled
  });
});
