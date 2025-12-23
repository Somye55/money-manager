import React from "react";
import { useTheme } from "../../hooks/useTheme.js";

const FormField = ({
  children,
  label,
  error,
  required = false,
  disabled = false,
  fullWidth = false,
  className = "",
  id,
  ...props
}) => {
  const theme = useTheme();
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

  const getContainerStyles = () => {
    return {
      width: fullWidth ? "100%" : "auto",
      marginBottom: theme.spacing[4],
    };
  };

  const getLabelStyles = () => {
    return {
      display: "block",
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: error ? theme.colors.error[600] : theme.colors.neutral[700],
      marginBottom: theme.spacing[2],
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getErrorStyles = () => {
    return {
      display: "block",
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.error[600],
      marginTop: theme.spacing[1],
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      lineHeight: theme.typography.lineHeight.normal,
    };
  };

  const getRequiredIndicatorStyles = () => {
    return {
      color: theme.colors.error[500],
      marginLeft: theme.spacing[1],
    };
  };

  return (
    <div style={getContainerStyles()} className={className} {...props}>
      {label && (
        <label htmlFor={fieldId} style={getLabelStyles()}>
          {label}
          {required && <span style={getRequiredIndicatorStyles()}>*</span>}
        </label>
      )}
      {React.cloneElement(children, {
        id: fieldId,
        error: !!error,
        disabled,
        fullWidth,
      })}
      {error && <span style={getErrorStyles()}>{error}</span>}
    </div>
  );
};

export default FormField;
