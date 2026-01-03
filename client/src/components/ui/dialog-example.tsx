import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "./dialog";
import { Button } from "./button";

export function DialogExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Dialog Component Example</h2>

      {/* Basic Dialog */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Basic Dialog</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a dialog description. It provides additional context
                about the dialog.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm">
                This is the main content of the dialog. You can put any content
                here.
              </p>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="default">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Controlled Dialog */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Controlled Dialog</h3>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open Controlled Dialog
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Controlled Dialog</DialogTitle>
              <DialogDescription>
                This dialog is controlled by React state.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm">
                You can control the open/close state programmatically.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dialog with Form */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Dialog with Form</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open Form Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-sm"
                  placeholder="Enter your name"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="default">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Destructive Dialog */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Destructive Dialog</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                item.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Features Tested:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>✓ Glassmorphism effect (backdrop-blur-xl with bg-white/80)</li>
          <li>✓ ARIA attributes (aria-label on close button, sr-only text)</li>
          <li>✓ Keyboard navigation (Escape to close)</li>
          <li>✓ Focus management (auto-focus on open)</li>
          <li>✓ Smooth animations (fade-in, zoom-in)</li>
          <li>✓ Responsive design (mobile-friendly)</li>
          <li>✓ Touch target compliance (44px × 44px close button)</li>
          <li>✓ Dark mode support</li>
        </ul>
      </div>
    </div>
  );
}
