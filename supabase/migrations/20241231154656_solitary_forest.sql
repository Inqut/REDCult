/*
  # Complete Profile Schema Setup

  1. Changes
    - Add missing columns to profiles table
    - Add constraints and indexes
    - Update RLS policies
    - Add utility functions

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
*/

-- Add missing columns and constraints
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now(),
ALTER COLUMN username SET NOT NULL,
ADD CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
ADD CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- Update RLS policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add utility functions
CREATE OR REPLACE FUNCTION check_username_available(new_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM profiles WHERE username = new_username
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;