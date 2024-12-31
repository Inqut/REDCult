import { useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface ChatMessage {
  role: 'user' | 'agent';
  content: string;
}

const EDGE_FUNCTION_URL = 'https://lnjrbciznlkxbdclbkne.supabase.co/functions/v1';

export const useElizaAgent = (cultId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    // Cancel any existing request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content }]);

    try {
      // Get auth session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Start with empty agent message
      setMessages(prev => [...prev, { role: 'agent', content: '' }]);
      
      // Call Edge Function
      const response = await fetch(`${EDGE_FUNCTION_URL}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cultId,
          message: content,
        }),
        signal: abortController.current.signal,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error: ${error}`);
      }

      const { response: agentResponse } = await response.json();
      
      // Update agent message with response
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'agent', content: agentResponse }
      ]);
    } catch (err) {
      if (err.name === 'AbortError') return;
      
      console.error('Chat error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate response';
      setError(errorMessage);
      
      setMessages(prev => [
        ...prev,
        { 
          role: 'agent', 
          content: 'I apologize, but I encountered an error while processing your message.' 
        }
      ]);
    } finally {
      setLoading(false);
      abortController.current = null;
    }
  }, [loading, cultId]);

  return {
    messages,
    sendMessage,
    loading,
    error,
  };
};