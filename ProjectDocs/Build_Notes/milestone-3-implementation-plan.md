# Milestone 3 Implementation Plan — Tasks CRUD

**Objective:** Enable users to create, view, and manage tasks within projects with status/priority updates

**Approach:** Incremental, 5-stage implementation

---

## Overview

**Total Stages:** 5  
**Estimated Complexity:** Medium-High  
**Dependencies:** Milestone 2 (Projects) must be complete

---

## Stage 1: Database Schema + RLS Setup

**Goal:** Create tasks table in Supabase with proper RLS policies

### Tasks:
1. **Create tasks table via Supabase SQL Editor**
   ```sql
   CREATE TABLE tasks (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
     owner_id UUID REFERENCES auth.users(id) NOT NULL,
     title TEXT NOT NULL CHECK (char_length(title) > 0),
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

2. **Create indexes for performance**
   ```sql
   CREATE INDEX idx_tasks_project_id ON tasks(project_id);
   CREATE INDEX idx_tasks_owner_id ON tasks(owner_id);
   CREATE INDEX idx_tasks_status ON tasks(status);
   ```

3. **Enable RLS on tasks table**
   ```sql
   ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
   ```

4. **Create RLS policies**
   ```sql
   -- SELECT: Users can view tasks in their projects
   CREATE POLICY "Users can view tasks in their projects"
     ON tasks FOR SELECT
     USING (
       owner_id = auth.uid() AND
       EXISTS (
         SELECT 1 FROM projects
         WHERE projects.id = tasks.project_id
         AND projects.owner_id = auth.uid()
       )
     );

   -- INSERT: Users can create tasks in their projects
   CREATE POLICY "Users can create tasks in their projects"
     ON tasks FOR INSERT
     WITH CHECK (
       owner_id = auth.uid() AND
       EXISTS (
         SELECT 1 FROM projects
         WHERE projects.id = tasks.project_id
         AND projects.owner_id = auth.uid()
       )
     );

   -- UPDATE: Users can update their own tasks
   CREATE POLICY "Users can update their own tasks"
     ON tasks FOR UPDATE
     USING (owner_id = auth.uid());

   -- DELETE: Users can delete their own tasks
   CREATE POLICY "Users can delete their own tasks"
     ON tasks FOR DELETE
     USING (owner_id = auth.uid());
   ```

5. **Verify setup in Supabase dashboard**

### Testing Checkpoints:
- [ ] Table visible in Supabase Table Editor
- [ ] RLS enabled
- [ ] 4 policies present
- [ ] Foreign keys enforced (CASCADE on project delete)
- [ ] Check constraints on status and priority work

### Success Criteria:
✅ Tasks table with correct schema  
✅ RLS enabled with 4 policies  
✅ Indexes created for performance  
✅ Ready for application integration

---

## Stage 2: TypeScript Types + Server Actions

**Goal:** Create type definitions and server actions for task CRUD operations

### Tasks:
1. **Update TypeScript types**
   - File: `src/types/database.ts` (update)
   - Add Task type, TaskStatus enum, TaskPriority type

2. **Create task server actions**
   - File: `src/app/actions/tasks.ts` (new)
   - Implement:
     - `createTask(projectId, data)`
     - `getTasks(projectId)` - fetch all tasks for project
     - `getTaskById(id)`
     - `updateTaskStatus(id, status)`
     - `updateTaskPriority(id, priority)`
     - `updateTask(id, data)` - full update
     - `deleteTask(id)` - optional

3. **Add Zod validation schemas**
   - Task creation schema
   - Task update schema
   - Status enum validation
   - Priority range validation

4. **Update project card task count**
   - Modify `getProjects()` to include task count
   - Use SQL COUNT or Supabase aggregation

### Files Created/Modified:
- **MODIFIED:** `src/types/database.ts`
- **NEW:** `src/app/actions/tasks.ts`
- **MODIFIED:** `src/app/actions/projects.ts` (add task count)

### Code Structure:
```typescript
// src/types/database.ts
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 1 | 2 | 3;

