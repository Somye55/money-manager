import React from "react";
import { useTheme } from "../../hooks/useTheme.js";

const Typography = ({
  children,
  variant = "body1",
  color = "foreground",
  align = "left",
  as: Component = "p",
  className = "",
  ...props
}) => {
  const theme = useTheme();

  const getTypographyStyles = () => {
    const baseStyles = {
      margin: 0,
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      textAlign: align,
    };

    // Variant styles
    const variantStyles = {
      h1: {
        fontSize: theme.typography.fontSize["4xl"],
        fontWeight: theme.typography.fontWeight.bold,
        lineHeight: theme.typography.lineHeight.tight,
        letterSpacing: theme.typography.letterSpacing.tight,
      },
      h2: {
        fontSize: theme.typography.fontSize["3xl"],
        fontWeight: theme.typography.fontWeight.bold,
        lineHeight: theme.typography.lineHeight.tight,
        letterSpacing: theme.typography.letterSpacing.tight,
      },
      h3: {
        fontSize: theme.typography.fontSize["2xl"],
        fontWeight: theme.typography.fontWeight.semibold,
        lineHeight: theme.typography.lineHeight.snug,
        letterSpacing: theme.typography.letterSpacing.tight,
      },
      h4: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.semibold,
        lineHeight: theme.typography.lineHeight.snug,
        letterSpacing: theme.typography.letterSpacing.normal,
      },
      body1: {
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.normal,
        lineHeight: theme.typography.lineHeight.normal,
        letterSpacing: theme.typography.letterSpacing.normal,
      },
      body2: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.normal,
        lineHeight: theme.typography.lineHeight.normal,
        letterSpacing: theme.typography.letterSpacing.normal,
      },
      caption: {
        fontSize: theme.typography.fontSize.xs,
        fontWeight: theme.typography.fontWeight.normal,
        lineHeight: theme.typography.lineHeight.snug,
        letterSpacing: theme.typography.letterSpacing.wide,
      },
    };

    // Color styles
    const colorStyles = {
      foreground: { color: theme.colors.textPrimary },
      primary: { color: theme.colors.primary },
      secondary: { color: theme.colors.textSecondary },
      tertiary: { color: theme.colors.textTertiary },
      success: {
        color: theme.colors.success,
      },
      error: { color: theme.colors.error },
    };

    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...colorStyles[color],
    };
  };

  // Map variants to semantic HTML elements
  const getDefaultComponent = (variant) => {
    const componentMap = {
      h1: "h1",
      h2: "h2",
      h3: "h3",
      h4: "h4",
      body1: "p",
      body2: "p",
      caption: "span",
    };
    return componentMap[variant] || "p";
  };

  const FinalComponent =
    Component === "p" ? getDefaultComponent(variant) : Component;

  return (
    <FinalComponent
      style={getTypographyStyles()}
      className={className}
      {...props}
    >
      {children}
    </FinalComponent>
  );
};

export default Typography;
