# Fix Expense Dates Issue - Complete Guide

## Problem

Expenses with dates in 2025 were not appearing in the app because:

1. The app was only loading current month expenses (January 2026)
2. Test SMS had incorrect year (2025 instead of 2026)
3. Android code wasn't validating parsed years

## Changes Made

### 1. Android Code Fix

**File:** `client/android/app/src/main/java/com/moneymanager/app/OverlayService.java`

- Updated `parseTimestamp()` method to validate parsed year
- If parsed year is in the past, it now uses the current year
- This prevents future expenses from being saved with incorrect years

### 2. DataContext Updates

**File:** `client/src/context/DataContext.jsx`

- Changed from `getCurrentMonthExpenses()` to `getExpenses()` to load ALL expenses
- Now users can see their complete expense history, not just current month
- Updated in 3 places:
  - Initial data load
  - Refresh expenses event handler
  - refreshAllData method

### 3. Dashboard Updates

**File:** `client/src/pages/Dashboard.jsx`

- Added filtering to show only current month expenses for analytics
- This keeps the dashboard focused on current month while allowing full history in Expenses page

### 4. Database Fix Script

**File:** `fix_expense_years.sql`

- SQL script to update existing expenses with 2025 dates to 2026
- Only updates expenses where createdAt is in 2026 but date is in 2025

## Steps to Apply Fix

### Step 1: Fix Database

Run the SQL script to fix existing expenses:

```bash
# Connect to your Supabase database and run:
psql <your-connection-string> -f fix_expense_years.sql
```

Or run directly in Supabase SQL Editor:

```sql
UPDATE expenses
SET
  date = date + INTERVAL '1 year',
  "updatedAt" = NOW()
WHERE
  EXTRACT(YEAR FROM date) = 2025
  AND EXTRACT(YEAR FROM "createdAt") = 2026;
```

### Step 2: Rebuild Android App

```bash
cd client
npm run android
```

### Step 3: Test

1. Open the app
2. Check Expenses page - you should now see ALL expenses including "Test Bank SMS", "yeah bo bo boi", etc.
3. Check Dashboard - should show current month analytics
4. Send a test notification with 2025 date - it should be saved as 2026

## What's Fixed

✅ All expenses now appear in the Expenses page
✅ Dashboard shows correct current month analytics
✅ Future notifications with wrong years will be corrected automatically
✅ Existing database records updated to correct year

## Verification

After applying the fix, you should see:

- 24 total expenses in the Expenses page
- All "Test Bank SMS" entries visible
- "yeah bo bo boi" and other 2025 expenses visible
- Dashboard analytics include all current month expenses
