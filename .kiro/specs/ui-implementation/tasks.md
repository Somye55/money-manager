# Implementation Plan: UI System Standardization

## Overview

This implementation plan focuses on migrating from the current custom design system to a standardized UI system using Tailwind CSS v4 with OKLCH colors, Radix UI components, and CVA for variant management. The application currently has a working design system in `client/src/design-system/` but needs to be aligned with the requirements and design specifications.

## Current State Analysis

**What Exists:**

- Tailwind CSS v4 correctly set up with Vite plugin (`@tailwindcss/vite`)
- Custom design system with Button, Card, Input, Typography, Modal, Navigation components
- Design tokens defined in `design-system/theme/tokens.js`
- ThemeProvider with light/dark mode support using `data-theme` attribute
- Chart.js for data visualization (not Recharts)
- Lucide React v0.556.0 for icons
- Basic `index.css` with only `@import "tailwindcss";`

**What's Missing:**

- CSS variables and OKLCH colors defined in index.css (Tailwind v4 uses `@theme` directive)
- Radix UI component primitives
- CVA (class-variance-authority) for variant management
- Recharts for data visualization
- TikTok Sans font import
- Typography styles (h1-h4) and animations (fadeIn)
- components/ui/ directory structure
- clsx and tailwind-merge utilities
- next-themes for theme management (currently using custom ThemeContext)

## Tasks

- [x] 1. Set up foundation and dependencies

  - Install Radix UI primitives (@radix-ui/react-dialog, @radix-ui/react-select, @radix-ui/react-checkbox, etc.)
  - Install CVA (class-variance-authority) for variant management
  - Install clsx and tailwind-merge for class merging
  - Install Recharts v2.15.2 for data visualization
  - Install next-themes for theme management
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 10.1, 19.1_

- [x] 2. Configure Tailwind v4 with OKLCH colors and CSS variables in index.css

  - Update `client/src/index.css` to define CSS variables using `@theme` directive
  - Define all semantic color variables using OKLCH color space (--color-background, --color-foreground, --color-primary, etc.)
  - Add dark mode color variables using media query or class selector
  - Import TikTok Sans font with proper fallbacks using `@import` or `@font-face`
  - Define custom properties for spacing, radius, shadows using `@theme`
  - Add indigo/purple gradient utilities
  - Define h1-h4 typography styles in base layer
  - Add fadeIn animation keyframes using `@keyframes`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.3, 8.3_

- [x] 3. Create components/ui directory structure

  - Create `client/src/components/ui/` directory
  - Create `client/src/components/ui/utils.ts` with cn() function using clsx and tailwind-merge
  - Create `client/src/components/ui/use-mobile.ts` hook
  - _Requirements: 4.1, 17.1, 17.2_

- [x] 4. Implement Button component with CVA

  - Create `client/src/components/ui/button.tsx` using CVA for variants
  - Support 6 variants: default, destructive, outline, secondary, ghost, link
  - Support 4 sizes: default (h-9), sm (h-8), lg (h-10), icon (size-9)
  - Add hover states, disabled states, and loading states
  - Ensure minimum 44px touch targets
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 13.4_

- [ ]\* 4.1 Write property test for button variant consistency

  - **Property 11: Button variant consistency**
  - **Validates: Requirements 5.1**

- [ ]\* 4.2 Write property test for button size consistency

  - **Property 12: Button size consistency**
  - **Validates: Requirements 5.2**

- [ ]\* 4.3 Write unit tests for button states

  - Test hover, disabled, and loading states
  - _Requirements: 5.3, 5.4, 5.5_

- [x] 5. Implement Input component

  - Create `client/src/components/ui/input.tsx`
  - Use consistent height (h-9, 36px) and background (#f3f3f5)
  - Add focus ring styling (focus-visible:ring-ring/50 focus-visible:ring-[3px])
  - Support error styling with aria-invalid
  - Support icon positioning (absolute left-4 top-1/2 -translate-y-1/2)
  - Add disabled state styling
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]\* 5.1 Write property test for input height consistency

  - **Property 13: Input height consistency**
  - **Validates: Requirements 6.1**

- [ ]\* 5.2 Write property test for input focus ring consistency

  - **Property 14: Input focus ring consistency**
  - **Validates: Requirements 6.2**

- [ ]\* 5.3 Write unit tests for input states

  - Test error, disabled, and icon positioning
  - _Requirements: 6.3, 6.4, 6.5_

- [x] 6. Implement Card component with sections

  - Create `client/src/components/ui/card.tsx`
  - Support CardHeader, CardContent, and CardFooter sections
  - Use bg-card background with border and rounded-xl corners
  - Apply p-6 (24px) padding to content sections
  - Use gap-6 (24px) spacing between sections
  - Support interactive cards with hover states
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]\* 6.1 Write property test for card structure consistency

  - **Property 15: Card structure consistency**
  - **Validates: Requirements 7.1, 7.3**

