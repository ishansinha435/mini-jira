# Supabase Storage Bucket Setup for Attachments

This document describes how to set up the Storage bucket for file attachments in Milestone 5.

## Step 1: Create Storage Bucket

1. Open your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `attachments`
   - **Public**: No (private bucket)
   - **File size limit**: 50 MB
   - **Allowed MIME types**: Leave empty (we'll validate on upload)
5. Click **Create bucket**

## Step 2: Configure Bucket Policies

After creating the bucket, set up Row Level Security policies:

### Policy 1: Allow Authenticated Users to Upload

```sql
-- Users can upload to their own folder
CREATE POLICY "Users can upload to their folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 2: Allow Users to Read Their Files

```sql
-- Users can read files in their folder
CREATE POLICY "Users can read their files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Policy 3: Allow Users to Delete Their Files

```sql
-- Users can delete files in their folder
CREATE POLICY "Users can delete their files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## Storage Path Structure

Files will be stored in the following structure:

```
attachments/
  {owner_id}/
    {task_id}/
      {filename}_{timestamp}.{ext}
```

Example:
```
attachments/
  550e8400-e29b-41d4-a716-446655440000/
    a1b2c3d4-e5f6-7890-abcd-ef1234567890/
      document_1707661200000.pdf
      screenshot_1707661205000.png
```

## Allowed File Types

The application validates the following file types:

**Images:**
- `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`

**Documents:**
- `.pdf`

**Archives:**
- `.zip`

## File Size Limits

- **Maximum file size**: 50 MB (enforced both client-side and bucket-side)
- Files larger than 50 MB will be rejected during upload

## Verification

After setup, verify the bucket is working:

1. Go to **Storage** > **attachments** in Supabase Dashboard
2. Check that the bucket exists and is private
3. Check that policies are active (should see 3 policies)
4. Test upload via the application

## Troubleshooting

### Upload fails with "Policy violation"
- Verify RLS policies are created correctly
- Check that the path includes the user's auth.uid()
- Ensure user is authenticated

### Cannot read/download files
- Verify SELECT policy is active
- Check signed URL generation in server action
- Ensure file path matches the storage structure

---

**Note**: These policies must be created manually in the Supabase Dashboard after creating the bucket. The application code assumes these policies are in place.
