-- Create quick_memos table for storing quick input items
CREATE TABLE quick_memos (
    id UUID PRIMARY KEY,
    content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for sorting by creation date
CREATE INDEX idx_quick_memos_created_at ON quick_memos(created_at DESC);

-- Add comment for documentation
COMMENT ON TABLE quick_memos IS 'Quick memos captured via quick input feature - stored in Inbox';
COMMENT ON COLUMN quick_memos.content IS 'The text content of the quick memo (max 1000 chars)';
