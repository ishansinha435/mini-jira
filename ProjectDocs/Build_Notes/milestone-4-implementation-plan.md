# Milestone 4 Implementation Plan — Task Detail + Comments

**Objective:** Create task detail page with full task information and comments functionality

**Approach:** Incremental, 3-stage implementation

---

## Overview

**Total Stages:** 3  
**Estimated Complexity:** Medium  
**Dependencies:** Milestone 3 (Tasks CRUD) must be complete

---

## Stage 1: Database Schema + Types + Server Actions

**Goal:** Create comments table with RLS, add TypeScript types, and implement server actions

### Tasks:

1. **Create comments table via Supabase SQL Editor**
   ```sql
   CREATE TABLE comments (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
     owner_id UUID REFERENCES auth.users(id) NOT NULL,
     body TEXT NOT NULL CHECK (char_length(body) > 0 AND char_length(body) <= 5000),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Create index for performance**
   ```sql
   CREATE INDEX idx_comments_task_id ON comments(task_id);
   CREATE INDEX idx_comments_owner_id ON comments(owner_id);
   ```

3. **Enable RLS on comments table**
   ```sql
   ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
   ```

4. **Create RLS policies**
   ```sql
   -- SELECT: Users can view comments on tasks they own
   CREATE POLICY "Users can view comments on their tasks"
     ON comments FOR SELECT
     USING (
       EXISTS (
         SELECT 1 FROM tasks
         WHERE tasks.id = comments.task_id
         AND tasks.owner_id = auth.uid()
       )
     );

   -- INSERT: Users can add comments to their tasks
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

   -- DELETE: Users can delete their own comments
   CREATE POLICY "Users can delete their own comments"
     ON comments FOR DELETE
     USING (owner_id = auth.uid());
   ```

5. **Update TypeScript types**
   - File: `src/types/database.ts` (update)
   - Add Comment interface and CommentInsert type

6. **Create comment server actions**
   - File: `src/app/actions/comments.ts` (new)
   - Implement:
     - `createComment(taskId, body)` - Add comment to task
     - `getComments(taskId)` - Fetch all comments for task
     - `getCommentCount(taskId)` - Get comment count
     - `deleteComment(id)` - Optional: delete comment

7. **Add Zod validation schemas**
   - Comment creation schema (body: 1-5000 chars)
   - Validation for required fields

### Files Created/Modified:
- **MODIFIED:** `src/types/database.ts`
- **NEW:** `src/app/actions/comments.ts`

### Code Structure:
```typescript
// src/types/database.ts
export interface Comment {
  id: string;
  task_id: string;
  owner_id: string;
  body: string;
  created_at: string;
}

export interface CommentInsert {
  task_id: string;
  owner_id?: string; // Set by RLS
  body: string;
}

// src/app/actions/comments.ts
"use server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const createCommentSchema = z.object({
  body: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(5000, "Comment must be less than 5000 characters")
    .trim(),
});

export async function createComment(taskId: string, body: string) {
  // Validation, auth check, insert, return
}

