export const AUTH_ERRORS = {
  USER_EXISTS: 'user_already_exists',
  PROFILE_REQUIRED: 'Profile setup required',
  AUTH_REQUIRED: 'Authentication required',
} as const;

export const DEFAULT_REDIRECT_PATH = '/';
export const AUTH_CALLBACK_PATH = '/auth/callback';