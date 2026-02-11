# Milestone 3 - Stage 2: TypeScript Types + Server Actions - COMPLETE ✅

**Date:** February 11, 2026  
**Stage:** 2 of 5  
**Status:** ✅ Completed

---

## Summary

Created comprehensive TypeScript types and server actions for full task CRUD operations, with Zod validation and proper error handling. Integrated task count with project queries.

---

## Files Created/Modified

### 1. Updated Type Definitions (`src/types/database.ts`)

**Added Task Types:**
```typescript
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

export interface TaskInsert {
  project_id: string;
  owner_id?: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
}
```

**Updated Project Type:**
```typescript
export interface Project {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
  task_count?: number; // NEW: populated when fetching with aggregation
}
```

---

### 2. New Task Server Actions (`src/app/actions/tasks.ts`)

**8 functions implemented:**

#### `createTask(projectId, data)`
- **Purpose:** Create new task in a project
- **Validation:** Zod schema (1-500 chars title, optional description, status, priority, due_date)
- **RLS:** Verifies user owns project via RLS policy
- **Returns:** `{ success: true, task }` or `{ error: string }`
- **Side Effect:** Revalidates `/app/projects/[id]` and `/app`

#### `getTasks(projectId)`
- **Purpose:** Fetch all tasks for a project
- **RLS:** Only returns user's own tasks
- **Returns:** `Task[]` (empty array on error)
- **Ordering:** Newest first (created_at DESC)

#### `getTaskById(id)`
- **Purpose:** Fetch single task by ID
- **RLS:** Returns null if unauthorized
- **Returns:** `Task | null`
- **Use Case:** Task detail views

#### `updateTaskStatus(id, status)`
- **Purpose:** Update task status only
- **Validation:** Status must be valid TaskStatus
- **RLS:** Can only update own tasks
- **Returns:** `{ success: true, task }` or `{ error: string }`
- **Side Effect:** Updates `updated_at` timestamp, revalidates paths

#### `updateTaskPriority(id, priority)`
- **Purpose:** Update task priority only
- **Validation:** Priority must be 1, 2, or 3
- **RLS:** Can only update own tasks
- **Returns:** `{ success: true, task }` or `{ error: string }`
- **Side Effect:** Updates `updated_at` timestamp, revalidates path

#### `updateTask(id, updates)`
- **Purpose:** Update multiple task fields
- **Validation:** Zod schema for all updatable fields
- **RLS:** Can only update own tasks
- **Returns:** `{ success: true, task }` or `{ error: string }`
- **Side Effect:** Updates `updated_at`, revalidates paths

#### `deleteTask(id)`
- **Purpose:** Delete a task
- **RLS:** Can only delete own tasks
- **Returns:** `{ success: true }` or `{ error: string }`
- **Side Effect:** Revalidates project page and dashboard

#### `getTaskCount(projectId)`
- **Purpose:** Get task count for a project
- **RLS:** Only counts user's tasks
- **Returns:** `number`
- **Use Case:** Helper function for aggregations

---

### 3. Updated Project Actions (`src/app/actions/projects.ts`)

**Modified `getProjects()` function:**

**Before:**
```typescript
const { data } = await supabase
  .from("projects")
  .select("*")
  .order("created_at", { ascending: false });
```

**After:**
```typescript
const { data } = await supabase
  .from("projects")
  .select(`
    *,
    tasks:tasks(count)
  `)
  .order("created_at", { ascending: false });

// Transform data to include task_count
const projects = data.map((project: any) => ({
  ...project,
  task_count: project.tasks[0]?.count || 0,
}));
```

**Benefits:**
- Single query fetches projects + task counts
- No N+1 query problem
- Efficient aggregation at database level

---

### 4. Updated ProjectCard Component (`src/components/project-card.tsx`)

**Modified to use real task count:**

```typescript
export function ProjectCard({ project, taskCount }: ProjectCardProps) {
  // Use taskCount prop if provided, otherwise use project.task_count, fallback to 0
  const displayTaskCount = taskCount ?? project.task_count ?? 0;
  
  return (
    <Card>
      {/* ... */}
      <span>{displayTaskCount} tasks</span>
    </Card>
  );
}
```

**Benefits:**
- Displays real task count from database
- Supports override via taskCount prop
- Graceful fallback to 0

---

## Validation Schemas

### Create Task Schema
```typescript
const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(500, "Task title must be less than 500 characters")
    .trim(),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  priority: z.number().int().min(1).max(3).default(2),
  due_date: z.string().optional(),
});
```

**Rules Enforced:**
- ✅ Title: Required, 1-500 chars, trimmed
- ✅ Description: Optional
- ✅ Status: Must be valid enum, defaults to 'todo'
- ✅ Priority: Must be 1-3, defaults to 2
- ✅ Due date: Optional ISO date string

### Update Task Schema
```typescript
const updateTaskSchema = z.object({
  title: z.string().min(1).max(500).trim().optional(),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  priority: z.number().int().min(1).max(3).optional(),
  due_date: z.string().nullable().optional(),
});
```

**All fields optional for partial updates**

