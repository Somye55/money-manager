# Money Manager App - UI Documentation

## Overview

This is a comprehensive guide to the UI styling, component libraries, theming, and design patterns used in the Money Manager application. This documentation is designed to help AI models understand and make consistent changes to the existing UI.

---

## 1. Technology Stack

### Core Framework

- **React 18.3.1** with TypeScript
- **React Router DOM** for navigation
- **Vite 6.3.5** as build tool

### Styling Framework

- **Tailwind CSS v4.1.3** (utility-first CSS framework)
- **Custom CSS variables** for theming
- **CSS-in-JS** for component-specific animations

### Component Libraries

- **Radix UI** - Headless UI component primitives (v1.x - v2.x)
- **Lucide React 0.487.0** - Icon library
- **Recharts 2.15.2** - Chart/data visualization library

### Utility Libraries

- **class-variance-authority (CVA) 0.7.1** - For component variant management
- **clsx** - Conditional className utility
- **tailwind-merge** - Merge Tailwind classes intelligently

---

## 2. Design System & Color Palette

### Color Scheme

The app uses a modern, gradient-heavy design with primary colors:

#### Primary Colors (from Tailwind CSS v4 OKLCH color space)

```css
--color-indigo-50: oklch(.962 .018 272.314)
--color-indigo-100: oklch(.93 .034 272.788)
--color-indigo-200: oklch(.87 .065 274.039)
--color-indigo-500: oklch(.585 .233 277.117)
--color-indigo-600: oklch(.511 .262 276.966)
--color-indigo-700: oklch(.457 .24 277.023)

--color-purple-50: oklch(.977 .014 308.299)
--color-purple-500: oklch(.627 .265 303.9)
--color-purple-600: oklch(.558 .288 302.321)
--color-purple-700: oklch(.496 .265 301.924)
```

#### Accent Colors

```css
--color-pink-500: oklch(.656 .241 354.308)
--color-pink-600: oklch(.592 .249 .584)
--color-red-500: oklch(.637 .237 25.331)
--color-red-600: oklch(.577 .245 27.325)
--color-green-500: oklch(.723 .219 149.579)
--color-green-600: oklch(.627 .194 149.214)
--color-yellow-500: oklch(.795 .184 86.047)
--color-orange-600: oklch(.646 .222 41.116)
```

#### Neutral Colors (Gray Scale)

```css
--color-gray-50: oklch(.985 .002 247.839)
--color-gray-100: oklch(.967 .003 264.542)
--color-gray-200: oklch(.928 .006 264.531)
--color-gray-300: oklch(.872 .01 258.338)
--color-gray-400: oklch(.707 .022 261.325)
--color-gray-500: oklch(.551 .027 264.364)
--color-gray-600: oklch(.446 .03 256.802)
--color-gray-700: oklch(.373 .034 259.733)
--color-gray-800: oklch(.278 .033 256.848)
--color-gray-900: oklch(.21 .034 264.665)
--color-white: #fff
--color-black: #000
```

### Semantic Color Variables (CSS Custom Properties)

Located in `styles/globals.css`:

```css
:root {
  --background: #ffffff
  --foreground: oklch(0.145 0 0)
  --card: #ffffff
  --card-foreground: oklch(0.145 0 0)
  --popover: oklch(1 0 0)
  --popover-foreground: oklch(0.145 0 0)
  --primary: #030213
  --primary-foreground: oklch(1 0 0)
  --secondary: oklch(0.95 0.0058 264.53)
  --secondary-foreground: #030213
  --muted: #ececf0
  --muted-foreground: #717182
  --accent: #e9ebef
  --accent-foreground: #030213
  --destructive: #d4183d
  --destructive-foreground: #ffffff
  --border: rgba(0, 0, 0, 0.1)
  --input: transparent
  --input-background: #f3f3f5
  --switch-background: #cbced4
  --ring: oklch(0.708 0 0)
  --radius: 0.625rem (10px)
}
```

### Dark Mode Support

The app has dark mode CSS variables defined but **not currently implemented** in the UI:

```css
.dark {
  --background: oklch(0.145 0 0)
  --foreground: oklch(0.985 0 0)
  /* ... other dark mode variables */
}
```

---

## 3. Typography

### Font Family

