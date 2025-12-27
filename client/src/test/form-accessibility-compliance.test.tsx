/**
 * **Feature: shadcn-ui-migration, Property 3: Form Accessibility Compliance**
 * **Validates: Requirements 2.2**
 *
 * For any form input component, proper ARIA labels and validation states should be
 * present and correctly associated
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import fc from "fast-check";
import React from "react";

import { Input, Label, FormField } from "@/components/ui";

// Clean up after each test
beforeEach(() => {
  cleanup();
});

afterEach(() => {
  cleanup();
});

describe("Form Accessibility Compliance Property Tests", () => {
  // Test basic Input accessibility
  it("should render Input with proper accessibility attributes", () => {
    const { container } = render(<Input placeholder="Test input" />);
    const input = container.querySelector("input");

    expect(input).toBeTruthy();
    expect(input).toHaveAttribute("type", "text"); // default type
  });

  // Test Label accessibility
  it("should render Label with proper accessibility attributes", () => {
    const { container } = render(
      <>
        <Label htmlFor="test-input">Test Label</Label>
        <Input id="test-input" />
      </>
    );

    const label = container.querySelector("label");
    const input = container.querySelector("input");

    expect(label).toHaveAttribute("for", "test-input");
    expect(input).toHaveAttribute("id", "test-input");
  });

  // Test FormField accessibility
  it("should render FormField with proper accessibility attributes", () => {
    const { container } = render(
      <FormField
        label="Email Address"
        placeholder="Enter your email"
        error="Invalid email format"
        required
      />
    );

    const label = container.querySelector("label");
    const input = container.querySelector("input");
    const errorMessage = container.querySelector('[role="alert"]');

    expect(label).toBeTruthy();
    expect(input).toBeTruthy();
    expect(errorMessage).toBeTruthy();

    // Check proper associations
    const inputId = input?.getAttribute("id");
    expect(label).toHaveAttribute("for", inputId);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby");
  });

  // Property-based test for form accessibility compliance
  it("Property 3: Form Accessibility Compliance - all form inputs should have proper ARIA labels and validation states", () => {
    fc.assert(
      fc.property(
        // Generate valid form field props
        fc.record({
          label: fc.oneof(
            fc.string().filter((s) => s.length > 0),
            fc.constant("Email"),
            fc.constant("Password"),
            fc.constant("Username")
          ),
          placeholder: fc.oneof(
            fc.string(),
            fc.constant("Enter value"),
            fc.constant("")
          ),
          error: fc.oneof(
            fc.string().filter((s) => s.length > 0),
            fc.constant(undefined)
          ),
          required: fc.boolean(),
          type: fc.constantFrom("text", "email", "password", "number", "tel"),
          description: fc.oneof(
            fc.string().filter((s) => s.length > 0),
            fc.constant(undefined)
          ),
        }),
        (props) => {
          // For any valid form field configuration, accessibility should be properly implemented
          let renderSucceeded = false;
          let hasProperLabeling = false;
          let hasProperErrorHandling = false;
          let hasProperAriaAttributes = false;
          let renderError = null;

          try {
            const result = render(<FormField {...props} />);
            const label = result.container.querySelector("label");
            const input = result.container.querySelector("input");
            const errorElement =
              result.container.querySelector('[role="alert"]');
            const descriptionElement = result.container.querySelector(
              "p:not([role='alert'])"
            );

            renderSucceeded = true;

            // Check proper labeling
            if (props.label && label && input) {
              const inputId = input.getAttribute("id");
              const labelFor = label.getAttribute("for");
              hasProperLabeling = inputId === labelFor && inputId !== null;
            } else if (!props.label) {
              hasProperLabeling = true; // No label required
            }

            // Check error handling
            if (props.error) {
              hasProperErrorHandling =
                errorElement !== null &&
                input?.getAttribute("aria-invalid") === "true" &&
                input?.hasAttribute("aria-describedby");
            } else {
              hasProperErrorHandling =
                input?.getAttribute("aria-invalid") !== "true";
            }

            // Check ARIA attributes
            hasProperAriaAttributes = input !== null;
            if (props.description && !props.error) {
              hasProperAriaAttributes =
                hasProperAriaAttributes &&
                descriptionElement !== null &&
                input?.hasAttribute("aria-describedby");
            }
          } catch (error) {
            renderError = error;
          }

          // All accessibility requirements should be met
          expect(renderError).toBeNull();
          expect(renderSucceeded).toBe(true);
          expect(hasProperLabeling).toBe(true);
          expect(hasProperErrorHandling).toBe(true);
          expect(hasProperAriaAttributes).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Test specific accessibility scenarios
  it("should handle required fields with proper indication", () => {
    const { container } = render(<FormField label="Required Field" required />);

    const label = container.querySelector("label");
    // Check that the required styling class is applied
    expect(label).toHaveClass("after:content-['*']");
  });

  it("should associate error messages with inputs", () => {
    const { container } = render(
      <FormField label="Email" error="This field is required" />
    );

    const input = container.querySelector("input");
    const errorElement = container.querySelector('[role="alert"]');

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(errorElement).toBeTruthy();

    const ariaDescribedBy = input?.getAttribute("aria-describedby");
    const errorId = errorElement?.getAttribute("id");
    expect(ariaDescribedBy).toContain(errorId);
  });

  it("should associate description with inputs when no error", () => {
    const { container } = render(
      <FormField label="Password" description="Must be at least 8 characters" />
    );

    const input = container.querySelector("input");
    const descriptionElement = container.querySelector("p:not([role='alert'])");

    expect(descriptionElement).toBeTruthy();

    const ariaDescribedBy = input?.getAttribute("aria-describedby");
    const descriptionId = descriptionElement?.getAttribute("id");
    expect(ariaDescribedBy).toContain(descriptionId);
  });

  // Test that error takes precedence over description
  it("should prioritize error over description in aria-describedby", () => {
    const { container } = render(
      <FormField
        label="Email"
        description="Enter a valid email address"
        error="Invalid email format"
      />
    );

    const input = container.querySelector("input");
    const errorElement = container.querySelector('[role="alert"]');
    const descriptionElement = container.querySelector("p:not([role='alert'])");

    expect(errorElement).toBeTruthy();
    expect(descriptionElement).toBeNull(); // Description should not be shown when there's an error

    const ariaDescribedBy = input?.getAttribute("aria-describedby");
    const errorId = errorElement?.getAttribute("id");
    expect(ariaDescribedBy).toContain(errorId);
  });
});