- [ ]\* 6.2 Write unit tests for card variants

  - Test CardHeader, CardContent, CardFooter rendering
  - Test interactive card behavior
  - _Requirements: 7.1, 7.5_

- [x] 7. Implement Radix UI Dialog/Modal component

  - Create `client/src/components/ui/dialog.tsx` using @radix-ui/react-dialog
  - Style with glassmorphism effect
  - Add proper ARIA attributes
  - Support keyboard navigation (Escape to close)
  - _Requirements: 4.3, 8.1, 15.2, 15.5_

- [x] 8. Implement Radix UI Select component

  - Create `client/src/components/ui/select.tsx` using @radix-ui/react-select
  - Style consistently with Input component
  - Add proper ARIA attributes
  - Support keyboard navigation
  - _Requirements: 4.1, 15.2, 15.5_

- [x] 9. Implement Radix UI Checkbox component

  - Create `client/src/components/ui/checkbox.tsx` using @radix-ui/react-checkbox
  - Ensure minimum 44px touch target
  - Add proper ARIA attributes
  - Style with focus ring
  - _Requirements: 4.1, 13.4, 15.1, 15.2_

- [x] 10. Implement Radix UI Switch component

  - Create `client/src/components/ui/switch.tsx` using @radix-ui/react-switch
  - Ensure minimum 44px touch target
  - Add proper ARIA attributes
  - Style with focus ring
  - _Requirements: 4.1, 13.4, 15.1, 15.2_

- [x] 11. Implement Radix UI Tabs component

  - Create `client/src/components/ui/tabs.tsx` using @radix-ui/react-tabs
  - Style with active/inactive states
  - Add proper ARIA attributes
  - Support keyboard navigation
  - _Requirements: 4.4, 14.4, 15.2, 15.5_

- [x] 12. Implement Radix UI Tooltip component

  - Create `client/src/components/ui/tooltip.tsx` using @radix-ui/react-tooltip
  - Style with consistent background and border
  - Add proper ARIA attributes
  - _Requirements: 4.3, 15.2_

- [x] 13. Implement display components (Alert, Badge, Skeleton, Progress)

  - Create `client/src/components/ui/alert.tsx` for error/success/warning messages
  - Create `client/src/components/ui/badge.tsx` for status indicators
  - Create `client/src/components/ui/skeleton.tsx` for loading states
  - Create `client/src/components/ui/progress.tsx` with gradient styling
  - _Requirements: 4.5, 14.1, 14.5_

- [x] 14. Migrate Dashboard page to use new components

  - Replace custom design system components with new components/ui components
  - Ensure glassmorphism effect on header (backdrop-blur-xl)
  - Verify gradient usage on primary cards (from-indigo-500 to-purple-600)
  - Apply fadeIn animation with staggered delays
  - Ensure page structure: min-h-screen pb-24
  - _Requirements: 8.1, 8.2, 8.3, 11.1, 11.2_

- [x] 15. Migrate AddExpense page to use new components

  - Replace custom design system components with new components/ui components
  - Use new Input component with validation
  - Use new Button component with loading states
  - Use new Card component for form sections
  - Ensure proper form validation patterns
  - _Requirements: 5.5, 6.3, 7.1, 16.1, 16.2_

- [x] 16. Migrate Expenses page to use new components

  - Replace custom design system components with new components/ui components
  - Ensure empty state displays properly
  - Use new Card component for expense items
  - Apply consistent spacing and layout
  - _Requirements: 7.1, 14.3_

- [x] 17. Migrate Settings page to use new components

  - Replace custom design system components with new components/ui components
  - Use new Switch component for toggles
  - Use new Select component for dropdowns
  - Ensure proper form layout
  - _Requirements: 4.1, 4.1_

- [x] 18. Update Navigation component

  - Verify Navigation uses glassmorphism (backdrop-blur-xl)
  - Ensure active tab uses indigo-600 color
  - Verify minimum 44px touch targets
  - Check fixed bottom positioning with z-50
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ]\* 18.1 Write unit test for navigation structure

  - Test that Navigation renders 4 tabs with correct labels
  - Test active tab styling
  - _Requirements: 12.1, 12.3_

- [ ]\* 18.2 Write property test for navigation touch targets

  - **Property 24: Touch target size compliance** (navigation)
  - **Validates: Requirements 12.4**

