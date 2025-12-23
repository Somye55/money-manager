import React from "react";
import { useTheme } from "../../hooks/useTheme.js";
import { useResponsive } from "../../hooks/useResponsive.js";

const Navigation = ({
  children,
  variant = "header",
  position = "static",
  className = "",
  mobileOptimized = true,
  ...props
}) => {
  const theme = useTheme();
  const { isMobile, currentBreakpoint } = useResponsive();

  const getNavigationStyles = () => {
    const baseStyles = {
      display: "flex",
      alignItems: "center",
      width: "100%",
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    };

    // Variant styles
    const variantStyles = {
      header: {
        borderBottom: `1px solid ${theme.colors.border}`,
        padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
        minHeight: theme.mobile.touchTarget.comfortable,
      },
      sidebar: {
        flexDirection: "column",
        alignItems: "stretch",
        borderRight: `1px solid ${theme.colors.border}`,
        padding: theme.spacing[4],
        minWidth: "250px",
      },
      bottomNav: {
        borderTop: `1px solid ${theme.colors.border}`,
        padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
        minHeight: theme.mobile.touchTarget.large,
        justifyContent: "space-around",
      },
    };

    // Position styles
    const positionStyles = {
      static: {},
      sticky: {
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.sticky,
      },
      fixed: {
        position: "fixed",
        zIndex: theme.zIndex.sticky,
      },
    };

    // Mobile-specific styles
    const mobileStyles =
      isMobile && mobileOptimized
        ? {
            ...(variant === "header" && {
              padding: `${theme.spacing[2]} ${theme.mobile.spacing.screenPadding.sm}`,
              paddingTop: `calc(${theme.spacing[2]} + ${theme.mobile.viewport.safeArea.top})`,
              minHeight: theme.mobile.touchTarget.large,
            }),
            ...(variant === "bottomNav" && {
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              padding: `${theme.spacing[2]} ${theme.mobile.spacing.screenPadding.sm}`,
              paddingBottom: `calc(${theme.spacing[2]} + ${theme.mobile.viewport.safeArea.bottom})`,
              minHeight: theme.mobile.touchTarget.large,
              zIndex: theme.zIndex.sticky,
            }),
            ...(variant === "sidebar" && {
              // On mobile, sidebar becomes full-width overlay
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: "100vw",
              maxWidth: "320px",
              zIndex: theme.zIndex.modal,
              paddingTop: `calc(${theme.spacing[4]} + ${theme.mobile.viewport.safeArea.top})`,
              paddingBottom: `calc(${theme.spacing[4]} + ${theme.mobile.viewport.safeArea.bottom})`,
            }),
          }
        : {};

    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...positionStyles[position],
      ...mobileStyles,
    };
  };

  return (
    <nav style={getNavigationStyles()} className={className} {...props}>
      {children}
    </nav>
  );
};

// Navigation Item component for consistent styling
export const NavigationItem = ({
  children,
  active = false,
  disabled = false,
  onClick,
  className = "",
  ...props
}) => {
  const theme = useTheme();
  const { isMobile } = useResponsive();

  const getItemStyles = () => ({
    display: "flex",
    alignItems: "center",
    padding: isMobile
      ? `${theme.spacing[3]} ${theme.spacing[4]}`
      : `${theme.spacing[2]} ${theme.spacing[3]}`,
    borderRadius: theme.radii.md,
    textDecoration: "none",
    color: active ? theme.colors.primary : theme.colors.textPrimary,
    backgroundColor: active ? theme.colors.backgroundSecondary : "transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    minHeight: theme.mobile.touchTarget.min,
    transition: "all 0.2s ease-in-out",
    fontSize: theme.typography.fontSize.base,
    fontWeight: active
      ? theme.typography.fontWeight.medium
      : theme.typography.fontWeight.normal,
    "&:hover": !disabled && {
      backgroundColor: theme.colors.backgroundSecondary,
    },
  });

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      style={getItemStyles()}
      onClick={handleClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

export default Navigation;
