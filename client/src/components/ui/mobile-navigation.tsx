/**
 * Mobile Navigation Components
 *
 * Provides mobile-optimized navigation patterns including bottom navigation,
 * navigation sheets, and mobile-first navigation components with proper
 * touch target sizing and accessibility features.
 *
 * Features:
 * - Bottom navigation with touch-optimized targets
 * - Navigation sheets using drawer patterns
 * - Safe area handling for mobile devices
 * - Proper ARIA labels and keyboard navigation
 * - Touch target optimization (minimum 44px)
 * - Swipe gesture support for navigation sheets
 *
 * Requirements satisfied:
 * - 5.3: Mobile navigation patterns
 * - 5.5: Touch target sizing for navigation elements
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  isTouchDevice,
  optimizeForMobile,
  TOUCH_TARGET,
  MOBILE_CLASSES,
} from "@/lib/mobile-utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "./drawer";
import { Button } from "./button";
import { Menu, X } from "lucide-react";

// Bottom Navigation Component
interface BottomNavigationProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: "default" | "floating";
  showBorder?: boolean;
}

const BottomNavigation = React.forwardRef<HTMLElement, BottomNavigationProps>(
  (
    { className, children, variant = "default", showBorder = true, ...props },
    ref
  ) => {
    const navigationRef = React.useRef<HTMLElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => navigationRef.current!);

    React.useEffect(() => {
      const element = navigationRef.current;
      if (!element) return;

      // Optimize for mobile interactions
      const cleanup = optimizeForMobile(element, {
        touchTarget: false, // Individual items will be optimized
        preventHover: true,
        preventZoom: false,
      });

      return cleanup;
    }, []);

    return (
      <nav
        ref={navigationRef}
        className={cn(
          // Base positioning and layout
          "fixed bottom-0 left-0 right-0 z-50",
          "flex items-center justify-around",
          // Background and styling
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          // Border styling
          showBorder && "border-t border-border",
          // Safe area handling
          MOBILE_CLASSES.SAFE_AREA_BOTTOM,
          // Padding and spacing
          "px-2 py-1",
          // Variant-specific styles
          variant === "floating" && [
            "mx-4 mb-4 rounded-2xl border shadow-lg",
            "left-4 right-4 bottom-4",
          ],
          // Touch optimization
          MOBILE_CLASSES.TOUCH_MANIPULATION,
          className
        )}
        role="navigation"
        aria-label="Bottom navigation"
        {...props}
      >
        {children}
      </nav>
    );
  }
);
BottomNavigation.displayName = "BottomNavigation";

// Bottom Navigation Item Component
interface BottomNavigationItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  active?: boolean;
  badge?: string | number;
  showLabel?: boolean;
}

const BottomNavigationItem = React.forwardRef<
  HTMLButtonElement,
  BottomNavigationItemProps
>(
  (
    {
      className,
      icon: Icon,
      label,
      active = false,
      badge,
      showLabel = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => buttonRef.current!);

    React.useEffect(() => {
      const element = buttonRef.current;
      if (!element) return;

      // Optimize for mobile touch targets
      const cleanup = optimizeForMobile(element, {
        touchTarget: true,
        preventHover: true,
        minTouchSize: TOUCH_TARGET.MIN_SIZE,
      });

      return cleanup;
    }, []);

    return (
      <button
        ref={buttonRef}
        className={cn(
          // Base layout and positioning
          "relative flex flex-col items-center justify-center",
          "flex-1 min-w-0 rounded-xl transition-all duration-200",
          // Touch target optimization
          MOBILE_CLASSES.TOUCH_TARGET,
          "p-2",
          // Active/inactive states
          active
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
          // Disabled state
          disabled && "opacity-50 cursor-not-allowed",
          // Focus styles
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        disabled={disabled}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        style={{
          minHeight: `${TOUCH_TARGET.MIN_SIZE}px`,
          minWidth: `${TOUCH_TARGET.MIN_SIZE}px`,
        }}
        {...props}
      >
        {/* Icon with badge */}
        <div className="relative">
          <Icon
            size={22}
            className={cn(
              "transition-all duration-200",
              active ? "scale-110" : "scale-100"
            )}
          />
          {badge && (
            <span
              className={cn(
                "absolute -top-1 -right-1 min-w-[16px] h-4",
                "flex items-center justify-center",
                "bg-destructive text-destructive-foreground",
                "text-xs font-medium rounded-full px-1",
                "animate-in zoom-in-50"
              )}
              aria-label={`${badge} notifications`}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Label */}
        {showLabel && (
          <span
            className={cn(
              "text-xs font-medium mt-1 truncate max-w-full",
              "transition-all duration-200",
              active ? "font-semibold" : "font-normal"
            )}
          >
            {label}
          </span>
        )}
      </button>
    );
  }
);
BottomNavigationItem.displayName = "BottomNavigationItem";

