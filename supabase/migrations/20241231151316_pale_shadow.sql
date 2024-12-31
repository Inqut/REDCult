/*
  # Fix profile policies recursion

  1. Changes
    - Remove recursive admin check
    - Simplify policies for profile creation and management
    - Add initial admin bypass policy
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admin users can manage all profiles" ON profiles;

-- Create new policies
CREATE POLICY "Enable read access for all users"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authentication users only"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Special policy to allow initial admin creation
CREATE POLICY "Allow admin creation"
  ON profiles FOR ALL
  USING (
    CASE 
      WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin') THEN true
      ELSE auth.uid() = id
    END
  );