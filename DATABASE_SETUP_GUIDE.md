# Database Setup Guide

Your issue is that the database tables don't exist yet. Here's how to fix it:

## Step 1: Create the Database Tables

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the `setup_database.sql` file first to create all tables

## Step 2: Fix RLS Policies

After the tables are created, run the `fix_rls_policies_safe.sql` file to set up proper Row Level Security policies.

## Step 3: Test the Application

1. Open your app and go to Settings
2. Use the Debug component to verify everything is working
3. Try creating a category

## Alternative: Quick Fix

If you want to temporarily disable RLS to test, you can run this in Supabase SQL Editor:

```sql
-- TEMPORARY: Disable RLS for testing (NOT recommended for production)
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "UserSettings" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Expense" DISABLE ROW LEVEL SECURITY;
```

**Warning**: Only use this for testing. Re-enable RLS after fixing the authentication issues.

## Step 4: Remove Debug Component

Once everything is working, remove the `<DebugSupabase />` line from your Settings.jsx file.

## Common Issues:

1. **Tables don't exist**: Run `setup_database.sql`
2. **Permission denied**: Check RLS policies with `fix_rls_policies_safe.sql`
3. **User not found**: The app will create users automatically when they log in
4. **Categories not showing**: Check the debug component output for specific errors

## Files to Run (in order):

1. `setup_database.sql` - Creates all tables and basic structure
2. `fix_rls_policies_safe.sql` - Sets up proper security policies
3. Test your app with the debug component