// Navigation Sheet Component (using Drawer)
interface NavigationSheetProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const NavigationSheet = React.forwardRef<
  React.ElementRef<typeof Drawer>,
  NavigationSheetProps
>(({ children, trigger, title, description, open, onOpenChange }, ref) => {
  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(MOBILE_CLASSES.TOUCH_TARGET, "rounded-full")}
      style={{
        minHeight: `${TOUCH_TARGET.MIN_SIZE}px`,
        minWidth: `${TOUCH_TARGET.MIN_SIZE}px`,
      }}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Open navigation menu</span>
    </Button>
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger || defaultTrigger}</DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        {(title || description) && (
          <DrawerHeader>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </DrawerHeader>
        )}
        <div className="px-6 pb-6">{children}</div>
      </DrawerContent>
    </Drawer>
  );
});
NavigationSheet.displayName = "NavigationSheet";

// Navigation Sheet Item Component
interface NavigationSheetItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  description?: string;
  active?: boolean;
  asChild?: boolean;
}

const NavigationSheetItem = React.forwardRef<
  HTMLButtonElement,
  NavigationSheetItemProps
>(
  (
    {
      className,
      icon: Icon,
      label,
      description,
      active = false,
      disabled,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => buttonRef.current!);

    React.useEffect(() => {
      const element = buttonRef.current;
      if (!element) return;

      // Optimize for mobile touch targets
      const cleanup = optimizeForMobile(element, {
        touchTarget: true,
        preventHover: true,
        minTouchSize: TOUCH_TARGET.MIN_SIZE,
      });

      return cleanup;
    }, []);

    const content = (
      <>
        {Icon && (
          <Icon
            size={20}
            className={cn(
              "flex-shrink-0",
              active ? "text-primary" : "text-muted-foreground"
            )}
          />
        )}
        <div className="flex-1 text-left">
          <div
            className={cn(
              "font-medium",
              active ? "text-primary" : "text-foreground"
            )}
          >
            {label}
          </div>
          {description && (
            <div className="text-sm text-muted-foreground mt-0.5">
              {description}
            </div>
          )}
        </div>
        {children}
      </>
    );

    if (asChild) {
      return <>{content}</>;
    }

    return (
      <button
        ref={buttonRef}
        className={cn(
          // Base layout
          "flex items-center gap-3 w-full rounded-lg transition-colors",
          // Touch target optimization
          MOBILE_CLASSES.TOUCH_TARGET,
          "p-3",
          // States
          active
            ? "bg-primary/10 text-primary"
            : "hover:bg-accent hover:text-accent-foreground",
          disabled && "opacity-50 cursor-not-allowed",
          // Focus styles
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        disabled={disabled}
        aria-current={active ? "page" : undefined}
        style={{
          minHeight: `${TOUCH_TARGET.MIN_SIZE}px`,
        }}
        {...props}
      >
        {content}
      </button>
    );
  }
);
NavigationSheetItem.displayName = "NavigationSheetItem";

// Mobile Header Navigation Component
interface MobileHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

const MobileHeader = React.forwardRef<HTMLElement, MobileHeaderProps>(
  (
    {
      className,
      title,
      leftAction,
      rightAction,
      showBackButton = false,
      onBack,
      children,
      ...props
    },
    ref
  ) => {
    const headerRef = React.useRef<HTMLElement>(null);

    // Combine refs
    React.useImperativeHandle(ref, () => headerRef.current!);

    React.useEffect(() => {
      const element = headerRef.current;
      if (!element) return;

      // Optimize for mobile interactions
      const cleanup = optimizeForMobile(element, {
        touchTarget: false,
        preventHover: true,
        preventZoom: false,
      });

      return cleanup;
    }, []);

    return (
      <header
        ref={headerRef}
        className={cn(
          // Base positioning and layout
          "sticky top-0 z-40 w-full",
          "flex items-center justify-between",
          // Background and styling
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "border-b border-border",
          // Safe area and padding
          MOBILE_CLASSES.SAFE_AREA_TOP,
          "px-4 py-3",
          // Touch optimization
          MOBILE_CLASSES.TOUCH_MANIPULATION,
          className
        )}
        role="banner"
        {...props}
      >
        {/* Left section */}
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className={cn(MOBILE_CLASSES.TOUCH_TARGET, "rounded-full")}
              style={{
                minHeight: `${TOUCH_TARGET.MIN_SIZE}px`,
                minWidth: `${TOUCH_TARGET.MIN_SIZE}px`,
              }}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
          )}
          {leftAction}
        </div>

        {/* Center section */}
        <div className="flex-1 text-center">
          {title && <h1 className="text-lg font-semibold truncate">{title}</h1>}
          {children}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">{rightAction}</div>
      </header>
    );
  }
);
MobileHeader.displayName = "MobileHeader";

export {
  BottomNavigation,
  BottomNavigationItem,
  NavigationSheet,
  NavigationSheetItem,
  MobileHeader,
};
