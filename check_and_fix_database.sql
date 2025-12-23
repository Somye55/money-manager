-- Check and Fix Database for Money Manager
-- This script safely checks what exists and creates what's missing

-- First, let's see what we have
SELECT 
  'Current Tables:' as info,
  table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check Category table structure if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Category' AND table_schema = 'public') THEN
    RAISE NOTICE 'Category table exists. Checking columns...';
    
    -- Check if order column exists
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'Category' AND column_name = 'order' AND table_schema = 'public') THEN
      ALTER TABLE "Category" ADD COLUMN "order" INTEGER DEFAULT 0;
      RAISE NOTICE 'Added missing order column to Category table';
    ELSE
      RAISE NOTICE 'Order column already exists in Category table';
    END IF;
    
    -- Check if createdAt column exists
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'Category' AND column_name = 'createdAt' AND table_schema = 'public') THEN
      ALTER TABLE "Category" ADD COLUMN "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
      RAISE NOTICE 'Added missing createdAt column to Category table';
    END IF;
    
    -- Check if updatedAt column exists
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'Category' AND column_name = 'updatedAt' AND table_schema = 'public') THEN
      ALTER TABLE "Category" ADD COLUMN "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
      RAISE NOTICE 'Added missing updatedAt column to Category table';
    END IF;
    
  ELSE
    RAISE NOTICE 'Category table does not exist - will create it';
  END IF;
END $$;

-- Create User table if it doesn't exist
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    name TEXT,
    password TEXT,
    "googleId" TEXT UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Category table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Category" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add missing columns to Category if table already existed
DO $$
BEGIN
  -- Add order column if missing
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'Category' AND column_name = 'order' AND table_schema = 'public') THEN
    ALTER TABLE "Category" ADD COLUMN "order" INTEGER DEFAULT 0;
    RAISE NOTICE 'Added order column to existing Category table';
  END IF;
  
  -- Add foreign key constraint if missing
  IF NOT EXISTS (SELECT FROM information_schema.table_constraints WHERE constraint_name = 'Category_userId_fkey' AND table_name = 'Category') THEN
    ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE;
    RAISE NOTICE 'Added foreign key constraint to Category table';
  END IF;
  
  -- Add unique constraint if missing
  IF NOT EXISTS (SELECT FROM information_schema.table_constraints WHERE constraint_name = 'Category_name_userId_unique' AND table_name = 'Category') THEN
    ALTER TABLE "Category" ADD CONSTRAINT "Category_name_userId_unique" UNIQUE (name, "userId");
    RAISE NOTICE 'Added unique constraint to Category table';
  END IF;
END $$;

-- Create Source enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "Source" AS ENUM ('MANUAL', 'SMS');
    RAISE NOTICE 'Created Source enum type';
EXCEPTION
    WHEN duplicate_object THEN 
    RAISE NOTICE 'Source enum type already exists';
END $$;

-- Create Expense table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Expense" (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER,
    "userId" INTEGER NOT NULL,
    source "Source" NOT NULL DEFAULT 'MANUAL',
    "rawSmsBody" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints to Expense if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.table_constraints WHERE constraint_name = 'Expense_categoryId_fkey' AND table_name = 'Expense') THEN
    ALTER TABLE "Expense" ADD CONSTRAINT "Expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"(id) ON DELETE SET NULL ON UPDATE CASCADE;
    RAISE NOTICE 'Added category foreign key constraint to Expense table';
  END IF;
  
  IF NOT EXISTS (SELECT FROM information_schema.table_constraints WHERE constraint_name = 'Expense_userId_fkey' AND table_name = 'Expense') THEN
    ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE;
    RAISE NOTICE 'Added user foreign key constraint to Expense table';
  END IF;
END $$;

-- Create UserSettings table if it doesn't exist
CREATE TABLE IF NOT EXISTS "UserSettings" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL UNIQUE,
    currency TEXT NOT NULL DEFAULT 'INR',
    "monthlyBudget" DECIMAL(10,2),
    "enableNotifications" BOOLEAN NOT NULL DEFAULT true,
    theme TEXT NOT NULL DEFAULT 'system',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint to UserSettings if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.table_constraints WHERE constraint_name = 'UserSettings_userId_fkey' AND table_name = 'UserSettings') THEN
    ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE;
    RAISE NOTICE 'Added foreign key constraint to UserSettings table';
  END IF;
END $$;

-- Create basic indexes
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
CREATE INDEX IF NOT EXISTS "User_googleId_idx" ON "User"("googleId");
CREATE INDEX IF NOT EXISTS "Category_userId_idx" ON "Category"("userId");
CREATE INDEX IF NOT EXISTS "Expense_userId_idx" ON "Expense"("userId");
CREATE INDEX IF NOT EXISTS "Expense_categoryId_idx" ON "Expense"("categoryId");
CREATE INDEX IF NOT EXISTS "Expense_date_idx" ON "Expense"(date DESC);

-- Create Category order index only if order column exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'Category' AND column_name = 'order' AND table_schema = 'public') THEN
        CREATE INDEX IF NOT EXISTS "Category_userId_order_idx" ON "Category"("userId", "order");
        RAISE NOTICE 'Created Category order index';
    END IF;
END $$;

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Expense" ENABLE ROW LEVEL SECURITY;

-- Show final status
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count,
  (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_name = t.table_name AND table_schema = 'public') as constraint_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Final completion message
DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
END $$;