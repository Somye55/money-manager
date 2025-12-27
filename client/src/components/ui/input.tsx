import * as React from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  success?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  variant?: "default" | "filled" | "outlined";
  loading?: boolean;
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      error,
      success,
      fullWidth = true,
      icon,
      iconPosition = "left",
      variant = "default",
      loading = false,
      showPasswordToggle = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const hasIcon = !!icon;
    const hasError = !!error;
    const hasSuccess = success && !hasError;
    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;
    const isDisabled = disabled || loading;

    // Auto-show success icon when success state is true
    const statusIcon = hasError ? (
      <AlertCircle size={18} className="text-danger-500" />
    ) : hasSuccess ? (
      <CheckCircle2 size={18} className="text-success-500" />
    ) : null;

    const inputClasses = cn(
      // Base styles with enhanced modern design
      "flex h-12 w-full rounded-lg border bg-background px-4 py-3 text-base ring-offset-background transition-all duration-300",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",

      // Mobile optimizations - 16px font size prevents iOS zoom
      "min-h-[44px] text-base md:text-sm",
      "touch-manipulation",

      // Enhanced focus and hover states
      "hover:border-primary/50 focus:border-primary",
      isFocused && "ring-2 ring-primary/20 border-primary",

      // Variant styles with improved visual hierarchy
      variant === "default" && [
        "border-input bg-background",
        "focus-visible:ring-primary/20",
        "shadow-sm hover:shadow-md transition-shadow",
      ],
      variant === "filled" && [
        "border-transparent bg-neutral-100 dark:bg-neutral-800",
        "focus-visible:ring-primary/20 focus-visible:bg-background",
        "hover:bg-neutral-50 dark:hover:bg-neutral-700",
      ],
      variant === "outlined" && [
        "border-2 border-input bg-background",
        "focus-visible:ring-primary/20",
        "hover:border-primary/30",
      ],

      // Enhanced state-based styling
      hasError && [
        "border-danger-500 focus-visible:ring-danger-500/20",
        "bg-danger-50/30 dark:bg-danger-950/30",
        "hover:border-danger-600 focus:border-danger-600",
      ],
      hasSuccess && [
        "border-success-500 focus-visible:ring-success-500/20",
        "bg-success-50/30 dark:bg-success-950/30",
        "hover:border-success-600 focus:border-success-600",
      ],

      // Loading state
      loading && [
        "cursor-wait opacity-75",
        "bg-neutral-50 dark:bg-neutral-800",
      ],

      // Icon padding adjustments with better spacing
      hasIcon && iconPosition === "left" && "pl-12",
      hasIcon && iconPosition === "right" && "pr-12",
      statusIcon && !hasIcon && "pr-12",
      statusIcon && hasIcon && iconPosition === "left" && "pr-16",
      statusIcon && hasIcon && iconPosition === "right" && "pl-16",
      isPassword && showPasswordToggle && "pr-12",
      isPassword && showPasswordToggle && statusIcon && "pr-20",

      // Full width handling
      fullWidth ? "w-full" : "w-auto",

      className
    );

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4 text-muted-foreground"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    if (
      hasIcon ||
      statusIcon ||
      (isPassword && showPasswordToggle) ||
      loading
    ) {
      return (
        <div className="relative">
          <input
            type={actualType}
            className={inputClasses}
            ref={ref}
            disabled={isDisabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {/* Left icon */}
          {hasIcon && iconPosition === "left" && (
            <div
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center",
                "text-muted-foreground transition-colors duration-300",
                hasError && "text-danger-500",
                hasSuccess && "text-success-500",
                isFocused && "text-primary"
              )}
            >
              {loading ? <LoadingSpinner /> : icon}
            </div>
          )}

          {/* Right side icons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Loading spinner */}
            {loading && !hasIcon && <LoadingSpinner />}

            {/* Status icon */}
            {statusIcon && (
              <div className="flex items-center justify-center">
                {statusIcon}
              </div>
            )}

            {/* Password toggle */}
            {isPassword && showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  "flex items-center justify-center p-1 rounded-md",
                  "text-muted-foreground hover:text-foreground",
                  "transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20"
                )}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}

            {/* Right icon */}
            {hasIcon && iconPosition === "right" && (
              <div
                className={cn(
                  "flex items-center justify-center",
                  "text-muted-foreground transition-colors duration-300",
                  hasError && "text-danger-500",
                  hasSuccess && "text-success-500",
                  isFocused && "text-primary"
                )}
              >
                {icon}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <input
        type={actualType}
        className={inputClasses}
        ref={ref}
        disabled={isDisabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
