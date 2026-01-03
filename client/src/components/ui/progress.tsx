import * as React from "react";
import { cn } from "./utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showLabel?: boolean;
  variant?: "default" | "gradient";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      showLabel = false,
      variant = "gradient",
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    // Dynamic gradient based on percentage
    const getGradientClass = () => {
      if (variant === "default") {
        return "bg-primary";
      }

      if (percentage < 33) {
        return "bg-gradient-to-r from-red-500 to-orange-500";
      } else if (percentage < 66) {
        return "bg-gradient-to-r from-yellow-500 to-amber-500";
      } else {
        return "bg-gradient-to-r from-indigo-500 to-purple-600";
      }
    };

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full transition-all duration-300 ease-in-out",
              getGradientClass()
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>
        {showLabel && (
          <span className="mt-1 text-xs text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
