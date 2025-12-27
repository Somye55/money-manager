/**
 * Drawer Component for Mobile Patterns
 *
 * A mobile-optimized drawer component that slides up from the bottom of the screen.
 * Built on top of Radix UI Dialog primitives with mobile-specific enhancements:
 *
 * Features:
 * - Slides up from bottom with smooth animations
 * - Swipe-to-dismiss gesture support on touch devices
 * - Safe area handling for devices with notches/home indicators
 * - Touch target optimization for mobile interactions
 * - Automatic hover state management for touch devices
 * - Drag handle for visual feedback
 *
 * Usage:
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger asChild>
 *     <Button>Open Drawer</Button>
 *   </DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Title</DrawerTitle>
 *       <DrawerDescription>Description</DrawerDescription>
 *     </DrawerHeader>
 *     <div>Content goes here</div>
 *     <DrawerFooter>
 *       <Button>Action</Button>
 *       <DrawerClose asChild>
 *         <Button variant="outline">Cancel</Button>
 *       </DrawerClose>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 *
 * Requirements satisfied:
 * - 5.1: Bottom sheet navigation patterns
 * - 5.4: Swipe gesture dismissal support
 */

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  isTouchDevice,
  optimizeForMobile,
  TOUCH_TARGET,
} from "@/lib/mobile-utils";

const Drawer = DialogPrimitive.Root;

const DrawerTrigger = DialogPrimitive.Trigger;

const DrawerPortal = DialogPrimitive.Portal;

const DrawerClose = DialogPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean;
  showHandle?: boolean;
  onSwipeDown?: () => void;
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      children,
      showCloseButton = true,
      showHandle = true,
      onSwipeDown,
      ...props
    },
    ref
  ) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [startY, setStartY] = React.useState(0);
    const [currentY, setCurrentY] = React.useState(0);
    const [translateY, setTranslateY] = React.useState(0);

    // Combine refs
    React.useImperativeHandle(ref, () => contentRef.current!);

    // Swipe to dismiss functionality
    React.useEffect(() => {
      const element = contentRef.current;
      if (!element || !isTouchDevice()) return;

      let cleanup: (() => void) | undefined;

      const handleTouchStart = (e: TouchEvent) => {
        setIsDragging(true);
        setStartY(e.touches[0].clientY);
        setCurrentY(e.touches[0].clientY);
        element.style.transition = "none";
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;

        const currentTouchY = e.touches[0].clientY;
        setCurrentY(currentTouchY);

        const deltaY = currentTouchY - startY;

        // Only allow downward swipes (positive deltaY)
        if (deltaY > 0) {
          setTranslateY(deltaY);
          element.style.transform = `translateY(${deltaY}px)`;

          // Add resistance effect - the further you drag, the more resistance
          const resistance = Math.min(deltaY / 200, 0.8);
          element.style.opacity = `${1 - resistance}`;
        }
      };

      const handleTouchEnd = () => {
        if (!isDragging) return;

        setIsDragging(false);
        element.style.transition =
          "transform 0.3s ease-out, opacity 0.3s ease-out";

        const deltaY = currentY - startY;
        const threshold = 100; // Minimum swipe distance to trigger dismiss

        if (deltaY > threshold) {
          // Trigger dismiss
          element.style.transform = "translateY(100%)";
          element.style.opacity = "0";

          // Call onSwipeDown callback or close the drawer
          setTimeout(() => {
            if (onSwipeDown) {
              onSwipeDown();
            } else {
              // Find and trigger the close button
              const closeButton = element.querySelector(
                "[data-radix-collection-item]"
              ) as HTMLElement;
              closeButton?.click();
            }
          }, 300);
        } else {
          // Snap back to original position
          element.style.transform = "translateY(0)";
          element.style.opacity = "1";
          setTranslateY(0);
        }
      };

      // Add touch event listeners
      element.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      element.addEventListener("touchmove", handleTouchMove, { passive: true });
      element.addEventListener("touchend", handleTouchEnd, { passive: true });

      // Optimize for mobile interactions
      cleanup = optimizeForMobile(element, {
        touchTarget: false, // Don't modify the entire drawer
        preventHover: true,
        preventZoom: false,
      });

      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchmove", handleTouchMove);
        element.removeEventListener("touchend", handleTouchEnd);
        cleanup?.();
      };
    }, [isDragging, startY, currentY, onSwipeDown]);

    return (
      <DrawerPortal>
        <DrawerOverlay />
        <DialogPrimitive.Content
          ref={contentRef}
          className={cn(
            // Base positioning and styling
            "fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background p-6 shadow-lg",
            // Mobile-optimized animations - slide up from bottom
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            "duration-300",
            // Mobile optimizations
            "max-h-[85vh] overflow-y-auto",
            // Safe area handling for mobile devices with home indicators
            "pb-safe-bottom",
            // Touch manipulation for better mobile performance
            "touch-manipulation",
            className
          )}
          {...props}
        >
          {/* Drag handle for visual feedback */}
          {showHandle && (
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted-foreground/20" />
          )}

          {children}

          {/* Close button optimized for touch */}
          {showCloseButton && (
            <DialogPrimitive.Close
              className={cn(
                "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                // Touch target optimization
                "min-h-touch min-w-touch flex items-center justify-center"
              )}
              style={{
                minHeight: `${TOUCH_TARGET.MIN_SIZE}px`,
                minWidth: `${TOUCH_TARGET.MIN_SIZE}px`,
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DrawerPortal>
    );
  }
);
DrawerContent.displayName = DialogPrimitive.Content.displayName;

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6",
      // Mobile-optimized button spacing
      "space-y-2 space-y-reverse sm:space-y-0",
      className
    )}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DrawerTitle.displayName = DialogPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerClose,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
