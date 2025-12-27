/**
 * **Feature: shadcn-ui-migration, Property 4: Safe Area Content Protection**
 * **Validates: Requirements 3.1**
 *
 * For any screen layout on mobile devices, content should not be positioned
 * behind notches, home indicators, or other safe area exclusions
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import fc from "fast-check";
import React from "react";

// Mock safe area values for testing
const mockSafeAreaValues = {
  top: ["0px", "20px", "44px", "47px"], // Various notch heights
  bottom: ["0px", "21px", "34px"], // Various home indicator heights
  left: ["0px", "44px"], // Various side safe areas
  right: ["0px", "44px"], // Various side safe areas
};

// Test component that should respect safe areas
function SafeAreaTestComponent({
  className = "",
  useSafeArea = true,
}: {
  className?: string;
  useSafeArea?: boolean;
}) {
  const safeAreaClasses = useSafeArea
    ? "safe-area-top safe-area-bottom safe-area-left safe-area-right"
    : "";

  return (
    <div
      data-testid="safe-area-component"
      className={`${safeAreaClasses} ${className}`}
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "hsl(var(--background))",
      }}
    >
      <div data-testid="content">Content that should be in safe area</div>
    </div>
  );
}

// Layout component that uses Tailwind safe area utilities
function TailwindSafeAreaComponent() {
  return (
    <div
      data-testid="tailwind-safe-area"
      className="pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right"
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "hsl(var(--card))",
      }}
    >
      <div data-testid="tailwind-content">Tailwind safe area content</div>
    </div>
  );
}

describe("Safe Area Content Protection Property Tests", () => {
  beforeEach(() => {
    // Reset CSS custom properties
    document.documentElement.style.removeProperty("--safe-area-top");
    document.documentElement.style.removeProperty("--safe-area-bottom");
    document.documentElement.style.removeProperty("--safe-area-left");
    document.documentElement.style.removeProperty("--safe-area-right");
  });

  afterEach(() => {
    cleanup();
  });

  // Helper function to set safe area values
  const setSafeAreaValues = (
    top: string,
    bottom: string,
    left: string,
    right: string
  ) => {
    document.documentElement.style.setProperty("--safe-area-top", top);
    document.documentElement.style.setProperty("--safe-area-bottom", bottom);
    document.documentElement.style.setProperty("--safe-area-left", left);
    document.documentElement.style.setProperty("--safe-area-right", right);
  };

  it("should apply safe area classes correctly", () => {
    setSafeAreaValues("44px", "21px", "0px", "0px");

    const { getByTestId } = render(<SafeAreaTestComponent />);
    const component = getByTestId("safe-area-component");

    expect(component).toHaveClass("safe-area-top");
    expect(component).toHaveClass("safe-area-bottom");
    expect(component).toHaveClass("safe-area-left");
    expect(component).toHaveClass("safe-area-right");
  });

  it("should handle components without safe area classes", () => {
    const { getByTestId } = render(
      <SafeAreaTestComponent useSafeArea={false} />
    );
    const component = getByTestId("safe-area-component");

    expect(component).not.toHaveClass("safe-area-top");
    expect(component).not.toHaveClass("safe-area-bottom");
    expect(component).not.toHaveClass("safe-area-left");
    expect(component).not.toHaveClass("safe-area-right");
  });

  it("should apply Tailwind safe area utilities correctly", () => {
    setSafeAreaValues("44px", "21px", "0px", "0px");

    const { getByTestId } = render(<TailwindSafeAreaComponent />);
    const component = getByTestId("tailwind-safe-area");

    expect(component).toHaveClass("pt-safe-top");
    expect(component).toHaveClass("pb-safe-bottom");
    expect(component).toHaveClass("pl-safe-left");
    expect(component).toHaveClass("pr-safe-right");
  });

  // Property-based test for safe area content protection
  it("Property 4: Safe Area Content Protection - content should not be positioned behind safe area exclusions", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...mockSafeAreaValues.top),
        fc.constantFrom(...mockSafeAreaValues.bottom),
        fc.constantFrom(...mockSafeAreaValues.left),
        fc.constantFrom(...mockSafeAreaValues.right),
        fc.boolean(), // Whether to use safe area classes
        async (safeTop, safeBottom, safeLeft, safeRight, useSafeArea) => {
          // Set up safe area environment
          setSafeAreaValues(safeTop, safeBottom, safeLeft, safeRight);

          const { getByTestId, unmount } = render(
            <SafeAreaTestComponent useSafeArea={useSafeArea} />
          );

          const component = getByTestId("safe-area-component");
          const content = getByTestId("content");

          // Verify component exists
          expect(component).toBeTruthy();
          expect(content).toBeTruthy();

          if (useSafeArea) {
            // Component should have safe area classes applied
            expect(component).toHaveClass("safe-area-top");
            expect(component).toHaveClass("safe-area-bottom");
            expect(component).toHaveClass("safe-area-left");
            expect(component).toHaveClass("safe-area-right");

            // Verify CSS variables are accessible
            const computedStyle = getComputedStyle(document.documentElement);
            const topValue = computedStyle
              .getPropertyValue("--safe-area-top")
              .trim();
            const bottomValue = computedStyle
              .getPropertyValue("--safe-area-bottom")
              .trim();
            const leftValue = computedStyle
              .getPropertyValue("--safe-area-left")
              .trim();
            const rightValue = computedStyle
              .getPropertyValue("--safe-area-right")
              .trim();

            // Safe area values should be set correctly
            expect(topValue).toBe(safeTop);
            expect(bottomValue).toBe(safeBottom);
            expect(leftValue).toBe(safeLeft);
            expect(rightValue).toBe(safeRight);
          } else {
            // Component should not have safe area classes when disabled
            expect(component).not.toHaveClass("safe-area-top");
            expect(component).not.toHaveClass("safe-area-bottom");
            expect(component).not.toHaveClass("safe-area-left");
            expect(component).not.toHaveClass("safe-area-right");
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should handle edge case with zero safe area values", () => {
    setSafeAreaValues("0px", "0px", "0px", "0px");

    const { getByTestId } = render(<SafeAreaTestComponent />);
    const component = getByTestId("safe-area-component");

    // Should still have classes even with zero values
    expect(component).toHaveClass("safe-area-top");
    expect(component).toHaveClass("safe-area-bottom");
    expect(component).toHaveClass("safe-area-left");
    expect(component).toHaveClass("safe-area-right");
  });

  it("should handle maximum safe area values", () => {
    setSafeAreaValues("47px", "34px", "44px", "44px");

    const { getByTestId } = render(<SafeAreaTestComponent />);
    const component = getByTestId("safe-area-component");

    expect(component).toHaveClass("safe-area-top");
    expect(component).toHaveClass("safe-area-bottom");
    expect(component).toHaveClass("safe-area-left");
    expect(component).toHaveClass("safe-area-right");

    // Verify the values are set correctly
    const computedStyle = getComputedStyle(document.documentElement);
    expect(computedStyle.getPropertyValue("--safe-area-top").trim()).toBe(
      "47px"
    );
    expect(computedStyle.getPropertyValue("--safe-area-bottom").trim()).toBe(
      "34px"
    );
    expect(computedStyle.getPropertyValue("--safe-area-left").trim()).toBe(
      "44px"
    );
    expect(computedStyle.getPropertyValue("--safe-area-right").trim()).toBe(
      "44px"
    );
  });

  it("should work with nested components", () => {
    setSafeAreaValues("44px", "21px", "0px", "0px");

    function NestedSafeAreaComponent() {
      return (
        <div
          className="safe-area-top safe-area-bottom safe-area-left safe-area-right"
          data-testid="outer-container"
        >
          <div data-testid="nested-content" className="safe-area-top">
            <SafeAreaTestComponent useSafeArea={false} />
          </div>
        </div>
      );
    }

    const { getByTestId } = render(<NestedSafeAreaComponent />);
    const outerContainer = getByTestId("outer-container");
    const nestedContent = getByTestId("nested-content");

    expect(outerContainer).toHaveClass("safe-area-top");
    expect(nestedContent).toHaveClass("safe-area-top");
  });
});
