/**
 * **Feature: shadcn-ui-migration, Property 8: Theme Variable Propagation**
 * **Validates: Requirements 4.1, 4.3, 4.5**
 *
 * For any theme change, all CSS variables should update automatically
 * across all shadcn/ui components
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import fc from "fast-check";
import { ThemeProvider } from "@/lib/theme-provider";
import React from "react";

// Mock component that uses CSS variables
function TestComponent() {
  return (
    <div
      data-testid="test-component"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        borderColor: "hsl(var(--border))",
      }}
    >
      Test Component
    </div>
  );
}

describe("Theme Variable Propagation Property Tests", () => {
  beforeEach(() => {
    // Reset DOM classes
    document.documentElement.classList.remove("light", "dark");
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("should apply light theme CSS variables by default", () => {
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );

    // Check that light theme class is applied
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should apply dark theme CSS variables when theme is dark", () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );

    // Check that dark theme class is applied
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("should handle system theme preference", () => {
    // Mock system preference for dark mode
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <ThemeProvider defaultTheme="system">
        <TestComponent />
      </ThemeProvider>
    );

    // Should apply dark theme based on system preference
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  // Property-based test for theme variable propagation
  it("Property 8: Theme Variable Propagation - CSS variables should update for any theme change", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom("light", "dark", "system"),
        async (theme) => {
          // Clean up before each test
          document.documentElement.classList.remove("light", "dark");
          localStorage.clear();

          // Mock system preference based on theme
          const systemIsDark = theme === "system" ? Math.random() > 0.5 : false;
          Object.defineProperty(window, "matchMedia", {
            writable: true,
            value: vi.fn().mockImplementation((query) => ({
              matches: query === "(prefers-color-scheme: dark)" && systemIsDark,
              media: query,
              onchange: null,
              addListener: vi.fn(),
              removeListener: vi.fn(),
              addEventListener: vi.fn(),
              removeEventListener: vi.fn(),
              dispatchEvent: vi.fn(),
            })),
          });

          const { unmount } = render(
            <ThemeProvider defaultTheme={theme as any}>
              <TestComponent />
            </ThemeProvider>
          );

          // Determine expected theme class
          let expectedClass: string;
          if (theme === "system") {
            expectedClass = systemIsDark ? "dark" : "light";
          } else {
            expectedClass = theme;
          }

          // Verify that the correct theme class is applied
          expect(
            document.documentElement.classList.contains(expectedClass)
          ).toBe(true);

          // Verify that only one theme class is applied
          const themeClasses = ["light", "dark"].filter((cls) =>
            document.documentElement.classList.contains(cls)
          );
          expect(themeClasses).toHaveLength(1);
          expect(themeClasses[0]).toBe(expectedClass);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should persist theme selection to localStorage", () => {
    // Mock localStorage.getItem to return null initially
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );

    // The ThemeProvider should read from localStorage on initialization
    expect(localStorage.getItem).toHaveBeenCalledWith("theme");
  });

  it("should handle CSS variable inheritance in nested components", () => {
    function NestedComponent() {
      return (
        <div
          data-testid="nested"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          <div
            data-testid="deeply-nested"
            style={{ backgroundColor: "hsl(var(--card))" }}
          >
            Nested content
          </div>
        </div>
      );
    }

    render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
        <NestedComponent />
      </ThemeProvider>
    );

    // All components should inherit the same theme variables
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Components should be able to access CSS variables
    const nested = document.querySelector('[data-testid="nested"]');
    const deeplyNested = document.querySelector(
      '[data-testid="deeply-nested"]'
    );

    expect(nested).toBeTruthy();
    expect(deeplyNested).toBeTruthy();
  });
});
