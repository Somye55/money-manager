import React from "react";
import { useTheme } from "../../hooks/useTheme.js";

const Input = ({
  type = "text",
  label,
  placeholder,
  error,
  disabled = false,
  fullWidth = false,
  value,
  onChange,
  className = "",
  id,
  ...props
}) => {
  const theme = useTheme();
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const getInputStyles = () => {
    return {
      width: fullWidth ? "100%" : "auto",
      padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
      fontSize: theme.typography.fontSize.base,
      lineHeight: theme.typography.lineHeight.normal,
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      backgroundColor: disabled
        ? theme.colors.backgroundSecondary
        : theme.colors.surface,
      border: `1px solid ${
        error
          ? theme.colors.error
          : disabled
          ? theme.colors.border
          : theme.colors.border
      }`,
      borderRadius: theme.radii.md,
      outline: "none",
      transition: "all 0.2s ease-in-out",
      minHeight: theme.mobile.touchTarget.min,
      opacity: disabled ? 0.6 : 1,
      cursor: disabled ? "not-allowed" : "text",
      color: disabled ? theme.colors.textDisabled : theme.colors.textPrimary,
      // Focus states
      ":focus": {
        borderColor: error ? theme.colors.error : theme.colors.borderFocus,
        boxShadow: `0 0 0 3px ${
          error ? `${theme.colors.error}20` : `${theme.colors.primary}20`
        }`,
      },
    };
  };

  const getLabelStyles = () => {
    return {
      display: "block",
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: error ? theme.colors.error : theme.colors.textSecondary,
      marginBottom: theme.spacing[2],
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getErrorStyles = () => {
    return {
      display: "block",
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.error,
      marginTop: theme.spacing[1],
      fontFamily: theme.typography.fontFamily.sans.join(", "),
      lineHeight: theme.typography.lineHeight.normal,
    };
  };

  const getContainerStyles = () => {
    return {
      width: fullWidth ? "100%" : "auto",
    };
  };

  return (
    <div style={getContainerStyles()} className={className}>
      {label && (
        <label htmlFor={inputId} style={getLabelStyles()}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={getInputStyles()}
        {...props}
      />
      {error && <span style={getErrorStyles()}>{error}</span>}
    </div>
  );
};

export default Input;
