/*
  # Cult Management Updates
  
  1. Changes
    - Add function to check cult creation limits
    - Update cult creation policy to enforce limits
    - Add view for user cult counts
  
  2. Security
    - Enforce one cult limit for non-admin users
    - Maintain existing RLS policies
*/

-- Create a view to track cult counts per user
CREATE OR REPLACE VIEW user_cult_counts AS
SELECT 
  p.id as user_id,
  COUNT(cr.cult_id) FILTER (WHERE cr.role = 'owner') as owned_cults,
  COUNT(cr.cult_id) FILTER (WHERE cr.role != 'owner') as joined_cults
FROM profiles p
LEFT JOIN cult_roles cr ON p.id = cr.user_id
GROUP BY p.id;

-- Function to check if user can create more cults
CREATE OR REPLACE FUNCTION can_create_cult(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
  owned_count INTEGER;
BEGIN
  -- Check if user is admin
  SELECT (role = 'admin') INTO is_admin 
  FROM profiles 
  WHERE id = user_id;

  -- Admins can create unlimited cults
  IF is_admin THEN
    RETURN TRUE;
  END IF;

  -- Get count of owned cults
  SELECT owned_cults INTO owned_count
  FROM user_cult_counts
  WHERE user_id = user_id;

  -- Non-admins are limited to one cult
  RETURN COALESCE(owned_count, 0) < 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the cult creation policy
DROP POLICY IF EXISTS "Authenticated users can create cults" ON cults;
CREATE POLICY "Authenticated users can create cults"
  ON cults FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = creator_id AND
    can_create_cult(auth.uid())
  );