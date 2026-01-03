# Tailwind v4 CSS-Based Configuration

## Overview

Tailwind CSS v4 introduces a new CSS-based configuration approach that eliminates the need for `tailwind.config.js`. All configuration is done directly in CSS using the `@theme` directive and CSS custom properties.

## Key Differences from v3

### Tailwind v3 (JavaScript Config)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
      },
    },
  },
};
```

### Tailwind v4 (CSS Config)

```css
/* index.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
}
```

## Setup

### 1. Install Tailwind v4

```bash
npm install tailwindcss@next @tailwindcss/vite@next
```

### 2. Configure Vite

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### 3. Import Tailwind in CSS

```css
/* src/index.css */
@import "tailwindcss";
```

## Color Configuration

### Using OKLCH Color Space

Tailwind v4 supports OKLCH color space for better perceptual uniformity:

```css
@theme {
  /* OKLCH format: oklch(lightness chroma hue) */
  --color-primary: oklch(0.5 0.2 250);
  --color-secondary: oklch(0.7 0.15 300);
}
```

### Semantic Color Variables

Define semantic colors using CSS custom properties:

```css
:root {
  /* Light mode colors */
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
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
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

.dark {
  /* Dark mode colors */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
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
  --ring: oklch(0.708 0 0);
}
```

### Using Color Variables

```tsx
// Tailwind classes automatically reference CSS variables
<div className="bg-primary text-primary-foreground">
  Primary colored element
</div>

<div className="bg-secondary text-secondary-foreground">
  Secondary colored element
</div>
```

## Typography Configuration

### Font Family

```css
@import url("https://fonts.googleapis.com/css2?family=TikTok+Sans:opsz,wght@12..36,300..900&display=swap");

body {
  font-family: "TikTok Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    sans-serif;
}
```

### Font Sizes

Define custom font sizes using `@theme`:

```css
@theme {
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
}
```

### Heading Styles

```css
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

## Spacing Configuration

### Custom Spacing Scale

```css
@theme {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
}
```

### Border Radius

```css
@theme {
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
}
```

## Custom Animations

### Keyframe Animations

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

### Spin Animation

```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### Pulse Animation

```css
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## Dark Mode

### Using CSS Variables

Dark mode is handled through CSS variables that change based on the `.dark` class:

```css
:root {
  --background: #ffffff;
  --foreground: #000000;
}

.dark {
  --background: #000000;
  --foreground: #ffffff;
}
```

### Theme Provider

Use `next-themes` to manage theme switching:

```tsx
import { ThemeProvider } from "next-themes";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* Your app */}
    </ThemeProvider>
  );
}
```

### Theme Toggle

```tsx
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle Theme
    </button>
  );
}
```

## Gradient Utilities

### Custom Gradients

```css
@theme {
  --gradient-primary: linear-gradient(to bottom right, #6366f1, #9333ea);
  --gradient-secondary: linear-gradient(to right, #3b82f6, #8b5cf6);
}
```

### Using Gradients

```tsx
<div className="bg-gradient-to-br from-indigo-500 to-purple-600">
  Gradient background
</div>

<h1 className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
  Gradient text
</h1>
```

## Shadow Configuration

### Custom Shadows

```css
@theme {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
```

## Breakpoints

Tailwind v4 uses the same breakpoint system as v3:

```css
/* Default breakpoints */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Custom Breakpoints

```css
@theme {
  --breakpoint-xs: 480px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Using Breakpoints

```tsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  Responsive grid
</div>
```

## Container Configuration

### Max Width Container

```css
@theme {
  --container-max-width: 1024px;
}
```

### Using Container

```tsx
<div className="max-w-screen-lg mx-auto px-4">
  Centered container with max width
</div>
```

## Z-Index Scale

### Custom Z-Index

```css
@theme {
  --z-index-dropdown: 1000;
  --z-index-sticky: 1020;
  --z-index-fixed: 1030;
  --z-index-modal-backdrop: 1040;
  --z-index-modal: 1050;
  --z-index-popover: 1060;
  --z-index-tooltip: 1070;
}
```

### Using Z-Index

```tsx
<nav className="sticky top-0 z-40">Navigation</nav>
<div className="fixed bottom-0 z-50">Bottom bar</div>
```

## Transition Configuration

### Custom Transitions

```css
@theme {
  --transition-fast: 150ms;
  --transition-base: 300ms;
  --transition-slow: 500ms;
}
```

### Using Transitions

```tsx
<button className="transition-all duration-300 hover:scale-105">
  Animated button
</button>

<div className="transition-colors duration-150 hover:bg-gray-100">
  Color transition
</div>
```

## Backdrop Blur

### Glassmorphism Effect

```tsx
<div className="backdrop-blur-xl bg-white/80">
  Frosted glass effect
</div>

<div className="backdrop-blur-sm bg-black/50">
  Subtle blur with transparency
</div>
```

## Custom Utilities

### Adding Custom Utilities

```css
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### Using Custom Utilities

```tsx
<p className="text-balance">
  Balanced text wrapping
</p>

<div className="overflow-auto scrollbar-hide">
  Hidden scrollbar
</div>
```

## Best Practices

### 1. Use CSS Variables for Theme Values

```css
/* Good */
:root {
  --color-primary: #3b82f6;
}

.button {
  background-color: var(--color-primary);
}

/* Avoid */
.button {
  background-color: #3b82f6;
}
```

### 2. Organize CSS Variables by Category

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;

  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;

  /* Typography */
  --font-size-base: 1rem;
  --font-weight-normal: 400;

  /* Borders */
  --radius-md: 0.375rem;
  --border-width: 1px;
}
```

### 3. Use Semantic Naming

```css
/* Good - Semantic */
--color-background: #ffffff;
--color-foreground: #000000;
--color-primary: #3b82f6;
--color-destructive: #ef4444;

/* Avoid - Generic */
--color-white: #ffffff;
--color-black: #000000;
--color-blue: #3b82f6;
--color-red: #ef4444;
```

### 4. Leverage OKLCH for Better Colors

```css
/* OKLCH provides better perceptual uniformity */
--color-primary: oklch(0.5 0.2 250);
--color-primary-light: oklch(0.7 0.2 250);
--color-primary-dark: oklch(0.3 0.2 250);
```

### 5. Keep Dark Mode in Sync

```css
:root {
  --background: #ffffff;
  --foreground: #000000;
}

.dark {
  /* Mirror the structure */
  --background: #000000;
  --foreground: #ffffff;
}
```

## Migration from v3

### Step 1: Remove tailwind.config.js

Delete your `tailwind.config.js` file.

### Step 2: Update Dependencies

```bash
npm install tailwindcss@next @tailwindcss/vite@next
```

### Step 3: Update Vite Config

```js
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### Step 4: Move Config to CSS

Convert your JavaScript config to CSS:

```js
// Old: tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
      },
    },
  },
};
```

```css
/* New: index.css */
@theme {
  --color-primary: #3b82f6;
}
```

### Step 5: Update Imports

```css
/* Old */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* New */
@import "tailwindcss";
```

## Troubleshooting

### Colors Not Working

Make sure CSS variables are defined in `:root`:

```css
:root {
  --color-primary: #3b82f6;
}
```

### Dark Mode Not Working

Ensure `.dark` class is applied to root element:

```tsx
<html className={theme === "dark" ? "dark" : ""}>{/* ... */}</html>
```

### Custom Fonts Not Loading

Import fonts before using them:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

body {
  font-family: "Inter", sans-serif;
}
```

### Animations Not Working

Define keyframes before using them:

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
```

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [OKLCH Color Picker](https://oklch.com/)
- [Tailwind CSS GitHub](https://github.com/tailwindlabs/tailwindcss)
- [Vite Plugin Documentation](https://github.com/tailwindlabs/tailwindcss-vite)
