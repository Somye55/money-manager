# UI Implementation Design Document

## Overview

This design document outlines the implementation strategy for standardizing and documenting the UI system in the Money Manager mobile application. The application currently uses a modern tech stack including React 18.3.1, Tailwind CSS v4.1.3, Radix UI components, and Lucide React icons. This design will ensure all UI patterns, components, and styling approaches documented in the `ui-rework-plan.md` are consistently implemented and maintained across the entire application.

The implementation focuses on leveraging existing technologies (Tailwind CSS v4 with OKLCH colors, Radix UI primitives, CVA for variants) while ensuring consistency, accessibility, and maintainability. The design emphasizes a mobile-first approach with glassmorphism effects, gradient-heavy styling, and smooth animations.

## Architecture

### Technology Stack Architecture

```
Application Layer
├── React 18.3.1 (Core Framework)
├── React Router DOM (Navigation)
└── Vite 6.3.5 (Build Tool)

Styling Layer
├── Tailwind CSS v4.1.3 (Utility Framework)
│   ├── OKLCH Color Space
│   ├── Custom CSS Variables
│   └── Mobile-First Breakpoints
├── CSS-in-JS (Component Animations)
└── globals.css (Theme Variables)

Component Layer
├── Radix UI (Headless Primitives)
│   ├── Dialog, Select, Checkbox, etc.
│   └── Accessibility Built-in
├── Custom Components
│   ├── Button (CVA Variants)
│   ├── Input (Styled)
│   ├── Card (Structured)
│   └── Modal (Custom)
└── Lucide React 0.487.0 (Icons)

Utility Layer
├── class-variance-authority (CVA)
├── clsx (Conditional Classes)
├── tailwind-merge (Class Merging)
└── next-themes (Theme Management)

Data Visualization
└── Recharts 2.15.2 (Charts)
```

### File Structure

```
client/src/
├── components/
│   ├── ui/                          # Reusable UI components (50+)
│   │   ├── button.tsx               # Button with CVA variants
│   │   ├── input.tsx                # Styled input component
│   │   ├── card.tsx                 # Card with sections
│   │   ├── dialog.tsx               # Radix Dialog
│   │   ├── Modal.tsx                # Custom modal
│   │   ├── select.tsx               # Radix Select
│   │   ├── checkbox.tsx             # Radix Checkbox
│   │   ├── switch.tsx               # Radix Switch
│   │   ├── tabs.tsx                 # Radix Tabs
│   │   ├── tooltip.tsx              # Radix Tooltip
│   │   ├── skeleton.tsx             # Loading skeleton
│   │   ├── badge.tsx                # Status badges
│   │   ├── alert.tsx                # Alert messages
│   │   ├── utils.ts                 # cn() utility
│   │   └── use-mobile.ts            # Mobile detection
│   ├── Navigation.tsx               # Bottom navigation
│   ├── ThemeToggle.tsx              # Theme switcher
│   ├── Dashboard.tsx                # Dashboard page
│   ├── AddExpense.tsx               # Add expense form
│   ├── Expenses.tsx                 # Expense list
│   ├── Settings.tsx                 # Settings page
│   └── Login.tsx                    # Login page
├── styles/
│   └── globals.css                  # CSS variables & theme
├── index.css                        # Tailwind output
├── data/
│   └── mockData.ts                  # Mock data
├── main.tsx                         # Entry point
└── App.tsx                          # Router setup
```

## Components and Interfaces

### Core Component Specifications

#### Button Component

**File**: `components/ui/button.tsx`

**Implementation**: Uses CVA for variant management

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 rounded-md",
        lg: "h-10 px-6 rounded-md",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}
```

**Usage**:

```tsx
<Button variant="default" size="lg">Save</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
<Button loading={isLoading}>Submit</Button>
```

#### Input Component

**File**: `components/ui/input.tsx`

**Styling**:

- Height: `h-9` (36px)
- Background: `bg-input-background` (#f3f3f5)
- Border: `border-input` with `rounded-md`
- Focus: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- Error: `aria-invalid:border-destructive aria-invalid:ring-destructive/20`

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-sm shadow-sm transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
);
```

#### Card Component

**File**: `components/ui/card.tsx`

**Structure**:

```typescript
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
));

const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);

const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

const CardFooter = ({ className, ...props }) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
);
```

### Theme Configuration

**File**: `styles/globals.css`

