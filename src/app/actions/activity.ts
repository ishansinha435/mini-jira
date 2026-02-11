"use server";

import { createClient } from "@/lib/supabase/server";
import type { Activity, ActivityType, ActivityInsert } from "@/types/database";

/**
 * Create an activity log entry
 * Used internally by other actions to track user activity
 */
export async function createActivity(data: ActivityInsert) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      // Silent fail - activity logging shouldn't break main operations
      return { error: "Not authenticated" };
    }

    // Insert activity
    const { error } = await supabase.from("activity").insert({
      owner_id: user.id,
      project_id: data.project_id || null,
      task_id: data.task_id || null,
      type: data.type,
      metadata: data.metadata || null,
    });

    if (error) {
      console.error("Create activity error:", error);
      // Silent fail
      return { error: "Failed to log activity" };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Get recent activity for the current user
 * Returns the latest 10 activity items
 */
export async function getRecentActivity(limit: number = 10): Promise<Activity[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("activity")
      .select(`
        *,
        project:projects(id, name),
        task:tasks(id, title)
      `)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Get activity error:", error);
      return [];
    }

    return data as any[];
  } catch (error) {
    console.error("Unexpected error fetching activity:", error);
    return [];
  }
}

/**
 * Helper to log task creation
 */
export async function logTaskCreated(taskId: string, projectId: string, taskTitle: string) {
  return createActivity({
    type: "task_created",
    project_id: projectId,
    task_id: taskId,
    metadata: { task_title: taskTitle },
  });
}

/**
 * Helper to log task completion
 */
export async function logTaskCompleted(taskId: string, projectId: string, taskTitle: string) {
  return createActivity({
    type: "task_completed",
    project_id: projectId,
    task_id: taskId,
    metadata: { task_title: taskTitle },
  });
}

/**
 * Helper to log comment added
 */
export async function logCommentAdded(taskId: string, projectId: string, taskTitle: string) {
  return createActivity({
    type: "comment_added",
    project_id: projectId,
    task_id: taskId,
    metadata: { task_title: taskTitle },
  });
}

/**
 * Helper to log attachment uploaded
 */
export async function logAttachmentUploaded(
  taskId: string,
  projectId: string,
  taskTitle: string,
  filename: string
) {
  return createActivity({
    type: "attachment_uploaded",
    project_id: projectId,
    task_id: taskId,
    metadata: { task_title: taskTitle, filename },
  });
}

/**
 * Helper to log project created
 */
export async function logProjectCreated(projectId: string, projectName: string) {
  return createActivity({
    type: "project_created",
    project_id: projectId,
    metadata: { project_name: projectName },
  });
}
