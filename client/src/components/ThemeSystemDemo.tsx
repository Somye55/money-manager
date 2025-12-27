/**
 * Theme System Demo Component
 *
 * Comprehensive demonstration of the new theming system with all variants,
 * smooth transitions, and accessibility features.
 */

import React, { useState } from "react";
import { ThemeToggle, useThemeClasses } from "./ui/theme-toggle";
import { useTheme } from "../lib/theme-provider";

const ThemeSystemDemo: React.FC = () => {
  const { config, theme, resolvedTheme } = useTheme();
  const { themeClass, getColor } = useThemeClasses();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen theme-bg-primary theme-text p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="theme-heading text-4xl">Comprehensive Theme System</h1>
          <p className="theme-text--secondary text-lg">
            Modern theming with smooth transitions, accessibility compliance,
            and consistent design
          </p>

          {/* Theme Controls */}
          <div className="flex flex-wrap justify-center gap-4">
            <ThemeToggle variant="button" showLabel />
            <ThemeToggle variant="select" />
            <ThemeToggle variant="segmented" />
          </div>

          {/* Current Theme Info */}
          <div className="theme-card p-4 inline-block">
            <div className="text-sm space-y-1">
              <div>
                Mode: <span className="font-medium">{theme}</span>
              </div>
              <div>
                Resolved: <span className="font-medium">{resolvedTheme}</span>
              </div>
              <div>
                Transitions: <span className="font-medium">Enabled</span>
              </div>
            </div>
          </div>
        </header>

        {/* Button System Demo */}
        <section className="theme-card p-6 space-y-4">
          <h2 className="theme-heading text-2xl">Button System</h2>
          <div className="flex flex-wrap gap-4">
            <button className="theme-button theme-button--primary">
              Primary Button
            </button>
            <button className="theme-button theme-button--secondary">
              Secondary Button
            </button>
            <button className="theme-button theme-button--outline">
              Outline Button
            </button>
            <button className="theme-button theme-button--ghost">
              Ghost Button
            </button>
            <button className="theme-button theme-button--danger">
              Danger Button
            </button>
            <button className="theme-button theme-button--primary" disabled>
              Disabled Button
            </button>
          </div>
        </section>

        {/* Card System Demo */}
        <section className="space-y-4">
          <h2 className="theme-heading text-2xl">Card System</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="theme-card p-4">
              <h3 className="theme-heading text-lg mb-2">Default Card</h3>
              <p className="theme-text--secondary">
                Standard card with subtle elevation and border.
              </p>
            </div>

            <div className="theme-card theme-card--elevated p-4">
              <h3 className="theme-heading text-lg mb-2">Elevated Card</h3>
              <p className="theme-text--secondary">
                Enhanced elevation for important content.
              </p>
            </div>

            <div className="theme-card theme-card--interactive p-4">
              <h3 className="theme-heading text-lg mb-2">Interactive Card</h3>
              <p className="theme-text--secondary">
                Hover and click for smooth interactions.
              </p>
            </div>
          </div>
        </section>

        {/* Form System Demo */}
        <section className="theme-card p-6 space-y-4">
          <h2 className="theme-heading text-2xl">Form System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="theme-form-field">
              <label className="theme-form-label">Default Input</label>
              <input
                type="text"
                className="theme-input"
                placeholder="Enter some text..."
              />
              <div className="theme-form-help">
                This is a helpful description.
              </div>
            </div>

            <div className="theme-form-field">
              <label className="theme-form-label">Error State</label>
              <input
                type="text"
                className="theme-input theme-input--error"
                placeholder="Invalid input"
              />
              <div className="theme-form-error">This field is required.</div>
            </div>

            <div className="theme-form-field">
              <label className="theme-form-label">Success State</label>
              <input
                type="text"
                className="theme-input theme-input--success"
                placeholder="Valid input"
                defaultValue="Great job!"
              />
            </div>

            <div className="theme-form-field">
              <label className="theme-form-label">Disabled Input</label>
              <input
                type="text"
                className="theme-input"
                placeholder="Cannot edit"
                disabled
              />
            </div>
          </div>
        </section>

        {/* Alert System Demo */}
        <section className="space-y-4">
          <h2 className="theme-heading text-2xl">Alert System</h2>
          <div className="space-y-3">
            <div className="theme-alert theme-alert--success">
              <span>✓</span>
              <div>
                <strong>Success!</strong> Your changes have been saved
                successfully.
              </div>
            </div>

            <div className="theme-alert theme-alert--warning">
              <span>⚠</span>
              <div>
                <strong>Warning!</strong> Please review your input before
                proceeding.
              </div>
            </div>

            <div className="theme-alert theme-alert--danger">
              <span>✕</span>
              <div>
                <strong>Error!</strong> Something went wrong. Please try again.
              </div>
            </div>

            <div className="theme-alert theme-alert--info">
              <span>ℹ</span>
              <div>
                <strong>Info:</strong> This feature is currently in beta.
              </div>
            </div>
          </div>
        </section>

        {/* Badge System Demo */}
        <section className="theme-card p-6 space-y-4">
          <h2 className="theme-heading text-2xl">Badge System</h2>
          <div className="flex flex-wrap gap-3">
            <span className="theme-badge theme-badge--primary">Primary</span>
            <span className="theme-badge theme-badge--secondary">
              Secondary
            </span>
            <span className="theme-badge theme-badge--success">Success</span>
            <span className="theme-badge theme-badge--warning">Warning</span>
            <span className="theme-badge theme-badge--danger">Danger</span>
          </div>
        </section>

        {/* Loading States Demo */}
        <section className="theme-card p-6 space-y-4">
          <h2 className="theme-heading text-2xl">Loading States</h2>
          <div className="space-y-4">
            <div>
              <h3 className="theme-heading text-lg mb-2">Skeleton Loading</h3>
              <div className="space-y-2">
                <div className="theme-skeleton h-4 w-3/4"></div>
                <div className="theme-skeleton h-4 w-1/2"></div>
                <div className="theme-skeleton h-4 w-2/3"></div>
              </div>
            </div>

            <div>
              <h3 className="theme-heading text-lg mb-2">Spinner</h3>
              <div className="theme-spinner"></div>
            </div>
          </div>
        </section>

        {/* Typography Demo */}
        <section className="theme-card p-6 space-y-4">
          <h2 className="theme-heading text-2xl">Typography System</h2>
          <div className="space-y-3">
            <h1 className="theme-heading text-4xl">Heading 1 - Display</h1>
            <h2 className="theme-heading text-3xl">Heading 2 - Large</h2>
            <h3 className="theme-heading text-2xl">Heading 3 - Medium</h3>
            <h4 className="theme-heading text-xl">Heading 4 - Small</h4>
            <p className="theme-text text-lg">Large body text for emphasis</p>
            <p className="theme-text">Regular body text for main content</p>
            <p className="theme-text--secondary text-sm">
              Secondary text for descriptions
            </p>
            <p className="theme-text--tertiary text-xs">
              Tertiary text for metadata
            </p>
          </div>
        </section>

        {/* Color System Demo */}
        <section className="theme-card p-6 space-y-4">
          <h2 className="theme-heading text-2xl">Color System</h2>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="theme-button theme-button--outline"
          >
            {showDetails ? "Hide" : "Show"} Color Details
          </button>

          {showDetails && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {Object.entries(config.colors).map(([category, colors]) => (
                <div key={category} className="space-y-2">
                  <h4 className="theme-heading text-sm uppercase tracking-wide">
                    {category}
                  </h4>
                  {typeof colors === "object" && colors !== null && (
                    <div className="space-y-1">
                      {Object.entries(colors).map(([name, value]) => (
                        <div
                          key={name}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: value as string }}
                          />
                          <span className="theme-text--secondary">{name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Accessibility Features */}
        <section className="theme-card p-6 space-y-4">
          <h2 className="theme-heading text-2xl">Accessibility Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="theme-heading text-lg mb-2">Focus Management</h3>
              <div className="space-y-2">
                <button className="theme-button theme-button--primary theme-focus-ring">
                  Focus Ring Example
                </button>
                <input
                  type="text"
                  className="theme-input theme-focus-ring"
                  placeholder="Focus to see ring"
                />
              </div>
            </div>

            <div>
              <h3 className="theme-heading text-lg mb-2">
                Contrast Compliance
              </h3>
              <div className="space-y-2 text-sm">
                <div>✓ WCAG AA compliant contrast ratios</div>
                <div>✓ High contrast mode support</div>
                <div>✓ Reduced motion preferences</div>
                <div>✓ Screen reader friendly</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center theme-text--secondary">
          <p>
            Theme system implementing requirements 8.1-8.5 with modern design
            patterns, smooth transitions, and comprehensive accessibility
            support.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ThemeSystemDemo;
