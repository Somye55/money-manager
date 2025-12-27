/**
 * **Feature: shadcn-ui-migration, Property 15: Responsive Dialog Sizing**
 * **Validates: Requirements 5.2**
 *
 * For any dialog or modal on small screens, the component should be optimized for
 * mobile viewing with appropriate sizing constraints
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import fc from "fast-check";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "@/components/ui";

// Clean up after each test
beforeEach(() => {
  cleanup();
});

afterEach(() => {
  cleanup();
});

describe("Responsive Dialog Sizing Property Tests", () => {
  // Test basic responsive classes
  it("should have responsive sizing classes", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responsive Dialog</DialogTitle>
            <DialogDescription>
              This dialog should be responsive
            </DialogDescription>
          </DialogHeader>
          <Button>Test Button</Button>
        </DialogContent>
      </Dialog>
    );

    const dialogContent = document.querySelector('[role="dialog"]');
    expect(dialogContent).toBeTruthy();

    // Check for responsive classes
    const classList = Array.from(dialogContent!.classList);
    const hasResponsiveClasses = classList.some(
      (cls) =>
        cls.includes("max-w-") ||
        cls.includes("w-") ||
        cls.includes("sm:") ||
        cls.includes("md:") ||
        cls.includes("lg:")
    );
    expect(hasResponsiveClasses).toBe(true);
  });

  // Test mobile optimization classes
  it("should have mobile optimization classes", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mobile Optimized Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const dialogContent = document.querySelector('[role="dialog"]');
    expect(dialogContent).toBeTruthy();

    // Check for mobile optimization classes
    const classList = Array.from(dialogContent!.classList);
    const hasMobileClasses = classList.some(
      (cls) =>
        cls.includes("max-h-") ||
        cls.includes("overflow-") ||
        cls.includes("mx-") ||
        cls.includes("calc(100vw")
    );
    expect(hasMobileClasses).toBe(true);
  });

  // Property-based test for responsive dialog sizing
  it("Property 15: Responsive Dialog Sizing - all dialogs should be optimized for mobile viewing with appropriate sizing constraints", () => {
    fc.assert(
      fc.property(
        // Generate valid dialog configurations
        fc.record({
          title: fc.constantFrom(
            "Dialog Title",
            "Mobile Dialog",
            "Responsive Modal"
          ),
          description: fc.oneof(
            fc.constant("Dialog description"),
            fc.constant(undefined)
          ),
          hasFooter: fc.boolean(),
          contentLength: fc.constantFrom("short", "medium", "long"),
          showCloseButton: fc.boolean(),
        }),
        (props) => {
          // For any valid dialog configuration, responsive sizing should be properly implemented
          let renderSucceeded = false;
          let hasResponsiveSizing = false;
          let hasMobileOptimization = false;
          let hasProperConstraints = false;
          let renderError = null;

          try {
            const contentText =
              props.contentLength === "long"
                ? "This is a very long content that should test the dialog's ability to handle overflow and maintain proper sizing constraints on mobile devices. ".repeat(
                    5
                  )
                : props.contentLength === "medium"
                ? "This is medium length content for testing responsive behavior. ".repeat(
                    2
                  )
                : "Short content.";

            render(
              <Dialog open>
                <DialogContent showCloseButton={props.showCloseButton}>
                  <DialogHeader>
                    <DialogTitle>{props.title}</DialogTitle>
                    {props.description && (
                      <DialogDescription>{props.description}</DialogDescription>
                    )}
                  </DialogHeader>
                  <div>{contentText}</div>
                  {props.hasFooter && (
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Confirm</Button>
                    </DialogFooter>
                  )}
                </DialogContent>
              </Dialog>
            );

            const dialogContent = document.querySelector('[role="dialog"]');
            renderSucceeded = !!dialogContent;

            // Check responsive sizing
            if (dialogContent) {
              const classList = Array.from(dialogContent.classList);

              // Check for responsive width classes
              hasResponsiveSizing = classList.some(
                (cls) =>
                  cls.includes("max-w-") ||
                  cls.includes("w-") ||
                  cls.includes("sm:") ||
                  cls.includes("md:") ||
                  cls.includes("lg:")
              );

              // Check for mobile optimization
              hasMobileOptimization = classList.some(
                (cls) =>
                  cls.includes("max-h-") ||
                  cls.includes("overflow-") ||
                  cls.includes("mx-") ||
                  cls.includes("calc(100vw") ||
                  cls.includes("sm:mx-") ||
                  cls.includes("sm:w-")
              );

              // Check for proper constraints (max height, overflow handling)
              hasProperConstraints =
                classList.some((cls) => cls.includes("max-h-")) &&
                classList.some((cls) => cls.includes("overflow-"));
            }

            cleanup();
          } catch (error) {
            renderError = error;
            cleanup();
          }

          // All responsive requirements should be met
          expect(renderError).toBeNull();
          expect(renderSucceeded).toBe(true);
          expect(hasResponsiveSizing).toBe(true);
          expect(hasMobileOptimization).toBe(true);
          expect(hasProperConstraints).toBe(true);
        }
      ),
      { numRuns: 10 }
    );
  }, 10000);

  // Test specific responsive scenarios
  it("should handle long content with proper overflow", () => {
    const longContent =
      "This is very long content that should test overflow behavior. ".repeat(
        50
      );

    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Long Content Dialog</DialogTitle>
          </DialogHeader>
          <div>{longContent}</div>
        </DialogContent>
      </Dialog>
    );

    const dialogContent = document.querySelector('[role="dialog"]');
    expect(dialogContent).toBeTruthy();

    // Should have overflow handling
    const classList = Array.from(dialogContent!.classList);
    const hasOverflowHandling = classList.some(
      (cls) => cls.includes("overflow-y-auto") || cls.includes("overflow-auto")
    );
    expect(hasOverflowHandling).toBe(true);
  });

  it("should have maximum height constraints", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Height Constrained Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const dialogContent = document.querySelector('[role="dialog"]');
    expect(dialogContent).toBeTruthy();

    // Should have max height constraint
    const classList = Array.from(dialogContent!.classList);
    const hasMaxHeight = classList.some((cls) => cls.includes("max-h-"));
    expect(hasMaxHeight).toBe(true);
  });

  it("should have mobile-specific width handling", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mobile Width Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const dialogContent = document.querySelector('[role="dialog"]');
    expect(dialogContent).toBeTruthy();

    // Should have mobile width handling
    const classList = Array.from(dialogContent!.classList);
    const hasMobileWidth = classList.some(
      (cls) =>
        cls.includes("w-[calc(100vw") ||
        cls.includes("mx-4") ||
        cls.includes("sm:mx-0") ||
        cls.includes("sm:w-full")
    );
    expect(hasMobileWidth).toBe(true);
  });

  it("should maintain proper aspect ratios on different screen sizes", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aspect Ratio Dialog</DialogTitle>
            <DialogDescription>Testing responsive behavior</DialogDescription>
          </DialogHeader>
          <div>Content that should maintain proper proportions</div>
          <DialogFooter>
            <Button>Action</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    const dialogContent = document.querySelector('[role="dialog"]');
    expect(dialogContent).toBeTruthy();

    // Should have responsive classes for different breakpoints
    const classList = Array.from(dialogContent!.classList);
    const hasBreakpointClasses = classList.some(
      (cls) => cls.includes("sm:") || cls.includes("md:") || cls.includes("lg:")
    );
    expect(hasBreakpointClasses).toBe(true);
  });
});
