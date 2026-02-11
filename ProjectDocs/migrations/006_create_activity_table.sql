-- Migration: Create activity table for Milestone 7
-- Description: Track user activity across projects and tasks
-- Date: February 11, 2026

-- Create activity table
CREATE TABLE activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('task_created', 'task_updated', 'task_completed', 'comment_added', 'attachment_uploaded', 'project_created')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_activity_owner_id ON activity(owner_id);
CREATE INDEX idx_activity_created_at ON activity(created_at DESC);
CREATE INDEX idx_activity_project_id ON activity(project_id);
CREATE INDEX idx_activity_type ON activity(type);

-- Enable Row Level Security
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own activity
CREATE POLICY "Users can view their own activity"
  ON activity FOR SELECT
  USING (auth.uid() = owner_id);

-- RLS Policy: Users can create their own activity
CREATE POLICY "Users can create their own activity"
  ON activity FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Verification queries (optional - run to verify setup)
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'activity';
-- SELECT * FROM pg_policies WHERE tablename = 'activity';
