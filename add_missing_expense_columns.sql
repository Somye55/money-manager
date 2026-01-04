-- Add all missing columns to Expense table
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
        RAISE NOTICE 'ℹ️ notes column already exists';
    END IF;
END $;

-- Add smsTimestamp column if it doesn't exist
DO $
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Expense' 
        AND column_name = 'smsTimestamp' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Expense" ADD COLUMN "smsTimestamp" TIMESTAMP(3);
        RAISE NOTICE '✅ Added smsTimestamp column to Expense table';
    ELSE
        RAISE NOTICE 'ℹ️ smsTimestamp column already exists';
    END IF;
END $;

-- Add rawSmsBody column if it doesn't exist
DO $
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Expense' 
        AND column_name = 'rawSmsBody' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE "Expense" ADD COLUMN "rawSmsBody" TEXT;
        RAISE NOTICE '✅ Added rawSmsBody column to Expense table';
    ELSE
        RAISE NOTICE 'ℹ️ rawSmsBody column already exists';
    END IF;
END $;

-- Verify all columns were added
SELECT 
    column_name, 
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'Expense'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show summary
DO $
DECLARE
    col_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO col_count
    FROM information_schema.columns
    WHERE table_name = 'Expense'
    AND table_schema = 'public';
    
    RAISE NOTICE '✅ Expense table now has % columns', col_count;
END $;
