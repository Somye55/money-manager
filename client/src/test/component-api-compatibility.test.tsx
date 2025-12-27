/**
 * **Feature: shadcn-ui-migration, Property 9: Component API Compatibility**
 * **Validates: Requirements 6.1, 6.2**
 *
 * For any migrated component, existing component APIs should continue to work
 * without breaking changes where possible
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

describe("Component API Compatibility Property Tests", () => {
  // Test that the new Button component accepts all the same props as the old one
  it("should accept all legacy Button component props", () => {
    // Test basic props that should be supported
    const legacyProps = {
      children: "Test Button",
      variant: "default" as const,
      size: "default" as const,
      disabled: false,
      loading: false,
      onClick: () => {},
      type: "button" as const,
      className: "test-class",
      fullWidth: false,
    };

    expect(() => {
      render(<Button {...legacyProps} />);
    }).not.toThrow();
  });

  // Property-based test for API compatibility
  it("Property 9: Component API Compatibility - Button should accept all valid prop combinations", () => {
    fc.assert(
      fc.property(
        // Generate valid button props
        fc.record({
          children: fc.oneof(
            fc.string(),
            fc.constant("Click me"),
            fc.constant("Submit"),
            fc.constant("Cancel")
          ),
          variant: fc.constantFrom(
            "default",
            "destructive",
            "outline",
            "secondary",
            "ghost",
            "link"
          ),
          size: fc.constantFrom("default", "sm", "lg", "icon"),
          disabled: fc.boolean(),
          loading: fc.boolean(),
          fullWidth: fc.boolean(),
          mobileOptimized: fc.boolean(),
          className: fc.oneof(fc.string(), fc.constant("")),
          type: fc.constantFrom("button", "submit", "reset"),
        }),
        (props) => {
          // For any valid combination of props, the Button should render without errors
          let renderSucceeded = false;
          let renderError = null;

          try {
            const result = render(<Button {...props} />);
            renderSucceeded = result.container.querySelector("button") !== null;
          } catch (error) {
            renderError = error;
          }

          // The component should render successfully
          expect(renderError).toBeNull();
          expect(renderSucceeded).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Test backward compatibility with legacy variant names
  it("should support all legacy button variants", () => {
    const legacyVariants = [
      "default",
      "destructive",
      "outline",
      "secondary",
      "ghost",
      "link",
    ];

    legacyVariants.forEach((variant) => {
      expect(() => {
        render(<Button variant={variant as any}>Test</Button>);
      }).not.toThrow();
    });
  });

  // Test that essential props work as expected
  it("should handle disabled state correctly", () => {
    const { container } = render(<Button disabled>Disabled Button</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveAttribute("disabled");
  });

  it("should handle loading state correctly", () => {
    const { container } = render(<Button loading>Loading Button</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveAttribute("disabled");
    // Should contain loading spinner
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("should handle fullWidth prop correctly", () => {
    const { container } = render(<Button fullWidth>Full Width Button</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("w-full");
  });

  // Test touch target requirements
  it("should maintain minimum touch targets", () => {
    const { container } = render(<Button>Touch Target</Button>);
    const button = container.querySelector("button");
    expect(button).toHaveClass("min-h-[44px]");
    expect(button).toHaveClass("min-w-[44px]");
  });
});
