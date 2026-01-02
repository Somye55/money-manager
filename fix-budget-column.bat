@echo off
echo.
echo ========================================
echo   FIXING CATEGORY BUDGET COLUMN ISSUE
echo ========================================
echo.
echo This will add the missing 'budget' column to the Category table.
echo.
pause

echo Running SQL fix...
echo.

REM You'll need to replace these with your actual Supabase connection details
REM Option 1: If you have psql installed and configured
REM psql -h your-supabase-host -U postgres -d postgres -f QUICK_FIX_BUDGET_COLUMN.sql

REM Option 2: Copy and paste the SQL from QUICK_FIX_BUDGET_COLUMN.sql into your Supabase SQL editor

echo.
echo INSTRUCTIONS:
echo 1. Open your Supabase dashboard
echo 2. Go to SQL Editor
echo 3. Copy and paste the contents of QUICK_FIX_BUDGET_COLUMN.sql
echo 4. Run the query
echo.
echo OR if you have psql configured:
echo psql -h your-host -U postgres -d postgres -f QUICK_FIX_BUDGET_COLUMN.sql
echo.
pause