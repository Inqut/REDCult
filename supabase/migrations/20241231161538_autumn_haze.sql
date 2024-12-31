/*
  # Fix Cult Roles Policies

  1. Changes
    - Remove and recreate cult roles policies
    - Add proper role-based access control
    - Fix policy definitions to avoid NEW/OLD references
    
  2. Security
    - Maintain RLS with proper access controls
    - Use subqueries for permission checks
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Cult roles are viewable by everyone" ON cult_roles;
DROP POLICY IF EXISTS "Cult owners can manage roles" ON cult_roles;

-- Create new, safer policies for cult_roles
CREATE POLICY "Anyone can view cult roles"
    ON cult_roles FOR SELECT
    USING (true);

CREATE POLICY "Owners can insert roles"
    ON cult_roles FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cult_roles
            WHERE cult_id = cult_roles.cult_id
            AND user_id = auth.uid()
            AND role = 'owner'
        )
    );

CREATE POLICY "Owners can update roles"
    ON cult_roles FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cult_roles
            WHERE cult_id = cult_roles.cult_id
            AND user_id = auth.uid()
            AND role = 'owner'
        )
    );

CREATE POLICY "Owners can delete roles"
    ON cult_roles FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM cult_roles
            WHERE cult_id = cult_roles.cult_id
            AND user_id = auth.uid()
            AND role = 'owner'
        )
    );