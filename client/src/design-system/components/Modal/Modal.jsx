import React, { useEffect } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import { useResponsive } from "../../hooks/useResponsive.js";

const Modal = ({
  children,
  isOpen = false,
  onClose,
  variant = "default",
  size = "md",
  className = "",
  mobileVariant = "bottomSheet",
  closeOnBackdrop = true,
  closeOnEscape = true,
  ...props
}) => {
  const theme = useTheme();
  const { isMobile, currentBreakpoint } = useResponsive();

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getBackdropStyles = () => ({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: theme.zIndex.modal,
    display: "flex",
    alignItems:
      isMobile && mobileVariant === "bottomSheet" ? "flex-end" : "center",
    justifyContent: "center",
    padding: isMobile ? theme.spacing[2] : theme.spacing[4],
  });

  const getModalStyles = () => {
    const baseStyles = {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.xl,
      boxShadow: theme.shadows.modal,
      border: `1px solid ${theme.colors.border}`,
      position: "relative",
      maxHeight: "90vh",
      overflowY: "auto",
      outline: "none",
    };

    // Size variants
    const sizeStyles = {
      sm: { maxWidth: "400px", width: "100%" },
      md: { maxWidth: "500px", width: "100%" },
      lg: { maxWidth: "700px", width: "100%" },
      xl: { maxWidth: "900px", width: "100%" },
      full: { width: "100%", height: "100%" },
    };

    // Variant styles
    const variantStyles = {
      default: {},
      fullscreen: {
        width: "100vw",
        height: "100vh",
        maxWidth: "none",
        maxHeight: "none",
        borderRadius: "0",
      },
    };

    // Mobile-specific styles
    const mobileStyles = isMobile
      ? {
          ...(mobileVariant === "bottomSheet" && {
            borderRadius: `${theme.radii.xl} ${theme.radii.xl} 0 0`,
            maxHeight: "90vh",
            width: "100%",
            margin: "0",
            // Safe area padding for devices with notches
            paddingBottom: `calc(${theme.spacing[4]} + ${theme.mobile.viewport.safeArea.bottom})`,
          }),
          ...(mobileVariant === "fullscreen" && {
            width: "100vw",
            height: "100vh",
            maxWidth: "none",
            maxHeight: "none",
            borderRadius: "0",
            // Safe area padding
            paddingTop: theme.mobile.viewport.safeArea.top,
            paddingBottom: theme.mobile.viewport.safeArea.bottom,
            paddingLeft: theme.mobile.viewport.safeArea.left,
            paddingRight: theme.mobile.viewport.safeArea.right,
          }),
        }
      : {};

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...mobileStyles,
    };
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      style={getBackdropStyles()}
      onClick={handleBackdropClick}
      className={className}
      {...props}
    >
      <div
        style={getModalStyles()}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
