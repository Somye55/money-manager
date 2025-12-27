Integrating **shadcn/ui** into a React + Vite + Capacitor project is a great choice. shadcn provides high-quality, accessible components, while Capacitor allows you to ship that web app as a native mobile app.

Here is the step-by-step guide to setting it up.

---

### Prerequisites
Ensure your project is already set up with **Tailwind CSS**. If not, install it first:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### Step 1: Configure Path Aliasing
shadcn uses path aliases (like `@/components`) to keep imports clean. You need to configure this in both TypeScript and Vite.

**1. Update `tsconfig.json`** (or `tsconfig.app.json`):
Add the `paths` property inside `compilerOptions`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**2. Update `vite.config.ts`**:
You need to install `@types/node` so Vite can resolve "path".
```bash
npm install -D @types/node
```
Then update the config:
```typescript
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

---

### Step 2: Initialize shadcn/ui
Run the shadcn CLI tool to initialize the project:
```bash
npx shadcn-ui@latest init
```

You will be asked a few questions. Recommended settings for Capacitor:
- **Style:** New York (cleaner) or Default.
- **Base Color:** Slate or Zinc.
- **CSS Variables:** Yes (allows for easy theme switching).
- **Global CSS file:** `src/index.css`
- **Import alias for components:** `@/components`
- **Import alias for utils:** `@/lib/utils`

---

### Step 3: Add Components
Unlike traditional component libraries, shadcn adds the source code of the component directly into your project. To add a component (e.g., a Button):

```bash
npx shadcn-ui@latest add button
```
This will create a new folder: `src/components/ui/button.tsx`.

---

### Step 4: Using shadcn Components
Now you can use the component anywhere in your React app.

```tsx
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Capacitor + shadcn</h1>
      <Button onClick={() => alert("Hello from Capacitor!")}>
        Click Me
      </Button>
    </div>
  )
}
```

---

### Step 5: Capacitor-Specific Adjustments (Crucial)
Since your app will run on mobile devices, you need to handle "Safe Areas" (the notch and home indicator) so your shadcn components aren't cut off.

**1. Update `index.html`**:
Ensure you have the `viewport-fit=cover` meta tag:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

**2. Update `src/index.css`**:
Add these Tailwind utility classes to handle the safe area in your layout:
```css
@layer base {
  :root {
    /* ... existing shadcn variables ... */
  }
}

/* Add padding to account for mobile notches */
.safe-area-pt {
  padding-top: env(safe-area-inset-top);
}
.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom);
}
```

**3. Use in Layout**:
Wrap your main app or navigation bar with these classes:
```tsx
function App() {
  return (
    <div className="safe-area-pt safe-area-pb min-h-screen bg-background">
      {/* Your shadcn components here */}
    </div>
  )
}
```

---

### Step 6: Deploy to Mobile
After building your web app, sync it with Capacitor to see shadcn in action on an emulator or device.

```bash
# 1. Build the Vite project
npm run build

# 2. Sync to Capacitor
npx cap sync

# 3. Open in Xcode (iOS) or Android Studio (Android)
npx cap open ios
npx cap open android
```

### Pro-Tips for Capacitor + shadcn:
1.  **Mobile Touch:** shadcn uses `radix-ui` under the hood, which handles touch events perfectly. However, ensure your buttons have a minimum height of `44px` (Tailwind `h-11`) for better mobile ergonomics.
2.  **Dark Mode:** shadcn has excellent dark mode support. You can use the `next-themes` package (it works with Vite too) to allow users to toggle dark mode, which looks great on OLED mobile screens.
3.  **Sheet Component:** The shadcn `Sheet` (Drawer) component is excellent for mobile navigation menus. Try `npx shadcn-ui@latest add sheet`.



Integrating **shadcn/ui** with **Capacitor** requires a few extra steps to ensure the web components feel like a "native" mobile app. Because mobile users interact with thumbs and deal with hardware like notches, standard web defaults often feel clunky.

Here is the advanced guide to integrating shadcn and optimizing it for a mobile environment.

---

### Part 1: Advanced Mobile Integration

After following the basic initialization (`npx shadcn-ui@latest init`), apply these "Native-Feel" settings to your project.

#### 1. Configure the Capacitor Status Bar
To make the top of your app match your shadcn theme (light or dark), use the Capacitor Status Bar plugin.

```bash
npm install @capacitor/status-bar
npx cap sync
```

In your `App.tsx`, sync the status bar with your shadcn theme:
```tsx
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // If your app uses shadcn's dark mode variables
    const isDark = document.documentElement.classList.contains('dark');
    
    StatusBar.setStyle({ 
      style: isDark ? Style.Dark : Style.Light 
    });
    
    // Optional: Match the background color (Android only)
    StatusBar.setBackgroundColor({ color: isDark ? '#020617' : '#ffffff' });
  }, []);

  return <div className="min-h-screen bg-background text-foreground">...</div>;
}
```

#### 2. Fix the "Sticky Hover" Bug
On mobile, if you tap a button with a `hover:bg-blue-500` class, the color often "sticks" even after you let go. Prevent this in your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // ...
  future: {
    hoverOnlyWhenSupported: true, // Disables hover effects on touch devices
  },
}
```

