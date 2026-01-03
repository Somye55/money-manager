# UI Troubleshooting Guide

## Common Issues and Solutions

### Styling Issues

#### Issue: Tailwind Classes Not Applied

**Symptoms:**

- Tailwind utility classes have no effect
- Styles not showing in browser

**Solutions:**

1. **Check Tailwind Import**

   ```css
   /* index.css should have */
   @import "tailwindcss";
   ```

2. **Verify Vite Plugin**

   ```js
   // vite.config.js
   import tailwindcss from "@tailwindcss/vite";

   export default defineConfig({
     plugins: [react(), tailwindcss()],
   });
   ```

3. **Clear Build Cache**

   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

4. **Check File Extensions**
   - Ensure files use `.tsx` or `.jsx` extensions
   - Tailwind scans these files for classes

---

#### Issue: CSS Variables Not Working

**Symptoms:**

- Colors showing as fallback values
- Theme variables not applied

**Solutions:**

1. **Define Variables in :root**

   ```css
   :root {
     --color-primary: #3b82f6;
   }
   ```

2. **Use Correct Variable Names**

   ```tsx
   /* Correct */
   <div className="bg-primary">Content</div>

   /* Incorrect */
   <div className="bg-[var(--color-primary)]">Content</div>
   ```

3. **Check Variable Scope**

   ```css
   /* Variables must be in :root or .dark */
   :root {
     --background: #ffffff;
   }

   .dark {
     --background: #000000;
   }
   ```

---

#### Issue: Dark Mode Not Working

**Symptoms:**

- Dark mode toggle doesn't change theme
- Dark mode colors not applied

**Solutions:**

1. **Check ThemeProvider Setup**

   ```tsx
   import { ThemeProvider } from "next-themes";

   <ThemeProvider attribute="class" defaultTheme="system">
     <App />
   </ThemeProvider>;
   ```

2. **Verify Dark Class Application**

   ```tsx
   /* Check if .dark class is on <html> or <body> */
   <html className={theme === 'dark' ? 'dark' : ''}>
   ```

3. **Define Dark Mode Variables**

   ```css
   .dark {
     --background: oklch(0.145 0 0);
     --foreground: oklch(0.985 0 0);
   }
   ```

4. **Check Local Storage**
   ```js
   // Clear theme from local storage
   localStorage.removeItem("theme");
   ```

---

### Component Issues

#### Issue: Button Not Clickable

**Symptoms:**

- Button doesn't respond to clicks
- No hover effects

**Solutions:**

1. **Check Disabled State**

   ```tsx
   /* Remove disabled prop */
   <Button disabled={false}>Click me</Button>
   ```

2. **Check Z-Index**

   ```tsx
   /* Ensure button is not behind other elements */
   <Button className="relative z-10">Click me</Button>
   ```

3. **Check Pointer Events**

   ```tsx
   /* Remove pointer-events-none */
   <Button className="pointer-events-auto">Click me</Button>
   ```

4. **Verify onClick Handler**
   ```tsx
   <Button onClick={() => console.log("Clicked")}>Click me</Button>
   ```

---

#### Issue: Input Not Accepting Text

**Symptoms:**

- Cannot type in input field
- Input value doesn't change

**Solutions:**

1. **Check Controlled Input**

   ```tsx
   /* Controlled input needs onChange */
   const [value, setValue] = useState("");

   <Input value={value} onChange={(e) => setValue(e.target.value)} />;
   ```

2. **Check Disabled State**

   ```tsx
   <Input disabled={false} />
   ```

3. **Check ReadOnly**
   ```tsx
   /* Remove readOnly if not needed */
   <Input readOnly={false} />
   ```

---

#### Issue: Modal Not Closing

**Symptoms:**

- Modal stays open after clicking close
- Escape key doesn't close modal

**Solutions:**

1. **Check onOpenChange Handler**

   ```tsx
   <Dialog open={open} onOpenChange={setOpen}>
     {/* Content */}
   </Dialog>
   ```

2. **Verify State Management**

   ```tsx
   const [open, setOpen] = useState(false);

   /* Make sure setOpen is called */
   <Button onClick={() => setOpen(false)}>Close</Button>;
   ```

