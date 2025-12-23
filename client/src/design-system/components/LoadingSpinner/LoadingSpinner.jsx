import React from "react";
import { useTheme } from "../../hooks/useTheme.js";

const LoadingSpinner = ({
  size = "md",
  color = "primary",
  className = "",
  ...props
}) => {
  const theme = useTheme();

  const getSpinnerStyles = () => {
    const sizeMap = {
      sm: "16px",
      md: "24px",
      lg: "32px",
      xl: "48px",
    };

    const colorMap = {
      primary: theme.colors.primary[500],
      secondary: theme.colors.neutral[500],
      success: theme.colors.success[500],
      error: theme.colors.error[500],
      warning: theme.colors.warning[500],
    };

    return {
      width: sizeMap[size],
      height: sizeMap[size],
      border: `2px solid ${theme.colors.neutral[200]}`,
      borderTop: `2px solid ${colorMap[color]}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      display: "inline-block",
    };
  };

  // Add keyframes for spinner animation
  React.useEffect(() => {
    const styleSheet = document.styleSheets[0];
    const keyframes = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    // Check if keyframes already exist
    let keyframesExist = false;
    try {
      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        if (styleSheet.cssRules[i].name === "spin") {
          keyframesExist = true;
          break;
        }
      }
    } catch (e) {
      // Ignore errors accessing cssRules
    }

    if (!keyframesExist) {
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
      } catch (e) {
        // Fallback: create a style element
        const style = document.createElement("style");
        style.textContent = keyframes;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <div
      style={getSpinnerStyles()}
      className={className}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
};

export default LoadingSpinner;
