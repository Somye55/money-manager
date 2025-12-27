import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  success?: boolean;
  fullWidth?: boolean;
  variant?: "default" | "filled" | "outlined";
  loading?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      success,
      fullWidth = true,
      variant = "default",
      loading = false,
      resize = "vertical",
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const hasError = !!error;
    const hasSuccess = success && !hasError;
    const isDisabled = disabled || loading;

    const textareaClasses = cn(
      // Base styles with enhanced modern design
      "flex min-h-[80px] w-full rounded-lg border bg-background px-4 py-3 text-base ring-offset-background transition-all duration-300",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",

      // Mobile optimizations - 16px font size prevents iOS zoom
      "text-base md:text-sm",
      "touch-manipulation",

      // Enhanced focus and hover states
      "hover:border-primary/50 focus:border-primary",
      isFocused && "ring-2 ring-primary/20 border-primary",

      // Resize behavior
      resize === "none" && "resize-none",
      resize === "vertical" && "resize-y",
      resize === "horizontal" && "resize-x",
      resize === "both" && "resize",

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

      // Full width handling
      fullWidth ? "w-full" : "w-auto",

      className
    );

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    return (
      <textarea
        className={textareaClasses}
        ref={ref}
        disabled={isDisabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
