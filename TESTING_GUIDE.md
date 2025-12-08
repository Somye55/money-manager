# Testing Guide - Money Manager App

## Quick Start Testing

### 1. Start the Development Server

```bash
# Terminal 1 - Start Backend
cd server
npm start

# Terminal 2 - Start Frontend
cd client
npm run dev
```

### 2. Access the App

Open your browser and navigate to: `http://localhost:5173`

## Feature Testing Checklist

### ✅ Dashboard (Home Page)

**Test Items:**

- [ ] Balance and Expenses cards display correctly
- [ ] Monthly overview progress bar shows accurate percentage
- [ ] Last 7 Days bar chart renders with data
- [ ] Category Breakdown doughnut chart displays
- [ ] Top Categories section shows with progress bars
- [ ] Quick action buttons navigate correctly
- [ ] Empty state shows when no expenses exist
- [ ] SMS suggestions appear (if permissions granted)

**How to Test:**

1. Navigate to Home page
2. Add some expenses via "Add" page
3. Verify all charts update automatically
4. Check that clicking "View All" goes to Expenses page
5. Check that clicking "Add New" goes to Add Expense page

---

### ✅ Expenses Page

**Test Items:**

- [ ] Total expenses summary card displays
- [ ] Search functionality works
- [ ] Category filter works
- [ ] Sort options work (newest, oldest, highest, lowest)
- [ ] Expenses grouped by date
- [ ] Daily totals calculated correctly
- [ ] Edit button opens modal
- [ ] Delete button shows confirmation
- [ ] Empty state displays when no expenses

**How to Test:**

1. Navigate to Expenses page
2. Try searching for an expense
3. Filter by different categories
4. Change sort order
5. Click edit on an expense
6. Modify and save
7. Try deleting an expense
8. Verify changes reflect immediately

---

### ✅ Add Expense Page

**Test Items:**

- [ ] Amount input accepts decimal values
- [ ] Description field works
- [ ] Category selection displays all categories
- [ ] Date picker works
- [ ] Validation shows errors for invalid input
- [ ] Save button creates expense
- [ ] Cancel button returns to home
- [ ] Currency symbol displays correctly

**How to Test:**

1. Navigate to Add page
2. Try submitting without amount (should show error)
3. Try submitting without description (should show error)
4. Fill all fields correctly
5. Click Save
6. Verify expense appears on Dashboard and Expenses page

---

### ✅ Settings - Category Management

**Test Items:**

- [ ] Categories list displays
- [ ] "Add" button opens modal
- [ ] Can create new category with name, icon, color
- [ ] Can edit existing category
- [ ] Can delete category (with confirmation)
- [ ] Drag and drop reordering works
- [ ] Changes save automatically
- [ ] Icon picker shows all options
- [ ] Color picker shows all options

**How to Test:**

1. Navigate to Settings
2. Scroll to Categories section
3. Click "Add" button
4. Create a new category (e.g., "Entertainment")
5. Select an icon and color
6. Save and verify it appears in list
7. Try editing the category
8. Try dragging to reorder
9. Try deleting a category
10. Verify changes appear in Add Expense page

---

### ✅ Settings - Permissions

**Test Items:**

- [ ] SMS Permission status shows correctly
- [ ] Notification Access status shows correctly
- [ ] Instructions are clear and visible
- [ ] Enable buttons work
- [ ] Status badges update after granting permission
- [ ] Test popup button works (when permission granted)
- [ ] Scan SMS button works (when permission granted)
- [ ] Error messages display appropriately

**How to Test:**

1. Navigate to Settings
2. Scroll to Expense Automation section
3. Check permission status indicators
4. Read the instructions
5. Click "Enable" for SMS Permission
6. Grant permission when prompted
7. Verify status changes to "Enabled"
8. Click "Scan Past SMS" button
9. Repeat for Notification Access
10. Test the popup functionality

---

### ✅ Settings - Other Features

**Test Items:**

- [ ] Profile section displays user info
- [ ] Currency dropdown works
- [ ] Monthly budget input works
- [ ] Theme selection works (Light/Dark/System)
- [ ] Changes auto-save
- [ ] Save status indicator shows
- [ ] Sign out button works

**How to Test:**

