-- Fix Expense table timestamp issues
-- Run this in your Supabase SQL editor

-- Check current Expense table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'Expense' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Ensure the updatedAt column has proper default
DO $
BEGIN
    -- Check if updatedAt column exists and fix its default if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Expense' 
        AND column_name = 'updatedAt' 
        AND table_schema = 'public'
    ) THEN
        -- Set default value for updatedAt if it doesn't have one
        ALTER TABLE "Expense" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Set default for updatedAt column';
    END IF;

    -- Check if createdAt column exists and fix its default if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Expense' 
        AND column_name = 'createdAt' 
        AND table_schema = 'public'
    ) THEN
        -- Set default value for createdAt if it doesn't have one
        ALTER TABLE "Expense" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Set default for createdAt column';
    END IF;
END $;

-- Recreate the trigger function to handle both INSERT and UPDATE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    -- For INSERT operations, set both createdAt and updatedAt if they're null
    IF TG_OP = 'INSERT' THEN
        IF NEW."createdAt" IS NULL THEN
            NEW."createdAt" = CURRENT_TIMESTAMP;
        END IF;
        IF NEW."updatedAt" IS NULL THEN
            NEW."updatedAt" = CURRENT_TIMESTAMP;
        END IF;
        RETURN NEW;
    END IF;
    
    -- For UPDATE operations, only update updatedAt
    IF TG_OP = 'UPDATE' THEN
        NEW."updatedAt" = CURRENT_TIMESTAMP;
        RETURN NEW;
    END IF;
    
    RETURN NEW;
END;
$ language 'plpgsql';

-- Drop and recreate the trigger for INSERT and UPDATE
DROP TRIGGER IF EXISTS update_expense_updated_at ON "Expense";
CREATE TRIGGER update_expense_updated_at 
    BEFORE INSERT OR UPDATE ON "Expense" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Test the fix by checking if we can insert a minimal expense record
-- (This is just a test - you can remove this section if you prefer)
DO $
DECLARE
    test_user_id INTEGER;
    test_category_id INTEGER;
BEGIN
    -- Get a test user ID (first user in the system)
    SELECT id INTO test_user_id FROM "User" LIMIT 1;
    
    -- Get a test category ID for that user
    SELECT id INTO test_category_id FROM "Category" WHERE "userId" = test_user_id LIMIT 1;
    
    IF test_user_id IS NOT NULL AND test_category_id IS NOT NULL THEN
        -- Try to insert a test expense without explicit timestamps
        INSERT INTO "Expense" (amount, description, "categoryId", "userId", source)
        VALUES (1.00, 'Test expense - can be deleted', test_category_id, test_user_id, 'MANUAL');
        
        RAISE NOTICE 'Test expense inserted successfully - timestamps should be auto-generated';
        
        -- Clean up the test expense
        DELETE FROM "Expense" WHERE description = 'Test expense - can be deleted' AND amount = 1.00;
        RAISE NOTICE 'Test expense cleaned up';
    ELSE
        RAISE NOTICE 'No test user or category found - skipping test insert';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Test insert failed: %', SQLERRM;
END $;

-- Show the final column structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'Expense' 
AND table_schema = 'public'
AND column_name IN ('createdAt', 'updatedAt')
ORDER BY column_name;