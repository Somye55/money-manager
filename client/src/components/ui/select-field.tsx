import * as React from "react";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  description?: string;
  required?: boolean;
  helperText?: string;
  showOptional?: boolean;
  loading?: boolean;
  success?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

const SelectField = React.forwardRef<HTMLButtonElement, SelectFieldProps>(
  (
    {
      label,
      placeholder = "Select an option...",
      options,
      value,
      onValueChange,
      error,
      description,
      helperText,
      required,
      showOptional = false,
      loading = false,
      success,
      disabled,
      fullWidth = true,
      className,
      id,
      name,
    },
    ref
  ) => {
    const fieldId =
      id || `select-${Math.random().toString(36).substring(2, 9)}`;
    const descriptionId = description ? `${fieldId}-description` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;
    const helperTextId = helperText ? `${fieldId}-helper` : undefined;

    // Determine actual states
    const hasError = !!error;
    const hasSuccess = success && !hasError;
    const isDisabled = disabled || loading;

    return (
      <div className={cn("space-y-2", fullWidth && "w-full", className)}>
        {/* Enhanced Label */}
        {label && (
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
        )}

        {/* Select Component */}
        <Select
          value={value}
          onValueChange={onValueChange}
          disabled={isDisabled}
          name={name}
        >
          <SelectTrigger
            ref={ref}
            id={fieldId}
            error={hasError}
            success={hasSuccess}
            className={cn(
              fullWidth && "w-full",
              loading && "cursor-wait opacity-75"
            )}
            aria-describedby={
              [descriptionId, errorId, helperTextId]
                .filter(Boolean)
                .join(" ") || undefined
            }
            aria-invalid={hasError}
            aria-required={required}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {loading && (
                <div className="animate-spin h-4 w-4 border border-current border-t-transparent rounded-full flex-shrink-0" />
              )}
              <SelectValue placeholder={placeholder} className="truncate" />
            </div>
          </SelectTrigger>

          <SelectContent>
            {options.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className="flex items-center gap-2"
                >
                  {option.icon && (
                    <span className="flex-shrink-0">{option.icon}</span>
                  )}
                  <span className="truncate">{option.label}</span>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* Enhanced Description */}
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

        {/* Enhanced Error Message */}
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
                Selection confirmed!
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";

export { SelectField };
