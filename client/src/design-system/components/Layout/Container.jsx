import React from "react";
import { useTheme } from "../../hooks/useTheme.js";
import { useResponsive } from "../../hooks/useResponsive.js";

const Container = ({
  children,
  maxWidth = "lg",
  padding = true,
  className = "",
  responsive = true,
  ...props
}) => {
  const theme = useTheme();
  const { currentBreakpoint, getResponsiveSpacing } = useResponsive();

  const getContainerStyles = () => {
    const baseStyles = {
      width: "100%",
      marginLeft: "auto",
      marginRight: "auto",
    };

    // Max width variants with responsive behavior
    const maxWidthStyles = {
      sm: { maxWidth: "640px" },
      md: { maxWidth: "768px" },
      lg: { maxWidth: "1024px" },
      xl: { maxWidth: "1280px" },
      "2xl": { maxWidth: "1536px" },
      full: { maxWidth: "100%" },
    };

    // Responsive padding based on screen size
    let paddingStyles = {};
    if (padding) {
      if (responsive) {
        // Use responsive spacing based on current breakpoint
        const responsiveSpacing = getResponsiveSpacing("container");
        paddingStyles = {
          paddingLeft: responsiveSpacing,
          paddingRight: responsiveSpacing,
        };
      } else {
        // Use fixed mobile spacing
        paddingStyles = {
          paddingLeft: theme.mobile.spacing.screenPadding.sm,
          paddingRight: theme.mobile.spacing.screenPadding.sm,
        };
      }
    }

    // Mobile-specific adjustments
    const mobileStyles =
      currentBreakpoint === "xs"
        ? {
            // Ensure minimum padding on very small screens
            paddingLeft:
              Math.max(
                parseInt(paddingStyles.paddingLeft || "0px"),
                parseInt(theme.mobile.spacing.screenPadding.xs)
              ) + "px",
            paddingRight:
              Math.max(
                parseInt(paddingStyles.paddingRight || "0px"),
                parseInt(theme.mobile.spacing.screenPadding.xs)
              ) + "px",
          }
        : {};

    return {
      ...baseStyles,
      ...maxWidthStyles[maxWidth],
      ...paddingStyles,
      ...mobileStyles,
    };
  };

  return (
    <div style={getContainerStyles()} className={className} {...props}>
      {children}
    </div>
  );
};

export default Container;
