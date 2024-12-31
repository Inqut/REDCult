export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProfileFormData {
  username: string;
  fullName: string;
  bio: string;
  avatarUrl?: string;
}