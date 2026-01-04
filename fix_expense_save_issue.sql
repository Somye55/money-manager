-- Fix Expense Save Issue
-- Run this in Supabase SQL Editor

-- 1. Check what columns exist in Expense table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Expense'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'Expense';

-- 3. Make description nullable if it's required
ALTER TABLE "Expense" ALTER COLUMN description DROP NOT NULL;

-- 4. Ensure RLS policy allows inserts
DROP POLICY IF EXISTS "Users can insert own expenses" ON "Expense";

CREATE POLICY "Users can insert own expenses" ON "Expense"
    FOR INSERT 
    WITH CHECK (
        "userId" IN (
            SELECT id FROM "User"
            WHERE auth.uid()::text = "googleId"
            OR auth.jwt() ->> 'email' = email
        )
    );

-- 5. Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'Expense' AND cmd = 'INSERT';
