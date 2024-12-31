/*
  # Add role column to profiles table

  1. Changes
    - Add role column to profiles table
    - Add role enum type for better type safety
    - Set default role to 'user'
*/

-- Create role enum type
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Add role column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'user';

-- Create index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);