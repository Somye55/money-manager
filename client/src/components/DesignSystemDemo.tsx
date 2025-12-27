/**
 * Design System Demo Component
 *
 * Demonstrates the modern design system foundation in action.
 * This component showcases colors, typography, spacing, shadows, and mobile optimizations.
 */

import React from "react";
import {
  buttonVariants,
  cardVariants,
  textVariants,
  mobileVariants,
  commonStyles,
  designSystem,
} from "../lib/design-system";
import { cn } from "../lib/utils";

export const DesignSystemDemo: React.FC = () => {
  return (
    <div className={cn(commonStyles.page, "space-y-8")}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className={cn(textVariants.display, "text-primary-600")}>
          Modern Design System
        </h1>
        <p className={cn(textVariants.body, "max-w-2xl mx-auto")}>
          Showcasing the new design foundation with modern colors, typography,
          spacing, and mobile optimizations.
        </p>
      </div>

      {/* Color Palette */}
      <div className={cn(cardVariants.default, "p-6")}>
        <h2 className={cn(textVariants.h2, "mb-4")}>Color Palette</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="space-y-2">
            <div className="w-full h-16 bg-primary-500 rounded-lg shadow-primary"></div>
            <p className={cn(textVariants.caption, "text-center")}>Primary</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-16 bg-secondary-500 rounded-lg"></div>
            <p className={cn(textVariants.caption, "text-center")}>Secondary</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-16 bg-success-500 rounded-lg shadow-success"></div>
            <p className={cn(textVariants.caption, "text-center")}>Success</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-16 bg-warning-500 rounded-lg shadow-warning"></div>
            <p className={cn(textVariants.caption, "text-center")}>Warning</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-16 bg-danger-500 rounded-lg shadow-danger"></div>
            <p className={cn(textVariants.caption, "text-center")}>Danger</p>
          </div>
        </div>
      </div>

      {/* Typography Scale */}
      <div className={cn(cardVariants.default, "p-6")}>
        <h2 className={cn(textVariants.h2, "mb-4")}>Typography Scale</h2>
        <div className="space-y-3">
          <div className={cn(textVariants.display)}>Display Text (30px)</div>
          <div className={cn(textVariants.h1)}>Heading 1 (24px)</div>
          <div className={cn(textVariants.h2)}>Heading 2 (20px)</div>
          <div className={cn(textVariants.h3)}>Heading 3 (18px)</div>
          <div className={cn(textVariants.body)}>
            Body Text (16px) - Optimized for mobile readability
          </div>
          <div className={cn(textVariants.caption)}>Caption Text (14px)</div>
          <div className={cn(textVariants.small)}>Small Text (12px)</div>
        </div>
      </div>

      {/* Button Variants */}
      <div className={cn(cardVariants.default, "p-6")}>
        <h2 className={cn(textVariants.h2, "mb-4")}>Button Variants</h2>
        <div className="flex flex-wrap gap-3">
          <button
            className={cn(buttonVariants.primary, mobileVariants.touchTarget)}
          >
            Primary Button
          </button>
          <button
            className={cn(buttonVariants.secondary, mobileVariants.touchTarget)}
          >
            Secondary Button
          </button>
          <button
            className={cn(buttonVariants.outline, mobileVariants.touchTarget)}
          >
            Outline Button
          </button>
          <button
            className={cn(buttonVariants.ghost, mobileVariants.touchTarget)}
          >
            Ghost Button
          </button>
          <button
            className={cn(buttonVariants.danger, mobileVariants.touchTarget)}
          >
            Danger Button
          </button>
        </div>
      </div>

      {/* Card Variants */}
      <div className="space-y-4">
        <h2 className={cn(textVariants.h2)}>Card Variants</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={cn(cardVariants.default, "p-4")}>
            <h3 className={cn(textVariants.h3, "mb-2")}>Default Card</h3>
            <p className={cn(textVariants.body)}>
              Standard card with subtle shadow and border.
            </p>
          </div>
          <div className={cn(cardVariants.elevated, "p-4")}>
            <h3 className={cn(textVariants.h3, "mb-2")}>Elevated Card</h3>
            <p className={cn(textVariants.body)}>
              Card with enhanced shadow on hover.
            </p>
          </div>
          <div className={cn(cardVariants.interactive, "p-4")}>
            <h3 className={cn(textVariants.h3, "mb-2")}>Interactive Card</h3>
            <p className={cn(textVariants.body)}>
              Clickable card with hover effects.
            </p>
          </div>
        </div>
      </div>

      {/* Spacing System */}
      <div className={cn(cardVariants.default, "p-6")}>
        <h2 className={cn(textVariants.h2, "mb-4")}>
          Spacing System (4px base unit)
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-primary-500"></div>
            <span className={cn(textVariants.caption)}>1 = 4px</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-primary-500"></div>
            <span className={cn(textVariants.caption)}>2 = 8px</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-4 h-8 bg-primary-500"></div>
            <span className={cn(textVariants.caption)}>4 = 16px</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-6 h-8 bg-primary-500"></div>
            <span className={cn(textVariants.caption)}>6 = 24px</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary-500"></div>
            <span className={cn(textVariants.caption)}>8 = 32px</span>
          </div>
        </div>
      </div>

      {/* Shadow System */}
      <div className={cn(cardVariants.default, "p-6")}>
        <h2 className={cn(textVariants.h2, "mb-4")}>
          Shadow & Elevation System
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm border">
            <p className={cn(textVariants.caption, "text-center")}>
              Small Shadow
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <p className={cn(textVariants.caption, "text-center")}>
              Medium Shadow
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-lg">
            <p className={cn(textVariants.caption, "text-center")}>
              Large Shadow
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-xl">
            <p className={cn(textVariants.caption, "text-center")}>
              Extra Large Shadow
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Optimizations */}
      <div className={cn(cardVariants.default, "p-6")}>
        <h2 className={cn(textVariants.h2, "mb-4")}>Mobile Optimizations</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "bg-primary-500 text-white rounded-lg flex items-center justify-center",
                mobileVariants.touchTarget
              )}
            >
              44px
            </div>
            <div className="flex-1">
              <p className={cn(textVariants.body)}>Minimum Touch Target</p>
              <p className={cn(textVariants.caption)}>
                All interactive elements are at least 44px × 44px
              </p>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-lg">
            <p className={cn(textVariants.body, "mb-2")}>
              Mobile-First Features:
            </p>
            <ul className={cn(textVariants.caption, "space-y-1 ml-4")}>
              <li>• Touch-optimized interactions</li>
              <li>• Safe area handling for modern devices</li>
              <li>• Prevented zoom on input focus (16px base font)</li>
              <li>• Smooth scrolling with momentum</li>
              <li>• Hardware-accelerated animations</li>
              <li>• Reduced motion support</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Design Tokens Info */}
      <div className={cn(cardVariants.outlined, "p-6 border-primary-200")}>
        <h2 className={cn(textVariants.h2, "mb-4 text-primary-700")}>
          Design System Implementation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className={cn(textVariants.h3, "mb-2")}>What's Included</h3>
            <ul className={cn(textVariants.body, "space-y-1")}>
              <li>✅ Modern color palette with semantic tokens</li>
              <li>✅ Consistent typography scale (mobile-optimized)</li>
              <li>✅ 4px base unit spacing system</li>
              <li>✅ Shadow and elevation system</li>
              <li>✅ Component variants and utilities</li>
              <li>✅ Mobile-first optimizations</li>
              <li>✅ Dark theme support</li>
              <li>✅ Accessibility compliance</li>
            </ul>
          </div>
          <div>
            <h3 className={cn(textVariants.h3, "mb-2")}>Usage</h3>
            <div className="bg-neutral-900 text-neutral-100 p-4 rounded-lg text-sm font-mono">
              <div className="text-green-400">// Import design system</div>
              <div className="text-blue-300">
                import
              </div> {`{ buttonVariants }`}{" "}
              <div className="text-blue-300">from</div>{" "}
              <div className="text-yellow-300">'./design-system'</div>;
              <br />
              <br />
              <div className="text-green-400">// Use component variants</div>
              <div className="text-purple-300">className</div>=
              <div className="text-yellow-300">{`{buttonVariants.primary}`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemDemo;
