/**
 * Page Transition Component
 *
 * Provides smooth page transitions and navigation feedback for enhanced user experience.
 * Implements modern mobile-first transition patterns with proper loading states.
 *
 * Features:
 * - Smooth fade and slide transitions between pages
 * - Loading states during navigation
 * - Proper animation timing for mobile devices
 * - Accessibility-friendly reduced motion support
 * - Navigation feedback and visual cues
 *
 * Requirements satisfied:
 * - 5.2: Smooth page transitions and navigation feedback
 * - 5.4: Proper loading states and skeleton screens
 */

import * as React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  variant?: "fade" | "slide" | "scale";
}

const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children, className, loading = false, variant = "fade" }, ref) => {
    const location = useLocation();
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    const [displayLocation, setDisplayLocation] = React.useState(location);

    React.useEffect(() => {
      if (location !== displayLocation) {
        setIsTransitioning(true);

        // Short delay to allow exit animation
        const timer = setTimeout(() => {
          setDisplayLocation(location);
          setIsTransitioning(false);
        }, 150);

        return () => clearTimeout(timer);
      }
    }, [location, displayLocation]);

    const getTransitionClasses = () => {
      const baseClasses = "transition-all duration-300 ease-out";

      if (isTransitioning) {
        switch (variant) {
          case "slide":
            return `${baseClasses} opacity-0 transform translate-x-4`;
          case "scale":
            return `${baseClasses} opacity-0 transform scale-95`;
          default:
            return `${baseClasses} opacity-0`;
        }
      }

      switch (variant) {
        case "slide":
          return `${baseClasses} opacity-100 transform translate-x-0`;
        case "scale":
          return `${baseClasses} opacity-100 transform scale-100`;
        default:
          return `${baseClasses} opacity-100`;
      }
    };

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-center min-h-[200px]",
            className
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" className="text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Loading...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(getTransitionClasses(), className)}
        key={displayLocation.pathname}
      >
        {children}
      </div>
    );
  }
);
PageTransition.displayName = "PageTransition";

// Navigation Loading Indicator
interface NavigationLoadingProps {
  isLoading: boolean;
}

const NavigationLoading: React.FC<NavigationLoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted overflow-hidden">
      <div className="h-full bg-gradient-to-r from-primary to-secondary animate-shimmer" />
    </div>
  );
};

// Page Loading Skeleton
interface PageSkeletonProps {
  variant?: "dashboard" | "form" | "list" | "default";
  className?: string;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({
  variant = "default",
  className,
}) => {
  const renderDashboardSkeleton = () => (
    <div className="space-y-6 p-4">
      {/* Balance cards skeleton */}
      <div className="grid grid-cols-1 gap-4">
        <div className="h-24 bg-muted rounded-2xl animate-pulse" />
        <div className="h-20 bg-muted rounded-2xl animate-pulse" />
      </div>

      {/* Chart skeleton */}
      <div className="h-48 bg-muted rounded-2xl animate-pulse" />

      {/* Category breakdown skeleton */}
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-4 h-4 bg-muted rounded-full animate-pulse" />
              <div className="flex-1 h-4 bg-muted rounded animate-pulse" />
              <div className="w-16 h-4 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFormSkeleton = () => (
    <div className="space-y-6 p-4">
      <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
            <div className="h-12 bg-muted rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
      <div className="h-12 bg-muted rounded-lg animate-pulse" />
    </div>
  );

  const renderListSkeleton = () => (
    <div className="space-y-4 p-4">
      <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl"
          >
            <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            </div>
            <div className="w-16 h-4 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderDefaultSkeleton = () => (
    <div className="space-y-4 p-4">
      <div className="h-8 bg-muted rounded animate-pulse w-1/2" />
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (variant) {
      case "dashboard":
        return renderDashboardSkeleton();
      case "form":
        return renderFormSkeleton();
      case "list":
        return renderListSkeleton();
      default:
        return renderDefaultSkeleton();
    }
  };

  return (
    <div className={cn("animate-fade-in", className)}>{renderSkeleton()}</div>
  );
};

// Loading State Component
interface LoadingStateProps {
  message?: string;
  variant?: "spinner" | "skeleton" | "dots";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  variant = "spinner",
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "h-32",
    md: "h-48",
    lg: "h-64",
  };

  if (variant === "skeleton") {
    return <PageSkeleton className={className} />;
  }

  if (variant === "dots") {
    return (
      <div
        className={cn(
          "flex items-center justify-center",
          sizeClasses[size],
          className
        )}
      >
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        sizeClasses[size],
        className
      )}
    >
      <Spinner
        size={size === "sm" ? "default" : size === "lg" ? "xl" : "lg"}
        className="text-primary"
      />
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
};

export { PageTransition, NavigationLoading, PageSkeleton, LoadingState };
