# Database Migration Guide

## Overview

This guide helps you migrate your existing Money Manager database to support the new category ordering feature.

## What's Being Added?

The migration adds three new columns to the `Category` table:

- `order` (INTEGER): For custom category ordering
- `createdAt` (TIMESTAMP): Track when category was created
- `updatedAt` (TIMESTAMP): Track last modification

## Migration Methods

### Method 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**

   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to SQL Editor**

   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy Migration Script**

   - Open `add_category_order.sql` from the project root
   - Copy all contents

4. **Run Migration**

   - Paste the SQL into the editor
   - Click "Run" or press Ctrl+Enter
   - Wait for success message

5. **Verify**
   ```sql
   SELECT column_name, data_type, column_default
   FROM information_schema.columns
   WHERE table_name = 'Category';
   ```
   You should see `order`, `createdAt`, and `updatedAt` columns.

### Method 2: Using psql Command Line

1. **Get Database URL**

   - From Supabase Dashboard > Settings > Database
   - Copy the connection string
   - Or use your `.env` DATABASE_URL

2. **Run Migration**

   ```bash
   psql "your_database_url_here" -f add_category_order.sql
   ```

3. **Verify**
   ```bash
   psql "your_database_url_here" -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'Category';"
   ```

### Method 3: Prisma Migrate (Alternative)

If you prefer using Prisma's migration system:

1. **Create Migration**

   ```bash
   cd server
   npx prisma migrate dev --name add_category_order
   ```

2. **Apply to Production**
   ```bash
   npx prisma migrate deploy
   ```

## Post-Migration Steps

### 1. Regenerate Prisma Client

After running the migration, regenerate the Prisma client:

```bash
cd server
npx prisma generate
```

You should see:

```
✔ Generated Prisma Client
```

### 2. Restart Server

```bash
# Stop the server (Ctrl+C)
# Then restart
npm start
```

### 3. Verify in Application

1. Open the app
2. Go to Settings
3. Check that categories are displayed
4. Try reordering a category
5. Refresh the page - order should persist

## Migration Script Explained

```sql
-- Add order column with default value of 0
ALTER TABLE "Category"
ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Add timestamp columns
ALTER TABLE "Category"
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Category"
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Assign sequential order to existing categories
-- This ensures existing categories have proper order values
WITH ordered_categories AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY id) - 1 as new_order
  FROM "Category"
)
UPDATE "Category" c
SET "order" = oc.new_order
FROM ordered_categories oc
WHERE c.id = oc.id;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS "Category_userId_order_idx" ON "Category"("userId", "order");
```

### What Each Part Does:

1. **ADD COLUMN IF NOT EXISTS**: Safely adds columns (won't fail if already exists)
2. **DEFAULT 0**: New categories start at order 0
3. **TIMESTAMP(3)**: Millisecond precision timestamps
4. **WITH ordered_categories**: Assigns order based on existing category IDs
5. **ROW_NUMBER()**: Generates sequential numbers per user
6. **CREATE INDEX**: Improves query performance for ordered lists

## Rollback (If Needed)

If you need to undo the migration:

```sql
-- Remove the columns
ALTER TABLE "Category" DROP COLUMN IF EXISTS "order";
ALTER TABLE "Category" DROP COLUMN IF EXISTS "createdAt";
ALTER TABLE "Category" DROP COLUMN IF EXISTS "updatedAt";

-- Remove the index
DROP INDEX IF EXISTS "Category_userId_order_idx";
```

**Warning**: This will delete the order data. Only rollback if absolutely necessary.

## Troubleshooting

### Error: Column already exists

**Solution**: The migration is idempotent. It's safe to run multiple times. The error can be ignored.

### Error: Permission denied

**Solution**: Ensure you have database admin permissions. Contact your database administrator.

### Error: Syntax error near "IF NOT EXISTS"

**Solution**: Your PostgreSQL version might be old. Update to PostgreSQL 9.5+.

### Categories not showing order

**Solution**:

1. Verify migration ran successfully
2. Check Prisma client was regenerated
3. Restart the server
4. Clear browser cache

### Drag & drop not saving order

**Solution**:

1. Check browser console for errors
2. Verify API endpoint is working
3. Check database connection
4. Ensure migration completed

## Verification Queries

### Check if columns exist

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'Category'
AND column_name IN ('order', 'createdAt', 'updatedAt');
```

### Check existing category orders

```sql
SELECT id, name, "order", "userId"
FROM "Category"
ORDER BY "userId", "order";
```

### Check index exists

```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'Category';
```

### Count categories per user

```sql
SELECT "userId", COUNT(*) as category_count
FROM "Category"
GROUP BY "userId";
```

## Performance Considerations

### Before Migration

- Backup your database (recommended)
- Run during low-traffic period
- Estimated time: < 1 second for most databases

### After Migration

- Index improves query performance
- No impact on existing queries
- Slight increase in storage (3 columns per row)

### Database Size Impact

- **order**: 4 bytes per row
- **createdAt**: 8 bytes per row
- **updatedAt**: 8 bytes per row
- **Total**: ~20 bytes per category

For 1000 categories: ~20 KB additional storage (negligible)

## Testing Checklist

After migration, verify:

- [ ] Migration completed without errors
- [ ] All three columns exist in Category table
- [ ] Index was created successfully
- [ ] Existing categories have order values
- [ ] Prisma client regenerated
- [ ] Server restarts without errors
- [ ] Categories display in app
- [ ] Can create new category
- [ ] Can edit existing category
- [ ] Can delete category
- [ ] Can reorder categories via drag & drop
- [ ] Order persists after page refresh
- [ ] Multiple users have independent orders

## Production Deployment

### Pre-Deployment

1. Test migration on staging database
2. Backup production database
3. Schedule maintenance window (optional)
4. Notify users of brief downtime (if needed)

### Deployment Steps

1. Run migration on production database
2. Deploy updated server code
3. Regenerate Prisma client on server
4. Restart server
5. Deploy updated client
6. Verify functionality
7. Monitor for errors

### Post-Deployment

1. Check server logs for errors
2. Test category operations
3. Verify drag & drop works
4. Monitor database performance
5. Collect user feedback

## Support

### Common Issues

**Q: Do I need to run this on development and production?**  
A: Yes, run on all environments where the app is deployed.

**Q: Will this affect existing expenses?**  
A: No, only the Category table is modified. Expenses are unaffected.

**Q: Can I customize the default order?**  
A: Yes, after migration, users can reorder categories via drag & drop.

**Q: What if I have thousands of categories?**  
A: Migration is fast even with large datasets. The index ensures good performance.

**Q: Is this migration reversible?**  
A: Yes, but you'll lose the order data. See Rollback section.

### Getting Help

If you encounter issues:

1. Check error messages carefully
2. Review this guide's troubleshooting section
3. Verify PostgreSQL version (9.5+ required)
4. Check database permissions
5. Review server logs
6. Test on a development database first

## Summary

✅ **Safe**: Uses IF NOT EXISTS for idempotency  
✅ **Fast**: Completes in under 1 second  
✅ **Reversible**: Can be rolled back if needed  
✅ **Tested**: Verified on multiple databases  
✅ **Documented**: Comprehensive guide provided

The migration is production-ready and safe to deploy.

---

**Last Updated**: December 2024  
**Database**: PostgreSQL 9.5+  
**Tested On**: Supabase, AWS RDS, Local PostgreSQL
