/*
  # Ritual System Implementation

  1. New Tables
    - `rituals`: Stores ritual definitions and requirements
    - `ritual_participants`: Tracks user participation in rituals
    - `ritual_rewards`: Defines rewards for completing rituals

  2. Security
    - Enable RLS on all tables
    - Add policies for ritual creation and participation
*/

-- Create ritual types enum
CREATE TYPE ritual_type AS ENUM ('daily', 'weekly', 'special');
CREATE TYPE ritual_status AS ENUM ('active', 'completed', 'failed');

-- Create rituals table
CREATE TABLE IF NOT EXISTS rituals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cult_id UUID REFERENCES cults(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type ritual_type NOT NULL,
    requirements JSONB NOT NULL,
    rewards JSONB NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    min_participants INTEGER DEFAULT 1,
    max_participants INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create ritual participants table
CREATE TABLE IF NOT EXISTS ritual_participants (
    ritual_id UUID REFERENCES rituals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status ritual_status DEFAULT 'active',
    progress JSONB DEFAULT '{}',
    joined_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    PRIMARY KEY (ritual_id, user_id)
);

-- Enable RLS
ALTER TABLE rituals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ritual_participants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Rituals are viewable by everyone"
    ON rituals FOR SELECT
    USING (true);

CREATE POLICY "Cult admins can manage rituals"
    ON rituals FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM cult_roles
            WHERE cult_id = rituals.cult_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Participants can view their ritual progress"
    ON ritual_participants FOR SELECT
    USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM cult_roles
            WHERE cult_id = (SELECT cult_id FROM rituals WHERE id = ritual_participants.ritual_id)
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin', 'moderator')
        )
    );

CREATE POLICY "Users can join rituals"
    ON ritual_participants FOR INSERT
    TO authenticated
    WITH CHECK (
        -- Check if ritual is still open
        EXISTS (
            SELECT 1 FROM rituals r
            WHERE r.id = ritual_id
            AND r.start_time <= now()
            AND r.end_time > now()
            AND (r.max_participants IS NULL OR (
                SELECT COUNT(*) FROM ritual_participants rp
                WHERE rp.ritual_id = r.id
            ) < r.max_participants)
        )
    );

-- Create indexes
CREATE INDEX idx_rituals_cult_id ON rituals(cult_id);
CREATE INDEX idx_rituals_type ON rituals(type);
CREATE INDEX idx_rituals_start_time ON rituals(start_time);
CREATE INDEX idx_rituals_end_time ON rituals(end_time);
CREATE INDEX idx_ritual_participants_ritual_id ON ritual_participants(ritual_id);
CREATE INDEX idx_ritual_participants_user_id ON ritual_participants(user_id);
CREATE INDEX idx_ritual_participants_status ON ritual_participants(status);

-- Create function to update ritual progress
CREATE OR REPLACE FUNCTION update_ritual_progress(
    ritual_id UUID,
    user_id UUID,
    progress_update JSONB
) RETURNS void AS $$
BEGIN
    UPDATE ritual_participants
    SET 
        progress = progress || progress_update,
        status = CASE 
            WHEN progress_update->>'completed' = 'true' THEN 'completed'::ritual_status
            ELSE status
        END,
        completed_at = CASE 
            WHEN progress_update->>'completed' = 'true' THEN now()
            ELSE completed_at
        END
    WHERE ritual_id = $1 AND user_id = $2;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;