# Dialog Component Documentation

## Overview

The Dialog component is built using Radix UI's Dialog primitive and provides a fully accessible, keyboard-navigable modal dialog with glassmorphism effects.

## Features

✅ **Glassmorphism Effect**: Uses `backdrop-blur-xl` with `bg-white/80` transparency  
✅ **ARIA Attributes**: Includes proper `aria-label` and `sr-only` text for accessibility  
✅ **Keyboard Navigation**: Supports Escape key to close, Tab for focus management  
✅ **Focus Management**: Auto-focuses on open, traps focus within dialog  
✅ **Smooth Animations**: Fade-in, zoom-in, and slide animations  
✅ **Responsive Design**: Mobile-friendly with proper touch targets  
✅ **Touch Target Compliance**: Close button is 44px × 44px minimum  
✅ **Dark Mode Support**: Automatically adapts to dark theme

## Requirements Validated

- **4.3**: Overlay components (Dialog) with consistent behavior
- **8.1**: Glassmorphism effect using backdrop-blur-xl
- **15.2**: ARIA attributes (aria-label, sr-only)
- **15.5**: Keyboard navigation (Escape to close)

## Installation

The component requires the following dependencies (already installed):

```bash
npm install @radix-ui/react-dialog lucide-react
```

## Basic Usage

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function MyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of the dialog.
          </DialogDescription>
        </DialogHeader>
        <div>{/* Your content here */}</div>
      </DialogContent>
    </Dialog>
  );
}
```

## Controlled Dialog

```tsx
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function ControlledDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>{/* Content */}</DialogContent>
      </Dialog>
    </>
  );
}
```

## Dialog with Footer

```tsx
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DialogWithFooter() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## Dialog with Form

```tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function FormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name">Name</label>
            <Input id="name" placeholder="Enter name" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" placeholder="Enter email" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## API Reference

### Dialog

The root component that manages the dialog state.

**Props:**

- `open?: boolean` - Controlled open state
- `onOpenChange?: (open: boolean) => void` - Callback when open state changes
- `defaultOpen?: boolean` - Default open state (uncontrolled)
- `modal?: boolean` - Whether to render as modal (default: true)

### DialogTrigger

The button that opens the dialog.

**Props:**

- `asChild?: boolean` - Merge props with child element (recommended)

### DialogContent

The dialog content container with glassmorphism effect.

**Props:**

- `className?: string` - Additional CSS classes
- All standard div props

**Styling:**

- Glassmorphism: `bg-white/80 backdrop-blur-xl`
- Dark mode: `dark:bg-card/80 dark:backdrop-blur-xl`
- Border radius: `rounded-xl`
- Max width: `max-w-lg`
- Padding: `p-6`
- Gap: `gap-4`

### DialogHeader

Container for dialog title and description.

**Props:**

- `className?: string` - Additional CSS classes

### DialogTitle

The dialog title (required for accessibility).

**Props:**

- `className?: string` - Additional CSS classes

### DialogDescription

The dialog description (recommended for accessibility).

**Props:**

- `className?: string` - Additional CSS classes

### DialogFooter

Container for dialog action buttons.

**Props:**

- `className?: string` - Additional CSS classes

### DialogClose

Button to close the dialog.

**Props:**

- `asChild?: boolean` - Merge props with child element

## Accessibility

### ARIA Attributes

- `aria-label="Close dialog"` on close button
- `<span className="sr-only">Close</span>` for screen readers
- Radix UI automatically adds:
  - `role="dialog"`
  - `aria-modal="true"`
  - `aria-labelledby` (links to DialogTitle)
  - `aria-describedby` (links to DialogDescription)

### Keyboard Navigation

- **Escape**: Closes the dialog
- **Tab**: Cycles through focusable elements
- **Shift + Tab**: Cycles backwards
- **Enter/Space**: Activates focused button

### Focus Management

- Auto-focuses first focusable element on open
- Traps focus within dialog
- Returns focus to trigger on close
- Close button has 44px × 44px touch target

## Styling

### Glassmorphism Effect

The dialog uses a glassmorphism effect with:

- `backdrop-blur-xl` for blur effect
- `bg-white/80` for semi-transparent background
- `dark:bg-card/80` for dark mode

### Animations

- **Open**: Fade-in, zoom-in, slide-in from center
- **Close**: Fade-out, zoom-out, slide-out to center
- Duration: 200ms

### Customization

You can customize the dialog by passing `className`:

```tsx
<DialogContent className="max-w-2xl">{/* Wider dialog */}</DialogContent>
```

## Best Practices

1. **Always include DialogTitle** for accessibility
2. **Use DialogDescription** to provide context
3. **Use asChild prop** on DialogTrigger and DialogClose for proper button styling
4. **Keep dialogs focused** - one primary action per dialog
5. **Use DialogFooter** for action buttons
6. **Test keyboard navigation** - ensure all interactive elements are reachable

## Common Patterns

### Confirmation Dialog

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Alert Dialog

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Show Alert</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Important Notice</DialogTitle>
      <DialogDescription>
        Please read this important information.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild>
        <Button>OK</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Troubleshooting

### Dialog doesn't close on Escape

- Ensure you're not preventing default on keydown events
- Check if focus is trapped correctly

### Dialog content is cut off

- Add `max-h-[90vh] overflow-y-auto` to DialogContent
- Ensure parent containers don't have `overflow: hidden`

### Animations not working

- Ensure Tailwind CSS is properly configured
- Check that animation classes are not being purged

### Close button not visible

- Check z-index conflicts
- Ensure the button is not covered by other elements

## Related Components

- [Button](./button.tsx) - Used for dialog triggers and actions
- [Input](./input.tsx) - Used in form dialogs
- [Card](./card.tsx) - Alternative container component

## References

- [Radix UI Dialog Documentation](https://www.radix-ui.com/docs/primitives/components/dialog)
- [WCAG 2.1 Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