---

## Error Handling Strategy

### Three Layers:

1. **Validation Errors (Zod)**
   - Caught and returned as `{ error: string }`
   - Uses first error message for clarity
   - Examples:
     - "Task title is required"
     - "Task title must be less than 500 characters"

2. **Supabase Errors**
   - Logged to console for debugging
   - Generic user-facing message
   - Examples:
     - "Failed to create task. Please try again."
     - "Failed to update task status"

3. **Unexpected Errors**
   - Caught by try-catch
   - Logged to console
   - Generic error returned

---

## Security Features

### RLS Integration
All queries automatically filtered by RLS policies:
- `createTask`: Checks user owns project via EXISTS query
- `getTasks`: Only returns tasks from user's projects
- `updateTask*`: Only updates user's own tasks
- `deleteTask`: Only deletes user's own tasks

### Authentication Checks
- `createTask` explicitly verifies authenticated user
- Other functions rely on RLS enforcement
- Returns empty/null results if unauthorized

---

## Performance Optimizations

### Path Revalidation
- Task operations revalidate affected routes
- Project page: `/app/projects/[id]`
- Dashboard: `/app` (for task count updates)
- Minimizes unnecessary revalidations

### Query Efficiency
- `getProjects()`: Single query with aggregation
- Avoids N+1 problem (no separate count queries per project)
- Indexed columns ensure fast lookups

### Updated Timestamps
- `updated_at` automatically set on updates
- Useful for "last activity" sorting (future feature)

---

## Code Quality

### Linter Status
✅ **No linter errors**

### TypeScript
- ✅ Strong typing throughout
- ✅ No `any` types (except in transformation logic with proper casting)
- ✅ Proper return type annotations
- ✅ Type-safe status and priority

### Best Practices
- ✅ Server-side only (`"use server"`)
- ✅ Error logging for debugging
- ✅ Consistent error response format
- ✅ Proper async/await patterns

---

## Integration Points

### Task Count on Dashboard
```typescript
// Projects fetched with task counts
const projects = await getProjects();

// Each project has task_count property
projects.map(project => (
  <ProjectCard project={project} />
  // Displays: "5 tasks" based on real data
));
```

### Task Operations Flow
```typescript
// Create task
const result = await createTask(projectId, {
  title: "Implement feature",
  status: "todo",
  priority: 2
});

// Update status
await updateTaskStatus(taskId, "in_progress");

// Update priority
await updateTaskPriority(taskId, 3);

// Delete task
await deleteTask(taskId);
```

---

## Testing Readiness

### Ready for Integration
Server actions can now be:
- ✅ Imported in components
- ✅ Called from client components
- ✅ Used in Server Components for data fetching

### Example Usage (Preview)
```typescript
// In a client component:
import { createTask } from "@/app/actions/tasks";

const result = await createTask(projectId, {
  title: values.title,
  description: values.description,
  status: values.status,
  priority: values.priority,
});

if (result.error) {
  toast.error(result.error);
} else {
  toast.success("Task created!");
}

// In a Server Component:
import { getTasks } from "@/app/actions/tasks";

const tasks = await getTasks(projectId);
// Render task list
```

---

## What's Next

### Stage 3: Create Task UI (Modal + Form)

**Tasks:**
1. Install shadcn components (Textarea, Select)
2. Create `NewTaskDialog` component
3. Form fields: title, description, status, priority, due_date
4. Add "+ New Task" button to project page
5. Integrate with `createTask` server action
6. Loading states and toast notifications

**Files to create:**
- `src/components/tasks/new-task-dialog.tsx`
- `src/components/ui/textarea.tsx` (via shadcn)
- `src/components/ui/select.tsx` (via shadcn)

**Files to modify:**
- `src/app/app/projects/[id]/page.tsx`

---

## Stage 2 Checklist

- [x] Update `src/types/database.ts`
- [x] Add Task interface
- [x] Add TaskStatus type ('todo' | 'in_progress' | 'done')
- [x] Add TaskPriority type (1 | 2 | 3)
- [x] Add TaskInsert and TaskUpdate types
- [x] Add task_count to Project type
- [x] Create `src/app/actions/tasks.ts`
- [x] Implement createTask with validation
- [x] Implement getTasks
- [x] Implement getTaskById
- [x] Implement updateTaskStatus
- [x] Implement updateTaskPriority
- [x] Implement updateTask (full update)
- [x] Implement deleteTask
- [x] Implement getTaskCount helper
- [x] Add Zod validation schemas
- [x] Add proper error handling
- [x] Add path revalidation
- [x] Update getProjects() with task count
- [x] Update ProjectCard to use task_count
- [x] Verify no linter errors

**Status:** ✅ ALL TASKS COMPLETE

---

## Notes

- All 8 CRUD operations implemented and ready
- Type safety ensures compile-time error catching
- RLS security enforced automatically
- Task count integration makes dashboard dynamic
- Error handling provides good user experience
- Ready for UI integration in Stage 3

---

**Stage 2 Complete!** ✅  
**Ready for Stage 3:** Create Task UI (Modal + Form)
