-- Migration: Create attachments table for Milestone 5
-- Description: Enable file attachments on tasks with Supabase Storage
-- Date: February 11, 2026

-- Create attachments table
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  path TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_attachments_task_id ON attachments(task_id);
CREATE INDEX idx_attachments_owner_id ON attachments(owner_id);
CREATE INDEX idx_attachments_created_at ON attachments(created_at);

-- Enable Row Level Security
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view attachments on tasks they own
CREATE POLICY "Users can view attachments on their tasks"
  ON attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = attachments.task_id
      AND tasks.owner_id = auth.uid()
    )
  );

-- RLS Policy: Users can upload attachments to their tasks
CREATE POLICY "Users can upload attachments to their tasks"
  ON attachments FOR INSERT
  WITH CHECK (
    owner_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = attachments.task_id
      AND tasks.owner_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete their own attachments
CREATE POLICY "Users can delete their own attachments"
  ON attachments FOR DELETE
  USING (owner_id = auth.uid());

-- Verification queries (optional - run to verify setup)
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'attachments';
-- SELECT * FROM pg_policies WHERE tablename = 'attachments';
