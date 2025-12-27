import * as React from "react";
import { Label } from "./label";
import { Textarea, type TextareaProps } from "./textarea";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export interface TextareaFieldProps extends TextareaProps {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  helperText?: string;
  showOptional?: boolean;
  loading?: boolean;
  success?: boolean;
  validationState?: "idle" | "validating" | "success" | "error";
  showCharacterCount?: boolean;
  maxLength?: number;
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    {
      label,
      error,
      description,
      helperText,
      required,
      showOptional = false,
      className,
      id,
      fullWidth = true,
      loading = false,
      success,
      validationState = "idle",
      showCharacterCount = false,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const fieldId =
      id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
    const descriptionId = description ? `${fieldId}-description` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;
    const helperTextId = helperText ? `${fieldId}-helper` : undefined;

    // Determine actual states
    const hasError = !!error || validationState === "error";
    const hasSuccess = success || validationState === "success";
    const isValidating = validationState === "validating";
    const isLoading = loading || isValidating;

    // Character count logic
    const currentLength = typeof value === "string" ? value.length : 0;
    const showCount = showCharacterCount && (maxLength || currentLength > 0);

    return (
      <div className={cn("space-y-2", fullWidth && "w-full", className)}>
        {/* Enhanced Label with better typography and states */}
        {label && (
          <div className="flex items-center justify-between">
            <Label
              htmlFor={fieldId}
              className={cn(
                "block text-sm font-medium transition-colors duration-200",
                "text-foreground",
                hasError && "text-danger-600 dark:text-danger-400",
                hasSuccess && "text-success-600 dark:text-success-400",
                required &&
                  "after:content-['*'] after:ml-0.5 after:text-danger-500 after:font-bold",
                !required &&
                  showOptional &&
                  "after:content-['(optional)'] after:ml-1 after:text-muted-foreground after:font-normal after:text-xs"
              )}
            >
              {label}
            </Label>

            {/* Character count in header */}
            {showCount && (
              <span
                className={cn(
                  "text-xs text-muted-foreground",
                  maxLength &&
                    currentLength > maxLength * 0.9 &&
                    "text-warning-600",
                  maxLength && currentLength >= maxLength && "text-danger-600"
                )}
              >
                {currentLength}
                {maxLength && `/${maxLength}`}
              </span>
            )}
          </div>
        )}

        {/* Enhanced Textarea with loading and validation states */}
        <Textarea
          id={fieldId}
          ref={ref}
          error={error}
          success={hasSuccess}
          loading={isLoading}
          fullWidth={fullWidth}
          maxLength={maxLength}
          value={value}
          aria-describedby={
            [descriptionId, errorId, helperTextId].filter(Boolean).join(" ") ||
            undefined
          }
          aria-invalid={hasError}
          aria-required={required}
          {...props}
        />

        {/* Enhanced Description with better styling */}
        {description && !error && (
          <div className="flex items-start gap-2">
            <Info
              size={14}
              className="text-muted-foreground mt-0.5 flex-shrink-0"
            />
            <p
              id={descriptionId}
              className="text-sm text-muted-foreground leading-relaxed"
            >
              {description}
            </p>
          </div>
        )}

        {/* Enhanced Helper Text */}
        {helperText && !error && !description && (
          <p
            id={helperTextId}
            className="text-xs text-muted-foreground leading-relaxed"
          >
            {helperText}
          </p>
        )}

        {/* Enhanced Error Message with better visual hierarchy */}
        {error && (
          <div
            className={cn(
              "flex items-start gap-2 p-3 rounded-lg",
              "bg-danger-50 dark:bg-danger-950/30",
              "border border-danger-200 dark:border-danger-800",
              "animate-in slide-in-from-top-1 duration-200"
            )}
          >
            <AlertCircle
              size={16}
              className="text-danger-600 dark:text-danger-400 mt-0.5 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p
                id={errorId}
                className="text-sm font-medium text-danger-700 dark:text-danger-300 leading-relaxed"
                role="alert"
              >
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {hasSuccess && !error && (
          <div
            className={cn(
              "flex items-start gap-2 p-3 rounded-lg",
              "bg-success-50 dark:bg-success-950/30",
              "border border-success-200 dark:border-success-800",
              "animate-in slide-in-from-top-1 duration-200"
            )}
          >
            <CheckCircle2
              size={16}
              className="text-success-600 dark:text-success-400 mt-0.5 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-success-700 dark:text-success-300 leading-relaxed">
                Looks good!
              </p>
            </div>
          </div>
        )}

        {/* Validation State Indicator */}
        {isValidating && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
            <span>Validating...</span>
          </div>
        )}

        {/* Character count at bottom (if not shown in header) */}
        {showCount && !label && (
          <div className="flex justify-end">
            <span
              className={cn(
                "text-xs text-muted-foreground",
                maxLength &&
                  currentLength > maxLength * 0.9 &&
                  "text-warning-600",
                maxLength && currentLength >= maxLength && "text-danger-600"
              )}
            >
              {currentLength}
              {maxLength && `/${maxLength}`}
            </span>
          </div>
        )}
      </div>
    );
  }
);
TextareaField.displayName = "TextareaField";

export { TextareaField };
