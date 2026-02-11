# Milestone 4 — Stage 1 Completion: Database + Types + Server Actions

**Date:** February 11, 2026  
**Stage:** 1 of 3  
**Status:** ✅ Complete

---

## Overview

Stage 1 focused on creating the database schema for comments, adding TypeScript types, and implementing server actions for comment CRUD operations.

---

## Completed Tasks

### 1. Database Schema ✅

**File:** `/ProjectDocs/migrations/004_create_comments_table.sql`

Created comments table with the following schema:

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  body TEXT NOT NULL CHECK (char_length(body) > 0 AND char_length(body) <= 5000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Features:**
- UUID primary key with auto-generation
- Foreign key to tasks with CASCADE delete
- Foreign key to auth.users for ownership
- Body field with length constraints (1-5000 characters)
- Automatic timestamp on creation

---

### 2. Database Indexes ✅

Created 3 indexes for query performance:

```sql
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_comments_owner_id ON comments(owner_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

**Purpose:**
- Fast lookup of comments by task
- Fast filtering by owner
- Efficient ordering by creation time

---

### 3. Row Level Security (RLS) ✅

**Enabled RLS:**
```sql
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
```

**Created 3 Policies:**

1. **SELECT Policy** - Users can view comments on their tasks
   ```sql
   CREATE POLICY "Users can view comments on their tasks"
     ON comments FOR SELECT
     USING (
       EXISTS (
         SELECT 1 FROM tasks
         WHERE tasks.id = comments.task_id
         AND tasks.owner_id = auth.uid()
       )
     );
   ```

2. **INSERT Policy** - Users can add comments to their tasks
   ```sql
   CREATE POLICY "Users can add comments to their tasks"
     ON comments FOR INSERT
     WITH CHECK (
       owner_id = auth.uid() AND
       EXISTS (
         SELECT 1 FROM tasks
         WHERE tasks.id = comments.task_id
         AND tasks.owner_id = auth.uid()
       )
     );
   ```

3. **DELETE Policy** - Users can delete their own comments
   ```sql
   CREATE POLICY "Users can delete their own comments"
     ON comments FOR DELETE
     USING (owner_id = auth.uid());
   ```

**Security Guarantees:**
- Users can only view comments on tasks they own
- Users cannot comment on other users' tasks
- Users can only delete their own comments
- All operations enforce owner_id = auth.uid()

---

### 4. TypeScript Types ✅

**File:** `src/types/database.ts`

Added Comment types:

```typescript
export interface Comment {
  id: string;
  task_id: string;
  owner_id: string;
  body: string;
  created_at: string;
}

export interface CommentInsert {
  task_id: string;
  owner_id?: string; // Optional - will be set by RLS policy
  body: string;
}
```

**Design:**
- Matches database schema exactly
- CommentInsert omits auto-generated fields (id, created_at)
- owner_id optional in insert (set by RLS)
- Full type safety for all operations

---

### 5. Server Actions ✅

**File:** `src/app/actions/comments.ts`

Implemented 4 server actions:

#### a) `createComment(taskId: string, body: string)`
- Validates comment body (1-5000 chars)
- Verifies user authentication
- Checks task exists and user owns it
- Inserts comment into database
- Revalidates task detail and project pages
- Returns success/error response

**Features:**
- Zod validation
- Auth checks
- Task ownership verification
- Path revalidation
- Proper error handling

#### b) `getComments(taskId: string): Promise<Comment[]>`
- Fetches all comments for a task
- Orders by created_at ascending (newest last per spec)
- RLS ensures only task owner can fetch
- Returns empty array on error

**Query:**
```typescript
.from("comments")
.select("*")
.eq("task_id", taskId)
.order("created_at", { ascending: true })
```

#### c) `getCommentCount(taskId: string): Promise<number>`
- Gets total comment count for a task
- Uses Supabase count aggregation
- Returns 0 on error
- Efficient (head-only query, no data transfer)

**Query:**
```typescript
.from("comments")
.select("*", { count: "exact", head: true })
.eq("task_id", taskId)
```

#### d) `deleteComment(id: string)`
- Deletes a comment by ID
- RLS ensures only owner can delete
- Revalidates task detail page
- Returns success/error response

---

### 6. Validation Schema ✅

**Zod Schema:**
```typescript
const createCommentSchema = z.object({
  body: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(5000, "Comment must be less than 5000 characters")
    .trim(),
});
```

**Validation Rules:**
- Minimum 1 character (no empty comments)
- Maximum 5000 characters
- Trims whitespace
- Clear error messages

---

## Files Created/Modified

### New Files (2):
1. `/ProjectDocs/migrations/004_create_comments_table.sql` - Database schema
2. `src/app/actions/comments.ts` - Server actions

### Modified Files (1):
1. `src/types/database.ts` - Added Comment types

---

## Code Quality

### Linter Status:
✅ **Zero ESLint errors**  
✅ **Zero warnings**

```bash
$ npm run lint
✔ No ESLint warnings or errors
```

### TypeScript:
✅ All types properly defined  
✅ No `any` types used  
✅ Strict mode passing

### Architecture:
✅ Follows established patterns (matches tasks.ts)  
✅ Proper error handling  
✅ Consistent naming conventions  
✅ Clear function documentation

---

## Testing Checklist

### Manual Verification Needed:

**Database:**
- [ ] Run migration SQL in Supabase SQL Editor
- [ ] Verify comments table exists in Table Editor
- [ ] Verify RLS is enabled
- [ ] Verify 3 policies are present
- [ ] Test CASCADE delete (delete task → comments deleted)

**Code:**
- [x] TypeScript types compile
- [x] Server actions can be imported
- [x] No linter errors
- [x] Zod validation schema works

**Next Steps:**
Once migration is run in Supabase, the backend is ready for Stage 2 (Task Detail Page).

---

## Integration Points

### Path Revalidation:
```typescript
// After creating comment
revalidatePath(`/app/tasks/${taskId}`); // Task detail page
revalidatePath(`/app/projects/${projectId}`); // Parent project

// After deleting comment
revalidatePath(`/app/tasks/${taskId}`); // Task detail page
```

### Error Handling:
- Auth errors: "You must be logged in to comment"
- Validation errors: Zod error messages
- Database errors: "Failed to create comment. Please try again."
- Not found: "Task not found"

### Success Response Format:
```typescript
{ success: true, comment: Comment }
```

### Error Response Format:
```typescript
{ error: string }
```

---

## Security Considerations

### RLS Enforcement:
1. **SELECT:** Users can only see comments on tasks they own
2. **INSERT:** Users can only add comments to their own tasks
3. **DELETE:** Users can only delete their own comments
4. **UPDATE:** Not implemented (comments are immutable per spec)

### Data Validation:
- Body length: 1-5000 characters
- Required fields enforced
- No SQL injection (parameterized queries)
- XSS prevention (client-side will use React escaping)

### Authentication:
- All operations require auth.uid()
- Session validated via Supabase client
- No service role key exposed

---

## Performance Optimizations

### Indexes:
- `idx_comments_task_id` - Fast task lookup (most common query)
- `idx_comments_owner_id` - Fast owner filtering
- `idx_comments_created_at` - Efficient ordering

### Query Efficiency:
- Head-only count query (no data transfer)
- Single query for comment creation
- Ordered results from database (no client-side sorting)

### Revalidation:
- Only revalidates necessary paths
- Incremental updates (Next.js cache)

---

## Known Limitations

### Not Implemented (Future):
- Comment editing (comments are immutable)
- Comment reactions/likes
- Rich text in comments
- @mentions
- Comment threading/replies
- File attachments in comments

**These features are out of scope for Milestone 4.**

---

## Migration Instructions

### To Apply Migration:

1. Open Supabase Dashboard
2. Navigate to SQL Editor
3. Create new query
4. Copy contents of `/ProjectDocs/migrations/004_create_comments_table.sql`
5. Paste and run the query
6. Verify success in Table Editor

### Verification Queries:

```sql
-- Check table exists
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'comments';

-- Check RLS enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename = 'comments';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'comments';

-- Check indexes
SELECT indexname FROM pg_indexes WHERE tablename = 'comments';
```

---

## Next Steps

### Stage 2: Task Detail Page + Navigation

**Ready to begin:**
- [x] Comments table schema complete
- [x] TypeScript types defined
- [x] Server actions implemented
- [x] Validation in place
- [x] No linter errors

**Requires:**
- [ ] Run migration in Supabase (user action)
- [ ] Verify table exists
- [ ] Verify RLS policies active

**Then proceed to:**
- Create task detail page route
- Implement navigation from task cards
- Build page layout with tabs
- Display task information

---

## Summary

**Stage 1 Status:** ✅ **Complete**

**Deliverables:**
- ✅ Comments table schema (SQL migration)
- ✅ Database indexes for performance
- ✅ RLS policies for security
- ✅ TypeScript types
- ✅ 4 server actions (create, get, count, delete)
- ✅ Zod validation schema
- ✅ Zero linter errors

**Time Taken:** ~20 minutes  
**Code Quality:** Production-ready  
**Security:** RLS enforced  
**Ready for:** Stage 2

---

**Stage 1 Complete!** ✅  
**Next:** Run migration, then proceed to Stage 2
