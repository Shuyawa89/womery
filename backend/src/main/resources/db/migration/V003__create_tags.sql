-- Create tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create memo_tags junction table for many-to-many relationship
CREATE TABLE memo_tags (
    memo_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    PRIMARY KEY (memo_id, tag_id),
    CONSTRAINT fk_memo_tags_memo FOREIGN KEY (memo_id) REFERENCES quick_memos(id) ON DELETE CASCADE,
    CONSTRAINT fk_memo_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_memo_tags_memo_id ON memo_tags(memo_id);
CREATE INDEX idx_memo_tags_tag_id ON memo_tags(tag_id);

-- Add comments for documentation
COMMENT ON TABLE tags IS 'Tags for organizing quick memos';
COMMENT ON COLUMN tags.name IS 'Tag name (max 100 chars, unique)';
COMMENT ON TABLE memo_tags IS 'Junction table linking memos and tags (many-to-many)';
