import React, { useState } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import { Button } from "../Button/index.js";
import { Card } from "../Card/index.js";
import { Typography } from "../Typography/index.js";
import { Modal } from "../Modal/index.js";

export const ThemeCustomizer = ({ isOpen, onClose }) => {
  const { mode, setTheme, isLight, isDark, isSystem } = useTheme();
  const [selectedMode, setSelectedMode] = useState(mode);

  const handleApplyTheme = () => {
    setTheme(selectedMode);
    onClose();
  };

  const themeOptions = [
    {
      value: "light",
      label: "Light Theme",
      description: "Clean and bright interface",
      preview: "#ffffff",
    },
    {
      value: "dark",
      label: "Dark Theme",
      description: "Easy on the eyes in low light",
      preview: "#1e293b",
    },
    {
      value: "system",
      label: "System Theme",
      description: "Follows your device settings",
      preview: "linear-gradient(45deg, #ffffff 50%, #1e293b 50%)",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Theme Settings">
      <div style={{ padding: "1rem" }}>
        <Typography variant="body1" style={{ marginBottom: "1.5rem" }}>
          Choose your preferred theme appearance
        </Typography>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {themeOptions.map((option) => (
            <Card
              key={option.value}
              variant={selectedMode === option.value ? "elevated" : "outlined"}
              interactive
              onClick={() => setSelectedMode(option.value)}
              style={{
                cursor: "pointer",
                border:
                  selectedMode === option.value
                    ? "2px solid var(--color-primary)"
                    : undefined,
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "8px",
                    background: option.preview,
                    border: "1px solid var(--color-neutral-200)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <Typography variant="h4" style={{ marginBottom: "0.25rem" }}>
                    {option.label}
                  </Typography>
                  <Typography variant="body2" color="secondary">
                    {option.description}
                  </Typography>
                </div>
                {selectedMode === option.value && (
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ color: "white", fontSize: "12px" }}>✓</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApplyTheme}>
            Apply Theme
          </Button>
        </div>
      </div>
    </Modal>
  );
};
