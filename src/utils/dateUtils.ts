import { formatDistanceToNow as formatDistance } from 'date-fns';

export const formatDistanceToNow = (date: Date | string) => {
  return formatDistance(new Date(date), { addSuffix: true });
};

export const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleString();
};