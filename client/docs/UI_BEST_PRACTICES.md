# UI Best Practices

## Adding New Components

### 1. File Structure

Place all reusable UI components in `src/components/ui/`:

```
src/components/ui/
├── button.tsx
├── input.tsx
├── card.tsx
└── your-new-component.tsx
```

### 2. TypeScript First

Always use TypeScript for type safety:

```tsx
interface YourComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary";
  size?: "sm" | "md" | "lg";
}

export function YourComponent({
  variant = "default",
  size = "md",
  ...props
}: YourComponentProps) {
  // Component implementation
}
```

### 3. Use CVA for Variants

For components with multiple variants, use Class Variance Authority:

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const componentVariants = cva("base-classes-here", {
  variants: {
    variant: {
      default: "variant-specific-classes",
      secondary: "variant-specific-classes",
    },
    size: {
      sm: "size-specific-classes",
      md: "size-specific-classes",
      lg: "size-specific-classes",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

export function Component({
  variant,
  size,
  className,
  ...props
}: ComponentProps) {
  return (
    <div
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    />
  );
}
```

### 4. Forward Refs

Use `React.forwardRef` for components that need ref access:

```tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input ref={ref} className={cn("base-classes", className)} {...props} />
    );
  }
);
Input.displayName = "Input";
```

### 5. Accessibility

Always include proper accessibility attributes:

```tsx
<button
  aria-label="Close dialog"
  aria-pressed={isPressed}
  aria-disabled={isDisabled}
  role="button"
  tabIndex={0}
>
  Close
</button>
```

### 6. Composable Components

Design components to be composable:

```tsx
// Good - Composable
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Avoid - Monolithic
<Card title="Title" content="Content" />
```

### 7. Export Pattern

Use named exports for better tree-shaking:

```tsx
// Good
export { Button } from "./button";
export { Input } from "./input";

// Avoid
export default Button;
```

---

## Modifying Styles

### 1. Use Tailwind Utilities

Prefer Tailwind utility classes over inline styles:

```tsx
// Good
<div className="px-4 py-2 bg-blue-500 rounded-md">Content</div>

// Avoid
<div style={{ padding: '8px 16px', backgroundColor: '#3b82f6', borderRadius: '6px' }}>
  Content
</div>
```

### 2. Use CSS Variables for Colors

Reference CSS variables instead of hardcoded colors:

```tsx
// Good
<div className="bg-primary text-primary-foreground">Content</div>

// Avoid
<div className="bg-[#030213] text-white">Content</div>
```

### 3. Follow Spacing Scale

Use Tailwind's spacing scale (4px increments):

```tsx
// Good
<div className="gap-4 p-6 space-y-2">Content</div>

// Avoid
<div className="gap-[17px] p-[23px]">Content</div>
```

### 4. Consistent Border Radius

Use standardized radius values:

```tsx
// Good
<div className="rounded-md">Small radius</div>
<div className="rounded-lg">Medium radius</div>
<div className="rounded-xl">Large radius</div>

// Avoid
<div className="rounded-[13px]">Arbitrary radius</div>
```

### 5. Use cn() for Class Merging

Always use the `cn()` utility for merging classes:

```tsx
import { cn } from '@/components/ui/utils';

// Good
<div className={cn('base-classes', condition && 'conditional-classes', className)}>
  Content
</div>

// Avoid
<div className={`base-classes ${condition ? 'conditional-classes' : ''} ${className}`}>
  Content
</div>
```

### 6. Responsive Design

Use mobile-first approach with responsive prefixes:

```tsx
// Good - Mobile first
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

// Avoid - Desktop first
<div className="text-lg md:text-base sm:text-sm">
  Responsive text
</div>
```

### 7. Dark Mode Support

Use CSS variables that automatically adapt to theme:

```tsx
// Good - Theme-aware
<div className="bg-background text-foreground border-border">
  Content
</div>

// Avoid - Manual dark mode
<div className="bg-white dark:bg-black text-black dark:text-white">
  Content
</div>
```

---

## Component Design Principles

### 1. Single Responsibility

Each component should have one clear purpose:

```tsx
// Good - Single responsibility
function UserAvatar({ src, alt }) {
  return <img src={src} alt={alt} className="rounded-full" />;
}

function UserName({ name }) {
  return <span className="font-medium">{name}</span>;
}

// Avoid - Multiple responsibilities
function UserInfo({ src, alt, name, email, role }) {
  return (
    <div>
      <img src={src} alt={alt} />
      <span>{name}</span>
      <span>{email}</span>
      <span>{role}</span>
    </div>
  );
}
```

### 2. Prop Drilling

Avoid excessive prop drilling by using composition:

```tsx
// Good - Composition
<Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
  </CardHeader>
  <CardContent>{children}</CardContent>
</Card>

// Avoid - Prop drilling
<Card title={title} content={children} />
```

### 3. Default Props

Provide sensible defaults:

```tsx
interface ButtonProps {
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
}

function Button({ variant = "default", size = "md", ...props }: ButtonProps) {
  // Implementation
}
```

### 4. Controlled vs Uncontrolled

Support both controlled and uncontrolled usage:

```tsx
function Input({ value, defaultValue, onChange, ...props }: InputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const isControlled = value !== undefined;

  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  return <input value={currentValue} onChange={handleChange} {...props} />;
}
```

---

## Performance Best Practices

### 1. Memoization

Use React.memo for expensive components:

```tsx
export const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive rendering logic
  return <div>{/* ... */}</div>;
});
```

### 2. Lazy Loading

Lazy load heavy components:

```tsx
const ChartComponent = lazy(() => import("./ChartComponent"));

