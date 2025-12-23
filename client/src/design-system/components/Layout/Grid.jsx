import React from "react";
import { useTheme } from "../../hooks/useTheme.js";

const Grid = ({
  children,
  columns = 1,
  gap = "md",
  minItemWidth,
  className = "",
  ...props
}) => {
  const theme = useTheme();

  const getGridStyles = () => {
    const baseStyles = {
      display: "grid",
    };

    // Gap styles
    const gapValue = theme.spacing[gap] || gap;
    const gapStyles = {
      gap: gapValue,
    };

    // Column styles
    let gridTemplateColumns;
    if (minItemWidth) {
      // Responsive grid with minimum item width
      gridTemplateColumns = `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`;
    } else if (typeof columns === "number") {
      // Fixed number of columns
      gridTemplateColumns = `repeat(${columns}, 1fr)`;
    } else {
      // Custom grid template
      gridTemplateColumns = columns;
    }

    return {
      ...baseStyles,
      ...gapStyles,
      gridTemplateColumns,
    };
  };

  return (
    <div style={getGridStyles()} className={className} {...props}>
      {children}
    </div>
  );
};

export default Grid;
