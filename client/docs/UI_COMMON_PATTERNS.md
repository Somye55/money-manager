# UI Common Patterns

## Glassmorphism Effect

Glassmorphism creates a frosted glass appearance using backdrop blur and transparency.

### Basic Glassmorphism

```tsx
<div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-xl">
  Content with glass effect
</div>
```

### Dark Mode Glassmorphism

```tsx
<div className="backdrop-blur-xl bg-white/80 dark:bg-black/80 border border-white/20 dark:border-white/10 rounded-xl">
  Theme-aware glass effect
</div>
```

### Navigation with Glassmorphism

```tsx
<nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-t border-gray-200/50">
  <div className="flex justify-around p-4">{/* Navigation items */}</div>
</nav>
```

### Header with Glassmorphism

```tsx
<header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200/50">
  <div className="max-w-screen-lg mx-auto px-4 py-4">
    <h1>Page Title</h1>
  </div>
</header>
```

### Modal with Glassmorphism

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

  {/* Modal */}
  <div className="relative backdrop-blur-xl bg-white/90 rounded-2xl p-6 shadow-2xl">
    Modal content
  </div>
</div>
```

---

## Gradient Patterns

The app uses indigo/purple gradients for primary elements.

### Background Gradient

```tsx
<div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl">
  Gradient background
</div>
```

### Text Gradient

```tsx
<h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
  Gradient Text
</h1>
```

### Button with Gradient

```tsx
<button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all">
  Gradient Button
</button>
```

### Card with Gradient Border

```tsx
<div className="relative p-6 rounded-xl bg-white">
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl opacity-10" />
  <div className="relative">Card content</div>
</div>
```

### Progress Bar with Gradient

```tsx
<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
  <div
    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
    style={{ width: "60%" }}
  />
</div>
```

### Gradient Overlay

```tsx
<div className="relative">
  <img src="image.jpg" alt="Background" className="w-full h-64 object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
  <div className="absolute bottom-4 left-4 text-white">
    <h2>Overlay Content</h2>
  </div>
</div>
```

---

## Animation Patterns

### Fade In Animation

```tsx
// CSS (in index.css)
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

// Usage
<div className="animate-fadeIn">
  Content fades in
</div>
```

### Staggered Fade In

```tsx
<div className="space-y-4">
  <div className="animate-fadeIn" style={{ animationDelay: "0ms" }}>
    Item 1
  </div>
  <div className="animate-fadeIn" style={{ animationDelay: "100ms" }}>
    Item 2
  </div>
  <div className="animate-fadeIn" style={{ animationDelay: "200ms" }}>
    Item 3
  </div>
</div>
```

### Loading Spinner

```tsx
import { Loader2 } from "lucide-react";

<Loader2 className="h-6 w-6 animate-spin text-indigo-600" />;
```

### Pulse Animation

```tsx
<div className="animate-pulse bg-gray-200 h-4 w-full rounded" />
```

### Hover Scale

```tsx
<div className="transition-transform hover:scale-105 cursor-pointer">
  Scales on hover
</div>
```

### Slide In from Bottom

```tsx
<div className="animate-in slide-in-from-bottom duration-300">
  Slides in from bottom
</div>
```

### Bounce Animation

```tsx
<div className="animate-bounce">Bouncing element</div>
```

---

## Layout Patterns

### Page Layout

```tsx
function Page() {
  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80">
        <div className="max-w-screen-lg mx-auto px-4 py-4">
          <h1>Page Title</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-lg mx-auto px-4 py-6 space-y-6">
        {/* Content */}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        {/* Navigation items */}
      </nav>
    </div>
  );
}
```

### Two-Column Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

### Three-Column Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Centered Container

```tsx
<div className="flex items-center justify-center min-h-screen">
  <div className="max-w-md w-full p-6">Centered content</div>
</div>
```

### Sidebar Layout

```tsx
<div className="flex min-h-screen">
  {/* Sidebar */}
  <aside className="w-64 bg-gray-100 p-4">Sidebar</aside>

  {/* Main Content */}
  <main className="flex-1 p-6">Main content</main>
</div>
```

---

## Form Patterns

### Basic Form

```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <div className="space-y-2">
    <label htmlFor="name" className="text-sm font-medium">
      Name
    </label>
    <Input id="name" placeholder="Enter your name" />
  </div>

  <div className="space-y-2">
    <label htmlFor="email" className="text-sm font-medium">
      Email
    </label>
    <Input id="email" type="email" placeholder="you@example.com" />
  </div>

  <Button type="submit" className="w-full">
    Submit
  </Button>
