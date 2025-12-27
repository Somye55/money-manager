import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { FormField } from "./form-field";
import { SelectField, type SelectOption } from "./select-field";
import { TextareaField } from "./textarea-field";
import { LoadingButton } from "./loading-button";
import { Button } from "./button";
import { useFormValidation } from "@/hooks/use-form-validation";
import { Mail, User, Phone, CreditCard, Eye, EyeOff } from "lucide-react";

// Example form data structure
interface ExampleFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  country: string;
  bio: string;
  budget: string;
  newsletter: boolean;
}

// Sample options for select field
const countryOptions: SelectOption[] = [
  { value: "us", label: "United States", icon: <span>🇺🇸</span> },
  { value: "ca", label: "Canada", icon: <span>🇨🇦</span> },
  { value: "uk", label: "United Kingdom", icon: <span>🇬🇧</span> },
  { value: "de", label: "Germany", icon: <span>🇩🇪</span> },
  { value: "fr", label: "France", icon: <span>🇫🇷</span> },
  { value: "in", label: "India", icon: <span>🇮🇳</span> },
  { value: "au", label: "Australia", icon: <span>🇦🇺</span> },
];

export function ModernFormExample() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Form validation configuration
  const form = useFormValidation<ExampleFormData>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      country: "",
      bio: "",
      budget: "",
      newsletter: false,
    },
    fields: {
      firstName: {
        rules: { required: true, minLength: 2, maxLength: 50 },
        validateOnChange: true,
        debounceMs: 300,
      },
      lastName: {
        rules: { required: true, minLength: 2, maxLength: 50 },
        validateOnChange: true,
        debounceMs: 300,
      },
      email: {
        rules: { required: true, email: true },
        validateOnChange: true,
        debounceMs: 500,
      },
      phone: {
        rules: {
          pattern: /^\+?[\d\s\-\(\)]+$/,
          minLength: 10,
        },
        validateOnBlur: true,
      },
      password: {
        rules: {
          required: true,
          minLength: 8,
          custom: (value) => {
            if (!value) return null;
            if (!/(?=.*[a-z])/.test(value))
              return "Must contain lowercase letter";
            if (!/(?=.*[A-Z])/.test(value))
              return "Must contain uppercase letter";
            if (!/(?=.*\d)/.test(value)) return "Must contain number";
            return null;
          },
        },
        validateOnChange: true,
        debounceMs: 300,
      },
      confirmPassword: {
        rules: {
          required: true,
          custom: (value) => {
            if (value !== form.values.password) {
              return "Passwords do not match";
            }
            return null;
          },
        },
        validateOnChange: true,
        debounceMs: 300,
      },
      country: {
        rules: { required: true },
        validateOnChange: true,
      },
      bio: {
        rules: { maxLength: 500 },
        validateOnChange: true,
        debounceMs: 500,
      },
      budget: {
        rules: {
          number: true,
          min: 0,
          max: 1000000,
        },
        validateOnBlur: true,
      },
      newsletter: {},
    },
    onSubmit: async (values) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random success/failure
      if (Math.random() > 0.3) {
        setSubmitStatus("success");
        console.log("Form submitted successfully:", values);
      } else {
        setSubmitStatus("error");
        throw new Error("Submission failed");
      }
    },
  });

  const handleReset = () => {
    form.resetForm();
    setSubmitStatus("idle");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Modern Form Example
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Demonstrating enhanced form components with validation
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  placeholder="Enter your first name"
                  icon={<User size={18} />}
                  required
                  {...form.getFieldProps("firstName")}
                />

                <FormField
                  label="Last Name"
                  placeholder="Enter your last name"
                  icon={<User size={18} />}
                  required
                  {...form.getFieldProps("lastName")}
                />
              </div>

              <FormField
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                icon={<Mail size={18} />}
                description="We'll never share your email with anyone else"
                required
                {...form.getFieldProps("email")}
              />

              <FormField
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                icon={<Phone size={18} />}
                showOptional
                helperText="Include country code for international numbers"
                {...form.getFieldProps("phone")}
              />
            </div>

            {/* Security Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Security
              </h3>

              <FormField
                label="Password"
                type="password"
                placeholder="Create a strong password"
                required
                showPasswordToggle
                description="Must contain uppercase, lowercase, and number"
                {...form.getFieldProps("password")}
              />

              <FormField
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                required
                showPasswordToggle
                {...form.getFieldProps("confirmPassword")}
              />
            </div>

            {/* Location & Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Location & Preferences
              </h3>

              <SelectField
                label="Country"
                placeholder="Select your country"
                options={countryOptions}
                required
                description="This helps us provide localized content"
                {...form.getSelectFieldProps("country")}
              />

              <TextareaField
                label="Bio"
                placeholder="Tell us about yourself..."
                showOptional
                showCharacterCount
                maxLength={500}
                resize="vertical"
                description="Share a brief description about yourself"
                {...form.getFieldProps("bio")}
              />

              <FormField
                label="Monthly Budget"
                type="number"
                placeholder="0.00"
                icon={<CreditCard size={18} />}
                showOptional
                helperText="Enter amount in USD"
                {...form.getFieldProps("budget")}
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <LoadingButton
                type="submit"
                loading={form.isSubmitting}
                success={submitStatus === "success"}
                error={submitStatus === "error"}
                loadingText="Creating Account..."
                successText="Account Created!"
                errorText="Failed to Create"
                disabled={!form.isValid || !form.isDirty}
                className="flex-1"
              >
                Create Account
              </LoadingButton>

              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={form.isSubmitting}
                className="flex-1 sm:flex-initial"
              >
                Reset Form
              </Button>
            </div>

            {/* Form State Debug Info (Development Only) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Form State (Debug)</h4>
                <div className="text-xs space-y-1">
                  <div>Valid: {form.isValid ? "✅" : "❌"}</div>
                  <div>Dirty: {form.isDirty ? "✅" : "❌"}</div>
                  <div>Submitting: {form.isSubmitting ? "✅" : "❌"}</div>
                  <div>
                    Errors: {Object.values(form.errors).filter(Boolean).length}
                  </div>
                  <div>
                    Touched:{" "}
                    {Object.values(form.touched).filter(Boolean).length}
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