1. Change currency and verify symbol updates throughout app
2. Set monthly budget and verify progress bar updates
3. Switch themes and verify UI changes
4. Check that "Saving..." and "Saved" indicators appear

---

### ✅ Navigation

**Test Items:**

- [ ] Bottom navigation shows 4 tabs
- [ ] Active tab is highlighted
- [ ] All tabs navigate correctly
- [ ] Navigation persists across page refreshes
- [ ] Back button works as expected

**How to Test:**

1. Click each navigation tab
2. Verify correct page loads
3. Check active state highlighting
4. Refresh page and verify you stay on same page

---

### ✅ Responsive Design

**Test Items:**

- [ ] Works on mobile viewport (375px)
- [ ] Works on tablet viewport (768px)
- [ ] Works on desktop viewport (1024px+)
- [ ] Charts resize properly
- [ ] Modals are centered and scrollable
- [ ] Touch targets are adequate size

**How to Test:**

1. Open browser DevTools
2. Toggle device toolbar
3. Test different viewport sizes
4. Verify all features work on mobile
5. Check that charts are readable

---

### ✅ Data Persistence

**Test Items:**

- [ ] Expenses persist after page refresh
- [ ] Categories persist after page refresh
- [ ] Settings persist after page refresh
- [ ] Theme preference persists
- [ ] User session persists

**How to Test:**

1. Add expenses, categories, change settings
2. Refresh the page
3. Verify all data is still present
4. Close and reopen browser
5. Verify data persists

---

## Mobile Testing (Android)

### Prerequisites

- Android device or emulator
- Capacitor configured
- USB debugging enabled (for physical device)

### Build and Test

```bash
cd client
npm run build
npx cap sync android
npx cap open android
```

### Mobile-Specific Tests

**Test Items:**

- [ ] SMS permission request works
- [ ] Notification access request works
- [ ] Display over apps permission works
- [ ] SMS scanning works
- [ ] Notification listener works
- [ ] Popup overlay displays
- [ ] Touch gestures work
- [ ] Keyboard appears correctly
- [ ] Date picker is native
- [ ] Back button behavior is correct

---

## Performance Testing

**Test Items:**

- [ ] App loads in under 3 seconds
- [ ] Charts render smoothly
- [ ] No lag when scrolling expenses list
- [ ] Search is responsive
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks

**How to Test:**

1. Open browser DevTools Performance tab
2. Record while using the app
3. Check for long tasks
4. Monitor memory usage
5. Verify smooth animations

---

## Edge Cases to Test

### Data Edge Cases

- [ ] No expenses (empty state)
- [ ] 1000+ expenses (performance)
- [ ] Very long expense descriptions
- [ ] Very large amounts (formatting)
- [ ] Expenses on same day
- [ ] Future dated expenses
- [ ] No categories
- [ ] All expenses in one category

### Permission Edge Cases

- [ ] Deny SMS permission
- [ ] Deny notification access
- [ ] Revoke permissions after granting
- [ ] No SMS messages on device
- [ ] Malformed SMS messages

### UI Edge Cases

- [ ] Very long category names
- [ ] Many categories (scrolling)
- [ ] Rapid clicking/tapping
- [ ] Network offline
- [ ] Slow network connection

---

## Bug Reporting Template

If you find a bug, please report with:

```
**Bug Description:**
[Clear description of the issue]

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Browser:
- OS:
- App Version:
- Screen Size:

**Screenshots:**
[If applicable]

**Console Errors:**
[Any errors from browser console]
```

---

## Success Criteria

The app is ready for production when:

- ✅ All feature tests pass
- ✅ No console errors
- ✅ Responsive on all screen sizes
- ✅ Data persists correctly
- ✅ Permissions work as expected
- ✅ Performance is acceptable
- ✅ No critical bugs

---

## Quick Smoke Test (5 minutes)

1. **Add an expense** → Verify it appears on Dashboard
2. **Create a category** → Verify it appears in Add Expense
3. **Edit an expense** → Verify changes save
4. **Delete an expense** → Verify it's removed
5. **Change theme** → Verify UI updates
6. **Check charts** → Verify they display correctly
7. **Test search** → Verify filtering works
8. **Navigate all pages** → Verify no errors

If all 8 steps pass, the app is functioning correctly! ✅