3. **Check Portal Rendering**
   ```tsx
   /* Ensure DialogContent is inside Dialog */
   <Dialog>
     <DialogContent>{/* Content */}</DialogContent>
   </Dialog>
   ```

---

### Layout Issues

#### Issue: Content Hidden Behind Navigation

**Symptoms:**

- Bottom content cut off
- Fixed navigation overlaps content

**Solutions:**

1. **Add Bottom Padding**

   ```tsx
   <div className="min-h-screen pb-24">{/* Content */}</div>
   ```

2. **Check Navigation Z-Index**
   ```tsx
   <nav className="fixed bottom-0 z-50">{/* Navigation */}</nav>
   ```

---

#### Issue: Responsive Layout Not Working

**Symptoms:**

- Layout doesn't change on mobile
- Breakpoints not working

**Solutions:**

1. **Use Mobile-First Approach**

   ```tsx
   /* Correct - Mobile first */
   <div className="text-sm md:text-base lg:text-lg">
     Text
   </div>

   /* Incorrect - Desktop first */
   <div className="text-lg md:text-base sm:text-sm">
     Text
   </div>
   ```

2. **Check Viewport Meta Tag**

   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

3. **Test at Correct Breakpoints**
   - sm: 640px
   - md: 768px
   - lg: 1024px
   - xl: 1280px

---

### Animation Issues

#### Issue: Animations Not Playing

**Symptoms:**

- fadeIn animation doesn't work
- Elements appear instantly

**Solutions:**

