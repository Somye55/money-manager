import * as React from "react";
import { cn } from "./utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-sm shadow-sm transition-colors",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
              icon && "pl-11",
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
