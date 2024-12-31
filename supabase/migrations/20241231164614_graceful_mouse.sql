-- Add visibility column to cults table
ALTER TABLE cults
ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public'
CHECK (visibility IN ('public', 'private', 'unlisted'));

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_cults_visibility ON cults(visibility);

-- Update RLS policies for public visibility
DROP POLICY IF EXISTS "Cults are viewable by everyone" ON cults;

CREATE POLICY "Public cults are viewable by everyone"
  ON cults FOR SELECT
  USING (
    visibility = 'public' OR
    auth.uid() IN (
      SELECT user_id FROM cult_roles WHERE cult_id = cults.id
    ) OR
    creator_id = auth.uid()
  );

-- Function to get member count
CREATE OR REPLACE FUNCTION get_cult_member_count(cult_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM cult_roles
  WHERE cult_id = $1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to check if user is cult member
CREATE OR REPLACE FUNCTION is_cult_member(cult_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM cult_roles
    WHERE cult_id = $1 AND user_id = $2
  );
$$ LANGUAGE sql SECURITY DEFINER;