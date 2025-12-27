# shadcn/ui Migration Design Document

## Overview

This design document outlines the migration strategy for transitioning the Money Manager mobile application from its current custom design system to shadcn/ui. The migration will be executed in phases to minimize disruption while ensuring all components maintain their functionality and improve accessibility, mobile optimization, and maintainability.

The migration leverages shadcn/ui's copy-paste component model built on Radix UI primitives and Tailwind CSS, providing a modern foundation that integrates seamlessly with Capacitor for native mobile experiences.

## Architecture

### Component Architecture

The new architecture will follow shadcn/ui's recommended structure:

```
src/
├── components/
│   └── ui/           # shadcn/ui components
├── lib/
│   └── utils.ts      # shadcn utility functions
├── hooks/            # Custom hooks for mobile behavior
└── styles/
    └── globals.css   # Tailwind base styles and CSS variables
```

### Path Resolution Strategy

- **@/components**: Maps to `src/components` for clean component imports
- **@/lib**: Maps to `src/lib` for utility functions
- **@/hooks**: Maps to `src/hooks` for custom React hooks
- **@/styles**: Maps to `src/styles` for global styles

### Integration Points

1. **Vite Configuration**: Updated to support path aliases and Tailwind processing
2. **Capacitor Integration**: Status bar plugin integration for theme synchronization
3. **Theme System**: CSS variables approach for dynamic theming
4. **Mobile Optimization**: Safe area handling and touch target optimization

## Components and Interfaces

### Core shadcn/ui Components

**Primary Components:**

- `Button`: Replaces custom Button component with variants (default, destructive, outline, secondary, ghost, link)
- `Input`: Replaces custom Input with proper mobile sizing and validation states
- `Dialog`: Replaces custom Modal with proper focus management and accessibility
- `Drawer`: New component for mobile-first bottom sheet interactions
- `Form`: New structured form handling with validation integration
- `Card`: Enhanced card component with consistent spacing and elevation

**Supporting Components:**

- `Label`: Accessible form labels with proper association
- `Badge`: Status indicators and tags
- `Separator`: Visual content separation
- `Skeleton`: Loading state placeholders
- `Toast`: Non-intrusive notifications

### Mobile-Specific Adaptations

**Safe Area Handling:**

```typescript
interface SafeAreaConfig {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}
```

**Touch Target Optimization:**

- Minimum 44px touch targets for all interactive elements
- Increased padding for mobile form inputs
- Optimized spacing for thumb navigation

### Component Migration Mapping

| Current Component | shadcn/ui Replacement | Migration Strategy                                    |
| ----------------- | --------------------- | ----------------------------------------------------- |
| Button            | Button                | Direct replacement with variant mapping               |
| Input             | Input + Label         | Enhanced with proper labeling                         |
| Modal             | Dialog/Drawer         | Context-aware (Dialog for desktop, Drawer for mobile) |
| Card              | Card                  | Enhanced with consistent styling                      |
| FormField         | Form components       | Restructured with validation integration              |
| LoadingSpinner    | Skeleton              | Contextual loading states                             |

## Data Models

### Theme Configuration

```typescript
interface ThemeConfig {
  mode: "light" | "dark" | "system";
  primaryColor: string;
  accentColor: string;
  borderRadius: number;
  fontFamily: string;
}

interface MobileThemeExtensions {
  statusBarStyle: "light" | "dark";
  safeAreaInsets: SafeAreaInsets;
  touchTargetMinSize: number;
}
```

### Component Props Interface

```typescript
interface MobileOptimizedProps {
  touchOptimized?: boolean;
  safeAreaAware?: boolean;
  mobileVariant?: "drawer" | "dialog" | "sheet";
}
```

### Migration State Tracking

