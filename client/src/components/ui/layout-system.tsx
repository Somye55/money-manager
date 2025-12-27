/**
 * Modern Layout System Components
 * Provides responsive grid system, consistent page layouts, and reusable layout patterns
 */

import React from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// RESPONSIVE GRID SYSTEM
// ============================================================================

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 6 | 12;
  };
  children: React.ReactNode;
}

export function Grid({
  cols = 1,
  gap = "md",
  responsive,
  className,
  children,
  ...props
}: GridProps) {
  const gapClasses = {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    6: "grid-cols-6",
    12: "grid-cols-12",
  };

  const responsiveClasses = responsive
    ? [
        responsive.sm && `sm:${colClasses[responsive.sm]}`,
        responsive.md && `md:${colClasses[responsive.md]}`,
        responsive.lg && `lg:${colClasses[responsive.lg]}`,
        responsive.xl && `xl:${colClasses[responsive.xl]}`,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <div
      className={cn(
        "grid",
        colClasses[cols],
        gapClasses[gap],
        responsiveClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
  children: React.ReactNode;
}

export function GridItem({
  span = 1,
  responsive,
  className,
  children,
  ...props
}: GridItemProps) {
  const spanClasses = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    7: "col-span-7",
    8: "col-span-8",
    9: "col-span-9",
    10: "col-span-10",
    11: "col-span-11",
    12: "col-span-12",
  };

  const responsiveClasses = responsive
    ? [
        responsive.sm && `sm:${spanClasses[responsive.sm]}`,
        responsive.md && `md:${spanClasses[responsive.md]}`,
        responsive.lg && `lg:${spanClasses[responsive.lg]}`,
        responsive.xl && `xl:${spanClasses[responsive.xl]}`,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  return (
    <div
      className={cn(spanClasses[span], responsiveClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// CONTAINER SYSTEM
// ============================================================================

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Container({
  size = "lg",
  padding = "md",
  className,
  children,
  ...props
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "px-3",
    md: "px-4",
    lg: "px-6",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full",
        sizeClasses[size],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// SAFE AREA LAYOUTS
// ============================================================================

interface SafeAreaLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  children: React.ReactNode;
}

export function SafeAreaLayout({
  top = true,
  bottom = true,
  left = true,
  right = true,
  className,
  children,
  ...props
}: SafeAreaLayoutProps) {
  return (
    <div
      className={cn(
        "w-full h-full",
        top && "pt-safe-top",
        bottom && "pb-safe-bottom",
        left && "pl-safe-left",
        right && "pr-safe-right",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// PAGE LAYOUTS
// ============================================================================

interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "centered" | "sidebar" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  safeArea?: boolean;
  children: React.ReactNode;
}

export function PageLayout({
  variant = "default",
  padding = "md",
  spacing = "md",
  safeArea = true,
  className,
  children,
  ...props
}: PageLayoutProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const spacingClasses = {
    none: "space-y-0",
    sm: "space-y-3",
    md: "space-y-6",
    lg: "space-y-8",
    xl: "space-y-12",
  };

  const variantClasses = {
    default: "w-full",
    centered: "w-full max-w-md mx-auto",
    sidebar: "w-full max-w-6xl mx-auto",
    full: "w-full h-full",
  };

  const baseClasses = cn(
    "min-h-screen",
    safeArea && "safe-area-top safe-area-bottom safe-area-left safe-area-right",
    paddingClasses[padding],
    spacingClasses[spacing],
    variantClasses[variant],
    className
  );

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}

// ============================================================================
// SECTION LAYOUTS
// ============================================================================

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export function Section({
  spacing = "md",
  className,
  children,
  ...props
}: SectionProps) {
  const spacingClasses = {
    none: "space-y-0",
    sm: "space-y-3",
    md: "space-y-6",
    lg: "space-y-8",
    xl: "space-y-12",
  };

  return (
    <section className={cn(spacingClasses[spacing], className)} {...props}>
      {children}
    </section>
  );
}

// ============================================================================
// STACK LAYOUTS
// ============================================================================

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "vertical" | "horizontal";
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  children: React.ReactNode;
}

export function Stack({
  direction = "vertical",
  spacing = "md",
  align = "stretch",
  justify = "start",
  wrap = false,
  className,
  children,
  ...props
}: StackProps) {
  const spacingClasses = {
    vertical: {
      none: "space-y-0",
      xs: "space-y-1",
      sm: "space-y-2",
      md: "space-y-4",
      lg: "space-y-6",
      xl: "space-y-8",
    },
    horizontal: {
      none: "space-x-0",
      xs: "space-x-1",
      sm: "space-x-2",
      md: "space-x-4",
      lg: "space-x-6",
      xl: "space-x-8",
    },
  };

  const alignClasses = {
    start: direction === "vertical" ? "items-start" : "items-start",
    center: "items-center",
    end: direction === "vertical" ? "items-end" : "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const directionClass = direction === "vertical" ? "flex-col" : "flex-row";

  return (
    <div
      className={cn(
        "flex",
        directionClass,
        spacingClasses[direction][spacing],
        alignClasses[align],
        justifyClasses[justify],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// CARD LAYOUTS
// ============================================================================

interface CardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "filled";
  padding?: "none" | "sm" | "md" | "lg";
  spacing?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
  children: React.ReactNode;
}

export function CardLayout({
  variant = "default",
  padding = "md",
  spacing = "md",
  interactive = false,
  className,
  children,
  ...props
}: CardLayoutProps) {
  const variantClasses = {
    default: "bg-card border border-border",
    elevated: "bg-card shadow-lg border-0",
    outlined: "bg-transparent border-2 border-border",
    filled: "bg-muted border-0",
  };

  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const spacingClasses = {
    none: "space-y-0",
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6",
  };

  return (
    <div
      className={cn(
        "rounded-lg transition-all duration-200",
        variantClasses[variant],
        paddingClasses[padding],
        spacingClasses[spacing],
        interactive && "hover:shadow-md cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// RESPONSIVE BREAKPOINT UTILITIES
// ============================================================================

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = React.useState<
    keyof typeof breakpoints | "xs"
  >("xs");

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1536) setCurrentBreakpoint("2xl");
      else if (width >= 1280) setCurrentBreakpoint("xl");
      else if (width >= 1024) setCurrentBreakpoint("lg");
      else if (width >= 768) setCurrentBreakpoint("md");
      else if (width >= 640) setCurrentBreakpoint("sm");
      else setCurrentBreakpoint("xs");
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return currentBreakpoint;
}

// ============================================================================
// LAYOUT UTILITIES
// ============================================================================

interface SpacerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export function Spacer({ size = "md" }: SpacerProps) {
  const sizeClasses = {
    xs: "h-2",
    sm: "h-4",
    md: "h-6",
    lg: "h-8",
    xl: "h-12",
    "2xl": "h-16",
  };

  return <div className={sizeClasses[size]} />;
}

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  spacing?: "none" | "sm" | "md" | "lg";
}

export function Divider({
  orientation = "horizontal",
  spacing = "md",
  className,
  ...props
}: DividerProps) {
  const spacingClasses = {
    horizontal: {
      none: "",
      sm: "my-2",
      md: "my-4",
      lg: "my-6",
    },
    vertical: {
      none: "",
      sm: "mx-2",
      md: "mx-4",
      lg: "mx-6",
    },
  };

  const orientationClasses = {
    horizontal: "w-full h-px",
    vertical: "h-full w-px",
  };

  return (
    <div
      className={cn(
        "bg-border",
        orientationClasses[orientation],
        spacingClasses[orientation][spacing],
        className
      )}
      {...props}
    />
  );
}

// ============================================================================
// LAYOUT COMPOSITION HELPERS
// ============================================================================

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  wrap?: boolean;
  children: React.ReactNode;
}

export function Flex({
  direction = "row",
  align = "stretch",
  justify = "start",
  gap = "none",
  wrap = false,
  className,
  children,
  ...props
}: FlexProps) {
  const gapClasses = {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  return (
    <div
      className={cn(
        "flex",
        direction === "col" ? "flex-col" : "flex-row",
        alignClasses[align],
        justifyClasses[justify],
        gapClasses[gap],
        wrap && "flex-wrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// MOBILE-FIRST LAYOUT PATTERNS
// ============================================================================

interface MobileLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  navigation?: React.ReactNode;
  children: React.ReactNode;
}

export function MobileLayout({
  header,
  footer,
  navigation,
  className,
  children,
  ...props
}: MobileLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex flex-col safe-area-top safe-area-bottom safe-area-left safe-area-right",
        className
      )}
      {...props}
    >
      {header && (
        <header className="flex-shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {header}
        </header>
      )}

      <main className="flex-1 overflow-auto">{children}</main>

      {navigation && (
        <nav className="flex-shrink-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {navigation}
        </nav>
      )}

      {footer && (
        <footer className="flex-shrink-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {footer}
        </footer>
      )}
    </div>
  );
}
