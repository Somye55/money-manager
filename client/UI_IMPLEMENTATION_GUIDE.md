# UI Implementation Guide - Final Documentation

## Overview

This guide provides comprehensive documentation for the standardized UI system in the Money Manager application. The system uses Tailwind CSS v4 with OKLCH colors, Radix UI components, and CVA for variant management.

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Component Library](#component-library)
3. [Styling System](#styling-system)
4. [Best Practices](#best-practices)
5. [Common Patterns](#common-patterns)
6. [Troubleshooting](#troubleshooting)

---

## Technology Stack

### Core Technologies

- **React 19.2.0** - UI framework
- **Tailwind CSS v4.0.0** - Utility-first CSS framework
- **Radix UI** - Headless accessible component primitives
- **CVA (Class Variance Authority)** - Component variant management
- **Lucide React 0.556.0** - Icon library
- **Recharts 2.15.2** - Data visualization
- **next-themes 0.4.6** - Theme management

### Build Tools

- **Vite 6.4.1** - Build tool and dev server
- **@tailwindcss/vite 4.0.0** - Tailwind CSS Vite plugin

---

## Component Library

### Form Components

#### Button

**Location:** `client/src/components/ui/button.tsx`

**Variants:**

- `default` - Primary action button with solid background
- `destructive` - Dangerous actions (delete, remove)
- `outline` - Secondary actions with border
- `secondary` - Alternative secondary style
- `ghost` - Minimal style for tertiary actions
- `link` - Text-only link style

**Sizes:**

- `default` - h-9 (36px) with min-h-[44px] for touch
- `sm` - h-8 (32px) with min-h-[44px] for touch
- `lg` - h-10 (40px) with min-h-[44px] for touch
- `icon` - h-9 w-9 (36px × 36px) with min-h-[44px] min-w-[44px] for touch

**Props:**

- `variant` - Button style variant
- `size` - Button size
- `loading` - Shows spinner and disables button
- `disabled` - Disables button interaction

**Usage:**

```tsx
import { Button } from "@/components/ui/button";

// Primary action
<Button variant="default" size="lg">Save Changes</Button>

// Destructive action
<Button variant="destructive">Delete Account</Button>

// Loading state
<Button loading={isSubmitting}>Submit</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Settings className="h-4 w-4" />
</Button>
```

#### Input

**Location:** `client/src/components/ui/input.tsx`

**Features:**

- Consistent height (h-9 / 36px)
- Focus ring styling
- Error state with aria-invalid
- Icon support with proper positioning
- Disabled state

**Props:**

- `error` - Error message to display
- `icon` - Icon element to display on the left
- All standard HTML input attributes

**Usage:**

```tsx
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

// Basic input
<Input type="email" placeholder="Enter email" />

// With error
<Input
  type="text"
  error="This field is required"
  aria-invalid={true}
/>

// With icon
<Input
  type="email"
  icon={<Mail className="h-4 w-4" />}
  placeholder="Email address"
/>
```

#### Select

**Location:** `client/src/components/ui/select.tsx`

**Components:**

- `Select` - Root component
- `SelectTrigger` - Trigger button
- `SelectContent` - Dropdown content
- `SelectItem` - Individual option
- `SelectValue` - Selected value display

**Usage:**

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select value={category} onValueChange={setCategory}>
  <SelectTrigger>
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="food">Food</SelectItem>
    <SelectItem value="transport">Transport</SelectItem>
    <SelectItem value="entertainment">Entertainment</SelectItem>
  </SelectContent>
</Select>;
```

#### Checkbox

**Location:** `client/src/components/ui/checkbox.tsx`

**Features:**

- Minimum 44px × 44px touch target
- Focus ring styling
- Checked/unchecked states
- Disabled state

**Usage:**

```tsx
import { Checkbox } from "@/components/ui/checkbox";

<div className="flex items-center space-x-2">
  <Checkbox id="terms" checked={accepted} onCheckedChange={setAccepted} />
  <label htmlFor="terms">Accept terms and conditions</label>
</div>;
```

#### Switch

**Location:** `client/src/components/ui/switch.tsx`

**Features:**

- Minimum 44px × 44px touch target
- Focus ring styling
- Smooth toggle animation
- Disabled state

**Usage:**

```tsx
import { Switch } from "@/components/ui/switch";

<div className="flex items-center space-x-2">
  <Switch id="notifications" checked={enabled} onCheckedChange={setEnabled} />
  <label htmlFor="notifications">Enable notifications</label>
</div>;
```

### Layout Components

#### Card

**Location:** `client/src/components/ui/card.tsx`

**Components:**

- `Card` - Root container
- `CardHeader` - Header section with padding
- `CardTitle` - Title heading
- `CardDescription` - Description text
- `CardContent` - Main content area
- `CardFooter` - Footer section

**Features:**

- Consistent padding (p-6 / 24px)
- Rounded corners (rounded-xl)
- Border and shadow
- Interactive variant with hover effect

**Usage:**

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Interactive card
<Card interactive onClick={handleClick}>
  <CardContent>Clickable card</CardContent>
</Card>
```

### Overlay Components

#### Dialog

**Location:** `client/src/components/ui/dialog.tsx`

**Components:**

- `Dialog` - Root component
- `DialogTrigger` - Trigger button
- `DialogContent` - Modal content
- `DialogHeader` - Header section
- `DialogTitle` - Title heading
- `DialogDescription` - Description text
- `DialogFooter` - Footer section

**Features:**

- Glassmorphism effect (backdrop-blur-xl)
- Keyboard navigation (Escape to close)
- ARIA attributes
- Smooth animations

**Usage:**

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description goes here</DialogDescription>
    </DialogHeader>
    <div>Dialog content</div>
    <DialogFooter>
      <Button onClick={() => setIsOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

#### Tooltip

**Location:** `client/src/components/ui/tooltip.tsx`

**Components:**

- `TooltipProvider` - Context provider
- `Tooltip` - Root component
- `TooltipTrigger` - Trigger element
- `TooltipContent` - Tooltip content

**Usage:**

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon">
        <Info className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Additional information</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>;
```

### Navigation Components

#### Tabs

**Location:** `client/src/components/ui/tabs.tsx`

**Components:**

- `Tabs` - Root component
- `TabsList` - Tab list container
- `TabsTrigger` - Individual tab button
- `TabsContent` - Tab panel content

**Usage:**

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="reports">Reports</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="analytics">Analytics content</TabsContent>
  <TabsContent value="reports">Reports content</TabsContent>
</Tabs>;
```

### Display Components

#### Alert

**Location:** `client/src/components/ui/alert.tsx`

**Variants:**

- `default` - Standard alert
- `destructive` - Error/danger alert
- `success` - Success alert
- `warning` - Warning alert

**Components:**

- `Alert` - Root container
- `AlertTitle` - Title heading
- `AlertDescription` - Description text

**Usage:**

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong. Please try again.</AlertDescription>
</Alert>;
```

#### Badge

**Location:** `client/src/components/ui/badge.tsx`

**Variants:**

- `default` - Primary badge
- `secondary` - Secondary badge
- `destructive` - Error/danger badge
- `success` - Success badge
- `warning` - Warning badge
- `outline` - Outlined badge

**Usage:**

```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="default">New</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="destructive">Error</Badge>
```

#### Skeleton

**Location:** `client/src/components/ui/skeleton.tsx`

**Usage:**

```tsx
import { Skeleton } from "@/components/ui/skeleton";

// Loading state
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>;
```

#### Progress

**Location:** `client/src/components/ui/progress.tsx`

**Features:**

- Gradient styling
- Dynamic colors based on percentage
- Smooth animations

**Usage:**

```tsx
import { Progress } from "@/components/ui/progress";

<Progress value={75} />;
```

---

## Styling System

### Color System

**OKLCH Color Space** - All colors use OKLCH for better perceptual uniformity

**Semantic Colors:**

- `background` - Page background
- `foreground` - Primary text color
- `card` - Card background
- `primary` - Primary brand color
- `secondary` - Secondary brand color
- `muted` - Muted/subtle elements
- `accent` - Accent color for highlights
- `destructive` - Error/danger color
- `border` - Border color
- `input` - Input border color
- `ring` - Focus ring color

**Usage:**

```tsx
// Use semantic color classes
<div className="bg-background text-foreground">
  <div className="bg-card border border-border">
    <h1 className="text-primary">Title</h1>
    <p className="text-muted-foreground">Description</p>
  </div>
</div>
```

### Typography

**Font Family:** TikTok Sans with fallbacks

**Heading Styles:**

- `h1` - 1.5rem (24px), font-weight: 500
- `h2` - 1.25rem (20px), font-weight: 500
- `h3` - 1.125rem (18px), font-weight: 500
- `h4` - 1rem (16px), font-weight: 500

**Usage:**

```tsx
// Headings automatically styled
<h1>Main Heading</h1>
<h2>Section Heading</h2>
<h3>Subsection Heading</h3>

// Text utilities
<p className="text-sm text-muted-foreground">Small text</p>
<p className="text-base">Normal text</p>
<p className="text-lg font-medium">Large text</p>
```

### Spacing

**4px-based scale:**

- `gap-1` - 4px
- `gap-2` - 8px
- `gap-3` - 12px
- `gap-4` - 16px
- `gap-5` - 20px
- `gap-6` - 24px

**Usage:**

```tsx
// Consistent spacing
<div className="space-y-6">
  <div className="p-6">Content with 24px padding</div>
  <div className="flex gap-4">Items with 16px gap</div>
</div>
```

### Border Radius

**Standardized values:**

- `rounded-sm` - 0.375rem (6px)
- `rounded-md` - 0.5rem (8px)
- `rounded-lg` - 0.625rem (10px)
- `rounded-xl` - 0.75rem (12px)
- `rounded-2xl` - 1rem (16px)
- `rounded-3xl` - 1.5rem (24px)

### Animations

**Available animations:**

- `animate-fadeIn` - Fade in with slide up
- `animate-slide-up` - Slide up animation
- `animate-fade-in` - Simple fade in
- `animate-spin` - Spinning animation (for loaders)

**Usage:**

```tsx
// Staggered fade-in
<div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
  Card 1
</div>
<div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
  Card 2
</div>
```

---

## Best Practices

### Component Development

1. **Use CVA for variants** - Manage component variants with class-variance-authority
2. **Forward refs** - Always forward refs for better composability
3. **TypeScript types** - Define proper TypeScript interfaces
4. **Display names** - Set displayName for better debugging
5. **Accessibility** - Include ARIA attributes and keyboard navigation

### Styling Guidelines

1. **Use semantic colors** - Always use CSS variables, never hardcode colors
2. **Mobile-first** - Write base styles for mobile, add responsive prefixes
3. **Utility classes** - Prefer Tailwind utilities over custom CSS
4. **Consistent spacing** - Use the 4px-based spacing scale
5. **Touch targets** - Ensure minimum 44px × 44px for interactive elements

### Performance

1. **GPU-accelerated animations** - Use transform and opacity
2. **Lazy loading** - Use loading="lazy" for off-screen images
3. **Code splitting** - Lazy load routes and heavy components
4. **Memoization** - Use React.memo for expensive components
5. **Debounce inputs** - Debounce search and filter inputs

### Accessibility

1. **Focus rings** - Always show focus indicators
2. **ARIA attributes** - Use aria-label, aria-invalid, role
3. **Keyboard navigation** - Support Tab, Enter, Escape, Arrow keys
4. **Screen reader text** - Use sr-only for icon-only buttons
5. **Color contrast** - Ensure WCAG AA compliance (4.5:1 minimum)

---

## Common Patterns

### Glassmorphism Effect

```tsx
<div className="backdrop-blur-xl bg-white/80 dark:bg-card/80">
  Content with glassmorphism
</div>
```

### Gradient Backgrounds

```tsx
<div className="bg-gradient-to-br from-indigo-500 to-purple-600">
  Gradient background
</div>
```

### Page Layout

```tsx
<div className="min-h-screen pb-24">
  <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80">
    Header
  </header>
  <main className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">Content</main>
  <nav className="fixed bottom-0 left-0 right-0 z-50">Navigation</nav>
</div>
```

### Form Validation

```tsx
const [email, setEmail] = useState("");
const [error, setError] = useState("");

const handleSubmit = (e) => {
  e.preventDefault();
  if (!validateEmail(email)) {
    setError("Invalid email address");
    return;
  }
  // Submit form
};

<Input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={error}
  aria-invalid={!!error}
/>;
```

### Loading States

```tsx
{
  isLoading ? (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ) : (
    <div>Content</div>
  );
}
```

### Empty States

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <Icon className="h-12 w-12 text-muted-foreground mb-4" />
  <h3 className="text-lg font-medium mb-2">No items found</h3>
  <p className="text-sm text-muted-foreground mb-4">
    Get started by creating your first item
  </p>
  <Button>Create Item</Button>
</div>
```

---

## Troubleshooting

### Common Issues

#### Issue: Focus ring not visible

**Solution:** Ensure you're using `focus-visible:ring-ring/50` class

#### Issue: Touch targets too small

**Solution:** Add `min-h-[44px] min-w-[44px]` classes

#### Issue: Colors not updating in dark mode

**Solution:** Check that CSS variables are defined in both light and dark modes

#### Issue: Animations not working

**Solution:** Ensure animations are defined in index.css and classes are applied correctly

#### Issue: Components not styled correctly

**Solution:** Verify Tailwind CSS is properly configured and index.css is imported

### Debugging Tips

1. **Use browser DevTools** - Inspect elements to see applied classes
2. **Check console** - Look for errors or warnings
3. **Verify imports** - Ensure components are imported from correct paths
4. **Test accessibility** - Use axe DevTools for automated testing
5. **Check responsive** - Test on different screen sizes

---

## Utility Functions

### cn() - Class Name Utility

**Location:** `client/src/components/ui/utils.ts`

Merges class names using clsx and tailwind-merge.

```tsx
import { cn } from "@/components/ui/utils";

<div
  className={cn(
    "base-class",
    condition && "conditional-class",
    "override-class"
  )}
>
  Content
</div>;
```

### formatCurrency()

Formats numbers as currency with $ symbol and 2 decimal places.

```tsx
import { formatCurrency } from "@/components/ui/utils";

formatCurrency(1234.56); // "$1,234.56"
```

### formatDate()

Formats dates in various formats.

```tsx
import { formatDate } from "@/components/ui/utils";

formatDate(new Date(), "short"); // "Jan 3, 2026"
formatDate(new Date(), "long"); // "Saturday, January 3, 2026"
formatDate(new Date(), "relative"); // "just now"
```

### Validation Functions

```tsx
import {
  validateEmail,
  validateRequired,
  validatePositiveNumber,
  validateMinLength,
  validateMaxLength,
} from "@/components/ui/utils";

validateEmail("test@example.com"); // true
validateRequired("  "); // false
validatePositiveNumber(10); // true
validateMinLength("hello", 3); // true
validateMaxLength("hello", 10); // true
```

### useMobile() Hook

**Location:** `client/src/components/ui/use-mobile.ts`

Detects if viewport is mobile (< 768px).

```tsx
import { useMobile } from "@/components/ui/use-mobile";

const isMobile = useMobile();

{
  isMobile ? <MobileView /> : <DesktopView />;
}
```

---

## Conclusion

This UI implementation provides a solid foundation for building consistent, accessible, and performant user interfaces. Follow the patterns and best practices outlined in this guide to maintain code quality and user experience.

For additional help, refer to:

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [React Documentation](https://react.dev/)
- [Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
