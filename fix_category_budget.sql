-- Fix Category Budget Column Issue
-- This script adds the missing budget column to the Category table

-- Add budget column to Category table if it doesn't exist
DO $ 
BEGIN
    -- Check if budget column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Category' 
                   AND column_name = 'budget' 
                   AND table_schema = 'public') THEN
        
        -- Add the budget column
        ALTER TABLE "Category" ADD COLUMN "budget" DECIMAL(10,2) DEFAULT NULL;
        
        -- Add comment to document the budget column
        COMMENT ON COLUMN "Category"."budget" IS 'Monthly budget limit for this category in the user''s currency';
        
        RAISE NOTICE 'Successfully added budget column to Category table';
    ELSE
        RAISE NOTICE 'Budget column already exists in Category table';
    END IF;
END $;

-- Verify the column was added
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Category' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample of Category table structure
SELECT 
    'Category table structure verified' as status,
    COUNT(*) as total_categories
FROM "Category";