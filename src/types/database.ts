/**
 * Database type definitions
 * Matches Supabase schema for type safety
 */

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
}

export interface ProjectInsert {
  name: string;
  owner_id?: string; // Optional - will be set by RLS policy
}

export interface ProjectUpdate {
  name?: string;
}
