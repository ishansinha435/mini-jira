# Activity Feed Troubleshooting Guide

## Issue: Recent Activity Not Showing

The activity feed requires the `activity` table to be set up in your Supabase database.

## Quick Check

**Have you applied migration 006?**

If not, the activity table doesn't exist yet, so no activities will be logged or displayed.

## Solution: Apply Migration 006

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Go to **SQL Editor**

2. **Run the migration**
   - Open `ProjectDocs/migrations/006_create_activity_table.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click **RUN**

3. **Verify it worked**
   - Go to **Table Editor** in Supabase
   - You should see a new `activity` table

4. **Test the activity feed**
   - Create a new project
   - Create a new task
   - Add a comment
   - Upload an attachment
   - Return to dashboard - you should now see activity!

## What Gets Logged

Once migration 006 is applied, the following actions automatically log activity:

✅ **Project created** - When you create a new project  
✅ **Task created** - When you create a new task  
✅ **Task completed** - When you mark a task as "done"  
✅ **Comment added** - When you add a comment to a task  
✅ **Attachment uploaded** - When you upload a file to a task  

## Note: Historical Data

Activity logging only captures NEW actions after migration 006 is applied. Previously created projects/tasks won't appear in the activity feed.

## Verification Query

Run this in Supabase SQL Editor to check if the table exists:

```sql
SELECT * FROM activity ORDER BY created_at DESC LIMIT 10;
```

If you get an error like "relation 'activity' does not exist", you need to apply migration 006.
