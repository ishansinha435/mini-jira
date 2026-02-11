# Milestone 3 - Stage 1: Database Schema + RLS Setup - COMPLETE ✅

**Date:** February 11, 2026  
**Stage:** 1 of 5  
**Status:** ✅ Completed

---

## Summary

Successfully created the `tasks` table in Supabase with comprehensive RLS policies, foreign key constraints, check constraints, and performance indexes.

---

## What Was Created

### 1. Tasks Table
**Location:** Supabase Database (public schema)

**Schema:**
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL CHECK (char_length(title) > 0 AND char_length(title) <= 500),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' 
    CHECK (status IN ('todo', 'in_progress', 'done')),
  priority INTEGER NOT NULL DEFAULT 2 
    CHECK (priority BETWEEN 1 AND 3),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Columns:**
- `id` (UUID): Primary key, auto-generated
- `project_id` (UUID): Foreign key to projects, CASCADE delete
- `owner_id` (UUID): Foreign key to auth.users
- `title` (TEXT): Required, 1-500 characters
- `description` (TEXT): Optional, for detailed task info
- `status` (TEXT): Required, default 'todo', must be ('todo', 'in_progress', 'done')
- `priority` (INTEGER): Required, default 2, must be between 1-3
- `due_date` (DATE): Optional due date
- `created_at` (TIMESTAMPTZ): Auto-set creation timestamp
- `updated_at` (TIMESTAMPTZ): Auto-set update timestamp

**Constraints:**
- Primary key on `id`
- Foreign key: `project_id` → `projects(id)` with CASCADE delete
- Foreign key: `owner_id` → `auth.users(id)`
- Check: title length > 0 and <= 500
- Check: status in ('todo', 'in_progress', 'done')
- Check: priority between 1 and 3
- Default: status = 'todo'
- Default: priority = 2

---

### 2. Performance Indexes

**Created 4 indexes for optimized queries:**

```sql
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_owner_id ON tasks(owner_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
```

**Purpose:**
- `idx_tasks_project_id`: Fast lookup of all tasks in a project
- `idx_tasks_owner_id`: Fast lookup of all tasks by owner
- `idx_tasks_status`: Fast filtering by status (todo/in_progress/done)
- `idx_tasks_priority`: Fast filtering/sorting by priority

---

### 3. Row Level Security (RLS)

**Status:** ✅ ENABLED

**Policies Created (4):**

#### Policy 1: SELECT (View Tasks)
- **Name:** "Users can view tasks in their projects"
- **Command:** SELECT
- **Rule:** 
  ```sql
  owner_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = tasks.project_id
    AND projects.owner_id = auth.uid()
  )
  ```
- **Effect:** Users can only query tasks in projects they own

#### Policy 2: INSERT (Create Tasks)
- **Name:** "Users can create tasks in their projects"
- **Command:** INSERT
- **Check:** 
  ```sql
  owner_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = tasks.project_id
    AND projects.owner_id = auth.uid()
  )
  ```
- **Effect:** Users can only create tasks in their own projects

#### Policy 3: UPDATE (Modify Tasks)
- **Name:** "Users can update their own tasks"
- **Command:** UPDATE
- **Rule:** `owner_id = auth.uid()`
- **Effect:** Users can only update their own tasks

#### Policy 4: DELETE (Remove Tasks)
- **Name:** "Users can delete their own tasks"
- **Command:** DELETE
- **Rule:** `owner_id = auth.uid()`
- **Effect:** Users can only delete their own tasks

---

### 4. Migration Recorded

**Migration Name:** `create_tasks_table_with_rls`  
**Version:** `20260211123137`  
**Status:** ✅ Applied successfully

**All Migrations:**
1. `create_projects_table_with_rls` (Milestone 2)
2. `create_tasks_table_with_rls` (Milestone 3) ← New

---

## Verification Results

### ✅ Table Created
- Table name: `tasks`
- Schema: `public`
- Rows: 0 (empty, ready for data)
- All columns present with correct types

### ✅ RLS Enabled
- RLS status: **ENABLED** on `tasks` table
- All public access blocked by default
- Only policy-allowed access permitted

### ✅ Policies Active
All 4 policies confirmed active:
1. ✅ SELECT policy (view tasks in own projects)
2. ✅ INSERT policy (create tasks in own projects)
3. ✅ UPDATE policy (update own tasks)
4. ✅ DELETE policy (delete own tasks)

### ✅ Foreign Key Constraints
**project_id → projects.id:**
- Constraint name: `tasks_project_id_fkey`
- Source: `public.tasks.project_id`
- Target: `public.projects.id`
- On Delete: **CASCADE** (deleting project deletes all tasks)

**owner_id → auth.users.id:**
- Constraint name: `tasks_owner_id_fkey`
- Source: `public.tasks.owner_id`
- Target: `auth.users.id`

