-- Add deleted_at column for soft delete functionality
ALTER TABLE quick_memos ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Create index for soft deleted queries
CREATE INDEX idx_quick_memos_deleted_at ON quick_memos(deleted_at) WHERE deleted_at IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN quick_memos.deleted_at IS 'Timestamp for soft delete - null means not deleted, set value means deleted (archived)';
