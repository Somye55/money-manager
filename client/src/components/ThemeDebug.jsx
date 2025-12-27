import React from "react";
import { useTheme } from "@/lib/theme-provider";

const ThemeDebug = () => {
  const { theme } = useTheme();

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
      <p>Mode: {theme}</p>
      <p>Available themes: light, dark, system</p>
    </div>
  );
};

export default ThemeDebug;
