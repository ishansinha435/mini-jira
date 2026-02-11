/**
 * Database type definitions
 * Matches Supabase schema for type safety
 */

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
  task_count?: number; // Optional: populated when fetching with aggregation
}

export interface ProjectInsert {
  name: string;
  owner_id?: string; // Optional - will be set by RLS policy
}

export interface ProjectUpdate {
  name?: string;
}

// Task types
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
  owner_id?: string; // Optional - will be set by RLS policy
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

// Comment types
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
