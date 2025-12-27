/**
 * **Feature: shadcn-ui-migration, Property 13: Loading State Feedback**
 * **Validates: Requirements 7.4**
 *
 * Property 13: Loading State Feedback
 * For any form submission or async operation, loading states should provide
 * clear visual feedback during processing
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { fc } from "@fast-check/vitest";
import { LoadingButton } from "@/components/ui/loading-button";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { FormLoading } from "@/components/ui/form-loading";

describe("Loading State Feedback", () => {
  it("should display loading indicators with proper accessibility attributes", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          isLoading: fc.boolean(),
          loadingText: fc.constantFrom(
            "Loading...",
            "Submitting...",
            "Processing...",
            "Please wait..."
          ),
          buttonText: fc.constantFrom("Submit", "Save", "Continue", "Send"),
        }),
        async ({ isLoading, loadingText, buttonText }) => {
          const testId = `test-${Math.random().toString(36).substr(2, 9)}`;

          const { unmount } = render(
            <div data-testid={testId}>
              <LoadingButton
                loading={isLoading}
                loadingText={loadingText}
                data-testid="loading-button"
              >
                {buttonText}
              </LoadingButton>
            </div>
          );

          try {
            const button = screen.getByTestId("loading-button");

            if (isLoading) {
              // When loading, button should be disabled
              expect(button).toBeDisabled();

              // Should display loading text
              expect(button).toHaveTextContent(loadingText);

              // Should contain a spinner with proper accessibility
              const spinner = button.querySelector('[role="status"]');
              expect(spinner).toBeInTheDocument();
              expect(spinner).toHaveAttribute("aria-label", "Loading");

              // Spinner should be hidden from screen readers when it's decorative
              expect(spinner).toHaveAttribute("aria-hidden", "true");
            } else {
              // When not loading, button should be enabled
              expect(button).toBeEnabled();

              // Should display original button text
              expect(button).toHaveTextContent(buttonText);

              // Should not contain a spinner
              const spinner = button.querySelector('[role="status"]');
              expect(spinner).not.toBeInTheDocument();
            }
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it("should render skeleton placeholders with consistent structure", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          fieldCount: fc.integer({ min: 1, max: 5 }),
          showButton: fc.boolean(),
          customClassName: fc.constantFrom(
            "space-y-2",
            "space-y-4",
            "space-y-6",
            "p-4"
          ),
        }),
        async ({ fieldCount, showButton, customClassName }) => {
          const testId = `test-${Math.random().toString(36).substr(2, 9)}`;

          const { unmount } = render(
            <div data-testid={testId}>
              <FormLoading
                fieldCount={fieldCount}
                showButton={showButton}
                className={customClassName}
                data-testid="form-loading"
              />
            </div>
          );

          try {
            const formLoading = screen.getByTestId("form-loading");

            // Should have proper accessibility attributes
            expect(formLoading).toHaveAttribute("role", "status");
            expect(formLoading).toHaveAttribute("aria-label", "Form loading");

            // Should have the custom class
            expect(formLoading).toHaveClass(customClassName);

            // Should render the correct number of field skeletons
            // Each field has a label skeleton and input skeleton
            const skeletons = formLoading.querySelectorAll(".animate-pulse");
            const expectedSkeletons = fieldCount * 2 + (showButton ? 1 : 0);
            expect(skeletons).toHaveLength(expectedSkeletons);

            // If showButton is true, should have a button skeleton
            if (showButton) {
              const buttonSkeletons = Array.from(skeletons).filter(
                (skeleton) =>
                  skeleton.classList.contains("h-10") &&
                  skeleton.classList.contains("w-24")
              );
              expect(buttonSkeletons).toHaveLength(1);
            }
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it("should render spinner with proper size variants and accessibility", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          size: fc.constantFrom("sm", "default", "lg", "xl"),
          customClassName: fc.constantFrom(
            "text-blue-500",
            "text-gray-500",
            "text-green-500",
            "mr-2"
          ),
        }),
        async ({ size, customClassName }) => {
          const testId = `test-${Math.random().toString(36).substr(2, 9)}`;

          const { unmount } = render(
            <div data-testid={testId}>
              <Spinner
                size={size as "sm" | "default" | "lg" | "xl"}
                className={customClassName}
                data-testid="spinner"
              />
            </div>
          );

          try {
            const spinner = screen.getByTestId("spinner");

            // Should have proper accessibility attributes
            expect(spinner).toHaveAttribute("role", "status");
            expect(spinner).toHaveAttribute("aria-label", "Loading");

            // Should have animation class
            expect(spinner).toHaveClass("animate-spin");

            // Should have custom class
            expect(spinner).toHaveClass(customClassName);

            // Should have size-specific classes
            const sizeClasses = {
              sm: "h-4 w-4",
              default: "h-6 w-6",
              lg: "h-8 w-8",
              xl: "h-12 w-12",
            };

            const expectedSizeClass =
              sizeClasses[size as keyof typeof sizeClasses];
            const [heightClass, widthClass] = expectedSizeClass.split(" ");
            expect(spinner).toHaveClass(heightClass);
            expect(spinner).toHaveClass(widthClass);
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it("should render skeleton with proper styling and animation", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          customClassName: fc.constantFrom(
            "h-4 w-full",
            "h-6 w-32",
            "h-8 w-24",
            "h-10 w-full rounded-lg"
          ),
        }),
        async ({ customClassName }) => {
          const testId = `test-${Math.random().toString(36).substr(2, 9)}`;

          const { unmount } = render(
            <div data-testid={testId}>
              <Skeleton className={customClassName} data-testid="skeleton" />
            </div>
          );

          try {
            const skeleton = screen.getByTestId("skeleton");

            // Should have animation class
            expect(skeleton).toHaveClass("animate-pulse");

            // Should have background class
            expect(skeleton).toHaveClass("bg-muted");

            // Should have some rounded class (either default or custom)
            const hasRoundedClass = skeleton.classList
              .toString()
              .includes("rounded");
            expect(hasRoundedClass).toBe(true);

            // Should have custom classes
            const customClasses = customClassName.split(" ");
            customClasses.forEach((cls) => {
              expect(skeleton).toHaveClass(cls);
            });
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 50 }
    );
  });
});
