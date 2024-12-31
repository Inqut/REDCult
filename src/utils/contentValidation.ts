import { ContentType } from '../types/content';

const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024, // 5MB
  video: 100 * 1024 * 1024, // 100MB
  document: 10 * 1024 * 1024, // 10MB
};

const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/webm'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

export const validateFile = (file: File, type: ContentType): string | null => {
  if (!file) return 'No file provided';

  if (type === 'text' || type === 'link') return null;

  const maxSize = MAX_FILE_SIZES[type as keyof typeof MAX_FILE_SIZES];
  const allowedTypes = ALLOWED_FILE_TYPES[type as keyof typeof ALLOWED_FILE_TYPES];

  if (file.size > maxSize) {
    return `File size must be less than ${maxSize / (1024 * 1024)}MB`;
  }

  if (!allowedTypes?.includes(file.type)) {
    return `Invalid file type. Allowed types: ${allowedTypes?.join(', ')}`;
  }

  return null;
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};