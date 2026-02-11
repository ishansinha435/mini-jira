# Database Migrations

This folder contains SQL migration files for the Mini JIRA project.

## How to Apply Migrations

Since we're using Supabase as our backend, migrations are applied manually through the Supabase Dashboard:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy the contents of the migration file
6. Paste into the SQL Editor
7. Click **Run** to execute
8. Verify success in the **Table Editor**

## Migration Files

| File | Description | Milestone | Status |
|------|-------------|-----------|--------|
| `004_create_comments_table.sql` | Comments table with RLS | Milestone 4 | Ready to apply |

## Migration Order

Apply migrations in numerical order (001, 002, 003, etc.) to ensure dependencies are met.

**Note:** Migrations 001-003 were applied during Milestones 1-3 via the Supabase dashboard. Only new migrations need to be applied going forward.

## Verification

After applying a migration, verify:

```sql
-- Check table exists
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'your_table_name';

-- Check RLS enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename = 'your_table_name';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'your_table_name';
```

## Rollback

If a migration needs to be rolled back:

1. Manually drop the table/policies in SQL Editor
2. Re-apply previous state

**Important:** Always backup your data before applying migrations in production!

---

*Last updated: February 11, 2026*
