import React from "react";
import { useTheme } from "../../hooks/useTheme.js";

const ValidationMessage = ({
  type = "error",
  message,
  visible = true,
  className = "",
  ...props
}) => {
  const theme = useTheme();

  if (!visible || !message) {
    return null;
  }

  const getMessageStyles = () => {
    const baseStyles = {
      display: "block",
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      lineHeight: theme.typography.lineHeight.normal,
      marginTop: theme.spacing[1],
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      borderRadius: theme.radii.sm,
      border: "1px solid",
    };

    const typeStyles = {
      error: {
        color: theme.colors.error[700],
        backgroundColor: theme.colors.error[50],
        borderColor: theme.colors.error[200],
      },
      warning: {
        color: theme.colors.warning[700],
        backgroundColor: theme.colors.warning[50],
        borderColor: theme.colors.warning[200],
      },
      success: {
        color: theme.colors.success[700],
        backgroundColor: theme.colors.success[50],
        borderColor: theme.colors.success[200],
      },
      info: {
        color: theme.colors.primary[700],
        backgroundColor: theme.colors.primary[50],
        borderColor: theme.colors.primary[200],
      },
    };

    return {
      ...baseStyles,
      ...typeStyles[type],
    };
  };

  const getIconForType = () => {
    const icons = {
      error: "❌",
      warning: "⚠️",
      success: "✅",
      info: "ℹ️",
    };
    return icons[type] || icons.error;
  };

  return (
    <div style={getMessageStyles()} className={className} {...props}>
      <span style={{ marginRight: theme.spacing[2] }}>{getIconForType()}</span>
      {message}
    </div>
  );
};

export default ValidationMessage;
