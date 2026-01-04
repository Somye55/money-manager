-- Add missing notes column to Expense table
-- Run this in your Supabase SQL Editor

-- Add notes column if it doesn't exist
DO $
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Expense' 
        AND column_name = 'notes' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Expense" ADD COLUMN notes TEXT;
        RAISE NOTICE '✅ Added notes column to Expense table';
    ELSE
        RAISE NOTICE 'ℹ️ notes column already exists in Expense table';
    END IF;
END $;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Expense'
AND table_schema = 'public'
ORDER BY ordinal_position;