### ✅ Check Constraints
1. **Title:** Must be between 1-500 characters
2. **Status:** Must be 'todo', 'in_progress', or 'done'
3. **Priority:** Must be 1, 2, or 3

### ✅ Indexes Created
- ✅ `idx_tasks_project_id`
- ✅ `idx_tasks_owner_id`
- ✅ `idx_tasks_status`
- ✅ `idx_tasks_priority`

---

## Security Validation

### Data Isolation (RLS Enforcement)

**Policy Logic:**
1. **SELECT/INSERT:** Checks both owner_id AND project ownership
   - Ensures user owns the task (`owner_id = auth.uid()`)
   - Ensures user owns the project (`projects.owner_id = auth.uid()`)
   - Double security layer

2. **UPDATE/DELETE:** Checks task ownership only
   - Simpler check since project ownership already verified on insert

**Expected Behavior:**
- ✅ User A can create tasks in their projects
- ✅ User A can view only their tasks
- ✅ User A can update only their tasks
- ✅ User A cannot see User B's tasks
- ✅ User A cannot modify User B's tasks
- ✅ User A cannot create tasks in User B's projects

---

## Cascade Delete Verification

**Scenario:** Delete a project that has tasks

**Expected Behavior:**
```sql
-- User has Project A with 5 tasks
-- User deletes Project A
-- CASCADE triggers
-- All 5 tasks automatically deleted
-- No orphaned tasks remain
```

**Benefit:**
- Automatic cleanup
- Data consistency maintained
- No manual task deletion needed

---

## What's Next

### Stage 2: TypeScript Types + Server Actions

**Tasks:**
1. Update `src/types/database.ts`:
   - Add `Task` interface
   - Add `TaskStatus` type
   - Add `TaskPriority` type
   - Add `TaskInsert` and `TaskUpdate` types

2. Create `src/app/actions/tasks.ts`:
   - `createTask(projectId, data)`
   - `getTasks(projectId)`
   - `getTaskById(id)`
   - `updateTaskStatus(id, status)`
   - `updateTaskPriority(id, priority)`
   - `updateTask(id, data)`
   - `deleteTask(id)` (optional)

3. Update `src/app/actions/projects.ts`:
   - Modify `getProjects()` to include task count
   - Use SQL aggregation or join

4. Add Zod validation schemas

**Files to create/modify:**
- MODIFIED: `src/types/database.ts`
- NEW: `src/app/actions/tasks.ts`
- MODIFIED: `src/app/actions/projects.ts`

---

## Stage 1 Checklist

- [x] Create tasks table via SQL migration
- [x] Add all required columns (10 columns)
- [x] Set default values (status: 'todo', priority: 2)
- [x] Add check constraint on title (1-500 chars)
- [x] Add check constraint on status (enum)
- [x] Add check constraint on priority (1-3)
- [x] Create foreign key to projects (CASCADE)
- [x] Create foreign key to auth.users
- [x] Create 4 performance indexes
- [x] Enable RLS on tasks table
- [x] Create SELECT policy
- [x] Create INSERT policy
- [x] Create UPDATE policy
- [x] CREATE DELETE policy
- [x] Verify table exists in Supabase
- [x] Verify RLS enabled
- [x] Verify all policies present
- [x] Verify foreign key constraints
- [x] Verify indexes created

**Status:** ✅ ALL TASKS COMPLETE

---

## Database Access for Development

You can now:
- Query tasks via Supabase SQL Editor
- Test RLS policies with authenticated users
- Begin Next.js integration in Stage 2

**Test Query (SQL Editor):**
```sql
-- View all tasks (will only show your own due to RLS)
SELECT 
  t.*,
  p.name as project_name
FROM tasks t
JOIN projects p ON t.project_id = p.id
ORDER BY t.created_at DESC;

-- Manually insert test task (replace UUIDs with actual values)
INSERT INTO tasks (project_id, owner_id, title, status, priority)
VALUES (
  'your-project-uuid',
  'your-user-uuid',
  'Test Task',
  'todo',
  2
);
```

---

## Notes

- Migration is reversible if needed
- RLS policies active immediately
- Cascade delete protects data integrity
- No application code changes yet (Stage 1 is database-only)
- Ready to proceed to Stage 2

---

## Technical Details

### Status Enum
- `'todo'`: Task not started (default)
- `'in_progress'`: Task being worked on
- `'done'`: Task completed

### Priority Scale
- `1`: Low priority
- `2`: Medium priority (default)
- `3`: High priority

### Timestamp Behavior
- `created_at`: Set once on insert, never changes
- `updated_at`: Can be updated via trigger (future enhancement) or manually

---

**Stage 1 Complete!** ✅  
**Ready for Stage 2:** TypeScript Types + Server Actions
