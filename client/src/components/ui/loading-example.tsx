import * as React from "react";
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
} from "./form";
import { Input } from "./input";
import { LoadingButton } from "./loading-button";
import { FormLoading } from "./form-loading";
import { Skeleton } from "./skeleton";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

export function LoadingExample() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showFormLoading, setShowFormLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    console.log(values);
  }

  if (showFormLoading) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-lg font-semibold mb-4">Loading States Example</h2>
        <FormLoading fieldCount={2} />
        <button
          onClick={() => setShowFormLoading(false)}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Show actual form
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-lg font-semibold mb-4">Loading States Example</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            type="submit"
            loading={isLoading}
            loadingText="Submitting..."
            className="w-full"
          >
            Submit Form
          </LoadingButton>
        </form>
      </Form>

      <div className="mt-8 space-y-4">
        <h3 className="text-md font-medium">Other Loading Components:</h3>

        <div>
          <p className="text-sm text-gray-600 mb-2">Skeleton placeholders:</p>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        <button
          onClick={() => setShowFormLoading(true)}
          className="text-sm text-blue-600 hover:underline"
        >
          Show form loading state
        </button>
      </div>
    </div>
  );
}
