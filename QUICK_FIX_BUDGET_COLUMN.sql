-- QUICK FIX: Add missing budget column to Category table
-- Run this script to fix the "could not find the budget column" error

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