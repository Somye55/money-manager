import React, { useState } from "react";
import { useTheme, useThemeChangeEvents } from "../hooks/useTheme.js";
import {
  Button,
  Card,
  Input,
  Typography,
  ThemeSettings,
  ThemeToggle,
  ThemeCustomizer,
} from "../components/index.js";

export const ThemeExample = () => {
  const { mode, effectiveMode, colors, isLight, isDark, isSystem } = useTheme();
  const [showCustomizer, setShowCustomizer] = useState(false);
  const lastThemeChange = useThemeChangeEvents();

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <Typography variant="h1">Theme System Demo</Typography>
        <ThemeToggle size="lg" />
      </div>

      {/* Theme Status */}
      <Card variant="outlined" padding="lg" style={{ marginBottom: "2rem" }}>
        <Typography variant="h3" style={{ marginBottom: "1rem" }}>
          Current Theme Status
        </Typography>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <div>
            <Typography variant="body2" color="secondary">
              Mode
            </Typography>
            <Typography variant="h4">{mode}</Typography>
          </div>
          <div>
            <Typography variant="body2" color="secondary">
              Effective Mode
            </Typography>
            <Typography variant="h4">{effectiveMode}</Typography>
          </div>
          <div>
            <Typography variant="body2" color="secondary">
              Primary Color
            </Typography>
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: colors.primary,
                borderRadius: "8px",
                border: "1px solid var(--color-neutral-300)",
              }}
            />
          </div>
        </div>

        {lastThemeChange && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              backgroundColor: "var(--color-neutral-50)",
              borderRadius: "8px",
              border: "1px solid var(--color-neutral-200)",
            }}
          >
            <Typography variant="caption" color="secondary">
              Last change:{" "}
              {new Date(lastThemeChange.timestamp).toLocaleString()}(
              {lastThemeChange.source})
            </Typography>
          </div>
        )}
      </Card>

      {/* Component Showcase */}
      <Card variant="outlined" padding="lg" style={{ marginBottom: "2rem" }}>
        <Typography variant="h3" style={{ marginBottom: "1rem" }}>
          Component Showcase
        </Typography>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>

          <Input
            label="Sample Input"
            placeholder="Type something..."
            fullWidth
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
            }}
          >
            <Card variant="default" padding="md">
              <Typography variant="h4">Default Card</Typography>
              <Typography variant="body2" color="secondary">
                With some content
              </Typography>
            </Card>
            <Card variant="elevated" padding="md">
              <Typography variant="h4">Elevated Card</Typography>
              <Typography variant="body2" color="secondary">
                With shadow
              </Typography>
            </Card>
            <Card variant="outlined" padding="md">
              <Typography variant="h4">Outlined Card</Typography>
              <Typography variant="body2" color="secondary">
                With border
              </Typography>
            </Card>
          </div>
        </div>
      </Card>

      {/* Theme Controls */}
      <Card variant="outlined" padding="lg" style={{ marginBottom: "2rem" }}>
        <Typography variant="h3" style={{ marginBottom: "1rem" }}>
          Theme Controls
        </Typography>
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCustomizer(true)}
          >
            Open Theme Customizer
          </Button>
        </div>
        <ThemeSettings />
      </Card>

      {/* Typography Scale */}
      <Card variant="outlined" padding="lg">
        <Typography variant="h3" style={{ marginBottom: "1rem" }}>
          Typography Scale
        </Typography>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <Typography variant="h1">Heading 1 - Main Title</Typography>
          <Typography variant="h2">Heading 2 - Section Title</Typography>
          <Typography variant="h3">Heading 3 - Subsection</Typography>
          <Typography variant="h4">Heading 4 - Component Title</Typography>
          <Typography variant="body1">Body 1 - Primary text content</Typography>
          <Typography variant="body2" color="secondary">
            Body 2 - Secondary text content
          </Typography>
          <Typography variant="caption" color="tertiary">
            Caption - Small text and labels
          </Typography>
        </div>
      </Card>

      <ThemeCustomizer
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
      />
    </div>
  );
};
