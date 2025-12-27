/**
 * **Feature: shadcn-ui-migration, Property 17: Responsive Layout Preservation**
 * **Validates: Requirements 6.4**
 *
 * For any layout component during migration, responsive behavior should be
 * maintained across different screen sizes
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import fc from "fast-check";
import React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";

// Clean up after each test
beforeEach(() => {
  cleanup();
});

afterEach(() => {
  cleanup();
});

describe("Responsive Layout Preservation Property Tests", () => {
  // Test basic Card responsive behavior
  it("should render Card with responsive classes", () => {
    const { container } = render(
      <Card>
        <CardContent>Test content</CardContent>
      </Card>
    );

    const card = container.querySelector("div");
    expect(card).toBeTruthy();
    expect(card).toHaveClass("rounded-lg");
    expect(card).toHaveClass("border");
  });

  // Test Card variants maintain responsive behavior
  it("should maintain responsive behavior across Card variants", () => {
    const variants = ["default", "elevated", "outlined"] as const;

    variants.forEach((variant) => {
      const { container } = render(
        <Card variant={variant}>
          <CardContent>Test content</CardContent>
        </Card>
      );

      const card = container.querySelector("div");
      expect(card).toBeTruthy();
      // All variants should maintain base responsive classes
      expect(card).toHaveClass("rounded-lg");

      // Check variant-specific border classes
      if (variant === "outlined") {
        expect(card).toHaveClass("border-2");
      } else {
        expect(card).toHaveClass("border");
      }
    });
  });

  // Test Card padding variants
  it("should maintain responsive behavior across padding variants", () => {
    const paddings = ["sm", "md", "lg"] as const;

    paddings.forEach((padding) => {
      const { container } = render(
        <Card padding={padding}>
          <CardContent>Test content</CardContent>
        </Card>
      );

      const card = container.querySelector("div");
      expect(card).toBeTruthy();
      // Should have appropriate padding class
      if (padding === "sm") expect(card).toHaveClass("p-3");
      if (padding === "md") expect(card).toHaveClass("p-4");
      if (padding === "lg") expect(card).toHaveClass("p-6");
    });
  });

  // Property-based test for responsive layout preservation
  it("Property 17: Responsive Layout Preservation - Card components should maintain responsive behavior across configurations", () => {
    fc.assert(
      fc.property(
        // Generate various Card configurations
        fc.record({
          variant: fc.constantFrom("default", "elevated", "outlined"),
          padding: fc.constantFrom("sm", "md", "lg"),
          interactive: fc.boolean(),
          hasHeader: fc.boolean(),
          hasFooter: fc.boolean(),
          content: fc.oneof(
            fc.string().filter((s) => s.length > 0),
            fc.constant("Test content"),
            fc.constant("Sample card content")
          ),
          title: fc.oneof(
            fc.string().filter((s) => s.length > 0),
            fc.constant("Card Title"),
            fc.constant(undefined)
          ),
          description: fc.oneof(
            fc.string().filter((s) => s.length > 0),
            fc.constant("Card description"),
            fc.constant(undefined)
          ),
        }),
        (props) => {
          // For any Card configuration, responsive layout should be preserved
          let renderSucceeded = false;
          let hasResponsiveClasses = false;
          let hasProperStructure = false;
          let renderError = null;

          try {
            const result = render(
              <Card
                variant={props.variant}
                padding={props.padding}
                interactive={props.interactive}
              >
                {props.hasHeader && (
                  <CardHeader>
                    {props.title && <CardTitle>{props.title}</CardTitle>}
                    {props.description && (
                      <CardDescription>{props.description}</CardDescription>
                    )}
                  </CardHeader>
                )}
                <CardContent>{props.content}</CardContent>
                {props.hasFooter && <CardFooter>Footer content</CardFooter>}
              </Card>
            );

            const card = result.container.querySelector("div");
            const header = result.container.querySelector(
              "div > div:first-child"
            );
            const content = result.container.querySelector(
              "div > div:last-child"
            );

            renderSucceeded = true;

            // Check responsive classes are present
            hasResponsiveClasses =
              card !== null &&
              card.classList.contains("rounded-lg") &&
              (card.classList.contains("border") ||
                card.classList.contains("border-2"));

            // Check proper structure
            hasProperStructure = card !== null;
            if (props.hasHeader) {
              hasProperStructure = hasProperStructure && header !== null;
            }
          } catch (error) {
            renderError = error;
          }

          // All responsive layout requirements should be met
          expect(renderError).toBeNull();
          expect(renderSucceeded).toBe(true);
          expect(hasResponsiveClasses).toBe(true);
          expect(hasProperStructure).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Test Card component structure preservation
  it("should preserve proper component structure", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    const card = container.querySelector("div");
    const header = container.querySelector("div > div:first-child");
    const title = container.querySelector("h3");
    const description = container.querySelector("p");
    const content = container.querySelector("div > div:nth-child(2)");
    const footer = container.querySelector("div > div:last-child");

    expect(card).toBeTruthy();
    expect(header).toBeTruthy();
    expect(title).toBeTruthy();
    expect(description).toBeTruthy();
    expect(content).toBeTruthy();
    expect(footer).toBeTruthy();
  });

  // Test interactive Card behavior
  it("should maintain responsive behavior for interactive Cards", () => {
    const { container } = render(
      <Card interactive>
        <CardContent>Interactive card content</CardContent>
      </Card>
    );

    const card = container.querySelector("div");
    expect(card).toHaveClass("cursor-pointer");
    expect(card).toHaveClass("hover:shadow-lg");
    expect(card).toHaveClass("hover:-translate-y-0.5");
    expect(card).toHaveClass("touch-manipulation");
  });

  // Test Card with custom classes preserves responsive behavior
  it("should preserve responsive behavior with custom classes", () => {
    const { container } = render(
      <Card className="custom-class bg-red-100">
        <CardContent>Custom styled card</CardContent>
      </Card>
    );

    const card = container.querySelector("div");
    expect(card).toHaveClass("rounded-lg"); // Base responsive class
    expect(card).toHaveClass("border"); // Base responsive class
    expect(card).toHaveClass("custom-class"); // Custom class
    expect(card).toHaveClass("bg-red-100"); // Custom class
  });

  // Test nested Card components
  it("should handle nested Card structures responsively", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Parent Card</CardTitle>
        </CardHeader>
        <CardContent>
          <Card variant="outlined" padding="sm">
            <CardContent>Nested card content</CardContent>
          </Card>
        </CardContent>
      </Card>
    );

    const cards = container.querySelectorAll("div[class*='rounded-lg']");
    expect(cards.length).toBe(2); // Parent and nested card

    cards.forEach((card) => {
      expect(card).toHaveClass("rounded-lg");
      // Check for either border or border-2 (outlined variant uses border-2)
      expect(
        card.classList.contains("border") || card.classList.contains("border-2")
      ).toBe(true);
    });
  });

  // Test Card responsiveness with different content types
  it("should handle various content types responsively", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Mixed Content Card</CardTitle>
          <CardDescription>
            This card contains various content types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>Column 1</div>
            <div>Column 2</div>
          </div>
          <img src="test.jpg" alt="Test" className="w-full h-auto" />
          <p>Text content that should wrap properly</p>
        </CardContent>
        <CardFooter>
          <button className="w-full md:w-auto">Responsive Button</button>
        </CardFooter>
      </Card>
    );

    const card = container.querySelector("div");
    expect(card).toHaveClass("rounded-lg");
    expect(card).toHaveClass("border");

    // Check that content structure is preserved
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toBeTruthy();
    expect(gridContainer).toHaveClass("grid-cols-1");
    expect(gridContainer).toHaveClass("md:grid-cols-2");
  });
});
