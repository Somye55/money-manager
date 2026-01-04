-- Fix expenses with incorrect year (2025 should be 2026)
-- This updates expenses where the date is in 2025 but should be in 2026

UPDATE "Expense"
SET 
  date = date + INTERVAL '1 year',
  "updatedAt" = NOW()
WHERE 
  EXTRACT(YEAR FROM date) = 2025
  AND EXTRACT(YEAR FROM "createdAt") = 2026;

-- Show updated expenses
SELECT 
  id,
  description,
  amount,
  date,
  "createdAt",
  source
FROM "Expense"
WHERE EXTRACT(YEAR FROM date) = 2026
ORDER BY date DESC;
