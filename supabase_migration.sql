-- Money Manager Database Schema for Supabase
-- This script creates all necessary tables for the money manager application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create User table
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

-- Create UserSettings table
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

-- Create Category table
CREATE TABLE IF NOT EXISTS "Category" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Category_name_userId_unique" UNIQUE (name, "userId")
);

-- Create Source enum type
DO $$ BEGIN
    CREATE TYPE "Source" AS ENUM ('MANUAL', 'SMS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Expense table
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);
CREATE INDEX IF NOT EXISTS "User_googleId_idx" ON "User"("googleId");
CREATE INDEX IF NOT EXISTS "Category_userId_idx" ON "Category"("userId");
CREATE INDEX IF NOT EXISTS "Expense_userId_idx" ON "Expense"("userId");
CREATE INDEX IF NOT EXISTS "Expense_categoryId_idx" ON "Expense"("categoryId");
CREATE INDEX IF NOT EXISTS "Expense_date_idx" ON "Expense"(date DESC);

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

DROP TRIGGER IF EXISTS update_expense_updated_at ON "Expense";
CREATE TRIGGER update_expense_updated_at BEFORE UPDATE ON "Expense" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Expense" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for User table
CREATE POLICY "Users can view own data" ON "User"
    FOR SELECT USING (auth.uid()::text = "googleId");

CREATE POLICY "Users can update own data" ON "User"
    FOR UPDATE USING (auth.uid()::text = "googleId");

-- Create RLS policies for UserSettings table
CREATE POLICY "Users can view own settings" ON "UserSettings"
    FOR SELECT USING (
        "userId" IN (SELECT id FROM "User" WHERE auth.uid()::text = "googleId")
    );

CREATE POLICY "Users can update own settings" ON "UserSettings"
    FOR UPDATE USING (
        "userId" IN (SELECT id FROM "User" WHERE auth.uid()::text = "googleId")
    );

CREATE POLICY "Users can insert own settings" ON "UserSettings"
    FOR INSERT WITH CHECK (
        "userId" IN (SELECT id FROM "User" WHERE auth.uid()::text = "googleId")
    );

-- Create RLS policies for Category table
CREATE POLICY "Users can view own categories" ON "Category"
    FOR SELECT USING (
        "userId" IN (SELECT id FROM "User" WHERE auth.uid()::text = "googleId")
    );

CREATE POLICY "Users can insert own categories" ON "Category"
    FOR INSERT WITH CHECK (
        "userId" IN (SELECT id FROM "User" WHERE auth.uid()::text = "googleId")
    );

CREATE POLICY "Users can update own categories" ON "Category"
    FOR UPDATE USING (
        "userId" IN (SELECT id FROM "User" WHERE auth.uid()::text = "googleId")
    );

CREATE POLICY "Users can delete own categories" ON "Category"
    FOR DELETE USING (
        "userId" IN (SELECT id FROM "User" WHERE auth.uid()::text = "googleId")
    );

-- Create RLS policies for Expense table
CREATE POLICY "Users can view own expenses" ON "Expense"
    FOR SELECT USING (
        "userId" IN (SELECT id FROM "User" WHERE auth.uid()::text = "googleId")
    );

CREATE POLICY "Users can insert own expenses" ON "Expense"
    FOR INSERT WITH CHECK (
        "userId" IN (SELECT id FROM "User" WHERE auth.uid()::text = "googleId")
    );

CREATE POLICY "Users can update own expenses" ON "Expense"
    FOR UPDATE USING (
        "userId" IN (SELECT id FROM "User" WHERE auth.uid()::text = "googleId")
    );

CREATE POLICY "Users can delete own expenses" ON "Expense"
    FOR DELETE USING (
        "userId" IN (SELECT id FROM "User" WHERE auth.uid()::text = "googleId")
    );
