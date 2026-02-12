# Complete Database Migration Guide

This guide walks you through applying all database migrations for Mini JIRA in the Supabase Dashboard.

## Prerequisites

- A Supabase account with a project created
- Your Supabase project URL and anon key in `.env.local`

## Overview

You need to apply 3 migrations in order:
1. **Migration 004** - Comments table
2. **Migration 005** - Attachments table  
3. **Migration 006** - Activity tracking table

---

## Step-by-Step Instructions

### 1. Access Supabase SQL Editor

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your Mini JIRA project
4. In the left sidebar, click **SQL Editor**

### 2. Apply Migration 004 - Comments Table

**What it does:** Creates the `comments` table with RLS policies so users can comment on tasks.

1. In your code editor, open:
   ```
   ProjectDocs/migrations/004_create_comments_table.sql
   ```

2. Copy the ENTIRE contents of the file

3. In Supabase SQL Editor:
   - Click **New query** (or use existing blank query)
   - Paste the SQL code
   - Click **RUN** (or press Cmd+Enter / Ctrl+Enter)

4. You should see: ✅ **Success. No rows returned**

5. Verify:
   - Go to **Table Editor** in the left sidebar
   - You should see a new `comments` table

---

### 3. Apply Migration 005 - Attachments Table

**What it does:** Creates the `attachments` table with RLS policies for file uploads.

1. In your code editor, open:
   ```
   ProjectDocs/migrations/005_create_attachments_table.sql
   ```

2. Copy the ENTIRE contents

3. In Supabase SQL Editor:
   - Click **New query**
   - Paste the SQL code
   - Click **RUN**

4. You should see: ✅ **Success. No rows returned**

5. Verify:
   - Go to **Table Editor**
   - You should see a new `attachments` table

---

### 4. Apply Migration 006 - Activity Table

**What it does:** Creates the `activity` table to track all user actions (project creation, task completion, comments, etc.).

1. In your code editor, open:
   ```
   ProjectDocs/migrations/006_create_activity_table.sql
   ```

2. Copy the ENTIRE contents

3. In Supabase SQL Editor:
   - Click **New query**
   - Paste the SQL code
   - Click **RUN**

4. You should see: ✅ **Success. No rows returned**

5. Verify:
   - Go to **Table Editor**
   - You should see a new `activity` table

---

### 5. Set Up Storage Bucket (Required for Attachments)

**What it does:** Creates a private storage bucket for file uploads with proper security policies.

1. In Supabase Dashboard, go to **Storage** in the left sidebar

2. Click **Create a new bucket**

3. Configure the bucket:
   - **Name:** `attachments`
   - **Public:** ❌ **Leave UNCHECKED** (bucket should be private)
   - **File size limit:** 50MB (or your preferred limit)
   - **Allowed MIME types:** Leave empty (allow all)
   - Click **Create bucket**

4. Set up storage policies:
   - Click on the `attachments` bucket
   - Go to **Policies** tab
   - Click **New policy**

5. Create **SELECT policy** (for downloading):
   - **Policy name:** `Users can view their own attachments`
   - **Target roles:** `authenticated`
   - **Policy definition:** Use SQL editor and paste:
     ```sql
     (bucket_id = 'attachments'::text) 
     AND (auth.uid() = (storage.foldername(name))[1]::uuid)
     ```
   - Click **Review** → **Save policy**

6. Create **INSERT policy** (for uploading):
   - Click **New policy**
   - **Policy name:** `Users can upload their own attachments`
   - **Target roles:** `authenticated`
   - **Policy definition:**
     ```sql
     (bucket_id = 'attachments'::text) 
     AND (auth.uid() = (storage.foldername(name))[1]::uuid)
     ```
   - Click **Review** → **Save policy**

7. Create **DELETE policy** (for deleting):
   - Click **New policy**
   - **Policy name:** `Users can delete their own attachments`
   - **Target roles:** `authenticated`
   - **Policy definition:**
     ```sql
     (bucket_id = 'attachments'::text) 
     AND (auth.uid() = (storage.foldername(name))[1]::uuid)
     ```
   - Click **Review** → **Save policy**

---

## Verification - Final Check

### Verify All Tables Exist

Run this query in SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('projects', 'tasks', 'comments', 'attachments', 'activity')
ORDER BY table_name;
```

You should see:
- ✅ activity
- ✅ attachments
- ✅ comments
- ✅ projects
- ✅ tasks

### Verify Storage Bucket

1. Go to **Storage**
2. You should see `attachments` bucket
3. Click on it → **Policies** tab
4. You should see 3 policies (SELECT, INSERT, DELETE)

---

## What Features Work After Migrations

Once all migrations are applied:

✅ **Comments** (Migration 004)
- Add/view/delete comments on tasks
- Comment count badges

✅ **Attachments** (Migration 005 + Storage)
- Upload files to tasks (images, PDFs, documents)
- Download attachments
- Delete attachments
- File size/type validation

✅ **Activity Feed** (Migration 006)
- Dashboard shows recent activity
- Tracks: project creation, task creation, task completion, comments, uploads

---

## Troubleshooting

### "relation already exists" error
- This table was already created
- Safe to skip this migration

### "permission denied" error
- You might not be the project owner
- Check you're logged into the correct Supabase account

### Storage policies not working
- Make sure the bucket is named exactly `attachments`
- Verify the bucket is PRIVATE (not public)
- Check that all 3 policies are created with correct SQL

### Activity feed still empty
- Activity only logs NEW actions after migration 006
- Try creating a new project or task
- Check browser console for errors

---

## Need Help?

If you encounter issues:

1. Check the Supabase Dashboard → **Logs** for errors
2. Check browser console (F12) for client-side errors
3. Verify your `.env.local` has correct credentials
4. Ensure you're logged into the app with a valid account

---

## Summary Commands

Quick reference for verification queries:

```sql
-- Check if comments table exists
SELECT COUNT(*) FROM comments;

-- Check if attachments table exists  
SELECT COUNT(*) FROM attachments;

-- Check if activity table exists
SELECT COUNT(*) FROM activity;

-- View all your tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```
