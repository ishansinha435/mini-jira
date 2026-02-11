"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { Task, TaskStatus, TaskPriority } from "@/types/database";

// Validation schema for task creation
const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(500, "Task title must be less than 500 characters")
    .trim(),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  priority: z.number().int().min(1).max(3).default(2),
  due_date: z.string().optional(), // ISO date string
});

// Validation schema for task updates
const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(500, "Task title must be less than 500 characters")
    .trim()
    .optional(),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  priority: z.number().int().min(1).max(3).optional(),
  due_date: z.string().nullable().optional(),
});

/**
 * Create a new task in a project
 * RLS ensures user owns the project
 */
export async function createTask(
  projectId: string,
  data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string;
  }
) {
  try {
    // Validate input
    const validated = createTaskSchema.parse(data);

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be logged in to create a task" };
    }

    // Insert task (RLS ensures project ownership)
    const { data: task, error } = await supabase
      .from("tasks")
      .insert({
        project_id: projectId,
        owner_id: user.id,
        title: validated.title,
        description: validated.description || null,
        status: validated.status,
        priority: validated.priority,
        due_date: validated.due_date || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Create task error:", error);
      return { error: "Failed to create task. Please try again." };
    }

    // Revalidate project page and dashboard
    revalidatePath(`/app/projects/${projectId}`);
    revalidatePath("/app");

    return { success: true, task: task as Task };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Get all tasks for a project
 * RLS ensures user owns the project
 */
export async function getTasks(projectId: string): Promise<Task[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get tasks error:", error);
      return [];
    }

    return data as Task[];
  } catch (error) {
    console.error("Unexpected error fetching tasks:", error);
    return [];
  }
}

/**
 * Get a single task by ID
 * RLS ensures user owns the task
 */
export async function getTaskById(id: string): Promise<Task | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Get task error:", error);
      return null;
    }

    return data as Task;
  } catch (error) {
    console.error("Unexpected error fetching task:", error);
    return null;
  }
}

/**
 * Update a task's status
 * RLS ensures user owns the task
 */
export async function updateTaskStatus(id: string, status: TaskStatus) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tasks")
      .update({ 
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update task status error:", error);
      return { error: "Failed to update task status" };
    }

    // Get task to revalidate its project page
    const task = data as Task;
    revalidatePath(`/app/projects/${task.project_id}`);
    revalidatePath("/app");

    return { success: true, task };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Update a task's priority
 * RLS ensures user owns the task
 */
export async function updateTaskPriority(id: string, priority: TaskPriority) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tasks")
      .update({ 
        priority,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update task priority error:", error);
      return { error: "Failed to update task priority" };
    }

    // Get task to revalidate its project page
    const task = data as Task;
    revalidatePath(`/app/projects/${task.project_id}`);

    return { success: true, task };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Update a task's details
 * RLS ensures user owns the task
 */
export async function updateTask(
  id: string,
  updates: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    due_date?: string | null;
  }
) {
  try {
    // Validate input
    const validated = updateTaskSchema.parse(updates);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tasks")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update task error:", error);
      return { error: "Failed to update task" };
    }

    // Get task to revalidate its project page
    const task = data as Task;
    revalidatePath(`/app/projects/${task.project_id}`);
    revalidatePath("/app");

    return { success: true, task };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Delete a task
 * RLS ensures user owns the task
 */
export async function deleteTask(id: string) {
  try {
    const supabase = await createClient();

    // Get task first to know which project to revalidate
    const { data: task } = await supabase
      .from("tasks")
      .select("project_id")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Delete task error:", error);
      return { error: "Failed to delete task" };
    }

    // Revalidate project page and dashboard
    if (task) {
      revalidatePath(`/app/projects/${task.project_id}`);
    }
    revalidatePath("/app");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Get task count for a project
 * RLS ensures user owns the project
 */
export async function getTaskCount(projectId: string): Promise<number> {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("project_id", projectId);

    if (error) {
      console.error("Get task count error:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Unexpected error:", error);
    return 0;
  }
}
