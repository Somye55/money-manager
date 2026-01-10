import { CheckCircle2, XCircle } from "lucide-react";
import * as React from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";
import { useToast } from "./use-toast";

const TOAST_GAP = 8; // Gap between stacked toasts in pixels

export function Toaster() {
  const { toasts } = useToast();
  const [heights, setHeights] = React.useState([]);

  // Reset heights when toasts change
  React.useEffect(() => {
    setHeights((prev) => {
      const newHeights = [...prev];
      return newHeights.slice(0, toasts.length);
    });
  }, [toasts.length]);

  return (
    <ToastProvider>
      {toasts.map(function (
        { id, title, description, action, variant, ...props },
        index
      ) {
        // For stacking: only lift toasts that are not the first one
        // Calculate offset based on index (simple fixed offset per toast)
        const offset = index * 12; // 12px offset per toast
        const scale = 1 - index * 0.05; // Slight scale reduction
        const opacity = 1 - index * 0.15; // Slight opacity reduction

        return (
          <Toast
            key={id}
            variant={variant}
            index={index}
            liftHeight={offset}
            scale={Math.max(0.9, scale)}
            opacity={Math.max(0.7, opacity)}
            onHeightChange={(height) => {
              setHeights((prev) => {
                const newHeights = [...prev];
                newHeights[index] = height;
                return newHeights;
              });
            }}
            {...props}
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {variant === "success" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                  <CheckCircle2
                    className="h-4 w-4 text-white"
                    strokeWidth={2.5}
                  />
                </div>
              )}
              {variant === "error" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
