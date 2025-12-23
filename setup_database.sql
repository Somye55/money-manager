-- Setup Database for Money Manager
-- Run this first if your tables don't exist

-- Check what tables currently exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

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

-- Create UserSettings table if it doesn't exist
CREATE TABLE IF NOT EXISTS "UserSettings" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL UNIQUE,
    currency TEXT NOT NULL DEFAULT 'INR',
    "monthlyBudget" DECIMAL(10,2),
    "enableNotifications" BOOLEAN NOT NULL DEFAULT true,
    theme TEXT NOT NULL DEFAULT 'system',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Category table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Category" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Category_name_userId_unique" UNIQUE (name, "userId")
);

-- Add order column to Category table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Category' AND column_name = 'order' AND table_schema = 'public') THEN
        ALTER TABLE "Category" ADD COLUMN "order" INTEGER DEFAULT 0;
        RAISE NOTICE 'Added order column to Category table';
    ELSE
        RAISE NOTICE 'Order column already exists in Category table';
    END IF;
END $$;

-- Create Source enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "Source" AS ENUM ('MANUAL', 'SMS');
EXCEPTION
    WHEN duplicate_object THEN null;
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
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for better query performance (only if columns exist)
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
CREATE INDEX IF NOT EXISTS "User_googleId_idx" ON "User"("googleId");
CREATE INDEX IF NOT EXISTS "Category_userId_idx" ON "Category"("userId");
CREATE INDEX IF NOT EXISTS "Expense_userId_idx" ON "Expense"("userId");
CREATE INDEX IF NOT EXISTS "Expense_categoryId_idx" ON "Expense"("categoryId");
CREATE INDEX IF NOT EXISTS "Expense_date_idx" ON "Expense"(date DESC);

-- Create Category order index only if order column exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Category' AND column_name = 'order' AND table_schema = 'public') THEN
        CREATE INDEX IF NOT EXISTS "Category_userId_order_idx" ON "Category"("userId", "order");
        RAISE NOTICE 'Created Category order index';
    END IF;
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updatedAt
DROP TRIGGER IF EXISTS update_user_updated_at ON "User";
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON "UserSettings";
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON "UserSettings" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_category_updated_at ON "Category";
CREATE TRIGGER update_category_updated_at BEFORE UPDATE ON "Category" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_expense_updated_at ON "Expense";
CREATE TRIGGER update_expense_updated_at BEFORE UPDATE ON "Expense" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Expense" ENABLE ROW LEVEL SECURITY;

-- Show final table list
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;