-- Migration: Create comments table for Milestone 4
-- Description: Enable comments on tasks with RLS policies
-- Date: February 11, 2026

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  body TEXT NOT NULL CHECK (char_length(body) > 0 AND char_length(body) <= 5000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_comments_owner_id ON comments(owner_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view comments on tasks they own
CREATE POLICY "Users can view comments on their tasks"
  ON comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = comments.task_id
      AND tasks.owner_id = auth.uid()
    )
  );

-- RLS Policy: Users can add comments to their tasks
CREATE POLICY "Users can add comments to their tasks"
  ON comments FOR INSERT
  WITH CHECK (
    owner_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = comments.task_id
      AND tasks.owner_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (owner_id = auth.uid());

-- Verification queries (optional - run to verify setup)
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'comments';
-- SELECT * FROM pg_policies WHERE tablename = 'comments';
