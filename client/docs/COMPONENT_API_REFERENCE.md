# Component API Reference

## Button Component

**File**: `src/components/ui/button.tsx`

### TypeScript Interface

```typescript
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
  asChild?: boolean;
}
```

### Props

| Prop       | Type    | Default     | Description                |
| ---------- | ------- | ----------- | -------------------------- |
| `variant`  | string  | `'default'` | Visual style variant       |
| `size`     | string  | `'default'` | Size variant               |
| `loading`  | boolean | `false`     | Shows loading spinner      |
| `disabled` | boolean | `false`     | Disables interaction       |
| `asChild`  | boolean | `false`     | Renders as child component |

### Variants

- **default**: Primary action button with gradient background
- **destructive**: Dangerous actions (delete, remove)
- **outline**: Secondary actions with border
- **secondary**: Tertiary actions with muted background
- **ghost**: Minimal styling, hover effect only
- **link**: Text-only button with underline on hover

### Sizes

- **default**: `h-9` (36px) - Standard button height
- **sm**: `h-8` (32px) - Compact button
- **lg**: `h-10` (40px) - Prominent button
- **icon**: `size-9` (36px × 36px) - Square icon button

---

## Input Component

**File**: `src/components/ui/input.tsx`

### TypeScript Interface

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}
```

### Props

| Prop          | Type    | Default  | Description              |
| ------------- | ------- | -------- | ------------------------ |
| `type`        | string  | `'text'` | Input type               |
| `error`       | string  | -        | Error message to display |
| `label`       | string  | -        | Label text               |
| `disabled`    | boolean | `false`  | Disables input           |
| `placeholder` | string  | -        | Placeholder text         |

### Styling

- Height: `h-9` (36px)
- Background: `bg-input-background` (#f3f3f5)
- Focus ring: `focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- Error state: `aria-invalid:border-destructive`

---

## Card Component

**File**: `src/components/ui/card.tsx`

### TypeScript Interfaces

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
```

### Components

- **Card**: Root container with border and shadow
- **CardHeader**: Top section with padding
- **CardTitle**: Heading within header
- **CardDescription**: Subtitle within header
- **CardContent**: Main content area
- **CardFooter**: Bottom section for actions

### Styling

- Background: `bg-card`
- Border: `border` with `rounded-xl`
- Padding: `p-6` for all sections
- Spacing: `gap-6` between sections

---

## Dialog Component

**File**: `src/components/ui/dialog.tsx`

### TypeScript Interfaces

```typescript
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
```

### Components

- **Dialog**: Root component (Radix UI primitive)
- **DialogTrigger**: Button to open dialog
- **DialogContent**: Modal content container
- **DialogHeader**: Header section
- **DialogTitle**: Dialog title
- **DialogDescription**: Dialog description
- **DialogFooter**: Footer for actions

### Features

- Glassmorphism effect with backdrop blur
- Keyboard navigation (Escape to close)
- Focus trap within dialog
- ARIA attributes for accessibility
- Portal rendering outside DOM hierarchy

---

## Select Component

**File**: `src/components/ui/select.tsx`

### TypeScript Interfaces

```typescript
interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}
```

### Components

- **Select**: Root component (Radix UI primitive)
- **SelectTrigger**: Button to open dropdown
- **SelectValue**: Displays selected value
- **SelectContent**: Dropdown content container
- **SelectItem**: Individual option
- **SelectGroup**: Groups related options
- **SelectLabel**: Label for option group

### Features

- Consistent styling with Input component
- Keyboard navigation (Arrow keys, Enter, Escape)
- Search by typing
- ARIA attributes for accessibility

---

## Checkbox Component

**File**: `src/components/ui/checkbox.tsx`

### TypeScript Interface

```typescript
interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}
```

### Props

| Prop              | Type     | Default | Description                 |
| ----------------- | -------- | ------- | --------------------------- |
| `checked`         | boolean  | `false` | Checked state               |
| `onCheckedChange` | function | -       | Callback when state changes |
| `disabled`        | boolean  | `false` | Disables interaction        |

### Features

- Minimum 44px touch target
- Focus ring on keyboard focus
- Animated check icon
- ARIA attributes for accessibility

---

## Switch Component

**File**: `src/components/ui/switch.tsx`

### TypeScript Interface

```typescript
interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}
```

### Props

| Prop              | Type     | Default | Description                 |
| ----------------- | -------- | ------- | --------------------------- |
| `checked`         | boolean  | `false` | Switch state                |
| `onCheckedChange` | function | -       | Callback when state changes |
| `disabled`        | boolean  | `false` | Disables interaction        |

### Features

- Minimum 44px touch target
- Smooth toggle animation
- Focus ring on keyboard focus
- ARIA attributes for accessibility

---

## Tabs Component

**File**: `src/components/ui/tabs.tsx`

### TypeScript Interfaces

```typescript
interface TabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}
```

### Components

- **Tabs**: Root component (Radix UI primitive)
- **TabsList**: Container for tab triggers
- **TabsTrigger**: Individual tab button
- **TabsContent**: Content panel for each tab

### Features

- Keyboard navigation (Arrow keys, Home, End)
- Active/inactive state styling
- ARIA attributes for accessibility
- Smooth content transitions

---

## Tooltip Component

**File**: `src/components/ui/tooltip.tsx`

### TypeScript Interfaces

```typescript
interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
}
```

### Props

| Prop            | Type      | Default | Description               |
| --------------- | --------- | ------- | ------------------------- |
| `content`       | ReactNode | -       | Tooltip content           |
| `side`          | string    | `'top'` | Tooltip position          |
| `delayDuration` | number    | `200`   | Delay before showing (ms) |

### Features

- Automatic positioning
- Collision detection
- ARIA attributes for accessibility
- Consistent styling with theme

---

## Alert Component

**File**: `src/components/ui/alert.tsx`

### TypeScript Interface

```typescript
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}
```

### Components

- **Alert**: Root container
- **AlertTitle**: Alert heading
- **AlertDescription**: Alert message

### Variants

- **default**: Informational alerts
- **destructive**: Error or warning alerts

---

## Badge Component

**File**: `src/components/ui/badge.tsx`

### TypeScript Interface

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}
```

### Variants

- **default**: Primary badge
- **secondary**: Muted badge
- **destructive**: Error or warning badge
- **outline**: Bordered badge

---

## Skeleton Component

**File**: `src/components/ui/skeleton.tsx`

### TypeScript Interface

```typescript
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}
```

### Usage

Used for loading states to show placeholder content while data loads.

---

## Progress Component

**File**: `src/components/ui/progress.tsx`

### TypeScript Interface

```typescript
interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
}
```

### Props

| Prop    | Type   | Default | Description            |
| ------- | ------ | ------- | ---------------------- |
| `value` | number | `0`     | Progress value (0-100) |

### Features

- Gradient styling based on value
- Smooth transitions
- ARIA attributes for accessibility

---

## Utility Functions

### cn() Function

**File**: `src/components/ui/utils.ts`

```typescript
function cn(...inputs: ClassValue[]): string;
```

Merges Tailwind classes intelligently, handling conflicts and conditional classes.

**Usage**:

```typescript
cn("px-4 py-2", "bg-blue-500", condition && "text-white");
```

### useMobile Hook

**File**: `src/components/ui/use-mobile.ts`

```typescript
function useMobile(): boolean;
```

Returns `true` if viewport width is less than 768px.

**Usage**:

```typescript
const isMobile = useMobile();
```