```css
@import url("https://fonts.googleapis.com/css2?family=TikTok+Sans:opsz,wght@12..36,300..900&display=swap");

:root {
  /* Semantic Colors */
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --card: #ffffff;
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: #030213;
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.95 0.0058 264.53);
  --secondary-foreground: #030213;
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --accent-foreground: #030213;
  --destructive: #d4183d;
  --destructive-foreground: #ffffff;
  --border: rgba(0, 0, 0, 0.1);
  --input: transparent;
  --input-background: #f3f3f5;
  --switch-background: #cbced4;
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.145 0 0);
  --secondary: oklch(0.2 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.2 0 0);
  --muted-foreground: oklch(0.6 0 0);
  --accent: oklch(0.2 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.6 0.25 25);
  --destructive-foreground: oklch(0.985 0 0);
  --border: rgba(255, 255, 255, 0.1);
  --input-background: oklch(0.2 0 0);
  --switch-background: oklch(0.3 0 0);
  --ring: oklch(0.708 0 0);
}

/* Custom Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
  opacity: 0;
}

/* Typography */
body {
  font-family: "TikTok Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1 {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.5;
}

h2 {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.5;
}

h3 {
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.5;
}

h4 {
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
}
```

### Utility Functions

**File**: `components/ui/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**File**: `components/ui/use-mobile.ts`

```typescript
import { useEffect, useState } from "react";

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
```

## Data Models

### Component Props Models

```typescript
// Button Props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  fullWidth?: boolean;
}

// Input Props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

// Card Props
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "sm" | "md" | "lg";
  interactive?: boolean;
}

// Select Props (Radix UI)
interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

// Modal Props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}
```

### Theme Model

```typescript
interface Theme {
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    inputBackground: string;
    ring: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      "2xl": string;
      "3xl": string;
      "4xl": string;
    };
    fontWeight: {
      normal: number;
      medium: number;
    };
  };
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Color System Properties

Property 1: OKLCH color consistency
_For any_ color defined in the system, it should use OKLCH color space format or reference a CSS variable that uses OKLCH
**Validates: Requirements 1.1**

Property 2: Semantic color variable usage
_For any_ component styling, colors should be applied using CSS custom properties (--background, --foreground, etc.) rather than hardcoded values
**Validates: Requirements 1.2**

Property 3: Gradient color consistency
_For any_ gradient applied to UI elements, it should use the indigo/purple color palette (from-indigo-500 to-purple-600)
**Validates: Requirements 1.3**

### Typography Properties

Property 4: Font family consistency
_For any_ text element, it should use TikTok Sans font with proper fallback chain
**Validates: Requirements 2.1**

Property 5: Font size token usage
_For any_ text element, font sizes should use Tailwind custom properties (text-xs through text-4xl) rather than arbitrary values
**Validates: Requirements 2.2**

Property 6: Heading hierarchy consistency
_For any_ heading element (h1-h4), it should automatically apply the correct font size and weight as defined in globals.css
**Validates: Requirements 2.3**

### Spacing Properties

Property 7: Spacing scale consistency
_For any_ spacing value (gap, padding, margin), it should use Tailwind's 4px-based scale (gap-1 through gap-6, p-1 through p-6)
**Validates: Requirements 3.1**

Property 8: Border radius token usage
_For any_ element with rounded corners, it should use standardized radius values (rounded-sm through rounded-3xl)
**Validates: Requirements 3.2**

Property 9: Container width consistency
_For any_ page layout, the main container should use max-w-screen-lg with mx-auto px-4
**Validates: Requirements 3.3**

Property 10: Bottom navigation spacing
_For any_ page with bottom navigation, the content should have pb-24 (96px) padding to prevent overlap
**Validates: Requirements 3.4**

### Component Properties

Property 11: Button variant consistency
_For any_ Button component, it should support all 6 variants (default, destructive, outline, secondary, ghost, link) with consistent styling
**Validates: Requirements 5.1**

Property 12: Button size consistency
_For any_ Button component, it should support all 4 sizes (default: h-9, sm: h-8, lg: h-10, icon: size-9) with consistent dimensions
**Validates: Requirements 5.2**

Property 13: Input height consistency
_For any_ Input component, it should have a consistent height of h-9 (36px)
**Validates: Requirements 6.1**

Property 14: Input focus ring consistency
_For any_ Input component when focused, it should display the standard focus ring (focus-visible:ring-ring/50 focus-visible:ring-[3px])
**Validates: Requirements 6.2**

Property 15: Card structure consistency
_For any_ Card component, it should support CardHeader, CardContent, and CardFooter sections with consistent padding (p-6)
**Validates: Requirements 7.1, 7.3**

### Visual Effects Properties

Property 16: Glassmorphism consistency
_For any_ element using glassmorphism effect, it should use backdrop-blur-xl with appropriate transparency (bg-white/80)
**Validates: Requirements 8.1**

