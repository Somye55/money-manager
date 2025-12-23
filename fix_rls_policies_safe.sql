-- Fix RLS policies for Money Manager app (Safe Version)
-- Run this in your Supabase SQL editor

-- First, let's check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check if there are any users (only if User table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'User' AND table_schema = 'public') THEN
    RAISE NOTICE 'User table exists, checking data...';
  ELSE
    RAISE NOTICE 'User table does not exist - you need to run the main migration first';
  END IF;
END $$;

-- Drop existing RLS policies only if tables exist
DO $$
BEGIN
  -- Drop User policies if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'User' AND table_schema = 'public') THEN
    DROP POLICY IF EXISTS "Users can view own data" ON "User";
    DROP POLICY IF EXISTS "Users can update own data" ON "User";
    DROP POLICY IF EXISTS "Users can insert own data" ON "User";
    RAISE NOTICE 'Dropped User table policies';
  END IF;

  -- Drop UserSettings policies if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'UserSettings' AND table_schema = 'public') THEN
    DROP POLICY IF EXISTS "Users can view own settings" ON "UserSettings";
    DROP POLICY IF EXISTS "Users can update own settings" ON "UserSettings";
    DROP POLICY IF EXISTS "Users can insert own settings" ON "UserSettings";
    RAISE NOTICE 'Dropped UserSettings table policies';
  END IF;

  -- Drop Category policies if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Category' AND table_schema = 'public') THEN
    DROP POLICY IF EXISTS "Users can view own categories" ON "Category";
    DROP POLICY IF EXISTS "Users can insert own categories" ON "Category";
    DROP POLICY IF EXISTS "Users can update own categories" ON "Category";
    DROP POLICY IF EXISTS "Users can delete own categories" ON "Category";
    RAISE NOTICE 'Dropped Category table policies';
  END IF;

  -- Drop Expense policies if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Expense' AND table_schema = 'public') THEN
    DROP POLICY IF EXISTS "Users can view own expenses" ON "Expense";
    DROP POLICY IF EXISTS "Users can insert own expenses" ON "Expense";
    DROP POLICY IF EXISTS "Users can update own expenses" ON "Expense";
    DROP POLICY IF EXISTS "Users can delete own expenses" ON "Expense";
    RAISE NOTICE 'Dropped Expense table policies';
  END IF;
END $$;

