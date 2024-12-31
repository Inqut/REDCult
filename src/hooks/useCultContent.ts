import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ContentItem } from '../types/content';

export const useCultContent = (cultId: string) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('cult_content')
        .select('*')
        .eq('cult_id', cultId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setContent(data || []);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();

    // Subscribe to changes
    const subscription = supabase
      .channel('cult_content_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'cult_content',
          filter: `cult_id=eq.${cultId}` 
        }, 
        fetchContent
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [cultId]);

  return {
    content,
    loading,
    error,
    refresh: fetchContent,
  };
};