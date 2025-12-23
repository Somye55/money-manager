-- Migration: Add order column to Category table
-- This migration adds an order field to categories for custom sorting

-- Add order column with default value
ALTER TABLE "Category" 
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Add createdAt and updatedAt if they don't exist
ALTER TABLE "Category" 
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Category" 
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Update existing categories to have sequential order based on their current order
WITH ordered_categories AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "createdAt", id) - 1 as new_order
  FROM "Category"
  WHERE "order" IS NULL OR "order" = 0
)
UPDATE "Category" c
SET "order" = oc.new_order
FROM ordered_categories oc
WHERE c.id = oc.id;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS "Category_userId_order_idx" ON "Category"("userId", "order");
