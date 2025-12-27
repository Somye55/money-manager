/**
 * Icon System Component
 *
 * Provides a consistent icon system with proper sizing, alignment, and accessibility.
 * Supports Lucide React icons with standardized sizes and colors.
 *
 * Features:
 * - Consistent sizing system (xs, sm, md, lg, xl)
 * - Semantic color variants
 * - Proper accessibility attributes
 * - Mobile-optimized touch targets when interactive
 * - Loading and animated states
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconVariants = cva(
  "inline-flex items-center justify-center transition-colors duration-200",
  {
    variants: {
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
        xl: "h-8 w-8",
        "2xl": "h-10 w-10",
      },
      variant: {
        default: "text-current",
        primary: "text-primary-600",
        secondary: "text-secondary-600",
        success: "text-success-600",
        warning: "text-warning-600",
        danger: "text-danger-600",
        muted: "text-muted-foreground",
        ghost: "text-neutral-400",
      },
      interactive: {
        true: "cursor-pointer hover:opacity-80 active:opacity-60 touch-manipulation",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      interactive: false,
    },
  }
);

export interface IconProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof iconVariants> {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label?: string;
  loading?: boolean;
  animated?: boolean;
}

const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      className,
      size,
      variant,
      interactive,
      icon: IconComponent,
      label,
      loading = false,
      animated = false,
      ...props
    },
    ref
  ) => {
    // Size mapping for Lucide icons
    const sizeMap = {
      xs: 12,
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
      "2xl": 40,
    };

    const iconSize = size ? sizeMap[size] : sizeMap.md;

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin"
        width={iconSize}
        height={iconSize}
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

    return (
      <span
        ref={ref}
        className={cn(
          iconVariants({ size, variant, interactive, className }),
          animated && "animate-pulse",
          // Ensure minimum touch target for interactive icons
          interactive &&
            size &&
            ["xs", "sm"].includes(size) &&
            "min-h-[44px] min-w-[44px]"
        )}
        role={interactive ? "button" : undefined}
        aria-label={label}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <IconComponent
            size={iconSize}
            className={cn(
              "transition-transform duration-200",
              interactive && "group-hover:scale-110"
            )}
          />
        )}
      </span>
    );
  }
);
Icon.displayName = "Icon";

// Icon Button Component - combines Icon with button behavior
export interface IconButtonProps
  extends Omit<IconProps, "interactive">,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "ghost"
    | "outline";
  size?: "sm" | "md" | "lg" | "xl";
}

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-neutral-100 text-neutral-700",
        primary: "bg-primary-100 hover:bg-primary-200 text-primary-700",
        secondary: "bg-secondary-100 hover:bg-secondary-200 text-secondary-700",
        success: "bg-success-100 hover:bg-success-200 text-success-700",
        warning: "bg-warning-100 hover:bg-warning-200 text-warning-700",
        danger: "bg-danger-100 hover:bg-danger-200 text-danger-700",
        ghost: "bg-transparent hover:bg-neutral-100 text-neutral-500",
        outline:
          "border-2 border-neutral-300 hover:border-neutral-400 bg-transparent text-neutral-700",
      },
      size: {
        sm: "h-8 w-8 min-h-[44px] min-w-[44px] p-1",
        md: "h-10 w-10 min-h-[44px] min-w-[44px] p-2",
        lg: "h-12 w-12 min-h-[44px] min-w-[44px] p-2",
        xl: "h-14 w-14 min-h-[44px] min-w-[44px] p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon: IconComponent,
      label,
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    // Size mapping for icons within buttons
    const iconSizeMap = {
      sm: 16,
      md: 20,
      lg: 24,
      xl: 28,
    };

    const iconSize = size ? iconSizeMap[size] : iconSizeMap.md;
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(iconButtonVariants({ variant, size, className }))}
        disabled={isDisabled}
        aria-label={label}
        type="button"
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin"
            width={iconSize}
            height={iconSize}
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
        ) : (
          <IconComponent size={iconSize} />
        )}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

// Icon with Badge Component
export interface IconWithBadgeProps extends IconProps {
  badge?: string | number;
  badgeVariant?: "default" | "primary" | "danger" | "success" | "warning";
  showBadge?: boolean;
}

const IconWithBadge = React.forwardRef<HTMLSpanElement, IconWithBadgeProps>(
  (
    { badge, badgeVariant = "danger", showBadge = true, className, ...props },
    ref
  ) => {
    const badgeColors = {
      default: "bg-neutral-500 text-white",
      primary: "bg-primary-500 text-white",
      danger: "bg-danger-500 text-white",
      success: "bg-success-500 text-white",
      warning: "bg-warning-500 text-white",
    };

    return (
      <span className={cn("relative inline-flex", className)} ref={ref}>
        <Icon {...props} />
        {badge && showBadge && (
          <span
            className={cn(
              "absolute -top-1 -right-1 min-w-[16px] h-4",
              "flex items-center justify-center",
              "text-xs font-medium rounded-full px-1",
              "animate-in zoom-in-50",
              badgeColors[badgeVariant]
            )}
            aria-label={`${badge} notifications`}
          >
            {badge}
          </span>
        )}
      </span>
    );
  }
);
IconWithBadge.displayName = "IconWithBadge";

export { Icon, IconButton, IconWithBadge, iconVariants, iconButtonVariants };
export type { IconProps, IconButtonProps, IconWithBadgeProps };
