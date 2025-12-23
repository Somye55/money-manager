import React from "react";
import { useTheme } from "../../hooks/useTheme.js";
import { useResponsive } from "../../hooks/useResponsive.js";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
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

  const getButtonStyles = () => {
    const baseStyles = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      fontWeight: theme.typography.fontWeight.medium,
      borderRadius: theme.radii.md,
      border: "none",
      cursor: disabled || loading ? "not-allowed" : "pointer",
      transition: "all 0.2s ease-in-out",
      textDecoration: "none",
      outline: "none",
      position: "relative",
      width: fullWidth ? "100%" : "auto",
      opacity: disabled ? 0.6 : loading ? 0.8 : 1,
      // Ensure touch targets are accessible
      minHeight: theme.mobile.touchTarget.min,
      WebkitTapHighlightColor: "transparent", // Remove iOS tap highlight
      // Loading state styles
      pointerEvents: disabled || loading ? "none" : "auto",
    };

    // Size variants with mobile-first approach
    const sizeStyles = {
      sm: {
        padding: isMobile
          ? `${theme.spacing[2]} ${theme.spacing[4]}`
          : `${theme.spacing[2]} ${theme.spacing[3]}`,
        fontSize: theme.typography.fontSize.sm,
        lineHeight: theme.typography.lineHeight.tight,
        minHeight: theme.mobile.touchTarget.min,
      },
      md: {
        padding: isMobile
          ? `${theme.spacing[3]} ${theme.spacing[5]}`
          : `${theme.spacing[3]} ${theme.spacing[4]}`,
        fontSize: theme.typography.fontSize.base,
        lineHeight: theme.typography.lineHeight.normal,
        minHeight:
          mobileOptimized && isMobile
            ? theme.mobile.touchTarget.comfortable
            : theme.mobile.touchTarget.min,
      },
      lg: {
        padding: isMobile
          ? `${theme.spacing[4]} ${theme.spacing[6]}`
          : `${theme.spacing[4]} ${theme.spacing[6]}`,
        fontSize: theme.typography.fontSize.lg,
        lineHeight: theme.typography.lineHeight.normal,
        minHeight: theme.mobile.touchTarget.large,
      },
    };

    // Variant styles with consistent state handling
    const variantStyles = {
      primary: {
        backgroundColor: disabled
          ? theme.colors.primaryDisabled
          : theme.colors.primary,
        color: theme.colors.textInverse,
        boxShadow: disabled ? "none" : theme.shadows.sm,
      },
      secondary: {
        backgroundColor: disabled
          ? theme.colors.backgroundSecondary
          : theme.colors.surface,
        color: disabled ? theme.colors.textDisabled : theme.colors.textPrimary,
        border: `1px solid ${
          disabled ? theme.colors.border : theme.colors.border
        }`,
        boxShadow: disabled ? "none" : theme.shadows.sm,
      },
      outline: {
        backgroundColor: "transparent",
        color: disabled ? theme.colors.textDisabled : theme.colors.primary,
        border: `1px solid ${
          disabled ? theme.colors.border : theme.colors.primary
        }`,
      },
      ghost: {
        backgroundColor: "transparent",
        color: disabled ? theme.colors.textDisabled : theme.colors.textPrimary,
      },
    };

    // Mobile-specific adjustments
    const mobileStyles =
      isMobile && mobileOptimized
        ? {
            // Increase touch target on mobile
            minHeight: theme.mobile.touchTarget.comfortable,
            // Add more padding for easier tapping
            padding:
              size === "sm"
                ? `${theme.spacing[3]} ${theme.spacing[4]}`
                : size === "lg"
                ? `${theme.spacing[4]} ${theme.spacing[6]}`
                : `${theme.spacing[3]} ${theme.spacing[5]}`,
            // Slightly larger font on mobile for better readability
            fontSize:
              size === "sm"
                ? theme.typography.fontSize.base
                : size === "lg"
                ? theme.typography.fontSize.xl
                : theme.typography.fontSize.lg,
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
    const styles = getButtonStyles();
    const minHeight = parseInt(styles.minHeight);
    if (!isTouchTargetCompliant(minHeight)) {
      console.warn(
        `Button touch target (${minHeight}px) is below the recommended minimum (${theme.mobile.touchTarget.min})`
      );
    }
  }

  return (
    <button
      type={type}
      style={getButtonStyles()}
      onClick={handleClick}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading && (
        <span
          style={{
            marginRight: theme.spacing[2],
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          ⏳
        </span>
      )}
      <span style={{ opacity: loading ? 0.7 : 1 }}>{children}</span>
    </button>
  );
};

export default Button;