- **Primary Font**: TikTok Sans (Google Fonts)
- **Variable Font**: Optical sizing 12-36, Weight 300-900
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif
- **Font Smoothing**: antialiased (webkit) and grayscale (moz)

### Font Sizes (Tailwind v4 Custom Properties)

```css
--text-xs: 0.75rem (12px) - line-height: 1rem
--text-sm: 0.875rem (14px) - line-height: 1.25rem
--text-base: 1rem (16px) - line-height: 1.5rem
--text-lg: 1.125rem (18px)
--text-xl: 1.25rem (20px) - line-height: 1.75rem
--text-2xl: 1.5rem (24px) - line-height: 2rem
--text-3xl: 1.875rem (30px) - line-height: 2.25rem
--text-4xl: 2.25rem (36px) - line-height: 2.5rem
```

### Font Weights

```css
--font-weight-normal: 400
--font-weight-medium: 500
```

### Heading Styles (Auto-applied)

```css
h1: text-2xl (24px), font-medium, line-height: 1.5
h2: text-xl (20px), font-medium, line-height: 1.5
h3: text-lg (18px), font-medium, line-height: 1.5
h4: text-base (16px), font-medium, line-height: 1.5
```

---

## 4. Spacing & Layout

### Spacing System

Tailwind uses a spacing scale based on `--spacing: 0.25rem` (4px):

- `gap-1` = 4px
- `gap-2` = 8px
- `gap-3` = 12px
- `gap-4` = 16px
- `gap-6` = 24px
- `p-6` = 24px padding
- `mb-4` = 16px margin-bottom

### Border Radius

```css
--radius: 0.625rem (10px) - base radius
--radius-sm: calc(var(--radius) - 4px) = 6px
--radius-md: calc(var(--radius) - 2px) = 8px
--radius-lg: var(--radius) = 10px
--radius-xl: calc(var(--radius) + 4px) = 14px
--radius-2xl: 1rem (16px)
--radius-3xl: 1.5rem (24px)
```

### Container Widths

```css
--container-md: 28rem (448px)
--container-lg: 32rem (512px)
--breakpoint-lg: 64rem (1024px)
```

### Common Layout Patterns

- **Max width container**: `max-w-screen-lg mx-auto px-4`
- **Bottom navigation spacing**: `pb-24` (96px) to account for fixed bottom nav
- **Sticky header**: `sticky top-0 z-40`
- **Fixed bottom nav**: `fixed bottom-0 left-0 right-0 z-50`

---

## 5. Component Library Structure

### UI Components Location

All reusable UI components are in `components/ui/` directory.

### Available UI Components (50+ components)

#### Form Components

- **Button** (`button.tsx`) - Primary interactive element with variants
- **Input** (`input.tsx`) - Text input fields
- **Select** (`select.tsx`) - Dropdown selection (Radix UI)
- **Checkbox** (`checkbox.tsx`) - Checkbox input (Radix UI)
- **Radio Group** (`radio-group.tsx`) - Radio button groups (Radix UI)
- **Switch** (`switch.tsx`) - Toggle switch (Radix UI)
- **Textarea** (`textarea.tsx`) - Multi-line text input
- **Label** (`label.tsx`) - Form labels (Radix UI)
- **Form** (`form.tsx`) - Form wrapper with validation
- **Input OTP** (`input-otp.tsx`) - One-time password input
- **Slider** (`slider.tsx`) - Range slider (Radix UI)

#### Layout Components

- **Card** (`card.tsx`) - Container with header, content, footer
- **Separator** (`separator.tsx`) - Horizontal/vertical divider (Radix UI)
- **Scroll Area** (`scroll-area.tsx`) - Custom scrollable area (Radix UI)
- **Resizable** (`resizable.tsx`) - Resizable panels (Radix UI)
- **Aspect Ratio** (`aspect-ratio.tsx`) - Maintain aspect ratio (Radix UI)
- **Sidebar** (`sidebar.tsx`) - Sidebar layout (Radix UI)

#### Overlay Components

- **Dialog** (`dialog.tsx`) - Modal dialog (Radix UI)
- **Modal** (`Modal.tsx`) - Custom modal implementation
- **Sheet** (`sheet.tsx`) - Slide-in panel (Radix UI)
- **Drawer** (`drawer.tsx`) - Bottom drawer (Vaul library)
- **Popover** (`popover.tsx`) - Floating popover (Radix UI)
- **Tooltip** (`tooltip.tsx`) - Hover tooltip (Radix UI)
- **Hover Card** (`hover-card.tsx`) - Rich hover card (Radix UI)
- **Alert Dialog** (`alert-dialog.tsx`) - Confirmation dialog (Radix UI)