-- Create improved RLS policies only for tables that exist
DO $$
BEGIN
  -- Create User table policies if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'User' AND table_schema = 'public') THEN
    CREATE POLICY "Users can view own data" ON "User"
        FOR SELECT USING (
            auth.uid()::text = "googleId" OR 
            auth.jwt() ->> 'email' = email
        );

    CREATE POLICY "Users can update own data" ON "User"
        FOR UPDATE USING (
            auth.uid()::text = "googleId" OR 
            auth.jwt() ->> 'email' = email
        );

    CREATE POLICY "Users can insert own data" ON "User"
        FOR INSERT WITH CHECK (
            auth.uid()::text = "googleId" OR 
            auth.jwt() ->> 'email' = email
        );
    
    RAISE NOTICE 'Created User table policies';
  END IF;

  -- Create UserSettings table policies if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'UserSettings' AND table_schema = 'public') THEN
    CREATE POLICY "Users can view own settings" ON "UserSettings"
        FOR SELECT USING (
            "userId" IN (
                SELECT id FROM "User" 
                WHERE auth.uid()::text = "googleId" OR auth.jwt() ->> 'email' = email
            )
        );

    CREATE POLICY "Users can update own settings" ON "UserSettings"
        FOR UPDATE USING (
            "userId" IN (
                SELECT id FROM "User" 
                WHERE auth.uid()::text = "googleId" OR auth.jwt() ->> 'email' = email
            )
        );

    CREATE POLICY "Users can insert own settings" ON "UserSettings"
        FOR INSERT WITH CHECK (
            "userId" IN (
                SELECT id FROM "User" 
                WHERE auth.uid()::text = "googleId" OR auth.jwt() ->> 'email' = email
            )
        );
    
    RAISE NOTICE 'Created UserSettings table policies';
  END IF;

  -- Create Category table policies if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Category' AND table_schema = 'public') THEN
    CREATE POLICY "Users can view own categories" ON "Category"
        FOR SELECT USING (
            "userId" IN (
                SELECT id FROM "User" 
                WHERE auth.uid()::text = "googleId" OR auth.jwt() ->> 'email' = email
            )
        );

    CREATE POLICY "Users can insert own categories" ON "Category"
        FOR INSERT WITH CHECK (
            "userId" IN (
                SELECT id FROM "User" 
                WHERE auth.uid()::text = "googleId" OR auth.jwt() ->> 'email' = email
            )
        );

    CREATE POLICY "Users can update own categories" ON "Category"
        FOR UPDATE USING (
            "userId" IN (
                SELECT id FROM "User" 
                WHERE auth.uid()::text = "googleId" OR auth.jwt() ->> 'email' = email
            )
        );

    CREATE POLICY "Users can delete own categories" ON "Category"
        FOR DELETE USING (
            "userId" IN (
                SELECT id FROM "User" 
                WHERE auth.uid()::text = "googleId" OR auth.jwt() ->> 'email' = email
            )
        );
    
    RAISE NOTICE 'Created Category table policies';
  END IF;

  -- Create Expense table policies if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Expense' AND table_schema = 'public') THEN
    CREATE POLICY "Users can view own expenses" ON "Expense"
        FOR SELECT USING (
            "userId" IN (
                SELECT id FROM "User" 
                WHERE auth.uid()::text = "googleId" OR auth.jwt() ->> 'email' = email
            )
        );

    CREATE POLICY "Users can insert own expenses" ON "Expense"
        FOR INSERT WITH CHECK (
            "userId" IN (
                SELECT id FROM "User" 
                WHERE auth.uid()::text = "googleId" OR auth.jwt() ->> 'email' = email
            )
        );

    CREATE POLICY "Users can update own expenses" ON "Expense"
        FOR UPDATE USING (
            "userId" IN (
                SELECT id FROM "User" 
                WHERE auth.uid()::text = "googleId" OR auth.jwt() ->> 'email' = email
            )
        );

    CREATE POLICY "Users can delete own expenses" ON "Expense"
        FOR DELETE USING (
            "userId" IN (
                SELECT id FROM "User" 
                WHERE auth.uid()::text = "googleId" OR auth.jwt() ->> 'email' = email
            )
        );
    
    RAISE NOTICE 'Created Expense table policies';
  END IF;
END $$;

-- Add missing order column to Category table if it exists and doesn't have the column
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Category' AND table_schema = 'public') THEN
    -- Add order column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'Category' AND column_name = 'order' AND table_schema = 'public') THEN
      ALTER TABLE "Category" ADD COLUMN "order" INTEGER DEFAULT 0;
      RAISE NOTICE 'Added order column to Category table';
    ELSE
      RAISE NOTICE 'Order column already exists in Category table';
    END IF;

    -- Update existing categories to have sequential order
    WITH ordered_categories AS (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY id) - 1 as new_order
      FROM "Category"
      WHERE "order" IS NULL OR "order" = 0
    )
    UPDATE "Category" c
    SET "order" = oc.new_order
    FROM ordered_categories oc
    WHERE c.id = oc.id;

    -- Create index for better query performance
    CREATE INDEX IF NOT EXISTS "Category_userId_order_idx" ON "Category"("userId", "order");
    RAISE NOTICE 'Updated Category order values and created index';
  ELSE
    RAISE NOTICE 'Category table does not exist';
  END IF;
END $$;

-- Check the final state
DO $$
DECLARE
  user_count INTEGER := 0;
  category_count INTEGER := 0;
  expense_count INTEGER := 0;
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'User' AND table_schema = 'public') THEN
    SELECT COUNT(*) INTO user_count FROM "User";
    RAISE NOTICE 'User table record count: %', user_count;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Category' AND table_schema = 'public') THEN
    SELECT COUNT(*) INTO category_count FROM "Category";
    RAISE NOTICE 'Category table record count: %', category_count;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Expense' AND table_schema = 'public') THEN
    SELECT COUNT(*) INTO expense_count FROM "Expense";
    RAISE NOTICE 'Expense table record count: %', expense_count;
  END IF;
END $$;