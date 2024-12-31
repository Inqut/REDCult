/*
  # Cleanup Authentication Data
  
  1. Changes
    - Remove existing auth data
    - Reset profiles table
*/

-- Clean up existing data
TRUNCATE auth.users CASCADE;
TRUNCATE profiles CASCADE;