#### 3. Disable Webkit Tap Highlight
By default, iOS and Android show a gray or blue "flash" when you tap an element. This looks "webby." Disable it in your `src/index.css`:

```css
@layer base {
  * {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none; /* Disables the long-press "save image" menu */
  }

  /* Keep text selection enabled for inputs, but disable for buttons/icons */
  .btn, .icon, button {
    @apply select-none;
  }
}
```

---

### Part 2: Best Shadcn Components for Mobile

Not all shadcn components are created equal for mobile. Use these specific patterns for the best UX:

#### 1. Use `Drawer` (Bottom Sheet) instead of `Dialog`
On mobile, users expect "Bottom Sheets" that they can swipe away with their thumb. Shadcn's **Drawer** is powered by `vaul` and is perfect for this.

```bash
npx shadcn-ui@latest add drawer
```

**Usage:**
```tsx
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"

<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Open Settings</Button>
  </DrawerTrigger>
  <DrawerContent>
    <div className="p-4 pb-8"> {/* Extra padding for the home indicator */}
      <h2 className="text-lg font-bold">Profile Settings</h2>
      {/* Settings list here */}
    </div>
  </DrawerContent>
</Drawer>
```

#### 2. Responsive Navigation
Use the **Sheet** component for a "Hamburger" side menu, but ensure it opens from the side.
- **Side Nav:** Use `Sheet` (slides from left/right).
- **Action Menu:** Use `Drawer` (slides from bottom).

---

### Part 3: Mobile UX "Pro-Tips" for Tailwind

| Problem | Solution | Tailwind Class |
| :--- | :--- | :--- |
| **Touch Targets** | Buttons must be at least 44x44px for thumbs. | `h-11 w-11` or `p-4` |
| **Active States** | Give instant feedback when a user taps. | `active:scale-95 transition-transform` |
| **Rubber-Banding** | Prevent the whole app from "bouncing" on iOS. | `overscroll-behavior-none` on body |
| **Safe Areas** | Keep content away from the iPhone Notch. | `pt-[env(safe-area-inset-top)]` |
| **Font Size** | Inputs smaller than 16px cause iOS to auto-zoom. | `text-base` (which is 16px) |

#### Implementation of "Active" feedback:
Standard web buttons often feel "dead" until the click registers. Add a tiny scale effect to your shadcn `button.tsx`:

```tsx
// Inside your components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex ... active:scale-95 transition-all duration-75", // Added these
  {
    variants: { ... }
  }
)
```

#### Handling Safe Areas (Notches)
If you have a bottom navigation bar, it must sit above the "Home Indicator" (the pill at the bottom of iPhones).

```tsx
<nav className="fixed bottom-0 w-full bg-white border-t pb-[env(safe-area-inset-bottom)]">
  <div className="flex justify-around h-16 items-center">
    <HomeIcon />
    <SearchIcon />
    <SettingsIcon />
  </div>
</nav>
```

### Summary Checklist for Capacitor
1. **Viewport Meta:** Ensure `<meta name="viewport" content="...viewport-fit=cover">` is in `index.html`.
2. **Path Aliases:** Verify `@/components/...` works in your Vite config.
3. **Disable Hover:** Set `hoverOnlyWhenSupported: true` in Tailwind config.
4. **Touch CSS:** Set `-webkit-tap-highlight-color: transparent` in your global CSS.
5. **Safe Areas:** Use `env(safe-area-inset-*)` for paddings on headers and tab bars.