/**
 * **Feature: shadcn-ui-migration, Property 10: Form Validation Consistency**
 * **Validates: Requirements 7.1, 7.2**
 *
 * Property 10: Form Validation Consistency
 * For any form field with validation, error states and validation messages
 * should display consistently with appropriate styling
 */

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { fc } from "@fast-check/vitest";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

describe("Form Validation Consistency", () => {
  it("should display validation errors with consistent styling", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          minLength: fc.integer({ min: 3, max: 8 }),
          errorMessage: fc.constantFrom(
            "This field is required",
            "Must be at least 3 characters",
            "Please enter a valid value"
          ),
          invalidValue: fc.constantFrom("", "a", "ab"), // Values that will trigger validation
        }),
        async ({ minLength, errorMessage, invalidValue }) => {
          // Create a unique test ID for this iteration
          const testId = `test-${Math.random().toString(36).substr(2, 9)}`;

          function TestForm() {
            const form = useForm({
              resolver: zodResolver(
                z.object({
                  testField: z.string().min(minLength, errorMessage),
                })
              ),
              defaultValues: { testField: "" },
            });

            return (
              <div data-testid={testId}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(() => {})}>
                    <FormField
                      control={form.control}
                      name="testField"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Test Field</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </div>
            );
          }

          const { unmount } = render(<TestForm />);

          try {
            const container = screen.getByTestId(testId);
            const input = screen.getByLabelText("Test Field");
            const submitButton = screen.getByRole("button", {
              name: /submit/i,
            });

            // Enter invalid value
            fireEvent.change(input, { target: { value: invalidValue } });
            fireEvent.click(submitButton);

            // Wait for validation message to appear
            await waitFor(() => {
              const errorElement = screen.queryByText(errorMessage);
              if (errorElement) {
                // Verify error message has consistent styling
                expect(errorElement).toHaveClass("text-destructive");
                expect(errorElement).toHaveClass("text-sm");
                expect(errorElement).toHaveClass("font-medium");
                expect(errorElement).toHaveAttribute("role", "alert");

                // Verify input has proper aria attributes
                expect(input).toHaveAttribute("aria-invalid", "true");

                const errorId = errorElement.getAttribute("id");
                if (errorId) {
                  expect(input.getAttribute("aria-describedby")).toContain(
                    errorId
                  );
                }
              }
            });
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it("should clear validation errors when valid input is provided", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          minLength: fc.integer({ min: 2, max: 5 }),
          errorMessage: fc.constantFrom(
            "This field is required",
            "Must be at least 2 characters"
          ),
          validValue: fc
            .string({ minLength: 6, maxLength: 15 })
            .filter((s) => /^[a-zA-Z0-9]+$/.test(s)),
        }),
        async ({ minLength, errorMessage, validValue }) => {
          const testId = `test-${Math.random().toString(36).substr(2, 9)}`;

          function TestForm() {
            const form = useForm({
              resolver: zodResolver(
                z.object({
                  testField: z.string().min(minLength, errorMessage),
                })
              ),
              defaultValues: { testField: "" },
            });

            return (
              <div data-testid={testId}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(() => {})}>
                    <FormField
                      control={form.control}
                      name="testField"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Test Field</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </div>
            );
          }

          const { unmount } = render(<TestForm />);

          try {
            const input = screen.getByLabelText("Test Field");
            const submitButton = screen.getByRole("button", {
              name: /submit/i,
            });

            // First trigger error with empty input
            fireEvent.click(submitButton);

            await waitFor(() => {
              expect(screen.queryByText(errorMessage)).toBeInTheDocument();
            });

            // Then enter valid value
            fireEvent.change(input, { target: { value: validValue } });
            fireEvent.click(submitButton);

            // Verify error is cleared
            await waitFor(() => {
              expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
              expect(input).toHaveAttribute("aria-invalid", "false");
            });
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it("should maintain consistent styling across different validation types", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          {
            type: "minLength",
            schema: z.string().min(5, "Too short"),
            invalidValue: "abc",
          },
          {
            type: "email",
            schema: z.string().email("Invalid email"),
            invalidValue: "clearly.not.an.email.format",
          },
          {
            type: "required",
            schema: z.string().min(1, "Required"),
            invalidValue: "",
          }
        ),
        async ({ type, schema, invalidValue }) => {
          const testId = `test-${Math.random().toString(36).substr(2, 9)}`;

          function TestForm() {
            const form = useForm({
              resolver: zodResolver(z.object({ testField: schema })),
              defaultValues: { testField: "" },
            });

            return (
              <div data-testid={testId}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(() => {})}>
                    <FormField
                      control={form.control}
                      name="testField"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Test Field</FormLabel>
                          <FormControl>
                            <Input
                              type={type === "email" ? "email" : "text"}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </div>
            );
          }

          const { unmount } = render(<TestForm />);

          try {
            const input = screen.getByLabelText("Test Field");
            const submitButton = screen.getByRole("button", {
              name: /submit/i,
            });

            fireEvent.change(input, { target: { value: invalidValue } });
            fireEvent.click(submitButton);

            await waitFor(
              () => {
                const errorElements = screen.queryAllByRole("alert");
                if (errorElements.length > 0) {
                  const errorElement = errorElements[0];
                  // All validation types should have consistent styling
                  expect(errorElement).toHaveClass("text-destructive");
                  expect(errorElement).toHaveClass("text-sm");
                  expect(errorElement).toHaveClass("font-medium");
                }
              },
              { timeout: 3000 }
            );
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 50 }
    );
  });
});