</form>
```

### Form with Validation

```tsx
function FormWithValidation() {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          error={errors.email}
          aria-invalid={!!errors.email}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Form with Loading State

```tsx
function FormWithLoading() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Submit logic
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Enter data" disabled={loading} />
      <Button type="submit" loading={loading} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
```

### Multi-Step Form

```tsx
function MultiStepForm() {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex gap-2">
        <div
          className={cn(
            "h-2 flex-1 rounded-full",
            step >= 1 ? "bg-indigo-600" : "bg-gray-200"
          )}
        />
        <div
          className={cn(
            "h-2 flex-1 rounded-full",
            step >= 2 ? "bg-indigo-600" : "bg-gray-200"
          )}
        />
        <div
          className={cn(
            "h-2 flex-1 rounded-full",
            step >= 3 ? "bg-indigo-600" : "bg-gray-200"
          )}
        />
      </div>

      {/* Step Content */}
      {step === 1 && <Step1 onNext={() => setStep(2)} />}
      {step === 2 && (
        <Step2 onNext={() => setStep(3)} onBack={() => setStep(1)} />
      )}
      {step === 3 && <Step3 onBack={() => setStep(2)} />}
    </div>
  );
}
```

---

## Card Patterns

### Stats Card

```tsx
<Card>
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Total Revenue</p>
        <p className="text-2xl font-bold">$12,345</p>
      </div>
      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
        <DollarSign className="h-6 w-6 text-indigo-600" />
      </div>
    </div>
  </CardContent>
</Card>
```

### Action Card

```tsx
<Card className="cursor-pointer hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button variant="ghost" className="ml-auto">
      View Details →
    </Button>
  </CardFooter>
</Card>
```

### Image Card

```tsx
<Card className="overflow-hidden">
  <img src="image.jpg" alt="Card image" className="w-full h-48 object-cover" />
  <CardHeader>
    <CardTitle>Image Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card with image</p>
  </CardContent>
</Card>
```

### Gradient Card

```tsx
<Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
  <CardHeader>
    <CardTitle>Gradient Card</CardTitle>
    <CardDescription className="text-white/80">
      Card with gradient background
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-white/90">Content</p>
  </CardContent>
</Card>
```

---

## List Patterns

### Simple List

```tsx
<div className="space-y-2">
  {items.map((item) => (
    <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50">
      {item.name}
    </div>
  ))}
</div>
```

### List with Actions

```tsx
<div className="space-y-2">
  {items.map((item) => (
    <div
      key={item.id}
      className="flex items-center justify-between p-4 border rounded-lg"
    >
      <span>{item.name}</span>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ))}
</div>
```

### Card List

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {items.map((item) => (
    <Card key={item.id}>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{item.description}</p>
      </CardContent>
    </Card>
  ))}
</div>
```

---

## Empty State Patterns

### Basic Empty State

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
    <Inbox className="h-8 w-8 text-gray-400" />
  </div>
  <h3 className="text-lg font-medium mb-2">No items yet</h3>
  <p className="text-sm text-muted-foreground mb-4">
    Get started by creating your first item
  </p>
  <Button>Create Item</Button>
</div>
```

### Empty State with Illustration

```tsx
<div className="flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto">
  <img src="/empty-state.svg" alt="Empty state" className="w-48 h-48 mb-6" />
  <h3 className="text-xl font-medium mb-2">Nothing to see here</h3>
  <p className="text-muted-foreground mb-6">
    Start by adding your first item to get started
  </p>
  <Button size="lg">Get Started</Button>
</div>
```

---

## Loading State Patterns

### Skeleton Loading

```tsx
<div className="space-y-4">
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-12 w-full" />
  <Skeleton className="h-12 w-3/4" />
</div>
```

### Card Skeleton

```tsx
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-4 w-1/3" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-20 w-full" />
  </CardContent>
</Card>
```

### Spinner Loading

```tsx
<div className="flex items-center justify-center py-12">
  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
</div>
```

### Loading Overlay

```tsx
{
  loading && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
```

---

## Error State Patterns

### Inline Error

```tsx
<div className="rounded-lg border border-red-200 bg-red-50 p-4">
  <div className="flex items-start gap-3">
    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
    <div>
      <h4 className="text-sm font-medium text-red-900">Error</h4>
      <p className="text-sm text-red-700 mt-1">
        Something went wrong. Please try again.
      </p>
    </div>
  </div>
</div>
```

### Error Alert

```tsx
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>
```

### Error Page

```tsx
<div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
  <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
    <AlertCircle className="h-10 w-10 text-red-600" />
  </div>
  <h1 className="text-3xl font-bold mb-2">Oops! Something went wrong</h1>
  <p className="text-muted-foreground mb-6 max-w-md">
    We encountered an error while processing your request. Please try again
    later.
  </p>
  <div className="flex gap-4">
    <Button variant="outline" onClick={() => window.location.reload()}>
      Refresh Page
    </Button>
    <Button onClick={() => window.history.back()}>Go Back</Button>
  </div>
</div>
```

---

## Modal Patterns

### Confirmation Modal

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your data.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleConfirm}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Form Modal

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add New Item</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Item name" />
      <Input type="number" placeholder="Amount" />
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

---

## Navigation Patterns

### Bottom Navigation

```tsx
<nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-t">
  <div className="flex justify-around p-2">
    <button className="flex flex-col items-center gap-1 p-2 min-h-[44px] min-w-[44px]">
      <Home className="h-5 w-5" />
      <span className="text-xs">Home</span>
    </button>
    <button className="flex flex-col items-center gap-1 p-2 min-h-[44px] min-w-[44px]">
      <List className="h-5 w-5" />
      <span className="text-xs">List</span>
    </button>
    <button className="flex flex-col items-center gap-1 p-2 min-h-[44px] min-w-[44px]">
      <Plus className="h-5 w-5" />
      <span className="text-xs">Add</span>
    </button>
    <button className="flex flex-col items-center gap-1 p-2 min-h-[44px] min-w-[44px]">
      <Settings className="h-5 w-5" />
      <span className="text-xs">Settings</span>
    </button>
  </div>
</nav>
```

### Tab Navigation

```tsx
<Tabs defaultValue="overview">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="analytics">Analytics content</TabsContent>
  <TabsContent value="settings">Settings content</TabsContent>
</Tabs>
```
