import React from "react";
import { useTheme } from "../design-system";

const ThemeDebug = () => {
  const theme = useTheme();

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
        maxWidth: "300px",
        maxHeight: "200px",
        overflow: "auto",
      }}
    >
      <h4>Theme Debug</h4>
      <p>Mode: {theme.mode}</p>
      <p>Effective: {theme.effectiveMode}</p>
      <p>Primary: {theme.colors?.primary || "undefined"}</p>
      <p>Background: {theme.colors?.background || "undefined"}</p>
      <p>Text Primary: {theme.colors?.textPrimary || "undefined"}</p>
      <p>Tokens loaded: {theme.tokens ? "Yes" : "No"}</p>
      {!theme.colors?.primary && (
        <p style={{ color: "red" }}>⚠️ Theme colors not loaded!</p>
      )}
    </div>
  );
};

export default ThemeDebug;
