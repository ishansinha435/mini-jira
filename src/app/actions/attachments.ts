"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Attachment } from "@/types/database";
import { logAttachmentUploaded } from "./activity";

// Allowed file types
const ALLOWED_MIME_TYPES = [
  // Images
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  // Documents
  "application/pdf",
  // Archives
  "application/zip",
  "application/x-zip-compressed",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

/**
 * Upload a file attachment to a task
 * Uploads to Supabase Storage and creates DB record
 */
export async function uploadAttachment(taskId: string, formData: FormData) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be logged in to upload attachments" };
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

    // Get file from FormData
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file provided" };
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        error: `File type not allowed. Allowed types: images (PNG, JPG, GIF, WebP), PDF, ZIP`,
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        error: `File too large. Maximum size is 50MB`,
      };
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/\.([^.]+)$/, ""); // Remove extension
    const uniqueFilename = `${sanitizedName}_${timestamp}.${fileExt}`;

    // Storage path: {owner_id}/{task_id}/{filename}
    const storagePath = `${user.id}/${taskId}/${uniqueFilename}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: "Failed to upload file. Please try again." };
    }

    // Create DB record
    const { data: attachment, error: dbError } = await supabase
      .from("attachments")
      .insert({
        task_id: taskId,
        owner_id: user.id,
        path: storagePath,
        filename: file.name,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      // Try to clean up uploaded file
      await supabase.storage.from("attachments").remove([storagePath]);
      return { error: "Failed to save attachment record" };
    }

    // Revalidate task detail page
    revalidatePath(`/app/tasks/${taskId}`);

    // Get task title for activity log
    const { data: taskData } = await supabase
      .from("tasks")
      .select("title, project_id")
      .eq("id", taskId)
      .single();

    // Log activity (non-blocking)
    if (taskData) {
      logAttachmentUploaded(taskId, taskData.project_id, taskData.title, file.name).catch(console.error);
    }

    return { success: true, attachment: attachment as Attachment };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Get all attachments for a task
 * RLS ensures user owns the task
 */
export async function getAttachments(taskId: string): Promise<Attachment[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("attachments")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get attachments error:", error);
      return [];
    }

    return data as Attachment[];
  } catch (error) {
    console.error("Unexpected error fetching attachments:", error);
    return [];
  }
}

/**
 * Get attachment count for a task
 * RLS ensures user owns the task
 */
export async function getAttachmentCount(taskId: string): Promise<number> {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .from("attachments")
      .select("*", { count: "exact", head: true })
      .eq("task_id", taskId);

    if (error) {
      console.error("Get attachment count error:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Unexpected error:", error);
    return 0;
  }
}

/**
 * Get a signed URL for downloading an attachment
 * URL is valid for 1 hour
 */
export async function getAttachmentUrl(path: string): Promise<string | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from("attachments")
      .createSignedUrl(path, 3600); // 1 hour expiry

    if (error) {
      console.error("Get URL error:", error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
}

/**
 * Delete an attachment
 * Removes from both Storage and database
 * RLS ensures user owns the attachment
 */
export async function deleteAttachment(id: string) {
  try {
    const supabase = await createClient();

    // Get attachment details first
    const { data: attachment, error: fetchError } = await supabase
      .from("attachments")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !attachment) {
      return { error: "Attachment not found" };
    }

    // Delete from Storage
    const { error: storageError } = await supabase.storage
      .from("attachments")
      .remove([attachment.path]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
      // Continue with DB deletion even if storage fails
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from("attachments")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("DB delete error:", dbError);
      return { error: "Failed to delete attachment" };
    }

    // Revalidate task detail page
    revalidatePath(`/app/tasks/${attachment.task_id}`);

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

