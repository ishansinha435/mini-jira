"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { Project } from "@/types/database";

// Validation schema for project creation
const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters")
    .trim(),
});

/**
 * Create a new project
 * RLS policy automatically sets owner_id to auth.uid()
 */
export async function createProject(name: string) {
  try {
    // Validate input
    const validated = createProjectSchema.parse({ name });

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: "You must be logged in to create a project" };
    }

    // Insert project (RLS ensures owner_id = auth.uid())
    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: validated.name,
        owner_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Create project error:", error);
      return { error: "Failed to create project. Please try again." };
    }

    // Revalidate dashboard to show new project
    revalidatePath("/app");

    return { success: true, project: data as Project };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Get all projects for the current user
 * RLS policy automatically filters by auth.uid()
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get projects error:", error);
      return [];
    }

    return data as Project[];
  } catch (error) {
    console.error("Unexpected error fetching projects:", error);
    return [];
  }
}

/**
 * Get a single project by ID
 * RLS policy ensures user can only access their own projects
 */
export async function getProjectById(
  id: string
): Promise<Project | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Get project error:", error);
      return null;
    }

    return data as Project;
  } catch (error) {
    console.error("Unexpected error fetching project:", error);
    return null;
  }
}

/**
 * Update a project's name
 * RLS policy ensures user can only update their own projects
 */
export async function updateProject(id: string, name: string) {
  try {
    // Validate input
    const validated = createProjectSchema.parse({ name });

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("projects")
      .update({ name: validated.name })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update project error:", error);
      return { error: "Failed to update project. Please try again." };
    }

    // Revalidate relevant paths
    revalidatePath("/app");
    revalidatePath(`/app/projects/${id}`);

    return { success: true, project: data as Project };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Delete a project
 * RLS policy ensures user can only delete their own projects
 */
export async function deleteProject(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete project error:", error);
      return { error: "Failed to delete project. Please try again." };
    }

    // Revalidate dashboard
    revalidatePath("/app");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}
