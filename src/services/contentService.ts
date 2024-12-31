import { supabase } from '../lib/supabase';
import { ContentType, ContentItem, ContentUploadResponse } from '../types/content';

export const uploadContent = async (
  cultId: string,
  file: File,
  type: ContentType,
  metadata: Record<string, any> = {}
): Promise<ContentUploadResponse> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${type}_${Date.now()}.${fileExt}`;
  const filePath = `cults/${cultId}/${type}s/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('content')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('content')
    .getPublicUrl(filePath);

  return {
    url: publicUrl,
    metadata: {
      ...metadata,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    },
  };
};

export const createContentItem = async (
  cultId: string,
  type: ContentType,
  data: Partial<ContentItem>
): Promise<ContentItem> => {
  const { error, data: content } = await supabase
    .from('cult_content')
    .insert([{
      cult_id: cultId,
      type,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return content;
};