export async function getComments(taskId: string) {
  // Fetch comments for task, ordered by created_at
}
```

### Testing Checkpoints:
- [ ] Comments table visible in Supabase Table Editor
- [ ] RLS enabled with 3 policies
- [ ] Indexes created
- [ ] Types compile without errors
- [ ] Server actions can be imported
- [ ] No linter errors

### Success Criteria:
✅ Comments table with correct schema  
✅ RLS policies enforce security  
✅ TypeScript types defined  
✅ Server actions implemented  
✅ Validation in place

---

## Stage 2: Task Detail Page + Navigation

**Goal:** Create task detail page route and display full task information

### Tasks:

1. **Create task detail page**
   - File: `src/app/app/tasks/[id]/page.tsx` (new)
   - Fetch task by ID using `getTaskById(id)`
   - Display all task fields
   - Handle not found case

2. **Create task detail layout**
   - Two-column layout (desktop) → single column (mobile)
   - Left: Task information
   - Right: Tabs for Comments/Attachments

3. **Add task information section**
   - Task title (large, prominent)
   - Task description
   - Status dropdown (editable)
   - Priority dropdown (editable)
   - Due date display
   - Project name (as link back to project)
   - Created/updated timestamps

4. **Add back navigation**
   - "← Back to [Project Name]" link
   - Navigate to parent project page

5. **Make task cards clickable**
   - File: `src/components/tasks/task-card.tsx` (modify)
   - Wrap card in Link to `/app/tasks/[id]`
   - OR add onClick handler

6. **Create loading and not-found pages**
   - File: `src/app/app/tasks/[id]/loading.tsx` (new)
   - File: `src/app/app/tasks/[id]/not-found.tsx` (new)

7. **Add tabs component**
   - Use shadcn Tabs component
   - Two tabs: "Comments (X)" and "Attachments (0)"
   - Comments tab active by default

### Files Created/Modified:
- **NEW:** `src/app/app/tasks/[id]/page.tsx`
- **NEW:** `src/app/app/tasks/[id]/loading.tsx`
- **NEW:** `src/app/app/tasks/[id]/not-found.tsx`
- **MODIFIED:** `src/components/tasks/task-card.tsx`

### Layout Structure:
```
┌─────────────────────────────────────────┐
│ ← Back to [Project Name]               │
│                                         │
│ ┌───────────────┬─────────────────────┐│
│ │               │  [Comments] [Attach]││
│ │  Task Title   │                     ││
│ │  Description  │  Comment textarea   ││
│ │               │  [+ Comment]        ││
│ │  STATUS: ▼    │                     ││
│ │  PRIORITY: ▼  │  Comment list...    ││
│ │  DUE: ...     │                     ││
│ │  PROJECT: →   │                     ││
│ └───────────────┴─────────────────────┘│
└─────────────────────────────────────────┘
```

### Testing Checkpoints:
- [ ] Navigate to `/app/tasks/[id]` displays page
- [ ] Task data loads correctly
- [ ] Back navigation works
- [ ] Not found page for invalid IDs
- [ ] Loading state shows briefly
- [ ] Task cards are now clickable
- [ ] Tabs render (Comments/Attachments)
- [ ] Responsive layout works

### Success Criteria:
✅ Task detail page accessible  
✅ All task fields display correctly  
✅ Navigation from task card works  
✅ Back navigation to project works  
✅ Loading/error states handled  
✅ Tabs component ready for content

---

## Stage 3: Comments Feature Implementation

**Goal:** Implement comment composer, display comments list, and integrate with task detail page

### Tasks:

1. **Create comment composer component**
   - File: `src/components/tasks/comment-composer.tsx` (new)
   - Textarea for comment body
   - Character count indicator (optional)
   - Submit button with loading state
   - Clear textarea after submit
   - Toast notification on success/error

2. **Create comment list component**
   - File: `src/components/tasks/comment-list.tsx` (new)
   - Display comments in order (newest last per spec)
   - Show comment body, author, timestamp
   - Empty state: "No comments yet. Be the first to comment."

3. **Create individual comment card**
   - File: `src/components/tasks/comment-card.tsx` (new)
   - Display comment body
   - Show timestamp (relative or absolute)
   - Show user email/name
   - Optional: delete button (if time permits)

4. **Integrate comments into task detail page**
   - File: `src/app/app/tasks/[id]/page.tsx` (modify)
   - Fetch comments using `getComments(taskId)`
   - Pass comments to CommentList
   - Place CommentComposer at top of Comments tab
   - Update comment count in tab header

5. **Add optimistic UI for comments** (optional)
   - Update CommentComposer to show comment immediately
   - Use router.refresh() after server action

6. **Add attachments tab placeholder**
   - Empty state: "Attachments coming in Milestone 5"
   - Keep tab visible but disabled/empty

### Files Created/Modified:
- **NEW:** `src/components/tasks/comment-composer.tsx`
- **NEW:** `src/components/tasks/comment-list.tsx`
- **NEW:** `src/components/tasks/comment-card.tsx`
- **MODIFIED:** `src/app/app/tasks/[id]/page.tsx`

### Comment Composer UI:
```
┌─────────────────────────────────────┐
│ Write a comment...                  │
│                                     │
│ [Textarea - 3 rows]                 │
│                                     │
│              [+ Comment] (button)   │
└─────────────────────────────────────┘
```

### Comment List UI:
```
┌─────────────────────────────────────┐
│ 👤 john.doe@example.com             │
│    This looks good! Let's proceed.  │
│    2 hours ago                      │
├─────────────────────────────────────┤
│ 👤 john.doe@example.com             │
│    Updated the status to done.      │
│    Just now                         │
└─────────────────────────────────────┘
```

### Testing Checkpoints:
- [ ] Comment composer visible in Comments tab
- [ ] Can submit comment
- [ ] Comment appears in list immediately
- [ ] Comment saved to database
- [ ] Comment count updates in tab header
- [ ] Empty state shows when no comments
- [ ] Timestamps display correctly
- [ ] Validation prevents empty comments
- [ ] Multiple comments display in correct order
- [ ] Attachments tab shows placeholder

### Success Criteria:
✅ Can add comments to tasks  
✅ Comments display in correct order  
✅ Comment count accurate  
✅ Empty states handled  
✅ Validation works  
✅ Toast notifications functional  
✅ Optimistic UI implemented (optional)

---

## Post-Implementation: Testing & Verification

### Manual Testing Checklist:
Refer to: `milestone-4-test-cases.md`

**Critical tests:**
1. Navigate from task card to detail page
2. Task detail displays all fields
3. Add comment successfully
4. Comment appears in list
5. Back navigation works
6. Update task status/priority from detail page
7. RLS test: User A cannot see User B's task/comments

### Before Moving to Milestone 5:
- [ ] Run all High priority test cases (18 tests)
- [ ] Verify RLS with 2 test users
- [ ] Check mobile responsiveness
- [ ] Review linter errors (should be 0)
- [ ] Verify comment counts are accurate
- [ ] Test back navigation thoroughly
- [ ] Commit to Git

---

## Summary

| Stage | Description | Complexity | Files Changed |
|-------|-------------|------------|---------------|
| 1 | Database + Types + Actions | Medium | 2 (1 new, 1 mod) |
| 2 | Task Detail Page + Nav | Medium | 4 (3 new, 1 mod) |
| 3 | Comments Feature | Medium | 4 (3 new, 1 mod) |

**Total Estimated Time:** 2-3 hours

**Key Features:**
- Task detail page with full information
- Comments on tasks
- RLS ensures data isolation
- Responsive two-column layout
- Tabs for future attachments

---

## Features NOT in Milestone 4

These are deferred to later milestones:

**Milestone 5:** (will add)
- File attachments
- Supabase Storage integration
- Attachment list in Attachments tab

**Optional/Future:**
- Edit/delete comments
- Comment reactions
- Rich text editor for comments
- @mentions in comments
- Comment threading/replies

---

## Integration Notes

### Revalidation Paths:
After creating a comment:
```typescript
revalidatePath(`/app/tasks/${taskId}`); // Task detail page
revalidatePath(`/app/projects/${projectId}`); // Parent project (optional)
```

### Navigation Flow:
```
Dashboard → Project Page → Task Card (click) → Task Detail Page
                              ↑                        ↓
                              └────── Back Button ─────┘
```

### Server Actions Used:
- From `tasks.ts`: `getTaskById()`, `updateTask()`, `updateTaskStatus()`, `updateTaskPriority()`
- From `comments.ts`: `createComment()`, `getComments()`, `getCommentCount()`
- From `projects.ts`: `getProjectById()` (for back navigation)

---

## Ready to Begin?

**Next Step:** Start with Stage 1 (Database Schema + Types + Server Actions)

All prerequisites met ✅  
Milestone 3 complete ✅  
Ready to proceed!
