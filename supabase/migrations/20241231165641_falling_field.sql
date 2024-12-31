/*
  # Content Management System

  1. New Tables
    - `cult_content`
      - `id` (uuid, primary key)
      - `cult_id` (uuid, references cults)
      - `type` (text, content type)
      - `title` (text)
      - `description` (text)
      - `url` (text)
      - `content` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `cult_content` table
    - Add policies for content management
*/

-- Create content table
CREATE TABLE IF NOT EXISTS cult_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cult_id UUID REFERENCES cults(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('text', 'image', 'video', 'link', 'document')),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    content TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE cult_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Content is viewable by everyone"
    ON cult_content FOR SELECT
    USING (true);

CREATE POLICY "Cult members can create content"
    ON cult_content FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cult_roles
            WHERE cult_id = cult_content.cult_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Content creators can update their content"
    ON cult_content FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM cult_roles
            WHERE cult_id = cult_content.cult_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin', 'moderator')
        )
    );

CREATE POLICY "Content creators can delete their content"
    ON cult_content FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM cult_roles
            WHERE cult_id = cult_content.cult_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin', 'moderator')
        )
    );

-- Create indexes
CREATE INDEX idx_cult_content_cult_id ON cult_content(cult_id);
CREATE INDEX idx_cult_content_type ON cult_content(type);
CREATE INDEX idx_cult_content_created_at ON cult_content(created_at);