/**
 * Modern UI Components Demo
 *
 * Demonstrates the redesigned core UI components with all their variants
 * and features. This component showcases the modern design system in action.
 */

import * as React from "react";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  FormField,
  Icon,
  IconButton,
  IconWithBadge,
} from "@/components/ui";
import {
  Heart,
  Star,
  Download,
  Settings,
  Bell,
  Search,
  Plus,
  Check,
  X,
  Mail,
  Lock,
  User,
} from "lucide-react";

export const ModernUIDemo: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-neutral-900">
            Modern UI Components
          </h1>
          <p className="text-lg text-neutral-600">
            Redesigned core components with modern styling and enhanced
            functionality
          </p>
        </div>

        {/* Button Variants */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle size="lg">Button Components</CardTitle>
            <CardDescription>
              Multiple variants with loading states and icon support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Buttons */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-800">
                Primary Variants
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="destructive">Danger</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-800">Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            {/* Button States */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-800">
                States & Features
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button loading={loading} onClick={() => setLoading(!loading)}>
                  {loading ? "Loading..." : "Toggle Loading"}
                </Button>
                <Button icon={<Download />} iconPosition="left">
                  Download
                </Button>
                <Button icon={<Plus />} iconPosition="right">
                  Add Item
                </Button>
                <Button fullWidth className="max-w-xs">
                  Full Width
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Icon System */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle size="lg">Icon System</CardTitle>
            <CardDescription>
              Consistent icons with proper sizing and interactive states
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Icon Sizes */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-800">
                Icon Sizes
              </h3>
              <div className="flex items-center gap-4">
                <Icon icon={Heart} size="xs" label="Extra Small" />
                <Icon icon={Heart} size="sm" label="Small" />
                <Icon icon={Heart} size="md" label="Medium" />
                <Icon icon={Heart} size="lg" label="Large" />
                <Icon icon={Heart} size="xl" label="Extra Large" />
                <Icon icon={Heart} size="2xl" label="2X Large" />
              </div>
            </div>

            {/* Icon Variants */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-800">
                Icon Variants
              </h3>
              <div className="flex items-center gap-4">
                <Icon icon={Star} variant="default" label="Default" />
                <Icon icon={Star} variant="primary" label="Primary" />
                <Icon icon={Star} variant="secondary" label="Secondary" />
                <Icon icon={Star} variant="success" label="Success" />
                <Icon icon={Star} variant="warning" label="Warning" />
                <Icon icon={Star} variant="danger" label="Danger" />
                <Icon icon={Star} variant="muted" label="Muted" />
              </div>
            </div>

            {/* Icon Buttons */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-800">
                Icon Buttons
              </h3>
              <div className="flex items-center gap-3">
                <IconButton icon={Settings} label="Settings" />
                <IconButton
                  icon={Bell}
                  variant="primary"
                  label="Notifications"
                />
                <IconButton icon={Heart} variant="danger" label="Like" />
                <IconButton
                  icon={Download}
                  variant="success"
                  label="Download"
                />
                <IconButton icon={X} variant="ghost" label="Close" />
              </div>
            </div>

            {/* Icons with Badges */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-800">
                Icons with Badges
              </h3>
              <div className="flex items-center gap-4">
                <IconWithBadge icon={Bell} badge={3} label="Notifications" />
                <IconWithBadge
                  icon={Mail}
                  badge={12}
                  badgeVariant="primary"
                  label="Messages"
                />
                <IconWithBadge
                  icon={Heart}
                  badge="99+"
                  badgeVariant="danger"
                  label="Likes"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Components */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle size="lg">Input Components</CardTitle>
            <CardDescription>
              Enhanced form inputs with validation and icon support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Inputs */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-800">
                Input Variants
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="Default input" />
                <Input placeholder="Filled input" variant="filled" />
                <Input placeholder="Outlined input" variant="outlined" />
              </div>
            </div>

            {/* Input States */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-800">
                Input States
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Normal state" />
                <Input
                  placeholder="Error state"
                  error="This field is required"
                />
                <Input placeholder="Success state" success />
                <Input placeholder="Disabled state" disabled />
              </div>
            </div>

            {/* Inputs with Icons */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-800">
                Inputs with Icons
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Search..."
                  icon={<Search />}
                  iconPosition="left"
                />
                <Input
                  placeholder="Enter email"
                  type="email"
                  icon={<Mail />}
                  iconPosition="left"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Fields */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle size="lg">Form Components</CardTitle>
            <CardDescription>
              Complete form fields with labels, validation, and helper text
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                icon={<User />}
                iconPosition="left"
                required
                description="This will be displayed on your profile"
              />

              <FormField
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                icon={<Mail />}
                iconPosition="left"
                required
                error={
                  formData.email && !formData.email.includes("@")
                    ? "Please enter a valid email"
                    : undefined
                }
              />

              <FormField
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                icon={<Lock />}
                iconPosition="left"
                required
                helperText="Must be at least 8 characters long"
                error={
                  formData.password && formData.password.length < 8
                    ? "Password must be at least 8 characters"
                    : undefined
                }
              />

              <FormField
                label="Optional Field"
                placeholder="This field is optional"
                showOptional
                description="You can leave this blank if you want"
              />

              <div className="flex gap-3">
                <Button type="submit" loading={loading}>
                  Submit Form
                </Button>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Card Variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="default" padding="lg">
            <CardHeader variant="compact">
              <CardTitle size="md">Default Card</CardTitle>
              <CardDescription>
                Standard card with subtle shadow
              </CardDescription>
            </CardHeader>
            <CardContent variant="compact">
              <p className="text-sm text-neutral-600">
                This is a default card with standard styling and shadow.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated" padding="lg" hover>
            <CardHeader variant="compact">
              <CardTitle size="md">Elevated Card</CardTitle>
              <CardDescription>Card with prominent shadow</CardDescription>
            </CardHeader>
            <CardContent variant="compact">
              <p className="text-sm text-neutral-600">
                This card has more prominent shadows and hover effects.
              </p>
            </CardContent>
          </Card>

          <Card variant="interactive" padding="lg" interactive>
            <CardHeader variant="compact">
              <CardTitle size="md">Interactive Card</CardTitle>
              <CardDescription>Clickable card with animations</CardDescription>
            </CardHeader>
            <CardContent variant="compact">
              <p className="text-sm text-neutral-600">
                This card is interactive with hover and click animations.
              </p>
            </CardContent>
            <CardFooter variant="compact" justify="end">
              <Button size="sm" variant="ghost">
                Learn More
              </Button>
            </CardFooter>
          </Card>

          <Card variant="outlined" padding="lg">
            <CardHeader variant="compact">
              <CardTitle size="md">Outlined Card</CardTitle>
              <CardDescription>Card with prominent border</CardDescription>
            </CardHeader>
            <CardContent variant="compact">
              <p className="text-sm text-neutral-600">
                This card uses borders instead of shadows for definition.
              </p>
            </CardContent>
          </Card>

          <Card variant="filled" padding="lg">
            <CardHeader variant="compact">
              <CardTitle size="md">Filled Card</CardTitle>
              <CardDescription>Card with background color</CardDescription>
            </CardHeader>
            <CardContent variant="compact">
              <p className="text-sm text-neutral-600">
                This card has a subtle background color for distinction.
              </p>
            </CardContent>
          </Card>

          <Card variant="gradient" padding="lg">
            <CardHeader variant="compact">
              <CardTitle size="md">Gradient Card</CardTitle>
              <CardDescription>Card with gradient background</CardDescription>
            </CardHeader>
            <CardContent variant="compact">
              <p className="text-sm text-neutral-600">
                This card features a subtle gradient background.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