- [x] 19. Implement Recharts integration

  - Replace Chart.js with Recharts v2.15.2
  - Update Dashboard bar chart to use Recharts Bar component
  - Update Dashboard pie chart to use Recharts Pie component with donut style
  - Style tooltips consistently (white background, border)
  - Use ResponsiveContainer for proper sizing
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]\* 19.1 Write property test for chart styling consistency

  - **Property 22: Bar chart styling consistency**
  - **Validates: Requirements 10.2, 10.3, 10.4, 10.5**

- [ ]\* 19.2 Write unit tests for chart components

  - Test Recharts version
  - Test ResponsiveContainer usage
  - _Requirements: 10.1, 10.5_

- [x] 20. Implement next-themes for dark mode

  - Wrap application with next-themes ThemeProvider
  - Implement theme toggle that applies/removes .dark class
  - Verify dark mode CSS variables work correctly
  - Implement theme persistence to local storage
  - Add system theme detection
  - Replace custom ThemeContext with next-themes
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [ ]\* 20.1 Write unit tests for dark mode

  - Test ThemeProvider setup
  - Test theme toggle functionality
  - Test theme persistence
  - Test system theme detection
  - _Requirements: 19.1, 19.2, 19.4, 19.5_

- [x] 21. Audit and fix accessibility issues

  - Add focus rings to all interactive elements (focus-visible:ring-ring/50)
  - Add ARIA attributes where missing (aria-invalid, aria-label, role)
  - Verify all touch targets are minimum 44px × 44px
  - Add sr-only class for screen reader text on icon-only buttons
  - Test keyboard navigation across all pages
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ]\* 21.1 Write property test for focus ring visibility

  - **Property 26: Focus ring visibility**
  - **Validates: Requirements 15.1**

- [ ]\* 21.2 Write property test for ARIA attribute presence

  - **Property 27: ARIA attribute presence**
  - **Validates: Requirements 15.2**

- [ ]\* 21.3 Write unit tests for accessibility

  - Test keyboard navigation
  - Test ARIA attributes
  - Test screen reader text
  - _Requirements: 15.2, 15.4, 15.5_

- [x] 22. Implement utility functions

  - Verify cn() function in components/ui/utils.ts
  - Verify useMobile hook in components/ui/use-mobile.ts
  - Create currency formatting utility function
  - Create date formatting utility function
  - Create validation utility functions
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ]\* 22.1 Write unit tests for utility functions

  - Test cn() function
  - Test useMobile hook
  - Test currency formatting
  - Test date formatting
  - Test validation functions
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [x] 23. Optimize performance

  - Verify animations use transform and opacity (GPU-accelerated)
  - Add loading="lazy" to off-screen images
  - Ensure empty states use conditional rendering
  - Remove unnecessary will-change usage
  - Measure and document performance metrics
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [ ]\* 23.1 Write property test for GPU-accelerated animations

  - **Property 29: GPU-accelerated animations**
  - **Validates: Requirements 18.1**

- [ ]\* 23.2 Write property test for lazy loading images

  - **Property 30: Lazy loading images**
  - **Validates: Requirements 18.2**

- [ ] 24. Remove old design system

  - Remove `client/src/design-system/` directory after migration is complete
  - Update all imports to use new components/ui components
  - Remove unused dependencies from package.json
  - Clean up any remaining references to old design system
  - Remove `client/src/App.css` if no longer needed
  - _Requirements: All_

- [ ] 25. Create comprehensive documentation

  - Document all component APIs with TypeScript interfaces
  - Create usage examples for each component
  - Document best practices for adding new components
  - Document best practices for modifying styles
  - Create troubleshooting guide for common issues
  - Document common patterns (glassmorphism, gradients, animations)
  - Document Tailwind v4 CSS-based configuration approach
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [ ] 26. Checkpoint - Review and test

  - Run all property-based tests and unit tests
  - Manually test on mobile, tablet, and desktop screen sizes
  - Test keyboard navigation and screen reader compatibility
  - Verify color contrast compliance
  - Ask the user if questions arise

- [ ] 27. Final validation and cleanup
  - Validate all components follow established patterns
  - Remove any unused CSS classes or components
  - Optimize bundle size by tree-shaking unused code
  - Run performance tests and document results
  - Create final documentation and usage guide

## Notes

- Tasks marked with `*` are optional test tasks that can be skipped for faster completion
- Each task references specific requirements for traceability
- The focus is on migrating from the custom design system to the standardized UI system
- Property tests validate universal correctness properties across all components
- Unit tests validate specific examples, edge cases, and component behavior
- Manual testing is required for responsive design and accessibility validation
- The old design system should only be removed after all pages are successfully migrated
- **Tailwind v4 uses CSS-based configuration with `@theme` directive in index.css - no tailwind.config.js needed**