Property 17: Gradient usage consistency
_For any_ primary action or hero element, it should use the indigo/purple gradient (bg-gradient-to-br from-indigo-500 to-purple-600)
**Validates: Requirements 8.2**

Property 18: Animation consistency
_For any_ newly rendered card or section, it should use the fadeIn animation with appropriate delay
**Validates: Requirements 8.3**

### Icon Properties

Property 19: Icon library consistency
_For any_ UI icon, it should use Lucide React v0.487.0 rather than other icon libraries
**Validates: Requirements 9.1**

Property 20: Icon size consistency
_For any_ icon, it should use standardized sizes (w-4 h-4, w-5 h-5, w-6 h-6, w-8 h-8)
**Validates: Requirements 9.2**

### Layout Properties

Property 21: Page structure consistency
_For any_ page, it should wrap content in min-h-screen pb-24 container
**Validates: Requirements 11.1**

Property 22: Header positioning consistency
_For any_ page header, it should use sticky top-0 z-40 with glassmorphism effect
**Validates: Requirements 11.2**

Property 23: Navigation positioning consistency
_For any_ bottom navigation, it should use fixed bottom-0 left-0 right-0 z-50
**Validates: Requirements 12.5**

### Responsive Properties

Property 24: Mobile-first approach
_For any_ new component or layout, base styles should target mobile devices with responsive prefixes (sm:, md:, lg:) for larger screens
**Validates: Requirements 13.1**

Property 25: Touch target size compliance
_For any_ interactive element, it should have minimum dimensions of 44px × 44px (min-h-[44px] min-w-[44px])
**Validates: Requirements 13.4**

### Accessibility Properties

Property 26: Focus ring visibility
_For any_ interactive element when focused, it should display a visible focus ring using focus-visible:ring-ring/50
**Validates: Requirements 15.1**

Property 27: ARIA attribute presence
_For any_ form input with validation errors, it should have aria-invalid attribute set appropriately
**Validates: Requirements 15.2**

Property 28: Screen reader text
_For any_ icon-only button, it should include sr-only text or aria-label for screen readers
**Validates: Requirements 15.4**

### Performance Properties

Property 29: GPU-accelerated animations
_For any_ animation, it should use transform and opacity properties rather than width, height, top, or left
**Validates: Requirements 18.1**

Property 30: Lazy loading images
_For any_ off-screen image, it should use loading="lazy" attribute
**Validates: Requirements 18.2**

## Error Handling

### Component Error Handling

**Input Validation Errors**:

- Display error message below input with `text-sm text-red-600`
- Apply `aria-invalid` attribute for styling
- Show red border with `border-destructive`
- Prevent form submission until errors are resolved

**Button Loading States**:

- Disable button interaction with `disabled` attribute
- Show spinner with `animate-spin` class
- Display loading text alongside spinner
- Prevent multiple submissions

**Form Submission Errors**:

- Display error toast using Sonner library
- Show error message in red Alert component
- Maintain form state to allow correction
- Provide clear error messages

### Theme Error Handling

**Theme Loading Failures**:

- Fallback to light theme if theme loading fails
- Log error to console for debugging
- Continue application execution
- Retry theme loading on next mount

**CSS Variable Missing**:

- Fallback to default Tailwind colors
- Log warning to console
- Continue rendering with fallback values
- Document missing variables for fixing

### Component Rendering Errors

**Error Boundaries**:

- Wrap major sections in error boundaries
- Display fallback UI with error message
- Log error details for debugging
- Provide "Try Again" button to retry

**Missing Props**:

- Use default props for all components
- Log warning for required props
- Gracefully degrade functionality
- Continue rendering with defaults

## Testing Strategy

### Dual Testing Approach

The UI implementation will use both unit testing and property-based testing:

**Unit Testing:**

- Component rendering with different props and variants
- User interactions (clicks, inputs, form submissions)
- Responsive behavior at specific breakpoints
- Accessibility compliance (ARIA attributes, keyboard navigation)
- Theme switching functionality
- Animation triggers and completion

**Property-Based Testing:**

- Color consistency across all components (Properties 1, 2, 3)
- Typography token usage (Properties 4, 5, 6)
- Spacing scale adherence (Properties 7, 8, 9, 10)
- Component variant consistency (Properties 11, 12, 13, 14, 15)
- Touch target size compliance (Property 25)
- Focus ring visibility (Property 26)

**Testing Library**: React Testing Library with @testing-library/jest-dom

**Testing Configuration:**

- Minimum 100 iterations per property-based test
- Each property-based test tagged with: **Feature: ui-implementation, Property {number}: {property_text}**
- Visual regression testing using Storybook
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile device testing (iOS Safari, Chrome Android)