#### Navigation Components

- **Tabs** (`tabs.tsx`) - Tab navigation (Radix UI)
- **Navigation Menu** (`navigation-menu.tsx`) - Complex nav (Radix UI)
- **Menubar** (`menubar.tsx`) - Menu bar (Radix UI)
- **Dropdown Menu** (`dropdown-menu.tsx`) - Dropdown menu (Radix UI)
- **Context Menu** (`context-menu.tsx`) - Right-click menu (Radix UI)
- **Command** (`command.tsx`) - Command palette (cmdk)
- **Breadcrumb** (`breadcrumb.tsx`) - Breadcrumb navigation
- **Pagination** (`pagination.tsx`) - Page navigation

#### Display Components

- **Alert** (`alert.tsx`) - Alert messages
- **Badge** (`badge.tsx`) - Status badges
- **Avatar** (`avatar.tsx`) - User avatar (Radix UI)
- **Skeleton** (`skeleton.tsx`) - Loading skeleton
- **Progress** (`progress.tsx`) - Progress bar (Radix UI)
- **Table** (`table.tsx`) - Data table
- **Chart** (`chart.tsx`) - Chart wrapper for Recharts

#### Interactive Components

- **Accordion** (`accordion.tsx`) - Collapsible sections (Radix UI)
- **Collapsible** (`collapsible.tsx`) - Collapsible content (Radix UI)
- **Toggle** (`toggle.tsx`) - Toggle button (Radix UI)
- **Toggle Group** (`toggle-group.tsx`) - Toggle button group (Radix UI)
- **Carousel** (`carousel.tsx`) - Image carousel (Embla)
- **Calendar** (`calendar.tsx`) - Date picker (React Day Picker)

#### Notification

- **Sonner** (`sonner.tsx`) - Toast notifications (Sonner library)

#### Utilities

- **utils.ts** - `cn()` function for className merging
- **use-mobile.ts** - Mobile detection hook

---

## 6. Key Component Patterns

### Button Component

**File**: `components/ui/button.tsx`

**Variants** (using CVA):

```typescript
variant: {
  default: "bg-primary text-primary-foreground hover:bg-primary/90"
  destructive: "bg-destructive text-white hover:bg-destructive/90"
  outline: "border bg-background hover:bg-accent"
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  ghost: "hover:bg-accent hover:text-accent-foreground"
  link: "text-primary underline-offset-4 hover:underline"
}

size: {
  default: "h-9 px-4 py-2"
  sm: "h-8 px-3"
  lg: "h-10 px-6"
  icon: "size-9"
}
```

**Usage Example**:

```tsx
<Button variant="default" size="lg">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost" size="icon"><Icon /></Button>
```

### Card Component

**File**: `components/ui/card.tsx`

**Structure**:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
    <CardAction>Action button</CardAction>
  </CardHeader>
  <CardContent>Main content</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>
```

**Default Styles**:

- Background: `bg-card` (white)
- Border: `border` with `rounded-xl`
- Padding: `p-6` for content sections
- Gap: `gap-6` between sections

### Input Component

**File**: `components/ui/input.tsx`

**Features**:

- Height: `h-9` (36px)
- Background: `bg-input-background` (#f3f3f5)
- Border: `border-input` with `rounded-md`
- Focus state: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- Error state: `aria-invalid:border-destructive aria-invalid:ring-destructive/20`
- Placeholder: `placeholder:text-muted-foreground`

**Usage**:

```tsx
<Input type="text" placeholder="Enter text" aria-invalid={hasError} />
```

### Modal Component

**File**: `components/ui/Modal.tsx`

**Custom Implementation** (not Radix):

- Fixed overlay: `fixed inset-0 z-50`
- Backdrop: `bg-black/50 backdrop-blur-sm`
- Content: `bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl`
- Max height: `max-h-[90vh]`
- Animations: Custom `fadeIn` and `slideUp` keyframes

**Usage**:

```tsx
<Modal isOpen={open} onClose={handleClose} title="Modal Title">
  <p>Modal content</p>
