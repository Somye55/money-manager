# Money Manager App - UI Structure Summary

## Design System

**Colors:** Primary #6366f1, Success #10b981, Danger #ef4444, gradients for backgrounds
**Typography:** Inter font, weights 300-800, responsive sizing
**Layout:** Mobile-first, 44px touch targets, glassmorphism cards with blur effects

## Navigation

**Fixed Header:** Wallet icon + "Money Manager" title with gradient text
**Bottom Tabs:** Home (Dashboard), Expenses (Receipt), Add (Plus), Settings

## Pages

### 1. Login (`/login`)

- Centered card with animated gradient background
- Google OAuth button with logo
- Loading states and error handling

### 2. Dashboard (`/`)

**Balance/Expenses Cards:** 2-column grid with gradient backgrounds
**Monthly Overview:** Progress bar showing budget usage percentage
**Charts:** Bar chart (7-day spending), Doughnut chart (category breakdown)
**Top Categories:** List with icons, progress bars, amounts
**Quick Actions:** View All + Add New buttons
**Empty State:** Placeholder with CTA button

### 3. Add Expense (`/add`)

**Form Cards:** Amount (large currency input), Description, Category grid (2-col with icons/colors), Date picker
**Actions:** Cancel/Save buttons with loading states

### 4. Expenses (`/expenses`)

**Header:** Title + Add button + count
**SMS Section:** New expenses from SMS with import/dismiss
**Summary:** Total with danger gradient background
**Filters:** Search input, filter toggle, sort dropdown
**List:** Grouped by date, cards with category icons, edit/delete actions
**Modals:** Edit/Add expense forms
**FAB:** Floating add button (bottom-right)

### 5. Settings (`/settings`)

**Profile:** Avatar + user info
**Categories:** Drag-to-reorder list, add/edit/delete with modal
**Category Modal:** Preview, name input, budget, icon grid (4-8 cols), color grid
**Automation:** SMS/notification permissions, app selection grid
**Preferences:** Currency dropdown, monthly budget input, theme toggle
**Status:** Database connection indicators
**Sign Out:** Danger gradient button

## Components

### Design System

**Button:** primary/secondary/ghost variants, loading states
**Card:** glassmorphism with blur, hover effects
**Input:** labels with icons, error states
**Modal:** backdrop blur, slide-up animation

### Custom

**BudgetOverview:** Category budgets with progress bars, over-budget warnings
**CategorySelectionModal:** Transaction details, category grid selection
**SMSExpenseCard:** SMS preview with import/dismiss actions
**ThemeToggle:** Sun/moon icons with transitions

## Interactions

**Animations:** Fade-in page loads, slide-up cards with staggered delays
**Touch:** Scale feedback, drag-to-reorder, 44px minimum targets
**States:** Loading spinners, hover effects, focus rings
**Responsive:** Mobile-first, breakpoints at 640px/768px/1024px
