import * as React from "react";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

export interface FormLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  fieldCount?: number;
  showButton?: boolean;
}

const FormLoading = React.forwardRef<HTMLDivElement, FormLoadingProps>(
  ({ className, fieldCount = 3, showButton = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-4", className)}
        role="status"
        aria-label="Form loading"
        {...props}
      >
        {Array.from({ length: fieldCount }).map((_, index) => (
          <div key={index} className="space-y-2">
            {/* Label skeleton */}
            <Skeleton className="h-4 w-20" />
            {/* Input skeleton */}
            <Skeleton className="h-10 w-full" />
          </div>
        ))}

        {showButton && (
          <div className="pt-2">
            <Skeleton className="h-10 w-24" />
          </div>
        )}
      </div>
    );
  }
);
FormLoading.displayName = "FormLoading";

export { FormLoading };
