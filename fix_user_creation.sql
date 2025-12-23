-- Fix User creation issues
-- This fixes the updatedAt constraint and ensures proper user creation

-- First, let's check the current User table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'User' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Fix the updatedAt column to have a proper default
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- Also ensure createdAt has a default
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- Make updatedAt nullable temporarily to fix existing issues
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP NOT NULL;
ALTER TABLE "User" ALTER COLUMN "createdAt" DROP NOT NULL;

-- Update any existing records that might have null values
UPDATE "User" 
SET 
  "createdAt" = COALESCE("createdAt", CURRENT_TIMESTAMP),
  "updatedAt" = COALESCE("updatedAt", CURRENT_TIMESTAMP)
WHERE "createdAt" IS NULL OR "updatedAt" IS NULL;

-- Now make them NOT NULL again with proper defaults
ALTER TABLE "User" ALTER COLUMN "createdAt" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;

-- Show the fixed structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'User' 
AND table_schema = 'public'
ORDER BY ordinal_position;