import React from "react";
import { useTheme } from "../../hooks/useTheme.js";
import { useResponsive } from "../../hooks/useResponsive.js";

const IconButton = ({
  children,
  variant = "ghost",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  mobileOptimized = true,
  ...props
}) => {
  const theme = useTheme();
  const { isMobile, isTouchTargetCompliant } = useResponsive();

  const getIconButtonStyles = () => {
    const baseStyles = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      borderRadius: theme.radii.md,
      border: "none",
      cursor: disabled || loading ? "not-allowed" : "pointer",
      transition: "all 0.2s ease-in-out",
      outline: "none",
      position: "relative",
      opacity: disabled ? 0.6 : 1,
      // Ensure touch targets are accessible
      minHeight: theme.mobile.touchTarget.min,
      minWidth: theme.mobile.touchTarget.min,
      WebkitTapHighlightColor: "transparent", // Remove iOS tap highlight
    };

    // Size variants with mobile-first approach
    const sizeStyles = {
      sm: {
        padding: theme.spacing[2],
        fontSize: theme.typography.fontSize.sm,
        minHeight: theme.mobile.touchTarget.min,
        minWidth: theme.mobile.touchTarget.min,
      },
      md: {
        padding: theme.spacing[3],
        fontSize: theme.typography.fontSize.base,
        minHeight:
          mobileOptimized && isMobile
            ? theme.mobile.touchTarget.comfortable
            : theme.mobile.touchTarget.min,
        minWidth:
          mobileOptimized && isMobile
            ? theme.mobile.touchTarget.comfortable
            : theme.mobile.touchTarget.min,
      },
      lg: {
        padding: theme.spacing[4],
        fontSize: theme.typography.fontSize.lg,
        minHeight: theme.mobile.touchTarget.large,
        minWidth: theme.mobile.touchTarget.large,
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
        color: theme.colors.textInverse,
        boxShadow: theme.shadows.card,
      },
      secondary: {
        backgroundColor: theme.colors.backgroundSecondary,
        color: theme.colors.textPrimary,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.shadows.card,
      },
      outline: {
        backgroundColor: "transparent",
        color: theme.colors.primary,
        border: `1px solid ${theme.colors.border}`,
      },
      ghost: {
        backgroundColor: "transparent",
        color: theme.colors.textSecondary,
      },
      danger: {
        backgroundColor: "transparent",
        color: theme.colors.error,
      },
    };

    // Hover and focus states
    const interactionStyles = {
      ":hover":
        !disabled && !loading
          ? {
              primary: { backgroundColor: theme.colors.primaryHover },
              secondary: { backgroundColor: theme.colors.backgroundTertiary },
              outline: { backgroundColor: theme.colors.backgroundSecondary },
              ghost: { backgroundColor: theme.colors.backgroundSecondary },
              danger: { backgroundColor: theme.colors.errorLight },
            }[variant]
          : {},
    };

    // Mobile-specific adjustments
    const mobileStyles =
      isMobile && mobileOptimized
        ? {
            // Increase touch target on mobile
            minHeight: theme.mobile.touchTarget.comfortable,
            minWidth: theme.mobile.touchTarget.comfortable,
            // Add more padding for easier tapping
            padding:
              size === "sm"
                ? theme.spacing[3]
                : size === "lg"
                ? theme.spacing[5]
                : theme.spacing[4],
          }
        : {};

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...mobileStyles,
    };
  };

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Validate touch target size in development
  if (process.env.NODE_ENV === "development") {
    const styles = getIconButtonStyles();
    const minHeight = parseInt(styles.minHeight);
    if (!isTouchTargetCompliant(minHeight)) {
      console.warn(
        `IconButton touch target (${minHeight}px) is below the recommended minimum (${theme.mobile.touchTarget.min})`
      );
    }
  }

  return (
    <button
      type={type}
      style={getIconButtonStyles()}
      onClick={handleClick}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading ? <span style={{ fontSize: "inherit" }}>⏳</span> : children}
    </button>
  );
};

export default IconButton;
