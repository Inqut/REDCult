export type ContentType = 'text' | 'image' | 'video' | 'link' | 'document';

export interface ContentItem {
  id: string;
  cultId: string;
  type: ContentType;
  title: string;
  description?: string;
  url?: string;
  content?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ContentUploadResponse {
  url: string;
  metadata: Record<string, any>;
}