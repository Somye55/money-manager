/**
 * Mobile-aware layout components for shadcn/ui migration
 * Provides safe area handling, touch target optimization, and hover state management
 *
 * @deprecated Use the new layout system components from ./layout-system.tsx instead
 * This file is kept for backward compatibility
 */

import React from "react";
import { cn } from "@/lib/utils";
import {
  SafeAreaLayout,
  MobileLayout as NewMobileLayout,
} from "./layout-system";

// Safe Area Container - handles device safe areas
interface SafeAreaContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  children: React.ReactNode;
}

export function SafeAreaContainer({
  top = true,
  bottom = true,
  left = true,
  right = true,
  className,
  children,
  ...props
}: SafeAreaContainerProps) {
  // Use the new SafeAreaLayout component
  return (
    <SafeAreaLayout
      top={top}
      bottom={bottom}
      left={left}
      right={right}
      className={className}
      {...props}
    >
      {children}
    </SafeAreaLayout>
  );
}

// Touch Target Wrapper - ensures minimum touch target size
interface TouchTargetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  minSize?: number;
  asChild?: boolean;
}

export function TouchTarget({
  children,
  minSize = 44,
  asChild = false,
  className,
  style,
  ...props
}: TouchTargetProps) {
  const touchStyles = {
    minHeight: `${minSize}px`,
    minWidth: `${minSize}px`,
    ...style,
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cn(children.props.className, className),
      style: { ...touchStyles, ...children.props.style },
      ...props,
    });
  }

  return (
    <div
      className={cn("inline-flex items-center justify-center", className)}
      style={touchStyles}
      {...props}
    >
      {children}
    </div>
  );
}

// Mobile-aware Button wrapper
interface MobileButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  touchOptimized?: boolean;
  preventHoverStick?: boolean;
}

export function MobileButton({
  children,
  touchOptimized = true,
  preventHoverStick = true,
  className,
  style,
  onMouseLeave,
  onTouchEnd,
  ...props
}: MobileButtonProps) {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (preventHoverStick) {
      // Clear any hover states after touch
      setIsPressed(false);
      // Force blur to prevent sticky hover on touch devices
      e.currentTarget.blur();
    }
    onTouchEnd?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPressed(false);
    onMouseLeave?.(e);
  };

  const touchStyles = touchOptimized
    ? {
        minHeight: "44px",
        minWidth: "44px",
        fontSize: "16px", // Prevent iOS zoom
        ...style,
      }
    : style;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center",
        touchOptimized && "min-h-touch min-w-touch",
        preventHoverStick && "touch-manipulation",
        className
      )}
      style={touchStyles}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleTouchEnd}
      data-pressed={isPressed}
      {...props}
    >
      {children}
    </button>
  );
}

// Mobile-aware Input wrapper
interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  preventZoom?: boolean;
  touchOptimized?: boolean;
}

export function MobileInput({
  preventZoom = true,
  touchOptimized = true,
  className,
  style,
  ...props
}: MobileInputProps) {
  const mobileStyles = {
    ...(preventZoom && { fontSize: "16px" }), // Prevent iOS auto-zoom
    ...(touchOptimized && { minHeight: "44px" }),
    ...style,
  };

  return (
    <input
      className={cn(touchOptimized && "min-h-touch", className)}
      style={mobileStyles}
      {...props}
    />
  );
}

// Screen Container - provides consistent mobile layout
interface ScreenContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  safeArea?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function ScreenContainer({
  children,
  safeArea = true,
  padding = "md",
  className,
  ...props
}: ScreenContainerProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={cn(
        "w-full min-h-screen",
        safeArea &&
          "safe-area-top safe-area-bottom safe-area-left safe-area-right",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Mobile Navigation Container - for bottom navigation
interface MobileNavContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  position?: "top" | "bottom";
}

export function MobileNavContainer({
  children,
  position = "bottom",
  className,
  ...props
}: MobileNavContainerProps) {
  return (
    <nav
      className={cn(
        "fixed left-0 right-0 z-50 bg-background border-border",
        position === "bottom"
          ? "bottom-0 border-t pb-safe-bottom"
          : "top-0 border-b pt-safe-top",
        className
      )}
      {...props}
    >
      {children}
    </nav>
  );
}

// Utility hook for detecting touch devices
export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const hasNoHover = window.matchMedia("(hover: none)").matches;

      setIsTouchDevice(hasTouch && (hasCoarsePointer || hasNoHover));
    };

    checkTouchDevice();

    // Listen for changes in media queries
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const noHoverQuery = window.matchMedia("(hover: none)");

    coarsePointerQuery.addEventListener("change", checkTouchDevice);
    noHoverQuery.addEventListener("change", checkTouchDevice);

    return () => {
      coarsePointerQuery.removeEventListener("change", checkTouchDevice);
      noHoverQuery.removeEventListener("change", checkTouchDevice);
    };
  }, []);

  return isTouchDevice;
}

// Utility hook for safe area insets
export function useSafeAreaInsets() {
  const [insets, setInsets] = React.useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  React.useEffect(() => {
    const updateInsets = () => {
      const computedStyle = getComputedStyle(document.documentElement);

      setInsets({
        top: parseInt(computedStyle.getPropertyValue("--safe-area-top") || "0"),
        bottom: parseInt(
          computedStyle.getPropertyValue("--safe-area-bottom") || "0"
        ),
        left: parseInt(
          computedStyle.getPropertyValue("--safe-area-left") || "0"
        ),
        right: parseInt(
          computedStyle.getPropertyValue("--safe-area-right") || "0"
        ),
      });
    };

    updateInsets();

    // Update on resize or orientation change
    window.addEventListener("resize", updateInsets);
    window.addEventListener("orientationchange", updateInsets);

    return () => {
      window.removeEventListener("resize", updateInsets);
      window.removeEventListener("orientationchange", updateInsets);
    };
  }, []);

  return insets;
}
