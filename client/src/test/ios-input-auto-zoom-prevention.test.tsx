/**
 * **Feature: shadcn-ui-migration, Property 11: iOS Input Auto-zoom Prevention**
 * **Validates: Requirements 7.3**
 *
 * For any input field on iOS devices, the font size should be at least 16px
 * to prevent automatic zoom behavior
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import fc from "fast-check";
import React from "react";

import { Input, FormField } from "@/components/ui";

// Clean up after each test
beforeEach(() => {
  cleanup();
});

afterEach(() => {
  cleanup();
});

describe("iOS Input Auto-zoom Prevention Property Tests", () => {
  // Test that Input has proper font size classes
  it("should apply proper font size classes to prevent iOS auto-zoom", () => {
    const { container } = render(<Input placeholder="Test input" />);
    const input = container.querySelector("input");

    // Should have text-base class on mobile (which is 16px) and text-sm on desktop
    expect(input).toHaveClass("text-base");
    expect(input).toHaveClass("md:text-sm");
  });

  // Test FormField input font size
  it("should apply proper font size classes to FormField inputs", () => {
    const { container } = render(
      <FormField label="Email" placeholder="Enter email" />
    );
    const input = container.querySelector("input");

    expect(input).toHaveClass("text-base");
    expect(input).toHaveClass("md:text-sm");
  });

  // Property-based test for iOS auto-zoom prevention
  it("Property 11: iOS Input Auto-zoom Prevention - all input fields should have minimum 16px font size on mobile", () => {
    fc.assert(
      fc.property(
        // Generate various input configurations
        fc.record({
          type: fc.constantFrom(
            "text",
            "email",
            "password",
            "number",
            "tel",
            "url",
            "search"
          ),
          placeholder: fc.oneof(
            fc.string(),
            fc.constant("Enter value"),
            fc.constant("")
          ),
          label: fc.oneof(
            fc.string().filter((s) => s.length > 0),
            fc.constant(undefined)
          ),
          error: fc.oneof(
            fc.string().filter((s) => s.length > 0),
            fc.constant(undefined)
          ),
          disabled: fc.boolean(),
          required: fc.boolean(),
        }),
        (props) => {
          // For any input configuration, font size should prevent iOS auto-zoom
          let renderSucceeded = false;
          let hasProperFontSize = false;
          let renderError = null;

          try {
            // Test both standalone Input and FormField
            const inputResult = render(<Input {...props} />);
            const standaloneInput =
              inputResult.container.querySelector("input");

            cleanup();

            const formFieldResult = render(<FormField {...props} />);
            const formFieldInput =
              formFieldResult.container.querySelector("input");

            renderSucceeded = true;

            // Check that both inputs have the proper font size classes
            const standaloneHasProperSize =
              standaloneInput?.classList.contains("text-base") &&
              standaloneInput?.classList.contains("md:text-sm");

            const formFieldHasProperSize =
              formFieldInput?.classList.contains("text-base") &&
              formFieldInput?.classList.contains("md:text-sm");

            hasProperFontSize =
              standaloneHasProperSize && formFieldHasProperSize;
          } catch (error) {
            renderError = error;
          }

          // All inputs should have proper font sizing to prevent iOS auto-zoom
          expect(renderError).toBeNull();
          expect(renderSucceeded).toBe(true);
          expect(hasProperFontSize).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Test specific input types that are commonly affected by iOS auto-zoom
  it("should prevent auto-zoom for email inputs", () => {
    const { container } = render(
      <Input type="email" placeholder="Enter email" />
    );
    const input = container.querySelector("input");

    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveClass("text-base"); // 16px on mobile
  });

  it("should prevent auto-zoom for password inputs", () => {
    const { container } = render(
      <Input type="password" placeholder="Enter password" />
    );
    const input = container.querySelector("input");

    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveClass("text-base"); // 16px on mobile
  });

  it("should prevent auto-zoom for number inputs", () => {
    const { container } = render(
      <Input type="number" placeholder="Enter number" />
    );
    const input = container.querySelector("input");

    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveClass("text-base"); // 16px on mobile
  });

  it("should prevent auto-zoom for tel inputs", () => {
    const { container } = render(
      <Input type="tel" placeholder="Enter phone" />
    );
    const input = container.querySelector("input");

    expect(input).toHaveAttribute("type", "tel");
    expect(input).toHaveClass("text-base"); // 16px on mobile
  });

  // Test that the responsive font sizing works correctly
  it("should use larger font on mobile and smaller on desktop", () => {
    const { container } = render(<Input placeholder="Responsive font test" />);
    const input = container.querySelector("input");

    // Should have both classes for responsive behavior
    expect(input).toHaveClass("text-base"); // Mobile: 16px
    expect(input).toHaveClass("md:text-sm"); // Desktop: 14px
  });

  // Test that font size is maintained even with custom classes
  it("should maintain proper font size even with additional classes", () => {
    const { container } = render(
      <Input
        placeholder="Custom classes test"
        className="custom-class border-red-500"
      />
    );
    const input = container.querySelector("input");

    expect(input).toHaveClass("text-base");
    expect(input).toHaveClass("md:text-sm");
    expect(input).toHaveClass("custom-class");
    expect(input).toHaveClass("border-red-500");
  });

  // Test FormField with various configurations
  it("should maintain font size in FormField with error states", () => {
    const { container } = render(
      <FormField
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        error="Invalid email format"
      />
    );
    const input = container.querySelector("input");

    expect(input).toHaveClass("text-base");
    expect(input).toHaveClass("md:text-sm");
  });

  it("should maintain font size in FormField with description", () => {
    const { container } = render(
      <FormField
        label="Password"
        type="password"
        placeholder="Enter password"
        description="Must be at least 8 characters"
      />
    );
    const input = container.querySelector("input");

    expect(input).toHaveClass("text-base");
    expect(input).toHaveClass("md:text-sm");
  });
});
