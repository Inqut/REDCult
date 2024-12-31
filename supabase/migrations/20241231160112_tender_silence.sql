/*
  # Update cults table and policies
  
  1. Changes
    - Add any missing columns or constraints to cults table
    - Update existing policies if needed
*/

-- Safely add or modify table
DO $$ 
BEGIN
    -- Create table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'cults') THEN
        CREATE TABLE cults (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            creator_id UUID REFERENCES profiles(id) NOT NULL,
            type TEXT CHECK (type IN ('agent', 'developer')) NOT NULL,
            name TEXT NOT NULL,
            bio TEXT,
            twitter_handle TEXT,
            avatar_url TEXT,
            hierarchy JSONB NOT NULL DEFAULT '{"agents": [], "developers": []}',
            stats JSONB NOT NULL DEFAULT '{"followers": 0, "engagement": 0, "reputation": 0}',
            created_at TIMESTAMPTZ DEFAULT now()
        );

        -- Enable RLS
        ALTER TABLE cults ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Authenticated users can create cults" ON cults;
    DROP POLICY IF EXISTS "Cult creators can update their cults" ON cults;

    -- Create or update policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'cults' 
        AND policyname = 'Authenticated users can create cults'
    ) THEN
        CREATE POLICY "Authenticated users can create cults"
            ON cults FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = creator_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'cults' 
        AND policyname = 'Cult creators can update their cults'
    ) THEN
        CREATE POLICY "Cult creators can update their cults"
            ON cults FOR UPDATE
            USING (auth.uid() = creator_id);
    END IF;
END $$;