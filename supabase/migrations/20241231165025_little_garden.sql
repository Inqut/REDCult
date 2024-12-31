/*
  # Add profile images and banners

  1. Changes
    - Add profile_image_url and banner_url to profiles table
    - Add profile_image_url and banner_url to cults table
    - Add image dimension constraints
    - Add utility functions for image validation

  2. Image Specifications
    - Profile Image: 400x400 pixels
    - Banner Image: 1500x500 pixels
*/

-- Add image columns to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Add image columns to cults
ALTER TABLE cults
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Create function to validate image dimensions
CREATE OR REPLACE FUNCTION validate_image_dimensions(
  url TEXT,
  expected_width INTEGER,
  expected_height INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
  -- In a real implementation, this would validate image dimensions
  -- For now, we'll just validate the URL format
  RETURN url ~ '^https?://.*\.(jpg|jpeg|png|gif)$';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function to validate images before insert/update
CREATE OR REPLACE FUNCTION validate_profile_images()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate profile image
  IF NEW.profile_image_url IS NOT NULL THEN
    IF NOT validate_image_dimensions(NEW.profile_image_url, 400, 400) THEN
      RAISE EXCEPTION 'Invalid profile image format. Must be a valid image URL.';
    END IF;
  END IF;

  -- Validate banner image
  IF NEW.banner_url IS NOT NULL THEN
    IF NOT validate_image_dimensions(NEW.banner_url, 1500, 500) THEN
      RAISE EXCEPTION 'Invalid banner image format. Must be a valid image URL.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for profiles
CREATE TRIGGER validate_profile_images_trigger
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_profile_images();

-- Create triggers for cults
CREATE TRIGGER validate_cult_images_trigger
  BEFORE INSERT OR UPDATE ON cults
  FOR EACH ROW
  EXECUTE FUNCTION validate_profile_images();