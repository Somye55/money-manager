/**
 * **Feature: shadcn-ui-migration, Property 12: Form Focus Flow**
 * **Validates: Requirements 7.5**
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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

describe("Form Focus Flow", () => {
  it("should render form fields with proper accessibility attributes", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          fieldCount: fc.integer({ min: 2, max: 4 }),
          fieldNames: fc.constantFrom(
            ["firstName", "lastName"],
            ["username", "password"],
            ["name", "email"]
          ),
        }),
        async ({ fieldCount, fieldNames }) => {
          const fieldsToUse = fieldNames.slice(0, fieldCount);

          const schema = z.object(
            fieldsToUse.reduce((acc, fieldName) => {
              acc[fieldName] = z.string().min(1, "Required");
              return acc;
            }, {} as Record<string, z.ZodString>)
          );

          function TestForm() {
            const form = useForm({
              resolver: zodResolver(schema),
              defaultValues: fieldsToUse.reduce((acc, fieldName) => {
                acc[fieldName] = "";
                return acc;
              }, {} as Record<string, string>),
            });

            return (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(() => {})}>
                  {fieldsToUse.map((fieldName, index) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{fieldName}</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid={`input-${index}`} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            );
          }

          const { unmount } = render(<TestForm />);

          try {
            // Verify inputs have proper accessibility attributes
            fieldsToUse.forEach((fieldName, index) => {
              const input = screen.getByTestId(`input-${index}`);

              // Input should be focusable
              expect(input).toBeEnabled();
              expect(input.getAttribute("tabindex")).not.toBe("-1");

              // Input should have proper attributes
              expect(input).toHaveAttribute("id");
              expect(input).toHaveAttribute("name", fieldName);

              // Input should be associated with label
              expect(screen.getByLabelText(fieldName)).toBe(input);
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