</Modal>
```

### Dialog Component

**File**: `components/ui/dialog.tsx`

**Radix UI Implementation**:

```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button>Action</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Animations**: Radix provides built-in animations with data attributes:

- `data-[state=open]:fade-in-0`
- `data-[state=closed]:fade-out-0`
- `data-[state=open]:zoom-in-95`

### Select Component

**File**: `components/ui/select.tsx`

**Radix UI Implementation**:

```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

**Sizes**: `default` (h-9) and `sm` (h-8)

---

## 7. Visual Effects & Animations

### Backdrop Blur

Used extensively for glassmorphism effect:

```css
backdrop-blur-xl /* 24px blur */
backdrop-blur-sm /* 8px blur */
```

**Common Pattern**:

```tsx
className = "bg-white/80 backdrop-blur-xl";
```

### Gradients

The app heavily uses gradient backgrounds:

**Background Gradients**:

```tsx
// Page background
className = "bg-gradient-to-br from-indigo-50 via-white to-purple-50";

// Card gradients
className = "bg-gradient-to-br from-indigo-500 to-purple-600";
className = "bg-gradient-to-br from-red-500 to-pink-600";

// Progress bar gradients
className = "bg-gradient-to-r from-green-500 to-emerald-600";
className = "bg-gradient-to-r from-yellow-500 to-orange-600";
className = "bg-gradient-to-r from-red-500 to-pink-600";
```

**Text Gradients**:

```tsx
className =
  "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent";
```

### Shadows

```css
shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1)
shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1)
shadow-2xl: 0 25px 50px -12px rgba(0,0,0,0.25)
```

### Custom Animations

**Fade In Animation** (used throughout):

```css
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
```

**Usage with staggered delays**:

```tsx
<Card className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
```

**Spin Animation** (loading states):

```tsx
<div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
```

**Pulse Animation**:

```tsx
className = "animate-pulse";
```

### Transitions

```css
transition-all duration-200 /* Quick transitions */
transition-all duration-300 /* Standard transitions */
transition-all duration-500 /* Slow transitions */
transition-colors /* Color-only transitions */
```

**Easing**:

```css
--ease-out: cubic-bezier(0, 0, .2, 1)
--default-transition-timing-function: cubic-bezier(.4, 0, .2, 1)
```

### Hover & Active States

```tsx
// Hover effects
hover:bg-gray-100
hover:bg-accent
hover:text-accent-foreground
hover:opacity-100
hover:border-gray-300

// Active/pressed effects
active:scale-95 /* Slight scale down on press */

// Focus states
focus:outline-none
focus:ring-2
focus-visible:ring-ring/50
focus-visible:ring-[3px]
```

---

## 8. Icon System

### Lucide React Icons

**Version**: 0.487.0

**Common Icons Used**:

```tsx
import {
  Home,
  Receipt,
  Plus,
  Settings, // Navigation
  Wallet,
  TrendingUp,
  ArrowRight, // Dashboard
  DollarSign,
  FileText,
  Calendar, // Forms
  ArrowLeft,
  X, // Actions
  Sun,
  Moon, // Theme toggle
  CheckIcon,
  ChevronDownIcon, // UI elements
} from "lucide-react";
```

**Standard Sizes**:

- Small: `w-4 h-4` (16px)
- Medium: `w-5 h-5` (20px)
- Large: `w-6 h-6` (24px)
- Extra Large: `w-8 h-8` (32px)
- Icon in text: `w-16 h-16` (64px) for empty states

**Usage Pattern**:

```tsx
<Icon className="w-5 h-5 text-gray-500" />
```

### Emoji Icons

Used for categories:

```tsx
category.icon = "🍔"; // Food
category.icon = "🚗"; // Transport
category.icon = "🏠"; // Housing
```

---

## 9. Chart Components

### Recharts Library

**Version**: 2.15.2

**Components Used**:

- `BarChart` with `Bar`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`
- `PieChart` with `Pie`
- `ResponsiveContainer` for responsive sizing

**Bar Chart Example**:

```tsx
<ResponsiveContainer width="100%" height={200}>
  <BarChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
    <YAxis stroke="#6b7280" fontSize={12} />
    <Tooltip
      contentStyle={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
      }}
    />
    <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
      {chartData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill="#6366f1" />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>
```

**Pie Chart Example**:

