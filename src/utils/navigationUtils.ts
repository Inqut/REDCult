import { NavigateFunction } from 'react-router-dom';

export const navigateWithReturn = (
  navigate: NavigateFunction,
  to: string,
  returnTo?: string
) => {
  navigate(to, { state: { returnTo: returnTo || window.location.pathname } });
};

export const getReturnPath = (state: any, defaultPath: string = '/'): string => {
  return state?.returnTo || defaultPath;
};

export const isProtectedRoute = (path: string): boolean => {
  const publicPaths = ['/', '/auth', '/auth/callback', '/explore'];
  return !publicPaths.includes(path);
};