export interface Task {
  id: string;
  project_id: string;
  owner_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

// src/app/actions/tasks.ts
"use server";
import { createClient } from "@/lib/supabase/server";

export async function createTask(projectId: string, data: TaskCreate) {
  // Validation, insert, return
}

export async function getTasks(projectId: string) {
  // Fetch tasks for project, ordered by created_at or status
}
```

### Testing Checkpoints:
- [ ] Types compile without errors
- [ ] Server actions can be imported
- [ ] Validation schemas work
- [ ] No linter errors

### Success Criteria:
✅ Task types defined  
✅ All CRUD server actions implemented  
✅ Validation in place  
✅ Task count integration with projects

---

## Stage 3: Create Task UI (Modal + Form)

**Goal:** Build UI for creating new tasks within a project

### Tasks:
1. **Create NewTaskDialog component**
   - File: `src/components/tasks/new-task-dialog.tsx` (new)
   - Form fields: title, description, status, priority, due date
   - React Hook Form + Zod validation
   - Integrate with `createTask` server action

2. **Add "+ New Task" button to project page**
   - Modify: `src/app/app/projects/[id]/page.tsx`
   - Place button prominently
   - Open dialog on click

3. **Add shadcn components if needed**
   - Textarea (for description)
   - Select (for status/priority)
   - Date picker (for due date) - if not already available

### Files Created/Modified:
- **NEW:** `src/components/tasks/new-task-dialog.tsx`
- **MODIFIED:** `src/app/app/projects/[id]/page.tsx`
- **NEW:** `src/components/ui/textarea.tsx` (via shadcn)
- **NEW:** `src/components/ui/select.tsx` (via shadcn)

### Form Features:
- Title input (required, 1-200 chars)
- Description textarea (optional)
- Status select (todo/in_progress/done, default: todo)
- Priority select (1-3, default: 2)
- Due date picker (optional)
- Submit button with loading state
- Cancel button
- Toast notifications

### Testing Checkpoints:
- [ ] Dialog opens from project page
- [ ] Form validation works
- [ ] Task created in database
- [ ] Success toast shown
- [ ] Dialog closes and task appears in list (next stage)

### Success Criteria:
✅ Can create task via UI  
✅ All fields save correctly  
✅ Validation prevents bad data  
✅ Loading states work

---

## Stage 4: Display Tasks List + Empty State

**Goal:** Show all tasks for a project with proper formatting and empty state

### Tasks:
1. **Create TaskCard/TaskRow component**
   - File: `src/components/tasks/task-card.tsx` (new)
   - Display: title, status badge, priority indicator, due date
   - Hover states
   - Click to expand (optional for Milestone 3)

2. **Create TaskList component**
   - File: `src/components/tasks/task-list.tsx` (new)
   - Fetch tasks via `getTasks(projectId)`
   - Map over tasks to render TaskCard
   - Empty state when no tasks

3. **Update project detail page**
   - File: `src/app/app/projects/[id]/page.tsx` (modify)
   - Replace placeholder with actual TaskList
   - Fetch tasks server-side
   - Pass tasks to TaskList

4. **Create status badge component**
   - File: `src/components/tasks/status-badge.tsx` (new)
   - Visual badges for todo/in_progress/done
   - Color-coded: gray, blue, green

5. **Create priority indicator component**
   - File: `src/components/tasks/priority-badge.tsx` (new)
   - Icons or badges for low/medium/high
   - Visual hierarchy

### Files Created/Modified:
- **NEW:** `src/components/tasks/task-card.tsx`
- **NEW:** `src/components/tasks/task-list.tsx`
- **NEW:** `src/components/tasks/status-badge.tsx`
- **NEW:** `src/components/tasks/priority-badge.tsx`
- **MODIFIED:** `src/app/app/projects/[id]/page.tsx`

### Layout Options:
- **Table:** For desktop, clean and organized
- **Cards:** For mobile, more flexible
- **Hybrid:** Table on desktop, cards on mobile

### Empty State:
```
┌─────────────────────────────┐
│    [Checklist Icon]         │
│    No tasks yet             │
│  Create your first task...  │
│   [+ New Task Button]       │
└─────────────────────────────┘
```

### Testing Checkpoints:
- [ ] Tasks display correctly
- [ ] Status badges color-coded
- [ ] Priority indicators clear
- [ ] Due dates formatted
- [ ] Empty state for projects with no tasks
- [ ] Responsive layout

### Success Criteria:
✅ All project tasks visible  
✅ Proper visual hierarchy  
✅ Empty state implemented  
✅ Responsive design

---

## Stage 5: Inline Status/Priority Updates + Filters

**Goal:** Enable quick task updates and basic filtering

### Tasks:
1. **Make status badges clickable (inline update)**
   - File: `src/components/tasks/status-badge.tsx` (modify)
   - Convert to dropdown or button
   - On change, call `updateTaskStatus()`
   - Optimistic UI update

2. **Make priority indicators clickable (inline update)**
   - File: `src/components/tasks/priority-badge.tsx` (modify)
   - Dropdown to change priority
   - On change, call `updateTaskPriority()`
   - Optimistic UI update

3. **Add basic filters**
   - File: `src/components/tasks/task-filters.tsx` (new)
   - Filter by status (All, Todo, In Progress, Done)
   - Filter by priority (optional)
   - Use shadcn Tabs or Button group

4. **Implement filter logic**
   - Client-side filtering (since tasks already fetched)
   - Update TaskList to accept filter state
   - Filter tasks array before mapping

5. **Update task count on project cards**
   - Verify task count is real-time
   - Dashboard project cards show correct count

### Files Created/Modified:
- **MODIFIED:** `src/components/tasks/status-badge.tsx`
- **MODIFIED:** `src/components/tasks/priority-badge.tsx`
- **NEW:** `src/components/tasks/task-filters.tsx`
- **MODIFIED:** `src/components/tasks/task-list.tsx`

### Inline Update UX:
```
[Todo ▼] → Click → Dropdown
  ○ Todo
  ○ In Progress
  ○ Done
→ Select "In Progress" → Badge updates → DB updates
```

### Filter UI:
```
[ All ] [ Todo ] [ In Progress ] [ Done ]
   ▲ active
```

### Testing Checkpoints:
- [ ] Click status badge → dropdown appears
- [ ] Change status → updates immediately
- [ ] Badge color changes
- [ ] Database reflects change
- [ ] Filters work correctly
- [ ] "All" shows all tasks
- [ ] Status filters show subset

### Success Criteria:
✅ Status updates work inline  
✅ Priority updates work inline  
✅ Basic filters implemented  
✅ Optimistic UI for better UX  
✅ Real task count on dashboard

---

## Post-Implementation: Testing & Verification

### Manual Testing Checklist:
Refer to: `milestone-3-test-cases.md` and quick checklist

**Critical tests:**
1. Create task in project
2. Task appears in list
3. Update status inline
4. Update priority inline
5. Filter by status
6. Empty state for new projects
7. RLS test: User A cannot see User B's tasks

### Before Moving to Milestone 4:
- [ ] Run all High priority test cases (18 tests)
- [ ] Verify RLS with 2 test users
- [ ] Check mobile responsiveness
- [ ] Review linter errors (should be 0)
- [ ] Verify task counts are accurate
- [ ] Commit to Git

---

## Summary

| Stage | Description | Complexity | Files Changed |
|-------|-------------|------------|---------------|
| 1 | Database Schema + RLS | Low | 0 (Supabase only) |
| 2 | Types + Server Actions | Medium | 3 (1 new, 2 mod) |
| 3 | Create Task UI | Medium | 4 (3 new, 1 mod) |
| 4 | Display Tasks List | Medium | 5 (4 new, 1 mod) |
| 5 | Inline Updates + Filters | Medium-High | 4 (1 new, 3 mod) |

**Total Estimated Time:** 3-4 hours

**Key Integrations:**
- Tasks belong to projects (foreign key)
- Task count updates project cards
- RLS ensures data isolation
- Inline updates for smooth UX

---

## Features NOT in Milestone 3

These are deferred to later milestones:

**Milestone 4:** (will add)
- Task detail page
- Comments on tasks
- Task assignments (if multi-user)

**Milestone 5:** (will add)
- File attachments
- Supabase Storage integration

**Optional/Future:**
- Drag-and-drop status updates
- Bulk operations
- Advanced sorting (by due date, priority)
- Task search

---

## Ready to Begin?

**Next Step:** Start with Stage 1 (Database Schema + RLS Setup)

Would you like to proceed with Stage 1?
