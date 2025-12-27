import * as React from "react";
import { Button, type ButtonProps } from "./button";
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  success?: boolean;
  successText?: string;
  error?: boolean;
  errorText?: string;
  showSuccessIcon?: boolean;
  showErrorIcon?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      className,
      children,
      loading = false,
      loadingText,
      success = false,
      successText,
      error = false,
      errorText,
      showSuccessIcon = true,
      showErrorIcon = true,
      disabled,
      variant,
      ...props
    },
    ref
  ) => {
    // Determine the current state
    const isLoading = loading;
    const isSuccess = success && !loading && !error;
    const isError = error && !loading && !success;
    const isDisabled = disabled || loading;

    // Determine variant based on state
    const currentVariant = isSuccess
      ? "success"
      : isError
      ? "destructive"
      : variant;

    // Determine content to show
    const getContent = () => {
      if (isLoading) {
        return (
          <>
            <Spinner size="sm" className="mr-2" aria-hidden="true" />
            {loadingText || "Loading..."}
          </>
        );
      }

      if (isSuccess) {
        return (
          <>
            {showSuccessIcon && <Check size={16} className="mr-2" />}
            {successText || children}
          </>
        );
      }

      if (isError) {
        return (
          <>
            {showErrorIcon && <X size={16} className="mr-2" />}
            {errorText || children}
          </>
        );
      }

      return children;
    };

    return (
      <Button
        ref={ref}
        className={cn(
          // Enhanced transitions for state changes
          "transition-all duration-300",

          // Success state styling
          isSuccess && [
            "bg-success-500 hover:bg-success-600",
            "text-white shadow-success/30",
          ],

          // Error state styling
          isError && [
            "bg-danger-500 hover:bg-danger-600",
            "text-white shadow-danger/30",
          ],

          className
        )}
        disabled={isDisabled}
        variant={currentVariant}
        {...props}
      >
        {getContent()}
      </Button>
    );
  }
);
LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
