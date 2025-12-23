import React from "react";
import { useTheme } from "../../hooks/useTheme.js";

const Card = ({
  children,
  variant = "default",
  padding = "md",
  interactive = false,
  onClick,
  className = "",
  ...props
}) => {
  const theme = useTheme();

  const getCardStyles = () => {
    const baseStyles = {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.lg,
      border: `1px solid ${theme.colors.border}`,
      transition: "all 0.2s ease-in-out",
      cursor: interactive ? "pointer" : "default",
      color: theme.colors.textPrimary,
    };

    // Padding variants
    const paddingStyles = {
      sm: { padding: theme.spacing[3] },
      md: { padding: theme.spacing[4] },
      lg: { padding: theme.spacing[6] },
    };

    // Variant styles
    const variantStyles = {
      default: {
        boxShadow: theme.shadows.sm,
      },
      elevated: {
        boxShadow: theme.shadows.md,
      },
      outlined: {
        boxShadow: "none",
        border: `2px solid ${theme.colors.border}`,
      },
    };

    // Interactive styles
    const interactiveStyles = interactive
      ? {
          ":hover": {
            boxShadow: theme.shadows.lg,
            transform: "translateY(-1px)",
          },
        }
      : {};

    return {
      ...baseStyles,
      ...paddingStyles[padding],
      ...variantStyles[variant],
      ...interactiveStyles,
    };
  };

  const handleClick = (e) => {
    if (interactive && onClick) {
      onClick(e);
    }
  };

  return (
    <div
      style={getCardStyles()}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
