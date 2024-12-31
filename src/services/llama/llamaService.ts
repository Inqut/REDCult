import { AgentConfig } from '../../types/agent';
import { supabase } from '../../lib/supabase';

const EDGE_FUNCTION_URL = 'https://lnjrbciznlkxbdclbkne.supabase.co/functions/v1';

export class LlamaService {
  private static async callEdgeFunction(
    functionName: string,
    body: any,
    options: { stream?: boolean } = {}
  ) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    return fetch(`${EDGE_FUNCTION_URL}/${functionName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  static async generateResponse(config: AgentConfig, message: string): Promise<string> {
    try {
      const response = await this.callEdgeFunction('chat', {
        cultId: config.cultId,
        agentId: config.id,
        message,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API error: ${error}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Chat error:', error);
      throw new Error('Failed to generate response');
    }
  }

  static async streamResponse(
    config: AgentConfig,
    message: string,
    onToken: (token: string) => void
  ): Promise<void> {
    try {
      const response = await this.callEdgeFunction('stream-chat', {
        cultId: config.cultId,
        agentId: config.id,
        message,
      }, { stream: true });

      if (!response.ok) throw new Error('Stream request failed');
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.error) throw new Error(data.error);
            if (data.token) onToken(data.token);
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
      throw error;
    }
  }
}