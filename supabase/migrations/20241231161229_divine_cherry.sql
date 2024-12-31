/*
  # Cult Management Setup

  1. New Tables
    - `cult_roles` - Stores role assignments for cult members
    - `cult_invites` - Manages invitations to join cults
  
  2. Security
    - Enable RLS on new tables
    - Add policies for cult management
    - Add policies for role assignments
*/

-- Create cult roles table
CREATE TABLE IF NOT EXISTS cult_roles (
    cult_id UUID REFERENCES cults(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
    assigned_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (cult_id, user_id)
);

-- Create cult invites table
CREATE TABLE IF NOT EXISTS cult_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cult_id UUID REFERENCES cults(id) ON DELETE CASCADE,
    inviter_id UUID REFERENCES profiles(id),
    invitee_email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'member')),
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
    accepted_at TIMESTAMPTZ,
    UNIQUE (cult_id, invitee_email)
);

-- Enable RLS
ALTER TABLE cult_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cult_invites ENABLE ROW LEVEL SECURITY;

-- Policies for cult_roles
CREATE POLICY "Cult roles are viewable by everyone"
    ON cult_roles FOR SELECT
    USING (true);

CREATE POLICY "Cult owners can manage roles"
    ON cult_roles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM cult_roles cr
            WHERE cr.cult_id = cult_roles.cult_id
            AND cr.user_id = auth.uid()
            AND cr.role = 'owner'
        )
    );

-- Policies for cult_invites
CREATE POLICY "Cult invites are viewable by involved parties"
    ON cult_invites FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM cult_roles
            WHERE cult_id = cult_invites.cult_id
        ) OR
        auth.email() = invitee_email
    );

CREATE POLICY "Cult admins can create invites"
    ON cult_invites FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cult_roles
            WHERE cult_id = cult_invites.cult_id
            AND user_id = auth.uid()
            AND role IN ('owner', 'admin')
        )
    );

-- Function to automatically assign owner role when creating a cult
CREATE OR REPLACE FUNCTION assign_cult_owner()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO cult_roles (cult_id, user_id, role)
    VALUES (NEW.id, NEW.creator_id, 'owner');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to assign owner role
DROP TRIGGER IF EXISTS assign_cult_owner_trigger ON cults;
CREATE TRIGGER assign_cult_owner_trigger
    AFTER INSERT ON cults
    FOR EACH ROW
    EXECUTE FUNCTION assign_cult_owner();