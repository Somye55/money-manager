import React, { useState } from "react";
import { useTheme, useThemeChangeEvents } from "../../hooks/useTheme.js";
import { Button } from "../Button/index.js";
import { Card } from "../Card/index.js";
import { Typography } from "../Typography/index.js";
import { ThemeCustomizer } from "../ThemeCustomizer/ThemeCustomizer.jsx";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle.jsx";

export const ThemeSettings = () => {
  const { mode, effectiveMode, setTheme, isLight, isDark, isSystem } =
    useTheme();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const lastThemeChange = useThemeChangeEvents();

  const getCurrentThemeDescription = () => {
    if (isSystem) {
      return `System (currently ${effectiveMode})`;
    }
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  };

  const getThemeStatusColor = () => {
    if (isDark) return "var(--color-primary)";
    if (isLight) return "var(--color-warning-500)";
    return "var(--color-secondary)";
  };

  return (
    <div>
      <Card variant="outlined" padding="lg">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <Typography variant="h3">Theme Settings</Typography>
          <ThemeToggle size="md" />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <Typography
            variant="body2"
            color="secondary"
            style={{ marginBottom: "0.5rem" }}
          >
            Current Theme
          </Typography>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: getThemeStatusColor(),
              }}
            />
            <Typography variant="body1">
              {getCurrentThemeDescription()}
            </Typography>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Button
            variant={mode === "light" ? "primary" : "outline"}
            size="sm"
            onClick={() => setTheme("light")}
          >
            ☀️ Light
          </Button>
          <Button
            variant={mode === "dark" ? "primary" : "outline"}
            size="sm"
            onClick={() => setTheme("dark")}
          >
            🌙 Dark
          </Button>
          <Button
            variant={mode === "system" ? "primary" : "outline"}
            size="sm"
            onClick={() => setTheme("system")}
          >
            🔄 System
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCustomizer(true)}
          >
            ⚙️ Customize
          </Button>
        </div>

        {lastThemeChange && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              backgroundColor: "var(--color-neutral-50)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-neutral-200)",
            }}
          >
            <Typography variant="caption" color="secondary">
              Last changed:{" "}
              {new Date(lastThemeChange.timestamp).toLocaleTimeString()}
              {lastThemeChange.source === "system"
                ? " (automatic)"
                : " (manual)"}
            </Typography>
          </div>
        )}
      </Card>

      <ThemeCustomizer
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
      />
    </div>
  );
};
