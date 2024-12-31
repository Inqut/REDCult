/*
  # Update profile policies and functions

  1. Changes
    - Update profile policies for better security
    - Add function for username availability check

  2. Security
    - Enable RLS policies for profiles
    - Add policies for authenticated users
*/

-- Update profile policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admin users have full access" ON profiles;

-- Create new policies
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

-- Add function to check username availability
CREATE OR REPLACE FUNCTION check_username_available(new_username TEXT)
RETURNS BOOLEAN AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM profiles WHERE username = new_username
  );
$$ LANGUAGE sql SECURITY DEFINER;