import React from "react";
import { useTheme } from "../../hooks/useTheme.js";

const Stack = ({
  children,
  spacing = "md",
  direction = "column",
  align = "stretch",
  justify = "flex-start",
  wrap = false,
  className = "",
  ...props
}) => {
  const theme = useTheme();

  const getStackStyles = () => {
    const baseStyles = {
      display: "flex",
      flexDirection: direction,
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap ? "wrap" : "nowrap",
    };

    // Spacing styles
    const spacingValue = theme.spacing[spacing] || spacing;
    const spacingStyles =
      direction === "column"
        ? {
            gap: spacingValue,
          }
        : {
            gap: spacingValue,
          };

    return {
      ...baseStyles,
      ...spacingStyles,
    };
  };

  return (
    <div style={getStackStyles()} className={className} {...props}>
      {children}
    </div>
  );
};

export default Stack;
