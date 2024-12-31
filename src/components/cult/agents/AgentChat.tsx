import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { LlamaService } from '../../../services/llama/llamaService';

interface AgentChatProps {
  agent: {
    name: string;
    config: any;
  };
}

export const AgentChat = ({ agent }: AgentChatProps) => {
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'agent';
    content: string;
  }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await LlamaService.generateResponse(agent.config, userMessage);
      setMessages(prev => [...prev, { role: 'agent', content: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        { 
          role: 'agent', 
          content: 'I apologize, but I encountered an error while processing your message.' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-crimson-darker rounded-lg">
      <div className="p-4 border-b border-crimson">
        <h3 className="text-lg font-semibold">Chat with {agent.name}</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-crimson text-white'
                  : 'bg-crimson-dark text-crimson-light'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-crimson-dark text-crimson-light p-3 rounded-lg">
              <Loader className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-crimson">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-crimson-darkest border border-crimson p-2 rounded-lg focus:outline-none focus:border-crimson-light"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-crimson text-white p-2 rounded-lg hover:bg-crimson-light transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};