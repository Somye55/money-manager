import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { X, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-20 left-0 right-0 z-[100] w-full px-3 pointer-events-none",
      className
    )}
    style={{ display: "flex", flexDirection: "column-reverse" }}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const Toast = React.forwardRef(
  (
    {
      className,
      variant,
      index = 0,
      liftHeight = 0,
      scale = 1,
      opacity = 1,
      onHeightChange,
      ...props
    },
    ref
  ) => {
    const [isExiting, setIsExiting] = React.useState(false);
    const toastRef = React.useRef(null);
    const [mounted, setMounted] = React.useState(false);

    // Combine refs
    React.useImperativeHandle(ref, () => toastRef.current);

    // Track mounting
    React.useEffect(() => {
      setMounted(true);
    }, []);

    // Track exiting state
    React.useEffect(() => {
      if (props.open === false) {
        setIsExiting(true);
      } else {
        setIsExiting(false);
      }
    }, [props.open]);

    // Measure height and report to parent
    React.useEffect(() => {
      if (!toastRef.current || !mounted || isExiting) {
        return;
      }

      const toastNode = toastRef.current;

      // Use requestAnimationFrame to ensure DOM is ready
      const measureHeight = () => {
        if (!toastNode) return;

        const computedStyle = getComputedStyle(toastNode);
        const marginTop = parseFloat(computedStyle.marginTop) || 0;
        const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
        const rect = toastNode.getBoundingClientRect();
        const newHeight = rect.height + marginTop + marginBottom;

        if (newHeight > 0 && onHeightChange) {
          onHeightChange(newHeight);
        }
      };

      const rafId = requestAnimationFrame(measureHeight);

      return () => {
        cancelAnimationFrame(rafId);
      };
    }, [mounted, isExiting, onHeightChange]);

    return (
      <ToastPrimitives.Root
        ref={toastRef}
        data-toast-exiting={isExiting}
        data-toast-placement="bottom-center"
        style={{
          transform: `translateY(-${liftHeight}px) scale(${scale})`,
          opacity: opacity,
          transformOrigin: "bottom center",
          transition:
            "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
          zIndex: 100 - index,
        }}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-xl px-3 py-2.5 shadow-lg backdrop-blur-md will-change-transform transform-gpu",
          "data-[swipe=cancel]:translate-y-0",
          "data-[swipe=end]:translate-y-[var(--radix-toast-swipe-end-y)]",
          "data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)]",
          "data-[swipe=move]:transition-none",
          "data-[state=open]:animate-toast-in",
          "data-[state=closed]:animate-toast-out",
          "data-[toast-exiting=true]:animate-toast-out",
          "active:scale-[0.98]",
          variant === "success" &&
            "bg-emerald-500/95 dark:bg-emerald-600/95 border border-emerald-400/30 dark:border-emerald-500/30",
          variant === "error" &&
            "bg-rose-500/95 dark:bg-rose-600/95 border border-rose-400/30 dark:border-rose-500/30",
          className
        )}
        {...props}
      />
    );
  }
);
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-lg border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "rounded-lg p-1.5 opacity-80 transition-all hover:opacity-100 active:scale-95 focus:opacity-100 focus:outline-none min-w-[32px] min-h-[32px] flex items-center justify-center bg-white/15 hover:bg-white/25",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4 text-white" strokeWidth={2.5} />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold text-white leading-tight", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-xs text-white/85 mt-0.5 leading-snug", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