1. **Define Keyframes**

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
   ```

2. **Apply Animation Class**

   ```tsx
   <div className="animate-fadeIn">Content</div>
   ```

3. **Check Initial Opacity**
   ```css
   .animate-fadeIn {
     animation: fadeIn 0.6s ease-out forwards;
     opacity: 0; /* Important! */
   }
   ```

---

#### Issue: Animations Janky or Slow

**Symptoms:**

- Animations stutter
- Poor performance

**Solutions:**

1. **Use GPU-Accelerated Properties**

   ```tsx
   /* Good - GPU accelerated */
   <div className="transition-transform hover:scale-105">
     Content
   </div>

   /* Avoid - CPU intensive */
   <div className="transition-all hover:w-[200px]">
     Content
   </div>
   ```

2. **Limit Concurrent Animations**

   ```tsx
   /* Stagger animations */
   <div style={{ animationDelay: '0ms' }}>Item 1</div>
   <div style={{ animationDelay: '100ms' }}>Item 2</div>
   ```

3. **Remove will-change**
   ```tsx
   /* Only use will-change when necessary */
   <div className="hover:scale-105">Content</div>
   ```

---

### Accessibility Issues

#### Issue: Focus Ring Not Visible

**Symptoms:**

- No visual indicator when tabbing
- Focus ring doesn't show

**Solutions:**

1. **Use focus-visible**

   ```tsx
   <button className="focus-visible:ring-2 focus-visible:ring-ring">
     Button
   </button>
   ```

2. **Check Ring Color**

   ```css
   :root {
     --ring: oklch(0.708 0 0);
   }
   ```

3. **Don't Remove Outline**

   ```css
   /* Avoid */
   button {
     outline: none;
   }

   /* Use focus-visible instead */
   button:focus-visible {
     outline: 2px solid var(--ring);
   }
   ```

---

#### Issue: Screen Reader Not Announcing

**Symptoms:**

- Screen reader skips elements
- Missing announcements

**Solutions:**

1. **Add ARIA Labels**

   ```tsx
   <button aria-label="Close dialog">
     <X className="h-4 w-4" />
   </button>
   ```

2. **Use Semantic HTML**

   ```tsx
   /* Good */
   <button onClick={handleClick}>Click</button>

   /* Avoid */
   <div onClick={handleClick}>Click</div>
   ```

3. **Add Screen Reader Text**

   ```tsx
   <button>
     <span className="sr-only">Delete item</span>
     <Trash2 className="h-4 w-4" />
   </button>
   ```

4. **Check ARIA Attributes**
   ```tsx
   <input
     aria-invalid={!!error}
     aria-describedby={error ? "error-message" : undefined}
   />;
   {
     error && <p id="error-message">{error}</p>;
   }
   ```

---

#### Issue: Touch Targets Too Small

**Symptoms:**

- Hard to tap on mobile
- Buttons too small

**Solutions:**

1. **Ensure Minimum Size**

   ```tsx
   <button className="min-h-[44px] min-w-[44px]">Button</button>
   ```

2. **Add Padding**

   ```tsx
   <button className="p-3">
     <Icon className="h-4 w-4" />
   </button>
   ```

3. **Use Larger Hit Area**
   ```tsx
   <button className="relative p-2">
     <span className="absolute inset-0" />
     <Icon className="h-4 w-4" />
   </button>
   ```

---

### Performance Issues

#### Issue: Slow Initial Load

**Symptoms:**

- Long time to first paint
- Large bundle size

**Solutions:**

1. **Lazy Load Components**

   ```tsx
   const ChartComponent = lazy(() => import("./ChartComponent"));

   <Suspense fallback={<Skeleton />}>
     <ChartComponent />
   </Suspense>;
   ```

2. **Code Split Routes**

   ```tsx
   const Dashboard = lazy(() => import("./pages/Dashboard"));
   const Settings = lazy(() => import("./pages/Settings"));
   ```

3. **Optimize Images**

   ```tsx
   <img src="image.jpg" loading="lazy" alt="Description" />
   ```

4. **Check Bundle Size**
   ```bash
   npm run build
   # Check dist/ folder size
   ```

---

#### Issue: Re-renders Causing Lag

**Symptoms:**

- UI feels sluggish
- Typing has delay

**Solutions:**

1. **Memoize Components**

   ```tsx
   const ExpensiveComponent = React.memo(({ data }) => {
     return <div>{/* ... */}</div>;
   });
   ```

2. **Use useCallback**

   ```tsx
   const handleClick = useCallback(() => {
     console.log("Clicked");
   }, []);
   ```

3. **Use useMemo**

   ```tsx
   const expensiveValue = useMemo(() => {
     return computeExpensiveValue(data);
   }, [data]);
   ```

4. **Check React DevTools**
   - Use Profiler to identify slow components
   - Look for unnecessary re-renders

---

### Icon Issues

#### Issue: Icons Not Showing

**Symptoms:**

- Blank space where icon should be
- Console errors about icons

**Solutions:**

1. **Check Import**

   ```tsx
   import { Home, Settings, Plus } from "lucide-react";
   ```

2. **Verify Icon Name**

   ```tsx
   /* Correct */
   import { Home } from "lucide-react";

   /* Incorrect */
   import { HomeIcon } from "lucide-react";
   ```

3. **Add Size Classes**

   ```tsx
   <Home className="h-5 w-5" />
   ```

4. **Check Lucide Version**
   ```bash
   npm list lucide-react
   # Should be v0.487.0 or compatible
   ```

---

#### Issue: Icons Wrong Size

**Symptoms:**

- Icons too large or small
- Inconsistent icon sizes

**Solutions:**

1. **Use Standard Sizes**

   ```tsx
   <Icon className="h-4 w-4" /> {/* 16px */}
   <Icon className="h-5 w-5" /> {/* 20px */}
   <Icon className="h-6 w-6" /> {/* 24px */}
   <Icon className="h-8 w-8" /> {/* 32px */}
   ```

2. **Match Text Size**
   ```tsx
   <div className="flex items-center gap-2">
     <Icon className="h-4 w-4" />
     <span className="text-sm">Text</span>
   </div>
   ```

---

### Form Issues

#### Issue: Form Not Submitting

**Symptoms:**

- Submit button doesn't work
- Form doesn't trigger onSubmit

**Solutions:**

1. **Check Form Handler**

   ```tsx
   const handleSubmit = (e) => {
     e.preventDefault(); // Important!
     // Handle submission
   };

   <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
   ```

2. **Check Button Type**

   ```tsx
   <Button type="submit">Submit</Button>
   ```

3. **Verify Form Structure**
   ```tsx
   <form onSubmit={handleSubmit}>
     <Input name="email" />
     <Button type="submit">Submit</Button>
   </form>
   ```

---

#### Issue: Validation Not Working

**Symptoms:**

- Error messages not showing
- Invalid inputs accepted

**Solutions:**

1. **Check Error State**

   ```tsx
   const [errors, setErrors] = useState({});

   <Input error={errors.email} aria-invalid={!!errors.email} />;
   ```

2. **Display Error Messages**

   ```tsx
   {
     errors.email && (
       <p className="text-sm text-red-600 mt-1">{errors.email}</p>
     );
   }
   ```

3. **Validate on Submit**
   ```tsx
   const handleSubmit = (e) => {
     e.preventDefault();

     const newErrors = {};
     if (!email) newErrors.email = "Email is required";

     if (Object.keys(newErrors).length > 0) {
       setErrors(newErrors);
       return;
     }

     // Submit form
   };
   ```

---

### Chart Issues

#### Issue: Charts Not Rendering

**Symptoms:**

- Blank space where chart should be
- Console errors about Recharts

**Solutions:**

1. **Check Recharts Import**

   ```tsx
   import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
   ```

2. **Use ResponsiveContainer**

   ```tsx
   <ResponsiveContainer width="100%" height={300}>
     <BarChart data={data}>{/* Chart components */}</BarChart>
   </ResponsiveContainer>
   ```

3. **Check Data Format**

   ```tsx
   const data = [
     { name: "Jan", value: 100 },
     { name: "Feb", value: 200 },
   ];
   ```

4. **Verify Recharts Version**
   ```bash
   npm list recharts
   # Should be v2.15.2 or compatible
   ```

---

### Build Issues

#### Issue: Build Fails

**Symptoms:**

- `npm run build` errors
- TypeScript errors

**Solutions:**

1. **Check TypeScript Errors**

   ```bash
   npx tsc --noEmit
   ```

2. **Fix Import Paths**

   ```tsx
   /* Use @ alias */
   import { Button } from "@/components/ui/button";

   /* Or relative paths */
   import { Button } from "../components/ui/button";
   ```

3. **Check Missing Dependencies**

   ```bash
   npm install
   ```

4. **Clear Cache and Rebuild**
   ```bash
   rm -rf node_modules/.vite dist
   npm run build
   ```

---

## Debugging Tips

### 1. Use Browser DevTools

**Inspect Element:**

- Right-click element → Inspect
- Check computed styles
- Verify classes are applied

**Console:**

- Check for JavaScript errors
- Use `console.log()` for debugging

**Network Tab:**

- Check if CSS files are loading
- Verify font files are loading

### 2. React DevTools

**Components Tab:**

- Inspect component props
- Check component state
- View component hierarchy

**Profiler Tab:**

- Identify slow components
- Find unnecessary re-renders

### 3. Tailwind DevTools

**Install Extension:**

```bash
# Chrome/Edge
# Search for "Tailwind CSS IntelliSense" in extensions
```

**Features:**

- Autocomplete for classes
- Hover to see CSS values
- Syntax highlighting

### 4. Check Console for Warnings

Common warnings:

- Missing keys in lists
- Invalid prop types
- Accessibility warnings
- Deprecated API usage

### 5. Test in Different Browsers

- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

### 6. Use Lighthouse

```bash
# Run Lighthouse audit
# DevTools → Lighthouse → Generate report
```

Check:

- Performance
- Accessibility
- Best Practices
- SEO

---

## Getting Help

### 1. Check Documentation

- [Component API Reference](./COMPONENT_API_REFERENCE.md)
- [Usage Examples](./COMPONENT_USAGE_EXAMPLES.md)
- [Best Practices](./UI_BEST_PRACTICES.md)
- [Common Patterns](./UI_COMMON_PATTERNS.md)

### 2. Search Issues

- Check if issue is already documented
- Search GitHub issues for similar problems

### 3. Create Minimal Reproduction

- Isolate the problem
- Create minimal example
- Test in clean environment

### 4. Ask for Help

When asking for help, include:

- What you're trying to do
- What you expected to happen
- What actually happened
- Code example
- Error messages
- Browser/environment info