```tsx
<PieChart>
  <Pie
    data={categoryTotals}
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={80}
    paddingAngle={2}
    dataKey="value"
  >
    {categoryTotals.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>
```

---

## 10. Layout Patterns

### Page Structure

```tsx
<div className="min-h-screen pb-24">
  {/* Header - Sticky */}
  <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
    <div className="max-w-screen-lg mx-auto px-4 py-4">
      {/* Header content */}
    </div>
  </header>

  {/* Main Content */}
  <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
    {/* Content cards */}
  </div>
</div>;

{
  /* Bottom Navigation - Fixed */
}
<Navigation />;
```

### Navigation Component

**File**: `components/Navigation.tsx`

**Structure**:

```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200 z-50">
  <div className="max-w-screen-lg mx-auto px-4">
    <div className="flex items-center justify-around">
      {tabs.map((tab) => (
        <Link
          to={tab.path}
          className={isActive ? "text-indigo-600" : "text-gray-500"}
        >
          <Icon className="w-6 h-6" />
          <span className="text-xs">{tab.label}</span>
        </Link>
      ))}
    </div>
  </div>
</nav>
```

**Tabs**:

- Home (`/`) - Home icon
- Expenses (`/expenses`) - Receipt icon
- Add (`/add`) - Plus icon
- Settings (`/settings`) - Settings icon

**Touch Target**: Minimum `min-h-[44px]` for accessibility

### Grid Layouts

```tsx
// 2-column grid
<div className="grid grid-cols-2 gap-4">

// 6-column grid (for color picker)
<div className="grid grid-cols-6 gap-2">

// 8-column grid (for emoji picker)
<div className="grid grid-cols-8 gap-2">
```

### Flex Layouts

```tsx
// Horizontal with space between
<div className="flex items-center justify-between">

// Vertical stack
<div className="flex flex-col gap-4">

// Centered
<div className="flex items-center justify-center">
```

---

## 11. Responsive Design

### Breakpoints

```css
--breakpoint-lg: 64rem (1024px);
```

**Usage**:

```tsx
sm:max-w-lg    /* Small screens and up */
sm:rounded-3xl /* Small screens and up */
md:text-sm     /* Medium screens and up */
```

### Mobile-First Approach

- Base styles are for mobile
- Use `sm:`, `md:`, `lg:` prefixes for larger screens
- Touch targets: minimum 44px × 44px

### Container Pattern

```tsx
className = "max-w-screen-lg mx-auto px-4";
```

- Max width: 1024px
- Centered with auto margins
- 16px horizontal padding

---

## 12. State & Interaction Patterns

### Loading States

```tsx
// Spinner
<div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />

// Button loading
<Button disabled={loading}>
  {loading ? (
    <div className="flex items-center gap-2">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
      <span>Saving...</span>
    </div>
  ) : 'Save'}
</Button>

// Skeleton
<Skeleton className="h-4 w-full" />
```

### Error States

```tsx
// Input error
<Input aria-invalid={hasError} />
{error && <p className="text-sm text-red-600">{error}</p>}

// Card error state
<Card className="border-red-200 bg-red-50">
```

### Empty States

```tsx
<Card className="p-12 text-center">
  <Icon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
  <h3 className="text-gray-900 mb-2">No Data</h3>
  <p className="text-gray-600 mb-6">Description</p>
  <Button>Call to Action</Button>
</Card>
```

### Active/Selected States

```tsx
// Navigation active
className={isActive ? 'text-indigo-600' : 'text-gray-500'}

// Button selected
className={selected
  ? 'border-indigo-500 bg-indigo-50'
  : 'border-gray-200 hover:border-gray-300'
}
```

### Progress Indicators

```tsx
// Progress bar
<div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
  <div
    className="h-full transition-all duration-500 bg-gradient-to-r from-green-500 to-emerald-600"
    style={{ width: `${percentage}%` }}
  />
</div>

// Dynamic color based on value
className={
  percentage > 100 ? 'bg-gradient-to-r from-red-500 to-pink-600' :
  percentage > 80 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
  'bg-gradient-to-r from-green-500 to-emerald-600'
}
```

---

## 13. Accessibility Features

### Focus Management