```typescript
interface MigrationProgress {
  componentName: string;
  status: "pending" | "in-progress" | "completed" | "tested";
  dependencies: string[];
  mobileOptimizations: string[];
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property Reflection

After analyzing all acceptance criteria, several properties can be consolidated to eliminate redundancy:

- Path resolution properties (1.1, 1.5) can be combined into a single comprehensive import resolution property
- Theme-related properties (4.1, 4.3, 4.5) can be consolidated into a comprehensive theme propagation property
- Form validation properties (7.1, 7.2) can be combined into a single form consistency property
- Touch target properties (3.2, 5.5) can be unified into a comprehensive touch optimization property

### Core Properties

**Property 1: Import Resolution Consistency**
_For any_ valid shadcn/ui component import using @ path aliases, the build system should resolve the import without compilation errors
**Validates: Requirements 1.1, 1.5**

**Property 2: Accessibility Focus Management**
_For any_ interactive shadcn/ui component, keyboard navigation should provide proper focus states and follow logical tab order
**Validates: Requirements 2.1, 2.3**

**Property 3: Form Accessibility Compliance**
_For any_ form input component, proper ARIA labels and validation states should be present and correctly associated
**Validates: Requirements 2.2**

**Property 4: Safe Area Content Protection**
_For any_ screen layout on mobile devices, content should not be positioned behind notches, home indicators, or other safe area exclusions
**Validates: Requirements 3.1**

**Property 5: Touch Target Optimization**
_For any_ interactive element, the touch target should be at least 44px in both width and height for comfortable finger interaction
**Validates: Requirements 3.2, 5.5**

**Property 6: Touch Device Hover State Management**
_For any_ interactive element on touch devices, hover states should not persist after touch interaction
**Validates: Requirements 3.3**

**Property 7: Status Bar Theme Synchronization**
_For any_ theme change, the status bar color should update to match the current theme on mobile devices
**Validates: Requirements 3.4, 4.2**

**Property 8: Theme Variable Propagation**
_For any_ theme change, all CSS variables should update automatically across all shadcn/ui components
**Validates: Requirements 4.1, 4.3, 4.5**

**Property 9: Component API Compatibility**
_For any_ migrated component, existing component APIs should continue to work without breaking changes where possible
**Validates: Requirements 6.1, 6.2**

**Property 10: Form Validation Consistency**
_For any_ form field with validation, error states and validation messages should display consistently with appropriate styling
**Validates: Requirements 7.1, 7.2**

**Property 11: iOS Input Auto-zoom Prevention**
_For any_ input field on iOS devices, the font size should be at least 16px to prevent automatic zoom behavior
**Validates: Requirements 7.3**

**Property 12: Form Focus Flow**
_For any_ form with multiple inputs, keyboard navigation should follow a logical tab order that guides users through the form
**Validates: Requirements 7.5**

**Property 13: Loading State Feedback**
_For any_ form submission or async operation, loading states should provide clear visual feedback during processing
**Validates: Requirements 7.4**

**Property 14: Swipe Gesture Dismissal**
_For any_ sheet or drawer component, swipe down gestures should trigger dismissal behavior
**Validates: Requirements 5.4**

**Property 15: Responsive Dialog Sizing**
_For any_ dialog or modal on small screens, the component should be optimized for mobile viewing with appropriate sizing constraints
**Validates: Requirements 5.2**

**Property 16: Component Variant Support**
_For any_ button or form component, all existing variants and sizes should be supported in the shadcn/ui implementation
**Validates: Requirements 6.2, 6.3**

**Property 17: Responsive Layout Preservation**
_For any_ layout component during migration, responsive behavior should be maintained across different screen sizes
**Validates: Requirements 6.4**

## Error Handling

### Build-Time Error Handling

**Path Resolution Errors:**

- Provide clear error messages when @ imports fail to resolve
- Validate Vite configuration during build process
- Ensure TypeScript path mapping is correctly configured

**Tailwind Compilation Errors:**

- Validate CSS variable definitions in theme configuration
- Provide fallback values for missing CSS custom properties
- Handle missing component dependencies gracefully

### Runtime Error Handling

**Theme System Errors:**

- Graceful fallback to default theme when custom theme fails to load
- Error boundaries around theme-dependent components
- Validation of theme configuration objects

**Mobile Integration Errors:**

- Fallback behavior when Capacitor plugins are unavailable
- Safe area detection fallbacks for unsupported devices
- Status bar plugin error handling with default styling

**Component Migration Errors:**

- Backward compatibility shims for deprecated component APIs
- Clear migration warnings for breaking changes
- Gradual migration support with coexistence of old and new components

### Accessibility Error Handling

**Focus Management Errors:**

- Fallback focus targets when preferred elements are unavailable
- Focus trap recovery mechanisms for modal components
- Keyboard navigation fallbacks for complex interactions

**Screen Reader Errors:**

- Fallback text content when ARIA labels are missing
- Default announcements for state changes
- Graceful degradation when accessibility features fail

## Testing Strategy

### Dual Testing Approach

The migration will employ both unit testing and property-based testing to ensure comprehensive coverage:

**Unit Tests:**

- Verify specific component rendering with various props
- Test integration points between shadcn/ui and existing code
- Validate mobile-specific adaptations and Capacitor integration
- Cover edge cases and error conditions

**Property-Based Tests:**

- Verify universal properties across all component instances
- Test theme consistency across random component combinations
- Validate accessibility properties with generated component trees
- Ensure responsive behavior across random viewport sizes

### Property-Based Testing Configuration

**Testing Library:** We will use `@fast-check/vitest` for property-based testing integration with Vitest, providing seamless integration with our existing test setup.

**Test Configuration:**

- Minimum 100 iterations per property test to ensure thorough coverage
- Each property-based test will include a comment explicitly referencing the design document property
- Test tagging format: `**Feature: shadcn-ui-migration, Property {number}: {property_text}**`

### Testing Categories

**Component Migration Tests:**

- Unit tests for each migrated component ensuring API compatibility
- Property tests verifying consistent behavior across component variants
- Integration tests for component interaction patterns

**Mobile Optimization Tests:**

- Unit tests for safe area handling on specific device configurations
- Property tests for touch target sizing across all interactive elements
- Integration tests for Capacitor plugin functionality

**Accessibility Tests:**

- Unit tests for specific ARIA attribute presence and correctness
- Property tests for keyboard navigation across component trees
- Integration tests for screen reader compatibility

**Theme System Tests:**

- Unit tests for specific theme switching scenarios
- Property tests for CSS variable propagation across component sets
- Integration tests for status bar synchronization

### Test Implementation Requirements

Each correctness property must be implemented by a single property-based test, with tests placed as close to implementation as possible to catch errors early. Property tests will be configured to run a minimum of 100 iterations and will be tagged with explicit references to their corresponding design document properties.

## Implementation Strategy

### Migration Phases

**Phase 1: Foundation Setup**

- Install and configure shadcn/ui with Tailwind CSS
- Set up path aliasing and build configuration
- Establish theme system with CSS variables
- Configure mobile optimizations and safe area handling

**Phase 2: Core Component Migration**

- Migrate Button, Input, and Card components
- Implement Form components with validation
- Add Dialog and Drawer components for mobile patterns
- Establish consistent spacing and typography

**Phase 3: Advanced Components**

- Implement navigation patterns (bottom sheets, drawers)
- Add loading states and skeleton components
- Integrate toast notifications and feedback systems
- Optimize for mobile gestures and interactions

**Phase 4: Integration and Cleanup**

- Remove legacy design system components
- Update all component imports and usage
- Comprehensive testing and accessibility validation
- Performance optimization and bundle size analysis

### Mobile-First Considerations

**Safe Area Integration:**

- Utilize CSS `env()` variables for safe area insets
- Implement safe area aware layout components
- Test across various device configurations and orientations

**Touch Optimization:**

- Ensure minimum 44px touch targets for all interactive elements
- Optimize spacing for thumb navigation patterns
- Implement appropriate hover state handling for touch devices

**Performance Considerations:**

- Lazy load non-critical components
- Optimize bundle size with tree shaking
- Minimize CSS-in-JS runtime overhead
- Efficient theme switching without layout shifts

### Accessibility Integration

**WCAG Compliance:**

- Ensure all components meet WCAG 2.1 AA standards
- Implement proper focus management and keyboard navigation
- Provide appropriate ARIA labels and descriptions
- Test with screen readers and assistive technologies

**Mobile Accessibility:**

- Optimize for voice control and switch navigation
- Ensure sufficient color contrast in all themes
- Provide haptic feedback where appropriate
- Support dynamic type sizing preferences

This design provides a comprehensive foundation for migrating to shadcn/ui while maintaining the mobile-first approach and ensuring accessibility compliance throughout the process.