function Dashboard() {
  return (
    <Suspense fallback={<Skeleton />}>
      <ChartComponent />
    </Suspense>
  );
}
```

### 3. Avoid Inline Functions

Don't create new functions on every render:

```tsx
// Good
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);

<Button onClick={handleClick}>Click</Button>

// Avoid
<Button onClick={() => console.log('Clicked')}>Click</Button>
```

### 4. GPU-Accelerated Animations

Use transform and opacity for animations:

```tsx
// Good - GPU accelerated
<div className="transition-transform hover:scale-105">
  Content
</div>

// Avoid - CPU intensive
<div className="transition-all hover:w-[200px]">
  Content
</div>
```

---

## Testing Best Practices

### 1. Test User Interactions

Focus on how users interact with components:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

test("button calls onClick when clicked", () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  fireEvent.click(screen.getByText("Click me"));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 2. Test Accessibility

Verify accessibility attributes:

```tsx
test("button has proper aria attributes", () => {
  render(<Button aria-label="Close">×</Button>);

  const button = screen.getByRole("button", { name: "Close" });
  expect(button).toBeInTheDocument();
});
```

### 3. Test Variants

Test all component variants:

```tsx
test("button renders all variants correctly", () => {
  const { rerender } = render(<Button variant="default">Button</Button>);
  expect(screen.getByRole("button")).toHaveClass("bg-primary");

  rerender(<Button variant="destructive">Button</Button>);
  expect(screen.getByRole("button")).toHaveClass("bg-destructive");
});
```

---

## Code Organization

### 1. File Naming

Use consistent naming conventions:

- Components: PascalCase (`Button.tsx`, `UserCard.tsx`)
- Utilities: camelCase (`utils.ts`, `formatDate.ts`)
- Hooks: camelCase with `use` prefix (`useMobile.ts`, `useAuth.ts`)

### 2. Import Order

Organize imports logically:

```tsx
// 1. External dependencies
import React from "react";
import { cva } from "class-variance-authority";

// 2. Internal components
import { Button } from "@/components/ui/button";

// 3. Utilities
import { cn } from "@/components/ui/utils";

// 4. Types
import type { ComponentProps } from "./types";

// 5. Styles (if any)
import "./styles.css";
```

### 3. Component Structure

Follow consistent component structure:

```tsx
// 1. Imports
import React from "react";

// 2. Types
interface ComponentProps {
  // ...
}

// 3. Variants (if using CVA)
const componentVariants = cva(/* ... */);

// 4. Component
export function Component({ ...props }: ComponentProps) {
  // Hooks
  const [state, setState] = useState();

  // Derived state
  const derivedValue = useMemo(() => {}, []);

  // Event handlers
  const handleClick = () => {};

  // Render
  return <div>{/* ... */}</div>;
}

// 5. Display name (for debugging)
Component.displayName = "Component";
```

---

## Documentation

### 1. JSDoc Comments

Add JSDoc comments for complex components:

````tsx
/**
 * A flexible button component with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <Button variant="default" size="lg">
 *   Click me
 * </Button>
 * ```
 */
export function Button({ variant, size, ...props }: ButtonProps) {
  // Implementation
}
````

### 2. Prop Documentation

Document complex props:

```tsx
interface ButtonProps {
  /**
   * The visual style variant of the button
   * @default 'default'
   */
  variant?: "default" | "destructive" | "outline";

  /**
   * The size of the button
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";

  /**
   * Shows a loading spinner and disables the button
   * @default false
   */
  loading?: boolean;
}
```

### 3. Usage Examples

Include usage examples in component files:

```tsx
/**
 * @example
 * // Basic usage
 * <Button>Click me</Button>
 *
 * @example
 * // With variant
 * <Button variant="destructive">Delete</Button>
 *
 * @example
 * // Loading state
 * <Button loading={isLoading}>Save</Button>
 */
```

---

## Common Pitfalls to Avoid

### 1. Don't Override Component Styles Arbitrarily

```tsx
// Avoid
<Button className="!bg-red-500 !text-white">
  Button
</Button>

// Better - Use the variant system
<Button variant="destructive">
  Button
</Button>
```

### 2. Don't Hardcode Colors

```tsx
// Avoid
<div className="bg-[#3b82f6] text-[#ffffff]">
  Content
</div>

// Better - Use semantic colors
<div className="bg-primary text-primary-foreground">
  Content
</div>
```

### 3. Don't Skip Accessibility

```tsx
// Avoid
<div onClick={handleClick}>
  Click me
</div>

// Better - Use semantic HTML and ARIA
<button onClick={handleClick} aria-label="Action description">
  Click me
</button>
```

### 4. Don't Create Unnecessary Wrappers

```tsx
// Avoid
<div className="wrapper">
  <div className="container">
    <div className="content">
      Content
    </div>
  </div>
</div>

// Better - Flatten when possible
<div className="container">
  Content
</div>
```

### 5. Don't Ignore TypeScript Errors

```tsx
// Avoid
// @ts-ignore
<Button variant="invalid">Button</Button>

// Better - Fix the error
<Button variant="default">Button</Button>
```
