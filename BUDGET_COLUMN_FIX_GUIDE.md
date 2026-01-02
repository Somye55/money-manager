# Fix: Category Budget Column Missing

## Problem

When trying to add a budget to a category, you get the error:

```
"could not find the budget column of category in the schema cache"
```

## Root Cause

The `budget` column is missing from the `Category` table in your database. The application code expects this column to exist, but the database migration wasn't run.

## Quick Fix

### Option 1: Using Supabase Dashboard (Recommended)

1. Open your Supabase dashboard
2. Go to **SQL Editor**
3. Copy and paste this SQL:

```sql
-- Add budget column to Category table
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "budget" DECIMAL(10,2) DEFAULT NULL;

-- Add comment to document the budget column
COMMENT ON COLUMN "Category"."budget" IS 'Monthly budget limit for this category in the user''s currency';

-- Verify the column was added successfully
SELECT
    'SUCCESS: Budget column added to Category table' as status,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'Category'
AND column_name = 'budget'
AND table_schema = 'public';
```

4. Click **Run** to execute the query
5. You should see a success message confirming the column was added

### Option 2: Using the SQL File

1. Run the provided SQL file: `QUICK_FIX_BUDGET_COLUMN.sql`
2. Or use the batch script: `fix-budget-column.bat`

### Option 3: Using psql (if configured)

```bash
psql -h your-supabase-host -U postgres -d postgres -f QUICK_FIX_BUDGET_COLUMN.sql
```

## Verification

After running the fix, verify the column exists:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Category'
AND table_schema = 'public'
ORDER BY ordinal_position;
```

You should see a `budget` column with type `numeric`.

## Prevention

To prevent this issue in the future, make sure to run all database migrations:

1. `setup_database.sql` - Main database setup
2. `add_category_budget.sql` - Adds budget column
3. `add_category_order.sql` - Adds order column (if needed)

## What the Budget Column Does

- Allows users to set monthly budget limits for each category
- Stores decimal values (e.g., 1000.50) representing the budget amount
- Uses the user's selected currency
- NULL values mean no budget limit is set

## Related Files

- `client/src/lib/dataService.js` - Contains the category creation logic
- `client/src/pages/Settings.jsx` - Category management UI
- `add_category_budget.sql` - Original migration file
- `QUICK_FIX_BUDGET_COLUMN.sql` - Quick fix script
