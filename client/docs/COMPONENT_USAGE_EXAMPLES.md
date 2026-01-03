# Component Usage Examples

## Button Examples

### Basic Button

```tsx
import { Button } from "@/components/ui/button";

function Example() {
  return <Button>Click me</Button>;
}
```

### Button Variants

```tsx
<Button variant="default">Primary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link Button</Button>
```

### Button Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### Loading Button

```tsx
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function Example() {
  const [loading, setLoading] = useState(false);

  return (
    <Button loading={loading} onClick={() => setLoading(true)}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Save Changes
    </Button>
  );
}
```

### Icon Button

```tsx
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function Example() {
  return (
    <Button variant="ghost" size="icon" aria-label="Delete">
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
```

---

## Input Examples

### Basic Input

```tsx
import { Input } from "@/components/ui/input";

function Example() {
  return <Input placeholder="Enter your name" />;
}
```

### Input with Label

```tsx
<div className="space-y-2">
  <label htmlFor="email" className="text-sm font-medium">
    Email
  </label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

### Input with Error

```tsx
import { Input } from "@/components/ui/input";

function Example() {
  const [error, setError] = useState("");

  return (
    <Input
      type="email"
      placeholder="Email"
      error={error}
      aria-invalid={!!error}
    />
  );
}
```

### Input with Icon

```tsx
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function Example() {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      <Input className="pl-10" placeholder="Search..." />
    </div>
  );
}
```

---

## Card Examples

### Basic Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
    </Card>
  );
}
```

### Card with Description

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>Your spending for this month</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">$1,234.56</p>
      </CardContent>
    </Card>
  );
}
```

### Card with Footer

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirm Action</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Are you sure you want to proceed?</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </CardFooter>
    </Card>
  );
}
```

### Interactive Card

```tsx
<Card
  className="cursor-pointer hover:shadow-lg transition-shadow"
  onClick={() => console.log("Card clicked")}
>
  <CardContent className="p-6">
    <p>Click me!</p>
  </CardContent>
</Card>
```

---

## Dialog Examples

### Basic Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function Example() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>This is a dialog description.</DialogDescription>
        </DialogHeader>
        <p>Dialog content goes here.</p>
      </DialogContent>
    </Dialog>
  );
}
```

### Dialog with Form

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Example() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Add Item</Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <Input placeholder="Item name" />
            <Input type="number" placeholder="Amount" />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Select Examples

### Basic Select

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Example() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

### Controlled Select

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Example() {
  const [value, setValue] = useState("");

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger>
        <SelectValue placeholder="Choose category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="food">🍔 Food</SelectItem>
        <SelectItem value="transport">🚗 Transport</SelectItem>
        <SelectItem value="housing">🏠 Housing</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

### Select with Groups

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Example() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Essential</SelectLabel>
          <SelectItem value="food">Food</SelectItem>
          <SelectItem value="housing">Housing</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Optional</SelectLabel>
          <SelectItem value="entertainment">Entertainment</SelectItem>
          <SelectItem value="shopping">Shopping</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
```

---

## Checkbox Examples

### Basic Checkbox

```tsx
import { Checkbox } from "@/components/ui/checkbox";

function Example() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label htmlFor="terms" className="text-sm">
        Accept terms and conditions
      </label>
    </div>
  );
}
```

### Controlled Checkbox

```tsx
import { Checkbox } from "@/components/ui/checkbox";

function Example() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="notifications"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <label htmlFor="notifications" className="text-sm">
        Enable notifications
      </label>
    </div>
  );
}
```

---

## Switch Examples

### Basic Switch

```tsx
import { Switch } from "@/components/ui/switch";

function Example() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <label htmlFor="airplane-mode" className="text-sm">
        Airplane Mode
      </label>
    </div>
  );
}
```

### Controlled Switch

```tsx
import { Switch } from "@/components/ui/switch";

function Example() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <label htmlFor="dark-mode" className="text-sm font-medium">
        Dark Mode
      </label>
      <Switch id="dark-mode" checked={enabled} onCheckedChange={setEnabled} />
    </div>
  );
}
```

---

## Tabs Examples

### Basic Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Example() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content for Tab 1</TabsContent>
      <TabsContent value="tab2">Content for Tab 2</TabsContent>
      <TabsContent value="tab3">Content for Tab 3</TabsContent>
    </Tabs>
  );
}
```

### Controlled Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Example() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview content</TabsContent>
      <TabsContent value="analytics">Analytics content</TabsContent>
      <TabsContent value="settings">Settings content</TabsContent>
    </Tabs>
  );
}
```

---

## Tooltip Examples

### Basic Tooltip

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

function Example() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is a tooltip</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

### Tooltip with Icon

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

function Example() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center">
            <Info className="h-4 w-4 text-gray-500" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Additional information</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

---

## Alert Examples

### Basic Alert

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function Example() {
  return (
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  );
}
```

### Destructive Alert

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function Example() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  );
}
```

---

## Badge Examples

### Basic Badges

```tsx
import { Badge } from "@/components/ui/badge";

function Example() {
  return (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}
```

### Status Badges

```tsx
import { Badge } from "@/components/ui/badge";

function Example() {
  return (
    <div className="flex gap-2">
      <Badge className="bg-green-500">Active</Badge>
      <Badge className="bg-yellow-500">Pending</Badge>
      <Badge className="bg-red-500">Inactive</Badge>
    </div>
  );
}
```

---

## Skeleton Examples

### Basic Skeleton

```tsx
import { Skeleton } from "@/components/ui/skeleton";

function Example() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  );
}
```

### Card Skeleton

```tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Example() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
}
```

---

## Progress Examples

### Basic Progress

```tsx
import { Progress } from "@/components/ui/progress";

function Example() {
  return <Progress value={60} />;
}
```

### Animated Progress

```tsx
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

function Example() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return <Progress value={progress} />;
}
```
