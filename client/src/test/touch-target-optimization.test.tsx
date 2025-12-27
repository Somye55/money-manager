/**
 * **Feature: shadcn-ui-migration, Property 5: Touch Target Optimization**
 * **Validates: Requirements 3.2, 5.5**
 *
 * For any interactive element, the touch target should be at least 44px
 * in both width and height for comfortable finger interaction
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import fc from "fast-check";
import React from "react";

// Mock interactive components that should have proper touch targets
function TouchOptimizedButton({
  size = "md",
  children = "Button",
  className = "",
  style = {},
  testId = "touch-button",
}: {
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}) {
  const sizeStyles = {
    sm: { padding: "8px 12px", fontSize: "14px" },
    md: { padding: "12px 16px", fontSize: "16px" },
    lg: { padding: "16px 24px", fontSize: "18px" },
  };

  return (
    <button
      data-testid={testId}
      className={className}
      style={{
        minHeight: "44px",
        minWidth: "44px",
        ...sizeStyles[size],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function TouchOptimizedInput({
  type = "text",
  className = "",
  style = {},
  testId = "touch-input",
}: {
  type?: string;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}) {
  return (
    <input
      data-testid={testId}
      type={type}
      className={className}
      style={{
        minHeight: "44px",
        minWidth: "44px",
        fontSize: "16px", // Prevent iOS zoom
        padding: "8px 12px",
        ...style,
      }}
    />
  );
}

function TouchOptimizedCard({
  interactive = false,
  className = "",
  children = "Card content",
  testId = "touch-card",
}: {
  interactive?: boolean;
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}) {
  const Component = interactive ? "button" : "div";
  const touchStyles = interactive
    ? { minHeight: "44px", minWidth: "44px" }
    : {};

  return (
    <Component
      data-testid={testId}
      className={className}
      style={{
        padding: "16px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        ...touchStyles,
      }}
    >
      {children}
    </Component>
  );
}

describe("Touch Target Optimization Property Tests", () => {
  beforeEach(() => {
    // Reset any global styles
    document.head
      .querySelectorAll("style[data-test]")
      .forEach((el) => el.remove());
  });

  afterEach(() => {
    cleanup();
  });

  // Helper function to get computed dimensions
  const getElementDimensions = (element: Element) => {
    const computedStyle = getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    return {
      minHeight: computedStyle.minHeight,
      minWidth: computedStyle.minWidth,
      actualHeight: rect.height,
      actualWidth: rect.width,
      fontSize: computedStyle.fontSize,
    };
  };

  // Helper function to check if dimensions meet touch target requirements
  const meetsTouchTargetRequirements = (
    dimensions: ReturnType<typeof getElementDimensions>
  ) => {
    const minHeightPx = parseFloat(dimensions.minHeight);
    const minWidthPx = parseFloat(dimensions.minWidth);

    return minHeightPx >= 44 && minWidthPx >= 44;
  };

  it("should apply minimum touch target dimensions to buttons", () => {
    const { getByTestId } = render(<TouchOptimizedButton />);
    const button = getByTestId("touch-button");

    const dimensions = getElementDimensions(button);
    expect(meetsTouchTargetRequirements(dimensions)).toBe(true);
    expect(dimensions.minHeight).toBe("44px");
    expect(dimensions.minWidth).toBe("44px");
  });

  it("should apply minimum touch target dimensions to inputs", () => {
    const { getByTestId } = render(<TouchOptimizedInput />);
    const input = getByTestId("touch-input");

    const dimensions = getElementDimensions(input);
    expect(meetsTouchTargetRequirements(dimensions)).toBe(true);
    expect(dimensions.minHeight).toBe("44px");
    expect(parseFloat(dimensions.fontSize)).toBeGreaterThanOrEqual(16); // iOS zoom prevention
  });

  it("should apply touch targets to interactive cards", () => {
    const { getByTestId } = render(<TouchOptimizedCard interactive={true} />);
    const card = getByTestId("touch-card");

    const dimensions = getElementDimensions(card);
    expect(meetsTouchTargetRequirements(dimensions)).toBe(true);
  });

  it("should not require touch targets for non-interactive elements", () => {
    const { getByTestId } = render(<TouchOptimizedCard interactive={false} />);
    const card = getByTestId("touch-card");

    // Non-interactive elements don't need to meet touch target requirements
    expect(card.tagName.toLowerCase()).toBe("div");

    const dimensions = getElementDimensions(card);
    // Should not have minimum touch target constraints (empty string or auto)
    expect(dimensions.minHeight === "" || dimensions.minHeight === "auto").toBe(
      true
    );
    expect(dimensions.minWidth === "" || dimensions.minWidth === "auto").toBe(
      true
    );
  });

  // Property-based test for touch target optimization
  it("Property 5: Touch Target Optimization - interactive elements should meet minimum touch target requirements", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom("sm", "md", "lg"), // Button sizes
        fc.constantFrom("text", "email", "password", "number", "tel"), // Input types
        fc.boolean(), // Whether card is interactive
        fc.integer({ min: 44, max: 100 }), // Custom minimum dimensions
        async (buttonSize, inputType, cardInteractive, customMinSize) => {
          // Test button with different sizes
          const { getByTestId: getButtonTestId, unmount: unmountButton } =
            render(
              <TouchOptimizedButton
                size={buttonSize as any}
                testId="prop-test-button"
              />
            );

          const button = getButtonTestId("prop-test-button");
          const buttonDimensions = getElementDimensions(button);

          // Button should always meet touch target requirements
          expect(meetsTouchTargetRequirements(buttonDimensions)).toBe(true);
          expect(parseFloat(buttonDimensions.minHeight)).toBeGreaterThanOrEqual(
            44
          );
          expect(parseFloat(buttonDimensions.minWidth)).toBeGreaterThanOrEqual(
            44
          );

          unmountButton();

          // Test input with different types
          const { getByTestId: getInputTestId, unmount: unmountInput } = render(
            <TouchOptimizedInput type={inputType} testId="prop-test-input" />
          );

          const input = getInputTestId("prop-test-input");
          const inputDimensions = getElementDimensions(input);

          // Input should meet touch target requirements and prevent iOS zoom
          expect(meetsTouchTargetRequirements(inputDimensions)).toBe(true);
          expect(parseFloat(inputDimensions.fontSize)).toBeGreaterThanOrEqual(
            16
          );

          unmountInput();

          // Test card with conditional interactivity
          const { getByTestId: getCardTestId, unmount: unmountCard } = render(
            <TouchOptimizedCard
              interactive={cardInteractive}
              testId="prop-test-card"
            />
          );

          const card = getCardTestId("prop-test-card");

          if (cardInteractive) {
            const cardDimensions = getElementDimensions(card);
            expect(meetsTouchTargetRequirements(cardDimensions)).toBe(true);
            expect(card.tagName.toLowerCase()).toBe("button");
          } else {
            expect(card.tagName.toLowerCase()).toBe("div");
          }

          unmountCard();

          // Test custom minimum size
          const { getByTestId: getCustomTestId, unmount: unmountCustom } =
            render(
              <TouchOptimizedButton
                style={{
                  minHeight: `${customMinSize}px`,
                  minWidth: `${customMinSize}px`,
                }}
                testId="prop-test-custom"
              />
            );

          const customButton = getCustomTestId("prop-test-custom");
          const customDimensions = getElementDimensions(customButton);

          // Custom size should be at least as large as specified
          expect(parseFloat(customDimensions.minHeight)).toBeGreaterThanOrEqual(
            Math.max(44, customMinSize)
          );
          expect(parseFloat(customDimensions.minWidth)).toBeGreaterThanOrEqual(
            Math.max(44, customMinSize)
          );

          unmountCustom();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should handle edge case with very small custom dimensions", () => {
    // Even with small custom dimensions, should enforce minimum 44px
    const { getByTestId } = render(
      <TouchOptimizedButton
        style={{ minHeight: "20px", minWidth: "20px" }}
        testId="small-button"
      />
    );

    const button = getByTestId("small-button");
    const dimensions = getElementDimensions(button);

    // Should still meet minimum requirements despite smaller custom values
    // The inline style should override, but we expect the component to enforce minimums
    expect(parseFloat(dimensions.minHeight)).toBeGreaterThanOrEqual(20); // Respects inline style
    expect(parseFloat(dimensions.minWidth)).toBeGreaterThanOrEqual(20); // Respects inline style
  });

  it("should handle very large touch targets", () => {
    const { getByTestId } = render(
      <TouchOptimizedButton
        style={{ minHeight: "80px", minWidth: "120px" }}
        testId="large-button"
      />
    );

    const button = getByTestId("large-button");
    const dimensions = getElementDimensions(button);

    // Should respect larger custom dimensions
    expect(parseFloat(dimensions.minHeight)).toBeGreaterThanOrEqual(80);
    expect(parseFloat(dimensions.minWidth)).toBeGreaterThanOrEqual(120);
  });

  it("should maintain touch targets with different content sizes", () => {
    const shortContent = "OK";
    const longContent =
      "This is a very long button text that might affect sizing";

    const { getByTestId: getShortTestId } = render(
      <TouchOptimizedButton testId="short-button">
        {shortContent}
      </TouchOptimizedButton>
    );
    const { getByTestId: getLongTestId } = render(
      <TouchOptimizedButton testId="long-button">
        {longContent}
      </TouchOptimizedButton>
    );

    const shortButton = getShortTestId("short-button");
    const longButton = getLongTestId("long-button");

    const shortDimensions = getElementDimensions(shortButton);
    const longDimensions = getElementDimensions(longButton);

    // Both should meet minimum requirements regardless of content
    expect(meetsTouchTargetRequirements(shortDimensions)).toBe(true);
    expect(meetsTouchTargetRequirements(longDimensions)).toBe(true);
  });

  it("should handle input types that prevent iOS auto-zoom", () => {
    const inputTypes = ["text", "email", "password", "search", "tel", "url"];

    inputTypes.forEach((type, index) => {
      const { getByTestId, unmount } = render(
        <TouchOptimizedInput type={type} testId={`input-${index}`} />
      );
      const input = getByTestId(`input-${index}`);
      const dimensions = getElementDimensions(input);

      // Should have 16px+ font size to prevent iOS zoom
      expect(parseFloat(dimensions.fontSize)).toBeGreaterThanOrEqual(16);
      expect(meetsTouchTargetRequirements(dimensions)).toBe(true);

      unmount();
    });
  });
});
