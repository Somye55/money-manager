-- Add budget column to Category table
-- This allows users to assign a budget to each category

DO $ 
BEGIN
    -- Add budget column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'Category' 
                   AND column_name = 'budget' 
                   AND table_schema = 'public') THEN
        ALTER TABLE "Category" ADD COLUMN "budget" DECIMAL(10,2) DEFAULT NULL;
        RAISE NOTICE 'Added budget column to Category table';
    ELSE
        RAISE NOTICE 'Budget column already exists in Category table';
    END IF;
END $;

-- Add comment to document the budget column
COMMENT ON COLUMN "Category"."budget" IS 'Monthly budget limit for this category in the user''s currency';