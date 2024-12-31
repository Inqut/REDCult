/*
  # AI Agent Integration

  1. New Tables
    - `cult_agents`
      - `id` (uuid, primary key)
      - `cult_id` (uuid, references cults)
      - `name` (text)
      - `description` (text)
      - `model` (text)
      - `config` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for agent management
*/

CREATE TABLE IF NOT EXISTS cult_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cult_id UUID REFERENCES cults(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    model TEXT NOT NULL,
    config JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE cult_agents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Agents are viewable by everyone"
    ON cult_agents FOR SELECT
    USING (true);

CREATE POLICY "Cult admins can manage agents"
    ON cult_agents FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM cult_roles
            WHERE cult_id = cult_agents.cult_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

-- Create indexes
CREATE INDEX idx_cult_agents_cult_id ON cult_agents(cult_id);