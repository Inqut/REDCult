export interface AuthUser {
  id: string;
  email: string;
  role?: string;
  username?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: any | null;
  error?: Error;
}