import React from "react";
import { useTheme } from "next-themes";

const ThemeDebug = () => {
  const { theme, resolvedTheme } = useTheme();

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
      <p>Theme: {theme || "undefined"}</p>
      <p>Resolved: {resolvedTheme || "undefined"}</p>
    </div>
  );
};

export default ThemeDebug;
