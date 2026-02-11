"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { Comment } from "@/types/database";
import { logCommentAdded } from "./activity";

// Validation schema for comment creation
const createCommentSchema = z.object({
  body: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(5000, "Comment must be less than 5000 characters")
    .trim(),
});

/**
 * Create a new comment on a task
 * RLS ensures user owns the task
 */
export async function createComment(taskId: string, body: string) {
  try {
    // Validate input
    const validated = createCommentSchema.parse({ body });

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be logged in to comment" };
    }

    // Verify task exists and user owns it
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("id, project_id")
      .eq("id", taskId)
      .single();

    if (taskError || !task) {
      return { error: "Task not found" };
    }

    // Insert comment (RLS ensures task ownership)
    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        task_id: taskId,
        owner_id: user.id,
        body: validated.body,
      })
      .select()
      .single();

    if (error) {
      console.error("Create comment error:", error);
      return { error: "Failed to create comment. Please try again." };
    }

    // Revalidate task detail page and project page
    revalidatePath(`/app/tasks/${taskId}`);
    revalidatePath(`/app/projects/${task.project_id}`);

    // Get task title for activity log
    const { data: taskData } = await supabase
      .from("tasks")
      .select("title")
      .eq("id", taskId)
      .single();

    // Log activity (non-blocking)
    if (taskData) {
      logCommentAdded(taskId, task.project_id, taskData.title).catch(console.error);
    }

    return { success: true, comment: comment as Comment };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Get all comments for a task
 * RLS ensures user owns the task
 */
export async function getComments(taskId: string): Promise<Comment[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: true }); // Newest last per spec

    if (error) {
      console.error("Get comments error:", error);
      return [];
    }

    return data as Comment[];
  } catch (error) {
    console.error("Unexpected error fetching comments:", error);
    return [];
  }
}

/**
 * Get comment count for a task
 * RLS ensures user owns the task
 */
export async function getCommentCount(taskId: string): Promise<number> {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("task_id", taskId);

    if (error) {
      console.error("Get comment count error:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Unexpected error:", error);
    return 0;
  }
}

/**
 * Delete a comment
 * RLS ensures user owns the comment
 */
export async function deleteComment(id: string) {
  try {
    const supabase = await createClient();

    // Get comment first to know which task to revalidate
    const { data: comment } = await supabase
      .from("comments")
      .select("task_id")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) {
      console.error("Delete comment error:", error);
      return { error: "Failed to delete comment" };
    }

    // Revalidate task detail page
    if (comment) {
      revalidatePath(`/app/tasks/${comment.task_id}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}
