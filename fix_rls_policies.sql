-- Fix RLS policies for Money Manager app
-- Run this in your Supabase SQL editor

-- First, let's check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check if there are any users with mismatched googleId (only if User table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'User' AND table_schema = 'public') THEN
    RAISE NOTICE 'User table exists, checking data...';
    -- This will show the results in the logs
    PERFORM id, email, "googleId", "createdAt" FROM "User" ORDER BY "createdAt" DESC LIMIT 5;
  ELSE
    RAISE NOTICE 'User table does not exist';
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
  END IF;

  -- Drop UserSettings policies if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'UserSettings' AND table_schema = 'public') THEN
    DROP POLICY IF EXISTS "Users can view own settings" ON "UserSettings";
    DROP POLICY IF EXISTS "Users can update own settings" ON "UserSettings";
    DROP POLICY IF EXISTS "Users can insert own settings" ON "UserSettings";
  END IF;

  -- Drop Category policies if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Category' AND table_schema = 'public') THEN
    DROP POLICY IF EXISTS "Users can view own categories" ON "Category";
    DROP POLICY IF EXISTS "Users can insert own categories" ON "Category";
    DROP POLICY IF EXISTS "Users can update own categories" ON "Category";
    DROP POLICY IF EXISTS "Users can delete own categories" ON "Category";
  END IF;

  -- Drop Expense policies if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Expense' AND table_schema = 'public') THEN
    DROP POLICY IF EXISTS "Users can view own expenses" ON "Expense";
    DROP POLICY IF EXISTS "Users can insert own expenses" ON "Expense";
    DROP POLICY IF EXISTS "Users can update own expenses" ON "Expense";
    DROP POLICY IF EXISTS "Users can delete own expenses" ON "Expense";
  END IF;
END $$;

-- Create improved RLS policies for User table
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

-- Create RLS policies for UserSettings table
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

-- Create RLS policies for Category table
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

-- Create RLS policies for Expense table
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

-- Add missing order column to Category table if it doesn't exist
ALTER TABLE "Category" 
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

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

-- Check the final state
SELECT 
  'User' as table_name,
  COUNT(*) as record_count
FROM "User"
UNION ALL
SELECT 
  'Category' as table_name,
  COUNT(*) as record_count
FROM "Category"
UNION ALL
SELECT 
  'Expense' as table_name,
  COUNT(*) as record_count
FROM "Expense";