### Integration Testing

- End-to-end user flows (login, add expense, view dashboard)
- Navigation between pages
- Form submission and validation
- Theme switching across all pages
- Responsive behavior across breakpoints
- Chart rendering and interactions

### Accessibility Testing

- Keyboard navigation for all interactive elements
- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Color contrast compliance (WCAG AA minimum)
- Focus management and visual indicators
- Touch target size validation
- ARIA attribute correctness

### Performance Testing

- Initial page load time (< 3 seconds)
- Time to interactive (< 5 seconds)
- Animation frame rate (60 FPS)
- Bundle size optimization
- Lazy loading effectiveness
- Memory usage monitoring

### Visual Regression Testing

- Screenshot comparison for all components
- Theme switching visual validation
- Responsive layout verification
- Animation consistency checks
- Cross-browser visual parity

## Implementation Strategy

### Phase 1: Foundation Setup

1. Verify Tailwind CSS v4 configuration
2. Ensure all CSS variables are defined in globals.css
3. Verify Radix UI components are installed
4. Set up utility functions (cn, useMobile)
5. Configure theme provider (next-themes)

### Phase 2: Core Components

1. Implement/verify Button component with CVA
2. Implement/verify Input component with validation
3. Implement/verify Card component with sections
4. Implement/verify Modal/Dialog components
5. Implement/verify Select, Checkbox, Switch components

### Phase 3: Layout Components

1. Verify Navigation component structure
2. Implement consistent page layout pattern
3. Verify header and footer components
4. Implement grid and flex layout utilities
5. Verify responsive container patterns

### Phase 4: Visual Effects

1. Verify glassmorphism implementation
2. Verify gradient usage patterns
3. Verify fadeIn animation implementation
4. Verify loading spinner animations
5. Verify transition consistency

### Phase 5: Page Implementation

1. Audit Dashboard page for consistency
2. Audit AddExpense page for consistency
3. Audit Expenses page for consistency
4. Audit Settings page for consistency
5. Audit Login page for consistency

### Phase 6: Accessibility & Testing

1. Add ARIA attributes to all interactive elements
2. Verify keyboard navigation
3. Test with screen readers
4. Validate color contrast
5. Write property-based tests
6. Write unit tests

### Phase 7: Documentation

1. Document all component APIs
2. Create usage examples
3. Document best practices
4. Create troubleshooting guide
5. Document common patterns

## Migration Strategy

Since the UI system is already implemented, the focus is on:

1. **Audit**: Review all pages and components for consistency
2. **Standardize**: Update any components not following patterns
3. **Document**: Ensure all patterns are documented
4. **Test**: Add comprehensive test coverage
5. **Optimize**: Improve performance where needed

## Performance Considerations

### Animation Performance

- Use `transform` and `opacity` for GPU acceleration
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Limit concurrent animations

### Bundle Size

- Tree-shake unused Radix UI components
- Lazy load chart components (Recharts)
- Code-split routes
- Optimize icon imports

### Runtime Performance

- Memoize expensive computations
- Use React.memo for pure components
- Implement virtual scrolling for long lists
- Debounce search and filter inputs

### Loading Performance

- Lazy load images with `loading="lazy"`
- Preload critical fonts
- Minimize CSS-in-JS runtime
- Use CSS containment where appropriate

## Accessibility Compliance

### WCAG 2.1 AA Requirements

- Color contrast ratio ≥ 4.5:1 for normal text
- Color contrast ratio ≥ 3:1 for large text
- Touch targets ≥ 44px × 44px
- Keyboard navigation for all interactive elements
- Focus indicators visible and clear
- ARIA labels for icon-only buttons
- Semantic HTML structure
- Screen reader compatibility

### Testing Tools

- axe DevTools for automated testing
- NVDA/JAWS for screen reader testing
- Keyboard-only navigation testing
- Color contrast analyzer
- Touch target size validator

## Browser Support

### Supported Browsers

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)
- Chrome Android (last 2 versions)

### Progressive Enhancement

- Core functionality works without JavaScript
- Graceful degradation for older browsers
- Polyfills for missing features
- Feature detection over browser detection

## Maintenance Guidelines

### Adding New Components

1. Follow existing component patterns
2. Use CVA for variants when applicable
3. Include TypeScript types
4. Add accessibility attributes
5. Write tests
6. Document usage

### Modifying Existing Components

1. Check for breaking changes
2. Update tests
3. Update documentation
4. Test across all pages using component
5. Verify accessibility

### Updating Dependencies

1. Review changelog for breaking changes
2. Update component implementations
3. Run full test suite
4. Test manually across all pages
5. Update documentation if needed