- All interactive elements have focus states
- Focus ring: `focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- Outline: `outline-none` with custom ring

### ARIA Attributes

```tsx
aria-invalid={hasError}      // For form validation
aria-label="Close"           // For icon buttons
role="button"                // For custom buttons
```

### Touch Targets

Minimum size for mobile: `min-h-[44px] min-w-[44px]`

### Screen Reader Support

```tsx
<span className="sr-only">Close</span>
```

---

## 14. Form Patterns

### Input with Icon

```tsx
<div className="relative">
  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
  <Input className="pl-12" />
</div>
```

### Form Validation

```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

const validate = () => {
  const newErrors: Record<string, string> = {};
  if (!value) newErrors.field = "Required";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

<Input aria-invalid={!!errors.field} />;
{
  errors.field && <p className="text-sm text-red-600">{errors.field}</p>;
}
```

### Category Selection Pattern

```tsx
<div className="grid grid-cols-2 gap-3">
  {categories.map((category) => (
    <button
      key={category.id}
      onClick={() => setSelected(category.id)}
      className={`p-4 rounded-xl border-2 transition-all min-h-[44px] active:scale-95 ${
        selected === category.id
          ? "border-indigo-500 bg-indigo-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{category.icon}</span>
        <span className="text-sm">{category.name}</span>
      </div>
    </button>
  ))}
</div>
```

---

## 15. Utility Functions

### cn() Function

**File**: `components/ui/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Purpose**: Intelligently merge Tailwind classes, handling conflicts

**Usage**:

```tsx
<div
  className={cn(
    "base-classes",
    condition && "conditional-classes",
    className // Allow prop override
  )}
/>
```

---

## 16. Data Visualization Patterns

### Category Breakdown Display

```tsx
{
  categoryTotals.map((category) => {
    const percentage = (category.value / category.budget) * 100;
    return (
      <div key={category.name}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{category.icon}</span>
            <span className="text-gray-700">{category.name}</span>
          </div>
          <span className="text-gray-900">${category.value.toFixed(2)}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: category.color,
            }}
          />
        </div>
      </div>
    );
  });
}
```

### Stat Cards Pattern

```tsx
<Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
  <div className="text-sm opacity-90 mb-1">Label</div>
  <div className="text-2xl mb-2">${value.toFixed(2)}</div>
  <div className="text-xs opacity-75">Subtitle</div>
</Card>
```

---

## 17. Theme Toggle (Not Implemented)

### ThemeToggle Component

**File**: `components/ThemeToggle.tsx`

**Current State**: Visual only, dark mode not active

```tsx
<button className="relative w-16 h-8 rounded-full bg-gray-200 transition-colors">
  <div
    className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
      isDark ? "left-9" : "left-1"
    }`}
  >
    {isDark ? (
      <Moon className="w-4 h-4 text-indigo-600" />
    ) : (
      <Sun className="w-4 h-4 text-yellow-500" />
    )}
  </div>
</button>
```

**To Implement Dark Mode**:

1. Add `next-themes` provider (already installed)
2. Toggle `.dark` class on root element
3. Dark mode CSS variables already defined in `globals.css`

---

## 18. Common CSS Patterns

### Glassmorphism

```tsx
className = "bg-white/80 backdrop-blur-xl";
className = "bg-white/50 backdrop-blur-sm";
```

### Text Truncation

```tsx
className = "line-clamp-2"; // 2 lines max
className = "truncate"; // Single line
```

### Overlay Pattern

```tsx
<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
```

### Gradient Text

```tsx
className =
  "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent";
```

### Smooth Transitions

```tsx
className = "transition-all duration-300";
className = "transition-colors";
className = "transition-transform";
```

### Opacity Utilities

```tsx
opacity - 20; // 20%
opacity - 75; // 75%
opacity - 90; // 90%
```

### Z-Index Layers

```css
z-40: Sticky headers
z-50: Fixed navigation, modals, overlays
```

---

## 19. File Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components (50+ files)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── Modal.tsx
│   │   ├── utils.ts
│   │   └── ...
│   ├── Dashboard.tsx          # Main dashboard page
│   ├── AddExpense.tsx         # Add expense form
│   ├── Expenses.tsx           # Expense list
│   ├── Settings.tsx           # Settings page
│   ├── Login.tsx              # Login page
│   ├── Navigation.tsx         # Bottom navigation
│   └── ThemeToggle.tsx        # Theme toggle (not active)
├── data/
│   └── mockData.ts            # Mock data and storage
├── styles/
│   └── globals.css            # Global styles and CSS variables
├── index.css                  # Tailwind CSS output
├── main.tsx                   # App entry point
└── App.tsx                    # Main app component with routing
```

---

## 20. Best Practices for AI Modifications

### When Adding New Components

1. Use existing UI components from `components/ui/`
2. Follow the established color palette (indigo/purple primary)
3. Apply glassmorphism effect to headers/navigation
4. Use `animate-fadeIn` with staggered delays for new cards
5. Ensure minimum touch target size: `min-h-[44px] min-w-[44px]`
6. Add proper focus states and ARIA attributes

### When Modifying Styles

1. Use Tailwind utility classes, not inline styles (except for dynamic values)
2. Use CSS variables for colors: `var(--color-indigo-500)`
3. Maintain consistent spacing: `gap-4`, `p-6`, `space-y-6`
4. Keep border radius consistent: `rounded-xl` for cards, `rounded-md` for inputs
5. Use `cn()` utility for conditional classes

### When Creating Forms

1. Use `Input` component from `components/ui/input.tsx`
2. Add icons with absolute positioning: `absolute left-4 top-1/2 -translate-y-1/2`
3. Show validation errors below inputs: `text-sm text-red-600`
4. Use `aria-invalid` for error states
5. Disable buttons during loading with spinner

### When Adding Animations

1. Use existing animations: `animate-fadeIn`, `animate-spin`, `animate-pulse`
2. Add staggered delays with inline styles: `style={{ animationDelay: '0.1s' }}`
3. Use `transition-all duration-300` for smooth transitions
4. Apply `active:scale-95` for button press feedback

### Color Usage Guidelines

- **Primary actions**: Indigo/purple gradient
- **Destructive actions**: Red gradient
- **Success states**: Green gradient
- **Warning states**: Yellow/orange gradient
- **Neutral backgrounds**: Gray-50 to gray-200
- **Text**: Gray-900 (headings), gray-700 (body), gray-600 (secondary)

### Layout Guidelines

1. Wrap pages in: `<div className="min-h-screen pb-24">`
2. Use sticky header: `sticky top-0 z-40`
3. Container: `max-w-screen-lg mx-auto px-4 py-6`
4. Card spacing: `space-y-6` between cards
5. Grid for equal columns: `grid grid-cols-2 gap-4`

---

## 21. Common Component Combinations

### Header with Back Button

```tsx
<header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
  <div className="max-w-screen-lg mx-auto px-4 py-4">
    <div className="flex items-center gap-3">
      <button
        onClick={() => navigate(-1)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors min-h-[44px] min-w-[44px]"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h1 className="text-gray-900">Page Title</h1>
    </div>
  </div>
</header>
```

### Action Button Group

```tsx
<div className="grid grid-cols-2 gap-4">
  <Button variant="secondary" onClick={onCancel}>
    Cancel
  </Button>
  <Button onClick={onSave}>Save</Button>
</div>
```

### Stat Card with Icon

```tsx
<Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
  <div className="flex items-center gap-3 mb-4">
    <div className="bg-white/20 p-2 rounded-xl">
      <Icon className="w-6 h-6" />
    </div>
    <h3>Title</h3>
  </div>
  <div className="text-3xl mb-1">${value}</div>
  <div className="text-sm opacity-75">Description</div>
</Card>
```

### List Item with Action

```tsx
<div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
      <Icon className="w-6 h-6 text-indigo-600" />
    </div>
    <div>
      <h4 className="text-gray-900">Title</h4>
      <p className="text-sm text-gray-600">Subtitle</p>
    </div>
  </div>
  <Button variant="ghost" size="icon">
    <ChevronRight className="w-5 h-5" />
  </Button>
</div>
```

---

## 22. Performance Considerations

### Image Optimization

- Use `ImageWithFallback` component from `components/figma/ImageWithFallback.tsx`
- Apply `object-cover` for consistent sizing
- Use `loading="lazy"` for off-screen images

### Animation Performance

- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` directly
- Use `will-change` sparingly

### Conditional Rendering

```tsx
{
  items.length > 0 ? <ItemList items={items} /> : <EmptyState />;
}
```

---

## 23. Testing Considerations

### Accessibility Testing

- Ensure all interactive elements are keyboard accessible
- Test with screen readers
- Verify color contrast ratios (WCAG AA minimum)
- Check touch target sizes on mobile

### Responsive Testing

- Test on mobile (320px - 768px)
- Test on tablet (768px - 1024px)
- Test on desktop (1024px+)

---

## 24. Quick Reference

### Most Used Tailwind Classes

```css
/* Layout */
flex items-center justify-between
grid grid-cols-2 gap-4
max-w-screen-lg mx-auto px-4 py-6
space-y-6

/* Spacing */
p-6 (24px padding)
gap-4 (16px gap)
mb-4 (16px margin-bottom)

/* Colors */
bg-white text-gray-900
bg-indigo-500 text-white
border-gray-200

/* Effects */
rounded-xl shadow-lg
backdrop-blur-xl
transition-all duration-300

/* Interactive */
hover:bg-gray-100
active:scale-95
focus-visible:ring-ring/50
```

### Component Import Paths

```typescript
// UI Components
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Dialog } from "./components/ui/dialog";
import { Select } from "./components/ui/select";

// Icons
import { Icon } from "lucide-react";

// Charts
import { BarChart, Bar, PieChart, Pie } from "recharts";

// Utilities
import { cn } from "./components/ui/utils";
```

### Color Variables Quick Reference

```typescript
// Use in className
className="bg-indigo-500 text-white"
className="border-gray-200"
className="text-gray-900"

// Use in style (for dynamic colors)
style={{ backgroundColor: category.color }}
style={{ color: 'var(--color-indigo-600)' }}
```

---

## 25. Common Pitfalls to Avoid

1. **Don't mix inline styles with Tailwind** (except for dynamic values)
2. **Don't forget `pb-24`** on pages with bottom navigation
3. **Don't use arbitrary values** when Tailwind utilities exist
4. **Don't forget touch targets** - minimum 44px × 44px
5. **Don't skip focus states** - always add focus-visible styles
6. **Don't hardcode colors** - use CSS variables or Tailwind classes
7. **Don't forget animations** - use `animate-fadeIn` for new content
8. **Don't skip responsive design** - test on mobile first

---

## 26. Version Information

### Package Versions (Critical for Compatibility)

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "*",
  "lucide-react": "^0.487.0",
  "recharts": "^2.15.2",
  "class-variance-authority": "^0.7.1",
  "clsx": "*",
  "tailwind-merge": "*",
  "next-themes": "^0.4.6",

  "@radix-ui/react-dialog": "^1.1.6",
  "@radix-ui/react-select": "^2.1.6",
  "@radix-ui/react-slot": "^1.1.2",
  "@radix-ui/react-accordion": "^1.2.3",
  "@radix-ui/react-alert-dialog": "^1.1.6",
  "@radix-ui/react-avatar": "^1.1.3",
  "@radix-ui/react-checkbox": "^1.1.4",
  "@radix-ui/react-dropdown-menu": "^2.1.6",
  "@radix-ui/react-popover": "^1.1.6",
  "@radix-ui/react-switch": "^1.1.3",
  "@radix-ui/react-tabs": "^1.1.3",
  "@radix-ui/react-tooltip": "^1.1.8",

  "sonner": "^2.0.3",
  "vaul": "^1.1.2",
  "embla-carousel-react": "^8.6.0",
  "react-day-picker": "^8.10.1",
  "react-hook-form": "^7.55.0",
  "cmdk": "^1.1.1"
}
```

### Build Tool

- **Vite**: 6.3.5
- **Plugin**: @vitejs/plugin-react-swc ^3.10.2

---

## 27. Summary

This Money Manager app uses a **modern, gradient-heavy design** with:

- **Tailwind CSS v4** for utility-first styling
- **Radix UI** for accessible, headless components
- **Lucide React** for consistent iconography
- **Recharts** for data visualization
- **Glassmorphism** effects throughout (backdrop-blur)
- **Indigo/Purple** as primary brand colors
- **Smooth animations** with fadeIn and transitions
- **Mobile-first** responsive design
- **Accessibility-focused** with proper ARIA and focus states

The design emphasizes:

- Clean, modern aesthetics
- Smooth user interactions
- Visual hierarchy with gradients and shadows
- Consistent spacing and typography
- Touch-friendly mobile interface

All components follow a consistent pattern and can be easily extended or modified while maintaining the design system integrity.

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**For**: AI Model UI Modifications
