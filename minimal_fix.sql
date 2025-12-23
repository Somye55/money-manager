-- Minimal fix to get your app working
-- This assumes some tables already exist and just fixes what's needed

-- Check what tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Add missing columns to Category table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Category' AND table_schema = 'public') THEN
    -- Add order column if missing
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'Category' AND column_name = 'order') THEN
      ALTER TABLE "Category" ADD COLUMN "order" INTEGER DEFAULT 0;
    END IF;
    
    -- Add createdAt column if missing
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'Category' AND column_name = 'createdAt') THEN
      ALTER TABLE "Category" ADD COLUMN "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    -- Add updatedAt column if missing
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'Category' AND column_name = 'updatedAt') THEN
      ALTER TABLE "Category" ADD COLUMN "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
    END IF;
  END IF;
END $$;

-- Create User table if it doesn't exist
CREATE TABLE IF NOT EXISTS "User" (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    phone TEXT UNIQUE,
    name TEXT,
    "googleId" TEXT UNIQUE,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create Category table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Category" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    "order" INTEGER DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create Expense table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Expense" (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER,
    "userId" INTEGER NOT NULL,
    source TEXT DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create UserSettings table if it doesn't exist
CREATE TABLE IF NOT EXISTS "UserSettings" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER UNIQUE,
    currency TEXT DEFAULT 'INR',
    "monthlyBudget" DECIMAL(10,2),
    "enableNotifications" BOOLEAN DEFAULT true,
    theme TEXT DEFAULT 'system',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Temporarily disable RLS to test (REMOVE THIS IN PRODUCTION)
ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Expense" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "UserSettings" DISABLE ROW LEVEL SECURITY;

-- Show final table structure
SELECT 
  t.table_name,
  c.column_name,
  c.data_type
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name, c.ordinal_position;