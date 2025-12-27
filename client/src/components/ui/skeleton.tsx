import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "text" | "circular" | "rectangular";
  animation?: "pulse" | "wave" | "none";
}

function Skeleton({
  className,
  variant = "default",
  animation = "pulse",
  ...props
}: SkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "text":
        return "h-4 rounded";
      case "circular":
        return "rounded-full aspect-square";
      case "rectangular":
        return "rounded-lg";
      default:
        return "rounded-md";
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case "wave":
        return "animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%]";
      case "none":
        return "bg-muted";
      default:
        return "animate-pulse bg-muted";
    }
  };

  return (
    <div
      className={cn(getVariantClasses(), getAnimationClasses(), className)}
      {...props}
    />
  );
}

// Skeleton group for multiple related skeletons
interface SkeletonGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
}

function SkeletonGroup({
  children,
  className,
  stagger = false,
}: SkeletonGroupProps) {
  return (
    <div className={cn("space-y-2", stagger && "animate-stagger", className)}>
      {children}
    </div>
  );
}

// Pre-built skeleton patterns
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 space-y-3 bg-card rounded-xl border", className)}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex items-center space-x-2">
        <Skeleton variant="circular" className="w-8 h-8" />
        <Skeleton className="h-3 flex-1" />
      </div>
    </div>
  );
}

function SkeletonList({
  items = 3,
  className,
}: {
  items?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton variant="circular" className="w-10 h-10" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

function SkeletonTable({
  rows = 5,
  cols = 4,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex space-x-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-3">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export { Skeleton, SkeletonGroup, SkeletonCard, SkeletonList, SkeletonTable };
