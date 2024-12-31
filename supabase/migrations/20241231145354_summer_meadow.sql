/*
  # Initial Schema Setup

  1. Tables
    - `profiles`
      - User profiles with authentication data
    - `cults`
      - Cult organizations and their details
    - `memberships`
      - Relationships between users and cults
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create cults table
CREATE TABLE IF NOT EXISTS cults (
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

-- Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
  cult_id UUID REFERENCES cults(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('follower', 'moderator', 'leader')) NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (cult_id, profile_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cults ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Cults policies
CREATE POLICY "Cults are viewable by everyone"
  ON cults FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create cults"
  ON cults FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Cult creators can update their cults"
  ON cults FOR UPDATE
  USING (auth.uid() = creator_id);

-- Memberships policies
CREATE POLICY "Memberships are viewable by everyone"
  ON memberships FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can join cults"
  ON memberships FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);